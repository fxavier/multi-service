'use client';

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import merchantsReducer from './slices/merchantsSlice';
import categoriasReducer from './slices/categoriasSlice';
import produtosReducer from './slices/produtosSlice';
import prestadoresReducer from './slices/prestadoresSlice';
import servicosReducer from './slices/servicosSlice';
import agendamentosReducer from './slices/agendamentosSlice';
import pedidosReducer from './slices/pedidosSlice';
import authReducer from './slices/authSlice';
import { marketplaceApi } from './api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    merchants: merchantsReducer,
    categorias: categoriasReducer,
    produtos: produtosReducer,
    prestadores: prestadoresReducer,
    servicos: servicosReducer,
    agendamentos: agendamentosReducer,
    pedidos: pedidosReducer,
    [marketplaceApi.reducerPath]: marketplaceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(marketplaceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
