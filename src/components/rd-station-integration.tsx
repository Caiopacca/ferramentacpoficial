
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

    // A API Key pública (token) e o identificador do formulário
    const rdStationToken = '51ed25b3ebd3700717ab2be8cc7015b7';
    const conversionIdentifier = 'form-ferramenta-contato-site-cp-f840bb662d9ce9115499';

    // Agrupando todas as informações de qualificação em um único campo de texto
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
    `.trim().replace(/^\s+/gm, ''); // Remove espaços extras e linhas em branco no início

    // Mapeamento dos campos para o payload da API do RD Station
    const payload = {
      'conversion_identifier': conversionIdentifier,
      'name': data.name,
      'email': data.email,
      'mobile_phone': data.phone, // Campo padrão para telefone
      'cf_instagram': data.instagram, // Campo personalizado para Instagram
      'cf_detalhes_do_lead': qualificationDetails, // Campo único com todos os outros detalhes
    };
    
    // Estrutura do corpo da requisição para a API v2
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
        } else {
          const errorData = await response.json();
          console.error('Erro ao enviar lead para o RD Station:', errorData);
        }
      } catch (error) {
        console.error('Erro de rede ao tentar enviar lead para o RD Station:', error);
      } finally {
        onConversion(); // Chama a função de callback para continuar o fluxo do usuário
      }
    };

    sendToRdStation();

  }, [data, onConversion]);

  // Este componente não renderiza nada na tela
  return null;
}
