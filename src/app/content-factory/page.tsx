
'use client';

import { ContentGenerator } from '@/components/content-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CtaSection } from '@/components/cta-section';

export default function ContentFactoryPage() {
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
            <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                Fábrica de Conteúdo CP Marketing
            </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto whitespace-nowrap">
            Selecione seu nicho e objetivo para receber 7 dias de ideias de posts geradas por nossa IA.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80 mx-auto">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <ContentGenerator />
        <CtaSection />
      </div>
    </main>
  );
}
