import { Formik, Form as FormikForm } from "formik";
import { Row, Col, Button, Form as BootstrapForm, FloatingLabel, Container } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { validationSchema } from "./validations";
import { defaultValues } from "./defaultValues";
import { personalFields, areaOptions, moduloOptions, documentFields, formacaoOptions } from "./fields";
import DynamicField from "./DynamicField";

export default function FormadorForm({ initialValues, onSuccess }) {
  const safeInitialValues = initialValues ?? defaultValues;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/formadores", {
        method: initialValues?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erro ao guardar");
      return response.json();
    },
    onSuccess,
  });

  const handleFile = (e, fieldName, setFieldValue) => {
    const file = e.currentTarget.files[0];
    if (file) setFieldValue(fieldName, file.name);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <Formik
        initialValues={safeInitialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => mutation.mutate(values)}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <FormikForm noValidate>
            
            <Row className="mb-3" md={12} >
              <Col md={10} className="bg-white p-0 m-0">
              <div className="d-flex flex-wrap ">  
              {personalFields.map(([form, type, name, label, largura, options]) => (
                <DynamicField
                  key={name}
                  form={form}
                  type={type}
                  name={name}
                  label={label}
                  largura={largura}
                  options={options || []}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                />
              ))}
              </div>
              </Col>
              <Col md={2}>
                <FloatingLabel label="Área de Candidatura" className="mb-4">
                  <BootstrapForm.Select 
                    className="input_left_color p-2 "
                    name="area_candidatura"
                    value={values.area_candidatura}
                    onChange={handleChange}
                    isInvalid={touched.area_candidatura && !!errors.area_candidatura}
                  > 
                    <option value="">Selecionar</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>  
                        {area}
                      </option>
                    ))}
                  </BootstrapForm.Select>
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.area_candidatura}
                  </BootstrapForm.Control.Feedback>
                </FloatingLabel>
              </Col>
              <Col md={10} className="bg-white p-0 m-0">
              <div className="d-flex flex-wrap ">  
              {formacaoOptions.map(([form, type, name, label, largura, options]) => (
                <DynamicField
                  key={name}
                  form={form}
                  type={type}
                  name={name}
                  label={label}
                  largura={largura}
                  options={options || []}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                />
              ))}
              </div>
              
              
              </Col>
              
            </Row>

            {/* Outras seções iguais às que você já tem, mas limpas */}
            
            <div className="d-flex justify-content-end mt-4">
              <Button type="submit" disabled={mutation.isLoading}>
                {initialValues?.id ? "Atualizar" : "Registar"}
              </Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
