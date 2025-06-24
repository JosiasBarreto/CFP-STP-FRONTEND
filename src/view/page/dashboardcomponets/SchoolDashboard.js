import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import CalendarWidget from "./Calendar";
import Alerts from "./Alerts";
import "./dashboard.css";
import { fetchCursos, fetchCursosQuantidade } from "../../sing/function";
import { useQuery } from "@tanstack/react-query";
import { Qcurso } from "../../../api/urls/nameQuery";
import SummaryCards from "./SummaryCards";

export const SchoolDashboards = () => {
  const token = localStorage.getItem("token");
    const [searchParams, setSearchParams] = useState({
      nome: "",
      ano_execucao: new Date().getFullYear(),
      programa: "",
      local_realizacao: "",
      acao: "",
    });
  const { data, isLoading, isFetching } = useQuery({
      queryKey: "Cursodashoad",
      queryFn: () => fetchCursosQuantidade(token, searchParams),
    });
   
  if (isLoading) return <div>Carregando cursos...</div>;
  return (
    <Container fluid className="school-dashboard">
      <Row className="mb-4">
        <SummaryCards cursos={data} />
      </Row>
      <Row>
        
        <Col md={12}>
          <CalendarWidget />
        </Col>
      </Row>
    </Container>
  );
};


