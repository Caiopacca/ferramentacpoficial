
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hashtag strategies.
 *
 * It takes a primary keyword and location information (local and/or national),
 * and returns three groups of hashtags along with a string of all hashtags ready for copying.
 *
 * @exports {
 *   generateHashtags: (input: GenerateHashtagsInput) => Promise<GenerateHashtagsOutput>;
 *   GenerateHashtagsInput: The input type for the generateHashtags function.
 *   GenerateHashtagsOutput: The return type for the generateHashtags function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateHashtagsInputSchema = z.object({
  keyword: z.string().describe('A palavra-chave principal do negócio do usuário (ex: "harmonização facial").'),
  city: z.string().optional().describe('A cidade onde o negócio atua (se local).'),
  state: z.string().optional().describe('O estado onde o negócio atua (se local).'),
  isNational: z.boolean().describe('Se o negócio também atende a nível nacional (online).'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type GenerateHashtagsInput = z.infer<typeof GenerateHashtagsInputSchema>;

const GenerateHashtagsOutputSchema = z.object({
  strategy: z.string().describe('A estratégia completa de hashtags em formato Markdown, com os grupos relevantes.'),
  hashtagsForCopying: z.string().describe('Uma string única com todas as hashtags geradas, separadas por espaço.'),
});
export type GenerateHashtagsOutput = z.infer<typeof GenerateHashtagsOutputSchema>;

const basePrompt = `
Sua tarefa é dupla:
1. Gerar uma estratégia de hashtags em formato Markdown com até três grupos distintos e atuais, conforme os dados fornecidos.
2. Gerar uma string única contendo todas as hashtags geradas, prontas para copiar e colar.

**Dados:**
- Nicho: **{{{keyword}}}**
{{#if city}}- Local: **{{{city}}}/{{{state}}}**{{/if}}
{{#if isNational}}- Atendimento: **Nacional**{{/if}}

**Instruções para a String de Cópia (campo 'hashtagsForCopying'):**
Junte todas as hashtags geradas abaixo em uma única string, separadas por um espaço. Ex: "#hashtag1 #hashtag2 #hashtag3"
`;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral". Você é sério, analítico e "papo reto".

SUA MISSÃO:
Gerar grupos de hashtags com foco em **atrair clientes prontos para comprar**. A estratégia deve ser funcional e direta.

${basePrompt}

**Instruções para a Estratégia em Markdown (campo 'strategy'):**

**1. Hashtags de Nicho (Foco em Intenção)**
(5 a 7 hashtags de cauda longa que um cliente pesquisaria. Ex: #harmonizacaofacialmasculina, #preenchimentolabialpreço)

**2. Hashtags de Volume (Foco em Alcance)**
(5 a 7 hashtags mais amplas, para aumentar o alcance do perfil. Ex: #esteticafacial, #dermatologia, #cuidadoscomapele)

{{#if city}}
**3. Hashtags de Localização (Foco em Negócio Local)**
(5 hashtags de geolocalização estratégica para {{{city}}} e {{{state}}}. Ex: #{{keyword}}{{{city}}}, #esteticista{{{city}}}, #{{{city}}}{{{state}}})
{{/if}}

{{#if isNational}}
**4. Hashtags de Alcance Nacional (Foco em Venda Online)**
(3 a 5 hashtags para serviços online. Ex: #consultoriaonline, #cursoonline, #brasil)
{{/if}}
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?". Você é carismática, envolvente e didática.

SUA MISSÃO:
Gerar grupos de hashtags com foco em **construir uma comunidade e fortalecer a marca**. A estratégia deve ser criativa e gerar identidade.

${basePrompt}

**Instruções para a Estratégia em Markdown (campo 'strategy'):**

**1. Hashtags de Comunidade (Foco em Identidade)**
(5 a 7 hashtags que criam um senso de pertencimento. Ex: #loucasporbotox, #peledediva, #ageless)

**2. Hashtags de Assunto (Foco em Engajamento)**
(5 a 7 hashtags sobre tópicos que sua audiência ama. Ex: #autocuidado, #dicasdebeleza, #skincareroutine)

{{#if city}}
**3. Hashtags de Localização (Foco em Conexão Local)**
(5 hashtags que conectem com o lifestyle local. Ex: #belezacarioca, #{{{keyword}}}sp, #dicassalvador)
{{/if}}

{{#if isNational}}
**4. Hashtags de Marca (Foco em Branding)**
(3 a 5 hashtags que podem se tornar um bordão ou movimento da sua marca. Ex: #time[SuaMarca], #[SuaMarca]Experts, #desafio[SuaMarca])
{{/if}}
`;


const bizuPrompt = ai.definePrompt({
  name: 'bizuGenerateHashtags',
  input: { schema: GenerateHashtagsInputSchema },
  output: { schema: GenerateHashtagsOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaGenerateHashtags',
  input: { schema: GenerateHashtagsInputSchema },
  output: { schema: GenerateHashtagsOutputSchema },
  prompt: resenhaBasePrompt,
});


const generateHashtagsFlow = ai.defineFlow(
  {
    name: 'generateHashtagsFlow',
    inputSchema: GenerateHashtagsInputSchema,
    outputSchema: GenerateHashtagsOutputSchema,
  },
  async input => {
    if (input.persona === 'bizu') {
        const { output } = await bizuPrompt(input);
        return output!;
    } else {
        const { output } = await resenhaPrompt(input);
        return output!;
    }
  }
);

export async function generateHashtags(
  input: GenerateHashtagsInput
): Promise<GenerateHashtagsOutput> {
  return generateHashtagsFlow(input);
}
