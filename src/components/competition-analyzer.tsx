
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
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
import type { AnalyzeCompetitionOutput } from '@/ai/flows/analyze-competition';
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

export function CompetitionAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeCompetitionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: '',
      competitorProfile1: '',
      competitorProfile2: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await handleAnalyzeCompetition(values);
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
    }
  }

  return (
    <div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                'Analisar Concorrentes'
              )}
            </Button>
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
