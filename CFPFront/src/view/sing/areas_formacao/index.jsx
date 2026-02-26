import React, { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import RegisterAreasFormacao from "./register_areas_formacao";
import RegisterDominiosFormacao from "./RegisterDominiosFormacao";

function AreasTabs() {
  const [key, setKey] = useState("areas");

  return (
    <div className="container-fluid mt-3 bg-light p-4 rounded shadow-sm">
      <Tabs
        id="areas-dominio-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
        fill
        justify
      >
        <Tab eventKey="areas" title="Áreas de Formação Gerais">
          <RegisterAreasFormacao />
        </Tab>

        <Tab eventKey="dominios" title="Domínios por Área de Formação">
          <RegisterDominiosFormacao />
        </Tab>
      </Tabs>
    </div>
  );
}

export default AreasTabs;
