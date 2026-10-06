import React from 'react';
import {
  ShieldCheck,
  Users,
  Terminal,
  LogOut,
} from 'lucide-react';
import { UtilizadorAdmin } from '../types';

export type AdminAbaAtiva = 'dossiers' | 'testes';

interface AdminNavbarProps {
  abaAtiva: AdminAbaAtiva;
  aoMudarAba: (aba: AdminAbaAtiva) => void;
  utilizador: UtilizadorAdmin;
  aoTerminarSessao: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  abaAtiva,
  aoMudarAba,
  utilizador,
  aoTerminarSessao,
}) => {
  return (
    <header className="no-print bg-emerald-950 text-white border-b border-emerald-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-[1840px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Marca Institucional do CFP-STP */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-400/40 flex items-center justify-center font-bold text-white shadow-inner text-sm">
              CFP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold leading-tight tracking-tight text-white">
                  CFP-STP · Sistema de Gestão e Administração
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-[10px] font-bold text-emerald-200 border border-emerald-700">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Módulo Admin
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                Centro de Formação Profissional de São Tomé e Príncipe · Painel de Controlo
              </p>
            </div>
          </div>

          {/* Navegação entre Abas do Módulo Admin */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => aoMudarAba('dossiers')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                abaAtiva === 'dossiers'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900'
              }`}
            >
              <Users className="w-4 h-4" />
              Painel de Dossiês &amp; Inscrições
            </button>

            <button
              type="button"
              onClick={() => aoMudarAba('testes')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                abaAtiva === 'testes'
                  ? 'bg-emerald-500 text-emerald-950 font-bold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-emerald-900'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Suíte de Testes
            </button>
          </nav>

          {/* Perfil do Utilizador Autenticado e Terminar Sessão */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {utilizador.nome}
              </span>
              <span className="text-[10px] text-emerald-300 font-medium">
                Papel: {utilizador.role.toUpperCase()}
              </span>
            </div>

            <button
              type="button"
              onClick={aoTerminarSessao}
              className="px-3 py-1.5 bg-emerald-900/80 hover:bg-rose-900/80 border border-emerald-700/50 hover:border-rose-600 text-emerald-100 hover:text-white rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              title="Terminar Sessão Administrativa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Barra de Abas Mobile */}
        <div className="md:hidden flex items-center justify-between border-t border-emerald-900 py-2 gap-2">
          <button
            type="button"
            onClick={() => aoMudarAba('dossiers')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
              abaAtiva === 'dossiers' ? 'bg-emerald-600 text-white' : 'text-emerald-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Dossiês
          </button>
          <button
            type="button"
            onClick={() => aoMudarAba('testes')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 ${
              abaAtiva === 'testes' ? 'bg-emerald-500 text-emerald-950 font-bold' : 'text-emerald-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Testes
          </button>
        </div>
      </div>
    </header>
  );
};
