import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Multiview Racing',
  description: 'Premium Multi-View Racing Experience. Watch multiple racing streams simultaneously.',
  metadataBase: new URL(process.env.APP_URL || 'http://localhost:3000'),
  manifest: '/manifest.json',
  openGraph: {
    title: 'Multiview Racing | Ao Vivo',
    description: 'Acompanhe a transmissão principal junto com as câmeras onboard dos pilotos. Uma experiência premium diretamente no seu navegador.',
    url: '/',
    siteName: 'Multiview Racing',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541460394336-db2f1c841fbe?auto=format&fit=crop&q=80&w=1200&h=630',
        width: 1200,
        height: 630,
        alt: 'Multiview Racing - Transmissão Premium',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multiview Racing | Ao Vivo',
    description: 'Acompanhe a transmissão principal junto com as câmeras onboard dos pilotos.',
    images: ['https://images.unsplash.com/photo-1541460394336-db2f1c841fbe?auto=format&fit=crop&q=80&w=1200&h=630'],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cstyle%3E@keyframes s%7B100%25%7Btransform:rotate(360deg)%7D%7D.w%7Btransform-origin:50px 50px;animation:s 1.5s linear infinite%7D%3C/style%3E%3Cg class='w'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23111' stroke='%23e11d48' stroke-width='6'/%3E%3Ccircle cx='50' cy='50' r='15' fill='%23e11d48'/%3E%3Cpath d='M50 15v20m0 30v20M15 50h20m30 0h20M25.3 25.3l14.1 14.1m21.2 21.2l14.1 14.1M25.3 74.7l14.1-14.1m21.2-21.2l14.1-14.1' stroke='%23555' stroke-width='5'/%3E%3C/g%3E%3C/svg%3E",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Multiview Racing',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans bg-neutral-950 text-neutral-50 antialiased min-h-screen selection:bg-red-500/30">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
