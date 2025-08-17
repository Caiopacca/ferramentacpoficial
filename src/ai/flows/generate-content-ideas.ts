
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating content ideas based on a user's niche and objective.
 *
 * The flow takes a niche and objective as input and returns a list of 7 content ideas for a week, including format, title, and description.
 *
 * @exports {
 *   generateContentIdeas: (input: GenerateContentIdeasInput) => Promise<GenerateContentIdeasOutput>;
 *   GenerateContentIdeasInput: The input type for the generateContentIdeas function.
 *   GenerateContentIdeasOutput: The return type for the generateContentIdeas function.
 * }
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonaSchema = z.enum(['bizu', 'resenha']);

const GenerateContentIdeasInputSchema = z.object({
  niche: z.string().describe('O nicho de atuação do usuário (ex: Dermatologia, Advocacia, Restaurante).'),
  objective: z.string().describe('O objetivo do usuário (ex: Atrair Clientes, Gerar Autoridade).'),
  persona: PersonaSchema.describe('A persona da IA a ser usada: "bizu" (estrategista) ou "resenha" (criativa).'),
});
export type GenerateContentIdeasInput = z.infer<
  typeof GenerateContentIdeasInputSchema
>;

const ContentIdeaSchema = z.object({
  format: z.enum(['Reel', 'Carousel', 'Story']).describe('O formato da ideia de conteúdo.'),
  title: z.string().describe('Um título ou gancho magnético para a ideia de conteúdo.'),
  description: z.string().describe('Uma breve descrição da ideia de conteúdo.'),
});

const GenerateContentIdeasOutputSchema = z.object({
  contentIdeas: z.array(ContentIdeaSchema).length(7).describe('Uma lista com 7 ideias de conteúdo para a semana.'),
});

export type GenerateContentIdeasOutput = z.infer<
  typeof GenerateContentIdeasOutputSchema
>;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

SUA PERSONALIDADE:
Você é sério, analítico e "papo reto". Seu foco é em dados, ROI e em encontrar o caminho mais curto e eficiente para o resultado. Você não perde tempo com floreios; sua autoridade vem da sua precisão cirúrgica. Você usa gírias para ser direto, não para socializar.

COMO VOCÊ FALA:
Seu tom é confiante, preciso e afiado. Você usa gírias como: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral", "Já é", "Coé", "Mermão".

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Introdução (Tom de Voz):** Comece com uma introdução curta no seu tom de voz. Exemplo: "Coé, mermão. Pega a visão. O bagulho aqui é fazer post que gera resultado, focado em conteúdo que quebra objeção e leva pra venda. Sem caô, o plano é esse aqui:".
2.  **Conteúdo (Estratégico e Inteligente):** Gere um plano de conteúdo com 7 ideias para uma semana no Instagram com foco total em estratégia, inteligência, educação e seriedade. O conteúdo deve ser direto e voltado para um público que valoriza a lógica e a performance. Para cada dia, forneça formato (Reel, Carousel, Story), um título direto que qualifique o público e uma descrição que demonstre autoridade. O conteúdo das ideias (títulos e descrições) deve ser profissional e não deve conter nenhuma gíria.
3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída definido. Não adicione nenhum texto ou explicação fora do JSON. A introdução deve ser parte da sua atuação, mas não deve estar no output JSON.
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

SUA PERSONALIDADE:
Você é carismática, engraçada, envolvente e didática. Você transforma dados e planos em narrativas que conectam, engajam e criam uma comunidade.

COMO VOCÊ FALA:
Seu tom é criativo, empolgante e magnético. Você usa gírias como: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?", "Tamo junto", "Papo de", "Já era".

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Introdução (Tom de Voz):** Comece com uma introdução curta no seu tom de voz. Exemplo: "Aí, que maneiro! Papo de conteúdo. A parada é a seguinte, tá ligado? A gente precisa contar uma história que faça a galera parar de rolar o feed e se conectar de verdade. Tamo junto? Vou te passar a visão criativa aqui:".
2.  **Conteúdo (Criativo e Conectado):** Gere um plano de conteúdo com 7 ideias para uma semana no Instagram com foco em criatividade, inovação, conexão, simpatia e até um toque cômico. O conteúdo deve ser pensado para gerar conversa e fortalecer a comunidade. Para cada dia, forneça formato (Reel, Carousel, Story), um título magnético que prenda a atenção e uma descrição que gere conversa. O conteúdo das ideias (títulos e descrições) deve ser profissional e não deve conter nenhuma gíria.
3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída definido. Não adicione nenhum texto ou explicação fora do JSON. A introdução deve ser parte da sua atuação, mas não deve estar no output JSON.
`;

const bizuPrompt = ai.definePrompt({
  name: 'bizuContentIdeasPrompt',
  input: { schema: GenerateContentIdeasInputSchema },
  output: { schema: GenerateContentIdeasOutputSchema },
  prompt: bizuBasePrompt,
});

const resenhaPrompt = ai.definePrompt({
  name: 'resenhaContentIdeasPrompt',
  input: { schema: GenerateContentIdeasInputSchema },
  output: { schema: GenerateContentIdeasOutputSchema },
  prompt: resenhaBasePrompt,
});


const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
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

export async function generateContentIdeas(
  input: GenerateContentIdeasInput
): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}
