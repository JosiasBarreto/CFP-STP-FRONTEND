import React, { useState, useMemo } from "react";
import {
  Button,
  Spinner,
  Alert,
  Form,
  Table,
  Card,
  Badge,
  ButtonGroup,
  Container,
} from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import {
  FaFileWord,
  FaTrash,
  FaDownload,
  FaPlus,
  FaFilePdf,
} from "react-icons/fa";
import axios from "axios";

import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { gerarseguros } from "./crachar_function";
import { API_URL } from "../../../api/urls";
import Swal from "sweetalert2";
import { showError, showLoading, showSuccess } from "./feedbackscreen";

const GerarSeguro = ({ datas }) => {
  const token = localStorage.getItem("token");

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isGerando, setIsGerando] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "Seguros",
  };

  const {
    data: documentos,
    isLoading,
    isFetching,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["QdocumentosGerarSeguro", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  /* -----------------------------
     Ordenar documentos
  ----------------------------- */

  const documentosOrdenados = useMemo(() => {
    if (!documentos) return [];

    return Object.values(documentos)
      .flat()
      .sort((a, b) => a.nome_arquivo.localeCompare(b.nome_arquivo));
  }, [documentos]);

  /* -----------------------------
     Helpers
  ----------------------------- */

  

  /* -----------------------------
     Seleção
  ----------------------------- */

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocs.length === documentosOrdenados.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documentosOrdenados.map((doc) => doc.id));
    }
  };

  /* -----------------------------
     Gerar seguros
  ----------------------------- */

  const handleGerarSeguros = async () => {
    if (!datas?.id_curso) {
      return Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Curso não selecionado.",
      });
    }

    setIsGerando(true);

    showLoading("Aguarde enquanto os seguros estão sendo gerados.");

    try {
      const response = await gerarseguros(datas);

      Swal.close();

      showSuccess(response.data.mensagem);

      refetch();
    } catch {
      Swal.close();
      showError("Erro ao gerar seguros.");
    } finally {
      setIsGerando(false);
    }
  };

  /* -----------------------------
     Download
  ----------------------------- */

  const handleDownloadSelecionados = async (type) => {
    if (selectedDocs.length === 0) {
      toast.warning("Selecione pelo menos um documento.");
      return;
    }

    showLoading(
      "Processando o download dos documentos selecionados. Isto pode levar alguns segundos."
    );

    try {
      const response = await axios.post(
        `${API_URL}/documents/baixar-contratos-seguros-unificado`,
        {
          curso_id: datas?.id_curso,
          documento_ids: selectedDocs,
          grupo: "SEGUROS",
          download_type: type,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.download = `SEGUROS_UNIFICADOS.${type}`;

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

  /* -----------------------------
     Deletar documentos
  ----------------------------- */

  const handleDelete = async (ids = null) => {
    const idsToDelete = ids || selectedDocs;

    if (idsToDelete.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Selecione pelo menos um documento.",
      });
    }

    const confirm = await Swal.fire({
      title: "Tens certeza?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    showLoading("Eliminando documentos...");

    try {
      await axios.post(API_URL + "/documents/deletar-documentos", {
        ids: idsToDelete,
      });

      Swal.close();

      showSuccess("Documentos eliminados com sucesso.");

      if (!ids) setSelectedDocs([]);

      refetch();
    } catch {
      Swal.close();
      showError("Erro ao eliminar documentos.");
    }
  };

  return (
    <Card className="border-0 shadow-lg rounded-4">
      <ToastContainer />
  
      <Card.Body className="p-4">
  
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h5 className="fw-bold mb-1">Seguros</h5>
            <small className="text-muted">
              Gere e descarregue os documentos de seguro
            </small>
          </div>
  
          <div className="d-flex gap-2 flex-wrap">
            <Button
              className="rounded-pill px-4 fw-semibold"
              style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", border: "none" }}
              onClick={handleGerarSeguros}
              disabled={isGerando}
            >
              {isGerando ? <Spinner size="sm" /> : <FaPlus />} Gerar
            </Button>
  
            <Button
              variant="light"
              className="rounded-pill px-3 border"
              disabled={selectedDocs.length === 0}
              onClick={() => handleDelete()}
            >
              <FaTrash /> Eliminar
            </Button>
  
            <ButtonGroup>
              <Button
                variant="outline-primary"
                className="rounded-start-pill"
                disabled={selectedDocs.length === 0}
                onClick={() => handleDownloadSelecionados("docx")}
              >
                <FaFileWord />
              </Button>
  
              <Button
                variant="outline-danger"
                className="rounded-end-pill"
                disabled={selectedDocs.length === 0}
                onClick={() => handleDownloadSelecionados("pdf")}
              >
                <FaFilePdf />
              </Button>
            </ButtonGroup>
          </div>
        </div>
  
        {/* STATUS */}
        {selectedDocs.length > 0 && (
          <div className="mb-3">
            <Badge bg="dark" className="rounded-pill px-3 py-2">
              {selectedDocs.length} selecionado(s)
            </Badge>
          </div>
        )}
  
        {/* LOADING */}
        {isLoading && (
          <div className="text-center py-5">
            <Spinner />
          </div>
        )}
  
        {(isRefetching || (isFetching && !isLoading)) && (
          <div className="text-center text-muted small mb-2">
            Atualizando...
          </div>
        )}
  
        {isError && (
          <Alert variant="danger" className="rounded-3">
            Erro ao carregar documentos
          </Alert>
        )}
  
        {/* TABELA MODERNA */}
        {documentosOrdenados.length > 0 && (
          <div className="table-responsive">
            <Table className="align-middle table-borderless">
              <thead>
                <tr className="text-muted small">
                  <th style={{ width: 40 }}>
                    <Form.Check
                      type="checkbox"
                      checked={
                        documentosOrdenados.length > 0 &&
                        selectedDocs.length === documentosOrdenados.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Documento</th>
                  <th>Data</th>
                  <th className="text-end">Ações</th>
                </tr>
              </thead>
  
              <tbody>
                {documentosOrdenados.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={`rounded-3 ${
                      selectedDocs.includes(doc.id)
                        ? "bg-light shadow-sm"
                        : ""
                    }`}
                    style={{ transition: "0.2s" }}
                  >
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleSelect(doc.id)}
                      />
                    </td>
  
                    <td>
                      <span className="fw-semibold text-muted">
                        {index + 1}
                      </span>
                    </td>
  
                    <td className="fw-semibold">
                      <FaFileWord color="#2563eb" className="me-2" />
                      {doc.nome_arquivo}
                    </td>
  
                    <td className="text-muted">
                      {doc.data_envio
                        ? new Date(doc.data_envio).toLocaleDateString()
                        : "-"}
                    </td>
  
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          size="sm"
                          className="rounded-circle"
                          variant="light"
                          onClick={() => window.open(doc.url_arquivo)}
                        >
                          <FaDownload />
                        </Button>
  
                        <Button
                          size="sm"
                          className="rounded-circle"
                          variant="light"
                          onClick={() => handleDelete([doc.id])}
                        >
                          <FaTrash className="text-danger" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
  
        {/* EMPTY STATE */}
        {!isLoading && documentosOrdenados.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: 40 }}>📄</div>
            <h6 className="fw-semibold">Nenhum documento</h6>
            <p className="text-muted">
              Clique em <strong>Gerar</strong> para criar seguros
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default GerarSeguro;
