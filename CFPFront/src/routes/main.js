import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Footer from "../component/Footer/Footer";
import RegisterUser from "../view/sing/registouser";
import Home from "../view/main/home";

function Main() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  

  return (
    <>
      {/* Se autenticado, exibe as rotas protegidas */}
      
        <>
         <Home />
        </>
     
    </>
  );
}

export default Main;
