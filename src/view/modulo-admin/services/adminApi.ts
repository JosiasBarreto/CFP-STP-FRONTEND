import {
  UtilizadorAdmin,
  CandidaturaAdmin,
  EstatisticasAdmin,
  ResultadoSuiteTestes,
  ProgramaAdmin,
  CursoAdmin,
} from '../types';
import { gerarPdfFormularioInscricao } from '../../../utils/gerarPdfInscricao';
import { exportarInscricaoParaExcel } from '../../../utils/pdfFichaGenerator';
import { converterCandidaturaAdminParaDadosFicha } from '../utils/adminMapper';

export const adminApi = {
  async login(
    identificador: string,
    password: string
  ): Promise<{ token: string; utilizador: UtilizadorAdmin }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identificador, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Credenciais inválidas.');
    }
    return json;
  },

  async listarCandidaturas(
    token: string,
    filtros: { estado?: string; pesquisa?: string; programa_id?: string; curso_id?: string }
  ): Promise<{
    total: number;
    items: CandidaturaAdmin[];
    estatisticas?: EstatisticasAdmin;
  }> {
    const params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.pesquisa) params.append('pesquisa', filtros.pesquisa);
    if (filtros.programa_id) params.append('programa_id', filtros.programa_id);
    if (filtros.curso_id) params.append('curso_id', filtros.curso_id);

    const res = await fetch(`/api/admin/candidaturas?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao carregar lista de inscrições.');
    }
    return json;
  },

  async obterDetalhesCandidatura(
    token: string,
    id: number
  ): Promise<CandidaturaAdmin> {
    const res = await fetch(`/api/admin/candidaturas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao carregar detalhes da candidatura.');
    }
    return json;
  },

  async criarInscricaoSecretaria(
    token: string,
    dados: Record<string, any>
  ): Promise<{
    mensagem: string;
    codigo: string;
    candidatura_id: number;
    candidatura: CandidaturaAdmin;
  }> {
    const res = await fetch('/api/admin/candidaturas/novo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dados),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.erro || 'Erro ao criar registo na secretaria.');
    }
    return json;
  },

  async iniciarAnalise(
    token: string,
    id: number
  ): Promise<{ mensagem: string; candidatura: CandidaturaAdmin }> {
    const res = await fetch(`/api/admin/candidaturas/${id}/analise`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao iniciar análise.');
    return json;
  },

  async devolverCandidatura(
    token: string,
    id: number,
    motivo: string
  ): Promise<{ mensagem: string; candidatura: CandidaturaAdmin }> {
    const res = await fetch(`/api/admin/candidaturas/${id}/devolver`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao devolver candidatura.');
    return json;
  },

  async aprovarCandidatura(
    token: string,
    id: number,
    observacao?: string
  ): Promise<{
    mensagem: string;
    formando_id: number;
    inscricao_id: number;
    processo: string;
    candidatura: CandidaturaAdmin;
  }> {
    const res = await fetch(`/api/admin/candidaturas/${id}/aprovar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

  async rejeitarCandidatura(
    token: string,
    id: number,
    motivo: string
  ): Promise<{ mensagem: string; candidatura: CandidaturaAdmin }> {
    const res = await fetch(`/api/admin/candidaturas/${id}/rejeitar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao rejeitar candidatura.');
    return json;
  },

  async cancelarCandidatura(
    token: string,
    id: number,
    motivo: string
  ): Promise<{ mensagem: string; candidatura: CandidaturaAdmin }> {
    const res = await fetch(`/api/admin/candidaturas/${id}/cancelar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivo }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao cancelar candidatura.');
    return json;
  },

  async listarProgramas(): Promise<ProgramaAdmin[]> {
    const res = await fetch('/api/programas');
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao carregar programas.');
    return json;
  },

  async listarCursos(programaId?: number): Promise<CursoAdmin[]> {
    const url = programaId ? `/api/cursos?programa_id=${programaId}` : '/api/cursos';
    const res = await fetch(url);
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao carregar cursos.');
    return json;
  },

  async executarTestes(token?: string): Promise<ResultadoSuiteTestes> {
    let tokenAtivo = token;
    if (!tokenAtivo) {
      const loginAuto = await this.login('admin', 'admin123');
      tokenAtivo = loginAuto.token;
    }
    const res = await fetch('/api/admin/run-tests', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenAtivo}` },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.erro || 'Erro ao executar testes.');
    return json;
  },

  baixarFichaOficialPdf(cand: CandidaturaAdmin) {
    const dadosFicha = converterCandidaturaAdminParaDadosFicha(cand);
    gerarPdfFormularioInscricao(dadosFicha);
  },

  exportarCandidaturaExcel(cand: CandidaturaAdmin) {
    const dadosFicha = converterCandidaturaAdminParaDadosFicha(cand);
    exportarInscricaoParaExcel(dadosFicha);
  },
};
