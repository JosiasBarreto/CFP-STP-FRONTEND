import axios from "axios";
import { API_URL } from "../../api/urls";



export const fetchSubModulos = async (
  token,
  filtros = {}
) => {
  const response = await axios.get(
    `${API_URL}/api/submodulos`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filtros,
    }
  );

  return response.data;
};

export const registarSubModulo = async (
  data,
  token
) => {
  return axios.post(
    `${API_URL}/api/submodulos`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const atualizarSubModulo = async (
  data,
  token,
  id
) => {
  return axios.put(
    `${API_URL}/api/submodulos/${id}`,
    {
      modulo_id: data.modulo_id,
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

export const deleteSubModulo = async (
  id,
  token
) => {
  return axios.delete(
    `${API_URL}/api/submodulos/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};