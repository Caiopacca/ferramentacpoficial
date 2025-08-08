
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from './ui/button';
import Link from 'next/link';

export function RdStationForm() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const handleConversion = (event: any) => {
      // The RD Station script dispatches a 'submit_form_success' event on the window object.
      // The event 'detail' contains the form_id.
      // We check if it's the correct form before unlocking the button.
      if (event.detail.form_id === 'form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6') {
        setIsFormSubmitted(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (isScriptLoaded && document.getElementById('form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6')) {
        // @ts-ignore
        if (window.RDStationForms) {
            // @ts-ignore
            new window.RDStationForms('form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6', 'null').createForm();
        }
    }
  }, [isScriptLoaded]);


  return (
    <>
      {!isFormSubmitted ? (
        <>
            <div role="main" id="form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6"></div>
            <Script
                id="rdstation-forms-script"
                strategy="afterInteractive"
                src="https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"
                onLoad={() => {
                  if (document.getElementById('form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6')) {
                    // @ts-ignore
                    new window.RDStationForms('form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6', 'null').createForm();
                  }
                }}
            />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
            <h2 className="text-2xl font-bold text-primary">Obrigado!</h2>
            <p className="text-muted-foreground text-center">Seu acesso está liberado. Clique no botão abaixo para explorar as ferramentas.</p>
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
