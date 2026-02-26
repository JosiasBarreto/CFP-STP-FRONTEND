import axios from "axios";
import { API_URL } from "./urls";

export const getTiposFormacao = async () => {
  const { data } = await axios.get(API_URL+"/api/tipos-formacao");
  return data;
};

export const getTiposDocumento = async () => {
  const { data } = await axios.get(API_URL+"/api/tipos-documento");
  return data;
};

export const getDominios = async () => {
  const { data } = await axios.get(API_URL+"/dominios");
  return data;
};

export const getModulos = async () => {
  const { data } = await axios.get(API_URL+"/api/modulos");
  return data;
};




