import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import TrustBar from '@/components/TrustBar';
import StickyMobileCartButton from '@/components/StickyMobileCartButton';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Padiescakes - Handcrafted Cupcake Bouquets & Custom Cakes',
  description: 'Discover beautiful cupcake bouquets, custom cakes, and sweet treats for all occasions. Wedding, birthday, and corporate orders welcome.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <TrustBar />
        <main className="min-h-screen">
          {children}
        </main>
        <StickyMobileCartButton />
        <Footer />
      </body>
    </html>
  );
}
