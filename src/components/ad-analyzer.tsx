
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { AnalyzeAdOutput } from '@/ai/flows/analyze-ad';
import { handleAnalyzeAd } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  targetAudience: z.string().min(10, 'Descreva seu público com pelo menos 10 caracteres.'),
  adCopy: z.string().min(10, 'Sua copy deve ter pelo menos 10 caracteres.'),
  imageDescription: z.string().min(10, 'Descreva sua imagem com pelo menos 10 caracteres.'),
});

export function AdAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeAdOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetAudience: '',
      adCopy: '',
      imageDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await handleAnalyzeAd(values);
      setAnalysis(result);
      toast({
        title: 'Análise Concluída!',
        description: 'Seu Raio-X do anúncio está pronto.',
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
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Público-Alvo</FormLabel>
                  <FormDescription>
                    Descreva para quem é este anúncio.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Ex: Mulheres, 25-40 anos, interessadas em yoga e bem-estar." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adCopy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Texto do Anúncio (Copy)</FormLabel>
                  <FormDescription>
                    Cole o texto que você planeja usar no anúncio.
                  </FormDescription>
                  <FormControl>
                    <Textarea className="min-h-[150px]" placeholder="Ex: Encontre sua paz interior com nossas aulas de yoga..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Descrição da Imagem/Vídeo</FormLabel>
                   <FormDescription>
                    Descreva o criativo que acompanha o texto.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Ex: Vídeo de uma mulher praticando yoga em uma praia ao amanhecer." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando Anúncio...
                </>
              ) : (
                'Analisar Meu Anúncio'
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
