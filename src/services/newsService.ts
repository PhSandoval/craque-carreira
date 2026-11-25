import { PlayerProfile, Club, MatchOutcome, NewsArticle } from '../types';
import { CLUBS } from '../data/clubs';

const OUTLETS = [
  { name: 'ge.globo', badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60' },
  { name: 'UOL Esporte', badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60' },
  { name: 'TNT Sports', badgeColor: 'text-sky-400 border-sky-800 bg-sky-950/60' },
  { name: 'ESPN Brasil', badgeColor: 'text-rose-400 border-rose-800 bg-rose-950/60' },
  { name: 'CazéTV', badgeColor: 'text-purple-400 border-purple-800 bg-purple-950/60' },
  { name: 'Lance!', badgeColor: 'text-blue-400 border-blue-800 bg-blue-950/60' }
];

const FAN_HANDLES = [
  { author: 'Craque da Rodada', handle: '@craque_rodada' },
  { author: 'Resenha da Bola', handle: '@resenha_tatica' },
  { author: 'Central do Futebol', handle: '@central_futebol' },
  { author: 'Scout Brasileiro', handle: '@scout_br' },
  { author: 'Guia da Bola', handle: '@guiadabola' }
];

/**
 * Gera um artigo de notícia dinâmico e realista para a partida recém-finalizada.
 */
export function generateMatchNewsArticle(
  player: PlayerProfile,
  opponent: Club,
  outcome: MatchOutcome,
  interviewAnswer?: any
): NewsArticle {
  const isWin = outcome.score.playerTeam > outcome.score.opponentTeam;
  const isLoss = outcome.score.playerTeam < outcome.score.opponentTeam;
  const scored = outcome.playerStats.goals > 0;
  const assists = outcome.playerStats.assists > 0;
  const oppName = opponent.shortName || opponent.name;
  const playerClubObj = CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];
  const coachName = playerClubObj.coachName || 'Eduardo Baptista';

  const outletObj = OUTLETS[Math.floor(Math.random() * OUTLETS.length)];
  const fanAccount = FAN_HANDLES[Math.floor(Math.random() * FAN_HANDLES.length)];

  let headline = '';
  let snippet = '';
  let fanComment = '';
  let coachQuote = '';

  if (outcome.playerStats.goals >= 2) {
    headline = `DOBLETE DE ${player.surname.toUpperCase()}! Camisa #${player.number} comanda goleada do ${player.currentClub} contra o ${oppName}`;
    snippet = `Em noite inspirada no estádio, o jovem ${player.name} "${player.surname}" destruiu o sistema defensivo do ${oppName} marcando 2 gols e recebendo nota ${outcome.playerStats.rating.toFixed(1)}. O atleta de ${player.age} anos foi eleito o craque da partida com sobras.`;
    fanComment = `Que atuação absurda do ${player.surname}! Jogou como veterano, fez dois gols de placa e ainda chamou a responsabilidade. Fenômeno!`;
    coachQuote = `"O ${player.surname} tem uma maturidade fora da curva para a idade dele. Hoje ele decidiu o jogo no talento e na disciplina." - disse o técnico ${coachName}.`;
  } else if (scored && isWin) {
    headline = `Brilha a joia! ${player.surname} estufa as redes e garante vitória do ${player.currentClub} sobre o ${oppName}`;
    snippet = `Com oportunismo e pontaria afiada, ${player.surname} balançou as redes na vitória por ${outcome.score.playerTeam} a ${outcome.score.opponentTeam} diante do ${oppName}. O gol consolida o momento positivo do camisa #${player.number} na temporada 2026.`;
    fanComment = `Menino iluminado! Mais um gol de ${player.surname} com a camisa do ${player.currentClub}. A torcida já tem o seu novo xodó!`;
    coachQuote = `"A dedicação dele nos treinos durante a semana se refletiu dentro de campo hoje. Vitória merecida e importante para a tabela."`;
  } else if (assists && isWin) {
    headline = `Garçom de ouro: ${player.surname} desfila visão de jogo e lidera triunfo do ${player.currentClub}`;
    snippet = `Atuando como verdadeiro camisa 10, ${player.surname} deu passes cirúrgicos na vitória por ${outcome.score.playerTeam} a ${outcome.score.opponentTeam} contra o ${oppName}. Sua leitura entrelinhas desmontou o ferrolho adversário.`;
    fanComment = `Que passe açucarado do ${player.surname}! Quem tem um meia desse calibre no time não passa sufoco. Visão de jogo pura!`;
    coachQuote = `"Ele tem uma leitura de jogo fantástica. Enxerga os espaços antes dos marcadores e joga para o time."`;
  } else if (isWin) {
    headline = `Triunfo sólido: ${player.currentClub} bate o ${oppName} por ${outcome.score.playerTeam} a ${outcome.score.opponentTeam} com controle tático de ${player.surname}`;
    snippet = `Em duelo acirrado na Rodada ${player.currentMatchDay}, o ${player.currentClub} conquistou três pontos vitais contra o ${oppName}. ${player.surname} fechou a partida com nota ${outcome.playerStats.rating.toFixed(1)} e liderou as transições de meio-campo.`;
    fanComment = `Três pontos fundamentais na tabela! Vitória com raça e obediência tática de todo o elenco.`;
    coachQuote = `"Soubemos sofrer nos momentos certos e aproveitar as brechas. Vitória maiúscula do grupo."`;
  } else if (isLoss) {
    headline = `${player.currentClub} tropeça contra o ${oppName} em tarde truncada; ${player.surname} lamenta revés`;
    snippet = `Mesmo com a entrega do camisa #${player.number}, o ${player.currentClub} acabou derrotado por ${outcome.score.opponentTeam} a ${outcome.score.playerTeam} pelo ${oppName}. A partida teve forte disputa física e pouca margem para manobras ofensivas.`;
    fanComment = `Jogo difícil hoje, o ${oppName} travou o meio-campo. O ${player.surname} tentou carregar a bola, mas faltou pontaria no ataque. Erguer a cabeça e focar na próxima!`;
    coachQuote = `"Faltou calibrar a tomada de decisão no último terço. Vamos corrigir esses detalhes nos treinos da semana."`;
  } else {
    // Empate
    headline = `Empate movimentado: ${player.currentClub} e ${oppName} ficam no ${outcome.score.playerTeam}x${outcome.score.opponentTeam} em duelo aberto`;
    snippet = `Em confronto direto disputado palmo a palmo, ${player.currentClub} e ${oppName} empataram. ${player.surname} teve boa participação nos lances de perigo e o resultado mantém a equipe na briga pelos objetivos do ano.`;
    fanComment = `Jogo aberto demais! Dava pra ter saído com a vitória se a bola entrasse naquela chance do final, mas pontuamos.`;
    coachQuote = `"Foi um jogo franco e disputado. O ponto somado mantém nossa consistência no campeonato."`;
  }

  const interviewQuote = interviewAnswer
    ? `"${interviewAnswer.text}" - declarou ${player.surname} na Zona Mista.`
    : undefined;

  return {
    id: `news_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    round: player.currentMatchDay,
    matchDay: player.currentMatchDay,
    dateStr: `Rodada ${player.currentMatchDay} • Temporada 2026`,
    outlet: outletObj.name,
    badgeColor: outletObj.badgeColor,
    category: 'match',
    categoryLabel: scored ? 'Destaque da Rodada' : isWin ? 'Vitória & Tabela' : isLoss ? 'Pós-Jogo' : 'Resultado da Rodada',
    headline,
    snippet,
    socialMediaPost: {
      author: fanAccount.author,
      handle: fanAccount.handle,
      text: fanComment,
      likes: `${(Math.random() * 9 + 2).toFixed(1)}k`,
      comments: `${Math.floor(Math.random() * 400 + 80)}`
    },
    coachQuote,
    interviewQuote
  };
}

/**
 * Garante que o jogador sempre tenha um feed de notícias rico e atualizado,
 * gerando notícias retroativas para as partidas e memórias já jogadas caso esteja vazio.
 */
export function createNewsArticle(params: {
  outlet: string;
  headline: string;
  snippet: string;
  category: 'match' | 'interview' | 'transfer' | 'milestone';
  categoryLabel: string;
  badgeColor: string;
  dateStr: string;
}): NewsArticle {
  return {
    id: 'news_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    round: 1,
    matchDay: 1,
    ...params
  };
}

export function getOrInitNewsFeed(player: PlayerProfile): NewsArticle[] {
  if (player.newsFeed && player.newsFeed.length > 0) {
    return player.newsFeed;
  }

  const feed: NewsArticle[] = [];
  const gamesPlayed = player.currentSeasonStats?.games || 0;
  const goals = player.currentSeasonStats?.goals || 0;

  // Se já jogou partidas, gera as matérias reais de cada rodada
  if (gamesPlayed > 0) {
    feed.push({
      id: 'news_round_recent',
      round: player.currentMatchDay,
      matchDay: player.currentMatchDay,
      dateStr: `Rodada ${player.currentMatchDay} • Brasileirão Série B`,
      outlet: 'ge.globo',
      badgeColor: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
      category: 'match',
      categoryLabel: 'Análise da Rodada',
      headline: `Raio-X de ${player.surname}: Joia do ${player.currentClub} soma ${goals} gols e lidera ofensiva da equipe`,
      snippet: `Com ${gamesPlayed} partidas disputadas na temporada 2026 e ${goals} gol(s) anotado(s), o jovem camisa #${player.number} de ${player.age} anos vem se consolidando como a principal referência técnica sob o comando de Eduardo Baptista.`,
      socialMediaPost: {
        author: 'Central do Futebol',
        handle: '@central_futebol',
        text: `O garoto ${player.surname} tá jogando muita bola pelo ${player.currentClub}. Com ${goals} gols na temporada, já começa a despertar sondagens dos gigantes da Série A!`,
        likes: '12.4k',
        comments: '342'
      },
      coachQuote: `"O ${player.surname} tem muita personalidade. Ele sabe quando acelerar e quando cadenciar a jogada."`
    });
  }

  // Notícia de Mercado
  feed.push({
    id: 'news_transfer_scout',
    round: Math.max(1, player.currentMatchDay - 1),
    dateStr: `Atualizado nesta semana`,
    outlet: 'UOL Esporte',
    badgeColor: 'text-amber-400 border-amber-800 bg-amber-950/60',
    category: 'transfer',
    categoryLabel: 'Mercado da Bola',
    headline: `Clubes da Série A monitoram ${player.name} "${player.surname}" no ${player.currentClub}`,
    snippet: `Com valor de mercado estimado em €${player.marketValueEur.toFixed(1)}M, scouts de grandes clubes nacionais e internacionais vêm enviando analistas aos jogos do ${player.currentClub} para acompanhar a movimentação do camisa #${player.number}.`,
    socialMediaPost: {
      author: 'Scout Brasileiro',
      handle: '@scout_br',
      text: `Olho vivo no ${player.surname}! O mapa de calor dele mostra altíssima inteligência tática entrelinhas. Não deve demorar para receber propostas formais na janela de fim de ano.`,
      likes: '8.7k',
      comments: '185'
    }
  });

  // Notícia de Estreia Profissional
  feed.push({
    id: 'news_debut',
    round: 1,
    dateStr: `Temporada 2026 • Início da Carreira`,
    outlet: 'TNT Sports',
    badgeColor: 'text-sky-400 border-sky-800 bg-sky-950/60',
    category: 'milestone',
    categoryLabel: 'Estreia Profissional',
    headline: `Assinatura de Craque: ${player.name} assina contrato profissional e veste a #10 do ${player.currentClub}`,
    snippet: `Aos ${player.age} anos, a promessa foi oficializada como atleta profissional do ${player.currentClub}. Com estilo arrojado e grande refino técnico, a comissão técnica aposta alto no talento do jovem para a temporada.`,
    socialMediaPost: {
      author: 'Voz do Torcedor',
      handle: '@torcida_gremio',
      text: `Bem-vindo aos profissionais, ${player.surname}! Honre o manto e vá pra cima da zaga adversária!`,
      likes: '5.2k',
      comments: '94'
    }
  });

  return feed;
}
