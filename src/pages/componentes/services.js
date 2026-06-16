import axios from "axios";

import { API_URL } from "../../api/urls";

export const fetchComponentes = async (
  token,
  page = 1,
  perPage = 15,
  nome = ""
) => {
  const response = await axios.get(`${API_URL}/api/componentes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      per_page: perPage,
      nome,
    },
  });

  return response.data;
};

export const registarComponente = async (data, token) => {
  return await axios.post(`${API_URL}/api/componentes`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const atualizarComponente = async (
  id,
  data,
  token
) => {
  return await axios.put(`${API_URL}/api/componentes/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteComponente = async (
  id,
  token
) => {
  return await axios.delete(`${API_URL}/api/componentes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};