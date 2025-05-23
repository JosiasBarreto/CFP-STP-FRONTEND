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
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fa0, faGraduationCap} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";

import {
  atualizarCurso,
  atualizarPrograma,
  deleteCurso,
  deletePrograma,
  fetchCursos,
  fetchProgramas,
  registarCurso,
} from "./function";
import { Qcurso, Qprograma } from "../../api/urls/nameQuery";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import TablePrograma from "./table/tableprograma";
import TableCurso from "./table/tablecurso";
import axios from "axios";
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
  const [cursos, setCursos] = useState([]);
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
    duracao: Yup.string().required("Duração do é obrigatório"),
    data_inicio: Yup.string().required("Data de Inicio é obrigatório"),
    data_termino: Yup.string().required("Data de Termino é obrigatório"),
    horario: Yup.string().required("Hórario de Inicio é obrigatório"),
    horario_termino: Yup.string().required("horario de Termino é obrigatório"),
    local_realizacao: Yup.string().required(
      "Local de Realização é obrigatório"
    ),
    alunos_por_turma: Yup.string().required(
      "Quantidade de Formando é obrigatório"
    ),
    descricao: Yup.string(),
    fk_programa: Yup.number().required("Programa é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      accao: "",
      anoexecucao: new Date().getFullYear(),
      duracao: "",
      data_inicio: "",
      data_termino: "",
      horario: "",
      horario_termino: "",
      local_realizacao: "",
      alunos_por_turma: "18 Formandos",
      descricao: "",
      fk_programa: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
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
        };
        await mutation.mutateAsync(user);
      } finally {
        setSubmitting(false);
        setShow(false);
        resetForm();
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
        `Curso ${button === "REGISTAR" ? "registrado" : "editado"} com sucesso`
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
    formik.setFieldValue("duracao", user.duracao);
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
  };

  const reset = () => {
    setId(0);
    formik.resetForm();
    setButton("REGISTAR");
    setFuncao("REGISTAR");
    setVariant("success");
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
                  onClick={addUser}
                >
                  <FaBook className="sidebar-icon me-2" size={"1rem"}/> 
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
            aria-labelledby="example-modal-sizes-title-xl"
            show={show}
            onHide={addUser}
            backdrop="static"
            keyboard={false}
            

          >
            <Modal.Header
              className={`text-white bg-${variant}  w-100 mb-2 rounded-top`}
              closeButton
            >
              <div>
                <Modal.Title className="text-center">
                  <FaBook className="sidebar-icon me-2" size={"1.5rem"}/>
                  {funcao} CURSO
                </Modal.Title>
              </div>
              
            </Modal.Header>

            <Modal.Body>
              <Form noValidate onSubmit={formik.handleSubmit}>
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
                  controlId="formBasiCurso"
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
                  <Col md={8}>
                    <FloatingLabel
                      controlId="formPrograma"
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
                            event.target.value
                          );

                          formik.setFieldValue(
                            "fk_programa",
                            idDistritoSelecionado
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
                              <option key={distritos.id} value={distritos.id}>
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
                  <Col md={4}>
                    <FloatingLabel
                      controlId="formDataN"
                      className="mb-4"
                      label="Duração do Curso"
                    >
                      <Form.Select
                        name="duracao"
                        onChange={formik.handleChange}
                        value={formik.values.duracao}
                        isInvalid={
                          formik.touched.duracao && formik.errors.duracao
                        }
                        className="input_left_color shadow-sm"
                        placeholder="duracao"
                      >
                        <option>Escolha uma opção</option>
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
                        <option value="330">330 Horas</option>
                        <option value="360">360 Horas</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.duracao}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row md={12}>
                  <Col md={3}>
                    <FloatingLabel
                      controlId="formBasiAccao"
                      className="mb-4 w-auto"
                      label="Acção do Curso"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="text"
                        name="accao"
                        placeholder=""
                        value={formik.values.accao}
                        onChange={formik.handleChange}
                        isInvalid={formik.touched.accao && formik.errors.accao}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.accao}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Col>
                  <Col md={3}>
                    <FloatingLabel
                      controlId="formBasiIncico"
                      className="mb-4 w-auto"
                      label="Data de Inicio"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="date"
                        name="data_inicio"
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
                      controlId="formBasiTermino"
                      className="mb-4 w-auto"
                      label="Data Termino"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="date"
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
                      controlId="formBasicAno"
                      className="mb-4 w-auto"
                      label="Ano de Realização"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="number"
                        name="anoexecucao"
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
                  <Col md={3}>
                    <FloatingLabel
                      controlId="formBasiHora"
                      className="mb-4 w-auto"
                      label="Hora de Inicio"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="time"
                        name="horario"
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
                  <Col md={3}>
                    <FloatingLabel
                      controlId="formBasiIncico"
                      className="mb-4 w-auto"
                      label="Hora Termino"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="time"
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
                      controlId="formBasiRealização"
                      className="mb-4 w-auto"
                      label="Local de Realização"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="text"
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

                  <Col md={3}>
                    <FloatingLabel
                      controlId="formBasiCurso"
                      className="mb-4 w-auto"
                      label="Quant. de Formandos"
                    >
                      <Form.Control
                        className="input_left_color p-2"
                        type="text"
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
                </Row>
                <FloatingLabel
                  controlId="formBasicSigla"
                  className="mb-4 w-auto"
                  label="Descrição do Curso"
                >
                  <Form.Control
                    className="input_left_color p-2"
                    name="descricao"
                    as="textarea"
                    style={{ height: "90px" }}
                    placeholder="Digite a Descrição"
                    value={formik.values.descricao}
                    onChange={formik.handleChange}
                    isInvalid={
                      formik.touched.descricao && formik.errors.descricao
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.descricao}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <div className="d-flex float-end m-2">
                  <Button
                    className="float-end w-100 mx-3"
                    variant="secondary"
                    onClick={addUser}
                  >
                    FECHAR
                  </Button>
                  <ButtonS
                    texto={button}
                    variant={variant}
                    type={"submit"}
                    loadIf={formik.isSubmitting}
                  />
                </div>
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
