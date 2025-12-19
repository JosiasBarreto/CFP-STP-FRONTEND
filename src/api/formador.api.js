import axios from "axios";
import { API_URL } from "./urls";

export const createFormador = async (payload) => {
  const { data } = await axios.post(API_URL+"/formadores", payload);
  return data;
};

export const getFormador = async (id) => {
  const { data } = await axios.get(API_URL+ `/formadores/${id}`);
  return data;
};

export const updateFormador = async ({ id, payload }) => {
  const { data } = await axios.put(`/formadores/${id}`, payload);
  return data;
};
// api/formador.api.js


export const criarFormador = async (data) => {
  const res = await axios.post(API_URL + "/api/formadores", data);
  return res.data.data;
};


export const atualizarDominiosFormador = async ({ formadorId, dominios }) => {
  const { data } = await axios.put(
    `${API_URL}/formadores/${formadorId}/dominios`,
    { dominios }
  );
  return data;
};
export const adicionarDominiosFormador = async ({ formadorId, dominios }) => {
  const value = 7;
  const res = await axios.post(`${API_URL}/api/formadores/${value}/dominios`, {
    dominios,
  });
  return res.data;
};

export const obterDominiosFormador = async (formadorId) => {
  const value = 7;
  const { data } = await axios.get(
    `${API_URL}/api/formadores/${value}/dominios`
  );
  return data;
}