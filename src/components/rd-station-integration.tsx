
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
  password?: string; // Senha não será enviada
  [key: string]: any; 
}

interface Props {
  data: SubmissionData;
  onConversion: () => void;
}

export function RdStationIntegration({ data, onConversion }: Props) {
  useEffect(() => {
    if (!data) return;

    const rdStationToken = '51ed25b3ebd3700717ab2be8cc7015b7';
    const conversionIdentifier = 'form-ferramenta-contato-site-cp-f840bb662d9ce9115499';

    // Mapeamento preciso campo a campo para o payload da API do RD Station
    const payload = {
      'conversion_identifier': conversionIdentifier,
      'name': data.name,
      'email': data.email,
      'mobile_phone': data.phone,
      'company': data.company,
      'cf_instagram': data.instagram,
      'cf_cidade_e_estado': data.cityState,
      'cf_qual_o_segmento_da_sua_empresa': data.segment,
      'cf_quanto_a_sua_empresa_fatura_por_mes': data.monthlyBilling,
      'cf_ja_contou_com_o_trabalho_de_algum_profissional_de_marketing': data.marketingExperience,
      'cf_qual_seu_principal_desafio_com_o_marketing_da_sua_empresa': data.mainChallenge,
      'cf_qual_a_urgencia_para_solucionar_esse_desafio': data.urgency,
      'cf_voce_esta_disposto_a_investir_no_marketing_da_sua_empresa': data.willInvest,
    };
    
    // Estrutura do corpo da requisição para a API v2
    const requestBody = {
      "event_type": "CONVERSION",
      "event_family":"CDP",
      "payload": payload
    };

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
        } else {
          const errorData = await response.json();
          console.error('Erro ao enviar lead para o RD Station:', errorData);
        }
      } catch (error) {
        console.error('Erro de rede ao tentar enviar lead para o RD Station:', error);
      } finally {
        onConversion(); 
      }
    };

    sendToRdStation();

  }, [data, onConversion]);

  return null;
}
