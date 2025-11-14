'use client';

import { useState } from 'react';
import { Search, ShoppingCart, MapPin, Menu, X, Store, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { selectTotalItens } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectAuthState } from '@/store/slices/authSlice';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const dispatch = useAppDispatch();
  const totalItens = useAppSelector(selectTotalItens);
  const authState = useAppSelector(selectAuthState);
  const isAuthenticated = Boolean(authState.token);
  const usuario = authState.user;
  const nomeUsuario =
    (typeof usuario?.name === 'string' && usuario.name) ||
    (typeof (usuario as any)?.full_name === 'string' && (usuario as any).full_name) ||
    (typeof (usuario as any)?.username === 'string' && (usuario as any).username) ||
    (typeof usuario?.email === 'string' && usuario.email) ||
    'Minha conta';
  const primeiroNome = nomeUsuario.split(' ')[0];

  const handleLogout = () => {
    dispatch(logout());
    setMenuAberto(false);
  };

  const navegacao = [
    { nome: 'Início', href: '/' },
    { nome: 'Lojas', href: '/merchants' },
    { nome: 'Serviços', href: '/servicos' },
    { nome: 'Agendamentos', href: '/agendamentos' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gradient-primary">Marketplace</span>
          </Link>

          {/* Barra de Busca - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar produtos e serviços..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 pr-4 border-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navegacao.map((item) => (
              <Link
                key={item.nome}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.nome}
              </Link>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center space-x-2">
            {/* Localização */}
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm">Maputo, MZ</span>
            </Button>

            {/* Autenticação */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-primary/10">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{primeiroNome}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/merchant" className="flex items-center">
                      <Store className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                      Painel do estabelecimento
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/prestador" className="flex items-center">
                      <User className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                      Painel do prestador
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:flex">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">Entrar</span>
                </Button>
              </Link>
            )}

            {/* Cadastros */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-secondary/10">
                  <User className="h-4 w-4 mr-2 text-secondary" />
                  <span className="text-sm">Cadastre-se</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/cadastro/merchant" className="flex items-center">
                    <Store className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                    Sou Lojista
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cadastro/prestador" className="flex items-center">
                    <User className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                    Sou Prestador
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Carrinho */}
            <Link href="/carrinho">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/10">
                <ShoppingCart className="h-5 w-5 text-accent" />
                {totalItens > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-primary border-0"
                  >
                    {totalItens}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Toggle Tema */}
            <ThemeToggle />

            {/* Menu Mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuAberto(!menuAberto)}
            >
              {menuAberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Barra de Busca Mobile */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar produtos e serviços..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 pr-4 border-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Menu Mobile */}
        {menuAberto && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-3">
              {navegacao.map((item) => (
                <Link
                  key={item.nome}
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  {item.nome}
                </Link>
              ))}

              <div className="border-t pt-3 space-y-2">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start hover:bg-primary/10"
                    onClick={handleLogout}
                  >
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">Sair</span>
                  </Button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setMenuAberto(false)}
                  >
                    <User className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                    Entrar
                  </Link>
                )}
                <Link
                  href="/cadastro/merchant"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <Store className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                  Cadastrar Estabelecimento
                </Link>
                <Link
                  href="/cadastro/prestador"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMenuAberto(false)}
                >
                  <User className="h-4 w-4 mr-2" style={{ color: '#FF6900' }} />
                  Cadastrar como Prestador
                </Link>
              </div>

              <Button variant="ghost" size="sm" className="justify-start hover:bg-primary/10">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Maputo, MZ</span>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
