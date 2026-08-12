import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
export const SummaryPanel = ({ rows }) => {
    const total = rows.length;
    const validos = rows.filter((r) => r.isValid).length;
    const invalidos = total - validos;
    const comFoto = rows.filter((r) => !!r.foto).length;
    const semFoto = total - comFoto;
    if (total === 0)
        return null;
    return (<Card className="mb-4 shadow-sm border-0 rounded-3">
      <Card.Body className="p-4">
        <Card.Title className="text-secondary fw-bold mb-3 fs-6">Resumo da Importação</Card.Title>
        <Row className="text-center g-3">
          <Col>
            <div className="p-3 bg-light rounded-3">
              <h6 className="text-muted mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Total Lidos</h6>
              <span className="fs-3 fw-bold text-dark">{total}</span>
            </div>
          </Col>
          <Col>
            <div className="p-3 bg-success bg-opacity-10 rounded-3 border border-success border-opacity-25">
              <h6 className="text-success mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Válidos</h6>
              <span className="fs-3 fw-bold text-success">{validos}</span>
            </div>
          </Col>
          <Col>
            <div className="p-3 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-25">
              <h6 className="text-danger mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Inválidos</h6>
              <span className="fs-3 fw-bold text-danger">{invalidos}</span>
            </div>
          </Col>
          <Col>
            <div className="p-3 bg-info bg-opacity-10 rounded-3">
              <h6 className="text-info mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Com Foto</h6>
              <span className="fs-3 fw-bold text-info">{comFoto}</span>
            </div>
          </Col>
          <Col>
            <div className="p-3 bg-warning bg-opacity-10 rounded-3">
              <h6 className="text-warning text-dark mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Sem Foto</h6>
              <span className="fs-3 fw-bold text-warning text-dark">{semFoto}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>);
};
