import axios from "axios";
import { API_URL } from "./urls";

/**
 * Listar formadores com filtros avançados
 * @param {Object} filtros
 */
export async function listarFormadores(filtros = {}) {
  const params = new URLSearchParams();

  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });

  const res = await axios.get(`${API_URL}/api/formadores?${params.toString()}`);
  const data = res.data;
  return data;
}

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
  return res.data;
};
//@formador_bp.route("/<int:id>", methods=["PUT"])
//enviar id do formador no cabeçalho e o dados no corpo
export const atualizarFormador = async (id, data) => {
  try {
        const res = await axios.put(API_URL + `/api/formadores/${id}`, data);
        return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



export const atualizarDominiosFormador = async ({ formadorId, dominios }) => {
  const { data } = await axios.put(
    `${API_URL}/formadores/${formadorId}/dominios`,
    { dominios }
  );
  return data;
};
export const adicionarDominiosFormador = async ({ formadorId, dominios }) => {
 
  const res = await axios.post(`${API_URL}/api/formadores/${formadorId}/dominios`, {
    dominios,
  });
  return res.data;
};

export const obterDominiosFormador = async (formadorId) => {

  const { data } = await axios.get(
    `${API_URL}/api/formadores/${formadorId}/dominios`
  );
  return data;
}