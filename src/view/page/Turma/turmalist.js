import React from "react";
import { Row } from "react-bootstrap";
import TurmaCard from "../../sing/Cardlist/cardturma";


const TurmasLists = ({ turmas }) => {
  return (
    <Row>
      {turmas?.map((turma) => (
        <TurmaCard key={turma.curso_id} turma={turma} />
      ))}
    </Row>
  );
};

export default TurmasLists;
