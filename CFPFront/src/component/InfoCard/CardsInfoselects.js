import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';


const MyComponent = ({ searchParams }) => {
  return (
    <Row md={12} xs={12} className="cards-superiores ">
        <Col md={3} xs={12} >
        <Card bg="success" text="white" className="mb-0">
          <Card.Body>
            <Card.Text className='fw-bold mb-0'>PROGRAMA/MEDIDA</Card.Text>
            <Card.Text>{searchParams.nome_programa || "Não informado"}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      <Col md={5} xs={12} >
        <Card bg="success" text="white" className="mb-">
          <Card.Body>
            <Card.Text className='fw-bold mb-0'>DESIGNAÇÃO DO CURSO</Card.Text>
            <Card.Text>{searchParams.nome_curso || "Não informado"}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={2} xs={12} >
        <Card bg="success" text="white" className="mb-">
          <Card.Body>
            <Card.Text className='fw-bold mb-0'> AÇÃO Nº</Card.Text>
            <Card.Text>{searchParams.acao || "Não informado"}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
     
      <Col md={2} xs={12} >
        <Card bg="success" text="white" className="mb-">
          <Card.Body>
            <Card.Text className='fw-bold mb-0'>ANO</Card.Text>
            <Card.Text>{searchParams.ano_execucao}</Card.Text>
          </Card.Body>
        </Card>
      </Col>

      

      
    </Row>
  );
};

export default MyComponent;