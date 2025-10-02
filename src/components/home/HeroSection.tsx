
'use client';

import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function HeroSection() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  const categorias = [
    { valor: 'todos', label: 'Todas as categorias' },
    { valor: 'lojas', label: 'Lojas' },
    { valor: 'farmacia', label: 'Farmácias' },
    { valor: 'restaurante', label: 'Restaurantes' },
    { valor: 'petshop', label: 'Pet Shops' },
    { valor: 'servicos', label: 'Serviços' }
  ];

  const localizacoes = [
    { valor: 'maputo-central', label: 'Maputo Central' },
    { valor: 'polana', label: 'Polana' },
    { valor: 'sommerschield', label: 'Sommerschield' },
    { valor: 'costa-do-sol', label: 'Costa do Sol' },
    { valor: 'matola', label: 'Matola' },
    { valor: 'machava', label: 'Machava' },
    { valor: 'marracuene', label: 'Marracuene' }
  ];

  return (
    <section className="relative bg-gradient-hero py-20 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Tudo que você precisa
            <br />
            em um só lugar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra os melhores estabelecimentos e profissionais de Moçambique. 
            Compre produtos e agende serviços com facilidade.
          </p>
        </div>

        {/* Barra de Busca Unificada */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-background/90 backdrop-blur-sm rounded-2xl border shadow-primary p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Campo de Busca */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar produtos, lojas ou serviços..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10 h-12 text-base border-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="h-12 border-primary/20 focus:border-primary">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Categoria" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.valor} value={cat.valor}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Localização */}
              <div>
                <Select value={localizacao} onValueChange={setLocalizacao}>
                  <SelectTrigger className="h-12 border-primary/20 focus:border-primary">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Localização" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {localizacoes.map((loc) => (
                      <SelectItem key={loc.valor} value={loc.valor}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button size="lg" className="w-full mt-4 h-12 text-base bg-gradient-primary hover:opacity-90 shadow-primary">
              <Search className="h-5 w-5 mr-2" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Estabelecimentos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-secondary mb-2">200+</div>
            <div className="text-sm text-muted-foreground">Prestadores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-accent mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Produtos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-primary mb-2">50k+</div>
            <div className="text-sm text-muted-foreground">Clientes Satisfeitos</div>
          </div>
        </div>
      </div>
    </section>
  );
}
