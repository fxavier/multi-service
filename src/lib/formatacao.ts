
/**
 * Utilitários de formatação para Moçambique
 */

const formatadorMetical = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata valores monetários em Meticais Moçambicanos
 */
export function formatarMoeda(valor: number): string {
  return formatadorMetical.format(valor);
}

/**
 * Formata valores monetários simples (apenas número + código da moeda)
 */
export function formatarMoedaSimples(valor: number): string {
  return `MZN ${valor.toFixed(2).replace('.', ',')}`;
}

/**
 * Formata números com separadores de milhares
 */
export function formatarNumero(numero: number): string {
  return new Intl.NumberFormat('pt-MZ').format(numero);
}

/**
 * Formata datas no padrão moçambicano
 */
export function formatarData(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dataObj);
}

/**
 * Formata data e hora no padrão moçambicano
 */
export function formatarDataHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
}

/**
 * Formata apenas a hora
 */
export function formatarHora(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return new Intl.DateTimeFormat('pt-MZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataObj);
}

/**
 * Formata números de telefone moçambicanos
 */
export function formatarTelefone(telefone: string): string {
  // Remove todos os caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  // Formata para o padrão moçambicano (+258 XX XXX XXXX)
  if (numeroLimpo.length === 9) {
    return `+258 ${numeroLimpo.slice(0, 2)} ${numeroLimpo.slice(2, 5)} ${numeroLimpo.slice(5)}`;
  }
  
  // Se já tem código do país
  if (numeroLimpo.length === 12 && numeroLimpo.startsWith('258')) {
    return `+${numeroLimpo.slice(0, 3)} ${numeroLimpo.slice(3, 5)} ${numeroLimpo.slice(5, 8)} ${numeroLimpo.slice(8)}`;
  }
  
  return telefone; // Retorna original se não conseguir formatar
}

/**
 * Lista de províncias de Moçambique
 */
export const provincias = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa'
];

/**
 * Lista de distritos de Maputo
 */
export const distritosMaputo = [
  'KaMpfumo',
  'Nlhamankulu',
  'KaMaxakeni',
  'KaMavota',
  'KaMubukwana',
  'KaTembe',
  'KaNyaka'
];

/**
 * Valida números de telefone moçambicanos
 */
export function validarTelefone(telefone: string): boolean {
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  // Verifica se tem 9 dígitos (formato local) ou 12 dígitos (com código do país)
  if (numeroLimpo.length === 9) {
    // Verifica se começa com 8 (números móveis em Moçambique)
    return numeroLimpo.startsWith('8');
  }
  
  if (numeroLimpo.length === 12) {
    // Verifica se começa com 258 (código do país) seguido de 8
    return numeroLimpo.startsWith('2588');
  }
  
  return false;
}

/**
 * Valida endereços de email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
