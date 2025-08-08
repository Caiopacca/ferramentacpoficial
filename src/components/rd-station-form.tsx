
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Button } from './ui/button';
import Link from 'next/link';

export function RdStationForm() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Handler to process the conversion event from RD Station
    const handleConversion = (event: Event) => {
      // The event is a CustomEvent, and the form_id is in the detail property.
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.form_id === 'form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6') {
        setIsFormSubmitted(true);
      }
    };

    // We add the listener to the window object to capture the event dispatched by the RD Station script.
    window.addEventListener('submit_form_success', handleConversion);

    // Cleanup function to remove the listener when the component unmounts.
    return () => {
      window.removeEventListener('submit_form_success', handleConversion);
    };
  }, []);

  useEffect(() => {
    // This effect runs when the script is loaded.
    // It checks if the RD Station Forms object is available and creates the form.
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
                onLoad={() => setIsScriptLoaded(true)}
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
