import React from "react";
import { Card, Col } from "react-bootstrap";
import {
  FaClipboard,
  FaBook,
  FaUserTie,
  FaChalkboardTeacher,
} from "react-icons/fa";
import './dashboard.css';

const SummaryCards = ({ cursos }) => {
  const cardsData = [
    {
      icon: <FaClipboard />,
      title: "Programas",
      value: cursos?.quantidade_programas || 0,
      color: "primary",
    },
    {
      icon: <FaBook />,
      title: "Cursos",
      value: cursos?.quantidade_cursos || 0,
      color: "success",
    },
    {
      icon: <FaUserTie />,
      title: "Formandos",
      value: cursos?.quantidade_formandos || 0,
      color: "info",
    },
    {
      icon: <FaClipboard />,
      title: "Inscrições",
      value: cursos?.quantidade_inscricoes || 0,
      color: "warning",
    },
    {
      icon: <FaClipboard />,
      title: "Matrículas",
      value: cursos?.quantidade_matriculas || 0,
      color: "danger",
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Formadores",
      value: "—", // ainda não implementado no backend
      color: "secondary",
    },
  ];

  return (
    <>
      {cardsData.map((card, index) => (
        <Col xs={12} sm={6} md={4} lg={3} xl={2} key={index} className="mb-3">
          <Card className={`summary-card border-${card.color} border-2 shadow`}>
            <Card.Body className="d-flex align-items-center">
              <div className={`icon-box text-${card.color} me-3`}>
                {card.icon}
              </div>
              <div>
                <Card.Title className="fs-5">{card.title}</Card.Title>
                <Card.Text className="fs-6 fw-semibold">{card.value}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </>
  );
};

export default SummaryCards;
