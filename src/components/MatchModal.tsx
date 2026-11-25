import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Club, 
  MatchDecisionMoment, 
  MatchDecisionOption, 
  MatchOutcome, 
  PlayerProfile, 
  MatchFixture, 
  PostMatchInterview,
  MatchLineupPlayer,
  MatchSubstitutionEvent,
  PlayerInjury,
  MatchGoalEvent
} from '../types';
import { 
  generateMatchMoments, 
  resolveDecision, 
  DecisionResolutionResult,
  evaluateOptionSuitability, 
  calculateMatchProbabilities, 
  generateMatchTimeline, 
  generateMatchMomentMinutes, 
  createContextualMoment, 
  DecisionEvaluation, 
  MatchOdds, 
  AmbientMatchEvent,
  generateTeamLineupAndBench,
  tickLineupStamina,
  triggerTacticalSubstitution,
  updateRatingsOnGoal,
  evaluatePreMatchRest
} from '../services/matchSimulator';
import { evaluateInMatchInjuryRisk, createInjuryNewsArticle } from '../services/injuryAndMedicalService';
import { generatePostMatchStory } from '../services/aiStoryEngine';
import { generatePostMatchInterview, generateAIPostMatchInterview } from '../services/postMatchInterviewService';
import { generateAIDecisionMoment } from '../services/dynamicCareerEngine';
import { createMemory } from '../services/careerMemory';
import { recordMatchTeammateChemistry, recordBrawlTeammateDefense } from '../services/teammateAffinityService';
import { generateMatchNewsArticle, getOrInitNewsFeed } from '../services/newsService';
import { getSquadHierarchy } from '../services/squadHierarchyService';
import { simulateMarketWindowForClubs } from '../services/clubTransferAIService';
import { syncActiveLeaguesUpToRound } from '../services/syncLeagueSimulationService';
import { nationalTeamToClub } from '../services/tournamentService';
import { triggerHaptic } from '../services/hapticsService';
import { getNationalTeamForPlayer } from '../data/nationalTeams';
import { CLUBS } from '../data/clubs';
import { ClubBadge } from './ClubBadge';
import { MatchPitchRadar, getCoordinatesForPosition } from './MatchPitchRadar';
import { MatchLineupSidebar } from './MatchLineupSidebar';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Pause, 
  FastForward, 
  X,
  Volume2,
  Zap,
  Eye,
  Shield,
  BarChart3,
  Flame,
  Battery,
  BatteryCharging,
  BatteryWarning,
  Activity,
  ArrowRightLeft,
  Users,
  HeartPulse,
  MessageSquare,
  Clock,
  Radio,
  Square,
  Crown,
  Swords,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface MatchModalProps {
  player: PlayerProfile;
  opponent: Club;
  fixture?: MatchFixture;
  apiKey?: string;
  onMatchComplete: (updatedPlayer: PlayerProfile, outcome: MatchOutcome) => void;
  onClose: () => void;
}

interface MatchCommentaryItem {
  id: string;
  minute: number;
  text: string;
  type: 'info' | 'danger' | 'goal' | 'decision' | 'card' | 'whistle';
}

export const MatchModal: React.FC<MatchModalProps> = ({
  player,
  opponent,
  fixture,
  apiKey,
  onMatchComplete,
  onClose
}) => {
  const userNT = getNationalTeamForPlayer(player.nationality);
  const playerClub = fixture?.isNationalTeamMatch
    ? nationalTeamToClub(userNT)
    : (CLUBS[player.currentClub] || opponent);

  const [stage, setStage] = useState<'intro' | 'simulating' | 'decision_prompt' | 'decision_result' | 'post_match'>('intro');
  const [activeMoment, setActiveMoment] = useState<MatchDecisionMoment | null>(null);
  const [momentMinutes, setMomentMinutes] = useState<number[]>([]);
  const usedScenarioKeys = useRef<Set<string>>(new Set());

  // Relógio Minuto a Minuto (0 a 90)
  const [currentMinute, setCurrentMinute] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 4>(1); // 1 = normal (padrão), 2 = rápido, 4 = turbo

  // Coordenadas da Bola no Campo (Memoizado para evitar recriação contínua e cancelamento do timer)
  const playerBaseCoords = useMemo(() => {
    return getCoordinatesForPosition(player.position, playerClub.formation || '4-3-3');
  }, [player.position, playerClub.formation]);
  const [ballCoords, setBallCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isBallWithPlayer, setIsBallWithPlayer] = useState(false);

  // Feed de Comentários / Lances Minuto a Minuto
  const [commentaryFeed, setCommentaryFeed] = useState<MatchCommentaryItem[]>([]);
  const commentaryScrollRef = useRef<HTMLDivElement>(null);

  // Placar do Jogo & Autores dos Gols
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [matchGoalEvents, setMatchGoalEvents] = useState<MatchGoalEvent[]>([]);

  // Estatísticas do Jogador no Jogo
  const [playerGoals, setPlayerGoals] = useState(0);
  const [playerAssists, setPlayerAssists] = useState(0);
  const [playerRating, setPlayerRating] = useState(6.5);
  const [highlightMoments, setHighlightMoments] = useState<MatchOutcome['highlightMoments']>([]);

  // Feedback da Decisão Atual (Suporte Não-Binário & Trade-offs)
  const [lastDecisionTitle, setLastDecisionTitle] = useState('');
  const [lastDecisionText, setLastDecisionText] = useState('');
  const [lastDecisionSuccess, setLastDecisionSuccess] = useState(false);
  const [lastDecisionEval, setLastDecisionEval] = useState<DecisionEvaluation | null>(null);
  const [lastDecisionResult, setLastDecisionResult] = useState<DecisionResolutionResult | null>(null);

  // Cartões & Disciplina em Campo
  const [playerYellowCards, setPlayerYellowCards] = useState<number>(0);
  const [playerIsSentOff, setPlayerIsSentOff] = useState<boolean>(false);

  // História e Manchete pós-jogo
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [postMatchStory, setPostMatchStory] = useState<any>(null);
  const [matchMotm, setMatchMotm] = useState<MatchOutcome['motm'] | null>(null);

  // Zona Mista & Entrevista Pós-Jogo
  const [interview, setInterview] = useState<PostMatchInterview | null>(null);
  const [chosenInterviewAnswer, setChosenInterviewAnswer] = useState<any | null>(null);
  const [relationshipDeltas, setRelationshipDeltas] = useState({ coach: 0, fans: 0, board: 0 });
  const [chosenMatchDecisions, setChosenMatchDecisions] = useState<Array<{
    minute: number;
    label: string;
    actionType?: string;
    success: boolean;
    impact: string;
  }>>([]);

  // Probabilidades Táticas e Linha do Tempo Ambiental
  const [matchOdds, setMatchOdds] = useState<MatchOdds | null>(null);
  const [ambientEvents, setAmbientEvents] = useState<AmbientMatchEvent[]>([]);

  // Escalações, Banco, Estamina e Substituições
  const [homeLineup, setHomeLineup] = useState<MatchLineupPlayer[]>([]);
  const [homeBench, setHomeBench] = useState<MatchLineupPlayer[]>([]);
  const [awayLineup, setAwayLineup] = useState<MatchLineupPlayer[]>([]);
  const [awayBench, setAwayBench] = useState<MatchLineupPlayer[]>([]);
  const homeLineupRef = useRef<MatchLineupPlayer[]>([]);
  const homeBenchRef = useRef<MatchLineupPlayer[]>([]);
  const awayLineupRef = useRef<MatchLineupPlayer[]>([]);
  const awayBenchRef = useRef<MatchLineupPlayer[]>([]);

  // Refs de estado para garantir que o timer da simulação não seja recriado e cancelado a cada tick
  const playerScoreRef = useRef(0);
  const opponentScoreRef = useRef(0);
  const momentMinutesRef = useRef<number[]>([]);
  const ambientEventsRef = useRef<AmbientMatchEvent[]>([]);
  const initializedMatchRef = useRef<string | null>(null);

  // Chave única e imutável para esta partida específica
  const matchSessionKey = `${player.id}_${player.currentClub}_${opponent.id}_r${fixture?.roundNumber || player.currentMatchDay || 1}_${player.seasonYear || 2026}`;

  // Sincroniza refs com states
  useEffect(() => { playerScoreRef.current = playerScore; }, [playerScore]);
  useEffect(() => { opponentScoreRef.current = opponentScore; }, [opponentScore]);
  useEffect(() => { momentMinutesRef.current = momentMinutes; }, [momentMinutes]);
  useEffect(() => { ambientEventsRef.current = ambientEvents; }, [ambientEvents]);

  // Gestão de Carga / Poupando Atleta & Papel no Jogo
  const hierarchy = getSquadHierarchy(player);
  const initialRole = player.trainingVerdict?.earnedRole || hierarchy.naturalRole || 'sub_60';
  const [userRestMode, setUserRestMode] = useState<'start' | 'sub_60' | 'rest_full'>(initialRole);
  const userRestModeRef = useRef<'start' | 'sub_60' | 'rest_full'>(initialRole);
  const [showSuperSubModal, setShowSuperSubModal] = useState(false);
  const [hasSubbedIn, setHasSubbedIn] = useState(initialRole === 'start');
  const [preMatchAdvice, setPreMatchAdvice] = useState<ReturnType<typeof evaluatePreMatchRest>>({
    shouldOfferRest: false,
    reason: 'tactical',
    title: '',
    message: '',
    coachQuote: '',
    recommendedAction: 'start'
  });

  // Alerta Visual de Substituição
  const [activeSubstitutionAlert, setActiveSubstitutionAlert] = useState<MatchSubstitutionEvent | null>(null);

  // Lesão em Campo durante o jogo
  const [matchInjury, setMatchInjury] = useState<PlayerInjury | null>(null);

  // Aba Mobile (Campo, Mandante, Visitante)
  const [mobileTab, setMobileTab] = useState<'pitch' | 'home' | 'away'>('pitch');

  // Inicializa a partida (SEMPRE 0 X 0 ao iniciar uma nova partida, sem resetar no meio dela)
  useEffect(() => {
    if (initializedMatchRef.current === matchSessionKey) {
      return; // Partida já inicializada. Não reseta os dados nem congela a partida se o componente pai re-renderizar!
    }
    initializedMatchRef.current = matchSessionKey;

    setStage('intro');
    setIsPaused(false);

    const odds = calculateMatchProbabilities(playerClub, opponent, player);
    setMatchOdds(odds);

    const advice = evaluatePreMatchRest(player, fixture);
    setPreMatchAdvice(advice);

    const currentRole = player.trainingVerdict?.earnedRole || hierarchy.naturalRole || 'sub_60';
    setUserRestMode(currentRole);
    userRestModeRef.current = currentRole;
    setHasSubbedIn(currentRole === 'start');

    const mins = generateMatchMomentMinutes(odds, player, fixture, currentRole);
    setMomentMinutes(mins);
    momentMinutesRef.current = mins;
    usedScenarioKeys.current.clear();

    const timeline = generateMatchTimeline(player, playerClub, opponent, [], odds);
    setAmbientEvents(timeline);
    ambientEventsRef.current = timeline;

    const matchDayNum = fixture?.roundNumber || player.currentMatchDay || 1;
    const isDerbyMatch = playerClub.rivalClubs?.some(r => opponent.name.includes(r) || opponent.shortName.includes(r));

    // Simula movimentação de mercado inteligente para reforços dos clubes
    simulateMarketWindowForClubs(matchDayNum, player.currentClub);

    // Gera escalações completas de 11 titulares + reservas com estilos de técnicos e reforços
    const home = generateTeamLineupAndBench(playerClub, player, true, currentRole, {
      matchDay: matchDayNum,
      isDerby: isDerbyMatch,
      opponentName: opponent.name
    });
    const away = generateTeamLineupAndBench(opponent, null, false, undefined, {
      matchDay: matchDayNum,
      isDerby: isDerbyMatch,
      opponentName: playerClub.name
    });
    setHomeLineup(home.starters);
    setHomeBench(home.bench);
    setAwayLineup(away.starters);
    setAwayBench(away.bench);
    homeLineupRef.current = home.starters;
    homeBenchRef.current = home.bench;
    awayLineupRef.current = away.starters;
    awayBenchRef.current = away.bench;

    // O JOGO COMEÇA RIGOROSAMENTE 0 X 0!
    setPlayerScore(0);
    playerScoreRef.current = 0;
    setOpponentScore(0);
    opponentScoreRef.current = 0;
    setMatchGoalEvents([]);
    setCurrentMinute(0);
    setPlayerGoals(0);
    setPlayerAssists(0);
    setPlayerRating(6.5);
    setHighlightMoments([]);
    setActiveMoment(null);
    setChosenMatchDecisions([]);
    setActiveSubstitutionAlert(null);
  }, [matchSessionKey]);

  // Watchdog de Auto-recuperação: se stage for 'decision_prompt' mas activeMoment for null,
  // recria o lance imediatamente ou retoma a simulação para NUNCA travar a tela em preto!
  useEffect(() => {
    if (stage === 'decision_prompt' && !activeMoment) {
      const targetMin = Math.max(1, currentMinute);
      const recoveryMoment = createContextualMoment(
        player,
        opponent,
        targetMin,
        { home: playerScore, away: opponentScore },
        usedScenarioKeys.current
      );
      if (recoveryMoment) {
        setActiveMoment(recoveryMoment);
        setIsBallWithPlayer(true);
        setBallCoords(playerBaseCoords);
      } else {
        setStage('simulating');
      }
    }
  }, [stage, activeMoment, currentMinute, playerScore, opponentScore, player, opponent, playerBaseCoords]);

  const handleSelectRestMode = (mode: 'start' | 'sub_60' | 'rest_full') => {
    setUserRestMode(mode);
    userRestModeRef.current = mode;
    const matchDayNum = fixture?.roundNumber || player.currentMatchDay || 1;
    const isDerbyMatch = playerClub.rivalClubs?.some(r => opponent.name.includes(r) || opponent.shortName.includes(r));
    const home = generateTeamLineupAndBench(playerClub, player, true, mode, {
      matchDay: matchDayNum,
      isDerby: isDerbyMatch,
      opponentName: opponent.name
    });
    setHomeLineup(home.starters);
    setHomeBench(home.bench);
    homeLineupRef.current = home.starters;
    homeBenchRef.current = home.bench;

    if (matchOdds) {
      const newMins = generateMatchMomentMinutes(matchOdds, player, fixture, mode);
      setMomentMinutes(newMins);
    }
  };

  // Pré-carrega em segundo plano o próximo lance decisivo via Gemini (/api/gemini) sem travar o relógio
  const prefetchedAIMomentRef = useRef<{ minute: number; moment: MatchDecisionMoment } | null>(null);
  useEffect(() => {
    if (stage !== 'simulating' || isPaused || momentMinutes.length === 0) return;
    const targetMin = momentMinutes[0];
    if (prefetchedAIMomentRef.current?.minute === targetMin) return;

    let cancelled = false;
    generateAIDecisionMoment(
      player,
      opponent,
      targetMin,
      { home: playerScoreRef.current, away: opponentScoreRef.current },
      usedScenarioKeys.current,
      apiKey
    ).then(aiMoment => {
      if (!cancelled && aiMoment && aiMoment.id.startsWith('ai_moment_')) {
        prefetchedAIMomentRef.current = { minute: targetMin, moment: aiMoment };
      }
    }).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [stage, isPaused, momentMinutes, player, opponent, apiKey]);

  // Auto-scroll nos comentários
  useEffect(() => {
    if (commentaryScrollRef.current) {
      commentaryScrollRef.current.scrollTop = commentaryScrollRef.current.scrollHeight;
    }
  }, [commentaryFeed]);

  // Loop de Simulação Minuto a Minuto com Acontecimentos Dinâmicos Reais
  useEffect(() => {
    if (stage !== 'simulating' || isPaused) return;

    const intervalTime = simSpeed === 4 ? 60 : simSpeed === 2 ? 160 : 350;

    const timer = setInterval(() => {
      setCurrentMinute(prevMin => {
        const nextMin = prevMin + 1;

        // Desgaste de Stamina / Fôlego em tempo real
        if (homeLineupRef.current.length > 0) {
          const updatedHome = tickLineupStamina(homeLineupRef.current, playerClub.playStyle);
          homeLineupRef.current = updatedHome;
          setHomeLineup(updatedHome);
        }
        if (awayLineupRef.current.length > 0) {
          const updatedAway = tickLineupStamina(awayLineupRef.current, opponent.playStyle);
          awayLineupRef.current = updatedAway;
          setAwayLineup(updatedAway);
        }

        // Substituições Táticas / Cansaço Automáticas (58', 63', 68', 74', 78')
        if ([58, 60, 64, 69, 75, 79].includes(nextMin)) {
          // Substituição Mandante
          const hSub = triggerTacticalSubstitution(
            nextMin,
            homeLineupRef.current,
            homeBenchRef.current,
            playerClub.shortName,
            true,
            userRestModeRef.current
          );
          if (hSub.subEvent) {
            homeLineupRef.current = hSub.updatedLineup;
            homeBenchRef.current = hSub.updatedBench;
            setHomeLineup(hSub.updatedLineup);
            setHomeBench(hSub.updatedBench);
            setActiveSubstitutionAlert(hSub.subEvent);
            setTimeout(() => setActiveSubstitutionAlert(null), 4500);

            const isUserIn = hSub.subEvent.playerIn.isUserPlayer;
            if (isUserIn) {
              setHasSubbedIn(true);
              setIsPaused(true);
              setShowSuperSubModal(true);
            }
            setCommentaryFeed(feed => [
              ...feed,
              {
                id: 'sub_h_' + nextMin,
                minute: nextMin,
                text: isUserIn 
                  ? `[SUBSTITUIÇÃO TÁTICA] O PROFESSOR CHAMA! ${player.surname} (#${player.number}) entra no jogo aos ${nextMin}' para mudar o rumo da partida!`
                  : `[SUBSTITUIÇÃO] NO ${playerClub.shortName} (${nextMin}'): Sai ${hSub.subEvent.playerOut.name} (${hSub.subEvent.playerOut.position}), entra ${hSub.subEvent.playerIn.name}. ${hSub.subEvent.reason === 'cansaco' ? 'Atleta exausto em campo.' : 'Ajuste tático.'}`,
                type: isUserIn ? 'decision' : 'whistle'
              }
            ]);
          }

          // Substituição Visitante
          const aSub = triggerTacticalSubstitution(
            nextMin,
            awayLineupRef.current,
            awayBenchRef.current,
            opponent.shortName,
            false
          );
          if (aSub.subEvent) {
            awayLineupRef.current = aSub.updatedLineup;
            awayBenchRef.current = aSub.updatedBench;
            setAwayLineup(aSub.updatedLineup);
            setAwayBench(aSub.updatedBench);
            setCommentaryFeed(feed => [
              ...feed,
              {
                id: 'sub_a_' + nextMin,
                minute: nextMin,
                text: `[SUBSTITUIÇÃO] NO ${opponent.shortName} (${nextMin}'): Sai ${aSub.subEvent.playerOut.name} (${aSub.subEvent.playerOut.position}), entra ${aSub.subEvent.playerIn.name}.`,
                type: 'info'
              }
            ]);
          }
        }

        // 1. Verifica se este minuto é um momento de decisão orgânico do atleta
        const isMoment = momentMinutesRef.current.includes(nextMin);
        if (isMoment) {
          // Remove este minuto para não disparar em duplicidade
          momentMinutesRef.current = momentMinutesRef.current.filter(m => m !== nextMin);
          setMomentMinutes(momentMinutesRef.current);

          // GERA O MOMENTO DINAMICAMENTE COM O PLACAR REAL E EXATO DESTE SEGUNDO (Usa IA pré-carregada se pronta!)
          const prefetched = prefetchedAIMomentRef.current;
          const dynamicMoment = (prefetched && prefetched.minute === nextMin)
            ? { ...prefetched.moment, minute: nextMin, scoreBefore: { home: playerScoreRef.current, away: opponentScoreRef.current } }
            : createContextualMoment(
                player,
                opponent,
                nextMin,
                { home: playerScoreRef.current, away: opponentScoreRef.current },
                usedScenarioKeys.current
              );
          if (prefetched?.minute === nextMin) {
            prefetchedAIMomentRef.current = null;
          }

          setActiveMoment(dynamicMoment);
          setIsBallWithPlayer(true);
          setBallCoords(playerBaseCoords);
          setStage('decision_prompt');
          triggerHaptic('decision_prompt');

          setCommentaryFeed(feed => [
            ...feed,
            {
              id: 'comm_' + nextMin,
              minute: nextMin,
              text: `[LANCE DECISIVO] ${dynamicMoment.contextTitle || `LANCE CAPITAL! A bola chega no domínio de ${player.surname} (#${player.number})!`}`,
              type: 'decision'
            }
          ]);
          return nextMin;
        }

        // 2. Verifica se há um acontecimento tático ambiental (gol ao vivo, bola na trave, defesaça)
        const ambientEvt = ambientEventsRef.current.find(e => e.minute === nextMin);
        if (ambientEvt) {
          if (ambientEvt.type === 'goal') {
            if (ambientEvt.team === 'opponentTeam') {
              opponentScoreRef.current += 1;
              setOpponentScore(opponentScoreRef.current);
              setBallCoords({ x: 10, y: 50 }); // Bola na rede da defesa
              triggerHaptic('goal_conceded');

              const outfieldAway = awayLineupRef.current.filter(p => p.position !== 'GOL');
              const oppScorer = outfieldAway[Math.floor(Math.random() * Math.min(outfieldAway.length, 5))] || outfieldAway[0];
              const remainingAway = outfieldAway.filter(p => p.id !== oppScorer?.id);
              const oppAssist = Math.random() > 0.35 && remainingAway.length > 0 ? remainingAway[Math.floor(Math.random() * remainingAway.length)] : undefined;
              const scorerName = oppScorer?.name || opponent.shortName;
              const assistName = oppAssist?.name;

              setMatchGoalEvents(prev => [
                ...prev,
                {
                  id: `goal_opp_${nextMin}_${Date.now()}`,
                  minute: nextMin,
                  scorerName,
                  assistName,
                  team: 'away',
                  clubId: opponent.id,
                  clubName: opponent.shortName
                }
              ]);

              // Atualiza notas ao vivo da defesa e do adversário
              const updated = updateRatingsOnGoal(awayLineupRef.current, homeLineupRef.current, scorerName, assistName || 'Companheiro');
              awayLineupRef.current = updated.scoring;
              homeLineupRef.current = updated.conceding;
              setAwayLineup(updated.scoring);
              setHomeLineup(updated.conceding);

              setCommentaryFeed(feed => [
                ...feed,
                {
                  id: 'amb_goal_' + nextMin,
                  minute: nextMin,
                  text: `[GOL!] ${scorerName} marca para o ${opponent.shortName}! ${ambientEvt.text}`,
                  type: 'danger'
                }
              ]);
              setHighlightMoments(prev => [
                ...prev,
                { minute: nextMin, text: `${scorerName} marcou para o ${opponent.shortName}.`, type: 'goal' }
              ]);
            } else {
              playerScoreRef.current += 1;
              setPlayerScore(playerScoreRef.current);
              setBallCoords({ x: 90, y: 50 }); // Bola na rede do ataque
              triggerHaptic('goal_team');

              const outfieldHome = homeLineupRef.current.filter(p => !p.isUserPlayer && p.position !== 'GOL');
              const tmScorer = outfieldHome[Math.floor(Math.random() * Math.min(outfieldHome.length, 5))] || outfieldHome[0];
              const remainingHome = outfieldHome.filter(p => p.id !== tmScorer?.id);
              const tmAssist = Math.random() > 0.35 && remainingHome.length > 0 ? remainingHome[Math.floor(Math.random() * remainingHome.length)] : undefined;
              const scorerName = tmScorer?.name || playerClub.shortName;
              const assistName = tmAssist?.name;

              setMatchGoalEvents(prev => [
                ...prev,
                {
                  id: `goal_tm_${nextMin}_${Date.now()}`,
                  minute: nextMin,
                  scorerName,
                  assistName,
                  team: 'home',
                  clubId: playerClub.id,
                  clubName: playerClub.shortName
                }
              ]);

              // Atualiza notas ao vivo do mandante
              const updated = updateRatingsOnGoal(homeLineupRef.current, awayLineupRef.current, scorerName, assistName || 'Companheiro');
              homeLineupRef.current = updated.scoring;
              awayLineupRef.current = updated.conceding;
              setHomeLineup(updated.scoring);
              setAwayLineup(updated.conceding);

              setCommentaryFeed(feed => [
                ...feed,
                {
                  id: 'amb_tm_goal_' + nextMin,
                  minute: nextMin,
                  text: `[GOL!] ${scorerName} estufa as redes para o ${playerClub.shortName}! ${ambientEvt.text}`,
                  type: 'goal'
                }
              ]);
              setHighlightMoments(prev => [
                ...prev,
                { minute: nextMin, text: `${scorerName} marcou para o ${playerClub.shortName}.`, type: 'goal' }
              ]);
            }
          } else {
            // Defesa milagrosa ou bola na trave
            setCommentaryFeed(feed => [
              ...feed,
              {
                id: 'amb_dang_' + nextMin,
                minute: nextMin,
                text: ambientEvt.text,
                type: ambientEvt.team === 'opponentTeam' ? 'danger' : 'info'
              }
            ]);
          }
        } else if (nextMin % 9 === 0 && nextMin < 90) {
          // Lances de ambientação e controle de bola
          const ambientEventsList = [
            `Troca de passes paciente do ${player.currentClub} no meio-campo buscando espaço.`,
            `O ${opponent.shortName} tenta o cruzamento na área, mas a zaga rebate firme de cabeça.`,
            `Disputa acirrada pela posse no círculo central com muita pegada tática.`,
            `A torcida canta alto e empurra o time das arquibancadas!`,
            `Tentativa de inversão de jogo interceptada com categoria.`,
            `O técnico gesticula na beira do gramado cobrando mais compactação.`
          ];
          const text = ambientEventsList[Math.floor(Math.random() * ambientEventsList.length)];
          setCommentaryFeed(feed => [
            ...feed.slice(-8),
            {
              id: 'comm_' + nextMin,
              minute: nextMin,
              text,
              type: 'info'
            }
          ]);
        }

        // Movimentação dinâmica da bola pelo campo durante o minuto
        let newX = Math.floor(Math.random() * 60) + 20;
        let newY = Math.floor(Math.random() * 60) + 20;

        // Intervalo do 1º Tempo (45')
        if (nextMin === 45) {
          setCommentaryFeed(feed => [
            ...feed,
            {
              id: 'comm_ht',
              minute: 45,
              text: `⏱️ Apito do árbitro: Fim do Primeiro Tempo! Instruções táticas no vestiário.`,
              type: 'whistle'
            }
          ]);
        }

        // Apito Final (90')
        if (nextMin >= 90) {
          clearInterval(timer);
          finishMatch();
          return 90;
        }

        setBallCoords({ x: newX, y: newY });
        setIsBallWithPlayer(false);
        return nextMin;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stage, isPaused, simSpeed, player, opponent, playerClub, playerBaseCoords]);

  const handleStartMatch = () => {
    setStage('simulating');
    setCurrentMinute(1);
    setCommentaryFeed([
      {
        id: 'comm_0',
        minute: 0,
        text: `Autoriza o árbitro! Começa o duelo entre ${player.currentClub} e ${opponent.name}!`,
        type: 'whistle'
      }
    ]);
  };

  const handleSkipToNextLance = () => {
    if (momentMinutes.length > 0) {
      const nextTargetMin = momentMinutes[0];
      setMomentMinutes(prev => prev.slice(1));

      // Processa quaisquer acontecimentos da linha do tempo ocorridos até esse minuto
      const missedEvents = ambientEvents.filter(e => e.minute > currentMinute && e.minute <= nextTargetMin);
      let updatedHome = playerScore;
      let updatedAway = opponentScore;
      missedEvents.forEach(evt => {
        if (evt.type === 'goal') {
          if (evt.team === 'opponentTeam') {
            updatedAway += 1;
            const outfieldAway = awayLineupRef.current.filter(p => p.position !== 'GOL');
            const oppScorer = outfieldAway[Math.floor(Math.random() * Math.min(outfieldAway.length, 5))] || outfieldAway[0];
            const remainingAway = outfieldAway.filter(p => p.id !== oppScorer?.id);
            const oppAssist = Math.random() > 0.35 && remainingAway.length > 0 ? remainingAway[Math.floor(Math.random() * remainingAway.length)] : undefined;
            const scorerName = oppScorer?.name || opponent.shortName;
            setMatchGoalEvents(prev => [
              ...prev,
              {
                id: `goal_missed_opp_${evt.minute}_${Date.now()}_${Math.random()}`,
                minute: evt.minute,
                scorerName,
                assistName: oppAssist?.name,
                team: 'away',
                clubId: opponent.id,
                clubName: opponent.shortName
              }
            ]);
          } else {
            updatedHome += 1;
            const outfieldHome = homeLineupRef.current.filter(p => !p.isUserPlayer && p.position !== 'GOL');
            const tmScorer = outfieldHome[Math.floor(Math.random() * Math.min(outfieldHome.length, 5))] || outfieldHome[0];
            const remainingHome = outfieldHome.filter(p => p.id !== tmScorer?.id);
            const tmAssist = Math.random() > 0.35 && remainingHome.length > 0 ? remainingHome[Math.floor(Math.random() * remainingHome.length)] : undefined;
            const scorerName = tmScorer?.name || playerClub.shortName;
            setMatchGoalEvents(prev => [
              ...prev,
              {
                id: `goal_missed_tm_${evt.minute}_${Date.now()}_${Math.random()}`,
                minute: evt.minute,
                scorerName,
                assistName: tmAssist?.name,
                team: 'home',
                clubId: playerClub.id,
                clubName: playerClub.shortName
              }
            ]);
          }
        }
      });
      setPlayerScore(updatedHome);
      setOpponentScore(updatedAway);

      // GERA O MOMENTO COM O PLACAR REAL ATUALIZADO
      const dynamicMoment = createContextualMoment(
        player,
        opponent,
        nextTargetMin,
        { home: updatedHome, away: updatedAway },
        usedScenarioKeys.current
      );

      setCurrentMinute(nextTargetMin);
      setActiveMoment(dynamicMoment);
      setIsBallWithPlayer(true);
      setBallCoords(playerBaseCoords);
      setStage('decision_prompt');
      triggerHaptic('decision_prompt');

      setCommentaryFeed(feed => [
        ...feed,
        ...missedEvents.map(e => ({
          id: 'missed_' + e.minute,
          minute: e.minute,
          text: e.type === 'goal' ? `[GOL!] ${e.text}` : e.text,
          type: (e.type === 'goal' && e.team === 'opponentTeam' ? 'danger' : e.type === 'goal' ? 'goal' : 'info') as any
        })),
        {
          id: 'comm_' + nextTargetMin,
          minute: nextTargetMin,
          text: `[LANCE DECISIVO] ${dynamicMoment.contextTitle || `LANCE CAPITAL! A bola chega no domínio de ${player.surname} (#${player.number})!`}`,
          type: 'decision'
        }
      ]);
    } else {
      // Se não há mais momentos de decisão, avança para o minuto 90 processando os gols restantes
      const remainingEvents = ambientEvents.filter(e => e.minute > currentMinute && e.minute <= 90);
      remainingEvents.forEach(evt => {
        if (evt.type === 'goal') {
          if (evt.team === 'opponentTeam') {
            setOpponentScore(sc => sc + 1);
            const outfieldAway = awayLineupRef.current.filter(p => p.position !== 'GOL');
            const oppScorer = outfieldAway[Math.floor(Math.random() * Math.min(outfieldAway.length, 5))] || outfieldAway[0];
            const remainingAway = outfieldAway.filter(p => p.id !== oppScorer?.id);
            const oppAssist = Math.random() > 0.35 && remainingAway.length > 0 ? remainingAway[Math.floor(Math.random() * remainingAway.length)] : undefined;
            setMatchGoalEvents(prev => [
              ...prev,
              {
                id: `goal_rem_opp_${evt.minute}_${Date.now()}_${Math.random()}`,
                minute: evt.minute,
                scorerName: oppScorer?.name || opponent.shortName,
                assistName: oppAssist?.name,
                team: 'away',
                clubId: opponent.id,
                clubName: opponent.shortName
              }
            ]);
          } else {
            setPlayerScore(sc => sc + 1);
            const outfieldHome = homeLineupRef.current.filter(p => !p.isUserPlayer && p.position !== 'GOL');
            const tmScorer = outfieldHome[Math.floor(Math.random() * Math.min(outfieldHome.length, 5))] || outfieldHome[0];
            const remainingHome = outfieldHome.filter(p => p.id !== tmScorer?.id);
            const tmAssist = Math.random() > 0.35 && remainingHome.length > 0 ? remainingHome[Math.floor(Math.random() * remainingHome.length)] : undefined;
            setMatchGoalEvents(prev => [
              ...prev,
              {
                id: `goal_rem_tm_${evt.minute}_${Date.now()}_${Math.random()}`,
                minute: evt.minute,
                scorerName: tmScorer?.name || playerClub.shortName,
                assistName: tmAssist?.name,
                team: 'home',
                clubId: playerClub.id,
                clubName: playerClub.shortName
              }
            ]);
          }
        }
      });
      setCurrentMinute(90);
      finishMatch();
    }
  };

  const handleChooseOption = (option: MatchDecisionMoment['options'][0]) => {
    if (!activeMoment) return;
    const effectiveMatchPlayer = matchInjury ? { ...player, activeInjury: matchInjury } : player;
    const result = resolveDecision(effectiveMatchPlayer, option, activeMoment, opponent);

    setLastDecisionResult(result);
    setLastDecisionSuccess(result.success);
    setLastDecisionTitle(result.title);
    setLastDecisionText(result.text);
    setLastDecisionEval(result.evaluation);

    // Trata Cartões em Campo (Amarelo, 2º Amarelo -> Vermelho ou Vermelho Direto)
    let currentYellows = playerYellowCards;
    let isNowSentOff = playerIsSentOff;

    if (result.cardType === 'yellow') {
      currentYellows += 1;
      setPlayerYellowCards(currentYellows);
      if (currentYellows >= 2) {
        isNowSentOff = true;
        setPlayerIsSentOff(true);
        result.cardType = 'red';
        result.isSentOff = true;
        result.title = '[EXPULSÃO!] SEGUNDO AMARELO E CARTÃO VERMELHO!';
        result.text = `${result.text} Como você já tinha recebido cartão amarelo anteriormente nesta partida, o árbitro mostrou o segundo amarelo seguido do CARTÃO VERMELHO! Você está expulso da partida!`;
        triggerHaptic('red_card');
      } else {
        triggerHaptic('yellow_card');
      }
      setCommentaryFeed(feed => [
        ...feed,
        {
          id: 'comm_card_' + activeMoment.minute,
          minute: activeMoment.minute,
          text: currentYellows >= 2
            ? `[EXPULSÃO!] Segundo amarelo para ${player.surname}! O árbitro puxa o cartão vermelho e manda o craque para o chuveiro!`
            : `[CARTÃO AMARELO] Cartão amarelo aplicado para ${player.surname}!`,
          type: 'danger'
        }
      ]);
    } else if (result.cardType === 'red') {
      isNowSentOff = true;
      setPlayerIsSentOff(true);
      triggerHaptic('red_card');
      setCommentaryFeed(feed => [
        ...feed,
        {
          id: 'comm_red_' + activeMoment.minute,
          minute: activeMoment.minute,
          text: `[EXPULSÃO DIRETA!] CARTÃO VERMELHO DIRETO para ${player.surname}! Clima quente e expulsão imediata!`,
          type: 'danger'
        }
      ]);
    }

    // Aplica bônus de união e química do vestiário se comprou briga pelo companheiro
    if (result.lockerRoomBonus) {
      const oppDefName = opponent?.squad?.find(p => p.position === 'ZAG' || p.position === 'VOL')?.name || 'marcador rival';
      recordBrawlTeammateDefense(player, oppDefName, result.lockerRoomBonus);
    }

    // Avaliação Biomecânica de Risco de Lesão (fadiga acumulada, dividida dura ou sprint)
    if (!matchInjury) {
      const oppGkObj = opponent?.squad?.find(p => p.position === 'GOL');
      const oppDefObj = opponent?.squad?.find(p => p.position === 'ZAG' || p.position === 'VOL');
      const isGk = activeMoment.situationText.toLowerCase().includes('goleiro') || 
                   result.text.toLowerCase().includes('goleiro') ||
                   (oppGkObj && (activeMoment.situationText.toLowerCase().includes(oppGkObj.name.toLowerCase()) || result.text.toLowerCase().includes(oppGkObj.name.toLowerCase())));

      const inMatchInjury = evaluateInMatchInjuryRisk(
        player,
        activeMoment.minute,
        option.label,
        !result.success || result.impact === 'turnover' || result.impact === 'yellow_card',
        {
          opponentClub: opponent.shortName,
          opponentPlayerName: isGk ? (oppGkObj?.name || 'Goleiro') : (oppDefObj?.name || 'Zagueiro'),
          isGoalkeeperInvolved: !!isGk,
          situationText: activeMoment.situationText,
          decisionTitle: result.title,
          isCleanPlayByOpponent: !result.success || result.impact === 'turnover'
        }
      );
      if (inMatchInjury) {
        setMatchInjury(inMatchInjury);
        triggerHaptic('injury');
        setCommentaryFeed(feed => [
          ...feed,
          {
            id: 'comm_inj_' + activeMoment.minute,
            minute: activeMoment.minute,
            text: `[ATENDIMENTO MÉDICO] Preocupação no gramado! ${player.surname} sentiu a ${inMatchInjury.bodyPart} (${inMatchInjury.name}) e cai no gramado!`,
            type: 'danger'
          }
        ]);
      }
    }

    setChosenMatchDecisions(prev => [
      ...prev,
      {
        minute: activeMoment.minute,
        label: option.label,
        actionType: option.actionType,
        success: result.success,
        impact: result.impact
      }
    ]);

    let newGoals = playerGoals;
    let newAssists = playerAssists;
    let newRating = playerRating;
    let newPlayerScore = playerScore;

    // Aplica o delta de nota específico e calibrado da decisão
    const ratingDelta = result.ratingDelta !== undefined ? result.ratingDelta : (result.success ? 0.4 : -0.3);
    newRating += ratingDelta;

    if (result.impact === 'goal') {
      newGoals += 1;
      newPlayerScore += 1;
      triggerHaptic('goal_user');
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });

      const outfieldHome = homeLineupRef.current.filter(p => !p.isUserPlayer && p.position !== 'GOL');
      const tmAssist = Math.random() > 0.3 && outfieldHome.length > 0
        ? outfieldHome[Math.floor(Math.random() * Math.min(outfieldHome.length, 4))]
        : undefined;

      setMatchGoalEvents(prev => [
        ...prev,
        {
          id: `goal_user_${activeMoment.minute}_${Date.now()}`,
          minute: activeMoment.minute,
          scorerName: `${player.name} ${player.surname}`,
          assistName: tmAssist?.name,
          team: 'home',
          clubId: playerClub.id,
          clubName: playerClub.shortName,
          isUserGoal: true
        }
      ]);

      setHighlightMoments(prev => [
        ...prev,
        { minute: activeMoment.minute, text: `Gol de ${player.surname}! ${result.text}`, type: 'goal' }
      ]);
      setCommentaryFeed(feed => [
        ...feed,
        { id: 'comm_g_' + activeMoment.minute, minute: activeMoment.minute, text: `[GOL!] GOOOOOL DO ${player.currentClub}! ${player.surname} estufa as redes com categoria!`, type: 'goal' }
      ]);

      // Atualiza notas ao vivo na escalação
      const updated = updateRatingsOnGoal(homeLineupRef.current, awayLineupRef.current, player.surname, tmAssist?.name);
      homeLineupRef.current = updated.scoring;
      awayLineupRef.current = updated.conceding;
      setHomeLineup(updated.scoring);
      setAwayLineup(updated.conceding);
    } else if (result.impact === 'assist') {
      newAssists += 1;
      newPlayerScore += 1;
      triggerHaptic('goal_team');
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });

      const outfieldHome = homeLineupRef.current.filter(p => !p.isUserPlayer && p.position !== 'GOL');
      const tmScorer = outfieldHome.find(p => p.position === 'CA' || p.position === 'PD' || p.position === 'PE')
        || outfieldHome[0];
      const tmScorerName = tmScorer?.name || 'Companheiro de Ataque';

      setMatchGoalEvents(prev => [
        ...prev,
        {
          id: `goal_assist_${activeMoment.minute}_${Date.now()}`,
          minute: activeMoment.minute,
          scorerName: tmScorerName,
          assistName: `${player.surname}`,
          team: 'home',
          clubId: playerClub.id,
          clubName: playerClub.shortName,
          isUserAssist: true
        }
      ]);

      setHighlightMoments(prev => [
        ...prev,
        { minute: activeMoment.minute, text: `Assistência de ${player.surname} para o gol de ${tmScorerName}!`, type: 'assist' }
      ]);
      setCommentaryFeed(feed => [
        ...feed,
        { id: 'comm_a_' + activeMoment.minute, minute: activeMoment.minute, text: `[ASSISTÊNCIA] Passe cirúrgico de ${player.surname}! ${tmScorerName} recebe e manda para o fundo das redes!`, type: 'goal' }
      ]);

      // Atualiza notas ao vivo na escalação
      const updated = updateRatingsOnGoal(homeLineupRef.current, awayLineupRef.current, tmScorerName, player.surname);
      homeLineupRef.current = updated.scoring;
      awayLineupRef.current = updated.conceding;
      setHomeLineup(updated.scoring);
      setAwayLineup(updated.conceding);
    } else if (result.impact === 'clima_quente') {
      setCommentaryFeed(feed => [
        ...feed,
        { id: 'comm_cq_' + activeMoment.minute, minute: activeMoment.minute, text: `[CLIMA QUENTE] Confusão em campo! ${player.surname} colocou o peito na frente e honrou o grupo!`, type: 'info' }
      ]);
    } else if (result.impact === 'great_play' || result.impact === 'catimba' || result.impact === 'reclamacao' || result.impact === 'lideranca') {
      setCommentaryFeed(feed => [
        ...feed,
        { id: 'comm_p_' + activeMoment.minute, minute: activeMoment.minute, text: `[LANCE TÁTICO] ${result.title} por ${player.surname}.`, type: 'info' }
      ]);
    } else {
      setCommentaryFeed(feed => [
        ...feed,
        { id: 'comm_f_' + activeMoment.minute, minute: activeMoment.minute, text: `[LANCE PARADO] ${result.title} envolvendo ${player.surname}.`, type: 'info' }
      ]);
    }

    setPlayerGoals(newGoals);
    setPlayerAssists(newAssists);
    setPlayerRating(Math.min(10.0, Math.max(4.0, newRating)));
    setPlayerScore(newPlayerScore);

    // Sincroniza nota do usuário na escalação titular/banco
    homeLineupRef.current = homeLineupRef.current.map(p => 
      p.isUserPlayer ? { ...p, rating: Math.min(10.0, Math.max(4.0, newRating)), goals: newGoals, assists: newAssists } : p
    );
    setHomeLineup(homeLineupRef.current);

    // Impactos na relação com a torcida, técnico e diretoria baseados na decisão
    const coachBonusFinal = result.coachBonus !== undefined ? result.coachBonus : (option.coachBonus || 0);
    const fansBonusFinal = result.fansBonus !== undefined ? result.fansBonus : (option.fansBonus || 0);
    const boardBonusFinal = result.boardBonus !== undefined ? result.boardBonus : (option.boardBonus || 0);

    if (coachBonusFinal || fansBonusFinal || boardBonusFinal) {
      setRelationshipDeltas(prev => ({
        coach: prev.coach + coachBonusFinal,
        fans: prev.fans + fansBonusFinal,
        board: prev.board + boardBonusFinal
      }));
    }

    setStage('decision_result');
  };

  const handleResumeSimulation = () => {
    setActiveMoment(null);
    setIsBallWithPlayer(false);

    if (playerIsSentOff) {
      // O atleta foi expulso: simula o restante da partida com um jogador a menos e finaliza
      setCommentaryFeed(feed => [
        ...feed,
        {
          id: 'comm_sentoff_end',
          minute: currentMinute,
          text: `[APITO FINAL] O time precisou segurar o resultado com 10 jogadores após a expulsão de ${player.surname}!`,
          type: 'danger'
        }
      ]);
      setCurrentMinute(90);
      finishMatch();
      return;
    }

    if (momentMinutes.length === 0 && currentMinute >= 88) {
      finishMatch();
    } else {
      setStage('simulating');
    }
  };

  const handleInjurySubOut = () => {
    setActiveMoment(null);
    setIsBallWithPlayer(false);
    
    // Registra substituição médica imediata
    setCommentaryFeed(feed => [
      ...feed,
      {
        id: 'comm_inj_sub_' + currentMinute,
        minute: currentMinute,
        text: `[SUBSTITUIÇÃO MÉDICA] O camisa #${player.number} (${player.surname}) sentiu o trauma e sai de campo sob aplausos de pé da torcida. O reserva entra aos ${currentMinute}'!`,
        type: 'danger'
      }
    ]);

    // Preserva o físico: se a lesão tiver mais de 1 rodada, reduz 1 rodada por não ter forçado em campo
    if (matchInjury && matchInjury.roundsRemaining > 1) {
      matchInjury.roundsRemaining = Math.max(1, matchInjury.roundsRemaining - 1);
    }

    // Como saiu de campo, limpa os momentos futuros do atleta nesta partida
    setMomentMinutes([]);
    setStage('simulating');
  };

  const handleInjuryPlayOnSacrifice = () => {
    setActiveMoment(null);
    setIsBallWithPlayer(false);
    if (matchInjury) {
      matchInjury.isPlayingOnSacrifice = true;
    }
    // Penalidade no fôlego/físico no restante do jogo, mas ganho de moral com torcida e técnico pela raça
    setPlayerRating(r => Math.max(5.0, Number((r - 0.3).toFixed(1))));
    setRelationshipDeltas(prev => ({
      ...prev,
      fans: prev.fans + 12,
      coach: prev.coach + 6
    }));
    setCommentaryFeed(feed => [
      ...feed,
      {
        id: 'comm_inj_sac_' + currentMinute,
        minute: currentMinute,
        text: `[RAÇA HEROICA] O camisa #${player.number} recebe spray analgésico e volta mancando para o gramado! A torcida ovaciona a entrega do atleta!`,
        type: 'decision'
      }
    ]);
    setStage('simulating');
  };

  const finishMatch = async () => {
    setStage('post_match');
    setIsGeneratingStory(true);

    let finalHomeScore = playerScoreRef.current || playerScore;
    let finalAwayScore = opponentScoreRef.current || opponentScore;
    const extraHighlights = [...highlightMoments];

    // Mata-mata de Copa NÃO pode terminar empatado: decide nos pênaltis caso termine igual!
    if (fixture?.isCupKnockout && finalHomeScore === finalAwayScore) {
      const wonShootout = Math.random() < (playerRating >= 7.0 ? 0.62 : 0.48);
      if (wonShootout) {
        finalHomeScore += 1;
        setPlayerScore(finalHomeScore);
        playerScoreRef.current = finalHomeScore;
        extraHighlights.push({
          minute: 90,
          text: `Vitória emocionante nos pênaltis classificando o ${player.currentClub} no ${fixture.competitionShort}!`,
          type: 'goal'
        });
      } else {
        finalAwayScore += 1;
        setOpponentScore(finalAwayScore);
        opponentScoreRef.current = finalAwayScore;
        extraHighlights.push({
          minute: 90,
          text: `Eliminação dolorosa nos pênaltis diante do ${opponent.shortName} no ${fixture.competitionShort}.`,
          type: 'miss'
        });
      }
      setHighlightMoments(extraHighlights);
    }

    // Garante que a nota e estatísticas do atleta estejam sincronizadas antes de apurar o MOTM
    const syncedHome = homeLineupRef.current.map(p =>
      p.isUserPlayer
        ? { ...p, rating: Number(playerRating.toFixed(1)), goals: playerGoals, assists: playerAssists }
        : p
    );
    homeLineupRef.current = syncedHome;
    setHomeLineup(syncedHome);

    const allLineupCandidates = [
      ...syncedHome.map(p => ({ ...p, clubName: playerClub.shortName })),
      ...awayLineupRef.current.map(p => ({ ...p, clubName: opponent.shortName }))
    ];
    allLineupCandidates.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      const bImpact = (b.goals || 0) * 2 + (b.assists || 0);
      const aImpact = (a.goals || 0) * 2 + (a.assists || 0);
      if (bImpact !== aImpact) return bImpact - aImpact;
      return (b.ovr || 70) - (a.ovr || 70);
    });
    const best = allLineupCandidates[0];
    const computedMotm: MatchOutcome['motm'] = best
      ? {
          playerName: best.isUserPlayer ? `${player.name} "${player.surname}"` : best.name,
          clubName: best.clubName,
          rating: Number(best.rating.toFixed(1)),
          goals: best.goals || 0,
          assists: best.assists || 0,
          isUser: Boolean(best.isUserPlayer)
        }
      : {
          playerName: `${player.name} "${player.surname}"`,
          clubName: playerClub.shortName,
          rating: Number(playerRating.toFixed(1)),
          goals: playerGoals,
          assists: playerAssists,
          isUser: true
        };
    setMatchMotm(computedMotm);
    triggerHaptic(computedMotm.isUser ? 'trophy_award' : 'whistle_end');
    if (computedMotm.isUser) {
      confetti({ particleCount: 95, spread: 80, origin: { y: 0.65 } });
    }

    const outcome: MatchOutcome = {
      opponent,
      isHome: true,
      score: { playerTeam: finalHomeScore, opponentTeam: finalAwayScore },
      goalEvents: matchGoalEvents,
      playerStats: {
        goals: playerGoals,
        assists: playerAssists,
        rating: playerRating,
        energyUsed: 15,
        yellowCard: playerYellowCards > 0,
        redCard: playerIsSentOff
      },
      highlightMoments: extraHighlights,
      motm: computedMotm
    };

    // Define entrevista contextual imediata e em paralelo consulta o Gemini (/api/gemini) para Zona Mista + Imprensa
    setInterview(generatePostMatchInterview(player, outcome, fixture, matchInjury));

    const [aiInterview, story] = await Promise.all([
      generateAIPostMatchInterview(player, outcome, fixture, apiKey, matchInjury),
      generatePostMatchStory(player, outcome, apiKey)
    ]);

    setInterview(aiInterview);
    setPostMatchStory(story);
    setIsGeneratingStory(false);
  };

  const handleFinalizeAndSave = () => {
    const isWin = playerScore > opponentScore;
    const isRival = opponent.rivalClubs.includes(player.currentClub);

    let newOvr = player.ovr;
    let newMarketValue = player.marketValueEur;

    if (playerRating >= 8.0) {
      newMarketValue += 0.3;
      if (player.currentSeasonStats.games % 5 === 0) newOvr += 1;
    } else if (playerRating < 5.5) {
      newMarketValue = Math.max(0.5, newMarketValue - 0.1);
    }

    const newMemories = [...player.memories];
    if (playerGoals >= 2 || (isRival && playerGoals >= 1) || playerRating >= 8.5) {
      const memTitle = playerGoals >= 2
        ? `Doblete decisivo contra o ${opponent.shortName}`
        : `Atuação heroica de gala no clássico`;

      const mem = createMemory(player, {
        title: memTitle,
        description: `Na rodada ${player.currentMatchDay}, marcou ${playerGoals} gol(s) e teve nota ${playerRating.toFixed(1)} contra o ${opponent.name}.`,
        category: 'match',
        impactSummary: `Ganhou moral gigantesco e idolatria com a torcida do ${player.currentClub}`,
        tags: [opponent.shortName.toLowerCase(), 'gols', 'classico'],
        importance: isRival ? 'alta' : 'media'
      });
      newMemories.unshift(mem);
    }

    const newSeasonStats = {
      ...player.currentSeasonStats,
      games: player.currentSeasonStats.games + 1,
      goals: player.currentSeasonStats.goals + playerGoals,
      assists: player.currentSeasonStats.assists + playerAssists,
      yellowCards: (player.currentSeasonStats.yellowCards || 0) + playerYellowCards,
      redCards: (player.currentSeasonStats.redCards || 0) + (playerIsSentOff ? 1 : 0),
      ratingSum: player.currentSeasonStats.ratingSum + playerRating
    };

    const pastGames = player.history.reduce((acc, h) => acc + (h.games || 0), 0);
    const pastGoals = player.history.reduce((acc, h) => acc + (h.goals || 0), 0);
    const pastAssists = player.history.reduce((acc, h) => acc + (h.assists || 0), 0);

    let trophiesCount = player.careerTotals.trophies || 0;
    if (fixture?.trophyName && isWin) {
      trophiesCount += 1;
      const trophyMem = createMemory(player, {
        title: `${fixture.trophyName}`,
        description: `Conquistou a taça histórica da ${fixture.competitionName} após vencer o ${opponent.name} por ${playerScore}x${opponentScore}!`,
        category: 'milestone',
        impactSummary: `Campeão eternizado na história do ${player.currentClub}!`,
        tags: ['campeao', 'titulo', fixture.competitionShort.toLowerCase()],
        importance: 'lendaria'
      });
      newMemories.unshift(trophyMem);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }

    let coachChange = (isWin ? 3 : -2) + relationshipDeltas.coach;
    let fansChange = (playerGoals > 0 ? 5 : isWin ? 2 : -3) + relationshipDeltas.fans;
    let boardChange = relationshipDeltas.board;

    if (chosenInterviewAnswer) {
      coachChange += (chosenInterviewAnswer.coachDelta || 0);
      fansChange += (chosenInterviewAnswer.fansDelta || 0);
      boardChange += (chosenInterviewAnswer.boardDelta || 0);
      if (chosenInterviewAnswer.marketValueDelta) {
        newMarketValue += chosenInterviewAnswer.marketValueDelta;
      }

      newMemories.unshift(createMemory(player, {
        title: `Zona Mista: ${chosenInterviewAnswer.stanceLabel}`,
        description: `${chosenInterviewAnswer.text} Repercussão na imprensa: "${chosenInterviewAnswer.headline}".`,
        category: 'milestone',
        impactSummary: chosenInterviewAnswer.impactSummary,
        tags: ['entrevista', 'zonamista', 'imprensa', `postura_${chosenInterviewAnswer.stance}`],
        importance: 'media'
      }));
    }

    // Registra no Dossiê o perfil das decisões tomadas pelo atleta nesta partida
    if (chosenMatchDecisions.length > 0) {
      const boldCount = chosenMatchDecisions.filter(d => 
        d.actionType === 'finalizacao' || d.actionType === 'drible' || 
        d.label.toLowerCase().includes('chute') || d.label.toLowerCase().includes('drible') || d.label.toLowerCase().includes('bomba')
      ).length;
      const teamCount = chosenMatchDecisions.filter(d => 
        d.actionType === 'passe' || d.actionType === 'cruzamento' || 
        d.label.toLowerCase().includes('passe') || d.label.toLowerCase().includes('enfiada') || d.label.toLowerCase().includes('toca')
      ).length;
      const tacticalCount = chosenMatchDecisions.filter(d => 
        d.actionType === 'tatica' || d.actionType === 'retencao' || 
        d.label.toLowerCase().includes('posse') || d.label.toLowerCase().includes('falta') || d.label.toLowerCase().includes('cadencia')
      ).length;

      let styleTag = 'escolha_equilibrada';
      let title = `Decisões em Campo: Equilíbrio Tático vs ${opponent.shortName}`;
      let desc = `Na rodada ${player.currentMatchDay}, alternou momentos de circulação de bola e agressividade ofensiva. Tomou ${chosenMatchDecisions.length} decisões marcantes sob pressão.`;

      if (boldCount > teamCount && boldCount >= tacticalCount) {
        styleTag = 'escolha_ousadia';
        title = `Decisões em Campo: Ousadia & Protagonismo vs ${opponent.shortName}`;
        desc = `Na rodada ${player.currentMatchDay}, assumiu a responsabilidade direta: arriscou dribles desconcertantes e arremates agudos contra a meta adversária.`;
      } else if (teamCount > boldCount && teamCount >= tacticalCount) {
        styleTag = 'escolha_coletiva';
        title = `Decisões em Campo: Visão Coletiva & Garçom vs ${opponent.shortName}`;
        desc = `Na rodada ${player.currentMatchDay}, priorizou a jogada associativa: colocou companheiros na cara do gol com passes e enfiadas precisas.`;
      } else if (tacticalCount > 0) {
        styleTag = 'escolha_tatica';
        title = `Decisões em Campo: Frieza Tática & Controle vs ${opponent.shortName}`;
        desc = `Na rodada ${player.currentMatchDay}, esbanjou maturidade: protegeu a bola com o corpo, cavou faltas e garantiu a posse para o time.`;
      }

      newMemories.unshift(createMemory(player, {
        title,
        description: desc,
        category: 'match',
        impactSummary: `Estilo decisório registrado no Dossiê: ${styleTag.replace('escolha_', '')}`,
        tags: [styleTag, 'estilo_decisao', opponent.shortName.toLowerCase(), 'partida'],
        importance: 'baixa'
      }));
    }

    // Extrai companheiros REAIS do clube atual que participaram de gols/assistências na partida
    const realAssister = matchGoalEvents.find(g => g.isUserGoal && g.assistName)?.assistName
      || homeLineupRef.current.find(p => !p.isUserPlayer && (p.position === 'MEI' || p.position === 'MC' || p.position === 'VOL'))?.name;
    const realScorerFromAssist = matchGoalEvents.find(g => g.isUserAssist)?.scorerName
      || homeLineupRef.current.find(p => !p.isUserPlayer && (p.position === 'CA' || p.position === 'PE' || p.position === 'PD'))?.name;

    const playerWithTeammates = recordMatchTeammateChemistry(
      player,
      playerGoals > 0 ? realAssister : undefined,
      playerAssists > 0 ? realScorerFromAssist : undefined
    );

    const finalOutcome: MatchOutcome = {
      opponent,
      isHome: true,
      score: { playerTeam: playerScore, opponentTeam: opponentScore },
      goalEvents: matchGoalEvents,
      playerStats: {
        goals: playerGoals,
        assists: playerAssists,
        rating: playerRating,
        energyUsed: 15,
        yellowCard: playerYellowCards > 0,
        redCard: playerIsSentOff
      },
      highlightMoments,
      generatedNews: postMatchStory,
      motm: matchMotm || undefined
    };

    const newMatchArticle = generateMatchNewsArticle(
      player,
      opponent,
      finalOutcome,
      chosenInterviewAnswer
    );
    const existingFeed = player.newsFeed || getOrInitNewsFeed(player);
    const updatedNewsFeed = [newMatchArticle, ...existingFeed].slice(0, 25);

    // Se houve lesão confirmada em campo, publica o Boletim Médico na imprensa e registra no Dossiê
    if (matchInjury) {
      const injuryArticle = createInjuryNewsArticle(player, matchInjury);
      updatedNewsFeed.unshift(injuryArticle);

      const injMem = createMemory(player, {
        title: `Boletim Médico: ${matchInjury.name}`,
        description: `Sofreu ${matchInjury.name.toLowerCase()} no jogo contra o ${opponent.name}. Causa: ${matchInjury.causeTitle}. Laudo do DM: "${matchInjury.doctorReport}"`,
        category: 'milestone',
        impactSummary: `Afastado por ${matchInjury.initialRounds} rodada(s) para tratamento no Departamento Médico.`,
        tags: ['lesao', 'dm', matchInjury.bodyPart, matchInjury.level],
        importance: matchInjury.level === 'grave' ? 'alta' : 'media'
      });
      newMemories.unshift(injMem);
    }

    let energyDelta = -15;
    if (userRestMode === 'rest_full') {
      energyDelta = 35; // Poupar recupera +35% de energia!
    } else if (userRestMode === 'sub_60') {
      energyDelta = -7; // Apenas 30 minutos em campo
    }
    const finalEnergy = Math.min(100, Math.max(25, player.energy + energyDelta));

    // Registra eliminação real em copas de mata-mata ou títulos conquistados na temporada
    const updatedSeasonTitles = [...(player.seasonTitlesWon || [])];
    if (fixture?.trophyName && isWin && !updatedSeasonTitles.includes(fixture.trophyName)) {
      updatedSeasonTitles.push(fixture.trophyName);
    }

    const updatedEliminated = [...(player.eliminatedCompetitions || [])];
    if (fixture?.isCupKnockout && !fixture.isNationalTeamMatch && !isWin) {
      if (!updatedEliminated.includes(fixture.competitionType)) {
        updatedEliminated.push(fixture.competitionType);
      }
      newMemories.unshift(createMemory(player, {
        title: `Eliminação no ${fixture.competitionName}`,
        description: `O ${player.currentClub} caiu em ${fixture.stageName} diante do ${opponent.name} (${playerScore}x${opponentScore}) e deu adeus à disputa da taça nesta temporada.`,
        category: 'match',
        impactSummary: `Fora da disputa do ${fixture.competitionShort} em ${player.seasonYear}`,
        tags: ['eliminacao', fixture.competitionShort.toLowerCase()],
        importance: 'media'
      }));
    }

    // Suspensão automática por Cartão Vermelho ou 3º Cartão Amarelo acumulado
    let suspensionRoundsRemaining = 0;
    let suspensionReason: string | undefined = undefined;
    if (playerIsSentOff) {
      suspensionRoundsRemaining = 1;
      suspensionReason = `Suspensão Automática por Cartão Vermelho contra o ${opponent.shortName}`;
    } else if (playerYellowCards > 0 && newSeasonStats.yellowCards > 0 && newSeasonStats.yellowCards % 3 === 0) {
      suspensionRoundsRemaining = 1;
      suspensionReason = `Suspensão Automática pelo ${newSeasonStats.yellowCards}º Cartão Amarelo Acumulado`;
    }

    // Reseta isPlayingOnSacrifice para que o Departamento Médico avalie/vete na semana seguinte!
    const rawInjury = matchInjury || player.activeInjury || null;
    const savedActiveInjury: PlayerInjury | null = rawInjury
      ? { ...rawInjury, isPlayingOnSacrifice: false }
      : null;

    const wonMotm = Boolean(matchMotm?.isUser);
    const prevAwards = player.awards || {
      motmCount: 0,
      seasonMotmCount: 0,
      potmHistory: [],
      seasonAwards: [],
      ballonDorCount: 0
    };
    const nextMotmCount = prevAwards.motmCount + (wonMotm ? 1 : 0);
    const nextSeasonMotmCount = prevAwards.seasonMotmCount + (wonMotm ? 1 : 0);

    if (wonMotm) {
      newMarketValue = Number((newMarketValue + 0.2).toFixed(1));
      fansChange += 3;
      coachChange += 3;
      if (nextMotmCount === 1 || nextMotmCount % 5 === 0) {
        newMemories.unshift(createMemory(player, {
          title: `⭐ Craque do Jogo #${nextMotmCount} vs ${opponent.shortName}`,
          description: `Recebeu o troféu oficial de Jogador da Partida (MOTM) com nota ${playerRating.toFixed(1)}, ${playerGoals} gol(s) e ${playerAssists} assistência(s).`,
          category: 'milestone',
          impactSummary: 'Destaque absoluto e valorização no mercado (+€0.2M)',
          tags: ['motm', 'craque_do_jogo', opponent.shortName.toLowerCase()],
          importance: 'alta'
        }));
      }
    }

    const playedRoundNum = fixture?.roundNumber || player.currentMatchDay || 1;
    const historyEntry = {
      round: playedRoundNum,
      seasonYear: player.seasonYear,
      competitionName: fixture?.competitionName || opponent.league,
      competitionShort: fixture?.competitionShort || opponent.league.split(' ')[0],
      competitionType: fixture?.competitionType || ('league' as const),
      stageName: fixture?.stageName || `Rodada ${playedRoundNum}`,
      opponentName: opponent.name,
      opponentShortName: opponent.shortName,
      playerTeamScore: playerScore,
      opponentTeamScore: opponentScore,
      goals: playerGoals,
      assists: playerAssists,
      rating: Number(playerRating.toFixed(1)),
      isMotm: wonMotm,
      motmName: matchMotm?.playerName || `${player.name} ${player.surname}`,
      yellowCard: playerYellowCards > 0,
      redCard: playerIsSentOff
    };
    const updatedMatchHistory = [
      ...(player.matchHistory || []).filter(m => !(m.seasonYear === player.seasonYear && m.round === playedRoundNum)),
      historyEntry
    ];

    const updatedPlayer: PlayerProfile = {
      ...player,
      ovr: newOvr,
      marketValueEur: Number(newMarketValue.toFixed(1)),
      energy: finalEnergy,
      currentMatchDay: Math.max(player.currentMatchDay + 1, newSeasonStats.games + 1),
      relationships: {
        ...player.relationships,
        coach: Math.min(100, Math.max(10, player.relationships.coach + coachChange)),
        fans: Math.min(100, Math.max(10, player.relationships.fans + fansChange)),
        board: Math.min(100, Math.max(10, player.relationships.board + boardChange))
      },
      currentSeasonStats: newSeasonStats,
      careerTotals: {
        games: pastGames + newSeasonStats.games,
        goals: pastGoals + newSeasonStats.goals,
        assists: pastAssists + newSeasonStats.assists,
        trophies: trophiesCount
      },
      teammateAffinities: playerWithTeammates.teammateAffinities,
      newsFeed: updatedNewsFeed,
      memories: newMemories,
      activeInjury: savedActiveInjury,
      suspensionRoundsRemaining,
      suspensionReason,
      eliminatedCompetitions: updatedEliminated,
      seasonTitlesWon: updatedSeasonTitles,
      matchHistory: updatedMatchHistory,
      awards: {
        ...prevAwards,
        motmCount: nextMotmCount,
        seasonMotmCount: nextSeasonMotmCount
      }
    };

    onMatchComplete(updatedPlayer, finalOutcome);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-6xl xl:max-w-7xl bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96dvh]">
        
        {/* Header do Placar e Relógio */}
        <div className="bg-[#181d28] border-b border-slate-800 p-2.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{currentMinute}'</span>
            </span>
            <div className="text-[11px] text-slate-300 font-semibold hidden sm:flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{fixture?.competitionName || opponent.league}</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-bold">{fixture?.stageName || `Rodada ${player.currentMatchDay}`}</span>
              {fixture?.isCupKnockout && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-600/50">
                  MATA-MATA
                </span>
              )}
            </div>
          </div>

          {/* Placar Oficial com Escudos Reais */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white block truncate max-w-[85px] sm:max-w-none">{playerClub.shortName}</span>
              <ClubBadge club={playerClub} size="xs" />
            </div>
            <div className="bg-[#0b0e14] px-2.5 py-0.5 rounded-xl border border-slate-700 text-lg font-black text-white font-['Teko'] tracking-wider">
              {playerScore} - {opponentScore}
            </div>
            <div className="flex items-center space-x-2">
              <ClubBadge club={opponent} size="xs" />
              <span className="text-xs font-bold text-slate-300 block truncate max-w-[85px] sm:max-w-none">{opponent.shortName}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa de Competição Mobile (Visível em telas pequenas) */}
        <div className="sm:hidden bg-[#121620] border-b border-slate-800/90 px-3 py-1.5 flex items-center justify-between text-[10px] shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Shield className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="font-bold text-slate-200 truncate">{fixture?.competitionShort || opponent.league}</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300 font-semibold truncate">{fixture?.stageName || `Rodada ${player.currentMatchDay}`}</span>
          </div>
          {fixture?.isCupKnockout && (
            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black border border-amber-600/50 shrink-0 ml-2">
              MATA-MATA
            </span>
          )}
        </div>

        {/* Faixa Oficial de Autores dos Gols e Assistências (Estilo Sofascore) */}
        {matchGoalEvents.length > 0 && (
          <div className="bg-[#0b0e14]/95 border-b border-slate-800/90 px-3 sm:px-6 py-2 flex items-start justify-between text-xs font-mono shrink-0 shadow-inner">
            {/* Gols do Mandante */}
            <div className="flex-1 text-left space-y-1">
              {matchGoalEvents.filter(g => g.team === 'home').length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">Sem gols</span>
              ) : (
                matchGoalEvents.filter(g => g.team === 'home').map(g => (
                  <div key={g.id} className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                    <span className={`font-bold ${g.isUserGoal ? 'text-emerald-400 font-black' : 'text-slate-200'}`}>
                      {g.scorerName} <span className="text-emerald-400 font-mono">{g.minute}'</span>
                    </span>
                    {g.assistName && (
                      <span className="text-slate-400 text-[10px] font-sans">
                        (ast: {g.assistName})
                      </span>
                    )}
                    {g.isUserGoal && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1 py-0.5 rounded font-black font-sans">
                        VOCÊ
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Divisor Central */}
            <div className="px-3 shrink-0 flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                GOLS
              </span>
            </div>

            {/* Gols do Visitante */}
            <div className="flex-1 text-right space-y-1">
              {matchGoalEvents.filter(g => g.team === 'away').length === 0 ? (
                <span className="text-[10px] text-slate-600 italic">Sem gols</span>
              ) : (
                matchGoalEvents.filter(g => g.team === 'away').map(g => (
                  <div key={g.id} className="flex items-center justify-end gap-1.5 flex-wrap">
                    {g.assistName && (
                      <span className="text-slate-400 text-[10px] font-sans">
                        (ast: {g.assistName})
                      </span>
                    )}
                    <span className="font-bold text-slate-200">
                      {g.scorerName} <span className="text-rose-400 font-mono">{g.minute}'</span>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Barra de Abas Mobile (Apenas em telas menores que lg) */}
        <div className="lg:hidden bg-[#0e1219] border-b border-slate-800 px-3 py-1.5 flex items-center justify-around text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setMobileTab('pitch')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
              mobileTab === 'pitch' 
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Campo & Lances</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('home')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
              mobileTab === 'home' 
                ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClubBadge club={playerClub} size="xs" />
            <span className="truncate max-w-[70px]">{playerClub.shortName} (11)</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('away')}
            className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 ${
              mobileTab === 'away' 
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClubBadge club={opponent} size="xs" />
            <span className="truncate max-w-[70px]">{opponent.shortName} (11)</span>
          </button>
        </div>

        {/* Banner de Alerta de Substituição Ativa */}
        {activeSubstitutionAlert && (
          <div className="bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-amber-950/90 border-b border-amber-500/50 px-4 py-2 flex items-center justify-center space-x-3 text-xs animate-in slide-in-from-top duration-300 shrink-0">
            <ArrowRightLeft className="w-4 h-4 text-amber-400 animate-pulse" />
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="font-mono font-bold text-amber-400">{activeSubstitutionAlert.minute}'</span>
              <span className="text-white font-extrabold uppercase">Substituição ({activeSubstitutionAlert.teamName}):</span>
              <span className="text-rose-400 line-through font-medium">Sai {activeSubstitutionAlert.playerOut.name} ({activeSubstitutionAlert.playerOut.position})</span>
              <span className="text-slate-400 font-bold">→</span>
              <span className="text-emerald-400 font-black">Entra {activeSubstitutionAlert.playerIn.name}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-600/40">
                {activeSubstitutionAlert.reason === 'cansaco' ? 'Fadiga' : 'Tática'}
              </span>
            </div>
          </div>
        )}

        {/* Grid de 3 Colunas: Mandante (Esquerda) | Campo & Jogo (Centro) | Visitante (Direita) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
          
          {/* COLUNA ESQUERDA (Desktop): ESCALAÇÃO MANDANTE / SEU CLUBE */}
          <div className={`lg:col-span-3 p-2.5 overflow-y-auto custom-scrollbar ${
            mobileTab === 'home' ? 'block' : 'hidden lg:block'
          }`}>
            <MatchLineupSidebar 
              club={playerClub} 
              lineup={homeLineup} 
              bench={homeBench} 
              isHome={true} 
              isUserTeam={true} 
            />
          </div>

          {/* COLUNA CENTRAL: CAMPO, CONTROLES E DINÂMICA DE LANCES */}
          <div className={`lg:col-span-6 flex flex-col p-3 sm:p-4 overflow-y-auto space-y-4 custom-scrollbar ${
            mobileTab === 'pitch' ? 'flex' : 'hidden lg:flex'
          }`}>

            {/* MAPA 2D DO CAMPO (RADAR COM FORMAÇÕES TÁTICAS REAIS) */}
            {stage !== 'intro' && stage !== 'post_match' && (
              <div className="p-3 bg-[#0a120c] border border-slate-800 rounded-2xl">
                <MatchPitchRadar
                  playerPosition={player.position}
                  playerNumber={player.number}
                  playerSurname={player.surname}
                  ballCoords={ballCoords}
                  isBallWithPlayer={isBallWithPlayer}
                  homeTeamColor={playerClub.colors.primary}
                  awayTeamColor={opponent.colors.primary}
                  homeFormation={playerClub.formation || '4-3-3'}
                  awayFormation={opponent.formation || '4-3-3'}
                  homeTeamName={player.currentClub}
                  awayTeamName={opponent.shortName}
                  isUserOnBench={userRestMode === 'sub_60' && !hasSubbedIn}
                  starterNameInPosition={hierarchy.topCompetitor?.name}
                />

                {/* Controles de Simulação (Velocidade e Pular Lance) */}
                <div className="flex items-center justify-between pt-2.5 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Velocidade:</span>
                    <button
                      type="button"
                      onClick={() => setSimSpeed(1)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${simSpeed === 1 ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      1x
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimSpeed(2)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${simSpeed === 2 ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      2x
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimSpeed(4)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${simSpeed === 4 ? 'bg-amber-400 text-black shadow-sm shadow-amber-400/20' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}
                    >
                      Turbo
                    </button>
                  </div>

                  {stage === 'simulating' && (
                    <button
                      type="button"
                      onClick={handleSkipToNextLance}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                    >
                      <FastForward className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Avançar para meu lance</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Conteúdo Conforme o Estágio */}
            <div className="space-y-4">

          {/* ESTÁGIO 1: INTRO DA PARTIDA */}
          {stage === 'intro' && (
            <div className="space-y-5 text-center py-2 max-w-xl mx-auto">
              {/* Duelo de Escudos Oficiais */}
              <div className="flex items-center justify-center space-x-6 sm:space-x-10">
                <div className="flex flex-col items-center space-y-2">
                  <ClubBadge club={playerClub} size="xl" className="transform hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white max-w-[110px] truncate">{player.currentClub}</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center font-['Teko'] text-lg font-black text-amber-400 shadow-lg">
                    VS
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">RODADA {player.currentMatchDay}</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <ClubBadge club={opponent} size="xl" className="transform hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white max-w-[110px] truncate">{opponent.shortName}</span>
                </div>
              </div>

              <div className="space-y-1 bg-[#181d28]/70 border border-slate-800 rounded-2xl p-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white">{playerClub.name} vs {opponent.name}</h2>
                  {fixture && (
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>{fixture.competitionName} • {fixture.stageName}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Estádio: <strong className="text-white">{playerClub.stadium}</strong> • {fixture?.competitionName || opponent.league}
                </p>
                {fixture?.trophyName && (
                  <div className="bg-amber-950/40 border border-amber-600/50 rounded-xl p-2 text-center text-xs font-extrabold text-amber-300 animate-pulse mt-1 flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>VALENDO A TAÇA: {fixture.trophyName}!</span>
                  </div>
                )}
              </div>

              {/* CARD DE PROBABILIDADES, NÍVEL DOS TIMES E FATOR DE IMPREVISIBILIDADE */}
              {matchOdds && (
                <div className="bg-[#121620] border border-slate-800 rounded-2xl p-4 space-y-3 text-left shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Probabilidades Pré-Jogo & Nível dos Clubes</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Favorito: <strong className="text-white">{matchOdds.favoriteName}</strong>
                    </span>
                  </div>

                  {/* Barra Visual de Probabilidades */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-800">
                      <div 
                        style={{ width: `${matchOdds.homeWinProb}%` }} 
                        className="bg-emerald-500 hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-black text-black"
                      >
                        {matchOdds.homeWinProb}%
                      </div>
                      <div 
                        style={{ width: `${matchOdds.drawProb}%` }} 
                        className="bg-slate-600 hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-black text-white"
                      >
                        {matchOdds.drawProb}%
                      </div>
                      <div 
                        style={{ width: `${matchOdds.awayWinProb}%` }} 
                        className="bg-rose-500 hover:opacity-90 transition-all flex items-center justify-center text-[9px] font-black text-white"
                      >
                        {matchOdds.awayWinProb}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold pt-0.5">
                      <span className="text-emerald-400">{playerClub.shortName} ({matchOdds.homeWinProb}%)</span>
                      <span className="text-slate-400">Empate ({matchOdds.drawProb}%)</span>
                      <span className="text-rose-400">{opponent.shortName} ({matchOdds.awayWinProb}%)</span>
                    </div>
                  </div>

                  {/* Fator de Imprevisibilidade & Estilos Táticos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="bg-[#0b0f17] p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Fator de Imprevisibilidade:</span>
                      <span className="text-amber-300 font-extrabold flex items-center gap-1 mt-0.5">
                        <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{matchOdds.unpredictabilityRate}% • {matchOdds.chaosDescription}</span>
                      </span>
                    </div>

                    <div className="bg-[#0b0f17] p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Expectativa de Gols (xG):</span>
                      <span className="text-slate-300 font-bold block mt-0.5">
                        {playerClub.shortName} ({matchOdds.expectedGoalsHome}) x ({matchOdds.expectedGoalsAway}) {opponent.shortName}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <p className="text-slate-400">
                      Tática Adversária: <em className="text-rose-300">"{opponent.playStyle}"</em>
                    </p>
                    <p className="text-slate-400">
                      Tática do Seu Clube: <em className="text-emerald-300">"{playerClub.playStyle}"</em>
                    </p>
                    <p className="text-slate-300 italic pt-1 border-t border-slate-800/50">
                      <span className="text-amber-400 font-bold uppercase text-[9px] mr-1.5 not-italic">[ANÁLISE TÁTICA]</span>
                      {matchOdds.tacticalAnalysis}
                    </p>
                  </div>
                </div>
              )}

              {/* CARD DE DECISÃO SOBERANA DO TÉCNICO & ESCALAÇÃO OFICIAL */}
              <div className="bg-[#121622] border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 text-left shadow-xl">
                
                {/* Header: Treinador & Estilo de Personalidade */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-white">
                          Téc. {hierarchy.coachName}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold border border-slate-700">
                          {hierarchy.coachPersonality?.shortTag || 'Estrategista'}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-semibold block">
                        {hierarchy.coachPersonality?.title || 'Comissão Técnica Oficial'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Confiança:</span>
                    <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/50">
                      {hierarchy.coachTrustLevel || player.relationships.coach || 60}%
                    </span>
                  </div>
                </div>

                {/* Veredito Oficial do Treinador */}
                <div className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                  userRestMode === 'start'
                    ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-950/30'
                    : userRestMode === 'sub_60'
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-950/30'
                    : 'bg-sky-950/40 border-sky-500/80 shadow-lg shadow-sky-950/30'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Escalação Oficial Definida pelo Treinador:
                      </span>
                      <h4 className={`text-base font-black flex items-center gap-2 ${
                        userRestMode === 'start' ? 'text-emerald-400' :
                        userRestMode === 'sub_60' ? 'text-amber-400' : 'text-sky-400'
                      }`}>
                        {userRestMode === 'start' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                        {userRestMode === 'sub_60' && <Zap className="w-5 h-5 text-amber-400" />}
                        {userRestMode === 'rest_full' && <BatteryCharging className="w-5 h-5 text-sky-400" />}
                        <span>
                          {userRestMode === 'start' 
                            ? 'ESCALADO NO 11 INICIAL (TITULAR ABSOLUTO)' 
                            : userRestMode === 'sub_60'
                            ? 'BANCO DE RESERVAS: ENTRARÁ AOS 60\' (12º JOGADOR)'
                            : 'POUPADO PELO TÉCNICO (GESTÃO DE CARGA FÍSICA)'}
                        </span>
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 shrink-0">
                      Decisão do Treinador
                    </span>
                  </div>

                  {/* Fala do Treinador no Vestiário */}
                  <div className="p-3 rounded-xl bg-[#10141e] border border-slate-800 text-xs text-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-400" />
                      <span>Palavra do Professor no Vestiário:</span>
                    </span>
                    <p className="italic text-slate-300 leading-relaxed">
                      {hierarchy.coachVerdictQuote || hierarchy.statusExplanation}
                    </p>
                  </div>
                </div>

                {/* Grid de Fatores da Decisão do Técnico */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Confiança com Técnico</span>
                    <span className="font-mono font-black text-white">
                      {hierarchy.coachTrustLevel || player.relationships.coach || 60}% 
                      <span className="text-[10px] text-slate-500 font-normal"> / {hierarchy.coachRequiredTrustForStarting || 75}%</span>
                    </span>
                  </div>

                  <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Concorrente de Posição</span>
                    <span className="font-mono font-black text-amber-300 truncate block">
                      {hierarchy.topCompetitor?.name || 'Titular'} ({hierarchy.topCompetitor?.ovr || 78} OVR)
                    </span>
                  </div>

                  <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Energia Física</span>
                    <span className={`font-mono font-black ${player.energy >= 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {player.energy}% ({player.energy >= 65 ? '100% Apto' : 'Fadiga'})
                    </span>
                  </div>

                  <div className="bg-[#181d28] p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase truncate">Perfil do Treinador</span>
                    <span className="font-bold text-slate-300 truncate block">
                      {hierarchy.coachPersonality?.shortTag || 'Disciplina & Foco'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic pt-1">
                  Nota tática: A minutagem em campo pertence soberanamente ao técnico. Conquiste mais moral através dos treinos semanais para virar titular absoluto.
                </div>

              </div>

              {/* Botão de Ação Alinhado com a Decisão do Técnico */}
              <button
                type="button"
                onClick={handleStartMatch}
                className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-extrabold text-sm hover:bg-slate-100 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>
                  {userRestMode === 'rest_full' 
                    ? 'Acompanhar da Tribuna (Poupado pelo Treinador)' 
                    : userRestMode === 'sub_60'
                    ? 'Aguardar no Banco (Entrará aos 60\' por Ordem do Técnico)'
                    : 'Entrar em Campo (Titular Decidido pelo Técnico)'}
                </span>
              </button>
            </div>
          )}

          {/* ESTÁGIO 2: SIMULANDO MINUTO A MINUTO (FEED DE COMENTÁRIOS AO VIVO) */}
          {stage === 'simulating' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Transmissão em Tempo Real</span>
                </span>
                <span className="font-mono text-xs text-slate-400">{playerClub.shortName} {playerScore} x {opponentScore} {opponent.shortName}</span>
              </div>

              {/* Feed de Comentários Minuto a Minuto */}
              <div
                ref={commentaryScrollRef}
                className="bg-[#181d28] border border-slate-800 rounded-2xl p-3.5 max-h-48 overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar"
              >
                {commentaryFeed.map(item => (
                  <div
                    key={item.id}
                    className={`flex items-start space-x-2 py-1 border-b border-slate-800/50 last:border-none ${
                      item.type === 'goal'
                        ? 'text-emerald-300 font-bold bg-emerald-950/30 p-1 rounded'
                        : item.type === 'decision'
                        ? 'text-amber-300 font-bold bg-amber-950/30 p-1 rounded'
                        : item.type === 'whistle'
                        ? 'text-sky-300 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-bold shrink-0">{item.minute}'</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-[11px] text-slate-500 italic pt-1">
                A simulação pausa automaticamente quando a bola chegar no seu setor tático ({player.position}).
              </p>
            </div>
          )}

          {/* ESTÁGIO 3: DECISÃO TÁTICA (VOCÊ ESTÁ NA BOLA!) */}
          {stage === 'decision_prompt' && activeMoment && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 p-2 rounded-xl">
                <span>{activeMoment.contextTitle || `VOCÊ ESTÁ NA BOLA (${activeMoment.minute}')`}</span>
                <span className="text-slate-300 text-[10px] font-mono bg-amber-900/50 px-2 py-0.5 rounded border border-amber-700/60">
                  Placar: {playerScore} x {opponentScore}
                </span>
              </div>

              {/* Descrição do Lance */}
              <div className="bg-[#181d28] border-l-4 border-amber-400 p-3.5 rounded-2xl text-slate-100 text-xs sm:text-sm leading-relaxed">
                {activeMoment.situationText}
              </div>

              {/* As 4 Opções de Decisão Baseadas em Estilo, Atributos e Visão */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                    4 Vias Táticas - Sua Decisão de Jogo:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Estilo: <strong className="text-amber-400 font-bold">{player.playStyleName}</strong>
                  </span>
                </div>

                {activeMoment.options.map(option => {
                  const effectiveMatchPlayer = matchInjury ? { ...player, activeInjury: matchInjury } : player;
                  const evalInfo = evaluateOptionSuitability(effectiveMatchPlayer, option);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleChooseOption(option)}
                      className="w-full text-left p-3 sm:p-3.5 rounded-2xl transition-all flex flex-col space-y-2 border group active:scale-[0.99] bg-[#181d28]/95 hover:bg-[#202738] border-slate-700/80 hover:border-slate-500 shadow-md hover:shadow-lg"
                    >
                      {/* Top Header: Label + Badges de Categoria e Sinergia */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="font-extrabold text-white text-xs sm:text-sm group-hover:text-emerald-300 transition-colors block">
                            {option.label}
                          </span>
                          <p className="text-[11px] text-slate-300 leading-snug">{option.description}</p>
                        </div>

                        {/* Badges de Categoria Tática e Sinergia de Estilo */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-slate-800 text-slate-200 border-slate-600 flex items-center gap-1">
                            <span>{evalInfo.actionCategoryLabel}</span>
                          </span>

                          {evalInfo.hasStyleSynergy && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-600/60 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <Zap className="w-2.5 h-2.5 text-amber-400" />
                              <span>Alinhado ao seu Estilo</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer do Card: Atributos Testados + Dica de Leitura Tática */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
                        {/* Atributos e notas do jogador */}
                        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">Atributos:</span>
                          <span className="bg-black/50 px-2 py-0.5 rounded text-slate-200 border border-slate-800">
                            {evalInfo.primaryStatName} <strong className="text-emerald-400 font-bold">{evalInfo.primaryVal}</strong>
                          </span>
                          {evalInfo.secondaryStatName !== evalInfo.primaryStatName && (
                            <span className="bg-black/50 px-2 py-0.5 rounded text-slate-200 border border-slate-800">
                              {evalInfo.secondaryStatName} <strong className="text-emerald-400 font-bold">{evalInfo.secondaryVal}</strong>
                            </span>
                          )}
                        </div>

                        {/* Insight contextual do lance */}
                        {option.tacticalInsight && (
                          <span className="text-[10px] text-slate-400 italic max-w-full sm:max-w-[340px] truncate">
                            <span className="text-amber-400 not-italic font-semibold mr-1">[Visão de Jogo]</span>
                            {option.tacticalInsight}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FALLBACK DE SEGURANÇA: DECISÃO SEM MOMENTO (IMPEDE QUALQUER VAZIO PRETO) */}
          {stage === 'decision_prompt' && !activeMoment && (
            <div className="bg-[#181d28] border border-amber-600/40 p-5 rounded-2xl text-center space-y-3 animate-in fade-in">
              <span className="text-amber-400 font-bold text-sm block">Carregando lance decisivo do atleta...</span>
              <p className="text-xs text-slate-400">A bola está no seu setor de jogo. Toque abaixo para prosseguir a jogada.</p>
              <button
                type="button"
                onClick={() => {
                  const targetMin = Math.max(1, currentMinute);
                  const recoveryMoment = createContextualMoment(
                    player,
                    opponent,
                    targetMin,
                    { home: playerScoreRef.current, away: opponentScoreRef.current },
                    usedScenarioKeys.current
                  );
                  if (recoveryMoment) {
                    setActiveMoment(recoveryMoment);
                    setIsBallWithPlayer(true);
                    setBallCoords(playerBaseCoords);
                  } else {
                    setStage('simulating');
                  }
                }}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs transition-colors shadow-lg"
              >
                Retomar Lance / Continuar Partida
              </button>
            </div>
          )}

          {/* ESTÁGIO 4: RESULTADO DA DECISÃO (SISTEMA NÃO-BINÁRIO DE TRADE-OFFS & CARTÕES) */}
          {stage === 'decision_result' && (
            <div className="space-y-4 py-2 text-center animate-in zoom-in-95 duration-200">
              
              {/* Ícone Dinâmico por Tipo de Repercussão */}
              <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center transition-all ${
                lastDecisionResult?.cardType === 'red' || lastDecisionResult?.impact === 'red_card'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-bounce'
                  : lastDecisionResult?.cardType === 'yellow'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : lastDecisionResult?.impact === 'clima_quente'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/60 shadow-[0_0_25px_rgba(249,115,22,0.35)]'
                  : lastDecisionResult?.impact === 'malandragem'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : lastDecisionResult?.impact === 'lideranca'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : lastDecisionSuccess 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              }`}>
                {lastDecisionResult?.cardType === 'red' ? (
                  <Square className="w-7 h-7 fill-red-500 text-red-500" />
                ) : lastDecisionResult?.cardType === 'yellow' ? (
                  <Square className="w-7 h-7 fill-amber-400 text-amber-400" />
                ) : lastDecisionResult?.impact === 'clima_quente' ? (
                  <Flame className="w-7 h-7 text-orange-400 animate-pulse" />
                ) : lastDecisionResult?.impact === 'malandragem' ? (
                  <Zap className="w-7 h-7 text-purple-400" />
                ) : lastDecisionResult?.impact === 'lideranca' ? (
                  <Crown className="w-7 h-7 text-emerald-400" />
                ) : lastDecisionSuccess ? (
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-7 h-7 text-amber-400" />
                )}
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className={`text-base sm:text-lg font-black tracking-wide ${
                  lastDecisionResult?.cardType === 'red' || lastDecisionResult?.impact === 'red_card'
                    ? 'text-rose-400'
                    : lastDecisionResult?.cardType === 'yellow'
                    ? 'text-amber-400'
                    : lastDecisionResult?.impact === 'clima_quente'
                    ? 'text-orange-400'
                    : lastDecisionResult?.impact === 'malandragem'
                    ? 'text-purple-300'
                    : lastDecisionResult?.impact === 'lideranca'
                    ? 'text-emerald-300'
                    : lastDecisionSuccess
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {lastDecisionTitle || (lastDecisionSuccess ? 'Ação Concluída com Sucesso!' : 'Lance Interrompido')}
                </h3>
                
                <div className="bg-[#181d28] border border-slate-700/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 leading-relaxed text-left shadow-inner">
                  {lastDecisionText}
                </div>

                {/* Pills de Repercussão & Trade-offs Reais (Vestiário, Torcida, Treinador e Cartões) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                  {lastDecisionResult?.lockerRoomBonus ? (
                    <span className="text-[10px] sm:text-[11px] bg-purple-950/80 text-purple-300 border border-purple-700/70 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>+{lastDecisionResult.lockerRoomBonus}% Vestiário</span>
                    </span>
                  ) : null}

                  {lastDecisionResult?.fansBonus ? (
                    <span className="text-[10px] sm:text-[11px] bg-sky-950/80 text-sky-300 border border-sky-700/70 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm">
                      <Heart className="w-3 h-3 text-sky-400" />
                      <span>+{lastDecisionResult.fansBonus}% Torcida</span>
                    </span>
                  ) : null}

                  {lastDecisionResult?.coachBonus ? (
                    <span className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm ${
                      lastDecisionResult.coachBonus > 0
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/70'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-700/70'
                    }`}>
                      <Shield className="w-3 h-3" />
                      <span>{lastDecisionResult.coachBonus > 0 ? `+${lastDecisionResult.coachBonus}%` : `${lastDecisionResult.coachBonus}%`} Treinador</span>
                    </span>
                  ) : null}

                  {lastDecisionResult?.cardType === 'yellow' && (
                    <span className="text-[10px] sm:text-[11px] bg-amber-950/90 text-amber-300 border border-amber-500 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                      <Square className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span>Cartão Amarelo</span>
                    </span>
                  )}

                  {lastDecisionResult?.cardType === 'red' && (
                    <span className="text-[10px] sm:text-[11px] bg-red-950/95 text-red-300 border border-red-500 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 animate-pulse shadow-md">
                      <Square className="w-2.5 h-2.5 fill-red-500 text-red-500" />
                      <span>Cartão Vermelho (Expulso)</span>
                    </span>
                  )}

                  {lastDecisionResult?.ratingDelta !== undefined && (
                    <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-mono font-black border ${
                      lastDecisionResult.ratingDelta >= 0
                        ? 'bg-slate-800 text-emerald-400 border-emerald-800/60'
                        : 'bg-slate-800 text-rose-400 border-rose-800/60'
                    }`}>
                      {lastDecisionResult.ratingDelta >= 0 ? `+${lastDecisionResult.ratingDelta.toFixed(1)}` : lastDecisionResult.ratingDelta.toFixed(1)} Nota
                    </span>
                  )}
                </div>

                {/* Alerta de Lesão se o atleta sentiu a jogada */}
                {matchInjury && (
                  <div className="bg-red-950/70 border border-red-500/80 rounded-2xl p-3.5 text-left flex items-start gap-3 shadow-lg shadow-red-950/50 animate-pulse mt-2">
                    <HeartPulse className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-red-300 uppercase tracking-wider text-[10px]">Alerta Médico em Campo</span>
                        <span className="text-[10px] font-black bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
                          {matchInjury.name}
                        </span>
                      </div>
                      <p className="text-slate-200">
                        O jogador sentiu a região da <strong>{matchInjury.bodyPart}</strong>. Motivo: <em>{matchInjury.causeTitle}</em>. O chefe do Departamento Médico fará exames detalhados no vestiário após o apito final.
                      </p>
                    </div>
                  </div>
                )}

                {/* Feedback Tático da Decisão */}
                {lastDecisionEval && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {lastDecisionEval.hasStyleSynergy && (
                      <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        <span>Sinergia com seu Estilo (+14%)</span>
                      </span>
                    )}
                    {lastDecisionEval.isContextOptimal && (
                      <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Leitura Ideal da Brecha (+14%)</span>
                      </span>
                    )}
                    <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-bold">
                      Atributo: {lastDecisionEval.primaryStatName} ({lastDecisionEval.effectiveStat} pts)
                    </span>
                  </div>
                )}
              </div>

              {/* Se o jogador sofreu lesão no lance: Decisão Médica Imediata em Campo */}
              {matchInjury && !playerIsSentOff ? (
                <div className="bg-[#141822] border border-red-500/50 p-4 rounded-2xl max-w-lg mx-auto space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-red-300 flex items-center gap-1.5 uppercase tracking-wide">
                      <HeartPulse className="w-4 h-4 text-red-400 animate-pulse" />
                      Conduta Médica Imediata no Gramado:
                    </span>
                    <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                      Decisão do Árbitro: {matchInjury.causeDescription.includes('sem falta') ? 'Bola Limpa (Sem Falta)' : 'Falta de Jogo'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 text-left">
                    O médico do clube entrou com a maleta de primeiros socorros. Você precisa decidir se preserva seu físico ou arrisca voltar a campo no sacrifício:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    <button
                      type="button"
                      onClick={handleInjurySubOut}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-left transition-all group"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 block">
                        Pedir Substituição Imediata
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Sai aplaudido de pé; o reserva entra aos {currentMinute}' e você preserva a carreira com gelo no banco.
                      </span>
                    </button>

                    {matchInjury.isSacrificeAllowed ? (
                      <button
                        type="button"
                        onClick={handleInjuryPlayOnSacrifice}
                        className="p-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/70 text-left transition-all group"
                      >
                        <span className="text-xs font-bold text-amber-300 group-hover:text-amber-200 block flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          Voltar no Sacrifício (Spray)
                        </span>
                        <span className="text-[10px] text-amber-200/70 block mt-0.5">
                          Aplica spray analgésico e volta mancando (+12% torcida pela raça, mas atributos de jogo sofrem queda real e risco de agravar).
                        </span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-left opacity-80">
                        <span className="text-xs font-bold text-red-300 block">
                          Sacrifício Vetado pelo Médico (Grau {matchInjury.grade})
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Lesão {matchInjury.level} impede continuar apoiando a perna em campo. Substituição obrigatória.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResumeSimulation}
                  className={`py-3 px-6 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all shadow-lg ${
                    playerIsSentOff
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/50'
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  <span>
                    {playerIsSentOff 
                      ? 'Você foi Expulso (Avançar para o Apito Final)' 
                      : 'Continuar Partida'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ESTÁGIO 5: PÓS-JOGO (APITO FINAL & REPERCUSSÃO) */}
          {stage === 'post_match' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-[#181d28] p-4 rounded-2xl border border-slate-800 text-center space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Fim dos 90 Minutos
                </span>
                <div className="text-3xl font-black text-white font-['Teko'] tracking-wider">
                  {player.currentClub} {playerScore} x {opponentScore} {opponent.shortName}
                </div>
                <div className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                  Nota do Craque: <strong className="text-emerald-400 font-extrabold text-sm">{playerRating.toFixed(1)}</strong>
                </div>
              </div>

              {/* CARD OFICIAL: JOGADOR DA PARTIDA (MOTM / CRAQUE DO JOGO) */}
              {matchMotm && (
                <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-lg ${
                  matchMotm.isUser
                    ? 'bg-gradient-to-r from-amber-950/70 via-[#1b2230] to-emerald-950/50 border-amber-500/70'
                    : 'bg-[#151924] border-slate-700/80'
                }`}>
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      matchMotm.isUser
                        ? 'bg-amber-500/25 border border-amber-400 text-amber-300'
                        : 'bg-slate-800 border border-slate-700 text-amber-400'
                    }`}>
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                        ⭐ Jogador da Partida (Craque do Jogo)
                      </span>
                      <div className="text-sm font-black text-white flex items-center gap-2 flex-wrap">
                        <span>{matchMotm.playerName}</span>
                        <span className="text-[10px] font-bold text-slate-400">({matchMotm.clubName})</span>
                        {matchMotm.isUser && (
                          <span className="text-[9px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black">
                            PRÊMIO CONQUISTADO!
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-300">
                        {matchMotm.goals} gol(s) • {matchMotm.assists} assistência(s)
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 bg-black/40 px-3 py-1.5 rounded-xl border border-amber-700/50">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Nota</span>
                    <span className="text-xl font-black text-amber-300 font-['Teko']">{matchMotm.rating.toFixed(1)}</span>
                  </div>
                </div>
              )}

              {/* Sumário Completo dos Gols & Destaques da Partida */}
              {matchGoalEvents.length > 0 && (
                <div className="bg-[#121622] border border-slate-700/80 rounded-2xl p-4 space-y-3 text-left shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      Gols da Partida ({playerScore + opponentScore})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">Tempo Regulamentar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Mandante */}
                    <div className="space-y-1.5 bg-[#181d28] p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        {playerClub.shortName} ({playerScore})
                      </span>
                      {matchGoalEvents.filter(g => g.team === 'home').length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">Nenhum gol marcado</span>
                      ) : (
                        matchGoalEvents.filter(g => g.team === 'home').map(g => (
                          <div key={g.id} className="flex items-center justify-between text-slate-200">
                            <span className={`font-bold ${g.isUserGoal ? 'text-emerald-400 font-black' : 'text-white'}`}>
                              {g.scorerName} {g.isUserGoal && '(Você)'}
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                              {g.assistName && <span className="text-[10px] text-slate-400 font-sans font-normal">(ast: {g.assistName})</span>}
                              <span>{g.minute}'</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Visitante */}
                    <div className="space-y-1.5 bg-[#181d28] p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        {opponent.shortName} ({opponentScore})
                      </span>
                      {matchGoalEvents.filter(g => g.team === 'away').length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">Nenhum gol marcado</span>
                      ) : (
                        matchGoalEvents.filter(g => g.team === 'away').map(g => (
                          <div key={g.id} className="flex items-center justify-between text-slate-200">
                            <span className="font-bold text-white">
                              {g.scorerName}
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-rose-400 font-bold">
                              {g.assistName && <span className="text-[10px] text-slate-400 font-sans font-normal">(ast: {g.assistName})</span>}
                              <span>{g.minute}'</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ZONA MISTA & ENTREVISTA PÓS-JOGO (FLASH INTERVIEW) */}
              {interview && (
                <div className="bg-[#121622] border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl">{interview.outletLogo}</span>
                      <div>
                        <span className="text-xs font-black text-amber-400 block tracking-wide uppercase">Zona Mista • Entrevista Pós-Jogo</span>
                        <span className="text-[11px] text-slate-400">{interview.outletName} • Repórter: {interview.journalistName}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-extrabold px-2.5 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block"></span>
                      <span>AO VIVO</span>
                    </span>
                  </div>

                  {/* Pergunta da Entrevista */}
                  <div className="bg-[#181d2a] border border-slate-700/80 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-100 font-medium italic">
                    <span className="text-amber-400 font-bold not-italic mr-1.5">"{interview.journalistName}:"</span>
                    {interview.question}
                  </div>

                  {/* Respostas da Entrevista */}
                  {!chosenInterviewAnswer ? (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Escolha sua postura diante dos microfones:
                      </span>
                      {interview.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setChosenInterviewAnswer(opt);
                            confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
                          }}
                          className="w-full text-left p-3 rounded-xl bg-[#181d28] hover:bg-[#202738] border border-slate-700/70 hover:border-amber-400/70 transition-all space-y-1.5 group shadow"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                              {opt.stanceLabel}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                              Responder →
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 group-hover:text-white font-medium">
                            {opt.text}
                          </p>
                          <span className="text-[10px] text-slate-400 block italic">
                            Impacto: {opt.impactSummary}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    /* Resposta Escolhida e Repercussão Imediata */
                    <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">
                          Sua Declaração na Zona Mista:
                        </span>
                        <span className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black">
                          Publicado na Imprensa
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium italic">
                        {chosenInterviewAnswer.text}
                      </p>
                      <div className="pt-2 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-semibold flex items-center justify-between">
                        <span>{chosenInterviewAnswer.headline}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notícia e Repercussão */}
              <div className="bg-[#181d28] border border-slate-700/80 rounded-2xl p-4 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-400">{postMatchStory?.outlet || 'ge.globo'}</span>
                  <span className="text-slate-500">Agora</span>
                </div>

                {isGeneratingStory ? (
                  <div className="py-3 text-center text-xs text-slate-400 space-y-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-spin mx-auto" />
                    <span>Conectando com o histórico e gerando a repercussão...</span>
                  </div>
                ) : (
                  <>
                    <h4 className="text-sm font-bold text-white">{postMatchStory?.headline}</h4>
                    <p className="text-xs text-slate-300">{postMatchStory?.snippet}</p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleFinalizeAndSave}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all"
              >
                Salvar Estatísticas e Voltar ao Painel
              </button>
            </div>
          )}

            </div>
          </div>

          {/* COLUNA DIREITA (Desktop): ESCALAÇÃO VISITANTE / ADVERSÁRIO */}
          <div className={`lg:col-span-3 p-2.5 overflow-y-auto custom-scrollbar ${
            mobileTab === 'away' ? 'block' : 'hidden lg:block'
          }`}>
            <MatchLineupSidebar 
              club={opponent} 
              lineup={awayLineup} 
              bench={awayBench} 
              isHome={false} 
              isUserTeam={false} 
            />
          </div>

        </div>

        {/* Modal de Entrada em Campo do Super-Sub (Aos 60') */}
        {showSuperSubModal && (
          <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
            <div className="bg-[#181d28] border-2 border-emerald-500/70 rounded-3xl p-5 sm:p-6 max-w-md w-full text-center space-y-4 shadow-2xl shadow-emerald-950/60">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 mx-auto flex items-center justify-center text-emerald-400">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-600/60 inline-block">
                  Substituição aos 60' • Chamado do Treinador
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">É A SUA HORA, GAROTO!</h3>
                <div className="text-xs text-slate-300 italic bg-black/50 p-3.5 rounded-2xl border border-slate-700/60 text-left space-y-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 not-italic">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{playerClub.coachName || 'Treinador'}:</span>
                  </span>
                  <p>
                    "{hierarchy.topCompetitor?.name || 'O titular'} já deu o que tinha que dar no 1º tempo, mas o jogo está travado. Coloca a camisa #{player.number}, entra em campo e incendeia a zaga adversária!"
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuperSubModal(false);
                  setIsPaused(false);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-sm rounded-2xl shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>ENTRAR EM CAMPO (#{player.number} {player.surname})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
