import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { BuscarInscricao, LastIdFormando } from "../sing/function";
import TableFormandos from "../sing/table/tableformandos";

function ListFormandos() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useState({
    nome_formando: "",
    ano_execucao: new Date().getFullYear(),
    nome_programa: "",
    nome_curso: "",
    acao: "",
  });

  const [contagem, setContagem] = useState(0);
  const [loading, setLoading] = useState(false);

  const { data: lastid } = useQuery({
    queryKey: ["lastid"],
    queryFn: () => LastIdFormando(token),
  });

  const { data: datas, isLoading } = useQuery({
    queryKey: ["Qprograma", searchParams],
    queryFn: () => BuscarInscricao(token, searchParams),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    queryClient.invalidateQueries({ queryKey: ["Qprograma"] });
    setLoading(false);
  };

  const handleLimpar = async () => {
    setLoading(true);
    const clean = {
      nome_formando: "",
      ano_execucao: new Date().getFullYear(),
      nome_programa: "",
      nome_curso: "",
      acao: "",
    };
    setSearchParams(clean);
    queryClient.invalidateQueries({ queryKey: ["Qprograma"] });
    setLoading(false);
  };

  useEffect(() => {
    if (lastid && Array.isArray(lastid)) {
      const target = lastid.length;
      setContagem(0);
      let current = 0;
      const intervalId = setInterval(() => {
        current++;
        setContagem(current);
        if (current >= target) clearInterval(intervalId);
      }, 20);
      return () => clearInterval(intervalId);
    }
  }, [lastid]);

  const resultados = datas?.resultados || [];

  return (
    <>
      <div className="bg-white shadow rounded p-3 mb-2">
        <Row className="align-items-stretch">
          {/* Card de Contador */}
          <Col md={3}>
            <Card className="border_tops shadow h-100">
              <Card.Body className="d-flex flex-column justify-content-center text-center">
                <FontAwesomeIcon
                  icon={faUser}
                  size="3x"
                  className="text-success mb-2"
                />
                <span className="fw-bold fs-5">Formandos</span>
                <p className="fs-4 fw-semibold m-0">{contagem}</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Filtros */}
          <Col md={9}>
            <Form className="h-100">
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group controlId="nomeCurso">
                    <Form.Label visuallyHidden>Nome do curso</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_curso"
                      value={searchParams.nome_curso}
                      onChange={handleChange}
                      placeholder="Nome do curso"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId="anoExecucao">
                    <Form.Label visuallyHidden>Ano de execução</Form.Label>
                    <Form.Control
                      type="number"
                      name="ano_execucao"
                      value={searchParams.ano_execucao}
                      onChange={handleChange}
                      placeholder="Ano"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={5}>
                  <Form.Group controlId="nomePrograma">
                    <Form.Label visuallyHidden>Nome do programa</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_programa"
                      value={searchParams.nome_programa}
                      onChange={handleChange}
                      placeholder="Programa"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="acao">
                    <Form.Label visuallyHidden>Ação</Form.Label>
                    <Form.Control
                      type="text"
                      name="acao"
                      value={searchParams.acao}
                      onChange={handleChange}
                      placeholder="Ação"
                      className="form-control-lg"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Button
                    variant="success"
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-100"
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSearch} className="me-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </Col>

                <Col md={4}>
                  <Button
                    variant="outline-secondary"
                    onClick={handleLimpar}
                    disabled={loading}
                    className="w-100"
                  >
                    <FontAwesomeIcon icon={faUndo} className="me-2" />
                    Limpar
                  </Button>
                </Col>
              </Row>

              {datas && datas.resultados && (
                <div className="text-muted mt-3 text-end pe-2">
                  Total de resultados: <strong>{datas.resultados.length}</strong>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </div>

      <ToastContainer />

      <TableFormandos
        data={resultados}
        pagination={datas?.pagination}
        isLoading={isLoading}
        searchParams={searchParams}
        handleChange={handleChange}
        handleSearch={handleSearch}
        handleLimpar={handleLimpar}
        contagem={contagem}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}

export default ListFormandos;
