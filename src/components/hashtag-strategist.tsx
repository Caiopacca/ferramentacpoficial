
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
import { useToast } from '@/hooks/use-toast';
import type { GenerateHashtagsOutput } from '@/ai/flows/generate-hashtags';
import { handleGenerateHashtags } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  keyword: z.string().min(2, 'A palavra-chave deve ter pelo menos 2 caracteres.'),
});

export function HashtagStrategist() {
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleGenerateHashtags(values);
      setResult(response);
      toast({
        title: 'Estratégia Gerada!',
        description: 'Sua estratégia de hashtags está pronta.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Estratégia',
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
              name="keyword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Palavra-Chave Principal</FormLabel>
                   <FormDescription>
                    Qual termo melhor descreve seu produto ou serviço?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Ex: Harmonização facial, Marketing para advogados, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Estratégia...
                </>
              ) : (
                'Gerar Hashtags'
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
            </Card>
        )}

        {result && (
          <Card className="p-6">
             <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result.strategy}</ReactMarkdown>
             </article>
          </Card>
        )}
      </div>
    </div>
  );
}
