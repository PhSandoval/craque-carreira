import React, { useState, useEffect } from 'react';
import { PlayerProfile, Club, MatchOutcome, MatchFixture, NewsArticle, MatchHistoryEntry } from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PlayerIdentitySetup } from './components/PlayerIdentitySetup';
import { CareerDashboard } from './components/CareerDashboard';
import { MatchModal } from './components/MatchModal';
import { MemoryLedgerModal } from './components/MemoryLedgerModal';
import { NewsFeedModal } from './components/NewsFeedModal';
import { SettingsModal } from './components/SettingsModal';
import { LeaguesAndSquadsModal } from './components/LeaguesAndSquadsModal';
import { TransferMarketModal } from './components/TransferMarketModal';
import { TrainingAndCalendarModal } from './components/TrainingAndCalendarModal';
import { TeammateAffinityModal } from './components/TeammateAffinityModal';
import { MedicalCenterModal } from './components/MedicalCenterModal';
import { CareerOpportunityModal } from './components/CareerOpportunityModal';
import { PositionTransitionModal } from './components/PositionTransitionModal';
import { FinanceAndContractModal } from './components/FinanceAndContractModal';
import { getNextMatchFixture } from './services/tournamentService';
import { applyWeeklyRestRecovery } from './services/trainingCalendarService';
import { createMemory } from './services/careerMemory';
import { advanceInjuryRound } from './services/injuryAndMedicalService';
import {
  syncActiveLeaguesUpToRound,
  recordStateCupPlayerMatch,
  resetLeagueSimulationState,
  getSynchronizedLeagueStandings,
  ensureSupplementalClubsHydrated
} from './services/syncLeagueSimulationService';
import { generateRandomCareerOpportunity } from './services/dynamicCareerEngine';
import { calculatePlayerYearlyProgression, checkPositionTransitionOpportunity, PositionTransitionRecommendation } from './services/playerAgingService';
import { applyWorldStateToClubs, simulateWorldSeasonAdvance } from './services/worldSimulationService';
import { ensurePlayerEconomy, calculateContractOffer, processPostMatchEconomy } from './services/economyAndContractService';
import { evaluatePlayerOfTheMonth, evaluateEndOfSeasonAwards } from './services/awardsService';
import { triggerHaptic } from './services/hapticsService';
import { CloudUserInfo, subscribeCloudAuth, saveCareerToCloud } from './services/cloudSaveService';
import { CLUBS, findClub } from './data/clubs';

const STORAGE_KEY_PLAYER = 'craque_carreira_player_v3';
const STORAGE_KEY_API = 'craque_gemini_api_key_v1';

export const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerProfile | null>(() => {
    try {
      ensureSupplementalClubsHydrated();
      // Limpa versões legadas de teste para garantir nova carreira limpa
      localStorage.removeItem('craque_carreira_player_v1');
      localStorage.removeItem('craque_carreira_player_v2');

      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Se for o mock inicial legado de 14 jogos, reinicia limpo para nova carreira personalizada
      if (
        parsed?.careerTotals?.games === 14 ||
        parsed?.careerTotals?.goals === 2 ||
        (parsed?.history && parsed.history.some((h: any) => h.games === 14))
      ) {
        localStorage.removeItem(STORAGE_KEY_PLAYER);
        return null;
      }

      // Auto-cura de estatísticas: recalcula careerTotals sem duplicações a partir do histórico e da temporada atual
      const pastGames = (parsed.history || []).reduce((acc: number, h: any) => acc + (h.games || 0), 0);
      const pastGoals = (parsed.history || []).reduce((acc: number, h: any) => acc + (h.goals || 0), 0);
      const pastAssists = (parsed.history || []).reduce((acc: number, h: any) => acc + (h.assists || 0), 0);

      parsed.careerTotals = {
        games: pastGames + (parsed.currentSeasonStats?.games || 0),
        goals: pastGoals + (parsed.currentSeasonStats?.goals || 0),
        assists: pastAssists + (parsed.currentSeasonStats?.assists || 0),
        trophies: parsed.careerTotals?.trophies || 0
      };

      // Auto-cura de sincronização de rodada:
      // Se o atleta já disputou N partidas na temporada, a rodada atual NUNCA pode ser menor que N + 1!
      const minMatchDay = (parsed.currentSeasonStats?.games || 0) + 1;
      if (!parsed.currentMatchDay || parsed.currentMatchDay < minMatchDay) {
        parsed.currentMatchDay = minMatchDay;
      }

      // Auto-cura de personalidade & dinâmica de vestiário
      if (!parsed.lifestylePersona) {
        parsed.lifestylePersona = 'disciplinado_extremo';
        parsed.lifestylePersonaLabel = 'Profissional Obsessivo (Zero Festas)';
      }
      if (!parsed.relationships) {
        parsed.relationships = { coach: 65, fans: 75, board: 70, teammates: 70 };
      }
      if (parsed.relationships.veteransRespect === undefined) {
        parsed.relationships.veteransRespect = 75;
      }
      if (parsed.relationships.partyCliqueChemistry === undefined) {
        parsed.relationships.partyCliqueChemistry = 55;
      }

      return ensurePlayerEconomy(parsed);
    } catch {
      return null;
    }
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_API);
      if (stored && stored.trim().length > 10) return stored;
      return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    } catch {
      return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    }
  });

  // Modais
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [activeOpponent, setActiveOpponent] = useState<Club | null>(null);
  const [activeFixture, setActiveFixture] = useState<MatchFixture | null>(null);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showLeaguesModal, setShowLeaguesModal] = useState(false);
  const [showTransferMarketModal, setShowTransferMarketModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingInitialTab, setTrainingInitialTab] = useState<'attributes' | 'agenda'>('attributes');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [showTeammatesModal, setShowTeammatesModal] = useState(false);
  const [showMedicalCenterModal, setShowMedicalCenterModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [transitionRecommendation, setTransitionRecommendation] = useState<PositionTransitionRecommendation | null>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  // Nuvem Firebase & Banner de Premiação
  const [cloudUser, setCloudUser] = useState<CloudUserInfo | null>(null);
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState<number | null>(null);
  const [awardCelebrationBanner, setAwardCelebrationBanner] = useState<{ title: string; subtitle: string } | null>(null);

  // Inicializa o estado persistido do mundo (idades de adversários, regens e transferências anteriores)
  useEffect(() => {
    applyWorldStateToClubs();
  }, []);

  // Observa sessão Firebase Auth para sincronização PC ↔ Celular
  useEffect(() => {
    return subscribeCloudAuth((u) => setCloudUser(u));
  }, []);

  // Salvar jogador no localStorage automaticamente + debounce sync na nuvem se autenticado
  useEffect(() => {
    if (player) {
      try {
        localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player));
      } catch (err) {
        console.error('Erro ao salvar jogador no storage:', err);
      }

      if (cloudUser?.uid) {
        const timeout = setTimeout(() => {
          saveCareerToCloud(cloudUser.uid, player)
            .then(ts => setLastCloudSyncAt(ts))
            .catch(() => {});
        }, 1600);
        return () => clearTimeout(timeout);
      }
    }
  }, [player, cloudUser?.uid]);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem(STORAGE_KEY_API, key);
    } catch (err) {
      console.error('Erro ao salvar API key:', err);
    }
  };

  const handleResetCareer = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_PLAYER);
      localStorage.removeItem('craque_world_state_v1');
      resetLeagueSimulationState();
    } catch {}
    setPlayer(null);
  };

  const handleStartMatch = () => {
    if (!player) return;
    const fixture = getNextMatchFixture(player);
    setActiveFixture(fixture);
    setActiveOpponent(fixture.opponent);
    setShowMatchModal(true);
  };

  const handleMatchComplete = (updatedPlayer: PlayerProfile, outcome: MatchOutcome) => {
    const pStats = outcome.playerStats || { goals: 0, assists: 0, rating: 6.5, yellowCard: false, redCard: false };
    const completedMatchDay = player?.currentMatchDay || Math.max(1, (updatedPlayer.currentMatchDay || 2) - 1);

    // Economia da partida (bônus por gols, MOTM, salários mensais a cada 4 rodadas)
    const postMatchEcon = processPostMatchEconomy(
      updatedPlayer,
      completedMatchDay,
      pStats.goals || 0,
      Boolean(outcome.motm?.isUser)
    ).updatedPlayer;

    // Verifica se a temporada acabou (Rodada 38 concluída)
    if (postMatchEcon.currentMatchDay > 38) {
      // Registra a temporada no histórico anual
      const seasonAvgRating = postMatchEcon.currentSeasonStats.games > 0
        ? Number((postMatchEcon.currentSeasonStats.ratingSum / postMatchEcon.currentSeasonStats.games).toFixed(1))
        : 7.0;

      const currentClubEnd = findClub(postMatchEcon.currentClub);
      const finalStandings = getSynchronizedLeagueStandings(currentClubEnd.leagueId || 'serie_a', {
        ...postMatchEcon,
        currentMatchDay: 39
      });
      const wonLeagueTitle = finalStandings[0]?.clubId === currentClubEnd.id || finalStandings[0]?.clubName === postMatchEcon.currentClub;

      const consolidatedSeasonTitles = [...(postMatchEcon.seasonTitlesWon || [])];
      let updatedTrophiesTotal = postMatchEcon.careerTotals.trophies || 0;
      if (wonLeagueTitle) {
        const leagueTrophyLabel = `Campeão do ${currentClubEnd.league} (${postMatchEcon.seasonYear})`;
        if (!consolidatedSeasonTitles.includes(leagueTrophyLabel)) {
          consolidatedSeasonTitles.push(leagueTrophyLabel);
          updatedTrophiesTotal += 1;
        }
      }

      // Premiações Oficiais de Fim de Temporada (Artilheiro, Garçom, MVP, Revelação, XI Ideal, Bola de Ouro)
      const endAwards = evaluateEndOfSeasonAwards(postMatchEcon, wonLeagueTitle);
      endAwards.awards.forEach(aw => {
        if (aw.category === 'top_scorer' || aw.category === 'mvp' || aw.category === 'ballon_dor') {
          consolidatedSeasonTitles.push(aw.title);
        }
      });
      updatedTrophiesTotal += endAwards.trophiesBonus;

      const prevAwards = postMatchEcon.awards || {
        motmCount: 0,
        seasonMotmCount: 0,
        potmHistory: [],
        seasonAwards: [],
        ballonDorCount: 0
      };
      const updatedAwards = {
        ...prevAwards,
        seasonMotmCount: 0,
        seasonAwards: [...prevAwards.seasonAwards, ...endAwards.awards],
        ballonDorCount: prevAwards.ballonDorCount + (endAwards.wonBallonDor ? 1 : 0)
      };

      const newHistoryRecord = {
        age: postMatchEcon.age,
        club: postMatchEcon.currentClub,
        ovr: postMatchEcon.ovr,
        games: postMatchEcon.currentSeasonStats.games,
        goals: postMatchEcon.currentSeasonStats.goals,
        assists: postMatchEcon.currentSeasonStats.assists,
        ratingAvg: seasonAvgRating,
        titlesWon: consolidatedSeasonTitles
      };

      const seasonMilestone = createMemory(postMatchEcon, {
        title: wonLeagueTitle
          ? `🏆 CAMPEÃO NACIONAL! Fim de Temporada aos ${postMatchEcon.age} anos`
          : `Fim de Temporada aos ${postMatchEcon.age} anos`,
        description: `Fechou o ano com ${postMatchEcon.currentSeasonStats.games} jogos, ${postMatchEcon.currentSeasonStats.goals} gols e ${postMatchEcon.currentSeasonStats.assists} assistências pelo ${postMatchEcon.currentClub}.`,
        category: 'milestone',
        impactSummary: consolidatedSeasonTitles.length > 0
          ? `Conquistas do ano: ${consolidatedSeasonTitles.join(', ')}`
          : `Temporada consolidada no currículo profissional`,
        tags: ['temporada', postMatchEcon.currentClub.toLowerCase()],
        importance: wonLeagueTitle ? 'lendaria' : 'alta'
      });

      const endMemories = [seasonMilestone, ...postMatchEcon.memories];
      if (endAwards.memory) endMemories.unshift(endAwards.memory);
      const endNews = [...(postMatchEcon.newsFeed || [])];
      if (endAwards.newsArticle) endNews.unshift(endAwards.newsArticle);

      if (wonLeagueTitle || endAwards.awards.length > 0) {
        triggerHaptic('trophy_award');
        setAwardCelebrationBanner({
          title: endAwards.wonBallonDor
            ? `🥇 BOLA DE OURO ${postMatchEcon.seasonYear}!`
            : `🏆 Encerramento da Temporada ${postMatchEcon.seasonYear}`,
          subtitle: endAwards.awards.length > 0
            ? `Premiações conquistadas: ${endAwards.awards.map(a => a.title).join(' • ')}`
            : `Campeão com o ${postMatchEcon.currentClub}!`
        });
      }

      // Envelhecimento Biológico & Curva de Desenvolvimento Anual
      const yearlyProg = calculatePlayerYearlyProgression(postMatchEcon, seasonAvgRating);

      const agedPlayerCandidate = {
        ...postMatchEcon,
        age: postMatchEcon.age + 1,
        ovr: yearlyProg.newOvr,
        marketValueEur: Number((postMatchEcon.marketValueEur + endAwards.marketValueBonus).toFixed(1)),
        attributes: yearlyProg.newAttributes,
        awards: updatedAwards,
        contract: postMatchEcon.contract
          ? { ...postMatchEcon.contract, yearsRemaining: Math.max(1, postMatchEcon.contract.yearsRemaining - 1) }
          : undefined,
        careerTotals: {
          ...postMatchEcon.careerTotals,
          trophies: updatedTrophiesTotal
        }
      };
      const transRec = checkPositionTransitionOpportunity(agedPlayerCandidate);
      if (transRec.eligible) {
        setTransitionRecommendation(transRec);
        setShowTransitionModal(true);
      }

      // Simulação Profunda do Universo do Futebol (com Acesso/Rebaixamento, Regens e Transferências)
      simulateWorldSeasonAdvance(postMatchEcon.seasonYear, postMatchEcon.currentClub, postMatchEcon);
      const refreshedClubAfterPromo = findClub(postMatchEcon.currentClub);

      setPlayer({
        ...agedPlayerCandidate,
        currentClub: refreshedClubAfterPromo.name,
        seasonYear: postMatchEcon.seasonYear + 1,
        history: [...postMatchEcon.history, newHistoryRecord],
        memories: endMemories,
        newsFeed: endNews.slice(0, 25),
        weeklyTrainingDone: false,
        trainingVerdict: undefined,
        eliminatedCompetitions: [],
        seasonTitlesWon: [],
        suspensionRoundsRemaining: 0,
        suspensionReason: undefined,
        currentSeasonStats: {
          games: 0,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          ratingSum: 0
        }
      });
    } else {
      // 1. Se o jogador já estava lesionado em rodadas anteriores (NÃO na partida que acabou de disputar), avança o tempo de recuperação no DM
      let postInjuryPlayer = postMatchEcon;
      if (
        postInjuryPlayer.activeInjury &&
        postInjuryPlayer.activeInjury.occurredAtRound < (player?.currentMatchDay || completedMatchDay)
      ) {
        const adv = advanceInjuryRound(postInjuryPlayer);
        postInjuryPlayer = adv.updatedPlayer;
      }

      // Regeneração Semanal Automática de Energia (+25% ou +37% com câmara hiperbárica)
      let restedPlayer = applyWeeklyRestRecovery(postInjuryPlayer);
      const safeMatchDay = Math.max(
        restedPlayer.currentMatchDay || 1,
        (restedPlayer.currentSeasonStats?.games || 0) + 1
      );

      // Avaliação de Jogador do Mês (POTM) a cada 4 rodadas (4, 8, 12, 16, 20, 24, 28, 32, 36)
      const potmResult = evaluatePlayerOfTheMonth(restedPlayer, completedMatchDay);
      if (potmResult.triggered) {
        const prevAw = restedPlayer.awards || {
          motmCount: 0,
          seasonMotmCount: 0,
          potmHistory: [],
          seasonAwards: [],
          ballonDorCount: 0
        };
        restedPlayer = {
          ...restedPlayer,
          marketValueEur: Number((restedPlayer.marketValueEur + potmResult.marketValueDelta).toFixed(1)),
          moral: Math.min(100, (restedPlayer.moral || 80) + potmResult.moralDelta),
          relationships: {
            ...restedPlayer.relationships,
            fans: Math.min(100, restedPlayer.relationships.fans + potmResult.fansDelta),
            board: Math.min(100, restedPlayer.relationships.board + potmResult.boardDelta)
          },
          awards: potmResult.won && potmResult.award
            ? { ...prevAw, potmHistory: [...prevAw.potmHistory, potmResult.award] }
            : prevAw,
          memories: potmResult.memory ? [potmResult.memory, ...(restedPlayer.memories || [])] : restedPlayer.memories,
          newsFeed: potmResult.newsArticle
            ? [potmResult.newsArticle, ...(restedPlayer.newsFeed || [])].slice(0, 25)
            : restedPlayer.newsFeed
        };

        if (potmResult.won) {
          triggerHaptic('trophy_award');
          setAwardCelebrationBanner({
            title: `🏆 JOGADOR DO MÊS DE ${potmResult.monthLabel.toUpperCase()}!`,
            subtitle: `Você venceu o prêmio oficial de Craque do Mês (${potmResult.award?.ratingAvg.toFixed(1)} nota • ${potmResult.award?.goals}G • ${potmResult.award?.assists}A) e valorizou +€0.8M!`
          });
        }
      }

      // Sincroniza todas as ligas ativas (FM Style) e o Estadual até a rodada recém-concluída, preservando os autores reais dos gols!
      const currentClubObj = findClub(restedPlayer.currentClub);
      const isBrClub = (currentClubObj.country || 'Brasil') === 'Brasil';

      const homeScorers = outcome.goalEvents
        ? outcome.goalEvents.filter(g => g.team === 'home').map(g => ({ name: g.scorerName, minute: g.minute }))
        : [];
      const awayScorers = outcome.goalEvents
        ? outcome.goalEvents.filter(g => g.team === 'away').map(g => ({ name: g.scorerName, minute: g.minute }))
        : [];

      if (activeFixture?.competitionType === 'state_cup' && activeOpponent) {
        recordStateCupPlayerMatch(
          restedPlayer.seasonYear || 2026,
          completedMatchDay,
          currentClubObj.id,
          activeOpponent.id,
          outcome.score.playerTeam,
          outcome.score.opponentTeam
        );
      }

      const isLeagueFixture = activeFixture?.competitionType === 'league';
      const leagueRoundPlayed = isBrClub ? Math.max(1, completedMatchDay - 8) : completedMatchDay;

      syncActiveLeaguesUpToRound(
        completedMatchDay,
        restedPlayer,
        isLeagueFixture && activeOpponent ? {
          round: leagueRoundPlayed,
          homeClubId: currentClubObj.id,
          awayClubId: activeOpponent.id,
          homeScore: outcome.score.playerTeam,
          awayScore: outcome.score.opponentTeam,
          homeScorers,
          awayScorers
        } : undefined
      );

      setPlayer({
        ...restedPlayer,
        currentMatchDay: safeMatchDay,
        weeklyTrainingDone: false,
        trainingVerdict: undefined
      });

      // 2. Sorteio de Acontecimento Aleatório & Bastidores de Carreira (Olheiros, Patrocínios, Dilemas de Vestiário)
      // Ocorre dinamicamente entre as rodadas com base no momento real da partida
      const hadCard = pStats.yellowCard || pStats.redCard;
      const isInjuredNow = !!restedPlayer.activeInjury;

      if (!restedPlayer.activeOpportunity && (Math.random() < 0.70 || pStats.goals >= 1 || hadCard || isInjuredNow)) {
        const recentContext = {
          opponentName: activeOpponent?.name,
          playerGoals: pStats.goals || 0,
          playerAssists: pStats.assists || 0,
          playerRating: pStats.rating || 6.5,
          playerScore: outcome.score?.playerTeam || 0,
          opponentScore: outcome.score?.opponentTeam || 0,
          hadYellowCard: pStats.yellowCard,
          hadRedCard: pStats.redCard,
          wasInjured: isInjuredNow
        };

        generateRandomCareerOpportunity(restedPlayer, safeMatchDay, apiKey, recentContext).then(opp => {
          if (opp) {
            setPlayer(curr => curr ? { ...curr, activeOpportunity: opp } : null);
            setShowOpportunityModal(true);
          }
        });
      }
    }

    setShowMatchModal(false);
  };

  const handleSelectTransferClub = (newClubName: string) => {
    if (!player) return;

    const ensuredPlayer = ensurePlayerEconomy(player);
    const targetClubObj = findClub(newClubName);
    const isCurrent = newClubName === ensuredPlayer.currentClub;
    const offer = calculateContractOffer(targetClubObj, ensuredPlayer, isCurrent);
    const nextBalance = (ensuredPlayer.bankBalanceEur || 0) + offer.signingBonusEur;
    const nextContract = {
      monthlySalaryEur: offer.monthlySalaryEur,
      yearsRemaining: offer.years,
      releaseClauseEur: offer.releaseClauseEur,
      signingBonusEur: offer.signingBonusEur,
      roleLabel: offer.roleLabel
    };
    const signingTx = {
      id: `tx_sign_${Date.now()}`,
      round: ensuredPlayer.currentMatchDay > 38 ? 1 : ensuredPlayer.currentMatchDay,
      seasonYear: ensuredPlayer.seasonYear,
      label: `${isCurrent ? 'Luvas de Renovação' : 'Luvas de Assinatura'} — ${targetClubObj.shortName}`,
      amountEur: offer.signingBonusEur,
      category: 'signing' as const
    };

    if (isCurrent) {
      // Ficou no clube
      const mem = createMemory(ensuredPlayer, {
        title: `Renovação de Contrato com o ${ensuredPlayer.currentClub}`,
        description: `Optou por recusar propostas de rivais, renovou por ${offer.years} anos recebendo €${offer.monthlySalaryEur.toLocaleString('pt-BR')}/mês e jurou amor à torcida do ${ensuredPlayer.currentClub}.`,
        category: 'transfer',
        impactSummary: `Idolatria máxima e contrato valorizado`,
        tags: ['lealdade', ensuredPlayer.currentClub.toLowerCase()],
        importance: 'alta'
      });

      const nextMatchDay = ensuredPlayer.currentMatchDay > 38 
        ? 1 
        : Math.max(ensuredPlayer.currentMatchDay, (ensuredPlayer.currentSeasonStats?.games || 0) + 1);

      triggerHaptic('trophy_award');
      setPlayer({
        ...ensuredPlayer,
        currentMatchDay: nextMatchDay,
        contract: nextContract,
        bankBalanceEur: nextBalance,
        financeHistory: [signingTx, ...(ensuredPlayer.financeHistory || [])].slice(0, 30),
        relationships: {
          ...ensuredPlayer.relationships,
          fans: Math.min(100, ensuredPlayer.relationships.fans + 15),
          board: Math.min(100, ensuredPlayer.relationships.board + 10)
        },
        memories: [mem, ...ensuredPlayer.memories]
      });
    } else {
      // Transferiu-se para novo clube (pode mudar de liga!)
      const oldClub = ensuredPlayer.currentClub;
      const mem = createMemory(ensuredPlayer, {
        title: `Transferência bombástica para o ${newClubName}`,
        description: `Depois de passagens marcantes pelo ${oldClub}, acertou contrato de ${offer.years} anos com o ${newClubName} (${targetClubObj?.league}) por €${offer.monthlySalaryEur.toLocaleString('pt-BR')}/mês.`,
        category: 'transfer',
        impactSummary: `Novo desafio de carreira no ${newClubName} (${targetClubObj?.league})`,
        tags: ['transferencia', newClubName.toLowerCase(), oldClub.toLowerCase()],
        importance: 'lendaria'
      });

      const nextMatchDay = ensuredPlayer.currentMatchDay > 38 
        ? 1 
        : Math.max(ensuredPlayer.currentMatchDay, (ensuredPlayer.currentSeasonStats?.games || 0) + 1);

      triggerHaptic('trophy_award');
      setPlayer({
        ...ensuredPlayer,
        currentClub: newClubName,
        currentMatchDay: nextMatchDay,
        energy: 100,
        contract: nextContract,
        bankBalanceEur: nextBalance,
        financeHistory: [signingTx, ...(ensuredPlayer.financeHistory || [])].slice(0, 30),
        relationships: {
          coach: 65,
          fans: 70,
          board: 75,
          teammates: 65
        },
        rivals: [...ensuredPlayer.rivals, oldClub],
        memories: [mem, ...ensuredPlayer.memories]
      });
    }
  };

  const handleSimulateInjuryRound = () => {
    if (!player) return;

    const fixture = getNextMatchFixture(player);
    const buildSkippedEntry = (reason: 'injury' | 'suspension'): MatchHistoryEntry => ({
      round: player.currentMatchDay,
      seasonYear: player.seasonYear,
      competitionName: fixture.competitionName,
      competitionShort: fixture.competitionShort,
      competitionType: fixture.competitionType,
      stageName: fixture.stageName,
      opponentName: fixture.opponent.name,
      opponentShortName: fixture.opponent.shortName,
      playerTeamScore: 0,
      opponentTeamScore: 0,
      goals: 0,
      assists: 0,
      rating: 0,
      isMotm: false,
      motmName: '-',
      yellowCard: false,
      redCard: false,
      skippedReason: reason
    });

    // Caso 1: Cumprindo Suspensão Automática por Cartões
    if ((player.suspensionRoundsRemaining || 0) > 0) {
      const playerClub = findClub(player.currentClub);
      const remaining = Math.max(0, (player.suspensionRoundsRemaining || 1) - 1);
      const suspArticle: NewsArticle = {
        id: `news_susp_${Date.now()}`,
        round: player.currentMatchDay,
        matchDay: player.currentMatchDay,
        dateStr: new Date().toLocaleDateString('pt-BR'),
        outlet: 'ge.globo',
        badgeColor: '#F59E0B',
        category: 'match',
        categoryLabel: 'Suspensão Cumprida',
        headline: `${player.surname.toUpperCase()} cumpre suspensão automática e volta a ficar à disposição no ${playerClub.shortName}`,
        snippet: `Fora da relação por ${player.suspensionReason || 'cartões'}, o camisa #${player.number} acompanhou a partida dos camarotes e está liberado para retornar na próxima rodada.`
      };

      try {
        syncActiveLeaguesUpToRound(player.currentMatchDay, player);
      } catch {}

      const skippedEntry = buildSkippedEntry('suspension');
      setPlayer({
        ...player,
        currentMatchDay: player.currentMatchDay + 1,
        suspensionRoundsRemaining: remaining,
        suspensionReason: remaining === 0 ? undefined : player.suspensionReason,
        energy: Math.min(100, (player.energy || 75) + 25),
        matchHistory: [...(player.matchHistory || []), skippedEntry],
        newsFeed: [suspArticle, ...(player.newsFeed || [])].slice(0, 25),
        weeklyTrainingDone: false,
        trainingVerdict: undefined
      });
      return;
    }

    if (!player.activeInjury) return;

    const playerClub = CLUBS[player.currentClub] || CLUBS['Grêmio Novorizontino'];

    // Avança 1 rodada do protocolo de recuperação no DM
    const adv = advanceInjuryRound(player);
    const healed = adv.healed;
    const updated = adv.updatedPlayer;

    const newsTitle = healed
      ? `ALTA MÉDICA: ${player.surname.toUpperCase()} está 100% recuperado e liberado para voltar aos gramados!`
      : `BOLETIM DO DM: ${player.surname.toUpperCase()} cumpre protocolo médico e desfalca o ${playerClub.shortName} na rodada`;

    const newsArticle: NewsArticle = {
      id: `news_dm_${Date.now()}`,
      round: player.currentMatchDay,
      matchDay: player.currentMatchDay,
      dateStr: new Date().toLocaleDateString('pt-BR'),
      outlet: 'ge.globo',
      badgeColor: healed ? '#10B981' : '#EF4444',
      category: 'match',
      categoryLabel: healed ? 'Alta Médica Oficial' : 'Boletim do DM',
      headline: newsTitle,
      snippet: healed
        ? `Após cumprir o protocolo médico do Departamento Médico, ${player.surname} foi reavaliado pelo chefe do DM e liberado para treinar e jogar com bola.`
        : `O atleta acompanhou a rodada da tribuna enquanto cumpria sessões de fisioterapia no DM. Restam ${updated.activeInjury?.roundsRemaining || 0} rodada(s) para o retorno.`,
      socialMediaPost: {
        author: 'Torcida Raiz',
        handle: '@torcida_raiz',
        text: healed ? `Graças a Deus a joia voltou! Fazia muita falta em campo!` : `Força craque, recupere logo! O time precisa de você.`,
        likes: '3.4k'
      }
    };

    const newMemories = [...(updated.memories || [])];
    if (healed) {
      newMemories.unshift(createMemory(player, {
        title: 'Alta Médica & Superação de Lesão',
        description: `Concluiu o protocolo do DM com sucesso após superar ${player.activeInjury.name}. 100% liberado para atuar.`,
        category: 'milestone',
        impactSummary: 'Retorno oficial aos treinamentos e escalações',
        tags: ['alta_medica', 'dm', 'superacao'],
        importance: 'media'
      }));
    }

    // Sincroniza simulação das outras ligas e partidas
    try {
      syncActiveLeaguesUpToRound(player.currentMatchDay, player);
    } catch {}

    const skippedInj = buildSkippedEntry('injury');
    const safeMatchDay = player.currentMatchDay + 1;
    setPlayer({
      ...updated,
      currentMatchDay: safeMatchDay,
      energy: Math.min(100, (updated.energy || 75) + 30), // Descanso total na tribuna recupera energia!
      matchHistory: [...(updated.matchHistory || []), skippedInj],
      newsFeed: [newsArticle, ...(updated.newsFeed || [])].slice(0, 25),
      memories: newMemories,
      weeklyTrainingDone: false,
      trainingVerdict: undefined
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col font-sans pb-24 sm:pb-12 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        player={player}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenMemories={() => setShowMemoryModal(true)}
        onOpenLeagues={() => setShowLeaguesModal(true)}
        onOpenTransferMarket={() => setShowTransferMarketModal(true)}
        onOpenTraining={() => {
          setTrainingInitialTab('attributes');
          setShowTrainingModal(true);
        }}
        onOpenAgenda={() => {
          setTrainingInitialTab('agenda');
          setShowTrainingModal(true);
        }}
        onOpenFinances={() => setShowFinanceModal(true)}
        onOpenTeammates={() => setShowTeammatesModal(true)}
        onResetCareer={handleResetCareer}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {awardCelebrationBanner && (
          <div className="mb-4 bg-gradient-to-r from-amber-950/90 via-[#1b2230] to-emerald-950/80 border border-amber-500/70 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
            <div>
              <h3 className="text-sm sm:text-base font-black text-amber-300">{awardCelebrationBanner.title}</h3>
              <p className="text-xs text-slate-200 mt-0.5">{awardCelebrationBanner.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setAwardCelebrationBanner(null)}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs shrink-0"
            >
              Celebrar!
            </button>
          </div>
        )}

        {!player ? (
          <div className="animate-in fade-in duration-300">
            <PlayerIdentitySetup
              onComplete={setPlayer}
              onLoadExistingCareer={(loaded) => setPlayer(loaded)}
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <CareerDashboard
              player={player}
              onPlayNextMatch={handleStartMatch}
              onOpenMemoryLedger={() => setShowMemoryModal(true)}
              onOpenNewsFeed={() => setShowNewsModal(true)}
              onOpenLeagues={() => setShowLeaguesModal(true)}
              onOpenTransferMarket={() => setShowTransferMarketModal(true)}
              onSelectTransferClub={handleSelectTransferClub}
              onOpenTraining={() => {
                setTrainingInitialTab('attributes');
                setShowTrainingModal(true);
              }}
              onOpenAgenda={() => {
                setTrainingInitialTab('agenda');
                setShowTrainingModal(true);
              }}
              onOpenFinances={() => setShowFinanceModal(true)}
              onOpenTeammates={() => setShowTeammatesModal(true)}
              onOpenMedicalCenter={() => setShowMedicalCenterModal(true)}
              onSimulateInjuryRound={handleSimulateInjuryRound}
              onOpenOpportunity={() => setShowOpportunityModal(true)}
              onOpenSettings={() => setShowSettingsModal(true)}
              onResetCareer={handleResetCareer}
            />
          </div>
        )}
      </main>

      {/* Modais do Jogo */}
      {showMatchModal && activeOpponent && player && (
        <MatchModal
          player={player}
          opponent={activeOpponent}
          fixture={activeFixture || undefined}
          apiKey={apiKey}
          onMatchComplete={handleMatchComplete}
          onClose={() => {
            setShowMatchModal(false);
            setActiveFixture(null);
          }}
        />
      )}

      {showMemoryModal && player && (
        <MemoryLedgerModal
          player={player}
          onClose={() => setShowMemoryModal(false)}
        />
      )}

      {showNewsModal && player && (
        <NewsFeedModal
          player={player}
          onClose={() => setShowNewsModal(false)}
        />
      )}

      {showLeaguesModal && player && (
        <LeaguesAndSquadsModal
          player={player}
          onClose={() => setShowLeaguesModal(false)}
        />
      )}

      {showTransferMarketModal && player && (
        <TransferMarketModal
          player={player}
          onSelectTransferClub={handleSelectTransferClub}
          onClose={() => setShowTransferMarketModal(false)}
        />
      )}

      {showTrainingModal && player && (
        <TrainingAndCalendarModal
          player={player}
          initialTab={trainingInitialTab}
          onUpdatePlayer={setPlayer}
          onClose={() => setShowTrainingModal(false)}
        />
      )}

      {showFinanceModal && player && (
        <FinanceAndContractModal
          player={player}
          onUpdatePlayer={setPlayer}
          onClose={() => setShowFinanceModal(false)}
        />
      )}

      {showTeammatesModal && player && (
        <TeammateAffinityModal
          player={player}
          onUpdatePlayer={setPlayer}
          onClose={() => setShowTeammatesModal(false)}
        />
      )}

      {showMedicalCenterModal && player && player.activeInjury && (
        <MedicalCenterModal
          player={player}
          injury={player.activeInjury}
          onClose={() => setShowMedicalCenterModal(false)}
          onUpdatePlayer={(upd) => setPlayer(upd)}
        />
      )}

      {showOpportunityModal && player && player.activeOpportunity && (
        <CareerOpportunityModal
          player={player}
          opportunity={player.activeOpportunity}
          onClose={() => setShowOpportunityModal(false)}
          onUpdatePlayer={(upd) => setPlayer(upd)}
        />
      )}

      {showTransitionModal && player && transitionRecommendation && (
        <PositionTransitionModal
          player={player}
          recommendation={transitionRecommendation}
          onClose={() => setShowTransitionModal(false)}
          onUpdatePlayer={(upd) => setPlayer(upd)}
        />
      )}

      {showSettingsModal && player && (
        <SettingsModal
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          onResetCareer={handleResetCareer}
          player={player}
          onImportPlayer={(imported) => setPlayer(imported)}
          cloudUser={cloudUser}
          lastCloudSyncAt={lastCloudSyncAt}
          onCloudSynced={(ts) => setLastCloudSyncAt(ts)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {player && (
        <MobileBottomNav
          player={player}
          onScrollTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onOpenAgenda={() => {
            setTrainingInitialTab('agenda');
            setShowTrainingModal(true);
          }}
          onOpenLeagues={() => setShowLeaguesModal(true)}
          onOpenFinances={() => setShowFinanceModal(true)}
          onOpenTransferMarket={() => setShowTransferMarketModal(true)}
        />
      )}
    </div>
  );
};

export default App;
