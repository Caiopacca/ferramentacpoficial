
'use client';

import { CopyAnalyzer } from '@/components/copy-analyzer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CopyAnalyzerPage() {
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
            <Image src="/imagem/logo.png" alt="Logo CP Marketing" width={50} height={50} className="rounded-md" />
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                Detector de Legendas Vendedoras
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Cole a legenda do seu post e receba uma análise instantânea sobre o poder de persuasão do seu texto.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <CopyAnalyzer />
      </div>
    </main>
  );
}
