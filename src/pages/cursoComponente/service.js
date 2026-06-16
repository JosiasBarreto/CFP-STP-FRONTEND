import axios from "axios";
import { API_URL } from "../../api/urls";


const GetCursoComponente = "/api/curso-componentes";
const AddCursoComponente = "/api/curso-componentes";
const UpdateCursoComponente = "/api/curso-componentes";
const DeleteCursoComponente = "/api/curso-componentes";

export function fetchCursoComponentes(
  token,
  filtros
) {
  return axios
    .get(API_URL + GetCursoComponente, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: filtros,
    })
    .then((response) => response.data);
}

export function registarCursoComponente(
  data,
  token
) {
  return axios.post(
    API_URL + AddCursoComponente,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function atualizarCursoComponente(
  data,
  token
) {
  return axios.put(
    `${API_URL + UpdateCursoComponente}/${data.ID}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function deleteCursoComponente(
  id,
  token
) {
  return axios.delete(
    `${API_URL + DeleteCursoComponente}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}