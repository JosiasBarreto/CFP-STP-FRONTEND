import React from "react";
import { Table, Button } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

function TableCursoComponente({
  data,
  onEdit,
  onDelete,
}) {
  return (
    <Table striped bordered hover size="sm" responsive>
      <thead className="table-success">
        <tr>
          <th>Curso</th>
          <th>Componente</th>
          <th>Carga Horária</th>
          <th>Ordem</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {data?.items?.length > 0 ? (
          data.items.map((item) => (
            <tr key={item.ID}>
              <td>{item.curso?.nome}</td>

              <td>{item.componente?.nome}</td>

              <td>{item.carga_horaria}</td>

              <td>{item.ordem}</td>

              <td className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={() => onEdit(item)}
                >
                  <BsPencilSquare />
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDelete(item.ID)}
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="text-center">
              Nenhum registo encontrado
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default TableCursoComponente;