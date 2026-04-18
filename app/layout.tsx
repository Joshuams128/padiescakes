import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import ConditionalChrome from '@/components/ConditionalChrome';
import { CartProvider } from '@/context/CartContext';
import { Analytics } from '@vercel/analytics/next';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <CartProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
