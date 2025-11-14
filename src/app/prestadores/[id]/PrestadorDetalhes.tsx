'use client';

import { useState, useMemo } from 'react';
import { Star, MapPin, Phone, Mail, Clock, Calendar, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import { useGetPrestadoresQuery, useGetServicosQuery } from '@/store/api';
import { useAppDispatch } from '@/store/hooks';
import { adicionarItem } from '@/store/slices/cartSlice';
import { agendamentoRegistrado } from '@/store/slices/agendamentosSlice';
import type { Agendamento } from '@/types/marketplace';
import { Skeleton } from '@/components/ui/skeleton';

interface PrestadorDetalhesProps {
  prestadorId: string;
}

export default function PrestadorDetalhes({ prestadorId }: PrestadorDetalhesProps) {
  const [agendamentoAberto, setAgendamentoAberto] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState('');
  const [formAgendamento, setFormAgendamento] = useState({
    clienteNome: '',
    clienteTelefone: '',
    clienteEmail: '',
    endereco: '',
    data: '',
    horario: '',
    observacoes: ''
  });

  const dispatch = useAppDispatch();

  const { data: prestadores, isLoading: carregandoPrestador } = useGetPrestadoresQuery();
  const { data: servicos, isLoading: carregandoServicos } = useGetServicosQuery(prestadorId, {
    skip: !prestadorId,
  });

  const prestador = useMemo(
    () => (prestadores ?? []).find((p) => p.id === prestadorId),
    [prestadores, prestadorId]
  );

  const servicosPrestador = useMemo(
    () => (servicos ?? []).filter((s) => !s.prestadorId || s.prestadorId === prestadorId),
    [servicos, prestadorId]
  );

  const carregando = carregandoPrestador || carregandoServicos;


  const handleAgendamento = () => {
    if (!servicoSelecionado || !formAgendamento.clienteNome || !formAgendamento.data || !formAgendamento.horario) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const servico = servicosPrestador.find(s => s.id === servicoSelecionado);
    if (!servico) return;

    const agendamento: Agendamento = {
      id: Date.now().toString(),
      prestadorId,
      servicoId: servico.id,
      ...formAgendamento,
      precoTotal: servico.preco,
      status: 'agendado',
    };

    const agendamentos = JSON.parse(localStorage.getItem('marketplace-agendamentos') || '[]');
    agendamentos.push(agendamento);
    localStorage.setItem('marketplace-agendamentos', JSON.stringify(agendamentos));

    dispatch(agendamentoRegistrado(agendamento));

    toast.success('Agendamento realizado com sucesso!');
    setAgendamentoAberto(false);
    setFormAgendamento({
      clienteNome: '',
      clienteTelefone: '',
      clienteEmail: '',
      endereco: '',
      data: '',
      horario: '',
      observacoes: ''
    });
    setServicoSelecionado('');
  };

  const adicionarAoCarrinho = (servico: typeof servicosPrestador[number]) => {
    if (!prestador) return;

    dispatch(adicionarItem({
      tipo: 'servico',
      servicoId: servico.id,
      prestadorId: prestador.id,
      nome: servico.nome,
      preco: servico.preco,
      quantidade: 1,
      imagem: prestador.foto || '',
      observacoes: `Prestador: ${prestador.nome}`,
    }));
    toast.success('Serviço adicionado ao carrinho!');
  };

  if (carregando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prestador) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Prestador não encontrado.</p>
            <Link href="/servicos">
              <Button variant="outline">Voltar aos Serviços</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/servicos" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar aos Serviços
        </Link>
      </div>

      {/* Cabeçalho do Prestador */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {prestador.foto ? (
              <img
                src={prestador.foto}
                alt={prestador.nome}
                className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
              />
            ) : (
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white md:mx-0">
                {prestador.nome.charAt(0)}
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{prestador.nome}</h1>

              {/* Profissões */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {(prestador.profissoes ?? []).map((profissao, index) => (
                  <Badge key={index} variant="secondary">
                    {profissao}
                  </Badge>
                ))}
              </div>

              {/* Avaliação */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold ml-1">{(prestador.avaliacao ?? 0).toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  ({prestador.totalAvaliacoes ?? 0} avaliações)
                </span>
              </div>

              {/* Informações de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.endereco || 'Endereço não informado'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.telefone || 'Telefone não informado'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.email || 'E-mail não informado'}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {prestador.experiencia
                      ? `${prestador.experiencia} de experiência`
                      : 'Experiência a combinar'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  A partir de{' '}
                  {typeof prestador.precoBase === 'number'
                    ? `MZN ${prestador.precoBase.toFixed(2)}`
                    : 'Consultar'}
                </span>
              </div>

              <Dialog open={agendamentoAberto} onOpenChange={setAgendamentoAberto}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full md:w-auto">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Serviço
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agendar Serviço</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="servico">Serviço *</Label>
                      <Select value={servicoSelecionado} onValueChange={setServicoSelecionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicosPrestador.map(servico => (
                            <SelectItem key={servico.id} value={servico.id}>
                              {servico.nome} - MZN {servico.preco.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="data">Data *</Label>
                        <Input
                          id="data"
                          type="date"
                          value={formAgendamento.data}
                          onChange={(e) => setFormAgendamento(prev => ({ ...prev, data: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="horario">Horário *</Label>
                        <Input
                          id="horario"
                          type="time"
                          value={formAgendamento.horario}
                          onChange={(e) => setFormAgendamento(prev => ({ ...prev, horario: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clienteNome">Nome *</Label>
                        <Input
                          id="clienteNome"
                          value={formAgendamento.clienteNome}
                          onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteNome: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="clienteTelefone">Telefone *</Label>
                        <Input
                          id="clienteTelefone"
                          value={formAgendamento.clienteTelefone}
                          onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteTelefone: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clienteEmail">E-mail *</Label>
                      <Input
                        id="clienteEmail"
                        type="email"
                        value={formAgendamento.clienteEmail}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteEmail: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formAgendamento.endereco}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, endereco: e.target.value }))}
                        placeholder="Local de atendimento, se necessário"
                      />
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={formAgendamento.observacoes}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, observacoes: e.target.value }))}
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setAgendamentoAberto(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAgendamento}>
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="servicos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicosPrestador.map((servico) => (
              <Card key={servico.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{servico.nome}</CardTitle>
                    {servico.categoria && <Badge variant="secondary">{servico.categoria}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{servico.descricao || 'Descrição não informada.'}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Duração</p>
                      <p className="font-medium">{servico.duracao || 'Consultar'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">A partir de</p>
                      <p className="text-xl font-semibold text-primary">MZN {servico.preco.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => adicionarAoCarrinho(servico)}>
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}

            {servicosPrestador.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum serviço disponível no momento.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sobre">
          <Card>
            <CardHeader>
              <CardTitle>Sobre {prestador.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {prestador.descricao || 'Descrição não disponível.'}
              </p>
              <p className="text-sm text-muted-foreground">
                Experiência:{' '}
                {prestador.experiencia ? `${prestador.experiencia} de experiência` : 'Não informada'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avaliacoes">
          <Card>
            <CardHeader>
              <CardTitle>Avaliações dos Clientes</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              <p>Ainda não há avaliações públicas para este prestador.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
