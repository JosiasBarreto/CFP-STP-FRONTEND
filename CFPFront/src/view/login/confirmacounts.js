import React, { useState} from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./index.css";
import { Form, Col, Row, Stack, FloatingLabel } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import { API_URL } from "../../api/urls";

import { FaUserLock } from "react-icons/fa";

const ConfirmsAcounts = () => {
  const location = useLocation(); // Pega os dados enviados na navegação
  const [email, setEmail] = useState(location.state?.email || ""); // Preenche automaticamente
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [codigo, setCodigo] = useState(location.state?.senha || ""); // Preenche automaticamente
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password1) {
      toast.error("Senha e Confirmar senha são diferentes.");
      return;
    }

    setLoad(true);
    try {
      const response = await axios.post(`${API_URL}/ativacao-conta`, {
        email,
        codigo,
        nova_senha: password,
      });

      if (response.status === 200) {
        toast.success("Conta ativada com sucesso! Faça login.");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro na ativação");
    } finally {
      setLoad(false);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="glass-effect shadow rounded" style={{ width: "35rem" }}>
        <Col className="p-4" sm={12}>
          <div className="text-center mb-2">
            <FaUserLock
              size={100}
              className="logo-top mx-auto text-light bg-success rounded-circle"
            />
          </div>
          <p className="text-center fs-4 fw-bold mb-4 text-success">
            Atualizar as Credenciais
          </p>
          <ToastContainer />
          <Form onSubmit={handleSubmit}>
            <FloatingLabel controlId="formBasicEmail" className="mb-4" label="Email">
              <Form.Control
                className="input_left_color"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicCodigo" className="mb-4" label="Código de Verificação">
              <Form.Control
                className="input_left_color"
                type="text"
                placeholder="Código de Verificação"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicPassword" className="mb-4" label="Criar Senha">
              <Form.Control
                className="input_left_color"
                type="password"
                placeholder="Criar Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicConfirmPassword" className="mb-4" label="Confirmar Senha">
              <Form.Control
                className="input_left_color"
                type="password"
                placeholder="Confirmar Senha"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              />
            </FloatingLabel>
            <Stack gap={2} className="col-md-8 mx-auto mb-4" style={{ marginTop: "3rem" }}>
              <ButtonS className="fw-bolder" texto="CONFIRMAR" loadIf={load} type="submit" variant="success" />
            </Stack>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmsAcounts;
