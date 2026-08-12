import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FiUpload, FiDownload } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { getExcelColumns, mapAndValidateExcelData } from './ExcelParser.js';
import { DynamicTable } from './DynamicTable.jsx';
import { SummaryPanel } from './SummaryPanel.jsx';
import { ProgressDialog } from './ProgressDialog.jsx';
import { ColumnMappingModal } from './ColumnMappingModal.jsx';
import { RowEditModal } from './RowEditModal.jsx';
import { BulkFillModal } from './BulkFillModal.jsx';
import { useValidation } from './hooks/useValidation.js';
import { useBatchUpload } from './hooks/useBatchUpload.js';
import { fetchCursosAno, fetchProgramas } from '../../function.js';
// NOTA: Descomente os imports abaixo e aponte para as suas funções de fetch reais da API
// import { fetchProgramas, fetchCursosAno } from "../../api/routes/formandos/function";


export default function ImportarFormandos() {
    const [rows, setRows] = useState([]);
    const [config, setConfig] = useState({
        programa_id: '',
        curso_id: '',
        ano_execucao: new Date().getFullYear().toString(),
        situacao: 'Inscrito',
        data_inscricao: new Date().toISOString().split('T')[0],
    });
    const DRAFT_KEY = 'importacao_formandos_draft';
    // Load draft from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
            try {
                const { rows: savedRows, config: savedConfig } = JSON.parse(saved);
                if (savedRows?.length)
                    setRows(savedRows);
                if (savedConfig)
                    setConfig(savedConfig);
            }
            catch (e) { }
        }
    }, []);
    // Save draft on change
    React.useEffect(() => {
        if (rows.length > 0) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify({ rows, config }));
        }
        else {
            localStorage.removeItem(DRAFT_KEY);
        }
    }, [rows, config]);
    // --- React Query (Idêntico à tua arquitetura) ---
    const token = localStorage.getItem("token");
    const { data: programas, isLoading: isProgLoading } = useQuery({
        queryKey: ['programas_importacao'],
        queryFn: () => fetchProgramas(token),
    });
    const { data: cursos = [], isLoading: isCursoLoading } = useQuery({
        queryKey: ['cursos_importacao', config.ano_execucao],
        queryFn: () =>
            fetchCursosAno(token, {
                ano_execucao: config.ano_execucao,
            }),
        enabled: !!config.ano_execucao,
        keepPreviousData: true,
    });
    const cursosFiltrados = useMemo(() => {
        if (!config.programa_id) {
            return cursos;
        }
    
        return cursos.filter(
            curso => String(curso.programa_id) === String(config.programa_id)
        );
    }, [cursos, config.programa_id]);

    // ------------------------------------------------
    // Mapping modal states
    const [showMappingModal, setShowMappingModal] = useState(false);
    const [excelColumns, setExcelColumns] = useState([]);
    const [rawExcelData, setRawExcelData] = useState([]);
    // Edit and Bulk states
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [showBulkFillModal, setShowBulkFillModal] = useState(false);
    const fileInputRef = useRef(null);
    const { revalidateRow, findDuplicates } = useValidation();
    const { isUploading, progress, current, isFinished, results, startUpload, cancelUpload, resetUpload } = useBatchUpload();
    const handleConfigChange = (e) => {
        const { name, value } = e.target;
    
        setConfig((old) => {
            const novo = {
                ...old,
                [name]: value,
            };
    
            if (name === "programa_id") {
                novo.curso_id = "";
            }
    
            if (name === "ano_execucao") {
                novo.curso_id = "";
                novo.programa_id = "";
            }
    
            return novo;
        });
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        try {
            Swal.fire({
                title: 'Lendo ficheiro...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            const { columns, data } = await getExcelColumns(file);
            Swal.close();
            if (columns.length === 0 || data.length === 0) {
                Swal.fire('Atenção', 'O ficheiro Excel está vazio ou inválido.', 'warning');
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
                return;
            }
            setExcelColumns(columns);
            setRawExcelData(data);
            setShowMappingModal(true);
        }
        catch (error) {
            Swal.fire('Erro', 'Ocorreu um erro ao ler o ficheiro Excel', 'error');
        }
    };
     
    const handleMappingConfirm = async (mapping) => {
        setShowMappingModal(false);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
        try {
            Swal.fire({
                title: 'A validar dados...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            let parsedRows = await mapAndValidateExcelData(rawExcelData, mapping);
            parsedRows = findDuplicates(parsedRows);
            setRows(parsedRows);
            Swal.close();
        }
        catch (error) {
            Swal.fire('Erro', 'Erro ao mapear e validar os dados.', 'error');
        }
    };
    const handleMappingCancel = () => {
        setShowMappingModal(false);
        if (fileInputRef.current)
            fileInputRef.current.value = '';
        setRawExcelData([]);
        setExcelColumns([]);
    };
    const updateData = useCallback(async (rowIndex, columnId, value) => {
        setRows(old => {
            const newRows = [...old];
            const updatedRow = { ...newRows[rowIndex], [columnId]: value };
            newRows[rowIndex] = updatedRow;
            return newRows;
        });
        // We do validation asynchronously to not block typing immediately, 
        // but React setState is async anyway. For simplicity:
        setRows(old => {
            const newRows = [...old];
            revalidateRow(newRows[rowIndex]).then(validated => {
                setRows(currentRows => {
                    const latestRows = [...currentRows];
                    latestRows[rowIndex] = validated;
                    return findDuplicates(latestRows);
                });
            });
            return newRows;
        });
    }, [revalidateRow, findDuplicates]);
    const removeRow = useCallback((rowIndex) => {
        setRows(old => {
            const newRows = [...old];
            newRows.splice(rowIndex, 1);
            return findDuplicates(newRows);
        });
    }, [findDuplicates]);
    const addRow = useCallback(() => {
        const newRow = {
            id: crypto.randomUUID(),
            nome: '', sexo: '', telefone: '', bi: '', email: '', distrito: '', naturalidade: '', estado_civil: '',
            isValid: false, errors: { _general: 'Preencha os dados' }
        };
        setRows(old => {
            const newRows = [newRow, ...old];
            // Immediately open edit modal for the newly added row (index 0)
            setTimeout(() => setEditRowIndex(0), 10);
            return newRows;
        });
    }, []);
    const handleSaveRow = async (updatedRow) => {
        if (editRowIndex === null)
            return;
        const validatedRow = await revalidateRow(updatedRow);
        setRows(old => {
            const newRows = [...old];
            newRows[editRowIndex] = validatedRow;
            return findDuplicates(newRows);
        });
    };
    const handleBulkFill = async (columnId, value) => {
        setRows(old => {
            const newRows = old.map(r => ({ ...r, [columnId]: value }));
            // Re-validate all in background is expensive, so just do a basic map first
            return newRows;
        });
        // Defer validation
        setTimeout(async () => {
            setRows(old => {
                const validated = old.map(r => {
                    // We can't await map easily inside setState, so just return as is and we'll validate in a side effect or just trust the next action.
                    // To be safe we will trigger a full revalidation.
                    return r;
                });
                return validated;
            });
            // Full revalidation
            const currentRows = [...rows]; // Might be stale but we will re-read from state below
            const newRows = await Promise.all(rows.map(r => revalidateRow({ ...r, [columnId]: value })));
            setRows(findDuplicates(newRows));
        }, 0);
    };
    const handleLimparRascunho = () => {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Todos os dados importados serão perdidos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sim, limpar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setRows([]);
                localStorage.removeItem(DRAFT_KEY);
            }
        });
    };
    const handleRegistrarTodos = () => {
        if (!config.programa_id || !config.curso_id) {
            Swal.fire('Atenção', 'Selecione o Programa e o Curso antes de importar', 'warning');
            return;
        }
        if (rows.length === 0) {
            Swal.fire('Atenção', 'Não há dados para importar', 'warning');
            return;
        }
        startUpload(rows, config);
    };
    const handleDownloadErrors = () => {
        const errorRows = rows.filter(r => !r.isValid || r.isDuplicate);
        if (errorRows.length === 0)
            return;
        const errorData = errorRows.map(r => ({
            Linha_ID: r.id,
            Nome: r.nome,
            Erro: r.isDuplicate ? 'Registro Duplicado' : Object.values(r.errors).join(', '),
            BI: r.bi
        }));
        const worksheet = XLSX.utils.json_to_sheet(errorData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Erros');
        XLSX.writeFile(workbook, 'Relatorio_Erros_Importacao.xlsx');
    };
    return (
        
            <Row className="justify-content-center w-100 shadow-sm rounded-3 p-3">
              <Col md={12}>
                {/* Cabeçalho */}
                <Card className="shadow-sm border-0 rounded-3 mb-4">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h2 className="text-success fw-bold border-bottom border-2 border-success pb-2 d-inline-block m-0">
                          Importação de Formandos
                        </h2>
                        <p className="text-muted mt-2 mb-0">
                          Importe um ficheiro Excel, valide os dados, faça alterações e
                          registre todos os formandos em lote. Seus dados são salvos
                          automaticamente como rascunho.
                        </p>
                      </div>
                      {rows.length > 0 && (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={handleLimparRascunho}
                        >
                          Limpar Rascunho
                        </Button>
                      )}
                    </div>
        
                    {/* Filtros */}
                    <Row className="g-4 mb-2 align-items-end">
                      <Col xl={2} lg={3} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted mb-1">
                            Programa
                          </Form.Label>
                          <Form.Select
                            className="shadow-none border-secondary-subtle"
                            name="programa_id"
                            value={config.programa_id}
                            onChange={handleConfigChange}
                            disabled={isProgLoading}
                          >
                            <option value="">
                              {isProgLoading ? "A processar..." : "Selecione..."}
                            </option>
                            {programas?.map((prog) => (
                              <option key={prog.id} value={prog.id}>
                                {prog.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
        
                      <Col xl={2} lg={3} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted mb-1">
                            Curso
                          </Form.Label>
                          <Form.Select
                            name="curso_id"
                            value={config.curso_id}
                            onChange={handleConfigChange}
                            disabled={isCursoLoading}
                          >
                            <option value="">
                              {isCursoLoading ? "A processar..." : "Selecione..."}
                            </option>
                            {cursosFiltrados.map((curso) => (
                              <option key={curso.id} value={curso.id}>
                                {curso.nome}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
        
                      <Col xl={2} lg={3} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted mb-1">
                            Ano de Execução
                          </Form.Label>
                          <Form.Select
                            className="shadow-none border-secondary-subtle"
                            name="ano_execucao"
                            value={config.ano_execucao}
                            onChange={handleConfigChange}
                          >
                            {[new Date().getFullYear() - 1,
                              new Date().getFullYear(),
                              new Date().getFullYear() + 1,
                              new Date().getFullYear() + 2].map((ano) => (
                              <option key={ano} value={ano}>
                                {ano}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
        
                      <Col xl={2} lg={3} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted mb-1">
                            Situação
                          </Form.Label>
                          <Form.Select
                            className="shadow-none border-secondary-subtle"
                            name="situacao"
                            value={config.situacao}
                            onChange={handleConfigChange}
                          >
                            <option value="Inscrito">Inscrito</option>
                            <option value="Selecionado">Selecionado</option>
                            
                          </Form.Select>
                        </Form.Group>
                      </Col>
        
                      <Col xl={2} lg={3} md={4}>
                        <Form.Group>
                          <Form.Label className="small fw-semibold text-muted mb-1">
                            Data Inscrição
                          </Form.Label>
                          <Form.Control
                            className="shadow-none border-secondary-subtle"
                            type="date"
                            name="data_inscricao"
                            value={config.data_inscricao}
                            onChange={handleConfigChange}
                          />
                        </Form.Group>
                      </Col>
        
                      <Col xl={2} lg={3} md={4} className="ms-auto">
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          ref={fileInputRef}
                          className="d-none"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="success"
                          className="w-100 d-flex align-items-center justify-content-center shadow-sm py-2"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FiUpload className="me-2" /> Carregar Excel
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
        
                {/* Painel de resumo */}
                <SummaryPanel rows={rows} />
        
                {/* Tabela dinâmica */}
                {rows.length > 0 && (
                  <Card className="shadow-sm border-0 rounded-3 mb-4">
                    <Card.Body className="p-4">
                      <DynamicTable
                        data={rows}
                        updateData={updateData}
                        removeRow={removeRow}
                        addRow={addRow}
                        onEditRow={(index) => setEditRowIndex(index)}
                        onBulkFill={() => setShowBulkFillModal(true)}
                      />
        
                      <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                        <Button
                          variant="outline-danger"
                          onClick={handleDownloadErrors}
                          disabled={!rows.some((r) => !r.isValid || r.isDuplicate)}
                          className="d-flex align-items-center"
                        >
                          <FiDownload className="me-2" /> Baixar Relatório de Erros
                        </Button>
                        <Button
                          variant="success"
                          size="lg"
                          onClick={handleRegistrarTodos}
                          className="px-5 shadow-sm fw-bold"
                        >
                          Registrar Todos
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                )}
        
                {/* Modais */}
                <ColumnMappingModal
                  show={showMappingModal}
                  excelColumns={excelColumns}
                  onConfirm={handleMappingConfirm}
                  onCancel={handleMappingCancel}
                />
        
                <ProgressDialog
                  show={isUploading || isFinished}
                  progress={progress}
                  current={current}
                  total={rows.filter((r) => r.isValid && !r.isDuplicate).length}
                  onCancel={cancelUpload}
                  isFinished={isFinished}
                  results={results}
                  onClose={resetUpload}
                />
        
                <RowEditModal
                  show={editRowIndex !== null}
                  rowData={editRowIndex !== null ? rows[editRowIndex] : null}
                  onSave={handleSaveRow}
                  onClose={() => setEditRowIndex(null)}
                  hasNext={editRowIndex !== null && editRowIndex < rows.length - 1}
                  hasPrev={editRowIndex !== null && editRowIndex > 0}
                  onNext={() =>
                    editRowIndex !== null && setEditRowIndex(editRowIndex + 1)
                  }
                  onPrev={() =>
                    editRowIndex !== null && setEditRowIndex(editRowIndex - 1)
                  }
                />
        
                <BulkFillModal
                  show={showBulkFillModal}
                  onApply={handleBulkFill}
                  onClose={() => setShowBulkFillModal(false)}
                />
              </Col>
            </Row>
            )
}
