import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Spinner,
  FloatingLabel,
  ListGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { BuscarInscricao, LastIdFormando } from "../../sing/function";
import SelectField from "../../../component/Selects/Index";
import SelectFieldCurso from "../../../component/Selects/selectcursos";

function Turmacabecalho() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState(true);
  const [dtcursos, setDtcursos] = useState([]);
  const [showinfo, setShowinfo] = useState(false);
  const [situacoes, setSituacoes] = useState([]);

  const [searchParams, setSearchParams] = useState({
    nome_formando: "",
    ano_execucao: new Date().getFullYear(),
    nome_programa: "",
    nome_curso: "",
    acao: "",
    id_curso: 0,
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
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (situacoes.length > 0) {
        e.preventDefault();
        e.returnValue = ""; // Requerido para funcionar no Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [situacoes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSearchParams((prev) => {
      let updatedParams = { ...prev, [name]: value };

      if (name === "nome_programa") {
        // Ao mudar o programa, resetar curso, ano e ação
        updatedParams = {
          ...updatedParams,
          nome_curso: "",
          ano_execucao: new Date().getFullYear(),
          acao: "",
          id_curso: 0,
        };
      }

      if (name === "nome_curso") {
        const cursoSelecionado = dtcursos.find((curso) => curso.nome === value);
        if (cursoSelecionado) {
          updatedParams = {
            ...updatedParams,
            nome_programa: cursoSelecionado.programa_nome,
            ano_execucao: cursoSelecionado.ano_execucao,
            acao: cursoSelecionado.acao,
            id_curso: cursoSelecionado.id,
          };
        }
      }

      return updatedParams;
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    await queryClient.invalidateQueries({ queryKey: ["Qturma"] });
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
      id_curso: 0,
    });
    await queryClient.invalidateQueries({ queryKey: ["Qturma"] });
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

  return (
    <>
      <Row className="bg-white shadow rounded p-3 mb-2 align-items-center">
        <Row md={12} className="d-flex flex-wrap align-items-center mb-2 mt-3 ">
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
              setDtcursos={setDtcursos}
              disabled={!searchParams.nome_programa}
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

        <ListGroup as="ul">
          <ListGroup.Item as="li" active>
            Cras justo odio
          </ListGroup.Item>
          <ListGroup.Item as="li">Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item as="li" disabled>
            Morbi leo risus
          </ListGroup.Item>
          <ListGroup.Item as="li">Porta ac consectetur ac</ListGroup.Item>
        </ListGroup>
      </Row>

      <ToastContainer />
    </>
  );
}

export default Turmacabecalho;
