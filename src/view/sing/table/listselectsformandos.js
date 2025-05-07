import React, { useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import {
  Table,
  Button,
  Form,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Image,
  Badge,
  CardHeader,
  CardBody,
  CardFooter,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faArrowDownZA,
  faList,
  faExclamationTriangle,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";

import { PaginatedList } from "../../../component/Panilist";
import axios from "axios";
import { API_URL } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import SituacaoCandidatura from "../../../component/Selects/SelectionInscrits";

function ListSelets({
  data,
  searchParams,
  isLoading,
  isFetching,
  situacoes,
  setSituacao,
  ToggleStatusFilter,
  filtros,
  setFiltros,
}) {
  const [formandos, setFormandos] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [formandoSelecionado, setFormandoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const navigate = useNavigate();

  const [setFormandosSelecionados] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFormandos(data);
    }
  }, [data]);

  const handleCheckboxChange = (event, id) => {
    const { checked } = event.target;
    setFormandosSelecionados((prevSelecionados) =>
      checked
        ? [...prevSelecionados, id]
        : prevSelecionados.filter((fid) => fid !== id)
    );
  };

  const handleEditar = () => {
    navigate("/auth/register-formandos", {
      state: { dadosFormando: formandoSelecionado },
    });
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFormandos(data);
    }
  }, [data]);

  const totalPages = Math.ceil(formandos.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = formandos.slice(startIndex, endIndex);

  const OrderName = () => {
    const sorted = [...formandos].sort((a, b) => a.nome.localeCompare(b.nome));
    setFormandos(order === "asc" ? sorted.reverse() : sorted);
    setOrder(order === "asc" ? "desc" : "asc");
  };
  const Orderdistrito = () => {
    const sorted = [...formandos].sort((a, b) =>
      a.distrito.localeCompare(b.distrito)
    );
    setFormandos(order === "asc" ? sorted.reverse() : sorted);
    setOrder(order === "asc" ? "desc" : "asc");
  };

  const ListAll = () => {
    if (data) setFormandos(data);
  };

  const handleItemsPerPageChange = (selectedValue) => {
    setItemsPerPage(parseInt(selectedValue, 10));
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = data?.filter((f) =>
      f.nome.toLowerCase().includes(searchTerm)
    );
    setFormandos(filtered || []);
  };

  if (isLoading) return <div>Carregando...</div>;

  const handleVerFormando = async (id) => {
    try {
      const { data } = await axios.get(API_URL + `/formando/buscarid/${id}`);
      setFormandoSelecionado(data);
      setMostrarModal(true);
    } catch (error) {
      console.error("Erro ao carregar dados do formando:", error);
    }
  };
  const Celula = ({ label, valor }) => (
    <div className="border p-2 bg-white h-100">
      <div className="text-muted small fw-semibold">{label}</div>
      <div className="fw-bold">{valor || "---"}</div>
    </div>
  );

  return (
    <>
      <Card className="shadow rounded p-1 mb-2">
        <CardHeader>
          <Row md={12} xs={12}>
            <Col md={7} className="d-flex gap-3">
              <Dropdown onSelect={handleItemsPerPageChange}>
                <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
                  Items Pág.
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="20">20</Dropdown.Item>
                  <Dropdown.Item eventKey="30">30</Dropdown.Item>
                  <Dropdown.Item eventKey="60">60</Dropdown.Item>
                  <Dropdown.Item eventKey="100">100</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="outline-success" onClick={ListAll}>
                <FontAwesomeIcon icon={faList} /> Resultados
              </Button>

              <Button variant="outline-success" onClick={OrderName}>
                <FontAwesomeIcon
                  icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
                />{" "}
                Nome
              </Button>
              <Button variant="outline-success" onClick={Orderdistrito}>
                <FontAwesomeIcon
                  icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
                />{" "}
                Distrito
              </Button>

              {isFetching && <p className="text-success m-0">Carregando...</p>}
            </Col>
            <Col className="">
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Pesquisar Candidato por Nome"
                  className=" w-100"
                  aria-label="Search"
                  onChange={handleSearch}
                />
              </Form>
            </Col>
          </Row>
        </CardHeader>

        <div className="table-responsive" style={{ minHeight: "20rem" }}>
          <Table
            striped
            bordered
            hover
            size="sm"
            className=" align-middle table table-striped table-bordered small"
          >
            <thead className="table-success text-center ">
              <tr>
                <th>Inscr.</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Sexo</th>
                <th>Identif</th>
                <th>Distrito</th>
                <th>Morada</th>
                <th>Contacto</th>
                <th>Curso 1ª Opção</th>
                <th>Curso 2ª Opção</th>
                <th>Opção</th>
                {!filtros && <th>Situação</th>}
              </tr>
            </thead>
            <tbody className="table-group-divider text-size-sm text-start">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={item.incricao_id}>
                    <td>{item.incricao_id}</td>
                    <td>{item.nome}</td>
                    <td>
                      {(() => {
                        const birth = new Date(item.data_nascimento);
                        const today = new Date();
                        let age = today.getFullYear() - birth.getFullYear();
                        const m = today.getMonth() - birth.getMonth();
                        if (
                          m < 0 ||
                          (m === 0 && today.getDate() < birth.getDate())
                        ) {
                          age--;
                        }
                        return age;
                      })()}
                    </td>
                    <td>{item.sexo}</td>
                    <td>{item.bi}</td>
                    <td>{item.distrito}</td>
                    <td>{item.zona}</td>
                    <td>
                      <>
                        {item.contacto && item.contacto.length >= 7 && (
                          <span>{item.contacto}</span>
                        )}
                        {item.contacto_opcional &&
                          item.contacto_opcional.length >= 7 && (
                            <span>{" / " + item.contacto_opcional}</span>
                          )}
                      </>
                    </td>

                    <td>
                      {item.cursos_inscritos.length > 0
                        ? item.cursos_inscritos
                            .filter((c) => c.opcao === "1")
                            .map((c) => c.nome_curso)
                            .join(", ")
                        : "---"}
                    </td>
                    <td>
                      {item.cursos_inscritos.length > 0
                        ? item.cursos_inscritos
                            .filter((c) => c.opcao === "2")
                            .map((c) => c.nome_curso)
                            .join(", ")
                        : "---"}
                    </td>

                    <td>
                      <Button
                        variant="outline-success"
                        onClick={() => handleVerFormando(item.incricao_id)}
                      >
                        Ver
                      </Button>
                    </td>
                    {!filtros && (
                      <td>
                        {(() => {
                          const cursoSelecionado = item.cursos_inscritos.find(
                            (c) =>
                              String(c.curso_id) ===
                              String(searchParams.id_curso)
                          );

                          return (
                            <SituacaoCandidatura
                              items={item}
                              idCurso={cursoSelecionado?.curso_id ?? null}
                              status={cursoSelecionado?.status ?? ""}
                              id_curso_incricao={
                                cursoSelecionado?.id_curso_incricao ?? ""
                              }
                              situacoes={situacoes}
                              setSituacoes={setSituacao}
                            />
                          );
                        })()}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    <div className="d-flex flex-column align-items-center py-3">
                      <FontAwesomeIcon
                        icon={faUserSlash}
                        size="2x"
                        className="text-warning mb-2"
                      />
                      <h5 className="text-warning fw-bold">
                        Nenhum Candidato encontrado
                      </h5>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className="m-none p-none ">
          <PaginatedList
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </Card>
      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          
        <Modal.Title className="w-100">
  <Row className="align-items-center">
    <Col>
      <h5 className="mb-0">Ficha de Inscrição do Formando</h5>
    </Col>
    {!filtros && (
      <Col xs="auto" className="d-flex align-items-center gap-2">
        <span className="fs-6 mb-0">Situação:</span>
        {(() => {
          const cursoSelecionado = formandoSelecionado?.cursos_inscritos.find(
            (c) => String(c.curso_id) === String(searchParams.id_curso)
          );

          return (
            <SituacaoCandidatura
              items={formandoSelecionado}
              idCurso={cursoSelecionado?.curso_id ?? null}
              status={cursoSelecionado?.status ?? ""}
              id_curso_incricao={cursoSelecionado?.id_curso_incricao ?? ""}
              situacoes={situacoes}
              setSituacoes={setSituacao}
            />
          );
        })()}
      </Col>
    )}
  </Row>
</Modal.Title>

        </Modal.Header>
        <Modal.Body>
          {formandoSelecionado ? (
            <div className="container-fluid">
              {/* Cabeçalho */}
              <Card className="mb-3 shadow-sm border-0">
                <Card.Body className="bg-light rounded">
                  <Row className="align-items-center g-3">
                    {/* Foto + Nome + Badges */}
                    <Col md={5} className="d-flex align-items-center gap-3">
                      <Image
                        src={
                          formandoSelecionado.foto_url ||
                          "https://via.placeholder.com/100"
                        }
                        roundedCircle
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                      />
                      <div>
                        <h5 className="mb-1 fw-bold">
                          {formandoSelecionado.nome}
                        </h5>
                        <div className="d-flex flex-wrap gap-1">
                          <Badge bg="secondary">
                            Inscrição: {formandoSelecionado.incricao_id}
                          </Badge>
                          <Badge bg="secondary">
                            Processo: {formandoSelecionado.processo}
                          </Badge>
                          <Badge bg="info">
                            Status: {formandoSelecionado.status}
                          </Badge>
                        </div>
                      </div>
                    </Col>

                    {/* Data de inscrição */}
                    <Col md={3}>
                      <Celula
                        label="Data de Inscrição"
                        valor={formandoSelecionado.data_criacao}
                      />
                    </Col>

                    {/* Observação */}
                    <Col md={4}>
                      <Celula
                        label="Observação"
                        valor={formandoSelecionado.observacao}
                      />
                    </Col>
                    <Col></Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Dados Pessoais */}
              <Card className="mb-1 border-0 shadow-sm">
                <Card.Header className="fs-5 fw-bolder ">
                  Dados Pessoais
                </Card.Header>

                <Row className="g-1 bg-light-subtle">
                  <Col md={6}>
                    <Celula
                      label="Nome do Pai"
                      valor={formandoSelecionado.nome_pai}
                    />
                  </Col>
                  <Col md={6}>
                    <Celula
                      label="Nome da Mãe"
                      valor={formandoSelecionado.nome_mae}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Nº Identificação"
                      valor={formandoSelecionado.bi}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Arquivo de Identificação"
                      valor={formandoSelecionado.arquivo_identificacao}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Data de Nascimento"
                      valor={formandoSelecionado.data_nascimento}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula label="Sexo" valor={formandoSelecionado.sexo} />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Estado Civil"
                      valor={formandoSelecionado.estado_civil}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Naturalidade"
                      valor={formandoSelecionado.naturalidade}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Nacionalidade"
                      valor={formandoSelecionado.nacionalidade}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Contacto"
                      valor={formandoSelecionado.contacto}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Contacto Opcional"
                      valor={formandoSelecionado.contacto_opcional}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula label="Zona" valor={formandoSelecionado.zona} />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Distrito"
                      valor={formandoSelecionado.distrito}
                    />
                  </Col>
                  <Col md={2}>
                    <Celula label="NIF" valor={formandoSelecionado.nif} />
                  </Col>
                  <Col md={4}>
                    <Celula label="Emails" valor={formandoSelecionado.email} />
                  </Col>
                  <Col md={2}>
                    <Celula
                      label="Nº de Agregado Familiar"
                      valor={formandoSelecionado.agregado}
                    />
                  </Col>
                </Row>
              </Card>

              {/* Formação */}
              <Card className="mb-1 border-0 shadow-sm">
                <Card.Header className="fs-5 fw-bolder ">
                  Formação e Ocupação
                </Card.Header>

                <Row className="g-1">
                  <Col md={6}>
                    <Celula
                      label="Habilitação Literária"
                      valor={formandoSelecionado.habilitacao_literaria}
                    />
                  </Col>
                  <Col md={6}>
                    <Celula
                      label="Ocupação"
                      valor={formandoSelecionado.ocupacao}
                    />
                  </Col>
                  <Col md={6}>
                    <Celula
                      label="Formação Profissional"
                      valor={formandoSelecionado.formacao_profissional}
                    />
                  </Col>
                  <Col md={6}>
                    <Celula
                      label="Experiência Profissional"
                      valor={formandoSelecionado.experiencia_profissional}
                    />
                  </Col>
                </Row>
              </Card>

              {/* Cursos */}
              <Card className="mb-0 border-0 shadow-sm">
                <Card.Header className="fs-5 fw-bolder">
                  Cursos ou Área Pretendida pelo Candidato
                </Card.Header>

                <Row className="g-1 bg-light-subtle">
                  {/* Curso opção 1: mostrar Programa e Ação */}
                  {formandoSelecionado.cursos_inscritos?.find(
                    (c) => c.opcao === "1"
                  ) && (
                    <>
                      <Col md={4}>
                        <Celula
                          label="Programa"
                          valor={
                            formandoSelecionado.cursos_inscritos.find(
                              (c) => c.opcao === "1"
                            )?.programa
                          }
                        />
                      </Col>
                      <Col md={2}>
                        <Celula
                          label="Ação"
                          valor={
                            formandoSelecionado.cursos_inscritos.find(
                              (c) => c.opcao === "1"
                            )?.acao
                          }
                        />
                      </Col>
                    </>
                  )}

                  {/* Nome dos cursos (opção 1 e 2) */}
                  {formandoSelecionado.cursos_inscritos?.map((curso, index) => (
                    <Col md={6} key={index}>
                      <Celula
                        label={`Curso Opção ${curso.opcao}`}
                        valor={curso.nome}
                      />
                    </Col>
                  ))}

                  <Col md={6}>
                    <Celula
                      label="Motivo da Inscrição"
                      valor={formandoSelecionado.motivo_inscricao}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          ) : (
            <p>Carregando informações...</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            <BsTrash className="me-1" /> Fechar
          </Button>
          <Button variant="primary" onClick={() => handleEditar()}>
            <BsPencilSquare className="me-1" />
            Editar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ListSelets;
