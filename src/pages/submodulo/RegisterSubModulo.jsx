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

import Swal from "sweetalert2";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import TableSubModulo from "./TableSubModulo";

import {
  fetchSubModulos,
  registarSubModulo,
  atualizarSubModulo,
  deleteSubModulo,
} from "./service";

import {
  fetchModulos,
} from "../modulo/service";

import { validationSchema } from "./validation";
import { QSubModulo } from "./query";

function RegisterSubModulo() {
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [nomeFiltro, setNomeFiltro] = useState("");

  // Submódulos
  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QSubModulo, nomeFiltro],

    queryFn: () =>
      fetchSubModulos(token, {
        nome: nomeFiltro,
        page: 1,
        per_page: 100,
      }),
  });

  // Módulos para Select
  const {
    data: modulos,
  } = useQuery({
    queryKey: ["modulos-select"],

    queryFn: () =>
      fetchModulos(token, {
        page: 1,
        per_page: 500,
      }),
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (selected?.ID) {
        return atualizarSubModulo(
          values,
          token,
          selected.ID
        );
      }

      return registarSubModulo(
        values,
        token
      );
    },

    onSuccess: () => {
      toast.success(
        selected
          ? "Submódulo atualizado com sucesso"
          : "Submódulo registado com sucesso"
      );

      queryClient.invalidateQueries({
        queryKey: [QSubModulo],
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
      modulo_id: "",
      nome: "",
      descricao: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  const handleNovo = () => {
    setSelected(null);

    formik.resetForm();

    setShow(true);
  };

  const handleEdit = (item) => {
    setSelected(item);

    formik.setValues({
      modulo_id: item.modulo_id,
      nome: item.nome || "",
      descricao: item.descricao || "",
    });

    setShow(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Esta ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSubModulo(
        id,
        token
      );

      toast.success(
        "Submódulo removido com sucesso"
      );

      queryClient.invalidateQueries({
        queryKey: QSubModulo,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Erro ao remover"
      );
    }
  };

  const handleClose = () => {
    setSelected(null);

    formik.resetForm();

    setShow(false);
  };

  return (
    <>
      <Card className="shadow p-3 mb-3">
        <Row>
          <Col md={4}>
            <Form.Control
              placeholder="Pesquisar Submódulo"
              value={nomeFiltro}
              onChange={(e) =>
                setNomeFiltro(
                  e.target.value
                )
              }
            />
          </Col>

          <Col md={3}>
            <Button
              variant="success"
              onClick={handleNovo}
            >
              Novo Submódulo
            </Button>
          </Col>

          <Col md={5}>
            {isFetching && (
              <span className="text-success">
                Atualizando...
              </span>
            )}
          </Col>
        </Row>
      </Card>

      <Card className="shadow p-3">
        <TableSubModulo
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
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selected
              ? "Editar Submódulo"
              : "Novo Submódulo"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
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
                isInvalid={
                  formik.touched
                    .modulo_id &&
                  formik.errors
                    .modulo_id
                }
              >
                <option value="">
                  Selecione um módulo
                </option>

                {modulos?.items?.map(
                  (modulo) => (
                    <option
                      key={modulo.ID}
                      value={
                        modulo.ID
                      }
                    >
                      {modulo.nome}
                    </option>
                  )
                )}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                {
                  formik.errors
                    .modulo_id
                }
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              label="Nome"
              className="mb-3"
            >
              <Form.Control
                name="nome"
                value={
                  formik.values.nome
                }
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

            <FloatingLabel
              label="Descrição"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                style={{
                  height: "120px",
                }}
                name="descricao"
                value={
                  formik.values
                    .descricao
                }
                onChange={
                  formik.handleChange
                }
              />
            </FloatingLabel>

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={
                  handleClose
                }
              >
                Fechar
              </Button>

              <Button
                className="ms-2"
                variant="success"
                type="submit"
                disabled={
                  mutation.isPending
                }
              >
                {mutation.isPending
                  ? "Guardando..."
                  : selected
                  ? "Atualizar"
                  : "Registar"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </>
  );
}

export default RegisterSubModulo;