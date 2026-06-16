import axios from "axios";

import { API_URL } from "../../api/urls";

const ENDPOINT = "/api/curso-modulos";

export const fetchCursoModulos = async (
  token,
  filtros = {}
) => {
  const response = await axios.get(
    `${API_URL}${ENDPOINT}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filtros,
    }
  );

  return response.data;
};

export const registarCursoModulo = async (
  data,
  token
) => {
  const response = await axios.post(
    `${API_URL}${ENDPOINT}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const atualizarCursoModulo = async (
  data,
  token,
  id
) => {
  const response = await axios.put(
    `${API_URL}${ENDPOINT}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteCursoModulo = async (
  id,
  token
) => {
  const response = await axios.delete(
    `${API_URL}${ENDPOINT}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};