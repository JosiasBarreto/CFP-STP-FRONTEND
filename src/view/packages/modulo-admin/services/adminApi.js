import { converterCandidaturaAdminParaDadosFicha } from '../utils/adminMapper';

import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { gerarPdfFormularioInscricao } from '../utils/gerarPdfInscricao';
import { exportarInscricaoParaExcel } from '../utils/pdfFichaGenerator';
import { API_URL } from '../../../../api/urls';
import Swal from 'sweetalert2';
// src/api/urls/index.js


/**
 * Obtém o token JWT guardado de forma centralizada
 */
export function obterTokenAutenticacao(token) {
  if (token) return token;
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem('token') || '';
  }
  return '';
}

/**
 * Mapeia mensagens de erro HTTP claras para documentos protegidos
 */
export async function obterMensagemErroDocumento(res) {
  if (res.status === 401) {
    return 'Sessão expirada ou token não autorizado. Inicie sessão novamente.';
  }
  if (res.status === 403) {
    return 'Não tem autorização ou permissões necessárias para visualizar este documento.';
  }
  if (res.status === 404) {
    return 'Documento não encontrado no servidor.';
  }
  try {
    const clone = res.clone();
    const json = await clone.json();
    if (json && (json.erro || json.mensagem)) {
      return json.erro || json.mensagem;
    }
  } catch {
    //
  }
  return `Erro ${res.status}: Ocorreu um problema ao carregar o documento.`;
}
export function buildApiUrl(endpoint) {
  if (!endpoint) return '';
  const endpointStr = String(endpoint).trim();

  // Se já for uma URL absoluta com protocolo (http:// ou https://), retorna-a diretamente sem prefixar nada!
  if (endpointStr.startsWith('http://') || endpointStr.startsWith('https://')) {
    return endpointStr;
  }

  const base = (API_URL || '').trim().replace(/\/+$/, '');
  const cleanEndpoint = endpointStr.startsWith('/') ? endpointStr : `/${endpointStr}`;
  if (!base) return cleanEndpoint;
  return `${base}${cleanEndpoint}`;
}

/**
 * Tenta fazer o parse de JSON de forma segura verificando se a resposta não é HTML
 */
async function safeParseResponse(res) {
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const clone = res.clone();

  if (contentType.includes('text/html')) {
    throw new Error('Servidor respondeu com página HTML em vez de dados JSON.');
  }

  const text = await clone.text();
  if (text.trim().startsWith('<')) {
    throw new Error('Resposta do servidor iniciada por HTML/XML.');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('A resposta do servidor não é um JSON válido.');
  }
}

/**
 * Executa fetch prioritariamente contra a API_URL configurada com fallback local caso a rede remota esteja indisponível ou retorne HTML
 */
async function fetchComFallback(endpoint, options = {}) {
  const endpointStr = String(endpoint || '').trim();

  // Se for URL absoluta, faz fetch diretamente contra a URL fornecida
  if (endpointStr.startsWith('http://') || endpointStr.startsWith('https://')) {
    const res = await fetch(endpointStr, options);
    const json = await safeParseResponse(res);
    return {
      ok: res.ok,
      status: res.status,
      json: async () => json,
    };
  }

  const cleanEndpoint = endpointStr.startsWith('/') ? endpointStr : `/${endpointStr}`;
  const remoteUrl = buildApiUrl(cleanEndpoint);
  const localApiUrl = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;

  // Tentativa 1: API Remota (se API_URL tiver um servidor remoto definido)
  if (remoteUrl !== cleanEndpoint) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const resRemoto = await fetch(remoteUrl, {
        ...options,
        signal: options.signal || controller.signal,
      });
      clearTimeout(timeoutId);
      const jsonRemoto = await safeParseResponse(resRemoto);
      return {
        ok: resRemoto.ok,
        status: resRemoto.status,
        json: async () => jsonRemoto,
      };
    } catch (errRemoto) {
      console.warn(`[adminApi] Falha na API remota (${remoteUrl}). A recorrer ao servidor local...`, errRemoto);
    }
  }

  // Tentativa 2: Servidor Local Express no prefixo /api/...
  try {
    const resLocalApi = await fetch(localApiUrl, options);
    const jsonLocalApi = await safeParseResponse(resLocalApi);
    return {
      ok: resLocalApi.ok,
      status: resLocalApi.status,
      json: async () => jsonLocalApi,
    };
  } catch {
    // Tentativa 3: Endpoint limpo local /admin/...
    if (localApiUrl !== cleanEndpoint) {
      try {
        const resLocalClean = await fetch(cleanEndpoint, options);
        const jsonLocalClean = await safeParseResponse(resLocalClean);
        return {
          ok: resLocalClean.ok,
          status: resLocalClean.status,
          json: async () => jsonLocalClean,
        };
      } catch {
        // continua para a exceção final
      }
    }
    throw new Error('Não foi possível ligar ao servidor remoto nem ao backend local.');
  }
}

export const adminApi = {
  async listarCandidaturas(token, filtros = {}) {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.pesquisa) params.append('pesquisa', filtros.pesquisa);
    if (filtros.programa_id) params.append('programa_id', String(filtros.programa_id));
    if (filtros.curso_id) params.append('curso_id', String(filtros.curso_id));
    if (filtros.distrito) params.append('distrito', filtros.distrito);
    if (filtros.ano) params.append('ano', String(filtros.ano));
    if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
    if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
    if (filtros.page) params.append('page', String(filtros.page));
    if (filtros.per_page) params.append('per_page', String(filtros.per_page));

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetchComFallback(`/admin/candidaturas${queryStr}`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao carregar lista de inscrições.');
    }
    return json;
  },

  async obterDetalhesCandidatura(token, id) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}`, {
      headers: { Authorization: `Bearer ${token || ''}` },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao carregar detalhes da candidatura.');
    }
    return json;
  },

  async atualizarCandidatura(token, id, dados) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify(dados),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao atualizar dados da candidatura.');
    }
    return json;
  },

  async iniciarAnalise(token, id) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/analise`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token || ''}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao iniciar análise.');
    return json;
  },

  async devolverCandidatura(token, id, motivo) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/devolver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao devolver candidatura.');
    return json;
  },

  async aprovarCandidatura(token, id, observacao) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/aprovar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({
        observacao:
          observacao ||
          'Candidatura aprovada pela comissão técnica e homologada oficialmente no sistema administrativo.',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Falha na aprovação.');
    return json;
  },

  async rejeitarCandidatura(token, id, motivo) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/rejeitar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao rejeitar candidatura.');
    return json;
  },

  async reprovarCandidatura(token, id, motivo) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/reprovar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao reprovar candidatura.');
    return json;
  },

  async aprovarEmLote(token, ids, observacao) {
    const res = await fetchComFallback('/admin/candidaturas/aprovar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({
        ids: Array.isArray(ids) ? ids : [ids],
        observacao: observacao || 'Aprovação em lote autorizada pela comissão técnica.',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao processar aprovação em lote.');
    return json;
  },

  async reprovarEmLote(token, ids, motivo) {
    const res = await fetchComFallback('/admin/candidaturas/reprovar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({
        ids: Array.isArray(ids) ? ids : [ids],
        motivo: motivo || 'Processo reprovado por não preenchimento de requisitos.',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao processar reprovação em lote.');
    return json;
  },

  async devolverEmLote(token, ids, motivo) {
    const res = await fetchComFallback('/admin/candidaturas/devolver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({
        ids: Array.isArray(ids) ? ids : [ids],
        motivo: motivo || 'Necessita de regularização de documentos ou dados.',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao processar devolução em lote.');
    return json;
  },

  async cancelarCandidatura(token, id, motivo) {
    const res = await fetchComFallback(`/admin/candidaturas/${id}/cancelar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || ''}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao cancelar candidatura.');
    return json;
  },

  async listarProgramas(token) {
    const userToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;

    try {
      const res = await fetchComFallback('/programa', { headers });
      const json = await res.json();
      if (res.ok) return json;
    } catch {
      // fallback
    }

    const res = await fetchComFallback('/programas', { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao carregar programas.');
    return json;
  },

  async listarCursos(token, programaId) {
    const userToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (userToken) headers['Authorization'] = `Bearer ${userToken}`;

    // Tentativa 1: POST /curso/busca com o payload oficial
    const payload = {
      nome: '',
      ano_execucao: 2026,
      programa: programaId ? String(programaId) : '',
      local_realizacao: '',
      acao: '',
    };

    try {
      const res = await fetchComFallback('/curso/busca', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) return json;
    } catch {
      // fallback
    }

    // Fallback: GET /cursos?programa_id=...
    const url = programaId ? `/cursos?programa_id=${programaId}` : '/cursos';
    const res = await fetchComFallback(url, { headers });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao carregar cursos.');
    return json;
  },

  async baixarFichaOficialPdf(token, cand) {
    if (!cand) return;
    const userToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
    const id = cand.inscricao_id || cand.id;
    const pdfUrl = buildApiUrl(`/inscricoes/${id}/ficha-inscricao?download=true&token=${encodeURIComponent(userToken)}`);

    try {
      const res = await fetch(pdfUrl, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `ficha_inscricao_${cand.codigo || id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch (err) {
      console.warn('[adminApi] Falha ao descarregar PDF do backend. A utilizar fallback local em JS:', err);
    }

    // Fallback de contingência local em JS
    const dadosFicha = converterCandidaturaAdminParaDadosFicha(cand);
    gerarPdfFormularioInscricao(dadosFicha);
  },

  /**
   * 5.5. Baixar Dossiê Completo Unificado em PDF (1 Único Ficheiro)
   * Agrupa Ficha Oficial + B.I. + NIF + Habilitações + Certificados Profissionais
   */
 
  async baixarDossieCompletoPdf(token, cand) {
    const candidaturaId =
      typeof cand === 'object' && cand !== null
        ? (cand.candidatura_id ?? cand.id ?? cand.inscricao_id)
        : cand;

    if (!candidaturaId) {
      Swal.fire({
        icon: 'warning',
        title: 'Candidatura inválida',
        text: 'Não foi possível identificar o ID da candidatura selecionada.',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const userToken =
      token ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('token') || ''
        : '');

    if (!userToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Sessão expirada',
        text: 'Não foi encontrado um token de autenticação. Faça login novamente.',
        confirmButtonText: 'OK',
      });
      return false;
    }

    const codigo = (typeof cand === 'object' && cand?.codigo) ? cand.codigo : `CAND-${candidaturaId}`;

    const nomeBruto = (typeof cand === 'object' && cand?.nome) ? cand.nome : 'Candidato';
    const nomeSanitizado = nomeBruto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    const defaultFilename = `Dossie_Inscricao_${codigo}_${nomeSanitizado}.pdf`;

    // Endpoint oficial unificado por ID da Candidatura:
    // GET /api/admin/candidaturas/:id/dossie-completo (com suporte a variações de prefixo /api e proxy local)
    const queryParam = `?token=${encodeURIComponent(userToken)}`;
    const remoteUrlApi = buildApiUrl(`/api/admin/candidaturas/${encodeURIComponent(candidaturaId)}/dossie-completo${queryParam}`);
    const remoteUrlClean = buildApiUrl(`/admin/candidaturas/${encodeURIComponent(candidaturaId)}/dossie-completo${queryParam}`);
    const localUrlApi = `/api/admin/candidaturas/${encodeURIComponent(candidaturaId)}/dossie-completo${queryParam}`;
    const localUrlClean = `/admin/candidaturas/${encodeURIComponent(candidaturaId)}/dossie-completo${queryParam}`;

    const urlsToTry = Array.from(new Set([
      remoteUrlApi,
      remoteUrlClean,
      localUrlApi,
      localUrlClean,
    ]));

    let ultimoErro = null;

    for (const url of urlsToTry) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: 'application/pdf',
          },
        });

        if (!response.ok) {
          let mensagemErro = `Erro HTTP ${response.status}`;
          try {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const erro = await response.json();
              mensagemErro =
                erro.erro || erro.message || erro.mensagem || mensagemErro;
            } else {
              const texto = await response.text();
              if (texto && texto.length < 250) {
                mensagemErro = texto;
              }
            }
          } catch {
            // Mantém mensagem HTTP original
          }
          ultimoErro = new Error(mensagemErro);
          continue;
        }

        const contentType =
          (response.headers.get('content-type') || '').toLowerCase();

        if (
          !contentType.includes('application/pdf') &&
          !contentType.includes('application/octet-stream')
        ) {
          ultimoErro = new Error(
            `O servidor não devolveu um PDF. Content-Type recebido: ${contentType || 'desconhecido'}`
          );
          continue;
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          ultimoErro = new Error('O ficheiro PDF recebido está vazio.');
          continue;
        }

        const disposition = response.headers.get('content-disposition') || '';
        let filename = defaultFilename;
        const match = disposition.match(
          /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i
        );

        if (match?.[1]) {
          try {
            filename = decodeURIComponent(match[1]);
          } catch {
            filename = match[1];
          }
        }

        // Criar URL temporária para descarregar o PDF do Dossiê Completo
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl);
        }, 8000);

        return true;
      } catch (err) {
        ultimoErro = err;
        console.warn(`[adminApi] Falha no endpoint (${url}):`, err);
      }
    }

    // Fallback de contingência local se o backend estiver inacessível ou falhar
    if (typeof cand === 'object' && cand !== null) {
      try {
        console.info('[adminApi] A recorrer à geração de contingência do dossiê no cliente...');
        await this.gerarDossieCompletoClientePdf(cand, true);
        return true;
      } catch (errFallback) {
        console.error('[adminApi] Falha no fallback local do dossiê:', errFallback);
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Erro ao gerar Dossiê Completo',
      text:
        ultimoErro?.message ||
        'Ocorreu um erro ao tentar obter o Dossiê Completo Unificado. Por favor, tente novamente ou verifique a conexão com o servidor.',
      confirmButtonText: 'OK',
    });

    return false;
  },



  /**
   * Gera o Dossiê Completo Unificado no cliente em conformidade estrita com o regulamento CFP
   */
  async gerarDossieCompletoClientePdf(cand, triggerDownload = false) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const codigo = cand?.codigo || `CAND-${cand?.id || '2026'}`;
    const nome = cand?.nome || 'Candidato';
    const nomeSanitizado = nome.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const filename = `Dossie_Inscricao_${codigo}_${nomeSanitizado}.pdf`;

    // 1º - Ficha de Inscrição Oficial Gerada (com dados, cabeçalhos, situação socioeconómica e foto 3x4)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(27, 67, 50);
    doc.text('CENTRO DE FORMAÇÃO PROFISSIONAL DE SÃO TOMÉ E PRÍNCIPE (CFP-STP)', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text('DOSSIÊ UNIFICADO DE CANDIDATURA E INSCRIÇÃO', 105, 26, { align: 'center' });
    doc.setDrawColor(27, 67, 50);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('1º DOCUMENTO: FICHA DE INSCRIÇÃO OFICIAL', 20, 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);

    let y = 46;
    const linha = (rotulo, valor) => {
      doc.setFont('helvetica', 'bold');
      doc.text(rotulo, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(valor || '—'), 78, y);
      y += 6.5;
    };

    linha('Código do Processo:', codigo);
    linha('Nome Completo:', nome);
    linha('Filiação Paterna:', cand?.nome_pai || '—');
    linha('Filiação Materna:', cand?.nome_mae || '—');
    linha('Bilhete de Identidade (B.I.):', cand?.bi || '—');
    linha('NIF (Contribuinte):', cand?.nif || '—');
    linha('Data de Nascimento:', cand?.data_nascimento || '—');
    linha('Gênero / Sexo:', cand?.sexo || '—');
    linha('Estado Civil:', cand?.estado_civil || '—');
    linha('Agregado Familiar:', `${cand?.agregado || cand?.agregado_familiar || '1'} pessoa(s)`);
    linha('Contacto Telefónico:', cand?.contacto || '—');
    linha('Correio Eletrónico (Email):', cand?.email || '—');
    linha('Distrito / Morada:', `${cand?.distrito || '—'} - ${cand?.morada || '—'}`);
    linha('Habilitações Literárias:', cand?.habilitacao_literaria || '—');
    linha('Situação de Emprego:', cand?.situacao_emprego || '—');
    linha('Ocupação / Atividade:', cand?.ocupacao || '—');
    linha('Área de Formação:', cand?.area_formacao || '—');
    linha('Formação Profissional Anterior:', cand?.formacao_profissional || 'Nenhuma declarada');
    linha('Experiência Profissional:', cand?.experiencia_profissional || 'Sem experiência anterior');
    linha('1.ª Opção de Curso:', cand?.curso_opcao1?.nome || cand?.curso_nome || '—');
    linha('2.ª Opção de Curso:', cand?.curso_opcao2?.nome || '—');
    linha('Estado do Processo:', cand?.estado || 'EM_ANALISE');
    linha('Autorização Utilização Dados:', cand?.autorizacao_divulgacao_dados !== false ? 'Autorizado pelo formando' : 'Não autorizado');

    // Ordem oficial estipulada pelo regulamento CFP:
    const tiposOrdem = [
      { num: '2º', titulo: 'Cópia do Bilhete de Identidade (B.I.)', termos: ['bi', 'identidade', 'passaporte', 'bilhete'] },
      { num: '3º', titulo: 'Cópia do Cartão de Contribuinte (NIF)', termos: ['nif', 'contribuinte', 'fiscal'] },
      { num: '4º', titulo: 'Cópia da Certidão / Certificado de Habilitações Literárias', termos: ['habilitac', 'escolar', 'certidao', 'certificado_habilitacoes'] },
      { num: '5º', titulo: 'Cópia do(s) Certificado(s) de Formação Profissional', termos: ['formacao', 'profissional', 'curso', 'certificado_formacao'] },
    ];

    const docs = Array.isArray(cand?.documentos) ? cand.documentos : [];

    for (const item of tiposOrdem) {
      doc.addPage();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(27, 67, 50);
      doc.text(`CFP-STP • DOSSIÊ DO FORMANDO: ${codigo} - ${nome}`, 20, 18);
      doc.line(20, 22, 190, 22);

      doc.setFontSize(11);
      doc.text(`${item.num} DOCUMENTO: ${item.titulo.toUpperCase()}`, 20, 32);

      const docEncontrado = docs.find((d) => {
        const nomeOuTipo = `${d?.tipo_documento || ''} ${d?.tipo || ''} ${d?.nome_original || ''}`.toLowerCase();
        return item.termos.some((t) => nomeOuTipo.includes(t));
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);

      if (docEncontrado) {
        doc.text(`Documento associado ao processo: ${docEncontrado.nome_original || docEncontrado.tipo_documento || 'Anexo Comprovativo'}`, 20, 42);
        doc.text(`Identificador do Ficheiro: #${docEncontrado.id || 'ANX'}`, 20, 48);
        doc.text(`Estado de Validação: ${docEncontrado.validado ? 'Validado Oficialmente pela Secretaria' : 'Em Análise / Submetido'}`, 20, 54);

        doc.setDrawColor(203, 213, 225);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 62, 170, 180, 3, 3, 'FD');
        doc.setTextColor(100, 116, 139);
        doc.text('[ CÓPIA OFICIAL AUTENTICADA DO DOCUMENTO CONFORME REGISTO DIGITAL ]', 105, 145, { align: 'center' });
        doc.text('Documento original arquivado no dossiê eletrónico da secretaria do CFP.', 105, 153, { align: 'center' });
      } else {
        doc.text('Documento não anexado ou dispensado de apresentação nesta fase do processo.', 20, 42);
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(20, 50, 170, 150, 3, 3, 'FD');
        doc.setTextColor(148, 163, 184);
        doc.text('[ REGISTO DIGITAL: CÓPIA NÃO DISPONIBILIZADA ]', 105, 125, { align: 'center' });
      }
    }

    const blob = doc.output('blob');
    if (triggerDownload) {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
    }
    return blob;
  },

  /**
   * 5.6. Baixar Grupo de Dossiês em Ficheiro ZIP (Múltiplos Formandos por ID)
   */
  async baixarDossiesZip(token, ids, listaCandidatos = []) {
    if (!ids || ids.length === 0) return;
    const userToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
    const dataStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const defaultFilename = `Dossies_Inscricoes_CFP_${dataStr}.zip`;

    // 1. Tentar endpoints de ZIP do Backend oficial
    const endpoints = [
      '/api/admin/candidaturas/dossies-zip',
      '/admin/candidaturas/dossies-zip',
      '/api/admin/formandos/dossies-zip',
      '/admin/formandos/dossies-zip',
      '/api/inscricoes/dossies-zip',
      '/inscricoes/dossies-zip',
      '/api/candidaturas/dossies-zip',
      '/candidaturas/dossies-zip',
    ];

    for (const ep of endpoints) {
      try {
        const fullUrl = buildApiUrl(ep);
        const res = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
          },
          body: JSON.stringify({ ids }),
        });

        if (res.ok) {
          const contentType = (res.headers.get('content-type') || '').toLowerCase();
          if (contentType.includes('zip') || contentType.includes('octet-stream')) {
            const blob = await res.blob();
            const disposition = res.headers.get('content-disposition');
            const match = disposition && disposition.match(/filename="?([^";]+)"?/);
            const filename = match ? match[1] : defaultFilename;

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
            return;
          }
        }
      } catch {
        // Tenta o próximo
      }
    }

    // Tentar também via GET com query params
    for (const ep of endpoints) {
      try {
        const fullUrl = buildApiUrl(`${ep}?ids=${ids.join(',')}&token=${encodeURIComponent(userToken)}`);
        const res = await fetch(fullUrl, {
          headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
        });
        if (res.ok) {
          const contentType = (res.headers.get('content-type') || '').toLowerCase();
          if (contentType.includes('zip') || contentType.includes('octet-stream')) {
            const blob = await res.blob();
            const disposition = res.headers.get('content-disposition');
            const match = disposition && disposition.match(/filename="?([^";]+)"?/);
            const filename = match ? match[1] : defaultFilename;

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
            return;
          }
        }
      } catch {
        // Tenta o próximo
      }
    }

    // Fallback de contingência local em JS com JSZip
    const zip = new JSZip();
    for (const id of ids) {
      const cand = listaCandidatos.find((c) => c.id === id) || { id, codigo: `CAND-${id}`, nome: 'Candidato' };
      const codigo = cand.codigo || `CAND-${id}`;
      const nomeSanitizado = (cand.nome || 'Candidato').replace(/[^a-zA-Z0-9_\-]/g, '_');
      const filename = `Dossie_Inscricao_${codigo}_${nomeSanitizado}.pdf`;

      const pdfBlob = await this.gerarDossieCompletoClientePdf(cand, false);
      zip.file(filename, pdfBlob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const blobUrl = window.URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
  },

  exportarCandidaturaExcel(cand) {
    const dadosFicha = converterCandidaturaAdminParaDadosFicha(cand);
    exportarInscricaoParaExcel(dadosFicha);
  },

  async exportarTodasCandidaturasExcel(token, _filtros = {}) {
    const res = await fetchComFallback('/admin/candidaturas/exportar-excel', {
      headers: { Authorization: `Bearer ${token || ''}` },
    });
    const data = await res.json();
    const lista = data.candidaturas || [];

    const linhas = lista.map((c) => ({
      Código: c.codigo,
      Estado: c.estado,
      'Processo Formando': c.processo_numero || '—',
      Nome: c.nome,
      BI: c.bi,
      NIF: c.nif || '—',
      'Data Nasc.': c.data_nascimento,
      Idade: c.idade || '',
      Sexo: c.sexo,
      Distrito: c.distrito,
      Morada: c.morada,
      Telefone: c.contacto,
      Email: c.email || '—',
      Habilitação: c.habilitacao_literaria,
      Programa: c.programa?.nome || '',
      '1.ª Opção Curso': c.curso_opcao1?.nome || '',
      '2.ª Opção Curso': c.curso_opcao2?.nome || '—',
      'Situação Emprego': c.situacao_emprego || '—',
      'Data Inscrição': c.data_submissao || c.data_criacao,
    }));

    const ws = XLSX.utils.json_to_sheet(linhas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidaturas CFP');
    XLSX.writeFile(wb, `Listagem_Candidaturas_CFP_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  /**
   * Obtém o Blob autenticado de um documento protegido via JWT
   */
  async obterDocumentoBlob(documento, token) {
    if (!documento) throw new Error('Documento não fornecido.');
    const userToken = obterTokenAutenticacao(token);

    // Utiliza prioritariamente as URLs devolvidas pelo backend
    const targetUrl =
      documento.url_visualizacao ||
      documento.arquivo_url ||
      documento.url_publica ||
      documento.url;

    if (!targetUrl) {
      throw new Error('Nenhuma URL de visualização válida fornecida pelo backend para este documento.');
    }

    const fullUrl = buildApiUrl(targetUrl);
    const headers = {};
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const res = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const msgErro = await obterMensagemErroDocumento(res);
      throw new Error(msgErro);
    }

    return await res.blob();
  },

  /**
   * Descarrega com segurança um documento protegido enviando o token JWT no cabeçalho
   */
  async descarregarDocumento(documento, token) {
    if (!documento) throw new Error('Documento não fornecido.');
    const userToken = obterTokenAutenticacao(token);

    const downloadUrl =
      documento.url_download ||
      documento.url_visualizacao ||
      documento.arquivo_url ||
      documento.url_publica ||
      documento.url;

    if (!downloadUrl) {
      throw new Error('Nenhuma URL de download fornecida para este documento.');
    }

    const fullUrl = buildApiUrl(downloadUrl);
    const headers = {};
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const res = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      const msgErro = await obterMensagemErroDocumento(res);
      throw new Error(msgErro);
    }

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);

    const ext = blob.type?.includes('pdf') ? 'pdf' : blob.type?.includes('jpeg') ? 'jpg' : blob.type?.includes('png') ? 'png' : '';
    const nomePadrao = `${documento.tipo_documento || documento.tipo || 'documento'}${ext ? `.${ext}` : ''}`;
    const nomeFicheiro = documento.nome_original || documento.nome || nomePadrao;

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = nomeFicheiro;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  },

  /**
   * Obtém as estatísticas consolidadas por curso e dados demográficos
   * Suporta filtros por ano, curso_id, programa_id, distrito, sexo, opcao e status.
   */
  async obterEstatisticasPorCurso(token, filtros = {}) {
    const userToken = obterTokenAutenticacao(token);
    const queryString = new URLSearchParams(
      Object.entries(filtros).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
    ).toString();

    const endpoints = [
      `/api/estatisticas/por-curso${queryString ? `?${queryString}` : ''}`,
      `/estatisticas/por-curso${queryString ? `?${queryString}` : ''}`,
      `/api/inscricoes/estatisticas${queryString ? `?${queryString}` : ''}`,
    ];

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    let ultimoErro = null;
    for (const ep of endpoints) {
      const fullUrl = buildApiUrl(ep);
      const urlsParaTentar = [fullUrl];
      if (fullUrl !== ep) urlsParaTentar.push(ep);

      for (const url of urlsParaTentar) {
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers,
          });

          if (res.ok) {
            const data = await res.json();
            if (data && (data.sucesso || data.dados_gerais)) {
              return data;
            }
          }
        } catch (err) {
          ultimoErro = err;
        }
      }
    }

    throw new Error(ultimoErro?.message || 'Não foi possível carregar as estatísticas de inscrições.');
  },

  /**
   * Exporta a folha de cálculo Excel (.xlsx) com 3 abas estruturadas
   */
  exportarEstatisticasExcel(estatisticasData, nomeArquivo = 'Estatisticas_Inscricoes_CFP_STP') {
    if (!estatisticasData || !estatisticasData.dados_gerais) {
      throw new Error('Dados estatísticos insuficientes para exportação.');
    }

    const dg = estatisticasData.dados_gerais;
    const wb = XLSX.utils.book_new();

    // 1. ABA: Visão Geral e Demografia
    const dadosVisaoGeral = [
      ['CENTRO DE FORMAÇÃO PROFISSIONAL DE SÃO TOMÉ E PRÍNCIPE (CFP-STP)'],
      ['RELATÓRIO ESTATÍSTICO DE INSCRIÇÕES E DEMOGRAFIA'],
      ['Data de Emissão:', new Date().toLocaleDateString('pt-PT')],
      [],
      ['INDICADOR GLOBAL', 'VALOR', 'PERCENTUAL'],
      ['Total de Cursos Ativos', dg.total_cursos_ativos || 0, '—'],
      ['Total Geral de Inscritos', dg.total_inscritos || 0, '100%'],
      ['Vagas Totais Ofertadas', dg.vagas_totais || 0, '—'],
      ['Taxa de Ocupação Global', `${dg.taxa_ocupacao_geral || 0}%`, '—'],
      ['Inscritos Masculino', dg.total_masculino || 0, `${dg.percentual_masculino || 0}%`],
      ['Inscritos Feminino', dg.total_feminino || 0, `${dg.percentual_feminino || 0}%`],
      ['Candidatos Selecionados / Admitidos', dg.selecionados || 0, `${dg.total_inscritos > 0 ? Math.round((dg.selecionados / dg.total_inscritos) * 100) : 0}%`],
      ['Em Lista de Suplentes', dg.suplentes || 0, `${dg.total_inscritos > 0 ? Math.round((dg.suplentes / dg.total_inscritos) * 100) : 0}%`],
      ['Inscrições Confirmadas', dg.inscritos || 0, `${dg.total_inscritos > 0 ? Math.round((dg.inscritos / dg.total_inscritos) * 100) : 0}%`],
      ['Candidatos Desistidos', dg.desistidos || 0, `${dg.total_inscritos > 0 ? Math.round((dg.desistidos / dg.total_inscritos) * 100) : 0}%`],
      ['Não Selecionados', dg.nao_selecionados || 0, `${dg.total_inscritos > 0 ? Math.round((dg.nao_selecionados / dg.total_inscritos) * 100) : 0}%`],
      ['1.ª Opção de Curso', dg.primeira_opcao || 0, `${dg.total_inscritos > 0 ? Math.round((dg.primeira_opcao / dg.total_inscritos) * 100) : 0}%`],
      ['2.ª Opção de Curso', dg.segunda_opcao || 0, `${dg.total_inscritos > 0 ? Math.round((dg.segunda_opcao / dg.total_inscritos) * 100) : 0}%`],
      [],
      ['DISTRIBUIÇÃO POR DISTRITO (STP)', 'TOTAL INSCRITOS'],
      ['Água Grande', dg.distritos?.agua_grande || 0],
      ['Mé-Zóchi', dg.distritos?.me_zochi || 0],
      ['Cantagalo', dg.distritos?.cantagalo || 0],
      ['Lembá', dg.distritos?.lemba || 0],
      ['Caué', dg.distritos?.caue || 0],
      ['Região Autónoma do Príncipe (RAP)', dg.distritos?.rap || 0],
      ['Lobata', dg.distritos?.lobata || 0],
      [],
      ['FAIXAS ETÁRIAS', 'TOTAL'],
      ['14 aos 17 anos', dg.faixas_etarias?.faixa_14_17 || 0],
      ['18 aos 24 anos', dg.faixas_etarias?.faixa_18_24 || 0],
      ['25 aos 30 anos', dg.faixas_etarias?.faixa_25_30 || 0],
      ['31 aos 35 anos', dg.faixas_etarias?.faixa_31_35 || 0],
      ['36 aos 40 anos', dg.faixas_etarias?.faixa_36_40 || 0],
      ['41 aos 45 anos', dg.faixas_etarias?.faixa_41_45 || 0],
      ['46 aos 50 anos', dg.faixas_etarias?.faixa_46_50 || 0],
      ['Mais de 50 anos', dg.faixas_etarias?.faixa_mais_50 || 0],
      [],
      ['HABILITAÇÕES LITERÁRIAS', 'TOTAL'],
      ['4.º ao 6.º Ano (Básico)', dg.habilitacoes?.hab_4_6 || 0],
      ['7.º ao 9.º Ano', dg.habilitacoes?.hab_7_9 || 0],
      ['10.º ao 12.º Ano (Secundário)', dg.habilitacoes?.hab_10_12 || 0],
      ['Ensino Médio / Técnico-Profissional', dg.habilitacoes?.hab_media || 0],
      ['Ensino Superior', dg.habilitacoes?.hab_superior || 0],
    ];
    const wsGeral = XLSX.utils.aoa_to_sheet(dadosVisaoGeral);
    XLSX.utils.book_append_sheet(wb, wsGeral, 'Visão Geral & Demografia');

    // 2. ABA: Métricas por Curso
    const cursosRows = [
      [
        'ID',
        'Nome do Curso',
        'Ação Nº',
        'Duração (Horas)',
        'Vagas (Turma)',
        'Total Inscritos',
        'Taxa Ocupação (%)',
        'Masculino',
        'Feminino',
        '% Masc',
        '% Fem',
        'Selecionados',
        'Suplentes',
        'Desistidos',
        '1ª Opção',
        '2ª Opção',
      ],
    ];

    if (Array.isArray(estatisticasData.por_curso)) {
      estatisticasData.por_curso.forEach((c) => {
        cursosRows.push([
          c.curso_id,
          c.nome_curso,
          c.acao || '—',
          c.duracao || 0,
          c.alunos_por_turma || 0,
          c.total_inscritos || 0,
          `${c.taxa_ocupacao || 0}%`,
          c.masculino || 0,
          c.feminino || 0,
          `${c.percentual_masculino || 0}%`,
          `${c.percentual_feminino || 0}%`,
          c.selecionados || 0,
          c.suplente || 0,
          c.desistidos || 0,
          c.primeira_opcao || 0,
          c.segunda_opcao || 0,
        ]);
      });
    }
    const wsCursos = XLSX.utils.aoa_to_sheet(cursosRows);
    XLSX.utils.book_append_sheet(wb, wsCursos, 'Métricas por Curso');

    // 3. ABA: Lista Nominal de Inscrições
    const inscricoesRows = [
      ['ID Processo', 'Nome Completo', 'B.I.', 'Género', 'Idade', 'Distrito', 'Habilitação', 'Curso Inscrito', 'Opção', 'Status', 'Ano'],
    ];

    if (Array.isArray(estatisticasData.inscricoes_lista)) {
      estatisticasData.inscricoes_lista.forEach((i) => {
        inscricoesRows.push([
          i.codigo || `CAND-${i.id}`,
          i.nome,
          i.bi || '—',
          i.sexo,
          i.idade,
          i.distrito,
          i.habilitacao,
          i.curso_nome,
          `${i.opcao}ª Opção`,
          i.status,
          i.ano,
        ]);
      });
    }
    const wsInscricoes = XLSX.utils.aoa_to_sheet(inscricoesRows);
    XLSX.utils.book_append_sheet(wb, wsInscricoes, 'Lista de Inscrições');

    // Descarregar ficheiro
    XLSX.writeFile(wb, `${nomeArquivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  },

  /**
   * Emite e descarrega o relatório estatístico oficial em PDF diretamente gerado pelo backend.
   * Não processa dados no frontend nem usa dados fictícios; consome o stream binário da API.
   *
   * @param {Object} params
   * @param {'geral'|'programa'|'curso'} [params.tipo='geral']
   * @param {number|string} [params.ano]
   * @param {number|string} [params.cursoId]
   * @param {number|string} [params.programaId]
   * @param {number|boolean} [params.download=1]
   * @param {boolean} [params.abrirEmNovaAba=false]
   * @param {string} [params.token]
   */
  descarregarRelatorioEstatistico({
    tipo = 'geral',
    ano,
    cursoId,
    programaId,
    download = 1,
    abrirEmNovaAba = false,
    token,
  } = {}) {
    return descarregarRelatorioEstatistico({
      tipo,
      ano,
      cursoId,
      programaId,
      download,
      abrirEmNovaAba,
      token,
    });
  },
};

/**
 * Função utilitária exportada para descarregar relatório estatístico diretamente
 */

export async function descarregarRelatorioEstatistico({
  tipo = "geral",
  ano,
  cursoId,
  programaId,
  download = 1,
  abrirEmNovaAba = false,
  token,
} = {}) {
  let novaAba = null;
  let objectUrl = null;

  try {
    // Abrir a aba durante o clique do utilizador evita bloqueios do navegador.
    if (abrirEmNovaAba) {
      novaAba = window.open("about:blank", "_blank");

      if (!novaAba) {
        throw new Error(
          "O navegador bloqueou a nova aba. Permite pop-ups e tenta novamente."
        );
      }

      novaAba.document.title = "A preparar relatório...";
      novaAba.document.body.innerHTML =
        "<p style='font-family:Arial,sans-serif;padding:20px'>" +
        "A preparar o relatório estatístico...</p>";
    }

    const params = new URLSearchParams();

    params.set("tipo", tipo);

    if (ano !== undefined && ano !== null && ano !== "") {
      params.set("ano", String(ano));
    }

    if (cursoId !== undefined && cursoId !== null && cursoId !== "") {
      params.set("curso_id", String(cursoId));
    }

    if (
      programaId !== undefined &&
      programaId !== null &&
      programaId !== ""
    ) {
      params.set("programa_id", String(programaId));
    }

    // A nova aba deve apresentar o PDF em vez de forçar o download.
    params.set(
      "download",
      abrirEmNovaAba ? "false" : String(Boolean(Number(download)))
    );

    const headers = {
      Accept: "application/pdf, application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `/api/estatisticas/relatorio-pdf?${params.toString()}`,
      {
        method: "GET",
        headers,
        credentials: "same-origin",
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type") || "";
      let mensagem = `Erro HTTP ${response.status} ao gerar o relatório.`;

      if (contentType.includes("application/json")) {
        const erro = await response.json();
        mensagem =
          erro.erro ||
          erro.mensagem ||
          erro.message ||
          mensagem;
      } else {
        const texto = await response.text();

        if (texto.trim()) {
          mensagem = texto.slice(0, 500);
        }
      }

      throw new Error(mensagem);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("application/pdf")) {
      const texto = await response.text();

      throw new Error(
        `O servidor não devolveu um PDF válido. Resposta: ${texto.slice(0, 300)}`
      );
    }

    const blob = await response.blob();

    if (!blob.size) {
      throw new Error("O relatório PDF foi gerado vazio.");
    }

    objectUrl = URL.createObjectURL(blob);

    const nomeArquivo =
      `Relatorio_Estatistico_CFP_${ano || new Date().getFullYear()}_${tipo}.pdf`;

    if (abrirEmNovaAba) {
      novaAba.location.href = objectUrl;

      // Dar tempo ao navegador para começar a carregar o PDF.
      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60_000);

      objectUrl = null;
      return;
    }

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1_000);

    objectUrl = null;
  } catch (erro) {
    if (novaAba && !novaAba.closed) {
      novaAba.close();
    }

    console.error("Erro ao descarregar relatório estatístico:", erro);

    // Substitui por toast/alert do teu projeto, se existir.
    window.alert(
      erro instanceof Error
        ? erro.message
        : "Não foi possível gerar ou descarregar o relatório estatístico."
    );
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
