import * as Yup from 'yup';

export const formadorValidationSchema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  numero_bi: Yup.string().required('BI é obrigatório'),
  numero_nif: Yup.string().required('NIF é obrigatório'),
  numero_iban: Yup.string().required('IBAN é obrigatório'),
  banco: Yup.string().required('Banco é obrigatório'),
  data_nascimento: Yup.date().required('Data de nascimento é obrigatória'),
  estado_civil: Yup.string(),
  morada: Yup.string().required('Morada é obrigatória'),
  distrito: Yup.string().required('Distrito é obrigatório'),
  genero: Yup.string().required('Género é obrigatório'),
  habilitacao_literaria: Yup.string().required('Habilitação é obrigatória'),
  formacao_profissional: Yup.string(),
  formacao_complementar: Yup.string(),
  experiencia_trabalho: Yup.string(),
  area_candidatura: Yup.string().required('Área é obrigatória'),
  observacao: Yup.string(),
  formacao_pedagogica: Yup.boolean(),
  modulos: Yup.array(),
});
