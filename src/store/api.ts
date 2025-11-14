'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Categoria, Merchant, PrestadorServico, Produto, Servico } from '@/types/marketplace';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';

export const marketplaceApi = createApi({
  reducerPath: 'marketplaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ['Merchants', 'Produtos', 'Categorias', 'Prestadores', 'Servicos'],
  endpoints: (builder) => ({
    getMerchants: builder.query<Merchant[], void>({
      query: () => 'merchants',
      providesTags: ['Merchants'],
    }),
    getProdutos: builder.query<Produto[], void>({
      query: () => 'produtos',
      providesTags: ['Produtos'],
    }),
    getCategorias: builder.query<Categoria[], void>({
      query: () => 'categorias',
      providesTags: ['Categorias'],
    }),
    getPrestadores: builder.query<PrestadorServico[], void>({
      query: () => 'prestadores',
      providesTags: ['Prestadores'],
    }),
    getServicos: builder.query<Servico[], void>({
      query: () => 'servicos',
      providesTags: ['Servicos'],
    }),
  }),
});

export const {
  useGetCategoriasQuery,
  useGetMerchantsQuery,
  useGetPrestadoresQuery,
  useGetProdutosQuery,
  useGetServicosQuery,
} = marketplaceApi;
