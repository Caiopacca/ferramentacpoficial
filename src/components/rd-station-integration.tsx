
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

    // Mapeamento dos campos do formulário para os nomes de campo do RD Station
    const payload = [
        { name: 'name', value: data.name },
        { name: 'email', value: data.email },
        { name: 'telefone', value: data.phone },
        { name: 'cidade_estado', value: data.cityState },
        { name: 'empresa', value: data.company },
        { name: 'instagram', value: data.instagram },
        { name: 'segmento', value: data.segment },
        { name: 'faturamento_mensal', value: data.monthlyBilling },
        { name: 'experiencia_marketing', value: data.marketingExperience },
        { name: 'principal_desafio', value: data.mainChallenge },
        { name: 'urgencia', value: data.urgency },
        { name: 'disposto_a_investir', value: data.willInvest },
    ];

    // Função para enviar os dados para a API do RD Station
    const sendToRdStation = async () => {
      try {
        const response = await fetch(`https://api.rd.services/platform/forms/${conversionIdentifier}/rich_payload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            token_rdstation: rdStationToken,
            payload: payload
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
