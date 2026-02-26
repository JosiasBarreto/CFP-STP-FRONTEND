// services/crachaService.js
import axios from "axios";
import { API_URL } from "../../../api/urls";

export const gerarCrachasAPI = async (datas) => {
  const response = await axios.post(
    `${API_URL}/documents/gerar-crachas`,
    datas,
    { responseType: "blob" }
  );

  return response;
};
export const buscarDocumentosCrachar = async (token, datar) => {
  const response = await axios.get(`${API_URL}/documents`, {
    headers: { Authorization: `Bearer ${token}` },
    params: datar,
  });

  return response.data;
};