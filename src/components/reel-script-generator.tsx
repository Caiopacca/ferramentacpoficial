
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { GenerateReelScriptOutput } from '@/ai/flows/generate-reel-script';
import { handleGenerateReelScript } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  niche: z
    .string({ required_error: 'Por favor, preencha seu nicho.' })
    .min(2, 'O nicho deve ter pelo menos 2 caracteres.'),
  theme: z
    .string({ required_error: 'Por favor, selecione um tema.' })
    .min(1, 'Por favor, selecione um tema.'),
});

const themes = [
  { value: 'Dica Rápida', label: 'Dica Rápida' },
  { value: 'Antes e Depois', label: 'Antes e Depois' },
  { value: 'Mito vs. Verdade', label: 'Mito vs. Verdade' },
  { value: 'Processo Acelerado (Timelapse)', label: 'Processo Acelerado (Timelapse)' },
  { value: 'Caixinha de Perguntas', label: 'Caixinha de Perguntas' },
];

type FormData = z.infer<typeof formSchema>;

export function ReelScriptGenerator() {
  const [result, setResult] = useState<GenerateReelScriptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      theme: '',
    },
  });

  async function generateScript(values: FormData, duration: 15 | 30) {
    setIsLoading(true);
    setActiveButton(duration);
    setResult(null);

    try {
      const response = await handleGenerateReelScript({ ...values, duration });
      setResult(response);
      toast({
        title: 'Roteiro Gerado!',
        description: `Seu roteiro de ${duration}s para Reels está pronto.`,
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
      setActiveButton(null);
    }
  }
  
  const onSubmit = (duration: 15 | 30) => {
    return form.handleSubmit((values) => generateScript(values, duration))();
  };


  return (
    <div>
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
            <div className="flex flex-col md:flex-row gap-4">
                <Button 
                    type="button" 
                    onClick={() => onSubmit(15)} 
                    disabled={isLoading} 
                    className="w-full md:w-auto" 
                    size="lg"
                >
                {isLoading && activeButton === 15 ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                    </>
                ) : (
                    'Gerar Roteiro de 15s'
                )}
                </Button>
                <Button 
                    type="button" 
                    onClick={() => onSubmit(30)}
                    disabled={isLoading} 
                    className="w-full md:w-auto" 
                    size="lg"
                >
                {isLoading && activeButton === 30 ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                    </>
                ) : (
                    'Gerar Roteiro de 30s'
                )}
                </Button>
            </div>
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

        {result && (
          <Card className="p-6">
             <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result.script}</ReactMarkdown>
             </article>
          </Card>
        )}
      </div>
    </div>
  );
}
