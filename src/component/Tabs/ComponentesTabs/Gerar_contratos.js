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
import { gerarcontrato } from "./crachar_function";
import { API_URL } from "../../../api/urls";
import Swal from "sweetalert2";
const Gerarcontrato = ({ datas }) => {
  const token = localStorage.getItem("token");

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isGerando, setIsGerando] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "CONTRATOS",
  };

  const {
    data: documentos,
    isLoading,
    isError,
    isFetching,
    isRefetching,

    refetch,
  } = useQuery({
    queryKey: ["QdocumentosGerarcontrato", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  /* -----------------------------
     Ordenar documentos alfabeticamente
  ----------------------------- */

  const documentosOrdenados = useMemo(() => {
    if (!documentos) return [];

    let lista = [];

    Object.entries(documentos).forEach(([turmaId, docs]) => {
      lista = [...lista, ...docs];
    });

    return lista.sort((a, b) => a.nome_arquivo.localeCompare(b.nome_arquivo));
  }, [documentos]);

  /* -----------------------------
     Seleção
  ----------------------------- */

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  /* -----------------------------
     Gerar contratos
  ----------------------------- */

  const handleGerarContratos = async () => {
    setIsGerando(true);

    // Mostra loading antes da requisição
    Swal.fire({
      icon: "info",
      title: "Processando...",
      text: "Aguarde enquanto os contratos estão sendo gerados.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await gerarcontrato(datas);

      // Fecha o loading
      Swal.close();

      // Mostra sucesso
      Swal.fire({
        icon: "success",
        title: "Contratos gerados com sucesso!",
        text: response.data.mensagem,
      });

      refetch();
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao gerar contratos.",
      });
    } finally {
      setIsGerando(false);
    }
  };

  /* -----------------------------
     Download selecionados
  ----------------------------- */

  const handleDownloadSelecionados = async (type) => {
    if (selectedDocs.length === 0) {
      Swal.fire("Selecione pelo menos um documento.");
      return;
    }
    // Mostra loading antes da requisição
    Swal.fire({
      icon: "info",
      title: "Processando...",
      text: "Processando o download dos documentos selecionados.\nIsso pode levar alguns segundos dependendo da quantidade de documentos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      const response = await axios.post(
        `${API_URL}/documents/baixar-contratos-seguros-unificado`,
        {
          curso_id: datas?.id_curso,
          documento_ids: selectedDocs,
          grupo: "CONTRATOS",
          download_type: type,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = `CONTRATOS_UNIFICADOS.${type}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: `${type.toUpperCase()} gerado com sucesso!`,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: `Erro ao gerar ${type.toUpperCase()}.`,
      });
    }
  };

  /* -----------------------------
     Deletar
  ----------------------------- */

  const handleDelete = async (ids = null) => {
    const idsToDelete = ids || selectedDocs;

    if (idsToDelete.length === 0) {
      Swal.fire("Atenção!", "Selecione pelo menos um documento.", "warning");
      return;
    }
    // verificar se o usuário tem certeza
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: `Você está prestes a eliminar ${idsToDelete.length} documento(s). Esta ação não pode ser desfeita!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isDismissed) return;

    if (result.isDenied) return;
    //se sim, mostrar a Swal.fire de "Eliminando..." com loading
    Swal.fire({
      title: "Eliminando...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await axios.post(API_URL + "/documents/deletar-documentos", {
        ids: idsToDelete,
      });

      Swal.fire("Sucesso!", "Documentos eliminados com sucesso.", "success");

      if (!ids) setSelectedDocs([]);

      refetch();
    } catch {
      Swal.fire("Erro!", "Erro ao eliminar documentos.", "error");
    }
  };
  const toggleSelectAll = () => {
    if (selectedDocs.length === documentosOrdenados.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(documentosOrdenados.map((doc) => doc.id));
    }
  };
  return (
    <Card className="shadow-sm border-0">
      <ToastContainer />

      {/* HEADER */}

      {/* TOOLBAR */}

      <Card.Body>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button
            variant="success"
            onClick={handleGerarContratos}
            disabled={isGerando}
          >
            {isGerando ? <Spinner animation="border" size="sm" /> : <FaPlus />}{" "}
            Gerar Contratos
          </Button>

          <Button
            variant="danger"
            disabled={selectedDocs.length === 0}
            onClick={() => handleDelete()}
          >
            <FaTrash /> Excluir
          </Button>

          <ButtonGroup>
            <Button
              variant="outline-primary"
              disabled={selectedDocs.length === 0}
              onClick={() => handleDownloadSelecionados("docx")}
            >
              <FaFileWord /> Word
            </Button>

            <Button
              variant="outline-danger"
              disabled={selectedDocs.length === 0}
              onClick={() => handleDownloadSelecionados("pdf")}
            >
              <FaFilePdf /> PDF
            </Button>
          </ButtonGroup>
          {/**Totais dos Documentos */}
          <div className="ms-auto text-muted">
            {documentosOrdenados.length} documento(s)
          </div>

          {selectedDocs.length > 0 && (
            <div className="ms-auto text-muted">
              {selectedDocs.length} selecionado(s)
            </div>
          )}
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        )}

        {isError && <Alert variant="danger">Erro ao carregar documentos</Alert>}
        {isFetching && !isLoading && (
          <div className="text-center p-2">
            <Spinner animation="border" size="sm" /> Atualizando...
          </div>
        )}
        {isRefetching && !isLoading && (
          <div className="text-center p-2">
            <Spinner animation="border" size="sm" /> Atualizando...
          </div>
        )}

        {/* TABELA */}

        {documentosOrdenados.length > 0 && (
          <Table hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
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
                <th style={{ width: 70 }}>Ordem</th>
                <th>Documento</th>
                <th style={{ width: 140 }}>Data</th>
                <th style={{ width: 160 }}>Ações</th>
              </tr>
            </thead>

            <tbody>
              {documentosOrdenados.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={
                    selectedDocs.includes(doc.id) ? "table-success" : ""
                  }
                >
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedDocs.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                    />
                  </td>

                  <td>
                    <Badge bg="light" text="dark">
                      {index + 1}
                    </Badge>
                  </td>

                  <td className="fw-semibold">
                    <FaFileWord color="#2b579a" className="me-2" />

                    {doc.nome_arquivo}
                  </td>

                  <td className="text-muted">
                    {doc.data_envio
                      ? new Date(doc.data_envio).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => window.open(doc.url_arquivo)}
                      >
                        <FaDownload />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete([doc.id])}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {!isLoading && documentosOrdenados.length === 0 && (
          <div className="text-center text-muted p-5">
            <h6>Nenhum documento encontrado</h6>

            <p className="mb-0">
              Clique em <strong>Gerar Contratos</strong> para criar.
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Gerarcontrato;
