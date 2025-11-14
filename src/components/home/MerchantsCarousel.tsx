'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star, Clock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatarMoeda } from '@/lib/formatacao';
import { useGetMerchantsQuery } from '@/store/api';

export default function MerchantsCarousel() {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const { data: merchants, isLoading } = useGetMerchantsQuery();

  const merchantsDestaque = useMemo(
    () => (merchants ?? []).filter((merchant) => merchant.destaque),
    [merchants]
  );

  useEffect(() => {
    if (!merchantsDestaque.length) return;

    const timer = setInterval(() => {
      setIndiceAtual((prev) => (prev + 1) % merchantsDestaque.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [merchantsDestaque.length]);

  const proximoSlide = () => {
    setIndiceAtual((prev) => (prev + 1) % Math.max(merchantsDestaque.length, 1));
  };

  const slideAnterior = () => {
    setIndiceAtual((prev) => (prev - 1 + Math.max(merchantsDestaque.length, 1)) % Math.max(merchantsDestaque.length, 1));
  };

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Estabelecimentos em Destaque</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça os melhores estabelecimentos da sua região com ofertas especiais e produtos de qualidade.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (merchantsDestaque.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Estabelecimentos em Destaque</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça os melhores estabelecimentos da sua região com ofertas especiais e produtos de qualidade.
          </p>
        </div>

        <div className="relative">
          {/* Carrossel Principal */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${indiceAtual * 100}%)` }}
            >
              {merchantsDestaque.map((merchant) => (
                <div key={merchant.id} className="w-full flex-shrink-0">
                  <Card className="border-0 shadow-lg">
                    <div className="relative h-64 md:h-80">
                      <Image
                        src={merchant.banner}
                        alt={merchant.nome}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Conteúdo Sobreposto */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white">
                            <Image
                              src={merchant.logo}
                              alt={merchant.nome}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{merchant.nome}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm">{merchant.avaliacao}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {merchant.tipo}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm mb-4 opacity-90">{merchant.descricao}</p>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          {merchant.tempoEntrega && (
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1" />
                              {merchant.tempoEntrega}
                            </div>
                          )}
                          {merchant.entregaGratis ? (
                            <Badge variant="default" className="bg-green-600">
                              <Truck className="h-3 w-3 mr-1" />
                              Entrega Grátis
                            </Badge>
                          ) : merchant.taxaEntrega && (
                            <div className="flex items-center text-sm">
                              <Truck className="h-4 w-4 mr-1" />
                              {formatarMoeda(merchant.taxaEntrega)}
                            </div>
                          )}
                        </div>

                        <Link href={`/merchants/${merchant.slug}`}>
                          <Button
                            size="lg"
                            className="w-full md:w-auto"
                            style={{ backgroundColor: '#FF6900', borderColor: '#FF6900' }}
                          >
                            Ver Produtos
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Controles */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={slideAnterior}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={proximoSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Indicadores */}
          <div className="flex justify-center space-x-2 mt-6">
            {merchantsDestaque.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === indiceAtual ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setIndiceAtual(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
