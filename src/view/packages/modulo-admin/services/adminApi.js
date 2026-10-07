import { converterCandidaturaAdminParaDadosFicha } from '../utils/adminMapper';

import * as XLSX from 'xlsx';
import { gerarPdfFormularioInscricao } from '../utils/gerarPdfInscricao';
import { exportarInscricaoParaExcel } from '../utils/pdfFichaGenerator';
////src/api/urls/index.js
import { API_URL } from '../../../../api/urls';

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
      const resRemoto = await fetch(remoteUrl, options);
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
};
