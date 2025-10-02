
import { Produto } from '@/types/marketplace';

export const produtos: Produto[] = [
  // Supermercado Maputo Central
  {
    id: '1',
    nome: 'Maçã Importada',
    descricao: 'Maçãs frescas importadas da África do Sul, ideais para lanches saudáveis.',
    preco: 180.00,
    imagem: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
    categoria: 'Frutas e Verduras',
    merchantId: '1',
    disponivel: true
  },
  {
    id: '2',
    nome: 'Leite Integral 1L',
    descricao: 'Leite integral fresco nacional, rico em cálcio e vitaminas.',
    preco: 120.00,
    imagem: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop&crop=center',
    categoria: 'Laticínios',
    merchantId: '1',
    disponivel: true
  },
  {
    id: '3',
    nome: 'Pão Português',
    descricao: 'Pão português fresquinho, assado diariamente na padaria.',
    preco: 25.00,
    imagem: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center',
    categoria: 'Padaria',
    merchantId: '1',
    disponivel: true
  },

  // Farmácia Saúde Total
  {
    id: '4',
    nome: 'Paracetamol 500mg',
    descricao: 'Analgésico e antitérmico para dores e febre.',
    preco: 250.00,
    imagem: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&crop=center',
    categoria: 'Medicamentos',
    merchantId: '2',
    disponivel: true
  },
  {
    id: '5',
    nome: 'Shampoo Anticaspa',
    descricao: 'Shampoo especial para tratamento de caspa e couro cabeludo.',
    preco: 420.00,
    imagem: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop&crop=center',
    categoria: 'Higiene Pessoal',
    merchantId: '2',
    disponivel: true
  },

  // Restaurante Maputo Bay
  {
    id: '6',
    nome: 'Camarão Grelhado',
    descricao: 'Camarões frescos da Baía de Maputo grelhados com temperos especiais.',
    preco: 850.00,
    precoPromocional: 750.00,
    imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop&crop=center',
    categoria: 'Frutos do Mar',
    merchantId: '3',
    disponivel: true,
    tempoPreparo: '25-35 min'
  },
  {
    id: '7',
    nome: 'Matapa com Caranguejo',
    descricao: 'Prato tradicional moçambicano com folhas de mandioca e caranguejo.',
    preco: 650.00,
    imagem: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&h=300&fit=crop&crop=center',
    categoria: 'Pratos Tradicionais',
    merchantId: '3',
    disponivel: true,
    tempoPreparo: '30-40 min'
  },

  // Pet Shop Amigo Fiel
  {
    id: '8',
    nome: 'Ração Premium Cães Adultos',
    descricao: 'Ração super premium para cães adultos de todas as raças.',
    preco: 2200.00,
    precoPromocional: 1950.00,
    imagem: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&h=300&fit=crop&crop=center',
    categoria: 'Ração',
    merchantId: '4',
    disponivel: true
  },
  {
    id: '9',
    nome: 'Brinquedo Corda para Cães',
    descricao: 'Brinquedo resistente de corda para diversão do seu animal de estimação.',
    preco: 320.00,
    imagem: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop&crop=center',
    categoria: 'Brinquedos',
    merchantId: '4',
    disponivel: true
  },

  // TechMax
  {
    id: '10',
    nome: 'Smartphone Samsung Galaxy A54',
    descricao: 'Smartphone com tela de 6.4", 128GB, câmera tripla.',
    preco: 32500.00,
    precoPromocional: 29900.00,
    imagem: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop&crop=center',
    categoria: 'Smartphones',
    merchantId: '5',
    disponivel: true
  },
  {
    id: '11',
    nome: 'Fone Bluetooth Premium',
    descricao: 'Fone de ouvido sem fio com cancelamento de ruído.',
    preco: 7500.00,
    imagem: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&crop=center',
    categoria: 'Acessórios',
    merchantId: '5',
    disponivel: true
  },

  // Churrasqueira Matola
  {
    id: '12',
    nome: 'Espetada de Carne Bovina',
    descricao: 'Espetada tradicional com carne bovina grelhada e temperos especiais.',
    preco: 620.00,
    imagem: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop&crop=center',
    categoria: 'Churrascos',
    merchantId: '6',
    disponivel: true,
    tempoPreparo: '15-20 min'
  },
  {
    id: '13',
    nome: 'Xima com Frango',
    descricao: 'Xima tradicional acompanhada de frango grelhado.',
    preco: 380.00,
    imagem: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=300&fit=crop&crop=center',
    categoria: 'Pratos Tradicionais',
    merchantId: '6',
    disponivel: true,
    tempoPreparo: '20-25 min'
  }
];
