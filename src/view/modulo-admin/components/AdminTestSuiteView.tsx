import React, { useState } from 'react';
import { Terminal, Play, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResultadoSuiteTestes } from '../types';
import { adminApi } from '../services/adminApi';

interface AdminTestSuiteViewProps {
  token?: string;
}

export const AdminTestSuiteView: React.FC<AdminTestSuiteViewProps> = ({ token }) => {
  const [executando, setExecutando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoSuiteTestes | null>(null);

  const handleExecutar = async () => {
    setExecutando(true);
    setResultado(null);
    try {
      const res = await adminApi.executarTestes(token);
      setResultado(res);
    } catch (e) {
      console.error(e);
    } finally {
      setExecutando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Auditoria e Integridade Técnica CFP-STP
            </span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
              <Terminal className="w-6 h-6 text-emerald-700" />
              Suíte de Testes Automatizados de Gestão e Segurança
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Executa a bateria de testes de integridade transacional, permissões RBAC de administração, ciclo de vida de candidaturas, devoluções, auditoria e homologação de formandos.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExecutar}
            disabled={executando}
            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {executando ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {executando ? 'A Executar Testes...' : 'Executar Testes de Validação'}
          </button>
        </div>

        {resultado ? (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-semibold uppercase">
                  Total de Testes
                </span>
                <p className="text-2xl font-bold text-slate-900">{resultado.total}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-semibold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprovados
                </span>
                <p className="text-2xl font-bold text-emerald-800">
                  {resultado.aprovados}
                </p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                <span className="text-[11px] text-rose-700 font-semibold uppercase flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Falhas
                </span>
                <p className="text-2xl font-bold text-rose-700">{resultado.falhas}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <span className="text-[11px] text-amber-800 font-semibold uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Erros
                </span>
                <p className="text-2xl font-bold text-amber-800">{resultado.erros}</p>
              </div>
            </div>

            <div className="bg-slate-950 text-emerald-100 p-5 rounded-xl text-xs overflow-x-auto shadow-inner border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 mb-2 border-b border-slate-800 pb-1.5 font-bold">
                <span>RELATÓRIO DETALHADO DA EXECUÇÃO DOS TESTES:</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  Status: {resultado.sucesso ? '✓ SUCESSO COMPLETO' : '⚠ VERIFICAR FALHAS'}
                </span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed font-mono">
                {resultado.saida_completa}
              </pre>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500">
            <ShieldCheck className="w-10 h-10 text-emerald-600/60 mx-auto mb-2" />
            <p className="text-xs">
              Clique em <strong>Executar Testes de Validação</strong> para executar a validação de segurança e regras do módulo administrativo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
