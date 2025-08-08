
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { GenerateColdEmailOutput } from '@/ai/flows/generate-cold-email';
import { handleGenerateColdEmail } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  jobTitle: z.string({ required_error: 'Por favor, selecione um cargo.' }),
  objective: z.string({ required_error: 'Por favor, selecione um objetivo.' }),
});

const jobTitles = [
  { value: 'Dono(a) de Empresa', label: 'Dono(a) de Empresa' },
  { value: 'CEO ou Fundador(a)', label: 'CEO ou Fundador(a)' },
  { value: 'Gerente de Marketing', label: 'Gerente de Marketing' },
  { value: 'Gerente de Compras', label: 'Gerente de Compras' },
  { value: 'Diretor(a) de Vendas', label: 'Diretor(a) de Vendas' },
  { value: 'Profissional de RH', label: 'Profissional de RH' },
  { value: 'Outro', label: 'Outro (descrever no objetivo)' },
];

const objectives = [
  { value: 'Apresentar meu serviço/produto', label: 'Apresentar meu serviço/produto' },
  { value: 'Marcar uma reunião de demonstração', label: 'Marcar uma reunião de demonstração' },
  { value: 'Oferecer uma consultoria gratuita', label: 'Oferecer uma consultoria gratuita' },
  { value: 'Iniciar uma parceria estratégica', label: 'Iniciar uma parceria estratégica' },
  { value: 'Fazer networking', label: 'Fazer networking' },
];

export function ColdEmailGenerator() {
  const [result, setResult] = useState<GenerateColdEmailOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      objective: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleGenerateColdEmail(values);
      setResult(response);
      toast({
        title: 'E-mail Gerado!',
        description: 'Seu e-mail de prospecção está pronto.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar E-mail',
        description:
          'Ocorreu um problema ao se comunicar com a IA. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'E-mail copiado para a área de transferência.',
    });
  };

  return (
    <div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Cargo do Destinatário</FormLabel>
                    <FormDescription>
                      Para quem você está escrevendo?
                    </FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobTitles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
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
                name="objective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Objetivo do E-mail</FormLabel>
                     <FormDescription>
                      O que você quer alcançar?
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
                  Gerando E-mail...
                </>
              ) : (
                'Gerar Corpo do E-mail'
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
          <Card className="relative p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(result.emailBody)}
              aria-label="Copiar e-mail"
              className="absolute top-4 right-4"
            >
              <Copy className="h-5 w-5" />
            </Button>
            <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{result.emailBody}</ReactMarkdown>
            </article>
          </Card>
        )}
      </div>
    </div>
  );
}
