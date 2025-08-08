
'use client';

import { ReelScriptGenerator } from '@/components/reel-script-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReelScriptWriterPage() {
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
                Roteirista de Reels com IA
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha um tema, defina seu nicho e gere um roteiro de 15 segundos pronto para gravar.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <ReelScriptGenerator />
      </div>
    </main>
  );
}
