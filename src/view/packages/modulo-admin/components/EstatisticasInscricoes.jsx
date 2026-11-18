import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  Spinner,
  ProgressBar,
  Modal,
  Nav,
  Tab,
} from 'react-bootstrap';
import {
  BarChart3,
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Layers,
  Filter,
  RefreshCw,
  Download,
  Printer,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  Award,
  BookOpen,
  PieChart,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { adminApi, descarregarRelatorioEstatistico } from '../services/adminApi';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';


export const EstatisticasInscricoes = ({ token, aoNotificar }) => {
  const [carregando, setCarregando] = useState(true);
  const [dadosEstatisticas, setDadosEstatisticas] = useState(null);
  const [erro, setErro] = useState(null);

  // Modo de visualização da estrutura etária: 'grafico' | 'tabela'
  const [visualizacaoEtaria, setVisualizacaoEtaria] = useState('grafico');

  // Sub-Aba Ativa: 'demografia' | 'cursos' | 'inscricoes'
  const [abaAtiva, setAbaAtiva] = useState('demografia');

  // Filtros Dinâmicos
  const [ano, setAno] = useState('2026');
  const [programaId, setProgramaId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [distrito, setDistrito] = useState('');
  const [sexo, setSexo] = useState('');
  const [opcao, setOpcao] = useState('');
  const [status, setStatus] = useState('');

  // Listas de opções auxiliares
  const [programas, setProgramas] = useState([]);
  const [cursos, setCursos] = useState([]);

  // Modal Raio-X do Curso
  const [cursoRaioX, setCursoRaioX] = useState(null);

  // Pesquisa na lista nominal
  const [pesquisaNominal, setPesquisaNominal] = useState('');

  // Carregar dados auxiliares (programas e cursos)
  useEffect(() => {
    adminApi.listarProgramas(token)
      .then((res) => {
        const lista = Array.isArray(res) ? res : res?.programas || res?.items || [];
        setProgramas(lista);
      })
      .catch(() => {});

    adminApi.listarCursos(token)
      .then((res) => {
        const lista = Array.isArray(res) ? res : res?.cursos || res?.items || [];
        setCursos(lista);
      })
      .catch(() => {});
  }, [token]);

  // Carregar estatísticas do backend
  const carregarEstatisticas = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const filtros = {
        ano: ano || undefined,
        programa_id: programaId || undefined,
        curso_id: cursoId || undefined,
        distrito: distrito || undefined,
        sexo: sexo || undefined,
        opcao: opcao || undefined,
        status: status || undefined,
      };

      const res = await adminApi.obterEstatisticasPorCurso(token, filtros);
      setDadosEstatisticas(res);
    } catch (err) {
      console.error('[Estatisticas] Erro ao carregar:', err);
      setErro(err.message || 'Erro ao carregar dados estatísticos.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas();
  }, [ano, programaId, cursoId, distrito, sexo, opcao, status]);

  // Limpar Filtros
  const limparFiltros = () => {
    setAno('2026');
    setProgramaId('');
    setCursoId('');
    setDistrito('');
    setSexo('');
    setOpcao('');
    setStatus('');
  };

  // Exportar Excel
  const exportarExcel = () => {
    if (!dadosEstatisticas) return;
    try {
      adminApi.exportarEstatisticasExcel(dadosEstatisticas, `Estatisticas_Inscricoes_CFP_${ano || '2026'}`);
      Swal.fire({
        icon: 'success',
        title: 'Exportação Concluída',
        text: 'A folha de cálculo Excel foi transferida com 3 abas detalhadas.',
        timer: 3000,
        confirmButtonColor: '#1b4332',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro na Exportação',
        text: err.message || 'Falha ao gerar ficheiro Excel.',
      });
    }
  };

  // Emitir Relatório Estatístico Oficial em PDF gerado 100% no backend
  const emitirPdfOficial = (tipo = 'geral', download = 1, abrirEmNovaAba = false) => {
    try {
      descarregarRelatorioEstatistico({
        tipo,
        ano: ano ,
        cursoId,
        programaId,
        download,
        abrirEmNovaAba,
        token,
      });
      if (aoNotificar && download) {
        aoNotificar({
          tipo: 'sucesso',
          texto: 'A transferir o Relatório Oficial em PDF emitido pelo backend...',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Falha na Emissão',
        text: err.message || 'Erro ao comunicar com a rota de relatórios.',
      });
    }
  };

  // Imprimir Relatório
  const imprimirRelatorio = () => {
    window.print();
  };

  const dg = dadosEstatisticas?.dados_gerais || {};
  const porCurso = dadosEstatisticas?.por_curso || [];
  const listaNominal = dadosEstatisticas?.inscricoes_lista || [];

  // Filtragem da lista nominal em memória
  const listaNominalFiltrada = useMemo(() => {
    if (!pesquisaNominal.trim()) return listaNominal;
    const q = pesquisaNominal.toLowerCase();
    return listaNominal.filter((i) => {
      return (
        (i.nome || '').toLowerCase().includes(q) ||
        (i.bi || '').toLowerCase().includes(q) ||
        (i.codigo || '').toLowerCase().includes(q) ||
        (i.curso_nome || '').toLowerCase().includes(q) ||
        (i.distrito || '').toLowerCase().includes(q)
      );
    });
  }, [listaNominal, pesquisaNominal]);

  // Mapeamentos para labels de distritos (Tons harmoniosos de verde)
  const labelsDistritos = [
    { key: 'agua_grande', nome: 'Água Grande', cor: '#0f3822' },
    { key: 'me_zochi', nome: 'Mé-Zóchi', cor: '#1b4332' },
    { key: 'cantagalo', nome: 'Cantagalo', cor: '#2d6a4f' },
    { key: 'lemba', nome: 'Lembá', cor: '#40916c' },
    { key: 'caue', nome: 'Caué', cor: '#52b788' },
    { key: 'rap', nome: 'Região Autónoma do Príncipe (RAP)', cor: '#74c69d' },
    { key: 'lobata', nome: 'Lobata', cor: '#95d5b2' },
  ];

  // Mapeamentos para faixas etárias
  const labelsFaixasEtarias = [
    { key: 'faixa_14_17', nome: '14 - 17 anos', desc: 'Adolescentes' },
    { key: 'faixa_18_24', nome: '18 - 24 anos', desc: 'Jovens Prioritários' },
    { key: 'faixa_25_30', nome: '25 - 30 anos', desc: 'Jovens Adultos' },
    { key: 'faixa_31_35', nome: '31 - 35 anos', desc: 'Adultos Emergentes' },
    { key: 'faixa_36_40', nome: '36 - 40 anos', desc: 'Adultos Plenos' },
    { key: 'faixa_41_45', nome: '41 - 45 anos', desc: 'Adultos Qualificados' },
    { key: 'faixa_46_50', nome: '46 - 50 anos', desc: 'Reconversão Profissional' },
    { key: 'faixa_mais_50', nome: '+50 anos', desc: 'Aprendizagem Contínua' },
  ];

  // Mapeamentos para habilitações literárias (Tons graduais de verde)
  const labelsHabilitacoes = [
    { key: 'hab_4_6', nome: '4.º ao 6.º Ano', desc: 'Ensino Básico Primário', cor: '#95d5b2' },
    { key: 'hab_7_9', nome: '7.º ao 9.º Ano', desc: 'Ensino Básico Preparatório', cor: '#74c69d' },
    { key: 'hab_10_12', nome: '10.º ao 12.º Ano', desc: 'Ensino Secundário', cor: '#40916c' },
    { key: 'hab_media', nome: 'Médio / Técnico', desc: 'Ensino Técnico-Profissional', cor: '#2d6a4f' },
    { key: 'hab_superior', nome: 'Ensino Superior', desc: 'Bacharelato / Licenciatura', cor: '#1b4332' },
  ];

  const maxDistritoVal = Math.max(...labelsDistritos.map((d) => dg.distritos?.[d.key] || 0), 1);
  const maxFaixaVal = Math.max(...labelsFaixasEtarias.map((f) => dg.faixas_etarias?.[f.key] || 0), 1);
  const maxHabVal = Math.max(...labelsHabilitacoes.map((h) => dg.habilitacoes?.[h.key] || 0), 1);

  return (
    <div className="w-100 font-sans pb-5">
      {/* CABEÇALHO DO MÓDULO E AÇÕES DE EXPORTAÇÃO */}
      <div
        className="p-4 mb-3 rounded-4 shadow-sm text-white d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="p-3 rounded-3 bg-white bg-opacity-10 d-flex align-items-center justify-content-center"
            style={{ width: '56px', height: '56px' }}
          >
            <BarChart3 className="text-white" style={{ width: '32px', height: '32px' }} />
          </div>
          <div>
            <h3 className="fw-bold mb-1 text-white">
              Painel Estatístico de Inscrições e Procura Formativa
            </h3>
            <p className="mb-0 text-light opacity-75 fs-7">
              Centro de Formação Profissional de São Tomé e Príncipe (CFP-STP) — Análise Demográfica, Procura e Indicadores
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2">
          <Button
            variant="light"
            onClick={carregarEstatisticas}
            disabled={carregando}
            className="d-flex align-items-center gap-1.5 fw-semibold border text-dark fs-7 rounded-3"
          >
            <RefreshCw style={{ width: '15px', height: '15px' }} className={carregando ? 'spin' : ''} />
            Atualizar
          </Button>

          <Button
            variant="outline-light"
            onClick={exportarExcel}
            disabled={carregando}
            className="d-flex align-items-center gap-1.5 fw-semibold fs-7 rounded-3"
          >
            <FileSpreadsheet style={{ width: '15px', height: '15px' }} />
            Exportar Excel (.xlsx)
          </Button>

          <Button
            variant="light"
            onClick={() => emitirPdfOficial(cursoId ? 'curso' : (programaId ? 'programa' : 'geral'), 1, false)}
            disabled={carregando}
            className="d-flex align-items-center gap-1.5 fw-semibold fs-7 rounded-3 text-dark bg-white shadow-xs border"
            title="Descarregar relatório estatístico oficial formatado em A4 gerado no backend"
          >
            <Download style={{ width: '15px', height: '15px', color: '#166534' }} />
            Relatório Oficial (PDF)
          </Button>

          <Button
            variant="outline-light"
            onClick={() => emitirPdfOficial(cursoId ? 'curso' : (programaId ? 'programa' : 'geral'), 0, true)}
            disabled={carregando}
            className="d-flex align-items-center gap-1.5 fw-semibold fs-7 rounded-3"
            title="Visualizar em nova aba do navegador"
          >
            <ExternalLink style={{ width: '15px', height: '15px' }} />
            Visualizar PDF
          </Button>
        </div>
      </div>

      {/* BARRA DE FILTROS DINÂMICOS (COMBINADOS) */}
      <Card className="border-0 shadow-sm rounded-4 bg-white mb-3">
        <Card.Body className="p-3">
          <Row className="g-2 align-items-end">
            <Col xs={6} md={2}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Ano Letivo</Form.Label>
                <Form.Select size="sm" value={ano} onChange={(e) => setAno(e.target.value)} className="rounded-3">
                  <option value="2026">2026 (Atual)</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="">Todos os Anos</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={6} md={2}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Programa</Form.Label>
                <Form.Select size="sm" value={programaId} onChange={(e) => setProgramaId(e.target.value)} className="rounded-3">
                  <option value="">Todos os Programas</option>
                  {programas.map((p) => (
                    <option key={p.id || p.ID} value={p.id || p.ID}>
                      {p.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Curso Específico</Form.Label>
                <Form.Select size="sm" value={cursoId} onChange={(e) => setCursoId(e.target.value)} className="rounded-3">
                  <option value="">Todos os Cursos Oficiais</option>
                  {cursos.map((c) => (
                    <option key={c.id || c.ID} value={c.id || c.ID}>
                      {c.nome} ({c.acao || 'Ação'})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={6} md={2}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Distrito (STP)</Form.Label>
                <Form.Select size="sm" value={distrito} onChange={(e) => setDistrito(e.target.value)} className="rounded-3">
                  <option value="">Todos os Distritos</option>
                  <option value="Água Grande">Água Grande</option>
                  <option value="Mé-Zóchi">Mé-Zóchi</option>
                  <option value="Cantagalo">Cantagalo</option>
                  <option value="Lembá">Lembá</option>
                  <option value="Caué">Caué</option>
                  <option value="Lobata">Lobata</option>
                  <option value="RAP">Pagué (Príncipe)</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={6} md={1.5}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Sexo</Form.Label>
                <Form.Select size="sm" value={sexo} onChange={(e) => setSexo(e.target.value)} className="rounded-3">
                  <option value="">Ambos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={6} md={1.5}>
              <Form.Group>
                <Form.Label className="fs-8 text-muted fw-bold text-uppercase mb-1">Opção</Form.Label>
                <Form.Select size="sm" value={opcao} onChange={(e) => setOpcao(e.target.value)} className="rounded-3">
                  <option value="">Todas</option>
                  <option value="1">1.ª Opção</option>
                  <option value="2">2.ª Opção</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top fs-8 text-muted">
            <div className="d-flex align-items-center gap-2">
              <Filter style={{ width: '14px', height: '14px', color: '#1b4332' }} />
              <span>
                Filtros ativos:{' '}
                <strong>
                  {ano ? `Ano: ${ano}` : ''}
                  {programaId ? ` | Programa: #${programaId}` : ''}
                  {cursoId ? ` | Curso: #${cursoId}` : ''}
                  {distrito ? ` | Distrito: ${distrito}` : ''}
                  {sexo ? ` | Sexo: ${sexo}` : ''}
                  {opcao ? ` | ${opcao}ª Opção` : ''}
                  {!ano && !programaId && !cursoId && !distrito && !sexo && !opcao ? 'Nenhum filtro aplicado (Dados Globais)' : ''}
                </strong>
              </span>
            </div>

            {(programaId || cursoId || distrito || sexo || opcao || ano !== '2026') && (
              <Button variant="link" size="sm" onClick={limparFiltros} className="text-danger p-0 text-decoration-none fw-semibold fs-8">
                Limpar Todos os Filtros
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* NAVEGAÇÃO DE SUB-ABAS ESTRATÉGICAS */}
      <Nav variant="pills" className="bg-white p-1.5 rounded-4 shadow-sm mb-3 gap-2 border">
        <Nav.Item>
          <Nav.Link
            active={abaAtiva === 'demografia'}
            onClick={() => setAbaAtiva('demografia')}
            className={`d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3 ${
              abaAtiva === 'demografia' ? 'text-white' : 'text-dark'
            }`}
            style={{ backgroundColor: abaAtiva === 'demografia' ? '#1b4332' : 'transparent' }}
          >
            <PieChart style={{ width: '16px', height: '16px' }} />
            1. Dados Gerais & Demografia
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            active={abaAtiva === 'cursos'}
            onClick={() => setAbaAtiva('cursos')}
            className={`d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3 ${
              abaAtiva === 'cursos' ? 'text-white' : 'text-dark'
            }`}
            style={{ backgroundColor: abaAtiva === 'cursos' ? '#1b4332' : 'transparent' }}
          >
            <Layers style={{ width: '16px', height: '16px' }} />
            2. Comparativo por Cursos ({porCurso.length})
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            active={abaAtiva === 'inscricoes'}
            onClick={() => setAbaAtiva('inscricoes')}
            className={`d-flex align-items-center gap-2 fw-semibold px-3 py-2 rounded-3 ${
              abaAtiva === 'inscricoes' ? 'text-white' : 'text-dark'
            }`}
            style={{ backgroundColor: abaAtiva === 'inscricoes' ? '#1b4332' : 'transparent' }}
          >
            <Users style={{ width: '16px', height: '16px' }} />
            3. Lista Nominal de Inscrições ({listaNominal.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {carregando ? (
        <Card className="border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <Spinner animation="border" variant="success" className="mx-auto mb-3" style={{ color: '#1b4332' }} />
          <h5 className="fw-bold text-dark">A consolidar dados estatísticos...</h5>
          <p className="text-muted fs-7 mb-0">A processar distribuições demográficas e rácios relacionais.</p>
        </Card>
      ) : erro ? (
        <Card className="border-0 shadow-sm rounded-4 p-4 text-center bg-white text-danger">
          <p className="mb-2 fw-bold">{erro}</p>
          <Button variant="outline-success" size="sm" onClick={carregarEstatisticas} className="mx-auto">
            Tentar Novamente
          </Button>
        </Card>
      ) : (
        <>
          {/* ============================================================== */}
          {/* SUB-ABA 1: DADOS GERAIS & DEMOGRAFIA                          */}
          {/* ============================================================== */}
          {abaAtiva === 'demografia' && (
            <div className="space-y-3">
              {/* CARTÕES KPI MACRO */}
              <Row className="g-2 mb-3">
                <Col xs={6} md={3}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100 p-3">
                    <span className="text-muted fs-8 text-uppercase fw-bold">Total Inscritos</span>
                    <div className="d-flex align-items-baseline justify-content-between mt-2">
                      <span className="fs-2 fw-bold text-dark">{dg.total_inscritos || 0}</span>
                      <span className="badge badge-cfp-light border fw-semibold fs-8">
                        {dg.total_cursos_ativos || 0} Cursos
                      </span>
                    </div>
                    <span className="fs-8 text-muted mt-1 d-block">
                      1ª Opção: <strong>{dg.primeira_opcao || 0}</strong> | 2ª Opção: <strong>{dg.segunda_opcao || 0}</strong>
                    </span>
                  </Card>
                </Col>

                <Col xs={6} md={3}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100 p-3" style={{ borderLeft: '4px solid #1b4332' }}>
                    <span className="text-muted fs-8 text-uppercase fw-bold">Vagas vs Ocupação</span>
                    <div className="d-flex align-items-baseline justify-content-between mt-2">
                      <span className="fs-2 fw-bold" style={{ color: '#1b4332' }}>{dg.taxa_ocupacao_geral || 0}%</span>
                      <span className="badge badge-cfp-light border fs-8">
                        {dg.vagas_totais || 0} Vagas
                      </span>
                    </div>
                    <span className="fs-8 text-muted mt-1 d-block">
                      Rácio: <strong>{dg.vagas_totais > 0 ? (dg.total_inscritos / dg.vagas_totais).toFixed(2) : 0} cand./vaga</strong>
                    </span>
                  </Card>
                </Col>

                <Col xs={6} md={3}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100 p-3" style={{ borderLeft: '4px solid #2d6a4f' }}>
                    <span className="text-muted fs-8 text-uppercase fw-bold">Selecionados & Inscritos</span>
                    <div className="d-flex align-items-baseline justify-content-between mt-2">
                      <span className="fs-2 fw-bold" style={{ color: '#1b4332' }}>{dg.selecionados || 0}</span>
                      <span className="badge badge-cfp-dark fs-8">
                        {dg.total_inscritos > 0 ? `${Math.round((dg.selecionados / dg.total_inscritos) * 100)}%` : '0%'}
                      </span>
                    </div>
                    <span className="fs-8 text-muted mt-1 d-block">
                      Matriculados: <strong>{dg.inscritos || 0}</strong>
                    </span>
                  </Card>
                </Col>

                <Col xs={6} md={3}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100 p-3" style={{ borderLeft: '4px solid #52b788' }}>
                    <span className="text-muted fs-8 text-uppercase fw-bold">Lista de Suplentes</span>
                    <div className="d-flex align-items-baseline justify-content-between mt-2">
                      <span className="fs-2 fw-bold" style={{ color: '#2d6a4f' }}>{dg.suplentes || 0}</span>
                      <span className="badge badge-cfp-subtle fs-8">
                        Em Espera
                      </span>
                    </div>
                    <span className="fs-8 text-muted mt-1 d-block">
                      Desistências: <strong>{dg.desistidos || 0}</strong> | Não Sel.: <strong>{dg.nao_selecionados || 0}</strong>
                    </span>
                  </Card>
                </Col>
              </Row>

              {/* RÁCIO DE GÉNERO (MASCULINO VS FEMININO) */}
              <Card className="border-0 shadow-sm rounded-4 bg-white mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Users style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                      <h6 className="fw-bold mb-0 text-dark">Rácio Demográfico de Género (Masculino vs Feminino)</h6>
                    </div>
                    <span className="fs-8 text-muted">Amostra: {dg.total_inscritos} formandos</span>
                  </div>

                  <Row className="align-items-center g-3">
                    <Col md={3}>
                      <div className="p-3 rounded-3 border bg-light text-center">
                        <span className="fs-8 text-muted fw-bold d-block text-uppercase">Candidatos Masculinos</span>
                        <span className="fs-3 fw-bold d-block mt-1" style={{ color: '#1b4332' }}>{dg.total_masculino || 0}</span>
                        <span className="badge badge-cfp-light mt-1 fs-8">{dg.percentual_masculino || 0}% do total</span>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="px-2">
                        <div className="d-flex justify-content-between fs-8 fw-bold mb-1.5">
                          <span style={{ color: '#1b4332' }}>Homens: {dg.percentual_masculino || 0}% ({dg.total_masculino})</span>
                          <span style={{ color: '#2d6a4f' }}>Mulheres: {dg.percentual_feminino || 0}% ({dg.total_feminino})</span>
                        </div>
                        <ProgressBar className="rounded-pill" style={{ height: '22px' }}>
                          <ProgressBar
                            now={dg.percentual_masculino || 0}
                            key={1}
                            style={{ backgroundColor: '#1b4332' }}
                            label={`${dg.percentual_masculino || 0}%`}
                          />
                          <ProgressBar
                            now={dg.percentual_feminino || 0}
                            key={2}
                            style={{ backgroundColor: '#52b788' }}
                            label={`${dg.percentual_feminino || 0}%`}
                          />
                        </ProgressBar>
                        <span className="text-muted fs-8 mt-2 d-block text-center">
                          Equilíbrio de género calculado sobre as inscrições ativas no ano letivo {ano || '2026'}.
                        </span>
                      </div>
                    </Col>

                    <Col md={3}>
                      <div className="p-3 rounded-3 border bg-light text-center">
                        <span className="fs-8 text-muted fw-bold d-block text-uppercase">Candidatas Femininas</span>
                        <span className="fs-3 fw-bold d-block mt-1" style={{ color: '#2d6a4f' }}>{dg.total_feminino || 0}</span>
                        <span className="badge badge-cfp-subtle mt-1 fs-8">{dg.percentual_feminino || 0}% do total</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* GRÁFICOS ESTATÍSTICOS: DISTRITOS E HABILITAÇÕES */}
              <Row className="g-3 mb-3">
                {/* 1. GRÁFICO DE BARRAS DOS 7 DISTRITOS DE STP */}
                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                          <MapPin style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                          <h6 className="fw-bold mb-0 text-dark">Distribuição Geográfica (7 Distritos de STP)</h6>
                        </div>
                        <span className="badge badge-cfp-light border fs-8">Nacional (7 Distritos)</span>
                      </div>

                      <div className="space-y-3">
                        {labelsDistritos.map((dist, idx) => {
                          const valor = dg.distritos?.[dist.key] || 0;
                          const perc = dg.total_inscritos > 0 ? ((valor / dg.total_inscritos) * 100).toFixed(1) : 0;
                          const barWidth = `${Math.min(100, Math.round((valor / maxDistritoVal) * 100))}%`;

                          return (
                            <div key={dist.key} className="mb-2.5">
                              <div className="d-flex justify-content-between align-items-center fs-7 mb-1">
                                <span className="fw-semibold text-dark">
                                  <span className="text-muted me-1.5 fs-8">#{idx + 1}</span>
                                  {dist.nome}
                                </span>
                                <span className="text-dark fw-bold">
                                  {valor} <small className="text-muted fw-normal">({perc}%)</small>
                                </span>
                              </div>
                              <div
                                className="w-100 rounded-pill overflow-hidden bg-light"
                                style={{ height: '10px' }}
                              >
                                <div
                                  className="h-100 rounded-pill transition-all"
                                  style={{
                                    width: barWidth,
                                    backgroundColor: dist.cor,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* 2. GRÁFICO DE HABILITAÇÕES LITERÁRIAS */}
                <Col md={6}>
                  <Card className="border-0 shadow-sm rounded-4 bg-white h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                          <GraduationCap style={{ width: '18px', height: '18px', color: '#1b4332' }} />
                          <h6 className="fw-bold mb-0 text-dark">Grau Académico & Habilitações Literárias</h6>
                        </div>
                        <span className="badge badge-cfp-light border fs-8">Escolaridade</span>
                      </div>

                      <div className="space-y-3">
                        {labelsHabilitacoes.map((hab, idx) => {
                          const valor = dg.habilitacoes?.[hab.key] || 0;
                          const perc = dg.total_inscritos > 0 ? ((valor / dg.total_inscritos) * 100).toFixed(1) : 0;
                          const barWidth = `${Math.min(100, Math.round((valor / maxHabVal) * 100))}%`;

                          return (
                            <div key={hab.key} className="mb-3">
                              <div className="d-flex justify-content-between align-items-center fs-7 mb-1">
                                <div>
                                  <span className="fw-semibold text-dark d-block">{hab.nome}</span>
                                  <span className="fs-8 text-muted">{hab.desc}</span>
                                </div>
                                <span className="text-dark fw-bold fs-6">
                                  {valor} <small className="text-muted fw-normal fs-8">({perc}%)</small>
                                </span>
                              </div>
                              <div
                                className="w-100 rounded-pill overflow-hidden bg-light"
                                style={{ height: '10px' }}
                              >
                                <div
                                  className="h-100 rounded-pill transition-all"
                                  style={{
                                    width: barWidth,
                                    backgroundColor: hab.cor,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* 3. GRÁFICO E PAINEL ANALÍTICO DAS 8 FAIXAS ETÁRIAS (ESTRUTURA ETÁRIA DA PROCURA) */}
              <Card className="border-0 shadow-sm rounded-4 bg-white mb-3">
                <Card.Body className="p-4">
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-3 border-bottom">
                    <div className="d-flex align-items-center gap-2.5">
                      <div
                        className="p-2 rounded-3 text-white d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: '#1b4332' }}
                      >
                        <Clock style={{ width: '20px', height: '20px' }} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark fs-6">
                          Estrutura Etária & Pirâmide da Procura Formativa (8 Faixas Oficiais)
                        </h6>
                        <span className="text-muted fs-8">
                          Distribuição etária detalhada dos formandos inscritos com destaque para as metas de juventude do CFP-STP
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <div className="btn-group btn-group-sm rounded-pill p-0.5 bg-light border">
                        <button
                          type="button"
                          className={`btn btn-sm rounded-pill px-2.5 py-1 fs-8 fw-semibold ${
                            visualizacaoEtaria === 'grafico'
                              ? 'text-white shadow-xs'
                              : 'text-secondary'
                          }`}
                          style={
                            visualizacaoEtaria === 'grafico'
                              ? { backgroundColor: '#1b4332', borderColor: '#1b4332' }
                              : {}
                          }
                          onClick={() => setVisualizacaoEtaria('grafico')}
                        >
                          Histograma
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm rounded-pill px-2.5 py-1 fs-8 fw-semibold ${
                            visualizacaoEtaria === 'tabela'
                              ? 'text-white shadow-xs'
                              : 'text-secondary'
                          }`}
                          style={
                            visualizacaoEtaria === 'tabela'
                              ? { backgroundColor: '#1b4332', borderColor: '#1b4332' }
                              : {}
                          }
                          onClick={() => setVisualizacaoEtaria('tabela')}
                        >
                          Tabela & Rácios
                        </button>
                      </div>
                      <span className="badge badge-cfp-light border fs-8">
                        Foco: Juventude & Empregabilidade
                      </span>
                      <span className="badge badge-cfp-dark fs-8">
                        Amostra: {dg.total_inscritos || 0} (100%)
                      </span>
                    </div>
                  </div>

                  {/* 4 CARDS ESTRATÉGICOS DE RESUMO ETÁRIO */}
                  <Row className="g-2 mb-4">
                    <Col xs={6} md={3}>
                      <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#f2fbf5', borderColor: '#b7e4c7' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fs-8 fw-bold text-uppercase" style={{ color: '#1b4332' }}>Juventude (14 - 30)</span>
                          <span className="badge badge-cfp-dark fs-9">Prioritário</span>
                        </div>
                        <div className="mt-2">
                          <span className="fs-3 fw-bold" style={{ color: '#1b4332' }}>
                            {((dg.faixas_etarias?.faixa_14_17 || 0) + (dg.faixas_etarias?.faixa_18_24 || 0) + (dg.faixas_etarias?.faixa_25_30 || 0))}
                          </span>
                          <span className="fs-8 text-muted ms-1.5">
                            ({dg.total_inscritos > 0
                              ? Math.round((((dg.faixas_etarias?.faixa_14_17 || 0) + (dg.faixas_etarias?.faixa_18_24 || 0) + (dg.faixas_etarias?.faixa_25_30 || 0)) / dg.total_inscritos) * 100)
                              : 0}% da procura)
                          </span>
                        </div>
                        <span className="fs-8 text-muted d-block mt-1">Candidatos prioritários à inserção profissional</span>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="p-3 rounded-3 border h-100" style={{ backgroundColor: '#eaf5ee', borderColor: '#c7e8d6' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fs-8 fw-bold text-uppercase" style={{ color: '#2d6a4f' }}>Pico da Procura</span>
                          <span className="badge badge-cfp-emerald fs-9">Densidade Máx.</span>
                        </div>
                        <div className="mt-2">
                          <span className="fs-4 fw-bold text-dark d-block">
                            18 - 24 Anos
                          </span>
                          <span className="fs-7 fw-semibold" style={{ color: '#2d6a4f' }}>
                            {dg.faixas_etarias?.faixa_18_24 || 0} formandos
                            {dg.total_inscritos > 0 && ` (${Math.round(((dg.faixas_etarias?.faixa_18_24 || 0) / dg.total_inscritos) * 100)}%)`}
                          </span>
                        </div>
                        <span className="fs-8 text-muted d-block mt-1">Maior concentração de interesse formativo</span>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="p-3 rounded-3 border h-100 bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fs-8 fw-bold text-uppercase text-secondary">Adultos (31+ Anos)</span>
                          <span className="badge badge-cfp-subtle border fs-9">Reconversão</span>
                        </div>
                        <div className="mt-2">
                          <span className="fs-3 fw-bold text-dark">
                            {((dg.faixas_etarias?.faixa_31_35 || 0) + (dg.faixas_etarias?.faixa_36_40 || 0) + (dg.faixas_etarias?.faixa_41_45 || 0) + (dg.faixas_etarias?.faixa_46_50 || 0) + (dg.faixas_etarias?.faixa_mais_50 || 0))}
                          </span>
                          <span className="fs-8 text-muted ms-1.5">
                            ({dg.total_inscritos > 0
                              ? Math.round((((dg.faixas_etarias?.faixa_31_35 || 0) + (dg.faixas_etarias?.faixa_36_40 || 0) + (dg.faixas_etarias?.faixa_41_45 || 0) + (dg.faixas_etarias?.faixa_46_50 || 0) + (dg.faixas_etarias?.faixa_mais_50 || 0)) / dg.total_inscritos) * 100)
                              : 0}%)
                          </span>
                        </div>
                        <span className="fs-8 text-muted d-block mt-1">Qualificação e aprendizagem contínua</span>
                      </div>
                    </Col>

                    <Col xs={6} md={3}>
                      <div className="p-3 rounded-3 border h-100 bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fs-8 fw-bold text-uppercase text-secondary">Média Etária Estimada</span>
                          <span className="badge badge-cfp-mint fs-9">Perfil STP</span>
                        </div>
                        <div className="mt-2">
                          <span className="fs-3 fw-bold" style={{ color: '#1b4332' }}>~23 Anos</span>
                        </div>
                        <span className="fs-8 text-muted d-block mt-1">População em transição para o emprego digno</span>
                      </div>
                    </Col>
                  </Row>

                  {/* VISUALIZAÇÃO CONDICIONAL: HISTOGRAMA OU TABELA DETALHADA */}
                  {visualizacaoEtaria === 'tabela' ? (
                    <div className="table-responsive rounded-3 border mb-3">
                      <Table hover className="mb-0 fs-7 align-middle">
                        <thead className="bg-light text-muted border-bottom">
                          <tr>
                            <th className="ps-3">Faixa Etária Oficial</th>
                            <th>Segmento CFP-STP</th>
                            <th>Total Candidatos</th>
                            <th>% da Procura</th>
                            <th style={{ minWidth: '160px' }}>Distribuição Proporcional</th>
                            <th className="text-end pe-3">Estatuto Estratégico</th>
                          </tr>
                        </thead>
                        <tbody>
                          {labelsFaixasEtarias.map((faixa, idx) => {
                            const valor = dg.faixas_etarias?.[faixa.key] || 0;
                            const perc = dg.total_inscritos > 0 ? ((valor / dg.total_inscritos) * 100).toFixed(1) : '0.0';
                            const isPrioritario = faixa.key === 'faixa_18_24' || faixa.key === 'faixa_25_30';
                            const isAdolescente = faixa.key === 'faixa_14_17';
                            const tons = ['#0f3822', '#1b4332', '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2', '#b7e4c7'];

                            return (
                              <tr key={`tab-${faixa.key}`}>
                                <td className="ps-3 fw-bold text-dark">{faixa.nome}</td>
                                <td className="text-muted fs-8">{faixa.desc}</td>
                                <td>
                                  <span className="badge badge-cfp-dark fs-8 px-2 py-1">{valor}</span>
                                </td>
                                <td className="fw-semibold text-dark">{perc}%</td>
                                <td>
                                  <ProgressBar
                                    now={parseFloat(perc)}
                                    style={{ height: '8px' }}
                                    className="rounded-pill bg-light"
                                  >
                                    <ProgressBar
                                      now={parseFloat(perc)}
                                      style={{ backgroundColor: tons[idx % tons.length] }}
                                    />
                                  </ProgressBar>
                                </td>
                                <td className="text-end pe-3">
                                  <span
                                    className={`badge fs-9 py-0.5 px-2 rounded-pill ${
                                      isPrioritario
                                        ? 'badge-cfp-dark'
                                        : isAdolescente
                                        ? 'badge-cfp-emerald'
                                        : 'badge-cfp-subtle'
                                    }`}
                                  >
                                    {isPrioritario ? 'Alta Demanda / Prioritário' : isAdolescente ? 'Entrada no Sistema' : 'Regular'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-light border-top">
                          <tr>
                            <td colSpan={2} className="ps-3 fw-bold text-dark">
                              SOMA CONSOLIDADA (8 FAIXAS OFICIAIS):
                            </td>
                            <td className="fw-bold text-dark">
                              <span className="badge badge-cfp-dark fs-7 px-2.5 py-1">{dg.total_inscritos || 0}</span>
                            </td>
                            <td colSpan={3} className="text-end pe-3 fw-bold fs-8" style={{ color: '#166534' }}>
                              ✓ 100.0% da amostra calculada rigorosamente por data de nascimento (sem resíduos)
                            </td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  ) : (
                    /* HISTOGRAMA GRÁFICO MODERNO DE BARRAS VERTICAIS COM GRADIENTE */
                    <div className="p-3 rounded-4 border bg-light bg-opacity-50 mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-8 fw-bold text-uppercase text-muted">Histograma de Densidade Etária</span>
                        <span className="fs-8 text-muted">Escala proporcional ao valor máximo ({maxFaixaVal} inscrições)</span>
                      </div>

                      <div className="position-relative pt-4 pb-2" style={{ minHeight: '220px' }}>
                        {/* Linhas guia de referência no fundo */}
                        <div className="position-absolute w-100 h-100 top-0 start-0 d-flex flex-column justify-content-between pointer-events-none opacity-25" style={{ zIndex: 0 }}>
                          <div className="border-bottom border-secondary border-dashed w-100"></div>
                          <div className="border-bottom border-secondary border-dashed w-100"></div>
                          <div className="border-bottom border-secondary border-dashed w-100"></div>
                          <div className="border-bottom border-secondary w-100"></div>
                        </div>

                        <Row className="g-2 position-relative align-items-end h-100" style={{ zIndex: 1, minHeight: '190px' }}>
                          {labelsFaixasEtarias.map((faixa) => {
                            const valor = dg.faixas_etarias?.[faixa.key] || 0;
                            const perc = dg.total_inscritos > 0 ? ((valor / dg.total_inscritos) * 100).toFixed(1) : 0;
                            const barHeight = Math.max(16, Math.round((valor / maxFaixaVal) * 130));
                            const isPrioritario = faixa.key === 'faixa_18_24' || faixa.key === 'faixa_25_30';
                            const isAdolescente = faixa.key === 'faixa_14_17';

                            return (
                              <Col key={faixa.key} xs={6} sm={3} md={3} lg={1.5} className="col-lg text-center">
                                <div className="d-flex flex-column align-items-center h-100 justify-content-end">
                                  {/* Indicador numérico no topo */}
                                  <div className="mb-1.5 transition-all">
                                    <span className="fs-5 fw-bold text-dark d-block lh-1">{valor}</span>
                                    <span
                                      className="badge badge-cfp-light fs-9 px-1.5 py-0.5 rounded-pill mt-0.5"
                                    >
                                      {perc}%
                                    </span>
                                  </div>

                                  {/* Coluna Gráfica */}
                                  <div
                                    className="w-100 d-flex justify-content-center"
                                    style={{ height: '140px', alignItems: 'flex-end' }}
                                  >
                                    <div
                                      className="rounded-top-3 shadow-xs transition-all"
                                      style={{
                                        width: '38px',
                                        height: `${barHeight}px`,
                                        background: isPrioritario
                                          ? 'linear-gradient(180deg, #166534 0%, #2d6a4f 100%)'
                                          : isAdolescente
                                          ? 'linear-gradient(180deg, #2d6a4f 0%, #40916c 100%)'
                                          : 'linear-gradient(180deg, #52b788 0%, #74c69d 100%)',
                                        border: isPrioritario ? '1.5px solid #143527' : '1px solid #40916c',
                                      }}
                                      title={`${faixa.nome}: ${valor} formandos (${perc}%)`}
                                    />
                                  </div>

                                  {/* Legenda e Rótulos */}
                                  <div className="mt-2 w-100">
                                    <strong className="fs-7 text-dark d-block lh-sm">{faixa.nome}</strong>
                                    <span className="fs-9 text-muted d-block text-truncate" title={faixa.desc}>
                                      {faixa.desc}
                                    </span>
                                    <span
                                      className={`badge mt-1 fs-9 py-0.5 px-1.5 rounded-pill ${
                                        isPrioritario
                                          ? 'badge-cfp-dark'
                                          : isAdolescente
                                          ? 'badge-cfp-emerald'
                                          : 'badge-cfp-subtle'
                                      }`}
                                    >
                                      {isPrioritario ? 'Alta Demanda' : isAdolescente ? 'Entrada' : 'Regular'}
                                    </span>
                                  </div>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    </div>
                  )}

                  {/* BARRA HORIZONTAL CONTÍNUA DE DISTRIBUIÇÃO PROPORCIONAL (100%) */}
                  <div className="pt-2 border-top">
                    <div className="d-flex align-items-center justify-content-between mb-1.5 fs-8 text-muted">
                      <span className="fw-semibold text-dark">Distribuição Contínua da Procura por Faixa Etária</span>
                      <span>Total: 100% dos Inscritos</span>
                    </div>

                    <div className="w-100 rounded-pill overflow-hidden d-flex shadow-xs" style={{ height: '14px' }}>
                      {labelsFaixasEtarias.map((faixa, idx) => {
                        const valor = dg.faixas_etarias?.[faixa.key] || 0;
                        const perc = dg.total_inscritos > 0 ? (valor / dg.total_inscritos) * 100 : 0;
                        if (perc === 0) return null;
                        const tons = ['#264653', // Azul-petróleo
  '#287271', // Verde-petróleo
  '#2A9D8F', // Turquesa
  '#65A765', // Verde
  '#E9C46A', // Amarelo dourado
  '#F4A261', // Laranja suave
  '#E76F51', // Coral
  '#8D6CAB', // Roxo
  ];

                        return (
                          <div
                            key={`stack-${faixa.key}`}
                            style={{
                              width: `${perc}%`,
                              backgroundColor: tons[idx % tons.length],
                            }}
                            title={`${faixa.nome}: ${valor} (${perc.toFixed(1)}%)`}
                          />
                        );
                      })}
                    </div>

                    {/* Legenda compacta em grelha */}
                    <div className="d-flex flex-wrap gap-2.5 mt-2 fs-8 text-muted justify-content-between">
                      {labelsFaixasEtarias.map((faixa, idx) => {
                        const valor = dg.faixas_etarias?.[faixa.key] || 0;
                        const perc = dg.total_inscritos > 0 ? ((valor / dg.total_inscritos) * 100).toFixed(0) : 0;
                        const tons = ['#264653', // Azul-petróleo
                          '#287271', // Verde-petróleo
                          '#2A9D8F', // Turquesa
                          '#65A765', // Verde
                          '#E9C46A', // Amarelo dourado
                          '#F4A261', // Laranja suave
                          '#E76F51', // Coral
                          '#8D6CAB', // Roxo
                          ];
                        return (
                          <div key={`legend-${faixa.key}`} className="d-flex align-items-center gap-1.5">
                            <span
                              className="rounded-circle d-inline-block"
                              style={{ width: '8px', height: '8px', backgroundColor: tons[idx % tons.length] }}
                            />
                            <span className="text-dark fw-medium">{faixa.nome}:</span>
                            <span className="text-muted fw-semibold">{perc}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {/* ============================================================== */}
          {/* SUB-ABA 2: COMPARATIVO POR CURSOS                             */}
          {/* ============================================================== */}
          {abaAtiva === 'cursos' && (
            <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
              <Card.Header className="bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Tabela Comparativa de Desempenho e Procura por Curso</h6>
                  <p className="text-muted fs-8 mb-0">Rácios de ocupação, procura por género e status de seleção em cada turma oficial</p>
                </div>
                <span className="badge badge-cfp-light border fs-7">
                  {porCurso.length} Cursos Ativos
                </span>
              </Card.Header>

              <div className="table-responsive">
                <Table hover align="middle" className="mb-0 fs-7">
                  <thead className="bg-light text-muted border-bottom">
                    <tr>
                      <th className="ps-4">Curso / Ação Oficial</th>
                      <th>Duração / Vagas</th>
                      <th>Total Inscritos</th>
                      <th>Procura / Ocupação</th>
                      <th>Rácio M / F</th>
                      <th>Selecionados</th>
                      <th>Suplentes</th>
                      <th>1.ª / 2.ª Opção</th>
                      <th className="text-end pe-4">Ações & Relatório</th>
                    </tr>
                  </thead>
                  <tbody>
                    {porCurso.map((c) => {
                      const percOcupacao = c.taxa_ocupacao || 0;
                      const corOcupacao = percOcupacao >= 100 ? '#0f3822' : percOcupacao >= 70 ? '#1b4332' : '#40916c';

                      return (
                        <tr key={c.curso_id}>
                          <td className="ps-4">
                            <strong className="text-dark d-block fs-6">{c.nome_curso}</strong>
                            <span className="text-muted fs-8">
                              Código: {c.acao || 'Ação'} | Programa: {c.programa}
                            </span>
                          </td>
                          <td>
                            <span className="d-block fw-semibold text-dark">{c.duracao || 0} Horas</span>
                            <span className="text-muted fs-8">{c.alunos_por_turma || 20} vagas/turma</span>
                          </td>
                          <td>
                            <span className="badge badge-cfp-dark fs-7 px-2.5 py-1">
                              {c.total_inscritos}
                            </span>
                          </td>
                          <td style={{ minWidth: '140px' }}>
                            <div className="d-flex align-items-center justify-content-between fs-8 fw-bold mb-1">
                              <span style={{ color: corOcupacao }}>{percOcupacao}%</span>
                              <span className="text-muted">({c.total_inscritos}/{c.alunos_por_turma})</span>
                            </div>
                            <ProgressBar now={Math.min(100, percOcupacao)} style={{ height: '7px' }} />
                          </td>
                          <td style={{ minWidth: '130px' }}>
                            <div className="d-flex justify-content-between fs-8 text-muted mb-0.5">
                              <span>M: {c.masculino} ({c.percentual_masculino}%)</span>
                              <span>F: {c.feminino} ({c.percentual_feminino}%)</span>
                            </div>
                            <ProgressBar style={{ height: '6px' }}>
                              <ProgressBar now={c.percentual_masculino} style={{ backgroundColor: '#1b4332' }} />
                              <ProgressBar now={c.percentual_feminino} style={{ backgroundColor: '#52b788' }} />
                            </ProgressBar>
                          </td>
                          <td>
                            <span className="badge badge-cfp-mint border fw-bold fs-7">
                              {c.selecionados} admitidos
                            </span>
                          </td>
                          <td>
                            <span className="badge badge-cfp-subtle border fw-semibold fs-7">
                              {c.suplente} suplentes
                            </span>
                          </td>
                          <td>
                            <span className="fs-8 text-dark d-block">
                              1ª: <strong>{c.primeira_opcao}</strong>
                            </span>
                            <span className="fs-8 text-muted d-block">
                              2ª: <strong>{c.segunda_opcao}</strong>
                            </span>
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-inline-flex align-items-center gap-1.5">
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="rounded-3 d-inline-flex align-items-center gap-1 fs-8 fw-semibold"
                                style={{ borderColor: '#2d6a4f', color: '#166534' }}
                                onClick={() => {
                                  descarregarRelatorioEstatistico({
                                    tipo: 'curso',
                                    cursoId: c.curso_id,
                                    ano: ano,
                                    download: 1,
                                    token,
                                  });
                                  if (aoNotificar) {
                                    aoNotificar({
                                      tipo: 'sucesso',
                                      texto: `A transferir Ficha Estatística Oficial do curso ${c.nome_curso}...`,
                                    });
                                  }
                                }}
                                title="Descarregar Ficha Estatística Oficial do Curso em PDF gerado no backend"
                              >
                                <FileText style={{ width: '13px', height: '13px' }} />
                                PDF Curso
                              </Button>
                              <Button
                                variant="outline-success"
                                size="sm"
                                className="rounded-3 d-inline-flex align-items-center gap-1 fs-8 fw-semibold"
                                style={{ borderColor: '#1b4332', color: '#1b4332' }}
                                onClick={() => setCursoRaioX(c)}
                              >
                                <ExternalLink style={{ width: '13px', height: '13px' }} />
                                Raio-X
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}

          {/* ============================================================== */}
          {/* SUB-ABA 3: LISTA NOMINAL DE INSCRIÇÕES                        */}
          {/* ============================================================== */}
          {abaAtiva === 'inscricoes' && (
            <Card className="border-0 shadow-sm rounded-4 bg-white overflow-hidden">
              <Card.Header className="bg-white py-3 px-4 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Listagem Nominal de Formandos Inscritos</h6>
                  <p className="text-muted fs-8 mb-0">Pesquisa e rastreabilidade individual com filtros ativos</p>
                </div>

                <div className="d-flex align-items-center gap-2" style={{ minWidth: '300px' }}>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0">
                      <Search style={{ width: '14px', height: '14px' }} className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Pesquisar por nome, BI, processo..."
                      value={pesquisaNominal}
                      onChange={(e) => setPesquisaNominal(e.target.value)}
                      className="border-start-0"
                    />
                  </div>
                </div>
              </Card.Header>

              <div className="table-responsive">
                <Table hover align="middle" className="mb-0 fs-7">
                  <thead className="bg-light text-muted border-bottom">
                    <tr>
                      <th className="ps-4">Cód. Processo</th>
                      <th>Nome do Formando</th>
                      <th>B.I. / Identificação</th>
                      <th>Género / Idade</th>
                      <th>Distrito</th>
                      <th>Curso Pretendido</th>
                      <th>Opção</th>
                      <th>Status Oficial</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaNominalFiltrada.length > 0 ? (
                      listaNominalFiltrada.map((item) => (
                        <tr key={item.id}>
                          <td className="ps-4 font-mono fw-semibold text-dark">
                            {item.codigo || `CAND-${item.id}`}
                          </td>
                          <td>
                            <strong className="text-dark d-block">{item.nome}</strong>
                            <span className="text-muted fs-8">{item.habilitacao}</span>
                          </td>
                          <td className="font-mono text-muted">{item.bi || '—'}</td>
                          <td>
                            <span className="d-block">{item.sexo}</span>
                            <span className="text-muted fs-8">{item.idade} Anos</span>
                          </td>
                          <td>{item.distrito}</td>
                          <td>
                            <span className="fw-semibold text-dark d-block">{item.curso_nome}</span>
                            <span className="text-muted fs-8">Ano: {item.ano}</span>
                          </td>
                          <td>
                            <span className="badge badge-cfp-light border fs-8">
                              {item.opcao}ª Opção
                            </span>
                          </td>
                          <td>
                            <StatusBadgeAdmin
                              estado={
                                item.status === 'selecionado'
                                  ? 'APROVADA'
                                  : item.status === 'suplente'
                                  ? 'EM_ANALISE'
                                  : item.status === 'desistido'
                                  ? 'CANCELADA'
                                  : item.status === 'nao_selecionado'
                                  ? 'REJEITADA'
                                  : 'PENDENTE'
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-5 text-muted">
                          Nenhum formando encontrado com o termo pesquisado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* MODAL: RAIO-X PROFUNDO DO CURSO */}
      {cursoRaioX && (
        <Modal show={Boolean(cursoRaioX)} onHide={() => setCursoRaioX(null)} size="lg" centered>
          <Modal.Header closeButton style={{ backgroundColor: '#1b4332', color: '#fff' }}>
            <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
              <GraduationCap style={{ width: '20px', height: '20px' }} />
              Raio-X do Curso: {cursoRaioX.nome_curso}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4 bg-light">
            {/* SUMÁRIO */}
            <div className="bg-white p-3 rounded-3 shadow-xs mb-3 border">
              <Row className="text-center g-2">
                <Col xs={3}>
                  <span className="text-muted fs-8 d-block text-uppercase">Inscritos</span>
                  <strong className="fs-4 text-dark">{cursoRaioX.total_inscritos}</strong>
                </Col>
                <Col xs={3}>
                  <span className="text-muted fs-8 d-block text-uppercase">Vagas</span>
                  <strong className="fs-4 text-dark">{cursoRaioX.alunos_por_turma}</strong>
                </Col>
                <Col xs={3}>
                  <span className="text-muted fs-8 d-block text-uppercase">Ocupação</span>
                  <strong className="fs-4 text-success">{cursoRaioX.taxa_ocupacao}%</strong>
                </Col>
                <Col xs={3}>
                  <span className="text-muted fs-8 d-block text-uppercase">Duração</span>
                  <strong className="fs-4 text-dark">{cursoRaioX.duracao}h</strong>
                </Col>
              </Row>
            </div>

            {/* DEMOGRAFIA POR DISTRITO NO CURSO */}
            <Card className="border-0 shadow-xs rounded-3 bg-white mb-3">
              <Card.Body className="p-3">
                <h6 className="fw-bold fs-7 text-dark mb-2 pb-1 border-bottom">
                  Origem Geográfica dos Candidatos deste Curso
                </h6>
                <Row className="g-2">
                  {labelsDistritos.map((d) => (
                    <Col key={d.key} xs={6} md={4}>
                      <div className="p-2 border rounded-2 bg-light d-flex justify-content-between align-items-center fs-8">
                        <span>{d.nome}</span>
                        <span className="badge badge-cfp-dark fs-8">{cursoRaioX.distritos?.[d.key] || 0}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* HABILITAÇÕES DOS CANDIDATOS NO CURSO */}
            <Card className="border-0 shadow-xs rounded-3 bg-white">
              <Card.Body className="p-3">
                <h6 className="fw-bold fs-7 text-dark mb-2 pb-1 border-bottom">
                  Escolaridade dos Candidatos deste Curso
                </h6>
                <Row className="g-2">
                  {labelsHabilitacoes.map((h) => (
                    <Col key={h.key} xs={6} md={4}>
                      <div className="p-2 border rounded-2 bg-light d-flex justify-content-between align-items-center fs-8">
                        <span>{h.nome}</span>
                        <span className="badge badge-cfp-dark fs-8">
                          {cursoRaioX.habilitacoes?.[h.key] || 0}
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer className="bg-white d-flex justify-content-between align-items-center">
            <Button
              variant="success"
              size="sm"
              className="d-inline-flex align-items-center gap-1.5 fw-semibold text-white rounded-3 shadow-xs"
              style={{ backgroundColor: '#166534', borderColor: '#166534' }}
              onClick={() => {
                descarregarRelatorioEstatistico({
                  tipo: 'curso',
                  cursoId: cursoRaioX.curso_id,
                  ano: ano || new Date().getFullYear(),
                  download: 1,
                  token,
                });
                if (aoNotificar) {
                  aoNotificar({
                    tipo: 'sucesso',
                    texto: `A transferir Ficha Estatística Oficial do curso ${cursoRaioX.nome_curso}...`,
                  });
                }
              }}
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Emitir Ficha Estatística Oficial (PDF)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setCursoRaioX(null)} className="rounded-3">
              Fechar Raio-X
            </Button>
          </Modal.Footer>
        </Modal>
        
      )}
    </div>
  );
};

export default EstatisticasInscricoes;
