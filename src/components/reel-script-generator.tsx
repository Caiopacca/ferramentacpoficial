
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Zap, Search } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { GenerateReelScriptOutput, GenerateReelScriptInput } from '@/ai/flows/generate-reel-script';
import { handleGenerateReelScript } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { ScriptResultDisplay } from './script-result-display';

const formSchema = z.object({
  niche: z
    .string({ required_error: 'Por favor, preencha seu nicho.' })
    .min(2, 'O nicho deve ter pelo menos 2 caracteres.'),
  theme: z
    .string({ required_error: 'Por favor, selecione um tema.' })
    .min(1, 'Por favor, selecione um tema.'),
});

const themes = [
    { value: 'Dica do Dia', label: 'Dica do Dia' },
    { value: 'Transformação', label: 'Transformação' },
    { value: 'Verdades e Mitos', label: 'Verdades e Mitos' },
    { value: 'Passo a Passo Rápido', label: 'Passo a Passo Rápido' },
    { value: 'Respostas Rápidas', label: 'Respostas Rápidas' },
    { value: 'Nossa História', label: 'Nossa História' },
    { value: 'Como Fazer', label: 'Como Fazer' },
    { value: 'O Ponto de Vista', label: 'O Ponto de Vista' },
    { value: 'As 3 Melhores', label: 'As 3 Melhores' },
    { value: 'Desafio da Semana', label: 'Desafio da Semana' },
  ];

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';


export function ReelScriptGenerator() {
  const [result15s, setResult15s] = useState<GenerateReelScriptOutput | null>(null);
  const [result30s, setResult30s] = useState<GenerateReelScriptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      theme: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setResult15s(null);
    setResult30s(null);

    try {
      const payload15: GenerateReelScriptInput = { ...values, persona, duration: 15 };
      const res15 = await handleGenerateReelScript(payload15);
      setResult15s(res15);
      
      const payload30: GenerateReelScriptInput = { ...values, persona, duration: 30 };
      const res30 = await handleGenerateReelScript(payload30);
      setResult30s(res30);
      
      toast({
        title: 'Roteiros Gerados!',
        description: `Seus roteiros de 15s e 30s estão prontos.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Roteiro',
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


  return (
    <div className="space-y-6">
       <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-foreground">Escolha seu especialista</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            O Bizu e a Resenha são estrategistas de marketing, cariocas da gema, prontos para te ajudar. Prefere um papo reto e estratégico? Vá de Bizu. Quer uma ideia mais criativa e magnética? A Resenha resolve.
        </p>
      </div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Seu Nicho de Atuação</FormLabel>
                    <FormDescription>
                      Ex: Nutrição, Finanças, Marketing Digital...
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Qual sua especialidade?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Tema do Reel</FormLabel>
                    <FormDescription>
                      Escolha um formato para o seu vídeo.
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.value} value={theme.value}>
                            {theme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-center pt-4">
              <div className="inline-grid grid-cols-2 gap-4">
                  <Button
                      type="button"
                      onClick={() => handleButtonClick('bizu')}
                      disabled={isLoading}
                      size="lg"
                      className="bg-[#FF6A00]/90"
                  >
                      {isLoading && activePersona === 'bizu' ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando...
                      </>
                      ) : (
                      <div className="flex items-center justify-center gap-2">
                          <Zap size={20} />
                          <span className="font-bold">Roteiros do Bizu</span>
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
                          Gerando...
                      </>
                      ) : (
                      <div className="flex items-center justify-center gap-2">
                          <Search size={20} />
                          <span className="font-bold">Roteiros da Resenha</span>
                      </div>
                      )}
                  </Button>
              </div>
            </div>
          </form>
        </Form>
      </Card>

      <div className="mt-12 space-y-8">
        {isLoading && (
            <Card className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </Card>
        )}

        {result15s && (
            <div>
                <h3 className="text-2xl font-bold text-center mb-4">Roteiro de 15 segundos</h3>
                <ScriptResultDisplay result={result15s} />
            </div>
        )}
        {result30s && (
            <div>
                <h3 className="text-2xl font-bold text-center mb-4">Roteiro de 30 segundos</h3>
                <ScriptResultDisplay result={result30s} />
            </div>
        )}
      </div>
    </div>
  );
}
