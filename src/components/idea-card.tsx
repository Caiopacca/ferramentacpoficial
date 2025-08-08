
'use client';

import {
  Clapperboard,
  GalleryHorizontal,
  History,
  Copy,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { GenerateContentIdeasOutput } from '@/ai/flows/generate-content-ideas';
import { Badge } from './ui/badge';

type Idea = GenerateContentIdeasOutput['contentIdeas'][0];

interface IdeaCardProps {
  day: number;
  idea: Idea;
}

const formatMap: {
  [key: string]: { icon: React.ReactNode; className: string };
} = {
  Reel: {
    icon: <Clapperboard className="h-4 w-4" />,
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
  },
  Carousel: {
    icon: <GalleryHorizontal className="h-4 w-4" />,
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  },
  Story: {
    icon: <History className="h-4 w-4" />,
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
};

export function IdeaCard({ day, idea }: IdeaCardProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    const textToCopy = `Dia ${day} - ${idea.format}\nTítulo: ${idea.title}\nDescrição: ${idea.description}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copiado!',
      description: 'Ideia de conteúdo copiada para a área de transferência.',
    });
  };

  const formatInfo = formatMap[idea.format] || {
    icon: null,
    className: 'bg-secondary',
  };

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl">Dia {day}</CardTitle>
          <Badge variant="outline" className={`gap-2 ${formatInfo.className}`}>
            {formatInfo.icon}
            {idea.format}
          </Badge>
        </div>
        <CardDescription className="text-base font-semibold text-foreground h-12">
          {idea.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{idea.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" onClick={handleCopy} className="w-full justify-start text-muted-foreground hover:text-primary">
          <Copy className="mr-2 h-4 w-4" />
          Copiar Ideia
        </Button>
      </CardFooter>
    </Card>
  );
}
