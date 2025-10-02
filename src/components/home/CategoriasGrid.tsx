
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Pill, UtensilsCrossed, Heart, Smartphone, Scissors } from 'lucide-react';

export default function CategoriasGrid() {
  const categorias = [
    {
      nome: 'Lojas',
      icone: Store,
      descricao: 'Supermercados, eletrônicos e muito mais',
      href: '/merchants?tipo=loja',
      cor: 'bg-blue-500'
    },
    {
      nome: 'Farmácias',
      icone: Pill,
      descricao: 'Medicamentos e produtos de saúde',
      href: '/merchants?tipo=farmacia',
      cor: 'bg-green-500'
    },
    {
      nome: 'Restaurantes',
      icone: UtensilsCrossed,
      descricao: 'Comida deliciosa na sua casa',
      href: '/merchants?tipo=restaurante',
      cor: 'bg-orange-500'
    },
    {
      nome: 'Pet Shops',
      icone: Heart,
      descricao: 'Tudo para seu melhor amigo',
      href: '/merchants?tipo=petshop',
      cor: 'bg-pink-500'
    },
    {
      nome: 'Eletrônicos',
      icone: Smartphone,
      descricao: 'Tecnologia e inovação',
      href: '/merchants?categoria=eletronicos',
      cor: 'bg-purple-500'
    },
    {
      nome: 'Serviços',
      icone: Scissors,
      descricao: 'Profissionais qualificados',
      href: '/servicos',
      cor: 'bg-indigo-500'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore por Categoria</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você precisa navegando pelas nossas categorias principais.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categorias.map((categoria) => {
            const IconeComponente = categoria.icone;
            
            return (
              <Link key={categoria.nome} href={categoria.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`${categoria.cor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconeComponente className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{categoria.nome}</h3>
                    <p className="text-sm text-muted-foreground leading-tight">
                      {categoria.descricao}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
