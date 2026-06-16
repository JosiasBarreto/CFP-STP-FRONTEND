import React from "react";
import { Row, Tab, Tabs } from "react-bootstrap";
import RegisterComponente from "./componentes/RegisterComponente";
import RegisterCursoComponente from "./cursoComponente/RegisterCursoComponente";
import RegisterModulo from "./modulo/RegisterModulo";
import RegisterSubModulo from "./submodulo/RegisterSubModulo";
import RegisterCursoModulo from "./curso_modulo/RegisterCursoModulo";

const HomeCursoComponente = () => {
  return (
    <div className="bg-white rounded shadow p-2">
      <Tabs
        defaultActiveKey="profile"
        id="fill-tab-example"
        className="mb-3 bg-white rounded shadow"
        fill
      >
        
          <Tab eventKey="home" title="Componente do Curso">
            <RegisterCursoComponente />
          </Tab>
          <Tab eventKey="profile" title="Componentes">
            <RegisterComponente />
          </Tab>
          <Tab eventKey="longer-tab" title="Módulos">
            <RegisterModulo />
          </Tab>
          <Tab eventKey="longer" title="Submódulos">
            <RegisterSubModulo />
          </Tab>
          <Tab eventKey="contact" title="Curso Módulo">
            <RegisterCursoModulo />
          </Tab>
        
      </Tabs>
    </div>
  );
};

export default HomeCursoComponente;
