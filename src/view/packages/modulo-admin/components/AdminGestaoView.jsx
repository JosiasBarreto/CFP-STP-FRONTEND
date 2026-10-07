import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
  Spinner,
  InputGroup,
  Pagination,
  Dropdown,
} from 'react-bootstrap';
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  FileSpreadsheet,
  Users,
  Clock,
  CheckSquare,
  Square,
  ChevronDown,
  Filter,
  Sparkles,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { AdminDossierModal } from './AdminDossierModal';
import { adminApi } from '../services/adminApi';

export const AdminGestaoView = ({ token, aoNotificar }) => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  // Seleção múltipla para ações em lote
  const [idsSelecionados, setIdsSelecionados] = useState([]);

  // Filtros
  const [pesquisa, setPesquisa] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [programaFiltro, setProgramaFiltro] = useState('');
  const [cursoFiltro, setCursoFiltro] = useState('');
  const [distritoFiltro, setDistritoFiltro] = useState('');

  // Listas de opções de filtro
  const [programas, setProgramas] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Modal de Dossiê Unificado
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState(null);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Helper para extrair lista em formato de array seguro
  const extrairListaArray = (res) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.candidaturas)) return res.candidaturas;
    if (res && Array.isArray(res.items)) return res.items;
    if (res && Array.isArray(res.programas)) return res.programas;
    if (res && Array.isArray(res.cursos)) return res.cursos;
    if (res && Array.isArray(res.dados)) return res.dados;
    if (res && Array.isArray(res.data)) return res.data;
    return [];
  };

  // Carregar dados iniciais
  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const [resCandidaturas, resProgramas, resCursos] = await Promise.all([
        adminApi.listarCandidaturas(token),
        adminApi.listarProgramas(token).catch(() => []),
        adminApi.listarCursos(token).catch(() => []),
      ]);

      setCandidaturas(extrairListaArray(resCandidaturas));
      setProgramas(extrairListaArray(resProgramas));
      setCursos(extrairListaArray(resCursos));
    } catch (err) {
      console.error('Erro ao carregar gestão de dossiês:', err);
      setErro('Não foi possível conectar ao servidor remoto. Exibindo dados locais.');
      setCandidaturas([]);
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar cursos quando o programa for alterado
  useEffect(() => {
    if (programaFiltro) {
      adminApi.listarCursos(token, programaFiltro)
        .then((res) => setCursos(extrairListaArray(res)))
        .catch(() => {});
    }
  }, [programaFiltro, token]);

  useEffect(() => {
    carregarDados();
  }, [token]);

  // Lista garantida como array seguro
  const listaSeguraCandidaturas = useMemo(() => {
    return Array.isArray(candidaturas) ? candidaturas : [];
  }, [candidaturas]);

  // Filtragem de dados em memória
  const candidaturasFiltradas = useMemo(() => {
    return listaSeguraCandidaturas.filter((c) => {
      if (!c) return false;
      if (estadoFiltro !== 'TODOS' && c.estado !== estadoFiltro) return false;
      if (programaFiltro && String(c.programa_id) !== String(programaFiltro)) return false;
      if (cursoFiltro && String(c.curso_opcao1_id) !== String(cursoFiltro)) return false;
      if (distritoFiltro && c.distrito !== distritoFiltro) return false;

      if (pesquisa.trim()) {
        const termo = pesquisa.toLowerCase();
        const nome = (c.nome || '').toLowerCase();
        const bi = (c.bi || '').toLowerCase();
        const codigo = (c.codigo || '').toLowerCase();
        const email = (c.email || '').toLowerCase();
        const contacto = (c.contacto || '').toLowerCase();
        return (
          nome.includes(termo) ||
          bi.includes(termo) ||
          codigo.includes(termo) ||
          email.includes(termo) ||
          contacto.includes(termo)
        );
      }

      return true;
    });
  }, [listaSeguraCandidaturas, estadoFiltro, programaFiltro, cursoFiltro, distritoFiltro, pesquisa]);

  // Contadores KPI
  const stats = useMemo(() => {
    const total = listaSeguraCandidaturas.length;
    const pendentes = listaSeguraCandidaturas.filter((c) => c && c.estado === 'PENDENTE').length;
    const emAnalise = listaSeguraCandidaturas.filter((c) => c && c.estado === 'EM_ANALISE').length;
    const devolvidas = listaSeguraCandidaturas.filter((c) => c && (c.estado === 'DEVOLVIDA' || c.estado === 'CORRIGIDA')).length;
    const aprovadas = listaSeguraCandidaturas.filter((c) => c && c.estado === 'APROVADA').length;
    const rejeitadas = listaSeguraCandidaturas.filter((c) => c && c.estado === 'REJEITADA').length;
    const canceladas = listaSeguraCandidaturas.filter((c) => c && c.estado === 'CANCELADA').length;
    return { total, pendentes, emAnalise, devolvidas, aprovadas, rejeitadas, canceladas };
  }, [listaSeguraCandidaturas]);

  // Lógica de Paginação
  const totalPaginas = Math.ceil(candidaturasFiltradas.length / itensPorPagina) || 1;
  const candidaturasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return candidaturasFiltradas.slice(inicio, inicio + itensPorPagina);
  }, [candidaturasFiltradas, paginaAtual]);

  // Lógica de Seleção Múltipla
  const todosPaginaSelecionados = useMemo(() => {
    if (candidaturasPaginadas.length === 0) return false;
    return candidaturasPaginadas.every((c) => idsSelecionados.includes(c.id));
  }, [candidaturasPaginadas, idsSelecionados]);

  const toggleSelecionarTodosPagina = () => {
    if (todosPaginaSelecionados) {
      const idsPagina = candidaturasPaginadas.map((c) => c.id);
      setIdsSelecionados((prev) => prev.filter((id) => !idsPagina.includes(id)));
    } else {
      const idsPagina = candidaturasPaginadas.map((c) => c.id);
      setIdsSelecionados((prev) => Array.from(new Set([...prev, ...idsPagina])));
    }
  };

  const toggleSelecionarItem = (id) => {
    setIdsSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const desselecionarTodos = () => {
    setIdsSelecionados([]);
  };

  // ============================================================================
  // AÇÕES EM LOTE COM SWEETALERT2
  // ============================================================================
  const executarAprovacaoEmLote = async () => {
    if (idsSelecionados.length === 0) return;

    const result = await Swal.fire({
      title: 'Homologar Aprovação em Lote',
      html: `Confirma a aprovação oficial de <strong>${idsSelecionados.length}</strong> candidatura(s) selecionada(s)?<br/><small class="text-muted">Irá criar automaticamente as inscrições e registos de formandos.</small>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2d6a4f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Aprovar Todos',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'A processar aprovação...',
        text: 'A criar inscrições e registos no sistema...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await adminApi.aprovarEmLote(token, idsSelecionados);
        Swal.fire({
          title: 'Aprovação Concluída!',
          text: res.mensagem || `${res.total_sucesso || idsSelecionados.length} candidatura(s) aprovada(s) com sucesso.`,
          icon: 'success',
          confirmButtonColor: '#2d6a4f',
        });
        desselecionarTodos();
        carregarDados();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Aprovação',
          text: err.message || 'Falha ao processar aprovação em lote.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const executarReprovacaoEmLote = async () => {
    if (idsSelecionados.length === 0) return;

    const result = await Swal.fire({
      title: 'Reprovar Candidaturas em Lote',
      html: `Indique o motivo fundamentado para reprovar <strong>${idsSelecionados.length}</strong> candidatura(s):`,
      input: 'textarea',
      inputPlaceholder: 'Ex: Vagas preenchidas na totalidade ou não cumprimento dos requisitos do edital...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#bc4749',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmar Reprovação',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'O motivo da reprovação é obrigatório!';
        }
      },
    });

    if (result.isConfirmed && result.value) {
      Swal.fire({
        title: 'A processar reprovação...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await adminApi.reprovarEmLote(token, idsSelecionados, result.value);
        Swal.fire({
          title: 'Reprovação Registada!',
          text: res.mensagem || `${res.total_sucesso || idsSelecionados.length} candidatura(s) reprovada(s).`,
          icon: 'info',
          confirmButtonColor: '#2d6a4f',
        });
        desselecionarTodos();
        carregarDados();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Reprovação',
          text: err.message || 'Falha ao processar reprovação em lote.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const executarDevolucaoEmLote = async () => {
    if (idsSelecionados.length === 0) return;

    const result = await Swal.fire({
      title: 'Devolver para Correção',
      html: `Indique as divergências a serem corrigidas para <strong>${idsSelecionados.length}</strong> candidatura(s):`,
      input: 'textarea',
      inputPlaceholder: 'Ex: Documento de BI ilegível / Necessário certificado de habilitações...',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#6b21a8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Enviar para Correção',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'O motivo da devolução é obrigatório!';
        }
      },
    });

    if (result.isConfirmed && result.value) {
      Swal.fire({
        title: 'A notificar candidatos...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await adminApi.devolverEmLote(token, idsSelecionados, result.value);
        Swal.fire({
          title: 'Devolução Concluída!',
          text: res.mensagem || `${res.total_sucesso || idsSelecionados.length} candidatura(s) devolvida(s) para correção.`,
          icon: 'success',
          confirmButtonColor: '#2d6a4f',
        });
        desselecionarTodos();
        carregarDados();
      } catch (err) {
        Swal.fire({
          title: 'Erro na Devolução',
          text: err.message || 'Falha ao devolver candidaturas.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  return (
    <Container fluid className="py-1 font-sans" style={{ backgroundColor: '#f8faf9', minHeight: '100vh' }}>
      {/* CABEÇALHO DO PAINEL GERAL */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2 p-3 bg-success rounded-3 border border-light-subtle shadow-xs">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2.5 rounded-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#e8f5e9', color: '#1b4332' }}>
            <Users style={{ width: '28px', height: '28px' }} color='#1b4332'/>
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-white" style={{ color: '#1b4332' }}>
              Gestão Central de Candidaturas e Inscrições (CFP-STP)
            </h4>
            
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="light"
            onClick={carregarDados}
            disabled={carregando}
            className="d-flex align-items-center gap-1.5 fw-semibold border text-dark fs-7"
          >
            <RefreshCw style={{ width: '15px', height: '15px' }} className={carregando ? 'spin' : ''} />
            Atualizar
          </Button>
          
        </div>
      </div>

      {/* CARDS KPI COM CORES LEVES E SUAVES */}
      <Row className="g-2 mb-2">
        <Col xs={3} md={2} lg={2.4}>
          <Card className="border-2 shadow-xs bg-white rounded-3 h-100">
            <Card.Body className="p-3">
              <span className="text-muted fs-7 d-block text-uppercase fw-bold">Total Inscrições</span>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold text-dark">{stats.total}</span>
                <Badge bg="light" text="dark" className="border">100%</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={3} md={2} lg={2.4}>
          <Card className="border-2 shadow-xs bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #d97706' }}>
            <Card.Body className="p-3">
              <span className="fs-7 d-block text-uppercase fw-bold" style={{ color: '#b45309' }}>Pendentes</span>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#b45309' }}>{stats.pendentes}</span>
                <Clock style={{ width: '20px', height: '20px', color: '#d97706' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={3} md={2} lg={2.4}>
          <Card className="border-2 shadow-xs bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #0284c7' }}>
            <Card.Body className="p-3">
              <span className="fs-7 d-block text-uppercase fw-bold" style={{ color: '#0369a1' }}>Em Análise</span>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#0369a1' }}>{stats.emAnalise}</span>
                <Eye style={{ width: '20px', height: '20px', color: '#0284c7' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={3} md={2} lg={2.4}>
          <Card className="border-2 shadow-xs bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #2d6a4f' }}>
            <Card.Body className="p-3">
              <span className="fs-7 d-block text-uppercase fw-bold" style={{ color: '#1b4332' }}>Aprovadas</span>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#2d6a4f' }}>{stats.aprovadas}</span>
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#2d6a4f' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={3} md={2} lg={2.4}>
          <Card className="border-2 shadow-xs bg-white rounded-3 h-100" style={{ borderLeft: '4px solid #e63946' }}>
            <Card.Body className="p-3">
              <span className="fs-7 d-block text-uppercase fw-bold" style={{ color: '#991b1b' }}>Rejeitadas</span>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#991b1b' }}>{stats.rejeitadas}</span>
                <XCircle style={{ width: '20px', height: '20px', color: '#e63946' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* BARRA FLUTUANTE DE AÇÕES EM LOTE (QUANDO HÁ SELEÇÃO) */}
      {idsSelecionados.length > 0 && (
        <Card className="border-2 shadow-md mb-2 text-white animate-in fade-in" style={{ backgroundColor: '#1b4332', borderRadius: '12px' }}>
          <Card.Body className="py-2.5 px-4 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2">
              <Badge bg="light" text="dark" className="fs-6 px-2.5 py-1.5 rounded-pill fw-bold">
                {idsSelecionados.length}
              </Badge>
              <span className="fw-semibold fs-6">
                {idsSelecionados.length === 1 ? 'Candidatura Selecionada' : 'Candidaturas Selecionadas para Ação em Lote'}
              </span>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={executarAprovacaoEmLote}
                className="d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5"
                style={{ backgroundColor: '#52b788', borderColor: '#52b788', color: '#081c15' }}
              >
                <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                Aprovar Selecionados
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={executarReprovacaoEmLote}
                className="d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5"
                style={{ backgroundColor: '#e63946', borderColor: '#e63946' }}
              >
                <XCircle style={{ width: '16px', height: '16px' }} />
                Reprovar Selecionados
              </Button>

              <Button
                variant="warning"
                size="sm"
                onClick={executarDevolucaoEmLote}
                className="d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark"
                style={{ backgroundColor: '#f4a261', borderColor: '#f4a261' }}
              >
                <RotateCcw style={{ width: '16px', height: '16px' }} />
                Devolver p/ Correção
              </Button>

              <Button
                variant="outline-light"
                size="sm"
                onClick={desselecionarTodos}
                className="fw-semibold px-2.5 ms-2"
              >
                Desselecionar Todos
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* BARRA DE FILTROS E PESQUISA COM PROGRAMAS, CURSOS, ESTADOS E DISTRITOS */}
      <Card className="border-0 shadow-xs mb-3 bg-white rounded-3">
        <Card.Body className="p-3">
          <Row className="g-2 align-items-center">
            {/* Pesquisa por Texto */}
            <Col md={3}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-light border-end-0">
                  <Search style={{ width: '15px', height: '15px' }} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Pesquisar por Nome, BI, Código ou Telefone..."
                  value={pesquisa}
                  onChange={(e) => {
                    setPesquisa(e.target.value);
                    setPaginaAtual(1);
                  }}
                  className="border-start-0 fs-7"
                />
              </InputGroup>
            </Col>

            {/* Filtro por Estado */}
            <Col md={2}>
              <Form.Select
                size="sm"
                value={estadoFiltro}
                onChange={(e) => {
                  setEstadoFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="fs-7"
              >
                <option value="TODOS">Todos os Estados</option>
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="DEVOLVIDA">Devolvida / Corrigida</option>
                <option value="APROVADA">Aprovada</option>
                <option value="REJEITADA">Rejeitada</option>
                <option value="CANCELADA">Cancelada</option>
              </Form.Select>
            </Col>

            {/* Filtro por Programa */}
            <Col md={2}>
              <Form.Select
                size="sm"
                value={programaFiltro}
                onChange={(e) => {
                  setProgramaFiltro(e.target.value);
                  setCursoFiltro('');
                  setPaginaAtual(1);
                }}
                className="fs-7"
              >
                <option value="">Todos os Programas</option>
                {programas.map((prog) => (
                  <option key={prog.id} value={prog.id}>
                    {prog.nome || prog.sigla || `Programa #${prog.id}`}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Filtro por Curso */}
            <Col md={3}>
              <Form.Select
                size="sm"
                value={cursoFiltro}
                onChange={(e) => {
                  setCursoFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="fs-7"
              >
                <option value="">Todos os Cursos</option>
                {cursos.map((cur) => (
                  <option key={cur.id} value={cur.id}>
                    {cur.nome || cur.curso_nome || `Curso #${cur.id}`}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Filtro por Distrito */}
            <Col md={2}>
              <Form.Select
                size="sm"
                value={distritoFiltro}
                onChange={(e) => {
                  setDistritoFiltro(e.target.value);
                  setPaginaAtual(1);
                }}
                className="fs-7"
              >
                <option value="">Todos os Distritos</option>
                <option value="Água Grande">Água Grande</option>
                <option value="Mé-Zóchi">Mé-Zóchi</option>
                <option value="Cantagalo">Cantagalo</option>
                <option value="Caué">Caué</option>
                <option value="Lembá">Lembá</option>
                <option value="Lobata">Lobata</option>
                <option value="Pagué (Príncipe)">Pagué (Príncipe)</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Resumo e Botão de Limpar Filtros */}
          <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top fs-7">
            <span className="text-muted">
              A exibir <strong className="text-dark">{candidaturasFiltradas.length}</strong> de <strong className="text-dark">{listaSeguraCandidaturas.length}</strong> registos
            </span>
            {(pesquisa || estadoFiltro !== 'TODOS' || programaFiltro || cursoFiltro || distritoFiltro) && (
              <Button
                variant="link"
                size="sm"
                className="text-danger p-0 text-decoration-none fw-semibold fs-7 d-flex align-items-center gap-1"
                onClick={() => {
                  setPesquisa('');
                  setEstadoFiltro('TODOS');
                  setProgramaFiltro('');
                  setCursoFiltro('');
                  setDistritoFiltro('');
                  setPaginaAtual(1);
                }}
              >
                <XCircle style={{ width: '14px', height: '14px' }} />
                Limpar Todos os Filtros
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* TABELA PRINCIPAL DE CANDIDATURAS COM SELEÇÃO MÚLTIPLA */}
      <Card className="border-0 shadow-xs bg-white rounded-3">
        <Card.Body className="p-0">
          {carregando ? (
            <div className="text-center p-5">
              <Spinner animation="border" style={{ color: '#2d6a4f' }} />
              <p className="mt-2 text-muted fw-semibold fs-7">A carregar a listagem oficial de candidaturas...</p>
            </div>
          ) : candidaturasPaginadas.length > 0 ? (
            <Table responsive hover className="align-middle mb-0 fs-8">
              <thead  className="text-dark fw-semibold table-success" >
                <tr>
                  <th className="ps-3" style={{ width: '40px' }}>
                    <Form.Check
                      type="checkbox"
                      checked={todosPaginaSelecionados}
                      onChange={toggleSelecionarTodosPagina}
                      title="Selecionar Todos na Página"
                    />
                  </th>
                  <th>Código</th>
                  <th>Formando</th>
                  <th>Contacto </th>
                  <th>Curso</th>
                  <th>Estado</th>
                  <th>Data Inscrição</th>
                  <th className="text-end pe-4">Ação</th>
                </tr>
              </thead>
              <tbody>
                {candidaturasPaginadas.map((c) => {
                  const estaSelecionado = idsSelecionados.includes(c.id);
                  return (
                    <tr key={c.id} className={estaSelecionado ? 'table-success-subtle' : ''}>
                      <td className="ps-3">
                        <Form.Check
                          type="checkbox"
                          checked={estaSelecionado}
                          onChange={() => toggleSelecionarItem(c.id)}
                        />
                      </td>
                      <td className=' fs-9'>
                        <Badge className="bg-light text-dark   fs-9">{c.codigo}</Badge>
                        
                      </td>
                      <td>
                        <div className="">{c.nome}</div>
                        
                      </td>
                      <td>
                        <div className="">{c.contacto}</div>
                        
                      </td>
                      <td>
                        <div className="" style={{ color: '#1b4332' }}>
                          {c.curso_opcao1?.nome || c.curso_nome || 'Eletricidade e Instalações'}
                        </div>
                        
                      </td>
                      <td>
                        <StatusBadgeAdmin estado={c.estado} />
                      </td>
                      <td className="">
                        <Badge bg="light" text="dark" className="fs-8 px-2 py-1 rounded-pill">
                        {c.data_submissao || c.data_criacao || 'Recente'}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => setCandidaturaSelecionada(c)}
                          className="d-inline-flex align-items-center gap-1.5 fw-bold fs-8 border-success-subtle"
                          style={{ color: '#1b4332' }}
                        >
                          <Eye style={{ width: '14px', height: '14px' }} /> Ver Dossiê
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div className="text-center p-5 text-muted">
              <FileText style={{ width: '48px', height: '48px' }} className="mb-2 text-secondary" />
              <h5 className="fw-bold">Nenhuma candidatura encontrada</h5>
              <p className="mb-0 fs-7">Ajuste os filtros de pesquisa ou selecione outra opção.</p>
            </div>
          )}
        </Card.Body>

        {/* RODAPÉ DE PAGINAÇÃO DA TABELA */}
        {totalPaginas > 1 && (
          <Card.Footer className="bg-white border-top-0 d-flex align-items-center justify-content-between py-3 px-4">
            <span className="text-muted fs-7">
              Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
            </span>
            <Pagination className="mb-0 size-sm">
              <Pagination.Prev
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              />
              {[...Array(totalPaginas)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === paginaAtual}
                  onClick={() => setPaginaAtual(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* MODAL DOSSIÊ UNIFICADO COMPLETO */}
      {candidaturaSelecionada && (
        <AdminDossierModal
          candidatura={candidaturaSelecionada}
          candidaturasLista={candidaturasFiltradas}
          token={token}
          onClose={() => setCandidaturaSelecionada(null)}
          onNavigate={(proxima) => setCandidaturaSelecionada(proxima)}
          onAtualizar={carregarDados}
          aoNotificar={aoNotificar}
        />
      )}
    </Container>
  );
};

export default AdminGestaoView;
