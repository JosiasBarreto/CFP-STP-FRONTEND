import axios, { Axios } from "axios";
import api from "./api";
import { API_URL } from "./urls";

export const criarExperiencia = async (data) => {
  const res = await axios.post(`${API_URL}/formadores/experiencias`, data);
  return res.data;
};

export const atualizarExperiencia = async ({ id, data }) => {
  const res = await axios.put(`${API_URL}/formadores/experiencias/${id}`, data);
  return res.data;
};

export const removerExperiencia = async (id) => {
  const res = await axios.delete(`${API_URL}/formadores/experiencias/${id}`);
  return res.data;
};
