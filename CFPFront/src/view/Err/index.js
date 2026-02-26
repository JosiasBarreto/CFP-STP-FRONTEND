import React from 'react';
import { Container } from 'react-bootstrap';


const ErrorPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <img
        src="https://www.agiwork.com.br/themes/agiwork/assets/images/404.png"
        alt="Error Animation"
      />
      <h4 className="text-center">Oops, ocorreu um erro, Página não foi encontrada!</h4>
    </Container>
  );
};

export default ErrorPage;