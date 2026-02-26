import React from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-calendar/dist/Calendar.css";

import Consulta from "../views/consulta/ConsultaPaciente";
import ViewAgendamento from "../views/agendamento/ViewAgendamento";
import HeadersPaciente from "../components/header/HeadersPaciente";
import Cadastro from "../views/perfil/Cadastro.js";

import { Card, Container } from "react-bootstrap";
import Login from "../views/perfil/Login";
import HomePaciente from "../views/home/HomePaciente";
import Farmacias from "../views/farmacia/Farmacias";

import CadastroZona from "../views/cadastro/CadastroZona";
import CadastroDistrito from "../views/cadastro/CadastroDistrito";
import CadastroMedicamento from "../views/cadastro/CadastroMedicamento";
import HeadersAdmin from "../components/header/HeadersAdmin";
import CadastroPatologias from "../views/cadastro/CadastroPatologias";
import CadastroSintoma from "../views/cadastro/CadastroSintoma";
import CadastroEspecialidade from "../views/cadastro/CadastroEspecialidade";

import CadastroExames from "../views/cadastro/CadastroExames.js";
import CadastroProfissional from "../views/cadastro/CadastroProfissional";
import CadastroSecretaria from "../views/cadastro/CadastroSecretaria";
import { useQuery } from "react-query";
import api from "../services/api.js";
import axios from "axios";
import ListPaciente from "../views/list/ListPaciente.js";
import ViewPerfil from "../views/perfil/ViewPerfil.js";
import { Qbuscarpessoaid } from "../services/NameQuery.js";
import { listpessoaid } from "../services/RouttesApi.js";
import ListConsulta from "../layout/ListConsulta.js";
import Footer from "../components/footer/Footer.js";



function Paciente() {

 const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("id");
  const fotos = localStorage.getItem("foto");
  const { data, isLoading } = useQuery(Qbuscarpessoaid, async () => {
    const response = await axios.get(api + listpessoaid+idUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  })
  return (
    <>
      {/**nav barr */}
      <HeadersPaciente />

      {/**rotas */}
      <div className="p-4">
        <Routes>
         
          <Route path="/viewagendamento" element={<ViewAgendamento />} />

          
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default Paciente;