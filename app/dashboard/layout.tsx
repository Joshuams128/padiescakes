import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { authOptions } from '@/lib/auth';
import SessionProviderClient from './SessionProviderClient';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const pathname = h.get('x-pathname') || '';
  const isLoginPath = pathname === '/dashboard/login';

  if (!isLoginPath) {
    const session = await getServerSession(authOptions);
    if (!session) {
      redirect('/dashboard/login');
    }
  }

  return <SessionProviderClient>{children}</SessionProviderClient>;
}
