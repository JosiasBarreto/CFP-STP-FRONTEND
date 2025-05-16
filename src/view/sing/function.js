import axios from "axios";
import { API_URL } from "../../api/urls";
import { DeleteUser, FiltroEstatisticoturma, FiltroInscricao, FiltroMatricula, GetCurso, GetCursof, GetPrograma, Getuser, LastFormandosID, Matricula, PostCurso, PostPrograma, PostUser, PutCurso, PutPrograma, PutUser, SelectInscrito } from "../../api/urls/rotes_query";

export const registarUser = async (uses, token) => {
    try {
      const response = await axios.post(API_URL + PostUser, uses);
      return response;
    } catch (error) {
      throw error;
    }
  };
  export const registarPrograma = async (programa, token) => {
    try {
      const response = await axios.post(API_URL + PostPrograma, programa);
      return response;
    } catch (error) {
      throw error;
    }
  };
  export const registarCurso = async (data, token) => {
    try {
      const response = await axios.post(API_URL + PostCurso, data);
      return response;
    } catch (error) {
      throw error;
    }
  };
  export const atualizarUser = async (uses, token) => {
  
    try {
      const response = await axios.put(API_URL+ PutUser, uses, {
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer" + token,
        },
      });
     
      return response;
      
    } catch (error) {
      console.error("Erro ao atualizar utilizador:", error);
      throw error;
    }
  };
  export const atualizarPrograma = async (programas, token) => {
  
    try {
      const response = await axios.put(API_URL+ PutPrograma, programas, {
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer" + token,
        },
      });
     
      return response;
      
    } catch (error) {
      console.error("Erro ao atualizar distrito:", error);
      throw error;
    }
  };
  export const atualizarCurso = async (datas, token) => {
  
    try {
      const response = await axios.put(API_URL+ PutCurso, datas, {
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer" + token,
        },
      });
     
      return response;
      
    } catch (error) {
      console.error("Erro ao atualizar distrito:", error);
      throw error;
    }
  };
  export const deleteUser = async (id, token) => {
    try {
      const response = await axios.delete(API_URL + '/users', {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: { id: id } // Aqui estamos enviando o `id` no corpo da requisição
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  export const deletePrograma = async (id, token) => {
    try {
      const response = await axios.delete(API_URL + "/programa", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id } // Enviando o ID no corpo da requisição
      });
      return response.data; // Retorna os dados da resposta do backend
    } catch (error) {
      throw error.response?.data || error.message || "Erro desconhecido"; 
    }
  };
  export const deleteCurso = async (id, token) => {
    try {
      const response = await axios.delete(API_URL + "/curso", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { id } // Enviando o ID no corpo da requisição
      });
      return response.data; // Retorna os dados da resposta do backend
    } catch (error) {
      throw error.response?.data || error.message || "Erro desconhecido"; 
    }
  };
  
  
  export function fetchUsers(token) {
    return axios
      .get(API_URL + Getuser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
  }
  export function fetchProgramas(token) {
    return axios
      .get(API_URL + GetPrograma, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar programa:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
  }
  export function LastIdFormando(token) {
    return axios
      .get(API_URL + LastFormandosID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar programa:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
  }
  
  export function fetchCursos(token, data) {
    return axios
      .post(API_URL + GetCurso, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar cursos:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
  }
  export function fetchCursosAno(token, data) {
    return axios
      .post(API_URL + GetCursof, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar cursos:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
  }
  export function BuscarInscricao(token, data) {
    return axios
      .post(API_URL + FiltroInscricao, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",  // Garantir que o tipo de conteúdo é JSON
        },
      })
      .then((response) => response.data) // Retorna os dados da resposta
      .catch((error) => {
        console.error("Erro ao buscar inscrição:", error);
        throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
      });
}
export function Buscarmatricula(token, data) {
  return axios
    .post(API_URL + FiltroMatricula, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",  // Garantir que o tipo de conteúdo é JSON
      },
    })
    .then((response) => response.data) // Retorna os dados da resposta
    .catch((error) => {
      console.error("Erro ao buscar inscrição:", error);
      throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
    });
}
export function BuscarTurma(token, data) {
  return axios
    .post(API_URL + FiltroEstatisticoturma, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",  // Garantir que o tipo de conteúdo é JSON
      },
    })
    .then((response) => response.data) // Retorna os dados da resposta
    .catch((error) => {
      console.error("Erro ao buscar inscrição:", error);
      throw error; // Rejeita a promessa para permitir tratamento do erro no código que chamar a função
    });
}

export function formatarNomeReducaoProgressiva(nomeCompleto, limite = 40) {
  if (!nomeCompleto || typeof nomeCompleto !== "string") return "";

  // Separar qualquer conteúdo entre parênteses para preservar
  const matchParenteses = nomeCompleto.match(/\(.*?\)$/);
  const sufixoParenteses = matchParenteses ? matchParenteses[0] : "";
  const nomeBase = matchParenteses ? nomeCompleto.replace(sufixoParenteses, "").trim() : nomeCompleto;

  // Lista de palavras que devem ser mantidas (preposições, conjunções comuns)
  const manterInteiras = ["DE", "DO", "DA", "E", "EM", "DOS", "DAS"];

  // Começa a construir o nome abreviado
  const partes = nomeBase.trim().split(/\s+/);
  const partesAbreviadas = partes.map(palavra => {
    const upper = palavra.toUpperCase();

    if (manterInteiras.includes(upper)) {
      return upper;
    }

    if (upper.length <= 3) {
      return upper;
    }

    // Abreviação por padrão: 3 primeiras letras + ponto
    return upper.slice(0, 3) + ".";
  });

  let resultado = "";
  for (let i = 0; i < partesAbreviadas.length; i++) {
    const tentativa = (resultado + " " + partesAbreviadas[i]).trim();
    if ((tentativa + " " + sufixoParenteses).length <= limite) {
      resultado = tentativa;
    } else {
      break;
    }
  }

  // Adiciona o sufixo (ex: "(inscrito)") se couber no limite
  if ((resultado + " " + sufixoParenteses).length <= limite) {
    resultado += " " + sufixoParenteses;
  }

  return resultado.trim();
}


export const Selecaomassa = async (data, token) => {
  try {
    const response = await axios.post(API_URL + SelectInscrito, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const Confirmar_Opcao_Matricula = async (data, token) => {
  try {
    const response = await axios.post(API_URL + Matricula, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
