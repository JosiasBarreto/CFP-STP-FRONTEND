import React, { useState } from 'react';
import { Lock, LogIn, ShieldCheck } from 'lucide-react';
import { UtilizadorAdmin } from '../types';
import { adminApi } from '../services/adminApi';

interface AdminLoginCardProps {
  aoAutenticar: (token: string, utilizador: UtilizadorAdmin) => void;
}

export const AdminLoginCard: React.FC<AdminLoginCardProps> = ({ aoAutenticar }) => {
  const [identificador, setIdentificador] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const data = await adminApi.login(identificador, password);
      if (data.utilizador.role !== 'admin' && data.utilizador.role !== 'staff') {
        setErro('Apenas utilizadores autorizados da administração (admin/staff) podem aceder.');
        return;
      }
      aoAutenticar(data.token, data.utilizador);
    } catch (err: any) {
      setErro(err.message || 'Credenciais inválidas.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl shadow-lg border border-emerald-200 p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center mx-auto text-emerald-800">
          <Lock className="w-6 h-6" />
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5" />
          Módulo de Administração CFP-STP
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Área Restrita de Gestão Técnica
        </h2>
        <p className="text-xs text-slate-500">
          Acesso exclusivo à comissão técnica e secretaria para análise, devolução, rejeição e aprovação transacional de candidaturas.
        </p>
      </div>

      {erro && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Utilizador ou Email Institucional
          </label>
          <input
            type="text"
            required
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-700"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Palavra-passe
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-emerald-700"
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          {carregando ? 'A autenticar...' : 'Iniciar Sessão na Gestão CFP'}
        </button>

        <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-[11px] text-emerald-900 flex items-center justify-between">
          <span>
            Admin: <strong>admin</strong> / <strong>admin123</strong>
          </span>
          <span>
            Staff: <strong>staff</strong> / <strong>staff123</strong>
          </span>
        </div>
      </form>
    </div>
  );
};
