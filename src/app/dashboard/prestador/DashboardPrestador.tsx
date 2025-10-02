
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';
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

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: string;
  categoria: string;
  ativo: boolean;
}

interface Agendamento {
  id: string;
  servicoId: string;
  clienteNome: string;
  clienteTelefone: string;
  data: string;
  horario: string;
  endereco: string;
  precoTotal: number;
  status: string;
  observacoes?: string;
}

export default function DashboardPrestador() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicoEditando, setServicoEditando] = useState<Servico | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [formServico, setFormServico] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao: '',
    categoria: '',
    ativo: true
  });

  // Simular dados do prestador logado
  const prestadorId = '1'; // Em um app real, viria da autenticação

  useEffect(() => {
    // Carregar serviços do prestador
    const servicosSalvos = localStorage.getItem(`prestador-${prestadorId}-servicos`);
    if (servicosSalvos) {
      setServicos(JSON.parse(servicosSalvos));
    }

    // Carregar agendamentos do prestador
    const agendamentosSalvos = localStorage.getItem('marketplace-agendamentos');
    if (agendamentosSalvos) {
      const todosAgendamentos = JSON.parse(agendamentosSalvos);
      const agendamentosPrestador = todosAgendamentos.filter((agendamento: any) => 
        agendamento.prestadorId === prestadorId
      );
      setAgendamentos(agendamentosPrestador);
    }
  }, [prestadorId]);

  const salvarServicos = (novosServicos: Servico[]) => {
    localStorage.setItem(`prestador-${prestadorId}-servicos`, JSON.stringify(novosServicos));
    setServicos(novosServicos);
  };

  const handleSalvarServico = () => {
    if (!formServico.nome || !formServico.preco || !formServico.categoria) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const servico: Servico = {
      id: servicoEditando?.id || Date.now().toString(),
      nome: formServico.nome,
      descricao: formServico.descricao,
      preco: parseFloat(formServico.preco),
      duracao: formServico.duracao,
      categoria: formServico.categoria,
      ativo: formServico.ativo
    };

    let novosServicos;
    if (servicoEditando) {
      novosServicos = servicos.map(s => s.id === servico.id ? servico : s);
      toast.success('Serviço atualizado com sucesso!');
    } else {
      novosServicos = [...servicos, servico];
      toast.success('Serviço adicionado com sucesso!');
    }

    salvarServicos(novosServicos);
    setDialogAberto(false);
    resetForm();
  };

  const handleEditarServico = (servico: Servico) => {
    setServicoEditando(servico);
    setFormServico({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao: servico.duracao,
      categoria: servico.categoria,
      ativo: servico.ativo
    });
    setDialogAberto(true);
  };

  const handleRemoverServico = (id: string) => {
    const novosServicos = servicos.filter(s => s.id !== id);
    salvarServicos(novosServicos);
    toast.success('Serviço removido com sucesso!');
  };

  const resetForm = () => {
    setServicoEditando(null);
    setFormServico({
      nome: '',
      descricao: '',
      preco: '',
      duracao: '',
      categoria: '',
      ativo: true
    });
  };

  const totalFaturamento = agendamentos
    .filter(a => a.status === 'concluido')
    .reduce((total, agendamento) => total + agendamento.precoTotal, 0);
  
  const agendamentosHoje = agendamentos.filter(a => {
    const hoje = new Date().toISOString().split('T')[0];
    return a.data === hoje && a.status !== 'cancelado';
  }).length;

  const agendamentosPendentes = agendamentos.filter(a => a.status === 'agendado').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard do Prestador</h1>
        <p className="text-muted-foreground">
          Gerencie seus serviços, agendamentos e faturamento
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Serviços Ativos</p>
                <p className="text-2xl font-bold">{servicos.filter(s => s.ativo).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agendamentos Hoje</p>
                <p className="text-2xl font-bold">{agendamentosHoje}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento Total</p>
                <p className="text-2xl font-bold">R$ {totalFaturamento.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{agendamentosPendentes}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo Principal */}
      <Tabs defaultValue="servicos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gerenciar Serviços</CardTitle>
                <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Serviço
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {servicoEditando ? 'Editar Serviço' : 'Adicionar Serviço'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nome">Nome do Serviço *</Label>
                        <Input
                          id="nome"
                          value={formServico.nome}
                          onChange={(e) => setFormServico(prev => ({ ...prev, nome: e.target.value }))}
                          placeholder="Nome do serviço"
                        />
                      </div>

                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Textarea
                          id="descricao"
                          value={formServico.descricao}
                          onChange={(e) => setFormServico(prev => ({ ...prev, descricao: e.target.value }))}
                          placeholder="Descrição do serviço"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preco">Preço (R$) *</Label>
                          <Input
                            id="preco"
                            type="number"
                            step="0.01"
                            value={formServico.preco}
                            onChange={(e) => setFormServico(prev => ({ ...prev, preco: e.target.value }))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duracao">Duração</Label>
                          <Input
                            id="duracao"
                            value={formServico.duracao}
                            onChange={(e) => setFormServico(prev => ({ ...prev, duracao: e.target.value }))}
                            placeholder="Ex: 2 horas"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="categoria">Categoria *</Label>
                        <Select value={formServico.categoria} onValueChange={(value) => setFormServico(prev => ({ ...prev, categoria: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Elétrica">Elétrica</SelectItem>
                            <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                            <SelectItem value="Limpeza">Limpeza</SelectItem>
                            <SelectItem value="Beleza">Beleza</SelectItem>
                            <SelectItem value="Pintura">Pintura</SelectItem>
                            <SelectItem value="Bem-estar">Bem-estar</SelectItem>
                            <SelectItem value="Jardinagem">Jardinagem</SelectItem>
                            <SelectItem value="Informática">Informática</SelectItem>
                            <SelectItem value="Educação">Educação</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button onClick={handleSalvarServico} className="w-full">
                        {servicoEditando ? 'Atualizar Serviço' : 'Adicionar Serviço'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {servicos.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Nenhum serviço cadastrado ainda.
                  </p>
                  <Button onClick={() => setDialogAberto(true)}>
                    Adicionar Primeiro Serviço
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {servicos.map((servico) => (
                    <div key={servico.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{servico.nome}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {servico.descricao}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{servico.categoria}</Badge>
                          <Badge variant={servico.ativo ? 'default' : 'destructive'}>
                            {servico.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                          {servico.duracao && (
                            <Badge variant="outline">{servico.duracao}</Badge>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          R$ {servico.preco.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditarServico(servico)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoverServico(servico.id)}
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

        <TabsContent value="agendamentos">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentos.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum agendamento recebido ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {agendamentos.map((agendamento) => {
                    const servico = servicos.find(s => s.id === agendamento.servicoId);
                    
                    return (
                      <div key={agendamento.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{servico?.nome || 'Serviço'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Cliente: {agendamento.clienteNome}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Telefone: {agendamento.clienteTelefone}
                            </p>
                          </div>
                          <Badge variant={
                            agendamento.status === 'agendado' ? 'destructive' :
                            agendamento.status === 'confirmado' ? 'default' :
                            'secondary'
                          }>
                            {agendamento.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <strong>Data:</strong> {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <strong>Horário:</strong> {agendamento.horario}
                          </div>
                          <div className="col-span-2">
                            <strong>Endereço:</strong> {agendamento.endereco}
                          </div>
                        </div>

                        {agendamento.observacoes && (
                          <div className="mb-3 p-2 bg-muted rounded">
                            <strong>Observações:</strong> {agendamento.observacoes}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-bold text-primary">
                              R$ {agendamento.precoTotal.toFixed(2)}
                            </p>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
