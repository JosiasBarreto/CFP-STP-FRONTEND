import { Navbar, Container, Image } from "react-bootstrap";
import UserMenu from "./userMenu";

const NavbarTop = ({ user, onToggleSidebar }) => (
  <Navbar fixed="top" className="top-navbar">
    <Container fluid className="d-flex justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button className="btn-toggle" onClick={onToggleSidebar}>☰</button>
        <Image src="/logo.png" width={36} />
        <strong className="brand-text">Centro de Formação</strong>
      </div>

      <UserMenu
        userName={user?.nome || "Utilizador"}
      />
    </Container>
  </Navbar>
);

export default NavbarTop;
