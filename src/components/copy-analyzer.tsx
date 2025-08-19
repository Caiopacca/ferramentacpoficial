
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Zap, CheckCircle, ArrowRight, TrendingUp, Award, MessageSquareQuote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

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
import type { AnalyzeCopyOutput, AnalyzeCopyInput } from '@/ai/flows/analyze-copy';
import { handleAnalyzeCopy } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

const formSchema = z.object({
  caption: z.string().min(10, 'A legenda deve ter pelo menos 10 caracteres.'),
});

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';


export function CopyAnalyzer() {
  const [analysis, setAnalysis] = useState<AnalyzeCopyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setAnalysis(null);

    const payload: AnalyzeCopyInput = { ...values, persona };

    try {
      const result = await handleAnalyzeCopy(payload);
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

const pillarIcons: { [key: string]: React.ReactNode } = {
    'Força do Gancho (Hook)': <Zap className="h-5 w-5" />,
    'Clareza da Mensagem': <MessageSquareQuote className="h-5 w-5" />,
    'Eficácia da Chamada para Ação (CTA)': <ArrowRight className="h-5 w-5" />,
};


  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form className="space-y-6">
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
                      className="bg-background border-2 border-primary text-primary hover:bg-primary/10"
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
      </Card>

      <div className="mt-12 space-y-6">
        {isLoading && (
            <Card className="p-6">
                <CardHeader>
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-full" />
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
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Diagnóstico da Legenda</CardTitle>
                    <CardDescription>Análise de performance para conversão.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-6 bg-card-foreground/5 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground">Pontuação Geral de Performance</p>
                        <p className="text-7xl font-bold text-primary mt-2">{analysis.overallScore}</p>
                        <Progress value={analysis.overallScore} className="mt-4 h-2" />
                    </div>
                </CardContent>
             </Card>

            <Card>
                <CardHeader className="flex-row items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    <CardTitle>Resumo Executivo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{analysis.executiveSummary}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Análise Detalhada por Pilares</CardTitle>
                    <CardDescription>Navegue pelas abas para ver a análise de cada pilar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue={analysis.pillars[0].pillarName} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            {analysis.pillars.map(pillar => (
                                <TabsTrigger key={pillar.pillarName} value={pillar.pillarName}>
                                    {pillar.pillarName}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {analysis.pillars.map(pillar => (
                             <TabsContent key={pillar.pillarName} value={pillar.pillarName}>
                                <Card className="border-0 shadow-none">
                                    <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
                                        <span className="p-2 bg-primary/10 rounded-md text-primary">
                                            {pillarIcons[pillar.pillarName]}
                                        </span>
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                {pillar.pillarName}
                                                <Badge className={`px-2 py-1 text-sm font-bold ${getPillarScoreColor(pillar.score)}`}>
                                                    {pillar.score}/10
                                                </Badge>
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 p-4 pt-0">
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1"><CheckCircle className="w-4 h-4 text-green-500" /> Análise</h4>
                                            <p className="text-muted-foreground text-sm">{pillar.analysis}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-500" /> Sugestão de Melhoria</h4>
                                            <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-md border border-dashed">{pillar.suggestion}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
