// Status function for handling different statuses in the application
import axios from "axios";
import {
  PostStatusInscricao,
  GetStatusInscricao,
  PutStatusInscricao,
  PatchStatusInscricao,
} from "./urls.js";
import { API_URL } from "../../../api/urls/index.js";

// Registar uma nova campanha de inscrição
export const registarStatusInscricao = async (dados, token) => {
  try {
    const response = await axios.post(
      API_URL + PostStatusInscricao,
      dados,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

// Buscar campanha de inscrição por ano
export const buscarStatusInscricao = async (ano, token) => {
  try {
    const response = await axios.get(
      `${API_URL}${GetStatusInscricao}/${ano}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

// Atualizar dados da campanha
export const atualizarStatusInscricao = async (dados, token) => {
  try {
    const { id, ...informacoes } = dados;

    const response = await axios.put(
      `${API_URL}${PutStatusInscricao}/${id}`,
      informacoes,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

// Ativar ou desativar campanha
export const alterarStatusInscricao = async (id, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}${PatchStatusInscricao}/${id}/status`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};
export const listarConfiguracoesInscricao = async (token) => {
  try {
    const response = await axios.get(
      API_URL + GetStatusInscricao,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};