import { useState } from "react";
import { Table, Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atualizarExperiencia, criarExperiencia, removerExperiencia, listarExperiencias} from "../../../../../../api/formadorExperiencias.api";



/**
 * StepExperiencias – CRUD inline
 * @param {number} formadorId
 * @param {array} experiencias
 */
export default function StepExperiencias({
  formadorId,
  experiencias = [],
}) {
  const [show, setShow] = useState(false);
  const [editando, setEditando] = useState(1);
 

  const queryClient = useQueryClient();

  const fechar = () => {
    setShow(false);
    setEditando(null);
    formik.resetForm();
  };
  //listar experiencias
  
  const {
    data: experienciasData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["experiencias", formadorId],
    queryFn: listarExperiencias,
    select: (response) => response.data, // 👈 só o array
  });

  const abrirNovo = () => setShow(true);

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

  /* 🔄 Mutations */

  const criarMutation = useMutation({
    mutationFn: ({ formadorId, payload }) =>
      criarExperiencia(formadorId, payload),
  
    onSuccess: () => {
      queryClient.invalidateQueries(["formador", formadorId]);
      Swal.fire("Sucesso", "Experiência criada", "success");
      fechar();
    },
  });
//"/<int:formador_id>/experiencias/<int:experiencia_id>"
  const atualizarMutation = useMutation({
    mutationFn: ({ id, payload }) => atualizarExperiencia({formador_id: formadorId, payload, experiencia_id: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["experiencias", formadorId]);
      Swal.fire("Sucesso", "Experiência atualizada", "success");
      fechar();
    },
  });

  const removerMutation = useMutation({
    
    mutationFn: ({ id }) => removerExperiencia({formador_id: formadorId, experiencia_id: id}),
    onSuccess: () => {
      queryClient.invalidateQueries(["formador", formadorId]);
      Swal.fire("Removido", "Experiência removida", "success");
    },
  });

  /* 📋 Formik */

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
      if (editando) {
        const payload = {
          cargo: values.cargo,
          instituicao: values.instituicao,
          descricao: values.descricao,
          anos_experiencia: values.anos_experiencia,
        };
        atualizarMutation.mutate({
          id: editando.id,
          payload,
        });
      } else {
        //formar o json com os dados
        
        const payload = {
          cargo: values.cargo,
          instituicao: values.instituicao,
          descricao: values.descricao,
          anos_experiencia: values.anos_experiencia,
        };

        criarMutation.mutate({
          formadorId,
          payload
        });
      }
    },
  });

  /* 🗑️ Remover */

  const remover = (id) => {
    
    Swal.fire({
      title: "Remover experiência?",
      text: "Esta ação não pode ser desfeita",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, remover",
    }).then((res) => {
      if (res.isConfirmed) {
        removerMutation.mutate({id});
      }
    });
  };
  
  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-success" onClick={abrirNovo}> Nova Experiência</Button>
      </div>

      <Table striped bordered hover>
        <thead className="table-success fw-bold fs-6 ">
          <tr>
            <th>Cargo</th>
            <th>Instituição</th>
            <th>Anos</th>
            <th width="120">Ações</th>
          </tr>
        </thead>

        <tbody>
          {experienciasData.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4 ">
                 
                 Nenhuma experiência adicionada.
              </td>
            </tr>
          )}

          {experienciasData.map((e) => (
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

      {/* 🧾 Modal */}
      <Modal show={show} onHide={fechar}>
        <Modal.Header closeButton className="bg-success mb-2 text-light">
          <Modal.Title>
            {editando ? "Editar Experiência" : "Nova Experiência"}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
           
              <FloatingLabel label="Cargo" className="mb-4">

              <Form.Control
              className="input_left_color p-2"
                name="cargo"
                placeholder="Cargo"
                value={formik.values.cargo}
                onChange={formik.handleChange}
                isInvalid={formik.touched.cargo && formik.errors.cargo}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.cargo}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Instituição" className="mb-3">
              <Form.Control
              className="input_left_color p-2"
                name="instituicao"
                placeholder="Instituição"
                value={formik.values.instituicao}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.instituicao && formik.errors.instituicao
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.instituicao}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Anos de Experiência" className="mb-4">
              <Form.Control
                type="number"
                name="anos_experiencia"
                className="input_left_color p-2"
                placeholder="Anos de Experiência"
                value={formik.values.anos_experiencia}
                onChange={formik.handleChange}
                isInvalid={
                  formik.touched.anos_experiencia &&
                  formik.errors.anos_experiencia
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.anos_experiencia}
              </Form.Control.Feedback>
            </FloatingLabel>

            <FloatingLabel label="Descrição" className="mb-3">
              <Form.Control
              className="input_left_color p-2"
              placeholder="Descrição"     
                as="textarea"
                rows={3}
                name="descricao"
                value={formik.values.descricao}
                onChange={formik.handleChange}
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={fechar}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {editando ? "Atualizar" : "Salvar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
