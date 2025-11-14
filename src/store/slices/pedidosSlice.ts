'use client';

import { nanoid } from '@reduxjs/toolkit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Pedido } from '@/types/marketplace';
import type { RootState } from '../store';

interface PedidosState {
  historico: Pedido[];
}

const initialState: PedidosState = {
  historico: [],
};

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  reducers: {
    pedidoRegistrado: {
      reducer: (state, action: PayloadAction<Pedido>) => {
        state.historico.unshift(action.payload);
      },
      prepare: (pedido: Omit<Pedido, 'id'> & { id?: string }) => ({
        payload: {
          ...pedido,
          id: pedido.id ?? nanoid(),
        } as Pedido,
      }),
    },
    pedidoAtualizado: (state, action: PayloadAction<Pedido>) => {
      const index = state.historico.findIndex((pedido) => pedido.id === action.payload.id);
      if (index !== -1) {
        state.historico[index] = action.payload;
      }
    },
    pedidoRemovido: (state, action: PayloadAction<string>) => {
      state.historico = state.historico.filter((pedido) => pedido.id !== action.payload);
    },
    pedidosDefinidos: (state, action: PayloadAction<Pedido[]>) => {
      state.historico = action.payload;
    },
    pedidosLimpos: (state) => {
      state.historico = [];
    },
  },
});

export const {
  pedidoRegistrado,
  pedidoAtualizado,
  pedidoRemovido,
  pedidosDefinidos,
  pedidosLimpos,
} = pedidosSlice.actions;

export default pedidosSlice.reducer;

export const selectPedidos = (state: RootState) => state.pedidos.historico;
export const selectPedidoPorId = (state: RootState, id: string) =>
  state.pedidos.historico.find((pedido) => pedido.id === id);
