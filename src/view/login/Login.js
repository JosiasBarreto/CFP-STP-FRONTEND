import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { Form, Col, Row, Stack, FloatingLabel } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import { API_URL } from "../../api/urls";
import { login_routes } from "../../api/routes";
import { saveTokens } from "../../api/Conf/reflesk_Fuction/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
  
    try {
      const response = await axios.post(`${API_URL}${login_routes}`, {
        email,
        senha: password,
      });
  
      if (response.status === 200) {
        const { token, user, refresh_token} = response.data;
        // Salva o token e o refresh_token no localStorage
        
        saveTokens(token, refresh_token);

        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login bem-sucedido!");
        navigate("/auth");
      }
    } catch (error) {
      if (error.response) {
        const { message, redirect } = error.response.data;
  
        if (redirect) {
          toast.warn(message);
          navigate(redirect, { state: { email, senha: password } }); // Redireciona para ativação se necessário

        } else {
          toast.error(message || "Erro ao fazer login");
        }
      } else {
        toast.error("Erro na conexão com o servidor");
      }
    } finally {
      setLoad(false);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="glass-effect shadow rounded" style={{ width: "35rem" }}>
        {/* Formulário */}
        <Col className="p-4" sm={12}>
          <div className="text-center mb-2">
            <FaUserCircle
              size={100}
              className="logo-top mx-auto text-light bg-success rounded-circle"
            />
          </div>
          <p className="text-center fs-4 fw-bold mb-4 text-success">
            INICIAR SESSÃO
          </p>
          <ToastContainer />
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="formBasicEmail" className="mb-5" label="Email">
              <Form.Control
                className="input_left_color"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicPassword" className="mb-4" label="Senha">
              <Form.Control
                className="input_left_color"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FloatingLabel>
            <Stack gap={2} className="col-md-8 mx-auto mb-4" style={{ marginTop: "3rem" }}>
              <ButtonS
                className="fw-bolder"
                texto="ENTRAR"
                loadIf={load}
                type="submit"
                variant="success"
              />
            </Stack>
            <Col className="d-flex align-items-end justify-content-end">
              <Link to="/recuperar-conta" className="text-decoration-none text-primary">
                <p>Esqueceu a sua senha?</p>
              </Link>
            </Col>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
