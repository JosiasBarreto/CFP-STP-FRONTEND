import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Obrigatório'),
  numero_bi: Yup.string().required('Obrigatório'),
  numero_nif: Yup.string().required('Obrigatório'),
  numero_iban: Yup.string().required('Obrigatório'),
  banco: Yup.string().required('Obrigatório'),
  data_nascimento: Yup.date().required('Obrigatório'),
  morada: Yup.string().required('Obrigatório'),
  distrito: Yup.string().required('Obrigatório'),
  genero: Yup.string().required('Obrigatório'),
  habilitacao_literaria: Yup.string().required('Obrigatório'),
  area_candidatura: Yup.string().required('Obrigatório'),
});
