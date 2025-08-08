
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ToolsPage() {
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
          <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Fábrica de Conteúdo</CardTitle>
              <CardDescription>
                Gere 7 dias de ideias de posts para seu nicho e objetivo com o poder da IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div 
                    data-ai-hint="social media marketing"
                    className="aspect-video bg-cover rounded-md"
                    style={{backgroundImage: "url('https://placehold.co/600x400.png')"}}>
                </div>
            </CardContent>
            <CardFooter>
              <Link href="/content-factory" passHref className="w-full">
                <Button className="w-full">
                  Usar Ferramenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Radar de Concorrência</CardTitle>
              <CardDescription>
                Analise seu perfil do Instagram em comparação com seus concorrentes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div 
                    data-ai-hint="business competition analysis"
                    className="aspect-video bg-cover rounded-md"
                    style={{backgroundImage: "url('https://placehold.co/600x400.png')"}}>
                </div>
            </CardContent>
            <CardFooter>
              <Link href="/competition-analyzer" passHref className="w-full">
                <Button className="w-full">
                  Usar Ferramenta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
