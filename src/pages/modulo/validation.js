import * as Yup from "yup";

export const validationSchema = Yup.object({
  nome: Yup.string()
    .required("Nome obrigatório")
    .min(2, "Mínimo 2 caracteres")
    .max(255, "Máximo 255 caracteres"),

  descricao: Yup.string(),
});