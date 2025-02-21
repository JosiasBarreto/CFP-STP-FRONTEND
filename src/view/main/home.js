import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaBars, FaBox, FaUsers } from "react-icons/fa";
import Main from "../../component/Menu/Menu";
import InfoCard from "../../component/InfoCard/InfoCard";
import SalesChart from "../../component/Charts/SalesChart";
import Footer from "../../component/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import RegisterUser from "../sing/registouser";

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
        <Main isMenuCollapsed={isMenuCollapsed} toggleMenu={toggleMenu} />
        
      </div>
      <Footer />
    
    </div>
  );
};

export default Home;
