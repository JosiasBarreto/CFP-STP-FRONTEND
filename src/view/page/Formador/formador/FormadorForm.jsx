import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { useFormik } from "formik";
import { formadorSchema } from "../yupSchemas";


export default function FormadorForm({
  initialValues,
  onSubmit,
  dominios,
  modulos,
  loading,
}) {
  const formik = useFormik({
    initialValues,
    validationSchema: formadorSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Nome</Form.Label>
            <Form.Control
              name="nome"
              value={formik.values.nome}
              onChange={formik.handleChange}
              isInvalid={formik.touched.nome && formik.errors.nome}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nome}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label>BI</Form.Label>
            <Form.Control
              name="numero_bi"
              value={formik.values.numero_bi}
              onChange={formik.handleChange}
              isInvalid={formik.touched.numero_bi && formik.errors.numero_bi}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* DOMÍNIOS */}
      <Form.Group className="mt-3">
        <Form.Label>Domínios</Form.Label>
        <Form.Select
          multiple
          name="dominios"
          value={formik.values.dominios}
          onChange={(e) =>
            formik.setFieldValue(
              "dominios",
              Array.from(e.target.selectedOptions, o => Number(o.value))
            )
          }
        >
          {dominios.map(d => (
            <option key={d.id} value={d.id}>
              {d.nome}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? <Spinner size="sm" /> : "Guardar"}
      </Button>
    </Form>
  );
}
