import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'On Mange Où?! - Battle Edition',
  description: 'Le jeu de mini-games pour décider où manger entre amis!',
  keywords: 'restaurant, jeu, amis, food, game, party',
  openGraph: {
    title: 'On Mange Où?! - Battle Edition',
    description: 'Le jeu de mini-games pour décider où manger entre amis!',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'On Mange Où?! Battle Edition'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'On Mange Où?! - Battle Edition',
    description: 'Le jeu de mini-games pour décider où manger entre amis!',
    images: ['/og-image.jpg']
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  robots: 'index, follow',
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}