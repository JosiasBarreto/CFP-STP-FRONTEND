import React from "react";
import { Tabs, Tab, Row } from "react-bootstrap";
import Registerformandos from "./registerformandos";
import ImportarFormandos from "./componenteformando/ImportarFormandos";
import ModuloAdminApp from "../packages/modulo-admin";
import { EstatisticasInscricoes } from "../packages/modulo-admin/components";
import RegisterStatusInscricao from "./RegisterStatusInscricao";

export const IndexFormando = () => {
  return (
    <Row className="justify-content-center bg-light p-2 rounded shadow-sm">
      <Tabs
        defaultActiveKey="inscricao"
        id="formando-tabs"
        className="mb-3"
        justify
      >
        <Tab eventKey="inscricao" title="📝 Inscrever Formandos">
              <div className="">
                <Registerformandos />
              </div>
            </Tab>

            <Tab eventKey="importar" title="📥 Importar Formandos">
              <div className="">
                <ImportarFormandos />
              </div>
            </Tab>

            <Tab
              eventKey="gestao"
              title="⚙️ Gestão de Inscrições Online"
            >
              <div className="">
                <ModuloAdminApp />
              </div>
            </Tab>

            <Tab
              eventKey="estatisticas"
              title="📊 Estatísticas de Inscrições"
            >
             <EstatisticasInscricoes />
            </Tab>
            <Tab eventKey="configurar" title="⚙️ Configurar Inscrições Online">
              <div className="">
                <RegisterStatusInscricao />
              </div>
            </Tab>
      </Tabs>
    </Row>
  );
};
