import React, { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

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
} from "react-bootstrap";

import {
  FaEdit,
  FaUserGraduate,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBriefcase,
  FaGraduationCap,
  FaClosedCaptioning,
} from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../../../../../api/urls";

export default function FormadorDetailsModal({
  show,
  onHide,
  formador,
}) {
  const dominiosAgrupados = useMemo(() => {
    if (!formador?.dominios) return {};
  
    return formador.dominios.reduce((acc, dominio) => {
      if (!acc[dominio.area_nome]) {
        acc[dominio.area_nome] = [];
      }
      acc[dominio.area_nome].push(dominio);
      return acc;
    }, {});
  }, [formador?.dominios]);
  const navigate = useNavigate();

  const [documentoSelecionado, setDocumentoSelecionado] =
    useState(null);

  if (!formador) return null;

  /* =========================================================
      EDITAR
  ========================================================= */

  const handleEdit = () => {
    navigate("/auth/registar-formador", {
      state: { formador },
    });
  };

  const handleDownloadSelecionados = async () => {
    Swal.fire({
      icon: "info",
      title: "Processando...",
      text:
        "Gerando o PDF unificado dos documentos...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await axios.get(
        `${API_URL}/api/documentos/formador/${formador.id}/unificado`,
        {
          responseType: "blob",
        }
      );
  
      // Verifica se veio vazio
      if (
        !response.data ||
        response.data.size === 0
      ) {
        throw new Error("PDF vazio");
      }
  
      // Criar blob PDF
      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );
  
      // Criar URL temporária
      const url =
        window.URL.createObjectURL(blob);
  
      // Criar link invisível
      const link =
        document.createElement("a");
  
      link.href = url;
  
      // Nome do ficheiro
      link.download = `Dossier_Formador_${formador.id}.pdf`;
  
      // Necessário para Firefox
      document.body.appendChild(link);
  
      // Download
      link.click();
  
      // Limpeza
      document.body.removeChild(link);
  
      // Libertar memória
      window.URL.revokeObjectURL(url);
  
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text:
          "Documento descarregado com sucesso.",
      });
    } catch (error) {
      console.error(error);
  
      // Tentar ler erro vindo do backend
      if (error.response) {
        console.log(error.response);
      }
  
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text:
          "Não foi possível gerar o PDF.",
      });
    }
  };
    


  /* =========================================================
      DOMÍNIOS AGRUPADOS
  ========================================================= */

  

  /* =========================================================
      COMPONENTES
  ========================================================= */

  const InfoCard = ({
    icon,
    label,
    value,
  }) => (
    <Col xl={3} lg={4} md={6}>
      <Card className="border-0 shadow-sm rounded-4 h-100 info-card">
        <Card.Body className="p-3">
          <div className="d-flex align-items-start gap-1">
            <div className="icon-box">
              {icon}
            </div>

            <div>
              <div className=" text-muted mb-1">
                {label}
              </div>

              <div className="fw-semibold text-dark">
                {value || "-"}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  const SectionTitle = ({
    title,
    icon,
  }) => (
    <div className="d-flex align-items-center gap-2">
      <div className="text-success">
        {icon}
      </div>

      <h5 className="fw-bold text-success mb-0">
        {title}
      </h5>
    </div>
  );

  return (
    <>
      <style>
        {`
          .details-modal .modal-content{
            border:none;
            border-radius:24px;
            overflow:hidden;
          }

          .hero-card{
            background: linear-gradient(
              135deg,
              #198754 0%,
              #157347 100%
            );
            border:none;
            border-radius:24px;
            color:white;
          }

          .hero-avatar{
            width:110px;
            height:110px;
            border:4px solid rgba(255,255,255,.25);
            object-fit:cover;
          }

          .info-card{
            transition: all .2s ease;
          }

          .info-card:hover{
            transform:translateY(-3px);
          }

          .icon-box{
            width:15px;
            height:15px;
            border-radius:7px;
            background:#19875415;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#198754;
            flex-shrink:0;
          }

          .custom-tab .nav-link{
            border:none !important;
            color:#6c757d;
            font-weight:600;
            border-radius:14px !important;
            padding:12px 18px;
          }

          .custom-tab .nav-link.active{
            background:#198754 !important;
            color:white !important;
          }

          .document-card{
            transition: all .2s ease;
          }

          .document-card:hover{
            transform:translateY(-4px);
          }

          .glass-badge{
            background:rgba(255,255,255,.18) !important;
            border:1px solid rgba(255,255,255,.15);
            color:white !important;
          }
          .info-card .fw-semibold {
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .details-modal .modal-body {
            overflow-x: hidden;
          }
        `}
      </style>

      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        scrollable
        dialogClassName="details-modal"
      >
        {/* =========================================================
            HEADER
        ========================================================= */}
        

        <Modal.Body className="p-0 bg-light">

          {/* HERO */}

          <Card className="hero-card shadow-lg mb-1">
            <Card.Body className="p-3">
              <Row className="align-items-center g-4">
                <Col lg={8}>
                  <div className="d-flex align-items-center gap-4 flex-wrap">
                    <Image
                      src={
                        formador.foto_url ||
                        "https://via.placeholder.com/150"
                      }
                      roundedCircle
                      className="hero-avatar"
                    />

                    <div>
                      <h3 className="fw-bold mb-2">
                        {formador.nome}
                      </h3>

                      <div className="d-flex flex-wrap gap-2">
                        <Badge className="glass-badge px-3 py-2 rounded-pill">
                          {"Inscrição Nº "}
                          {
                            formador.id
                          }
                        </Badge>

                        <Badge className="glass-badge px-3 py-2 rounded-pill">
                          {"Processo Nº"}
                          {formador.codigo}
                        </Badge>

                        <Badge className="glass-badge px-3 py-2 rounded-pill">
                          {
                            formador.genero
                          }
                        </Badge>

                        <Badge className="glass-badge px-3 py-2 rounded-pill">
                          {
                            formador.estado_civil
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Card className="border-0 rounded-4 shadow-sm h-100">
                        <Card.Body>
                          <small className="text-muted">
                            Data de
                            Inscrição
                          </small>

                          <div className="fw-bold mt-1">
                            {
                              formador.data_criacao
                            }
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="border-0 rounded-4 shadow-sm h-100">
                        <Card.Body>
                          <small className="text-muted">
                            Documentação
                          </small>

                          <div className="mt-2">
                            {formador
                              .status_documentos
                              ?.completo ? (
                              <Badge bg="success">
                                Completa
                              </Badge>
                            ) : (
                              <Badge bg="danger">
                                Incompleta
                              </Badge>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* =========================================================
              TABS
          ========================================================= */}
         <Row className="p-2 g-1">
          <Tabs
            defaultActiveKey="dados"
            className="mb-2 custom-tab"
          >

            {/* =========================================================
                DADOS
            ========================================================= */}

            <Tab
              eventKey="dados"
              title="Dados Pessoais"
            >
              

            <Row className="g-3 p-3">
              
            
            
             
              <InfoCard icon={<FaFileAlt />} label="BI" value={formador.numero_bi} />
              <InfoCard label="NIF" value={formador.numero_nif} />
            

            
            
              <InfoCard icon={<FaUserGraduate />} label="Género" value={formador.genero} />
              <InfoCard icon={<FaUserGraduate />} label="Estado Civil" value={formador.estado_civil} />
              <InfoCard icon={<FaUserGraduate />} label="Data de Nascimento" value={formador.data_nascimento} />
            

            
              <InfoCard label="Telefone" value={formador.contacto_telefonico} />
              <InfoCard label="Email" value={formador.email} />
              <InfoCard label="Outros Contactos" value={formador.outros_contactos} />
           

           
              <InfoCard label="Morada" value={formador.morada} />
              <InfoCard label="Distrito" value={formador.distrito} />
            

            
            
            <Row className="g-2">
              <InfoCard label="Banco" value={formador.banco} />
              <InfoCard label="IBAN" value={formador.numero_iban} />
              <InfoCard label="NIB" value={formador.numero_nib} />
            </Row>
                
              </Row>

              
            </Tab>
            <Tab
              eventKey="formacao"
              title="Formações e Experiências"
            >
              {/* FORMAÇÕES */}

              <SectionTitle
                title="Formações"
                icon={<FaGraduationCap />}
              />

              <Row className="g-2 p-3">
                {formador.formacoes?.map(
                  (f) => (
                    <Col
                      lg={4}
                      md={6}
                      key={f.id}
                    >
                      <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-success bg-opacity-10 border-0 fw-bold text-success rounded-top-4" >
                        {
                              f
                                .tipo_formacao
                                ?.nome
                            }
                        </Card.Header>
                        <Card.Body>
                          

                          <div className="fw-semibold">
                            {
                              f.descricao
                            }
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                )}
              </Row>

              {/* EXPERIÊNCIAS */}

              <SectionTitle
                title="Experiência Profissional"
                icon={<FaBriefcase />}
              />

              <Row className="g-3">
                {formador.experiencias?.map(
                  (e) => (
                    <Col
                      md={6}
                      key={e.id}
                    >
                      <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                              <h6 className="fw-bold mb-1">
                                {e.cargo}
                              </h6>

                              <small className="text-muted">
                                {
                                  e.instituicao
                                }
                              </small>
                            </div>

                            <Badge bg="success">
                              {
                                e.anos_experiencia
                              }{" "}
                              anos
                            </Badge>
                          </div>

                          <div className="text-muted">
                            {e.descricao ||
                              "-"}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            </Tab>

            {/* =========================================================
                DOMÍNIOS
            ========================================================= */}

            <Tab
              eventKey="dominios"
              title="Domínios"
            >
              <Row className="g-3 mt-1">
                {Object.entries(
                  dominiosAgrupados
                ).map(
                  ([
                    areaNome,
                    dominios,
                  ]) => (
                    <Col
                      md={6}
                      key={areaNome}
                    >
                      <Card className="border-0 shadow-sm rounded-4 h-100">
                        <Card.Header className="bg-success bg-opacity-10 border-0 fw-bold text-success rounded-top-4">
                          {areaNome}
                        </Card.Header>

                        <Card.Body>
                          <div className="d-flex flex-wrap gap-2">
                            {dominios?.map(
                              (d) => (
                                <Badge
                                  key={d.id}
                                  bg="light"
                                  text="dark"
                                  className="px-3 py-2 rounded-pill border"
                                >
                                  {
                                    d.nome
                                  }
                                </Badge>
                              )
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )
                )}
              </Row>
            </Tab>

            {/* =========================================================
                DOCUMENTOS
                criar um scroll bar no corpo de tab caso for necessario
            ========================================================= */}
            
            <Tab
              eventKey="documentos"
              title="Documentos"
              className="p-2  "
            >
              <div className="mt-2" style={{ maxHeight: "50vh", overflowY: "auto", overflowX: "hidden" }}>

                {formador
                  .status_documentos
                  ?.completo ? (
                  <Alert
                    variant="success"
                    className="rounded-4 border-0 shadow-sm"
                  >
                    <FaCheckCircle className="me-2" />
                    Toda documentação está
                    completa.
                  </Alert>
                ) : (
                  <Alert
                    variant="danger"
                    className="rounded-4 border-0 shadow-sm"
                  >
                    <FaExclamationTriangle className="me-2" />

                    Documentos em falta:

                    <ul className="mt-2 mb-0">
                      {formador
                        .status_documentos
                        ?.faltantes?.map(
                          (d) => (
                            <li
                              key={d.id}
                            >
                              {
                                d.nome
                              }
                            </li>
                          )
                        )}
                    </ul>
                  </Alert>
                )}

                <Row className="g-3 ">
                  {formador.documentos?.map(
                    (doc) => (
                      <Col
                        lg={3}
                        md={4}
                        sm={6}
                        key={doc.id}
                      >
                        <Card className="border-0 shadow-sm rounded-4 h-100 text-center document-card">
                          <Card.Body className="d-flex flex-column">
                            <div
                                style={{
                                  fontSize:
                                    "60px",
                                }}
                                >
                                    {doc ? (
                                      <>
                                        <Card className="border-0 shadow-sm overflow-hidden">

                                          {doc.mime_type?.startsWith("image") ? (
                                            <img
                                              src={doc.arquivo_url}
                                              alt={doc.nome}
                                              className="w-100"
                                              style={{
                                                height: "220px",
                                                objectFit: "cover",
                                              }}
                                            />
                                          ) : (
                                            <iframe
                                              src={doc.arquivo_url}
                                              title={doc.nome}
                                              width="100%"
                                              height="220"
                                              style={{
                                                border: "none",
                                                borderRadius: "12px",
                                              }}
                                            />
                                          )}
                                        </Card>

                                        <div className="mt-3">
                                        

                                          <div className="fw-semibold small">
                                            {doc.nome}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div
                                        className="border rounded-4 d-flex flex-column justify-content-center align-items-center text-muted"
                                        style={{
                                          height: "220px",
                                          background: "#f8f9fa",
                                        }}
                                      >
                                        <div style={{ fontSize: "50px" }}>
                                          📄
                                        </div>

                                        <small>
                                          Nenhum documento enviado
                                        </small>
                                      </div>
                                    )}
                            </div>

                            <div className="fw-semibold small mt-2 flex-grow-1">
                              {
                                doc.tipo_documento
                              }
                            </div>

                            <Button
                              variant="success"
                              className="rounded-pill mt-3"
                              onClick={() =>
                                window.open(
                                  doc.arquivo_url,
                                  "_blank"
                                )
                              }
                            >
                              Ver Documento
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              </div>
            </Tab>
          </Tabs>
          </Row>
        </Modal.Body>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <Modal.Footer className="d-flex justify-content-between border-0 bg-white">
          <Button
            variant="secondary"
            onClick={onHide}
            className="rounded-pill px-4 shadow"
          >
          
          Fechar
          </Button>
          <Button 
          variant="primary"
          onClick={() => handleDownloadSelecionados()}
          className="rounded-pill px-4 shadow"
          >
            <FaFileAlt className="me-2" />
            Imprimir Inscrição</Button>

          <Button
            variant="success"
            onClick={handleEdit}
            className="rounded-pill px-4 shadow"
          >
            <FaEdit className="me-2" />
            Editar Formador
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}