import {
  Club,
  PlayerProfile,
  PlayerContract,
  SponsorshipDeal,
  FinanceTransaction,
  CareerOpportunity,
  PlayerAttributes
} from '../types';
import { findClub } from '../data/clubs';
import { createMemory } from './careerMemory';

export interface ContractOfferDetails {
  monthlySalaryEur: number;
  years: number;
  signingBonusEur: number;
  releaseClauseEur: number;
  roleLabel: string;
}

export interface StrategicInvestmentOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  costEur: number;
  cooldownLabel: string;
  badgeColor: string;
  category: 'physio' | 'training' | 'media' | 'lifestyle' | 'elite';
}

export const STRATEGIC_INVESTMENTS: StrategicInvestmentOption[] = [
  {
    id: 'private_physio',
    title: 'Fisioterapeuta Particular',
    subtitle: 'Recuperação Acelerada & Prevenção',
    description: 'Sessão particular de crioterapia, liberação miofascial e botinha de compressão (+35% Energia e reduz 1 rodada no DM se lesionado).',
    costEur: 25000,
    cooldownLabel: '1x por rodada',
    badgeColor: 'text-teal-300 border-teal-700/60 bg-teal-950/50',
    category: 'physio'
  },
  {
    id: 'personal_trainer',
    title: 'Personal Trainer & Preparador Tático',
    subtitle: 'Evolução Direcionada de Fundamentos',
    description: 'Treinos extras individuais fora do CT (+1 permanente em 2 atributos-chave da sua posição e +2% confiança do treinador).',
    costEur: 60000,
    cooldownLabel: '1x por mês (a cada 4 rodadas)',
    badgeColor: 'text-emerald-300 border-emerald-700/60 bg-emerald-950/50',
    category: 'training'
  },
  {
    id: 'pr_agency',
    title: 'Assessoria de Imprensa & Imagem',
    subtitle: 'Gestão de Mídia e Valorização',
    description: 'Campanha nas redes e entrevistas exclusivas (+8% Torcida, +5% Diretoria e +€0.6M no Valor de Mercado).',
    costEur: 85000,
    cooldownLabel: '1x por mês (a cada 4 rodadas)',
    badgeColor: 'text-sky-300 border-sky-700/60 bg-sky-950/50',
    category: 'media'
  },
  {
    id: 'charity_event',
    title: 'Ação Social & Projeto Comunitário',
    subtitle: 'Carisma, Raízes e Liderança',
    description: 'Clínica de futebol e doação em comunidade local (+10% Torcida, +8 Moral, +6 Respeito dos Veteranos e registro no Dossiê).',
    costEur: 50000,
    cooldownLabel: '1x por mês (a cada 4 rodadas)',
    badgeColor: 'text-amber-300 border-amber-700/60 bg-amber-950/50',
    category: 'lifestyle'
  },
  {
    id: 'hyperbaric_chef',
    title: 'Câmara Hiperbárica + Chef Esportivo',
    subtitle: 'Estrutura de Elite em Casa (Temporada)',
    description: 'Investimento anual em estrutura doméstica (+12% de energia extra em toda recuperação semanal e +2 Físico/Moral imediatos).',
    costEur: 220000,
    cooldownLabel: '1x por temporada',
    badgeColor: 'text-purple-300 border-purple-700/60 bg-purple-950/50',
    category: 'elite'
  }
];

export function formatEurCurrency(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const prefix = amount < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    return `${prefix}€${(abs / 1_000_000).toFixed(2).replace('.', ',')}M`;
  }
  return `${prefix}€${abs.toLocaleString('pt-BR')}`;
}

export function calculateInitialSalaryEur(club: Club, player: PlayerProfile): number {
  const prestige = club.prestige || 2;
  const ovrFactor = Math.max(1, player.ovr - 58);
  const tierMult = prestige >= 5 ? 18500 : prestige === 4 ? 9500 : prestige === 3 ? 4200 : prestige === 2 ? 1900 : 1100;
  const raw = prestige * tierMult + ovrFactor * (prestige >= 4 ? 4200 : 950);
  const clamped = Math.min(480000, Math.max(12000, Math.round(raw / 500) * 500));
  return clamped;
}

export function getRoleLabelForContract(ovr: number): string {
  if (ovr >= 82) return 'Estrela do Elenco';
  if (ovr >= 75) return 'Titular Absoluto';
  if (ovr >= 69) return 'Peça de Rotação';
  return 'Joia em Desenvolvimento';
}

export function ensurePlayerEconomy(player: PlayerProfile): PlayerProfile {
  const club = findClub(player.currentClub);
  const defaultSalary = calculateInitialSalaryEur(club, player);

  const contract: PlayerContract = player.contract && player.contract.monthlySalaryEur > 0
    ? {
        monthlySalaryEur: player.contract.monthlySalaryEur,
        yearsRemaining: Math.max(1, player.contract.yearsRemaining || 1),
        releaseClauseEur: player.contract.releaseClauseEur || Number(Math.max((player.marketValueEur || 2) * 2.5, 4).toFixed(1)),
        signingBonusEur: player.contract.signingBonusEur,
        roleLabel: player.contract.roleLabel || getRoleLabelForContract(player.ovr)
      }
    : {
        monthlySalaryEur: defaultSalary,
        yearsRemaining: 3,
        releaseClauseEur: Number(Math.max((player.marketValueEur || 2) * 2.5, 4).toFixed(1)),
        roleLabel: getRoleLabelForContract(player.ovr)
      };

  const bankBalanceEur = typeof player.bankBalanceEur === 'number'
    ? Math.max(0, Math.round(player.bankBalanceEur))
    : contract.monthlySalaryEur * 2;

  return {
    ...player,
    contract,
    bankBalanceEur,
    activeSponsors: Array.isArray(player.activeSponsors) ? player.activeSponsors : [],
    financeHistory: Array.isArray(player.financeHistory) ? player.financeHistory : [],
    purchasedUpgrades: Array.isArray(player.purchasedUpgrades) ? player.purchasedUpgrades : [],
    matchHistory: Array.isArray(player.matchHistory) ? player.matchHistory : [],
    awards: player.awards || {
      motmCount: 0,
      seasonMotmCount: 0,
      potmHistory: [],
      seasonAwards: [],
      ballonDorCount: 0
    }
  };
}

export function calculateContractOffer(
  club: Club,
  player: PlayerProfile,
  isRenewal: boolean
): ContractOfferDetails {
  const ensured = ensurePlayerEconomy(player);
  const currentSalary = ensured.contract?.monthlySalaryEur || 15000;
  const prestige = club.prestige || 3;

  const baseTarget = calculateInitialSalaryEur(club, { ...ensured, ovr: ensured.ovr + (isRenewal ? 2 : 0) });
  const floorSalary = isRenewal ? Math.round(currentSalary * 1.18) : Math.round(currentSalary * 1.05);
  const monthlySalaryEur = Math.min(550000, Math.round(Math.max(baseTarget, floorSalary) / 500) * 500);

  const years = ensured.age >= 32 ? 2 : prestige >= 4 ? 4 : 3;
  const signingBonusEur = Math.round(monthlySalaryEur * (isRenewal ? 1.5 : 2.5) / 500) * 500;
  const releaseClauseEur = Number(Math.max((ensured.marketValueEur || 2) * (prestige >= 4 ? 3.0 : 2.2), 5).toFixed(1));

  return {
    monthlySalaryEur,
    years,
    signingBonusEur,
    releaseClauseEur,
    roleLabel: getRoleLabelForContract(ensured.ovr)
  };
}

export function processPostMatchEconomy(
  rawPlayer: PlayerProfile,
  completedRound: number,
  goalsScored: number,
  isMotm: boolean
): { updatedPlayer: PlayerProfile; summaryLines: string[] } {
  const player = ensurePlayerEconomy(rawPlayer);
  const contract = player.contract!;
  const sponsors = [...(player.activeSponsors || [])];
  const transactions = [...(player.financeHistory || [])];
  const summaryLines: string[] = [];

  let balance = player.bankBalanceEur || 0;

  // 1. Bônus por gol de patrocinadores
  if (goalsScored > 0 && sponsors.length > 0) {
    const perGoalBonus = sponsors.reduce((sum, s) => sum + (s.goalBonusEur || 0), 0);
    const totalGoalBonus = perGoalBonus * goalsScored;
    if (totalGoalBonus > 0) {
      balance += totalGoalBonus;
      transactions.unshift({
        id: `tx_goal_${completedRound}_${Date.now()}`,
        round: completedRound,
        seasonYear: player.seasonYear,
        label: `Bônus por ${goalsScored} gol(s) (${sponsors.map(s => s.brand).join(', ')})`,
        amountEur: totalGoalBonus,
        category: 'bonus'
      });
      summaryLines.push(`Bônus de gol: +${formatEurCurrency(totalGoalBonus)}`);
    }
  }

  // 2. Bônus de Craque da Partida (MOTM)
  if (isMotm) {
    const motmBonus = Math.max(2500, Math.round((contract.monthlySalaryEur * 0.15) / 500) * 500);
    balance += motmBonus;
    transactions.unshift({
      id: `tx_motm_${completedRound}_${Date.now()}`,
      round: completedRound,
      seasonYear: player.seasonYear,
      label: `Prêmio Craque do Jogo (MOTM) — ${player.currentClub}`,
      amountEur: motmBonus,
      category: 'bonus'
    });
    summaryLines.push(`Prêmio MOTM: +${formatEurCurrency(motmBonus)}`);
  }

  // 3. Dia de pagamento mensal (a cada 4 rodadas)
  let updatedSponsors = sponsors;
  if (completedRound % 4 === 0) {
    balance += contract.monthlySalaryEur;
    transactions.unshift({
      id: `tx_sal_${completedRound}_${Date.now()}`,
      round: completedRound,
      seasonYear: player.seasonYear,
      label: `Salário Mensal — ${player.currentClub}`,
      amountEur: contract.monthlySalaryEur,
      category: 'salary'
    });
    summaryLines.push(`Salário mensal: +${formatEurCurrency(contract.monthlySalaryEur)}`);

    const sponsorMonthly = sponsors.reduce((sum, s) => sum + (s.monthlyEur || 0), 0);
    if (sponsorMonthly > 0) {
      balance += sponsorMonthly;
      transactions.unshift({
        id: `tx_sp_${completedRound}_${Date.now()}`,
        round: completedRound,
        seasonYear: player.seasonYear,
        label: `Parcela Mensal Patrocínios (${sponsors.map(s => s.brand).join(', ')})`,
        amountEur: sponsorMonthly,
        category: 'sponsor'
      });
      summaryLines.push(`Patrocínios: +${formatEurCurrency(sponsorMonthly)}`);
    }
  }

  // Decrementa rodadas restantes dos patrocínios ativos
  updatedSponsors = sponsors
    .map(s => ({ ...s, roundsRemaining: Math.max(0, s.roundsRemaining - 1) }))
    .filter(s => s.roundsRemaining > 0);

  return {
    updatedPlayer: {
      ...player,
      bankBalanceEur: balance,
      activeSponsors: updatedSponsors,
      financeHistory: transactions.slice(0, 30)
    },
    summaryLines
  };
}

export function getUpgradeCooldownKey(investmentId: string, player: PlayerProfile): string {
  const round = Math.max(1, player.currentMatchDay || 1);
  const monthBlock = Math.floor((round - 1) / 4) + 1;
  if (investmentId === 'private_physio') {
    return `upg_physio_y${player.seasonYear}_r${round}`;
  }
  if (investmentId === 'hyperbaric_chef') {
    return `upg_hyperbaric_y${player.seasonYear}`;
  }
  return `upg_${investmentId}_y${player.seasonYear}_m${monthBlock}`;
}

export function hasSeasonalHyperbaricUpgrade(player: PlayerProfile): boolean {
  return (player.purchasedUpgrades || []).includes(`upg_hyperbaric_y${player.seasonYear}`);
}

export function purchaseStrategicInvestment(
  rawPlayer: PlayerProfile,
  investmentId: string
): { success: boolean; message: string; updatedPlayer: PlayerProfile } {
  const player = ensurePlayerEconomy(rawPlayer);
  const opt = STRATEGIC_INVESTMENTS.find(i => i.id === investmentId);
  if (!opt) {
    return { success: false, message: 'Investimento não encontrado.', updatedPlayer: player };
  }

  const cooldownKey = getUpgradeCooldownKey(investmentId, player);
  const upgrades = player.purchasedUpgrades || [];
  if (upgrades.includes(cooldownKey)) {
    return {
      success: false,
      message: `Limite atingido para "${opt.title}" (${opt.cooldownLabel}).`,
      updatedPlayer: player
    };
  }

  const balance = player.bankBalanceEur || 0;
  if (balance < opt.costEur) {
    return {
      success: false,
      message: `Saldo insuficiente! Necessário ${formatEurCurrency(opt.costEur)} (você tem ${formatEurCurrency(balance)}).`,
      updatedPlayer: player
    };
  }

  let updated: PlayerProfile = {
    ...player,
    bankBalanceEur: balance - opt.costEur,
    purchasedUpgrades: [...upgrades, cooldownKey],
    financeHistory: [
      {
        id: `tx_inv_${Date.now()}`,
        round: player.currentMatchDay || 1,
        seasonYear: player.seasonYear,
        label: `Investimento: ${opt.title}`,
        amountEur: -opt.costEur,
        category: 'investment' as const
      },
      ...(player.financeHistory || [])
    ].slice(0, 30)
  };

  let msg = '';

  if (investmentId === 'private_physio') {
    const newEnergy = Math.min(100, (updated.energy || 75) + 35);
    let activeInjury = updated.activeInjury || null;
    let injuryMsg = '';
    if (activeInjury) {
      const nextRounds = activeInjury.roundsRemaining - 1;
      if (nextRounds <= 0) {
        activeInjury = null;
        injuryMsg = ' Tratamento intensivo acelerou sua ALTA MÉDICA!';
      } else {
        activeInjury = { ...activeInjury, roundsRemaining: nextRounds };
        injuryMsg = ` Recuperação no DM adiantada (restam ${nextRounds} rodada(s)).`;
      }
    }
    updated = { ...updated, energy: newEnergy, activeInjury };
    msg = `Fisioterapia particular concluída! Energia em ${newEnergy}%.${injuryMsg}`;
  } else if (investmentId === 'personal_trainer') {
    const pos = updated.position;
    const targetStats: Array<keyof PlayerAttributes> =
      pos === 'GOL'
        ? ['reflexes', 'passing']
        : pos === 'ZAG' || pos === 'VOL' || pos === 'LE' || pos === 'LD'
        ? ['defense', 'physical']
        : pos === 'MEI' || pos === 'MC' || pos === 'ME' || pos === 'MD'
        ? ['passing', 'vision']
        : ['finalization', 'dribbling'];

    const newAttrs = { ...updated.attributes };
    targetStats.forEach(st => {
      const curr = (newAttrs[st] as number) ?? 65;
      (newAttrs[st] as number) = Math.min(99, curr + 1);
    });
    const avg = Math.round(
      (newAttrs.finalization + newAttrs.passing + newAttrs.dribbling + newAttrs.pace + newAttrs.defense + newAttrs.physical + newAttrs.vision) / 7
    );
    const nextOvr = Math.min(99, Math.max(updated.ovr, avg));
    updated = {
      ...updated,
      attributes: newAttrs,
      ovr: nextOvr,
      relationships: {
        ...updated.relationships,
        coach: Math.min(100, (updated.relationships?.coach || 65) + 2)
      }
    };
    msg = `Treino particular concluído! +1 em fundamentos-chave e +2% moral com o técnico.`;
  } else if (investmentId === 'pr_agency') {
    updated = {
      ...updated,
      marketValueEur: Number(((updated.marketValueEur || 2) + 0.6).toFixed(1)),
      relationships: {
        ...updated.relationships,
        fans: Math.min(100, (updated.relationships?.fans || 70) + 8),
        board: Math.min(100, (updated.relationships?.board || 70) + 5)
      }
    };
    msg = `Campanha de mídia no ar! +8% Torcida, +5% Diretoria e +€0.6M em Valor de Mercado.`;
  } else if (investmentId === 'charity_event') {
    const mem = createMemory(updated, {
      title: 'Ação Social & Projeto Comunitário',
      description: `Financiou do próprio bolso clínicas esportivas e doações na região do ${updated.currentClub}, ganhando respeito nacional.`,
      category: 'milestone',
      impactSummary: '+10% Torcida, +8% Moral e prestígio no vestiário',
      tags: ['acao_social', 'lideranca'],
      importance: 'media'
    });
    updated = {
      ...updated,
      moral: Math.min(100, (updated.moral || 80) + 8),
      relationships: {
        ...updated.relationships,
        fans: Math.min(100, (updated.relationships?.fans || 70) + 10),
        veteransRespect: Math.min(100, (updated.relationships?.veteransRespect ?? 70) + 6)
      },
      memories: [mem, ...(updated.memories || [])]
    };
    msg = `Ação social emocionante realizada! +10% Torcida, +8% Moral e registro no Dossiê.`;
  } else if (investmentId === 'hyperbaric_chef') {
    const newAttrs = {
      ...updated.attributes,
      physical: Math.min(99, (updated.attributes.physical || 65) + 2)
    };
    updated = {
      ...updated,
      attributes: newAttrs,
      moral: Math.min(100, (updated.moral || 80) + 5),
      energy: Math.min(100, (updated.energy || 75) + 25)
    };
    msg = `Estrutura de elite instalada em casa! Recuperação semanal reforçada em +12% durante toda a temporada ${updated.seasonYear}.`;
  }

  return { success: true, message: msg, updatedPlayer: updated };
}

export function detectBrandFromOpportunity(opp: CareerOpportunity): string {
  const hay = `${opp.title} ${opp.subtitle} ${opp.source} ${opp.description}`;
  const knownBrands = ['Nike', 'Adidas', 'Puma', 'Mizuno', 'New Balance', 'Under Armour', 'Gatorade', 'Umbro', 'Penalty'];
  const found = knownBrands.find(b => hay.toLowerCase().includes(b.toLowerCase()));
  if (found) return found;
  return opp.source && opp.source.length <= 28 ? opp.source : 'Patrocínio Esportivo';
}

export function registerSponsorshipFromOpportunity(
  rawPlayer: PlayerProfile,
  opportunity: CareerOpportunity,
  chosenOptionLabel: string
): { updatedPlayer: PlayerProfile; dealAdded?: SponsorshipDeal } {
  const player = ensurePlayerEconomy(rawPlayer);
  const lowered = chosenOptionLabel.toLowerCase();
  const isRefusal =
    lowered.includes('recus') ||
    lowered.includes('rejeit') ||
    lowered.includes('focar apenas no futebol') ||
    lowered.includes('não assinar') ||
    lowered.includes('declinar');

  if (opportunity.type !== 'sponsorship' || isRefusal) {
    return { updatedPlayer: player };
  }

  const brand = detectBrandFromOpportunity(opportunity);
  const club = findClub(player.currentClub);
  const prestige = club.prestige || 3;
  const monthlyEur = Math.min(
    90000,
    Math.round(((prestige * 5500 + Math.max(0, player.ovr - 62) * 1400)) / 500) * 500
  );
  const goalBonusEur = Math.max(2500, Math.round((monthlyEur * 0.22) / 500) * 500);
  const signingAdvance = monthlyEur * 2;

  const existing = (player.activeSponsors || []).filter(s => s.brand !== brand);
  const newDeal: SponsorshipDeal = {
    id: `sp_${Date.now()}`,
    brand,
    monthlyEur,
    goalBonusEur,
    roundsRemaining: 16
  };

  return {
    dealAdded: newDeal,
    updatedPlayer: {
      ...player,
      bankBalanceEur: (player.bankBalanceEur || 0) + signingAdvance,
      activeSponsors: [newDeal, ...existing],
      financeHistory: [
        {
          id: `tx_sp_sign_${Date.now()}`,
          round: player.currentMatchDay || 1,
          seasonYear: player.seasonYear,
          label: `Luvas de Patrocínio — ${brand}`,
          amountEur: signingAdvance,
          category: 'signing' as const
        },
        ...(player.financeHistory || [])
      ].slice(0, 30)
    }
  };
}
