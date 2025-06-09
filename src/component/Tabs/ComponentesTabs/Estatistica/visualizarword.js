import React, { useEffect, useState } from "react";
import mammoth from "mammoth";

const VisualizadorDocx = ({ url }) => {
  const [documentoHtml, setDocumentoHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const carregarDocx = async () => {
      try {
        if (!url) return;

        const response = await fetch(url);
        const blob = await response.blob();

        if (blob.size === 0) {
          setError("Erro: O arquivo está vazio.");
          return;
        }

        setError("");

        // Converter .docx para HTML
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target.result;
          const { value } = await mammoth.convertToHtml({ arrayBuffer });
          setDocumentoHtml(value);
        };
        reader.readAsArrayBuffer(blob);
      } catch (e) {
        console.error("Erro ao carregar documento:", e);
        setError("Erro ao carregar documento.");
      }
    };

    carregarDocx();
  }, [url]);

  return (
    <>
      {error && <div className="text-danger">{error}</div>}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          maxHeight: "80vh",
          width: "100%",
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{ __html: documentoHtml }}
      ></div>
    </>
  );
};

export default VisualizadorDocx;
