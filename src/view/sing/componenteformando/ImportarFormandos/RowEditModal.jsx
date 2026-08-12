import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, FloatingLabel } from 'react-bootstrap';
export const RowEditModal = ({ show, rowData, onSave, onNext, onPrev, hasNext, hasPrev, onClose }) => {
    const [formData, setFormData] = useState(null);
    const estadoCivilOptions = {
      Masculino: [
          { value: "Solteiro", label: "Solteiro" },
          { value: "Casado", label: "Casado" },
          { value: "Divorciado", label: "Divorciado" },
          { value: "Viúvo", label: "Viúvo" },
      ],
      Feminino: [
          { value: "Solteira", label: "Solteira" },
          { value: "Casada", label: "Casada" },
          { value: "Divorciada", label: "Divorciada" },
          { value: "Viúva", label: "Viúva" },
      ],
  };
    useEffect(() => {
        if (rowData) {
            setFormData({ ...rowData });
        }
    }, [rowData]);
    const handleChange = (e) => {
      const { name, value } = e.target;
  
      setFormData((prev) => {
          const novo = {
              ...prev,
              [name]: value,
          };
  
          // Sempre que mudar o sexo, limpa o estado civil
          if (name === "sexo") {
              novo.estado_civil = "";
          }
  
          return novo;
      });
  };
    const handleSave = () => {
        if (formData) {
            onSave(formData);
            onClose();
        }
    };
    const handleSaveAndNext = () => {
        if (formData) {
            onSave(formData);
            if (onNext)
                onNext();
        }
    };
    if (!formData)
        return null;
    return (<Modal show={show} onHide={onClose} size="xl" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Editar Formando</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light p-4">
        <Row className="g-3">
          <Col md={6}>
            <FloatingLabel label="Nome Completo">
              <Form.Control name="nome" value={formData.nome || ''} onChange={handleChange} isInvalid={!!formData.errors?.nome}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Sexo">
            <Form.Select
    name="sexo"
    value={formData.sexo || ""}
    onChange={handleChange}
>
    <option value="">Selecione...</option>
    <option value="Masculino">Masculino</option>
    <option value="Feminino">Feminino</option>
</Form.Select>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Data Nascimento">
              <Form.Control type="date" name="datanascimento" value={formData.datanascimento || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="BI">
              <Form.Control name="bi" value={formData.bi || ''} onChange={handleChange} isInvalid={!!formData.errors?.bi}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="NIF">
              <Form.Control name="nif" value={formData.nif || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Telefone Principal">
              <Form.Control name="telefone" value={formData.telefone || ''} onChange={handleChange} isInvalid={!!formData.errors?.telefone}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Telefone Alt.">
              <Form.Control name="telefone2" value={formData.telefone2 || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={4}>
            <FloatingLabel label="Email">
              <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} isInvalid={!!formData.errors?.email}/>
            </FloatingLabel>
          </Col>
          <Col md={4}>
            <FloatingLabel label="Estado Civil">
            <Form.Select
    name="estado_civil"
    value={formData.estado_civil || ""}
    onChange={handleChange}
    disabled={!formData.sexo}
>
    <option value="">Selecione...</option>

    {(estadoCivilOptions[formData.sexo] || []).map((item) => (
        <option key={item.value} value={item.value}>
            {item.label}
        </option>
    ))}
</Form.Select>
            </FloatingLabel>
          </Col>
          <Col md={4}>
            <FloatingLabel label="Habilitações Literárias">
              <Form.Control name="habilitacao" value={formData.habilitacao || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Nacionalidade">
              <Form.Select name="nacionalidade" value={formData.nacionalidade || ''} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="Santomense">Santomense</option>
                <option value="Angolano">Angolano</option>
                <option value="Caboverdiano">Caboverdiano</option>
                <option value="Moçambicano">Moçambicano</option>
                <option value="Português">Português</option>
                <option value="Outros">Outros</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Naturalidade">
              <Form.Control name="naturalidade" value={formData.naturalidade || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Distrito">
              <Form.Select name="distrito" value={formData.distrito || ''} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="Água Grande">Água Grande</option>
                <option value="Mé-Zóchi">Mé-Zóchi</option>
                <option value="Cantagalo">Cantagalo</option>
                <option value="Caué">Caué</option>
                <option value="Lobata">Lobata</option>
                <option value="Lembá">Lembá</option>
                <option value="Pagué">Pagué</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col md={3}>
            <FloatingLabel label="Morada (Residência)">
              <Form.Control name="morada" value={formData.morada || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel label="Nome do Pai">
              <Form.Control name="nome_pai" value={formData.nome_pai || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={6}>
            <FloatingLabel label="Nome da Mãe">
              <Form.Control name="nome_mae" value={formData.nome_mae || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
          <Col md={12}>
            <FloatingLabel label="Observação">
              <Form.Control as="textarea" style={{ height: '80px' }} name="observacao" value={formData.observacao || ''} onChange={handleChange}/>
            </FloatingLabel>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between border-top p-3">
        <div>
          <Button variant="outline-secondary" className="me-2" onClick={onPrev} disabled={!hasPrev}>&larr; Anterior</Button>
          <Button variant="outline-secondary" onClick={onNext} disabled={!hasNext}>Próximo &rarr;</Button>
        </div>
        <div>
          <Button variant="secondary" className="me-2" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" className="me-2 shadow-sm" onClick={handleSave}>Guardar e Fechar</Button>
          {hasNext && (<Button variant="success" className="shadow-sm fw-bold" onClick={handleSaveAndNext}>Guardar e Próximo &rarr;</Button>)}
        </div>
      </Modal.Footer>
    </Modal>);
};
