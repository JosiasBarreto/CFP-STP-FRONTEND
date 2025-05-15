import { Button, Form } from "react-bootstrap";

const Confirmarmatricula = ({
  items,
  idCurso,
  status_matricula,
  situacoes,
  setSituacoes,
  id_curso_incricao,
  variante,
  textButton
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
    className="rounded-pill px-3 mt-2 shadow-sm"
        variant={`outline-${variante}`}
        size="sm"
        onClick={() => {
          handleChange(
            items.incricao_id,
            idCurso,
            status_matricula,
            id_curso_incricao
          );
        }}
        >
        {textButton}  
      </Button>
      
    </>
  );
};

export default Confirmarmatricula;
