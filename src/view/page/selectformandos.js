import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Spinner,
  FloatingLabel,
} from "react-bootstrap";
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
      <div>
        <div className="bg-white shadow rounded p-4 mb-2 align-items-center">
          <Row md={12} className="d-flex flex-wrap align-items-center mb-2 ">
            <Col md={3} className="">
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
            <Col md={1}>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="ANO"
              >
                <Form.Control
                  type="number"
                  name="ano_execucao"
                  value={searchParams.ano_execucao}
                  onChange={handleChange}
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
            </Col>

            <Col md={2}>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb-3 w-auto"
                label="AÇÃO Nº"
              >
                <Form.Control
                  type="text"
                  name="acao"
                  value={searchParams.acao}
                  onChange={handleChange}
                  placeholder="Ação"
                  className="input_left_color p-2"
                />
              </FloatingLabel>
            </Col>
            <Col md="2" className="d-flex gap-1">
              <Button
                variant="success"
                onClick={handleSearch}
                disabled={loading}
                className="w-50"
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <FontAwesomeIcon icon={faSearch} className="" />
                )}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={handleLimpar}
                disabled={loading}
                className="w-50"
              >
                <FontAwesomeIcon icon={faUndo} className="" />
              </Button>
            </Col>

            
          </Row>
          <Row md={12} xs={12} className="d-flex">
            
           <p>Atribuir estado a Candidaturas</p> 
            <Button className="">Atribuir</Button> 
            <div className="d-flex gap-2">
            <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="Selecionados"
              >
                <Form.Control
                  type="number"
                  name="selecionados"
                  
             
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="Não Selecionados"
              >
                <Form.Control
                  type="number"
                  name="nselecionados"
                  
             
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="Suplentes"
              >
                <Form.Control
                  type="number"
                  name="suplentes"
                  
             
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="Desistidos"
              >
                <Form.Control
                  type="number"
                  name="desistidos"
                  
             
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
              <FloatingLabel
                controlId="formBasiNome"
                className="mb- w-auto"
                label="Total"
              >
                <Form.Control
                  type="number"
                  name="total"
                  
             value={datas?.resultados.length}
                  placeholder="Ano"
                  className="input_left_color p-2 mb-3"
                />
              </FloatingLabel>
            
              </div>
            
           
            {datas?.resultados && (
              <div className="text-muted mt-2 text-end pe-1 fs-7">
                Total: <strong>{datas.resultados.length}</strong>
              </div>
            )}
          


          </Row>
          
          
         
        </div>

        <Row md={12} xs={12}>
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
        </Row>
        <ToastContainer />
      </div>
    </>
  );
}

export default Selectsformandos;
