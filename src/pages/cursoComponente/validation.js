import * as Yup from "yup";

export const validationSchema =
  Yup.object().shape({
    curso_id: Yup.number()
      .required("Curso obrigatório"),

    componente_id: Yup.number()
      .required("Componente obrigatório"),

    carga_horaria: Yup.number()
      .required("Carga horária obrigatória")
      .min(1),

    ordem: Yup.number()
      .required("Ordem obrigatória")
      .min(1),
  });