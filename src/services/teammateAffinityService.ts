import { PlayerProfile, Club, TeammateAffinity, RealPlayer } from '../types';
import { CLUBS } from '../data/clubs';
import { createMemory } from './careerMemory';

/**
 * SERVIÇO DE AFINIDADES & PERSONALIDADE EXTRACAMPO DO CRAQUE
 * 
 * Regra Central de Personalidade (User Request):
 * A personalidade do jogador dita ativamente como ele se relaciona com o elenco e a comissão técnica.
 * Exemplo clássico: um atleta que NÃO SAI PARA FESTAS em nenhuma ocasião perde química com a parte
 * baladeira/resenha do elenco (que o acha certinho demais), mas ganha o respeito absoluto dos
 * atletas experientes/veteranos e do treinador!
 */

export interface LifestylePersonaMeta {
  id: 'disciplinado_extremo' | 'festeiro_resenha' | 'lider_agregador' | 'focado_silencioso';
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  veteransEffect: string;
  partyEffect: string;
  coachEffect: string;
  veteransDelta: number;
  partyDelta: number;
  coachDelta: number;
}

export const LIFESTYLE_PERSONAS: LifestylePersonaMeta[] = [
  {
    id: 'disciplinado_extremo',
    title: 'Profissional Obsessivo (Zero Festas)',
    shortLabel: 'Zero Festas & Foco Total',
    tagline: 'Não sai para festas em nenhuma ocasião. Vive 24 horas para o futebol.',
    description: 'Dorme cedo, segue dieta milimétrica e recusa categoricamente convites para baladas, camarotes e noitadas. Ganha o respeito absoluto dos veteranos e a confiança cega do treinador, mas sofre atrito com a ala que gosta da resenha noturna.',
    veteransEffect: '+20% de Respeito dos Veteranos (Exemplo de conduta)',
    partyEffect: '-20% de Química com Festeiros (Acham você certinho demais)',
    coachEffect: '+15% de Confiança do Treinador (Garantia de foco)',
    veteransDelta: 20,
    partyDelta: -20,
    coachDelta: 15
  },
  {
    id: 'festeiro_resenha',
    title: 'Rei da Noite & Pagode',
    shortLabel: 'Vida Noturna & Camarote',
    tagline: 'Gosta de baladas, pagode e noitadas com os parceiros de time.',
    description: 'Presença garantida nas melhores festas e eventos sociais da cidade. Tem química imediata e descontraída com os atacantes festeiros, mas gera cobrança dos líderes experientes e desconfiança da comissão técnica.',
    veteransEffect: '-22% de Respeito dos Veteranos (Cobram foco na carreira)',
    partyEffect: '+25% de Química com Festeiros (Irmãos de balada e campo)',
    coachEffect: '-12% de Confiança do Treinador (Receio de desgaste físico)',
    veteransDelta: -22,
    partyDelta: 25,
    coachDelta: -12
  },
  {
    id: 'lider_agregador',
    title: 'Líder Conciliador & Diplomata',
    shortLabel: 'Equilíbrio & Vestiário Unido',
    tagline: 'Sabe a hora de trabalhar sério e a hora de descontrair.',
    description: 'Ponte de equilíbrio do elenco. Consegue sentar na mesa dos líderes veteranos para discutir tática e ao mesmo tempo manter um bom papo com os garotos da resenha sem se comprometer.',
    veteransEffect: '+8% de Respeito dos Veteranos (Maturidade social)',
    partyEffect: '+8% de Química com Festeiros (Trânsito livre)',
    coachEffect: '+10% de Confiança do Treinador (Liderança positiva)',
    veteransDelta: 8,
    partyDelta: 8,
    coachDelta: 10
  },
  {
    id: 'focado_silencioso',
    title: 'Lobo Solitário',
    shortLabel: 'Silencioso & Individualista',
    tagline: 'Foco exclusivo em seu treino, sem entrar em panelinhas.',
    description: 'Chega, cumpre rigorosamente sua obrigação em campo e vai para casa. Não se envolve na política de vestiário nem nas saídas noturnas. Relações estritamente profissionais.',
    veteransEffect: '0% de Variação (Respeito neutro por competência)',
    partyEffect: '-5% de Distanciamento (Pouca conversa)',
    coachEffect: '+4% de Confiança (Sem problemas disciplinares)',
    veteransDelta: 0,
    partyDelta: -5,
    coachDelta: 4
  }
];

/**
 * Retorna ou inicializa o mapa de afinidade e conexões com os companheiros do clube atual do atleta.
 */
export function getOrInitTeammateAffinities(
  player: PlayerProfile,
  club?: Club | null
): Record<string, TeammateAffinity> {
  const currentClub = club || CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];
  const existing = player.teammateAffinities || {};

  const affinities: Record<string, TeammateAffinity> = { ...existing };
  const squad = currentClub.squad || [];
  const currentPersonaId = player.lifestylePersona || 'disciplinado_extremo';

  for (const teammate of squad) {
    if (teammate.name.toLowerCase() === player.name.toLowerCase() || teammate.name.toLowerCase() === player.surname.toLowerCase()) {
      continue;
    }

    if (!affinities[teammate.id]) {
      const isDirectCompetitor = teammate.position === player.position;
      const isAttackingPartner = 
        (player.position === 'MEI' && (teammate.position === 'CA' || teammate.position === 'PE' || teammate.position === 'PD')) ||
        (player.position === 'CA' && (teammate.position === 'MEI' || teammate.position === 'PE' || teammate.position === 'PD')) ||
        ((player.position === 'PE' || player.position === 'PD') && (teammate.position === 'CA' || teammate.position === 'MEI'));

      const isDefensiveShield = teammate.position === 'VOL' || teammate.position === 'ZAG';

      // ====================================================
      // ATRIBUIÇÃO DA FACÇÃO SOCIAL DO COMPANHEIRO NO ELENCO
      // ====================================================
      let socialClique: 'festeiros' | 'veteranos' | 'base' | 'profissionais' = 'profissionais';
      let cliqueLabel = 'Ala dos Centrados & Focados';

      if (teammate.age >= 30 || teammate.position === 'ZAG' || teammate.position === 'GOL') {
        socialClique = 'veteranos';
        cliqueLabel = 'Ala dos Veteranos & Líderes';
      } else if (teammate.position === 'PE' || teammate.position === 'PD' || (teammate.age <= 26 && teammate.position === 'CA')) {
        socialClique = 'festeiros';
        cliqueLabel = 'Ala da Resenha & Noitada';
      } else if (teammate.age <= 21) {
        socialClique = 'base';
        cliqueLabel = 'Ala das Promessas da Base';
      }

      let baseAffinity = 60;
      let relationshipTitle = 'Companheiro de Elenco';
      let personality = 'Atleta Profissional';
      let frictionReason: string | undefined = undefined;
      let lastInteraction = 'Treinando juntos no dia a dia do clube';

      if (isDirectCompetitor) {
        baseAffinity = 38;
        relationshipTitle = `Concorrente da Posição (${teammate.position})`;
        personality = 'Competitivo & Focado';
        frictionReason = 'Disputa acirrada por minutos e titularidade na mesma faixa de campo';
      } else if (isAttackingPartner && teammate.isStar) {
        baseAffinity = 80;
        relationshipTitle = 'Dupla de Ataque Dinâmica';
        personality = 'Matador de Área';
        lastInteraction = 'Grande entrosamento em triangulações e finalizações no treino';
      } else if (isAttackingPartner) {
        baseAffinity = 74;
        relationshipTitle = 'Parceiro de Ataque';
        personality = 'Ofensivo & Veloz';
        lastInteraction = 'Buscando combinações ofensivas nos coletivos';
      } else if (isDefensiveShield && teammate.isStar) {
        baseAffinity = 74;
        relationshipTitle = 'Cão de Guarda do Meio-Campo';
        personality = 'Xerife Protetor';
        lastInteraction = 'Cobre suas subidas ao ataque com desarmes limpos';
      } else if (socialClique === 'veteranos') {
        baseAffinity = 70;
        relationshipTitle = 'Líder Experiente';
        personality = 'Líder do Vestiário';
        lastInteraction = 'Observando sua maturidade e disciplina no dia a dia';
      } else if (socialClique === 'festeiros') {
        baseAffinity = 65;
        relationshipTitle = 'Parceiro de Resenha';
        personality = 'Amante da Noite & Pagode';
        lastInteraction = 'Conversas sobre música e noites de folga';
      } else if (socialClique === 'base') {
        baseAffinity = 72;
        relationshipTitle = 'Colega de Geração';
        personality = 'Jovem da Base';
        lastInteraction = 'Entrosamento descontraído na concentração';
      }

      // ====================================================
      // IMPACTO DA PERSONALIDADE DO CRAQUE NA AFINIDADE INICIAL
      // ====================================================
      if (currentPersonaId === 'disciplinado_extremo') {
        if (socialClique === 'veteranos') {
          baseAffinity = Math.min(95, baseAffinity + 20);
          lastInteraction = 'O veterano admira sua conduta exemplar: não vai a festas e foca 100% no futebol.';
        } else if (socialClique === 'festeiros') {
          baseAffinity = Math.max(25, baseAffinity - 18);
          frictionReason = 'Atrito de conduta: você nunca sai para festas com a rapaziada, acham você certinho demais.';
        }
      } else if (currentPersonaId === 'festeiro_resenha') {
        if (socialClique === 'festeiros') {
          baseAffinity = Math.min(98, baseAffinity + 22);
          lastInteraction = 'Irmãos de resenha: entrosamento máximo em comemorações e noitadas.';
        } else if (socialClique === 'veteranos') {
          baseAffinity = Math.max(30, baseAffinity - 20);
          frictionReason = 'Cobrança dos líderes: veteranos desaprovam suas saídas noturnas e exigem foco na carreira.';
        }
      }

      const level: 'alta' | 'neutra' | 'baixa' = 
        baseAffinity >= 75 ? 'alta' : baseAffinity >= 45 ? 'neutra' : 'baixa';

      const chemistryBonus = 
        level === 'alta' ? 15 : level === 'neutra' ? 5 : 0;

      affinities[teammate.id] = {
        playerId: teammate.id,
        name: teammate.name,
        position: teammate.position,
        ovr: teammate.ovr,
        age: teammate.age,
        affinity: baseAffinity,
        level,
        relationshipTitle,
        personality,
        socialClique,
        cliqueLabel,
        chemistryBonus,
        lastInteraction,
        frictionReason
      };
    }
  }

  return affinities;
}

/**
 * Altera a postura/personalidade extracampo do atleta e recalcula as relações com o elenco
 */
export function setPlayerLifestylePersona(
  player: PlayerProfile,
  personaId: LifestylePersonaMeta['id']
): { updatedPlayer: PlayerProfile; message: string } {
  const meta = LIFESTYLE_PERSONAS.find(p => p.id === personaId) || LIFESTYLE_PERSONAS[0];
  const affinities = getOrInitTeammateAffinities(player);
  const updatedAffinities: Record<string, TeammateAffinity> = {};

  let veteranCount = 0;
  let partyCount = 0;

  for (const [id, t] of Object.entries(affinities)) {
    let delta = 0;
    let frictionReason = t.frictionReason;
    let lastInteraction = t.lastInteraction;

    if (t.socialClique === 'veteranos') {
      delta = meta.veteransDelta;
      veteranCount++;
      if (personaId === 'disciplinado_extremo') {
        frictionReason = undefined;
        lastInteraction = 'O veterano expressa profundo respeito pela sua disciplina rígida e recusa a noitadas.';
      } else if (personaId === 'festeiro_resenha') {
        frictionReason = 'Veteranos cobram mais maturidade e reprovam suas noitadas constantes.';
      }
    } else if (t.socialClique === 'festeiros') {
      delta = meta.partyDelta;
      partyCount++;
      if (personaId === 'disciplinado_extremo') {
        frictionReason = 'Atrito de convivência: você nunca vai a festas com os guris, acham você anti-social.';
      } else if (personaId === 'festeiro_resenha') {
        frictionReason = undefined;
        lastInteraction = 'Sintonia total nas resenhas pós-jogo e entrosamento festivo.';
      }
    }

    const newScore = Math.min(100, Math.max(15, t.affinity + delta));
    const level: 'alta' | 'neutra' | 'baixa' = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
    const chemistryBonus = level === 'alta' ? 18 : level === 'neutra' ? 6 : 0;

    updatedAffinities[id] = {
      ...t,
      affinity: newScore,
      level,
      chemistryBonus,
      lastInteraction,
      frictionReason
    };
  }

  const newCoachTrust = Math.min(100, Math.max(10, player.relationships.coach + meta.coachDelta));
  const newVeteransRespect = Math.min(100, Math.max(10, (player.relationships.veteransRespect || 60) + meta.veteransDelta));
  const newPartyChemistry = Math.min(100, Math.max(10, (player.relationships.partyCliqueChemistry || 60) + meta.partyDelta));

  const mem = createMemory(player, {
    title: `Postura de Carreira: ${meta.title}`,
    description: `O atleta assumiu publicamente a postura de ${meta.title}. ${meta.description}`,
    category: 'locker_room',
    impactSummary: `Veteranos: ${meta.veteransDelta > 0 ? '+' : ''}${meta.veteransDelta}% • Festeiros: ${meta.partyDelta > 0 ? '+' : ''}${meta.partyDelta}% • Treinador: ${meta.coachDelta > 0 ? '+' : ''}${meta.coachDelta}%`,
    tags: ['personalidade', 'vestiario', personaId],
    importance: 'alta'
  });

  const updatedPlayer: PlayerProfile = {
    ...player,
    lifestylePersona: personaId,
    lifestylePersonaLabel: meta.title,
    relationships: {
      ...player.relationships,
      coach: newCoachTrust,
      veteransRespect: newVeteransRespect,
      partyCliqueChemistry: newPartyChemistry
    },
    teammateAffinities: updatedAffinities,
    memories: [mem, ...player.memories]
  };

  const message = `Conduta definida como ${meta.title}. Repercussão imediata: ${meta.veteransEffect} e ${meta.partyEffect}.`;

  return { updatedPlayer, message };
}

/**
 * Resolve o dilema clássico do convite para a festa/noitada do elenco
 */
export function resolvePartyInvitationDilemma(
  player: PlayerProfile,
  choice: 'decline_focus' | 'accept_party' | 'diplomatic_short'
): { updatedPlayer: PlayerProfile; resultMessage: string; memoryTitle: string } {
  const affinities = getOrInitTeammateAffinities(player);
  const updatedAffinities: Record<string, TeammateAffinity> = {};

  let message = '';
  let memoryTitle = '';
  let memoryDesc = '';
  let energyChange = 0;
  let coachChange = 0;

  if (choice === 'decline_focus') {
    // RECUSAR A FESTA E FOCAR NO REPOUSO (Cenário do usuário)
    message = 'Você recusou a noitada para dormir cedo e focar no treino. Os veteranos e o treinador elogiaram sua maturidade profissional, enquanto a ala festeira achou ruim.';
    memoryTitle = 'Compromisso com o Treino: Recusa à Noitada';
    memoryDesc = `Convidado pelos atletas festeiros para um camarote após a vitória, o jogador recusou o convite e permaneceu focado na recuperação física. Ganhou respeito dos líderes e confiança da comissão técnica.`;
    coachChange = +10;
    energyChange = 0;

    for (const [id, t] of Object.entries(affinities)) {
      let delta = 0;
      let frictionReason = t.frictionReason;
      let lastInteraction = t.lastInteraction;

      if (t.socialClique === 'veteranos') {
        delta = +18;
        lastInteraction = 'O capitão elogiou sua maturidade: "É desse profissionalismo que precisamos para levantar taças."';
      } else if (t.socialClique === 'festeiros') {
        delta = -15;
        frictionReason = 'Reclamaram que você furou a resenha no camarote: "O cara é certinho demais".';
      }

      const newScore = Math.min(100, Math.max(10, t.affinity + delta));
      const level = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
      updatedAffinities[id] = { ...t, affinity: newScore, level, lastInteraction, frictionReason };
    }
  } else if (choice === 'accept_party') {
    // ACEITAR A FESTA E CURTIR A NOITE COM OS PARCEIROS
    message = 'Você foi para o camarote curtir a noite com os parceiros. A química com os festeiros explodiu, mas o capitão veterano cobrou maturidade e o treinador desaprovou.';
    memoryTitle = 'Noitada no Camarote com os Companheiros';
    memoryDesc = `O atleta compareceu à festa VIP com os atacantes do time. Teve grande química com a ala jovem, mas sentiu desgaste físico no dia seguinte e recebeu advertência dos veteranos.`;
    coachChange = -10;
    energyChange = -15;

    for (const [id, t] of Object.entries(affinities)) {
      let delta = 0;
      let frictionReason = t.frictionReason;
      let lastInteraction = t.lastInteraction;

      if (t.socialClique === 'festeiros') {
        delta = +22;
        frictionReason = undefined;
        lastInteraction = 'Sintonia absurda no pagode e na festa com a rapaziada do time!';
      } else if (t.socialClique === 'veteranos') {
        delta = -18;
        frictionReason = 'Cobrança do capitão por dormir tarde na véspera de semana decisiva.';
      }

      const newScore = Math.min(100, Math.max(10, t.affinity + delta));
      const level = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
      updatedAffinities[id] = { ...t, affinity: newScore, level, lastInteraction, frictionReason };
    }
  } else {
    // POSTURA DIPLOMÁTICA: APARECER, CUMPRIMENTAR E SAIR CEDO
    message = 'Você deu uma passada rápida de 30 minutos na comemoração, cumprimentou a todos e foi descansar às 22h. Postura equilibrada que agradou gregos e troianos.';
    memoryTitle = 'Presença Diplomática na Festa';
    memoryDesc = `Marcou presença cordial na comemoração sem exageros, preservando o fôlego e mantendo boa convivência com todos os grupos do vestiário.`;
    coachChange = +3;
    energyChange = -5;

    for (const [id, t] of Object.entries(affinities)) {
      const delta = +5;
      const newScore = Math.min(100, Math.max(10, t.affinity + delta));
      const level = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
      updatedAffinities[id] = { ...t, affinity: newScore, level };
    }
  }

  const mem = createMemory(player, {
    title: memoryTitle,
    description: memoryDesc,
    category: 'locker_room',
    impactSummary: `Impacto de Vestiário: Decisão extracampo que moldou relações internas`,
    tags: ['festa', 'vestiario', 'conduta', choice],
    importance: 'alta'
  });

  const updatedPlayer: PlayerProfile = {
    ...player,
    energy: Math.max(15, player.energy + energyChange),
    relationships: {
      ...player.relationships,
      coach: Math.min(100, Math.max(10, player.relationships.coach + coachChange))
    },
    teammateAffinities: updatedAffinities,
    memories: [mem, ...player.memories]
  };

  return { updatedPlayer, resultMessage: message, memoryTitle };
}

/**
 * Executa uma ação de interação de vestiário com um companheiro de equipe
 */
export function interactWithTeammate(
  player: PlayerProfile,
  teammateId: string,
  action: 'chat' | 'train' | 'praise' | 'resolve_friction'
): { updatedPlayer: PlayerProfile; resultMessage: string; affinityDelta: number } {
  const affinities = getOrInitTeammateAffinities(player);
  const target = affinities[teammateId];

  if (!target) {
    return { updatedPlayer: player, resultMessage: 'Companheiro não encontrado.', affinityDelta: 0 };
  }

  let delta = 0;
  let message = '';
  let interactionLog = '';

  if (action === 'chat') {
    delta = 8;
    message = `Conversa descontraída com ${target.name}! Vocês alinharam ideias de jogo e a afinidade subiu +${delta}%.`;
    interactionLog = `Bateram papo e trocaram ideias no vestiário`;
  } else if (action === 'train') {
    delta = 12;
    message = `Treino técnico em dupla com ${target.name}! Ajustaram movimentações de passe e finalização (+${delta}% de afinidade).`;
    interactionLog = `Sessão extra de tabelas e cruzamentos após o treino`;
  } else if (action === 'praise') {
    delta = 15;
    message = `Você elogiou a postura de ${target.name} publicamente na imprensa! O companheiro agradeceu o reconhecimento (+${delta}% de afinidade).`;
    interactionLog = `Elogiado pelo craque em entrevista coletiva`;
  } else if (action === 'resolve_friction') {
    delta = 25;
    message = `Conversa franca de vestiário com ${target.name}! As diferenças de conduta foram superadas em prol do time (+${delta}% de afinidade).`;
    interactionLog = `Apararam as arestas em conversa madura no vestiário`;
    target.frictionReason = undefined;
  }

  const newScore = Math.min(100, Math.max(10, target.affinity + delta));
  const newLevel: 'alta' | 'neutra' | 'baixa' = 
    newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
  const newChemistryBonus = newLevel === 'alta' ? 18 : newLevel === 'neutra' ? 6 : 0;

  const updatedTarget: TeammateAffinity = {
    ...target,
    affinity: newScore,
    level: newLevel,
    chemistryBonus: newChemistryBonus,
    lastInteraction: interactionLog,
    relationshipTitle: 
      newLevel === 'alta' && target.level !== 'alta' 
        ? (target.position === player.position ? 'Disputa Saudável & Respeito' : 'Grande Parceiro de Equipe')
        : target.relationshipTitle
  };

  const updatedAffinities = {
    ...affinities,
    [teammateId]: updatedTarget
  };

  const newMemories = [...player.memories];
  if (newLevel === 'alta' && target.level !== 'alta') {
    newMemories.unshift(createMemory(player, {
      title: `Química Perfeita com ${target.name}`,
      description: `A sintonia com ${target.name} atingiu nível máximo (${newScore}% de afinidade). A dupla ganha destaque nos bastidores do ${player.currentClub}.`,
      category: 'locker_room',
      impactSummary: `Bônus de entrosamento em campo ativado com ${target.name}`,
      tags: ['vestiario', 'afinidade', target.name.toLowerCase(), 'entrosamento'],
      importance: 'media'
    }));
  }

  const updatedPlayer: PlayerProfile = {
    ...player,
    teammateAffinities: updatedAffinities,
    memories: newMemories,
    relationships: {
      ...player.relationships,
      teammates: Math.min(100, (player.relationships.teammates || 70) + 2)
    }
  };

  return { updatedPlayer, resultMessage: message, affinityDelta: delta };
}

/**
 * Registra entrosamento em campo pós-jogo
 */
export function recordMatchTeammateChemistry(
  player: PlayerProfile,
  assisterName?: string,
  assistedName?: string
): PlayerProfile {
  let updatedPlayer = player;

  if (assisterName) {
    const affinities = getOrInitTeammateAffinities(updatedPlayer);
    const targetEntry = Object.entries(affinities).find(
      ([, t]) => t.name.toLowerCase().includes(assisterName.toLowerCase())
    );
    if (targetEntry) {
      const [tId, target] = targetEntry;
      const newScore = Math.min(100, target.affinity + 8);
      const newLevel: 'alta' | 'neutra' | 'baixa' = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
      updatedPlayer = {
        ...updatedPlayer,
        teammateAffinities: {
          ...affinities,
          [tId]: {
            ...target,
            affinity: newScore,
            level: newLevel,
            chemistryBonus: newLevel === 'alta' ? 18 : 6,
            lastInteraction: 'Assistência recebida dele para você marcar o gol!'
          }
        }
      };
    }
  }

  if (assistedName) {
    const affinities = getOrInitTeammateAffinities(updatedPlayer);
    const targetEntry = Object.entries(affinities).find(
      ([, t]) => t.name.toLowerCase().includes(assistedName.toLowerCase())
    );
    if (targetEntry) {
      const [tId, target] = targetEntry;
      const newScore = Math.min(100, target.affinity + 8);
      const newLevel: 'alta' | 'neutra' | 'baixa' = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
      updatedPlayer = {
        ...updatedPlayer,
        teammateAffinities: {
          ...updatedPlayer.teammateAffinities,
          [tId]: {
            ...target,
            affinity: newScore,
            level: newLevel,
            chemistryBonus: newLevel === 'alta' ? 18 : 6,
            lastInteraction: 'Passe milimétrico seu que resultou em gol dele!'
          }
        }
      };
    }
  }

  return updatedPlayer;
}

/**
 * Registra ganho massivo de moral e química com o vestiário quando o jogador
 * compra a briga pelo time em campo ou defende o companheiro de agressão rival.
 */
export function recordBrawlTeammateDefense(
  player: PlayerProfile,
  oppDefName: string = 'rival',
  bonusVal: number = 14
): PlayerProfile {
  const affinities = getOrInitTeammateAffinities(player);
  const updatedAffinities = { ...affinities };

  Object.entries(updatedAffinities).forEach(([id, mate]) => {
    const newScore = Math.min(100, mate.affinity + bonusVal);
    const newLevel: 'alta' | 'neutra' | 'baixa' = newScore >= 75 ? 'alta' : newScore >= 45 ? 'neutra' : 'baixa';
    updatedAffinities[id] = {
      ...mate,
      affinity: newScore,
      level: newLevel,
      chemistryBonus: newLevel === 'alta' ? 18 : 6,
      lastInteraction: `Comprou a briga pelo time e peitou ${oppDefName} de cabeça erguida!`
    };
  });

  return {
    ...player,
    teammateAffinities: updatedAffinities
  };
}
