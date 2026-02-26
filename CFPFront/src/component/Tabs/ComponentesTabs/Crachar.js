import React, { useState } from "react";
import {
  Button, Col, Row, Spinner, Alert, Image, Form
} from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { FaIdBadge, FaFileWord, FaFileArchive, FaTrash, FaDownload } from "react-icons/fa";
import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { gerarCrachasAPI } from "./crachar_function";



const CracharGenerations = ({ datas }) => {
  const token = localStorage.getItem("token");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isGerando, setIsGerando] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "CRACHAS",
  };

  const {
    data: documentos,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["QdocumentosCrachar", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  const gerarCrachas = async () => {
    setIsGerando(true);
    try {
      const response = await gerarCrachasAPI(datas);

      toast.success(response.data.mensagem || "Crachás gerados com sucesso.");
      // Você pode baixar automaticamente se quiser:
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "crachas.pdf";
      a.click();
    } catch (err) {
      console.error("Erro ao gerar crachás:", err);
      const mensagem =
        err.response?.data?.erro || "Erro inesperado ao gerar crachás.";
      toast.error(mensagem);
    } finally {
      setIsGerando(false);
      refetch();
    }
  };

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const deletarCracha = (id) => {
    alert(`Deletar crachá com ID: ${id}`);
  };

  return (
    <div className="mt-4">
      <ToastContainer />
      <Row className="align-items-center border shadow-sm rounded p-3 mb-4 bg-light">
        <Col md="auto" className="d-flex flex-wrap gap-2">
          <Button variant="primary" onClick={gerarCrachas} disabled={isGerando}>
            {isGerando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Gerando Crachás...
              </>
            ) : (
              <>
                <FaIdBadge className="me-2" /> Gerar Crachás
              </>
            )}
          </Button>
          <Button variant="primary">
            <FaFileWord className="me-2" /> Baixar Word
          </Button>
          <Button variant="primary">
            <FaFileArchive className="me-2" /> Baixar ZIP
          </Button>
        </Col>
        <Col className="text-muted">
          {isLoading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              Carregando crachás...
            </div>
          )}
          {isError && (
            <Alert variant="danger" className="mb-0">
              Erro ao carregar os crachás.
            </Alert>
          )}
        </Col>
      </Row>

      {/* Lista de crachás */}
      {documentos && Object.keys(documentos).length > 0
        ? Object.entries(documentos).map(([turmaId, listaDocs]) => (
            <div key={turmaId} className="mb-5">
              <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {listaDocs.map((doc) => (
                  <Col key={doc.id}>
                    <div className="border rounded shadow-sm h-100 p-2 d-flex flex-column justify-content-between">
                      <Form.Check
                        type="checkbox"
                        label="Selecionar"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                      />
                      <Image
                        src={doc.url_arquivo}
                        alt={doc.nome_arquivo}
                        thumbnail
                        fluid
                        className="mt-2"
                        style={{ maxHeight: "180px", objectFit: "contain" }}
                      />
                      <div className="mt-2 small text-center" title={doc.nome_arquivo}>
                        {doc.nome_arquivo}
                      </div>
                      <div className="d-flex justify-content-around mt-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = doc.url_arquivo;
                            link.download = doc.url_arquivo.split("/").pop();
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          title="Baixar"
                        >
                          <FaDownload />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deletarCracha(doc.id)}
                          title="Excluir"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))
        : !isLoading &&
          !isError && (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
              <Image
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="Sem crachás"
                style={{ width: "120px", opacity: 0.7, marginBottom: "20px" }}
              />
              <h5 className="text-muted mb-2">Nenhum crachá disponível</h5>
              <p className="text-secondary" style={{ maxWidth: "400px" }}>
                Não encontramos nenhum crachá gerado para esta turma até o momento. Você pode clicar no botão{" "}
                <strong>“Gerar Crachás”</strong> acima para criá-los.
              </p>
            </div>
          )}
    </div>
  );
};

export default CracharGenerations;
