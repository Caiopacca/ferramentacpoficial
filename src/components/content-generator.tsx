
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { GenerateContentIdeasOutput } from '@/ai/flows/generate-content-ideas';
import { handleGenerateContent } from '@/app/actions';
import { IdeaCard } from './idea-card';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  niche: z
    .string({ required_error: 'Por favor, insira um nicho.' })
    .min(2, 'Nicho deve ter pelo menos 2 caracteres.'),
  objective: z
    .string({ required_error: 'Por favor, selecione um objetivo.' })
    .min(1, 'Por favor, selecione um objetivo.'),
});

const objectives = [
  { value: 'Atrair Clientes', label: 'Atrair Clientes' },
  { value: 'Gerar Autoridade', label: 'Gerar Autoridade' },
  { value: 'Aumentar Engajamento', label: 'Aumentar Engajamento' },
  { value: 'Vender um Produto', label: 'Vender um Produto/Serviço' },
];

export function ContentGenerator() {
  const [ideas, setIdeas] = useState<GenerateContentIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      objective: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIdeas(null);
    try {
      const result = await handleGenerateContent(values);
      setIdeas(result);
      toast({
        title: 'Sucesso!',
        description: 'Seu plano de conteúdo para 7 dias está pronto.',
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
    }
  }

  return (
    <div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      <Input placeholder="Qual área você atua?" {...field} />
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
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Ideias...
                </>
              ) : (
                'Gerar 7 Dias de Conteúdo'
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="mt-12">
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
