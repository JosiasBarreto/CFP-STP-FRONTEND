import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
export const BulkFillModal = ({ show, onApply, onClose }) => {
    const [column, setColumn] = useState('');
    const [value, setValue] = useState('');
    const handleApply = () => {
        if (column) {
            onApply(column, value);
            onClose();
            setColumn('');
            setValue('');
        }
    };
    return (<Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Preenchimento em Lote</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="text-muted small mb-4">
          Esta ação preencherá todas as linhas da tabela com o mesmo valor para a coluna selecionada.
        </p>
        <Form.Group className="mb-3">
          <Form.Label className="small fw-semibold text-muted">Selecione a Coluna</Form.Label>
          <Form.Select className="shadow-none border-secondary-subtle" value={column} onChange={(e) => setColumn(e.target.value)}>
            <option value="">Selecione...</option>
            <option value="distrito">Distrito</option>
            <option value="nacionalidade">Nacionalidade</option>
            <option value="naturalidade">Naturalidade</option>
            <option value="estado_civil">Estado Civil</option>
            <option value="habilitacao">Habilitações Literárias</option>
            <option value="sexo">Sexo</option>
            <option value="observacao">Observação</option>
          </Form.Select>
        </Form.Group>
        
        {column === 'distrito' ? (<Form.Group>
            <Form.Label className="small fw-semibold text-muted">Valor para todas as linhas</Form.Label>
            <Form.Select className="shadow-none border-secondary-subtle" value={value} onChange={e => setValue(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Água Grande">Água Grande</option>
              <option value="Mé-Zóchi">Mé-Zóchi</option>
              <option value="Cantagalo">Cantagalo</option>
              <option value="Caué">Caué</option>
              <option value="Lobata">Lobata</option>
              <option value="Lembá">Lembá</option>
              <option value="Pagué">Pagué</option>
            </Form.Select>
          </Form.Group>) : column === 'nacionalidade' ? (<Form.Group>
            <Form.Label className="small fw-semibold text-muted">Valor para todas as linhas</Form.Label>
            <Form.Select className="shadow-none border-secondary-subtle" value={value} onChange={e => setValue(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Santomense">Santomense</option>
              <option value="Angolano">Angolano</option>
              <option value="Caboverdiano">Caboverdiano</option>
              <option value="Moçambicano">Moçambicano</option>
              <option value="Português">Português</option>
              <option value="Outros">Outros</option>
            </Form.Select>
          </Form.Group>) : column === 'sexo' ? (<Form.Group>
            <Form.Label className="small fw-semibold text-muted">Valor para todas as linhas</Form.Label>
            <Form.Select className="shadow-none border-secondary-subtle" value={value} onChange={e => setValue(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </Form.Select>
          </Form.Group>) : (<Form.Group>
            <Form.Label className="small fw-semibold text-muted">Valor para todas as linhas</Form.Label>
            <Form.Control className="shadow-none border-secondary-subtle" type="text" value={value} onChange={e => setValue(e.target.value)} disabled={!column}/>
          </Form.Group>)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleApply} disabled={!column || !value} className="shadow-sm">Aplicar a Todos</Button>
      </Modal.Footer>
    </Modal>);
};
