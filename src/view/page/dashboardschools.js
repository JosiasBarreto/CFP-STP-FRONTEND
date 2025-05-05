import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBook, FaClipboard, FaUserTie, FaChalkboardTeacher } from "react-icons/fa";
import "./SchoolDashboard.css";

const SchoolDashboard = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  return (
    <Container fluid className="dashboard-container">
      

      {/* 🔹 Cards organizados em linha */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <FaClipboard className="card-icon" />
              <Card.Title>Programas</Card.Title>
              <Card.Text>📌 12 Programas Disponíveis</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <FaBook className="card-icon" />
              <Card.Title>Cursos</Card.Title>
              <Card.Text>📖 35 Cursos Ativos</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <FaUserTie className="card-icon" />
              <Card.Title>Formandos</Card.Title>
              <Card.Text>🎓 2450 Alunos Matriculados</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <FaChalkboardTeacher className="card-icon" />
              <Card.Title>Formadores</Card.Title>
              <Card.Text>👨‍🏫 68 Professores</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🔹 Informações importantes e calendário lado a lado */}
      <Row>
        <Col md={6}>
          <Card className="dashboard-info-card">
            <Card.Body>
              <Card.Title>🔔 Informações Importantes</Card.Title>
              <Card.Text>
                📢 Inscrições abertas para novos cursos!  
                📆 Próximo evento acadêmico: 10 de Maio  
                🔥 Fique atento às atualizações no portal!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="dashboard-calendar-card">
            <Card.Body>
              <Card.Title>📅 Calendário</Card.Title>
              <Card.Text>{formattedDate}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SchoolDashboard;
