export interface CursoItem {
  id: number;
  nome: string;
  acao: string;
  alunos_por_turma: string;
  ano_execucao: number;
  data_atualizacao: string;
  data_criacao: string | null;
  data_inicio: string;
  data_termino: string;
  descricao: string;
  duracao: number;
  duracao_mes: number;
  horario: string;
  horario_termino: string;
  local_realizacao: string;
  programa_id: number;
  programa_nome: string;
}

export const CURSOS_MOCK_DATA: CursoItem[] = [
  {
    id: 1,
    nome: 'Eletricidade e Instalações Prediais',
    acao: 'EL-01',
    alunos_por_turma: '20',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-03-01',
    data_termino: '2026-07-30',
    descricao: 'Formação em instalações elétricas de baixa tensão, esquemas unifilares e segurança.',
    duracao: 450,
    duracao_mes: 5,
    horario: '08:00',
    horario_termino: '13:00',
    local_realizacao: 'CFP-STP São Tomé (Oficinas Técnicas)',
    programa_id: 1,
    programa_nome: 'Qualificação Inicial',
  },
  {
    id: 2,
    nome: 'Mecânica Automóvel e Manutenção',
    acao: 'MC-02',
    alunos_por_turma: '18',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-03-01',
    data_termino: '2026-07-30',
    descricao: 'Diagnóstico e reparação de motores de combustão, sistemas elétricos e suspensão.',
    duracao: 480,
    duracao_mes: 5,
    horario: '08:00',
    horario_termino: '13:00',
    local_realizacao: 'CFP-STP São Tomé (Oficina de Mecânica)',
    programa_id: 1,
    programa_nome: 'Qualificação Inicial',
  },
  {
    id: 3,
    nome: 'Informática de Gestão e Redes',
    acao: 'INF-03',
    alunos_por_turma: '22',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-03-15',
    data_termino: '2026-06-30',
    descricao: 'Gestão de bases de dados, suporte a utilizadores e configuração de redes locais.',
    duracao: 360,
    duracao_mes: 4,
    horario: '14:00',
    horario_termino: '18:00',
    local_realizacao: 'CFP-STP São Tomé (Laboratório 1)',
    programa_id: 3,
    programa_nome: 'Aperfeiçoamento Profissional',
  },
  {
    id: 4,
    nome: 'Construção Civil e Alvenaria',
    acao: 'CC-04',
    alunos_por_turma: '20',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-03-01',
    data_termino: '2026-07-30',
    descricao: 'Leitura de plantas, preparação de argamassas e assentamento de blocos.',
    duracao: 400,
    duracao_mes: 5,
    horario: '08:00',
    horario_termino: '13:00',
    local_realizacao: 'CFP-STP São Tomé (Canteiro de Obras)',
    programa_id: 1,
    programa_nome: 'Qualificação Inicial',
  },
  {
    id: 5,
    nome: 'Culinária, Pastelaria e Hotelaria',
    acao: 'CP-05',
    alunos_por_turma: '16',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-03-01',
    data_termino: '2026-07-30',
    descricao: 'Técnicas culinárias fundamentais, higiene alimentar HACCP e doçaria tradicional.',
    duracao: 420,
    duracao_mes: 5,
    horario: '08:00',
    horario_termino: '13:00',
    local_realizacao: 'CFP-STP São Tomé (Cozinha Pedagógica)',
    programa_id: 1,
    programa_nome: 'Qualificação Inicial',
  },
  {
    id: 6,
    nome: 'Estágio Profissional em Eletromecânica Industrial',
    acao: 'EST-06',
    alunos_por_turma: '12',
    ano_execucao: 2026,
    data_atualizacao: '2026-01-15',
    data_criacao: '2026-01-01',
    data_inicio: '2026-04-01',
    data_termino: '2026-09-30',
    descricao: 'Integração em empresas parceiras para formação prática em posto de trabalho.',
    duracao: 600,
    duracao_mes: 6,
    horario: '08:00',
    horario_termino: '16:00',
    local_realizacao: 'Empresas Parceiras / CFP-STP',
    programa_id: 2,
    programa_nome: 'Estágio Profissional',
  },
];

export const obterCursosOficiais = async (_filtro?: any): Promise<CursoItem[]> => {
  return CURSOS_MOCK_DATA;
};
