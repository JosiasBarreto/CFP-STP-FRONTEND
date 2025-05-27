import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, Card, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { API_URL } from '../../../api/urls';

const DocumentosPorTurma = ({ turmaId }) => {
  const [documentos, setDocumentos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarDocumentos = async () => {
      try {
        const response = await axios.get(API_URL+`/documents/buscar-documentos?turma_id=${3}`);
        setDocumentos(response.data);
      } catch (err) {
        setErro('Erro ao carregar documentos.');
      } finally {
        setCarregando(false);
      }
    };

    if (turmaId) {
      buscarDocumentos();
    }
  }, [turmaId]);

  if (carregando) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner>;
  }

  if (erro) {
    return <Alert variant="danger">{erro}</Alert>;
  }

  return (
    <div>
      <h4>Documentos da Turma {turmaId}</h4>
      <Accordion defaultActiveKey="0">
        {Object.entries(documentos).map(([grupo, docs], idx) => (
          <Accordion.Item eventKey={idx.toString()} key={grupo}>
            <Accordion.Header>{grupo}</Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                {docs.map((doc) => (
                  <ListGroup.Item key={doc.id}>
                    <div><strong>Nome:</strong> {doc.nome_arquivo}</div>
                    <div><strong>Tipo:</strong> {doc.tipo}</div>
                    <div><strong>Data de Envio:</strong> {new Date(doc.data_envio).toLocaleString()}</div>
                    <div>
                      <strong>Arquivo:</strong>{" "}
                      <a href={doc.caminho_arquivo} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default DocumentosPorTurma;
