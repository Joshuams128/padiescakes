import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import StickyMobileCartButton from '@/components/StickyMobileCartButton';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "Padie's Cakes - Handcrafted Cupcake Bouquets & Custom Cakes",
  description: 'Discover beautiful cupcake bouquets, custom cakes, and sweet treats for all occasions. Wedding, birthday, and corporate orders welcome.',
  metadataBase: new URL('https://padiescakes.ca'),
  openGraph: {
    title: "Padie's Cakes - Handcrafted Cupcake Bouquets & Custom Cakes",
    description: 'Discover beautiful cupcake bouquets, custom cakes, and sweet treats for all occasions.',
    url: 'https://padiescakes.ca',
    siteName: "Padie's Cakes",
    images: [
      {
        url: '/images/padiescakes.logo1.png',
        width: 800,
        height: 600,
        alt: "Padie's Cakes Logo",
      },
    ],
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Padie's Cakes - Handcrafted Cupcake Bouquets & Custom Cakes",
    description: 'Discover beautiful cupcake bouquets, custom cakes, and sweet treats for all occasions.',
    images: ['/images/padiescakes.logo1.png'],
  },
  icons: {
    icon: '/images/padiescakes.logo1.png',
    apple: '/images/padiescakes.logo1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <StickyMobileCartButton />
          <Footer />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
