import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthValidator } from '../Conf/reflesk_Fuction/useAuthValidator';
import { getAccessToken } from '../Conf/reflesk_Fuction/authService';


const ProtectedRoute = ({ children }) => {
  const isChecking = useAuthValidator();
  const token = getAccessToken();

  if (isChecking) {
    return <div>Verificando autenticação...</div>; // loading temporário
  }

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
