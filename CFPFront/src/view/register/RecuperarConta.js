import React, { useState } from "react";
import axios from "axios";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import { Form, Col, Row, Stack, FloatingLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ButtonS } from "../../component/Buttons.js/CustomButton";
import { API_URL } from "../../api/urls";
import { FaUserLock } from "react-icons/fa";

const RecuperarConta = () => {
  const [email, setEmail] = useState("");
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const handleRecuperacao = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      await axios.post(`${API_URL}/recuperar-conta`, { email });
      toast.success("Código enviado para seu e-mail!");
      navigate("/redefinir-senha", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao enviar código");
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
            Recuperação de Conta
          </p>
          <ToastContainer />
          <Form onSubmit={handleRecuperacao}>
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
            <Stack gap={2} className="col-md-8 mx-auto mb-4" style={{ marginTop: "3rem" }}>
              <ButtonS className="fw-bolder" texto="ENVIAR CÓDIGO" loadIf={load} type="submit" variant="success" />
            </Stack>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default RecuperarConta;
