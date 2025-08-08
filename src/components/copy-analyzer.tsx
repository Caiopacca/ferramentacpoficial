
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeCopyOutput } from '@/ai/flows/analyze-copy';
import { handleAnalyzeCopy } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  caption: z.string().min(10, 'A legenda deve ter pelo menos 10 caracteres.'),
});

export function CopyAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeCopyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await handleAnalyzeCopy(values);
      setAnalysis(result);
      toast({
        title: 'Análise Concluída!',
        description: 'O boletim de performance da sua legenda está pronto.',
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Cole sua legenda aqui</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Cansado de posts que não geram resultados? Toque no link da bio para descobrir como..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando Legenda...
                </>
              ) : (
                'Analisar Minha Legenda'
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
