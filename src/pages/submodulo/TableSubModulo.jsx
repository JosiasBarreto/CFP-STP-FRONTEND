import React from "react";
import { Accordion, ListGroup, Button } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function TableSubModulo({ data, onEdit, onDelete }) {
  // Agrupar submódulos por módulo
  const grouped = data?.items?.reduce((acc, item) => {
    const moduloNome = item.modulo?.nome || "Sem módulo";
    if (!acc[moduloNome]) acc[moduloNome] = [];
    acc[moduloNome].push(item);
    return acc;
  }, {});

  return (
    <Accordion>
      {grouped && Object.entries(grouped).map(([moduloNome, submodulos], idx) => (
        <Accordion.Item eventKey={idx.toString()} key={idx}>
          <Accordion.Header>{moduloNome}</Accordion.Header>
          <Accordion.Body>
            <ListGroup>
              {submodulos.map((sub) => (
                <ListGroup.Item key={sub.ID} className="d-flex justify-content-between align-items-center">
                  <span>{sub.nome}</span>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(sub)}
                      className="me-2"
                    >
                      <BsPencilSquare />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(sub.ID)}
                    >
                      <BsTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default TableSubModulo;
