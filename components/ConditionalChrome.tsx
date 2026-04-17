'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import StickyMobileCartButton from './StickyMobileCartButton';

export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio')) return <>{children}</>;
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <StickyMobileCartButton />
      <Footer />
    </>
  );
}
