
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import type { GenerateReelScriptOutput } from '@/ai/flows/generate-reel-script';
import { Lightbulb, Music, Video } from 'lucide-react';

interface ScriptResultDisplayProps {
  result: GenerateReelScriptOutput;
}

export function ScriptResultDisplay({ result }: ScriptResultDisplayProps) {
  const sceneLabels = ['Gancho', 'Desenvolvimento', 'CTA'];

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{result.title}</CardTitle>
          <CardDescription>
            Aqui está o seu roteiro completo. Siga os passos para criar um vídeo magnético!
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <Video className="h-6 w-6 text-primary" />
            <CardTitle>Plano de Cenas</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px]">Etapa</TableHead>
                    <TableHead>Cena (O que mostrar)</TableHead>
                    <TableHead>Áudio / Texto</TableHead>
                    <TableHead className="text-right">Tempo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {result.scenePlan.map((scene, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{sceneLabels[index]}</TableCell>
                        <TableCell>{scene.scene}</TableCell>
                        <TableCell>{scene.audioText}</TableCell>
                        <TableCell className="text-right">{scene.time}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                <CardTitle>Dica de Ouro</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{result.proTip}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <Music className="h-6 w-6 text-rose-400" />
                <CardTitle>Sugestão de Áudio</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{result.audioSuggestion}</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
