'use client';

import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Categoria } from '@/types/marketplace';
import type { RootState } from '../store';

import { marketplaceApi } from '../api';

const categoriasAdapter = createEntityAdapter<Categoria>();

const initialState = categoriasAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {
    categoriasReceived: (state, action: PayloadAction<Categoria[]>) => {
      categoriasAdapter.setAll(state, action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    categoriaAdded: categoriasAdapter.addOne,
    categoriaAtualizada: categoriasAdapter.upsertOne,
    categoriaRemovida: categoriasAdapter.removeOne,
    categoriasLimpar: (state) => {
      categoriasAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(marketplaceApi.endpoints.getCategorias.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getCategorias.matchFulfilled, (state, action) => {
        categoriasAdapter.setAll(state, action.payload ?? []);
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getCategorias.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Não foi possível carregar as categorias.';
      });
  },
});

export const {
  categoriasReceived,
  categoriaAdded,
  categoriaAtualizada,
  categoriaRemovida,
  categoriasLimpar,
} = categoriasSlice.actions;

export default categoriasSlice.reducer;

const categoriasSelectors = categoriasAdapter.getSelectors((state: RootState) => state.categorias);

export const selectTodasCategorias = (state: RootState) => categoriasSelectors.selectAll(state);
export const selectCategoriaPorId = (state: RootState, id: string) => categoriasSelectors.selectById(state, id);
export const selectCategoriasIds = (state: RootState) => categoriasSelectors.selectIds(state);

export const selectCategoriasStatus = (state: RootState) => state.categorias.status;
export const selectCategoriasErro = (state: RootState) => state.categorias.error;
