import { useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { atualizarFormacao, criarFormacao, removerFormacao } from "../../../../api/formadorFormacoes.api";


export default function FormadorFormacoes({ formadorId, formacoes, tiposFormacao }) {
  const qc = useQueryClient();

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const mutationCreate = useMutation({
    mutationFn: criarFormacao,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Sucesso", "Formação adicionada", "success");
      setShow(false);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: atualizarFormacao,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Sucesso", "Formação atualizada", "success");
      setShow(false);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: removerFormacao,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Removido", "Formação removida", "success");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      tipo_formacao_id: e.target.tipo_formacao_id.value,
      descricao: e.target.descricao.value,
    };

    if (editing) {
      mutationUpdate.mutate({ id: editing.id, payload });
    } else {
      mutationCreate.mutate({ formadorId, payload });
    }
  };

  return (
    <>
      <h5 className="mt-4">
        🎓 Formações
        <Button size="sm" className="ms-2" onClick={() => {
          setEditing(null);
          setShow(true);
        }}>
          + Adicionar
        </Button>
      </h5>

      <Table bordered>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th width="120">Ações</th>
          </tr>
        </thead>
        <tbody>
          {formacoes.map(f => (
            <tr key={f.id}>
              <td>{f.tipo_formacao}</td>
              <td>{f.descricao}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => {
                    setEditing(f);
                    setShow(true);
                  }}
                >
                  Editar
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => mutationDelete.mutate(f.id)}
                >
                  Apagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* MODAL */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editing ? "Editar Formação" : "Nova Formação"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="tipo_formacao_id"
                defaultValue={editing?.tipo_formacao_id || ""}
                required
              >
                <option value="">Selecione</option>
                {tiposFormacao.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                defaultValue={editing?.descricao}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
