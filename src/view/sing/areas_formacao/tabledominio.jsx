import React, { useState, useEffect, useMemo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { Card, Button, Form, Col, Dropdown, Row, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortAlphaDown, faArrowDownZA, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PaginatedList } from "../../../component/Panilist";
import { FaSitemap } from "react-icons/fa";

function TableDominio({ carregarDominio, datas, isLoading, isFetching, funcao, contagem, deletarDominio }) {
  const [dominios, setDominios] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArea, setFilterArea] = useState("");

  useEffect(() => {
    setDominios(datas || []);
  }, [datas]);

  const filteredAndSorted = useMemo(() => {
    let filtered = dominios.filter((d) => {
      const matchName = d.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchArea = filterArea ? d.area_nome === filterArea : true;
      return matchName && matchArea;
    });

    if (order) {
      filtered.sort((a, b) =>
        order === "asc" ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome)
      );
    }
    return filtered;
  }, [dominios, order, searchTerm, filterArea]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentItems = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleOrder = () => setOrder(order === "asc" ? "desc" : "asc");
  const resetList = () => {
    setDominios(datas);
    setSearchTerm("");
    setFilterArea("");
    setOrder(null);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Carregando domínios...</div>;

  return (
    <Row className="bg-white p-1 mb-1 shadow-sm rounded">
      {/* CONTROLES */}
      <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
        <Button variant="success" onClick={funcao}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Novo Domínio
        </Button>

        <Dropdown onSelect={(val) => setItemsPerPage(Number(val))}>
          <Dropdown.Toggle variant="outline-success">Itens</Dropdown.Toggle>
          <Dropdown.Menu>
            {[10, 25, 50].map((num) => (
              <Dropdown.Item key={num} eventKey={num}>{num}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="outline-success" onClick={resetList}>
          {contagem} Domínios
        </Button>

        <Button variant="outline-success" onClick={toggleOrder}>
          <FontAwesomeIcon icon={order === "asc" ? faSortAlphaDown : faArrowDownZA} className="me-2" />
          Nome
        </Button>

        {isFetching && <span className="text-muted small">Atualizando...</span>}

        <Col md={3}>
          <Form.Control type="text" placeholder="🔍 Pesquisar domínios..." value={searchTerm} onChange={handleSearch} />
        </Col>

        <Col md={3}>
          <Form.Select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
            <option value="">Filtrar por Área</option>
            {[...new Set(dominios.map((d) => d.area_nome))].map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </Form.Select>
        </Col>
      </div>

      {/* LISTA DE CARDS */}
      <Row>
        {currentItems.map((dominio) => (
          <Col key={dominio.id} xs={12} md={6} lg={4} className="mb-3">
            <ListGroup horizontal className="w-100 p-2 shadow-sm rounded">
              <ListGroup.Item className="w-100 d-flex justify-content-between align-items-center">
                <div>
                  <FaSitemap className="me-2" />
                  <strong>{dominio.nome}</strong>
                  <div className="text-muted small">Área: {dominio.area_nome || "—"}</div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => carregarDominio(dominio.id, dominio.nome, dominio.area_id)}>
                    <BsPencilSquare />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => deletarDominio(dominio.id)}>
                    &#10005;
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        ))}
      </Row>

      {/* SEM DADOS */}
      {currentItems.length === 0 && (
        <div className="text-center text-muted my-4">
          Nenhum domínio encontrado.
        </div>
      )}

      {/* PAGINAÇÃO */}
      <Col className="mt-4">
        <PaginatedList totalPages={totalPages} currentPage={currentPage} handlePageChange={setCurrentPage} />
      </Col>
    </Row>
  );
}

export default TableDominio;
