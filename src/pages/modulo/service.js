import axios from "axios";
import { API_URL } from "../../api/urls";



export const fetchModulos = async (
  token,
  filtros = {}
) => {
  const response = await axios.get(
    `${API_URL}/api/modulos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filtros,
    }
  );

  return response.data;
};

export const registarModulo = async (
  data,
  token
) => {
  return axios.post(
    `${API_URL}/api/modulos`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const atualizarModulo = async (
    data,
    token,
    id
  ) => {
  
    return axios.put(
      `${API_URL}/api/modulos/${id}`,
      {
        nome: data.nome,
        descricao: data.descricao,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

export const deleteModulo = async (
  ID,
  token
) => {
  return axios.delete(
    `${API_URL}/api/modulos/${ID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};