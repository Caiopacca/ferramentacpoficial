
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

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
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { handleCalculateTrafficInvestment } from '@/app/actions';
import type { CalculateTrafficInvestmentOutput } from '@/ai/flows/calculate-traffic-investment';

const formSchema = z.object({
    salesGoal: z.coerce.number().positive('Deve ser um número positivo.'),
    avgTicket: z.coerce.number().positive('Deve ser um número positivo.'),
    leadToCustomerRate: z.coerce.number().positive('Deve ser um número positivo.'),
    visitorToLeadRate: z.coerce.number().positive('Deve ser um número positivo.'),
    avgCpc: z.coerce.number().positive('Deve ser um número positivo.'),
});

export function TrafficCalculator() {
  const [result, setResult] = useState<CalculateTrafficInvestmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesGoal: 20,
      avgTicket: 1000,
      leadToCustomerRate: 10,
      visitorToLeadRate: 3,
      avgCpc: 1.50,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleCalculateTrafficInvestment(values);
      setResult(response);
      toast({
        title: 'Cálculo Concluído!',
        description: 'Sua projeção de investimento está pronta.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Calcular',
        description: 'Ocorreu um problema ao se comunicar com a IA. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
              <FormField
                control={form.control}
                name="salesGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantas vendas você quer fazer? (mês)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avgTicket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual o valor médio de cada venda? (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leadToCustomerRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>De 100 leads, quantos viram clientes? (%)</FormLabel>
                    <FormDescription>Sua taxa de fechamento.</FormDescription>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visitorToLeadRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>De 100 visitantes, quantos viram leads? (%)</FormLabel>
                    <FormDescription>Sua taxa de conversão do site/página.</FormDescription>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avgCpc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quanto você paga por clique? (R$)</FormLabel>
                    <FormDescription>Seu Custo por Clique (CPC) médio.</FormDescription>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ex: 1.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                'Calcular Investimento'
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="mt-12">
        {isLoading && (
            <Card className="p-6">
              <Skeleton className="h-8 w-1/3 mb-6" />
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </Card>
        )}

        {result && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Resultados</h2>
            <div className="grid md:grid-cols-2 gap-4 text-lg">
                <p><strong>Leads Necessários:</strong> {result.requiredLeads}</p>
                <p><strong>Visitantes Necessários:</strong> {result.requiredVisitors}</p>
                <p><strong>Orçamento Estimado:</strong> {formatCurrency(result.requiredBudget)}</p>
                <p><strong>Lucro Líquido Esperado:</strong> {formatCurrency(result.expectedProfit)}</p>
                <p><strong>ROI Estimado:</strong> {result.expectedRoi.toFixed(2)}%</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
