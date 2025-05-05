import React from "react";
import { Col, FloatingLabel, Form } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // React Query v5
import PropTypes from "prop-types";
import { fetchProgramas } from "../../view/sing/function";

// Simulação da função de fetch (substitua pela sua real)


function SelectField({
  controlId = "programa",
  label = "Programa",
  name = "nome_programa",
  value,
  onChange,
  isInvalid,
  feedback,
  token, // necessário para autenticação
}) {
  ;

  const { data: programas, isLoading } = useQuery({
    queryKey: ["programas"],
    queryFn: () => fetchProgramas(token),
  });

  return (
    <Col >
      <FloatingLabel
        controlId={controlId}
        className="mb-3 w-auto"
        label={label}
      >
        <Form.Select
          className="input_left_color p-2"
          name={name}
          id={controlId}
          value={value}
          onChange={onChange}
          isInvalid={isInvalid}
        >
          <option value="">Selecione o Programa</option>
          {!isLoading &&
            programas?.map((item) => (
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

SelectField.propTypes = {
  controlId: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isInvalid: PropTypes.bool,
  feedback: PropTypes.string,
  token: PropTypes.string.isRequired,
};

export default SelectField;
