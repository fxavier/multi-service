'use client';

import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Produto } from '@/types/marketplace';
import type { RootState } from '../store';

import { marketplaceApi } from '../api';

const produtosAdapter = createEntityAdapter<Produto>();

const initialState = produtosAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

const produtosSlice = createSlice({
  name: 'produtos',
  initialState,
  reducers: {
    produtoAdicionado: produtosAdapter.addOne,
    produtosAtualizados: produtosAdapter.upsertMany,
    produtoAtualizado: produtosAdapter.upsertOne,
    produtoRemovido: produtosAdapter.removeOne,
    produtosLimpos: (state) => {
      produtosAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(marketplaceApi.endpoints.getProdutos.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getProdutos.matchFulfilled, (state, action) => {
        produtosAdapter.upsertMany(state, action.payload ?? []);
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getProdutos.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Não foi possível carregar os produtos.';
      });
  },
});

export const {
  produtoAdicionado,
  produtosAtualizados,
  produtoAtualizado,
  produtoRemovido,
  produtosLimpos,
} = produtosSlice.actions;

export default produtosSlice.reducer;

const produtosSelectors = produtosAdapter.getSelectors((state: RootState) => state.produtos);

export const selectTodosProdutos = (state: RootState) => produtosSelectors.selectAll(state);
export const selectProdutoPorId = (state: RootState, id: string) => produtosSelectors.selectById(state, id);
export const selectProdutosPorIds = (state: RootState) => produtosSelectors.selectIds(state);

export const selectProdutosStatus = (state: RootState) => state.produtos.status;
export const selectProdutosErro = (state: RootState) => state.produtos.error;
