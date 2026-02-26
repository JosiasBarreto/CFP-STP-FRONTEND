import axios from "axios";
import { API_URL } from "./urls";


// ➕ Criar experiência para um formador
export const criarExperiencia = async (formadorId, payload) => {
  
  const { data } = await axios.post(
    `${API_URL}/api/formadores/${formadorId}/experiencias`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
//"/<int:formador_id>/experiencias/<int:experiencia_id>"
// ✏️ Atualizar experiência
export const atualizarExperiencia = async ({ formador_id, payload, experiencia_id}) => {
 
  const { data } = await axios.put(
    `${API_URL}/api/formadores/${formador_id}/experiencias/${experiencia_id}`,
    payload
  );
  return data;
};

// ❌ Remover experiência
export const removerExperiencia = async ({ formador_id, experiencia_id }) => {

  alert(experiencia_id);
  const { data } = await axios.delete(
    `${API_URL}/api/formadores/${formador_id}/experiencias/${experiencia_id}`
  );
  return data;
};

export const listarExperiencias = async (formadorId) => {
  if (!formadorId) return [];

  const { data } = await axios.get(
    `${API_URL}/api/formadores/${formadorId}/experiencias`
  );
  return data;
};

