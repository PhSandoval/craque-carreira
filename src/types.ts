export type Position = 
  | 'GOL' 
  | 'ZAG' | 'LE' | 'LD' 
  | 'VOL' | 'MC' | 'ME' | 'MD' | 'MEI' 
  | 'PE' | 'PD' | 'CA';

export type Foot = 'Esquerda' | 'Direita' | 'Ambidestro';

export interface PlayerAttributes {
  // Atributos Principais (Compatibilidade de Cálculo Geral)
  finalization: number;
  passing: number;
  dribbling: number;
  pace: number;
  defense: number;
  physical: number;
  vision: number;

  // ==========================================
  // FOOTBALL MANAGER: ATRIBUTOS TÉCNICOS
  // ==========================================
  finishing?: number;      // Finalização
  firstTouch?: number;     // Primeiro Toque / Domínio
  crossing?: number;       // Cruzamento
  tackling?: number;       // Desarme
  marking?: number;        // Marcação
  longShots?: number;      // Chutes de Longe
  heading?: number;        // Cabeceio
  freeKicks?: number;      // Bolas Paradas / Faltas
  penalties?: number;      // Pênaltis

  // ==========================================
  // FOOTBALL MANAGER: ATRIBUTOS MENTAIS
  // ==========================================
  composure?: number;      // Frieza / Compostura
  decisions?: number;      // Tomada de Decisão
  offTheBall?: number;     // Sem Bola / Desmarque
  positioning?: number;    // Posicionamento Tático
  determination?: number;  // Determinação / Raça
  bravery?: number;        // Bravura / Divididas
  teamwork?: number;       // Trabalho de Equipe
  anticipation?: number;   // Antecipação de Jogadas
  concentration?: number;  // Concentração

  // ==========================================
  // FOOTBALL MANAGER: ATRIBUTOS FÍSICOS
  // ==========================================
  acceleration?: number;   // Aceleração
  stamina?: number;        // Resistência / Fôlego
  strength?: number;       // Força / Porte Físico
  agility?: number;        // Agilidade
  balance?: number;        // Equilíbrio Corporal
  jumping?: number;        // Impulsão Aérea

  // Goleiros (específicos)
  reflexes?: number;
  oneOnOne?: number;
  handling?: number;
  aerialReach?: number;
}

export interface PlayerRelationships {
  coach: number;      // 0 - 100
  fans: number;       // 0 - 100
  board: number;      // 0 - 100
  teammates: number;  // 0 - 100
  veteransRespect?: number;      // 0 - 100 (Respeito e mentoria dos veteranos e líderes)
  partyCliqueChemistry?: number; // 0 - 100 (Química com a ala dos festeiros / resenha)
}

export interface MemoryEvent {
  id: string;
  age: number;
  seasonYear: number;
  club: string;
  category: 'match' | 'locker_room' | 'transfer' | 'controversy' | 'milestone' | 'rivalry';
  title: string;
  description: string;
  impactSummary: string; // Ex: "Torcida do Palmeiras te odeia", "Técnico confia na sua liderança"
  tags: string[];
  importance: 'baixa' | 'media' | 'alta' | 'lendaria';
  dateStr: string;
}

export interface CareerYearRecord {
  age: number;
  club: string;
  ovr: number;
  games: number;
  goals: number;
  assists: number;
  ratingAvg: number;
  titlesWon: string[];
}

export interface PlayerProfile {
  id: string;
  name: string;
  lastName?: string;
  knownName?: string;
  surname: string;
  number: number;
  nationality: string;
  flag: string;
  position: Position;
  preferredFoot: Foot;
  playStyleId?: string;
  playStyleName?: string;
  age: number;
  seasonYear: number;
  currentMatchDay: number; // 1 to 38 (rodadas do campeonato)
  currentWeekDay?: number; // 1 (Reapresentação), 2 (Treino CT), 3 (Bastidores), 4 (Dia de Jogo)
  currentClub: string;
  ovr: number;
  marketValueEur: number; // in Millions
  energy: number; // 0 - 100
  moral: number; // 0 - 100
  attributes: PlayerAttributes;
  relationships: PlayerRelationships;
  lifestylePersona?: 'disciplinado_extremo' | 'festeiro_resenha' | 'lider_agregador' | 'focado_silencioso';
  lifestylePersonaLabel?: string;
  personalityTags: string[];
  rivals: string[]; // Clubes ou jogadores rivais
  memories: MemoryEvent[];
  history: CareerYearRecord[];
  currentSeasonStats: {
    games: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    ratingSum: number;
  };
  careerTotals: {
    games: number;
    goals: number;
    assists: number;
    trophies: number;
  };
  teammateAffinities?: Record<string, TeammateAffinity>;
  newsFeed?: NewsArticle[];
  weeklyTrainingDone?: boolean;
  trainingVerdict?: {
    routineTitle: string;
    coachFeedback: string;
    earnedRole: 'start' | 'sub_60' | 'rest_full';
    earnedRoleLabel: string;
    competitorName: string;
    competitorOvr: number;
    trainingScore: number;
  };
  lastTrainingResult?: WeeklyTrainingResult;
  activeInjury?: PlayerInjury | null;
  injuryHistory?: PlayerInjury[];
  activeOpportunity?: CareerOpportunity | null;
  suspensionRoundsRemaining?: number;
  suspensionReason?: string;
  eliminatedCompetitions?: string[];
  seasonTitlesWon?: string[];
  currentLeagueRound?: number;
  matchHistory?: MatchHistoryEntry[];
  awards?: PlayerAwards;
  contract?: PlayerContract;
  bankBalanceEur?: number;
  activeSponsors?: SponsorshipDeal[];
  financeHistory?: FinanceTransaction[];
  purchasedUpgrades?: string[];
}

export interface MatchHistoryEntry {
  round: number;
  seasonYear: number;
  competitionName: string;
  competitionShort: string;
  competitionType: CompetitionCategory;
  stageName: string;
  opponentName: string;
  opponentShortName: string;
  playerTeamScore: number;
  opponentTeamScore: number;
  goals: number;
  assists: number;
  rating: number;
  isMotm: boolean;
  motmName: string;
  yellowCard: boolean;
  redCard: boolean;
  skippedReason?: 'injury' | 'suspension';
}

export interface PotmAward {
  id: string;
  monthLabel: string;
  seasonYear: number;
  roundEnd: number;
  ratingAvg: number;
  goals: number;
  assists: number;
  motmCount: number;
  leagueName: string;
}

export interface SeasonAwardRecord {
  id: string;
  seasonYear: number;
  title: string;
  category: 'top_scorer' | 'top_assister' | 'mvp' | 'young_player' | 'team_of_season' | 'ballon_dor';
  detail: string;
}

export interface PlayerAwards {
  motmCount: number;
  seasonMotmCount: number;
  potmHistory: PotmAward[];
  seasonAwards: SeasonAwardRecord[];
  ballonDorCount: number;
}

export interface PlayerContract {
  monthlySalaryEur: number;
  yearsRemaining: number;
  releaseClauseEur: number;
  signingBonusEur?: number;
  roleLabel: string;
}

export interface SponsorshipDeal {
  id: string;
  brand: string;
  monthlyEur: number;
  goalBonusEur: number;
  roundsRemaining: number;
  badgeColor?: string;
}

export interface FinanceTransaction {
  id: string;
  round: number;
  seasonYear: number;
  label: string;
  amountEur: number;
  category: 'salary' | 'sponsor' | 'bonus' | 'investment' | 'signing';
}

export type InjuryCause = 'fadiga_sobrecarga' | 'entrada_violenta' | 'sprint_explosivo' | 'gramado_ruim';
export type InjuryLevel = 'leve' | 'moderada' | 'grave';

export interface PlayerInjury {
  id: string;
  name: string; // Ex: "Estiramento no Isquiotibial Direito (Grau 2)"
  cause: InjuryCause;
  causeTitle: string; // Ex: "Sobrecarga de Jogos e Fadiga Muscular"
  causeDescription: string; // Ex: "Atuou com menos de 55% de energia em alta intensidade e sentiu a posterior após sprint"
  level: InjuryLevel;
  grade: 1 | 2 | 3; // 1 = Leve, 2 = Moderada, 3 = Grave
  roundsRemaining: number;
  initialRounds: number;
  isSacrificeAllowed: boolean; // Se pode jogar no sacrifício com debuff
  isPlayingOnSacrifice?: boolean;
  doctorReport: string; // Laudo oficial do DM
  occurredAtRound: number;
  occurredAtMinute?: number;
  bodyPart: 'coxa' | 'tornozelo' | 'joelho' | 'panturrilha' | 'adutor' | 'costela';
  statDebuff?: {
    stat: keyof PlayerAttributes;
    penalty: number;
  };
}

export interface CareerOpportunity {
  id: string;
  type: 'scout' | 'sponsorship' | 'national_team' | 'locker_room' | 'contract_renewal' | 'fan_clash';
  title: string;
  subtitle: string;
  description: string;
  source: string; // ex: "Scout Internacional (Borussia Dortmund)", "Nike Brasil", "CBF Sub-17", "Diretoria"
  badge: string;
  badgeColor?: string;
  options: {
    id: string;
    label: string;
    description: string;
    risk?: 'baixo' | 'medio' | 'alto';
    consequenceText: string;
    effects: {
      moralDelta?: number;
      energyDelta?: number;
      marketValueDeltaEur?: number;
      coachTrustDelta?: number;
      fansTrustDelta?: number;
      boardTrustDelta?: number;
      teammatesTrustDelta?: number;
      tagEarned?: string;
      memoryTitle?: string;
      memoryDesc?: string;
    };
  }[];
}

export interface NewsArticle {
  id: string;
  round?: number;
  matchDay?: number;
  dateStr: string;
  outlet: string; // 'ge.globo', 'UOL Esporte', 'TNT Sports', 'Lance!', 'CazéTV', 'ESPN'
  badgeColor?: string;
  category: 'match' | 'interview' | 'transfer' | 'locker_room' | 'milestone';
  categoryLabel: string;
  headline: string;
  snippet: string;
  socialMediaPost?: {
    author: string;
    handle: string;
    text: string;
    likes: string;
    comments?: string;
  };
  coachQuote?: string;
  interviewQuote?: string;
}

export interface TeammateAffinity {
  playerId: string;
  name: string;
  position: Position;
  number?: number;
  ovr: number;
  age: number;
  affinity: number; // 0 - 100
  level: 'alta' | 'neutra' | 'baixa';
  relationshipTitle: string; // Ex: "Dupla Dinâmica", "Mentor Experiente", "Concorrente de Posição", "Amigo de Resenha"
  personality: string; // Ex: "Veterano Líder", "Ponta Explosivo", "Garçom Calmo", "Marcador Sério"
  socialClique?: 'festeiros' | 'veteranos' | 'base' | 'profissionais';
  cliqueLabel?: string; // Ex: "Ala da Resenha & Noitada", "Ala dos Veteranos & Líderes"
  chemistryBonus: number; // Bônus em passes / tabelas (+% chance de sucesso)
  lastInteraction?: string; // Ex: "Tabelaram com perfeição no último treino"
  frictionReason?: string; // Ex: "Cobrança sobre recomposição defensiva"
}

export interface RealPlayer {
  id: string;
  name: string;
  position: Position;
  ovr: number;
  age: number;
  nationality: string;
  flag: string;
  marketValueEur: number;
  isStar?: boolean;
}

export type TacticalFormation = '4-3-3' | '4-2-3-1' | '4-4-2' | '3-5-2' | '3-4-3' | '5-3-2' | '3-4-2-1' | '4-4-1-1' | '3-4-1-2' | '4-1-4-1' | '5-4-1';

export interface Club {
  id: string;
  key?: string;
  name: string;
  shortName: string;
  badgeUrl?: string;
  leagueId: string;
  league: string;
  country: string;
  stadium: string;
  prestige: number; // 1 to 5 stars
  formation?: TacticalFormation;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  rivalClubs: string[];
  playStyle: string;
  coachName: string;
  budgetEur: number; // Em Milhões
  squad: RealPlayer[];
  isContinentalOnly?: boolean; // Participa das Copas (Champions/Europa/Conference/Liberta/Sula) e do Mercado da IA, mas NÃO joga liga selecionável nem faz propostas ao jogador
  continentalTournament?: 'champions' | 'europa_league' | 'conference_league' | 'libertadores' | 'sul_americana';
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  country: string;
  countryFlag: string;
  tier: number; // 1 = 1ª Divisão, 2 = 2ª Divisão
  totalRounds: number;
  relegationSpots?: number;
  promotionSpots?: number;
  promotesTo?: string; // id da liga para onde sobe
  relegatesTo?: string; // id da liga para onde cai
}

export type CompetitionCategory = 
  | 'league' 
  | 'state_cup' 
  | 'national_cup' 
  | 'continental_cup' 
  | 'national_team_friendly' 
  | 'world_cup_qualifiers' 
  | 'copa_america' 
  | 'world_cup';

export interface MatchFixture {
  competitionType: CompetitionCategory;
  competitionName: string;
  competitionShort: string;
  stageName: string;
  badgeIcon: string;
  opponent: Club;
  roundNumber: number;
  isCupKnockout?: boolean;
  trophyName?: string;
  isNationalTeamMatch?: boolean;
  nationalTeamName?: string;
  nationalTeamFlag?: string;
  nationalOpponentFlag?: string;
}

export interface LeagueStanding {
  position: number;
  clubId: string;
  clubName: string;
  shortName: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: ('V' | 'E' | 'D')[];
}

export interface WorldTransferEvent {
  id: string;
  playerName: string;
  fromClub: string;
  toClub: string;
  feeEur: number; // em Milhões
  dateStr: string;
  headline: string;
}

export interface MatchDecisionOption {
  id: string;
  label: string;
  description: string;
  primaryStat: keyof PlayerAttributes;
  secondaryStat?: keyof PlayerAttributes;
  requiredStat?: keyof PlayerAttributes; // Compatibilidade retroativa
  risk?: 'baixo' | 'medio' | 'alto'; // Compatibilidade retroativa
  actionType?: 'finalizacao' | 'passe' | 'drible' | 'desarme' | 'posicionamento' | 'cruzamento' | 'retencao' | 'torcida' | 'lideranca' | 'briga' | 'malandragem' | 'catimba' | 'reclamacao' | 'dividida_firme';
  synergyArchetypes?: string[]; // IDs dos arquétipos que possuem sinergia tática com esta ação
  contextFit?: 'ideal' | 'oportuna' | 'cautelosa'; // Grau de aproveitamento da brecha narrada no texto
  tacticalInsight?: string; // Explicação da inteligência da jogada no contexto do lance
  statBonus?: number;
  fansBonus?: number; // Bônus de apreço e carinho da torcida
  coachBonus?: number; // Impacto na confiança do treinador
  boardBonus?: number; // Impacto com a diretoria
  teammatesBonus?: number; // Bônus de química e respeito com o vestiário
  tagsIfChosen?: string[];
  successNarrative?: string; // Narrativa rica e específica em caso de sucesso
  failureNarrative?: string; // Narrativa rica e específica em caso de falha/bloqueio
}

export interface MatchDecisionMoment {
  id: string;
  minute: number;
  contextTitle?: string; // Título contextual (ex: "Pressão em Busca do Empate", "Contra-Ataque com Campo Aberto")
  scoreBefore: { home: number; away: number };
  situationText: string;
  keyOpponentPlayer?: RealPlayer;
  options: MatchDecisionOption[];
}

export interface MatchGoalEvent {
  id: string;
  minute: number;
  scorerName: string;
  assistName?: string;
  team: 'home' | 'away';
  clubId: string;
  clubName: string;
  isUserGoal?: boolean;
  isUserAssist?: boolean;
}

export interface MatchOutcome {
  opponent: Club;
  isHome: boolean;
  score: { playerTeam: number; opponentTeam: number };
  goalEvents?: MatchGoalEvent[];
  playerStats: {
    goals: number;
    assists: number;
    rating: number; // 4.0 - 10.0
    energyUsed: number;
    yellowCard: boolean;
    redCard: boolean;
  };
  highlightMoments: {
    minute: number;
    text: string;
    type: 'goal' | 'assist' | 'miss' | 'foul' | 'defense';
  }[];
  generatedNews?: {
    headline: string;
    snippet: string;
    outlet: string;
    reaction: string;
  };
  memoryCreated?: MemoryEvent;
  interviewAnswered?: {
    question: string;
    answer: string;
    outlet: string;
  };
  motm?: {
    playerName: string;
    clubName: string;
    rating: number;
    goals: number;
    assists: number;
    isUser: boolean;
  };
}

export interface TrainingRoutine {
  id: string;
  title: string;
  category: 'attribute' | 'style' | 'position' | 'physio';
  icon: string;
  description: string;
  energyChange: number; // Ex: -12 (gasta energia) ou +35 (regeneração)
  statGains?: Partial<Record<keyof PlayerAttributes, number>>;
  ovrGain?: number;
  newPosition?: Position;
  newArchetypeId?: string;
  newArchetypeName?: string;
  coachDelta?: number;
  fansDelta?: number;
  boardDelta?: number;
  requiredCoachTrust?: number; // Ex: 55% para mudar de posição
}

export interface CalendarWeekDay {
  dayName: string;
  dateLabel: string;
  title: string;
  type: 'physio' | 'training' | 'tactical' | 'rest' | 'match' | 'pre_match';
  icon: string;
  description: string;
  completed?: boolean;
}

export interface PostMatchInterview {
  journalistName: string;
  outletName: string;
  outletLogo: string;
  question: string;
  options: {
    id: string;
    stance: 'coletiva' | 'torcida' | 'foco';
    stanceLabel: string;
    badgeColor: string;
    text: string;
    impactSummary: string;
    coachDelta: number;
    fansDelta: number;
    boardDelta: number;
    marketValueDelta?: number;
    headline: string;
  }[];
}

export interface MatchLineupPlayer {
  id: string;
  name: string;
  number: number;
  position: Position;
  ovr: number;
  stamina: number; // 0 a 100% (fôlego e cansaço ao longo do jogo)
  rating: number; // Nota da partida ao vivo (ex: 6.5 a 10.0)
  goals: number;
  assists: number;
  yellowCard: boolean;
  redCard: boolean;
  isSubstituted: boolean;
  substitutedMinute?: number;
  isUserPlayer?: boolean;
  isRested?: boolean; // Se foi poupado pela comissão técnica
  substituteInName?: string;
  isBench?: boolean;
  isNewSigning?: boolean; // Recém-contratado pelo departamento de futebol
  isRotated?: boolean; // Entrou como titular por rodízio/gestão de carga
  tacticalRoleLabel?: string; // Papel tático específico determinado pelo técnico
}

export interface ClubTransferSigning {
  id: string;
  clubName: string;
  player: RealPlayer;
  transferFeeEur: number;
  previousClub: string;
  reason: string; // Ex: "Reforço pedido pelo técnico para suprir carência no 3-5-2"
  coachQuote: string;
  matchDay: number;
  dateStr: string;
}

export interface TrainingStatChange {
  statKey: keyof PlayerAttributes;
  statLabel: string;
  before: number;
  after: number;
  delta: number;
}

export interface WeeklyTrainingResult {
  round: number;
  focusId: string;
  focusTitle: string;
  outcomeType: 'crit_success' | 'success' | 'neutral' | 'negative';
  outcomeTitle: string;
  description: string;
  statChanges: TrainingStatChange[];
  ovrDelta: number;
  coachTrustDelta: number;
  energyCost: number;
  coachFeedback: string;
  earnedRole: 'start' | 'sub_60' | 'rest_full';
  earnedRoleLabel: string;
}

export interface MatchSubstitutionEvent {
  minute: number;
  team: 'playerTeam' | 'opponentTeam';
  teamName: string;
  playerOut: MatchLineupPlayer;
  playerIn: MatchLineupPlayer;
  reason: 'cansaco' | 'tatica' | 'lesao_preventiva';
}

export type CoachPersonalityType = 
  | 'disciplinador_tatico'
  | 'desenvolvedor_base'
  | 'pragmatico_hierarquico'
  | 'doutrinador_autoral'
  | 'relacional_paizao'
  | 'estrategista_competitivo';

export interface CoachPersonality {
  id: CoachPersonalityType;
  title: string;
  shortTag: string;
  tagline: string;
  philosophy: string;
  youthPhilosophy: string;
  startingTrustThresholdGiant: number;
  startingTrustThresholdMedium: number;
  preferredStyleName: string;
  keyDemands: string[];
  penalizesPartying: boolean;
  rewardsDiscipline: boolean;
}

export interface SquadHierarchy {
  clubName: string;
  coachName: string;
  prestige: number;
  isGiantClub: boolean;
  userPosition: Position;
  competitors: Array<{
    id: string;
    name: string;
    position: Position;
    ovr: number;
    isStar?: boolean;
  }>;
  topCompetitor: {
    id: string;
    name: string;
    position: Position;
    ovr: number;
    isStar?: boolean;
  };
  ovrGap: number;
  naturalRole: 'start' | 'sub_60' | 'rest_full';
  naturalRoleLabel: string;
  statusExplanation: string;
  coachVerdictQuote: string;
  coachPersonality?: CoachPersonality;
  coachTrustLevel?: number;
  coachRequiredTrustForStarting?: number;
}

export interface WorldTransferMovement {
  id: string;
  playerName: string;
  position: Position;
  ovr: number;
  age: number;
  fromClub: string;
  toClub: string;
  feeEur: number;
  seasonYear: number;
  headline: string;
  type: 'giant_signing' | 'young_prospect' | 'saudi_mega_deal' | 'free_agent';
}

export interface WorldSeasonTransitionReport {
  seasonYear: number;
  retirements: Array<{ playerName: string; clubName: string; age: number; ovr: number }>;
  breakoutYouths: Array<{ playerName: string; clubName: string; age: number; ovr: number; position: Position }>;
  transfers: WorldTransferMovement[];
  activeLeagueIds: string[];
}


