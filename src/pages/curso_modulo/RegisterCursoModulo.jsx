import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
} from "react-bootstrap";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useFormik } from "formik";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import Swal from "sweetalert2";

import TableCursoModulo from "./TableCursoModulo";

import {
  fetchCursoModulos,
  registarCursoModulo,
  atualizarCursoModulo,
  deleteCursoModulo,
} from "./service";

import { fetchModulos } from "../modulo/service";

import { validationSchema } from "./validation";
import { QCursoModulo } from "./query";
import { fetchCursoComponentes } from "../cursoComponente/service";
import { BsPlusCircle } from "react-icons/bs";

function RegisterCursoModulo() {
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const [filtro, setFiltro] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QCursoModulo, filtro],

    queryFn: () =>
      fetchCursoModulos(token, {
        page: 1,
        per_page: 100,
      }),
  });

  const { data: cursoComponentes } = useQuery({
    queryKey: ["curso-componentes"],

    queryFn: () =>
      fetchCursoComponentes(token, {
        page: 1,
        per_page: 500,
      }),
  });

  const { data: modulos } = useQuery({
    queryKey: ["modulos"],

    queryFn: () =>
      fetchModulos(token, {
        page: 1,
        per_page: 500,
      }),
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (selected?.ID) {
        return atualizarCursoModulo(
          values,
          token,
          selected.ID
        );
      }

      return registarCursoModulo(
        values,
        token
      );
    },

    onSuccess: () => {
      toast.success(
        selected
          ? "Registo atualizado com sucesso"
          : "Registo criado com sucesso"
      );

      queryClient.invalidateQueries({
        queryKey: [QCursoModulo],
      });

      handleClose();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Erro ao guardar"
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      curso_componente_id: "",
      modulo_id: "",
      carga_horaria: "",
      ordem: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  const handleEdit = (item) => {
    setSelected(item);

    formik.setValues({
      curso_componente_id:
        item.curso_componente_id,

      modulo_id:
        item.modulo_id,

      carga_horaria:
        item.carga_horaria,

      ordem:
        item.ordem,
    });

    setShow(true);
  };

  const handleNovo = () => {
    setSelected(null);

    formik.resetForm();

    setShow(true);
  };

  const handleClose = () => {
    setSelected(null);

    formik.resetForm();

    setShow(false);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Não poderá reverter.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCursoModulo(id, token);

      toast.success(
        "Registo removido"
      );

      queryClient.invalidateQueries({
        queryKey: [QCursoModulo],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Erro ao remover"
      );
    }
  };

  return (
    <>
     <ToastContainer />
      <Card className="shadow p-3 mb-3">
        <Row>
          <Col md={3}>
            <Button
              variant="success"
              onClick={handleNovo}
            >
              <BsPlusCircle />
              {" Novo Registo"}
            </Button>
          </Col>

          <Col md={9}>
            {isFetching && (
              <span className="text-success">
                Atualizando...
              </span>
            )}
          </Col>
        </Row>
      </Card>

      <Card className="shadow p-3">
        <TableCursoModulo
          data={data}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selected
              ? "Editar Curso Módulo"
              : "Novo Curso Módulo"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            onSubmit={
              formik.handleSubmit
            }
          >
            <FloatingLabel
              label="Curso Componente"
              className="mb-3"
            >
              <Form.Select
                name="curso_componente_id"
                value={
                  formik.values
                    .curso_componente_id
                }
                onChange={
                  formik.handleChange
                }
              >
                <option value="">
                  Selecione
                </option>

                {cursoComponentes?.items?.map(
                  (item) => (
                    <option
                      key={item.ID}
                      value={item.ID}
                    >
                      Curso {item.curso_id}
                      {" - "}
                      Componente{" "}
                      {
                        item.componente_id
                      }
                    </option>
                  )
                )}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              label="Módulo"
              className="mb-3"
            >
              <Form.Select
                name="modulo_id"
                value={
                  formik.values.modulo_id
                }
                onChange={
                  formik.handleChange
                }
              >
                <option value="">
                  Selecione
                </option>

                {modulos?.items?.map(
                  (item) => (
                    <option
                      key={item.ID}
                      value={item.ID}
                    >
                      {item.nome}
                    </option>
                  )
                )}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
              label="Carga Horária"
              className="mb-3"
            >
              <Form.Control
                type="number"
                name="carga_horaria"
                value={
                  formik.values
                    .carga_horaria
                }
                onChange={
                  formik.handleChange
                }
              />
            </FloatingLabel>

            <FloatingLabel
              label="Ordem"
              className="mb-3"
            >
              <Form.Control
                type="number"
                name="ordem"
                value={
                  formik.values.ordem
                }
                onChange={
                  formik.handleChange
                }
              />
            </FloatingLabel>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Fechar
              </Button>

              <Button
                className="ms-2"
                type="submit"
                variant="success"
              >
                {selected
                  ? "Atualizar"
                  : "Registar"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

     
    </>
  );
}

export default RegisterCursoModulo;