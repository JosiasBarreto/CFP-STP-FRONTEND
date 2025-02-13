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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do form, caso o evento seja de um form
  
    setLoad(true); // Define a variável de loading como true
  
    try {
      // Envia a requisição para o backend
      const response = await axios.post(`${API_URL}${login_routes}`, {
        email: email,
        senha: password, // Certifique-se de que o backend espera "senha"
      });
  
      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200) {
        const { token, user } = response.data; // Desestruturação da resposta para obter token e user
  
        // Armazenamento seguro no localStorage (considerando que o "user" não é sensível)
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // Armazena o usuário como string JSON
  
        // Notificação de sucesso
        toast.success("Login bem-sucedido!");
  
        // Redirecionamento para a dashboard
        navigate("/auth");
      }
    } catch (error) {
      // Se a resposta foi um erro da API, trata a mensagem
      if (error.response) {
        // Caso o backend tenha retornado um erro, exibe a mensagem
        toast.error(error.response.data.message || "Erro ao fazer login");
      } else {
        // Se não houve resposta do servidor (erro de rede ou algo do tipo)
        toast.error("Erro na conexão com o servidor");
      }
    } finally {
      // Finaliza o loading, independente de sucesso ou falha
      setLoad(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="bg-white shadow rounded" style={{ width: "35rem" }}>
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
              <Link to="/emailrecuperar">
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
