
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function CapturePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-lg text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <Logo className="w-12 h-12" />
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
              Acesse nossas ferramentas exclusivas
            </h1>
        </div>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Preencha o formulário para ter acesso às nossas ferramentas de marketing com IA.
        </p>
        <div className="mt-8 border border-dashed border-border rounded-lg p-8 bg-card">
          <p className="text-muted-foreground">
            // Seu formulário do RD Station vai aqui.
            <br />
            // Por enquanto, use o botão abaixo para continuar.
          </p>
        </div>
        <Link href="/tools" passHref>
          <Button size="lg" className="mt-8">
            Acessar Ferramentas
          </Button>
        </Link>
      </div>
    </main>
  );
}
