import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportTurmaStyledExcel = async (turma) => {
  const workbook = new ExcelJS.Workbook();

  // Carregar template pronto com placeholders
  const templateResponse = await fetch("/template.xlsx");
  const templateArrayBuffer = await templateResponse.arrayBuffer();
  await workbook.xlsx.load(templateArrayBuffer);

  const sheet = workbook.getWorksheet(1);

  // 📷 Carregar imagem do logo
  const logoResponse = await fetch("/logo.png");
  const logoBuffer = await logoResponse.arrayBuffer();
  const imageId = workbook.addImage({
    buffer: logoBuffer,
    extension: "png",
  });

  // 🖼️ Inserir imagem (em A1:A4)
  sheet.mergeCells("A1:A4");
  sheet.addImage(imageId, {
    tl: { col: 0, row: 0 },
    ext: { width: 80, height: 80 },
  });

  // 🔁 Substituir todos os placeholders no Excel
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (typeof cell.value === "string") {
        cell.value = cell.value
          .replace("{ANO}", turma?.curso_info.ano || "")
          .replace("{PROGRAMA}", turma?.curso_info.programa || "")
          .replace("{ACAO}", turma?.curso_info.acao || "")
          .replace("{CURSO}", turma?.curso_info.nome_curso || "")
          .replace("{DATA_INICIO}", turma?.curso_info.data_inicio || "")
          .replace("{DATA_TERMINO}", turma?.curso_info.data_termino || "")

          // Estatísticas principais
          .replace("{TOTAL_INSCRITOS}", turma?.estatisticas_inscricoes.total_inscritos || 0)
          .replace("{SELECIONADOS}", turma?.estatisticas_inscricoes.selecionados || 0)
          .replace("{DESISTENTES}", turma?.estatisticas_inscricoes.desistidos || 0)
          .replace("{NAO_SELECIONADOS}", turma?.estatisticas_inscricoes.nao_selecionados || 0)
          .replace("{FAIXA_MAIS_50}", turma?.estatisticas_inscricoes.faixa_mais_50 || 0)

          // Faixa etária
          .replace("{FAIXA_14_17}", turma?.faixa_etaria.faixa_14_17 || 0)
          .replace("{FAIXA_18_24}", turma?.faixa_etaria.faixa_18_24 || 0)
          .replace("{FAIXA_25_30}", turma?.faixa_etaria.faixa_25_30 || 0)
          .replace("{FAIXA_31_35}", turma?.faixa_etaria.faixa_31_35 || 0)
          .replace("{FAIXA_36_40}", turma?.faixa_etaria.faixa_36_40 || 0)
          .replace("{FAIXA_41_45}", turma?.faixa_etaria.faixa_41_45 || 0)
          .replace("{FAIXA_46_50}", turma?.faixa_etaria.faixa_46_50 || 0)

          // Distritos
          .replace("{AGUA_GRANDE}", turma?.distrito.agua_grande || 0)
          .replace("{LOBATA}", turma?.distrito.lobata || 0)
          .replace("{ME_ZOCHI}", turma?.distrito.me_zochi || 0)
          .replace("{CANTAGALO}", turma?.distrito.cantagalo || 0)
          .replace("{LEMBA}", turma?.distrito.lemba || 0)
          .replace("{CAUE}", turma?.distrito.caue || 0)
          .replace("{RAP}", turma?.distrito.rap || 0);
      }
    });
  });

  // Ajustes finais do layout (se necessário)
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

  // Definir a área de impressão até a última linha usada
  const lastRow = sheet.lastRow?.number || 50;
  sheet.pageSetup.printArea = `A1:F${lastRow}`;

  // 💾 Exportar como arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const nomeArquivo = `Estatistica_Turma_${turma?.curso_info.nome_curso || "curso"}.xlsx`;
  saveAs(new Blob([buffer]), nomeArquivo);
};
