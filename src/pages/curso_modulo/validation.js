import * as Yup from "yup";

export const validationSchema = Yup.object({
  curso_componente_id: Yup.number()
    .required("Curso Componente é obrigatório"),

  modulo_id: Yup.number()
    .required("Módulo é obrigatório"),

  carga_horaria: Yup.number()
    .required("Carga horária obrigatória")
    .min(1),

  ordem: Yup.number()
    .required("Ordem obrigatória")
    .min(1),
});