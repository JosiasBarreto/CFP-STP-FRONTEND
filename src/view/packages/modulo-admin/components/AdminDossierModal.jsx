import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Nav,
  Tab,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
} from 'react-bootstrap';
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  History,
  CheckCircle2,
  XCircle,
  Download,
  MapPin,
  GraduationCap,
  Award,
  Copy,
  Edit3,
  Save,
  Check,
  RotateCcw,
  Eye,
  Maximize2,
  Ban,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { DocumentViewerModal } from './DocumentViewerModal';
import { DocumentPreviewer } from './DocumentPreviewer';
import { adminApi } from '../services/adminApi';
import { calcularIdade, formatarDataNascimento } from '.';

export const AdminDossierModal = ({
  candidatura,
  candidaturasLista = [],
  token,
  onClose,
  onNavigate,
  onAtualizar,
  aoNotificar,
}) => {
  // 3 Abas: 'dossier' (dados do candidato), 'documentos' (2ª aba), 'historico' (3ª aba)
  const [abaAtiva, setAbaAtiva] = useState('dossier');
  const [candidaturaDetalhada, setCandidaturaDetalhada] = useState(candidatura || {});
  const [docViewer, setDocViewer] = useState({ show: false, documento: null });
  const [docPrevisualizar, setDocPrevisualizar] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);

  const [processando, setProcessando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Modo de edição / retificação
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dadosEdicao, setDadosEdicao] = useState({
    nome: '',
    nome_pai: '',
    nome_mae: '',
    bi: '',
    nif: '',
    data_nascimento: '',
    sexo: 'Masculino',
    nacionalidade: 'São-tomense',
    naturalidade: 'São Tomé',
    estado_civil: 'Solteiro',
    agregado: '1',
    morada: '',
    distrito: 'Água Grande',
    zona: '',
    contacto: '',
    contacto_alternativo: '',
    email: '',
    habilitacao_literaria: '',
    area_formacao: '',
    formacao_profissional: '',
    experiencia_profissional: '',
    ocupacao: '',
    motivo_inscricao: '',
    situacao_emprego: '',
    deficiente: false,
    tipo_deficiencia: '',
    encaminhado_apoio_social: false,
    instituicao_apoio_social: '',
    autorizacao_divulgacao_dados: true,
    justificacao_correcao: '',
  });

  const cand = candidaturaDetalhada || candidatura;

  // Localizar documento de fotografia
  const docFoto = cand?.documentos?.find(
    (d) =>
      (d.tipo_documento && d.tipo_documento.toLowerCase().includes('foto')) ||
      (d.tipo && d.tipo.toLowerCase().includes('foto')) ||
      d.tipo === 'FOTO'
  );

  // Carregar/Sincronizar detalhes completos ao abrir/trocar candidatura
  useEffect(() => {
    if (!candidatura) return;
    setCandidaturaDetalhada(candidatura);
    setDocPrevisualizar(null);

    if (candidatura.id) {
      adminApi
        .obterDetalhesCandidatura(token, candidatura.id)
        .then((res) => {
          const candFull = res.candidatura || res;
          if (candFull) {
            setCandidaturaDetalhada((prev) => ({ ...prev, ...candFull }));
          }
        })
        .catch((err) => {
          console.warn('Uso de dados locais para candidatura:', err);
        });
    }

    setDadosEdicao({
      nome: candidatura.nome || '',
      nome_pai: candidatura.nome_pai || '',
      nome_mae: candidatura.nome_mae || '',
      bi: candidatura.bi || '',
      nif: candidatura.nif || '',
      data_nascimento: candidatura.data_nascimento || '',
      sexo: candidatura.sexo || 'Masculino',
      nacionalidade: candidatura.nacionalidade || 'São-tomense',
      naturalidade: candidatura.naturalidade || 'São Tomé',
      estado_civil: candidatura.estado_civil || 'Solteiro',
      agregado: candidatura.agregado || '1',
      morada: candidatura.morada || '',
      distrito: candidatura.distrito || 'Água Grande',
      zona: candidatura.zona || '',
      contacto: candidatura.contacto || '',
      contacto_alternativo: candidatura.contacto_alternativo || '',
      email: candidatura.email || '',
      habilitacao_literaria: candidatura.habilitacao_literaria || '',
      area_formacao: candidatura.area_formacao || '',
      formacao_profissional: candidatura.formacao_profissional || '',
      experiencia_profissional: candidatura.experiencia_profissional || '',
      ocupacao: candidatura.ocupacao || '',
      motivo_inscricao: candidatura.motivo_inscricao || '',
      situacao_emprego: candidatura.situacao_emprego || '',
      deficiente: Boolean(candidatura.deficiente),
      tipo_deficiencia: candidatura.tipo_deficiencia || '',
      encaminhado_apoio_social: Boolean(candidatura.encaminhado_apoio_social),
      instituicao_apoio_social: candidatura.instituicao_apoio_social || '',
      autorizacao_divulgacao_dados: candidatura.autorizacao_divulgacao_dados !== false,
      justificacao_correcao: '',
    });
    setModoEdicao(false);
  }, [candidatura, token]);

  // Carregar fotografia do candidato no cabeçalho
  useEffect(() => {
    if (!docFoto) {
      setFotoUrl(null);
      return;
    }

    let isMounted = true;
    let createdUrl = null;

    adminApi
      .obterDocumentoBlob(docFoto, token)
      .then((blob) => {
        if (!isMounted) return;
        createdUrl = URL.createObjectURL(blob);
        setFotoUrl(createdUrl);
      })
      .catch(() => {
        if (isMounted) setFotoUrl(null);
      });

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [docFoto, token]);

  // Pré-selecionar o primeiro documento ao abrir a aba de documentos se nenhum estiver selecionado
  useEffect(() => {
    if (abaAtiva === 'documentos' && cand?.documentos?.length > 0 && !docPrevisualizar) {
      setDocPrevisualizar(cand.documentos[0]);
    }
  }, [abaAtiva, cand?.documentos]);

  if (!candidatura) return null;

  // Cálculo da navegação do próximo/anterior
  const listaSegura = Array.isArray(candidaturasLista) ? candidaturasLista : [];
  const indexAtual = listaSegura.findIndex((c) => c.id === cand.id);
  const temAnterior = indexAtual > 0;
  const temSeguinte = indexAtual >= 0 && indexAtual < listaSegura.length - 1;

  const irAnterior = () => {
    if (temAnterior && onNavigate) {
      onNavigate(listaSegura[indexAtual - 1]);
    }
  };

  const irSeguinte = () => {
    if (temSeguinte && onNavigate) {
      onNavigate(listaSegura[indexAtual + 1]);
    }
  };

  // Copiar código da candidatura
  const copiarCodigo = () => {
    if (cand.codigo) {
      navigator.clipboard.writeText(cand.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  // Salvar retificações
  const guardarEdicao = async () => {
    setProcessando(true);
    try {
      await adminApi.atualizarCandidatura(token, cand.id, dadosEdicao);
      Swal.fire({
        title: 'Dados Retificados!',
        text: 'As correções foram gravadas no sistema com sucesso.',
        icon: 'success',
        confirmButtonColor: '#1b4332',
      });
      setModoEdicao(false);
      if (onAtualizar) onAtualizar();
    } catch (err) {
      Swal.fire({
        title: 'Erro ao Guardar',
        text: err.message || 'Falha ao atualizar dados.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    } finally {
      setProcessando(false);
    }
  };

  // Aprovar candidatura individual com SweetAlert2 (Aprovação Direta sem necessidade de Justificação)
  const executarAprovacaoModal = async () => {
    const result = await Swal.fire({
      title: 'Aprovar Candidatura',
      html: `Confirma a homologação e aprovação oficial da candidatura de <strong>${cand.nome}</strong> (Código: ${cand.codigo})?<br/><small className="text-muted">Será gerado o registo do formando e a vaga no curso.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1b4332',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, Aprovar Candidatura',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setProcessando(true);
      try {
        await adminApi.aprovarCandidatura(token, cand.id, 'Candidatura Aprovada Oficialmente');
        Swal.fire({
          title: 'Candidatura Aprovada!',
          text: `A candidatura ${cand.codigo} foi aprovada com sucesso!`,
          icon: 'success',
          confirmButtonColor: '#1b4332',
        });
        if (onAtualizar) onAtualizar();
        onClose();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Aprovação',
          text: err.message || 'Falha ao aprovar candidatura.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      } finally {
        setProcessando(false);
      }
    }
  };

  // Reprovar candidatura individual com SweetAlert2
  const executarReprovacaoModal = async () => {
    const result = await Swal.fire({
      title: 'Reprovar Candidatura',
      html: `Indique o motivo da não admissão de <strong>${cand.nome}</strong>:`,
      input: 'textarea',
      inputPlaceholder: 'Ex: Vagas preenchidas na totalidade / Requisitos do edital não cumpridos...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#991b1b',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Confirmar Reprovação',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'O motivo da reprovação é obrigatório!';
        }
      },
    });

    if (result.isConfirmed && result.value) {
      setProcessando(true);
      try {
        await adminApi.reprovarCandidatura(token, cand.id, result.value);
        Swal.fire({
          title: 'Candidatura Reprovada',
          text: `A candidatura de ${cand.nome} foi registada como Rejeitada.`,
          icon: 'info',
          confirmButtonColor: '#1b4332',
        });
        if (onAtualizar) onAtualizar();
        onClose();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Reprovação',
          text: err.message || 'Falha ao reprovar candidatura.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      } finally {
        setProcessando(false);
      }
    }
  };

  // Devolver candidatura individual com SweetAlert2
  const executarDevolucaoModal = async () => {
    const result = await Swal.fire({
      title: 'Devolver para Correção',
      html: `Indique o que o candidato <strong>${cand.nome}</strong> necessita de corrigir:`,
      input: 'textarea',
      inputPlaceholder: 'Ex: Anexo do BI com baixa resolução / Corrigir NIF ou dados pessoais...',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Devolver p/ Correção',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'O motivo da devolução é obrigatório!';
        }
      },
    });

    if (result.isConfirmed && result.value) {
      setProcessando(true);
      try {
        await adminApi.devolverCandidatura(token, cand.id, result.value);
        Swal.fire({
          title: 'Candidatura Devolvida',
          text: 'O formando foi notificado para proceder à correção de dados.',
          icon: 'success',
          confirmButtonColor: '#1b4332',
        });
        if (onAtualizar) onAtualizar();
        onClose();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Devolução',
          text: err.message || 'Falha ao devolver candidatura.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      } finally {
        setProcessando(false);
      }
    }
  };
  

  return (
    <Modal show={true} onHide={onClose} size="xl" centered scrollable className="font-sans border-0">
      <Tab.Container id="modal-dossier-tabs" activeKey={abaAtiva} onSelect={(k) => setAbaAtiva(k || 'dossier')}>
        {/* CABEÇALHO ELEGANTE DO MODAL COM FOTO DO CANDIDATO */}
        <Modal.Header className="border-0 py-3 px-4 d-flex justify-content-between align-items-center text-white" style={{ backgroundColor: '#1b4332' }}>
          <div className="d-flex align-items-center gap-3">
            {/* AVATAR COM FOTO DO CANDIDATO OU INICIAL DE IDENTIFICAÇÃO */}
            <div className="position-relative shrink-0">
              {fotoUrl ? (
                <img
                  src={fotoUrl}
                  alt={cand.nome}
                  className="rounded-circle border border-2 border-white shadow-sm"
                  style={{ width: '56px', height: '54px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    fontSize: '1.4rem',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                  }}
                >
                  {cand.nome ? cand.nome.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
            </div>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="modal-title mb-0 fw-bold text-white fs-5" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.2px' }}>
                  {cand.nome}
                </h5>
                <StatusBadgeAdmin estado={cand.estado} />
              </div>
              <div className="d-flex align-items-center gap-3 fs-7 text-white-50 mt-1">
                <span>
                  <strong className="text-white">Código:</strong> <span className="font-mono text-white fw-bold">{cand.codigo}</span>{' '}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-1 text-white text-decoration-none"
                    onClick={copiarCodigo}
                    title="Copiar código"
                  >
                    {copiado ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                  </Button>
                </span>
                <span>
                  <Badge bg="light" text="dark" className="fs-8 fw-semibold shadow-xs">
                    Processo: {cand.processo_numero || 'Pendente'}
                  </Badge>
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="light"
              size="sm"
              onClick={() => adminApi.baixarFichaOficialPdf(token, cand)}
              className="d-flex align-items-center gap-1.5 fw-semibold fs-7 shadow-xs text-dark rounded-3"
              title="Baixar Ficha de Inscrição Oficial em PDF do Backend"
            >
              <Download style={{ width: '15px', height: '15px' }} />
              <span className="d-none d-md-inline">Ficha PDF</span>
            </Button>

            <Button variant="light" className="text-dark p-1.5 ms-1 rounded-circle border-0 shadow-xs" onClick={onClose} aria-label="Fechar">
              <X style={{ width: '18px', height: '18px' }} />
            </Button>
          </div>
        </Modal.Header>

        {/* NAVEGAÇÃO POR ABAS DO MODAL */}
        <div className="bg-light border-bottom px-4 pt-2.5 pb-0">
          <Nav variant="tabs" className="border-bottom-0">
            <Nav.Item>
              <Nav.Link eventKey="dossier" className="fw-bold fs-7 d-flex align-items-center gap-2 py-2 px-3">
                <User style={{ width: '16px', height: '16px' }} />
                <span>1. Dados do Candidato</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="documentos" className="fw-bold fs-7 d-flex align-items-center gap-2 py-2 px-3">
                <FileText style={{ width: '16px', height: '16px' }} />
                <span>2. Documentos & Anexos</span>
                {cand.documentos?.length > 0 && (
                  <Badge bg="success" pill className="ms-1 fs-8" style={{ backgroundColor: '#2d6a4f' }}>
                    {cand.documentos.length}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="historico" className="fw-bold fs-7 d-flex align-items-center gap-2 py-2 px-3">
                <History style={{ width: '16px', height: '16px' }} />
                <span>3. Histórico & Auditoria</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {/* CORPO DO MODAL */}
        <Modal.Body className="p-4" style={{ backgroundColor: '#f8faf9' }}>
          <Tab.Content>
            {/* ABA 1: DADOS DO CANDIDATO (ESTRUTURA PREMIUM, TIPOGRAFIA ELEGANTE E SEM DUPLICAÇÃO DE NOME) */}
            <Tab.Pane eventKey="dossier" active={abaAtiva === 'dossier'}>
              {modoEdicao ? (
                <Card className="border-warning mb-4 shadow-sm rounded-4">
                  <Card.Header className="bg-warning-subtle text-dark fw-bold d-flex align-items-center justify-content-between py-2.5">
                    <span className="d-flex align-items-center gap-2 fs-7" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                      <Edit3 style={{ width: '16px', height: '16px' }} /> Retificação de Dados da Candidatura
                    </span>
                    <Button variant="outline-dark" size="sm" onClick={() => setModoEdicao(false)} className="fs-8 rounded-3">
                      Cancelar Edição
                    </Button>
                  </Card.Header>
                  <Card.Body className="p-3.5">
                    <Form>
                      <Row className="g-3 fs-7">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Nome Completo</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.nome}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, nome: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label className="fw-bold">BI / Identificação</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.bi}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, bi: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group>
                            <Form.Label className="fw-bold">NIF</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.nif}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, nif: e.target.value })}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Data de Nascimento</Form.Label>
                            <Form.Control
                              type="date"
                              size="sm"
                              value={dadosEdicao.data_nascimento}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, data_nascimento: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Sexo</Form.Label>
                            <Form.Select
                              size="sm"
                              value={dadosEdicao.sexo}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, sexo: e.target.value })}
                            >
                              <option value="Masculino">Masculino</option>
                              <option value="Feminino">Feminino</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Estado Civil</Form.Label>
                            <Form.Select
                              size="sm"
                              value={dadosEdicao.estado_civil}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, estado_civil: e.target.value })}
                            >
                              <option value="Solteiro">Solteiro(a)</option>
                              <option value="Casado">Casado(a)</option>
                              <option value="Divorciado">Divorciado(a)</option>
                              <option value="Viuvo">Viúvo(a)</option>
                              <option value="UniaoFacto">União de Facto</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Telefone Principal</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.contacto}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, contacto: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Telefone Alternativo</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.contacto_alternativo}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, contacto_alternativo: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Email</Form.Label>
                            <Form.Control
                              type="email"
                              size="sm"
                              value={dadosEdicao.email}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, email: e.target.value })}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Distrito</Form.Label>
                            <Form.Select
                              size="sm"
                              value={dadosEdicao.distrito}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, distrito: e.target.value })}
                            >
                              <option value="Água Grande">Água Grande</option>
                              <option value="Mé-Zóchi">Mé-Zóchi</option>
                              <option value="Cantagalo">Cantagalo</option>
                              <option value="Caué">Caué</option>
                              <option value="Lembá">Lembá</option>
                              <option value="Lobata">Lobata</option>
                              <option value="Pagué (Príncipe)">Pagué (Príncipe)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Morada Completa</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.morada}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, morada: e.target.value })}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Habilitação Literária</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.habilitacao_literaria}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, habilitacao_literaria: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-bold">Situação de Emprego</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={dadosEdicao.situacao_emprego}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, situacao_emprego: e.target.value })}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-bold text-danger">Motivo da Retificação (Obrigatório)</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              size="sm"
                              placeholder="Indique a razão da alteração de dados no sistema..."
                              value={dadosEdicao.justificacao_correcao}
                              onChange={(e) => setDadosEdicao({ ...dadosEdicao, justificacao_correcao: e.target.value })}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant="secondary" size="sm" onClick={() => setModoEdicao(false)} className="rounded-3">
                          Cancelar
                        </Button>
                        <Button variant="success" size="sm" onClick={guardarEdicao} disabled={processando} className="rounded-3" style={{ backgroundColor: '#1b4332', borderColor: '#1b4332' }}>
                          {processando ? <Spinner size="sm" animation="border" /> : <Save style={{ width: '14px', height: '14px' }} />}
                          <span className="ms-1">Guardar Alterações</span>
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              ) : null}

              {/* SEÇÃO 1: IDENTIFICAÇÃO PESSOAL & RESIDÊNCIA (SEM REPETIR O NOME) */}
              <Row className="g-3 mb-3">
                <Col md={8}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light-subtle">
                        <User style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                        <h6 className="fw-bold mb-0" style={{ color: '#1b4332', fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '1rem' }}>
                          Identificação Pessoal & Filiação
                        </h6>
                      </div>

                      <Row className="g-3 ">
                        <Col sm={4} className='shadow-sm rounded-3 mb-3' >
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Bilhete de ident. / Passaporte</span>
                          <span className="d-block fs-6 font-mono fw-semibold" style={{ color: '#0f172a' }}>{cand.bi || '—'}</span>
                        </Col>

                        <Col sm={4} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Número de ident. fiscal (NIF)</span>
                          <span className="d-block fs-6 font-mono fw-bold" style={{ color: '#0f172a' }}>{cand.nif || '—'}</span>
                        </Col>
                        <Col sm={2} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Data de nasc.</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'', 'Times New Roman', serif", color: '#1e293b' }}>{formatarDataNascimento(cand.data_nascimento) || '—'}</span>
                        </Col>
                        <Col sm={2} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Idade</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'', 'Times New Roman', serif", color: '#1e293b' }}>{calcularIdade(cand.data_nascimento) +' Anos' || '—'}</span>
                        </Col>

                        <Col sm={6} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Nome do pai</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.nome_pai || '—'}</span>
                        </Col>
                        <Col sm={6} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Nome da mãe</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.nome_mae || '—'}</span>
                        </Col>

                        
                        <Col sm={2} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Gênero / Sexo</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.sexo || '—'}</span>
                        </Col>
                        <Col sm={2} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Estado civil</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.estado_civil || '—'}</span>
                        </Col>
                        <Col sm={2} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Nº Agregado </span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.agregado || cand.agregado_familiar || '1'} pessoa(s)</span>
                        </Col>

                        <Col sm={3} className='shadow-sm rounded-3 mb-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Naturalidade</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.naturalidade || '—'}</span>
                        </Col>
                        <Col sm={3} className='shadow-sm rounded-3'>
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Nacionalidade</span>
                          <span className="d-block fs-6" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#1e293b' }}>{cand.nacionalidade || 'São-tomense'}</span>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light-subtle">
                        <MapPin style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                        <h6 className="fw-bold mb-0" style={{ color: '#1b4332', fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '1rem' }}>
                          Contactos & Morada
                        </h6>
                      </div>

                      <div className="space-y-3">
                        <div className="mb-3 shadow-sm rounded-3 p-1">
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Contacto telefónico </span>
                          <span className="d-block fs-6 fw-bold text-dark font-mono">
  {cand.contacto || '—'}
  {cand.contacto_alternativo && `/ ${cand.contacto_alternativo}`}
</span>                        </div>
                        
                        <div className="mb-3 shadow-sm rounded-3 p-1" >
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Endereço eletrónico (Email)</span>
                          <span className="d-block fs-6 text-primary text-break" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{cand.email || '—'}</span>
                        </div>
                        <div className="mb-2.5 shadow-sm rounded-3 p-1">
                          <span className="d-block fw-bold fs-7 mb-0.5" style={{ color: '#475569' }}>Distrito e Residência</span>
                          <span className="d-block fs-6 fw-bold text-dark font-mono">
  {cand.distrito || '—'}
  {cand.morada && `/ ${cand.morada}`}
</span>
                          
                        </div>
                       
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* SEÇÃO 2: PROGRAMA & OPÇÕES DE CURSO */}
              <Card className="border-0 shadow-sm rounded-4 bg-white mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light-subtle">
                    <GraduationCap style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                    <h6 className="fw-bold mb-0" style={{ color: '#1b4332', fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '1rem' }}>
                     Cursos Inscritos
                    </h6>
                  </div>

                  <Row className="">
                    
                    <Col md={6} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>1.ª Opção de curso (Principal)</span>
                      <strong className="fs-6 text-dark d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {cand.curso_opcao1?.nome || cand.curso_nome }
                      </strong>
                      <div className="text-muted fs-8 mt-1 d-flex">
                      {cand.curso_opcao1?.local_realizacao && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Local: {cand.curso_opcao1.local_realizacao}</Badge>
                      )}
                      {cand.curso_opcao1?.acao && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Acção Nº: {cand.curso_opcao1.acao}</Badge>
                      )}
                      {cand.curso_opcao1?.programa && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Programa: {cand.curso_opcao1.programa}</Badge>
                      )}
</div>
                    </Col>
                    <Col md={6} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>2.ª Opção de curso (Alternativa)</span>
                      <strong className="fs-6 text-secondary d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {cand.curso_opcao2?.nome || 'Nenhuma segunda opção selecionada'}
                      </strong>
                      <div className="text-muted fs-8 mt-1 d-flex">
                      {cand.curso_opcao2?.local_realizacao && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Local: {cand.curso_opcao2.local_realizacao}</Badge>
                      )}
                      {cand.curso_opcao2?.acao && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Acção Nº: {cand.curso_opcao2.acao}</Badge>
                      )}
                      {cand.curso_opcao2?.programa && (
                        <Badge className="bg-success-subtle text-muted fs-8 mt-1 d-block">Programa: {cand.curso_opcao2.programa}</Badge>
                      )}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* SEÇÃO 3: HABILITAÇÕES & PERFIL PROFISSIONAL COM CAMPOS AMPLIADOS */}
              <Card className="border-0 shadow-sm rounded-4 bg-white mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light-subtle">
                    <Award style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                    <h6 className="fw-bold mb-0" style={{ color: '#1b4332', fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '1rem' }}>
                      Habilitações Literárias & Perfil Profissional
                    </h6>
                  </div>

                  <Row className="g-3">
                    <Col md={6} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Habilitação literária</span>
                      <span className="text-dark fs-6 d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{cand.habilitacao_literaria || '—'}</span>
                      <span className="text-dark fs-6 d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{cand.nivel_escolaridade
 || cand.area_formacao || '—'}</span>
                    </Col>
                    <Col md={3} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Situação de emprego atual</span>
                      <span className="text-dark fs-6 d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{cand.situacao_emprego || 'Desempregado'}</span>
                    </Col>
                    <Col md={3}>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Ocupação ou atividade profissional</span>
                      <span className="text-dark fs-6 d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>{cand.ocupacao || '—'}</span>
                    </Col>

                    {/* CAMPOS MAIORES PARA ACOMODAR INFORMAÇÃO COMPLETA */}
                    

                    <Col md={12}>
                      <div className="mt-1">
                        <span className="d-block fw-bold fs-7 mb-1.5" style={{ color: '#475569' }}>
                          Formação profissional anterior
                        </span>
                        <div
                          className="p-3 rounded-3"
                          style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            minHeight: 'auto',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {cand.formacao_profissional || cand.formacao_anterior || 'Nenhuma formação profissional prévia declarada.'}
                        </div>
                      </div>
                    </Col>

                    <Col md={12}>
                      <div className="mt-1">
                        <span className="d-block fw-bold fs-7 mb-1.5" style={{ color: '#475569' }}>
                          Experiência profissional
                        </span>
                        <div
                          className="p-3 rounded-3"
                          style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            minHeight: 'auto',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {cand.experiencia_profissional || 'Sem experiência profissional prévia registada.'}
                        </div>
                      </div>
                    </Col>

                    <Col md={12}>
                      <div className="mt-1">
                        <span className="d-block fw-bold fs-7 mb-1.5" style={{ color: '#475569' }}>
                          Motivo da inscrição no curso
                        </span>
                        <div
                          className="p-3 rounded-3"
                          style={{
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#1e293b',
                            fontSize: '0.95rem',
                            minHeight: 'auto',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {cand.motivo_inscricao || 'Sem observações ou motivos registados.'}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* SEÇÃO 4: INCLUSÃO SOCIAL & AUTORIZAÇÃO UTILIZAÇÃO DE DADOS */}
              <Card className="border-0 shadow-sm rounded-4 bg-white mb-2">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-light-subtle">
                    <User style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                    <h6 className="fw-bold mb-0" style={{ color: '#1b4332', fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '1rem' }}>
                      Inclusão Social & Autorização de Dados
                    </h6>
                  </div>

                  <Row className="g-3">
                    <Col md={4} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Portador de deficiência</span>
                      <strong className={cand.deficiente ? 'text-danger fs-6' : 'text-dark fs-6'} style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {cand.deficiente ? `Sim (${cand.tipo_deficiencia || 'Não especificada'})` : 'Não'}
                      </strong>
                    </Col>
                    <Col md={4} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Encaminhado por apoio social</span>
                      <strong className={cand.encaminhado_apoio_social ? 'text-primary fs-6' : 'text-dark fs-6'} style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {cand.encaminhado_apoio_social ? `Sim (${cand.instituicao_apoio_social || 'Instituição Social'})` : 'Não'}
                      </strong>
                    </Col>
                    <Col md={4} className='shadow-sm rounded-3'>
                      <span className="d-block fw-bold fs-7 mb-1" style={{ color: '#475569' }}>Autorização Utilização de Dados</span>
                      <span className="text-success fw-bold fs-6 d-block" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        {cand.autorizacao_divulgacao_dados !== false ? 'Autorizado pelo candidato' : 'Não autorizado'}
                      </span>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* ABA 2: DOCUMENTOS E ANEXOS (LAYOUT INVERTIDO: LADO ESQUERDO PAINEL MAIOR DE VISUALIZAÇÃO, LADO DIREITO LISTA MENOR) */}
            <Tab.Pane eventKey="documentos" active={abaAtiva === 'documentos'}>
              <Row className="g-3 align-items-stretch">
                {/* LADO ESQUERDO: PAINEL DE VISUALIZAÇÃO PRINCIPAL DO DOCUMENTO (COLUNA MAIOR COL MD={7} OU MD={8}) */}
                <Col md={7} lg={8}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Header className="bg-light border-bottom fw-bold fs-7 d-flex align-items-center justify-content-between py-2.5 px-3 rounded-top-4">
                      <span className="d-flex align-items-center gap-2" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        <Eye style={{ width: '16px', height: '16px', color: '#1b4332' }} />
                        Painel de Visualização do Documento
                      </span>
                      {docPrevisualizar && (
                        <Badge bg="success-subtle" text="dark" className="border border-success-subtle fs-8 px-2 py-1 rounded-pill">
                          {docPrevisualizar.tipo_documento || docPrevisualizar.tipo || 'Visualização Ativa'}
                        </Badge>
                      )}
                    </Card.Header>
                    <Card.Body className="p-2 d-flex flex-column justify-content-center">
                      {docPrevisualizar ? (
                        <DocumentPreviewer
                          documento={docPrevisualizar}
                          token={token}
                          height="480px"
                          showControls={true}
                          onExpand={(doc) => setDocViewer({ show: true, documento: doc })}
                        />
                      ) : (
                        <div className="text-center p-5 text-muted my-auto">
                          <FileText style={{ width: '48px', height: '48px' }} className="mb-2 text-secondary opacity-50" />
                          <h6 className="fw-bold text-dark mb-1">Selecione um documento na lista à direita</h6>
                          <p className="fs-7 mb-0">Clique em qualquer anexo da lista para carregar a pré-visualização segura.</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* LADO DIREITO: LISTA COMPACTA DE DOCUMENTOS COMPROVATIVOS (COLUNA MENOR COL MD={5} OU MD={4}) */}
                <Col md={5} lg={4}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Header className="bg-light border-bottom fw-bold fs-7 d-flex align-items-center justify-content-between py-2.5 px-3 rounded-top-4">
                      <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        Documentos ({cand.documentos?.length || 0})
                      </span>
                      <Badge bg="success" pill className="fs-8 px-2.5 py-1" style={{ backgroundColor: '#1b4332' }}>
                        Ativos
                      </Badge>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {cand.documentos && cand.documentos.length > 0 ? (
                        <div className="p-2 space-y-2" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                          {cand.documentos.map((doc, idx) => {
                            const tipoDoc = doc.tipo_documento || doc.tipo || 'Comprovativo';
                            const estaSelecionado = docPrevisualizar?.id === doc.id;

                            return (
                              <Card
                                key={doc.id || idx}
                                onClick={() => setDocPrevisualizar(doc)}
                                className={`mb-2 cursor-pointer transition-all border ${
                                  estaSelecionado
                                    ? 'border-success bg-success-subtle shadow-xs'
                                    : 'border-light-subtle bg-white hover-shadow-xs'
                                } rounded-3`}
                                style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                              >
                                <Card.Body className="p-2.5 d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center gap-2 overflow-hidden">
                                    <FileText
                                      style={{
                                        width: '18px',
                                        height: '18px',
                                        color: estaSelecionado ? '#1b4332' : '#64748b',
                                      }}
                                      className="shrink-0"
                                    />
                                    <div className="text-truncate">
                                      <strong className="d-block fs-8 text-dark text-truncate mb-0.5">
                                        {tipoDoc}
                                      </strong>
                                      <span className="text-muted fs-8 text-truncate d-block">
                                        {doc.nome_original || doc.nome || `${tipoDoc}.pdf`}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center gap-1 shrink-0 ms-2" onClick={(e) => e.stopPropagation()}>
                                    <Button
                                      variant={estaSelecionado ? 'success' : 'outline-success'}
                                      size="sm"
                                      onClick={() => setDocPrevisualizar(doc)}
                                      className="p-1.5 rounded-circle border-0 d-flex align-items-center justify-content-center"
                                      title="Pré-visualizar no painel"
                                      style={{ width: '28px', height: '28px' }}
                                    >
                                      <Eye style={{ width: '14px', height: '14px' }} />
                                    </Button>

                                    <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => setDocViewer({ show: true, documento: doc })}
                                      className="p-1.5 rounded-circle border-0 d-flex align-items-center justify-content-center"
                                      title="Abrir em Modal Ecrã Inteiro"
                                      style={{ width: '28px', height: '28px' }}
                                    >
                                      <Maximize2 style={{ width: '13px', height: '13px' }} />
                                    </Button>

                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => adminApi.descarregarDocumento(doc, token)}
                                      className="p-1.5 rounded-circle border-0 d-flex align-items-center justify-content-center"
                                      title="Descarregar Ficheiro Seguramente"
                                      style={{ width: '28px', height: '28px' }}
                                    >
                                      <Download style={{ width: '13px', height: '13px' }} />
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center p-5 text-muted">
                          <FileText style={{ width: '40px', height: '40px' }} className="mb-2 text-secondary opacity-50" />
                          <p className="mb-0 fw-semibold fs-7">Nenhum documento anexado a este processo.</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* ABA 3: HISTÓRICO E AUDITORIA */}
            <Tab.Pane eventKey="historico" active={abaAtiva === 'historico'}>
              <Card className="border-0 shadow-sm rounded-4 bg-white">
                <Card.Header className="bg-light border-bottom fw-bold fs-7 py-2.5 px-3 rounded-top-4" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  <History style={{ width: '16px', height: '16px', color: '#0284c7' }} className="me-2" />
                  Registo de Auditoria e Eventos do Processo
                </Card.Header>
                <Card.Body className="p-4">
                  {cand.historico && cand.historico.length > 0 ? (
                    <div className="timeline ps-3 border-start border-2" style={{ borderColor: '#1b4332' }}>
                      {cand.historico.map((h, idx) => (
                        <div key={h.id || idx} className="mb-3 ms-3 position-relative">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <StatusBadgeAdmin estado={h.estado_novo || h.estado} />
                            <span className="text-muted fs-8 fw-semibold">{h.data_registo || h.data}</span>
                            <span className="text-secondary fs-8">por {h.utilizador_nome || 'Sistema Admin'}</span>
                          </div>
                          {h.observacao && <p className="mb-0 text-dark fs-7 bg-light p-2.5 rounded-3 border">{h.observacao}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-light rounded-3 border text-muted">
                      <p className="mb-1 fw-bold text-dark fs-7">Submissão Inicial do Candidato</p>
                      <p className="mb-0 fs-8">
                        Candidatura registada no sistema a {cand.data_submissao || cand.data_criacao || 'Data Recente'}.
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Modal.Body>

        {/* RODAPÉ DO MODAL COM BOTÕES E AÇÕES */}
        <Modal.Footer className="bg-light border-top py-3 px-4 d-flex flex-wrap justify-content-between align-items-center">
          {/* LADO ESQUERDO: NAVEGAÇÃO DE CANDIDATOS */}
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={irAnterior}
              disabled={!temAnterior || processando}
              className="d-flex align-items-center gap-1 fw-semibold fs-7 rounded-3"
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} /> Anterior
            </Button>
            <span className="fw-mono fw-bold text-secondary px-2 fs-7">
              {indexAtual >= 0 ? indexAtual + 1 : 1} / {listaSegura.length || 1}
            </span>
            <Button
              variant="success"
              size="sm"
              onClick={irSeguinte}
              disabled={!temSeguinte || processando}
              className="d-flex align-items-center gap-1 fw-bold fs-7 text-white rounded-3"
              style={{ backgroundColor: '#1b4332', borderColor: '#1b4332' }}
            >
              Próximo <ChevronRight style={{ width: '16px', height: '16px' }} />
            </Button>
          </div>

          {/* LADO DIREITO: AÇÕES CONDICIONAIS DE ACORDO COM O ESTADO DO CANDIDATO */}
          <div className="d-flex flex-wrap align-items-center gap-2">
            {cand.estado === 'APROVADA' || cand.estado === 'APROVADO' ? (
              // SE O CANDIDATO JÁ ESTIVER APROVADO, NÃO MOSTRAR BOTÕES DE APROVAR, REPROVAR OU CANCELAR
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-bold fs-7 shadow-xs"
                  style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' }}
                >
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Candidatura Aprovada</span>
                </div>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => adminApi.baixarFichaOficialPdf(token, cand)}
                  className="d-flex align-items-center gap-1.5 fw-semibold fs-7 rounded-3"
                  title="Baixar Ficha de Inscrição Oficial"
                >
                  <Download style={{ width: '15px', height: '15px' }} />
                  <span>Ficha PDF</span>
                </Button>
                <Button variant="secondary" size="sm" onClick={onClose} className="fw-semibold fs-7 px-3 ms-1 rounded-3">
                  Fechar
                </Button>
              </div>
            ) : cand.estado === 'REJEITADA' || cand.estado === 'REJEITADO' ? (
              // SE REJEITADO
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-bold fs-7 shadow-xs"
                  style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}
                >
                  <XCircle style={{ width: '16px', height: '16px' }} />
                  <span>Candidatura Não Admitida</span>
                </div>
                <Button variant="secondary" size="sm" onClick={onClose} className="fw-semibold fs-7 px-3 rounded-3">
                  Fechar
                </Button>
              </div>
            ) : cand.estado === 'CANCELADA' || cand.estado === 'CANCELADO' ? (
              // SE CANCELADA
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-bold fs-7 shadow-xs"
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                >
                  <Ban style={{ width: '16px', height: '16px' }} />
                  <span>Candidatura Cancelada</span>
                </div>
                <Button variant="secondary" size="sm" onClick={onClose} className="fw-semibold fs-7 px-3 rounded-3">
                  Fechar
                </Button>
              </div>
            ) : (
              // ESTADOS PENDENTES / EM ANÁLISE / DEVOLVIDA / CORRIGIDA
              <>
                <Button
                  variant={modoEdicao ? 'warning' : 'outline-primary'}
                  size="sm"
                  onClick={() => {
                    setAbaAtiva('dossier');
                    setModoEdicao(!modoEdicao);
                  }}
                  disabled={processando}
                  className="d-flex align-items-center gap-1.5 fw-semibold fs-7 rounded-3"
                >
                  <Edit3 style={{ width: '15px', height: '15px' }} />
                  {modoEdicao ? 'Cancelar Edição' : 'Corrigir'}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={processando}
                  onClick={executarReprovacaoModal}
                  className="d-flex align-items-center gap-1.5 fw-bold fs-7 rounded-3"
                  style={{ backgroundColor: '#991b1b', borderColor: '#991b1b' }}
                >
                  <XCircle style={{ width: '15px', height: '15px' }} /> Reprovar
                </Button>

                <Button
                  variant="warning"
                  size="sm"
                  disabled={processando}
                  onClick={executarDevolucaoModal}
                  className="d-flex align-items-center gap-1.5 fw-bold fs-7 text-white rounded-3"
                  style={{ backgroundColor: '#d97706', borderColor: '#d97706' }}
                >
                  <RotateCcw style={{ width: '15px', height: '15px' }} /> Devolver p/ Correção
                </Button>

                <Button
                  variant="success"
                  size="sm"
                  disabled={processando}
                  onClick={executarAprovacaoModal}
                  className="d-flex align-items-center gap-1.5 fw-bold fs-7 px-3.5 text-white rounded-3"
                  style={{ backgroundColor: '#1b4332', borderColor: '#1b4332' }}
                >
                  <CheckCircle2 style={{ width: '15px', height: '15px' }} /> Aprovar
                </Button>

                <Button variant="secondary" size="sm" onClick={onClose} className="fw-semibold fs-7 px-3 ms-2 rounded-3">
                  Fechar
                </Button>
              </>
            )}
          </div>
        </Modal.Footer>

        {/* MODAL SECUNDÁRIO DE VISUALIZAÇÃO EM ECRÃ INTEIRO DE DOCUMENTOS */}
        {docViewer.show && (
          <DocumentViewerModal
            show={docViewer.show}
            documento={docViewer.documento}
            token={token}
            onClose={() => setDocViewer({ show: false, documento: null })}
          />
        )}
      </Tab.Container>
    </Modal>
  );
};

export default AdminDossierModal;
