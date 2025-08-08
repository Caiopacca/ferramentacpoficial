
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy, Check } from 'lucide-react';

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
import type { GenerateEmailSubjectOutput } from '@/ai/flows/generate-email-subject';
import { handleGenerateEmailSubject } from '@/app/actions';
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

export function EmailSubjectGenerator() {
  const [result, setResult] = useState<GenerateEmailSubjectOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
    setCopiedIndex(null);
    try {
      const response = await handleGenerateEmailSubject(values);
      setResult(response);
      toast({
        title: 'Assuntos Gerados!',
        description: 'Suas 5 opções de títulos de e-mail estão prontas.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Assuntos',
        description:
          'Ocorreu um problema ao se comunicar com a IA. Por favor, tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: 'Copiado!',
      description: 'Assunto do e-mail copiado para a área de transferência.',
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
                  Gerando Assuntos...
                </>
              ) : (
                'Gerar 5 Opções'
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="mt-12">
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-full" />
              </Card>
            ))}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {result.subjects.map((subject, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center gap-4">
                  <p className="text-muted-foreground flex-grow">{subject}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(subject, index)}
                    aria-label="Copiar assunto"
                  >
                    {copiedIndex === index ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
