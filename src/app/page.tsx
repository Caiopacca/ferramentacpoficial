
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RdStationForm } from '@/components/rd-station-form';

export default function CapturePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-lg text-center">
        <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
        <div className="flex justify-center items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Acesse nossas ferramentas exclusivas
            </h1>
        </div>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          Preencha o formulário para ter acesso às nossas ferramentas de marketing com IA.
        </p>
        <div className="mt-8 border border-dashed border-border rounded-lg p-8 bg-card">
          <RdStationForm />
        </div>
      </div>
    </main>
  );
}
