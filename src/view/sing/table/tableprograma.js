import React, { useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { Card, Button, Form, Col, Dropdown, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faArrowDownZA,
  faList,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import { PaginatedList } from "../../../component/Panilist";

function TablePrograma({
  carregarPrograma,
  formik,
  deletarPrograma,
  datas,
  isLoading,
  isFetching,
  funcao,
  contagem,
}) {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (datas && datas.length > 0) {
      setUsers(datas);
    }
  }, [datas]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = users.slice(startIndex, endIndex);

  const OrderName = () => {
    const sorted = [...users].sort((a, b) =>
      order === "asc"
        ? b.nome.localeCompare(a.nome)
        : a.nome.localeCompare(b.nome)
    );
    setUsers(sorted);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const ListAll = () => setUsers(datas);

  const handleItemsPerPageChange = (selectedValue) => {
    const newItemsPerPage = parseInt(selectedValue, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredUsers = datas.filter((user) =>
      user.nome.toLowerCase().includes(searchTerm)
    );
    setUsers(filteredUsers);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <Row className="card-container-glass p-4 mb-1">
      <div className="d-flex flex-wrap gap-3 align-items-center mb-1 card-header-controls">
        <Button className="fw-bolder" variant="success" onClick={funcao}>
          <FontAwesomeIcon icon={faPlus} className="me-2" bounce />Adicionar
        </Button>

        <Dropdown onSelect={handleItemsPerPageChange}>
          <Dropdown.Toggle variant="outline-primary" className="fw-semibold">
            <FontAwesomeIcon icon={faList} className="me-2" />
            Itens
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="5">5</Dropdown.Item>
            <Dropdown.Item eventKey="10">10</Dropdown.Item>
            <Dropdown.Item eventKey="15">15</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="outline-secondary" onClick={ListAll}>
          <FontAwesomeIcon icon={faList} className="me-2" />
         {contagem} Programas
        </Button>

        <Button variant="outline-dark" onClick={OrderName}>
          <FontAwesomeIcon
            icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
            className="me-2"
          />
          Nome
        </Button>

        {isFetching && (
          <span className="text-muted small fw-semibold">Carregando...</span>
        )}

        <Col className="flex-grow-1">
          <Form.Control
            type="text"
            placeholder="🔍 Pesquisar Programa..."
            className="shadow-sm"
            onChange={handleSearch}
          />
        </Col>
      </div>

      <Row md={12} className="g-2">
        {currentItems.length > 0 ? (
          currentItems.map((user, index) => (
            <Col key={user.id} md={6} className="mb-3">
              <Card className="card-white h-100 text-success-emphasis shadow border border-2">
                <Card.Body>
                  <Card.Title>{user.nome}</Card.Title>

                  <Card.Text>
                    <strong>Duração:</strong> {user.duracao}
                  </Card.Text>
                  <Card.Text>
                    <strong>Público Alvo:</strong> {user.publico_alvo}
                  </Card.Text>
                  <Card.Text>
                    <strong>Descrição:</strong> {user.descricao}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between">
                  <Button
                    variant="success"
                    className="text-light"
                    size="sm"
                    onClick={() =>
                      carregarPrograma(
                        formik,
                        user.id,
                        user.nome,
                        user.descricao,
                        user.duracao,
                        user.publico_alvo
                      )
                    }
                  >
                    <BsPencilSquare /> Editar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <div className="no-results text-center w-100 py-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="Nenhum resultado encontrado"
              style={{ width: "120px", opacity: 0.6 }}
            />
            <h5
              className="mt-3"
              style={{ color: "#6c757d", fontWeight: "600" }}
            >
              Nenhum Programa encontrado
            </h5>
            <p style={{ color: "#adb5bd" }}>
              Tente ajustar sua pesquisa ou adicione um novo programa.
            </p>
          </div>
        )}
      </Row>

      <Col className="mt-4">
        <PaginatedList
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </Col>
    </Row>
  );
}

export default TablePrograma;
