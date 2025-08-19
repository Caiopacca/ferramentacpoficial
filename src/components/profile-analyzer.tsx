
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MessageSquareQuote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


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
import type { AnalyzeProfileOutput, AnalyzeProfileInput } from '@/ai/flows/analyze-profile';
import { handleAnalyzeProfile } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

const formSchema = z.object({
  username: z
    .string({ required_error: 'Por favor, preencha seu @.' })
    .min(1, 'Seu @ não pode estar vazio.')
    .refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.'}),
});

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';


export function ProfileAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeProfileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setAnalysis(null);

    const payload: AnalyzeProfileInput = { ...values, persona };

    try {
      const result = await handleAnalyzeProfile(payload);
      setAnalysis(result);
      toast({
        title: 'Análise Concluída!',
        description: `O ${persona === 'bizu' ? 'Bizu' : 'Resenha'} concluiu o diagnóstico do seu perfil.`,
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


    const getPillarScoreColor = (score: number) => {
        if (score >= 8) return 'bg-green-500/20 text-green-400';
        if (score >= 5) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-red-500/20 text-red-400';
    };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Analisador de Perfil</CardTitle>
            <CardDescription>Insira seu @ do Instagram e receba um diagnóstico completo com nota e pontos de melhoria.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form className="space-y-6">
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
                <div className="flex justify-center pt-4">
                    <div className="inline-grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            onClick={() => handleButtonClick('bizu')}
                            disabled={isLoading}
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isLoading && activePersona === 'bizu' ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analisando...
                            </>
                            ) : (
                            <div className="flex items-center justify-center gap-2">
                                <Image src="https://res.cloudinary.com/dp3gukavt/image/upload/v1755609495/BIZU_aeju4r.png" alt="Avatar do Bizu" width={24} height={24} className="rounded-full border-2 border-black" />
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
                                <Image src="https://res.cloudinary.com/dp3gukavt/image/upload/v1755609475/RESENHA_snj8lf.png" alt="Avatar da Resenha" width={24} height={24} className="rounded-full border-2 border-primary" />
                                <span className="font-bold">Análise da Resenha</span>
                            </div>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
            </Form>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-6">
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

        {analysis?.introductoryMessage && (
            <Alert className="border-primary/30 bg-primary/5">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                <AlertDescription className="text-lg text-foreground italic">
                    {analysis.introductoryMessage}
                </AlertDescription>
            </Alert>
        )}

        {analysis && (
          <>
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Diagnóstico Estratégico de Perfil</CardTitle>
                    <CardDescription>{analysis.username}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-6 bg-card-foreground/5 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Nota Geral de Performance Comercial</p>
                        <p className="text-7xl font-bold text-primary mt-2">{analysis.overallScore}</p>
                        <Progress value={analysis.overallScore} className="mt-4 h-2" />
                    </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resumo Executivo Estratégico</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{analysis.executiveSummary}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Diagnóstico Detalhado por Pilares</CardTitle>
                     <CardDescription>Clique em cada pilar para ver a análise e o plano de ação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {analysis.pillars.map((pillar, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base hover:no-underline">
                                    <div className="flex items-center gap-4">
                                        <Badge className={`px-2 py-1 text-sm font-bold ${getPillarScoreColor(pillar.score)}`}>
                                            {pillar.score}/10
                                        </Badge>
                                        <span>{pillar.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div>
                                        <h4 className="font-semibold text-foreground">Análise de Impacto</h4>
                                        <p className="text-muted-foreground mt-1">{pillar.impactAnalysis}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">Plano de Ação</h4>
                                        <p className="text-muted-foreground mt-1">{pillar.actionPlan}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
