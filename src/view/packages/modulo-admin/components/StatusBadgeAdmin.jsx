import React from 'react';
import { Badge } from 'react-bootstrap';
import {
  Clock,
  Eye,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Ban,
  FileText,
} from 'lucide-react';

export const StatusBadgeAdmin = ({ estado, showIcon = true, className = '' }) => {
  switch (estado) {
    case 'PENDENTE':
      return (
        <Badge
          bg="warning-subtle"
          text="dark"
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border border-warning-subtle fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
        >
          {showIcon && <Clock style={{ width: '13px', height: '13px' }} />}
          <span>Pendente</span>
        </Badge>
      );
    case 'EM_ANALISE':
      return (
        <Badge
        bg='info-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
        >
          {showIcon && <Eye style={{ width: '13px', height: '13px' }} />}
          <span>Em Análise</span>
        </Badge>
      );
    case 'DEVOLVIDA':
      return (
        <Badge
        bg='secondary-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', borderColor: '#e9d5ff' }}
        >
          {showIcon && <RotateCcw style={{ width: '13px', height: '13px' }} />}
          <span>Devolvida</span>
        </Badge>
      );
    case 'CORRIGIDA':
      return (
        <Badge
        bg='primary-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#e0e7ff', color: '#3730a3', borderColor: '#c7d2fe' }}
        >
          {showIcon && <RotateCcw style={{ width: '13px', height: '13px' }} />}
          <span>Corrigida</span>
        </Badge>
      );
    case 'APROVADA':
      return (
        <Badge
        bg='success-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}
        >
          {showIcon && <CheckCircle2 style={{ width: '13px', height: '13px' }} />}
          <span>Aprovada</span>
        </Badge>
      );
    case 'REJEITADA':
      return (
        <Badge
        bg='danger-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fecaca' }}
        >
          {showIcon && <XCircle style={{ width: '13px', height: '13px' }} />}
          <span>Rejeitada</span>
        </Badge>
      );
    case 'CANCELADA':
      return (
        <Badge
        bg='secondary-subtle'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#e2e8f0' }}
        >
          {showIcon && <Ban style={{ width: '13px', height: '13px' }} />}
          <span>Cancelada</span>
        </Badge>
      );
    default:
      return (
        <Badge
        bg='light'
        text='dark'
          className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill border fw-semibold fs-7 ${className}`}
          style={{ backgroundColor: '#f3f4f6', color: '#374151', borderColor: '#e5e7eb' }}
        >
          {showIcon && <FileText style={{ width: '13px', height: '13px' }} />}
          <span>{estado || 'Rascunho'}</span>
        </Badge>
      );
  }
};

export default StatusBadgeAdmin;
