import axios from "axios";

import { CreatAreaFormacao, GetAreasFormacao, GetDominioFormacao, GetPrograma, UpdateAreaformacao } from "../../../api/urls/rotes_query";
import { API_URL } from "../../../api/urls";

export const CreateAreasFormacao = async (area, token) => {
    try {
      const response = await axios.post(API_URL + CreatAreaFormacao , area,{
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer" + token,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
  export const UpdateAreaformacoes = async (area, token) => {
  
    try {
      const response = await axios.put(API_URL+ UpdateAreaformacao, area, {
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
  export function fetchAreasFormacao(token) {
    return axios
      .get(API_URL + GetAreasFormacao, {
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
  export const DeleteAreaFormacao = async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/areas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response; // retorna o objeto inteiro, incluindo status e data
    } catch (error) {
        // ✅ Captura a resposta do backend, se existir
    if (error.response?.data) {
        throw error.response.data; // backend: { erro: "...", mensagem: "..." }
      }
      // Repassa erro detalhado ao chamador
      throw error.response || { status: 500, data: { erro: "Erro desconhecido" } };
    }
  };

  export const fetchDominiosFormacao = async (token) => {
    const response = await axios.get(`${API_URL}/dominios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const CreateDominioFormacao = async (dominio, token) => {
    const response = await axios.post(`${API_URL}/dominios`, dominio, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const UpdateDominioFormacao = async (dominio, token) => {
    const response = await axios.put(`${API_URL}/dominios/${dominio.id}`, dominio, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };
  
  export const DeleteDominioFormacao = async (id, token) => {
    try {
      const response = await axios.delete(`${API_URL}/dominios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response || { data: { mensagem: "Erro ao eliminar domínio." } };
    }
  };

  export function fetchDominioFormacao(token) {
    return axios
      .get(API_URL + GetDominioFormacao, {
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