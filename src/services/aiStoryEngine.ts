import { PlayerProfile, Club, MatchOutcome, MemoryEvent } from '../types';
import { buildCareerPromptDossier, getRelevantMemories } from './careerMemory';
import { callGeminiJson } from './geminiClient';

export interface GeneratedStoryResult {
  headline: string;
  snippet: string;
  outlet: string;
  socialMediaPost?: {
    author: string;
    handle: string;
    text: string;
    likes: string;
  };
  coachQuote?: string;
  newMemory?: {
    title: string;
    description: string;
    impactSummary: string;
    category: MemoryEvent['category'];
    tags: string[];
    importance: MemoryEvent['importance'];
  };
}

/**
 * Motor Híbrido: Gera notícias e acontecimentos conectados ao passado do atleta.
 * Usa Gemini se houver API key configurada, ou o motor procedural contextual inteligente.
 */
export async function generatePostMatchStory(
  player: PlayerProfile,
  outcome: MatchOutcome,
  apiKey?: string
): Promise<GeneratedStoryResult> {
  const dossier = buildCareerPromptDossier(player, outcome.opponent.name);
  const prompt = `Você é o gerador de notícias e narrativa de um jogo RPG de futebol realista no Brasil (estilo GloboEsporte, UOL Esporte, TNT Sports).
Analise o dossiê do atleta e o resultado do jogo de hoje.
Crie uma repercussão realista, jornalística ou de rede social QUE RECONHEÇA E FAÇA MENÇÃO AO PASSADO OU DECISÕES ANTERIORES DO ATLETA (se houver histórico).

${dossier}

RESULTADO DO JOGO DE HOJE:
- Partida: ${player.currentClub} ${outcome.score.playerTeam} x ${outcome.score.opponentTeam} ${outcome.opponent.name}
- Desempenho do jogador: Nota ${outcome.playerStats.rating.toFixed(1)}, Gols: ${outcome.playerStats.goals}, Assistências: ${outcome.playerStats.assists}, Amarelo: ${outcome.playerStats.yellowCard ? 'Sim' : 'Não'}, Expulso: ${outcome.playerStats.redCard ? 'Sim' : 'Não'}.
- Eventos da partida: ${outcome.highlightMoments.map(h => `${h.minute}' - ${h.text}`).join('; ')}

Responda ESTRITAMENTE em formato JSON com esta estrutura:
{
  "headline": "Manchete impactante do jornal esportivo",
  "snippet": "Parágrafo curto da matéria esportiva conectando a atuação de hoje com a carreira dele ou rivalidades passadas",
  "outlet": "GloboEsporte / UOL Esporte / TNT Sports / CazéTV",
  "socialMediaPost": {
    "author": "Nome de um torcedor ou influencer",
    "handle": "@arroba",
    "text": "Post estilo Twitter/X reagindo à partida e lembrando de algo do jogador",
    "likes": "14.2k"
  },
  "coachQuote": "Frase curta do técnico na coletiva pós-jogo sobre o jogador"
}`;

  const parsed = await callGeminiJson<GeneratedStoryResult>(prompt, {
    temperature: 0.72,
    apiKeyOverride: apiKey
  });

  if (parsed && parsed.headline && parsed.snippet) {
    return parsed;
  }

  // Fallback Procedural de Alta Fidelidade (Zero delay, sem internet)
  return generateProceduralStory(player, outcome);
}

/**
 * Gerador Procedural que amarra o histórico passado mesmo sem depender de API externa
 */
function generateProceduralStory(player: PlayerProfile, outcome: MatchOutcome): GeneratedStoryResult {
  const isWin = outcome.score.playerTeam > outcome.score.opponentTeam;
  const isLoss = outcome.score.playerTeam < outcome.score.opponentTeam;
  const scored = outcome.playerStats.goals > 0;
  const highRating = outcome.playerStats.rating >= 7.5;
  const lowRating = outcome.playerStats.rating < 6.0;
  const oppName = outcome.opponent.shortName || outcome.opponent.name;
  
  const relevantMemories = getRelevantMemories(player, oppName, 2);
  const pastMemory = relevantMemories[0];

  const outlets = ['ge.globo', 'UOL Esporte', 'TNT Sports Brasil', 'Lance!', 'CazéTV'];
  const outlet = outlets[Math.floor(Math.random() * outlets.length)];

  let headline = '';
  let snippet = '';
  let fanText = '';
  let coachQuote = '';

  if (scored && isWin) {
    if (pastMemory && pastMemory.description.toLowerCase().includes(oppName.toLowerCase())) {
      headline = `Carrasco de novo! ${player.surname} decide contra o ${oppName} e reacende rivalidade antiga`;
      snippet = `Com nota ${outcome.playerStats.rating.toFixed(1)}, ${player.name} voltou a ser o pesadelo do ${oppName}. O atleta já tinha histórico no confronto (${pastMemory.title.toLowerCase()}) e hoje não perdoou ao garantir a vitória do ${player.currentClub}.`;
      fanText = `O ${player.surname} simplesmente ODEIA o ${oppName} kkkkkkk toda vez ele amassa eles, ídolo demais!`;
    } else if (player.ovr > 75) {
      headline = `Show de ${player.surname}: Camisa ${player.number} comanda vitória maiúscula do ${player.currentClub}`;
      snippet = `Em tarde inspirada, o meia-atacante de ${player.age} anos mostrou maturidade de veterano. Avaliado em €${player.marketValueEur.toFixed(1)}M, seu nome já volta a circular com força nos bastidores do mercado europeu.`;
      fanText = `Podem colocar a faixa! O homem joga de terno. Não fica no Brasil mais uma temporada nem a pau.`;
    } else {
      headline = `Brilha a joia! ${player.surname} marca na vitória sobre o ${oppName} e ganha moral com a torcida`;
      snippet = `Com apenas ${player.age} anos, ${player.name} foi decisivo na vitória por ${outcome.score.playerTeam} a ${outcome.score.opponentTeam}. A torcida do ${player.currentClub} ovacionou o jovem talento na saída de campo.`;
      fanText = `Menino de ouro! Que estrela tem esse ${player.surname}. Tem que ser titular absoluto!`;
    }
    coachQuote = `"O ${player.surname} vem trabalhando calado e hoje colheu os frutos. Tem muita personalidade para a idade dele."`;
  } else if (isLoss) {
    if (player.relationships.coach < 40) {
      headline = `Clima tenso no vestiário: ${player.currentClub} tropeça e relação de ${player.surname} com a comissão técnica desgasta`;
      snippet = `A derrota por ${outcome.score.opponentTeam} a ${outcome.score.playerTeam} para o ${oppName} escancarou insatisfações. Substituído sob vaias e cara fechada, o jogador não escondeu o incômodo com o esquema tático adotado.`;
      coachQuote = `"Ninguém tem cadeira cativa aqui. Quem não cumprir a função tática, vai pro banco, não importa o nome."`;
      fanText = `Ou esse time acorda ou a crise vai explodir. O ${player.surname} tá visivelmente jogando desmotivado.`;
    } else {
      headline = `${player.currentClub} sofre revés contra o ${oppName} em tarde apagada do setor ofensivo`;
      snippet = `Apesar do empenho individual, ${player.surname} e seus companheiros esbarraram na forte marcação adversária e não conseguiram evitar a derrota.`;
      coachQuote = `"Faltou paciência no último terço do campo. Vamos erguer a cabeça e corrigir na semana de treinos."`;
      fanText = `Jogo horroroso hoje. Não criamos nada contra o ${oppName}. Bora focar na próxima rodada.`;
    }
  } else {
    // Empate
    headline = `Tudo igual: ${player.currentClub} e ${oppName} empatam em duelo equilibrado`;
    snippet = `${player.surname} teve lampejos de criatividade e terminou a partida com nota ${outcome.playerStats.rating.toFixed(1)}. O resultado mantém o clube na disputa pelas primeiras posições da tabela.`;
    coachQuote = `"Foi um jogo muito brigado, clássico é assim. O ponto fora de casa tem seu valor."`;
    fanText = `Dava pra ter vencido se o time arriscasse mais. Mas o ${player.surname} lutou até o final.`;
  }

  return {
    headline,
    snippet,
    outlet,
    socialMediaPost: {
      author: 'Central da Torcida',
      handle: '@central_futebol',
      text: fanText,
      likes: `${(Math.random() * 8 + 1).toFixed(1)}k`
    },
    coachQuote
  };
}
