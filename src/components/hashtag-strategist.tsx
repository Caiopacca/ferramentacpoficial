
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy, Check } from 'lucide-react';
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
import { Checkbox } from './ui/checkbox';


const formSchema = z.object({
  keyword: z.string().min(2, 'A palavra-chave deve ter pelo menos 2 caracteres.'),
  city: z.string().optional(),
  state: z.string().optional(),
  isNational: z.boolean().default(false),
}).refine(data => data.city || data.isNational, {
    message: 'Você deve preencher a localização ou marcar o atendimento nacional.',
    path: ['isNational'], // you can pick any field to display the error
});


export function HashtagStrategist() {
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      city: '',
      state: '',
      isNational: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setCopied(false);
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

  const handleCopy = () => {
    if (!result?.hashtagsForCopying) return;
    navigator.clipboard.writeText(result.hashtagsForCopying);
    setCopied(true);
    toast({
      title: 'Copiado!',
      description: 'Hashtags copiadas para a área de transferência.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

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

            <div>
                <FormLabel className="text-lg">Onde você atende?</FormLabel>
                <FormDescription className="mb-4">
                    Preencha os campos para gerar hashtags locais e/ou nacionais.
                </FormDescription>
                <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50 mt-2">
                     <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Goiânia" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estado (UF)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: GO" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
            
            <FormField
              control={form.control}
              name="isNational"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Atendo em todo o Brasil (online)
                    </FormLabel>
                    <FormDescription>
                      Marque esta opção para gerar hashtags de alcance nacional.
                    </FormDescription>
                  </div>
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
          <Card className="p-6 relative">
            <Button 
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="absolute top-4 right-4"
                aria-label="Copiar hashtags"
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                <span className="ml-2">{copied ? 'Copiado!' : 'Copiar'}</span>
            </Button>
             <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result.strategy}</ReactMarkdown>
             </article>
          </Card>
        )}
      </div>
    </div>
  );
}
