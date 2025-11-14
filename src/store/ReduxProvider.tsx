'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrate as hydrateCarrinho, selectItensCarrinho } from './slices/cartSlice';
import { useAppDispatch, useAppSelector } from './hooks';
import { hydrate as hydrateAuth, selectAuthState } from './slices/authSlice';

const CARRINHO_STORAGE_KEY = 'marketplace-carrinho';
const AUTH_STORAGE_KEY = 'marketplace-auth';

function AuthPersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector(selectAuthState);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current || typeof window === 'undefined') {
      return;
    }

    let token: string | null = null;
    let usuario: Record<string, unknown> | null = null;

    const armazenado = localStorage.getItem(AUTH_STORAGE_KEY);
    if (armazenado) {
      try {
        const authArmazenado = JSON.parse(armazenado);
        if (authArmazenado && typeof authArmazenado === 'object') {
          token = typeof authArmazenado.token === 'string' ? authArmazenado.token : null;
          const usuarioArmazenado = (authArmazenado as Record<string, unknown>).user;
          if (usuarioArmazenado && typeof usuarioArmazenado === 'object' && !Array.isArray(usuarioArmazenado)) {
            usuario = usuarioArmazenado as Record<string, unknown>;
          }
        }
      } catch (error) {
        console.error('Erro ao carregar os dados de autenticação do armazenamento local', error);
      }
    }

    dispatch(
      hydrateAuth({
        token,
        user: usuario as any,
      }),
    );

    hasHydrated.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined' || !hasHydrated.current) {
      return;
    }

    if (!token) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }

    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          token,
          user,
        }),
      );
    } catch (error) {
      console.error('Erro ao salvar os dados de autenticação no armazenamento local', error);
    }
  }, [token, user]);

  return <>{children}</>;
}

function CartPersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const itens = useAppSelector(selectItensCarrinho);

  useEffect(() => {
    const armazenado = typeof window !== 'undefined' ? localStorage.getItem(CARRINHO_STORAGE_KEY) : null;
    if (armazenado) {
      try {
        const itensArmazenados = JSON.parse(armazenado);
        if (Array.isArray(itensArmazenados)) {
          dispatch(hydrateCarrinho(itensArmazenados));
        }
      } catch (error) {
        console.error('Erro ao carregar o carrinho do armazenamento local', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(itens));
    }
  }, [itens]);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthPersistence>
        <CartPersistence>{children}</CartPersistence>
      </AuthPersistence>
    </Provider>
  );
}
