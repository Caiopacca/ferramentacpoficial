import { ContentGenerator } from '@/components/content-generator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Fábrica de Conteúdo com IA
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Selecione seu nicho e objetivo para receber 7 dias de ideias de posts geradas por nossa Inteligência Artificial. Diga adeus ao bloqueio criativo!
          </p>
        </header>
        <ContentGenerator />
      </div>
    </main>
  );
}
