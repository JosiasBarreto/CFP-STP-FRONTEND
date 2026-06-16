import { useMemo, useState } from "react";

import {
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Badge,
  Button,
  ProgressBar,
  Modal,
} from "react-bootstrap";

import Swal from "sweetalert2";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  FiUploadCloud,
  FiEye,
  FiCheckCircle,
  FiFileText,
  FiAlertCircle,
  FiRefreshCcw,
  FiPlusCircle,
} from "react-icons/fi";

import { getTiposDocumento } from "../../../../../../api/listas.api";

import {
  getDocumentosFormador,
  uploadDocumento,
} from "../../../../../../api/formadorDocumentos.api";
import { FaReceipt } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../../../../../api/urls";

export default function StepDocumentos({ formadorId }) {
  const queryClient = useQueryClient();

  const [uploadingId, setUploadingId] = useState(null);

  const [previewDoc, setPreviewDoc] = useState(null);

  const [selectedDocs, setSelectedDocs] = useState([]);


  /* =========================================================
      QUERIES
  ========================================================= */

  const {
    data: tipos = [],
    isLoading: loadingTipos,
    isError: errorTipos,
  } = useQuery({
    queryKey: ["tipos-documento"],
    queryFn: getTiposDocumento,
  });

  const {
    data: documentos = [],
    isLoading: loadingDocs,
    isError: errorDocs,
    refetch,
  } = useQuery({
    queryKey: ["documentos-formador", formadorId],
    queryFn: () => getDocumentosFormador(formadorId),
    enabled: !!formadorId,
    select: (res) => res.documentos ?? [],
  });

  /* =========================================================
      HELPERS
  ========================================================= */
  
  const getDocumento = (tipo) => {
    return documentos.find(
      (d) =>
        d.tipo_documento?.trim().toLowerCase() ===
        tipo.nome?.trim().toLowerCase()
    );
  };

  const obrigatorios = useMemo(
    () => tipos.filter((t) => t.obrigatorio),
    [tipos]
  );

  const enviadosObrigatorios = useMemo(
    () => obrigatorios.filter((t) => getDocumento(t)),
    [obrigatorios, documentos]
  );

  const progresso = useMemo(() => {
    if (!obrigatorios.length) return 0;

    return (
      (enviadosObrigatorios.length / obrigatorios.length) *
      100
    );
  }, [obrigatorios, enviadosObrigatorios]);

  const documentosFaltantes = useMemo(
    () =>
      obrigatorios.filter((t) => !getDocumento(t)),
    [obrigatorios, documentos]
  );

  /* =========================================================
      MUTATION
  ========================================================= */

  const uploadMutation = useMutation({
    mutationFn: uploadDocumento,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documentos-formador", formadorId],
      });

      Swal.fire({
        icon: "success",
        title: "Documento enviado",
        text: "Upload realizado com sucesso.",
        timer: 1800,
        showConfirmButton: false,
      });

      setUploadingId(null);
    },

    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao enviar documento.",
      });

      setUploadingId(null);
    },
  });

  /* =========================================================
      UPLOAD
  ========================================================= */

  const handleUpload = (file, tipo) => {
    if (!file) return;

    const limiteMB = 10;

    if (file.size > limiteMB * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Ficheiro muito grande",
        text: `Máximo permitido: ${limiteMB}MB`,
      });

      return;
    }

    const formatosPermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!formatosPermitidos.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Formato inválido",
        text: "Permitido apenas PDF, JPG, JPEG e PNG.",
      });

      return;
    }

    setUploadingId(tipo.id);

    uploadMutation.mutate({
      formadorId,
      tipoDocumentoId: tipo.id,
      file,
    });
    refetch();
  };

  /* =========================================================
      LOADING
  ========================================================= */

  if (loadingTipos || loadingDocs) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner
          animation="border"
          variant="success"
          style={{
            width: "3rem",
            height: "3rem",
          }}
        />

        <div className="mt-3 text-muted fw-semibold">
          Carregando documentos...
        </div>
      </div>
    );
  }

  /* =========================================================
      ERROR
  ========================================================= */

  if (errorTipos || errorDocs) {
    return (
      <Alert variant="danger" className="rounded-4">
        Erro ao carregar documentos.
      </Alert>
    );
  }
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
      await axios.delete(API_URL +`/api/formadores/${formadorId}/documentos/${idsToDelete}/delete`, {
        ids: idsToDelete,
      });

    
      Swal.fire("Sucesso!", "Documentos eliminados com sucesso.", "success");

   

      refetch();
    } catch {
      Swal.fire("Erro!", "Erro ao eliminar documentos.", "error");
    }
  };
  
  return (
    <>
      {/* HEADER */}

      <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">

        <Card.Body className="p-2">

        

          <div className="mt-0">

            <div className="d-flex justify-content-between small mb-2">
              <span className="fw-semibold">
                Progresso
              </span>

              <span>
                {enviadosObrigatorios.length}/
                {obrigatorios.length}
              </span>
            </div>

            <ProgressBar
              now={progresso}
              variant={
                progresso === 100
                  ? "success"
                  : "warning"
              }
              label={
                progresso === 100
                  ? "100%"
                  : `${Math.round(progresso)}%`
              }
             
              style={{
                height: "14px",
                borderRadius: "20px",
              }}
            />
          </div>

          {!!documentosFaltantes.length && (
            <div className="mt-4">

              <div className="d-flex align-items-center gap-2 mb-2 text-danger fw-semibold">
                <FiAlertCircle />
                Documentos obrigatórios em falta
              </div>

              <div className="d-flex flex-wrap gap-2">

                {documentosFaltantes.map((doc) => (
                  <Badge
                    key={doc.id}
                    bg="danger"
                    className="px-3 py-2 rounded-pill fw-normal"
                  >
                    {doc.nome}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* DOCUMENTOS */}

      <Row className="g-4">

        {tipos.map((tipo) => {
          const doc = getDocumento(tipo);

          const uploading =
            uploadingId === tipo.id;

          const isPDF =
            doc?.mime_type === "application/pdf" ||
            doc?.arquivo_url
              ?.toLowerCase()
              .includes(".pdf");

          return (
            <Col xl={4} lg={6} key={tipo.id}>

              <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden documento-card">

                {/* HEADER */}

                <div className="p-4 border-bottom bg-light">

                  <div className="d-flex justify-content-between align-items-start gap-3">

                    <div>

                      <h5 className="fw-bold mb-1">
                        {tipo.nome}
                      </h5>

                      <div className="d-flex flex-wrap gap-2">

                        <Badge
                          bg={
                            tipo.obrigatorio
                              ? "danger"
                              : "secondary"
                          }
                        >
                          {tipo.obrigatorio
                            ? "Obrigatório"
                            : "Opcional"}
                        </Badge>

                        <Badge
                          bg={
                            tipo.comportamento ===
                            "atualizavel"
                              ? "info"
                              : "warning"
                          }
                        >
                          {tipo.comportamento ===
                          "atualizavel"
                            ? "Atualizável"
                            : "Incrementável"}
                        </Badge>

                        {doc?.validado && (
                          <Badge bg="success">
                            Validado
                          </Badge>
                        )}
                      </div>
                    </div>

                    {doc ? (
                      <FiCheckCircle
                        size={28}
                        className="text-success"
                      />
                    ) : (
                      <FiFileText
                        size={28}
                        className="text-muted"
                      />
                    )}
                  </div>
                </div>

                {/* BODY */}

                <Card.Body className="d-flex flex-column">

                  {/* PREVIEW */}

        <div className="mb-4 flex-grow-1">

  {doc ? (
    <>
      <Card className="border-0 shadow-sm overflow-hidden">

        {doc.mime_type?.startsWith("image") ? (
          <img
            src={doc.arquivo_url}
            alt={tipo.nome}
            className="w-100"
            style={{
              height: "220px",
              objectFit: "cover",
            }}
          />
        ) : (
          <iframe
            src={doc.arquivo_url}
            title={tipo.nome}
            width="100%"
            height="220"
            style={{
              border: "none",
              borderRadius: "12px",
            }}
          />
        )}
      </Card>

      <div className="mt-3">
        <small className="text-muted d-block">
          Documento associado
        </small>

        <div className="fw-semibold small">
          {tipo.nome}
        </div>
      </div>
    </>
  ) : (
    <div
      className="border rounded-4 d-flex flex-column justify-content-center align-items-center text-muted"
      style={{
        height: "220px",
        background: "#f8f9fa",
      }}
    >
      <div style={{ fontSize: "50px" }}>
        📄
      </div>

      <small>
        Nenhum documento enviado
      </small>
    </div>
  )}
</div>

                  {/* STATUS */}

                  <div className="mb-3">

                    {!doc && (
                      
                    
                      <Alert
                        variant="light"
                        className="py-2 px-3 rounded-4 mb-0"
                      >
                        Não Enviado
                      </Alert>
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="d-flex justify-content-between align-items-center t-auto">

                    {doc?.arquivo_url && (
                      <>
                      <Button
                        variant="outline-dark"
                        className="rounded-pill"
                        onClick={() =>
                          setPreviewDoc(doc)
                        }
                      >
                        <FiEye className="me-2" />
                        Visualizar
                      </Button>
                      <Button onClick={() => handleDelete([doc.id])} variant="danger" className="rounded-pill ms-2">
                        
                        Remover
                      </Button>
                      </>
                    )}

                    <label className="btn btn-success rounded-pill fw-semibold">

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
                        tipo.comportamento ===
                        "atualizavel" ? (
                          <>
                            <FiRefreshCcw className="me-2" />
                            Atualizar documento
                          </>
                        ) : (
                          <>
                            <FiPlusCircle className="me-2" />
                            Adicionar novo
                          </>
                        )
                      ) : (
                        <>
                          <FiUploadCloud className="me-2" />
                          Enviar documento
                        </>
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

      {/* MODAL */}

      <Modal
  show={!!previewDoc}
  onHide={() => setPreviewDoc(null)}
  centered
  size="xl"
>
  <Modal.Header closeButton>
    <Modal.Title>
      Visualizar Documento
    </Modal.Title>
  </Modal.Header>

  <Modal.Body className="p-0">

  {previewDoc?.mime_type?.startsWith("image") ? (
    <img
      src={previewDoc.arquivo_url}
      alt="Documento"
      className="w-100"
    />
  ) : (
    <iframe
      src={previewDoc?.arquivo_url}
      title="Documento"
      width="100%"
      height="700"
      style={{
        border: "none",
      }}
    />
  )}

</Modal.Body>
</Modal>
    </>
  );
}