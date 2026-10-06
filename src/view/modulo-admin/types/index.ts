export type EstadoCandidatura =
  | 'RASCUNHO'
  | 'PENDENTE'
  | 'EM_ANALISE'
  | 'DEVOLVIDA'
  | 'CORRIGIDA'
  | 'APROVADA'
  | 'REJEITADA'
  | 'CANCELADA';

export interface UtilizadorAdmin {
  id: number;
  username: string;
  nome: string;
  email?: string;
  role: 'admin' | 'staff' | string;
}

export interface DocumentoAnexo {
  id: number;
  tipo: string;
  nome_original: string;
  mime_type?: string;
  tamanho?: number;
  observacao?: string;
  data_upload?: string;
  ativo?: boolean;
  download_url?: string;
}

export interface HistoricoEvento {
  id: number;
  estado_anterior: string;
  estado_novo: string;
  acao: string;
  observacao: string;
  utilizador_nome: string;
  data_criacao: string;
}

export interface ProgramaAdmin {
  id: number;
  ID?: number;
  nome: string;
  sigla: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
}

export interface CursoAdmin {
  id: number;
  ID?: number;
  nome: string;
  acao?: string;
  duracao?: number;
  duracao_mes?: number;
  horario?: string;
  horario_termino?: string;
  local_realizacao?: string;
  fk_programa?: number;
  programa_id?: number;
  programa_nome?: string;
  ano_execucao?: number;
  alunos_por_turma?: string;
  descricao?: string;
  status: 'ativo' | 'inativo';
}

export interface CandidaturaAdmin {
  id: number;
  codigo: string;
  estado: EstadoCandidatura;
  nome: string;
  nome_pai?: string;
  nome_mae?: string;
  bi: string;
  arquivo_identificacao?: string;
  nif?: string;
  data_nascimento: string;
  idade?: number;
  sexo: string;
  nacionalidade: string;
  naturalidade?: string;
  estado_civil: string;
  agregado?: string;
  morada: string;
  distrito: string;
  zona?: string;
  contacto: string;
  contacto_alternativo?: string;
  email?: string;
  habilitacao_literaria: string;
  habilitacao_nivel?: string;
  habilitacao_classe?: string;
  habilitacao_area?: string;
  formacao_profissional?: string;
  experiencia_profissional?: string;
  ocupacao?: string;
  motivo_inscricao: string;
  programa_id: number;
  curso_opcao1_id: number;
  curso_opcao2_id?: number | null;
  ano: number;
  situacao_emprego?: string;
  atividade_profissional_anterior?: string;
  funcao_exerce?: string;
  funcao_desde?: string;
  profissao?: string;
  deficiente?: boolean;
  encaminhado_apoio_social?: boolean;
  instituicao_apoio_social?: string;
  encaminhado_outra_instituicao?: string;
  autorizacao_divulgacao_dados?: boolean;
  data_criacao: string;
  data_submissao?: string;
  data_aprovacao?: string;
  processo_numero?: string;
  formando_id?: number;
  inscricao_id?: number;
  programa?: ProgramaAdmin;
  curso_opcao1?: CursoAdmin;
  curso_opcao2?: CursoAdmin | null;
  documentos?: DocumentoAnexo[];
  historico?: HistoricoEvento[];
}

export interface EstatisticasAdmin {
  total: number;
  pendentes: number;
  em_analise: number;
  devolvidas: number;
  corrigidas: number;
  aprovadas: number;
  rejeitadas: number;
  canceladas?: number;
}

export interface ResultadoSuiteTestes {
  sucesso: boolean;
  total: number;
  aprovados: number;
  falhas: number;
  erros: number;
  saida_completa: string;
}
