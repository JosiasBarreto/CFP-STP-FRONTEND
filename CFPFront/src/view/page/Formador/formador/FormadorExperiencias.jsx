import { useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { atualizarExperiencia, criarExperiencia, removerExperiencia } from "../../../../api/formadorExperiencias.api";


export default function FormadorExperiencias({ formadorId, experiencias }) {
  const qc = useQueryClient();
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(null);

  const mutationCreate = useMutation({
    mutationFn: criarExperiencia,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Sucesso", "Experiência adicionada", "success");
      setShow(false);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: atualizarExperiencia,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Sucesso", "Experiência atualizada", "success");
      setShow(false);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: removerExperiencia,
    onSuccess: () => {
      qc.invalidateQueries(["formador", formadorId]);
      Swal.fire("Removido", "Experiência removida", "success");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      cargo: e.target.cargo.value,
      instituicao: e.target.instituicao.value,
      descricao: e.target.descricao.value,
      anos_experiencia: e.target.anos_experiencia.value,
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
        💼 Experiências
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
            <th>Cargo</th>
            <th>Instituição</th>
            <th>Anos</th>
            <th width="120">Ações</th>
          </tr>
        </thead>
        <tbody>
          {experiencias.map(e => (
            <tr key={e.id}>
              <td>{e.cargo}</td>
              <td>{e.instituicao}</td>
              <td>{e.anos_experiencia}</td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => {
                    setEditing(e);
                    setShow(true);
                  }}
                >
                  Editar
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => mutationDelete.mutate(e.id)}
                >
                  Apagar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editing ? "Editar Experiência" : "Nova Experiência"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                name="cargo"
                defaultValue={editing?.cargo}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Instituição</Form.Label>
              <Form.Control
                name="instituicao"
                defaultValue={editing?.instituicao}
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Anos de Experiência</Form.Label>
              <Form.Control
                type="number"
                name="anos_experiencia"
                defaultValue={editing?.anos_experiencia}
              />
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
