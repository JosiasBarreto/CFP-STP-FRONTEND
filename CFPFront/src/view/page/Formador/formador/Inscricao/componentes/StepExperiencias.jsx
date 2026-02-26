import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  atualizarExperiencia,
  criarExperiencia,
  removerExperiencia,
  listarExperiencias,
} from "../../../../../../api/formadorExperiencias.api";
import { toast, ToastContainer } from "react-toastify";

/**
 * StepExperiencias – CRUD inline
 * @param {number} formadorId
 */
export default function StepExperiencias({ formadorId }) {
  const [show, setShow] = useState(false);
  const [editando, setEditando] = useState(null);

  const queryClient = useQueryClient();
  const QUERY_KEY = ["experienciasProfissional", formadorId];

  /* ------------------------- Helpers ------------------------- */

  const fechar = () => {
    setShow(false);
    setEditando(null);
    formik.resetForm();
  };

  const abrirNovo = () => {
    setEditando(null);
    formik.resetForm();
    setShow(true);
  };

  const abrirEditar = (exp) => {
    setEditando(exp);
    formik.setValues({
      cargo: exp.cargo,
      instituicao: exp.instituicao,
      descricao: exp.descricao || "",
      anos_experiencia: exp.anos_experiencia,
    });
    setShow(true);
  };

  /* ------------------------- Query ------------------------- */
  const formadorIdNumber = Number(formadorId);;
  const {
    data: experienciasData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["experienciasProfissional", formadorIdNumber],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      console.log("A buscar experiências do formador:", id);
      return listarExperiencias(id);
    },
    
  });

  /* ------------------------- Mutations ------------------------- */

  const criarMutation = useMutation({
    mutationFn: ({ formadorId, payload }) =>
      criarExperiencia(formadorId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      toast.success("Experiência criada com sucesso!");
      fechar();
    },
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      atualizarExperiencia({
        formador_id: formadorId,
        experiencia_id: id,
        payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      toast.success("Experiência atualizada com sucesso!");
      fechar();
    },
  });

  const removerMutation = useMutation({
    mutationFn: ({ id }) =>
      removerExperiencia({
        formador_id: formadorId,
        experiencia_id: id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY);
      toast.success("Experiência removida com sucesso!");
    },
  });

  /* ------------------------- Formik ------------------------- */

  const formik = useFormik({
    initialValues: {
      cargo: "",
      instituicao: "",
      descricao: "",
      anos_experiencia: "",
    },

    validationSchema: Yup.object({
      cargo: Yup.string().required("Cargo é obrigatório"),
      instituicao: Yup.string().required("Instituição é obrigatória"),
      anos_experiencia: Yup.number()
        .required("Informe os anos")
        .min(0, "Valor inválido"),
    }),

    onSubmit: (values) => {
      const payload = {
        cargo: values.cargo,
        instituicao: values.instituicao,
        descricao: values.descricao,
        anos_experiencia: Number(values.anos_experiencia),
      };

      if (editando) {
        atualizarMutation.mutate({
          id: editando.id,
          payload,
        });
      } else {
        criarMutation.mutate({
          formadorId,
          payload,
        });
      }
    },
  });

  /* ------------------------- Remover ------------------------- */

  const remover = (id) => {
    Swal.fire({
      title: "Remover experiência?",
      text: "Esta ação não pode ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
      cancelButtonText: "Cancelar",
    }).then((res) => {
      if (res.isConfirmed) {
        removerMutation.mutate({ id });
      }
    });
  };

  /* ------------------------- Render ------------------------- */

  if (isLoading) {
    return <p className="text-center">A carregar experiências...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-danger">
        Erro ao carregar experiências.
      </p>
    );
  }

  return (
    <>
      <ToastContainer />

      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-success" onClick={abrirNovo}>
          Nova Experiência
        </Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-success fw-bold">
          <tr>
            <th>Cargo</th>
            <th>Instituição</th>
            <th>Anos</th>
            <th width="120">Ações</th>
          </tr>
        </thead>

        <tbody>
          {experienciasData.data.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Nenhuma experiência adicionada.
              </td>
            </tr>
          )}

          {experienciasData.data.map((e) => (
            <tr key={e.id}>
              <td>{e.cargo}</td>
              <td>{e.instituicao}</td>
              <td>{e.anos_experiencia}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => abrirEditar(e)}
                >
                  ✏️
                </Button>{" "}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => remover(e.id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ------------------------- Modal ------------------------- */}

      <Modal show={show} onHide={fechar}>
        <Modal.Header closeButton className="bg-success text-light">
          <Modal.Title>
            {editando ? "Editar Experiência" : "Nova Experiência"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            <FloatingLabel label="Cargo" className="mb-3">
              <Form.Control
                name="cargo"
                value={formik.values.cargo}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.cargo && !!formik.errors.cargo
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.cargo}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Instituição" className="mb-3">
              <Form.Control
                name="instituicao"
                value={formik.values.instituicao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.instituicao &&
                  !!formik.errors.instituicao
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.instituicao}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel
              label="Anos de Experiência"
              className="mb-3"
            >
              <Form.Control
                type="number"
                name="anos_experiencia"
                value={formik.values.anos_experiencia}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.anos_experiencia &&
                  !!formik.errors.anos_experiencia
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.anos_experiencia}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Descrição">
              <Form.Control
                as="textarea"
                name="descricao"
                style={{ height: "100px" }}
                value={formik.values.descricao}
                onChange={formik.handleChange}
              />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={fechar}>
              Cancelar
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={
                criarMutation.isPending ||
                atualizarMutation.isPending
              }
            >
              {editando ? "Atualizar" : "Salvar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
