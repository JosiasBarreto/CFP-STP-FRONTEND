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

import TableModulo from "./TableModulo";

import {
  fetchModulos,
  registarModulo,
  atualizarModulo,
  deleteModulo,
} from "./service";

import { validationSchema } from "./validation";
import { QModulo } from "./query";
import { BsPlusCircle } from "react-icons/bs";

function RegisterModulo() {
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [nomeFiltro, setNomeFiltro] = useState("");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QModulo, nomeFiltro],
    queryFn: () =>
      fetchModulos(token, {
        nome: nomeFiltro,
        page: 1,
        per_page: 50,
      }),
  });

  const mutation = useMutation({
    mutationFn: async (values) => {
      if (selected?.ID) {
        return atualizarModulo(
          values,
          token,
          selected.ID
        );
      }

      return registarModulo(values, token);
    },

    onSuccess: () => {
      toast.success(
        selected
          ? "Módulo atualizado com sucesso"
          : "Módulo registado com sucesso"
      );

      queryClient.invalidateQueries({
        queryKey: [QModulo],
      });

      handleClose();
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          "Erro ao guardar módulo"
      );
    },
  });

  const formik = useFormik({
    initialValues: {
      nome: "",
      descricao: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      await mutation.mutateAsync(values);
    },
  });

  const handleEdit = (modulo) => {
    setSelected(modulo);

    formik.setValues({
      nome: modulo.nome || "",
      descricao: modulo.descricao || "",
    });

    setShow(true);
  };

  const handleNovo = () => {
    setSelected(null);

    formik.resetForm();

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
      await deleteModulo(id, token);

      toast.success(
        "Módulo removido com sucesso"
      );

      queryClient.invalidateQueries({
        queryKey: [QModulo],
      });

      
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Erro ao remover módulo"
      );
    }
  };

  const handleClose = () => {
    setShow(false);

    setSelected(null);

    formik.resetForm();
  };

  return (
    <>
    <ToastContainer />
      <Card className="shadow p-3 mb-3">
        <Row>
          <Col md={4}>
            <Form.Control
              placeholder="Pesquisar módulo"
              value={nomeFiltro}
              onChange={(e) =>
                setNomeFiltro(e.target.value)
              }
            />
          </Col>

          <Col md={3}>
            <Button
              variant="success"
              onClick={handleNovo}
            >
              <BsPlusCircle />
              {" Novo"}
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
        <TableModulo
          data={data}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selected
              ? "Editar Módulo"
              : "Novo Módulo"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <FloatingLabel
              label="Nome"
              className="mb-3"
            >
              <Form.Control
                name="nome"
                value={formik.values.nome}
                onChange={formik.handleChange}
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
                style={{ height: "120px" }}
                name="descricao"
                value={formik.values.descricao}
                onChange={formik.handleChange}
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
                variant="success"
                type="submit"
                disabled={mutation.isPending}
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

      
    </>
  );
}

export default RegisterModulo;