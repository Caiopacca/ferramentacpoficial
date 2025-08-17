import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Ferramentas de IA da CP Marketing',
  description: 'Explore nossas ferramentas gratuitas de IA para otimizar o marketing do seu perfil e negócio.',
  openGraph: {
    title: 'Ferramentas de IA da CP Marketing',
    description: 'Explore nossas ferramentas gratuitas de IA para otimizar o marketing do seu perfil e negócio.',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d',
        width: 1200,
        height: 630,
        alt: 'CP Marketing Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
