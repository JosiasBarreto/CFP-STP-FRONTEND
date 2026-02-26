import { Container, Row, Col, Pagination } from "react-bootstrap";
import FormadoresFiltro from "./FormadoresFiltro";
import FormadoresTabela from "./FormadoresTabela";
import { useFormadores } from "./data/useFormadores";
import { useState } from "react";


export default function FormadoresPage() {
  const {
    filtros,
    setFiltros,
    data,
    isLoading,
    page,
    setPage,
    pages,
    perPage,
    total,
  } = useFormadores();
  const [showModal, setShowModal] = useState(false);
const [formadorSelecionado, setFormadorSelecionado] = useState(null);


  return (
    <Container fluid className="bg-white rounded-3 shadow-sm mt-1">
      <Row className="bg-success text-white mb-3 p-2">
        <Col>
          <h4>Lista de Formadores</h4>
        </Col>
      </Row>

      <FormadoresFiltro filtros={filtros} setFiltros={setFiltros} />

      <FormadoresTabela
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        perPage={perPage}
        total={total}
        pages={pages}
      />
      

    </Container>
  );
}
