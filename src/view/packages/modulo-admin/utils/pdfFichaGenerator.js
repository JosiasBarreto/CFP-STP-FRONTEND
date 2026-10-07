import * as XLSX from 'xlsx';
import { gerarPdfFormularioInscricao } from './gerarPdfInscricao';

export const gerarFichaInscricaoPDF = (dados) => {
  gerarPdfFormularioInscricao(dados);
};

export const exportarInscricaoParaExcel = (dados) => {
  const linhaCompativel = [
    {
      Protocolo: dados?.protocolo,
      Nome: dados?.nome,
      Sexo: dados?.sexo,
      'Data de Nascimento': dados?.datanascimento,
      Idade: dados?.idade,
      'Nº BI': dados?.bi,
      'Arquivo de Identificação': dados?.arquivo_identificacao,
      NIF: dados?.nif,
      'Estado Civil': dados?.estado_civil,
      Nacionalidade: dados?.nacionalidade,
      Naturalidade: dados?.naturalidade,
      'Nome do Pai': dados?.nome_pai,
      'Nome da Mãe': dados?.nome_mae,
      'Agregado Familiar': dados?.agregado_familiar,
      Morada: dados?.morada,
      Distrito: dados?.distrito,
      Telefone: dados?.telefone,
      'Telefone Alternativo': dados?.telefone2,
      Email: dados?.email,
      Ocupação: dados?.ocupacao,
      'Habilitação Literária': dados?.habilitacao,
      'Área / Curso de Formação': dados?.habilitacao_area,
      'Formação Profissional Anterior': dados?.formacao_profissional,
      'Experiência Profissional': dados?.experiencia_profissional,
      'Motivo da Inscrição': dados?.motivo_inscricao,
      'Situação perante Emprego': dados?.situacao_emprego,
      'Condição Especial': dados?.possui_caso_especial === 'Sim' ? dados?.casos_especiais : 'Não',
      'Encaminhado Apoio Social': dados?.encaminhado_apoio_social,
      'Instituição Apoio Social': dados?.instituicao_apoio_social,
      'Programa 1ª Opção': dados?.programa_nome,
      'Curso 1ª Opção': dados?.curso_nome,
      'Curso 2ª Opção': dados?.curso_opcao_2_nome || '—',
      'Data Inscrição': dados?.data_inscricao,
    },
  ];

  const ws = XLSX.utils.json_to_sheet(linhaCompativel);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Formando_CFP');
  const nomeLimpo = (dados?.nome || 'Formando').replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Inscricao_${dados?.protocolo || 'CFP'}_${nomeLimpo}.xlsx`);
};
