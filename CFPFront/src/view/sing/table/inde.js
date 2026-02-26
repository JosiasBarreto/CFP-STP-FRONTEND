import React, { useState } from "react";
import { Table, Spinner, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const TableFormandos = ({ data, isLoading, isFetching, pagination }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = pagination.totalPages || 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="table-responsive">
      {isLoading || isFetching ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="success" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-muted my-4">Nenhum formando encontrado.</div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-success">
              <tr>
                <th>Nome</th>
                <th>Curso</th>
                <th>Distrito</th>
                <th>Ano</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((formando, index) => (
                <tr key={index}>
                  <td>{formando.nome}</td>
                  <td>{formando.curso}</td>
                  <td>{formando.distrito}</td>
                  <td>{formando.ano}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-primary me-3"
                      style={{ cursor: "pointer" }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-danger"
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={currentPage === page + 1}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default TableFormandos;
