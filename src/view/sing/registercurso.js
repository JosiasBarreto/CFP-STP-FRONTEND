import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  FloatingLabel,
  Modal,
  Spinner,
  InputGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import {
  atualizarCurso,
  deleteCurso,
  fetchCursos,
  fetchProgramas,
  registarCurso,
} from "./function";
import { Qcurso, Qprograma } from "../../api/urls/nameQuery";
import { ButtonS } from "../../component/Buttons.js/CustomButton";

import TableCurso from "./table/tablecurso";

import { FaBook } from "react-icons/fa";

function RegisterCursos() {
  const token = localStorage.getItem("token");
  const [searchParams, setSearchParams] = useState({
    nome: "",
    ano_execucao: new Date().getFullYear(),
    programa: "",
    local_realizacao: "",
    acao: "",
  });
  const [contagem, setContagem] = useState(0);
  const [button, setButton] = useState("REGISTAR");
  const [id, setId] = useState(0);
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("success");
  const [funcao, setFuncao] = useState("REGISTAR");
  const queryClient = useQueryClient();

  // Atualizado para React Query v5
  const { data, isLoading, isFetching } = useQuery({
    queryKey: Qcurso,
    queryFn: () => fetchCursos(token, searchParams),
  });
  const { data: datas, isLoading: isloading } = useQuery({
    queryKey: Qprograma,
    queryFn: () => fetchProgramas(token),
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearch = async () => {
    setLoading(true);
    queryClient.invalidateQueries({ queryKey: Qcurso });
    try {
      fetchCursos(token, searchParams);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleLimpar = async () => {
    setLoading(true);
    setSearchParams({
      nome: "",
      ano_execucao: new Date().getFullYear(),
      programa: "",
      local_realizacao: "",
      acao: "",
    });
    queryClient.invalidateQueries({ queryKey: Qcurso });
    try {
      fetchCursos(token, searchParams);
    } catch (error) {
      console.error("Erro ao buscar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Nome do Curso é obrigatório"),
    accao: Yup.string().required("Acção do é obrigatório"),
    anoexecucao: Yup.string().required("Ano do é obrigatório"),
    duracao: Yup.number().required("Duração do é obrigatório"),
    data_inicio: Yup.date().required("Data de Inicio é obrigatório"),
    data_termino: Yup.date().required("Data de Termino é obrigatório"),
    horario: Yup.string()
      .required("Hora é obrigatória")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    horario_termino: Yup.string()
      .required("Hora é obrigatória")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora inválida"),
    local_realizacao: Yup.string().required(
      "Local de Realização é obrigatório",
    ),
    alunos_por_turma: Yup.string().required(
      "Quantidade de Formando é obrigatório",
    ),
    descricao: Yup.string(),
    fk_programa: Yup.number(),
    duracao_mes: Yup.number().required("Duração em Mês é Obrigratório"),
  });
  //link_foto é um json que pode contér até dois link, para cada curso
  const formik = useFormik({
    initialValues: {
      nome: "",
      accao: "",
      anoexecucao: new Date().getFullYear(),
      duracao: 0,
      data_inicio: "",
      data_termino: "",
      horario: "",
      horario_termino: "",
      local_realizacao: "",
      alunos_por_turma: "18 Formandos",
      descricao: "",
      fk_programa: 0,
      duracao_mes: 0,
      inscricoes_ativa: 0,
      habilitacao_minima: "",
      link_foto: [],
    },
    validationSchema: validationSchema,
   
onSubmit: async (values, { setSubmitting, resetForm }) => {
  try {
    const user = {
      id: button === "EDITAR" ? id : undefined,
      nome: values.nome,
      acao: values.accao,
      ano_execucao: values.anoexecucao,
      duracao: values.duracao,
      data_inicio: values.data_inicio,
      data_termino: values.data_termino,
      horario: values.horario,
      horario_termino: values.horario_termino,
      local_realizacao: values.local_realizacao,
      alunos_por_turma: values.alunos_por_turma,
      descricao: values.descricao,
      fk_programa: values.fk_programa,
      duracao_mes: values.duracao_mes,
      inscricoes_ativa: values.inscricoes_ativa,
      habilitacao_minima: values.habilitacao_minima,
      link_foto: (values.link_foto || [])
        .map((url) => url.trim())
        .filter(Boolean),
    };

    await mutation.mutateAsync(user);

    // Só fecha depois de guardar com sucesso
    setShow(false);
    resetForm();
    setId(0);
    setButton("REGISTAR");
    setFuncao("REGISTAR");
    setVariant("success");

  } catch (error) {
    // Mantém a modal aberta e preserva os dados
    console.error("Erro ao guardar curso:", error);

  } finally {
    setSubmitting(false);
  }
},

  });

  // Atualizado para React Query v5
  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        return button === "REGISTAR"
          ? await registarCurso(data, token)
          : await atualizarCurso(data, token);
      } catch (error) {
        throw new Error(error.response?.data?.mensagem || "Erro desconhecido");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: Qcurso });
      toast.success(
        `Curso ${button === "REGISTAR" ? "registrado" : "editado"} com sucesso`,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deletarCurso = async (id) => {
    const ids = {
      id: id,
    };
    try {
      const response = await deleteCurso(id, token);
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: Qcurso });
        toast.success("Programa deletado com sucesso");
      } else {
        throw new Error("Erro ao deletar Programa");
      }
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Erro desconhecido");
    }
  };

  const carregarCurso = (formik, user) => {
    setShow(true);
    setId(user.id);
    setButton("EDITAR");
    setFuncao("EDITAR");
    setVariant("success");
    formik.setFieldValue("nome", user.nome);
    formik.setFieldValue("descricao", user.descricao);
    formik.setFieldValue("duracao", user.duracao === "nan" ? 0 : user.duracao);
    formik.setFieldValue("accao", user.acao);
    formik.setFieldValue("anoexecucao", user.ano_execucao);
    if (user.data_inicio) {
      formik.setFieldValue("data_inicio", user.data_inicio.split("T")[0]);
    } else {
      formik.setFieldValue("data_inicio", "");
    }

    if (user.data_termino) {
      formik.setFieldValue("data_termino", user.data_termino.split("T")[0]);
    } else {
      formik.setFieldValue("data_termino", "");
    }
    formik.setFieldValue("horario", user.horario);
    formik.setFieldValue("horario_termino", user.horario_termino);
    formik.setFieldValue("local_realizacao", user.local_realizacao);
    formik.setFieldValue("alunos_por_turma", user.alunos_por_turma);
    formik.setFieldValue("fk_programa", user.programa_id);
    formik.setFieldValue(
      "duracao_mes",
      user.duracao_mes === "nan" ? 0 : user.duracao_mes,
    );
    formik.setFieldValue("inscricoes_ativa", user.inscricoes_ativa);
    formik.setFieldValue("habilitacao_minima", user.habilitacao_minima);
    formik.setFieldValue(
      "link_foto",
      Array.isArray(user.link_foto) ? user.link_foto : [],
    );
  };

  // Limpar formulário e repor os estados
  const reset = () => {
    setId(0);
    setButton("REGISTAR");
    setFuncao("REGISTAR");
    setVariant("success");

    formik.resetForm();
  };

  // Abrir modal para registar um novo curso
  const abrirModalNovo = () => {
    reset();
    setShow(true);
  };

  // Fechar modal
  const fecharModal = () => {
    setShow(false);
    reset();
  };

  const addUser = () => {
    setShow(!show);
    reset();
  };

  useEffect(() => {
    if (data) {
      const intervalId = setInterval(() => {
        setContagem((prev) => (prev < data.length ? prev + 1 : prev));
      }, 70);
      return () => clearInterval(intervalId);
    }
  }, [data]);
  useEffect(() => {
    const delay = setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: [Qcurso] });
    }, 500);

    return () => clearTimeout(delay);
  }, [searchParams]);

  return (
    <>
      <div className="bg-white shadow rounded p-3 mb-2">
        <Row mb={12} className="w-100">
          <Col md={3}>
            <Card className="border_tops shadow">
              <Card.Body>
                <Row className="d-flex">
                  <Col className="text-center text-success">
                    <FaBook className="sidebar-icon" size={"4rem"} />
                  </Col>
                  <Col className="text-center text-capitalize text-success">
                    <span className="fw-bolder fs-5 text-center">CURSOS</span>
                    <p className="fw-bolder fs-5 text-center">{contagem}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Row className="mb-1">
              <Col className="d-flex justify-content-around">
                <Button
                  className="fw-bolder"
                  variant="outline-success"
                  onClick={abrirModalNovo}
                >
                  <FaBook className="sidebar-icon me-2" size="1rem" />
                  Adicionar
                </Button>
              </Col>
            </Row>
          </Col>

          <Col md={7} className=" p-2 ">
            <Row className="g-3 ">
              <Col xs={12} md={5}>
                <Form.Control
                  type="text"
                  name="nome"
                  value={searchParams.nome}
                  onChange={handleChange}
                  placeholder="Buscar por nome"
                  className="form-control-lg"
                />
              </Col>
              <Col xs={12} md={3}>
                <Form.Control
                  type="number"
                  name="ano_execucao"
                  value={searchParams.ano_execucao}
                  onChange={handleChange}
                  placeholder="Buscar por ano"
                  className="form-control-lg"
                />
              </Col>
              <Col xs={12} md={2} className="d-flex align-items-center">
                <Button
                  variant="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Buscar"
                  )}
                </Button>
              </Col>
              <Col xs={12} md={5}>
                <Form.Control
                  type="text"
                  name="programa"
                  value={searchParams.programa}
                  onChange={handleChange}
                  placeholder="Buscar por programa"
                  className="form-control-lg"
                />
              </Col>

              <Col xs={12} md={3}>
                <Form.Control
                  type="text"
                  name="acao"
                  value={searchParams.acao}
                  onChange={handleChange}
                  placeholder="Buscar por ação"
                  className="form-control-lg"
                />
              </Col>

              <Col xs={12} md={2} className="d-flex align-items-center">
                <Button
                  variant="primary"
                  onClick={handleLimpar}
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Limpar"
                  )}
                </Button>
              </Col>
            </Row>
          </Col>

          <Modal
            size="xl"
            aria-labelledby="modal-curso-title"
            show={show}
            onHide={fecharModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header
              className={`text-white bg-${variant} w-100 mb-2 rounded-top`}
              closeButton
            >
              <Modal.Title id="modal-curso-title">
                <FaBook className="sidebar-icon me-2" size="1.5rem" />
                {funcao} CURSO
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form noValidate onSubmit={formik.handleSubmit}>
                <Tabs
                  defaultActiveKey="home"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="home" title="Dados dos Cursos">
                    <Form.Group className="mb-" style={{ display: "none" }}>
                      <Form.Label>ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="id"
                        readOnly={true}
                        value={id}
                      />
                    </Form.Group>
                    <FloatingLabel
                      className="mb-4 w-auto"
                      label="Nome do Curso"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="text"
                        name="nome"
                        id="nome"
                        placeholder="Digite o Nome"
                        value={formik.values.nome}
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.nome && formik.errors.nome}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.nome}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                    <Row xs={12} md={12}>
                      <Col md={6}>
                        <FloatingLabel
                          className="mb-3"
                          label="Programa do Curso"
                        >
                          <Form.Select
                            className="input_left_color shadow-sm"
                            name="fk_programa"
                            id="fk_programa"
                            value={formik.values.fk_programa}
                            onChange={(event) => {
                              const idDistritoSelecionado = parseInt(
                                event.target.value,
                              );

                              formik.setFieldValue(
                                "fk_programa",
                                idDistritoSelecionado,
                              );
                            }}
                            isInvalid={
                              formik.touched.fk_programa &&
                              formik.errors.fk_programa
                            }
                          >
                            <option key={0}>Escolha uma opção</option>
                            {datas &&
                              datas.map((distritos) => {
                                return (
                                  <option
                                    key={distritos.id}
                                    value={distritos.id}
                                  >
                                    {distritos.nome}
                                  </option>
                                );
                              })}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.fk_programa}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4"
                          label="Duração em Horas"
                        >
                          <Form.Select
                            name="duracao"
                            id="duracao"
                            {...formik.getFieldProps("duracao")}
                            isInvalid={
                              formik.touched.duracao && formik.errors.duracao
                            }
                            className="input_left_color shadow-sm"
                            placeholder="duracao"
                          >
                            <option>Escolha uma opção</option>
                            <option value="18">18 Horas</option>
                            <option value="24">24 Horas</option>
                            <option value="30">30 Horas</option>
                            <option value="60">60 Horas</option>
                            <option value="90">90 Horas</option>
                            <option value="120">120 Horas</option>
                            <option value="150">150 Horas</option>
                            <option value="180">180 Horas</option>
                            <option value="210">210 Horas</option>
                            <option value="240">240 Horas</option>
                            <option value="270">270 Horas</option>
                            <option value="300">300 Horas</option>

                            <option value="360">360 Horas</option>
                            <option value="1200">1200 Horas</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.duracao}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel className="mb-4" label="Duração em Mês">
                          <Form.Select
                            name="duracao_mes"
                            id="duracao_mes"
                            onChange={formik.handleChange}
                            value={formik.values.duracao_mes}
                            isInvalid={
                              formik.touched.duracao_mes &&
                              formik.errors.duracao_mes
                            }
                            className="input_left_color shadow-sm"
                            placeholder="duracao_mes"
                          >
                            <option>Escolha uma opção</option>
                            <option value="1">1 Mês</option>
                            <option value="2">2 Meses</option>
                            <option value="3">3 Meses</option>
                            <option value="4">4 Meses</option>
                            <option value="5">5 Meses</option>
                            <option value="6">6 Meses</option>
                            <option value="7">7 Meses</option>
                            <option value="8">8 Meses</option>
                            <option value="9">9 Meses</option>
                            <option value="10">10 Meses</option>
                            <option value="11">11 Meses</option>
                            <option value="12">12 Meses</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.duracao_mes}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row md={12}>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Acção do Curso"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="text"
                            name="accao"
                            id="accao"
                            placeholder=""
                            value={formik.values.accao}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.accao && formik.errors.accao
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.accao}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Data de Inicio"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="date"
                            name="data_inicio"
                            id="data_inicio"
                            placeholder="Data de Inicio"
                            value={formik.values.data_inicio}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.data_inicio &&
                              formik.errors.data_inicio
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.data_inicio}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Data Termino"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="date"
                            id="data_termino"
                            name="data_termino"
                            placeholder="Data Termino"
                            value={formik.values.data_termino}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.data_termino &&
                              formik.errors.data_termino
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.data_termino}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Ano de Realização"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="number"
                            name="anoexecucao"
                            id="anoexecucao"
                            placeholder="Ano"
                            //min={new Date().getFullYear()} // Ano mínimo = atual (ex: 2024)
                            max={new Date().getFullYear() + 10} // Permite até 10 anos no futuro (ex: 2034)
                            value={formik.values.anoexecucao}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.anoexecucao &&
                              formik.errors.anoexecucao
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.anoexecucao}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={2}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Hora de Inicio"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="time"
                            name="horario"
                            id="horario"
                            placeholder=""
                            value={formik.values.horario}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.horario && formik.errors.horario
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.horario}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={2}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Hora Termino"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="time"
                            id="horario_termino"
                            name="horario_termino"
                            placeholder=""
                            value={formik.values.horario_termino}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.horario_termino &&
                              formik.errors.horario_termino
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.horario_termino}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Local de Realização"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="text"
                            id="local_realizacao"
                            name="local_realizacao"
                            placeholder="Digite o Local de Realização"
                            value={formik.values.local_realizacao}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.local_realizacao &&
                              formik.errors.local_realizacao
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.local_realizacao}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>

                      <Col md={2}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Quant. de Formandos"
                        >
                          <Form.Control
                            className="input_left_color p-2"
                            type="text"
                            id="alunos_por_turma"
                            name="alunos_por_turma"
                            placeholder="Digite a Quantidade de Formandos"
                            value={formik.values.alunos_por_turma}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.alunos_por_turma &&
                              formik.errors.alunos_por_turma
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.alunos_por_turma}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                      <Col md={3}>
                        <FloatingLabel
                          className="mb-4 w-auto"
                          label="Habilitação Mínima"
                        >
                          <Form.Select
                            name="habilitacao_minima"
                            id="habilitacao_minima"
                            value={formik.values.habilitacao_minima}
                            onChange={formik.handleChange}
                            isInvalid={
                              formik.touched.habilitacao_minima &&
                              formik.errors.habilitacao_minima
                            }
                          >
                            <option value="">Selecione...</option>
                            <option value="4ª Classe">4ª Classe</option>
                            <option value="5ª Classe">5ª Classe</option>
                            <option value="6ª Classe">6ª Classe</option>
                            <option value="7ª Classe">7ª Classe</option>
                            <option value="8ª Classe">8ª Classe</option>
                            <option value="9ª Classe">9ª Classe</option>
                            <option value="10ª Classe">10ª Classe</option>
                            <option value="11ª Classe">11ª Classe</option>
                            <option value="12ª Classe">12ª Classe</option>
                            <option value="Curso Técnico">Curso Técnico</option>

                            <option value="Licenciatura">Licenciatura</option>
                            <option value="Mestrado">Mestrado</option>
                            <option value="Doutorado">Doutorado</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.habilitacao_minima}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>

                    <Row md={12} xs={12}>
                      <Col md={12} className="mb-3">
                        <FloatingLabel
                          controlId="descricao"
                          label="Descrição do Curso (Apresente os principais objetivos e conteúdos do curso.)"
                          className="mb-1"
                        >
                          <Form.Control
                            className="input_left_color"
                            name="descricao"
                            id="descricao"
                            as="textarea"
                            style={{
                              height: "90px",
                              resize: "vertical",
                              paddingTop: "1rem",
                            }}
                            placeholder="Descreva o curso..."
                            value={formik.values.descricao}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.descricao &&
                              Boolean(formik.errors.descricao)
                            }
                          />

                          <Form.Control.Feedback type="invalid">
                            {formik.errors.descricao}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                      </Col>
                    </Row>
                  </Tab>

                  <Tab
                    eventKey="configuracao"
                    title={
                      <>
                        <i className="bi bi-gear me-2"></i>
                        Configuração das Inscrições 
                      </>
                    }
                  >
                    <div className="py-3">
                      {/* CABEÇALHO */}
                      <div className="mb-4">
                        <h5 className="fw-bold mb-1">Configuração do curso</h5>
                        <p className="text-muted small mb-0">
                          Gere a disponibilidade das inscrições online e as
                          fotografias apresentadas no catálogo público.
                        </p>
                      </div>

                      <Row className="g-4">
                        {/* DISPONIBILIDADE DE INSCRIÇÃO */}
                        <Col lg={5}>
                          <div className="border rounded-3 p-3 h-100">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="rounded-3 bg-primary bg-opacity-10
                         text-primary p-3 me-3"
                              >
                                <i className="bi bi-globe2 fs-4"></i>
                              </div>

                              <div>
                                <h6 className="fw-bold mb-1">
                                  Inscrição online
                                </h6>
                                <small className="text-muted">
                                  Disponibilidade no portal público
                                </small>
                              </div>
                            </div>

                            <hr />

                            <div
                              className="d-flex align-items-center
                          justify-content-between gap-3"
                            >
                              <div>
                                <div className="fw-semibold mb-1">
                                  Permitir inscrições
                                </div>

                                <small className="text-muted">
                                  Quando ativado, os candidatos poderão
                                  consultar e inscrever-se neste curso através
                                  da internet.
                                </small>
                              </div>

                              <Form.Check
                                type="switch"
                                id="inscricoes_ativa"
                                name="inscricoes_ativa"
                                checked={
                                  Number(formik.values.inscricoes_ativa) === 1
                                }
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    "inscricoes_ativa",
                                    e.target.checked ? 1 : 0,
                                  )
                                }
                                className="fs-4 flex-shrink-0"
                              />
                            </div>

                            <div
                              className={`mt-3 p-3 rounded-3 ${
                                Number(formik.values.inscricoes_ativa) === 1
                                  ? "bg-success bg-opacity-10"
                                  : "bg-secondary bg-opacity-10"
                              }`}
                            >
                              <div className="d-flex align-items-center gap-2">
                                <i
                                  className={`bi ${
                                    Number(formik.values.inscricoes_ativa) === 1
                                      ? "bi-check-circle-fill text-success"
                                      : "bi-lock-fill text-secondary"
                                  } fs-5`}
                                ></i>

                                <div>
                                  <div className="fw-semibold">
                                    {Number(formik.values.inscricoes_ativa) ===
                                    1
                                      ? "Inscrições disponíveis"
                                      : "Inscrições indisponíveis"}
                                  </div>

                                  <small className="text-muted">
                                    {Number(formik.values.inscricoes_ativa) ===
                                    1
                                      ? "Os candidatos poderão realizar inscrições online."
                                      : "Este curso não aceitará novas inscrições online."}
                                  </small>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Esta opção controla a disponibilidade de novas
                                inscrições, não altera os dados dos candidatos
                                já inscritos.
                              </small>
                            </div>
                          </div>
                        </Col>

                        {/* FOTOGRAFIAS DO CURSO */}
                        <Col lg={7}>
                          <div className="border rounded-3 p-3 h-100">
                            <div
                              className="d-flex align-items-center
                          justify-content-between mb-3"
                            >
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-3 bg-primary bg-opacity-10
                           text-primary p-3 me-3"
                                >
                                  <i className="bi bi-images fs-4"></i>
                                </div>

                                <div>
                                  <h6 className="fw-bold mb-1">
                                    Fotografias do curso
                                  </h6>
                                  <small className="text-muted">
                                    Imagens do catálogo público
                                  </small>
                                </div>
                              </div>

                              <span className="badge bg-primary rounded-pill">
                                {
                                  (formik.values.link_foto || []).filter(
                                    (foto) => foto?.trim(),
                                  ).length
                                }
                                /2
                              </span>
                            </div>

                            <p className="text-muted small">
                              Adicione até duas fotografias para apresentar o
                              ambiente de formação, as actividades práticas e os
                              equipamentos utilizados no curso.
                            </p>

                            <Row className="g-3">
                              {(formik.values.link_foto || []).map(
                                (foto, index) => (
                                  <Col xs={12} md={6} key={index}>
                                    <div className="border rounded-3 p-2 h-100">
                                      <div
                                        className="d-flex align-items-center
                                  justify-content-between mb-2"
                                      >
                                        <small className="fw-semibold">
                                          <i className="bi bi-image me-1"></i>
                                          Fotografia {index + 1}
                                        </small>

                                        <Button
                                          type="button"
                                          variant="outline-danger"
                                          size="sm"
                                          onClick={() => {
                                            const novasFotos = [
                                              ...(formik.values.link_foto ||
                                                []),
                                            ];

                                            novasFotos.splice(index, 1);

                                            formik.setFieldValue(
                                              "link_foto",
                                              novasFotos,
                                            );
                                          }}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </Button>
                                      </div>

                                      {/* PRÉ-VISUALIZAÇÃO */}
                                      <div
                                        className="rounded-3 bg-light mb-2
                               d-flex align-items-center
                               justify-content-center overflow-hidden"
                                        style={{ height: "145px" }}
                                      >
                                        {foto?.trim() &&
                                        /^https?:\/\/.+/i.test(foto.trim()) ? (
                                          <img
                                            src={foto.trim()}
                                            alt={`Fotografia ${index + 1} do curso`}
                                            loading="lazy"
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                              e.currentTarget.style.display =
                                                "none";
                                              e.currentTarget.nextSibling.style.display =
                                                "flex";
                                            }}
                                            style={{
                                              width: "100%",
                                              height: "145px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        ) : null}

                                        <div
                                          className="text-muted small flex-column
                                 align-items-center justify-content-center"
                                          style={{
                                            display: "flex",
                                            height: "100%",
                                          }}
                                        >
                                          <i className="bi bi-cloud-arrow-up fs-2"></i>
                                          <span>
                                            {foto?.trim()
                                              ? "Não foi possível carregar a imagem"
                                              : "Pré-visualização da imagem"}
                                          </span>
                                        </div>
                                      </div>

                                      <Form.Label className="small fw-semibold">
                                        Link da fotografia
                                      </Form.Label>

                                      <InputGroup size="sm">
                                        <InputGroup.Text>
                                          <i className="bi bi-link-45deg"></i>
                                        </InputGroup.Text>

                                        <Form.Control
                                          type="url"
                                          name={`link_foto.${index}`}
                                          placeholder="https://..."
                                          value={foto}
                                          onChange={(e) => {
                                            const novasFotos = [
                                              ...(formik.values.link_foto ||
                                                []),
                                            ];

                                            novasFotos[index] = e.target.value;

                                            formik.setFieldValue(
                                              "link_foto",
                                              novasFotos,
                                            );
                                          }}
                                          onBlur={formik.handleBlur}
                                          isInvalid={
                                            Boolean(
                                              formik.errors.link_foto?.[index],
                                            ) &&
                                            Boolean(
                                              formik.touched.link_foto?.[index],
                                            )
                                          }
                                        />
                                      </InputGroup>

                                      <Form.Control.Feedback type="invalid">
                                        {formik.errors.link_foto?.[index]}
                                      </Form.Control.Feedback>
                                    </div>
                                  </Col>
                                ),
                              )}

                              {/* ADICIONAR FOTOGRAFIA */}
                              {(formik.values.link_foto || []).length < 2 && (
                                <Col xs={12} md={6}>
                                  <button
                                    type="button"
                                    className="w-100 h-100 border border-2
                             border-dashed rounded-3 bg-light
                             text-primary d-flex flex-column
                             align-items-center justify-content-center"
                                    style={{
                                      minHeight: "220px",
                                      cursor: "pointer",
                                      borderStyle: "dashed",
                                    }}
                                    onClick={() =>
                                      formik.setFieldValue("link_foto", [
                                        ...(formik.values.link_foto || []),
                                        "",
                                      ])
                                    }
                                  >
                                    <i className="bi bi-plus-circle fs-2 mb-2"></i>
                                    <span className="fw-semibold">
                                      Adicionar fotografia
                                    </span>
                                    <small className="text-muted">
                                      Máximo de duas imagens
                                    </small>
                                  </button>
                                </Col>
                              )}
                            </Row>

                            <div className="mt-3">
                              <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Utilize links públicos de imagens alojadas em
                                serviços como Cloudinary.
                              </small>
                            </div>
                          </div>
                        </Col>
                      </Row>

                      {/* BOTÕES */}
                      <div
                        className="d-flex justify-content-end gap-2 mt-4 pt-3
                    border-top"
                      >
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={fecharModal}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Fechar
                        </Button>

                        <ButtonS
                          texto={button}
                          variant={variant}
                          type="submit"
                          loadIf={formik.isSubmitting}
                        />
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </Form>
            </Modal.Body>
          </Modal>
        </Row>
      </div>

      <ToastContainer />

      <TableCurso
        carregarCurso={carregarCurso}
        formik={formik}
        deletarCurso={deletarCurso}
        datas={data}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </>
  );
}

export default RegisterCursos;
