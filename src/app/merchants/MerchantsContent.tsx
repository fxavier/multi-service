
'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Star, Clock, Truck, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { merchants } from '@/data/merchants';

export default function MerchantsContent() {
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(searchParams.get('tipo') || '');
  const [avaliacaoFiltro, setAvaliacaoFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const [carregando, setCarregando] = useState(false);

  const merchantsFiltrados = useMemo(() => {
    let resultado = merchants.filter(merchant => merchant.ativo);

    // Filtro por busca
    if (busca) {
      resultado = resultado.filter(merchant =>
        merchant.nome.toLowerCase().includes(busca.toLowerCase()) ||
        merchant.descricao.toLowerCase().includes(busca.toLowerCase())
      );
    }

    // Filtro por tipo
    if (tipoFiltro) {
      resultado = resultado.filter(merchant => merchant.tipo === tipoFiltro);
    }

    // Filtro por avaliação
    if (avaliacaoFiltro) {
      const minAvaliacao = parseFloat(avaliacaoFiltro);
      resultado = resultado.filter(merchant => merchant.avaliacao >= minAvaliacao);
    }

    // Ordenação
    switch (ordenacao) {
      case 'avaliacao':
        resultado.sort((a, b) => b.avaliacao - a.avaliacao);
        break;
      case 'nome':
        resultado.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'relevancia':
      default:
        resultado.sort((a, b) => {
          if (a.destaque && !b.destaque) return -1;
          if (!a.destaque && b.destaque) return 1;
          return b.avaliacao - a.avaliacao;
        });
        break;
    }

    return resultado;
  }, [busca, tipoFiltro, avaliacaoFiltro, ordenacao]);

  const tiposMerchant = [
    { valor: '', label: 'Todos os tipos' },
    { valor: 'loja', label: 'Lojas' },
    { valor: 'farmacia', label: 'Farmácias' },
    { valor: 'restaurante', label: 'Restaurantes' },
    { valor: 'petshop', label: 'Pet Shops' }
  ];

  const avaliacoes = [
    { valor: '', label: 'Todas as avaliações' },
    { valor: '4.5', label: '4.5+ estrelas' },
    { valor: '4.0', label: '4.0+ estrelas' },
    { valor: '3.5', label: '3.5+ estrelas' }
  ];

  const ordenacoes = [
    { valor: 'relevancia', label: 'Relevância' },
    { valor: 'avaliacao', label: 'Melhor avaliação' },
    { valor: 'nome', label: 'Nome A-Z' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Estabelecimentos</h1>
        <p className="text-muted-foreground">
          Descubra os melhores estabelecimentos da sua região
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar estabelecimentos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposMerchant.map((tipo) => (
                  <SelectItem key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Avaliação */}
          <div>
            <Select value={avaliacaoFiltro} onValueChange={setAvaliacaoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Avaliação" />
              </SelectTrigger>
              <SelectContent>
                {avaliacoes.map((avaliacao) => (
                  <SelectItem key={avaliacao.valor} value={avaliacao.valor}>
                    {avaliacao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenação */}
          <div>
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {ordenacoes.map((ord) => (
                  <SelectItem key={ord.valor} value={ord.valor}>
                    {ord.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          {merchantsFiltrados.length} estabelecimento(s) encontrado(s)
        </p>
      </div>

      {/* Grid de Merchants */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : merchantsFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏪</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum estabelecimento encontrado</h3>
          <p className="text-muted-foreground mb-6">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
          <Button onClick={() => {
            setBusca('');
            setTipoFiltro('');
            setAvaliacaoFiltro('');
          }}>
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchantsFiltrados.map((merchant) => (
            <Link key={merchant.id} href={`/merchants/${merchant.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-0">
                  {/* Imagem */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={merchant.banner}
                      alt={merchant.nome}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {merchant.destaque && (
                      <Badge className="absolute top-3 left-3 bg-primary">
                        Destaque
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={merchant.logo}
                          alt={merchant.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {merchant.nome}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {merchant.tipo}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {merchant.descricao}
                    </p>

                    {/* Avaliação */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{merchant.avaliacao}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({merchant.totalAvaliacoes} avaliações)
                      </span>
                    </div>

                    {/* Informações de Entrega */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {merchant.tempoEntrega || 'Consultar'}
                      </div>
                      <div className="flex items-center">
                        {merchant.entregaGratis ? (
                          <Badge variant="default" className="bg-green-600 text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Grátis
                          </Badge>
                        ) : (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            R$ {merchant.taxaEntrega?.toFixed(2) || '0,00'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Endereço */}
                    <div className="flex items-center mt-3 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {merchant.endereco}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
