import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { toast, ToastContainer } from "react-toastify";

import TableCursoComponente from "./TableCursoComponente";

import {
  fetchCursoComponentes,
  registarCursoComponente,
  atualizarCursoComponente,
  deleteCursoComponente,
} from "./service";

import { QCursoComponente } from "./query";
import { fetchCursos } from "../../view/sing/function";
import { fetchComponentes } from "../componentes/services";

function RegisterCursoComponente() {
  const token = localStorage.getItem("token");

  const queryClient = useQueryClient();

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const [page, setPage] = useState(1);
  const [filtroCurso, setFiltroCurso] = useState("");
  
  // SELECTS
  const { data: cursos } = useQuery({
    queryKey: ["cursos-select"],
    queryFn: () => fetchCursos(token, {}),
  });
  
  const { data: componentes } = useQuery({
    queryKey: ["componentes-select"],
    queryFn: () => fetchComponentes(token),
  });

  // LISTAR
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QCursoComponente, page, filtroCurso],
    queryFn: () =>
      fetchCursoComponentes(token, {
        page,
        per_page: 10,
        curso_id: filtroCurso,
      }),
    keepPreviousData: true,
  });

  // MUTATION
  const mutation = useMutation({
    mutationFn: async (values) => {
      if (selected?.ID) {
        return atualizarCursoComponente(
          {
            ...values,
            ID: selected.ID,
          },
          token
        );
      }

      return registarCursoComponente(values, token);
    },

    onSuccess: () => {
      toast.success("Operação realizada com sucesso");

      queryClient.invalidateQueries({
        queryKey: QCursoComponente,
      });

      handleClose();
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.error || "Erro"
      );
    },
  });

  // VALIDATION
  const validationSchema = Yup.object({
    curso_id: Yup.number().required("Curso obrigatório"),
    componente_id: Yup.number().required("Componente obrigatório"),
    carga_horaria: Yup.number().required("Carga horária obrigatória"),
    ordem: Yup.number().required("Ordem obrigatória"),
  });

  const formik = useFormik({
    initialValues: {
      curso_id: "",
      componente_id: "",
      carga_horaria: "",
      ordem: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      await mutation.mutateAsync(values);
      setSubmitting(false);
    },
  });

  const handleEdit = (item) => {
    setSelected(item);

    formik.setValues({
      curso_id: item.curso_id,
      componente_id: item.componente_id,
      carga_horaria: item.carga_horaria,
      ordem: item.ordem,
    });

    setShow(true);
  };

  const handleDelete = async (ID) => {
    if (!window.confirm("Eliminar associação?")) return;

    await deleteCursoComponente(ID, token);

    toast.success("Eliminado com sucesso");

    queryClient.invalidateQueries({
      queryKey: QCursoComponente,
    });
  };

  const handleClose = () => {
    setShow(false);
    setSelected(null);
    formik.resetForm();
  };

  return (
    <div>
      <Card className="p-3 mb-3 shadow">
        <Row>
          <Col md={4}>
            <Form.Control
              placeholder="Filtrar por curso ID"
              value={filtroCurso}
              onChange={(e) =>
                setFiltroCurso(e.target.value)
              }
            />
          </Col>

          <Col md={3}>
            <Button onClick={() => setShow(true)}>
              Novo
            </Button>
          </Col>

          <Col md={5} className="text-end">
            <strong>
              Total: {data?.total || 0}
            </strong>
          </Col>
        </Row>
      </Card>

      <Card className="p-3 shadow">
        {isLoading ? (
          <Spinner />
        ) : (
          <TableCursoComponente
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* MODAL */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Curso x Componente
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
  <Form.Label>Curso</Form.Label>

  <Form.Select
    name="curso_id"
    value={formik.values.curso_id}
    onChange={formik.handleChange}
    isInvalid={formik.touched.curso_id && formik.errors.curso_id}
  >
    <option value="">Selecione um curso</option>

    {cursos?.map((curso) => (
      <option key={curso.id} value={curso.id}>
        {curso.nome}
      </option>
    ))}
  </Form.Select>

  <Form.Control.Feedback type="invalid">
    {formik.errors.curso_id}
  </Form.Control.Feedback>
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Componente</Form.Label>

  <Form.Select
    name="componente_id"
    value={formik.values.componente_id}
    onChange={formik.handleChange}
    isInvalid={
      formik.touched.componente_id &&
      formik.errors.componente_id
    }
  >
    <option value="">Selecione um componente</option>

    {componentes?.items?.map((comp) => (
      <option key={comp.ID} value={comp.ID}>
        {comp.nome}
      </option>
    ))}
  </Form.Select>

  <Form.Control.Feedback type="invalid">
    {formik.errors.componente_id}
  </Form.Control.Feedback>
</Form.Group>

            <FloatingLabel label="Carga Horária" className="mb-3">
              <Form.Control
                name="carga_horaria"
                value={formik.values.carga_horaria}
                onChange={formik.handleChange}
              />
            </FloatingLabel>

            <FloatingLabel label="Ordem">
              <Form.Control
                name="ordem"
                value={formik.values.ordem}
                onChange={formik.handleChange}
              />
            </FloatingLabel>

            <div className="mt-3 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Fechar
              </Button>

              <Button type="submit">
                Salvar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default RegisterCursoComponente;