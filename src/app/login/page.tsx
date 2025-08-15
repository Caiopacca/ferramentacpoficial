
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lock } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const formSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Simulação de autenticação
    // Em um aplicativo real, isso seria uma chamada para sua API
    if (values.email === 'admin@cpmarketing.com' && values.password === 'CpMarketing@10') {
      localStorage.setItem('user', JSON.stringify({ email: values.email }));
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para as ferramentas.',
      });
      router.push('/');
    } else {
      toast({
        title: 'Erro de Login',
        description: 'E-mail ou senha incorretos. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <div className="w-full max-w-md">
            <header className="text-center mb-8">
                <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
                <h1 className="text-3xl font-bold text-primary tracking-tight">
                    Acesso Restrito
                </h1>
                <p className="text-muted-foreground mt-2">
                    Faça login para acessar a caixa de ferramentas.
                </p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Insira suas credenciais para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                            </>
                        ) : (
                            <>
                            <Lock className="mr-2 h-4 w-4" />
                            Entrar
                            </>
                        )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
