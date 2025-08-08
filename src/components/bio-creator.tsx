
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { GenerateBioOutput } from '@/ai/flows/generate-bio';
import { handleGenerateBio } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  whatYouDo: z.string().min(1, 'Este campo é obrigatório.'),
  whoYouHelp: z.string().min(1, 'Este campo é obrigatório.'),
  mainResult: z.string().min(1, 'Este campo é obrigatório.'),
});

export function BioCreator() {
  const [bios, setBios] = useState<GenerateBioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatYouDo: '',
      whoYouHelp: '',
      mainResult: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setBios(null);
    try {
      const result = await handleGenerateBio(values);
      setBios(result);
      toast({
        title: 'Bios Geradas!',
        description: 'Suas 3 opções de bio estão prontas.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao Gerar Bio',
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
      description: 'Bio copiada para a área de transferência.',
    });
  };

  return (
    <div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="whatYouDo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">O que você faz?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Eu ajudo médicos a..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whoYouHelp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Para quem você faz?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Profissionais da saúde que..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainResult"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Qual o principal resultado que você gera?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ...conquistarem mais pacientes." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Gerar Bios'
              )}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="mt-12">
        {isLoading && (
          <div className="space-y-4">
            <Card className="p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-24 w-full" />
            </Card>
          </div>
        )}

        {bios && (
          <div className="space-y-4">
            {bios.bios.map((bio, index) => (
              <Card key={index} className="p-4 md:p-6">
                <div className="flex justify-between items-start gap-4">
                    <p className="text-muted-foreground whitespace-pre-wrap flex-grow">{bio}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(bio)}
                        aria-label="Copiar bio"
                    >
                        <Copy className="h-5 w-5" />
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
