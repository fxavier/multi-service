
export interface Merchant {
  id: string;
  nome: string;
  slug: string;
  logo: string;
  banner: string;
  descricao: string;
  tipo: 'loja' | 'farmacia' | 'restaurante' | 'petshop' | 'outros';
  avaliacao: number;
  totalAvaliacoes: number;
  endereco: string;
  telefone: string;
  email: string;
  horarioFuncionamento: string;
  tempoEntrega?: string;
  taxaEntrega?: number;
  entregaGratis?: boolean;
  destaque: boolean;
  ativo: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  merchantId: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  imagem: string;
  categoria: string;
  merchantId: string;
  disponivel: boolean;
  tempoPreparo?: string;
}

export interface PrestadorServico {
  id: string;
  nome: string;
  foto: string;
  profissoes: string[];
  avaliacao: number;
  totalAvaliacoes: number;
  endereco: string;
  telefone: string;
  email: string;
  descricao: string;
  experiencia: string;
  disponibilidade: string[];
  precoBase: number;
  galeria: string[];
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  prestadorId: string;
  categoria: string;
}

export interface ItemCarrinho {
  id: string;
  tipo: 'produto' | 'servico';
  produtoId?: string;
  servicoId?: string;
  merchantId?: string;
  prestadorId?: string;
  nome: string;
  preco: number;
  quantidade: number;
  imagem: string;
  observacoes?: string;
}

export interface Agendamento {
  id: string;
  prestadorId: string;
  servicoId: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  endereco: string;
  data: string;
  horario: string;
  observacoes?: string;
  precoTotal: number;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
}

export interface Pedido {
  id: string;
  numero: string;
  itens: ItemCarrinho[];
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  endereco: string;
  metodoPagamento: string;
  tipoEntrega: 'retirada' | 'entrega';
  subtotal: number;
  taxaEntrega: number;
  total: number;
  status: 'pendente' | 'confirmado' | 'preparando' | 'entregue' | 'cancelado';
  dataHora: string;
}
