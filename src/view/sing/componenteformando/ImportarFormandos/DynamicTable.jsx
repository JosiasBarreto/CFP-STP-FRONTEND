import React, { useState, useMemo } from 'react';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { FiTrash2, FiPlus, FiEdit2, FiCopy } from 'react-icons/fi';
import { EditableCell } from './EditableCell';
import { PhotoCell } from './PhotoCell';

export const DynamicTable = ({ data, updateData, removeRow, addRow, onEditRow, onBulkFill }) => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;

    const columns = useMemo(() => [
        { id: 'actions', header: 'Ações', size: 80, cell: (row, index) => (
            <div className="d-flex gap-1">
                <Button variant="outline-primary" size="sm" onClick={() => onEditRow(index)} title="Editar Formulário" className="d-flex align-items-center justify-content-center border-0 p-1">
                    <FiEdit2 />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => removeRow(index)} title="Eliminar" className="d-flex align-items-center justify-content-center border-0 p-1">
                    <FiTrash2 />
                </Button>
            </div>
        ) },
        { id: 'status', header: 'Status', size: 80, cell: (row) => {
            const { isValid, isDuplicate } = row;
            if (isDuplicate) return <span className="badge bg-warning text-dark">Duplicado</span>;
            if (!isValid) return <span className="badge bg-danger">Erro</span>;
            return <span className="badge bg-success">Válido</span>;
        }},
        { id: 'foto', accessorKey: 'foto', header: 'Foto', size: 60, cell: (row, index, tableMeta) => <PhotoCell getValue={() => row.foto} row={{index, original: row}} column={{id: 'foto'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'nome', accessorKey: 'nome', header: 'Nome Completo', size: 200, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.nome} row={{index, original: row}} column={{id: 'nome'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'sexo', accessorKey: 'sexo', header: 'Sexo', size: 100, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.sexo} row={{index, original: row}} column={{id: 'sexo'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'datanascimento', accessorKey: 'datanascimento', header: 'Data de Nascimento', size: 150, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.datanascimento} row={{index, original: row}} column={{id: 'datanascimento'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'idade', accessorKey: 'idade', header: 'Idade', size: 80, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.idade} row={{index, original: row}} column={{id: 'idade'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'telefone', accessorKey: 'telefone', header: 'Telefone', size: 120, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.telefone} row={{index, original: row}} column={{id: 'telefone'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'telefone2', accessorKey: 'telefone2', header: 'Telefone Alt.', size: 120, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.telefone2} row={{index, original: row}} column={{id: 'telefone2'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'bi', accessorKey: 'bi', header: 'BI', size: 150, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.bi} row={{index, original: row}} column={{id: 'bi'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'nif', accessorKey: 'nif', header: 'NIF', size: 120, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.nif} row={{index, original: row}} column={{id: 'nif'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'email', accessorKey: 'email', header: 'Email', size: 180, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.email} row={{index, original: row}} column={{id: 'email'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'distrito', accessorKey: 'distrito', header: 'Distrito', size: 120, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.distrito} row={{index, original: row}} column={{id: 'distrito'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'morada', accessorKey: 'morada', header: 'Morada (Residência)', size: 180, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.morada} row={{index, original: row}} column={{id: 'morada'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'estado_civil', accessorKey: 'estado_civil', header: 'Estado Civil', size: 120, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.estado_civil} row={{index, original: row}} column={{id: 'estado_civil'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'habilitacao', accessorKey: 'habilitacao', header: 'Habilitações', size: 150, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.habilitacao} row={{index, original: row}} column={{id: 'habilitacao'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'nome_pai', accessorKey: 'nome_pai', header: 'Nome Pai', size: 150, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.nome_pai} row={{index, original: row}} column={{id: 'nome_pai'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'nome_mae', accessorKey: 'nome_mae', header: 'Nome Mãe', size: 150, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.nome_mae} row={{index, original: row}} column={{id: 'nome_mae'}} table={{options: {meta: tableMeta}}} /> },
        { id: 'observacao', accessorKey: 'observacao', header: 'Observação', size: 180, cell: (row, index, tableMeta) => <EditableCell getValue={() => row.observacao} row={{index, original: row}} column={{id: 'observacao'}} table={{options: {meta: tableMeta}}} /> }
    ], [removeRow, onEditRow]);

    const filteredData = useMemo(() => {
        if (!globalFilter) return data;
        const lowerFilter = globalFilter.toLowerCase();
        return data.filter(row => {
            return Object.values(row).some(val => 
                String(val).toLowerCase().includes(lowerFilter)
            );
        });
    }, [data, globalFilter]);

    const pageCount = Math.ceil(filteredData.length / pageSize) || 1;
    
    // reset page if filter changes
    useMemo(() => {
        if (pageIndex >= pageCount) {
            setPageIndex(Math.max(0, pageCount - 1));
        }
    }, [pageCount, pageIndex]);

    const currentData = useMemo(() => {
        const start = pageIndex * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, pageIndex, pageSize]);

    const tableMeta = { updateData };

    return (
        <div className="bg-white p-3 rounded shadow-sm border-0">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={addRow} className="d-flex align-items-center shadow-sm">
                        <FiPlus className="me-1" /> Adicionar Linha
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={onBulkFill} className="d-flex align-items-center shadow-sm">
                        <FiCopy className="me-1" /> Preenchimento em Lote
                    </Button>
                </div>
                <div style={{ width: '300px' }}>
                    <Form.Control type="text" placeholder="Pesquisar..." value={globalFilter} onChange={e => {
                        setGlobalFilter(e.target.value);
                        setPageIndex(0);
                    }} size="sm" />
                </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <Table hover bordered size="sm" className="align-middle" style={{ whiteSpace: 'nowrap' }}>
                    <thead className="table-light position-sticky top-0" style={{ zIndex: 1 }}>
                        <tr>
                            {columns.map(col => (
                                <th key={col.id} style={{ width: col.size }}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row, relativeIndex) => {
                            const originalIndex = data.indexOf(row);
                            return (
                                <tr key={row.id || originalIndex} className={row.isDuplicate ? 'table-warning' : !row.isValid ? 'table-danger' : ''}>
                                    {columns.map(col => (
                                        <td key={col.id}>
                                            {col.cell(row, originalIndex, tableMeta)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {currentData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4 text-muted">
                                    Nenhum dado para exibir.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            
            <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="text-muted small">
                    Página {pageIndex + 1} de {pageCount} {' '} | Total: {filteredData.length} registos
                </div>
                <Pagination size="sm" className="mb-0">
                    <Pagination.First onClick={() => setPageIndex(0)} disabled={pageIndex === 0} />
                    <Pagination.Prev onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0} />
                    <Pagination.Next onClick={() => setPageIndex(p => Math.min(pageCount - 1, p + 1))} disabled={pageIndex >= pageCount - 1} />
                    <Pagination.Last onClick={() => setPageIndex(pageCount - 1)} disabled={pageIndex >= pageCount - 1} />
                </Pagination>
            </div>
        </div>
    );
};
