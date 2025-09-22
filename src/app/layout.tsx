import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Linkly',
    default: 'Linkly - Raccourcisseur de liens gratuit et sécurisé'
  },
  description: 'Linkly est un raccourcisseur de liens gratuit avec analytics, QR codes, liens personnalisés et statistiques détaillées. Créez des liens courts facilement.',
  keywords: [
    'raccourcisseur de liens',
    'URL courte',
    'analytics',
    'QR code',
    'statistiques',
    'liens personnalisés',
    'tracking',
    'métriques'
  ],
  authors: [{ name: 'Linkly' }],
  creator: 'Linkly',
  publisher: 'Linkly',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://linkly.serverarthur.duckdns.org',
    siteName: 'Linkly',
    title: 'Linkly - Raccourcisseur de liens gratuit et sécurisé',
    description: 'Créez des liens courts avec analytics avancés, QR codes et statistiques détaillées.',
    images: [
      {
        url: 'https://linkly.serverarthur.duckdns.org/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Linkly - Raccourcisseur de liens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linkly - Raccourcisseur de liens gratuit',
    description: 'Créez des liens courts avec analytics avancés et QR codes.',
    images: ['https://linkly.serverarthur.duckdns.org/og-image.png'],
  },
  metadataBase: new URL('https://linkly.serverarthur.duckdns.org'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://linkly.serverarthur.duckdns.org" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Préconnexions pour améliorer les performances */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.qrserver.com" />
        
        {/* Ressources critiques */}
        <link rel="preload" href="/next.svg" as="image" />
        
        {/* Optimisations viewport */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
