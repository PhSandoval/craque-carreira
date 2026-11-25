import React, { useState, useEffect } from 'react';
import {
  PlayerProfile,
  Club,
  MatchOutcome,
  MatchFixture,
  NewsArticle,
  MatchHistoryEntry,
  WeeklyTrainingResult
} from './types';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PlayerIdentitySetup } from './components/PlayerIdentitySetup';
import { CareerDashboard, DashboardTab, PerfilSubTab } from './components/CareerDashboard';
import { MatchModal } from './components/MatchModal';
import { SettingsModal } from './components/SettingsModal';
import { MedicalCenterModal } from './components/MedicalCenterModal';
import { CareerOpportunityModal } from './components/CareerOpportunityModal';
import { PositionTransitionModal } from './components/PositionTransitionModal';
import { EventPopupModal, CareerPopupEvent } from './components/EventPopupModal';
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
import { ensurePlayerEconomy, calculateContractOffer, processPostMatchEconomy, formatEurCurrency } from './services/economyAndContractService';
import { evaluatePlayerOfTheMonth, evaluateEndOfSeasonAwards } from './services/awardsService';
import { triggerHaptic } from './services/hapticsService';
import { getPlayerKnownName } from './utils/playerDisplay';
import { CloudUserInfo, subscribeCloudAuth, saveCareerToCloud } from './services/cloudSaveService';
import { findClub } from './data/clubs';

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
      if (!parsed.knownName && parsed.surname) {
        parsed.knownName = parsed.surname;
      }
      if (!parsed.currentWeekDay) {
        parsed.currentWeekDay = 1;
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

  // Navegação Compartimentada por Abas
  const [activeTab, setActiveTab] = useState<DashboardTab>('resumo');
  const [trainingSubTab, setTrainingSubTab] = useState<'attributes' | 'agenda' | 'coach_prep' | 'calendar' | 'physio'>('attributes');
  const [mercadoSubTab, setMercadoSubTab] = useState<'transfer' | 'finance'>('transfer');
  const [perfilSubTab, setPerfilSubTab] = useState<PerfilSubTab>('atributos');

  // Fila de Pop-ups Obrigatórios (decisões, acontecimentos, avisos e notícias)
  const [popupQueue, setPopupQueue] = useState<CareerPopupEvent[]>([]);

  // Modais de Ação & Decisão
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [activeOpponent, setActiveOpponent] = useState<Club | null>(null);
  const [activeFixture, setActiveFixture] = useState<MatchFixture | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMedicalCenterModal, setShowMedicalCenterModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [transitionRecommendation, setTransitionRecommendation] = useState<PositionTransitionRecommendation | null>(null);
  const [showTransitionModal, setShowTransitionModal] = useState(false);

  // Nuvem Firebase
  const [cloudUser, setCloudUser] = useState<CloudUserInfo | null>(null);
  const [lastCloudSyncAt, setLastCloudSyncAt] = useState<number | null>(null);

  const enqueuePopup = (event: CareerPopupEvent) => {
    setPopupQueue(prev => [...prev, event]);
  };

  const dismissCurrentPopup = () => {
    setPopupQueue(prev => prev.slice(1));
  };

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
    setPopupQueue([]);
    setActiveTab('resumo');
    setPlayer(null);
  };

  const handleCareerCreated = (newPlayer: PlayerProfile) => {
    const clubObj = findClub(newPlayer.currentClub);
    const known = getPlayerKnownName(newPlayer);
    setPlayer({ ...newPlayer, currentWeekDay: 1 });
    setActiveTab('resumo');

    enqueuePopup({
      id: `popup_welcome_${Date.now()}`,
      category: 'welcome',
      badge: 'Apresentação Oficial',
      title: `Bem-vindo ao ${clubObj.name}, ${known}!`,
      subtitle: `Camisa #${newPlayer.number} • Estilo: ${newPlayer.playStyleName || newPlayer.position}`,
      description: `Você assinou seu primeiro contrato profissional e já se apresenta ao técnico ${clubObj.coachName}. Acompanhe sua agenda semanal no Resumo e avance os dias até a estreia na Rodada 1.`,
      highlights: [
        { label: 'OVR Inicial', value: String(newPlayer.ovr), tone: 'emerald' },
        { label: 'Salário/Mês', value: formatEurCurrency(newPlayer.contract?.monthlySalaryEur || 15000), tone: 'sky' },
        { label: 'Clube', value: clubObj.shortName, tone: 'amber' }
      ],
      primaryActionLabel: 'Ir para Minha Agenda'
    });
  };

  const handleTrainingCompleted = (result: WeeklyTrainingResult, updatedPlayer: PlayerProfile) => {
    const known = getPlayerKnownName(updatedPlayer);
    const statSummary = result.statChanges
      .map(c => `${c.statLabel}: ${c.before} → ${c.after} (${c.delta >= 0 ? `+${c.delta}` : c.delta})`)
      .join('\n');

    enqueuePopup({
      id: `popup_train_${Date.now()}`,
      category: result.outcomeType === 'negative' ? 'coach_note' : 'training',
      badge: 'Relatório do CT',
      title: `${result.outcomeTitle} • ${known}`,
      subtitle: `Foco: ${result.focusTitle}`,
      description: `${result.description}\n\n${statSummary}\n\nTécnico: "${result.coachFeedback}"`,
      highlights: [
        { label: 'OVR Atual', value: String(updatedPlayer.ovr), tone: 'emerald' },
        {
          label: 'Variação',
          value: result.ovrDelta > 0 ? `+${result.ovrDelta} OVR` : result.ovrDelta < 0 ? `${result.ovrDelta} OVR` : 'Estável',
          tone: result.ovrDelta >= 0 ? 'sky' : 'rose'
        },
        { label: 'Fôlego', value: `${updatedPlayer.energy}%`, tone: 'amber' }
      ],
      primaryActionLabel: 'Voltar ao Resumo',
      onPrimaryAction: () => setActiveTab('resumo'),
      secondaryActionLabel: 'Ficar nos Treinos'
    });
  };

  const handleOpenNewsPopup = (article: NewsArticle) => {
    const socialTxt = article.socialMediaPost
      ? `\n\n💬 ${article.socialMediaPost.author} (${article.socialMediaPost.handle}):\n"${article.socialMediaPost.text}"`
      : '';
    const quoteTxt = article.interviewQuote ? `\n\n🎙️ Sua declaração:\n"${article.interviewQuote}"` : '';

    enqueuePopup({
      id: `popup_news_${article.id}_${Date.now()}`,
      category: 'news',
      badge: `${article.outlet} • ${article.categoryLabel}`,
      title: article.headline,
      subtitle: article.dateStr,
      description: `${article.snippet}${quoteTxt}${socialTxt}`,
      primaryActionLabel: 'Fechar Reportagem',
      secondaryActionLabel: 'Abrir Imprensa Completa',
      onSecondaryAction: () => {
        setPerfilSubTab('imprensa');
        setActiveTab('perfil');
      }
    });
  };

  const handleAdvanceDay = () => {
    if (!player) return;
    triggerHaptic('tap');

    const effectiveMatchDay = Math.max(
      player.currentMatchDay || 1,
      (player.currentSeasonStats?.games || 0) + 1
    );
    const known = getPlayerKnownName(player);
    const clubObj = findClub(player.currentClub);
    const weekDay = Math.min(4, Math.max(1, player.currentWeekDay || 1));

    if (effectiveMatchDay > 38) {
      enqueuePopup({
        id: `popup_window_${Date.now()}`,
        category: 'transfer_window',
        badge: 'Janela de Transferências',
        title: 'Mercado Aberto para Negociações!',
        subtitle: `Fim da temporada ${player.seasonYear}`,
        description: 'Chegaram novas propostas de clubes interessados no seu futebol. Avalie os contratos e salários ou escolha permanecer.',
        primaryActionLabel: 'Ir para o Mercado da Bola',
        onPrimaryAction: () => {
          setMercadoSubTab('transfer');
          setActiveTab('mercado');
        },
        secondaryActionLabel: 'Depois'
      });
      return;
    }

    // Dia 1 -> Dia 2 (Dia de Treino no CT)
    if (weekDay === 1) {
      const nextPlayer: PlayerProfile = {
        ...player,
        currentWeekDay: 2,
        energy: Math.min(100, (player.energy || 75) + 4)
      };
      setPlayer(nextPlayer);

      if (!nextPlayer.weeklyTrainingDone) {
        enqueuePopup({
          id: `popup_day2_train_${Date.now()}`,
          category: 'training',
          badge: 'Dia 2 • Centro de Treinamento',
          title: 'Sessão Tática & Foco Semanal Aberta',
          subtitle: `${clubObj.name} • Rodada ${effectiveMatchDay}/38`,
          description: `A comissão técnica de ${clubObj.coachName} aguarda você no gramado do CT para definir o foco do treino desta semana.`,
          highlights: [
            { label: 'Fôlego', value: `${nextPlayer.energy}%`, tone: 'emerald' },
            { label: 'OVR Atual', value: String(nextPlayer.ovr), tone: 'sky' }
          ],
          primaryActionLabel: 'Treinar Agora',
          onPrimaryAction: () => {
            setTrainingSubTab('attributes');
            setActiveTab('treino');
          },
          secondaryActionLabel: 'Avançar Mesmo Assim'
        });
      }
      return;
    }

    // Dia 2 -> Dia 3 (Bastidores, Oportunidades e Avisos de Condição)
    if (weekDay === 2) {
      const nextPlayer: PlayerProfile = {
        ...player,
        currentWeekDay: 3,
        energy: Math.min(100, (player.energy || 75) + 3)
      };
      setPlayer(nextPlayer);

      if (nextPlayer.activeOpportunity) {
        setShowOpportunityModal(true);
        return;
      }

      if (nextPlayer.energy < 60 && !nextPlayer.activeInjury) {
        enqueuePopup({
          id: `popup_fatigue_${Date.now()}`,
          category: 'coach_note',
          badge: 'Alerta da Fisiologia',
          title: 'Fadiga Muscular Detectada no Elenco',
          subtitle: `Energia em ${nextPlayer.energy}% antes da Rodada ${effectiveMatchDay}`,
          description: 'O departamento de fisiologia recomendou atenção ao seu desgaste físico. Você pode fazer uma recuperação extra no CT/Fisioterapia antes da partida.',
          highlights: [
            { label: 'Fôlego Atual', value: `${nextPlayer.energy}%`, tone: 'rose' },
            { label: 'Risco Lesão', value: 'Elevado', tone: 'amber' }
          ],
          primaryActionLabel: 'Ir para Fisioterapia',
          onPrimaryAction: () => {
            setTrainingSubTab('physio');
            setActiveTab('treino');
          },
          secondaryActionLabel: 'Continuar Semana'
        });
        return;
      }

      if (Math.random() < 0.45) {
        const fixture = getNextMatchFixture(nextPlayer);
        generateRandomCareerOpportunity(nextPlayer, effectiveMatchDay, apiKey, {
          opponentName: fixture.opponent.name
        }).then(opp => {
          if (opp) {
            setPlayer(curr => (curr ? { ...curr, activeOpportunity: opp } : null));
            setShowOpportunityModal(true);
          }
        });
        return;
      }

      const nextFixture = getNextMatchFixture(nextPlayer);
      if (nextFixture.isCupKnockout || nextFixture.isNationalTeamMatch) {
        enqueuePopup({
          id: `popup_prematch_${Date.now()}`,
          category: 'coach_note',
          badge: nextFixture.isNationalTeamMatch ? 'Convocação Oficial' : 'Véspera de Decisão',
          title: nextFixture.isNationalTeamMatch
            ? `${known} concentrado com a Seleção!`
            : `Clima de Mata-Mata contra ${nextFixture.opponent.shortName}`,
          subtitle: nextFixture.competitionName,
          description: `A concentração começou! Amanhã é dia de jogo decisivo pela ${nextFixture.stageName}. Revise sua energia e preparo antes do apito inicial.`,
          primaryActionLabel: 'Entendido'
        });
      }
      return;
    }

    // Dia 3 -> Dia 4 (Dia de Jogo!)
    if (weekDay === 3) {
      const nextPlayer: PlayerProfile = {
        ...player,
        currentWeekDay: 4
      };
      setPlayer(nextPlayer);

      if ((nextPlayer.suspensionRoundsRemaining || 0) > 0) {
        enqueuePopup({
          id: `popup_susp_day_${Date.now()}`,
          category: 'suspension',
          badge: 'Suspensão Automática',
          title: 'Você está fora desta partida',
          subtitle: nextPlayer.suspensionReason || 'Suspenso por cartões',
          description: `Faltam ${nextPlayer.suspensionRoundsRemaining} rodada(s) para cumprir a punição. Acompanhe o jogo das arquibancadas para avançar a rodada.`,
          primaryActionLabel: 'Cumprir Suspensão Agora',
          onPrimaryAction: () => handleSimulateInjuryRound(),
          secondaryActionLabel: 'Ficar no Resumo'
        });
        return;
      }

      if (nextPlayer.activeInjury && !nextPlayer.activeInjury.isPlayingOnSacrifice) {
        setShowMedicalCenterModal(true);
        return;
      }

      if (!nextPlayer.weeklyTrainingDone) {
        enqueuePopup({
          id: `popup_need_train_${Date.now()}`,
          category: 'training',
          badge: 'Último Aviso antes do Jogo',
          title: 'Treino Semanal ainda não concluído',
          subtitle: 'Complete seu treino antes de ir a campo',
          description: `${clubObj.coachName} exige o cumprimento do foco semanal antes da escalação oficial. Realize a sessão de treino para liberar a partida!`,
          primaryActionLabel: 'Ir para Treino Obrigatório',
          onPrimaryAction: () => {
            setTrainingSubTab('attributes');
            setActiveTab('treino');
          },
          secondaryActionLabel: 'Fechar'
        });
        return;
      }

      const nextFixture = getNextMatchFixture(nextPlayer);
      enqueuePopup({
        id: `popup_matchday_${Date.now()}`,
        category: 'match_alert',
        badge: 'Dia de Jogo!',
        title: `${nextFixture.isNationalTeamMatch ? nextPlayer.nationality : clubObj.shortName} vs ${nextFixture.opponent.shortName}`,
        subtitle: `${nextFixture.competitionName} • ${nextFixture.stageName}`,
        description: `Chegou a hora! O vestiário está pronto e a torcida já lota o ${clubObj.stadium}. Deseja ir para a preleção da partida?`,
        primaryActionLabel: 'Ir para a Partida Agora',
        onPrimaryAction: () => handleStartMatch(),
        secondaryActionLabel: 'Preparar Antes'
      });
      return;
    }

    // Dia 4: Tenta abrir a partida (respeitando bloqueios)
    handleStartMatch();
  };

  const handleAdvanceToMatchDay = () => {
    if (!player) return;
    const effectiveMatchDay = Math.max(
      player.currentMatchDay || 1,
      (player.currentSeasonStats?.games || 0) + 1
    );
    if (effectiveMatchDay > 38) {
      handleAdvanceDay();
      return;
    }

    const weekDay = Math.min(4, Math.max(1, player.currentWeekDay || 1));
    if (!player.weeklyTrainingDone && weekDay < 2) {
      handleAdvanceDay();
      return;
    }
    if (!player.weeklyTrainingDone) {
      setPlayer(curr => (curr ? { ...curr, currentWeekDay: 4 } : null));
      enqueuePopup({
        id: `popup_ff_train_${Date.now()}`,
        category: 'training',
        badge: 'Dia de Jogo • Treino Pendente',
        title: 'Conclua o Treino Semanal para Jogar',
        subtitle: `Rodada ${effectiveMatchDay} de 38`,
        description: 'Você avançou até o Dia de Jogo, mas ainda falta definir o foco semanal de treino no CT antes de entrar em campo.',
        primaryActionLabel: 'Ir para Treino Agora',
        onPrimaryAction: () => {
          setTrainingSubTab('attributes');
          setActiveTab('treino');
        }
      });
      return;
    }

    const updated: PlayerProfile = { ...player, currentWeekDay: 4 };
    setPlayer(updated);

    if (updated.activeInjury && !updated.activeInjury.isPlayingOnSacrifice) {
      setShowMedicalCenterModal(true);
      return;
    }
    if ((updated.suspensionRoundsRemaining || 0) > 0) {
      enqueuePopup({
        id: `popup_ff_susp_${Date.now()}`,
        category: 'suspension',
        badge: 'Suspensão Automática',
        title: 'Você está suspenso nesta rodada',
        description: 'Cumpra a suspensão nas arquibancadas para avançar à próxima rodada.',
        primaryActionLabel: 'Cumprir Suspensão',
        onPrimaryAction: () => handleSimulateInjuryRound()
      });
      return;
    }

    const fixture = getNextMatchFixture(updated);
    setActiveFixture(fixture);
    setActiveOpponent(fixture.opponent);
    setShowMatchModal(true);
  };

  const handleStartMatch = () => {
    if (!player) return;
    if (!player.weeklyTrainingDone) {
      enqueuePopup({
        id: `popup_block_train_${Date.now()}`,
        category: 'training',
        badge: 'Treino Obrigatório',
        title: 'Faça o treino semanal primeiro',
        description: 'Antes de entrar em campo na rodada, defina seu foco de treinamento semanal na aba Treinos.',
        primaryActionLabel: 'Ir para Treinos',
        onPrimaryAction: () => {
          setTrainingSubTab('attributes');
          setActiveTab('treino');
        }
      });
      return;
    }
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
        enqueuePopup({
          id: `popup_endseason_${Date.now()}`,
          category: 'award',
          badge: endAwards.wonBallonDor ? 'Bola de Ouro!' : `Temporada ${postMatchEcon.seasonYear}`,
          title: endAwards.wonBallonDor
            ? `🥇 BOLA DE OURO ${postMatchEcon.seasonYear}!`
            : `🏆 Encerramento da Temporada ${postMatchEcon.seasonYear}`,
          subtitle: wonLeagueTitle ? `Campeão com o ${postMatchEcon.currentClub}!` : 'Premiações & Janela Aberta',
          description: endAwards.awards.length > 0
            ? `Premiações conquistadas: ${endAwards.awards.map(a => a.title).join(' • ')}.\n\nA janela de transferências está aberta para avaliar propostas ou renovar seu contrato!`
            : `Campeão com o ${postMatchEcon.currentClub}! A janela de transferências está aberta.`,
          primaryActionLabel: 'Abrir Mercado da Bola',
          onPrimaryAction: () => {
            setMercadoSubTab('transfer');
            setActiveTab('mercado');
          },
          secondaryActionLabel: 'Ver Resumo'
        });
      } else {
        enqueuePopup({
          id: `popup_window_end_${Date.now()}`,
          category: 'transfer_window',
          badge: `Fim da Temporada ${postMatchEcon.seasonYear}`,
          title: 'Janela de Transferências Aberta!',
          description: `Você encerrou as 38 rodadas pelo ${postMatchEcon.currentClub}. Confira propostas de novos clubes ou renove seu vínculo na aba Mercado.`,
          primaryActionLabel: 'Abrir Mercado',
          onPrimaryAction: () => {
            setMercadoSubTab('transfer');
            setActiveTab('mercado');
          },
          secondaryActionLabel: 'Continuar no Resumo'
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
        currentWeekDay: 1,
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
          enqueuePopup({
            id: `popup_potm_${Date.now()}`,
            category: 'award',
            badge: 'Prêmio Oficial da Liga',
            title: `🏆 JOGADOR DO MÊS DE ${potmResult.monthLabel.toUpperCase()}!`,
            subtitle: `Você foi eleito o melhor atleta do mês!`,
            description: `Sua regularidade em campo rendeu o prêmio oficial de Craque do Mês (${potmResult.award?.ratingAvg.toFixed(1)} nota • ${potmResult.award?.goals}G • ${potmResult.award?.assists}A) e valorizou seu passe em +€0.8M!`,
            primaryActionLabel: 'Celebrar Prêmio!'
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
        currentWeekDay: 1,
        weeklyTrainingDone: false,
        trainingVerdict: undefined
      });
      setActiveTab('resumo');

      if (restedPlayer.activeInjury && restedPlayer.activeInjury.occurredAtRound === completedMatchDay) {
        enqueuePopup({
          id: `popup_new_inj_${Date.now()}`,
          category: 'injury',
          badge: 'Alerta do Departamento Médico',
          title: `Lesão Confirmada: ${restedPlayer.activeInjury.name}`,
          subtitle: restedPlayer.activeInjury.causeTitle,
          description: restedPlayer.activeInjury.doctorReport,
          highlights: [
            { label: 'Tempo Fora', value: `${restedPlayer.activeInjury.roundsRemaining} rodadas`, tone: 'rose' },
            { label: 'Grau', value: `Grau ${restedPlayer.activeInjury.grade}`, tone: 'amber' }
          ],
          primaryActionLabel: 'Abrir Departamento Médico',
          onPrimaryAction: () => setShowMedicalCenterModal(true),
          secondaryActionLabel: 'Ver Depois'
        });
      } else if ((restedPlayer.suspensionRoundsRemaining || 0) > 0) {
        enqueuePopup({
          id: `popup_new_susp_${Date.now()}`,
          category: 'suspension',
          badge: 'Tribunal Disciplinar',
          title: 'Suspensão Automática Aplicada',
          description: `${restedPlayer.suspensionReason || 'Acúmulo de cartões ou expulsão'}. Você cumprirá ${restedPlayer.suspensionRoundsRemaining} jogo(s) de suspensão.`,
          primaryActionLabel: 'Entendido'
        });
      }

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
        currentWeekDay: 1,
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
      setActiveTab('resumo');
      enqueuePopup({
        id: `popup_renew_${Date.now()}`,
        category: 'transfer_window',
        badge: 'Contrato Renovado',
        title: `Você renovou com o ${ensuredPlayer.currentClub}!`,
        description: `Novo vínculo de ${offer.years} ano(s) por ${formatEurCurrency(offer.monthlySalaryEur)}/mês + luvas de ${formatEurCurrency(offer.signingBonusEur)}.`,
        primaryActionLabel: 'Voltar ao Resumo'
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
        currentWeekDay: 1,
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
      setActiveTab('resumo');
      enqueuePopup({
        id: `popup_transfer_${Date.now()}`,
        category: 'transfer_window',
        badge: 'Apresentação Oficial',
        title: `Bem-vindo ao ${newClubName}!`,
        subtitle: targetClubObj.league,
        description: `Contrato assinado por ${offer.years} ano(s), salário de ${formatEurCurrency(offer.monthlySalaryEur)}/mês e luvas de ${formatEurCurrency(offer.signingBonusEur)} creditadas no seu saldo.`,
        primaryActionLabel: 'Iniciar no Novo Clube'
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
        currentWeekDay: 1,
        suspensionRoundsRemaining: remaining,
        suspensionReason: remaining === 0 ? undefined : player.suspensionReason,
        energy: Math.min(100, (player.energy || 75) + 25),
        matchHistory: [...(player.matchHistory || []), skippedEntry],
        newsFeed: [suspArticle, ...(player.newsFeed || [])].slice(0, 25),
        weeklyTrainingDone: false,
        trainingVerdict: undefined
      });
      setActiveTab('resumo');
      enqueuePopup({
        id: `popup_susp_done_${Date.now()}`,
        category: 'suspension',
        badge: 'Rodada Simulada',
        title: remaining === 0 ? 'Suspensão Cumprida!' : '1 Jogo de Suspensão Cumprido',
        description: suspArticle.snippet,
        primaryActionLabel: 'Continuar'
      });
      return;
    }

    if (!player.activeInjury) return;

    const playerClub = findClub(player.currentClub);

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
      currentWeekDay: 1,
      energy: Math.min(100, (updated.energy || 75) + 30), // Descanso total na tribuna recupera energia!
      matchHistory: [...(updated.matchHistory || []), skippedInj],
      newsFeed: [newsArticle, ...(updated.newsFeed || [])].slice(0, 25),
      memories: newMemories,
      weeklyTrainingDone: false,
      trainingVerdict: undefined
    });
    setActiveTab('resumo');
    enqueuePopup({
      id: `popup_dm_done_${Date.now()}`,
      category: healed ? 'welcome' : 'injury',
      badge: healed ? 'Alta Médica Oficial' : 'Boletim do DM',
      title: healed ? '100% Recuperado para Jogar!' : 'Mais 1 Semana de Tratamento Cumprida',
      description: newsArticle.snippet,
      primaryActionLabel: 'Continuar'
    });
  };

  const activePopup = popupQueue.length > 0 && !showMatchModal ? popupQueue[0] : null;

  return (
    <div className="min-h-screen bg-[#0a0d12] text-slate-100 flex flex-col font-sans pb-20 sm:pb-10 selection:bg-emerald-500 selection:text-black">
      {/* Top Header Único */}
      <Header
        player={player}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-start">
        {!player ? (
          <div className="animate-fadeIn my-auto">
            <PlayerIdentitySetup
              onComplete={handleCareerCreated}
              onLoadExistingCareer={(loaded) => {
                setPlayer({ ...loaded, currentWeekDay: loaded.currentWeekDay || 1 });
                setActiveTab('resumo');
              }}
            />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <CareerDashboard
              player={player}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              trainingSubTab={trainingSubTab}
              onChangeTrainingSubTab={setTrainingSubTab}
              mercadoSubTab={mercadoSubTab}
              onChangeMercadoSubTab={setMercadoSubTab}
              perfilSubTab={perfilSubTab}
              onChangePerfilSubTab={setPerfilSubTab}
              onUpdatePlayer={setPlayer}
              onTrainingCompleted={handleTrainingCompleted}
              onAdvanceDay={handleAdvanceDay}
              onAdvanceToMatchDay={handleAdvanceToMatchDay}
              onPlayNextMatch={handleStartMatch}
              onSelectTransferClub={handleSelectTransferClub}
              onOpenMedicalCenter={() => setShowMedicalCenterModal(true)}
              onSimulateInjuryRound={handleSimulateInjuryRound}
              onOpenOpportunity={() => setShowOpportunityModal(true)}
              onOpenNewsPopup={handleOpenNewsPopup}
            />
          </div>
        )}
      </main>

      {/* Modais Obrigatórios de Decisão, Acontecimento e Partida */}
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
          onImportPlayer={(imported) => setPlayer({ ...imported, currentWeekDay: imported.currentWeekDay || 1 })}
          cloudUser={cloudUser}
          lastCloudSyncAt={lastCloudSyncAt}
          onCloudSynced={(ts) => setLastCloudSyncAt(ts)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {activePopup && (
        <EventPopupModal
          event={activePopup}
          onPrimary={() => {
            const cb = activePopup.onPrimaryAction;
            dismissCurrentPopup();
            if (cb) cb();
          }}
          onSecondary={() => {
            const cb = activePopup.onSecondaryAction;
            dismissCurrentPopup();
            if (cb) cb();
          }}
          onDismiss={dismissCurrentPopup}
        />
      )}

      {player && (
        <MobileBottomNav
          player={player}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      )}
    </div>
  );
};

export default App;
