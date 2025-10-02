
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const categorias = [
    'Supermercados',
    'Farmácias', 
    'Restaurantes',
    'Pet Shops',
    'Eletrônicos',
    'Beleza'
  ];

  const servicos = [
    'Eletricista',
    'Encanador',
    'Diarista',
    'Pintor',
    'Massagista',
    'Cabeleireira'
  ];

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Sobre */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl">Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Sua plataforma completa para compras e serviços. Conectamos você aos melhores 
              estabelecimentos e profissionais da sua região.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>São Paulo, SP</span>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categorias.map((categoria) => (
                <li key={categoria}>
                  <Link 
                    href="/merchants" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {categoria}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              {servicos.map((servico) => (
                <li key={servico}>
                  <Link 
                    href="/servicos" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {servico}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-0000</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contato@marketplace.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>24h por dia, 7 dias por semana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Marketplace. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Termos de Uso
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Política de Privacidade
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
