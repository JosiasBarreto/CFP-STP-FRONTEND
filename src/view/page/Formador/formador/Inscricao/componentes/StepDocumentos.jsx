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
 * StepDocumentos – UX Profissional (Cards)
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
      queryClient.invalidateQueries([
        "documentos-formador",
        formadorId,
      ]);
      Swal.fire(
        "Sucesso",
        "Documento enviado com sucesso",
        "success"
      );
      setUploadingId(null);
    },
    onError: () => {
      Swal.fire(
        "Erro",
        "Falha ao enviar documento",
        "error"
      );
      setUploadingId(null);
    },
  });

  const getDocumento = (tipoId) =>
    documentos.find(
      (d) => d.tipo_documento_id === tipoId
    );

  const handleUpload = (file, tipo) => {
    if (!file) return;

    const existe = getDocumento(tipo.id);

    Swal.fire({
      title: existe
        ? "Substituir documento?"
        : "Enviar documento?",
      text: tipo.nome,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((res) => {
      if (res.isConfirmed) {
        setUploadingId(tipo.id);
        uploadMutation.mutate({
          formadorId,
          tipoDocumentoId: tipo.id,
          file,
        });
      }
    });
  };

  /* 🔹 Estados */
  if (loadingTipos || loadingDocs)
    return <Spinner animation="border" />;

  if (errorTipos || errorDocs)
    return (
      <Alert variant="danger">
        Erro ao carregar documentos
      </Alert>
    );

  return (
    <>
      <h5 className="mb-4">
        📁 Documentos do Formador
      </h5>

      <Row>
        {tipos.map((tipo) => {
          const doc = getDocumento(tipo.id);
          const uploading = uploadingId === tipo.id;

          return (
            <Col md={6} lg={4} key={tipo.id}>
              <Card className="mb-4 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <Card.Title className="fs-6">
                      {tipo.nome}
                    </Card.Title>

                    {doc ? (
                      <Badge bg="success">✔ Enviado</Badge>
                    ) : (
                      <Badge bg="secondary">
                        Não enviado
                      </Badge>
                    )}
                  </div>

                  <div className="mt-2 mb-3">
                    {doc ? (
                      <small className="text-muted">
                        Ficheiro:{" "}
                        <strong>
                          {doc.ficheiro}
                        </strong>
                      </small>
                    ) : (
                      <small className="text-muted">
                        Nenhum ficheiro associado
                      </small>
                    )}
                  </div>

                  <div>
                    <label className="btn btn-outline-primary btn-sm w-100">
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
                        "Substituir documento"
                      ) : (
                        "Enviar documento"
                      )}

                      <input
                        type="file"
                        hidden
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={uploading}
                        onChange={(e) =>
                          handleUpload(
                            e.target.files[0],
                            tipo
                          )
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
