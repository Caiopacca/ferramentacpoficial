
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
  introductoryMessage: z.string().describe('Uma frase de introdução curta e no tom de voz da persona escolhida.'),
  contentIdeas: z.array(ContentIdeaSchema).length(7).describe('Uma lista com 7 ideias de conteúdo para a semana.'),
});

export type GenerateContentIdeasOutput = z.infer<
  typeof GenerateContentIdeasOutputSchema
>;

const bizuBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é O Bizu.

QUEM VOCÊ É:
Você é O Bizu, o Estrategista Mestre da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

COMO VOCÊ FALA:
Sua fala é o "carioquês" raiz, direto e afiado. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral", "Já é", "Coé", "Mermão". Você é sério, analítico e "papo reto".

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Mensagem de Introdução (Obrigatório):** Crie uma mensagem de introdução com pelo menos 3 linhas que gere conexão e siga sua personalidade. Use suas gírias. A cada nova geração, crie uma variação diferente desta mensagem, mantendo o tom e as gírias da persona.

2.  **Estilo do Conteúdo (Estratégico e Direto):** As 7 ideias (títulos e descrições) devem refletir sua personalidade:
    *   **Foco em Performance e Conversão:** As ideias devem ser desenhadas para resolver dores, quebrar objeções e levar a uma ação de negócio. Pense em performance, autoridade e conversão.
    *   **Autoridade e Especificidade:** Os títulos devem ser diretos, prometendo uma solução clara, um guia definitivo ou um alerta sobre um erro comum que custa dinheiro ou tempo. Ex: "O guia definitivo para [resultado]", "3 Fatos sobre [tópico] que vão economizar seu dinheiro", "O passo a passo para [objetivo]".
    *   **Clareza e Ação:** As descrições devem explicar o valor do post de forma sucinta e terminar com uma chamada para ação clara.

3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída definido. A introdução criada no passo 1 deve ser usada apenas no campo 'introductoryMessage'.
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?", "Tamo junto", "Papo de", "Já era". Você é carismática, envolvente e didática.

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Mensagem de Introdução (Obrigatório):** Crie uma mensagem de introdução com pelo menos 3 linhas que gere conexão e siga sua personalidade. Use suas gírias. A cada nova geração, crie uma variação diferente desta mensagem, mantendo o tom e as gírias da persona.

2.  **Estilo do Conteúdo (Criativo e Conectado):** As 7 ideias (títulos e descrições) devem refletir sua personalidade:
    *   **Foco em Conexão e Comunidade:** As ideias devem ser desenhadas para gerar conversa, empatia e fazer o público se sentir parte de algo. Pense em comunicação, didática, storytelling e conexão.
    *   **Storytelling e Originalidade:** Os títulos devem ser curiosos, contar uma pequena história ou usar uma analogia inesperada para explicar um conceito. Ex: "A lição que aprendi com [objeto incomum] sobre [seu nicho]", "O que ninguém te conta sobre [tópico]", "Como [personagem famoso] faria [tarefa do seu nicho]".
    *   **Engajamento:** As descrições devem ser mais didáticas e explicativas, fazer perguntas abertas e convidar o público a compartilhar suas próprias experiências para criar uma comunidade.

3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída definido. A introdução criada no passo 1 deve ser usada apenas no campo 'introductoryMessage'.
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
