import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Archive,
  Download,
  BarChart3,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { AdminDossierModal } from './AdminDossierModal';
import { adminApi } from '../services/adminApi';

export const AdminGestaoView = ({ token, aoNotificar, onAbrirEstatisticas }) => {
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

  // Paginação e Metadados do Servidor
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(20);
  const [totalRegistos, setTotalRegistos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [estatisticasBackend, setEstatisticasBackend] = useState(null);

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

  // Carregar candidaturas através do backend (com paginação e filtros oficiais)
  const carregarCandidaturas = useCallback(
    async (pagina = paginaAtual, porPagina = itensPorPagina) => {
      setCarregando(true);
      setErro(null);
      try {
        const filtros = {
          page: pagina,
          per_page: porPagina,
        };
        if (estadoFiltro !== 'TODOS') filtros.estado = estadoFiltro;
        if (programaFiltro) filtros.programa_id = programaFiltro;
        if (cursoFiltro) filtros.curso_id = cursoFiltro;
        if (distritoFiltro) filtros.distrito = distritoFiltro;
        if (pesquisa.trim()) filtros.pesquisa = pesquisa.trim();

        const res = await adminApi.listarCandidaturas(token, filtros);

        const lista = extrairListaArray(res);
        setCandidaturas(lista);

        // Tratamento estrito do formato do backend: { page, pages, per_page, total, items, estatisticas }
        if (res && typeof res.total === 'number') {
          setTotalRegistos(res.total);
          const pgs = Number(res.pages || res.total_paginas || Math.ceil(res.total / porPagina)) || 1;
          setTotalPaginas(pgs);
        } else {
          setTotalRegistos(lista.length);
          setTotalPaginas(Math.ceil(lista.length / porPagina) || 1);
        }

        if (res && res.estatisticas) {
          setEstatisticasBackend(res.estatisticas);
        }
      } catch (err) {
        console.error('Erro ao carregar lista de candidaturas:', err);
        setErro('Não foi possível conectar ao servidor. Verifique a sua ligação.');
        setCandidaturas([]);
        setTotalRegistos(0);
        setTotalPaginas(1);
      } finally {
        setCarregando(false);
      }
    },
    [token, estadoFiltro, programaFiltro, cursoFiltro, distritoFiltro, pesquisa]
  );

  // Carregar metadados iniciais (Programas e Cursos)
  const carregarDados = async () => {
    try {
      const [resProgramas, resCursos] = await Promise.all([
        adminApi.listarProgramas(token).catch(() => []),
        adminApi.listarCursos(token).catch(() => []),
      ]);
      setProgramas(extrairListaArray(resProgramas));
      setCursos(extrairListaArray(resCursos));
    } catch (err) {
      console.error('Erro ao carregar gestão de dossiês:', err);
    }
    await carregarCandidaturas(paginaAtual, itensPorPagina);
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

  // Carregar candidaturas sempre que a página, quantidade por página ou filtros mudarem
  useEffect(() => {
    carregarCandidaturas(paginaAtual, itensPorPagina);
  }, [carregarCandidaturas, paginaAtual, itensPorPagina]);

  // Reset de página sempre que qualquer filtro mudar
  useEffect(() => {
    setPaginaAtual(1);
  }, [estadoFiltro, programaFiltro, cursoFiltro, distritoFiltro, pesquisa]);

  // Lista de candidaturas da página atual
  const listaSeguraCandidaturas = useMemo(() => {
    return Array.isArray(candidaturas) ? candidaturas : [];
  }, [candidaturas]);

  // Contadores KPI Dinâmicos
  const stats = useMemo(() => {
    const temFiltroAtivo = Boolean(
      pesquisa.trim() ||
      estadoFiltro !== 'TODOS' ||
      programaFiltro ||
      cursoFiltro ||
      distritoFiltro
    );

    if (estatisticasBackend) {
      return {
        total: totalRegistos,
        totalSegmento: totalRegistos,
        totalGeral: estatisticasBackend.total || totalRegistos,
        pendentes: estatisticasBackend.pendentes || 0,
        emAnalise: estatisticasBackend.em_analise || 0,
        devolvidas: (estatisticasBackend.devolvidas || 0) + (estatisticasBackend.corrigidas || 0),
        aprovadas: estatisticasBackend.aprovadas || 0,
        rejeitadas: estatisticasBackend.rejeitadas || 0,
        canceladas: estatisticasBackend.canceladas || 0,
        temFiltroAtivo,
      };
    }

    const base = listaSeguraCandidaturas;
    return {
      total: totalRegistos || base.length,
      totalSegmento: totalRegistos || base.length,
      totalGeral: totalRegistos || base.length,
      pendentes: base.filter((c) => c && c.estado === 'PENDENTE').length,
      emAnalise: base.filter((c) => c && c.estado === 'EM_ANALISE').length,
      devolvidas: base.filter((c) => c && (c.estado === 'DEVOLVIDA' || c.estado === 'CORRIGIDA')).length,
      aprovadas: base.filter((c) => c && (c.estado === 'APROVADA' || c.estado === 'APROVADO')).length,
      rejeitadas: base.filter((c) => c && (c.estado === 'REJEITADA' || c.estado === 'REJEITADO' || c.estado === 'REPROVADA')).length,
      canceladas: base.filter((c) => c && c.estado === 'CANCELADA').length,
      temFiltroAtivo,
    };
  }, [estatisticasBackend, totalRegistos, listaSeguraCandidaturas, pesquisa, estadoFiltro, programaFiltro, cursoFiltro, distritoFiltro]);

  // Candidaturas exibidas na tabela são diretamente as da página atual obtidas do backend
  const candidaturasPaginadas = listaSeguraCandidaturas;
  const candidaturasFiltradas = listaSeguraCandidaturas;

  // Ajuste automático caso a página atual exceda o total de páginas
  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(Math.max(1, totalPaginas));
    }
  }, [paginaAtual, totalPaginas]);

  // Gerador de botões inteligentes de paginação (com elipses ...)
  const gerarBotoesPaginacao = () => {
    const delta = 1;
    const range = [];
    const rangeComPontos = [];
    let l;

    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaAtual - delta && i <= paginaAtual + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeComPontos.push(l + 1);
        } else if (i - l !== 1) {
          rangeComPontos.push('...');
        }
      }
      rangeComPontos.push(i);
      l = i;
    }

    return rangeComPontos;
  };

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

  const [processandoZip, setProcessandoZip] = useState(false);

  // 5.6. Baixar Grupo de Dossiês em Ficheiro ZIP (Múltiplos Formandos por ID)
  const executarDownloadZipEmLote = async () => {
    if (idsSelecionados.length === 0) return;

    Swal.fire({
      title: 'A gerar ficheiro ZIP...',
      html: `A agrupar os dossiês unificados oficiais de <strong>${idsSelecionados.length}</strong> formando(s)...<br/><small class="text-muted">Ordem oficial CFP: Ficha, B.I., NIF, Habilitações e Certificados.</small>`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    setProcessandoZip(true);
    try {
      const candidatosSelecionados = candidaturas.filter((c) => idsSelecionados.includes(c.id));
      await adminApi.baixarDossiesZip(token, idsSelecionados, candidatosSelecionados);
      Swal.fire({
        title: 'ZIP Concluído!',
        text: `O arquivo ZIP com os dossiês de ${idsSelecionados.length} formando(s) foi transferido com sucesso.`,
        icon: 'success',
        confirmButtonColor: '#1b4332',
      });
    } catch (err) {
      Swal.fire({
        title: 'Erro no Download ZIP',
        text: err.message || 'Falha ao descarregar grupo de dossiês em ZIP.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    } finally {
      setProcessandoZip(false);
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
          {onAbrirEstatisticas && (
            <Button
              variant="outline-light"
              onClick={onAbrirEstatisticas}
              className="d-flex align-items-center gap-1.5 fw-semibold fs-7 border-light-subtle"
            >
              <BarChart3 style={{ width: '15px', height: '15px' }} />
              Inscrições & Estatísticas
            </Button>
          )}

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

      {/* CARDS KPI COM CORES EM TONS DE VERDE (DINÂMICOS CONFORME OS FILTROS) */}
      <Row className="g-2 mb-2">
        <Col xs={6} md={4} lg className="col-lg">
          <Card
            className={`shadow-xs bg-white rounded-3 h-100 transition-all ${
              estadoFiltro === 'TODOS' ? 'shadow-sm' : ''
            }`}
            style={{
              border: estadoFiltro === 'TODOS' ? '2px solid #1b4332' : '1px solid #d8f3dc',
              borderLeft: '4px solid #1b4332',
              backgroundColor: estadoFiltro === 'TODOS' ? '#eaf5ee' : '#ffffff',
              cursor: 'pointer',
            }}
            onClick={() => setEstadoFiltro('TODOS')}
            title="Clique para exibir todos os estados das inscrições filtradas"
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-7 text-uppercase fw-bold" style={{ color: '#1b4332' }}>Total Inscrições</span>
                {estadoFiltro === 'TODOS' ? (
                  <span className="badge badge-cfp-dark fs-8 py-0.5 px-2 rounded-pill">Ativo</span>
                ) : (
                  <span className="badge bg-light text-dark border fs-8">Geral</span>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#1b4332' }}>{stats.total}</span>
                {stats.temFiltroAtivo ? (
                  <span className="badge badge-cfp-light border fw-semibold fs-8">
                    {stats.totalGeral > 0 ? `${Math.round((stats.total / stats.totalGeral) * 100)}%` : '100%'}
                  </span>
                ) : (
                  <span className="badge bg-light text-dark border fs-8">100%</span>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={4} lg className="col-lg">
          <Card
            className={`shadow-xs bg-white rounded-3 h-100 transition-all ${
              estadoFiltro === 'PENDENTE' ? 'shadow-sm' : ''
            }`}
            style={{
              border: estadoFiltro === 'PENDENTE' ? '2px solid #40916c' : '1px solid #e2ede6',
              borderLeft: '4px solid #40916c',
              cursor: 'pointer',
              backgroundColor: estadoFiltro === 'PENDENTE' ? '#f0f7f4' : '#ffffff',
            }}
            onClick={() => setEstadoFiltro(estadoFiltro === 'PENDENTE' ? 'TODOS' : 'PENDENTE')}
            title="Clique para filtrar apenas inscrições pendentes"
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-7 text-uppercase fw-bold" style={{ color: '#2d6a4f' }}>Pendentes</span>
                {estadoFiltro === 'PENDENTE' ? (
                  <span className="badge badge-cfp-medium fs-8 py-0.5 px-2 rounded-pill">Filtrado</span>
                ) : (
                  <span className="badge badge-cfp-subtle fs-8">
                    {stats.totalSegmento > 0 ? `${Math.round((stats.pendentes / stats.totalSegmento) * 100)}%` : '0%'}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#2d6a4f' }}>{stats.pendentes}</span>
                <Clock style={{ width: '20px', height: '20px', color: '#40916c' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={4} lg className="col-lg">
          <Card
            className={`shadow-xs bg-white rounded-3 h-100 transition-all ${
              estadoFiltro === 'EM_ANALISE' ? 'shadow-sm' : ''
            }`}
            style={{
              border: estadoFiltro === 'EM_ANALISE' ? '2px solid #2d6a4f' : '1px solid #e2ede6',
              borderLeft: '4px solid #2d6a4f',
              cursor: 'pointer',
              backgroundColor: estadoFiltro === 'EM_ANALISE' ? '#eaf5ee' : '#ffffff',
            }}
            onClick={() => setEstadoFiltro(estadoFiltro === 'EM_ANALISE' ? 'TODOS' : 'EM_ANALISE')}
            title="Clique para filtrar apenas inscrições em análise"
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-7 text-uppercase fw-bold" style={{ color: '#1b4332' }}>Em Análise</span>
                {estadoFiltro === 'EM_ANALISE' ? (
                  <span className="badge badge-cfp-emerald fs-8 py-0.5 px-2 rounded-pill">Filtrado</span>
                ) : (
                  <span className="badge badge-cfp-light fs-8">
                    {stats.totalSegmento > 0 ? `${Math.round((stats.emAnalise / stats.totalSegmento) * 100)}%` : '0%'}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#1b4332' }}>{stats.emAnalise}</span>
                <Eye style={{ width: '20px', height: '20px', color: '#2d6a4f' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6} lg className="col-lg">
          <Card
            className={`shadow-xs bg-white rounded-3 h-100 transition-all ${
              estadoFiltro === 'APROVADA' ? 'shadow-sm' : ''
            }`}
            style={{
              border: estadoFiltro === 'APROVADA' ? '2px solid #1b4332' : '1px solid #e2ede6',
              borderLeft: '4px solid #1b4332',
              cursor: 'pointer',
              backgroundColor: estadoFiltro === 'APROVADA' ? '#c8eed5' : '#ffffff',
            }}
            onClick={() => setEstadoFiltro(estadoFiltro === 'APROVADA' ? 'TODOS' : 'APROVADA')}
            title="Clique para filtrar apenas inscrições aprovadas"
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-7 text-uppercase fw-bold" style={{ color: '#0f3822' }}>Aprovadas</span>
                {estadoFiltro === 'APROVADA' ? (
                  <span className="badge badge-cfp-dark fs-8 py-0.5 px-2 rounded-pill">Filtrado</span>
                ) : (
                  <span className="badge badge-cfp-mint fs-8">
                    {stats.totalSegmento > 0 ? `${Math.round((stats.aprovadas / stats.totalSegmento) * 100)}%` : '0%'}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#0f3822' }}>{stats.aprovadas}</span>
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#1b4332' }} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={6} md={6} lg className="col-lg">
          <Card
            className={`shadow-xs bg-white rounded-3 h-100 transition-all ${
              estadoFiltro === 'REJEITADA' ? 'shadow-sm' : ''
            }`}
            style={{
              border: estadoFiltro === 'REJEITADA' ? '2px solid #244b38' : '1px solid #e2ede6',
              borderLeft: '4px solid #244b38',
              cursor: 'pointer',
              backgroundColor: estadoFiltro === 'REJEITADA' ? '#edf2ee' : '#ffffff',
            }}
            onClick={() => setEstadoFiltro(estadoFiltro === 'REJEITADA' ? 'TODOS' : 'REJEITADA')}
            title="Clique para filtrar apenas inscrições rejeitadas"
          >
            <Card.Body className="p-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fs-7 text-uppercase fw-bold" style={{ color: '#1c3829' }}>Rejeitadas</span>
                {estadoFiltro === 'REJEITADA' ? (
                  <span className="badge badge-cfp-dark fs-8 py-0.5 px-2 rounded-pill" style={{ backgroundColor: '#244b38' }}>Filtrado</span>
                ) : (
                  <span className="badge badge-cfp-muted fs-8">
                    {stats.totalSegmento > 0 ? `${Math.round((stats.rejeitadas / stats.totalSegmento) * 100)}%` : '0%'}
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center justify-content-between mt-1">
                <span className="fs-3 fw-bold" style={{ color: '#1c3829' }}>{stats.rejeitadas}</span>
                <XCircle style={{ width: '20px', height: '20px', color: '#244b38' }} />
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
              <span className="badge bg-white text-dark fs-6 px-2.5 py-1.5 rounded-pill fw-bold">
                {idsSelecionados.length}
              </span>
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
                variant="light"
                size="sm"
                onClick={executarDownloadZipEmLote}
                disabled={processandoZip}
                className="d-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 text-dark shadow-xs"
                style={{ backgroundColor: '#e2ece9', borderColor: '#b7d5cb' }}
                title="Descarregar arquivo ZIP com os Dossiês Unificados em PDF dos candidatos selecionados"
              >
                {processandoZip ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <Archive style={{ width: '16px', height: '16px', color: '#1b4332' }} />
                )}
                <span>Baixar Dossiês (ZIP)</span>
                <span className="badge badge-cfp-dark ms-1 fs-8">
                  {idsSelecionados.length}
                </span>
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
                        <span className="badge bg-light text-dark border fs-9">{c.codigo}</span>
                        
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
                        <span className="badge bg-light text-dark border fs-8 px-2 py-1 rounded-pill">
                          {c.data_submissao || c.data_criacao || 'Recente'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex align-items-center gap-1.5">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => setCandidaturaSelecionada(c)}
                            className="d-inline-flex align-items-center gap-1.5 fw-bold fs-8 border-success-subtle"
                            style={{ color: '#1b4332' }}
                            title="Visualizar dossiê completo do candidato"
                          >
                            <Eye style={{ width: '14px', height: '14px' }} /> Ver Dossiê
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => adminApi.baixarDossieCompletoPdf(token, c)}
                            className="d-inline-flex align-items-center gap-1 fs-8 border-secondary-subtle p-1.5 rounded-3"
                            title="Baixar Dossiê Completo Unificado em PDF (Ordem Oficial CFP)"
                          >
                            <Download style={{ width: '13px', height: '13px' }} />
                          </Button>
                        </div>
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

        {/* RODAPÉ DE PAGINAÇÃO ROBUSTA DA TABELA */}
        <Card.Footer className="bg-white border-top d-flex flex-wrap align-items-center justify-content-between gap-3 py-3 px-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <span className="text-muted fs-7">
              A exibir{' '}
              <strong>
                {totalRegistos === 0
                  ? 0
                  : (paginaAtual - 1) * itensPorPagina + 1}
              </strong>{' '}
              a{' '}
              <strong>
                {totalRegistos === 0
                  ? 0
                  : Math.min((paginaAtual - 1) * itensPorPagina + candidaturas.length, totalRegistos)}
              </strong>{' '}
              de <strong>{totalRegistos}</strong> registos
              {stats.temFiltroAtivo && (
                <span className="text-secondary ms-1">
                  (filtrado de {stats.totalGeral} no total)
                </span>
              )}
            </span>

            {/* Seletor de itens por página */}
            <div className="d-flex align-items-center gap-1.5 ms-sm-2">
              <span className="text-muted fs-8">Exibir:</span>
              <Form.Select
                size="sm"
                value={itensPorPagina}
                onChange={(e) => {
                  setItensPorPagina(Number(e.target.value));
                  setPaginaAtual(1);
                }}
                style={{ width: '80px', height: '30px', fontSize: '0.8rem' }}
                className="py-0 px-2 rounded-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
            </div>
          </div>

          {totalPaginas > 1 && (
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted fs-8 d-none d-md-inline">
                Página <strong>{paginaAtual}</strong> de <strong>{totalPaginas}</strong>
              </span>
              <Pagination className="mb-0 size-sm">
                <Pagination.First
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(1)}
                  title="Primeira página"
                />
                <Pagination.Prev
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
                  title="Página anterior"
                />
                {gerarBotoesPaginacao().map((item, idx) => {
                  if (item === '...') {
                    return <Pagination.Ellipsis key={`ellipsis-${idx}`} disabled />;
                  }
                  return (
                    <Pagination.Item
                      key={item}
                      active={item === paginaAtual}
                      onClick={() => setPaginaAtual(item)}
                    >
                      {item}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))}
                  title="Página seguinte"
                />
                <Pagination.Last
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(totalPaginas)}
                  title="Última página"
                />
              </Pagination>
            </div>
          )}
        </Card.Footer>
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
