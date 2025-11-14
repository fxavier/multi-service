'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Phone, Mail, Clock, ShoppingCart, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { useGetCategoriasQuery, useGetMerchantsQuery, useGetProdutosQuery } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { adicionarItem } from '@/store/slices/cartSlice';
import { Skeleton } from '@/components/ui/skeleton';

interface MerchantVitrineProps {
  merchantSlug: string;
}

export default function MerchantVitrine({ merchantSlug }: MerchantVitrineProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todas');
  const [busca, setBusca] = useState('');
  const dispatch = useAppDispatch();

  const { data: merchants, isLoading: carregandoMerchants } = useGetMerchantsQuery();
  const { data: produtos, isLoading: carregandoProdutos } = useGetProdutosQuery();
  const { data: categorias, isLoading: carregandoCategorias } = useGetCategoriasQuery();

  const merchant = useMemo(
    () => (merchants ?? []).find((m) => m.slug === merchantSlug),
    [merchants, merchantSlug]
  );

  const produtosMerchant = useMemo(
    () => (produtos ?? []).filter((produto) => produto.merchantId === merchant?.id),
    [produtos, merchant?.id]
  );

  const categoriasMerchant = useMemo(
    () => (categorias ?? []).filter((categoria) => categoria.merchantId === merchant?.id),
    [categorias, merchant?.id]
  );

  const carregandoDados = carregandoMerchants || carregandoProdutos || carregandoCategorias;

  const produtosFiltrados = useMemo(() => {
    return produtosMerchant.filter(produto => {
      if (categoriaSelecionada !== 'todas' && produto.categoria !== categoriaSelecionada) {
        return false;
      }

      if (busca && !produto.nome.toLowerCase().includes(busca.toLowerCase())) {
        return false;
      }

      return produto.disponivel;
    });
  }, [produtosMerchant, categoriaSelecionada, busca]);

  const adicionarAoCarrinho = (produto: typeof produtosMerchant[number]) => {
    if (!merchant) return;

    dispatch(adicionarItem({
      tipo: 'produto',
      produtoId: produto.id,
      merchantId: merchant.id,
      nome: produto.nome,
      preco: produto.precoPromocional || produto.preco,
      quantidade: 1,
      imagem: produto.imagem
    }));
    toast.success('Produto adicionado ao carrinho!');
  };

  if (carregandoDados) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Estabelecimento não encontrado.</p>
            <Link href="/merchants">
              <Button variant="outline">Voltar às Lojas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/merchants" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar às Lojas
        </Link>
      </div>

      {/* Banner do Merchant */}
      <div className="relative h-64 md:h-80">
        <img
          src={merchant.banner}
          alt={merchant.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-end gap-4">
              <img
                src={merchant.logo}
                alt={merchant.nome}
                className="w-20 h-20 rounded-lg border-4 border-white object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{merchant.nome}</h1>
                <p className="text-white/90 mb-2">{merchant.descricao}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{merchant.avaliacao}</span>
                    <span className="ml-1">({merchant.totalAvaliacoes})</span>
                  </div>

                  {merchant.tempoEntrega && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{merchant.tempoEntrega}</span>
                    </div>
                  )}

                  {merchant.entregaGratis && (
                    <Badge className="bg-green-600">Entrega Grátis</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações e Navegação */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="produtos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="produtos">
              {merchant.tipo === 'restaurante' ? 'Cardápio' : 'Produtos'}
            </TabsTrigger>
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="contato">Contato</TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            <div className="space-y-6">
              {/* Filtros */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Busca */}
                    <div className="flex-1">
                      <Input
                        placeholder="Buscar produtos..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                      />
                    </div>

                    {/* Categorias */}
                    <div className="flex gap-2 overflow-x-auto">
                      <Button
                        variant={categoriaSelecionada === 'todas' ? 'default' : 'outline'}
                        onClick={() => setCategoriaSelecionada('todas')}
                        className="whitespace-nowrap"
                      >
                        Todas
                      </Button>
                      {categoriasMerchant.map((categoria) => (
                        <Button
                          key={categoria.id}
                          variant={categoriaSelecionada === categoria.nome ? 'default' : 'outline'}
                          onClick={() => setCategoriaSelecionada(categoria.nome)}
                          className="whitespace-nowrap"
                        >
                          {categoria.nome}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grid de Produtos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFiltrados.map((produto) => (
                  <Card key={produto.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="w-full h-48 object-cover"
                      />
                      {produto.precoPromocional && (
                        <Badge className="absolute top-2 left-2 bg-red-600">
                          Promoção
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{produto.nome}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {produto.descricao}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {produto.precoPromocional ? (
                            <div>
                              <span className="text-lg font-bold text-primary">
                                R$ {produto.precoPromocional.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                R$ {produto.preco.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-primary">
                              R$ {produto.preco.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {produto.tempoPreparo && (
                          <Badge variant="outline">{produto.tempoPreparo}</Badge>
                        )}
                      </div>

                      <Button
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="w-full"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {produtosFiltrados.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-muted-foreground">
                      Nenhum produto encontrado.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="sobre">
            <Card>
              <CardHeader>
                <CardTitle>Sobre {merchant.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{merchant.descricao}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">{merchant.horarioFuncionamento}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tipo de Estabelecimento</h3>
                    <Badge variant="secondary" className="capitalize">
                      {merchant.tipo}
                    </Badge>
                  </div>

                  {merchant.tempoEntrega && (
                    <div>
                      <h3 className="font-semibold mb-2">Tempo de Entrega</h3>
                      <p className="text-muted-foreground">{merchant.tempoEntrega}</p>
                    </div>
                  )}

                  {merchant.taxaEntrega !== undefined && (
                    <div>
                      <h3 className="font-semibold mb-2">Taxa de Entrega</h3>
                      <p className="text-muted-foreground">
                        {merchant.entregaGratis ? 'Grátis' : `R$ ${merchant.taxaEntrega.toFixed(2)}`}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contato">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{merchant.endereco}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{merchant.telefone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{merchant.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{merchant.horarioFuncionamento}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
