import axios from "axios";
import { API_URL } from "../../api/urls";
import { DeleteUser, GetCurso, GetCursof, GetPrograma, Getuser, PostCurso, PostPrograma, PostUser, PutCurso, PutPrograma, PutUser } from "../../api/urls/rotes_query";

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
      console.error("Erro ao atualizar distrito:", error);
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