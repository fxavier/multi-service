'use client';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id?: string | number;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginPayload {
  token: string;
  user: AuthUser | null;
  raw?: unknown;
}

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  hasHydrated: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const TOKEN_ENDPOINT =
  process.env.NEXT_PUBLIC_AUTH_TOKEN_ENDPOINT || `${API_BASE_URL.replace(/\/$/, '')}/auth/token`;
const PROFILE_ENDPOINT =
  process.env.NEXT_PUBLIC_AUTH_PROFILE_ENDPOINT || `${API_BASE_URL.replace(/\/$/, '')}/auth/me`;

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
  hasHydrated: false,
};

function extractToken(data: Record<string, any>): string | null {
  if (!data || typeof data !== 'object') return null;
  return (
    data.token ||
    data.access_token ||
    data.access ||
    data.jwt ||
    data.key ||
    null
  );
}

async function fetchProfile(token: string): Promise<AuthUser | null> {
  if (!PROFILE_ENDPOINT) return null;

  try {
    const response = await fetch(PROFILE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data && typeof data === 'object') {
      if ('user' in data && typeof (data as any).user === 'object') {
        return (data as any).user as AuthUser;
      }
      return data as AuthUser;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário', error);
    return null;
  }
}

export const login = createAsyncThunk<LoginPayload, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let message = 'Credenciais inválidas. Verifique e tente novamente.';
        try {
          const errorData = await response.json();
          const errorMessage =
            errorData?.detail ||
            errorData?.message ||
            errorData?.error ||
            (Array.isArray(errorData?.errors) ? errorData.errors.join(', ') : undefined);
          if (errorMessage) {
            message = errorMessage;
          }
        } catch (error) {
          // Ignorar erros ao ler a resposta de erro
        }
        return rejectWithValue(message);
      }

      const data = (await response.json()) as Record<string, any>;
      const token = extractToken(data);

      if (!token) {
        return rejectWithValue('A resposta do servidor não contém um token válido.');
      }

      let user: AuthUser | null = null;

      if (data.user && typeof data.user === 'object') {
        user = data.user as AuthUser;
      } else if (data.profile && typeof data.profile === 'object') {
        user = data.profile as AuthUser;
      } else {
        user = await fetchProfile(token);
      }

      return { token, user, raw: data };
    } catch (error) {
      console.error('Erro durante o processo de login', error);
      return rejectWithValue('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      state.hasHydrated = true;
    },
    hydrate(state, action: PayloadAction<Pick<AuthState, 'token' | 'user'>>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = action.payload.token ? 'succeeded' : 'idle';
      state.error = null;
      state.hasHydrated = true;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.hasHydrated = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        state.hasHydrated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Não foi possível realizar o login.';
        state.hasHydrated = true;
      });
  },
});

export const { logout, hydrate, setUser } = authSlice.actions;

export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => Boolean(state.auth.token);
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;

export default authSlice.reducer;
