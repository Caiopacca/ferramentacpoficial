
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
import type { AnalyzeProfileOutput } from '@/ai/flows/analyze-profile';
import { handleAnalyzeProfile } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  username: z
    .string({ required_error: 'Por favor, preencha seu @.' })
    .min(1, 'Seu @ não pode estar vazio.')
    .refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.'}),
});

export function ProfileAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeProfileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await handleAnalyzeProfile(values);
      setAnalysis(result);
      toast({
        title: 'Análise Concluída!',
        description: 'Seu diagnóstico de perfil está pronto.',
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
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Analisador de Perfil</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Seu @ no Instagram</FormLabel>
                    <FormControl>
                        <Input placeholder="@seu_negocio" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando Perfil...
                    </>
                ) : (
                    'Analisar Meu Perfil'
                )}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>

      <div className="mt-6">
        {isLoading && (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </CardContent>
            </Card>
        )}

        {analysis && (
          <Card>
            <CardHeader>
                <CardTitle>Relatório de Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <article className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
                </article>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
