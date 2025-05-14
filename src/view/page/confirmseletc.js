import { useState } from "react";
import {
  Button,
  Modal,
  ToastContainer,
  Row,
  Col,
  Spinner,
  Badge,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Selecaomassa } from "../sing/function";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserSlash,
} from "react-icons/fa";

function Finalizar({
  situacoes,
  selecionados,
  nselecionados,
  suplentes,
  desistidos,
  total,
  funcaoresert,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
  const handleFinalizar = async () => {
    setLoading(true);
    try {
      const response = await Selecaomassa(situacoes);
      
      toast.success("Seleção dos Candidatos com sucesso!!"); // Mostra a mensagem imediatamente
  
      // Aguarda 2 segundos e só depois reseta o formulário
      setTimeout(() => {
        funcaoresert();
        navigate("/auth/selecionado-turma")
      }, 2000); // 2000ms = 2 segundos
  
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };
  

  return (
    <>
      <Button
        variant="outline-success"
        className="p-2 m-2"
        onClick={() => setShowConfirm(true)}
      >
        FINALIZAR
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="w-100 fs-5">
            CONFIRMAR A SELECÇÃO DOS CANDIDATOS
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="d-flex justify-content-center align-items-center">
          <div>
            <p className="text-center mb-3">
              Tem certeza que deseja <strong>finalizar a seleção</strong> dos
              formandos?
              <br /> Esta ação atualizará o <strong>status</strong> conforme
              abaixo.
            </p>

            <Row className="mb-3 text-center gap-3">
              <Col
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#198754" }} // Verde (Bootstrap success)
              >
                <div>
                  <FaCheckCircle size={33} className="mb-2 ml-2" /> Selecionados
                </div>
                <Badge bg="light" text="success" className="fs-6">
                  {selecionados}
                </Badge>
              </Col>

              <Col
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#ffc107" }} // Amarelo (Bootstrap warning)
              >
                <div>
                  <FaClock size={33} className="mb-2 ml-2" /> Suplentes
                </div>
                <Badge bg="light" text="warning" className="fs-6">
                  {suplentes}
                </Badge>
              </Col>
            </Row>

            <Row className="mb-3 text-center gap-3">
              <Col
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#dc3545" }} // Vermelho (Bootstrap danger)
              >
                <div>
                  {" "}
                  <FaTimesCircle size={33} className="mb-2 ml-2" />
                  Não Selec.
                </div>
                <Badge bg="light" text="danger" className="fs-6">
                  {nselecionados}
                </Badge>
              </Col>

              <Col
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#6c757d" }} // Cinza (Bootstrap secondary)
              >
                <div>
                  <FaUserSlash size={33} className="mb-2 ml-2" />
                  Desistentes
                </div>
                <Badge bg="light" text="secondary" className="fs-6">
                  {desistidos}
                </Badge>
              </Col>
            </Row>
            <hr />
            <div className="text-center mt-0">
              Total dos Candidatos: <Badge bg="dark">{total}</Badge>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirm(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="success"
            onClick={handleFinalizar}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Processando...
              </>
            ) : (
              "Sim, finalizar"
            )}
          </Button>
        </Modal.Footer>

        <ToastContainer />
      </Modal>
    </>
  );
}

export default Finalizar;
