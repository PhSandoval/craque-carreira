import { MemoryEvent, PlayerProfile } from '../types';

export function createMemory(
  player: PlayerProfile,
  params: {
    title: string;
    description: string;
    category: MemoryEvent['category'];
    impactSummary: string;
    tags: string[];
    importance?: MemoryEvent['importance'];
  }
): MemoryEvent {
  return {
    id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    age: player.age,
    seasonYear: player.seasonYear,
    club: player.currentClub,
    dateStr: `Ano ${player.seasonYear} • ${player.age} anos`,
    title: params.title,
    description: params.description,
    category: params.category,
    impactSummary: params.impactSummary,
    tags: params.tags,
    importance: params.importance || 'media'
  };
}

/**
 * Retorna as memórias mais relevantes para a partida ou evento atual.
 * Ex: Se vai jogar contra o Inter, busca histórico contra o Inter ou fatos de alta importância.
 */
export function getRelevantMemories(
  player: PlayerProfile,
  contextOpponent?: string,
  limit: number = 5
): MemoryEvent[] {
  if (!player.memories || player.memories.length === 0) return [];

  // Ordena por relevância contextual:
  // 1. Menciona o clube adversário
  // 2. Importância 'lendaria' ou 'alta'
  // 3. Mais recentes
  const scored = [...player.memories].map(mem => {
    let score = 0;
    if (contextOpponent) {
      const oppLower = contextOpponent.toLowerCase();
      if (mem.description.toLowerCase().includes(oppLower) || mem.tags.some(t => t.toLowerCase().includes(oppLower))) {
        score += 50;
      }
    }
    if (mem.importance === 'lendaria') score += 30;
    if (mem.importance === 'alta') score += 20;
    if (mem.age === player.age) score += 10;
    return { mem, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.mem);
}

/**
 * Gera um resumo textual compacto ("Dossiê de Carreira") para ser injetado na IA.
 * Esse resumo consome menos de 150 tokens, deixando a IA instantânea e barata.
 */
export function buildCareerPromptDossier(player: PlayerProfile, opponentName?: string): string {
  const relevantMemories = getRelevantMemories(player, opponentName, 4);

  const memoriesText = relevantMemories.length > 0
    ? relevantMemories.map(m => `- [${m.age} anos no ${m.club}]: ${m.title} (${m.impactSummary})`).join('\n')
    : "- Início de carreira profissional, ainda sem grandes polêmicas ou títulos.";

  return `
DOSSIÊ DO ATLETA:
- Nome: ${player.name} "${player.surname}" (#${player.number})
- Idade / Posição: ${player.age} anos | ${player.position} (${player.preferredFoot})
- Clube Atual: ${player.currentClub} | OVR: ${player.ovr} | Valor: €${player.marketValueEur.toFixed(1)}M
- Personalidade & Arquétipo: [${player.personalityTags.join(', ')}]
- Relações: Técnico: ${player.relationships.coach}/100 | Torcida: ${player.relationships.fans}/100 | Diretoria: ${player.relationships.board}/100
- Rivais conhecidos: [${player.rivals.join(', ') || 'Nenhum'}]
- FATOS MARCANTES LEMBRADOS PELA HISTÓRIA:
${memoriesText}
`.trim();
}
