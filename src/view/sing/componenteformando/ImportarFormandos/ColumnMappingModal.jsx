import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
export const ColumnMappingModal = ({ show, excelColumns, onConfirm, onCancel }) => {
    const expectedFields = [
        { key: 'nome', label: 'Nome' },
        { key: 'sexo', label: 'Sexo' },
        { key: 'telefone', label: 'Telefone (Cont.)' },
        { key: 'telefone2', label: 'Telefone Alternativo' },
        { key: 'bi', label: 'Nº BI' },
        { key: 'nif', label: 'NIF' },
        { key: 'email', label: 'Email' },
        { key: 'distrito', label: 'Distrito' },
        { key: 'morada', label: 'Morada (Residência)' },
        { key: 'nacionalidade', label: 'Nacionalidade' },
        { key: 'naturalidade', label: 'Naturalidade' },
        { key: 'datanascimento', label: 'Data de Nascimento' },
        { key: 'estado_civil', label: 'Estado Civil' },
        { key: 'habilitacao', label: 'Habilitações Literárias' },
        { key: 'nome_pai', label: 'Nome do Pai' },
        { key: 'nome_mae', label: 'Nome da Mãe' },
        { key: 'idade', label: 'Idade' },
        { key: 'observacao', label: 'Observação' }
    ];
    const [mapping, setMapping] = useState({});
    useEffect(() => {
        // Auto-map based on common names
        const initialMapping = {};
        const lowerExcel = excelColumns.map(c => c.toLowerCase().trim().replace(/ /g, ''));
        expectedFields.forEach(field => {
            const matchIndex = lowerExcel.findIndex(lc => lc.includes(field.key) ||
                (field.key === 'telefone' && lc.includes('cont')) ||
                (field.key === 'morada' && lc.includes('resid')) ||
                (field.key === 'habilitacao' && lc.includes('hab')) ||
                (field.key === 'nome' && lc === 'nome') // strict match for name to avoid matching nome_pai
            );
            if (matchIndex !== -1) {
                initialMapping[field.key] = excelColumns[matchIndex];
            }
            else {
                initialMapping[field.key] = '';
            }
        });
        setMapping(initialMapping);
    }, [excelColumns]);
    const handleChange = (fieldKey, excelColumn) => {
        setMapping(prev => ({ ...prev, [fieldKey]: excelColumn }));
    };
    return (<Modal show={show} onHide={onCancel} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Mapeamento de Colunas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Associe as colunas do seu ficheiro Excel aos campos esperados pelo sistema.
        </p>
        
        <Row className="fw-bold mb-2 pb-2 border-bottom">
          <Col md={5}>Campo do Sistema</Col>
          <Col md={7}>Coluna do Excel</Col>
        </Row>
        
        <div style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
          {expectedFields.map(field => (<Row key={field.key} className="mb-3 align-items-center">
              <Col md={5}>
                <span className={field.key === 'nome' || field.key === 'sexo' || field.key === 'telefone' ? 'fw-bold' : ''}>
                  {field.label}
                  {(field.key === 'nome' || field.key === 'sexo' || field.key === 'telefone') && <span className="text-danger">*</span>}
                </span>
              </Col>
              <Col md={7}>
                <Form.Select value={mapping[field.key] || ''} onChange={(e) => handleChange(field.key, e.target.value)} size="sm">
                  <option value="">-- Ignorar este campo --</option>
                  {excelColumns.map(col => (<option key={col} value={col}>{col}</option>))}
                </Form.Select>
              </Col>
            </Row>))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={() => onConfirm(mapping)}>
          Confirmar e Importar
        </Button>
      </Modal.Footer>
    </Modal>);
};
