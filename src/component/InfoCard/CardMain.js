import { Row, Col, Card } from "react-bootstrap";
import { FaBox, FaUsers } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const DashboardCards = () => {
  const { theme } = useContext(ThemeContext); // Obtém o tema atual

  // Lista de cards com cores mais suaves para contraste
  const cards = [
    {
      icon: <FaBox />,
      title: "Total de Vendas",
      value: "120",
      color: "#0d6efd",
    }, // Azul
    {
      icon: <FaBox />,
      title: "Produtos no Estoque",
      value: "85",
      color: "#198754",
    }, // Verde
    { icon: <FaUsers />, title: "Clientes", value: "45", color: "#ffc107" }, // Amarelo
  ];

  return (
    <Row className="mb-4 g-3">
      {cards.map((card, index) => (
        <Col key={index} xs={12} sm={6} md={4}>
          <Card
            className={`shadow-sm text-center border- p-2 ${
              theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
            }`}
          >
            <Card.Body>
              <Card.Title className="fw-bold fs-6">
                <Row>
                  <Col>
                    {/* Ícone centralizado dentro de um círculo menor */}
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: card.color + "20", // Cor mais suave (20% opacidade)
                        color: card.color, // Ícone com a cor forte
                        fontSize: "1.5rem",
                      }}
                    >
                      {card.icon}
                    </div>
                  </Col>
                  <Col>{card.title}</Col>
                </Row>
                <Card.Text className="fs-4 fw-semibold">{card.value}</Card.Text>
              </Card.Title>
              
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardCards;
