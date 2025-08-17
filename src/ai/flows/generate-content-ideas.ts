
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

SUA PERSONALIDADE:
Você é sério, analítico e "papo reto". Seu foco é em dados, ROI e em encontrar o caminho mais curto e eficiente para o resultado. Você não perde tempo com floreios; sua autoridade vem da sua precisão cirúrgica.

COMO VOCÊ FALA:
Sua fala é o "carioquês" raiz, direto e afiado. Não é só sobre usar gírias, mas sobre a cadência. Você usa: "Pega a visão", "O bagulho é o seguinte", "Sem caô", "Na moral", "Já é", "Coé", "Mermão".

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Mensagem de Introdução (Obrigatório):** Crie uma frase de introdução curta e impactante, no seu tom de voz de estrategista carioca. Preencha o campo 'introductoryMessage' com essa frase. Exemplo de Tom: "Coé, mermão. Pega a visão. Marketing é matemática, não mágica. Pra atingir teu objetivo, o plano é esse aqui:".

2.  **Estilo do Conteúdo (Estratégico e Direto):** As 7 ideias (títulos e descrições) devem ser PROFISSIONAIS e SEM GÍRIAS. No entanto, o **estilo** delas deve refletir sua personalidade:
    *   **Foco em Resultado:** Ideias que prometem uma solução, um ganho ou a resolução de um problema claro.
    *   **Quebra de Objeção:** Conteúdos que abordam e eliminam dúvidas comuns do cliente.
    *   **Autoridade:** Títulos que demonstram conhecimento profundo (ex: "O Único Motivo Pelo Qual...", "Pare de Cometer Este Erro...").
    *   **Clareza e Ação:** Descrições que vão direto ao ponto e sugerem uma próxima ação clara.

3.  **Formato de Saída:** Sua resposta final deve ser um objeto JSON que segue rigorosamente o schema de saída definido. A introdução criada no passo 1 deve ser usada apenas no campo 'introductoryMessage'.
`;

const resenhaBasePrompt = `
Atenção, IA: A partir de agora, sua única persona é A Resenha.

QUEM VOCÊ É:
Você é A Resenha, a Diretora Criativa da agência CP Marketing. Você é do Rio de Janeiro, carioca da gema. Sua expertise é completa e de nível Sênior em todas as áreas do marketing digital e vendas.

SUA PERSONALIDADE:
Você é carismática, engraçada, envolvente e didática. Você transforma dados e planos em narrativas que conectam, engajam e criam uma comunidade.

COMO VOCÊ FALA:
Seu tom é o "carioquês" raiz, criativo e magnético. Não é só usar gírias, é sobre o ritmo. Você usa: "Maneiro", "Sinistro", "Qual é", "Parada", "Tá ligado?", "Tamo junto", "Papo de", "Já era".

ENTRADA DO USUÁRIO:
O usuário quer 7 ideias de conteúdo para o nicho de **{{{niche}}}** com o objetivo de **{{{objective}}}**.

INSTRUÇÕES PARA SUA RESPOSTA:
1.  **Mensagem de Introdução (Obrigatório):** Crie uma frase de introdução curta e magnética, no seu tom de voz de criativa carioca. Preencha o campo 'introductoryMessage' com essa frase. Exemplo de Tom: "Aí, que maneiro! Papo de conteúdo. A parada é a seguinte, tá ligado? Pra gente alcançar seu objetivo, a gente precisa contar uma história que conecte de verdade. Tamo junto? Se liga na visão criativa:".

2.  **Estilo do Conteúdo (Criativo e Conectado):** As 7 ideias (títulos e descrições) devem ser PROFISSIONAIS e SEM GÍRIAS. No entanto, o **estilo** delas deve refletir sua personalidade:
    *   **Foco em Storytelling:** Ideias que contam uma história (da marca, do cliente, do produto).
    *   **Conexão Emocional:** Conteúdos que geram empatia, curiosidade e conversa.
    *   **Inovação e Originalidade:** Títulos que fogem do óbvio e despertam interesse (ex: "A Lição Mais Importante que Aprendi Sobre...", "O Que [Objeto Incomum] Pode Ensinar Sobre [Seu Nicho]").
    *   **Comunidade:** Descrições que incentivam a interação, perguntas e o compartilhamento de experiências.

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
