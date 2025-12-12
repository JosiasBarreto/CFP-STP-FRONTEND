import { Formik, Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import {
  Form as BootstrapForm,
  FloatingLabel,
  Button,
  Row,
  Col,
  Form,
} from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

// Mock options
const areaOptions = ['Informática', 'Gestão', 'Saúde'];
const moduloOptions = [
  { id: 1, nome: 'HTML/CSS' },
  { id: 2, nome: 'React' },
  { id: 3, nome: 'Node.js' },
];

const validationSchema = Yup.object().shape({
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

const defaultValues = {
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
  doc_bi: '',
  doc_nif: '',
  doc_habilitacoes: '',
  doc_formacao_prof: '',
  doc_formacao_comp: '',
  doc_cv: '',
  doc_experiencia: '',
  doc_outros: '',
};

export default function FormadorForm({ initialValues, onSuccess }) {
  const safeInitialValues = initialValues ?? defaultValues;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/formadores', {
        method: initialValues?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao guardar');
      return response.json();
    },
    onSuccess,
  });

  const handleFile = (e, fieldName, setFieldValue) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setFieldValue(fieldName, file.name); // ou FileReader base64
    }
  };

  return (
    <div className='bg-white p-4 rounded shadow-sm'>
    <Formik
      initialValues={safeInitialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <FormikForm noValidate>
        
        <Row md={12} xs={12} className="mb-3">
  {[
    ['Control', 'text', 'nome', 'Nome completo', 6],
    ['Control', 'number', 'numero_bi', 'Número BI', 2],
    ['Control', 'number', 'numero_nif', 'Número NIF', 2],
    ['Control', 'number', 'numero_iban', 'IBAN', 2],
    ['Control', 'text', 'banco', 'Banco', 2],
    ['Control', 'text', 'morada', 'Morada', 3],
    ['Select', 'select', 'distrito', 'Distrito', 3, [
      { value: '', label: 'Selecionar' },
      { value: 'agua_grande', label: 'Água Grande' },
      { value: 'lobata', label: 'Lobata' },
      { value: 'me_zochi', label: 'Mé-Zóchi' }
    ]],
    ['Control', 'number', 'contacto', 'Contacto', 2],
    ['Control', 'number', 'contacto_2', 'Outro Contacto', 2],
    ['Control', 'date', 'data_nascimento', 'Data Nascimento', 3],
    ['Select', 'select', 'genero', 'Género', 3, [
      { value: '', label: 'Selecionar' },
      { value: 'masculino', label: 'Masculino' },
      { value: 'feminino', label: 'Feminino' }
    ]],
    ['Select', 'select', 'estado_civil', 'Estado Civil', 3, [
      { value: '', label: 'Selecionar' },
      { value: 'solteiro', label: 'Solteiro(a)' },
      { value: 'casado', label: 'Casado(a)' },
      { value: 'divorciado', label: 'Divorciado(a)' }
    ]],
  ].map(([form, type, name, label, col, options]) => (
    <Col md={col} key={name}>
      <FloatingLabel label={label} className="mb-4">
        {form === 'Select' ? (
          <BootstrapForm.Select
            className="input_left_color p-2"
            name={name}
            value={values[name]}
            onChange={handleChange}
            isInvalid={touched[name] && !!errors[name]}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </BootstrapForm.Select>
        ) : (
          <Form.Control
            className="input_left_color p-2"
            name={name}
            type={type}
            value={values[name]}
            onChange={handleChange}
            isInvalid={touched[name] && !!errors[name]}
            placeholder={label}
          />
        )}
        <BootstrapForm.Control.Feedback type="invalid">
          {errors[name]}
        </BootstrapForm.Control.Feedback>
      </FloatingLabel>
    </Col>
  ))}
</Row>

          <h5 className="mt-4">🎓 Formação e Experiência</h5>
          <Row>
            {[
              ['habilitacao_literaria', 'Habilitação Literária'],
              ['formacao_profissional', 'Formação Profissional'],
              ['formacao_complementar', 'Formação Complementar'],
              ['experiencia_trabalho', 'Experiência Profissional'],
              ['observacao', 'Observações'],
            ].map(([name, label]) => (
              <Col md={6} key={name}>
                <FloatingLabel label={label} className="mb-3">
                  <BootstrapForm.Control
                    as="textarea"
                    name={name}
                    value={values[name]}
                    onChange={handleChange}
                    style={{ height: '100px' }}
                  />
                </FloatingLabel>
              </Col>
            ))}

            <Col md={6}>
              <BootstrapForm.Check
                className="mb-4"
                type="checkbox"
                label="Possui Formação Pedagógica"
                name="formacao_pedagogica"
                checked={values.formacao_pedagogica}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <h5 className="mt-4">📚 Área de Candidatura e Módulos</h5>
          <Row>
            <Col md={6}>
              <FloatingLabel label="Área de candidatura" className="mb-3">
                <BootstrapForm.Select
                  name="area_candidatura"
                  value={values.area_candidatura}
                  onChange={handleChange}
                  isInvalid={touched.area_candidatura && !!errors.area_candidatura}
                >
                  <option value="">Selecionar</option>
                  {areaOptions.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </BootstrapForm.Select>
              </FloatingLabel>
            </Col>

            <Col md={6}>
              <FloatingLabel label="Módulos que pretende lecionar" className="mb-3">
                <BootstrapForm.Select
                  multiple
                  name="modulos"
                  value={values.modulos.map((m) => m.id.toString())}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, (opt) => {
                      const modulo = moduloOptions.find((m) => m.id.toString() === opt.value);
                      return modulo ? { id: modulo.id, nome: modulo.nome } : null;
                    }).filter(Boolean);
                    setFieldValue('modulos', selected);
                  }}
                >
                  {moduloOptions.map((modulo) => (
                    <option key={modulo.id} value={modulo.id}>
                      {modulo.nome}
                    </option>
                  ))}
                </BootstrapForm.Select>
              </FloatingLabel>
            </Col>
          </Row>

          <h5 className="mt-4">📎 Documentos</h5>
          <Row>
            {[
              ['doc_bi', 'Documento BI'],
              ['doc_nif', 'Documento NIF'],
              ['doc_habilitacoes', 'Certificado Habilitações'],
              ['doc_formacao_prof', 'Certificado Formação Profissional'],
              ['doc_formacao_comp', 'Certificado Formação Complementar'],
              ['doc_cv', 'Currículo Vitae'],
              ['doc_experiencia', 'Comprovativo de Experiência'],
              ['doc_outros', 'Outros Documentos'],
            ].map(([name, label]) => (
              <Col md={6} key={name}>
                <BootstrapForm.Group controlId={name} className="mb-3">
                  <BootstrapForm.Label>{label}</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="file"
                    name={name}
                    onChange={(e) => handleFile(e, name, setFieldValue)}
                  />
                  {values[name] && (
                    <div className="mt-1 text-muted small">{values[name]}</div>
                  )}
                </BootstrapForm.Group>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" disabled={mutation.isLoading}>
              {initialValues?.id ? 'Atualizar' : 'Registar'}
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
    </div>
  );
}
