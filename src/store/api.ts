'use client';

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Categoria, Merchant, PrestadorServico, Produto, Servico } from '@/types/marketplace';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const tenantHeader = 'X-Tenant-ID';
const defaultTenant =
  process.env.NEXT_PUBLIC_TENANT_ID || process.env.NEXT_PUBLIC_TENANT_SLUG || 'lisboa';

interface PaginatedResponse<T> {
  items?: T[];
  data?: T[];
  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

const resolveCollection = <T,>(payload: PaginatedResponse<T> | T[] | undefined): T[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export const marketplaceApi = createApi({
  reducerPath: 'marketplaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      if (defaultTenant) {
        headers.set(tenantHeader, defaultTenant);
      }
      return headers;
    },
  }),
  tagTypes: ['Merchants', 'Produtos', 'Categorias', 'Prestadores', 'Servicos'],
  endpoints: (builder) => ({
    getMerchants: builder.query<Merchant[], void>({
      query: () => ({
        url: 'merchants',
        params: { page_size: 50 },
      }),
      transformResponse: (response: PaginatedResponse<Merchant> | Merchant[]) =>
        resolveCollection(response),
      providesTags: ['Merchants'],
    }),
    getProdutos: builder.query<Produto[], string | void>({
      query: (merchantId) =>
        merchantId ? `merchants/${merchantId}/produtos` : 'produtos',
      transformResponse: (response: PaginatedResponse<Produto> | Produto[]) =>
        resolveCollection(response),
      providesTags: ['Produtos'],
    }),
    getCategorias: builder.query<Categoria[], void>({
      query: () => 'categorias',
      transformResponse: (response: PaginatedResponse<Categoria> | Categoria[]) =>
        resolveCollection(response),
      providesTags: ['Categorias'],
    }),
    getPrestadores: builder.query<PrestadorServico[], void>({
      query: () => ({
        url: 'prestadores',
        params: { page_size: 50 },
      }),
      transformResponse: (response: PaginatedResponse<PrestadorServico> | PrestadorServico[]) =>
        resolveCollection(response),
      providesTags: ['Prestadores'],
    }),
    getServicos: builder.query<Servico[], string | void>({
      query: (prestadorId) =>
        prestadorId ? `prestadores/${prestadorId}/servicos` : 'servicos',
      transformResponse: (response: PaginatedResponse<Servico> | Servico[]) =>
        resolveCollection(response),
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
