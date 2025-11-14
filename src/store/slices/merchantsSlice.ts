'use client';

import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Merchant } from '@/types/marketplace';
import type { RootState } from '../store';

import { marketplaceApi } from '../api';

const merchantsAdapter = createEntityAdapter<Merchant>();

const initialState = merchantsAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  error: null as string | null,
});

const merchantsSlice = createSlice({
  name: 'merchants',
  initialState,
  reducers: {
    merchantsReceived: (state, action: PayloadAction<Merchant[]>) => {
      merchantsAdapter.setAll(state, action.payload);
      state.status = 'succeeded';
      state.error = null;
    },
    merchantAdded: merchantsAdapter.addOne,
    merchantUpdated: merchantsAdapter.upsertOne,
    merchantRemoved: merchantsAdapter.removeOne,
    merchantsCleared: (state) => {
      merchantsAdapter.removeAll(state);
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(marketplaceApi.endpoints.getMerchants.matchPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getMerchants.matchFulfilled, (state, action) => {
        merchantsAdapter.setAll(state, action.payload ?? []);
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(marketplaceApi.endpoints.getMerchants.matchRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error?.message ?? 'Não foi possível carregar os estabelecimentos.';
      });
  },
});

export const {
  merchantsReceived,
  merchantAdded,
  merchantUpdated,
  merchantRemoved,
  merchantsCleared,
} = merchantsSlice.actions;

export default merchantsSlice.reducer;

const merchantsSelectors = merchantsAdapter.getSelectors((state: RootState) => state.merchants);

export const selectAllMerchants = (state: RootState) => merchantsSelectors.selectAll(state);
export const selectMerchantById = (state: RootState, id: string) => merchantsSelectors.selectById(state, id);
export const selectMerchantsIds = (state: RootState) => merchantsSelectors.selectIds(state);

export const selectMerchantsStatus = (state: RootState) => state.merchants.status;
export const selectMerchantsError = (state: RootState) => state.merchants.error;
