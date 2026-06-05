import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import IntroScreen from '@/components/shared/IntroScreen';
import LiveTicker from '@/components/shared/LiveTicker';
import AuroraBackground from '@/components/shared/AuroraBackground';

export const metadata: Metadata = {
  title: 'NAKA GO 中号 | The Shiba Who Saved His Breed',
  description:
    'Born 1948. Survived WWII. Became the genetic foundation of 80% of modern Shiba Inus. The $NAKA token honors the real historical legacy of Naka Go of Akaishi-so.',
  openGraph: {
    title: 'NAKA GO 中号 | The Shiba Who Saved His Breed',
    description: 'Born 1948. Survived WWII. Became the genetic foundation of 80% of modern Shiba Inus.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Permanent+Marker&family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@400;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
        <AuroraBackground />
        <Providers>
          <IntroScreen />
          <LiveTicker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
