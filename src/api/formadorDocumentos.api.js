import axios from "axios";
import { API_URL } from "./urls";

/* 🔹 Upload */
export const uploadDocumento = async ({
  formadorId,
  tipoDocumentoId,
  file,
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("tipo_documento_id", tipoDocumentoId);

  const { data } = await axios.post(
    `${API_URL}/api/formadores/${formadorId}/documentos`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};

/* 🔹 Listar documentos do formador */
export const getDocumentosFormador = async (formadorId) => {
  const { data } = await axios.get(
    `${API_URL}/api/formadores/${formadorId}/documentos`
  );
  return data;
};
export const getTiposDocumento = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/tipos-documento`
  );
  return data;
};