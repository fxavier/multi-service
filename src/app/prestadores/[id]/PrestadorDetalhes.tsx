
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
import { prestadores } from '@/data/prestadores';
import { servicos } from '@/data/servicos';
import { useCarrinho } from '@/contexts/CarrinhoContext';
import { toast } from 'sonner';
import Link from 'next/link';

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

  const { adicionarItem } = useCarrinho();

  const prestador = prestadores.find(p => p.id === prestadorId);
  const servicosPrestador = servicos.filter(s => s.prestadorId === prestadorId);

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

  const servicoEscolhido = servicosPrestador.find(s => s.id === servicoSelecionado);

  const handleAgendamento = () => {
    if (!servicoSelecionado || !formAgendamento.clienteNome || !formAgendamento.data || !formAgendamento.horario) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const servico = servicosPrestador.find(s => s.id === servicoSelecionado);
    if (!servico) return;

    // Simular agendamento (em um app real, salvaria no backend)
    const agendamento = {
      id: Date.now().toString(),
      prestadorId: prestador.id,
      servicoId: servico.id,
      ...formAgendamento,
      precoTotal: servico.preco,
      status: 'agendado' as const
    };

    // Salvar no localStorage
    const agendamentos = JSON.parse(localStorage.getItem('marketplace-agendamentos') || '[]');
    agendamentos.push(agendamento);
    localStorage.setItem('marketplace-agendamentos', JSON.stringify(agendamentos));

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

  const adicionarAoCarrinho = (servico: typeof servicosPrestador[0]) => {
    adicionarItem({
      tipo: 'servico',
      servicoId: servico.id,
      prestadorId: prestador.id,
      nome: servico.nome,
      preco: servico.preco,
      quantidade: 1,
      imagem: prestador.foto,
      observacoes: `Prestador: ${prestador.nome}`
    });
    toast.success('Serviço adicionado ao carrinho!');
  };

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
            <img
              src={prestador.foto}
              alt={prestador.nome}
              className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
            />
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{prestador.nome}</h1>
              
              {/* Profissões */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {prestador.profissoes.map((profissao, index) => (
                  <Badge key={index} variant="secondary">
                    {profissao}
                  </Badge>
                ))}
              </div>

              {/* Avaliação */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold ml-1">{prestador.avaliacao}</span>
                </div>
                <span className="text-muted-foreground">
                  ({prestador.totalAvaliacoes} avaliações)
                </span>
              </div>

              {/* Informações de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.endereco}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.telefone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{prestador.experiencia} de experiência</span>
                </div>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="mb-4">
                <span className="text-2xl font-bold text-primary">
                  A partir de R$ {prestador.precoBase.toFixed(2)}
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
                              {servico.nome} - R$ {servico.preco.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={formAgendamento.clienteNome}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteNome: e.target.value }))}
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input
                        id="telefone"
                        value={formAgendamento.clienteTelefone}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteTelefone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formAgendamento.clienteEmail}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, clienteEmail: e.target.value }))}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={formAgendamento.endereco}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, endereco: e.target.value }))}
                        placeholder="Endereço completo"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="data">Data *</Label>
                        <Input
                          id="data"
                          type="date"
                          value={formAgendamento.data}
                          onChange={(e) => setFormAgendamento(prev => ({ ...prev, data: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
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

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={formAgendamento.observacoes}
                        onChange={(e) => setFormAgendamento(prev => ({ ...prev, observacoes: e.target.value }))}
                        placeholder="Informações adicionais..."
                        rows={3}
                      />
                    </div>

                    {servicoEscolhido && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="font-medium">Resumo do Agendamento:</p>
                        <p className="text-sm text-muted-foreground">
                          {servicoEscolhido.nome} - {servicoEscolhido.duracao}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          R$ {servicoEscolhido.preco.toFixed(2)}
                        </p>
                      </div>
                    )}

                    <Button onClick={handleAgendamento} className="w-full">
                      Confirmar Agendamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="servicos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="sobre">Sobre</TabsTrigger>
          <TabsTrigger value="galeria">Galeria</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicosPrestador.map((servico) => (
              <Card key={servico.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{servico.descricao}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        R$ {servico.preco.toFixed(2)}
                      </span>
                    </div>
                    <Badge variant="outline">{servico.duracao}</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => adicionarAoCarrinho(servico)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Adicionar ao Carrinho
                    </Button>
                    <Button 
                      onClick={() => {
                        setServicoSelecionado(servico.id);
                        setAgendamentoAberto(true);
                      }}
                      className="flex-1"
                    >
                      Agendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sobre">
          <Card>
            <CardHeader>
              <CardTitle>Sobre {prestador.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{prestador.descricao}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Experiência</h3>
                  <p className="text-muted-foreground">{prestador.experiencia}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Disponibilidade</h3>
                  <div className="flex flex-wrap gap-1">
                    {prestador.disponibilidade.map((dia, index) => (
                      <Badge key={index} variant="secondary">{dia}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="galeria">
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Trabalhos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {prestador.galeria.map((imagem, index) => (
                  <img
                    key={index}
                    src={imagem}
                    alt={`Trabalho ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
