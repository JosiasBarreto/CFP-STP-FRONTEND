import axios from "axios";
import { API_URL } from "../../../api/urls";

export const buscarFormandoPorProcesso = async (token, processo) => {
  const response = await axios.get(
    `${API_URL}/formando/buscar-por-processo/${processo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
