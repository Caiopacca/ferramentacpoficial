
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserPlus } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RdStationIntegration } from '@/components/rd-station-integration';


const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').describe('Nome do lead'),
  phone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres.').describe('Telefone do lead'),
  email: z.string().email('Por favor, insira um e-mail válido.').describe('Email do lead'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').describe('Senha do usuário'),
  cityState: z.string().min(1, 'Este campo é obrigatório.').describe('Cidade e Estado'),
  company: z.string().min(1, 'Este campo é obrigatório.').describe('Empresa do lead'),
  instagram: z.string().min(1, 'Este campo é obrigatório.').refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.' }).describe('Instagram do lead'),
  segment: z.string().min(1, 'Este campo é obrigatório.').describe('Segmento da empresa'),
  monthlyBilling: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Faturamento mensal'),
  marketingExperience: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Experiência com marketing'),
  mainChallenge: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Principal desafio de marketing'),
  urgency: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Urgência para solução'),
  willInvest: z.string().min(1, 'Este campo é obrigatório.').describe('Disponibilidade para investir'),
});

const billingOptions = [
    'Até 10 mil reais',
    'De 10 a 30 mil reais',
    'De 30 a 50 mil reais',
    'De 50 a 100 mil reais',
    'De 100 a 500 mil reais',
    'De 500 a 1 milhão de reais',
    'Acima de 1 milhão de reais',
];

const experienceOptions = [
    'Sim, tenho atualmente e não estou satisfeito',
    'Sim, tenho atualmente e estou satisfeito',
    'Ja tive, mais não tenho mais',
    'Nunca tive',
];

const challengeOptions = [
    'Escassez de procura',
    'Falta de presença digital forte',
    'Não saber o que performa',
    'Marketing e vendas não conectam',
    'Redes sociais sem resultado',
    'Leads perdidos no caminho',
];

const urgencyOptions = [
    'Tenho pressa',
    'Ainda estou pesquisando',
    'Não tenho pressa',
];

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submissionData, setSubmissionData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      cityState: '',
      company: '',
      instagram: '',
      segment: '',
      willInvest: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    
    // Armazena os dados para enviar ao RD Station
    setSubmissionData(values);

    // Salva os dados de login localmente
    localStorage.setItem('registeredUser', JSON.stringify({ email: values.email, password: values.password }));
    
    // A simulação de API não é mais necessária aqui,
    // o componente RdStationIntegration cuidará do envio.
    
    toast({
      title: 'Conta Criada com Sucesso!',
      description: 'Enviando seus dados e redirecionando para o login...',
    });
  }

  const handleConversion = () => {
    // Redireciona após a conversão no RD Station ter sido processada
    setTimeout(() => {
        router.push('/login');
        setIsLoading(false);
    }, 1500); // Dá um tempo para o envio ocorrer
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
       <div className="w-full max-w-2xl py-12">
            <header className="text-center mb-8">
                <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
                <h1 className="text-3xl font-bold text-primary tracking-tight">
                    Criar Nova Conta
                </h1>
                <p className="text-muted-foreground mt-2">
                    Preencha os dados para se registrar e acessar as ferramentas.
                </p>
            </header>
            <Card>
                <CardHeader>
                    <CardTitle>Formulário de Registro</CardTitle>
                    <CardDescription>Complete suas informações para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nome*</FormLabel><FormControl><Input placeholder="Seu nome completo" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormLabel>Telefone*</FormLabel><FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email*</FormLabel><FormControl><Input type="email" placeholder="seuemail@exemplo.com" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="cityState" render={({ field }) => (
                                <FormItem><FormLabel>Qual é a sua cidade e estado?*</FormLabel><FormControl><Input placeholder="Ex: Goiânia, GO" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="company" render={({ field }) => (
                                <FormItem><FormLabel>Empresa*</FormLabel><FormControl><Input placeholder="Nome da sua empresa" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="instagram" render={({ field }) => (
                            <FormItem><FormLabel>Qual é o @ do Instagram do seu negócio ou perfil pessoal mais ativo?*</FormLabel><FormControl><Input placeholder="@seu_negocio" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField control={form.control} name="segment" render={({ field }) => (
                            <FormItem><FormLabel>Qual é o segmento da sua empresa?*</FormLabel><FormControl><Input placeholder="Ex: Saúde, Varejo, Tecnologia" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="monthlyBilling"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Quanto a sua empresa fatura por mês?*</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {billingOptions.map(option => (
                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value={option} /></FormControl>
                                                <FormLabel className="font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )} />

                         <FormField
                            control={form.control}
                            name="marketingExperience"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Já contou com o trabalho de algum profissional de marketing digital ou agência?*</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {experienceOptions.map(option => (
                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value={option} /></FormControl>
                                                <FormLabel className="font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="mainChallenge"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Qual seu principal desafio com o marketing da sua empresa?*</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {challengeOptions.map(option => (
                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value={option} /></FormControl>
                                                <FormLabel className="font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Qual a urgência para solucionar esse desafio?*</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                        {urgencyOptions.map(option => (
                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value={option} /></FormControl>
                                                <FormLabel className="font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="willInvest"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Você está disposto (a) a investir no marketing da sua empresa?*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sua resposta" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem><FormLabel>Crie uma Senha*</FormLabel><FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />


                        <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finalizando Cadastro...
                            </>
                        ) : (
                            <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Finalizar Cadastro e Acessar Ferramentas
                            </>
                        )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
                 <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Já tem uma conta?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Faça login
                        </Link>
                    </p>
                </CardContent>
            </Card>
            {submissionData && (
                <RdStationIntegration 
                    data={submissionData} 
                    onConversion={handleConversion} 
                />
            )}
        </div>
    </main>
  );
}
