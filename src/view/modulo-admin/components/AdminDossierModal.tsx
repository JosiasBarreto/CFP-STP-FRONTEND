import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  History,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  FileSpreadsheet,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  AlertTriangle,
  Eye,
  ExternalLink,
  ShieldCheck,
  Ban,
  Layers,
  Sparkles,
  Award,
  IdCard,
  Building2,
  Clock,
  HeartHandshake,
  Check,
  Copy,
} from 'lucide-react';
import { CandidaturaAdmin, DocumentoAnexo } from '../types';
import { StatusBadgeAdmin } from './StatusBadgeAdmin';
import { adminApi } from '../services/adminApi';

interface AdminDossierModalProps {
  candidatura: CandidaturaAdmin;
  candidaturasLista: CandidaturaAdmin[];
  token: string;
  onClose: () => void;
  onNavigate: (novaCandidatura: CandidaturaAdmin) => void;
  onAtualizar: () => Promise<void>;
  aoNotificar: (msg: { tipo: 'sucesso' | 'erro'; texto: string } | null) => void;
}

type ModalAba = 'resumo' | 'documentos' | 'historico' | 'decisao';

export const AdminDossierModal: React.FC<AdminDossierModalProps> = ({
  candidatura,
  candidaturasLista,
  token,
  onClose,
  onNavigate,
  onAtualizar,
  aoNotificar,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<ModalAba>('resumo');
  const [detalhe, setDetalhe] = useState<CandidaturaAdmin>(candidatura);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);
  const [documentoSelecionado, setDocumentoSelecionado] = useState<DocumentoAnexo | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  // Estados de Decisão Técnica
  const [modalDevolver, setModalDevolver] = useState(false);
  const [motivoDevolucao, setMotivoDevolucao] = useState('');
  const [modalRejeitar, setModalRejeitar] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [modalAprovar, setModalAprovar] = useState(false);
  const [obsAprovacao, setObsAprovacao] = useState('');
  const [processandoAcao, setProcessandoAcao] = useState(false);

  const indexAtual = candidaturasLista.findIndex((c) => c.id === detalhe.id);
  const totalCandidaturas = candidaturasLista.length;
  const temAnterior = indexAtual > 0;
  const temSeguinte = indexAtual < totalCandidaturas - 1 && indexAtual !== -1;

  const irParaAnterior = useCallback(() => {
    if (temAnterior) {
      const prev = candidaturasLista[indexAtual - 1];
      setDetalhe(prev);
      onNavigate(prev);
    }
  }, [temAnterior, candidaturasLista, indexAtual, onNavigate]);

  const irParaSeguinte = useCallback(() => {
    if (temSeguinte) {
      const next = candidaturasLista[indexAtual + 1];
      setDetalhe(next);
      onNavigate(next);
    }
  }, [temSeguinte, candidaturasLista, indexAtual, onNavigate]);

  // Suporte a teclado: ← Anterior, → Seguinte, Escape Fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalDevolver || modalRejeitar || modalAprovar) return;
      if (e.key === 'ArrowLeft') {
        irParaAnterior();
      } else if (e.key === 'ArrowRight') {
        irParaSeguinte();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [irParaAnterior, irParaSeguinte, onClose, modalDevolver, modalRejeitar, modalAprovar]);

  // Carregar dados frescos e documentos ao mudar de candidatura
  useEffect(() => {
    let montado = true;
    const carregar = async () => {
      setCarregandoDetalhe(true);
      try {
        const full = await adminApi.obterDetalhesCandidatura(token, candidatura.id);
        if (montado) {
          setDetalhe(full);
          if (full.documentos && full.documentos.length > 0) {
            setDocumentoSelecionado(full.documentos[0]);
          } else {
            setDocumentoSelecionado(null);
          }
        }
      } catch {
        if (montado) setDetalhe(candidatura);
      } finally {
        if (montado) setCarregandoDetalhe(false);
      }
    };
    carregar();
    return () => {
      montado = false;
    };
  }, [candidatura.id, token]);

  const recarregarAtual = async () => {
    try {
      const full = await adminApi.obterDetalhesCandidatura(token, detalhe.id);
      setDetalhe(full);
      await onAtualizar();
    } catch {
      // ignore
    }
  };

  const copiarTexto = (texto: string, label: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(label);
    setTimeout(() => setCopiado(null), 2000);
  };

  const handleIniciarAnalise = async () => {
    setProcessandoAcao(true);
    aoNotificar(null);
    try {
      await adminApi.iniciarAnalise(token, detalhe.id);
      aoNotificar({
        tipo: 'sucesso',
        texto: `Análise técnica iniciada para ${detalhe.nome} (${detalhe.codigo}).`,
      });
      await recarregarAtual();
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleConfirmarDevolucao = async () => {
    if (!motivoDevolucao.trim() || motivoDevolucao.trim().length < 5) {
      aoNotificar({
        tipo: 'erro',
        texto: 'Especifique o motivo detalhado para a devolução (mínimo 5 caracteres).',
      });
      return;
    }
    setProcessandoAcao(true);
    try {
      await adminApi.devolverCandidatura(token, detalhe.id, motivoDevolucao);
      aoNotificar({
        tipo: 'sucesso',
        texto: `Dossiê devolvido para correção com registo em auditoria!`,
      });
      setModalDevolver(false);
      setMotivoDevolucao('');
      await recarregarAtual();
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleConfirmarRejeicao = async () => {
    if (!motivoRejeicao.trim() || motivoRejeicao.trim().length < 5) {
      aoNotificar({
        tipo: 'erro',
        texto: 'Indique a justificação formal da rejeição (mínimo 5 caracteres).',
      });
      return;
    }
    setProcessandoAcao(true);
    try {
      await adminApi.rejeitarCandidatura(token, detalhe.id, motivoRejeicao);
      aoNotificar({
        tipo: 'sucesso',
        texto: `Dossiê rejeitado formalmente.`,
      });
      setModalRejeitar(false);
      setMotivoRejeicao('');
      await recarregarAtual();
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleConfirmarAprovacao = async () => {
    setProcessandoAcao(true);
    try {
      const data = await adminApi.aprovarCandidatura(
        token,
        detalhe.id,
        obsAprovacao.trim() || undefined
      );
      aoNotificar({
        tipo: 'sucesso',
        texto: `Candidatura APROVADA! Formando criado com N.º de Processo ${data.processo} e Inscrição Nº ${data.inscricao_id}.`,
      });
      setModalAprovar(false);
      setObsAprovacao('');
      await recarregarAtual();
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setProcessandoAcao(false);
    }
  };

  const handleCancelarDossie = async () => {
    setProcessandoAcao(true);
    try {
      await adminApi.cancelarCandidatura(token, detalhe.id, 'Cancelada pela administração.');
      aoNotificar({ tipo: 'sucesso', texto: 'Candidatura cancelada.' });
      await recarregarAtual();
    } catch (e: any) {
      aoNotificar({ tipo: 'erro', texto: e.message });
    } finally {
      setProcessandoAcao(false);
    }
  };

  const getIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-6xl max-h-[94vh] bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden">
        
        {/* ==================================================================== */}
        {/* CABEÇALHO PREMIUM DO DOSSIÊ */}
        {/* ==================================================================== */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white px-5 sm:px-8 py-4.5 border-b border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center font-bold text-white shadow-inner text-base shrink-0">
              <User className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-bold text-sm tracking-wide text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-700/60">
                  {detalhe.codigo}
                </span>
                <StatusBadgeAdmin estado={detalhe.estado} />
                {detalhe.processo_numero && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                    Processo Nº {detalhe.processo_numero}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 leading-tight">
                {detalhe.nome}
              </h2>
            </div>
          </div>

          {/* Navegador Anterior / Seguinte & Botões de Ação Rápida */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0 border-emerald-900/60">
            {/* Controlo de Paginação do Dossiê */}
            <div className="flex items-center bg-emerald-900/60 rounded-xl p-1 border border-emerald-700/50 text-xs">
              <button
                type="button"
                onClick={irParaAnterior}
                disabled={!temAnterior}
                title="Dossiê Anterior (Seta Esquerda ←)"
                className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 font-mono text-xs text-emerald-200 font-bold select-none">
                {indexAtual !== -1 ? `${indexAtual + 1} de ${totalCandidaturas}` : '—'}
              </span>

              <button
                type="button"
                onClick={irParaSeguinte}
                disabled={!temSeguinte}
                title="Dossiê Seguinte (Seta Direita →)"
                className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Baixar Ficha PDF Oficial */}
            <button
              type="button"
              onClick={() => adminApi.baixarFichaOficialPdf(detalhe)}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Baixar Ficha Oficial de Inscrição CFP-STP (PDF 2 Páginas)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ficha PDF</span>
            </button>

            {/* Exportar Excel */}
            <button
              type="button"
              onClick={() => adminApi.exportarCandidaturaExcel(detalhe)}
              className="p-2 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-xl text-xs font-medium border border-emerald-700/50 cursor-pointer"
              title="Exportar Dossiê para Excel (XLSX)"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            {/* Fechar Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-rose-900/80 text-slate-300 hover:text-white rounded-xl text-xs font-medium border border-slate-700 hover:border-rose-600 cursor-pointer transition-all ml-1"
              title="Fechar (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* BARRA DE NAVEGAÇÃO DE ABAS INTERNAS */}
        {/* ==================================================================== */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 sm:px-8 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setAbaAtiva('resumo')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              abaAtiva === 'resumo'
                ? 'border-emerald-700 text-emerald-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-700" />
            1. Dados Pessoais &amp; Curso
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('documentos')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              abaAtiva === 'documentos'
                ? 'border-emerald-700 text-emerald-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            2. Ficheiros &amp; Pré-visualização em Tempo Real
            <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] rounded-full font-mono font-bold">
              {detalhe.documentos?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('historico')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              abaAtiva === 'historico'
                ? 'border-emerald-700 text-emerald-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-emerald-700" />
            3. Histórico de Auditoria
            <span className="ml-1 px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] rounded-full font-mono font-bold">
              {detalhe.historico?.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('decisao')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              abaAtiva === 'decisao'
                ? 'border-emerald-700 text-emerald-950 bg-white shadow-xs rounded-t-xl'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            4. Parecer &amp; Decisão Técnica
          </button>
        </div>

        {/* ==================================================================== */}
        {/* CORPO DINÂMICO DAS ABAS */}
        {/* ==================================================================== */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-slate-50/70">
          
          {/* --- ABA 1: DADOS PESSOAIS & CURSO (RECONSTRUÇÃO PROFISSIONAL E NÍTIDA) --- */}
          {abaAtiva === 'resumo' && (
            <div className="space-y-6">
              
              {/* HERO BANNER DO FORMANDO */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-emerald-600 shrink-0">
                    {getIniciais(detalhe.nome)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold text-xs rounded-md border border-emerald-200">
                        {detalhe.codigo}
                      </span>
                      <StatusBadgeAdmin estado={detalhe.estado} />
                      {detalhe.processo_numero && (
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-md border border-slate-300">
                          Processo: {detalhe.processo_numero}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {detalhe.nome}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {detalhe.habilitacao_literaria} · {detalhe.distrito} · {detalhe.sexo === 'M' || detalhe.sexo === 'Masculino' ? 'Masculino' : 'Feminino'} ({detalhe.idade ? `${detalhe.idade} anos` : 'Idade N/D'})
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <span className="text-slate-600 font-medium">Inscrição:</span>
                    <strong className="text-slate-900 font-mono">
                      {detalhe.data_submissao || detalhe.data_criacao}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-slate-600 font-medium">Ano Letivo:</span>
                    <strong className="text-slate-900 font-mono">{detalhe.ano || 2026}</strong>
                  </div>
                </div>
              </div>

              {/* GRELHA PRINCIPAL EM CARDS ESTRUTURADOS E NÍTIDOS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* COLUNA ESQUERDA: IDENTIFICAÇÃO E RESIDÊNCIA (7 COLUNAS) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* SECTOR 1: IDENTIFICAÇÃO CIVIL */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <IdCard className="w-5 h-5 text-emerald-700" />
                        <span>1. Identificação Civil &amp; Dados Pessoais</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Documentos Oficiais
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* BI */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Bilhete de Identidade (BI)
                          </span>
                          <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                            {detalhe.bi}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copiarTexto(detalhe.bi, 'bi')}
                          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                          title="Copiar BI"
                        >
                          {copiado === 'bi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* NIF */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Número de Identificação Fiscal (NIF)
                          </span>
                          <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                            {detalhe.nif || 'Não atribuído'}
                          </span>
                        </div>
                        {detalhe.nif && (
                          <button
                            type="button"
                            onClick={() => copiarTexto(detalhe.nif || '', 'nif')}
                            className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copiar NIF"
                          >
                            {copiado === 'nif' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      {/* Data de Nascimento */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Data de Nascimento &amp; Idade
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {detalhe.data_nascimento}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-md">
                            {detalhe.idade ? `${detalhe.idade} anos` : 'Idade N/D'}
                          </span>
                        </div>
                      </div>

                      {/* Sexo & Estado Civil */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Sexo &amp; Estado Civil
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.sexo === 'M' || detalhe.sexo === 'Masculino' ? 'Masculino' : 'Feminino'} · {detalhe.estado_civil}
                        </span>
                      </div>

                      {/* Nacionalidade & Naturalidade */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Nacionalidade &amp; Naturalidade
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.nacionalidade} ({detalhe.naturalidade || 'São Tomé'})
                        </span>
                      </div>

                      {/* Agregado Familiar */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Agregado Familiar
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.agregado || '1'} {Number(detalhe.agregado) === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </div>
                    </div>

                    {/* Filiação em Caixa Completa */}
                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/70 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                        Filiação (Pai e Mãe)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">Nome do Pai:</span>{' '}
                          <strong className="text-slate-900 text-sm block sm:inline">
                            {detalhe.nome_pai || 'Não declarado'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-medium">Nome da Mãe:</span>{' '}
                          <strong className="text-slate-900 text-sm block sm:inline">
                            {detalhe.nome_mae || 'Não declarado'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTOR 2: LOCALIZAÇÃO & CONTACTOS */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <MapPin className="w-5 h-5 text-emerald-700" />
                        <span>2. Residência &amp; Contactos Oficiais</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg">
                        {detalhe.distrito}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Telefone Principal */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-emerald-700" /> Telefone Principal
                          </span>
                          <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                            {detalhe.contacto}
                          </span>
                        </div>
                        <a
                          href={`tel:${detalhe.contacto}`}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-lg transition-colors"
                        >
                          Ligar
                        </a>
                      </div>

                      {/* Telefone Alternativo */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefone Alternativo
                        </span>
                        <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">
                          {detalhe.contacto_alternativo || 'Não informado'}
                        </span>
                      </div>

                      {/* Morada Completa */}
                      <div className="sm:col-span-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Morada / Local de Residência (Zona)
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.morada || detalhe.zona || 'Não especificada com detalhe'}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="sm:col-span-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-700" /> Correio Eletrónico (Email)
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.email || 'Não possui email registado'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* COLUNA DIREITA: CURSOS, HABILITAÇÕES & ENQUADRAMENTO (5 COLUNAS) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* SECTOR 3: OPÇÕES DE FORMAÇÃO */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <GraduationCap className="w-5 h-5 text-emerald-700" />
                        <span>3. Opções de Curso &amp; Formação</span>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      {/* Programa */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Programa Oficial CFP-STP
                        </span>
                        <span className="text-sm font-bold text-emerald-950 mt-0.5 block">
                          {detalhe.programa?.nome || 'Qualificação Inicial'}
                        </span>
                      </div>

                      {/* 1.ª Opção de Curso */}
                      <div className="bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-300 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 bg-emerald-800 text-white font-bold text-[11px] rounded-md uppercase tracking-wider">
                            1.ª Opção (Pretendida)
                          </span>
                          {detalhe.curso_opcao1?.duracao_mes && (
                            <span className="text-xs font-bold text-emerald-900 font-mono">
                              {detalhe.curso_opcao1.duracao_mes} Meses
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-emerald-950 leading-snug">
                          {detalhe.curso_opcao1?.nome || `Curso #${detalhe.curso_opcao1_id}`}
                        </h4>
                        <div className="pt-1 text-xs text-emerald-800 space-y-1 font-medium">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Horário: <strong>{detalhe.curso_opcao1?.horario || '08h00 às 13h00'}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Local: <strong>{detalhe.curso_opcao1?.local_realizacao || 'CFP-STP São Tomé'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* 2.ª Opção de Curso */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          2.ª Opção de Curso (Alternativa)
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                          {detalhe.curso_opcao2?.nome || 'Nenhuma 2.ª opção selecionada'}
                        </span>
                      </div>

                      {/* Motivo da Inscrição */}
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Motivo Declarado da Inscrição
                        </span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">
                          {detalhe.motivo_inscricao || 'Qualificação profissional para inserção no mercado de trabalho.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTOR 4: HABILITAÇÕES & SITUAÇÃO PROFISSIONAL */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                        <Briefcase className="w-5 h-5 text-emerald-700" />
                        <span>4. Habilitações &amp; Situação Profissional</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Habilitações */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Habilitações Literárias Concluídas
                        </span>
                        <strong className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.habilitacao_literaria}
                        </strong>
                      </div>

                      {/* Situação no Emprego */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Situação Perante o Emprego
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {detalhe.situacao_emprego || 'Candidato à Procura do 1º Emprego'}
                        </span>
                      </div>

                      {/* Ocupação */}
                      <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Ocupação Atual
                        </span>
                        <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                          {detalhe.ocupacao || 'Desempregado(a)'}
                        </span>
                      </div>

                      {/* Casos Especiais & Apoio Social */}
                      <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 space-y-1">
                        <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block flex items-center gap-1">
                          <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                          Enquadramento Especial / Apoio Social
                        </span>
                        <div className="text-xs text-amber-950 font-medium">
                          <p>
                            Portador de Deficiência: <strong>{detalhe.deficiente ? 'Sim' : 'Não'}</strong>
                          </p>
                          <p className="mt-0.5">
                            Apoio Social: <strong>{detalhe.encaminhado_apoio_social ? `Sim (${detalhe.instituicao_apoio_social || 'Instituição Social'})` : 'Não'}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* --- ABA 2: FICHEIROS & VISUALIZADOR EM TEMPO REAL --- */}
          {abaAtiva === 'documentos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
              {/* Lista lateral de ficheiros anexados */}
              <div className="lg:col-span-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Documentos Registados ({detalhe.documentos?.length || 0})
                </h4>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {detalhe.documentos && detalhe.documentos.length > 0 ? (
                    detalhe.documentos.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setDocumentoSelecionado(doc)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          documentoSelecionado?.id === doc.id
                            ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {doc.tipo}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate font-mono">
                            {doc.nome_original}
                          </span>
                        </div>
                        <a
                          href={`/api/candidaturas/documentos/${doc.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg shrink-0"
                          title="Transferir / Abrir Ficheiro"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-500 text-xs">
                      Nenhum anexo digital anexado diretamente. Os documentos foram verificados presencialmente no ato da inscrição.
                    </div>
                  )}

                  {/* Ficha Oficial Gerada em Tempo Real */}
                  <div
                    onClick={() => setDocumentoSelecionado(null)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      documentoSelecionado === null
                        ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Ficha Oficial de Inscrição CFP-STP (2 Páginas)
                      </span>
                      <span className="text-[11px] text-emerald-700 block">
                        Gerada em tempo real com selos oficiais
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => adminApi.baixarFichaOficialPdf(detalhe)}
                      className="p-1.5 text-emerald-800 hover:bg-emerald-100 rounded-lg shrink-0"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pré-visualizador em tempo real do ficheiro */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 flex flex-col min-h-[480px]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">
                      {documentoSelecionado
                        ? `Visualização: ${documentoSelecionado.tipo} (${documentoSelecionado.nome_original})`
                        : `Visualização da Ficha Oficial em PDF (${detalhe.codigo})`}
                    </span>
                  </div>
                  {documentoSelecionado ? (
                    <a
                      href={`/api/candidaturas/documentos/${documentoSelecionado.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Abrir em Separador
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => adminApi.baixarFichaOficialPdf(detalhe)}
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descarregar PDF
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full rounded-xl bg-slate-950/5 border border-slate-200 overflow-hidden flex items-center justify-center min-h-[400px]">
                  {documentoSelecionado ? (
                    <iframe
                      src={`/api/candidaturas/documentos/${documentoSelecionado.id}/download`}
                      title="Visualizador do Documento"
                      className="w-full h-full min-h-[440px] border-0"
                    />
                  ) : (
                    <iframe
                      src={`/api/candidaturas/${detalhe.id}/ficha-inscricao?download=false`}
                      title="Pré-visualização da Ficha Oficial"
                      className="w-full h-full min-h-[440px] border-0"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- ABA 3: HISTÓRICO DE AUDITORIA --- */}
          {abaAtiva === 'historico' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-700" />
                  Rastreabilidade e Log de Auditoria do Dossiê
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  {detalhe.historico?.length || 0} eventos registados
                </span>
              </div>

              {detalhe.historico && detalhe.historico.length > 0 ? (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                  {detalhe.historico.map((h, i) => (
                    <div key={h.id || i} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-xs" />
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{h.acao}</span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {h.estado_novo}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">{h.data_criacao}</span>
                        </div>
                        <p className="text-slate-700 text-xs">{h.observacao}</p>
                        <span className="text-[11px] text-slate-500 block">
                          Operador: <strong>{h.utilizador_nome}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs py-8 text-center">
                  Sem eventos de auditoria registados até ao momento.
                </p>
              )}
            </div>
          )}

          {/* --- ABA 4: PARECER & DECISÃO TÉCNICA --- */}
          {abaAtiva === 'decisao' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    Fluxo de Decisão Administrativa e Homologação
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Execute a deliberação técnica oficial sobre a admissão do formando no curso pretendido.
                  </p>
                </div>
                <StatusBadgeAdmin estado={detalhe.estado} />
              </div>

              {/* Status Action Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Iniciar Análise */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      1. Análise Técnica
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      Coloca o dossiê sob verificação formal da secretaria ou comissão técnica.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={detalhe.estado === 'EM_ANALISE' || detalhe.estado === 'APROVADA' || processandoAcao}
                    onClick={handleIniciarAnalise}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    {detalhe.estado === 'EM_ANALISE' ? 'Já em Análise' : 'Iniciar Análise'}
                  </button>
                </div>

                {/* 2. Devolver para Correção */}
                <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-orange-950 block">
                      2. Devolver p/ Retificação
                    </span>
                    <p className="text-xs text-orange-800 mt-1">
                      Devolve o processo ao candidato com motivo formal para regularização.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={detalhe.estado === 'APROVADA' || processandoAcao}
                    onClick={() => setModalDevolver(true)}
                    className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Devolver com Motivo
                  </button>
                </div>

                {/* 3. Homologar e Aprovar */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">
                      3. Aprovação &amp; Matrícula
                    </span>
                    <p className="text-xs text-emerald-800 mt-1">
                      Gera o N.º de Processo Oficial do Formando e valida a inscrição.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={detalhe.estado === 'APROVADA' || processandoAcao}
                    onClick={() => setModalAprovar(true)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {detalhe.estado === 'APROVADA' ? 'Formando Homologado' : 'Aprovar Formando'}
                  </button>
                </div>
              </div>

              {/* Botões Secundários: Rejeitar ou Cancelar */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={detalhe.estado === 'APROVADA' || detalhe.estado === 'REJEITADA' || processandoAcao}
                    onClick={() => setModalRejeitar(true)}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Rejeitar Candidatura
                  </button>

                  <button
                    type="button"
                    disabled={detalhe.estado === 'CANCELADA' || processandoAcao}
                    onClick={handleCancelarDossie}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Cancelar
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adminApi.baixarFichaOficialPdf(detalhe)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar Ficha PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* RODAPÉ DO MODAL COM BOTÕES ANTERIOR / SEGUINTE */}
        {/* ==================================================================== */}
        <div className="bg-white border-t border-slate-200 px-5 sm:px-8 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={irParaAnterior}
              disabled={!temAnterior}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:hover:bg-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>
            <button
              type="button"
              onClick={irParaSeguinte}
              disabled={!temSeguinte}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-30 disabled:hover:bg-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              Seguinte
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              Fechar Dossiê
            </button>
          </div>
        </div>

        {/* --- MODAIS INTERNOS: DEVOLUÇÃO / REJEIÇÃO / APROVAÇÃO --- */}
        {modalDevolver && (
          <div className="absolute inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                Devolver Candidatura para Retificação
              </h3>
              <p className="text-xs text-slate-600">
                Especifique a documentação pendente ou motivo para que fique registado na auditoria e visível ao candidato.
              </p>
              <textarea
                rows={4}
                required
                placeholder="Ex: Fotocópia do Certificado de Habilitações não autenticada..."
                value={motivoDevolucao}
                onChange={(e) => setMotivoDevolucao(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-orange-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalDevolver(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarDevolucao}
                  disabled={processandoAcao}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 cursor-pointer"
                >
                  Confirmar Devolução
                </button>
              </div>
            </div>
          </div>
        )}

        {modalRejeitar && (
          <div className="absolute inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                Rejeição Formal da Candidatura
              </h3>
              <p className="text-xs text-slate-600">
                Indique a fundamentação técnica para a não admissão do candidato.
              </p>
              <textarea
                rows={4}
                required
                placeholder="Ex: Não preenche os pré-requisitos de escolaridade mínima..."
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-600"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalRejeitar(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarRejeicao}
                  disabled={processandoAcao}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Confirmar Rejeição
                </button>
              </div>
            </div>
          </div>
        )}

        {modalAprovar && (
          <div className="absolute inset-0 bg-black/60 z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                Homologar Admissão do Formando
              </h3>
              <p className="text-xs text-slate-600">
                O sistema gerará automaticamente o N.º de Processo Oficial do Formando e efetuará a matrícula no curso de 1.ª Opção: <strong>{detalhe.curso_opcao1?.nome}</strong>.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parecer / Observações (Opcional):
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Documentação conforme e vaga atribuída na turma matinal."
                  value={obsAprovacao}
                  onChange={(e) => setObsAprovacao(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-700"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAprovar(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarAprovacao}
                  disabled={processandoAcao}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Homologar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
