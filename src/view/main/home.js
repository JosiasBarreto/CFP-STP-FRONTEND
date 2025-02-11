import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaBars, FaBox, FaUsers } from "react-icons/fa";
import Menu from "../../component/Menu/Menu";
import InfoCard from "../../component/InfoCard/InfoCard";
import SalesChart from "../../component/Charts/SalesChart";
import Footer from "../../component/Footer/Footer";


const Home = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Menu de Navegação */}
      <nav className="navbar navbar-light bg-light d-md-none">
        <Button variant="link" onClick={toggleMenu}>
          <FaBars size={24} />
        </Button>
      </nav>

      <div className="d-flex flex-grow-1">
        <Menu isMenuCollapsed={isMenuCollapsed} toggleMenu={toggleMenu} />
        <main className="flex-grow-1 p-3">
          <Container fluid>
            <Row className="mb-4 g-3">
              <Col xs={12} md={4}>
                <InfoCard icon={<FaBox />} title="Total de Vendas" value="120" bgColor="primary" />
              </Col>
              <Col xs={12} md={4}>
                <InfoCard icon={<FaBox />} title="Produtos no Estoque" value="85" bgColor="success" />
              </Col>
              <Col xs={12} md={4}>
                <InfoCard icon={<FaUsers />} title="Clientes" value="45" bgColor="warning" />
              </Col>
            </Row>

            <div className="bg-white shadow-sm rounded p-4">
              <h5 className="mb-3">Vendas Mensais</h5>
              <SalesChart />
            </div>
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

