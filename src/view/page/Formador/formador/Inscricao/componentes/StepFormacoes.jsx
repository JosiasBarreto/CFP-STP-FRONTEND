import { useState } from "react";
import { Table, Button, Modal, Form, Row, Col, FloatingLabel, FormControl } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { atualizarFormacao, criarFormacao, listarFormacoes, obterFormacaoPorId, removerFormacao } from "../../../../../../api/formadorFormacoes.api";
import { useQuery } from "@tanstack/react-query";
import { getTiposFormacao } from "../../../../../../api/listas.api";
import { toast, ToastContainer } from "react-toastify";

/**
 * StepFormacoes – CRUD inline
 * @param {number} formadorId
 * @param {array} formacoes
 * @param {array} tiposFormacao
 * 
 */

export default function StepFormacoes({
  formadorId,
  formacoes = [],
  tiposFormacao = [],
}) {
  const [show, setShow] = useState(false);
  const [editando, setEditando] = useState(null);
  const [tiposFormacaoState, setTiposFormacaoState] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
const [tiposFiltrados, setTiposFiltrados] = useState([]);


  const queryClient = useQueryClient();
  const {
      data:  formacoesData = [],
      isLoading,
      isError,
    } = useQuery({
      queryKey: ["formacoes", formadorId],
      queryFn: obterFormacaoPorId,
      select: (response) => response.data, // 👈 só o array
    });

  const fechar = () => {
    setShow(false);
    setEditando(null);
    formik.resetForm();
  };

  const abrirNovo = (categoria) => {
    setCategoriaSelecionada(categoria);
  
    const categoriaEncontrada = tiposFormacaos.find(
      (c) => c.categoria === categoria
    );
  
    setTiposFiltrados(categoriaEncontrada?.tipos || []);
  
    formik.resetForm();
    formik.setFieldValue("nome_tipo_formacao", categoria);
  
    setShow(true);
  };
  

  const abrirEditar = (formacao) => {
    setEditando(formacao);
    formik.setValues({
      tipo_formacao_id: formacao.tipo_formacao_id,
      descricao: formacao.descricao || "",
      nome_tipo_formacao: formacao.nome_tipo_formacao || "",
      nivel: formacao.tipo_formacao.nome || "",
    });
    setShow(true);
  };

  const mutationCriar = useMutation({
    mutationFn: ({ formador_id, ...values }) => criarFormacao({ formadorId: formador_id, payload: values }),
    onSuccess: () => {
      queryClient.invalidateQueries(["formador", formadorId]);
     toast.success("Formação criada com sucesso!");
     fechar();
    },
  });
//formador_id, formacao_id, payload
  const mutationAtualizar = useMutation({
    mutationFn: ({ formacao_id, data }) => atualizarFormacao({ formador_id: formadorId, formacao_id, payload: data }),
    onSuccess: () => {
      queryClient.invalidateQueries(["formacoes", formadorId]);

     toast.success("Formação atualizada com sucesso!");
     fechar();
    },
  });

  const mutationRemover = useMutation({
    mutationFn: ({ id }) => removerFormacao(formadorId, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["formador", formadorId]);
      toast.success("Formação removida com sucesso!");
    },
  });

  const formik = useFormik({
    initialValues: {
      tipo_formacao_id: "",
      descricao: "",
      nome_tipo_formacao: "",
      nivel: "",
    },

    validationSchema: Yup.object({
      tipo_formacao_id: Yup.number().when([], {
        is: () => !editando,
        then: (schema) => schema.required("Selecione o tipo de formação"),
        otherwise: (schema) => schema.notRequired(),
      }),
      nivel: Yup.string(),
    }),

    onSubmit: (values) => {
      if (editando) {
        mutationAtualizar.mutate({
          formacao_id: editando.id,
          data: {
            ...values,
            tipo_formacao_id: editando.tipo_formacao_id,
          },
        });
      } else {
        mutationCriar.mutate({
          formador_id: formadorId,
          ...values,
        });
      }
    },
  });
  const { data: tiposFormacaos = [] } = useQuery({
    queryKey: ["tipos-formação"],
    queryFn: getTiposFormacao,
  });
  const remover = (id) => {
    Swal.fire({
      title: "Pretendes mesmo eliminar esta formação?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        mutationRemover.mutate({id});
      }
    });
  };


  return (
    <>
    <ToastContainer />
      <div className="d-flex justify-content-end mb-3">
  {tiposFormacaos.map((t) => (
    <div key={t.categoria} className="me-2">
      <Button
        variant="outline-success"
        onClick={() => abrirNovo(t.categoria)}
      >
        ➕ {t.categoria}
      </Button>
    </div>
  ))}
</div>

<Table
  bordered
  hover
  responsive
  size="sm"
  className="align-middle"
>
  <thead className="table-light">
    <tr>
      <th style={{ width: "20%" }}>Tipo de Habilitações</th>
      <th style={{ width: "20%" }}>Nivel </th>

      <th>Descrição</th>
      <th className="text-center" style={{ width: "120px" }}>
        Ações
      </th>
    </tr>
  </thead>

  <tbody>
    {formacoesData.length === 0 ? (
      <tr>
        <td colSpan="3" className="text-center text-muted py-4">
          📭 Nenhuma formação adicionada
        </td>
      </tr>
    ) : (
      formacoesData.map((f, index) => (
        <tr key={f.id}>
          {/* Tipo */}
          <td className="fw-semibold">
            {f.tipo_formacao.categoria}
          </td>
          <td>{f.tipo_formacao.nome}</td>
          {/* Descrição */}
          <td className="text-muted">
            {f.descricao || (
              <span className="fst-italic text-secondary">
                Sem descrição
              </span>
            )}
          </td>

          {/* Ações */}
          <td className="text-center">
            <Button
              size="sm"
              variant="outline-primary"
              className="me-2"
              title="Editar"
              onClick={() => abrirEditar(f)}
            >
              ✏️
            </Button>

            <Button
              size="sm"
              variant="outline-danger"
              title="Remover"
              onClick={() => remover(f.id)}
            >
              🗑️
            </Button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</Table>


      {/* Modal */}
      <Modal show={show} onHide={fechar}>
        <Modal.Header closeButton className="bg-success mb-2">
          <Modal.Title className="text-light  p-2">
            {editando ? "Editar" : "Adicionar "} {formik.values.nome_tipo_formacao}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={formik.handleSubmit}>
          <Modal.Body>
            {editando ? (
              <FloatingLabel
              controlId="tipo_formacao_id"
              label="Nivel de Formação"className="mb-4">
                <FormControl
                className="input_left_color p-2"
                  type="text"
                  placeholder="Nivel de Formação"
                  name="nivel"
                  value={formik.values.nivel}
                  readOnly
                  disabled={true}
                  enabled={false}
                 
                />
              </FloatingLabel>
            ):(<FloatingLabel
              controlId="tipo_formacao_id"
              label="Nivel de Formação"
              className="mb-3">
              <Form.Select
              className="input_left_color p-2"
  name="tipo_formacao_id"
  value={formik.values.tipo_formacao_id}
  onChange={formik.handleChange}
  isInvalid={
    formik.touched.tipo_formacao_id &&
    formik.errors.tipo_formacao_id
  }
>
  <option value="">Selecione o nivel de formação</option>

  {tiposFiltrados.map((tipo) => (
    <option key={tipo.id} value={tipo.id}>
      {tipo.nome}
    </option>
  ))}
</Form.Select>

              <Form.Control.Feedback type="invalid">
                {formik.errors.tipo_formacao_id}
              </Form.Control.Feedback>

              </FloatingLabel>)}
            
            
            

            <Form.Group>
              <Form.Label>Descrição {formik.values.nome_tipo_formacao}</Form.Label>
              <Form.Control
              className="input_left_color p-2"
                as="textarea"
                rows={3}
                name="descricao"
                value={formik.values.descricao}
                onChange={formik.handleChange}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={fechar}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              {editando ? "Atualizar" : "Adicionar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
