import * as Yup from 'yup';
export const rowSchema = Yup.object().shape({
    nome: Yup.string().required('Nome obrigatório'),
    sexo: Yup.string().required('Sexo obrigatório').oneOf(['Masculino', 'Feminino'], 'Sexo inválido'),
    telefone: Yup.string().required('Telefone obrigatório').matches(/^[0-9]+$/, 'Telefone inválido'),
    bi: Yup.string().required('BI obrigatório').min(6, 'BI inválido'),
    email: Yup.string().email('Email inválido').nullable(),
    distrito: Yup.string().nullable(),
    naturalidade: Yup.string().nullable(),
    estado_civil: Yup.string().nullable(),
});
export const validateRow = async (row) => {
    try {
        await rowSchema.validate(row, { abortEarly: false });
        return { isValid: true, errors: {} };
    }
    catch (err) {
        if (err instanceof Yup.ValidationError) {
            const errors = {};
            err.inner.forEach((error) => {
                if (error.path) {
                    errors[error.path] = error.message;
                }
            });
            return { isValid: false, errors };
        }
        return { isValid: false, errors: { _general: 'Erro de validação' } };
    }
};
