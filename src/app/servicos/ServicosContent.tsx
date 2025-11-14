'use client';

import { useState, useMemo } from 'react';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { formatarMoeda } from '@/lib/formatacao';
import { useGetPrestadoresQuery, useGetServicosQuery } from '@/store/api';

export default function ServicosContent() {
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroAvaliacao, setFiltroAvaliacao] = useState(0);
  const [faixaPreco, setFaixaPreco] = useState([0, 1000]);
  const [ordenacao, setOrdenacao] = useState('relevancia');

  const { data: prestadores, isLoading: carregandoPrestadores, isError: erroPrestadores } = useGetPrestadoresQuery();
  const { data: servicos, isLoading: carregandoServicos, isError: erroServicos } = useGetServicosQuery();

  const categorias = useMemo(() => {
    const lista = new Set<string>();
    (servicos ?? []).forEach((servico) => lista.add(servico.categoria));
    return Array.from(lista);
  }, [servicos]);

  const prestadoresFiltrados = useMemo(() => {
    if (!prestadores) return [];

    let resultado = prestadores.filter(prestador => {
      if (busca && !prestador.nome.toLowerCase().includes(busca.toLowerCase()) &&
          !prestador.profissoes.some(p => p.toLowerCase().includes(busca.toLowerCase()))) {
        return false;
      }

      if (filtroCategoria !== 'todos') {
        const temServicoDaCategoria = (servicos ?? []).some(s =>
          s.prestadorId === prestador.id && s.categoria === filtroCategoria
        );
        if (!temServicoDaCategoria) return false;
      }

      if (prestador.avaliacao < filtroAvaliacao) return false;

      if (prestador.precoBase < faixaPreco[0] || prestador.precoBase > faixaPreco[1]) {
        return false;
      }

      return true;
    });

    switch (ordenacao) {
      case 'avaliacao':
        resultado = [...resultado].sort((a, b) => b.avaliacao - a.avaliacao);
        break;
      case 'preco-menor':
        resultado = [...resultado].sort((a, b) => a.precoBase - b.precoBase);
        break;
      case 'preco-maior':
        resultado = [...resultado].sort((a, b) => b.precoBase - a.precoBase);
        break;
      default:
        resultado = [...resultado].sort((a, b) => (b.avaliacao * b.totalAvaliacoes) - (a.avaliacao * a.totalAvaliacoes));
    }

    return resultado;
  }, [prestadores, servicos, busca, filtroCategoria, filtroAvaliacao, faixaPreco, ordenacao]);

  const carregando = carregandoPrestadores || carregandoServicos;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Serviços Profissionais</h1>
        <p className="text-muted-foreground">
          Encontre os melhores profissionais para suas necessidades
        </p>
      </div>

      {erroPrestadores || erroServicos ? (
        <Card className="mb-8">
          <CardContent className="p-6 text-center text-sm text-red-500">
            Não foi possível carregar os serviços. Tente novamente mais tarde.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros Laterais */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Serviços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Busca */}
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Nome ou profissão..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as categorias</SelectItem>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Avaliação Mínima */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Avaliação Mínima: {filtroAvaliacao} estrelas
                </label>
                <Slider
                  value={[filtroAvaliacao]}
                  onValueChange={(value) => setFiltroAvaliacao(value[0])}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Faixa de Preço */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Preço: {formatarMoeda(faixaPreco[0])} - {formatarMoeda(faixaPreco[1])}
                </label>
                <Slider
                  value={faixaPreco}
                  onValueChange={setFaixaPreco}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Ordenação */}
              <div>
                <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevância</SelectItem>
                    <SelectItem value="avaliacao">Melhor Avaliação</SelectItem>
                    <SelectItem value="preco-menor">Menor Preço</SelectItem>
                    <SelectItem value="preco-maior">Maior Preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Prestadores */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {carregando ? 'Carregando profissionais...' : `${prestadoresFiltrados.length} profissionais encontrados`}
            </p>
          </div>

          {carregando ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prestadoresFiltrados.map((prestador) => {
                const servicosPrestador = (servicos ?? []).filter(s => s.prestadorId === prestador.id);

                return (
                  <Card key={prestador.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={prestador.foto}
                          alt={prestador.nome}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{prestador.nome}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{prestador.avaliacao}</span>
                                <span>({prestador.totalAvaliacoes} avaliações)</span>
                              </div>
                            </div>
                            <Badge variant="secondary">{formatarMoeda(prestador.precoBase)}</Badge>
                          </div>

                          <div className="flex flex-wrap gap-2 my-3">
                            {prestador.profissoes.map((profissao) => (
                              <Badge key={profissao} variant="outline">
                                {profissao}
                              </Badge>
                            ))}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {prestador.descricao}
                          </p>

                          <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {prestador.endereco}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {prestador.experiencia} de experiência
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Serviços oferecidos:</p>
                            <div className="flex flex-wrap gap-2">
                              {servicosPrestador.slice(0, 3).map((servico) => (
                                <Badge key={servico.id} variant="secondary">
                                  {servico.nome}
                                </Badge>
                              ))}
                              {servicosPrestador.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{servicosPrestador.length - 3} serviços
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div>
                              <span className="text-xs text-muted-foreground">A partir de</span>
                              <p className="text-lg font-semibold text-primary">
                                {formatarMoeda(prestador.precoBase)}
                              </p>
                            </div>
                            <Link href={`/prestadores/${prestador.id}`}>
                              <Button>Ver Detalhes</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
