
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from './ui/button';
import Link from 'next/link';

export function RdStationForm() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === 'conversion' &&
        event.data.payload.formId === '3d422f4cbcae3b0a8fe6'
      ) {
        setIsFormSubmitted(true);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup do event listener quando o componente é desmontado
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      {!isFormSubmitted ? (
        <>
            <div role="main" id="form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6"></div>
            <Script
                id="rdstation-forms-script"
                src="https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"
                onLoad={() => {
                  // @ts-ignore
                  if (window.RDStationForms) {
                    // @ts-ignore
                    new window.RDStationForms('form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6', 'null').createForm();
                  }
                }}
            />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold text-primary">Obrigado!</h2>
            <p className="text-muted-foreground">Seu acesso está liberado. Clique no botão abaixo para explorar as ferramentas.</p>
            <Link href="/tools" passHref>
                <Button size="lg" className="mt-4">
                    Acessar Ferramentas
                </Button>
            </Link>
        </div>
      )}
    </>
  );
}
