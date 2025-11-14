'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectAuthState } from '@/store/slices/authSlice';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
}

function normalizeRole(role?: unknown): string | null {
  if (!role) return null;
  if (typeof role === 'string') return role.toLowerCase();
  if (typeof role === 'number') return String(role);
  return null;
}

export default function RequireAuth({
  children,
  allowedRoles,
  fallback,
}: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token, user, status, hasHydrated } = useAppSelector(selectAuthState);

  const redirectTarget = searchParams?.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const isAuthenticated = Boolean(token);
  const normalizedAllowedRoles = allowedRoles?.map((role) => role.toLowerCase());
  const userRole = normalizeRole(user?.role || (user as Record<string, unknown> | undefined)?.['type']);
  const hasRequiredRole =
    !normalizedAllowedRoles || normalizedAllowedRoles.length === 0
      ? true
      : !!(userRole && normalizedAllowedRoles.includes(userRole));
  const isAuthorized = isAuthenticated && hasRequiredRole;

  useEffect(() => {
    if (!hasHydrated || status === 'loading') {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }

    if (!hasRequiredRole) {
      router.replace('/');
    }
  }, [hasHydrated, hasRequiredRole, isAuthenticated, redirectTarget, router, status]);

  if (!isAuthorized || !hasHydrated) {
    return (
      fallback ?? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )
    );
  }

  return <>{children}</>;
}
