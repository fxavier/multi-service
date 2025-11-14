'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { login, selectAuthState, selectIsAuthenticated } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail').email('Informe um e-mail válido'),
  password: z.string().min(1, 'Informe a senha'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { status, error } = useAppSelector(selectAuthState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      const fallback = redirect ? decodeURIComponent(redirect) : '/';
      router.replace(fallback || '/');
    }
  }, [isAuthenticated, redirect, router]);

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data));
  };

  const isLoading = status === 'loading';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Acesse sua conta</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Erro ao entrar</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/cadastro/merchant" className="text-primary hover:underline">
                  Criar conta de lojista
                </Link>
                <Link href="/cadastro/prestador" className="text-primary hover:underline">
                  Criar conta de prestador
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Esqueceu a senha?{' '}
                <Link href="/recuperar-senha" className="text-primary hover:underline">
                  Recuperar acesso
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
