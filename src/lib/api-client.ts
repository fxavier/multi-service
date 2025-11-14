const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const TENANT_HEADER = 'X-Tenant-ID';
const DEFAULT_TENANT =
  process.env.NEXT_PUBLIC_TENANT_ID || process.env.NEXT_PUBLIC_TENANT_SLUG || 'lisboa';

interface ApiRequestOptions extends RequestInit {
  tenant?: string;
  skipTenantHeader?: boolean;
  params?: Record<string, string | number | boolean | undefined | null>;
}

class ApiError extends Error {
  constructor(public status: number, public errorMessage: string, public details?: unknown) {
    super(errorMessage);
    this.name = 'ApiError';
  }
}

async function apiRequest<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { tenant, skipTenantHeader, params, headers, ...fetchOptions } = options;

  const url = new URL(endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const mergedHeaders = new Headers({
    'Content-Type': 'application/json',
    ...headers,
  });

  const tenantValue = tenant ?? DEFAULT_TENANT;
  if (!skipTenantHeader && tenantValue) {
    mergedHeaders.set(TENANT_HEADER, tenantValue);
  }

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: mergedHeaders,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof payload === 'object' && payload !== null && 'message' in payload && payload.message) ||
        (typeof payload === 'object' && payload !== null && 'detail' in payload && payload.detail) ||
        (typeof payload === 'string' && payload.trim().length > 0 ? payload : null) ||
        response.statusText ||
        'API request failed';

      throw new ApiError(response.status, String(errorMessage), payload);
    }

    return (payload ?? null) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('API request error:', error);
    throw new ApiError(500, 'Network error or invalid response', error);
  }
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };
export type { ApiRequestOptions };
