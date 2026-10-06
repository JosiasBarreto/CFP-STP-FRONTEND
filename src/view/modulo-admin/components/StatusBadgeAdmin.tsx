import React from 'react';
import { EstadoCandidatura } from '../types';
import {
  Clock,
  Eye,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Ban,
  FileText,
} from 'lucide-react';

interface StatusBadgeAdminProps {
  estado: EstadoCandidatura | string;
  size?: 'sm' | 'md';
}

export const StatusBadgeAdmin: React.FC<StatusBadgeAdminProps> = ({
  estado,
  size = 'md',
}) => {
  const normalizado = String(estado || '').toUpperCase();

  const configs: Record<
    string,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ReactNode;
    }
  > = {
    RASCUNHO: {
      label: 'Rascunho',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-300',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    PENDENTE: {
      label: 'Pendente',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    EM_ANALISE: {
      label: 'Em Análise Técnica',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-300',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    DEVOLVIDA: {
      label: 'Devolvida p/ Correção',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-300',
      icon: <RotateCcw className="w-3.5 h-3.5" />,
    },
    CORRIGIDA: {
      label: 'Corrigida pelo Candidato',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: <RefreshCw className="w-3.5 h-3.5" />,
    },
    APROVADA: {
      label: 'Aprovada (Formando Ativo)',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REJEITADA: {
      label: 'Rejeitada',
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      icon: <XCircle className="w-3.5 h-3.5" />,
    },
    CANCELADA: {
      label: 'Cancelada',
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-300',
      icon: <Ban className="w-3.5 h-3.5" />,
    },
  };

  const item = configs[normalizado] || {
    label: estado,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    icon: <FileText className="w-3.5 h-3.5" />,
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5 font-bold';

  return (
    <span
      className={`inline-flex items-center rounded-lg border font-semibold tracking-tight shadow-2xs ${item.bg} ${item.text} ${item.border} ${sizeClasses}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
