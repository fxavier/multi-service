
'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { prestadores } from '@/data/prestadores';
import { servicos } from '@/data/servicos';
import { formatarMoeda } from '@/lib/formatacao';
import Link from 'next/link';

export default function ServicosContent() {
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroAvaliacao, setFiltroAvaliacao] = useState(0);
  const [faixaPreco, setFaixaPreco] = useState([0, 1000]);
  const [ordenacao, setOrdenacao] = useState('relevancia');

  // Obter categorias únicas
  const categorias = useMemo(() => {
    const cats = [...new Set(servicos.map(s => s.categoria))];
    return cats;
  }, []);

  // Filtrar e ordenar prestadores
  const prestadoresFiltrados = useMemo(() => {
    let resultado = prestadores.filter(prestador => {
      // Filtro por busca
      if (busca && !prestador.nome.toLowerCase().includes(busca.toLowerCase()) &&
          !prestador.profissoes.some(p => p.toLowerCase().includes(busca.toLowerCase()))) {
        return false;
      }

      // Filtro por categoria
      if (filtroCategoria !== 'todos') {
        const temServicoDaCategoria = servicos.some(s => 
          s.prestadorId === prestador.id && s.categoria === filtroCategoria
        );
        if (!temServicoDaCategoria) return false;
      }

      // Filtro por avaliação
      if (prestador.avaliacao < filtroAvaliacao) return false;

      // Filtro por preço
      if (prestador.precoBase < faixaPreco[0] || prestador.precoBase > faixaPreco[1]) {
        return false;
      }

      return true;
    });

    // Ordenação
    switch (ordenacao) {
      case 'avaliacao':
        resultado.sort((a, b) => b.avaliacao - a.avaliacao);
        break;
      case 'preco-menor':
        resultado.sort((a, b) => a.precoBase - b.precoBase);
        break;
      case 'preco-maior':
        resultado.sort((a, b) => b.precoBase - a.precoBase);
        break;
      default:
        // Relevância (por avaliação e número de avaliações)
        resultado.sort((a, b) => (b.avaliacao * b.totalAvaliacoes) - (a.avaliacao * a.totalAvaliacoes));
    }

    return resultado;
  }, [busca, filtroCategoria, filtroAvaliacao, faixaPreco, ordenacao]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Serviços Profissionais</h1>
        <p className="text-muted-foreground">
          Encontre os melhores profissionais para suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filtros Laterais */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
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
              {prestadoresFiltrados.length} profissionais encontrados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prestadoresFiltrados.map((prestador) => {
              const servicosPrestador = servicos.filter(s => s.prestadorId === prestador.id);
              
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
                        <h3 className="font-semibold text-lg mb-1">{prestador.nome}</h3>
                        
                        {/* Profissões */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {prestador.profissoes.map((profissao, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {profissao}
                            </Badge>
                          ))}
                        </div>

                        {/* Avaliação */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium ml-1">
                              {prestador.avaliacao}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({prestador.totalAvaliacoes} avaliações)
                          </span>
                        </div>

                        {/* Localização */}
                        <div className="flex items-center gap-1 mb-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {prestador.endereco}
                          </span>
                        </div>

                        {/* Experiência */}
                        <div className="flex items-center gap-1 mb-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {prestador.experiencia} de experiência
                          </span>
                        </div>

                        {/* Preço Base */}
                        <div className="mb-3">
                          <span className="text-lg font-bold text-primary">
                            A partir de {formatarMoeda(prestador.precoBase)}
                          </span>
                        </div>

                        {/* Serviços */}
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-1">Serviços oferecidos:</p>
                          <div className="text-sm text-muted-foreground">
                            {servicosPrestador.slice(0, 2).map(servico => servico.nome).join(', ')}
                            {servicosPrestador.length > 2 && ` e mais ${servicosPrestador.length - 2}`}
                          </div>
                        </div>

                        {/* Botão */}
                        <Link href={`/prestadores/${prestador.id}`}>
                          <Button 
                            className="w-full"
                            style={{ backgroundColor: '#FF6900', borderColor: '#FF6900' }}
                          >
                            Ver Perfil e Agendar
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {prestadoresFiltrados.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhum prestador encontrado com os filtros selecionados.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setBusca('');
                    setFiltroCategoria('todos');
                    setFiltroAvaliacao(0);
                    setFaixaPreco([0, 1000]);
                  }}
                >
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
