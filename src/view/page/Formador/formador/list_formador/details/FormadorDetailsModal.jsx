import { useState } from "react";
import {
  Modal,
  Tabs,
  Tab,
  Badge,
  Button,
  Row,
  Col,
  Image,
  Card,
  Alert,
  CardHeader,
} from "react-bootstrap";


export default function FormadorDetailsModal({ show, onHide, formador }) {
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  if (!formador) return null;



  const InfoCard = ({ label, value }) => (
    <Col xs={12} md={4} lg={3}>
      <Card className="h-100 shadow-sm border-1">
        <Card.Body className="p-2">
          <div className="text-muted small">{label}</div>
          <div className="fw-semibold">{value || "-"}</div>
        </Card.Body>
      </Card>
    </Col>
  );

  const SectionTitle = ({ children }) => (
    <h6 className="mt-4 mb-3 fw-bold text-success">{children}</h6>
  );
  const dominiosAgrupados = formador.dominios?.reduce((acc, dominio) => {
    if (!acc[dominio.area_nome]) {
      acc[dominio.area_nome] = [];
    }
    acc[dominio.area_nome].push(dominio);
    return acc;
  }, {});
  

  return (
    <Modal show={show} onHide={onHide} size="xl" scrollable >
    
      <Modal.Header closeButton className="bg-success text-white">
        <div>
          <h5 className="mb-0">Ficha do Registo do Formador</h5>
        </div>
      </Modal.Header>

      
      <Modal.Body>
        <Row className="align-items-center g-2 mb-3">
          <Col md={5} className="d-flex gap-3 align-items-center">
            <Image
              src={formador.foto_url || "data:image/png;base64,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"
                        }
              roundedCircle
              width={90}
              height={90}
              style={{ objectFit: "cover" }}
            />
           
            
            <div>
              <h5 className="mb-1 fw-bold">{formador.nome}</h5>
              <div className="d-flex flex-wrap gap-1">
                <Badge bg="success" className="bg-opacity-10 text-success">Inscrição {formador.id}</Badge>
                <Badge bg="secondary" className="bg-opacity-10 text-success">Processo {formador.codigo}</Badge>
                <Badge bg={formador.formacao_pedagogica ? "success" : "warning"}className="bg-opacity-10 text-success">
                  Formação Pedagógica
                </Badge>
                <Badge
                  bg={
                    formador.status_documentos.completo
                      ? "success"
                      : "danger"
                  }
                  className="bg-opacity-10 text-success"
                >
                  Documentos
                </Badge>
              </div>
            </div>
          </Col>

          <Col md={3}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <small className="text-muted">Data de Inscrição</small>
                <div className="fw-bold">{formador.data_criacao}</div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <small className="text-muted">Observação</small>
                <div>{formador.observacao || "-"}</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* TABS */}
        <Tabs defaultActiveKey="dados" className="mb-3">
          {/* DADOS */}
          <Tab eventKey="dados" title="Dados Pessoais" >
           
            <Row className="g-2">
              <InfoCard label="Número de Bilhete de Identidade" value={formador.numero_bi} />
              <InfoCard label="Número de Identificação Fiscal" value={formador.numero_nif} />
              <InfoCard label="Género" value={formador.genero} />
              <InfoCard label="Estado Civil" value={formador.estado_civil} />
              <InfoCard label="Data de Nascimento" value={formador.data_nascimento} />
              <InfoCard label="Email" value={formador.email} />
              <InfoCard label="Contacto" value={formador.contacto_telefonico} />
              <InfoCard label="Outros" value={formador.outros_contactos} />
              <InfoCard label="Distrito" value={formador.distrito} />
              <InfoCard label="Morada" value={formador.morada} />
              <InfoCard label="Banco" value={formador.banco} />
              <InfoCard label="IBAM" value={formador.numero_iban} />
              <InfoCard label="NIB" value={formador.numero_nib} />
            </Row>

            <SectionTitle>Formações</SectionTitle>
            <Row className="g-2">
              {formador.formacoes?.map((f) => (
                <Col md={4} key={f.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Header className="bg-success bg-opacity-10 text-success fw-bold border-0">
                    {f.tipo_formacao.nome}
                    </Card.Header>
                    <Card.Body>
                                  <div className="fw-semibold">{f.descricao}</div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <SectionTitle>Experiência Profissional</SectionTitle>
            <Row className="g-2">
            {formador.experiencias?.map((e) => (
              <Col md={6} key={e.id}>
              <Card key={e.id} className="h-100 mb-2 shadow-sm border-0">
                <CardHeader className="d-flex justify-content-between bg-success bg-opacity-10 text-success fw-bold border-0">
                <strong>{e.cargo} — {e.instituicao}</strong> 
                <Badge bg="success">{e.anos_experiencia} anos</Badge>
                </CardHeader>
                <Card.Body>
                  
                  {e.descricao && <text className="mt-0">{e.descricao}</text>}
                </Card.Body>
              </Card>
              </Col>
            ))}
            </Row>
          </Tab>

          {/* DOMÍNIOS */}
          <Tab eventKey="dominios" title="Domínios">
            <Row>
  {dominiosAgrupados &&
    Object.entries(dominiosAgrupados).map(([areaNome, dominios]) => (
      <Col md={6} key={areaNome}>
      <Card key={areaNome} className="mb-3 border-1 shadow-sm">
        <Card.Header className="bg-success bg-opacity-10 text-success fw-bold border-0">
        {areaNome}
        </Card.Header>
        <Card.Body>
         {/* Lista de domínios */}
          <ul className="list-unstyled mb-0">
            {dominios.map((d) => (
              <li key={d.id} className="ps-2 py-1">
                • {d.nome}
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
      </Col>
    ))}
    </Row>
</Tab>


          {/* DOCUMENTOS */}
          <Tab eventKey="documentos" title="Documentos">
  {/* STATUS */}
  {formador.status_documentos.completo ? (
    <Alert variant="success">Documentação completa</Alert>
  ) : (
    <Alert variant="danger">
      <strong>Documentos em falta:</strong>
      <ul className="mb-0">
        {formador.status_documentos.faltantes.map((d) => (
          <li key={d.id}>{d.nome}</li>
        ))}
      </ul>
    </Alert>
  )}

  {/* DOCUMENTOS */}
  <Row className="mt-3">
    {formador.documentos?.map((doc) => (
      <Col md={3} key={doc.id}>
        <Card className="mb-3 text-center shadow-sm">
          <Card.Body>
            {/* ÍCONE */}
            <div style={{ fontSize: "42px" }}>📄</div>

            <Card.Title
              className="mt-2"
              style={{ fontSize: "14px", minHeight: "40px" }}
            >
              {doc.tipo_documento}
            </Card.Title>

            <Button
            variant="outline-success"
            onClick={() => window.open(doc.arquivo_url, "_blank")}
          >
            Ver Documento
          </Button>

          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>

</Tab>

        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
