import React from "react";
import { Pagination, Table, Col, Row } from "react-bootstrap";

export const PaginatedList = ({
  totalPages,
  currentPage,
  handlePageChange,
}) => {
  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto" className="d-flex gap-1">
          <Pagination size="sm">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />

            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </Col>
      </Row>
    </>
  );
};
