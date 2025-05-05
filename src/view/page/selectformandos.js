import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { BuscarInscricao, LastIdFormando } from "../sing/function";
import TableFormandos from "../sing/table/tableformandos";
import SelectField from "../../component/Selects/Index";
import SelectFieldCurso from "../../component/Selects/selectcursos";
import ListSelets from "../sing/table/listselectsformandos";

function Selectsformandos() {
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
    queryKey: ["Qformandos", searchParams],
    queryFn: () => BuscarInscricao(token, searchParams),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["Qformandos"] });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    await queryClient.invalidateQueries({ queryKey: ["Qformandos"] });
    setLoading(false);
  };

  const handleLimpar = async () => {
    setLoading(true);
    setSearchParams({
      nome_formando: "",
      ano_execucao: new Date().getFullYear(),
      nome_programa: "",
      nome_curso: "",
      acao: "",
    });
    await queryClient.invalidateQueries({ queryKey: ["Qformandos"] });
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
      <div className="bg-white shadow rounded p-2 mb-2">
        <Row className="align-items-stretch">
          <Col md={10}>
            <Row className="gx-2 gy-2">
              <Col md={12}>
                <p className="text-muted mb-1">
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  <strong>Filtros</strong>
                </p>
              </Col>

              <Form className="w-100">
                <Row className="gx-2 gy-2">
                  
                  <Col md={4}>
                    <SelectField
                      value={searchParams.nome_programa}
                      onChange={handleChange}
                      isInvalid={false}
                      feedback=""
                      token={token}
                    />
                  </Col>
                  <Col md={4}>
                    <SelectFieldCurso
                      value={searchParams.nome_curso}
                      onChange={handleChange}
                      isInvalid={false}
                      feedback=""
                      token={token}
                      anoExecucao={searchParams.ano_execucao}
                      programaId={searchParams.nome_programa}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      type="number"
                      name="ano_execucao"
                      value={searchParams.ano_execucao}
                      onChange={handleChange}
                      placeholder="Ano"
                    />
                  </Col>

                  <Col md={2}>
                    <Form.Control
                      type="text"
                      name="acao"
                      value={searchParams.acao}
                      onChange={handleChange}
                      placeholder="Ação"
                    />
                  </Col>

                  <Col md={1}>
                    <Button
                      variant="success"
                      onClick={handleSearch}
                      disabled={loading}
                      className="w-100"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <FontAwesomeIcon icon={faSearch} className="ms-1" />
                      )}
                    </Button>
                  </Col>
                  <Col md={1}>
                    <Button
                      variant="outline-secondary"
                      onClick={handleLimpar}
                      disabled={loading}
                      className="w-100"
                    >
                      <FontAwesomeIcon icon={faUndo} className="me-1" />
                    </Button>
                  </Col>
                </Row>

                {datas?.resultados && (
                  <div className="text-muted mt-2 text-end pe-1 fs-7">
                    Total: <strong>{datas.resultados.length}</strong>
                  </div>
                )}
              </Form>
            </Row>
          </Col>
        </Row>
      </div>

      <ToastContainer />

      <ListSelets
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

export default Selectsformandos;
