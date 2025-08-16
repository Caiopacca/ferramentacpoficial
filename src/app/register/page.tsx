
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, UserPlus, Mail } from 'lucide-react';
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
import { RdStationIntegration } from '@/components/rd-station-integration';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from '@/components/ui/alert-dialog';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').describe('Nome do lead'),
  phone: z.string().min(10, 'O telefone deve ter pelo menos 10 caracteres.').describe('Telefone do lead'),
  email: z.string().email('Por favor, insira um e-mail válido.').describe('Email do lead'),
  cityState: z.string().min(1, 'Este campo é obrigatório.').describe('Cidade e Estado'),
  company: z.string().min(1, 'Este campo é obrigatório.').describe('Empresa do lead'),
  instagram: z.string().min(1, 'Este campo é obrigatório.').refine(val => val.startsWith('@'), { message: 'O perfil deve começar com @.' }).describe('Instagram do lead'),
  segment: z.string().min(1, 'Este campo é obrigatório.').describe('Segmento da empresa'),
  monthlyBilling: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Faturamento mensal'),
  marketingExperience: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Experiência com marketing'),
  mainChallenge: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Principal desafio de marketing'),
  urgency: z.string({ required_error: 'Por favor, selecione uma opção.'}).describe('Urgência para solução'),
  willInvest: z.string().min(1, 'Este campo é obrigatório.').describe('Disponibilidade para investir'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.').describe('Senha do usuário'),
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
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mailtoLink, setMailtoLink] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      cityState: '',
      company: '',
      instagram: '',
      segment: '',
      willInvest: '',
      password: '',
    },
  });

  function generateMailtoLink(values: FormData) {
    const recipientEmail = "seu-email-aqui@exemplo.com"; // IMPORTANTE: Troque pelo seu email
    const subject = encodeURIComponent("Novo Lead do Site CP Marketing");
    const body = encodeURIComponent(
      `Um novo lead se cadastrou através das ferramentas de IA.

Aqui estão os detalhes:
--------------------------------------------------
Nome: ${values.name}
Telefone: ${values.phone}
Email: ${values.email}
Cidade/Estado: ${values.cityState}
Empresa: ${values.company}
Instagram: ${values.instagram}
Segmento: ${values.segment}
--------------------------------------------------
QUALIFICAÇÃO
--------------------------------------------------
Faturamento Mensal: ${values.monthlyBilling}
Experiência com Marketing: ${values.marketingExperience}
Principal Desafio: ${values.mainChallenge}
Urgência: ${values.urgency}
Disposto(a) a investir: ${values.willInvest}
--------------------------------------------------
`
    );
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  }


  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSubmissionData(values); // Para a integração RD Station (mesmo que falhe)

    localStorage.setItem('registeredUser', JSON.stringify({ email: values.email, password: values.password }));
    
    const link = generateMailtoLink(values);
    setMailtoLink(link);

    toast({
      title: 'Conta Criada com Sucesso!',
      description: 'Agora, por favor, envie os dados para nós por e-mail.',
    });

    setIsAlertOpen(true);
    // Não paramos o loading aqui, ele continua até o usuário fechar o alerta
  }

  const handleAlertAction = () => {
    setIsAlertOpen(false);
    setIsLoading(false);
    router.push('/login');
  }


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
                                <FormItem>
                                    <FormLabel>Quanto a sua empresa fatura por mês?*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billingOptions.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="marketingExperience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Já contou com o trabalho de algum profissional de marketing digital ou agência?*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {experienceOptions.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                        )} />
                        
                        <FormField
                            control={form.control}
                            name="mainChallenge"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qual seu principal desafio com o marketing da sua empresa?*</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {challengeOptions.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                        )} />
                        
                        <FormField
                            control={form.control}
                            name="urgency"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Qual a urgência para solucionar esse desafio?*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {urgencyOptions.map(option => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            Aguardando envio do e-mail...
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

            {/* Alerta para guiar o envio do e-mail */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Passo Final: Envie-nos seus dados</AlertDialogTitle>
                    <AlertDialogDescription>
                        Para garantir que recebamos suas informações, por favor, clique no botão abaixo para abrir seu aplicativo de e-mail e nos enviar os dados do seu cadastro.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <Button asChild size="lg">
                            <a href={mailtoLink} onClick={handleAlertAction}>
                                <Mail className="mr-2 h-4 w-4" />
                                Abrir e-mail e ir para Login
                            </a>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* A integração com RD Station ainda tenta ser executada */}
            {submissionData && (
                <RdStationIntegration 
                    data={submissionData} 
                    onConversion={() => console.log('Tentativa de conversão RD Station finalizada.')} 
                />
            )}
        </div>
    </main>
  );
}

    