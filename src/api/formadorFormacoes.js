import axios from "axios";
import api from "./api";
import { API_URL } from "./urls";

export const criarFormacao = async (data) => {
  const res = await axios.post(`${API_URL}/formadores/formacoes`, data);
  return res.data;
};

export const atualizarFormacao = async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/formadores/formacoes/${id}`, data);
  return res.data;
};

export const removerFormacao = async (id) => {
  const res = await axios.delete(`${API_URL}/formadores/formacoes/${id}`);
  return res.data;
};
