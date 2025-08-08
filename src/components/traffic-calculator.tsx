
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
    campaignType: z.enum(['landingPage', 'directContact']),
    salesGoal: z.coerce.number().positive('Deve ser um número positivo.'),
    avgTicket: z.coerce.number().positive('Deve ser um número positivo.'),
    leadToCustomerRate: z.coerce.number().positive('Deve ser um número positivo.'),
    // Conditional fields
    visitorToLeadRate: z.coerce.number().optional(),
    avgCpc: z.coerce.number().optional(),
    avgCpl: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (data.campaignType === 'landingPage') {
        if (!data.visitorToLeadRate || data.visitorToLeadRate <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['visitorToLeadRate'],
                message: 'Deve ser um número positivo para este tipo de campanha.',
            });
        }
        if (!data.avgCpc || data.avgCpc <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['avgCpc'],
                message: 'Deve ser um número positivo para este tipo de campanha.',
            });
        }
    } else if (data.campaignType === 'directContact') {
        if (!data.avgCpl || data.avgCpl <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['avgCpl'],
                message: 'Deve ser um número positivo para este tipo de campanha.',
            });
        }
    }
});

export function TrafficCalculator() {
  const [result, setResult] = useState<CalculateTrafficInvestmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignType: 'landingPage',
      salesGoal: 20,
      avgTicket: 1000,
      leadToCustomerRate: 10,
      visitorToLeadRate: 3,
      avgCpc: 1.50,
      avgCpl: 25,
    },
  });

  const campaignType = form.watch('campaignType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    // This is a type guard to satisfy TypeScript
    if ((values.campaignType === 'landingPage' && (values.visitorToLeadRate === undefined || values.avgCpc === undefined)) ||
        (values.campaignType === 'directContact' && values.avgCpl === undefined)) {
            toast({
                title: 'Erro de Validação',
                description: 'Por favor, preencha todos os campos necessários.',
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
    }
    
    try {
      const response = await handleCalculateTrafficInvestment(values as any);
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
            
            <FormField
              control={form.control}
              name="campaignType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual o tipo da sua campanha?</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de campanha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="landingPage">Página de Destino / Site</SelectItem>
                      <SelectItem value="directContact">Contato Direto (WhatsApp, Direct)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              
              {campaignType === 'landingPage' && (
                <>
                    <FormField
                    control={form.control}
                    name="visitorToLeadRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>De 100 visitantes, quantos viram leads? (%)</FormLabel>
                        <FormDescription>Taxa de conversão da sua página.</FormDescription>
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
                </>
              )}

              {campaignType === 'directContact' && (
                <FormField
                    control={form.control}
                    name="avgCpl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Quanto você paga por conversa iniciada? (R$)</FormLabel>
                        <FormDescription>Seu Custo por Lead (CPL) médio.</FormDescription>
                        <FormControl>
                            <Input type="number" step="0.01" placeholder="Ex: 25.00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              )}

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
                {result.requiredVisitors && <p><strong>Visitantes Necessários:</strong> {result.requiredVisitors}</p>}
                <p><strong>Orçamento Estimado:</strong> {formatCurrency(result.requiredBudget)}</p>
                <p><strong>Lucro Líquido Esperado:</strong> {formatCurrency(result.expectedProfit)}</p>
                <p><strong>ROI Estimado:</strong> {result.expectedRoi.toFixed(2)}%</p>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * O Lucro Líquido é calculado como (Faturamento Bruto) - Orçamento de Tráfego. O ROI é a relação entre o Lucro Líquido e o Orçamento.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
