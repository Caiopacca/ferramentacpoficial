
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    {
      href: '/profile-analyzer',
      title: 'Analisador de Perfil com IA',
      description: 'Receba um diagnóstico do seu perfil do Instagram com nota e pontos de melhoria.',
      hint: 'instagram performance analysis',
    },
    {
      href: '/competition-analyzer',
      title: 'Radar de Concorrência',
      description: 'Analise seu perfil do Instagram em comparação com seus concorrentes.',
      hint: 'business competition analysis',
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
      href: '/reel-script-writer',
      title: 'Roteirista de Reels com IA',
      description: 'Gere um roteiro de 15 segundos para um Reel com base em um tema e nicho.',
      hint: 'video script writing',
    },
    {
      href: '/ad-analyzer',
      title: 'Raio-X de Anúncios',
      description: 'Avalie a coerência do seu anúncio (público, copy e criativo) antes de investir.',
      hint: 'advertising campaign review',
    },
  ];


  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
            <Link href="/" passHref>
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                </Button>
            </Link>
        </div>
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Nossas Ferramentas
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossas ferramentas de IA para otimizar seu marketing de conteúdo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Card key={tool.href} className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                  <div 
                      data-ai-hint={tool.hint}
                      className="aspect-video bg-cover rounded-md"
                      style={{backgroundImage: "url('https://placehold.co/600x400.png')"}}>
                  </div>
              </CardContent>
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
      </div>
    </main>
  );
}
