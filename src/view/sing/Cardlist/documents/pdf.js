import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportTurmaToPDF = (turma) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`Resumo da Turma - ${turma?.curso_info.nome_curso}`, 10, 10);

  const body = [
    ["Curso", turma?.curso_info.nome_curso],
    ["Programa", turma?.curso_info.programa],
    ["Ação", turma?.curso_info.acao],
    ["Ano", turma?.curso_info.ano],
    ["Data Início", turma?.curso_info.data_inicio],
    ["Data Término", turma?.curso_info.data_termino],
    ["Horário Início", turma?.curso_info.horario],
    ["Horário Término", turma?.curso_info.horario_termino],
    ["Total Inscritos", turma?.estatisticas_inscricoes.total_inscritos],
    ["Selecionados", turma?.estatisticas_inscricoes.selecionados],
    ["Desistentes", turma?.estatisticas_inscricoes.desistidos],
    ["Não Selecionados", turma?.estatisticas_inscricoes.nao_selecionados],
  ];

  doc.autoTable({
    startY: 20,
    head: [["Campo", "Valor"]],
    body,
  });

  doc.save(`Turma-${turma?.curso_info.nome_curso}.pdf`);
};
