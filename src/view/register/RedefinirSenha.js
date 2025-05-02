import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { Form, Col, Row, Stack, FloatingLabel } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import { API_URL } from "../../api/urls";
import { FaUserLock } from "react-icons/fa";

const RedefinirSenha = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirm, setSenhaConfirm] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const handleRedefinir = async (e) => {
    e.preventDefault();

    if (senha !== senhaConfirm) {
      toast.error("Senhas não coincidem.");
      return;
    }

    setLoad(true);

    try {
      await axios.post(`${API_URL}/redefinir-senha`, {
        email,
        codigo,
        nova_senha: senha,
      });
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao redefinir senha.");
    } finally {
      setLoad(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="glass-effect shadow rounded" style={{ width: "35rem" }}>
        <Col className="p-4" sm={12}>
          <div className="text-center mb-2">
            <FaUserLock size={100} className="logo-top mx-auto text-light bg-success rounded-circle" />
          </div>
          <p className="text-center fs-4 fw-bold mb-4 text-success">
            Redefinir Senha
          </p>
          <ToastContainer />
          <Form onSubmit={handleRedefinir}>
            <FloatingLabel controlId="formBasicEmail" className="mb-4" label="Email">
              <Form.Control className="input_left_color" type="email" value={email} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicCodigo" className="mb-4" label="Código de Recuperação">
              <Form.Control
                className="input_left_color"
                type="text"
                placeholder="Código de recuperação"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicPassword" className="mb-4" label="Nova Senha">
              <Form.Control
                className="input_left_color"
                type="password"
                placeholder="Nova Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </FloatingLabel>
            <FloatingLabel controlId="formBasicConfirmPassword" className="mb-4" label="Confirmar Senha">
              <Form.Control
                className="input_left_color"
                type="password"
                placeholder="Confirmar Senha"
                value={senhaConfirm}
                onChange={(e) => setSenhaConfirm(e.target.value)}
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

export default RedefinirSenha;
