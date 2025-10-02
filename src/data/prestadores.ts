
import { PrestadorServico } from '@/types/marketplace';

export const prestadores: PrestadorServico[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Eletricista', 'Técnico em Eletrônica'],
    avaliacao: 4.8,
    totalAvaliacoes: 127,
    endereco: 'Atende toda a região metropolitana',
    telefone: '(11) 99999-1111',
    email: 'carlos.eletricista@email.com',
    descricao: 'Eletricista com mais de 15 anos de experiência em instalações residenciais e comerciais.',
    experiencia: '15 anos',
    disponibilidade: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    precoBase: 80.00,
    galeria: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=300&fit=crop'
    ]
  },
  {
    id: '2',
    nome: 'Ana Costa',
    foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Diarista', 'Faxineira'],
    avaliacao: 4.9,
    totalAvaliacoes: 89,
    endereco: 'Zona Sul e Centro',
    telefone: '(11) 99999-2222',
    email: 'ana.limpeza@email.com',
    descricao: 'Profissional de limpeza dedicada e confiável, com excelentes referências.',
    experiencia: '8 anos',
    disponibilidade: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    precoBase: 120.00,
    galeria: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop'
    ]
  },
  {
    id: '3',
    nome: 'João Pereira',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Encanador', 'Técnico Hidráulico'],
    avaliacao: 4.7,
    totalAvaliacoes: 156,
    endereco: 'Toda a cidade',
    telefone: '(11) 99999-3333',
    email: 'joao.encanador@email.com',
    descricao: 'Especialista em instalações hidráulicas, vazamentos e desentupimentos.',
    experiencia: '12 anos',
    disponibilidade: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    precoBase: 90.00,
    galeria: [
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'
    ]
  },
  {
    id: '4',
    nome: 'Maria Santos',
    foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Cabeleireira', 'Manicure'],
    avaliacao: 4.9,
    totalAvaliacoes: 203,
    endereco: 'Atendimento domiciliar - Zona Norte',
    telefone: '(11) 99999-4444',
    email: 'maria.beleza@email.com',
    descricao: 'Cabeleireira e manicure profissional com atendimento domiciliar personalizado.',
    experiencia: '10 anos',
    disponibilidade: ['Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    precoBase: 60.00,
    galeria: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=300&fit=crop'
    ]
  },
  {
    id: '5',
    nome: 'Roberto Lima',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Pintor', 'Decorador'],
    avaliacao: 4.6,
    totalAvaliacoes: 78,
    endereco: 'Região Metropolitana',
    telefone: '(11) 99999-5555',
    email: 'roberto.pintor@email.com',
    descricao: 'Pintor profissional especializado em pintura residencial e comercial.',
    experiencia: '20 anos',
    disponibilidade: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    precoBase: 150.00,
    galeria: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300&h=300&fit=crop'
    ]
  },
  {
    id: '6',
    nome: 'Fernanda Oliveira',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    profissoes: ['Massagista', 'Fisioterapeuta'],
    avaliacao: 5.0,
    totalAvaliacoes: 45,
    endereco: 'Atendimento domiciliar - Toda cidade',
    telefone: '(11) 99999-6666',
    email: 'fernanda.massagem@email.com',
    descricao: 'Fisioterapeuta e massagista especializada em terapias relaxantes e terapêuticas.',
    experiencia: '7 anos',
    disponibilidade: ['Segunda', 'Quarta', 'Sexta', 'Sábado', 'Domingo'],
    precoBase: 100.00,
    galeria: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'
    ]
  }
];
