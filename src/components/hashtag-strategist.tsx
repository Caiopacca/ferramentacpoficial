
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy, Check, Zap, Search, MessageSquareQuote } from 'lucide-react';
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
import type { GenerateHashtagsOutput, GenerateHashtagsInput } from '@/ai/flows/generate-hashtags';
import { handleGenerateHashtags } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';


const formSchema = z.object({
  keyword: z.string().min(2, 'A palavra-chave deve ter pelo menos 2 caracteres.'),
  city: z.string().optional(),
  state: z.string().optional(),
  isNational: z.boolean().default(false),
}).refine(data => data.state || data.isNational, {
    message: 'Você deve selecionar um estado ou marcar o atendimento nacional.',
    path: ['isNational'], 
});

const states = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
];

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';


export function HashtagStrategist() {
  const [result, setResult] = useState<GenerateHashtagsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      city: '',
      state: '',
      isNational: false,
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setResult(null);
    setCopied(false);

    const payload: GenerateHashtagsInput = { ...values, persona };

    try {
      const response = await handleGenerateHashtags(payload);
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
      setActivePersona(null);
    }
  }

  const handleButtonClick = (persona: Persona) => {
    form.handleSubmit((values) => onSubmit(values, persona))();
  };

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
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form className="space-y-6">
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
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Estado (UF)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o estado" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {states.map(state => (
                                            <SelectItem key={state.value} value={state.value}>
                                                {state.label} ({state.value})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cidade (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Goiânia" {...field} />
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
                          <span className="font-bold">Estratégia do Bizu</span>
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
                          <span className="font-bold">Estratégia da Resenha</span>
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
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
            </Card>
        )}

        {result?.introductoryMessage && (
            <Alert className="border-primary/30 bg-primary/5">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                <AlertDescription className="text-lg text-foreground italic">
                    {result.introductoryMessage}
                </AlertDescription>
            </Alert>
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
