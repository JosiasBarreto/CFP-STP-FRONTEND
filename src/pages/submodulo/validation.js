import * as Yup from "yup";

export const validationSchema = Yup.object({
  modulo_id: Yup.number()
    .required("Módulo é obrigatório"),

  nome: Yup.string()
    .required("Nome obrigatório")
    .min(2)
    .max(255),

  descricao: Yup.string(),
});