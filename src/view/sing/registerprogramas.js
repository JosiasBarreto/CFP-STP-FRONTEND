import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  FloatingLabel,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMapLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import TableUser from "./table/tableuser";
import {
    atualizarPrograma,
  atualizarUser,
  deletePrograma,
  deleteUser,
  fetchProgramas,
  registarPrograma,
  registarUser,
} from "./function";
import { Qprograma } from "../../api/urls/nameQuery";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import TablePrograma from "./table/tableprograma";

function RegisterProgramas() {
  const token = localStorage.getItem("token");

  const [contagem, setContagem] = useState(0);
  const [button, setButton] = useState("REGISTAR");
  const [id, setId] = useState(0);
  const [show, setShow] = useState(false);
  const [variant, setVariant] = useState("success");
  const [funcao, setFuncao] = useState("REGISTAR");
  const queryClient = useQueryClient();

  // Atualizado para React Query v5
  const { data, isLoading, isFetching } = useQuery({
    queryKey: Qprograma,
    queryFn: () => fetchProgramas(token),
  });

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Nome do Programa é obrigatório"),
    descricao: Yup.string().required("Descrição do Programa é obrigatório"),
    duracao: Yup.number().required("Duração do Programa é obrigatório"),
    publico_alvo: Yup.string().required(
      "Público Alvo do Programa é obrigatório"
    ),
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      descricao: "",
      duracao: "",
      publico_alvo: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const user = {
          id: button === "EDITAR" ? id : undefined,
          nome: values.nome,
          descricao: values.descricao,
          duracao: values.duracao,
          publico_alvo: values.publico_alvo,
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
    mutationFn: async (programa) => {
      try {
        return button === "REGISTAR"
          ? await registarPrograma(programa, token)
          : await atualizarPrograma(programa, token);
      } catch (error) {
        throw new Error(error.response?.data?.mensagem || "Erro desconhecido");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: Qprograma });
      toast.success(
        `Programa ${
          button === "REGISTAR" ? "registrado" : "editado"
        } com sucesso`
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deletarPrograma = async (id) => {
    const ids = {
      id: id,
    };
    try {
      const response = await deletePrograma(ids, token);
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: Qprograma });
        toast.success("Programa deletado com sucesso");
      } else {
        throw new Error("Erro ao deletar Programa");
      }
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Erro desconhecido");
    }
  };

  const carregarUsuario = (
    formik,
    id,
    nome,
    descricao,
    duracao,
    publico_alvo
  ) => {
    setShow(true);
    setId(id);
    setButton("EDITAR");
    setFuncao("EDITAR");
    setVariant("success");
    formik.setFieldValue("nome", nome);
    formik.setFieldValue("descricao", descricao);
    formik.setFieldValue("duracao", duracao);
    formik.setFieldValue("publico_alvo", publico_alvo);
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
      <div className=" shadow rounded p-3 mb-2">
        <Row className="w-100">
          <Col md={3}>
            <Card className="border_tops shadow">
              <Card.Body>
                <Row className="d-flex">
                  <Col className="text-center text-success">
                    <FontAwesomeIcon icon={faUser} size="3x" />
                  </Col>
                  <Col className="text-center">
                    <span className="fw-bolder fs-5 text-center">PROGRAMA</span>
                    <p className="fw-bolder fs-5 text-center">{contagem}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Row className="mb-4">
              <Col md={6} className="d-flex justify-content-around">
                <Button
                  className="fw-bolder"
                  variant="primary"
                  onClick={addUser}
                >
                  <FontAwesomeIcon icon={faUser} bounce /> Novo PROGRAMA
                </Button>
              </Col>
            </Row>

            <Modal
              aria-labelledby="example-modal-sizes-title-lg"
              show={show}
              onHide={addUser}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header
                className={`text-white bg-${variant} rounded-3 w-100 mb-3`}
              >
                <div>
                  <Modal.Title className="text-center">
                    {funcao} PROGRAMA
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
                    controlId="formBasicDistrito"
                    className="mb-4 w-auto"
                    label="Nome Programa"
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      type="text"
                      name="nome"
                      placeholder="Digite o Nome"
                      value={formik.values.nome}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.nome && formik.errors.nome}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.nome}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="formBasicSigla"
                    className="mb-4 w-auto"
                    label="Descrição do Programa"
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
                  <FloatingLabel
                    controlId="formBasicSigla"
                    className="mb-4 w-auto"
                    label="Público Alvo "
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      name="publico_alvo"
                      as="textarea"
                      style={{ height: "90px" }}
                      placeholder="Digite a Descrição"
                      value={formik.values.publico_alvo}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.publico_alvo &&
                        formik.errors.publico_alvo
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.publico_alvo}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="formDataN"
                    className="mb-4"
                    label="Duração do Programa"
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
                      <option value="1">1 Mês</option>
                      <option value="2">2 Mês</option>
                      <option value="3">3 Mês</option>
                      <option value="4">4 Mês</option>
                      <option value="5">5 Mês</option>
                      <option value="6">6 Mês</option>
                      <option value="7">7 Mês</option>
                      <option value="8">8 Mês</option>
                      <option value="9">9 Mês</option>
                      <option value="10">10 Mês</option>
                      <option value="11">12 Mês</option>
                      <option value="12">12 Mês</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.duracao}
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
          </Col>
        </Row>
      </div>

      <ToastContainer />

      <TablePrograma
        carregarPrograma={carregarUsuario}
        formik={formik}
        deletarPrograma={deletarPrograma}
        datas={data}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    
    </>
  );
}

export default RegisterProgramas;
