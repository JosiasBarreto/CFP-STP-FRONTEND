import React from "react";  

import { ToastContainer } from "react-toastify";
import FormadorForm from "./FormadorForm";
import FormadorDetail from "../../page/Formador/formador/FormadorDetail";
import InscricaoFormador from "../../page/Formador/formador/Inscricao/InscricaoFormador";

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
      <InscricaoFormador />
      <ToastContainer />
    </div>
  );
}