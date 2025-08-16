
'use client';

import { useEffect } from 'react';

// Tipagem dos dados esperados pelo componente
interface SubmissionData {
  name: string;
  email: string;
  phone: string;
  cityState: string;
  company: string;
  instagram: string;
  segment: string;
  monthlyBilling: string;
  marketingExperience: string;
  mainChallenge: string;
  urgency: string;
  willInvest: string;
  [key: string]: any; // Permite outras propriedades
}

interface Props {
  data: SubmissionData;
  onConversion: () => void;
}

export function RdStationIntegration({ data, onConversion }: Props) {
  useEffect(() => {
    if (!data) return;

    const conversionIdentifier = 'form-ferramenta-contato-site-cp-f840bb662d9ce9115499';
    const rdStationToken = '51ed25b3ebd3700717ab2be8cc7015b7';

    // Agrupando as informações de qualificação em um único campo de texto
    const qualificationDetails = `
--- QUALIFICAÇÃO DO LEAD ---
Faturamento Mensal: ${data.monthlyBilling}
Experiência com Marketing: ${data.marketingExperience}
Principal Desafio: ${data.mainChallenge}
Urgência para Solução: ${data.urgency}
Disposto(a) a investir: ${data.willInvest}
Cidade/Estado: ${data.cityState}
Segmento: ${data.segment}
Empresa: ${data.company}
    `.trim();


    // Mapeamento preciso e completo dos campos do formulário para os nomes de campo do RD Station
    const payload = {
        'conversion_identifier': conversionIdentifier,
        'name': data.name,
        'email': data.email,
        'mobile_phone': data.phone,
        'company': data.company,
        'cf_instagram': data.instagram,
        'cf_detalhes_do_lead': qualificationDetails, // Campo único com todos os detalhes
    };
    
    const requestBody = {
      "event_type": "CONVERSION",
      "event_family":"CDP",
      "payload": payload
    };

    // Função para enviar os dados para a API do RD Station
    const sendToRdStation = async () => {
      try {
        const response = await fetch(`https://api.rd.services/platform/conversions?api_key=${rdStationToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          console.log('Lead enviado com sucesso para o RD Station!');
          onConversion(); // Chama a função de callback para indicar sucesso
        } else {
          const errorData = await response.json();
          console.error('Erro ao enviar lead para o RD Station:', errorData);
          // Mesmo com erro, chama onConversion para não travar o usuário
          onConversion();
        }
      } catch (error) {
        console.error('Erro de rede ao tentar enviar lead para o RD Station:', error);
        // Mesmo com erro, chama onConversion para não travar o usuário
        onConversion();
      }
    };

    sendToRdStation();

  }, [data, onConversion]);

  // Este componente não renderiza nada na tela
  return null;
}
