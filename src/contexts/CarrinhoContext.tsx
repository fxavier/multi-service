
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemCarrinho } from '@/types/marketplace';

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (item: Omit<ItemCarrinho, 'id'>) => void;
  removerItem: (id: string) => void;
  atualizarQuantidade: (id: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  subtotal: number;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('marketplace-carrinho');
    if (carrinhoSalvo) {
      try {
        setItens(JSON.parse(carrinhoSalvo));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('marketplace-carrinho', JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = (novoItem: Omit<ItemCarrinho, 'id'>) => {
    const id = Date.now().toString();
    const itemExistente = itens.find(
      item => 
        item.produtoId === novoItem.produtoId && 
        item.servicoId === novoItem.servicoId
    );

    if (itemExistente) {
      atualizarQuantidade(itemExistente.id, itemExistente.quantidade + novoItem.quantidade);
    } else {
      setItens(prev => [...prev, { ...novoItem, id }]);
    }
  };

  const removerItem = (id: string) => {
    setItens(prev => prev.filter(item => item.id !== id));
  };

  const atualizarQuantidade = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(id);
      return;
    }
    
    setItens(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantidade } : item
      )
    );
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const subtotal = itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionarItem,
      removerItem,
      atualizarQuantidade,
      limparCarrinho,
      totalItens,
      subtotal
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (context === undefined) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
}
