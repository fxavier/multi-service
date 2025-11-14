'use client';

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Servico } from '@/types/marketplace';
import type { RootState } from '../store';

import { marketplaceApi } from '../api';

const servicosAdapter = createEntityAdapter<Servico>();

const initialState = servicosAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

const servicosSlice = createSlice({
  name: 'servicos',
  initialState,
  reducers: {
    servicoAdicionado: servicosAdapter.addOne,
    servicosAtualizados: servicosAdapter.upsertMany,
    servicoAtualizado: servicosAdapter.upsertOne,
    servicoRemovido: servicosAdapter.removeOne,
    servicosLimpados: (state) => {
      servicosAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(marketplaceApi.endpoints.getServicos.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getServicos.matchFulfilled, (state, action) => {
        servicosAdapter.upsertMany(state, action.payload ?? []);
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getServicos.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Não foi possível carregar os serviços.';
      });
  },
});

export const {
  servicoAdicionado,
  servicosAtualizados,
  servicoAtualizado,
  servicoRemovido,
  servicosLimpados,
} = servicosSlice.actions;

export default servicosSlice.reducer;

const servicosSelectors = servicosAdapter.getSelectors((state: RootState) => state.servicos);

export const selectTodosServicos = (state: RootState) => servicosSelectors.selectAll(state);
export const selectServicoPorId = (state: RootState, id: string) => servicosSelectors.selectById(state, id);
export const selectServicosIds = (state: RootState) => servicosSelectors.selectIds(state);

export const selectServicosStatus = (state: RootState) => state.servicos.status;
export const selectServicosErro = (state: RootState) => state.servicos.error;
