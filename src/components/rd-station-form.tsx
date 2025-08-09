
'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export function RdStationForm() {
  const router = useRouter();
  const formId = 'form-isca-ferramentas-gratuitas-3d422f4cbcae3b0a8fe6';

  useEffect(() => {
    const handleConversion = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.form_id === formId) {
        router.push('/tools');
      }
    };

    window.addEventListener('submit_form_success', handleConversion);

    return () => {
      window.removeEventListener('submit_form_success', handleConversion);
    };
  }, [router]);

  const initializeForm = () => {
    // @ts-ignore
    if (window.RDStationForms) {
      // @ts-ignore
      new window.RDStationForms(formId, 'null').createForm();
    }
  };

  return (
    <>
      <div role="main" id={formId}></div>
      <Script
        id="rdstation-forms-script"
        src="https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js"
        strategy="afterInteractive"
        onLoad={initializeForm}
      />
    </>
  );
}
