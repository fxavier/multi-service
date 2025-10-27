
'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  precoPromocional?: number;
  categoria: string;
  imagem: string;
  disponivel: boolean;
  estoque?: number;
}

interface Pedido {
  id: string;
  numero: string;
  clienteNome: string;
  total: number;
  status: string;
  dataHora: string;
  itens: any[];
}

export default function DashboardMerchant() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formProduto, setFormProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    precoPromocional: '',
    categoria: '',
    imagem: '',
    disponivel: true,
    estoque: ''
  });

  // Simular dados do merchant logado
  const merchantId = '1'; // Em um app real, viria da autenticação

  useEffect(() => {
    // Carregar produtos do merchant
    const produtosSalvos = localStorage.getItem(`merchant-${merchantId}-produtos`);
    if (produtosSalvos) {
      setProdutos(JSON.parse(produtosSalvos));
    }

    // Carregar pedidos do merchant
    const pedidosSalvos = localStorage.getItem('marketplace-pedidos');
    if (pedidosSalvos) {
      const todosPedidos = JSON.parse(pedidosSalvos);
      const pedidosMerchant = todosPedidos.filter((pedido: any) => 
        pedido.itens.some((item: any) => item.merchantId === merchantId)
      );
      setPedidos(pedidosMerchant);
    }
  }, [merchantId]);

  const salvarProdutos = (novosProdutos: Produto[]) => {
    localStorage.setItem(`merchant-${merchantId}-produtos`, JSON.stringify(novosProdutos));
    setProdutos(novosProdutos);
  };

  const handleSalvarProduto = () => {
    if (!formProduto.nome || !formProduto.preco || !formProduto.categoria) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const produto: Produto = {
      id: produtoEditando?.id || Date.now().toString(),
      nome: formProduto.nome,
      descricao: formProduto.descricao,
      preco: parseFloat(formProduto.preco),
      precoPromocional: formProduto.precoPromocional ? parseFloat(formProduto.precoPromocional) : undefined,
      categoria: formProduto.categoria,
      imagem: formProduto.imagem || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
      disponivel: formProduto.disponivel,
      estoque: formProduto.estoque ? parseInt(formProduto.estoque) : undefined
    };

    let novosProdutos;
    if (produtoEditando) {
      novosProdutos = produtos.map(p => p.id === produto.id ? produto : p);
      toast.success('Produto atualizado com sucesso!');
    } else {
      novosProdutos = [...produtos, produto];
      toast.success('Produto adicionado com sucesso!');
    }

    salvarProdutos(novosProdutos);
    setDialogAberto(false);
    resetForm();
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setFormProduto({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      precoPromocional: produto.precoPromocional?.toString() || '',
      categoria: produto.categoria,
      imagem: produto.imagem,
      disponivel: produto.disponivel,
      estoque: produto.estoque?.toString() || ''
    });
    setDialogAberto(true);
  };

  const handleRemoverProduto = (id: string) => {
    const novosProdutos = produtos.filter(p => p.id !== id);
    salvarProdutos(novosProdutos);
    toast.success('Produto removido com sucesso!');
  };

  const resetForm = () => {
    setProdutoEditando(null);
    setFormProduto({
      nome: '',
      descricao: '',
      preco: '',
      precoPromocional: '',
      categoria: '',
      imagem: '',
      disponivel: true,
      estoque: ''
    });
  };

  const totalVendas = pedidos.reduce((total, pedido) => total + pedido.total, 0);
  const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard do Estabelecimento</h1>
        <p className="text-muted-foreground">
          Gerencie seus produtos, pedidos e vendas
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">{produtos.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
                <p className="text-2xl font-bold">{pedidosPendentes}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-2xl font-bold">MT {totalVendas.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{pedidos.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="produtos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gerenciar Produtos</CardTitle>
                <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {produtoEditando ? 'Editar Produto' : 'Adicionar Produto'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome do Produto *</Label>
                        <Input
                          id="nome"
                          value={formProduto.nome}
                          onChange={(e) => setFormProduto(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome do produto"
                        />
                      </div>

                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={formProduto.descricao}
                          onChange={(e) => setFormProduto(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Descrição do produto"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preco">Preço (MT) *</Label>
                          <Input
                            id="preco"
                            type="number"
                            step="0.01"
                            value={formProduto.preco}
                            onChange={(e) => setFormProduto(prev => ({ ...prev, preco: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="precoPromocional">Preço Promocional</Label>
                          <Input
                            id="precoPromocional"
                            type="number"
                            step="0.01"
                            value={formProduto.precoPromocional}
                            onChange={(e) => setFormProduto(prev => ({ ...prev, precoPromocional: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="categoria">Categoria *</Label>
                        <Select value={formProduto.categoria} onValueChange={(value) => setFormProduto(prev => ({ ...prev, categoria: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Frutas e Verduras">Frutas e Verduras</SelectItem>
                            <SelectItem value="Laticínios">Laticínios</SelectItem>
                            <SelectItem value="Padaria">Padaria</SelectItem>
                            <SelectItem value="Medicamentos">Medicamentos</SelectItem>
                            <SelectItem value="Higiene Pessoal">Higiene Pessoal</SelectItem>
                            <SelectItem value="Pizzas Tradicionais">Pizzas Tradicionais</SelectItem>
                            <SelectItem value="Hambúrgueres">Hambúrgueres</SelectItem>
                            <SelectItem value="Acompanhamentos">Acompanhamentos</SelectItem>
                            <SelectItem value="Ração">Ração</SelectItem>
                            <SelectItem value="Brinquedos">Brinquedos</SelectItem>
                            <SelectItem value="Smartphones">Smartphones</SelectItem>
                            <SelectItem value="Acessórios">Acessórios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="imagem">URL da Imagem</Label>
                        <Input
                          id="imagem"
                          value={formProduto.imagem}
                          onChange={(e) => setFormProduto(prev => ({ ...prev, imagem: e.target.value }))}
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      </div>

                      <div>
                        <Label htmlFor="estoque">Estoque</Label>
                        <Input
                          id="estoque"
                          type="number"
                          value={formProduto.estoque}
                          onChange={(e) => setFormProduto(prev => ({ ...prev, estoque: e.target.value }))}
                          placeholder="Quantidade em estoque"
                        />
                      </div>

                      <Button onClick={handleSalvarProduto} className="w-full">
                        {produtoEditando ? 'Atualizar Produto' : 'Adicionar Produto'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {produtos.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Nenhum produto cadastrado ainda.
                  </p>
                  <Button onClick={() => setDialogAberto(true)}>
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{produto.nome}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {produto.descricao}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{produto.categoria}</Badge>
                          <Badge variant={produto.disponivel ? 'default' : 'destructive'}>
                            {produto.disponivel ? 'Disponível' : 'Indisponível'}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        {produto.precoPromocional ? (
                          <div>
                            <p className="text-lg font-bold text-primary">
                              R$ {produto.precoPromocional.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground line-through">
                              R$ {produto.preco.toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-primary">
                            R$ {produto.preco.toFixed(2)}
                          </p>
                        )}
                        {produto.estoque !== undefined && (
                          <p className="text-sm text-muted-foreground">
                            Estoque: {produto.estoque}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditarProduto(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoverProduto(produto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pedidos">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
              {pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum pedido recebido ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Pedido #{pedido.numero}</h3>
                          <p className="text-sm text-muted-foreground">
                            Cliente: {pedido.clienteNome}
                          </p>
                        </div>
                        <Badge variant={
                          pedido.status === 'pendente' ? 'destructive' :
                          pedido.status === 'confirmado' ? 'default' :
                          'secondary'
                        }>
                          {pedido.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            R$ {pedido.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(pedido.dataHora).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
