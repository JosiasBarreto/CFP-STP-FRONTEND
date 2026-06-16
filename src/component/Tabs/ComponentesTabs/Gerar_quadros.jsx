import React, { useMemo, useState } from "react";
import {
  Button,
  Table,
  Spinner,
  Alert,
  Card,
  Badge,
  Container,
  Col,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../api/urls";
import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { useQuery } from "@tanstack/react-query";
import { FaDownload, FaFileAlt, FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { showError, showLoading, showSuccess } from "./feedbackscreen";

export default function QuadrosFormandos({ datas }) {
  const [isGerando, setIsGerando] = useState(false);
  const token = localStorage.getItem("token");
  const [accaodisponivel, setAccaodisponivel] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "QUADROS DOS FORMANDOS",
  };

  const {
    data: documentos,
    isLoading,
    isFetching,
    isError,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["QdocumentosQuadrosFormandos", datar],
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
     Gerar Quadros (COM UX PROFISSIONAL)
  ----------------------------- */

  const handleGerarQuadros = async () => {
    if (!datas?.id_curso) {
      return Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Curso não selecionado.",
      });
    }

    setIsGerando(true);

    showLoading("Aguarde enquanto o quadro dos formandos está sendo gerado...");

    try {
      const response = await axios.post(
        `${API_URL}/documents/gerar-quadros-formandos`,
        datas
      );

      Swal.close();

      showSuccess(response.data?.mensagem || "Quadros gerados com sucesso!");

      refetch(); // 🔥 atualiza automaticamente
    } catch (err) {
      Swal.close();

      showError(
        err.response?.data?.erro || "Erro ao gerar quadros."
      );
    } finally {
      setIsGerando(false);
    }
  };

  const handleDelete = async (ids = null) => {
    const idsToDelete = ids || documentosOrdenados.map((doc) => doc.id);

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

      showSuccess("Quadro de Formandos eliminados com sucesso.");

      

      refetch();
    } catch {
      Swal.close();
      showError("Erro ao eliminar quadro.");
    }
  };

  return (
    <Col md={4} className="mb-1 ">
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white text-center py-3 rounded-top-4">
        <h4 className="mb-0">Quadros dos Formandos</h4></Card.Header>
      <Card.Body className="p-3">

        

        {/* STATUS */}
        

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

        {/* ERROR */}
        {isError && (
          <Alert variant="danger" className="rounded-3">
            Erro ao carregar documentos
          </Alert>
        )}

        {/* List que possa ser selecionado os documentos para ser eliminados */}
        {documentosOrdenados.length > 0 && (
          <div className="mb-3" style={{ maxHeight: 200, overflowY: "auto" }}>
            <ListGroup variant="flush">
              {documentosOrdenados.map((doc) => (
                <ListGroup.Item
                  key={doc.id}
                  className="d-flex justify-content-between align-items-center border-1 rounded-3 mb-1 shadow-sm"
                >
                  <div className="d-flex flex-column justify-content-start align-items-center">
                    <div className="fw-semibold">
                      {/*Icone de Excel */}
                      <FaFileAlt className="me-2 text-success" />

                      {doc.nome_arquivo}
                    </div>
                    <div className="text-muted small">
                      {/*Data de envio formatada esta em formato:2026-05-05T10:02:08 para coverter para data normal */}
                      {new Date(doc.data_envio).toLocaleDateString()}
                    </div>

                  </div>


                  <div className="text-end">
                    <Button
                      size="sm"
                      className="rounded-circle"
                      variant="light"
                      onClick={() => window.open(doc.url_arquivo)}
                    >
                      <FaDownload />
                    </Button>
                  </div>

                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && documentosOrdenados.length === 0 && (
          <Container className="text-center py-3">
            <div style={{ fontSize: 40 }}>📊</div>
            <h6 className="fw-semibold mt-2">
              Nenhum quadro encontrado
            </h6>
            <p className="text-muted mb-0">
              Clique em <strong>Gerar Quadros</strong> para criar
            </p>
          </Container>
        )}
      </Card.Body>
      <Card.Footer className="text-muted text-center py-2">
{/* HEADER */}
<div className="d-flex justify-content-between align-items-center gap-2">
          

          <Button
            className="rounded-pill px-4 fw-semibold"
            style={{
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",
              border: "none",
            }}
            onClick={handleGerarQuadros}
            disabled={isGerando}
          >
            {isGerando ? <Spinner size="sm" /> : <FaPlus />}
            {!isLoading && documentosOrdenados.length === 0 ? "Gerar Quadros" : "Atualizar Quadros"} 
          </Button>
        
        <Button
          className="rounded-pill px-4 fw-semibold"
          variant="outline-danger"

          onClick={() => handleDelete()}
          disabled={isGerando}
        >
          {isGerando ? <Spinner size="sm" /> : <FaTrash />} Eliminar
        </Button>
        
        </div>

       
      </Card.Footer>
    </Card>
    </Col>
  );
}