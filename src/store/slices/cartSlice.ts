'use client';

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { ItemCarrinho } from '@/types/marketplace';

export interface CartState {
  itens: ItemCarrinho[];
}

const initialState: CartState = {
  itens: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<ItemCarrinho[]>) {
      state.itens = action.payload;
    },
    adicionarItem(state, action: PayloadAction<Omit<ItemCarrinho, 'id'>>) {
      const payload = action.payload;
      const existente = state.itens.find(
        (item) =>
          item.produtoId === payload.produtoId &&
          item.servicoId === payload.servicoId &&
          item.tipo === payload.tipo
      );

      if (existente) {
        existente.quantidade += payload.quantidade;
      } else {
        state.itens.push({ ...payload, id: nanoid() });
      }
    },
    removerItem(state, action: PayloadAction<string>) {
      state.itens = state.itens.filter((item) => item.id !== action.payload);
    },
    atualizarQuantidade(state, action: PayloadAction<{ id: string; quantidade: number }>) {
      const { id, quantidade } = action.payload;
      const item = state.itens.find((i) => i.id === id);

      if (!item) return;

      if (quantidade <= 0) {
        state.itens = state.itens.filter((i) => i.id !== id);
      } else {
        item.quantidade = quantidade;
      }
    },
    limparCarrinho(state) {
      state.itens = [];
    },
  },
});

export const {
  adicionarItem,
  removerItem,
  atualizarQuantidade,
  limparCarrinho,
  hydrate,
} = cartSlice.actions;

export const selectItensCarrinho = (state: { cart: CartState }) => state.cart.itens;
export const selectTotalItens = (state: { cart: CartState }) =>
  state.cart.itens.reduce((total, item) => total + item.quantidade, 0);
export const selectSubtotal = (state: { cart: CartState }) =>
  state.cart.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

export default cartSlice.reducer;
