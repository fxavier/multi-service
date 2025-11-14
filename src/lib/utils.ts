
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const formatadorMetical = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata valores monetários em Meticais Moçambicanos
 */
export function formatarMoeda(valor: number): string {
  return formatadorMetical.format(valor);
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
