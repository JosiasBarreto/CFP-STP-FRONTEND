import {
  SEXOS_PERMITIDOS,
  ESTADOS_CIVIS_PERMITIDOS,
  DISTRITOS_PERMITIDOS,
  HABILITACOES_LITERARIAS_CONFIG,
} from './cursosData';

// Padrões maliciosos (SQL Injection, XSS, Script Tags, Event Handlers, Path Traversal)
const DANGEROUS_PATTERNS = [
  /<script\b[^>]*>/i,
  /<\/script>/i,
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  /on(load|error|click|mouseover|focus|blur|submit|change|keyup|keydown)\s*=/i,
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION)\b\s+\b(FROM|INTO|TABLE|DATABASE|ALL|SELECT|SET)\b/i,
  /(--|\/\*|\*\/)/,
  /<iframe/i,
  /<object/i,
  /<embed/i,
  /\.\.\//,
  /\.\.\\/,
  /\bxp_cmdshell\b/i,
  /\bOR\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
];

export const contemPadraoPerigoso = (valor) => {
  if (!valor) return false;
  return DANGEROUS_PATTERNS.some((regex) => regex.test(String(valor)));
};

export const sanitizarEntradaSegura = (valor, maxLen = 180) => {
  if (!valor) return '';
  return String(valor)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/--/g, '-')
    .slice(0, maxLen);
};

export const calcularIdade = (dataNasc) => {
  if (!dataNasc) return null;
  const hoje = new Date();
  const nasc = new Date(dataNasc);
  if (isNaN(nasc.getTime())) return null;
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
    idade--;
  }
  return idade;
};

export const comporHabilitacaoCompleta = (nivel, classe, area) => {
  if (!nivel) return '';
  const config = HABILITACOES_LITERARIAS_CONFIG.find((h) => h.id === nivel);
  const areaLimpa = area ? String(area).trim() : '';
  if (config?.exigeAreaCurso && areaLimpa) {
    return `${nivel} - ${classe} (${areaLimpa})`;
  }
  if (classe) {
    return `${nivel} (${classe})`;
  }
  return nivel;
};

export const normalizarTelefoneSTP = (telefone) => {
  if (!telefone) return '';
  return String(telefone).replace(/[^\d+\s-]/g, '').trim().slice(0, 18);
};

export const validarTelefoneSTP = (telefone) => {
  if (!telefone) return false;
  const limpo = String(telefone).replace(/[\s()-]/g, '');
  return /^(\+239|00239)?[29]\d{6}$/.test(limpo) || /^\+?[0-9]{7,15}$/.test(limpo);
};

export const LIMITE_TEXTO_CURTO = 180;
export const LIMITE_AREA_FORMACAO = 100;
