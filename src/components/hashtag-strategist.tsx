
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  keyword: z.string().min(2, 'A palavra-chave deve ter pelo menos 2 caracteres.'),
  locationType: z.enum(['local', 'national'], {
    required_error: 'Selecione uma opção de atendimento.',
  }),
  city: z.string().optional(),
  state: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.locationType === 'local' && (!data.city || data.city.length < 2)) {
        ctx.addIssue({
            code: 'custom',
            path: ['city'],
            message: 'Cidade é obrigatória para negócios locais.',
        });
    }
    if (data.locationType === 'local' && (!data.state || data.state.length < 2)) {
        ctx.addIssue({
            code: 'custom',
            path: ['state'],
            message: 'Estado é obrigatório para negócios locais.',
        });
    }
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
      locationType: 'national',
    },
  });

  const locationType = form.watch('locationType');

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

            <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="text-lg">Onde você atende?</FormLabel>
                     <FormDescription>
                        Isso nos ajuda a criar hashtags de localização mais eficazes.
                     </FormDescription>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-6"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="national" />
                            </FormControl>
                            <FormLabel className="font-normal">
                            Negócio Nacional (Online)
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                            <RadioGroupItem value="local" />
                            </FormControl>
                            <FormLabel className="font-normal">
                             Negócio Local (Cidade/Estado)
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            {locationType === 'local' && (
                <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50">
                     <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: São Paulo" {...field} />
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
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: SP" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}


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
