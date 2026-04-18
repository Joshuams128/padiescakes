'use client';

import { useSession } from 'next-auth/react';

export function useDashboardToken() {
  const { data, status } = useSession();
  return {
    token: data?.dashboardToken ?? '',
    status,
    authenticated: status === 'authenticated',
    loading: status === 'loading',
  };
}
