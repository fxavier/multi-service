'use client';

import { nanoid } from '@reduxjs/toolkit';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Agendamento } from '@/types/marketplace';
import type { RootState } from '../store';

interface AgendamentosState {
  itens: Agendamento[];
}

const initialState: AgendamentosState = {
  itens: [],
};

const agendamentosSlice = createSlice({
  name: 'agendamentos',
  initialState,
  reducers: {
    agendamentoRegistrado: {
      reducer: (state, action: PayloadAction<Agendamento>) => {
        state.itens.push(action.payload);
      },
      prepare: (agendamento: Omit<Agendamento, 'id'> & { id?: string }) => ({
        payload: {
          ...agendamento,
          id: agendamento.id ?? nanoid(),
        } as Agendamento,
      }),
    },
    agendamentoAtualizado: (state, action: PayloadAction<Agendamento>) => {
      const index = state.itens.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.itens[index] = action.payload;
      }
    },
    agendamentoRemovido: (state, action: PayloadAction<string>) => {
      state.itens = state.itens.filter((item) => item.id !== action.payload);
    },
    agendamentosDefinidos: (state, action: PayloadAction<Agendamento[]>) => {
      state.itens = action.payload;
    },
    agendamentosLimpados: (state) => {
      state.itens = [];
    },
  },
});

export const {
  agendamentoRegistrado,
  agendamentoAtualizado,
  agendamentoRemovido,
  agendamentosDefinidos,
  agendamentosLimpados,
} = agendamentosSlice.actions;

export default agendamentosSlice.reducer;

export const selectAgendamentos = (state: RootState) => state.agendamentos.itens;
export const selectAgendamentoPorId = (state: RootState, id: string) =>
  state.agendamentos.itens.find((item) => item.id === id);
