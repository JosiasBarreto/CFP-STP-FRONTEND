
import React, { useState } from "react";

import {
  Button,
  Form,
  Row,
  Col,
  FloatingLabel,
  Modal,
  Card,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";

import {
  FaCalendarAlt,
  FaPlus,
  FaEdit,
  FaToggleOn,
  FaToggleOff,
  FaLink,
  FaUsers,
  FaSyncAlt,
  FaExclamationTriangle,
  FaRegCalendarCheck,
} from "react-icons/fa";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useFormik } from "formik";
import * as Yup from "yup";

import { toast, ToastContainer } from "react-toastify";

import {
  registarStatusInscricao,
  atualizarStatusInscricao,
  alterarStatusInscricao,
  listarConfiguracoesInscricao,
} from "./status_function/function";

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function formatarData(data) {
  if (!data) return "Não definida";

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function converterDataInput(data) {
  if (!data) return "";

  const date = new Date(data);

  if (Number.isNaN(date.getTime())) return "";

  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const dia = String(date.getDate()).padStart(2, "0");
  const hora = String(date.getHours()).padStart(2, "0");
  const minuto = String(date.getMinutes()).padStart(2, "0");

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

const valoresIniciais = (ano) => ({
  ano_inscricao: ano,
  data_abertura: "",
  data_fecho: "",
  link_inscricao: "",
  status: true,
  quantidade_candidatos_previstos: 0,
  descricao: "",
  observacoes: "",
});

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

function RegisterStatusInscricao() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const anoAtual = new Date().getFullYear();

  const [show, setShow] = useState(false);
  const [modoFormulario, setModoFormulario] = useState("REGISTAR");
  const [idSelecionado, setIdSelecionado] = useState(null);

  // =====================================================
  // VALIDAÇÃO DO FORMULÁRIO
  // =====================================================

  const validationSchema = Yup.object().shape({
    ano_inscricao: Yup.number()
      .typeError("Informe o ano de inscrição")
      .required("O ano de inscrição é obrigatório")
      .integer("Informe um ano válido")
      .min(2000, "Ano inválido")
      .max(2100, "Ano inválido"),

    data_abertura: Yup.date()
      .nullable()
      .required("A data de abertura é obrigatória"),

    data_fecho: Yup.date()
      .nullable()
      .required("A data de fecho é obrigatória")
      .test(
        "data-fim",
        "A data de fecho deve ser posterior à abertura",
        function (value) {
          const { data_abertura } = this.parent;

          if (!value || !data_abertura) return true;

          return new Date(value) > new Date(data_abertura);
        }
      ),

    link_inscricao: Yup.string()
      .nullable()
      .url("Informe um endereço válido"),

    quantidade_candidatos_previstos: Yup.number()
      .typeError("Informe uma quantidade válida")
      .integer("A quantidade deve ser inteira")
      .min(0, "A quantidade não pode ser negativa")
      .required("A quantidade prevista é obrigatória"),

    descricao: Yup.string().nullable(),
    observacoes: Yup.string().nullable(),
  });

  // =====================================================
  // CONSULTAR TODAS AS CONFIGURAÇÕES
  // =====================================================

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["configuracoesInscricao"],
    queryFn: () => listarConfiguracoesInscricao(token),
    enabled: Boolean(token),
  });

  const configuracoes = response?.data?.configuracoes || [];

  // =====================================================
  // MUTATION: CRIAR E EDITAR
  // =====================================================

  const mutation = useMutation({
    mutationFn: async ({ tipo, dados, id }) => {
      if (tipo === "criar") {
        return registarStatusInscricao(dados, token);
      }

      return atualizarStatusInscricao(
        { ...dados, id },
        token
      );
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["configuracoesInscricao"],
      });

      toast.success(
        variables.tipo === "criar"
          ? "Configuração de inscrição registada com sucesso!"
          : "Configuração de inscrição atualizada com sucesso!"
      );

      setShow(false);
      setIdSelecionado(null);
      formik.resetForm({
        values: valoresIniciais(anoAtual),
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
        "Não foi possível guardar a configuração."
      );
    },
  });

  // =====================================================
  // MUTATION: ACTIVAR E DESACTIVAR
  // =====================================================

  const mutationStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      return alterarStatusInscricao(id, status, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["configuracoesInscricao"],
      });

      toast.success("Estado da configuração atualizado com sucesso!");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
        "Erro ao alterar o estado da configuração."
      );
    },
  });

  // =====================================================
  // FORMULÁRIO
  // =====================================================

  const formik = useFormik({
    initialValues: valoresIniciais(anoAtual),
    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const dados = {
          ...values,
          ano_inscricao: Number(values.ano_inscricao),
          quantidade_candidatos_previstos: Number(
            values.quantidade_candidatos_previstos
          ),
        };

        if (modoFormulario === "REGISTAR") {
          await mutation.mutateAsync({
            tipo: "criar",
            dados,
          });
        } else {
          await mutation.mutateAsync({
            tipo: "editar",
            dados,
            id: idSelecionado,
          });
        }
      } catch (error) {
        // O tratamento do erro é feito na mutation.
      } finally {
        setSubmitting(false);
      }
    },
  });

  // =====================================================
  // ABRIR MODAL PARA NOVA CONFIGURAÇÃO
  // =====================================================

  const abrirNovo = () => {
    setIdSelecionado(null);
    setModoFormulario("REGISTAR");

    formik.resetForm({
      values: valoresIniciais(anoAtual),
    });

    setShow(true);
  };

  // =====================================================
  // EDITAR CONFIGURAÇÃO
  // =====================================================

  const editarConfiguracao = (dados) => {
    setIdSelecionado(dados.id);
    setModoFormulario("EDITAR");

    formik.resetForm({
      values: {
        ano_inscricao: dados.ano_inscricao,
        data_abertura: converterDataInput(dados.data_abertura),
        data_fecho: converterDataInput(dados.data_fecho),
        link_inscricao: dados.link_inscricao || "",
        status: Boolean(dados.status),
        quantidade_candidatos_previstos:
          dados.quantidade_candidatos_previstos || 0,
        descricao: dados.descricao || "",
        observacoes: dados.observacoes || "",
      },
    });

    setShow(true);
  };

  // =====================================================
  // ACTIVAR / DESACTIVAR CONFIGURAÇÃO
  // =====================================================

  const alterarEstado = (dados) => {
    const novoEstado = !dados.status;

    const confirmar = window.confirm(
      novoEstado
        ? `Deseja activar as inscrições de ${dados.ano_inscricao}?`
        : `Deseja desactivar as inscrições de ${dados.ano_inscricao}?`
    );

    if (!confirmar) return;

    mutationStatus.mutate({
      id: dados.id,
      status: novoEstado,
    });
  };

  // =====================================================
  // ESTADO DE CARREGAMENTO
  // =====================================================

  if (!token) {
    return (
      <div className="container-fluid py-5">
        <Card className="border-0 shadow-sm text-center p-4">
          <Card.Body>
            <FaExclamationTriangle
              size={35}
              className="text-warning mb-3"
            />
            <h5>Sessão não encontrada</h5>
            <p className="text-muted mb-0">
              Inicie sessão novamente para gerir as configurações de inscrições.
            </p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  // =====================================================
  // INTERFACE
  // =====================================================

  return (
    <div className="container-fluid py-3">

      {/* CABEÇALHO */}

      <Row className="bg-success p-3 shadow-sm mb-4 rounded align-items-center">
        <Col>
          <h4 className="text-white fw-bold mb-1">
            <FaCalendarAlt className="me-2" />
            CONFIGURAÇÕES DE INSCRIÇÕES
          </h4>

          <small className="text-white">
            Gerir períodos, datas e condições de inscrição do CFP-STP.
          </small>
        </Col>

        <Col xs="auto">
          <Button
            variant="light"
            className="fw-semibold"
            onClick={abrirNovo}
          >
            <FaPlus className="me-2" />
            NOVA CONFIGURAÇÃO
          </Button>
        </Col>
      </Row>

      {/* RESUMO */}

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                <FaCalendarAlt size={24} className="text-success" />
              </div>

              <div>
                <small className="text-muted">
                  Total de configurações
                </small>
                <h3 className="fw-bold mb-0">
                  {configuracoes.length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <FaRegCalendarCheck size={24} className="text-primary" />
              </div>

              <div>
                <small className="text-muted">
                  Configurações activas
                </small>
                <h3 className="fw-bold mb-0">
                  {configuracoes.filter((item) => item.status).length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-secondary bg-opacity-10 rounded-circle p-3 me-3">
                <FaToggleOff size={24} className="text-secondary" />
              </div>

              <div>
                <small className="text-muted">
                  Configurações inactivas
                </small>
                <h3 className="fw-bold mb-0">
                  {configuracoes.filter((item) => !item.status).length}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* TABELA DE CONFIGURAÇÕES */}

      <Card className="border-0 shadow-sm">

        <Card.Header className="bg-white py-3">
          <Row className="align-items-center">
            <Col>
              <h5 className="fw-bold mb-0">
                Lista de configurações de inscrições
              </h5>

              <small className="text-muted">
                Todas as configurações registadas no sistema.
              </small>
            </Col>

            <Col xs="auto">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <FaSyncAlt className={`me-2 ${isFetching ? "fa-spin" : ""}`} />
                Actualizar
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="p-0">

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="text-muted mt-3 mb-0">
                A carregar configurações de inscrições...
              </p>
            </div>

          ) : isError ? (
            <div className="text-center py-5">
              <FaExclamationTriangle
                size={40}
                className="text-danger mb-3"
              />

              <h5>Não foi possível carregar os dados</h5>

              <p className="text-muted">
                {error?.response?.data?.message ||
                  "Ocorreu um erro ao consultar as configurações."}
              </p>

              <Button
                variant="success"
                onClick={() => refetch()}
              >
                <FaSyncAlt className="me-2" />
                TENTAR NOVAMENTE
              </Button>
            </div>

          ) : configuracoes.length === 0 ? (
            <div className="text-center py-5 px-3">
              <FaCalendarAlt
                size={45}
                className="text-muted mb-3"
              />

              <h5 className="fw-bold">
                Nenhuma configuração registada
              </h5>

              <p className="text-muted">
                Ainda não existem configurações de inscrições.
                Crie a primeira configuração para começar.
              </p>

              <Button
                variant="success"
                onClick={abrirNovo}
              >
                <FaPlus className="me-2" />
                CRIAR CONFIGURAÇÃO
              </Button>
            </div>

          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-3">Ano</th>
                  <th>Abertura</th>
                  <th>Fecho</th>
                  <th>Portal de inscrição</th>
                  <th>Candidatos previstos</th>
                  <th>Estado</th>
                  <th className="text-center">Acções</th>
                </tr>
              </thead>

              <tbody>
                {[...configuracoes]
                  .sort(
                    (a, b) =>
                      Number(b.ano_inscricao) -
                      Number(a.ano_inscricao)
                  )
                  .map((item) => (
                    <tr key={item.id}>

                      <td className="ps-3">
                        <strong className="text-success fs-5">
                          {item.ano_inscricao}
                        </strong>
                      </td>

                      <td>
                        {formatarData(item.data_abertura)}
                      </td>

                      <td>
                        {formatarData(item.data_fecho)}
                      </td>

                      <td>
                        {item.link_inscricao ? (
                          <a
                            href={item.link_inscricao}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <FaLink className="me-1" />
                            Abrir portal
                          </a>
                        ) : (
                          <span className="text-muted">
                            Não definido
                          </span>
                        )}
                      </td>

                      <td>
                        <FaUsers className="text-success me-2" />
                        {item.quantidade_candidatos_previstos ?? 0}
                      </td>

                      <td>
                        <Badge
                          bg={item.status ? "success" : "secondary"}
                          className="px-3 py-2"
                        >
                          {item.status ? "ACTIVA" : "INACTIVA"}
                        </Badge>
                      </td>

                      <td>
                        <div className="d-flex justify-content-center gap-2">

                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Editar configuração"
                            onClick={() => editarConfiguracao(item)}
                          >
                            <FaEdit />
                          </Button>

                          <Button
                            variant={
                              item.status
                                ? "outline-danger"
                                : "outline-success"
                            }
                            size="sm"
                            title={
                              item.status
                                ? "Desactivar configuração"
                                : "Activar configuração"
                            }
                            disabled={
                              mutationStatus.isPending &&
                              mutationStatus.variables?.id === item.id
                            }
                            onClick={() => alterarEstado(item)}
                          >
                            {mutationStatus.isPending &&
                            mutationStatus.variables?.id === item.id ? (
                              <Spinner size="sm" />
                            ) : item.status ? (
                              <FaToggleOff />
                            ) : (
                              <FaToggleOn />
                            )}
                          </Button>

                        </div>
                      </td>

                    </tr>
                  ))}
              </tbody>
            </Table>
          )}

        </Card.Body>

        {!isLoading && !isError && configuracoes.length > 0 && (
          <Card.Footer className="bg-white text-muted">
            <small>
              Total de registos: <strong>{configuracoes.length}</strong>
            </small>
          </Card.Footer>
        )}

      </Card>

      {/* MODAL DE REGISTO E EDIÇÃO */}

      <Modal
        show={show}
        onHide={() => {
          if (!formik.isSubmitting) setShow(false);
        }}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
      >

        <Modal.Header
          closeButton
          className="bg-success text-white"
        >
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            {modoFormulario === "REGISTAR"
              ? "NOVA CONFIGURAÇÃO DE INSCRIÇÃO"
              : "EDITAR CONFIGURAÇÃO DE INSCRIÇÃO"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form noValidate onSubmit={formik.handleSubmit}>

            <Row className="g-3">

              {/* ANO */}

              <Col md={4}>
                <FloatingLabel
                  label="Ano de Inscrição"
                  controlId="ano_inscricao"
                >
                  <Form.Control
                    type="number"
                    min="2000"
                    max="2100"
                    name="ano_inscricao"
                    value={formik.values.ano_inscricao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.ano_inscricao &&
                      Boolean(formik.errors.ano_inscricao)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.ano_inscricao}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              {/* DATA DE ABERTURA */}

              <Col md={4}>
                <FloatingLabel
                  label="Data de Abertura"
                  controlId="data_abertura"
                >
                  <Form.Control
                    type="datetime-local"
                    name="data_abertura"
                    value={formik.values.data_abertura}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.data_abertura &&
                      Boolean(formik.errors.data_abertura)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.data_abertura}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              {/* DATA DE FECHO */}

              <Col md={4}>
                <FloatingLabel
                  label="Data de Fecho"
                  controlId="data_fecho"
                >
                  <Form.Control
                    type="datetime-local"
                    name="data_fecho"
                    value={formik.values.data_fecho}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.data_fecho &&
                      Boolean(formik.errors.data_fecho)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.data_fecho}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              {/* LINK */}

              <Col md={8}>
                <FloatingLabel
                  label="Link do Portal de Inscrição"
                  controlId="link_inscricao"
                >
                  <Form.Control
                    type="url"
                    name="link_inscricao"
                    placeholder="https://..."
                    value={formik.values.link_inscricao}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.link_inscricao &&
                      Boolean(formik.errors.link_inscricao)
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.link_inscricao}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              {/* CANDIDATOS PREVISTOS */}

              <Col md={4}>
                <FloatingLabel
                  label="Candidatos Previstos"
                  controlId="quantidade_candidatos_previstos"
                >
                  <Form.Control
                    type="number"
                    min="0"
                    name="quantidade_candidatos_previstos"
                    value={
                      formik.values.quantidade_candidatos_previstos
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.quantidade_candidatos_previstos &&
                      Boolean(
                        formik.errors.quantidade_candidatos_previstos
                      )
                    }
                  />

                  <Form.Control.Feedback type="invalid">
                    {formik.errors.quantidade_candidatos_previstos}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>

              {/* DESCRIÇÃO */}

              <Col md={12}>
                <FloatingLabel
                  label="Descrição"
                  controlId="descricao"
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    name="descricao"
                    value={formik.values.descricao}
                    onChange={formik.handleChange}
                    placeholder="Descrição da configuração de inscrição"
                  />
                </FloatingLabel>
              </Col>

              {/* OBSERVAÇÕES */}

              <Col md={12}>
                <FloatingLabel
                  label="Observações Administrativas"
                  controlId="observacoes"
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    name="observacoes"
                    value={formik.values.observacoes}
                    onChange={formik.handleChange}
                    placeholder="Observações administrativas"
                  />
                </FloatingLabel>
              </Col>

              {/* ESTADO */}

              <Col md={12}>
                <div className="border rounded-3 p-3 d-flex justify-content-between align-items-center">

                  <div>
                    <strong>Estado da configuração</strong>

                    <div className="text-muted small">
                      Define se esta configuração está administrativamente activa.
                    </div>
                  </div>

                  <Form.Check
                    type="switch"
                    id="status"
                    name="status"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                    label={
                      formik.values.status ? "Activa" : "Inactiva"
                    }
                  />

                </div>
              </Col>

            </Row>

            {/* BOTÕES */}

            <div className="d-flex justify-content-end gap-2 mt-4">

              <Button
                variant="secondary"
                onClick={() => setShow(false)}
                disabled={formik.isSubmitting}
              >
                CANCELAR
              </Button>

              <Button
                variant="success"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    A GUARDAR...
                  </>
                ) : (
                  modoFormulario === "REGISTAR"
                    ? "REGISTAR CONFIGURAÇÃO"
                    : "GUARDAR ALTERAÇÕES"
                )}
              </Button>

            </div>

          </Form>
        </Modal.Body>

      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
}

export default RegisterStatusInscricao;
