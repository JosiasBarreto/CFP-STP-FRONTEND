import React, { useState } from 'react';
import { UtilizadorAdmin } from './types';
import { AdminLoginCard } from './components/AdminLoginCard';
import { AdminGestaoView } from './components/AdminGestaoView';
import { AdminTestSuiteView } from './components/AdminTestSuiteView';
import { AdminNavbar, AdminAbaAtiva } from './components/AdminNavbar';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ModuloAdminAppProps {
  aoNotificar?: (msg: { tipo: 'sucesso' | 'erro'; texto: string } | null) => void;
}

export const ModuloAdminApp: React.FC<ModuloAdminAppProps> = () => {
  const [adminToken, setAdminToken] = useState<string>(() => {
    return localStorage.getItem('cfp_admin_token') || '';
  });
  const [adminUser, setAdminUser] = useState<UtilizadorAdmin | null>(() => {
    try {
      const saved = localStorage.getItem('cfp_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [abaAtiva, setAbaAtiva] = useState<AdminAbaAtiva>('dossiers');
  const [feedbackMsg, setFeedbackMsg] = useState<{
    tipo: 'sucesso' | 'erro';
    texto: string;
  } | null>(null);

  const aoNotificar = (msg: { tipo: 'sucesso' | 'erro'; texto: string } | null) => {
    setFeedbackMsg(msg);
    if (msg) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = (token: string, user: UtilizadorAdmin) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('cfp_admin_token', token);
    localStorage.setItem('cfp_admin_user', JSON.stringify(user));
    aoNotificar({
      tipo: 'sucesso',
      texto: `Sessão iniciada com sucesso. Bem-vindo(a), ${user.nome} (${user.role.toUpperCase()}).`,
    });
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminUser(null);
    localStorage.removeItem('cfp_admin_token');
    localStorage.removeItem('cfp_admin_user');
    setFeedbackMsg(null);
  };

  // Se não estiver autenticado, exibe a tela de login institucional
  if (!adminToken || !adminUser) {
    return (
      <div className="min-h-screen bg-slate-100/80 flex flex-col justify-between font-sans">
        <header className="bg-emerald-950 text-white border-b border-emerald-800 py-3.5 px-4 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-emerald-400/40 flex items-center justify-center font-bold text-white shadow-inner text-xs">
                CFP
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">
                  Centro de Formação Profissional de São Tomé e Príncipe
                </h1>
                <p className="text-[11px] text-emerald-300">
                  Portal Restrito de Administração e Gestão de Formandos
                </p>
              </div>
            </div>
            <span className="text-xs bg-emerald-900 border border-emerald-700 px-3 py-1 rounded-full text-emerald-200 font-semibold hidden sm:inline-block">
              Acesso Seguro (RBAC)
            </span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {feedbackMsg && (
              <div
                className={`mb-4 p-4 rounded-2xl border flex items-center justify-between text-xs font-medium ${
                  feedbackMsg.tipo === 'sucesso'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackMsg.tipo === 'sucesso' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                  )}
                  <span>{feedbackMsg.texto}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFeedbackMsg(null)}
                  className="p-1 hover:opacity-75"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <AdminLoginCard aoAutenticar={handleLogin} />
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
          CFP-STP · São Tomé e Príncipe · Sistema Oficial de Gestão e Administração
        </footer>
      </div>
    );
  }

  // Se estiver autenticado, exibe o painel administrativo
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AdminNavbar
        abaAtiva={abaAtiva}
        aoMudarAba={(aba) => {
          setAbaAtiva(aba);
          setFeedbackMsg(null);
        }}
        utilizador={adminUser}
        aoTerminarSessao={handleLogout}
      />

      <main className="flex-1 max-w-[1840px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Banner de Feedback / Notificação */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-medium transition-all shadow-xs ${
              feedbackMsg.tipo === 'sucesso'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedbackMsg.tipo === 'sucesso' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{feedbackMsg.texto}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Conteúdo por Aba Ativa */}
        {abaAtiva === 'dossiers' && (
          <AdminGestaoView
            token={adminToken}
            utilizador={adminUser}
            aoNotificar={aoNotificar}
          />
        )}

        {abaAtiva === 'testes' && <AdminTestSuiteView token={adminToken} />}
      </main>

      <footer className="no-print border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-800">
              Centro de Formação Profissional de São Tomé e Príncipe (CFP-STP)
            </span>
            <span className="text-slate-400 block sm:inline sm:ml-2">
              Bairro Quinta de Santo António — São Tomé · Módulo de Administração
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <span>Sessão: {adminUser.nome}</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setAbaAtiva('testes')}
              className="text-emerald-800 hover:underline cursor-pointer"
            >
              Testes Automatizados
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export * from './types';
export * from './services/adminApi';
