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
import TableFormandos from "./view/sing/table/tableformandos.js";
import ListFormandos from "./view/page/indexformandos.js";
import ConfirmsAcounts from "./view/login/confirmacounts.js";
import RecuperarConta from "./view/register/RecuperarConta.js";
import RedefinirSenha from "./view/register/RedefinirSenha.js";
import Selectsformandos from "./view/page/Seleccao/selectformandos.js";
import TurmaDashboard from "./view/page/Turma/turmadashboard.js";
import ConfirmarMatricula from "./view/page/Matricula/confirmar_matricula.js";
import ProtectedRoute from "./api/routes/protected_routes.js";
import { FormadorForms } from "./view/sing/formador/index.js";
import AreasTabs from "./view/sing/areas_formacao/index.jsx";
import InscricaoFormador from "./view/page/Formador/formador/Inscricao/InscricaoFormador.jsx";
import FormadoresPage from "./view/page/Formador/formador/list_formador/FormadoresPage.jsx";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import Index_perfil from "./view/page/profile/Index_perfil.jsx";
import RegisterComponente from "./pages/componentes/RegisterComponente.jsx";
import HomeCursoComponente from "./pages/index.js";
import ImportarFormandos from "./view/sing/componenteformando/ImportarFormandos/index.jsx";
import { IndexFormando } from "./view/sing/indexformando.js";
import ModuloAdminApp from "./view/packages/modulo-admin/index.jsx";

// Componente de Rota Protegida (para páginas que precisam de autenticação)

// Componente para impedir login de usuários autenticados
const PublicRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/auth" /> : element;
};

// receber o token e verificar o utilizador para deifinir o nivel de acesso
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("User role:", user?.nivel); // Log do papel do usuário para depuração
  if (!token) {
    return <Navigate to="/" />;
  }

  // Verificar o nível de acesso do utilizador
  if (user && user.nivel !== "MASTER") {
    return <Navigate to="/auth" />;
  }

  return element;
};

function App() {
  ModuleRegistry.registerModules([AllCommunityModule]);
  return (
    
    <Router>
      <Routes>
        {/* Rota pública: Se o usuário não estiver autenticado, exibe o login */}
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/ativacao" element={<PublicRoute element={<ConfirmsAcounts />} />} />
        <Route path="/register" element={<PublicRoute element={<RegisterUser />} />} />
        <Route path="/recuperar-conta" element={<RecuperarConta />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        
        
        {/* Rota protegida: Só acessa se tiver token */}
        <Route path="/auth" element={<ProtectedRoute><DashboardLayout /> </ProtectedRoute>}>
          {/* Rotas dentro do DashboardLayout */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="register-user" element={<PrivateRoute element={<RegisterUser />} />} />
          <Route path="register-programas" element={<RegisterProgramas />} />
          <Route path="register-cursos" element={<RegisterCursos />} />
          <Route path="register-formandos" element={<IndexFormando />} />
          <Route path="list-formandos" element={<ListFormandos />} />
          <Route path="table-formandos" element={<TableFormandos />} />
          <Route path="selecionar-candidatura" element={<Selectsformandos />} />
          <Route path="selecionado-turma" element={<TurmaDashboard />} />
          <Route path="selecionar-matricula" element={<ConfirmarMatricula />} />
         
          <Route path="registar-area" element={<AreasTabs />} />
          <Route path="registar-formador" element={<InscricaoFormador />} />
          <Route path="list-formador" element={<FormadoresPage />} />
          <Route path="componente-cursos" element={<HomeCursoComponente />} />
          <Route path="register-mult-formandos" element={<ImportarFormandos />} />
          <Route path="candidatura-formando" element={<ModuloAdminApp />} />
         
        </Route>

        {/* Página de erro para rotas inválidas */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
