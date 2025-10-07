
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

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

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para as ferramentas.',
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = 'E-mail ou senha incorretos. Por favor, tente novamente.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'E-mail ou senha inválidos.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Acesso temporariamente desabilitado devido a muitas tentativas. Tente novamente mais tarde.';
      }
      toast({
        title: 'Erro de Login',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <div className="w-full max-w-md">
            <header className="text-center mb-8">
                <Image src="https://res.cloudinary.com/dp3gukavt/image/upload/v1759844468/Prancheta_1_1_rxjl52.png" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
                <h1 className="text-3xl font-bold text-primary tracking-tight">
                    Ferramentas de IA da CP Marketing
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
                 <CardFooter className="flex-col items-start gap-4">
                    <Separator />
                    <div className="flex justify-between w-full text-sm">
                        <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                            Criar nova conta
                        </Link>
                        <Link href="/forgot-password" className="text-muted-foreground hover:text-primary transition-colors">
                            Esqueceu sua senha?
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    </main>
  );
}
