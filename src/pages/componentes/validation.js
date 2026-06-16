import * as Yup from "yup";

export const componenteSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome é obrigatório")
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),

  descricao: Yup.string()
    .nullable()
    .max(500, "Máximo 500 caracteres"),
});