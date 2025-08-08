
'use client';

import { ProfileAnalyzer } from '@/components/profile-analyzer';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfileAnalyzerPage() {
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
          <Logo className="mx-auto" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mt-4">
            Analisador de Perfil com IA
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Insira seu @ do Instagram e receba um diagnóstico completo com nota e pontos de melhoria.
          </p>
        </header>
        <ProfileAnalyzer />
      </div>
    </main>
  );
}
