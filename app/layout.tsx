import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import AuroraBackground from '@/components/shared/AuroraBackground';
import NavBar from '@/components/shared/NavBar';
import IntroScreen from '@/components/shared/IntroScreen';
import WordLineageFooter from '@/components/shared/WordLineageFooter';

export const metadata: Metadata = {
  title: 'NAKA GO 中号 | The Shiba Who Saved The Breed',
  description:
    'Born 1948. Guardian of the breed — his bloodline still runs through 80% of modern Shiba Inus. The $NAKA token honors the real historical legacy of Naka Go of Akaishi-so.',
  openGraph: {
    title: 'NAKA GO 中号 | The Shiba Who Saved The Breed',
    description: 'Born 1948. Guardian of the breed — his bloodline still runs through 80% of modern Shiba Inus.',
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
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Serif+JP:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased overflow-x-hidden">
        <AuroraBackground />
        <Providers>
          <IntroScreen />
          <NavBar />
          {children}
          <WordLineageFooter />
        </Providers>
      </body>
    </html>
  );
}
