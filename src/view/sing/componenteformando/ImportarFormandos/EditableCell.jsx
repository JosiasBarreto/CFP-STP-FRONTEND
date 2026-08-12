import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
export const EditableCell = ({ getValue, row, column, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const onBlur = () => {
        setIsEditing(false);
        if (value !== initialValue) {
            table.options.meta?.updateData(row.index, column.id, value);
        }
    };
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    const error = row.original.errors?.[column.id];
    if (isEditing) {
        return (<Form.Control autoFocus size="sm" value={value} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} isInvalid={!!error} className="w-100 min-w-[100px]"/>);
    }
    return (<div onClick={() => setIsEditing(true)} className={`p-1 cursor-pointer min-h-[24px] ${error ? 'text-danger fw-bold border border-danger rounded' : ''}`} title={error || 'Clique para editar'}>
      {value || <span className="text-muted fst-italic">Vazio</span>}
    </div>);
};
