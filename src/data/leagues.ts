import { League } from '../types';

/**
 * CATÁLOGO OFICIAL DAS 19 LIGAS JOGÁVEIS E SIMULADAS (MODELO FOOTBALL MANAGER):
 * - Brasil: 1ª, 2ª e 3ª Divisões (Série A, Série B, Série C)
 * - Inglaterra: 1ª e 2ª Divisões (Premier League, EFL Championship)
 * - Itália: 1ª e 2ª Divisões (Serie A, Serie B)
 * - 1ª Divisão Nacional de: Portugal, Espanha, França, Holanda, Turquia,
 *   Rússia, Arábia Saudita, Argentina, Escócia, Alemanha, Bélgica e Grécia.
 */
export const LEAGUES: Record<string, League> = {
  // ==========================================
  // BRASIL 🇧🇷 (1ª, 2ª e 3ª Divisões)
  // ==========================================
  'serie_a': {
    id: 'serie_a',
    name: 'Brasileirão Série A',
    shortName: 'Série A',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 4,
    relegatesTo: 'serie_b'
  },
  'serie_b': {
    id: 'serie_b',
    name: 'Brasileirão Série B',
    shortName: 'Série B',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    tier: 2,
    totalRounds: 38,
    promotionSpots: 4,
    relegationSpots: 4,
    promotesTo: 'serie_a',
    relegatesTo: 'serie_c'
  },
  'serie_c': {
    id: 'serie_c',
    name: 'Brasileirão Série C',
    shortName: 'Série C',
    country: 'Brasil',
    countryFlag: '🇧🇷',
    tier: 3,
    totalRounds: 38,
    promotionSpots: 4,
    relegationSpots: 4,
    promotesTo: 'serie_b'
  },

  // ==========================================
  // INGLATERRA 🏴󠁧󠁢󠁥󠁮󠁧󠁿 (1ª e 2ª Divisões)
  // ==========================================
  'premier_league': {
    id: 'premier_league',
    name: 'Premier League',
    shortName: 'Premier League',
    country: 'Inglaterra',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 3,
    relegatesTo: 'championship'
  },
  'championship': {
    id: 'championship',
    name: 'EFL Championship',
    shortName: 'Championship',
    country: 'Inglaterra',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tier: 2,
    totalRounds: 46,
    promotionSpots: 3,
    relegationSpots: 3,
    promotesTo: 'premier_league'
  },

  // ==========================================
  // ITÁLIA 🇮🇹 (1ª e 2ª Divisões)
  // ==========================================
  'serie_a_ita': {
    id: 'serie_a_ita',
    name: 'Serie A (Itália)',
    shortName: 'Serie A TIM',
    country: 'Itália',
    countryFlag: '🇮🇹',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 3,
    relegatesTo: 'serie_b_ita'
  },
  'serie_b_ita': {
    id: 'serie_b_ita',
    name: 'Serie B (Itália)',
    shortName: 'Serie BKT',
    country: 'Itália',
    countryFlag: '🇮🇹',
    tier: 2,
    totalRounds: 38,
    promotionSpots: 3,
    relegationSpots: 4,
    promotesTo: 'serie_a_ita'
  },

  // ==========================================
  // ESPANHA 🇪🇸 (1ª Divisão)
  // ==========================================
  'la_liga': {
    id: 'la_liga',
    name: 'La Liga EA Sports',
    shortName: 'La Liga',
    country: 'Espanha',
    countryFlag: '🇪🇸',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 3
  },

  // ==========================================
  // ALEMANHA 🇩🇪 (1ª Divisão)
  // ==========================================
  'bundesliga': {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    country: 'Alemanha',
    countryFlag: '🇩🇪',
    tier: 1,
    totalRounds: 34,
    relegationSpots: 2
  },

  // ==========================================
  // FRANÇA 🇫🇷 (1ª Divisão)
  // ==========================================
  'ligue_1': {
    id: 'ligue_1',
    name: 'Ligue 1 McDonald\'s',
    shortName: 'Ligue 1',
    country: 'França',
    countryFlag: '🇫🇷',
    tier: 1,
    totalRounds: 34,
    relegationSpots: 3
  },

  // ==========================================
  // PORTUGAL 🇵🇹 (1ª Divisão)
  // ==========================================
  'primeira_liga': {
    id: 'primeira_liga',
    name: 'Liga Portugal Betclic',
    shortName: 'Liga Portugal',
    country: 'Portugal',
    countryFlag: '🇵🇹',
    tier: 1,
    totalRounds: 34,
    relegationSpots: 2
  },

  // ==========================================
  // HOLANDA 🇳🇱 (1ª Divisão)
  // ==========================================
  'eredivisie': {
    id: 'eredivisie',
    name: 'Eredivisie',
    shortName: 'Eredivisie',
    country: 'Holanda',
    countryFlag: '🇳🇱',
    tier: 1,
    totalRounds: 34,
    relegationSpots: 2
  },

  // ==========================================
  // TURQUIA 🇹🇷 (1ª Divisão)
  // ==========================================
  'super_lig': {
    id: 'super_lig',
    name: 'Trendyol Süper Lig',
    shortName: 'Süper Lig',
    country: 'Turquia',
    countryFlag: '🇹🇷',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 4
  },

  // ==========================================
  // RÚSSIA 🇷🇺 (1ª Divisão)
  // ==========================================
  'russian_premier': {
    id: 'russian_premier',
    name: 'Russian Premier Liga',
    shortName: 'Premier Liga (RUS)',
    country: 'Rússia',
    countryFlag: '🇷🇺',
    tier: 1,
    totalRounds: 30,
    relegationSpots: 2
  },

  // ==========================================
  // ARÁBIA SAUDITA 🇸🇦 (1ª Divisão)
  // ==========================================
  'saudi_pro': {
    id: 'saudi_pro',
    name: 'Roshn Saudi League',
    shortName: 'Saudi League',
    country: 'Arábia Saudita',
    countryFlag: '🇸🇦',
    tier: 1,
    totalRounds: 34,
    relegationSpots: 3
  },

  // ==========================================
  // ARGENTINA 🇦🇷 (1ª Divisão)
  // ==========================================
  'liga_argentina': {
    id: 'liga_argentina',
    name: 'Liga Profesional Argentina',
    shortName: 'Liga Argentina',
    country: 'Argentina',
    countryFlag: '🇦🇷',
    tier: 1,
    totalRounds: 27,
    relegationSpots: 2
  },

  // ==========================================
  // ESCÓCIA 🏴󠁧󠁢󠁳󠁣󠁴󠁿 (1ª Divisão)
  // ==========================================
  'scottish_premiership': {
    id: 'scottish_premiership',
    name: 'Scottish Premiership',
    shortName: 'Premiership (ESC)',
    country: 'Escócia',
    countryFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    tier: 1,
    totalRounds: 38,
    relegationSpots: 2
  },

  // ==========================================
  // BÉLGICA 🇧🇪 (1ª Divisão)
  // ==========================================
  'pro_league_bel': {
    id: 'pro_league_bel',
    name: 'Jupiler Pro League',
    shortName: 'Pro League (BEL)',
    country: 'Bélgica',
    countryFlag: '🇧🇪',
    tier: 1,
    totalRounds: 30,
    relegationSpots: 2
  },

  // ==========================================
  // GRÉCIA 🇬🇷 (1ª Divisão)
  // ==========================================
  'super_league_gre': {
    id: 'super_league_gre',
    name: 'Stoiximan Super League Grécia',
    shortName: 'Super League (GRE)',
    country: 'Grécia',
    countryFlag: '🇬🇷',
    tier: 1,
    totalRounds: 26,
    relegationSpots: 2
  }
};
