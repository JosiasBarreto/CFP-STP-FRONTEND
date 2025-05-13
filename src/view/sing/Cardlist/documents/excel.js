import ExcelJS from 'exceljs/dist/exceljs.min.js';
import { saveAs } from 'file-saver';

export const exportTurmaStyledExcel = async (turma) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Estatística");

  // 📷 Carregar imagem do logo
  const response = await fetch("/logo.png");
  const imageBuffer = await response.arrayBuffer();
  const imageId = workbook.addImage({
    buffer: imageBuffer,
    extension: "png",
  });

  // 🖼️ Inserir imagem (em A1:A4)
  sheet.mergeCells("A1:A4");
  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 80, height: 80 },
  });

  // 🏛️ Cabeçalho da Instituição
  sheet.mergeCells("B1:F1");
  sheet.getCell("B1").value = "Centro de Formação Profissional de São Tomé e Príncipe em Budo-Budo";
  sheet.getCell("B1").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("B1").font = { bold: true, size: 14 };

  // 📌 Título
  sheet.mergeCells("B2:F2");
  sheet.getCell("B2").value = "ESTATÍSTICA DE INSCRIÇÃO";
  sheet.getCell("B2").alignment = { horizontal: "center", vertical: "middle" };
  sheet.getCell("B2").font = { bold: true, size: 12 };

  // 📆 Subtítulo com o ano
  sheet.mergeCells("B3:F3");
  sheet.getCell("B3").value = `Ano de Execução: ${turma?.curso_info.ano || ""}`;
  sheet.getCell("B3").alignment = { horizontal: "center", vertical: "middle" };

  let rowNumber = 5;

  // 📄 Tabela: Informações do Curso
  sheet.mergeCells(`A${rowNumber}`, `F${rowNumber}`);
  sheet.getCell(`A${rowNumber}`).value = "INFORMAÇÕES DO CURSO";
  sheet.getCell(`A${rowNumber}`).font = { bold: true };
  sheet.getCell(`A${rowNumber}`).alignment = { horizontal: "left" };
  rowNumber++;

  const infoCurso = [
    ["PROGRAMA", turma?.curso_info.programa],
    ["AÇÃO", turma?.curso_info.acao],
    ["CURSO", turma?.curso_info.nome_curso],
    ["DATA DE INÍCIO", turma?.curso_info.data_inicio],
    ["DATA DE TÉRMINO", turma?.curso_info.data_termino],
  ];

  infoCurso.forEach(([label, valor]) => {
    sheet.mergeCells(`A${rowNumber}`, `F${rowNumber}`);
    const cell = sheet.getCell(`A${rowNumber}`);
    cell.value = `${label}: ${valor || ""}`;
    cell.alignment = { horizontal: "left", vertical: "middle", wrapText: true };
    cell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };
    rowNumber++;
  });

  rowNumber++; // espaço entre seções

  // 📊 Tabela: Estatísticas Detalhadas
  sheet.mergeCells(`A${rowNumber}`, `F${rowNumber}`);
  sheet.getCell(`A${rowNumber}`).value = "ESTATÍSTICAS DETALHADAS";
  sheet.getCell(`A${rowNumber}`).font = { bold: true };
  sheet.getCell(`A${rowNumber}`).alignment = { horizontal: "left" };
  rowNumber++;

  // Cabeçalho
  const headerRow = sheet.getRow(rowNumber++);
  headerRow.values = ["Categoria", "Quantidade"];
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" }, bottom: { style: "thin" },
      left: { style: "thin" }, right: { style: "thin" },
    };
  });

  // Dados da tabela
  const estatisticas = [
    ["Total Inscritos", turma?.estatisticas_inscricoes.total_inscritos || 0],
    ["Selecionados", turma?.estatisticas_inscricoes.selecionados || 0],
    ["Desistentes", turma?.estatisticas_inscricoes.desistidos || 0],
    ["Não Selecionados", turma?.estatisticas_inscricoes.nao_selecionados || 0],
    ["14 à 17", turma?.faixa_etaria.faixa_14_17 || 0],
    ["18 aos 24", turma?.faixa_etaria.faixa_18_24 || 0],
    ["25 aos 30", turma?.faixa_etaria.faixa_25_30 || 0],
    ["31 aos 35", turma?.faixa_etaria.faixa_31_35 || 0],
    ["36 aos 40", turma?.faixa_etaria.faixa_36_40 || 0],
    ["41 aos 45", turma?.faixa_etaria.faixa_41_45 || 0],
    ["46 aos 50", turma?.faixa_etaria.faixa_46_50 || 0],
    ["+ de 50", turma?.estatisticas_inscricoes.faixa_mais_50 || 0],
    ["Água Grande", turma?.distrito.agua_grande || 0],
    ["Lobata", turma?.distrito.lobata || 0],
    ["Mé-zochi", turma?.distrito.me_zochi || 0],
    ["Cantagalo", turma?.distrito.cantagalo || 0],
    ["Lembá", turma?.distrito.lemba || 0],
    ["Caué", turma?.distrito.caue || 0],
    ["RAP", turma?.distrito.rap || 0],
  ];

  estatisticas.forEach(([categoria, quantidade]) => {
    const row = sheet.getRow(rowNumber++);
    row.getCell(1).value = categoria;
    row.getCell(2).value = quantidade;
    row.getCell(1).alignment = { horizontal: "left" };
    row.getCell(2).alignment = { horizontal: "center" };
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" }, bottom: { style: "thin" },
        left: { style: "thin" }, right: { style: "thin" },
      };
    });
  });

  // 🧾 Largura das colunas
  sheet.columns = [
    { width: 35 }, // Categoria
    { width: 15 }, // Quantidade
    { width: 10 },
    { width: 10 },
    { width: 10 },
    { width: 10 },
  ];

  // 🖨️ Configurar para caber em 1 página A4
  sheet.pageSetup = {
    paperSize: 9, // A4
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    horizontalCentered: true,
    verticalCentered: false,
    margins: {
      left: 0.3, right: 0.3,
      top: 0.5, bottom: 0.5,
      header: 0.2, footer: 0.2,
    },
  };

  const lastRow = sheet.lastRow.number;
  sheet.pageSetup.printArea = `A1:F${lastRow}`;

  // 💾 Exportar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Estatistica_Turma_${turma?.curso_info.nome_curso}.xlsx`);
};
