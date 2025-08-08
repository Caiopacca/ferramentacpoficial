
'use client';

import { ContentGenerator } from '@/components/content-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContentFactoryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <Link href="/tools" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Ferramentas
            </Button>
          </Link>
        </div>
        <header className="text-center mb-8 md:mb-12">
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                Fábrica de Conteúdo CP Marketing
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione seu nicho e objetivo para receber 7 dias de ideias de posts geradas por nossa Inteligência Artificial.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <ContentGenerator />
      </div>
    </main>
  );
}
