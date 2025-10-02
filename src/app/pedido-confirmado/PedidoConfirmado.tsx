
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PedidoConfirmado() {
  const searchParams = useSearchParams();
  const numeroPedido = searchParams.get('numero');
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    if (numeroPedido) {
      const pedidos = JSON.parse(localStorage.getItem('marketplace-pedidos') || '[]');
      const pedidoEncontrado = pedidos.find((p: any) => p.numero === numeroPedido);
      setPedido(pedidoEncontrado);
    }
  }, [numeroPedido]);

  if (!pedido) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Pedido não encontrado.</p>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Confirmação */}
        <Card className="mb-8">
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi recebido e está sendo processado
            </p>
            
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground">Número do Pedido</p>
              <p className="text-2xl font-bold">{pedido.numero}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Package className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Preparando</p>
                <p className="text-sm text-muted-foreground">Seu pedido está sendo preparado</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">
                  {pedido.tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {pedido.tipoEntrega === 'entrega' ? 'Em até 60 minutos' : 'Aguarde confirmação'}
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="font-medium">Concluído</p>
                <p className="text-sm text-muted-foreground">Pedido entregue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do Pedido */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Itens */}
            <div>
              <h3 className="font-medium mb-2">Itens do Pedido</h3>
              <div className="space-y-2">
                {pedido.itens.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantidade}x {item.nome}</span>
                    <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dados do Cliente */}
            <div>
              <h3 className="font-medium mb-2">Dados do Cliente</h3>
              <div className="text-sm space-y-1">
                <p><strong>Nome:</strong> {pedido.nome}</p>
                <p><strong>Telefone:</strong> {pedido.telefone}</p>
                <p><strong>E-mail:</strong> {pedido.email}</p>
                {pedido.tipoEntrega === 'entrega' && pedido.endereco && (
                  <p><strong>Endereço:</strong> {pedido.endereco}</p>
                )}
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <h3 className="font-medium mb-2">Pagamento</h3>
              <div className="text-sm space-y-1">
                <p><strong>Método:</strong> {pedido.metodoPagamento}</p>
                <p><strong>Subtotal:</strong> R$ {pedido.subtotal.toFixed(2)}</p>
                <p><strong>Taxa de Entrega:</strong> R$ {pedido.taxaEntrega.toFixed(2)}</p>
                <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
              </div>
            </div>

            {pedido.observacoes && (
              <div>
                <h3 className="font-medium mb-2">Observações</h3>
                <p className="text-sm text-muted-foreground">{pedido.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          <Link href="/merchants">
            <Button>
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
