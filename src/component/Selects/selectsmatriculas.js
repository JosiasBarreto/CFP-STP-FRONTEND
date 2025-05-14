import { Button, Form } from "react-bootstrap";

const Confirmarmatricula = ({
  items,
  idCurso,
  status_matricula,
  situacoes,
  setSituacoes,
  id_curso_incricao,
}) => {
  const handleChange = (idInscricao, idCurso, status_matricula, id_curso_incricao) => {
    setSituacoes((prevSituacoes) => {
      const updatedSituacoes = prevSituacoes.filter(
        (s) => s.idInscricao !== idInscricao
      );
      return [
        ...updatedSituacoes,
        { idInscricao, idCurso, status_matricula, id_curso_incricao },
      ];
    });
  };

  return (
    <>
    <Button
        variant="primary"
        onClick={() => {
          handleChange(
            items.incricao_id,
            idCurso,
            status_matricula,
            id_curso_incricao
          );
        }}
        >
        Confirmar Matricula
      </Button>
      
    </>
  );
};

export default Confirmarmatricula;
