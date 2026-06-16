import React from "react";

import {
  Table,
  Button,
} from "react-bootstrap";

import {
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";

function TableCursoModulo({
  data,
  onEdit,
  onDelete,
}) {
  return (
    <Table
      responsive
      striped
      bordered
      hover
      size="sm"
    >
      <thead className="table-success">
        <tr>
          <th>ID</th>
          <th>Curso</th>
          <th>Componente</th>
          <th>Módulo</th>
          <th>Carga Horária</th>
          <th>Ordem</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {data?.items?.length > 0 ? (
          data.items.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>

              <td>
                {
                  item
                    .curso_componente
                    ?.curso_id
                }
              </td>

              <td>
                {
                  item
                    .curso_componente
                    ?.componente_id
                }
              </td>

              <td>
                {item.modulo?.nome}
              </td>

              <td>
                {item.carga_horaria}
              </td>

              <td>{item.ordem}</td>

              <td>
                <Button
                  size="sm"
                  variant="outline-success"
                  onClick={() =>
                    onEdit(item)
                  }
                >
                  <BsPencilSquare />
                </Button>

                <Button
                  size="sm"
                  variant="outline-danger"
                  className="ms-2"
                  onClick={() =>
                    onDelete(item.ID)
                  }
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={7}
              className="text-center"
            >
              Nenhum registo encontrado
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default TableCursoModulo;