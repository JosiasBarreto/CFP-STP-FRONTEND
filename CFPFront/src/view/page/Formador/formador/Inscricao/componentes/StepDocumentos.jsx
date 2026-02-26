import { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getTiposDocumento } from "../../../../../../api/listas.api";
import {
  getDocumentosFormador,
  uploadDocumento,
} from "../../../../../../api/formadorDocumentos.api";

/**
 * StepDocumentos – UI/UX Moderno
 */
export default function StepDocumentos({ formadorId }) {
  const queryClient = useQueryClient();
  const [uploadingId, setUploadingId] = useState(null);

  /* 🔹 Tipos de documento */
  const {
    data: tipos = [],
    isLoading: loadingTipos,
    isError: errorTipos,
  } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: getTiposDocumento,
  });

  /* 🔹 Documentos do formador */
  const {
    data: documentos = [],
    isLoading: loadingDocs,
    isError: errorDocs,
  } = useQuery({
    queryKey: ["documentos-formador", formadorId],
    queryFn: () => getDocumentosFormador(formadorId),
    enabled: !!formadorId,
    select: (res) => res.documentos ?? [],
  });

  /* 🔹 Upload */
  const uploadMutation = useMutation({
    mutationFn: uploadDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries(["documentos-formador", formadorId]);
      Swal.fire("✅ Sucesso", "Documento enviado com sucesso!", "success");
      setUploadingId(null);
    },
    onError: () => {
      Swal.fire("❌ Erro", "Falha ao enviar documento", "error");
      setUploadingId(null);
    },
  });

  const getDocumento = (tipoId) =>
    documentos.find((d) => d.tipo_documento_id === tipoId);

  const handleUpload = (file, tipo) => {
    if (!file) return;
    const existe = getDocumento(tipo.id);

    
        setUploadingId(tipo.id);
        uploadMutation.mutate({
          formadorId,
          tipoDocumentoId: tipo.id,
          file,
        });
     
  };

  /* 🔹 Estados */
  if (loadingTipos || loadingDocs)
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <Spinner animation="border" variant="success" />
      </div>
    );

  

  return (
    <>
      <h4 className="mb-4 fw-bold text-success">
        📁 Documentos do Formador
      </h4>

      <Row className="g-4">
        {tipos.map((tipo) => {
          const doc = getDocumento(tipo.id);
          const uploading = uploadingId === tipo.id;

          return (
            <Col md={6} lg={4} key={tipo.id}>
              <Card className="h-100 rounded-3 shadow-lg border-0 hover-shadow">
                <Card.Header className="py-3 rounded-top bg-success bg-opacity-10">
                  <Card.Title className="fs-5 fw-bold mb-0 text-success">
                    {tipo.nome}
                  </Card.Title>
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div className="d-flex  mb-2">
                   {/* Estado de envio */}
        {doc ? (
          <Badge bg="success">✔ Enviado</Badge>
        ) : (
          <Badge bg="secondary">Não enviado</Badge>
        )}

        {/* Obrigatoriedade */}
        {tipo.obrigatorio ? (
          <Badge bg="success">Obrigatório</Badge>
        ) : (
          <Badge bg="secondary">Opcional</Badge>
        )}

        {/* Comportamento */}
        {tipo.comportamento === "atualizavel" ? (
          <Badge bg="info">Atualizável</Badge>
        ) : (
          <Badge bg="warning">Incrementável</Badge>
        )}
                  </div>

                  <div className="mb-3">
                    {doc ? (
                      <small className="text-muted">
                        Ficheiro: <strong>{doc.ficheiro}</strong>
                      </small>
                    ) : (
                      <small className="text-muted">
                        Nenhum ficheiro associado
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="btn btn-success btn-sm w-100 rounded-pill">
                      {uploading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          A enviar...
                        </>
                      ) : doc ? (
                        "📤 Substituir documento"
                      ) : (
                        "📥 Enviar documento"
                      )}

                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploading}
                        onChange={(e) =>
                          handleUpload(e.target.files[0], tipo)
                        }
                      />
                    </label>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
