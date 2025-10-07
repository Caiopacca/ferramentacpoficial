
'use client';

import { RoiCalculator } from '@/components/roi-calculator';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CtaSection } from '@/components/cta-section';

export default function RoiCalculatorPage() {
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
                Calculadora de Retorno sobre Marketing
            </h1>
          </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Calcule o potencial de lucro dos seus investimentos em anúncios com base no seu ticket médio e metas.
          </p>
           <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>
        <RoiCalculator />
        <CtaSection />
      </div>
    </main>
  );
}
