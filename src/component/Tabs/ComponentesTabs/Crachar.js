import React, { useState, useMemo } from "react";
import {
  Button,
  Spinner,
  Alert,
  Form,
  Card,
  Badge,
  ButtonGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { FaIdBadge, FaTrash, FaDownload, FaFileWord, FaFilePdf, FaCheckSquare } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { gerarCrachasAPI } from "./crachar_function";
import { API_URL } from "../../../api/urls";

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
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["QdocumentosCrachar", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  const documentosOrdenados = useMemo(() => {
    if (!documentos) return [];
    return Object.values(documentos).flat().sort((a, b) => a.nome_arquivo.localeCompare(b.nome_arquivo));
  }, [documentos]);

  const showLoading = (text) => {
    Swal.fire({ title: "Processando...", text, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
  };
  const showError = (text) => Swal.fire({ icon: "error", title: "Erro!", text });
  const showSuccess = (text) => Swal.fire({ icon: "success", title: "Sucesso!", text });

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocs.length === documentosOrdenados.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documentosOrdenados.map((doc) => doc.id));
    }
  };

  const handleGerarCrachas = async () => {
    if (!datas?.id_curso) return Swal.fire({ icon: "warning", title: "Atenção!", text: "Curso não selecionado." });

    setIsGerando(true);
    showLoading("Aguarde enquanto os crachás estão sendo gerados.");

    try {
      const response = await gerarCrachasAPI(datas);
      Swal.close();
      showSuccess(response.data.mensagem || "Crachás gerados com sucesso.");
      refetch();
    } catch {
      Swal.close();
      showError("Erro ao gerar crachás.");
    } finally {
      setIsGerando(false);
    }
  };

  const handleDownloadSelecionados = async (type) => {
   

    showLoading("Processando download dos crachás...");

    try {
      const response = await axios.post(
        `${API_URL}/documents/baixar-cracha-unificado`,
        { curso_id: datas?.id_curso, documento_ids: selectedDocs, grupo: "CRACHAS", download_type: type },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `CRACHAS_UNIFICADOS.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.close();
      showSuccess(`${type.toUpperCase()} gerado com sucesso!`);
    } catch {
      Swal.close();
      showError(`Erro ao gerar ${type.toUpperCase()}.`);
    }
  };

  const handleDelete = async (ids = null) => {
    const idsToDelete = ids || selectedDocs;
    if (idsToDelete.length === 0) return Swal.fire({ icon: "warning", title: "Atenção!", text: "Selecione pelo menos um crachá." });

    const confirm = await Swal.fire({
      title: "Tens certeza?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    showLoading("Eliminando crachás...");
    try {
      await axios.post(API_URL + "/documents/deletar-documentos", { ids: idsToDelete });
      Swal.close();
      showSuccess("Crachás eliminados com sucesso.");
      if (!ids) setSelectedDocs([]);
      refetch();
    } catch {
      Swal.close();
      showError("Erro ao eliminar crachás.");
    }
  };
  const text = selectedDocs.length === 0 ? "Selecionar" : (selectedDocs.length === documentosOrdenados.length ? "Desmarcar" : "Selecionar");
  return (
    <Card className="shadow-sm border-0">
      <ToastContainer />
      <Card.Body>
        {/* Botões principais */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button variant="success" onClick={handleGerarCrachas} disabled={isGerando}>
            {isGerando ? <><Spinner animation="border" size="sm" /> Gerando...</> : <><FaIdBadge /> Gerar Crachás</>}
          </Button>
          

          

          <ButtonGroup>
            <Button variant="outline-primary"  onClick={() => handleDownloadSelecionados("docx")}>
              <FaFileWord /> Word
            </Button>
            <Button variant="outline-danger" onClick={() => handleDownloadSelecionados("pdf")}>
              <FaFilePdf /> PDF
            </Button>
          </ButtonGroup>
         
          <ButtonGroup>
              <Button variant="outline-primary" onClick={toggleSelectAll}>
                <FaCheckSquare /> {text} Todos
              </Button>
              <Button variant="outline-danger" disabled={selectedDocs.length === 0} onClick={() => handleDelete()}>
            <FaTrash /> Excluir
          </Button>
              
          </ButtonGroup>
          

          {selectedDocs.length > 0 && <Badge bg="info" text="dark">{selectedDocs.length} selecionado(s)</Badge>}
        </div>

        {/* Loading e erros */}
        {isLoading && <div className="text-center p-4"><Spinner animation="border" /></div>}
        {isFetching && !isLoading && <div className="text-center p-2"><Spinner animation="border" size="sm" /> Atualizando...</div>}
        {isError && <Alert variant="danger">Erro ao carregar crachás</Alert>}

        {/* Cards de imagens */}
        {documentosOrdenados.length > 0 ? (
          <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={5} className="g-3">
            {documentosOrdenados.map((doc, index) => (
              <Col key={doc.id}>
                <Card className={selectedDocs.includes(doc.id) ? "border-primary shadow-sm" : "shadow-sm"}>
                  <Form.Check
                    type="checkbox"
                    label="Selecionar"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                    className="m-1"
                  />
                  <Card.Text className="text-center text-muted small fw-semibold">{doc.nome_arquivo}</Card.Text>
                  <Card.Img variant="top" src={doc.url_arquivo} style={{ height: "190px", objectFit: "contain" }} />
                  <Card.Body className="text-center">
                    
                    <div className="d-flex justify-content-around">
                      <Button size="sm" variant="outline-success" onClick={() => window.open(doc.url_arquivo)}><FaDownload /></Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete([doc.id])}><FaTrash /></Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          !isLoading && !isError && (
            <Container className="text-center text-muted p-5">
              <h6>Nenhum crachá encontrado</h6>
              <p className="mb-0">
                Clique em <strong>Gerar Crachás</strong> para criar.
              </p>
            </Container>
          )
        )}
      </Card.Body>
    </Card>
  );
};

export default CracharGenerations;