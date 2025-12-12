import React, { useState, useEffect, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Card, Button, Form, Col, Dropdown, Row, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faArrowDownZA,
  faList,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { PaginatedList } from "../../../component/Panilist";
import { FaLayerGroup } from "react-icons/fa";

function Tablearea({ carregarArea, formik, datas, isLoading, isFetching, funcao, contagem, deletarArea }) {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUsers(datas || []);
  }, [datas]);

  // Filtra e ordena usando useMemo para performance
  const filteredAndSorted = useMemo(() => {
    let filtered = users.filter((user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (order) {
      filtered.sort((a, b) =>
        order === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)
      );
    }

    return filtered;
  }, [users, order, searchTerm]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentItems = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleOrder = () => setOrder(order === "asc" ? "desc" : "asc");
  const resetList = () => {
    setUsers(datas);
    setSearchTerm("");
    setOrder(null);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <Row className="bg-white p-1 mb-1 shadow-sm rounded">
      {/* CONTROLES */}
      <div className="d-flex flex-wrap gap-3 align-items-center mb-1">
        <Button variant="success" onClick={funcao}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />Adicionar
        </Button>

        <Dropdown onSelect={(val) => setItemsPerPage(Number(val))}>
          <Dropdown.Toggle variant="outline-success">Itens</Dropdown.Toggle>
          <Dropdown.Menu>
            {[25, 40, 55].map((num) => (
              <Dropdown.Item key={num} eventKey={num}>{num}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="outline-success" onClick={resetList}>
          {contagem} Àrea de Formação
        </Button>

        <Button variant="outline-success" onClick={toggleOrder}>
          <FontAwesomeIcon icon={order === "asc" ? faSortAlphaDown : faArrowDownZA} className="me-2" />
          Nome
        </Button>

        {isFetching && <span className="text-muted small">Carregando...</span>}

        <Col>
          <Form.Control type="text" placeholder="🔍 Pesquisar áreas de formação..." onChange={handleSearch} value={searchTerm} />
        </Col>
      </div>

      {/* LISTA DE CARDS */}

      
      <Row>
        {currentItems.map((user) => (
          <Col key={user.id} xs={12} md={6} lg={4} className="mb-2">
            <ListGroup horizontal className="w-100 p-2 shadow-sm rounded">
              <ListGroup.Item className="w-100 d-flex justify-content-between align-items-center">
                <div>
                  <FaLayerGroup className="me-2" />
                  <strong>{user.nome}</strong>
                </div>
                <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => carregarArea(user.id, user.nome)}
                >
                  <BsPencilSquare />
                </Button>
                <Button
                  variant="outline-danger"
                  onClick={() => deletarArea(user.id)}
                >
                  &#10005;
                </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        ))}
      </Row>
      {/* se não houver dados criar um efeito para avisar que não há dados ou não ha acesso a internet */}
      {currentItems.length === 0 && (
        <div className="text-center text-muted my-4">
          Nenhuma área de formação encontrada.
        </div>
      )}


     

      {/* PAGINAÇÃO */}
      <Col className="mt-4">
        <PaginatedList totalPages={totalPages} currentPage={currentPage} handlePageChange={setCurrentPage} />
      </Col>
    </Row>
  );
}

export default Tablearea;
