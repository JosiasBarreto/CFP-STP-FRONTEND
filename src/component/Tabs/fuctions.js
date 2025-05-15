export function classificarFormandos(dados) {
    const resultado = {
      matriculados: [],
      desistentes: [],
      nao_matriculados: [],
      pendentes: [],
    };
  
    dados.forEach((formando) => {
      const cursos = formando.cursos_inscritos || [];
  
      const temSelecionado = cursos.some(c => c.status === "selecionado");
      const temSuplente = cursos.some(c => c.status === "suplente");
  
      if (formando.status_matricula === "ativo" && temSelecionado) {
        resultado.matriculados.push(formando);
      } else if (formando.status_matricula === "inativo" && temSelecionado) {
        resultado.desistentes.push(formando);
      } else if (formando.tem_matricula === false && temSelecionado) {
        resultado.nao_matriculados.push(formando);
      } else if (formando.tem_matricula === false && temSuplente) {
        resultado.pendentes.push(formando);
      }
    });
  
    return resultado;
  }
  