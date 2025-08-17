
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Copy, Zap, Search } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import type { GenerateBioOutput, GenerateBioInput } from '@/ai/flows/generate-bio';
import { handleGenerateBio } from '@/app/actions';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  whatYouDo: z.string().min(1, 'Este campo é obrigatório.'),
  whoYouHelp: z.string().min(1, 'Este campo é obrigatório.'),
  mainResult: z.string().min(1, 'Este campo é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;
type Persona = 'bizu' | 'resenha';

export function BioCreator() {
  const [bios, setBios] = useState<GenerateBioOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatYouDo: '',
      whoYouHelp: '',
      mainResult: '',
    },
  });

  async function onSubmit(values: FormData, persona: Persona) {
    setIsLoading(true);
    setActivePersona(persona);
    setBios(null);
    
    const payload: GenerateBioInput = { ...values, persona };

    try {
      const result = await handleGenerateBio(payload);
      setBios(result);
      toast({
        title: 'Bios Geradas!',
        description: `O ${persona === 'bizu' ? 'Bizu' : 'Resenha'} preparou 3 opções de bio para você.`,
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
      setActivePersona(null);
    }
  }

  const handleButtonClick = (persona: Persona) => {
    form.handleSubmit((values) => onSubmit(values, persona))();
  };


  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copiado!',
      description: 'Bio copiada para a área de transferência.',
    });
  };

  return (
    <div>
      <div className="text-center mt-6 mb-6">
        <h2 className="text-2xl font-bold text-foreground">Escolha seu especialista</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
            O Bizu e a Resenha são estrategistas de marketing, cariocas da gema, prontos para te ajudar. Prefere um papo reto e estratégico? Vá de Bizu. Quer uma ideia mais criativa e magnética? A Resenha resolve.
        </p>
      </div>
      <Card className="p-6 md:p-8">
        <Form {...form}>
          <form className="space-y-6">
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
                          <span className="font-bold">Bio do Bizu</span>
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
                          <span className="font-bold">Bio da Resenha</span>
                      </div>
                      )}
                  </Button>
              </div>
            </div>
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
