
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
import type { CalculateRoiOutput } from '@/ai/flows/calculate-roi';
import { handleCalculateRoi } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  ticket: z.coerce.number({invalid_type_error: 'Deve ser um número.'}).positive('O ticket médio deve ser positivo.'),
  currentCustomers: z.coerce.number({invalid_type_error: 'Deve ser um número.'}).int('Deve ser um número inteiro.').nonnegative('Não pode ser negativo.'),
  investment: z.coerce.number({invalid_type_error: 'Deve ser um número.'}).positive('O investimento deve ser positivo.'),
});

export function RoiCalculator() {
  const [analysis, setAnalysis] = useState<CalculateRoiOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticket: '' as any,
      currentCustomers: '' as any,
      investment: '' as any,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await handleCalculateRoi(values);
      setAnalysis(result);
      toast({
        title: 'Cálculo Concluído!',
        description: 'Sua projeção de ROI está pronta.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Calcular ROI',
        description:
          'Ocorreu um problema ao se comunicar com a IA. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="ticket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Ticket Médio (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentCustomers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Clientes Atuais/Mês</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="investment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Investimento em Anúncios (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 1000" {...field} />
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
                  Calculando...
                </>
              ) : (
                'Calcular Potencial de Lucro'
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
