import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast, ToastContainer } from 'react-bootstrap';
import { AdminGestaoView } from './components/AdminGestaoView';

export const ModuloAdminApp = ({
  token = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem('token') : 'demo-admin-token-cfp-stp',
}) => {
  const [notificacao, setNotificacao] = useState(null);

  const aoNotificar = (msg) => {
    setNotificacao(msg);
  };

  return (
    <div className="w-100 min-vh-100 bg-light p-1 p-md-4 font-sans text-dark border-rounded-3 shadow-sm">
      {/* Toast de Notificação do React-Bootstrap */}
      {notificacao && (
        <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
          <Toast
            bg={notificacao.tipo === 'sucesso' ? 'success' : 'danger'}
            onClose={() => setNotificacao(null)}
            show={Boolean(notificacao)}
            delay={6000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto text-dark">
                {notificacao.tipo === 'sucesso' ? 'Sucesso' : 'Notificação'}
              </strong>
            </Toast.Header>
            <Toast.Body className="text-white fw-semibold">{notificacao.texto}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}

      {/* Painel Principal de Gestão de Dossiês */}
      <AdminGestaoView token={token} aoNotificar={aoNotificar} />
    </div>
  );
};

export default ModuloAdminApp;
export * from './services/adminApi';
export * from './api/urls';
