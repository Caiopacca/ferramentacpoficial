
'use client';

import { HashtagStrategist } from '@/components/hashtag-strategist';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CtaSection } from '@/components/cta-section';

export default function HashtagStrategistPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Ferramentas
            </Button>
          </Link>
        </div>
        <header className="text-center mb-8 md:mb-12">
            <Image src="https://res.cloudinary.com/dp3gukavt/image/upload/v1759844468/Prancheta_1_1_rxjl52.png" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                O Hashtag Mestre
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Insira sua palavra-chave principal e receba 3 grupos de hashtags prontos para usar.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <div className="text-center mt-8 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Escolha seu especialista</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
                O Bizu e a Resenha são estrategistas de marketing, cariocas da gema, prontos para te ajudar. Prefere um papo reto e estratégico? Vá de Bizu. Quer uma ideia mais criativa e magnética? a Resenha resolve.
            </p>
        </div>
        <HashtagStrategist />
        <CtaSection />
      </div>
    </main>
  );
}
