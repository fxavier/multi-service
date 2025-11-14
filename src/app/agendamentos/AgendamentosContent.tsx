'use client';

import { useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Phone, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useGetPrestadoresQuery, useGetServicosQuery } from '@/store/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { agendamentosDefinidos, selectAgendamentos } from '@/store/slices/agendamentosSlice';
import type { Agendamento } from '@/types/marketplace';

export default function AgendamentosContent() {
  const dispatch = useAppDispatch();
  const agendamentos = useAppSelector(selectAgendamentos);
  const { data: prestadores } = useGetPrestadoresQuery();
  const { data: servicos } = useGetServicosQuery();

  useEffect(() => {
    const agendamentosSalvos = localStorage.getItem('marketplace-agendamentos');
    if (agendamentosSalvos) {
      dispatch(agendamentosDefinidos(JSON.parse(agendamentosSalvos)));
    }
  }, [dispatch]);

  const agendamentosAtivos = agendamentos.filter(a => a.status !== 'cancelado');
  const agendamentosHistorico = agendamentos.filter(a => a.status === 'concluido' || a.status === 'cancelado');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-100 text-blue-800';
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'concluido': return 'bg-gray-100 text-gray-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'agendado': return 'Agendado';
      case 'confirmado': return 'Confirmado';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const AgendamentoCard = ({ agendamento }: { agendamento: Agendamento }) => {
    const prestador = prestadores?.find(p => p.id === agendamento.prestadorId);
    const servico = servicos?.find(s => s.id === agendamento.servicoId);

    if (!prestador || !servico) return null;

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {prestador.foto ? (
              <img
                src={prestador.foto}
                alt={prestador.nome}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white text-lg font-semibold">
                {prestador.nome.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{prestador.nome}</h3>
                  <p className="text-muted-foreground">{servico.nome}</p>
                </div>
                <Badge className={getStatusColor(agendamento.status)}>
                  {getStatusText(agendamento.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(agendamento.data).toLocaleDateString('pt-BR')}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{agendamento.horario}</span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{agendamento.clienteNome}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{agendamento.clienteTelefone}</span>
                </div>

                {agendamento.endereco && (
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{agendamento.endereco}</span>
                  </div>
                )}
              </div>

              {agendamento.observacoes && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-sm"><strong>Observações:</strong> {agendamento.observacoes}</p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{(prestador.avaliacao ?? 0).toFixed(1)}</span>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    R$ {agendamento.precoTotal.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{servico.duracao || 'Consultar'}</p>
                </div>
              </div>

              {agendamento.status === 'agendado' && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Reagendar
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (agendamentos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Agendamentos</h1>
          <p className="text-muted-foreground">
            Gerencie seus agendamentos de serviços
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhum agendamento encontrado</h2>
            <p className="text-muted-foreground mb-6">
              Você ainda não possui agendamentos. Que tal agendar um serviço?
            </p>
            <Link href="/servicos">
              <Button>Ver Serviços Disponíveis</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Meus Agendamentos</h1>
        <p className="text-muted-foreground">
          Gerencie seus agendamentos de serviços
        </p>
      </div>

      <Tabs defaultValue="ativos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativos">
            Ativos ({agendamentosAtivos.length})
          </TabsTrigger>
          <TabsTrigger value="historico">
            Histórico ({agendamentosHistorico.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <div className="space-y-4">
            {agendamentosAtivos.map((agendamento) => (
              <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="historico">
          <div className="space-y-4">
            {agendamentosHistorico.map((agendamento) => (
              <AgendamentoCard key={agendamento.id} agendamento={agendamento} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
