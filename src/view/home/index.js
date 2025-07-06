import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Image,
  ToastContainer,
} from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaClipboard,
  FaBook,
  FaUserTie,
  FaClipboardCheck,
  FaUsersCog,
  FaCheckSquare,
  FaListUl,
  FaUsers,
  FaBookOpen,
  FaLayerGroup,
} from "react-icons/fa";
import "./index.css";
import UserMenu from "./userMenu";
import { handleLogoutmethods } from "../login/logout";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar control
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null); // inicialmente null

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário:", error);
      }
    }
  }, []);
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
  const handleLogout = () => {};

  const handleEditProfile = () => {
    // lógica para editar perfil
    console.log("Editar perfil");
  };

  const handleChangePassword = () => {
    // lógica para redefinir senha
    console.log("Redefinir senha");
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
              <UserMenu
                userName={user?.nome || "Utilizador"}
                onLogout={() => handleLogoutmethods({ navigate })}
                onEditProfile={handleEditProfile}
                onChangePassword={handleChangePassword}
              />
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
              {/* ======= INÍCIO / PRINCIPAL ======= */}
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("home")}`}
                onClick={() => handleNavigate("home")}
              >
                <FaHome className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Home</span>}
              </Nav.Link>

              {/* ======= GESTÃO DE REGISTROS ======= */}
              {sidebarOpen && <div className="sidebar-group-title">Gestão</div>}

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("register-user")}`}
                onClick={() => handleNavigate("register-user")}
              >
                <FaUserPlus className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Utilizador</span>}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "register-programas"
                )}`}
                onClick={() => handleNavigate("register-programas")}
              >
                <FaLayerGroup className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Programas</span>}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass("register-cursos")}`}
                onClick={() => handleNavigate("register-cursos")}
              >
                <FaBookOpen className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Cursos</span>}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "register-formandos"
                )}`}
                onClick={() => handleNavigate("register-formandos")}
              >
                <FaUsers className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Inscrição</span>}
              </Nav.Link>

              {/* ======= CANDIDATURA ======= */}
              {sidebarOpen && (
                <div className="sidebar-group-title">Candidaturas</div>
              )}

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "listar-inscricoes"
                )}`}
                onClick={() => handleNavigate("list-formandos")}
              >
                <FaListUl className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Pesquisar</span>
                )}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionar-candidatura"
                )}`}
                onClick={() => handleNavigate("selecionar-candidatura")}
              >
                <FaCheckSquare className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Selecionar</span>
                )}
              </Nav.Link>

              {/* ======= TURMAS E MATRÍCULAS ======= */}
              {sidebarOpen && (
                <div className="sidebar-group-title">Turmas & Matrículas</div>
              )}

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionado-turma"
                )}`}
                onClick={() => handleNavigate("selecionado-turma")}
              >
                <FaUsersCog className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-text">Turmas</span>}
              </Nav.Link>

              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "selecionar-matricula"
                )}`}
                onClick={() => handleNavigate("selecionar-matricula")}
              >
                <FaClipboardCheck className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Matrículas</span>
                )}
              </Nav.Link>
              <Nav.Link
                className={`sidebar-link ${getNavLinkClass(
                  "registar-formador"
                )}`}
                onClick={() => handleNavigate("registar-formador")}
              >
                <FaClipboardCheck className="sidebar-icon" />
                {sidebarOpen && (
                  <span className="sidebar-text">Formador</span>
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
            <ToastContainer />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardLayout;
