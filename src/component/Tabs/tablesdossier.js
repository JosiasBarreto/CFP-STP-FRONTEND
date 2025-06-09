import React, { useState } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { BuscarTurma, BuscarTurmadocumentos } from '../../view/sing/function';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TurmaDetalhesBootstrap from './ComponentesTabs/Estatistica';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { API_URL } from '../../api/urls';
import BadgeDisplay from './ComponentesTabs/gerarcrachar';
import DocumentosPorTurma from './ComponentesTabs/gerarcrachar';

const TabsCustom = ({searchParams}) => {
  const [key, setKey] = useState('estatistica');
    const token = localStorage.getItem('token');
    
  
 
 
  
  const gerarDocumentos = async () => {
      try {
          const response = await axios.post(API_URL+'/documents/gerar-crachas', searchParams, {
              responseType: 'blob'  // importante!
          });
  
         
      } catch (err) {
          console.error("Erro ao gerar documento:", err);
          alert("Erro ao gerar documento.");
      }
  };
 

  return (
    <Tabs
      id="custom-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="estatistica" title="Estatística">
      <Button variant="primary" onClick={gerarDocumentos}>
         Quadro dos formandos
        </Button>
       
      </Tab>
      <Tab eventKey="frequencia" title="Listagem de Frequência">
        Conteúdo da Listagem de Frequência
      </Tab>
      <Tab eventKey="quadros-formandos" title="Quadros dos Formandos">
        Conteúdo dos Quadros dos Formandos
      </Tab>
      <Tab eventKey="processo-individual" title="Processo Individual">
        Conteúdo do Processo Individual
      </Tab>
      <Tab eventKey="contrato" title="Contrato">
        Conteúdo do Contrato
      </Tab>
      <Tab eventKey="seguro" title="Seguro">
      <DocumentosPorTurma turmaId={4} datas={searchParams}/>
      </Tab>
      <Tab eventKey="ficha-sumario" title="Ficha Sumário">
        Conteúdo da Ficha Sumário
      </Tab>
      <Tab eventKey="avaliacao" title="Quadros de Avaliação">
        Conteúdo dos Quadros de Avaliação
      </Tab>
      <Tab eventKey="crachar" title="Crachár">
      
      </Tab>
      <Tab eventKey="relatorio" title="Relatório">
        Conteúdo do Relatório
      </Tab>
    </Tabs>
  );
};

export default TabsCustom;
