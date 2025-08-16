
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

    // Mapeamento dos campos do formulário para os nomes de campo do RD Station
    const mappedData: { [key: string]: any } = {
        'nome': data.name,
        'email': data.email,
        'telefone': data.phone,
        'cidade_estado': data.cityState,
        'empresa': data.company,
        'instagram': data.instagram,
        'segmento': data.segment,
        'faturamento_mensal': data.monthlyBilling,
        'experiencia_marketing': data.marketingExperience,
        'principal_desafio': data.mainChallenge,
        'urgencia': data.urgency,
        'disposto_a_investir': data.willInvest,
        'token_rdstation': '51ed25b3ebd3700717ab2be8cc7015b7',
        'identificador': 'form-ferramenta-contato-site-cp-f840bb662d9ce9115499' 
    };

    // Função para enviar os dados para a API do RD Station
    const sendToRdStation = async () => {
      try {
        const response = await fetch('https://api.rd.services/platform/conversions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'CONVERSION',
            event_family: 'CDP',
            payload: {
                conversion_identifier: 'form-ferramenta-contato-site-cp-f840bb662d9ce9115499',
                ...mappedData
            }
          })
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
