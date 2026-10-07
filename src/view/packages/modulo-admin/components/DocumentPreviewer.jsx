import React, { useState, useEffect } from 'react';
import { Spinner, Alert, Button, Badge } from 'react-bootstrap';
import {
  FileText,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Maximize2,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

/**
 * Componente DocumentPreviewer para exibição segura de documentos protegidos por JWT.
 * 
 * Recebe o documento com URLs devolvidas pelo backend (url_visualizacao, arquivo_url, url_publica, url_download),
 * efetua o fetch seguro injetando 'Authorization: Bearer <token>', converte para Blob e ObjectURL,
 * gere estados de carregamento e erro com botão de repetição, e liberta o ObjectURL ao desmontar.
 */
export const DocumentPreviewer = ({
  documento,
  token,
  height = '420px',
  className = '',
  style = {},
  showControls = true,
  onExpand,
  onDownload,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [mimeType, setMimeType] = useState('');
  const [descarregando, setDescarregando] = useState(false);

  const carregarBlob = () => {
    if (!documento) {
      setBlobUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;
    let createdUrl = null;

    setLoading(true);
    setError(null);

    adminApi
      .obterDocumentoBlob(documento, token)
      .then((blob) => {
        if (!isMounted) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
        setMimeType(blob.type || documento.mime_type || '');
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('[DocumentPreviewer] Erro ao carregar documento com JWT:', err);
        setError(err.message || 'Não foi possível carregar o documento com autenticação segura.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  };

  useEffect(() => {
    const cleanup = carregarBlob();
    return () => {
      if (cleanup) cleanup();
    };
  }, [documento, token]);

  const handleDownload = async () => {
    if (onDownload) {
      onDownload(documento);
      return;
    }
    if (!documento) return;
    setDescarregando(true);
    try {
      await adminApi.descarregarDocumento(documento, token);
    } catch (err) {
      console.error('[DocumentPreviewer] Erro ao descarregar documento:', err);
    } finally {
      setDescarregando(false);
    }
  };

  if (!documento) {
    return (
      <div className={`text-center p-4 bg-light rounded border text-muted ${className}`} style={{ minHeight: height, ...style }}>
        <FileText style={{ width: '36px', height: '36px' }} className="mb-2 text-secondary" />
        <p className="mb-0 fs-7">Nenhum documento selecionado para pré-visualização.</p>
      </div>
    );
  }

  const tipoDoc = documento.tipo_documento || documento.tipo || 'Documento';
  const nomeFicheiro = documento.nome_original || documento.nome || `${tipoDoc}.pdf`;
  const isImage =
    mimeType.includes('image') ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(nomeFicheiro) ||
    documento.tipo === 'FOTO' ||
    tipoDoc.toLowerCase().includes('foto');

  return (
    <div className={`document-previewer position-relative d-flex flex-column h-100 ${className}`} style={style}>
      {/* BARRA DE CONTROLO SUPERIOR (OPCIONAL) */}
      {showControls && (
        <div className="d-flex align-items-center justify-content-between p-2 bg-light border-bottom rounded-top">
          <div className="d-flex align-items-center gap-2 text-truncate me-2">
            <Eye style={{ width: '16px', height: '16px', color: '#2d6a4f' }} className="shrink-0" />
            <span className="fw-bold fs-7 text-dark text-truncate">{tipoDoc}</span>
            <Badge bg="secondary-subtle" text="dark" className="border fs-8 text-truncate d-none d-sm-inline">
              {nomeFicheiro}
            </Badge>
          </div>

          <div className="d-flex align-items-center gap-1.5 shrink-0">
            {onExpand && (
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => onExpand(documento)}
                className="py-0.5 px-2 fs-8 d-inline-flex align-items-center gap-1 fw-semibold"
                title="Expandir em Modal"
              >
                <Maximize2 style={{ width: '12px', height: '12px' }} />
                <span className="d-none d-md-inline">Expandir</span>
              </Button>
            )}

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleDownload}
              disabled={descarregando}
              className="py-0.5 px-2 fs-8 d-inline-flex align-items-center gap-1 fw-semibold"
              title="Descarregar Ficheiro"
            >
              {descarregando ? (
                <Spinner animation="border" size="sm" style={{ width: '12px', height: '12px' }} />
              ) : (
                <Download style={{ width: '12px', height: '12px' }} />
              )}
              <span className="d-none d-md-inline">Descarregar</span>
            </Button>
          </div>
        </div>
      )}

      {/* ÁREA DE EXIBIÇÃO DE CONTEÚDO */}
      <div
        className="preview-body flex-grow-1 p-2 bg-dark bg-opacity-10 d-flex align-items-center justify-content-center overflow-auto rounded-bottom"
        style={{ minHeight: height }}
      >
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" style={{ color: '#2d6a4f' }} />
            <p className="mt-2 text-muted fs-8 fw-semibold mb-0">
              A obter documento com autenticação JWT segura...
            </p>
          </div>
        ) : error ? (
          <div className="p-3 text-center w-100">
            <Alert variant="danger" className="mb-3 fs-7 py-2 border-danger-subtle shadow-xs">
              <AlertTriangle className="me-1.5 inline-block" style={{ width: '18px', height: '18px' }} />
              {error}
            </Alert>
            <div className="d-flex justify-content-center gap-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={carregarBlob}
                className="fs-8 fw-semibold d-inline-flex align-items-center gap-1"
              >
                <RefreshCw style={{ width: '12px', height: '12px' }} /> Tentar Novamente
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDownload}
                className="fs-8 fw-bold text-white d-inline-flex align-items-center gap-1"
              >
                <Download style={{ width: '12px', height: '12px' }} /> Descarregar Diretamente
              </Button>
            </div>
          </div>
        ) : blobUrl ? (
          isImage ? (
            <img
              src={blobUrl}
              alt={nomeFicheiro}
              className="img-fluid rounded border shadow-xs"
              style={{ maxHeight: height, objectFit: 'contain' }}
            />
          ) : (
            <iframe
              src={blobUrl}
              title={nomeFicheiro}
              className="w-100 border-0 rounded shadow-xs"
              style={{ height, minHeight: '350px' }}
            />
          )
        ) : null}
      </div>
    </div>
  );
};

export default DocumentPreviewer;
