import axios from "axios";
import { API_URL } from "./urls";

export const criarFormacao = async ({ formadorId, payload }) => {
  
  const { data } = await axios.post(
    API_URL+`/api/formadores/${formadorId}/formacoes`,
    payload
  );
  return data;
};
///<int:formador_id>/formacoes/<int:formacao_id>
export const atualizarFormacao = async ({ formador_id, formacao_id, payload }) => {
  
  const { data } = await axios.put( API_URL +
    `/api/formadores/${formador_id}/formacoes/${formacao_id}`,
    payload
  );
  return data;
};

export const removerFormacao = async (formadorId, formacao_id) => {
 
  const { data } = await axios.delete(API_URL +
    `/api/formadores/${formadorId}/formacoes/${formacao_id}`
  );
  return data;
};
export const listarFormacoes = async (formadorId) => {
  const { data } = await axios.get(
    `${API_URL}/api/formadores/${formadorId}/formacoes`
  );
  return data;
};
//<int:formador_id>/formacoes"
export const obterFormacaoPorId = async (formadorId) => {

  const { data } = await axios.get(
    `${API_URL}/api/formadores/${formadorId}/formacoes`
  );
  return data;
};
