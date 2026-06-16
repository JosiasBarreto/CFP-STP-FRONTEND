import { useEffect } from "react";
import { Form, Button, Row, Col, Spinner, FloatingLabel } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import {
  atualizarFormador,
  criarFormador,
} from "../../../../../../api/formador.api";


import { toast, ToastContainer } from "react-toastify";

/**
 * Step 1 – Dados pessoais do Formador
 */
export default function StepDados({
  onSuccess,
  formador = null,
}) {
  /* =========================================================
      INITIAL VALUES
  ========================================================= */
  
  const initialValues = {
    id: formador?.id || null,

    inscricao: formador?.inscricao || "",
    codigo: formador?.codigo || "",
    nome: formador?.nome || "",
    numero_bi: formador?.numero_bi || "",
    numero_nif: formador?.numero_nif || "",
    data_nascimento:
      formador?.data_nascimento || "",
    genero: formador?.genero || "",
    estado_civil:
      formador?.estado_civil || "",
    morada: formador?.morada || "",
    distrito: formador?.distrito || "",

    banco: formador?.banco || "",
    numero_iban:
      formador?.numero_iban || "",
    numero_nib:
      formador?.numero_nib || "",

    formacao_pedagogica:
      formador?.formacao_pedagogica ||
      false,

    observacao:
      formador?.observacao || "",

    contacto_telefonico:
      formador?.contacto_telefonico ||
      "",

    email: formador?.email || "",

    outros_contactos:
      formador?.outros_contactos || "",

    data_criacao:
      formador?.data_criacao ||
      new Date()
        .toISOString()
        .split("T")[0],

    hora_criacao:
      formador?.hora_criacao ||
      new Date()
        .toISOString()
        .split("T")[1]
        .split(".")[0],
  };

  /* =========================================================
      MUTATION
  ========================================================= */

  const mutation = useMutation({
    mutationFn: (data) => {
      if (data.id) {
        return atualizarFormador(
          data.id,
          data
        );
      }

      return criarFormador(data);
    },

    onSuccess: (data) => {
      const formadorId = data.data.id;

      toast.success(
        "Dados salvos com sucesso!"
      );

      onSuccess(formadorId);
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Erro ao salvar dados",
        text:
          error?.response?.data?.erro ||
          error?.response?.data
            ?.mensagem ||
          "Erro inesperado",
      });
    },
  });

  /* =========================================================
      FORMIK
  ========================================================= */

  const formik = useFormik({
    initialValues,

    validationSchema: Yup.object({
      nome: Yup.string().required(
        "Nome é obrigatório"
      ),

      numero_bi:
        Yup.string().required(
          "BI é obrigatório"
        ),

      numero_nif:
        Yup.string(),

      data_nascimento:
        Yup.date().required(
          "Data de nascimento obrigatória"
        ),

      genero: Yup.string().required(
        "Selecione o género"
      ),

      morada: Yup.string().required(
        "Morada é obrigatória"
      ),

      distrito: Yup.string().required(
        "Distrito é obrigatório"
      ),

      contacto_telefonico:
        Yup.string().required(
          "Telefone obrigatório"
        ),
    }),

    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  useEffect(() => {
    const bi = formik.values.numero_bi;
  
    if (!bi || bi.length < 5) return;
  
    const ano = new Date().getFullYear();
  
    formik.setFieldValue(
      "codigo",
      `CFP${bi}/FP-${ano}`
    );
  }, [formik.values.numero_bi]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <ToastContainer />

      {/* =========================================================
          LINHA 1
      ========================================================= */}

      <Row className="mb-2">
        <Col md={2}>
          <FloatingLabel
            label="Inscrição Número"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Inscrição Número"
              name="id"
              disabled
              value={
                formik.values.id
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>

        <Col md={2}>
        <FloatingLabel label="Código do Formador" className="mb-4">
  <Form.Control
    className="input_left_color p-2"
    placeholder="Código"
    name="codigo"
    value={formik.values.codigo}
    onChange={formik.handleChange}
    readOnly
  />
</FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Data de Inscrição"
            className="mb-4"
          >
            <Form.Control
              type="date"
              className="input_left_color p-2"
              name="data_criacao"
              value={
                formik.values.data_criacao
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Hora de Inscrição"
            className="mb-4"
          >
            <Form.Control
              type="time"
              className="input_left_color p-2"
              name="hora_criacao"
              value={
                formik.values.hora_criacao
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>

        
      </Row>

      {/* =========================================================
          LINHA 2
      ========================================================= */}

      <Row className="mb-2">
      <Col md={4}>
          <FloatingLabel
            label="Nome Completo"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Nome Completo"
              name="nome"
              value={formik.values.nome}
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched.nome &&
                formik.errors.nome
              }
            />

            <Form.Control.Feedback type="invalid">
              {formik.errors.nome}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col md={2}>
          <FloatingLabel
            label="Género"
            className="mb-4"
          >
            <Form.Select
              className="input_left_color p-2"
              name="genero"
              value={
                formik.values.genero
              }
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched.genero &&
                formik.errors.genero
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="Masculino">
                Masculino
              </option>

              <option value="Feminino">
                Feminino
              </option>
            </Form.Select>

            <Form.Control.Feedback type="invalid">
              {formik.errors.genero}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Estado Civil"
            className="mb-4"
          >
            <Form.Select
              className="input_left_color p-2"
              name="estado_civil"
              value={
                formik.values.estado_civil
              }
              onChange={
                formik.handleChange
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="Solteiro(a)">
                Solteiro(a)
              </option>

              <option value="Casado(a)">
                Casado(a)
              </option>

              <option value="Divorciado(a)">
                Divorciado(a)
              </option>

              <option value="Viúvo(a)">
                Viúvo(a)
              </option>
            </Form.Select>
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Data de Nascimento"
            className="mb-4"
          >
            <Form.Control
              type="date"
              className="input_left_color p-2"
              name="data_nascimento"
              value={
                formik.values
                  .data_nascimento
              }
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched
                  .data_nascimento &&
                formik.errors
                  .data_nascimento
              }
            />

            <Form.Control.Feedback type="invalid">
              {
                formik.errors
                  .data_nascimento
              }
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Número do BI"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Número do BI"
              name="numero_bi"
              value={
                formik.values.numero_bi
              }
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched
                  .numero_bi &&
                formik.errors.numero_bi
              }
            />

            <Form.Control.Feedback type="invalid">
              {
                formik.errors.numero_bi
              }
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Número do NIF"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Número do NIF"
              name="numero_nif"
              value={
                formik.values.numero_nif
              }
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched
                  .numero_nif &&
                formik.errors
                  .numero_nif
              }
            />

            <Form.Control.Feedback type="invalid">
              {
                formik.errors
                  .numero_nif
              }
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
      
        <Col md={2}>
          <FloatingLabel
            label="Morada"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Morada"
              name="morada"
              value={
                formik.values.morada
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>

        <Col md={2}>
          <FloatingLabel
            label="Distrito"
            className="mb-4"
          >
            <Form.Select
              className="input_left_color p-2"
              name="distrito"
              value={
                formik.values.distrito
              }
              onChange={
                formik.handleChange
              }
            >
              <option value="">
                Selecione
              </option>

              <option value="Água Grande">
                Água Grande
              </option>

              <option value="Lobata">
                Lobata
              </option>

              <option value="Mé-Zóchi">
                Mé-Zóchi
              </option>

              <option value="Cantagalo">
                Cantagalo
              </option>

              <option value="Caué">
                Caué
              </option>

              <option value="Lembá">
                Lembá
              </option>

              <option value="Príncipe">
                Região Autónoma do Príncipe
              </option>
            </Form.Select>
          </FloatingLabel>
        </Col>

        <Col md={3}>
          <FloatingLabel
            label="Número do Telefone"
            className="mb-4"
          >
            <Form.Control
              className="input_left_color p-2"
              placeholder="Telefone"
              name="contacto_telefonico"
              value={
                formik.values
                  .contacto_telefonico
              }
              onChange={
                formik.handleChange
              }
              isInvalid={
                formik.touched
                  .contacto_telefonico &&
                formik.errors
                  .contacto_telefonico
              }
            />

            <Form.Control.Feedback type="invalid">
              {
                formik.errors
                  .contacto_telefonico
              }
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>

        <Col md={3}>
          <FloatingLabel
            label="Email"
            className="mb-4"
          >
            <Form.Control
              type="email"
              className="input_left_color p-2"
              placeholder="Email"
              name="email"
              value={
                formik.values.email
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>
      </Row>

      {/* =========================================================
          OBSERVAÇÃO
      ========================================================= */}

      <Row>
        <Col md={8}>
          <FloatingLabel
            label="Observação"
            className="mb-4"
          >
            <Form.Control
              as="textarea"
              style={{
                height: "120px",
              }}
              className="input_left_color p-2"
              placeholder="Observação"
              name="observacao"
              value={
                formik.values.observacao
              }
              onChange={
                formik.handleChange
              }
            />
          </FloatingLabel>
        </Col>

        <Col
          md={4}
          className="d-flex align-items-center"
        >
          <Form.Check
            type="switch"
            label="Possui Formação Pedagógica"
            name="formacao_pedagogica"
            checked={
              formik.values
                .formacao_pedagogica
            }
            onChange={
              formik.handleChange
            }
          />
        </Col>
      </Row>

      {/* =========================================================
          BUTTON
      ========================================================= */}

      <div className="text-end mt-3">
        <Button
          variant="success"
          type="submit"
          disabled={mutation.isPending}
          className="px-4 rounded-pill"
        >
          {mutation.isPending ? (
            <Spinner size="sm" />
          ) : (
            "Salvar e Continuar"
          )}
        </Button>
      </div>
    </Form>
  );
}