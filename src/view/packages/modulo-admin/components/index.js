// Calcula a idade a partir da data de nascimento
export function calcularIdade(dataNascimento) {
    if (!dataNascimento) return '';
  
    const [ano, mes, dia] = dataNascimento.split('-').map(Number);
  
    const nascimento = new Date(ano, mes - 1, dia);
    const hoje = new Date();
  
    let idade = hoje.getFullYear() - nascimento.getFullYear();
  
    const aindaNaoFezAniversario =
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() &&
        hoje.getDate() < nascimento.getDate());
  
    if (aindaNaoFezAniversario) {
      idade--;
    }
  
    return idade;
  }
  
  
  // Formata AAAA/MM/DD → DD/MM/AAAA
  export function formatarDataNascimento(dataNascimento) {
    if (!dataNascimento) return '';
  
    const [ano, mes, dia] = dataNascimento.split('-');
  
    return `${dia}/${mes}/${ano}`;
  }