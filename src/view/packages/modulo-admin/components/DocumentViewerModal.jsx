import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { X, Download, Eye } from 'lucide-react';
import { DocumentPreviewer } from './DocumentPreviewer';
import { adminApi } from '../services/adminApi';

export const DocumentViewerModal = ({ show, documento, token, onClose }) => {
  const [descarregando, setDescarregando] = useState(false);

  if (!show || !documento) return null;

  const tipoDoc = documento.tipo_documento || documento.tipo || 'Documento Comprovativo';
  const nomeFicheiro = documento.nome_original || documento.nome || `${tipoDoc}.pdf`;

  const handleDownload = async () => {
    setDescarregando(true);
    try {
      await adminApi.descarregarDocumento(documento, token);
    } catch (err) {
      console.error('[DocumentViewerModal] Erro ao descarregar documento:', err);
    } finally {
      setDescarregando(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="xl" centered scrollable className="font-sans">
      {/* CABEÇALHO DO VISUALIZADOR */}
      <Modal.Header className="text-white py-2.5 px-4 d-flex align-items-center justify-content-between" style={{ backgroundColor: '#1b4332' }}>
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <Eye style={{ width: '22px', height: '22px' }} className="shrink-0 text-white" />
          <div className="text-truncate">
            <h6 className="mb-0 fw-bold text-white fs-6 text-truncate">{tipoDoc}</h6>
            <span className="fs-8 text-white-50 text-truncate d-block">{nomeFicheiro}</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 shrink-0">
          <Button
            variant="light"
            size="sm"
            onClick={handleDownload}
            disabled={descarregando}
            className="d-flex align-items-center gap-1.5 fw-semibold fs-7 shadow-xs text-dark"
            title="Descarregar ficheiro original"
          >
            {descarregando ? (
              <Spinner size="sm" animation="border" />
            ) : (
              <Download style={{ width: '15px', height: '15px' }} />
            )}
            <span className="d-none d-md-inline">Descarregar</span>
          </Button>

          <Button
            variant="light"
            size="sm"
            onClick={onClose}
            className="p-1 rounded-circle border-0 text-dark shadow-xs"
            aria-label="Fechar"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </Button>
        </div>
      </Modal.Header>

      {/* CORPO DO VISUALIZADOR COM DOCUMENT PREVIEWER */}
      <Modal.Body className="p-3 bg-white" style={{ minHeight: '65vh' }}>
        <DocumentPreviewer
          documento={documento}
          token={token}
          height="65vh"
          showControls={false}
          onDownload={handleDownload}
        />
      </Modal.Body>
    </Modal>
  );
};

export default DocumentViewerModal;
