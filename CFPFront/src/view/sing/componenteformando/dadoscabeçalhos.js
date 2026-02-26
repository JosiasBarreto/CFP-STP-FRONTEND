// Novo componente: SectionDadosPessoais.js
import React from "react";
import { Col, FloatingLabel, Form, Row } from "react-bootstrap";

const Cabecalhos = ({ formik }) => {
  return (
    <>
      <Row md={12} xs={12} className="bg-light d-flex justify-content-center  ">
          <Col md={3}>
           <FloatingLabel
             
              className="mb-3 w-auto"
              label="Inscrição"
            >
              <Form.Control
                cl assName="input_left_color"
                type="number"
                name="inscricao"
                id="inscricao"
                disabled
                placeholder="Digite a Inscrição"
                value={formik.values.inscricao}
                onChange={formik.handleChange}
                isInvalid={formik.touched.inscricao && formik.errors.inscricao}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.inscricao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel
           
              className="mb-3 w-auto"
              label="Processo"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="processo"
                id="processo"
                disabled
                placeholder="Digite o Número do Processo"
                value={formik.values.processo}
                onChange={formik.handleChange}
                isInvalid={formik.touched.processo && formik.errors.processo}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.processo}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel
             
              className="mb-3 w-auto"
              label="Data de Inscrição"
            >
              <Form.Control
                className="input_left_color p-2"
                type="date"
                name="data"
                id="data"
                placeholder="Digite a Data de Inscrição"
                value={formik.values.data}
                onChange={formik.handleChange}
                isInvalid={formik.touched.data && formik.errors.data}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.data}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
          
          <Col md={3}>
            <FloatingLabel
             
              className="mb-3 w-auto"
              label="Ano de Lectivo"
            >
              <Form.Control
                className="input_left_color p-2"
                type="text"
                name="anoexecucao"
                id="anoexecucao"
                placeholder="Digite o Ano de Execução"
                value={formik.values.anoexecucao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.anoexecucao && formik.errors.anoexecucao
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.anoexecucao}
              </Form.Control.Feedback>
            </FloatingLabel>
          </Col>
        </Row>
    </>
  );
};

export default Cabecalhos;