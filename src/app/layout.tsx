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
        url: 'https://res.cloudinary.com/dp3gukavt/image/upload/v1759844468/Prancheta_1_1_rxjl52.png',
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
        <link rel="icon" href="https://res.cloudinary.com/dp3gukavt/image/upload/v1759844468/Prancheta_1_1_rxjl52.png" sizes="any" />
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
