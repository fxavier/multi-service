'use client';

import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PrestadorServico } from '@/types/marketplace';
import type { RootState } from '../store';

import { marketplaceApi } from '../api';

const prestadoresAdapter = createEntityAdapter<PrestadorServico>();

const initialState = prestadoresAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

const prestadoresSlice = createSlice({
  name: 'prestadores',
  initialState,
  reducers: {
    prestadoresReceived: (state, action: PayloadAction<PrestadorServico[]>) => {
      prestadoresAdapter.setAll(state, action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    prestadorAdded: prestadoresAdapter.addOne,
    prestadorAtualizado: prestadoresAdapter.upsertOne,
    prestadorRemovido: prestadoresAdapter.removeOne,
    prestadoresLimpados: (state) => {
      prestadoresAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(marketplaceApi.endpoints.getPrestadores.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getPrestadores.matchFulfilled, (state, action) => {
        prestadoresAdapter.setAll(state, action.payload ?? []);
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getPrestadores.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Não foi possível carregar os prestadores.';
      });
  },
});

export const {
  prestadoresReceived,
  prestadorAdded,
  prestadorAtualizado,
  prestadorRemovido,
  prestadoresLimpados,
} = prestadoresSlice.actions;

export default prestadoresSlice.reducer;

const prestadoresSelectors = prestadoresAdapter.getSelectors((state: RootState) => state.prestadores);

export const selectTodosPrestadores = (state: RootState) => prestadoresSelectors.selectAll(state);
export const selectPrestadorPorId = (state: RootState, id: string) => prestadoresSelectors.selectById(state, id);
export const selectPrestadoresIds = (state: RootState) => prestadoresSelectors.selectIds(state);

export const selectPrestadoresStatus = (state: RootState) => state.prestadores.status;
export const selectPrestadoresErro = (state: RootState) => state.prestadores.error;
