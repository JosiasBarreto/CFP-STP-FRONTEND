import axios from "axios";

export const uploadDocumentos = async ({ formadorId, formData }) => {
  const { data } = await axios.post(
    `/formadores/${formadorId}/documentos`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return data;
};
