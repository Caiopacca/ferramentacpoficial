
'use client';

import { EmailSubjectGenerator } from '@/components/email-subject-generator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function EmailSubjectGeneratorPage() {
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
            <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                Gerador de Assuntos que Abrem Portas
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Gere 5 opções de títulos de e-mail curtos e persuasivos para sua prospecção.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <EmailSubjectGenerator />
      </div>
    </main>
  );
}
