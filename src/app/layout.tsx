import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'On Mange Où?! - Battle Edition',
  description: 'Le jeu de mini-games pour décider où manger entre amis!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 opacity-20">
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-full repeat">
              <g fill="none" fillRule="evenodd">
                <g fill="#9C92AC" fillOpacity="0.03">
                  <circle cx="30" cy="30" r="4"/>
                </g>
              </g>
            </svg>
          </div>
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}