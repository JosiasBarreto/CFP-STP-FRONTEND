import React from "react";
import {
  Table,
  Button,
} from "react-bootstrap";

import {
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";

function TableModulo({
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
          <th>Nome</th>
          <th>Descrição</th>
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {data?.items?.length > 0 ? (
          data.items.map((item) => (
            <tr key={item.ID}>
              <td>{item.ID}</td>

              <td>{item.nome}</td>

              <td>{item.descricao}</td>

              <td
                className="
                d-flex
                justify-content-center
                gap-2
              "
              >
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
              colSpan={4}
              className="text-center"
            >
              Nenhum módulo encontrado
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default TableModulo;