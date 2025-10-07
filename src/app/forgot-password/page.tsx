
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Send } from 'lucide-react';
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
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: 'Link Enviado!',
        description: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Erro ao Enviar',
        description: 'Não foi possível enviar o e-mail de redefinição. Verifique o e-mail e tente novamente.',
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
                    Redefinir Senha
                </h1>
                <p className="text-muted-foreground mt-2">
                    Insira seu e-mail para receber o link de redefinição.
                </p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Esqueceu sua senha?</CardTitle>
                    <CardDescription>Sem problemas. Nós te ajudamos a recuperá-la.</CardDescription>
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
                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                            </>
                        ) : (
                            <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Link
                            </>
                        )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Lembrou da senha?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Voltar para o login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
