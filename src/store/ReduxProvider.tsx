'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrate, selectItensCarrinho } from './slices/cartSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const CARRINHO_STORAGE_KEY = 'marketplace-carrinho';

function CartPersistence({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const itens = useAppSelector(selectItensCarrinho);

  useEffect(() => {
    const armazenado = typeof window !== 'undefined' ? localStorage.getItem(CARRINHO_STORAGE_KEY) : null;
    if (armazenado) {
      try {
        const itensArmazenados = JSON.parse(armazenado);
        if (Array.isArray(itensArmazenados)) {
          dispatch(hydrate(itensArmazenados));
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
      <CartPersistence>{children}</CartPersistence>
    </Provider>
  );
}
