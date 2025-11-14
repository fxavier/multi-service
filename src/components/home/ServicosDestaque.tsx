'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatarMoeda } from '@/lib/formatacao';
import { useGetPrestadoresQuery } from '@/store/api';

export default function ServicosDestaque() {
  const { data: prestadores, isLoading } = useGetPrestadoresQuery();
  const prestadoresDestaque = (prestadores ?? []).filter((prestador) =>
    prestador.destaque ?? true
  ).slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Profissionais em Destaque</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conecte-se com os melhores profissionais da sua região. Qualidade e confiança garantidas.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestadoresDestaque.map((prestador) => {
              const profissoes = prestador.profissoes ?? [];
              const avaliacao = prestador.avaliacao ?? 0;
              const totalAvaliacoes = prestador.totalAvaliacoes ?? 0;
              const endereco = prestador.endereco || 'Endereço não informado';
              const experiencia = prestador.experiencia
                ? `${prestador.experiencia} de experiência`
                : 'Experiência a combinar';
              const precoBase = typeof prestador.precoBase === 'number' ? prestador.precoBase : null;
              const descricao = prestador.descricao || 'Descrição indisponível.';

              return (
                <Card key={prestador.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  {/* Cabeçalho do Prestador */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      {prestador.foto ? (
                        <Image
                          src={prestador.foto}
                          alt={prestador.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-white text-lg font-semibold">
                          {prestador.nome.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{prestador.nome}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{avaliacao.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({totalAvaliacoes})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profissões */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profissoes.map((profissao) => (
                      <Badge key={profissao} variant="secondary" className="text-xs">
                        {profissao}
                      </Badge>
                    ))}
                  </div>

                  {/* Descrição */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {descricao}
                  </p>

                  {/* Informações */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {endereco}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {experiencia}
                    </div>
                  </div>

                  {/* Preço Base */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-muted-foreground">A partir de</span>
                      <div className="text-lg font-bold text-primary">
                        {precoBase !== null ? formatarMoeda(precoBase) : 'Consultar' }
                      </div>
                    </div>
                  </div>

                  {/* Ação */}
                  <Link href={`/prestadores/${prestador.id}`}>
                    <Button
                      className="w-full"
                      style={{ backgroundColor: '#FF6900', borderColor: '#FF6900' }}
                    >
                      Ver Perfil
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/servicos">
            <Button variant="outline" size="lg">
              Ver Todos os Serviços
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
