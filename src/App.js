import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Páginas
import Home from "./view/main/home.js";
import ErrorPage from "./view/Err/index.js";
import Login from "./view/login/Login.js";
import RegisterUser from "./view/sing/registouser.js";
import RegisterProgramas from "./view/sing/registerprogramas.js";
import RegisterCursos from "./view/sing/registercurso.js";
import Registerformandos from "./view/sing/registerformandos.js";

// Layout
import DashboardLayout from "./view/home/index.js";
import Main from "./component/Menu/Menu.js";

// Componente de Rota Protegida (para páginas que precisam de autenticação)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

// Componente para impedir login de usuários autenticados
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/auth" /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública: Se o usuário não estiver autenticado, exibe o login */}
        <Route path="/" element={<PublicRoute element={<Login />} />} />

        {/* Rota protegida: Só acessa se tiver token */}
        <Route path="/auth" element={<DashboardLayout />}>
          {/* Rotas dentro do DashboardLayout */}
          <Route path="home" element={<Home />} />
          <Route path="register-user" element={<RegisterUser />} />
          <Route path="register-programas" element={<RegisterProgramas />} />
          <Route path="register-cursos" element={<RegisterCursos />} />
          <Route path="register-formandos" element={<Registerformandos />} />
        </Route>

        {/* Página de erro para rotas inválidas */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
