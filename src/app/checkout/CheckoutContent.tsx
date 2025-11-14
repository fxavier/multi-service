'use client';

import { useState } from 'react';
import { CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { limparCarrinho as limparCarrinhoAction, selectItensCarrinho, selectSubtotal } from '@/store/slices/cartSlice';
import { pedidoRegistrado } from '@/store/slices/pedidosSlice';
import type { Pedido } from '@/types/marketplace';

export default function CheckoutContent() {
  const itens = useAppSelector(selectItensCarrinho);
  const subtotal = useAppSelector(selectSubtotal);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [dadosCliente, setDadosCliente] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: '',
    cidade: '',
    cep: '',
    observacoes: ''
  });

  const [tipoEntrega, setTipoEntrega] = useState('entrega');
  const [metodoPagamento, setMetodoPagamento] = useState('cartao');

  const taxaEntrega = tipoEntrega === 'entrega' ? 5.99 : 0;
  const total = subtotal + taxaEntrega;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dadosCliente.nome || !dadosCliente.telefone || !dadosCliente.email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (tipoEntrega === 'entrega' && !dadosCliente.endereco) {
      toast.error('Endereço é obrigatório para entrega');
      return;
    }

    const numeroPedido = `PED${Date.now()}`;

    const pedido: Pedido = {
      id: Date.now().toString(),
      numero: numeroPedido,
      itens,
      clienteNome: dadosCliente.nome,
      clienteTelefone: dadosCliente.telefone,
      clienteEmail: dadosCliente.email,
      endereco: dadosCliente.endereco,
      metodoPagamento,
      tipoEntrega: tipoEntrega as Pedido['tipoEntrega'],
      subtotal,
      taxaEntrega,
      total,
      status: 'pendente',
      dataHora: new Date().toISOString(),
    };

    const pedidos = JSON.parse(localStorage.getItem('marketplace-pedidos') || '[]');
    pedidos.push(pedido);
    localStorage.setItem('marketplace-pedidos', JSON.stringify(pedidos));

    dispatch(pedidoRegistrado(pedido));

    dispatch(limparCarrinhoAction());

    toast.success('Pedido realizado com sucesso!');
    router.push(`/pedido-confirmado?numero=${numeroPedido}`);
  };

  if (itens.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio.</p>
            <Button onClick={() => router.push('/merchants')}>
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finalizar Pedido</h1>
        <p className="text-muted-foreground">
          Revise seus dados e confirme seu pedido
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={dadosCliente.nome}
                      onChange={(e) => setDadosCliente(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={dadosCliente.telefone}
                      onChange={(e) => setDadosCliente(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={dadosCliente.email}
                    onChange={(e) => setDadosCliente(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tipo de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={tipoEntrega} onValueChange={setTipoEntrega}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="entrega" id="entrega" />
                    <Label htmlFor="entrega" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Entrega</p>
                          <p className="text-sm text-muted-foreground">
                            Receba em casa - MZN {taxaEntrega.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="retirada" id="retirada" />
                    <Label htmlFor="retirada" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Retirada</p>
                          <p className="text-sm text-muted-foreground">
                            Retire no local - Grátis
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Endereço (se entrega) */}
            {tipoEntrega === 'entrega' && (
              <Card>
                <CardHeader>
                  <CardTitle>Endereço de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="endereco">Endereço Completo *</Label>
                    <Input
                      id="endereco"
                      value={dadosCliente.endereco}
                      onChange={(e) => setDadosCliente(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Rua, número, complemento"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={dadosCliente.cidade}
                        onChange={(e) => setDadosCliente(prev => ({ ...prev, cidade: e.target.value }))}
                        placeholder="Sua cidade"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={dadosCliente.cep}
                        onChange={(e) => setDadosCliente(prev => ({ ...prev, cep: e.target.value }))}
                        placeholder="00000-000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea
                      id="observacoes"
                      value={dadosCliente.observacoes}
                      onChange={(e) => setDadosCliente(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Instruções especiais, ponto de referência, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Método de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={metodoPagamento} onValueChange={setMetodoPagamento}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Cartão de Crédito</p>
                          <p className="text-sm text-muted-foreground">
                            Pague com cartão de crédito ou débito
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5" />
                        <div>
                          <p className="font-medium">PIX</p>
                          <p className="text-sm text-muted-foreground">
                            Confirmação imediata do pagamento
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
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

                <Button type="submit" className="w-full" size="lg">
                  Confirmar Pedido
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ao confirmar, você concorda com nossos termos de uso e política de privacidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
