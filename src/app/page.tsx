
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import { ArrowRight, LogOut, Zap, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { CtaSection } from '@/components/cta-section';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const tools = [
  {
    href: '/profile-analyzer',
    title: 'Analisador de Perfil',
    description: 'Receba um diagnóstico do seu perfil do Instagram com nota e pontos de melhoria.',
    hint: 'instagram performance analysis',
  },
  {
    href: '/bio-creator',
    title: 'Criador de Bio Magnética',
    description: 'Crie biografias otimizadas para o seu perfil do Instagram em segundos.',
    hint: 'instagram profile user',
  },
  {
    href: '/content-factory',
    title: 'Fábrica de Conteúdo',
    description: 'Gere 7 dias de ideias de posts para seu nicho e objetivo com o poder da IA.',
    hint: 'social media marketing',
  },
  {
    href: '/reel-script-writer',
    title: 'Roteiro de Reels',
    description: 'Gere roteiros de 15 e 30 segundos para um Reel com base em um tema e nicho.',
    hint: 'video script writing',
  },
  {
    href: '/traffic-calculator',
    title: 'Calculadora de Tráfego Pago',
    description: 'Descubra o investimento necessário em tráfego e o retorno esperado para atingir suas metas.',
    hint: 'paid traffic calculator',
  },
  {
    href: '/competition-analyzer',
    title: 'Radar de Concorrência',
    description: 'Analise seu perfil do Instagram em comparação com seus concorrentes.',
    hint: 'business competition analysis',
  },
  {
    href: '/hashtag-strategist',
    title: 'O Hashtag Mestre',
    description: 'Gere 3 grupos de hashtags (nicho, volume, localização) para seus posts.',
    hint: 'social media hashtags',
  },
  {
    href: '/ad-analyzer',
    title: 'Raio-X de Anúncios',
    description: 'Avalie a coerência do seu anúncio (público, copy e criativo) antes de investir.',
    hint: 'advertising campaign review',
  },
  {
    href: '/roi-calculator',
    title: 'Calculadora de ROI',
    description: 'Calcule o potencial de retorno sobre seu investimento em marketing.',
    hint: 'return on investment calculator',
  },
  {
    href: '/copy-analyzer',
    title: 'Detector de Legendas Vendedoras',
    description: 'Receba um feedback instantâneo sobre o poder de persuasão da sua legenda.',
    hint: 'copywriting analysis text',
  },
  {
    href: '/email-subject-generator',
    title: 'Gerador de Títulos Persuasivos',
    description: 'Crie 5 opções de títulos de e-mail persuasivos para prospecção fria.',
    hint: 'email marketing outreach',
  },
  {
    href: '/cold-email-generator',
    title: 'Gerador de E-mail de Prospecção',
    description: 'Crie um corpo de e-mail persuasivo para prospecção fria com base no cargo e objetivo.',
    hint: 'email marketing cold',
  },
];

export default function ToolsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (isLoading) {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
            <div className="w-full max-w-7xl">
                <header className="text-center mb-8 md:mb-12">
                    <Skeleton className="w-16 h-16 rounded-md mx-auto mb-4" />
                    <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <Card key={i} className="flex flex-col h-full">
                            <CardHeader className="flex-grow">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
  }

  if (!isAuthenticated) {
    return null; // ou um loader, já que o redirect está acontecendo
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-7xl">
        <header className="relative text-center mb-8 md:mb-12">
          <Button onClick={handleLogout} variant="outline" className="absolute top-0 right-0">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
          <Image src="https://firebasestorage.googleapis.com/v0/b/site-cp-marketing.firebasestorage.app/o/LOGO%20REDONDA%20EM%20SVG%20CP.svg?alt=media&token=973b78cf-9a80-4c4a-bac0-a66a058c392d" alt="Logo CP Marketing" width={60} height={60} className="mx-auto mb-4 rounded-md" />
            <div className="flex justify-center items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
                  Caixa de Ferramentas da CP Marketing
              </h1>
            </div>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossas ferramentas gratuitas de IA para otimizar o marketing do seu perfil e negócio.
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">
            A IA pode cometer erros. Considere verificar informações importantes.
          </p>
        </header>

        <Card className="mb-12 bg-card-foreground/5 border-primary/20">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Conheça Nossos Especialistas de IA</CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                Duas personalidades, um objetivo: acelerar seus resultados.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 p-6">
                <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
                    <div className="p-2 bg-primary/20 rounded-full mb-3">
                        <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">O Bizu</h3>
                    <p className="font-semibold text-primary/90 text-sm mb-2">O Estrategista</p>
                    <p className="text-muted-foreground text-sm">
                        Carioca, papo reto e focado em conversão. O Bizu analisa seus dados com um olhar clínico para performance, clareza e resultados financeiros. Ideal para quem busca a rota mais rápida para o lucro.
                    </p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-card rounded-lg">
                    <div className="p-2 bg-primary/20 rounded-full mb-3">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">A Resenha</h3>
                    <p className="font-semibold text-primary/90 text-sm mb-2">A Criativa</p>
                    <p className="text-muted-foreground text-sm">
                        Também carioca, mas com foco em criatividade e conexão. A Resenha avalia sua comunicação, storytelling e o poder da sua marca de criar uma comunidade. Ideal para quem quer construir um legado e uma audiência fiel.
                    </p>
                </div>
            </CardContent>
        </Card>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tools.map((tool) => (
            <Card key={tool.href} data-ai-hint={tool.hint} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex-grow">
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={tool.href} passHref className="w-full">
                  <Button className="w-full">
                    Usar Ferramenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <CtaSection />
      </div>
    </main>
  );
}
