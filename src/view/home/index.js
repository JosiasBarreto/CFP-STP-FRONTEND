import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Image,
} from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaClipboard,
  FaBook,
  FaUserTie,
} from "react-icons/fa";
import "./index.css";


const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar control
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle sidebar
  };

  const getNavLinkClass = (path) => {
    return location.pathname.includes(path) ? "active-nav-link" : "";
  };
  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(!sidebarOpen); // ou handleToggleSidebar();
  }; 

  return (
    <div className="dashboard-container">
      <Navbar
        bg="success"
        variant="dark"
        fixed="top"
        className="dashboard-navbar"
      >
        <Container fluid>
          <Row style={{ width: "100%" }}>
            <Col md={4} className="logo-container d-flex align-items-center">
              <Image src="/logo.png" alt="Logo do Centro" fluid />{" "}
              <div className="text-light ms-2 text-wrap logo-text">
                <strong>CENTRO DE FORMAÇÃO</strong>
                <br />
                <strong>PROFISSIONAL DE STP</strong>
              </div>
            </Col>
            <Col md={4}></Col>
            <Col md={4} className="user-info text-white">
              <span>Usuário: João Silva</span>
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          <Col
            md={sidebarOpen ? 2 : 3} // Ajusta o tamanho da sidebar com base no estado
            className={`sidebar pt-3 ${sidebarOpen ? "open" : "closed"}`}
          >
            <Nav className="flex-column">
              {/* Botão de Toggle da Sidebar */}
              <div className="toggle-btn-wrapper d-flex justify-content-end">
                <Button
                  variant="outline-success"
                  onClick={handleToggleSidebar}
                  className="toggle-btn"
                >
                  ☰
                </Button>
              </div>
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("home")}`}
                onClick={() => handleNavigate("home")}
              >
                <FaHome className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Home</span>}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("register-user")}`}
                onClick={() => handleNavigate("register-user")}
              >
                <FaUserPlus className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Registrar Usuário</span>
                )}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "register-programas"
                )}`}
                onClick={() => handleNavigate("register-programas")}
              >
                <FaClipboard className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Registrar Programas</span>
                )}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("register-cursos")}`}
                onClick={() => handleNavigate("register-cursos")}
              >
                <FaBook className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Registrar Cursos</span>
                )}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "register-formandos"
                )}`}
                onClick={() => handleNavigate("register-formandos")}
              >
                <FaUserTie className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Registrar Formandos</span>
                )}
              </Nav.Link>
              {sidebarOpen && (
                <div className="sidebar-group-title">Candidatura</div>
              )}
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "listar-inscricoes"
                )}`}
                onClick={() => handleNavigate("list-formandos")}
              >
                <FaClipboard className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Listagem Inscrições</span>
                )}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionar-candidatura"
                )}`}
                onClick={() => handleNavigate("selecionar-candidatura")}
              >
                <FaUserTie className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Selecionar Candidatura</span>
                )}
              </Nav.Link>
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionado-turma"
                )}`}
                onClick={() => handleNavigate("selecionado-turma")}
              >
                <FaUserTie className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Turmas</span>}
              </Nav.Link>
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionar-matricula"
                )}`}
                onClick={() => handleNavigate("selecionar-matricula")}
              >
                <FaUserTie className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Matriculas</span>
                )}
              </Nav.Link>
            </Nav>
          </Col>

          <Col
            className="content-area mt-3"
            onClick={() => {
              if (window.innerWidth < 768 && sidebarOpen) {
                setSidebarOpen(false);
              }
           
            }}
          >
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardLayout;
