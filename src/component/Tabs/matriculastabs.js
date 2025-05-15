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

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const classificados = classificarFormandos(data);
      setDataClassificada(classificados);
    }
  }, [data]);

  const tabsConfig = [
    {
      key: "dossier",
      title: (
        <>
          <FaUsers className="me-2" />
          Dossier
        </>
      ),
      data: null,
    },
    {
      key: "matriculados",
      title: (
        <>
          <FaUserCheck className="me-2" />
          Matriculados
        </>
      ),
      data: dataClassificada.matriculados,
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
    },
  ];

  return (
    
    <Tabs defaultActiveKey="dossier" id="tabs-dossier" className="mb-1 bg-white rounded" fill >
    {tabsConfig.map((tab) => (
      <Tab eventKey={tab.key} title={tab.title} key={tab.key} className="mb-1 bg-white  " >
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
          />
        )}
      </Tab>
    ))}
  </Tabs>
  
     
  );
};

export default DsitribesMatriculas;
