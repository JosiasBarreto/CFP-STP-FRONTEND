import React, { useState } from "react";
import { Modal, Button, Spinner, Alert, ListGroup } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { FaFileWord, FaTrash } from "react-icons/fa";
import { API_URL } from "../../../api/urls";

const DocumentosPorTurma = ({ turmaId, datas }) => {
  const [documentoSelecionado, setDocumentoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const token = localStorage.getItem("token");

  const datar = {
    curso_id: datas.id_curso,
    grupo: "SEGUROS",
  };

  const {
    data: documentos,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["QdocumentosSeguro", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
  });

  const abrirModal = async (documento) => {
    try {
      const response = await fetch(
        `${API_URL}/documents/visualizar-documento/${documento.id}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao carregar documento");

      // Converte resposta em Blob e cria URL para exibição
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Atualiza estado para abrir modal com o documento
      setDocumentoSelecionado({ ...documento, urlBlob: url });
      setMostrarModal(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar documento.");
    }
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setDocumentoSelecionado(null);
  };

  const deletarDocumento = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar este documento?"))
      return;
    try {
      const response = await fetch(`/api/deletar-documento/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar documento");

      alert("Documento deletado com sucesso!");
      refetch(); // Atualiza a lista
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar o documento.");
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-3">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  if (isError || !documentos) {
    return <Alert variant="danger">Erro ao carregar os documentos.</Alert>;
  }

  const documentosLista = Array.isArray(documentos)
    ? documentos
    : Object.values(documentos).flat();

  return (
    <div>
      <h5>Documentos de Seguro</h5>
      {documentosLista.length === 0 ? (
        <Alert variant="info">Nenhum documento encontrado.</Alert>
      ) : (
        <ListGroup>
          {documentosLista.map((doc) => (
            <ListGroup.Item
              key={doc.id}
              className="d-flex justify-content-between align-items-center"
              action
              onClick={() => abrirModal(doc)}
            >
              <div className="d-flex align-items-center">
                <FaFileWord size={20} color="#2B579A" className="me-2" />
                <div>
                  <strong>{doc.nome_arquivo}</strong>
                  <br />
                  <small>
                    Enviado em:{" "}
                    {doc.data_envio
                      ? new Date(doc.data_envio).toLocaleDateString()
                      : "N/A"}
                  </small>
                </div>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deletarDocumento(doc.id);
                }}
              >
                <FaTrash />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal de Visualização */}
      <Modal
        show={mostrarModal}
        onHide={fecharModal}
        size="xl" // Define um tamanho maior para o modal
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {documentoSelecionado?.nome_arquivo.replace(".docx", ".pdf")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh" }}>
          {" "}
          {/* Aumenta a altura do modal */}
          {documentoSelecionado?.urlBlob ? (
            <iframe
              src={documentoSelecionado.urlBlob}
              width="100%"
              height="100%"
              style={{ minHeight: "75vh", border: "none" }} // Garante que o iframe ocupe o modal
            />
          ) : (
            <Alert variant="warning">
              Documento não disponível para visualização.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DocumentosPorTurma;
