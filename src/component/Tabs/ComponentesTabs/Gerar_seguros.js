import React, { useState } from "react";
import { Button, Spinner, Alert, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import { FaFileWord, FaTrash, FaDownload, FaPlus } from "react-icons/fa";
import axios from "axios";
import { BuscarTurmadocumentos } from "../../../view/sing/function";
import { gerarseguros } from "./crachar_function";
import "./Gerarcontrato.css"; // Reutiliza CSS do grid profissional
import { API_URL } from "../../../api/urls";

const GerarSeguro = ({ datas }) => {
  const token = localStorage.getItem("token");
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isGerando, setIsGerando] = useState(false);

  const datar = {
    curso_id: datas?.id_curso,
    grupo: "Seguros",
  };

  const { data: documentos, isLoading, isError, refetch } = useQuery({
    queryKey: ["QdocumentosGerarSeguro", datar],
    queryFn: () => BuscarTurmadocumentos(token, datar),
    enabled: !!datas?.id_curso,
  });

  // Gerar seguros
  const Gerar_Seguro = async () => {
    setIsGerando(true);
    try {
      const response = await gerarseguros(datas);
      toast.success(response.data.mensagem || "Seguros gerados com sucesso.");
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao gerar seguros.");
    } finally {
      setIsGerando(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedDocs((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : [...prev, id]
    );
  };

  const baixarSelecionados = async () => {
    if (selectedDocs.length === 0) {
      toast.warning("Selecione pelo menos um seguro.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_URL}/documents/baixar-seguros`,
        { ids: selectedDocs },
        { responseType: "blob" } // ⬅ essencial
      );
  
      // Criar link temporário para download
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "todos_seguros.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error(error);
      toast.error("Erro ao baixar seguros");
    }
  };

  // Deletar múltiplos seguros
  const deletarSelecionados = async () => {
    if (selectedDocs.length === 0) {
      toast.warning("Selecione pelo menos um seguro.");
      return;
    }
    try {
      await axios.post(API_URL+"/documents/deletar-multiplos-seguros", { ids: selectedDocs });
      toast.success("Seguros eliminados");
      setSelectedDocs([]);
      refetch();
    } catch {
      toast.error("Erro ao eliminar seguros");
    }
  };

  return (
    <div className="mt-4">
      <ToastContainer />

      {/* Barra de ações */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <Button variant="primary" onClick={Gerar_Seguro} disabled={isGerando}>
          {isGerando ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <FaPlus className="me-2" />
          )}
          Gerar Seguros
        </Button>
        <Button variant="success" onClick={baixarSelecionados} disabled={selectedDocs.length === 0}>
          <FaDownload className="me-2" /> Baixar Selecionados
        </Button>
        <Button variant="danger" onClick={deletarSelecionados} disabled={selectedDocs.length === 0}>
          <FaTrash className="me-2" /> Excluir Selecionados
        </Button>
      </div>

      {isLoading && <Spinner animation="border" />}
      {isError && <Alert variant="danger">Erro ao carregar seguros.</Alert>}

      {/* Grid de seguros */}
      {documentos && Object.entries(documentos).length > 0 ? (
        <div className="document-grid">
          {Object.entries(documentos).map(([turmaId, listaDocs]) =>
            listaDocs.map((doc) => (
              <div key={doc.id} className="document-card shadow-sm p-3 rounded">
                <Form.Check
                  type="checkbox"
                  className="document-checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => toggleSelect(doc.id)}
                />
                <div className="document-icon">
                  <FaFileWord size={50} color="#2b579a" />
                </div>
                <div className="document-name" title={doc.nome_arquivo}>
                  {doc.nome_arquivo}
                </div>
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
            Nenhum seguro disponível. Clique em "Gerar Seguros" para criar.
          </div>
        )
      )}
    </div>
  );
};

export default GerarSeguro;