import React from "react";
import { Table, Button, Row, Card, Pagination, Col } from "react-bootstrap";
import {
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";

function TableComponente({
  data,
  editar,
  remover,
}) {
  return (
    <>
    <Row className="mb-3">
    {data?.items?.length > 0 ? (
      data.items.map((item) => (
        <Col md={4} key={item.ID}>
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <Card.Title>
               Componente {item.nome}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              {item.descricao}
              
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
              <Button
                variant="outline-success"
                onClick={() => editar(item)}
              >
                <BsPencilSquare />
                {" Editar"}
              </Button>
              <Button
                variant="outline-danger"
                className="ms-2"
                onClick={() => remover(item.ID)}
              >
                <BsTrash />
                   {" Remover"}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      ))
    ) : (
      <Col md={12}>
        <Card className="shadow">
          <Card.Body className="text-center">
            Nenhum componente encontrado
          </Card.Body>
        </Card>
      </Col>
      )}
    </Row>
    
    </>
  );
}

export default TableComponente;