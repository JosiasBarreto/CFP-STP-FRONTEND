import React, { useEffect, useState } from "react";
import { Row, Tab, Tabs, Spinner } from "react-bootstrap";
import ListMatriculas from "../../view/sing/table/listmatriculas";
import { classificarFormandos } from "./fuctions";
import {
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaUserSlash,
  FaUsers,
} from "react-icons/fa";
import "./index.css";
import { text } from "@fortawesome/fontawesome-svg-core";
import TabsCustom from "./tablesdossier";

const DsitribesMatriculas = ({
  data,
  searchParams,
  isLoading,
  isFetching,
  situacoes,
  setSituacao,
  ToggleStatusFilter,
  filtros,
  setFiltros,
}) => {
  const [dataClassificada, setDataClassificada] = useState({
    matriculados: [],
    desistentes: [],
    nao_matriculados: [],
    pendentes: [],
  });
  const [turma, setTurma] = useState(1);
  const [variante, setVariante] = useState("");

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const classificados = classificarFormandos(data);
      setDataClassificada(classificados);
    }
    
  }, [data]);

  const tabsConfig = [
    
    {
      key: "matriculados",
      title: (
        <>
          <FaUserCheck className="me-2" />
          Matriculados
        </>
      ),
      data: dataClassificada.matriculados,
      textButton: "Cancelar Matricula",
      variante: "danger",
  
    },
    {
      key: "pendentes",
      title: (
        <>
          <FaUserClock className="me-2" />
          Suplentes
        </>
      ),
      data: dataClassificada.pendentes,
      textButton: "Matricular Suplente",
      variante: "primary",
    },
    {
      key: "nao_matriculados",
      title: (
        <>
          <FaUserSlash className="me-2" />
          Não Matriculados
        </>
      ),
      data: dataClassificada.nao_matriculados,
      textButton: "Confirmar Matricula",
      variante: "success",
     
    },
    {
      key: "desistentes",
      title: (
        <>
          <FaUserTimes className="me-2" />
          Desistentes
        </>
      ),
      data: dataClassificada.desistentes,
      textButton: "Reintegrar Matricula",
      variante: "success",
    },
    {
      key: "todos",
      title: (
        <>
          <FaUsers className="me-2" />
          Todos
        </>
      ),
      data: data,
      textButton: "Todos",
    },
  ];

  return (
    
    <Tabs defaultActiveKey="dossier" id="tabs-dossier" className="mb-1 bg-white rounded" fill >
      <Tab eventKey="dossier" title={<>
          <FaUsers className="me-2" />
          Dossier
        </>}>
        <TabsCustom searchParams={searchParams}/>
      </Tab>
    {tabsConfig.map((tab) => (
      <Tab eventKey={tab.key} title={tab.title} key={tab.key} className="mb-1 bg-white text-success " >
        {isFetching ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <ListMatriculas
            data={tab.data}
            isLoading={isLoading}
            searchParams={searchParams}
            situacoes={situacoes}
            setSituacao={setSituacao}
            filtros={filtros}
            ToggleStatusFilter={ToggleStatusFilter}
            setFiltros={setFiltros}
            textButton={tab.textButton}
            variante={tab.variante}
          />
        )}
      </Tab>
    ))}
    
      
  </Tabs>
  
     
  );
};

export default DsitribesMatriculas;
