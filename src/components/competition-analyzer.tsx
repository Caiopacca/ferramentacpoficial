
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Zap, Search } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeCompetitionOutput, AnalyzeCompetitionInput } from '@/ai/flows/analyze-competition';
import { handleAnalyzeCompetition } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  userProfile: z
    .string({ required_error: 'Por favor, preencha seu @.' })
    .min(1, 'Seu @ não pode estar vazio.')
    .refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.'}),
  competitorProfile1: z
    .string({ required_error: 'Preencha o @ do concorrente 1.' })
    .min(1, 'O @ do concorrente 1 não pode estar vazio.')
    .refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.'}),
  competitorProfile2: z
    .string()
    .optional()
    .refine(val => !val || val.startsWith('@'), { message: 'O perfil deve começar com @.'}),
});

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';


export function CompetitionAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeCompetitionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      competitorProfile1: '',
      competitorProfile2: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setAnalysis(null);

    const payload: AnalyzeCompetitionInput = { ...values, persona };

    try {
      const result = await handleAnalyzeCompetition(payload);
      setAnalysis(result);
      toast({
        title: 'Análise Concluída!',
        description: 'Sua análise competitiva está pronta.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Análise',
        description:
          'Ocorreu um problema ao se comunicar com a IA. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setActivePersona(null);
    }
  }

  const handleButtonClick = (persona: Persona) => {
    form.handleSubmit((values) => onSubmit(values, persona))();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-foreground">Escolha seu especialista</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            O Bizu e a Resenha são estrategistas de marketing, cariocas da gema, prontos para te ajudar. Prefere um papo reto e estratégico? Vá de Bizu. Quer uma ideia mais criativa e magnética? A Resenha resolve.
        </p>
      </div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="userProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Seu Perfil</FormLabel>
                    <FormControl>
                      <Input placeholder="@seu_negocio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="competitorProfile1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Concorrente 1</FormLabel>
                    <FormControl>
                      <Input placeholder="@concorrente_1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="competitorProfile2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Concorrente 2 (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@concorrente_2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center pt-4">
              <div className="inline-grid grid-cols-2 gap-4">
                  <Button
                      type="button"
                      onClick={() => handleButtonClick('bizu')}
                      disabled={isLoading}
                      size="lg"
                      className="bg-[#FF6A00]/90"
                  >
                      {isLoading && activePersona === 'bizu' ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analisando...
                      </>
                      ) : (
                      <div className="flex items-center justify-center gap-2">
                          <Zap size={20} />
                          <span className="font-bold">Análise do Bizu</span>
                      </div>
                      )}
                  </Button>
                  <Button
                      type="button"
                      onClick={() => handleButtonClick('resenha')}
                      disabled={isLoading}
                      className="bg-black border-2 border-primary text-primary hover:bg-primary/10"
                      size="lg"
                  >
                      {isLoading && activePersona === 'resenha' ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analisando...
                      </>
                      ) : (
                      <div className="flex items-center justify-center gap-2">
                          <Search size={20} />
                          <span className="font-bold">Análise da Resenha</span>
                      </div>
                      )}
                  </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>

      <div className="mt-12">
        {isLoading && (
            <Card className="p-6">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
            </Card>
        )}

        {analysis && (
          <Card className="p-6">
             <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
             </article>
          </Card>
        )}
      </div>
    </div>
  );
}
