import React, { useState } from "react";
import { Col, FloatingLabel, Form } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { fetchCursosAno } from "../../view/sing/function";

function SelectFieldCurso({
  controlId = "curso",
  label = "Curso",
  name = "nome_curso",
  value,
  onChange,
  isInvalid,
  feedback,
  token,
  anoExecucao, // ano de execução como prop
  programaId,  // programa selecionado como prop
  acao
}) {
const [searchParams, setSearchParams] = useState({
    nome_formando: "",
    ano_execucao: anoExecucao,
    nome_programa: programaId,
    nome_curso: value,
    acao: acao,
  });

  const { data: cursos, isLoading } = useQuery({
    queryKey: ["cursos", anoExecucao],
    queryFn: () => fetchCursosAno(token, searchParams),
    enabled: anoExecucao?.toString().length >= 4,
  });

  const cursosFiltrados = React.useMemo(() => {
    if (!cursos || !programaId) return cursos || [];

    return cursos.filter((curso) => curso.programa_nome === (programaId));
  }, [cursos, programaId]);

  return (
    <Col>
      <FloatingLabel controlId={controlId} className="mb-3 w-auto" label={label}>
        <Form.Select
          className="input_left_color p-2"
          name={name}
          id={controlId}
          value={value}
          onChange={onChange}
          isInvalid={isInvalid}
        >
          <option value="">Selecione o Curso</option>
          {!isLoading &&
            cursosFiltrados.map((item) => (
              <option key={item.id} value={item.nome}>
                {item.nome}
              </option>
            ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {feedback}
        </Form.Control.Feedback>
      </FloatingLabel>
    </Col>
  );
}

SelectFieldCurso.propTypes = {
  controlId: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isInvalid: PropTypes.bool,
  feedback: PropTypes.string,
  token: PropTypes.string.isRequired,
  anoExecucao: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  programaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SelectFieldCurso;
