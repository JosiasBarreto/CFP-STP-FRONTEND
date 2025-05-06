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
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortAlphaDown,
  faArrowDownZA,
  faList,
} from "@fortawesome/free-solid-svg-icons";

import { PaginatedList } from "../../../component/Panilist";
import axios from "axios";
import { API_URL } from "../../../api/urls";
import { useNavigate } from "react-router-dom";
import {
  formatarNomeCompleto,
  formatarNomeReducaoProgressiva,
} from "../function";

function TableFormandos({ data, pagination, isLoading, isFetching }) {
  const [formandos, setFormandos] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [formandoSelecionado, setFormandoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

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
    const sorted = [...formandos].sort((a, b) =>
      a.nome_completo.localeCompare(b.nome_completo)
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
    <Card className="shadow rounded p-2 mb-2">
      <div className="d-flex hstack gap-3 p-1">
        <Dropdown onSelect={handleItemsPerPageChange}>
          <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
            Itens
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="20">10</Dropdown.Item>
            <Dropdown.Item eventKey="30">30</Dropdown.Item>
            <Dropdown.Item eventKey="50">50</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button variant="outline-success" onClick={ListAll}>
          <FontAwesomeIcon icon={faList} /> Todos
        </Button>

        <Button variant="outline-success" onClick={OrderName}>
          <FontAwesomeIcon
            icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
          />{" "}
          Nome
        </Button>

        {isFetching && <p className="text-success m-0">Carregando...</p>}

        <Col>
          <Form>
            <Form.Control
              type="text"
              placeholder="Pesquisar Candidato"
              className="me-3"
              aria-label="Search"
              onChange={handleSearch}
            />
          </Form>
        </Col>
      </div>
      <div className="table-responsive">
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16">Nenhum formando encontrado.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Col>
        <PaginatedList
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </Col>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="text-white">
            <Modal.Title>Ficha de Inscrição Formando</Modal.Title>
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
                          "data:image/png;base64,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"
                        }
                        alt="Foto do formando"
                        onError={(e) => {
                          e.target.onerror = null; // evita loop infinito
                          e.target.src = "data:image/png;base64,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"; // fallback
                        }}
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
    </Card>
  );
}

export default TableFormandos;
