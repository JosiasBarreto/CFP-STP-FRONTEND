import * as Yup from "yup";

export const formadorSchema = Yup.object({
  codigo: Yup.string().required("Código obrigatório"),
  nome: Yup.string().required("Nome obrigatório"),
  numero_bi: Yup.string().required("BI obrigatório"),
  numero_nif: Yup.string().required("NIF obrigatório"),
  data_nascimento: Yup.date().required("Data obrigatória"),
  genero: Yup.string().required("Género obrigatório"),
  morada: Yup.string().required("Morada obrigatória"),
  distrito: Yup.string().required("Distrito obrigatório"),
  banco: Yup.string().required("Banco obrigatório"),
  numero_iban: Yup.string().required("IBAN obrigatório"),
  numero_nib: Yup.string().required("NIB obrigatório"),
  dominios: Yup.array().min(1, "Selecione pelo menos um domínio"),
});
