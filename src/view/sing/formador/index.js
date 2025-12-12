import React from "react";  

import { ToastContainer } from "react-toastify";
import FormadorForm from "./FormadorForm";

export function FormadorForms() {
    const defaultInitialValues = {
        nome: '',
        numero_bi: '',
        numero_nif: '',
        numero_iban: '',
        banco: '',
        data_nascimento: '',
        estado_civil: '',
        morada: '',
        distrito: '',
        genero: '',
        habilitacao_literaria: '',
        formacao_profissional: '',
        formacao_complementar: '',
        experiencia_trabalho: '',
        area_candidatura: '',
        observacao: '',
        formacao_pedagogica: false,
        modulos: [],
      };
  return (
    <div>
      <FormadorForm  />
      <ToastContainer />
    </div>
  );
}