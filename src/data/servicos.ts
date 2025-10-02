
import { Servico } from '@/types/marketplace';

export const servicos: Servico[] = [
  // Carlos Silva - Eletricista
  {
    id: '1',
    nome: 'Instalação Elétrica Residencial',
    descricao: 'Instalação completa de sistema elétrico residencial com garantia.',
    preco: 200.00,
    duracao: '4-6 horas',
    prestadorId: '1',
    categoria: 'Elétrica'
  },
  {
    id: '2',
    nome: 'Reparo de Tomadas e Interruptores',
    descricao: 'Conserto e troca de tomadas, interruptores e disjuntores.',
    preco: 80.00,
    duracao: '1-2 horas',
    prestadorId: '1',
    categoria: 'Elétrica'
  },

  // Ana Costa - Diarista
  {
    id: '3',
    nome: 'Faxina Completa',
    descricao: 'Limpeza completa da casa incluindo todos os cômodos.',
    preco: 120.00,
    duracao: '4-5 horas',
    prestadorId: '2',
    categoria: 'Limpeza'
  },
  {
    id: '4',
    nome: 'Limpeza Pós-Obra',
    descricao: 'Limpeza especializada após reformas e construções.',
    preco: 180.00,
    duracao: '6-8 horas',
    prestadorId: '2',
    categoria: 'Limpeza'
  },

  // João Pereira - Encanador
  {
    id: '5',
    nome: 'Desentupimento de Pia',
    descricao: 'Desentupimento de pias, ralos e tubulações.',
    preco: 90.00,
    duracao: '1-2 horas',
    prestadorId: '3',
    categoria: 'Hidráulica'
  },
  {
    id: '6',
    nome: 'Instalação de Chuveiro',
    descricao: 'Instalação completa de chuveiro elétrico ou a gás.',
    preco: 150.00,
    duracao: '2-3 horas',
    prestadorId: '3',
    categoria: 'Hidráulica'
  },

  // Maria Santos - Cabeleireira
  {
    id: '7',
    nome: 'Corte e Escova',
    descricao: 'Corte de cabelo feminino com escova modeladora.',
    preco: 60.00,
    duracao: '1-2 horas',
    prestadorId: '4',
    categoria: 'Beleza'
  },
  {
    id: '8',
    nome: 'Manicure e Pedicure',
    descricao: 'Cuidados completos para unhas das mãos e pés.',
    preco: 45.00,
    duracao: '1 hora',
    prestadorId: '4',
    categoria: 'Beleza'
  },

  // Roberto Lima - Pintor
  {
    id: '9',
    nome: 'Pintura de Quarto',
    descricao: 'Pintura completa de quarto com tinta de qualidade.',
    preco: 300.00,
    duracao: '1-2 dias',
    prestadorId: '5',
    categoria: 'Pintura'
  },
  {
    id: '10',
    nome: 'Pintura de Fachada',
    descricao: 'Pintura externa de fachadas com tinta impermeável.',
    preco: 800.00,
    duracao: '3-5 dias',
    prestadorId: '5',
    categoria: 'Pintura'
  },

  // Fernanda Oliveira - Massagista
  {
    id: '11',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem terapêutica para alívio do estresse e tensões.',
    preco: 100.00,
    duracao: '1 hora',
    prestadorId: '6',
    categoria: 'Bem-estar'
  },
  {
    id: '12',
    nome: 'Fisioterapia Domiciliar',
    descricao: 'Sessão de fisioterapia no conforto da sua casa.',
    preco: 120.00,
    duracao: '1 hora',
    prestadorId: '6',
    categoria: 'Bem-estar'
  }
];
