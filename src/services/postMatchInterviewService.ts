import { PlayerProfile, MatchOutcome, MatchFixture, PostMatchInterview, PlayerInjury } from '../types';
import { CLUBS, findClub } from '../data/clubs';
import { callGeminiJson } from './geminiClient';

/**
 * SERVIÇO DE ZONA MISTA & ENTREVISTA PÓS-JOGO (FLASH INTERVIEW)
 * Conecta ao Gemini 2.5 Flash via proxy seguro para formular perguntas 100% específicas
 * sobre gols, cartões, confusões, lesões e contexto da taça disputada.
 */

export async function generateAIPostMatchInterview(
  player: PlayerProfile,
  outcome: MatchOutcome,
  fixture?: MatchFixture,
  apiKey?: string,
  inMatchInjury?: PlayerInjury | null
): Promise<PostMatchInterview> {
  const playerClub = findClub(player.currentClub);
  const coachName = playerClub?.coachName || 'o treinador';
  const compName = fixture?.competitionName || playerClub?.league || 'Campeonato';
  const stageName = fixture?.stageName || `Rodada ${player.currentMatchDay}`;

  const prompt = `Você é um repórter de campo de TV esportiva (TNT Sports, Globo Esporte, ESPN ou CazéTV) na Zona Mista pós-jogo.
Formule UMA pergunta afiada, específica e NÃO-GENÉRICA para o atleta ${player.name} "${player.surname}" (${player.age} anos, #${player.number} do ${player.currentClub}, técnico ${coachName}) logo após o apito final, e 3 opções de resposta com personalidades distintas e trade-offs reais.

FATOS EXATOS DA PARTIDA DE HOJE:
- Competição e Fase: ${compName} (${stageName})
- Placar: ${player.currentClub} ${outcome.score.playerTeam} x ${outcome.score.opponentTeam} ${outcome.opponent.name}
- Atuação de ${player.surname}: Nota ${outcome.playerStats.rating.toFixed(1)}, Gols: ${outcome.playerStats.goals}, Assistências: ${outcome.playerStats.assists}
- Cartão Amarelo: ${outcome.playerStats.yellowCard ? 'SIM (tomou amarelo em campo)' : 'Não'}
- Expulsão (Cartão Vermelho): ${outcome.playerStats.redCard ? 'SIM (foi expulso de campo!)' : 'Não'}
- Lesão / Alerta Médico na Partida: ${inMatchInjury ? `SIM (${inMatchInjury.name} - ${inMatchInjury.causeTitle})` : 'Não'}
- Lances Marcantes: ${outcome.highlightMoments.map(h => `${h.minute}' ${h.text}`).join(' | ') || ' Jogo pegado de meio-campo'}

Responda ESTRITAMENTE em JSON:
{
  "journalistName": "Fred Caldeira / André Plihal / Mariana Fontes / Guilherme Beltrão",
  "outletName": "TNT Sports Brasil / ESPN Brasil / Globo Esporte / CazéTV",
  "outletLogo": "⚡",
  "question": "Pergunta direta mencionando os fatos reais do jogo (ex: cartão, gol, lesão, fase da copa, rival ou início de temporada)",
  "options": [
    {
      "id": "ai_int_1",
      "stance": "coletiva",
      "stanceLabel": "Rótulo curto da postura 1",
      "text": "\"Fala em primeira pessoa com gírias reais de jogador...\"",
      "impactSummary": "Resumo curto do impacto no clube/imprensa",
      "coachDelta": 7,
      "fansDelta": 4,
      "boardDelta": 5,
      "headline": "Manchete gerada pela declaração"
    },
    {
      "id": "ai_int_2",
      "stance": "torcida",
      "stanceLabel": "Rótulo curto da postura 2 (ousada/raiz)",
      "text": "\"Fala autêntica, marrenta ou apaixonada...\"",
      "impactSummary": "Resumo curto do impacto",
      "coachDelta": -3,
      "fansDelta": 14,
      "boardDelta": 1,
      "marketValueDelta": 0.2,
      "headline": "Manchete gerada pela declaração"
    },
    {
      "id": "ai_int_3",
      "stance": "foco",
      "stanceLabel": "Rótulo curto da postura 3 (ambição/cobrança)",
      "text": "\"Fala firme focada em taças ou autocrítica...\"",
      "impactSummary": "Resumo curto do impacto",
      "coachDelta": 5,
      "fansDelta": 6,
      "boardDelta": 6,
      "headline": "Manchete gerada pela declaração"
    }
  ]
}`;

  const parsed = await callGeminiJson<any>(prompt, {
    temperature: 0.8,
    apiKeyOverride: apiKey
  });

  if (parsed && parsed.question && Array.isArray(parsed.options) && parsed.options.length >= 3) {
    const badgeColors = [
      'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      'bg-amber-500/20 text-amber-300 border-amber-500/40',
      'bg-sky-500/20 text-sky-300 border-sky-500/40'
    ];
    return {
      journalistName: parsed.journalistName || 'Fred Caldeira',
      outletName: parsed.outletName || 'TNT Sports Brasil',
      outletLogo: parsed.outletLogo || '⚡',
      question: parsed.question,
      options: parsed.options.slice(0, 3).map((opt: any, i: number) => ({
        id: opt.id || `ai_int_${i}`,
        stance: opt.stance || (i === 0 ? 'coletiva' : i === 1 ? 'torcida' : 'foco'),
        stanceLabel: opt.stanceLabel || 'Posicionamento',
        badgeColor: badgeColors[i % badgeColors.length],
        text: opt.text || '"Fizemos o nosso papel dentro de campo."',
        impactSummary: opt.impactSummary || 'Repercussão imediata na imprensa esportiva',
        coachDelta: Number(opt.coachDelta ?? 3),
        fansDelta: Number(opt.fansDelta ?? 4),
        boardDelta: Number(opt.boardDelta ?? 2),
        marketValueDelta: opt.marketValueDelta ? Number(opt.marketValueDelta) : undefined,
        headline: opt.headline || `${player.surname} se posiciona na zona mista após duelo pelo ${compName}.`
      }))
    };
  }

  return generatePostMatchInterview(player, outcome, fixture, inMatchInjury);
}

export function generatePostMatchInterview(
  player: PlayerProfile,
  outcome: MatchOutcome,
  fixture?: MatchFixture,
  inMatchInjury?: PlayerInjury | null
): PostMatchInterview {
  const isWin = outcome.score.playerTeam > outcome.score.opponentTeam;
  const isLoss = outcome.score.playerTeam < outcome.score.opponentTeam;
  const isDraw = outcome.score.playerTeam === outcome.score.opponentTeam;
  const goals = outcome.playerStats.goals;
  const rating = outcome.playerStats.rating;
  const opp = outcome.opponent;
  const country = opp.country || 'Brasil';
  const playerClubName = player.currentClub;
  const playerClub = CLUBS[playerClubName];
  const coachName = playerClub?.coachName || 'o treinador';
  const compName = fixture?.competitionName || 'Campeonato';
  const compShort = fixture?.competitionShort || 'Torneio';
  const isFinal = !!fixture?.trophyName;
  const isDerby = !!(fixture?.stageName?.toLowerCase().includes('clássico') || playerClub?.rivalClubs?.some(r => opp.name.includes(r) || opp.shortName.includes(r)));
  const scoreStr = `${outcome.score.playerTeam} a ${outcome.score.opponentTeam}`;

  // Emissoras e repórteres de acordo com o país onde o jogo ocorre
  const outletsByCountry: Record<string, { name: string; reporter: string; logo: string }[]> = {
    'Brasil': [
      { name: 'Globo Esporte', reporter: 'Mariana Fontes', logo: '📺' },
      { name: 'ESPN Brasil', reporter: 'André Plihal', logo: '🎙️' },
      { name: 'TNT Sports Brasil', reporter: 'Fred Caldeira', logo: '⚡' },
      { name: 'CazéTV', reporter: 'Guilherme Beltrão', logo: '🔴' }
    ],
    'Inglaterra': [
      { name: 'Sky Sports', reporter: 'Geoff Shreeves', logo: '📺' },
      { name: 'BBC Match of the Day', reporter: 'Kelly Somers', logo: '🎙️' },
      { name: 'TNT Sports UK', reporter: 'Des Kelly', logo: '⚡' }
    ],
    'Espanha': [
      { name: 'Movistar+ LaLiga', reporter: 'Rodrigo Fáez', logo: '📺' },
      { name: 'DAZN España', reporter: 'Sergio Quirante', logo: '🎙️' }
    ]
  };

  const pool = outletsByCountry[country] || outletsByCountry['Brasil'];
  const selectedMedia = pool[Math.floor(Math.random() * pool.length)];

  // 0. Cenário Especial: EXPULSÃO OU LESÃO EM CAMPO (Nunca genérico!)
  if (outcome.playerStats.redCard) {
    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: `Clima fervendo no ${compShort}! Você acabou expulso de campo e vai cumprir suspensão automática na próxima partida. Foi excesso de vontade ou o árbitro pesou a mão contra você?`,
      options: [
        {
          id: 'int_red_apology',
          stance: 'coletiva',
          stanceLabel: 'Autocrítica & Pedido de Desculpas ao Grupo',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"Passei do ponto no calor do jogo e deixei meus companheiros correndo por mim. Já pedi desculpas no vestiário ao professor ${coachName} e ao grupo. Serve de aprendizado."`,
          impactSummary: 'Reduz o desgaste com o treinador pela maturidade na autocrítica',
          coachDelta: +5,
          fansDelta: +2,
          boardDelta: +3,
          headline: `Hombridade: ${player.surname} assume erro após cartão vermelho e pede desculpas ao elenco do ${playerClubName}.`
        },
        {
          id: 'int_red_referee',
          stance: 'torcida',
          stanceLabel: 'Disparar Contra a Arbitragem & Defender a Camisa',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          text: `"Futebol não é balé! O juiz queria aparecer mais que os jogadores. Não vou tirar o pé de dividida vestindo a camisa do ${playerClubName} nunca!"`,
          impactSummary: 'Torcida vai à loucura com a raça, mas diretoria teme gancho maior',
          coachDelta: -3,
          fansDelta: +14,
          boardDelta: -4,
          headline: `Polêmica! Após expulsão, ${player.surname} detona arbitragem na zona mista: "Não vou tirar o pé nunca!"`
        },
        {
          id: 'int_red_turnpage',
          stance: 'foco',
          stanceLabel: 'Esfriar a Cabeça & Confiar no Elenco',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          text: `"Infelizmente faz parte do futebol de contato. Confio 100% em quem vai entrar na próxima rodada enquanto cumpro suspensão. Voltarei ainda mais forte."`,
          impactSummary: 'Equilíbrio elogiado pelos líderes do elenco',
          coachDelta: +3,
          fansDelta: +5,
          boardDelta: +2,
          headline: `Cabeça fria: Suspenso, ${player.surname} demonstra confiança no elenco para a sequência do ${compShort}.`
        }
      ]
    };
  }

  if (inMatchInjury) {
    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: `A torcida do ${playerClubName} ficou apreensiva quando você sentiu ${inMatchInjury.bodyPart} (${inMatchInjury.causeTitle.toLowerCase()}). Qual é a real situação física agora na saída do vestiário?`,
      options: [
        {
          id: 'int_inj_cautious',
          stance: 'coletiva',
          stanceLabel: 'Seguir Estritamente o Departamento Médico',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"Senti a pancada na hora, incomodou bastante. Agora é fazer os exames de imagem com os médicos do clube e respeitar o tempo de recuperação para não agravar."`,
          impactSummary: 'Comissão técnica e DM aprovam sua responsabilidade profissional',
          coachDelta: +6,
          fansDelta: +4,
          boardDelta: +6,
          headline: `Cautela médica: ${player.surname} fará exames no DM do ${playerClubName} após sentir ${inMatchInjury.bodyPart}.`
        },
        {
          id: 'int_inj_warrior',
          stance: 'torcida',
          stanceLabel: 'Espírito Guerreiro: Querer Jogar de Qualquer Jeito',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `"Dói bastante, está inchado, mas por essa camisa eu jogo até com uma perna só se o professor precisar! Vamos tratar três períodos por dia!"`,
          impactSummary: 'Torcida se emociona com sua entrega ao manto',
          coachDelta: +2,
          fansDelta: +15,
          boardDelta: +1,
          headline: `Raça pura! Mesmo com dores, ${player.surname} emociona torcida: "Por essa camisa jogo no sacrifício!"`
        },
        {
          id: 'int_inj_calm',
          stance: 'foco',
          stanceLabel: 'Tranquilizar a Torcida & Focar na Temporada',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          text: `"Foi um choque duro do jogo contra o ${opp.shortName}, mas acredito que não seja nada grave. Já comecei o gelo no vestiário para voltar 100% em breve."`,
          impactSummary: 'Transmite serenidade ao ambiente do clube',
          coachDelta: +4,
          fansDelta: +7,
          boardDelta: +4,
          headline: `${player.surname} tranquiliza torcida após susto físico no duelo pelo ${compShort}.`
        }
      ]
    };
  }

  // 1. Cenário Épico: GRANDE FINAL / TÍTULO DE CAMPEÃO
  if (isWin && isFinal) {
    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: `É CAMPEÃO! Com apenas ${player.age} anos, você acaba de levantar a cobiçada Taça do ${compName} com a camisa do ${playerClubName}! Qual é o tamanho dessa emoção ao ouvir o apito final e soltar esse grito histórico com a torcida?`,
      options: [
        {
          id: 'int_champ_humble',
          stance: 'coletiva',
          stanceLabel: 'Gratidão Coletiva & Coroação do Trabalho',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `"Passa um filme na cabeça. Saí da base com o sonho de ser campeão por esse clube gigante. Essa taça é para a comissão técnica do ${coachName}, para cada roupeiro, cozinheiro e companheiro de elenco. Somos campeões porque fomos uma família!"`,
          impactSummary: 'Técnico e diretoria ovacionam sua maturidade ao celebrar o título',
          coachDelta: +10,
          fansDelta: +15,
          boardDelta: +8,
          marketValueDelta: 0.5,
          headline: `Histórico! Aos ${player.age} anos, ${player.surname} levanta a Taça do ${compShort} e dedica título à união do vestiário.`
        },
        {
          id: 'int_champ_fans',
          stance: 'torcida',
          stanceLabel: 'Loucura com a Torcida & Glória Eterna',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"Essa taça é de vocês! Olha essa arquibancada, que loucura surreal! Eu sonhei com essa festa a vida inteira. O ${playerClubName} é gigante e nasceu para ser campeão!"`,
          impactSummary: 'Idolatria instantânea! Seu nome é eternizado na memória dos torcedores',
          coachDelta: +4,
          fansDelta: +20,
          boardDelta: +6,
          marketValueDelta: 0.6,
          headline: `Arrepiante! ${player.surname} corre para o alambrado na comemoração da taça: "O ${playerClubName} nasceu pra ser campeão!"`
        },
        {
          id: 'int_champ_dynasty',
          stance: 'foco',
          stanceLabel: 'Fome Insaciável de Títulos',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          text: `"Essa é a primeira taça de muitas que vamos buscar neste ano! Amanhã já viramos a chave para a Copa do Brasil, o Brasileirão e a Libertadores. Queremos uma dinastia de títulos aqui!"`,
          impactSummary: 'Liderança implacável que impressiona observadores europeus',
          coachDelta: +8,
          fansDelta: +12,
          boardDelta: +10,
          marketValueDelta: 0.7,
          headline: `Mentalidade de dinastia: Após o título do ${compShort}, ${player.surname} já avisa: "Queremos todas as taças da temporada!"`
        }
      ]
    };
  }

  // 2. Cenário: CLÁSSICO REGIONAL VENCIDO (ex: Palmeiras x Santos, Fla-Flu, etc.)
  if (isWin && isDerby) {
    const questionText = goals >= 2 
      ? `Que noite apoteótica no clássico! O ${playerClubName} atropelou o ${opp.shortName} por ${scoreStr} com show particular seu de ${goals} gols. Com ${player.age} anos, como é viver o sonho de decidir um clássico dessa magnitude no ${compShort}?`
      : `Vitória com autoridade no clássico! O ${playerClubName} dominou o rival ${opp.shortName} por ${scoreStr} e incendiou a torcida. Como você avalia a imposição tática da equipe em campo hoje?`;

    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: questionText,
      options: [
        {
          id: 'int_derby_respect',
          stance: 'coletiva',
          stanceLabel: 'Respeito ao Clássico & Pés no Chão',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"Clássico contra o ${opp.shortName} é sempre decidido nos detalhes. Sabíamos da dificuldade, respeitamos o rival e cumprimos a estratégia que o ${coachName} montou. Feliz demais em ajudar o grupo a sair com esses 3 pontos maiúsculos!"`,
          impactSummary: 'Elogios da comissão técnica e respeito no meio do futebol',
          coachDelta: +8,
          fansDelta: +6,
          boardDelta: +5,
          headline: `Postura de veterano: ${player.surname} exalta plano de ${coachName} após vitória imponente no clássico contra o ${opp.shortName}.`
        },
        {
          id: 'int_derby_swagger',
          stance: 'torcida',
          stanceLabel: 'Êxtase com a Torcida & Autoridade no Rival',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `"Clássico não se joga com medo, clássico se ganha com alma e sangue! A nossa torcida manda na cidade e hoje nós provamos isso dentro das quatro linhas. O ${playerClubName} é gigante!"`,
          impactSummary: 'As redes sociais explodem! Torcida faz memes e exalta sua ousadia',
          coachDelta: -1,
          fansDelta: +16,
          boardDelta: +4,
          marketValueDelta: 0.3,
          headline: `Provocação sadia e autoridade! ${player.surname} incendeia a torcida após triunfo no clássico: "Mostramos quem manda na cidade!"`
        },
        {
          id: 'int_derby_trophies',
          stance: 'foco',
          stanceLabel: 'Foco na Taça da Competição',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          text: `"Vencer o clássico contra o ${opp.shortName} dá moral demais, mas não ganhamos troféu hoje. Nosso objetivo final no ${compShort} é levantar a taça de campeão. Amanhã cedo a cabeça já está no próximo duelo."`,
          impactSummary: 'Foco de campeão que agrada torcida exigente e diretoria',
          coachDelta: +6,
          fansDelta: +8,
          boardDelta: +6,
          headline: `Foco total na taça: ${player.surname} comemora clássico, mas lembra que meta é o título do ${compShort}.`
        }
      ]
    };
  }

  // 3. Cenário: Atuação de Gala / Gols Marcados na Vitória
  if (isWin && (goals >= 1 || rating >= 7.8)) {
    const questionText = goals >= 3
      ? `Que atuação cinematográfica no ${compName}! Você anotou um hat-trick com 3 gols na goleada por ${scoreStr} sobre o ${opp.shortName}. Vai pedir música no Fantástico? Como você descreve essa noite de gala com apenas ${player.age} anos?`
      : goals >= 1 
      ? `Noite brilhante pelo ${compName}! Você marcou o gol decisivo na vitória por ${scoreStr} sobre o ${opp.shortName} e foi aplaudido de pé pela torcida. O técnico ${coachName} elogiou sua frieza na finalização. Como você vive esse momento?`
      : `Vitória maiúscula do ${playerClubName} por ${scoreStr} contra o ${opp.shortName} no ${compName}! Você comandou o ritmo do meio-campo e distribuiu o jogo com maestria. Qual é a chave para essa maturidade tática tão jovem?`;

    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: questionText,
      options: [
        {
          id: 'int_humble_collective',
          stance: 'coletiva',
          stanceLabel: 'Postura Coletiva & Humildade',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"O mérito não é só meu, é de todo o grupo e do professor ${coachName}. O trabalho duro nos treinos diários é o que faz a diferença. Pés no chão porque a temporada e as disputas por taças estão só começando."`,
          impactSummary: 'Treinador e diretoria elogiam sua maturidade profissional',
          coachDelta: +7,
          fansDelta: +5,
          boardDelta: +4,
          headline: `Sensatez de craque: Aos ${player.age} anos, ${player.surname} divide méritos com o grupo após show pelo ${compShort}.`
        },
        {
          id: 'int_bold_fans',
          stance: 'torcida',
          stanceLabel: 'Amor à Torcida & Protagonismo',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `"Eu jogo por essa torcida apaixonada do ${playerClubName}! Sentir essa energia do estádio cantando meu nome é surreal. Vim aqui para ser protagonista e buscar todas as taças que disputarmos!"`,
          impactSummary: 'Idolatria em chamas com a torcida! Redes sociais explodem com seu nome',
          coachDelta: -1,
          fansDelta: +14,
          boardDelta: +3,
          marketValueDelta: 0.2,
          headline: `Incendiou o estádio! ${player.surname} jura amor à torcida na zona mista: "Vim para ser protagonista!"`
        },
        {
          id: 'int_focus_ambitious',
          stance: 'foco',
          stanceLabel: 'Foco Absoluto & Ambição',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          text: `"Fico feliz com o rendimento individual e os gols, mas o mais importante são os 3 pontos na tabela do ${compShort}. Amanhã cedo a cabeça já está na próxima batalha. Queremos brigar por taças no topo."`,
          impactSummary: 'Liderança incontestável e postura de capitão',
          coachDelta: +6,
          fansDelta: +6,
          boardDelta: +5,
          headline: `Sede de títulos: ${player.surname} cobra foco imediato e mostra perfil de líder nos microfones.`
        }
      ]
    };
  }

  // 2. Cenário: Derrota Dolorosa
  if (isLoss) {
    return {
      journalistName: selectedMedia.reporter,
      outletName: selectedMedia.name,
      outletLogo: selectedMedia.logo,
      question: `Resultado amargo para o ${player.currentClub} hoje. A torcida cobrou mais atitude no apito final. O que deu errado taticamente e como reverter esse momento no vestiário?`,
      options: [
        {
          id: 'int_loss_shield',
          stance: 'coletiva',
          stanceLabel: 'Blindar o Elenco & Assumir Responsabilidade',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          text: `"Ninguém aqui se esconde. Perdemos todos juntos e ganhamos juntos. O professor nos deu o plano, nós que falhamos nos detalhes. Vamos trabalhar o dobro na semana."`,
          impactSummary: 'Ganha o respeito absoluto do treinador e dos companheiros',
          coachDelta: +8,
          fansDelta: +3,
          boardDelta: +4,
          headline: `Hombridade nos microfones: ${player.surname} blinda o grupo após revés e promete resposta rápida.`
        },
        {
          id: 'int_loss_fans_apology',
          stance: 'torcida',
          stanceLabel: 'Pedir Desculpas à Torcida & Promessa de Raça',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          text: `"A torcida tem toda a razão de vaiar e cobrar. Quem veste esse manto tem que dar a vida. Peço desculpas a quem veio ao estádio, no próximo jogo vamos correr até o sangue."`,
          impactSummary: 'A torcida reconhece sua honestidade e apoia sua raça',
          coachDelta: +2,
          fansDelta: +8,
          boardDelta: +2,
          headline: `Cobrança sincera: ${player.surname} dá a cara a bater e pede desculpas à torcida na saída de campo.`
        },
        {
          id: 'int_loss_furious',
          stance: 'foco',
          stanceLabel: 'Cobrança Firme de Atitude',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          text: `"Inadmissível tomar gols assim. Falta de atenção pura. Se quisermos disputar coisas grandes na temporada, temos que mudar essa postura agora."`,
          impactSummary: 'Declaração forte que acende o sinal de alerta na diretoria',
          coachDelta: +3,
          fansDelta: +5,
          boardDelta: +1,
          headline: `Tensão no ar! ${player.surname} detona desatenção da equipe na zona mista: "Inadmissível!"`
        }
      ]
    };
  }

  // 3. Cenário: Empate ou Jogo Equilibrado
  return {
    journalistName: selectedMedia.reporter,
    outletName: selectedMedia.name,
    outletLogo: selectedMedia.logo,
    question: `Partida truncada e de muita imposição física contra o ${opp.name}. O empate reflete o que foi o jogo ou ficou o gostinho de que dava para sair com os 3 pontos?`,
    options: [
      {
        id: 'int_draw_balanced',
        stance: 'coletiva',
        stanceLabel: 'Análise Lúcida & Valorizar o Ponto',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        text: `"Foi um jogo muito disputado, digno de campeonato pegado. Não era o que queríamos, mas somar ponto fora de casa é importante para a tabela."`,
        impactSummary: 'Técnico aprova a leitura inteligente da partida',
        coachDelta: +4,
        fansDelta: +2,
        boardDelta: +3,
        headline: `Ponto a ponto: ${player.surname} analisa empate duro e destaca solidez na tabela.`
      },
      {
        id: 'int_draw_rebel',
        stance: 'torcida',
        stanceLabel: 'Insatisfação & Sede de Vitória',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        text: `"Para nós, empate com gosto de derrota! O ${player.currentClub} tem que entrar em qualquer estádio para vencer. Criamos chances e merecíamos mais."`,
        impactSummary: 'Torcida vibra com sua gana vencedora e ambição',
        coachDelta: +1,
        fansDelta: +7,
        boardDelta: +2,
        headline: `Inconformado com o empate, ${player.surname} avisa: "Entramos em qualquer campo para vencer!"`
      },
      {
        id: 'int_draw_next',
        stance: 'foco',
        stanceLabel: 'Virar a Chave para a Próxima Rodada',
        badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
        text: `"O foco agora é descansar, recuperar a energia com a fisioterapia na segunda-feira e fazer valer o mando de campo na rodada seguinte."`,
        impactSummary: 'Profissionalismo exemplar elogiado por todos',
        coachDelta: +5,
        fansDelta: +3,
        boardDelta: +4,
        headline: `Chave virada: ${player.surname} já projeta próxima rodada e prega recuperação física imediata.`
      }
    ]
  };
}
