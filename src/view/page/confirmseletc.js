import { useState } from "react";
import { Button, Modal, ToastContainer, Row, Col, Spinner, Badge, Container } from "react-bootstrap";
import { Selecaomassa } from "../sing/function";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUserSlash } from "react-icons/fa";

function Finalizar({ situacoes, selecionados, nselecionados, suplentes, desistidos, total }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFinalizar = async () => {
    setLoading(true);
    try {
      const response = await Selecaomassa(situacoes);
      toast.success("Atualizado com sucesso");
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
          <Modal.Title className="w-100 ">
            🔒 Confirmar Seleção Final
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          

          <Container>
          <Row className="mb-3 text-center">
              <Col
                md={6}
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#198754" }} // Verde (Bootstrap success)
              >
                <FaCheckCircle size={26} className="mb-2" />
                <div>Selecionados</div>
                <Badge bg="light" text="dark">{selecionados}</Badge>
              </Col>

              <Col
                md={6}
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#ffc107" }} // Amarelo (Bootstrap warning)
              >
                <FaClock size={26} className="mb-2" />
                <div>Suplentes</div>
                <Badge bg="light" text="dark">{suplentes}</Badge>
              </Col>
            </Row>

            <Row className="mb-3 text-center">
              <Col
                md={6}
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#dc3545" }} // Vermelho (Bootstrap danger)
              >
                <FaTimesCircle size={26} className="mb-2" />
                <div>Não Selecionados</div>
                <Badge bg="light" text="dark">{nselecionados}</Badge>
              </Col>

              <Col
                md={6}
                className="rounded p-3 text-white"
                style={{ backgroundColor: "#6c757d" }} // Cinza (Bootstrap secondary)
              >
                <FaUserSlash size={26} className="mb-2" />
                <div>Desistentes</div>
                <Badge bg="light" text="dark">{desistidos}</Badge>
              </Col>
            </Row>
            <p className="text-center mb-4">
            Tem certeza que deseja <strong>finalizar a seleção</strong> dos formandos?
            <br /> Esta ação atualizará o <strong>status</strong> conforme abaixo.
          </p>

            <hr />
            <div className="text-center">
              Total de Formandos: <Badge bg="dark">{total}</Badge>
            </div>
          </Container>
        </Modal.Body>

        <Modal.Footer className="justify-content-center">
          <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
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
