import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Spinner,
  FloatingLabel,
  Alert,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUndo,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import {
  BuscarInscricao,
  LastIdFormando,
  Selecaomassa,
} from "../../sing/function";

import SelectField from "../../../component/Selects/Index";
import SelectFieldCurso from "../../../component/Selects/selectcursos";
import ListSelets from "../../sing/table/listselectsformandos";
import MyComponent from "../../../component/InfoCard/CardsInfoselects";
import Finalizar from "../Turma/confirmseletc";
import { useLocation } from "react-router-dom";
function Selectsformandos() {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [filtros, setFiltros] = useState(true);
  const [dtcursos, setDtcursos] = useState([]);
  const [showinfo, setShowinfo] = useState(false);
  const [situacoes, setSituacoes] = useState([]);
  const location = useLocation();
  const formData = location.state || {}; // dados vindos da navegação

  const [searchParams, setSearchParams] = useState({
    ano_execucao: formData.ano_execucao || new Date().getFullYear(),
    nome_programa: formData.nome_programa || "",
    nome_curso: formData.nome_curso || "",
    acao: formData.acao || "",
    id_curso: formData.id_curso || 0,
  });
  useEffect(() => {
    if (formData && formData.id_curso) {
      ToggleStatusFilter(); // ou qualquer outra lógica que precise
    }
  }, [formData]);
  

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
        updatedParams = {
          ...updatedParams,
          nome_curso: "",
          ano_execucao: new Date().getFullYear(),
          acao: "",
          id_curso: 0,
        };
      }
  
      if (name === "nome_curso") {
        // Agora value é o ID do curso
        const cursoSelecionado = dtcursos.find((curso) => curso.id.toString() === value);
  
        if (cursoSelecionado) {
          updatedParams = {
            ...updatedParams,
            nome_programa: cursoSelecionado.programa_nome,
            nome_curso: cursoSelecionado.nome, // se ainda precisar salvar o nome
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
      id_curso: 0,
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

  function ToggleStatusInfo() {
    return !searchParams.nome_curso?.trim();
  }

  function ToggleStatusFilter() {
    if (ToggleStatusInfo()) {
      setShowinfo(true);
    } else {
      setFiltros((prevFiltros) => !prevFiltros);
    }
  }

  const contarSituacoes = () => {
    const contagem = {
      selecionados: 0,
      nselecionados: 0,
      suplentes: 0,
      desistidos: 0,
      total: datas?.resultados?.length || 0,
    };

    datas?.resultados?.forEach((item) => {
      const id = item.incricao_id;
      const statusProvisorio = situacoes.find(
        (s) => s.idInscricao === id
      )?.status;

      const statusReal =
        statusProvisorio ||
        item.cursos_inscritos.find((c) => c.opcao === "1")?.status;

      switch (statusReal) {
        case "selecionado":
          contagem.selecionados++;
          break;
        case "não selecionado":
          contagem.nselecionados++;
          break;
        case "suplente":
          contagem.suplentes++;
          break;
        case "desistiu":
          contagem.desistidos++;
          break;
        default:
          break;
      }
    });

    return contagem;
  };
  const { selecionados, nselecionados, suplentes, desistidos, total } =
    contarSituacoes();

  function Cancelar() {
    setSituacoes([]);
    setFiltros(!filtros);
    handleLimpar();
  }

  return (
    <>
      <Row className="bg-white shadow rounded p-3 mb-2 align-items-center">
        {filtros ? (
          <>
            <Row
              md={12}
              className="d-flex flex-wrap align-items-center mb-2 mt-3 "
            >
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
                  value={searchParams.curso_id}
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
          </>
        ) : (
          <Row className="t-0">
            <MyComponent searchParams={searchParams} />
          </Row>
        )}
        {!filtros ? (
          <Row
            md={12}
            xs={12}
            className="d-flex align-items-end rounded "
          >
            <Col md={9}>
              <Row md={12} xs={12} className="mt-0 g-2">
                {[
                  { label: "Total Inscritos", name: "total", value: total ,variant: "success"},
                  {
                    label: "Selecionados",
                    name: "selecionados",
                    value: selecionados,
                    variant: "primary",
                  },
                  { label: "Suplentes", name: "suplentes", value: suplentes,variant: "info" },
                  {
                    label: "Não Selecionados",
                    name: "nselecionados",
                    value: nselecionados,
                    variant: "danger",
                  },
             
                  {
                    label: "Desistidos",
                    name: "desistidos",
                    value: desistidos,
                    variant: "warning",
                  },
                  
                ].map(({ label, name, value, variant }) => (
                  <Col md={2} xs={12} key={name}>
                    <div className={`bg-${variant}-subtle text-${variant} rounded-3 p-2 text-center shadow-sm`}>
                      <div className="fw-semibold fs-6">
                        {value}
                      </div>
                      <div className="small text-muted">{label}</div>
                    </div>
                  </Col>
                
                   
                     
                ))}
              </Row>
            </Col>

            <Col md={3} className="d-flex align-items-center gap-2 ">
              <Finalizar
                situacoes={situacoes}
                selecionados={selecionados}
                nselecionados={nselecionados}
                suplentes={suplentes}
                desistidos={desistidos}
                total={total}
                funcaoresert={Cancelar}
              />
              <Button
                variant="outline-warning"
                className="btn p-2"
                onClick={Cancelar}
              >
                CANCELAR
              </Button>
            </Col>
          </Row>
        ) : (
          <Row md={12} xs={12} className="align-items-center ">
            <Col md={3} className="text-center">
              <Button
                variant="outline-success"
                onClick={ToggleStatusFilter}
                disabled={loading}
                className="w-75 shadow-sm d-flex align-items-center justify-content-center gap-1"
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Selecionar os Candidatos
              </Button>
            </Col>

            <Col md={7}>
              {showinfo && (
                <Alert
                  variant="warning"
                  className="text-center p-1 d-flex align-items-center justify-content-center"
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-warning me-2"
                  />
                  Selecione o curso que desejas fazer a seleção dos candidatos
                  primeiro!!
                </Alert>
              )}
            </Col>

            <Col md={2} className="text-end">
              {datas?.resultados && (
                <div className="text-muted mt-2 pe-1 fs-6">
                  <p className="mb-0 fw-light">
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Resultados Encontrados:
                  </p>
                  <div className="d-flex justify-content-evenly">
                    <Badge bg="primary" className="px-3 py-2">
                      T: <strong>{datas.resultados.length}</strong>
                    </Badge>
                    <Badge bg="success" className="px-3 py-2">
                      M:{" "}
                      <strong>
                        {
                          datas.resultados.filter((c) => c.sexo === "Masculino")
                            .length
                        }
                      </strong>
                    </Badge>
                    <Badge bg="warning" className="px-3 py-2">
                      F:{" "}
                      <strong>
                        {
                          datas.resultados.filter((c) => c.sexo === "Feminino")
                            .length
                        }
                      </strong>
                    </Badge>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        )}
      </Row>

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
          situacoes={situacoes}
          setSituacao={setSituacoes}
          filtros={filtros}
          ToggleStatusFilter={ToggleStatusFilter}
        />
      </Row>
      <ToastContainer />
    </>
  );
}

export default Selectsformandos;
