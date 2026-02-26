import { Row, Col, Form, Button, Card } from "react-bootstrap";

export default function FormadoresFiltro({ filtros, setFiltros }) {
  const handleChange = (e) => {
    setFiltros((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row>
          <Col md={4}>
            <Form.Control
              placeholder="Pesquisar por nome, código ou BI"
              name="search"
              value={filtros.search}
              onChange={handleChange}
            />
          </Col>

          <Col md={3}>
            <Form.Select
              name="formacao_pedagogica"
              value={filtros.formacao_pedagogica}
              onChange={handleChange}
            >
              <option value="">Formação pedagógica</option>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              name="documentos_ok"
              value={filtros.documentos_ok}
              onChange={handleChange}
            >
              <option value="">Documentos</option>
              <option value="true">Completos</option>
              <option value="false">Incompletos</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Button
              variant="outline-secondary"
              onClick={() =>
                setFiltros({
                  search: "",
                  formacao_pedagogica: "",
                  dominio_id: "",
                  documentos_ok: "",
                })
              }
            >
              Limpar
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
