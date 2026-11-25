import { PlayerProfile, Club, MatchDecisionMoment, CareerOpportunity, PlayerAttributes } from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { buildCareerPromptDossier } from './careerMemory';
import { createContextualMoment } from './matchSimulator';
import { callGeminiJson } from './geminiClient';

export interface RecentMatchContext {
  opponentName?: string;
  playerGoals?: number;
  playerAssists?: number;
  playerRating?: number;
  playerScore?: number;
  opponentScore?: number;
  hadYellowCard?: boolean;
  hadRedCard?: boolean;
  wasInjured?: boolean;
}

/**
 * MOTOR DE INTELIGÊNCIA ARTIFICIAL DINÂMICO PARA DECISÕES & OPORTUNIDADES
 * 
 * Conecta com a API do Google Gemini (se houver chave configurada) ou utiliza
 * o motor procedural nativo de alta fidelidade para:
 * 1. Gerar momentos e 4 opções de escolha inéditas e contextuais durante o jogo.
 * 2. Criar acontecimentos aleatórios e desafios de carreira (olheiros, patrocínios,
 *    convocações para Seleção de Base, cobranças e união de vestiário).
 */

/**
 * Gera um momento de decisão tática dinâmico durante a partida
 */
export async function generateAIDecisionMoment(
  player: PlayerProfile,
  opponent: Club,
  minute: number,
  score: { home: number; away: number },
  usedScenarioKeys: Set<string>,
  apiKey?: string
): Promise<MatchDecisionMoment> {
  const dossier = buildCareerPromptDossier(player, opponent.name);
  const prompt = `Você é o gerador de lances e decisões táticas de um jogo RPG de futebol realista no Brasil (estilo Football Manager + EA Sports FC).
Crie um lance capital de jogo no minuto ${minute}' da partida entre ${player.currentClub} (${score.home}) x (${score.away}) ${opponent.name}.

PERFIL DO JOGADOR:
- Nome: ${player.name} "${player.surname}" (#${player.number})
- Posição: ${player.position}
- Estilo/Arquétipo: ${player.playStyleName || 'Meia Ofensivo'}
- Idade: ${player.age} anos | OVR: ${player.ovr}
- Atributos principais: Finalização ${player.attributes.finalization}, Passe ${player.attributes.passing}, Drible ${player.attributes.dribbling}, Visão ${player.attributes.vision}, Físico ${player.attributes.physical}, Velocidade ${player.attributes.pace}.

${dossier}

O jogador acabou de receber a bola ou está no epicentro de um lance quente da partida.
Gere 4 OPÇÕES DE ESCOLHA não-binárias, autênticas e sem rótulo de "escolha ideal", misturando técnica e temperamento real de futebol (ex: uma de finalização/passe técnico, uma de drible ousado, uma de malandragem/cobrança rápida antes do apito, ou comprar briga/liderança pelo vestiário com risco real de cartão).

Responda ESTRITAMENTE em formato JSON com esta estrutura:
{
  "contextTitle": "Título curto do lance (ex: Falta Perigosa na Entrada da Área / Clima Quente na Intermediária)",
  "situationText": "Texto de 2 a 3 frases descrevendo vividamente o lance, os nomes reais dos adversários e a bola/situação com o jogador.",
  "options": [
    {
      "id": "opt_1",
      "label": "Nome curto da jogada 1",
      "description": "Detalhe da execução tática e corporal",
      "primaryStat": "finalizacao" | "passe" | "drible" | "visao" | "fisico" | "velocidade",
      "risk": "baixo" | "medio" | "alto",
      "actionType": "finalizacao" | "passe" | "drible" | "malandragem" | "briga" | "lideranca" | "catimba" | "dividida_firme",
      "successNarrative": "Texto descrevendo o desfecho positivo da jogada",
      "failureNarrative": "Texto descrevendo o corte, cartão ou reação da arbitragem"
    }
  ]
}`;

  const parsed = await callGeminiJson<any>(prompt, {
    temperature: 0.82,
    apiKeyOverride: apiKey,
    timeoutMs: 3200
  });

  if (parsed && Array.isArray(parsed.options) && parsed.options.length >= 3) {
    const statMap: Record<string, keyof PlayerAttributes> = {
      finalizacao: 'finalization',
      finalization: 'finalization',
      passe: 'passing',
      passing: 'passing',
      drible: 'dribbling',
      dribbling: 'dribbling',
      visao: 'vision',
      vision: 'vision',
      fisico: 'physical',
      physical: 'physical',
      velocidade: 'pace',
      pace: 'pace',
      defesa: 'defense',
      defense: 'defense'
    };

    return {
      id: `ai_moment_${minute}_${Date.now()}`,
      minute,
      contextTitle: parsed.contextTitle || `Lance Decisivo aos ${minute}'`,
      scoreBefore: score,
      situationText: parsed.situationText || `A bola queima nos pés de ${player.surname} no minuto ${minute}!`,
      options: parsed.options.slice(0, 4).map((opt: any, idx: number) => ({
        id: opt.id || `opt_${idx}`,
        label: opt.label || 'Ação Tática',
        description: opt.description || '',
        primaryStat: statMap[opt.primaryStat] || 'passing',
        risk: opt.risk || (idx === 2 ? 'alto' : idx === 0 ? 'medio' : 'baixo'),
        actionType: opt.actionType || 'passe',
        successNarrative: opt.successNarrative,
        failureNarrative: opt.failureNarrative,
        statBonus: opt.risk === 'alto' ? 1.4 : opt.risk === 'medio' ? 1.0 : 0.7,
        coachBonus: opt.actionType === 'lideranca' ? 6 : 3,
        fansBonus: opt.risk === 'alto' || opt.actionType === 'briga' ? 8 : 3,
        teammatesBonus: opt.actionType === 'briga' || opt.actionType === 'lideranca' ? 10 : 2
      }))
    };
  }

  // Fallback Inteligente Procedural Instantâneo
  return createContextualMoment(player, opponent, minute, score, usedScenarioKeys);
}

/**
 * Gera acontecimentos aleatórios e oportunidades de carreira entre as rodadas.
 * Conecta com o Google Gemini 2.5 Flash para criar dilemas e oportunidades inéditos
 * ou aciona o gerador procedural de alta fidelidade como fallback contínuo.
 */
export async function generateRandomCareerOpportunity(
  player: PlayerProfile,
  round: number,
  apiKey?: string,
  matchContext?: RecentMatchContext
): Promise<CareerOpportunity | null> {
  const clubObj = findClub(player.currentClub);
  const coachName = clubObj.coachName || 'Comissão Técnica';
  const squad = clubObj.squad || [];
  const veteranTeammate = squad.find(s => s.age >= 28 && s.id !== player.id)?.name || 'Camisa 10 Veterano';
  const youngTeammate = squad.find(s => s.age <= 21 && s.id !== player.id)?.name || 'Jovem da Base';

  const matchSummary = matchContext ? `
- Último Jogo: contra ${matchContext.opponentName || 'adversário'}
- Gols Marcados no Jogo: ${matchContext.playerGoals ?? 0} | Assistências: ${matchContext.playerAssists ?? 0}
- Nota da Partida: ${matchContext.playerRating ?? 6.5}
- Placar Final: ${matchContext.playerScore ?? 0} x ${matchContext.opponentScore ?? 0}
- Levou Cartão Amarelo: ${matchContext.hadYellowCard ? 'Sim (em dividida ou discussão)' : 'Não'}
- Foi Expulso (Vermelho): ${matchContext.hadRedCard ? 'Sim' : 'Não'}
- Sofreu Alerta Médico / Lesão: ${matchContext.wasInjured ? 'Sim (sentiu desconforto no jogo)' : 'Não'}
` : '- Sem dados da partida imediatamente anterior.';

  const prompt = `Você é o Diretor Criativo e Roteirista de Bastidores do jogo RPG de futebol 'CRAQUE: Modo Carreira'.
Crie um ACONTECIMENTO DE BASTIDORES & OPORTUNIDADE DE CARREIRA realista, vivo e contextual entre uma rodada e outra.

PERFIL DO JOGADOR:
- Nome: ${player.name} "${player.surname}" (#${player.number})
- Idade: ${player.age} anos | Posição: ${player.position} | OVR: ${player.ovr}
- Clube Atual: ${player.currentClub} (Técnico: ${coachName})
- Companheiro Veterano do Elenco: ${veteranTeammate}
- Companheiro Jovem: ${youngTeammate}
- Rodada da Temporada: ${round} de 38 (Ano ${player.seasonYear})
- Histórico da Temporada Atual: ${player.currentSeasonStats?.games || 0} jogos, ${player.currentSeasonStats?.goals || 0} gols, ${player.currentSeasonStats?.assists || 0} assistências.
- Confiança da Torcida: ${player.relationships?.fans ?? 70}% | Confiança do Técnico: ${player.relationships?.coach ?? 65}% | Vestiário: ${player.relationships?.teammates ?? 75}%
${matchSummary}

ESCOLHA UMA DESTAS 3 VERTENTES DO FUTEBOL REAL:
1. 'scout' (Sondagens de Olheiros): Clubes europeus gigantes (ex: Real Madrid, Chelsea, Arsenal, PSG, Brighton, Borussia Dortmund, Benfica, Porto) com observadores na tribuna após boas atuações, notícias no ge.globo ou contatos com o empresário.
2. 'sponsorship' (Contratos de Patrocínio & Marcas): Propostas oficiais de marcas esportivas (Nike, Adidas, Puma, Mizuno, marcas de isotônicos ou campanhas comerciais) com bônus financeiros, chuteiras exclusivas ou exigências de marketing.
3. 'locker_room' (Dilemas de Vestiário & Política do Clube): Apoiar um companheiro experiente em crise que foi vaiado vs apoiar o treinador que quer barrá-lo; disputa de batedor de pênalti; vazamento de informações para a imprensa; companheiro chamando para festa antes de jogo decisivo.

A situação deve ser CRUA, REALISTA e com vocabulário autêntico do futebol brasileiro. Não crie situações genéricas infantis.
Gere 3 OPÇÕES DE ESCOLHA com prós e contras reais (nenhuma opção deve ser 100% perfeita, todas têm consequências e trade-offs).

Responda ESTRITAMENTE em formato JSON com esta estrutura:
{
  "type": "scout" | "sponsorship" | "locker_room",
  "title": "Manchete impactante de bastidor",
  "subtitle": "Subtítulo contextual",
  "description": "Texto imersivo de 2 a 3 parágrafos curtos detalhando a situação com nomes reais e bastidores do clube.",
  "source": "Fonte do acontecimento (ex: Fabrizio Romano / ge.globo / Mesa de Negociações / Vestiário Fechado)",
  "badge": "TAG CURTA (ex: 🔍 OLHO EUROPEU / 👟 PATROCÍNIO NIKE / 👥 DILEMA NO VESTIÁRIO)",
  "badgeColor": "#F59E0B",
  "options": [
    {
      "id": "opt_1",
      "label": "Título da postura",
      "description": "Explicação da atitude tomada pelo atleta",
      "risk": "baixo" | "medio" | "alto",
      "consequenceText": "Resumo em 1 frase da repercussão no clube e na mídia",
      "effects": {
        "moralDelta": 5,
        "coachTrustDelta": 8,
        "fansTrustDelta": -3,
        "teammatesTrustDelta": 4,
        "boardTrustDelta": 5,
        "marketValueDeltaEur": 1.2,
        "tagEarned": "#TagDePersonalidade",
        "memoryTitle": "Título para o Caderno de Memórias",
        "memoryDesc": "Descrição do marco no dossiê da carreira"
      }
    }
  ]
}`;

  const parsed = await callGeminiJson<any>(prompt, {
    temperature: 0.85,
    apiKeyOverride: apiKey
  });

  if (parsed && parsed.title && Array.isArray(parsed.options) && parsed.options.length >= 2) {
    return {
      id: `gemini_opp_${round}_${Date.now()}`,
      type: parsed.type || 'scout',
      title: parsed.title,
      subtitle: parsed.subtitle || 'Acontecimento de Carreira',
      description: parsed.description,
      source: parsed.source || 'Bastidores do Futebol',
      badge: parsed.badge || '✨ OPORTUNIDADE',
      badgeColor: parsed.badgeColor || '#F59E0B',
      options: parsed.options.slice(0, 3).map((opt: any, idx: number) => ({
        id: opt.id || `opt_${idx}`,
        label: opt.label || 'Decisão',
        description: opt.description || '',
        risk: opt.risk || (idx === 0 ? 'medio' : idx === 1 ? 'alto' : 'baixo'),
        consequenceText: opt.consequenceText || 'Sua escolha foi registrada nos bastidores.',
        effects: {
          moralDelta: opt.effects?.moralDelta ?? 0,
          energyDelta: opt.effects?.energyDelta ?? 0,
          coachTrustDelta: opt.effects?.coachTrustDelta ?? 0,
          fansTrustDelta: opt.effects?.fansTrustDelta ?? 0,
          boardTrustDelta: opt.effects?.boardTrustDelta ?? 0,
          teammatesTrustDelta: opt.effects?.teammatesTrustDelta ?? 0,
          marketValueDeltaEur: opt.effects?.marketValueDeltaEur ?? 0,
          tagEarned: opt.effects?.tagEarned,
          memoryTitle: opt.effects?.memoryTitle,
          memoryDesc: opt.effects?.memoryDesc
        }
      }))
    };
  }

  // 2. Motor Procedural Vivo e Contextual (Fallback Imediato de Alta Fidelidade)
  return generateProceduralCareerOpportunity(player, round, matchContext);
}

/**
 * Gerador procedural vivo e hiper-realista que analisa o contexto do jogador
 * quando o Gemini estiver offline ou sem chave configurada.
 */
function generateProceduralCareerOpportunity(
  player: PlayerProfile,
  round: number,
  matchContext?: RecentMatchContext
): CareerOpportunity {
  const clubObj = findClub(player.currentClub);
  const coachName = clubObj.coachName || 'Comissão Técnica';
  const squad = clubObj.squad || [];
  const veteran = squad.find(s => s.age >= 28 && s.id !== player.id)?.name || 'Camisa 10 Veterano';
  const captain = squad.find(s => s.position === 'ZAG' && s.id !== player.id)?.name || 'Capitão da Equipe';
  const playerGoals = matchContext?.playerGoals ?? 0;
  const isHighScorer = playerGoals >= 2 || (player.currentSeasonStats?.goals || 0) >= 3;

  // Decide a temática com base no momento do atleta
  const themes: ('scout' | 'sponsorship' | 'locker_room')[] = ['scout', 'sponsorship', 'locker_room'];
  let chosenTheme: 'scout' | 'sponsorship' | 'locker_room' = themes[(round + player.id.length) % themes.length];

  if (isHighScorer && Math.random() < 0.6) {
    chosenTheme = Math.random() < 0.5 ? 'scout' : 'sponsorship';
  } else if (matchContext?.hadYellowCard || matchContext?.wasInjured) {
    chosenTheme = 'locker_room';
  }

  // VERTENTE 1: SONDAGENS DE OLHEIROS & MERCADO EUROPEU
  if (chosenTheme === 'scout') {
    const scoutClubs = [
      { name: 'Chelsea FC', scout: 'Olheiro-chefe de América do Sul do Chelsea', league: 'Premier League', bonusEur: 2.5 },
      { name: 'Borussia Dortmund', scout: 'Departamento de Captação do Dortmund', league: 'Bundesliga', bonusEur: 2.0 },
      { name: 'Real Madrid', scout: 'Juni Calafat e equipe de scouts do Real Madrid', league: 'La Liga', bonusEur: 3.5 },
      { name: 'Brighton & Hove Albion', scout: 'Equipe de Análise de Dados do Brighton', league: 'Premier League', bonusEur: 1.8 },
      { name: 'Arsenal FC', scout: 'Observador Técnico do Arsenal', league: 'Premier League', bonusEur: 2.8 }
    ];
    const pickedScout = scoutClubs[(round + player.ovr) % scoutClubs.length];

    return {
      id: `proc_scout_${round}_${Date.now()}`,
      type: 'scout',
      title: `${pickedScout.scout} Presente no Estádio!`,
      subtitle: `Radar Europeu: Relatório Técnico da ${pickedScout.league}`,
      description: `Após as suas atuações com a camisa do ${player.currentClub}, emissários enviados por ${pickedScout.name} foram flagrados na tribuna de honra com pranchetas e tablets de scouts. Nos bastidores do clube, corre a informação de que eles buscam jovens com personalidade técnica sob pressão e já fizeram consultas preliminares ao seu empresário.`,
      source: 'ge.globo & Bastidores do Mercado',
      badge: '🔍 OLHO DO MERCADO',
      badgeColor: '#F59E0B',
      options: [
        {
          id: 'scout_ambition',
          label: 'Pedir que Seu Empresário Abra Portas na Europa',
          description: 'Avisar seu estafe para demonstrar interesse mútuo e agendar conversas na próxima janela.',
          risk: 'alto',
          consequenceText: 'Seu nome vira febre nos jornais europeus e seu valor dispara, mas o técnico e a diretoria cobrarão compromisso total.',
          effects: {
            marketValueDeltaEur: pickedScout.bonusEur,
            moralDelta: 8,
            fansTrustDelta: -4,
            coachTrustDelta: -3,
            tagEarned: '#RadarEuropeu',
            memoryTitle: `Sondagem oficial de olheiros do ${pickedScout.name}`,
            memoryDesc: `Abriu conversas com observadores europeus do ${pickedScout.name}, agitando os bastidores do mercado.`
          }
        },
        {
          id: 'scout_focus',
          label: 'Blindar o Foco no Clube e Ignorar Especulações',
          description: 'Reafirmar que sua prioridade absoluta é vencer títulos pelo clube antes de qualquer transferência.',
          risk: 'baixo',
          consequenceText: 'Ganha moral inquestionável com o treinador, diretoria e lideranças do vestiário.',
          effects: {
            coachTrustDelta: 10,
            boardTrustDelta: 8,
            teammatesTrustDelta: 6,
            fansTrustDelta: 9,
            moralDelta: 5,
            tagEarned: '#FocoTotal',
            memoryTitle: `Demonstrou lealdade ao ${player.currentClub} diante do assédio europeu`,
            memoryDesc: `Recusou se deslumbrar com olheiros do ${pickedScout.name} para priorizar o momento do clube.`
          }
        },
        {
          id: 'scout_performance',
          label: 'Usar o Assédio como Combustível nos Treinos',
          description: 'Dobrar a intensidade física e técnica nos coletivos para provar que está pronto para o topo mundial.',
          risk: 'medio',
          consequenceText: 'Chama a atenção positiva da comissão técnica e eleva seu rendimento em campo.',
          effects: {
            coachTrustDelta: 6,
            moralDelta: 7,
            marketValueDeltaEur: Number((pickedScout.bonusEur * 0.6).toFixed(1)),
            teammatesTrustDelta: 3,
            tagEarned: '#EvolucaoConstante',
            memoryTitle: 'Intensificou a rotina sob olhares europeus',
            memoryDesc: `Canalizou o interesse estrangeiro para subir o nível de dedicação tática diária.`
          }
        }
      ]
    };
  }

  // VERTENTE 2: CONTRATOS DE PATROCÍNIO & MARCAS ESPORTIVAS
  if (chosenTheme === 'sponsorship') {
    const sponsors = [
      { brand: 'Nike', boot: 'Mercurial Superfly Elite', rival: 'Adidas', bonus: 1.2 },
      { brand: 'Adidas', boot: 'Predator FT Accuracy', rival: 'Puma', bonus: 1.1 },
      { brand: 'Puma', boot: 'Future Ultimate DNA', rival: 'Nike', bonus: 1.0 },
      { brand: 'Red Bull Energy', boot: 'Campanha de Atleta Radical & Comercial de TV', rival: 'Gatorade', bonus: 0.9 }
    ];
    const sp = sponsors[(round + player.id.charCodeAt(0)) % sponsors.length];

    return {
      id: `proc_sponsorship_${round}_${Date.now()}`,
      type: 'sponsorship',
      title: `Proposta de Patrocínio Oficial: Contrato com a ${sp.brand}!`,
      subtitle: `Contrato de Chuteiras (${sp.boot}) & Direitos Comerciais`,
      description: `Representantes comerciais da ${sp.brand} procuraram a diretoria e seu empresário formalizando uma proposta de patrocínio individual. A oferta inclui o fornecimento de modelos exclusivos da chuteira ${sp.boot}, bonificação financeira a cada gol e participação em campanhas publicitárias de alcance nacional.`,
      source: 'Mesa de Negociações Comerciais',
      badge: '👟 CONTRATO COMERCIAL',
      badgeColor: '#10B981',
      options: [
        {
          id: 'sponsor_aggressive',
          label: `Assinar com a ${sp.brand} com Cláusula Agressiva de Bônus por Gol`,
          description: 'Exigir bônus financeiro quadruplicado por gols decisivos em clássicos e jogos de mata-mata.',
          risk: 'medio',
          consequenceText: 'Contrato milionário assinado! Aumenta muito sua moral e valor comercial, mas coloca pressão por gols todo jogo.',
          effects: {
            moralDelta: 10,
            fansTrustDelta: 7,
            marketValueDeltaEur: sp.bonus,
            tagEarned: `#Atleta${sp.brand}`,
            memoryTitle: `Assinou contrato de patrocínio com a ${sp.brand}`,
            memoryDesc: `Firmou parceria comercial de peso para calçar a linha ${sp.boot} com bônus por gols decisivos.`
          }
        },
        {
          id: 'sponsor_safe',
          label: 'Priorizar Cláusula de Apoio Fisiológico e Longevidade',
          description: 'Negociar foco total em equipamentos de recuperação muscular e tecnologia de suporte médico.',
          risk: 'baixo',
          consequenceText: 'A comissão técnica e os preparadores físicos elogiam sua visão madura de carreira.',
          effects: {
            coachTrustDelta: 8,
            boardTrustDelta: 6,
            moralDelta: 6,
            marketValueDeltaEur: Number((sp.bonus * 0.7).toFixed(1)),
            tagEarned: '#ProfissionalismoTotal',
            memoryTitle: `Parceria com a ${sp.brand} focada em longevidade física`,
            memoryDesc: `Priorizou tecnologia de suporte muscular e condicionamento em contrato de patrocínio esportivo.`
          }
        },
        {
          id: 'sponsor_social',
          label: 'Incluir Cláusula Social de Doação para a Base de Sua Cidade',
          description: 'Condicionar a assinatura ao envio de pares de chuteiras e bolas para escolinhas da sua infância.',
          risk: 'baixo',
          consequenceText: 'Gesto elogiado por torcedores em todas as redes sociais e reverenciado no vestiário.',
          effects: {
            fansTrustDelta: 12,
            teammatesTrustDelta: 8,
            moralDelta: 8,
            tagEarned: '#ÍdoloDaComunidade',
            memoryTitle: 'Cláusula social exemplar em contrato de chuteiras',
            memoryDesc: `Exigiu doação de materiais para escolinhas da base em seu acordo com a ${sp.brand}.`
          }
        }
      ]
    };
  }

  // VERTENTE 3: DILEMAS DE VESTIÁRIO & POLÍTICA DO CLUBE
  return {
    id: `proc_locker_${round}_${Date.now()}`,
    type: 'locker_room',
    title: `Dilema no Vestiário: Apoiar o Colega ${veteran} ou Seguir a Cartilha?`,
    subtitle: `Tensão Interna: Crise de Confiança & Hierarquia do Elenco`,
    description: `O clima esquentou após a reunião técnica no CT do ${player.currentClub}. O veterano ${veteran} vem sofrendo duras críticas da imprensa e foi vaiado por parte da torcida. O técnico ${coachName} cogita tirá-lo do time titular. No vestiário fechado, alguns atletas mais velhos cobraram que o grupo faça um pacto público em defesa do camisa 10, enquanto a diretoria pede foco estrito nas decisões da comissão técnica.`,
    source: 'Bastidores do Vestiário & Zona Mista',
    badge: '👥 CLIMA NO VESTIÁRIO',
    badgeColor: '#8B5CF6',
    options: [
      {
        id: 'locker_defend_friend',
        label: `Ficar ao Lado de ${veteran} e dos Líderes do Vestiário`,
        description: 'Dar declarações públicas de apoio ao companheiro e abraçá-lo diante das câmeras no treino.',
        risk: 'medio',
        consequenceText: 'Ganha respeito eterno dos jogadores mais influentes do elenco, mas gera desconforto com a diretoria.',
        effects: {
          teammatesTrustDelta: 12,
          fansTrustDelta: 3,
          coachTrustDelta: -2,
          boardTrustDelta: -5,
          moralDelta: 6,
          tagEarned: '#FechadoComOGrupo',
          memoryTitle: `Defendeu publicamente o colega ${veteran} em momento de crise`,
          memoryDesc: `Comprou o barulho dos veteranos no vestiário e fortaleceu os laços de união do elenco.`
        }
      },
      {
        id: 'locker_align_coach',
        label: `Alinhar-se à Decisão Tática do Treinador ${coachName}`,
        description: 'Declarar que o treinador é a autoridade máxima e que o clube está sempre acima de qualquer nome individual.',
        risk: 'alto',
        consequenceText: 'Conquista confiança irrestrita de Abel/treinador e da diretoria, mas causa faíscas com a ala dos cascudos.',
        effects: {
          coachTrustDelta: 10,
          boardTrustDelta: 8,
          teammatesTrustDelta: -7,
          moralDelta: 4,
          tagEarned: '#SoldadoDoTreinador',
          memoryTitle: `Respaldou a soberania tática de ${coachName}`,
          memoryDesc: `Defendeu a hierarquia da comissão técnica perante o elenco, priorizando o coletivo.`
        }
      },
      {
        id: 'locker_diplomatic',
        label: 'Postura Conciliadora: Chamar o Companheiro para uma Conversa no CT',
        description: 'Evitar holofotes da imprensa e oferecer apoio direto e reservado nos treinamentos da semana.',
        risk: 'baixo',
        consequenceText: 'Demonstra maturidade precoce de capitão, mantendo a paz com a comissão e com o elenco.',
        effects: {
          teammatesTrustDelta: 6,
          coachTrustDelta: 5,
          fansTrustDelta: 4,
          moralDelta: 5,
          tagEarned: '#LiderancaMaturidade',
          memoryTitle: 'Intermediou crise de vestiário com serenidade',
          memoryDesc: `Agiu nos bastidores para apagar o incêndio entre líderes do elenco e a comissão técnica.`
        }
      }
    ]
  };
}
