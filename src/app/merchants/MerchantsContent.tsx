'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, Clock, Truck, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMerchantsQuery } from '@/store/api';

export default function MerchantsContent() {
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState(searchParams.get('tipo') || '');
  const [avaliacaoFiltro, setAvaliacaoFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('relevancia');
  const { data: merchants, isLoading, isError } = useGetMerchantsQuery();

  const merchantsFiltrados = useMemo(() => {
    let resultado = (merchants ?? []).filter((merchant) => merchant.ativo ?? true);

    if (busca) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter((merchant) => {
        const nome = merchant.nome?.toLowerCase() ?? '';
        const descricao = merchant.descricao?.toLowerCase() ?? '';
        return nome.includes(termo) || descricao.includes(termo);
      });
    }

    if (tipoFiltro) {
      resultado = resultado.filter((merchant) => merchant.tipo === tipoFiltro);
    }

    if (avaliacaoFiltro) {
      const minAvaliacao = parseFloat(avaliacaoFiltro);
      resultado = resultado.filter((merchant) => (merchant.avaliacao ?? 0) >= minAvaliacao);
    }

    switch (ordenacao) {
      case 'avaliacao':
        resultado = [...resultado].sort((a, b) => (b.avaliacao ?? 0) - (a.avaliacao ?? 0));
        break;
      case 'nome':
        resultado = [...resultado].sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'relevancia':
      default:
        resultado = [...resultado].sort((a, b) => {
          if (a.destaque && !b.destaque) return -1;
          if (!a.destaque && b.destaque) return 1;
          return (b.avaliacao ?? 0) - (a.avaliacao ?? 0);
        });
        break;
    }

    return resultado;
  }, [merchants, busca, tipoFiltro, avaliacaoFiltro, ordenacao]);

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
          {isLoading ? 'Carregando estabelecimentos...' : `${merchantsFiltrados.length} estabelecimento(s) encontrado(s)`}
        </p>
      </div>

      {isError && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center text-sm text-red-500">
            Não foi possível carregar os estabelecimentos. Tente novamente mais tarde.
          </CardContent>
        </Card>
      )}

      {/* Grid de Merchants */}
      {isLoading ? (
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
            setOrdenacao('relevancia');
          }}>
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchantsFiltrados.map((merchant) => {
            const descricao = merchant.descricao || 'Descrição não disponível.';
            const avaliacao = merchant.avaliacao ?? 0;
            const totalAvaliacoes = merchant.totalAvaliacoes ?? 0;
            const tempoEntrega = merchant.tempoEntrega || 'Consultar';
            const entregaGratis = merchant.entregaGratis ?? false;
            const taxaEntrega =
              typeof merchant.taxaEntrega === 'number'
                ? merchant.taxaEntrega
                : undefined;
            const endereco = merchant.endereco || 'Endereço não informado';
            const slug = merchant.slug || merchant.id;

            return (
              <Link key={merchant.id} href={`/merchants/${slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-0">
                  {/* Imagem */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    {merchant.banner ? (
                      <Image
                        src={merchant.banner}
                        alt={merchant.nome}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted" />
                    )}
                    {merchant.destaque && (
                      <Badge className="absolute top-3 left-3 bg-primary">
                        Destaque
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white">
                        {merchant.logo ? (
                          <Image
                            src={merchant.logo}
                            alt={merchant.nome}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary text-white text-sm font-semibold">
                            {merchant.nome.charAt(0)}
                          </div>
                        )}
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
                        {merchant.tipo || 'Estabelecimento'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {descricao}
                    </p>

                    {/* Avaliação */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{avaliacao.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({totalAvaliacoes} avaliações)
                      </span>
                    </div>

                    {/* Informações de Entrega */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {tempoEntrega}
                      </div>
                      <div className="flex items-center">
                        {entregaGratis ? (
                          <Badge variant="default" className="bg-green-600 text-xs">
                            <Truck className="h-3 w-3 mr-1" />
                            Grátis
                          </Badge>
                        ) : taxaEntrega !== undefined ? (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            R$ {taxaEntrega.toFixed(2)}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-1" />
                            Consultar
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Endereço */}
                    <div className="flex items-center mt-3 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {endereco}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
