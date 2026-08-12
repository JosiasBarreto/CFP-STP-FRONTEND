import { useState, useCallback, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../../api/urls";

export const useBatchUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [results, setResults] = useState({
    inseridos: 0,
    atualizados: 0,
    erros: 0,
    detalhes: [],
  });

  const abortControllerRef = useRef(null);

  const startUpload = useCallback(async (rows, config) => {
    setIsUploading(true);
    setProgress(0);
    setCurrent(0);
    setIsFinished(false);

    setResults({
      inseridos: 0,
      atualizados: 0,
      erros: 0,
      detalhes: [],
    });

    abortControllerRef.current = new AbortController();

    const validRows = rows.filter((r) => r.isValid && !r.isDuplicate);

    const total = validRows.length;

    const batchSize = 25;

    let totalInseridos = 0;
    let totalAtualizados = 0;
    let totalErros = rows.length - total;

    let detalhesErros = [];

    for (let i = 0; i < total; i += batchSize) {
      if (abortControllerRef.current.signal.aborted) {
        break;
      }

      const batch = validRows.slice(i, i + batchSize);

      try {
        const formData = new FormData();

        /*
 Configuração geral
*/
        Object.entries(config).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        /*
 Formandos
*/

        batch.forEach((row, index) => {
          const rowData = {
            ...row,
          };

          delete rowData.id;
          delete rowData.isValid;
          delete rowData.errors;
          delete rowData.fotoPreview;
          delete rowData.isDuplicate;

          if (rowData.foto) {
            formData.append(`formandos[${index}][foto]`, rowData.foto);

            delete rowData.foto;
          }

          Object.entries(rowData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(`formandos[${index}][${key}]`, value);
            }
          });
        });

        const response = await axios.post(
          `${API_URL}/formando/importacao-massa`,

          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data",
            },

            signal: abortControllerRef.current.signal,
          }
        );

        const data = response.data;

        /*
 Resultado do backend
*/

        data.dados?.forEach((item) => {
          if (item.acao === "inserido") {
            totalInseridos++;
          }

          if (item.acao === "atualizado") {
            totalAtualizados++;
          }
        });

        setCurrent(Math.min(i + batchSize, total));

        setProgress((Math.min(i + batchSize, total) / total) * 100);
      } catch (error) {
        console.error("Erro no lote:", error.response?.data);

        const erroBackend = error.response?.data;

        detalhesErros.push(
          erroBackend?.erros || [
            {
              erro: erroBackend?.erro || "Erro desconhecido",
            },
          ]
        );

        totalErros += batch.length;

        // IMPORTANTE
        // parar o processo

        break;
      }
    }

    setResults({
      inseridos: totalInseridos,

      atualizados: totalAtualizados,

      erros: totalErros,

      detalhes: detalhesErros.flat(),
    });

    setIsFinished(true);
  }, []);

  const cancelUpload = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const resetUpload = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setCurrent(0);
    setIsFinished(false);

    setResults({
      inseridos: 0,
      atualizados: 0,
      erros: 0,
      detalhes: [],
    });
  }, []);

  return {
    isUploading,

    progress,

    current,

    isFinished,

    results,

    startUpload,

    cancelUpload,

    resetUpload,
  };
};
