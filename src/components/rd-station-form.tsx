
'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export function RdStationForm() {
  const router = useRouter();

  useEffect(() => {
    const handleConversion = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.form_id === 'form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6') {
        router.push('/tools');
      }
    };

    const scriptId = 'rdstation-forms-script';
    const formId = 'form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6';
    const formContainer = document.getElementById(formId);

    const initializeForm = () => {
      // @ts-ignore
      if (window.RDStationForms) {
        // @ts-ignore
        new window.RDStationForms(formId, 'null').createForm();
      }
    };

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
      script.async = true;
      script.onload = initializeForm;
      document.body.appendChild(script);
    } else {
        // If script already exists, just initialize the form
        initializeForm();
    }

    window.addEventListener('submit_form_success', handleConversion);

    return () => {
      window.removeEventListener('submit_form_success', handleConversion);
       if (script && script.parentElement && formContainer) {
         // Clean up to avoid issues with Next.js HMR
         const allRdstationScripts = document.querySelectorAll(`script[src*="rdstation-forms"]`);
         allRdstationScripts.forEach(s => s.remove());
      }
    };
  }, [router]);


  return (
    <>
      <div role="main" id="form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6"></div>
    </>
  );
}
