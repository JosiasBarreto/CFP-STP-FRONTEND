import { Form } from "react-bootstrap";

const SituacaoCandidatura = ({ items, idCurso, status, situacoes, setSituacoes, id_curso_incricao, }) => {
  const handleChange = (idInscricao, idCurso, status, id_curso_incricao) => {
    setSituacoes((prevSituacoes) => {
      const updatedSituacoes = prevSituacoes.filter(
        (s) => s.idInscricao !== idInscricao
      );
      return [...updatedSituacoes, { idInscricao, idCurso, status, id_curso_incricao }];
    });
  };

  return (
    <Form.Select
      value={
        situacoes.find((s) => s.idInscricao === items.incricao_id)?.status ||
        status ||
        ""
      }
      onChange={(e) =>
        handleChange(items.incricao_id, idCurso, e.target.value, id_curso_incricao)
      }
    >
      <option value="">Escolha</option>
      <option value="inscrito">Inscrito</option>
      <option value="selecionado">Selecionado</option>
      <option value="suplente">Suplente</option>
      <option value="não selecionado">Não Selecionado</option>
      <option value="desistiu">Desistiu</option>
    </Form.Select>
  );
};

export default SituacaoCandidatura;
