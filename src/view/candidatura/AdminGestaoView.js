import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Users,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { AdminDossierModal } from './AdminDossierModal';

export const AdminGestaoView = ({
  token: tokens,
  aoNotificar,
}) => {
  const [candidaturas, setCandidaturas] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [pesquisa, setPesquisa] = useState('');
  const [filtroPrograma, setFiltroPrograma] = useState('');
  const [filtroDistrito, setFiltroDistrito] = useState('');

  // Ordenação
  const [ordenarPor, setOrdenarPor] = useState('data');
  const [ordemDirecao, setOrdemDirecao] = useState('desc');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(15);

  // Modal de Dossiê selecionado
  const [dossierAberto, setDossierAberto] = useState(null);

  // Carregar dados da API
  const carregarLista = async () => {
    setCarregando(true);
    try {
      const [resCands, resProgs] = await Promise.all([
        adminApi.listarCandidaturas(tokens, {
          estado: filtroEstado !== 'TODOS' ? filtroEstado : undefined,
          pesquisa: pesquisa.trim() || undefined,
          programa_id: filtroPrograma || undefined,
          distrito: filtroDistrito || undefined,
        }),
        adminApi.listarProgramas().catch(() => []),
      ]);

      setCandidaturas(resCands?.items || []);
      if (resCands?.estatisticas) {
        setEstatisticas(resCands.estatisticas);
      }
      setProgramas(resProgs || []);
    } catch (err) {
      if (aoNotificar) {
        aoNotificar({ tipo: 'erro', texto: err.message || 'Falha ao carregar listagem de candidaturas.' });
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarLista();
  }, [tokens, filtroEstado, filtroPrograma, filtroDistrito]);

  // Filtragem no cliente
  const candidaturasFiltradas = useMemo(() => {
    return candidaturas.filter((c) => {
      if (filtroEstado !== 'TODOS' && c.estado !== filtroEstado) return false;
      if (filtroPrograma && String(c.programa_id) !== String(filtroPrograma)) return false;
      if (filtroDistrito && c.distrito !== filtroDistrito) return false;

      if (pesquisa.trim()) {
        const q = pesquisa.toLowerCase().trim();
        const nome = (c.nome || '').toLowerCase();
        const bi = (c.bi || '').toLowerCase();
        const codigo = (c.codigo || '').toLowerCase();
        const nif = (c.nif || '').toLowerCase();
        const curso1 = (c.curso_opcao1?.nome || '').toLowerCase();
        return (
          nome.includes(q) ||
          bi.includes(q) ||
          codigo.includes(q) ||
          nif.includes(q) ||
          curso1.includes(q)
        );
      }
      return true;
    });
  }, [candidaturas, filtroEstado, filtroPrograma, filtroDistrito, pesquisa]);

  const candidaturasOrdenadas = useMemo(() => {
    return [...candidaturasFiltradas].sort((a, b) => {
      let valA = '';
      let valB = '';

      if (ordenarPor === 'data') {
        valA = a.data_submissao || a.data_criacao || '';
        valB = b.data_submissao || b.data_criacao || '';
      } else if (ordenarPor === 'nome') {
        valA = a.nome || '';
        valB = b.nome || '';
      } else if (ordenarPor === 'codigo') {
        valA = a.codigo || '';
        valB = b.codigo || '';
      } else if (ordenarPor === 'estado') {
        valA = a.estado || '';
        valB = b.estado || '';
      } else if (ordenarPor === 'distrito') {
        valA = a.distrito || '';
        valB = b.distrito || '';
      }

      if (valA < valB) return ordemDirecao === 'asc' ? -1 : 1;
      if (valA > valB) return ordemDirecao === 'asc' ? 1 : -1;
      return 0;
    });
  }, [candidaturasFiltradas, ordenarPor, ordemDirecao]);

  // Paginação
  const totalPaginas = Math.ceil(candidaturasOrdenadas.length / itensPorPagina) || 1;
  const itensPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return candidaturasOrdenadas.slice(inicio, inicio + itensPorPagina);
  }, [candidaturasOrdenadas, paginaAtual, itensPorPagina]);

  const alternarOrdem = (campo) => {
    if (ordenarPor === campo) {
      setOrdemDirecao(ordemDirecao === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenarPor(campo);
      setOrdemDirecao('asc');
    }
  };

  const exportarTodasExcel = async () => {
    try {
      await adminApi.exportarTodasCandidaturasExcel(tokens);
      if (aoNotificar) aoNotificar({ tipo: 'sucesso', texto: 'Ficheiro Excel exportado com sucesso!' });
    } catch (err) {
      if (aoNotificar) aoNotificar({ tipo: 'erro', texto: err.message || 'Falha ao exportar Excel.' });
    }
  };

  return (
    <div className="space-y-6">

      {/* KPIS OFICIAIS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => { setFiltroEstado('TODOS'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'TODOS'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/20'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-80">Total Dossiês</span>
          <span className="text-2xl font-bold block mt-1">{estatisticas?.total ?? candidaturas.length}</span>
        </button>

        <button
          type="button"
          onClick={() => { setFiltroEstado('EM_ANALISE'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'EM_ANALISE'
              ? 'bg-sky-700 text-white border-sky-700 shadow-md ring-2 ring-sky-700/20'
              : 'bg-white text-slate-800 border-sky-200 hover:border-sky-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">Em Análise</span>
          <span className="text-2xl font-bold block mt-1 text-sky-950">
            {estatisticas?.em_analise ?? candidaturas.filter((c) => c.estado === 'EM_ANALISE').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setFiltroEstado('PENDENTE'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'PENDENTE'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-600/20'
              : 'bg-white text-slate-800 border-amber-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">Pendentes</span>
          <span className="text-2xl font-bold block mt-1 text-amber-950">
            {estatisticas?.pendentes ?? candidaturas.filter((c) => c.estado === 'PENDENTE').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setFiltroEstado('APROVADA'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'APROVADA'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-700/20'
              : 'bg-white text-slate-800 border-emerald-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">Aprovadas (Inscritos)</span>
          <span className="text-2xl font-bold block mt-1 text-emerald-950">
            {estatisticas?.aprovadas ?? candidaturas.filter((c) => c.estado === 'APROVADA').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setFiltroEstado('DEVOLVIDA'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'DEVOLVIDA'
              ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-600/20'
              : 'bg-white text-slate-800 border-orange-200 hover:border-orange-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 block">Devolvidas</span>
          <span className="text-2xl font-bold block mt-1 text-orange-950">
            {estatisticas?.devolvidas ?? candidaturas.filter((c) => c.estado === 'DEVOLVIDA').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setFiltroEstado('REJEITADA'); setPaginaAtual(1); }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            filtroEstado === 'REJEITADA'
              ? 'bg-rose-700 text-white border-rose-700 shadow-md ring-2 ring-rose-700/20'
              : 'bg-white text-slate-800 border-rose-200 hover:border-rose-300'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block">Rejeitadas</span>
          <span className="text-2xl font-bold block mt-1 text-rose-950">
            {estatisticas?.rejeitadas ?? candidaturas.filter((c) => c.estado === 'REJEITADA').length}
          </span>
        </button>
      </div>

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={pesquisa}
              onChange={(e) => { setPesquisa(e.target.value); setPaginaAtual(1); }}
              placeholder="Pesquisar por Nome, BI, Protocolo, NIF ou Curso..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={filtroPrograma}
              onChange={(e) => { setFiltroPrograma(e.target.value); setPaginaAtual(1); }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Todos os Programas</option>
              {programas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <select
              value={filtroDistrito}
              onChange={(e) => { setFiltroDistrito(e.target.value); setPaginaAtual(1); }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="">Todos os Distritos</option>
              <option value="Água Grande">Água Grande</option>
              <option value="Mé-Zóchi">Mé-Zóchi</option>
              <option value="Cantagalo">Cantagalo</option>
              <option value="Lobata">Lobata</option>
              <option value="Lembá">Lembá</option>
              <option value="Caué">Caué</option>
              <option value="Região Autónoma do Príncipe (RAP)">RAP (Príncipe)</option>
            </select>

            <button
              type="button"
              onClick={carregarLista}
              disabled={carregando}
              title="Atualizar Dados"
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={exportarTodasExcel}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* TABELA DE CANDIDATURAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th
                  onClick={() => alternarOrdem('codigo')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Protocolo
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => alternarOrdem('nome')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Candidato & Documento
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => alternarOrdem('distrito')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Contacto & Distrito
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Cursos Pretendidos</th>
                <th
                  onClick={() => alternarOrdem('estado')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Estado do Dossiê
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => alternarOrdem('data')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Submissão
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensPaginados.length > 0 ? (
                itensPaginados.map((cand) => (
                  <tr
                    key={cand.id}
                    className="hover:bg-emerald-50/40 transition-colors group cursor-pointer"
                    onClick={() => setDossierAberto(cand)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="px-2 py-1 bg-slate-100 group-hover:bg-white rounded-md border border-slate-200">
                        {cand.codigo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{cand.nome}</div>
                      <div className="text-[11px] text-slate-500">{cand.bi} {cand.nif ? `· NIF ${cand.nif}` : ''}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{cand.contacto}</div>
                      <div className="text-[11px] text-slate-500">{cand.distrito}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-emerald-900 truncate" title={cand.curso_opcao1?.nome}>
                        1ª: {cand.curso_opcao1?.nome || '—'}
                      </div>
                      {cand.curso_opcao2?.nome && (
                        <div className="text-[11px] text-slate-500 truncate" title={cand.curso_opcao2.nome}>
                          2ª: {cand.curso_opcao2.nome}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadgeAdmin estado={cand.estado} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {cand.data_submissao || cand.data_criacao || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setDossierAberto(cand)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1 mx-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Dossiê</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-700">Nenhum dossiê de candidatura encontrado.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Ajuste os filtros de pesquisa ou estado para localizar registos.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* BARRA DE PAGINAÇÃO */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={itensPorPagina}
              onChange={(e) => { setItensPorPagina(Number(e.target.value)); setPaginaAtual(1); }}
              className="px-2 py-1 rounded-md border border-slate-300 bg-white"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>por página · Total: <strong>{candidaturasOrdenadas.length}</strong> registos</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={paginaAtual <= 1}
              onClick={() => setPaginaAtual(1)}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              title="Primeira Página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={paginaAtual <= 1}
              onClick={() => setPaginaAtual(paginaAtual - 1)}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              title="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-800">
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              type="button"
              disabled={paginaAtual >= totalPaginas}
              onClick={() => setPaginaAtual(paginaAtual + 1)}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              title="Próxima Página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={paginaAtual >= totalPaginas}
              onClick={() => setPaginaAtual(totalPaginas)}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-white disabled:opacity-40 cursor-pointer"
              title="Última Página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE DOSSIÊ */}
      {dossierAberto && (
        <AdminDossierModal
          candidatura={dossierAberto}
          candidaturasLista={candidaturasOrdenadas}
          token={tokens}
          onClose={() => setDossierAberto(null)}
          onNavigate={(nova) => setDossierAberto(nova)}
          onAtualizar={carregarLista}
          aoNotificar={aoNotificar}
        />
      )}

    </div>
  );
};
