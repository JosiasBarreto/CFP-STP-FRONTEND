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

import { useLocation } from "react-router-dom";
import MyComponent from "../../../component/InfoCard/CardsInfoselects";
import {
  BuscarInscricao,
  Buscarmatricula,
  LastIdFormando,
} from "../../sing/function";
import SelectField from "../../../component/Selects/Index";
import SelectFieldCurso from "../../../component/Selects/selectcursos";
import Finalizar from "../confirmseletc";
import ListSelets from "../../sing/table/listselectsformandos";
import ListMatriculas from "../../sing/table/listmatriculas";
import DsitribesMatriculas from "../../../component/Tabs/matriculastabs";
function ConfirmarMatricula() {
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
    gerar:"",
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
    queryKey: ["Qmatriculas", searchParams],
    queryFn: () => Buscarmatricula(token, searchParams),
  });
  

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["Qmatriculas"] });
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
            nome_curso: cursoSelecionado.nome,

         
          };
          setFiltros(false);
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
      ativo: 0,
      inativo: 0,
      desistentes: 0,
      total: 0,       // apenas com status "selecionado"
      suplente: 0,    // apenas com status "suplente"
    };
  
    const candidatos = datas?.resultados || [];
  
    candidatos.forEach((item) => {
      const id = item.incricao_id;
  
      const temCursoSelecionado = item.cursos_inscritos.some(
        (curso) => curso.status === "selecionado"
      );
  
      const temCursoSuplente = item.cursos_inscritos.some(
        (curso) => curso.status === "suplente"
      );
  
      // Conta total se for selecionado
      if (temCursoSelecionado) {
        contagem.total++;
  
        // Só considera o statusReal se for selecionado
        const statusProvisorio = situacoes.find(
          (s) => s.idInscricao === id
        )?.status_matricula;
  
        const statusReal =
          statusProvisorio ||
          item.status_matricula ||
          item.cursos_inscritos.find((c) =>
            ["1", "2"].includes(c.opcao)
          )?.status_matricula;
  
        switch (statusReal?.toLowerCase()) {
          case "ativo":
            contagem.ativo++;
            break;
          case "não matriculado":
          case "nmatriculado":
            contagem.inativo++;
            break;
          case "inativo":
            contagem.desistentes++;
            break;
          default:
            break;
        }
      }
  
      // Conta suplente separadamente
      if (temCursoSuplente) {
        contagem.suplente++;
      }
    });
  
    return contagem;
  };
  
  
  const { ativo, inativo, desistentes, total, suplente } = contarSituacoes();
  

  function Cancelar() {
    setSituacoes([]);
    setFiltros(!filtros);
    handleLimpar();
  }

  return (
    <>
      <Row md={12} xs={12} className="bg-white shadow rounded p-1 mb-1 align-items-center">
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
          </>
        ) : (
          <Row md={12} xs={12} className="t-0">
            <MyComponent searchParams={searchParams} />
          </Row>
        )}
        {!filtros ? (
          <Row md={12} xs={12} className="d-flex align-items-end rounded ">
            <Col md={9}>
              <Row md={12} xs={12} className="mt-0 g-2">
                {[
                  {
                    label: "Total Selecionado",
                    name: "total",
                    value: total,
                    variant: "success",
                  },
                  {
                    label: "Suplente",
                    name: "suplente",
                    value: suplente,

                    variant: "warning",
                  },
                  {
                    label: "Matriculado",
                    name: "matriculado",
                    value: ativo,

                    variant: "primary",
                  },
                  {
                    label: "Pendente",
                    name: "pendente",
                    value: inativo,
                    variant: "info",
                  },
                  
                  {
                    label: "Desistente",
                    name: "nmatriculado",
                    value: desistentes,

                    variant: "danger",
                  },
                ].map(({ label, name, value, variant }) => (
                  <Col md={2} xs={12} key={name}>
                    <div
                      className={`bg-${variant}-subtle text-${variant} rounded-3 p-2 text-center shadow-sm`}
                    >
                      <div className="fw-semibold fs-6">{value}</div>
                      <div className="small text-muted">{label}</div>
                    </div>
                  </Col>
                ))}
              </Row>
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
        <DsitribesMatriculas
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

export default ConfirmarMatricula;
