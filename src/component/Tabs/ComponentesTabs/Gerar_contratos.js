import React, { useState } from "react";
import { Button, Spinner, Alert, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { FaFileWord, FaTrash, FaDownload, FaPlus } from "react-icons/fa";
import axios from "axios";
import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { gerarcontrato } from "./crachar_function";
import "./Gerarcontrato.css"; // CSS profissional do grid

const Gerarcontrato = ({ datas }) => {
  const token = localStorage.getItem("token");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isGerando, setIsGerando] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "CONTRATOS",
  };

  const { data: documentos, isLoading, isError, refetch } = useQuery({
    queryKey: ["QdocumentosGerarcontrato", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  // Gerar contratos
  const Gerar_Contrato = async () => {
    setIsGerando(true);
    try {
      const response = await gerarcontrato(datas);
      toast.success(response.data.mensagem);
      refetch();
    } catch (err) {
      toast.error("Erro ao gerar contratos");
    } finally {
      setIsGerando(false);
    }
  };

  // Seleção de documentos
  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : [...prev, id]
    );
  };

  // Baixar múltiplos documentos
  const baixarSelecionados = async () => {
    if (selectedDocs.length === 0) {
      toast.warning("Selecione pelo menos um documento.");
      return;
    }
    try {
      const response = await axios.post("/baixar-todos-contratos", { ids: selectedDocs });
      window.open(response.data.arquivo, "_blank"); // backend retorna link ZIP
    } catch {
      toast.error("Erro ao baixar documentos");
    }
  };

  // Deletar múltiplos documentos
  const deletarSelecionados = async () => {
    if (selectedDocs.length === 0) {
      toast.warning("Selecione pelo menos um documento.");
      return;
    }
    try {
      await axios.post("/deletar-multiplos-documentos", { ids: selectedDocs });
      toast.success("Documentos eliminados");
      setSelectedDocs([]);
      refetch();
    } catch {
      toast.error("Erro ao eliminar documentos");
    }
  };

  return (
    <div className="mt-4">
      <ToastContainer />

      {/* Barra de ações */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <Button variant="primary" onClick={Gerar_Contrato} disabled={isGerando}>
          {isGerando ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <FaPlus className="me-2" />
          )}
          Gerar Contratos
        </Button>
        <Button variant="success" onClick={baixarSelecionados} disabled={selectedDocs.length === 0}>
          <FaDownload className="me-2" /> Baixar Selecionados
        </Button>
        <Button variant="danger" onClick={deletarSelecionados} disabled={selectedDocs.length === 0}>
          <FaTrash className="me-2" /> Excluir Selecionados
        </Button>
      </div>

      {/* Feedback */}
      {isLoading && <Spinner animation="border" />}
      {isError && <Alert variant="danger">Erro ao carregar documentos.</Alert>}

      {/* Grid de documentos */}
      {documentos && Object.entries(documentos).length > 0 ? (
        <div className="document-grid">
          {Object.entries(documentos).map(([turmaId, listaDocs]) =>
            listaDocs.map((doc) => (
              <div key={doc.id} className="document-card shadow-sm p-3 rounded">
                {/* Checkbox */}
                <Form.Check
                  type="checkbox"
                  className="document-checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                />
                {/* Ícone Word */}
                <div className="document-icon">
                  <FaFileWord size={50} color="#2b579a" />
                </div>
                {/* Nome */}
                <div className="document-name" title={doc.nome_arquivo}>
                  {doc.nome_arquivo}
                </div>
                {/* Ações individuais */}
                <div className="document-actions d-flex gap-2 mt-2">
                  <Button variant="outline-success" size="sm" onClick={() => window.open(doc.url_arquivo)}>
                    <FaDownload /> Baixar
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => deletarSelecionados([doc.id])}>
                    <FaTrash /> Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <div className="text-center mt-5 text-muted">
            Nenhum documento disponível. Clique em "Gerar Contratos" para criar.
          </div>
        )
      )}
    </div>
  );
};

export default Gerarcontrato;