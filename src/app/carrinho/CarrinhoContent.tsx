'use client';

import { useMemo } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  atualizarQuantidade as atualizarQuantidadeAction,
  limparCarrinho as limparCarrinhoAction,
  removerItem as removerItemAction,
  selectItensCarrinho,
  selectSubtotal,
} from '@/store/slices/cartSlice';
import { useGetMerchantsQuery, useGetPrestadoresQuery } from '@/store/api';

export default function CarrinhoContent() {
  const dispatch = useAppDispatch();
  const itens = useAppSelector(selectItensCarrinho);
  const subtotal = useAppSelector(selectSubtotal);
  const { data: merchants } = useGetMerchantsQuery();
  const { data: prestadores } = useGetPrestadoresQuery();

  const itensAgrupados = useMemo(() => {
    return itens.reduce((grupos, item) => {
      const chave = item.merchantId || item.prestadorId || 'outros';
      if (!grupos[chave]) {
        grupos[chave] = [];
      }
      grupos[chave].push(item);
      return grupos;
    }, {} as Record<string, typeof itens>);
  }, [itens]);

  const taxaEntrega = 5.99;
  const total = subtotal + (itens.length > 0 ? taxaEntrega : 0);

  const obterNomeGrupo = (grupoId: string) => {
    const merchant = merchants?.find((m) => m.id === grupoId);
    if (merchant) return merchant.nome;
    const prestador = prestadores?.find((p) => p.id === grupoId);
    if (prestador) return prestador.nome;
    return 'Outros';
  };

  const handleRemoverItem = (id: string) => dispatch(removerItemAction(id));
  const handleAtualizarQuantidade = (id: string, quantidade: number) =>
    dispatch(atualizarQuantidadeAction({ id, quantidade }));
  const handleLimparCarrinho = () => dispatch(limparCarrinhoAction());

  if (itens.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ou serviços para continuar
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/merchants">
                <Button variant="outline">Ver Lojas</Button>
              </Link>
              <Link href="/servicos">
                <Button>Ver Serviços</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Carrinho de Compras</h1>
        <p className="text-muted-foreground">
          {itens.length} {itens.length === 1 ? 'item' : 'itens'} no seu carrinho
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Itens */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(itensAgrupados).map(([grupoId, itensGrupo]) => {
            const nomeGrupo = obterNomeGrupo(grupoId);

            return (
              <Card key={grupoId}>
                <CardHeader>
                  <CardTitle className="text-lg">{nomeGrupo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itensGrupo.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">
                        <h3 className="font-medium">{item.nome}</h3>
                        {item.observacoes && (
                          <p className="text-sm text-muted-foreground">{item.observacoes}</p>
                        )}
                        <p className="text-lg font-semibold text-primary">
                          MZN {item.preco.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAtualizarQuantidade(item.id, item.quantidade - 1)}
                          disabled={item.quantidade <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.quantidade}
                          onChange={(e) => {
                            const novaQuantidade = parseInt(e.target.value) || 1;
                            handleAtualizarQuantidade(item.id, novaQuantidade);
                          }}
                          className="w-16 text-center"
                          min="1"
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAtualizarQuantidade(item.id, item.quantidade + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          MZN {(item.preco * item.quantidade).toFixed(2)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoverItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleLimparCarrinho}>
              Limpar Carrinho
            </Button>
            <Link href="/merchants">
              <Button variant="outline">Continuar Comprando</Button>
            </Link>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>MZN {subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Taxa de Entrega</span>
                <span>MZN {taxaEntrega.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">MZN {total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  Finalizar Pedido
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center">
                Ao continuar, você concorda com nossos termos de uso
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
