
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, MessageSquareQuote, Zap, Search } from 'lucide-react';

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
import type { GenerateContentIdeasOutput, GenerateContentIdeasInput } from '@/ai/flows/generate-content-ideas';
import { handleGenerateContent } from '@/app/actions';
import { IdeaCard } from './idea-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';

const formSchema = z.object({
  niche: z
    .string({ required_error: 'Por favor, preencha seu nicho.' })
    .min(2, 'O nicho deve ter pelo menos 2 caracteres.'),
  objective: z
    .string({ required_error: 'Por favor, selecione um objetivo.' })
    .min(1, 'Por favor, selecione um objetivo.'),
});

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';

const objectives = [
  { value: 'Atrair Clientes', label: 'Atrair Clentes' },
  { value: 'Gerar Autoridade', label: 'Gerar Autoridade' },
  { value: 'Aumentar Engajamento', label: 'Aumentar Engajamento' },
  { value: 'Vender um Produto', label: 'Vender um Produto/Serviço' },
];

export function ContentGenerator() {
  const [ideas, setIdeas] = useState<GenerateContentIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      objective: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setIdeas(null);

    const payload: GenerateContentIdeasInput = { ...values, persona };

    try {
      const result = await handleGenerateContent(payload);
      setIdeas(result);
      toast({
        title: 'Sucesso!',
        description: `O ${persona === 'bizu' ? 'Bizu' : 'Resenha'} preparou seu plano de conteúdo.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Ideias',
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
    <div>
      <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Escolha seu especialista</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            O Bizu e a Resenha são estrategistas de marketing, cariocas da gema, prontos para te ajudar. Prefere um papo reto e estratégico? Vá de Bizu. Quer uma ideia mais bolada? A Resenha resolve.
          </p>
      </div>
      <Card className="p-6 md:p-8 mt-8">
        <Form {...form}>
          <form className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Seu Nicho</FormLabel>
                    <FormDescription>
                      Ex: Dermatologia, Advocacia, Restaurante...
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Qual é a sua área de atuação?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Seu Objetivo</FormLabel>
                    <FormDescription>
                      O que você quer alcançar com seu conteúdo?
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um objetivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {objectives.map((obj) => (
                          <SelectItem key={obj.value} value={obj.value}>
                            {obj.label}
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
                          <span className="font-bold">Quero que o Bizu crie conteúdos</span>
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
                          Contando a Resenha...
                      </>
                      ) : (
                      <div className="flex items-center justify-center gap-2">
                          <Search size={20} />
                          <span className="font-bold">Quero que a Resenha crie conteúdos</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-1/4 mb-4" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-16 w-full" />
              </Card>
            ))}
          </div>
        )}

        {ideas?.introductoryMessage && (
            <Alert className="border-primary/30 bg-primary/5">
                <MessageSquareQuote className="h-5 w-5 text-primary" />
                <AlertDescription className="text-lg text-foreground italic">
                    {ideas.introductoryMessage}
                </AlertDescription>
            </Alert>
        )}

        {ideas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.contentIdeas.map((idea, index) => (
              <IdeaCard key={index} day={index + 1} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
