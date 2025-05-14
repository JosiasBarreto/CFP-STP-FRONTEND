// TurmaCard.js
import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Badge,
  CardHeader,
  Modal,
  Button,
} from "react-bootstrap";
import { formatarData } from "../configureData";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { exportTurmaStyledExcel, exportTurmaToExcel, exportTurmaWithTemplate } from "./documents/excel";
import { exportTurmaToPDF } from "./documents/pdf";

const TurmaInfo = ({ turma, show }) => (
  <>
    <CardHeader className="bg-light border-bottom-0 rounded-top-4 px-4 py-3">
      <h5 className="text-success fw-semibold mb-1">
        {turma?.curso_info.nome_curso}
      </h5>
      <div className="d-flex flex-wrap gap-2">
        <Badge
          bg="success-subtle"
          text="success"
          className="fw-medium px-3 py-1 rounded-pill"
        >
          {turma?.curso_info.programa}
        </Badge>
        <Badge
          bg="success-subtle"
          text="success"
          className="fw-medium px-3 py-1 rounded-pill"
        >
          Ação: {turma?.curso_info.acao}
        </Badge>
        <Badge
          bg="success-subtle"
          text="success"
          className="fw-medium px-3 py-1 rounded-pill"
        >
          Ano: {turma?.curso_info.ano}
        </Badge>
      </div>
    </CardHeader>

    <Card.Body className="px-4">
      <Row className="mb-2">
        <Col xs={6}>
          <div className="text-muted small">Data Início</div>
          <div>{formatarData(turma?.curso_info.data_inicio)}</div>
        </Col>
        <Col xs={6}>
          <div className="text-muted small">Data Término</div>
          <div>{formatarData(turma?.curso_info.data_termino)}</div>
        </Col>
      </Row>

      <Row className="mb-2">
        <Col xs={6}>
          <div className="text-muted small">Horário Início</div>
          <div>{turma?.curso_info.horario}</div>
        </Col>
        <Col xs={6}>
          <div className="text-muted small">Horário Término</div>
          <div>{turma?.curso_info.horario_termino}</div>
        </Col>
      </Row>

      <Row className="mt-3 g-2">
        <small className="text-mutate ">Estátisticas de Inscrição</small>
        <Col md={3} xs={6}>
          <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
            <div className="fw-semibold fs-6">
              {turma?.estatisticas_inscricoes.total_inscritos}
            </div>
            <div className="small text-muted">Inscritos</div>
          </div>
        </Col>
        <Col md={2} xs={6}>
          <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
            <div className="fw-semibold fs-6">
              {turma?.estatisticas_inscricoes.selecionados}
            </div>
            <div className="small text-muted">Selec.</div>
          </div>
        </Col> <Col md={2} xs={6}>
          <div className="bg-info-subtle text-info rounded-3 p-2 text-center shadow-sm">
            <div className="fw-semibold fs-6">
              {turma?.estatisticas_inscricoes.suplente}
            </div>
            <div className="small text-muted">Suple.</div>
          </div>
        </Col>
        <Col md={2} xs={6}>
          <div className="bg-warning-subtle text-warning rounded-3 p-2 text-center shadow-sm">
            <div className="fw-semibold fs-6">
              {turma?.estatisticas_inscricoes.desistidos}
            </div>
            <div className="small text-muted">Desist.</div>
          </div>
        </Col>
        <Col md={3} xs={6}>
          <div className="bg-danger-subtle text-danger rounded-3 p-2 text-center shadow-sm">
            <div className="fw-semibold fs-6">
              {turma?.estatisticas_inscricoes.nao_selecionados}
            </div>
            <div className="small text-muted">Não Selec.</div>
          </div>
        </Col>
       
      </Row>
    </Card.Body>
  </>
);

const TurmaCard = ({ turma }) => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Col md={4} sm={6} xs={12} className="mb-4">
        <div className="turma-card-wrapper">
          <Card className="shadow border-0 rounded-4 turma-card">
            <TurmaInfo turma={turma} show={show} />
            <div className="overlay-button">
              <Button
                variant="outline-success"
                className="rounded-pill px-4"
                onClick={() => setShow(true)}
              >
                <i className="bi bi-eye"></i> Ver Mais
              </Button>
            </div>
          </Card>
        </div>
      </Col>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        size="lg"
        className="rounded-4"
      >
        <Modal.Body>
          <TurmaInfo turma={turma} />
          <Row className="mt-3 g-2 bg-light">
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <i className="bi bi-person-lines-fill text-success fs-4 mb-2"></i>
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_14_17 || 0}
                </div>
                <div className="small text-muted">14 à 17</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_18_24 || 0}
                </div>
                <div className="small text-muted">18 aos 24 anos</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_25_30 || 0}
                </div>
                <div className="small text-muted">25 aos 30 anos</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_31_35 || 0}
                </div>
                <div className="small text-muted">31 aos 35 anos.</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_36_40 || 0}
                </div>
                <div className="small text-muted">36 aos 40 anos</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.faixa_etaria.faixa_41_45 || 0}
                </div>
                <div className="small text-muted">41 aos 45</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6 ">
                  {turma?.faixa_etaria.faixa_46_50 || 0}
                </div>
                <div className="small text-muted">46 aos 50 anos</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-success-subtle text-success rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.estatisticas_inscricoes.faixa_mais_50 || 0}
                </div>
                <div className="small text-muted">+ de 50 anos</div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3 g-2 bg-light">
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.agua_grande || 0}
                </div>
                <div className="small text-muted">Água Grande</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.lobata || 0}
                </div>
                <div className="small text-muted">Lobata</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.me_zochi || 0}
                </div>
                <div className="small text-muted">Mé-zochi</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.cantagalo || 0}
                </div>
                <div className="small text-muted">Cantagalo</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.lemba || 0}
                </div>
                <div className="small text-muted">Lembá</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.caue || 0}
                </div>
                <div className="small text-muted">Caué</div>
              </div>
            </Col>
            <Col md={3} xs={6}>
              <div className="bg-primary-subtle text-primary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.rap || 0}
                </div>
                <div className="small text-muted">RAP</div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3 g-2 bg-light">
            <Col md={6} xs={6}>
              <div className="bg-secondary-subtle text-secondary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.agua_grande || 0}
                </div>
                <div className="small text-muted">Masculino</div>
              </div>
            </Col>
            <Col md={6} xs={6}>
              <div className="bg-secondary-subtle text-secondary rounded-3 p-2 text-center shadow-sm">
                <div className="fw-semibold fs-6">
                  {turma?.distrito.agua_grande || 0}
                </div>
                <div className="small text-muted">Feminino</div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            onClick={() => exportTurmaStyledExcel(turma)}
          >
            Exportar Excel
          </Button>
          <Button
            variant="outline-danger"
            onClick={() => exportTurmaToPDF(turma)}
          >
            Exportar PDF
          </Button>
          <Button
            variant="outline-success"
            onClick={() =>
              navigate("/auth/selecionar-candidatura", {
                state: {
                  ano_execucao: turma?.curso_info.ano,
                  nome_programa: turma?.curso_info.programa,
                  nome_curso: turma?.curso_info.nome_curso,
                  acao: turma?.curso_info.acao,
                  id_curso: turma?.curso_info.curso_id,
                },
              })
            }
          >
            Seleção
          </Button>
          <Button variant="success" onClick={() => navigate("/auth/selecionar-matricula", {
                state: {
                  ano_execucao: turma?.curso_info.ano,
                  nome_programa: turma?.curso_info.programa,
                  nome_curso: turma?.curso_info.nome_curso,
                  acao: turma?.curso_info.acao,
                  id_curso: turma?.curso_info.curso_id,
                },
              })
            }
          >
            Matriculas
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TurmaCard;
