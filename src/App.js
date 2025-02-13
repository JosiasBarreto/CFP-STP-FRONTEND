import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./view/main/home.js";
import ErrorPage from "./view/Err/index.js";
import Login from "./view/login/Login.js";
import RegisterUser from "./view/sing/registouser.js";
import Main from "./component/Menu/Menu.js";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};


// Componente que impede usuários autenticados de acessar o login
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" /> : element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública: Se o usuário já estiver autenticado, redireciona para /auth */}
        <Route path="/" element={<PublicRoute element={<Login />} />} />

        {/* Rota protegida: Só acessa se tiver token */}
      <Route path="/auth" element={<ProtectedRoute><Main /></ProtectedRoute>} />

        {/* Página de erro para rotas inválidas */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;

