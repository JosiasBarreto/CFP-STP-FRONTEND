import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Users,
  Calendar,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import {
  UtilizadorAdmin,
  CandidaturaAdmin,
  EstatisticasAdmin,
  ProgramaAdmin,
} from '../types';
import { adminApi } from '../services/adminApi';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { AdminDossierModal } from './AdminDossierModal';

interface AdminGestaoViewProps {
  token: string;
  utilizador: UtilizadorAdmin;
  aoNotificar: (msg: { tipo: 'sucesso' | 'erro'; texto: string } | null) => void;
}

type SortField = 'data' | 'nome' | 'codigo' | 'estado' | 'distrito';
type SortOrder = 'asc' | 'desc';

export const AdminGestaoView: React.FC<AdminGestaoViewProps> = ({
  token,
  utilizador,
  aoNotificar,
}) => {
  const [candidaturas, setCandidaturas] = useState<CandidaturaAdmin[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasAdmin | null>(null);
  const [programas, setProgramas] = useState<ProgramaAdmin[]>([]);
  
  // Filtros
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroPesquisa, setFiltroPesquisa] = useState<string>('');
  const [filtroPrograma, setFiltroPrograma] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [itensPorPagina, setItensPorPagina] = useState<number>(10);

  // Ordenação
  const [ordenarPor, setOrdenarPor] = useState<SortField>('data');
  const [ordem, setOrdem] = useState<SortOrder>('desc');

  // Modal do Dossiê Selecionado
  const [dossierAberto, setDossierAberto] = useState<CandidaturaAdmin | null>(null);

  const carregarProgramas = async () => {
    try {
      const progs = await adminApi.listarProgramas();
      setProgramas(progs);
    } catch {
      // ignore
    }
  };

  const carregarLista = async (
    estado = filtroEstado,
    pesquisa = filtroPesquisa,
    prog = filtroPrograma
  ) => {
    setCarregando(true);
    try {
      const res = await adminApi.listarCandidaturas(token, {
        estado,
        pesquisa,
        programa_id: prog || undefined,
      });
      setCandidaturas(res.items || []);
      if (res.estatisticas) setEstatisticas(res.estatisticas);
      setPaginaAtual(1); // reinicia para página 1 ao filtrar
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProgramas();
    carregarLista();
  }, [token]);

  // Ordenação e Filtragem no Cliente para fluidez
  const candidaturasOrdenadas = useMemo(() => {
    return [...candidaturas].sort((a, b) => {
      let valA: any = '';
      let valB: any = '';

      if (ordenarPor === 'data') {
        valA = a.data_submissao || a.data_criacao || '';
        valB = b.data_submissao || b.data_criacao || '';
      } else if (ordenarPor === 'nome') {
        valA = (a.nome || '').toLowerCase();
        valB = (b.nome || '').toLowerCase();
      } else if (ordenarPor === 'codigo') {
        valA = a.codigo || '';
        valB = b.codigo || '';
      } else if (ordenarPor === 'estado') {
        valA = a.estado || '';
        valB = b.estado || '';
      } else if (ordenarPor === 'distrito') {
        valA = (a.distrito || '').toLowerCase();
        valB = (b.distrito || '').toLowerCase();
      }

      if (valA < valB) return ordem === 'asc' ? -1 : 1;
      if (valA > valB) return ordem === 'asc' ? 1 : -1;
      return 0;
    });
  }, [candidaturas, ordenarPor, ordem]);

  // Paginação dos dados
  const totalItens = candidaturasOrdenadas.length;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
  const inicioIndice = (paginaAtual - 1) * itensPorPagina;
  const fimIndice = Math.min(inicioIndice + itensPorPagina, totalItens);
  const itensExibidos = candidaturasOrdenadas.slice(inicioIndice, fimIndice);

  const alternarOrdenacao = (campo: SortField) => {
    if (ordenarPor === campo) {
      setOrdem((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrdenarPor(campo);
      setOrdem('asc');
    }
  };

  const getIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      
      {/* ==================================================================== */}
      {/* PAINEL DE CONTROLO & INDICADORES DE GESTÃO (KPIS) */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xs border border-slate-200/90 p-5 sm:p-7 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                Painel Executivo
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Sessão Autenticada ({utilizador.role.toUpperCase()})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Dossiês e Gestão Técnica de Inscrições
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervisão de candidaturas, auditoria de decisões, emissão de pareceres e homologação oficial de formandos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => carregarLista()}
              className="px-4 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin text-emerald-700' : ''}`} />
              Atualizar Dados
            </button>
          </div>
        </div>

        {/* Cartões Interativos de Indicadores */}
        {estatisticas && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                setFiltroEstado('');
                carregarLista('', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                filtroEstado === ''
                  ? 'border-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
              }`}
            >
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Registos
              </span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {estatisticas.total}
              </p>
              <div className="absolute right-2 bottom-2 opacity-10">
                <Users className="w-10 h-10 text-slate-900" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setFiltroEstado('PENDENTE');
                carregarLista('PENDENTE', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                filtroEstado === 'PENDENTE'
                  ? 'border-amber-500 bg-amber-50 shadow-xs ring-1 ring-amber-500'
                  : 'border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/60'
              }`}
            >
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Pendentes
              </span>
              <p className="text-2xl font-extrabold text-amber-900 mt-1">
                {estatisticas.pendentes}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setFiltroEstado('EM_ANALISE');
                carregarLista('EM_ANALISE', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                filtroEstado === 'EM_ANALISE'
                  ? 'border-teal-600 bg-teal-50 shadow-xs ring-1 ring-teal-600'
                  : 'border-teal-200/80 bg-teal-50/30 hover:bg-teal-50/60'
              }`}
            >
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                Em Análise
              </span>
              <p className="text-2xl font-extrabold text-teal-900 mt-1">
                {estatisticas.em_analise}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setFiltroEstado('DEVOLVIDA');
                carregarLista('DEVOLVIDA', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                filtroEstado === 'DEVOLVIDA'
                  ? 'border-orange-500 bg-orange-50 shadow-xs ring-1 ring-orange-500'
                  : 'border-orange-200/80 bg-orange-50/30 hover:bg-orange-50/60'
              }`}
            >
              <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                Devolvidas
              </span>
              <p className="text-2xl font-extrabold text-orange-900 mt-1">
                {estatisticas.devolvidas}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setFiltroEstado('CORRIGIDA');
                carregarLista('CORRIGIDA', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                filtroEstado === 'CORRIGIDA'
                  ? 'border-blue-500 bg-blue-50 shadow-xs ring-1 ring-blue-500'
                  : 'border-blue-200/80 bg-blue-50/30 hover:bg-blue-50/60'
              }`}
            >
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
                Corrigidas
              </span>
              <p className="text-2xl font-extrabold text-blue-900 mt-1">
                {estatisticas.corrigidas}
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setFiltroEstado('APROVADA');
                carregarLista('APROVADA', filtroPesquisa, filtroPrograma);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                filtroEstado === 'APROVADA'
                  ? 'border-emerald-700 bg-emerald-100/70 shadow-xs ring-1 ring-emerald-700'
                  : 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/40'
              }`}
            >
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                Aprovadas
              </span>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1">
                {estatisticas.aprovadas}
              </p>
            </button>
          </div>
        )}

        {/* Barra de Filtros & Pesquisa em Tempo Real */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Pesquisar por Nome, BI, NIF, Código, Distrito ou Telefone..."
              value={filtroPesquisa}
              onChange={(e) => setFiltroPesquisa(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') carregarLista(filtroEstado, filtroPesquisa, filtroPrograma);
              }}
              className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-700 shadow-2xs"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={filtroPrograma}
              onChange={(e) => {
                setFiltroPrograma(e.target.value);
                carregarLista(filtroEstado, filtroPesquisa, e.target.value);
              }}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-700 shadow-2xs"
            >
              <option value="">Todos os Programas Oficiais</option>
              {programas.map((p) => (
                <option key={p.id || p.ID} value={p.id || p.ID}>
                  {p.sigla} — {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                carregarLista(e.target.value, filtroPesquisa, filtroPrograma);
              }}
              className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:border-emerald-700 shadow-2xs"
            >
              <option value="">Todos os Estados</option>
              <option value="PENDENTE">Pendente</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="DEVOLVIDA">Devolvida</option>
              <option value="CORRIGIDA">Corrigida</option>
              <option value="APROVADA">Aprovada</option>
              <option value="REJEITADA">Rejeitada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => carregarLista(filtroEstado, filtroPesquisa, filtroPrograma)}
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              Filtrar
            </button>
            {(filtroEstado || filtroPesquisa || filtroPrograma) && (
              <button
                type="button"
                onClick={() => {
                  setFiltroEstado('');
                  setFiltroPesquisa('');
                  setFiltroPrograma('');
                  carregarLista('', '', '');
                }}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                title="Limpar Filtros"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TABELA DE CANDIDATURAS COM PAGINAÇÃO E DESIGN PREMIUM */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden space-y-0">
        
        {/* Barra Superior da Tabela: Contadores e seletor de itens */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>A mostrar</span>
            <strong className="text-slate-900 font-mono">
              {totalItens === 0 ? 0 : inicioIndice + 1}
            </strong>
            <span>a</span>
            <strong className="text-slate-900 font-mono">{fimIndice}</strong>
            <span>de</span>
            <strong className="text-slate-900 font-mono">{totalItens}</strong>
            <span>candidaturas</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>Por página:</span>
            <select
              value={itensPorPagina}
              onChange={(e) => {
                setItensPorPagina(Number(e.target.value));
                setPaginaAtual(1);
              }}
              className="py-1 px-2.5 border border-slate-300 rounded-lg text-xs bg-white font-medium focus:outline-none focus:border-emerald-700"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Tabela Responsiva */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th
                  onClick={() => alternarOrdenacao('codigo')}
                  className="py-3.5 px-5 text-left cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Código / Data</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </th>
                <th
                  onClick={() => alternarOrdenacao('nome')}
                  className="py-3.5 px-5 text-left cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Candidato(a)</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </th>
                <th className="py-3.5 px-5 text-left">Curso Pretendido (1.ª Opção)</th>
                <th
                  onClick={() => alternarOrdenacao('distrito')}
                  className="py-3.5 px-5 text-left cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Distrito / Contacto</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </th>
                <th
                  onClick={() => alternarOrdenacao('estado')}
                  className="py-3.5 px-5 text-left cursor-pointer hover:text-slate-900 select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Estado</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </th>
                <th className="py-3.5 px-5 text-right">Ações Oficiais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {itensExibidos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-500">Nenhum dossiê encontrado</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Tente ajustar os filtros de pesquisa acima.</p>
                  </td>
                </tr>
              ) : (
                itensExibidos.map((cand) => (
                  <tr
                    key={cand.id}
                    onClick={() => setDossierAberto(cand)}
                    className="hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                  >
                    {/* Código e Data */}
                    <td className="py-4 px-5">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md group-hover:bg-emerald-100 group-hover:text-emerald-950 transition-colors">
                        {cand.codigo}
                      </span>
                      <span className="block font-normal text-[11px] text-slate-400 mt-1">
                        {cand.data_submissao || cand.data_criacao}
                      </span>
                    </td>

                    {/* Candidato e Identificação */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                          {getIniciais(cand.nome)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-xs group-hover:text-emerald-900">
                            {cand.nome}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            BI: <strong className="font-mono text-slate-700">{cand.bi}</strong> {cand.nif ? `· NIF: ${cand.nif}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Curso e Programa */}
                    <td className="py-4 px-5">
                      <span className="font-semibold text-slate-900 block leading-tight">
                        {cand.curso_opcao1?.nome || `Curso #${cand.curso_opcao1_id}`}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        {cand.programa?.nome || 'Programa Oficial CFP-STP'}
                      </span>
                    </td>

                    {/* Distrito e Telefone */}
                    <td className="py-4 px-5 text-slate-600">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-medium text-[11px]">
                        {cand.distrito}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-1 font-mono">
                        {cand.contacto}
                      </span>
                    </td>

                    {/* Badge do Estado */}
                    <td className="py-4 px-5">
                      <StatusBadgeAdmin estado={cand.estado} />
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDossierAberto(cand)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg font-bold text-xs border border-emerald-200/80 transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver Dossiê
                        </button>
                        <button
                          type="button"
                          onClick={() => adminApi.baixarFichaOficialPdf(cand)}
                          className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Baixar Ficha Oficial PDF CFP-STP"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adminApi.exportarCandidaturaExcel(cand)}
                          className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Exportar para Excel"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================================== */}
        {/* CONTROLOS DE PAGINAÇÃO NO RODAPÉ DA TABELA */}
        {/* ==================================================================== */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Página <strong className="text-slate-900">{paginaAtual}</strong> de{' '}
            <strong className="text-slate-900">{totalPaginas}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Primeira Página */}
            <button
              type="button"
              onClick={() => setPaginaAtual(1)}
              disabled={paginaAtual === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              title="Primeira Página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Página Anterior */}
            <button
              type="button"
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>

            {/* Botões Numéricos da Página */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                let pNum = i + 1;
                if (totalPaginas > 5 && paginaAtual > 3) {
                  pNum = Math.min(paginaAtual - 2 + i, totalPaginas - (4 - i));
                }
                return (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setPaginaAtual(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      paginaAtual === pNum
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}
            </div>

            {/* Página Seguinte */}
            <button
              type="button"
              onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual >= totalPaginas}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 shadow-2xs"
            >
              Seguinte
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Última Página */}
            <button
              type="button"
              onClick={() => setPaginaAtual(totalPaginas)}
              disabled={paginaAtual >= totalPaginas}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
              title="Última Página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL PREMIUM DE DOSSIÊ COM PREVIEW E NAVEGADOR ANTERIOR / SEGUINTE */}
      {/* ==================================================================== */}
      {dossierAberto && (
        <AdminDossierModal
          candidatura={dossierAberto}
          candidaturasLista={candidaturasOrdenadas}
          token={token}
          onClose={() => setDossierAberto(null)}
          onNavigate={(nova) => setDossierAberto(nova)}
          onAtualizar={carregarLista}
          aoNotificar={aoNotificar}
        />
      )}

    </div>
  );
};
