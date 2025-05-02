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
import { atualizarUser, deleteUser, fetchUsers, registarUser } from "./function";
import { Quser } from "../../api/urls/nameQuery";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import { API_URL } from "../../api/urls";
import { Getuser } from "../../api/urls/rotes_query";



function RegisterUser() {
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
    queryKey: Quser,
    queryFn: () => fetchUsers(token),
  });

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required("Nome do utilizador é obrigatório"),
    email: Yup.string()
      .email("Email inválido")
      .required("Email do utilizador é obrigatório"),
    nivel: Yup.number().required("Nível de acesso é obrigatório"),
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      email: "",
      nivel: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);
        const user = {
          id: button === "EDITAR" ? id : undefined,
          nome: values.nome,
          email: values.email,
          fknivelacesso: values.nivel,        
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
    mutationFn: async (user) => {
      try {
        return button === "REGISTAR"
          ? await registarUser(user, token)
          : await atualizarUser(user, token);
      } catch (error) {
        throw new Error(error.response?.data?.mensagem || "Erro desconhecido");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: Quser });
      toast.success(
        `Utilizador ${
          button === "REGISTAR" ? "registrado" : "editado"
        } com sucesso`
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deletarUsuario = async (id) => {
    const ids = {
      id: id,   
    };
    try {
      const response = await deleteUser(ids, token);
      if (response.status === 200) {
        queryClient.invalidateQueries({ queryKey: Quser });
        toast.success("Utilizador deletado com sucesso");
      } else {
        throw new Error("Erro ao deletar Utilizador");
      }
    } catch (error) {
      toast.error(error.response?.data?.mensagem || "Erro desconhecido");
    }
  };

  const carregarUsuario = (formik, id, nome, email) => {
    setShow(true);
    setId(id);
    setButton("EDITAR");
    setVariant("success");
    formik.setFieldValue("nome", nome);
    formik.setFieldValue("email", email);
  };

  const reset = () => {
    setId(0);
    formik.resetForm();
    setButton("REGISTAR");
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
        <Row className="w-100">
          <Col md={3}>
            <Card className="border_tops shadow">
              <Card.Body>
                <Row className="d-flex">
                  <Col className="text-center text-success">
                    <FontAwesomeIcon icon={faUser} size="3x" />
                  </Col>
                  <Col className="text-center">
                    <span className="fw-bolder fs-5 text-center">
                      UTILIZADORES
                    </span>
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
                  <FontAwesomeIcon icon={faUser} bounce /> Novo
                  Utilizador
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
                    {funcao} UTILIZADOR
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
                    label="Nome Utilizador"
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
                    label="Email do Utilizador"
                  >
                    <Form.Control
                      className="input_left_color p-2"
                      name="email"
                      type="text"
                      placeholder="Digite o Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.email && formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                  <FloatingLabel
                    controlId="formDataN"
                    className="mb-4"
                    label="Nivel de Acesso"
                  >
                    <Form.Select
                      name="nivel"
                      onChange={formik.handleChange}
                      value={formik.values.nivel}
                      isInvalid={formik.touched.nivel && formik.errors.nivel}
                      className="input_left_color shadow-sm"
                      placeholder="nivel"
                    >
                      <option>Escolha uma opção</option>
                      <option value="1">Funcionario Utilizador</option>
                      <option value="2">Administrador</option>
                      <option value="3">Master</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.sexo}
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

      <TableUser
        carregarUsuario={carregarUsuario}
        formik={formik}
        deletarUsuario={deletarUsuario}
        datas={data}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </>
  );
}

export default RegisterUser;
