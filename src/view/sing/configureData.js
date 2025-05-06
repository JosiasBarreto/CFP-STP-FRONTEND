const hoje = new Date();
const dia = String(hoje.getDate()).padStart(2, '0');
const mes = String(hoje.getMonth() + 1).padStart(2, '0');
const ano = hoje.getFullYear();
export const dataHojeFormatada = `${dia}/${mes}/${ano}`;

export function formatarData(dataString) {
    if (!dataString) return "";
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear()).slice();
    return `${dia}/${mes}/${ano}`;
  }