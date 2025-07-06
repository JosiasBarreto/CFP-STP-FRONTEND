import React from "react";  
import FormadorForm from "./formador_formulario";
import { ToastContainer } from "react-toastify";

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
      <FormadorForm initialValues={defaultInitialValues} />
      <ToastContainer />
    </div>
  );
}