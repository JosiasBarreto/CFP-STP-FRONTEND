import React from "react";
import { Tabs, Tab, Row } from "react-bootstrap";
import Registerformandos from "./registerformandos";
import ImportarFormandos from "./componenteformando/ImportarFormandos";

export const IndexFormando = () => {
  return (
    <Row className="justify-content-center bg-light p-2 rounded shadow-sm">
      <Tabs
        defaultActiveKey="inscricao"
        id="formando-tabs"
        className="mb-3"
        justify
      >
        <Tab eventKey="inscricao" title="INSCRIÇÃO DOS FORMANDOS">
          <Registerformandos />
        </Tab>
        <Tab eventKey="importar" title="IMPORTAR FORMANDOS">
          <ImportarFormandos />
        </Tab>
        <Tab eventKey="upload" title="CARREGAR FORMANDOS">
         
        </Tab>
      </Tabs>
    </Row>
  );
};
