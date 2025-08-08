
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <Card className="mt-12 w-full bg-primary/5 border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl md:text-3xl text-primary">Sua empresa não cresce?</CardTitle>
        <CardDescription className="text-lg text-muted-foreground max-w-xl mx-auto">
          Temos o mapa exato para mais vendas, leads e lucro. Fale com um especialista, de graça.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link href="https://caiopaulino.com/consultoria-gratuita/" target="_blank" passHref>
          <Button size="lg">
            Quero Falar com um Especialista
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
