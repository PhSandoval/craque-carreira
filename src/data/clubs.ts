import { Club, WorldTransferEvent } from '../types';
import { LEAGUES } from './leagues';

const RAW_CLUBS: Record<string, Club> = {
  // ==========================================
  // BRASIL 🇧🇷 - SÉRIE A
  // ==========================================
  'Flamengo': {
    id: 'flamengo',
    name: 'CR Flamengo',
    shortName: 'Flamengo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Maracanã',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 85.0,
    colors: { primary: '#dc2626', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Vasco', 'Fluminense', 'Botafogo', 'Palmeiras', 'Atlético-MG'],
    playStyle: 'Protagonismo total, imposição técnica e controle da posse',
    coachName: 'Filipe Luís',
    squad: [
      { id: 'fla_1', name: 'Agustín Rossi', position: 'GOL', ovr: 80, age: 29, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 7.0 },
      { id: 'fla_2', name: 'Guillermo Varela', position: 'LD', ovr: 76, age: 31, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 2.5 },
      { id: 'fla_3', name: 'Léo Ortiz', position: 'ZAG', ovr: 81, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 10.0 },
      { id: 'fla_4', name: 'Léo Pereira', position: 'ZAG', ovr: 80, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 7.5 },
      { id: 'fla_5', name: 'Ayrton Lucas', position: 'LE', ovr: 79, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0 },
      { id: 'fla_6', name: 'Erick Pulgar', position: 'VOL', ovr: 79, age: 30, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 6.0 },
      { id: 'fla_7', name: 'Nicolás De La Cruz', position: 'MC', ovr: 82, age: 27, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 18.0, isStar: true },
      { id: 'fla_8', name: 'Gerson', position: 'MC', ovr: 82, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 18.0, isStar: true },
      { id: 'fla_9', name: 'Giorgian De Arrascaeta', position: 'MEI', ovr: 84, age: 30, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 15.0, isStar: true },
      { id: 'fla_10', name: 'Luiz Araújo', position: 'PD', ovr: 78, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0 },
      { id: 'fla_11', name: 'Pedro', position: 'CA', ovr: 83, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 23.0, isStar: true },
      { id: 'fla_12', name: 'Bruno Henrique', position: 'PE', ovr: 79, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0 },
      { id: 'fla_13', name: 'Michael', position: 'PE', ovr: 78, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 7.0 },
      { id: 'fla_14', name: 'Gonzalo Plata', position: 'PD', ovr: 78, age: 24, nationality: 'Equador', flag: '🇪🇨', marketValueEur: 6.0 },
      { id: 'fla_15', name: 'Fabrício Bruno', position: 'ZAG', ovr: 79, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'fla_16', name: 'Wesley', position: 'LD', ovr: 77, age: 21, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 10.0 }
    ]
  },
  'Palmeiras': {
    id: 'palmeiras',
    name: 'SE Palmeiras',
    shortName: 'Palmeiras',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Allianz Parque',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 75.0,
    colors: { primary: '#15803d', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Corinthians', 'São Paulo', 'Santos', 'Flamengo'],
    playStyle: 'Intensidade física, tática pragmática e bola parada letal',
    coachName: 'Abel Ferreira',
    squad: [
      { id: 'pal_1', name: 'Weverton', position: 'GOL', ovr: 80, age: 36, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5 },
      { id: 'pal_2', name: 'Marcos Rocha', position: 'LD', ovr: 76, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'pal_3', name: 'Gustavo Gómez', position: 'ZAG', ovr: 82, age: 31, nationality: 'Paraguai', flag: '🇵🇾', marketValueEur: 8.5, isStar: true },
      { id: 'pal_4', name: 'Murilo', position: 'ZAG', ovr: 80, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 9.0 },
      { id: 'pal_5', name: 'Joaquín Piquerez', position: 'LE', ovr: 81, age: 26, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 13.0, isStar: true },
      { id: 'pal_6', name: 'Aníbal Moreno', position: 'VOL', ovr: 79, age: 25, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 10.0 },
      { id: 'pal_7', name: 'Richard Ríos', position: 'MC', ovr: 79, age: 24, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 12.0 },
      { id: 'pal_8', name: 'Raphael Veiga', position: 'MEI', ovr: 82, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 16.0, isStar: true },
      { id: 'pal_9', name: 'Estêvão', position: 'PD', ovr: 82, age: 17, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 45.0, isStar: true },
      { id: 'pal_10', name: 'Felipe Anderson', position: 'PE', ovr: 80, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0 },
      { id: 'pal_11', name: 'Flaco López', position: 'CA', ovr: 80, age: 23, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 14.0, isStar: true },
      { id: 'pal_12', name: 'Mayke', position: 'LD', ovr: 78, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0 },
      { id: 'pal_13', name: 'Zé Rafael', position: 'VOL', ovr: 78, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5 },
      { id: 'pal_14', name: 'Rony', position: 'CA', ovr: 77, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'pal_15', name: 'Dudu', position: 'PD', ovr: 78, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0 },
      { id: 'pal_16', name: 'Marcelo Lomba', position: 'GOL', ovr: 74, age: 37, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 }
    ]
  },
  'Botafogo': {
    id: 'botafogo',
    name: 'Botafogo FR',
    shortName: 'Botafogo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Escudo_Botafogo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Estádio Nilton Santos',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 60.0,
    colors: { primary: '#09090b', secondary: '#fafafa', text: '#ffffff' },
    rivalClubs: ['Flamengo', 'Fluminense', 'Vasco'],
    playStyle: 'Velocidade devastadora em transição e poderio físico',
    coachName: 'Artur Jorge',
    squad: [
      { id: 'bot_def', name: 'Alexander Barboza', position: 'ZAG', ovr: 79, age: 29, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 4.0 },
      { id: 'bot_1', name: 'John', position: 'GOL', ovr: 78, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5 },
      { id: 'bot_2', name: 'Marlon Freitas', position: 'VOL', ovr: 79, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'bot_3', name: 'Thiago Almada', position: 'MEI', ovr: 82, age: 23, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 27.0, isStar: true },
      { id: 'bot_4', name: 'Luiz Henrique', position: 'PD', ovr: 82, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 22.0, isStar: true },
      { id: 'bot_5', name: 'Igor Jesus', position: 'CA', ovr: 80, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 15.0, isStar: true }
    ]
  },
  'São Paulo': {
    id: 'sao_paulo',
    name: 'São Paulo FC',
    shortName: 'São Paulo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'MorumBIS',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 45.0,
    colors: { primary: '#ffffff', secondary: '#dc2626', text: '#000000' },
    rivalClubs: ['Palmeiras', 'Corinthians', 'Santos'],
    playStyle: 'Equilíbrio tático e controle de meio-campo',
    coachName: 'Luis Zubeldía',
    squad: [
      { id: 'spfc_1', name: 'Rafael', position: 'GOL', ovr: 78, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'spfc_2', name: 'Robert Arboleda', position: 'ZAG', ovr: 79, age: 33, nationality: 'Equador', flag: '🇪🇨', marketValueEur: 2.5 },
      { id: 'spfc_3', name: 'Lucas Moura', position: 'MEI', ovr: 81, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0, isStar: true },
      { id: 'spfc_4', name: 'Jonathan Calleri', position: 'CA', ovr: 80, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Corinthians': {
    id: 'corinthians',
    name: 'SC Corinthians Paulista',
    shortName: 'Corinthians',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Neo Química Arena',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 50.0,
    colors: { primary: '#18181b', secondary: '#f4f4f5', text: '#ffffff' },
    rivalClubs: ['Palmeiras', 'São Paulo', 'Santos'],
    playStyle: 'Empurrão incansável da Fiel e transições agressivas',
    coachName: 'Ramón Díaz',
    squad: [
      { id: 'cor_def', name: 'Félix Torres', position: 'ZAG', ovr: 77, age: 27, nationality: 'Equador', flag: '🇪🇨', marketValueEur: 6.0 },
      { id: 'cori_1', name: 'Hugo Souza', position: 'GOL', ovr: 78, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0 },
      { id: 'cori_2', name: 'Rodrigo Garro', position: 'MEI', ovr: 81, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 14.0, isStar: true },
      { id: 'cori_3', name: 'Memphis Depay', position: 'CA', ovr: 82, age: 30, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 10.0, isStar: true },
      { id: 'cori_4', name: 'Yuri Alberto', position: 'CA', ovr: 80, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 12.0, isStar: true }
    ]
  },
  'Atlético-MG': {
    id: 'atletico_mg',
    name: 'Clube Atlético Mineiro',
    shortName: 'Galo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Clube_Atl%C3%A9tico_Mineiro_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Arena MRV',
    prestige: 4,
    formation: '4-4-2',
    budgetEur: 42.0,
    colors: { primary: '#18181b', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Cruzeiro', 'Flamengo'],
    playStyle: 'Ataque vertical, pressão alta e finalização potente',
    coachName: 'Gabriel Milito',
    squad: [
      { id: 'cam_def', name: 'Junior Alonso', position: 'ZAG', ovr: 79, age: 31, nationality: 'Paraguai', flag: '🇵🇾', marketValueEur: 5.0 },
      { id: 'cam_1', name: 'Everson', position: 'GOL', ovr: 78, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'cam_2', name: 'Guilherme Arana', position: 'LE', ovr: 80, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 12.0, isStar: true },
      { id: 'cam_3', name: 'Gustavo Scarpa', position: 'MEI', ovr: 80, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 9.0, isStar: true },
      { id: 'cam_4', name: 'Paulinho', position: 'PE', ovr: 81, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 17.0, isStar: true },
      { id: 'cam_5', name: 'Hulk', position: 'CA', ovr: 82, age: 38, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Internacional': {
    id: 'internacional',
    name: 'SC Internacional',
    shortName: 'Inter',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Estádio Beira-Rio',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 38.0,
    colors: { primary: '#ef4444', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Grêmio'],
    playStyle: 'Posse de bola qualificada e intensidade no meio',
    coachName: 'Roger Machado',
    squad: [
      { id: 'int_def', name: 'Vitão', position: 'ZAG', ovr: 78, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 10.0 },
      { id: 'int_1', name: 'Sergio Rochet', position: 'GOL', ovr: 79, age: 31, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 4.0 },
      { id: 'int_2', name: 'Alan Patrick', position: 'MEI', ovr: 81, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0, isStar: true },
      { id: 'int_3', name: 'Rafael Borré', position: 'CA', ovr: 80, age: 29, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Grêmio': {
    id: 'gremio',
    name: 'Grêmio FBPA',
    shortName: 'Grêmio',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Gr%C3%AAmio_FBPA.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Arena do Grêmio',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#0ea5e9', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Internacional'],
    playStyle: 'Futebol copeiro, garra imortal e pressão de velocidade',
    coachName: 'Renato Portaluppi',
    squad: [
      { id: 'gre_def', name: 'Walter Kannemann', position: 'ZAG', ovr: 76, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5 },
      { id: 'gre_1', name: 'Agustín Marchesín', position: 'GOL', ovr: 77, age: 36, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.0 },
      { id: 'gre_2', name: 'Franco Cristaldo', position: 'MEI', ovr: 79, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 10.0, isStar: true },
      { id: 'gre_3', name: 'Martin Braithwaite', position: 'CA', ovr: 79, age: 33, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 3.5, isStar: true }
    ]
  },
  'Cruzeiro': {
    id: 'cruzeiro',
    name: 'Cruzeiro EC',
    shortName: 'Cruzeiro',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Mineirão',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 45.0,
    colors: { primary: '#1d4ed8', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Atlético-MG'],
    playStyle: 'Futebol relacional, posse curta e aproximações',
    coachName: 'Fernando Diniz',
    squad: [
      { id: 'cru_1', name: 'Cássio', position: 'GOL', ovr: 78, age: 37, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'cru_2', name: 'William', position: 'LD', ovr: 78, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'cru_3', name: 'Zé Ivaldo', position: 'ZAG', ovr: 76, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5 },
      { id: 'cru_4', name: 'João Marcelo', position: 'ZAG', ovr: 76, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5 },
      { id: 'cru_5', name: 'Marlon', position: 'LE', ovr: 77, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0 },
      { id: 'cru_6', name: 'Walace', position: 'VOL', ovr: 77, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.5 },
      { id: 'cru_7', name: 'Lucas Romero', position: 'VOL', ovr: 77, age: 30, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 4.0 },
      { id: 'cru_8', name: 'Matheus Pereira', position: 'MEI', ovr: 83, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 12.0, isStar: true },
      { id: 'cru_9', name: 'Álvaro Barreal', position: 'MEI', ovr: 78, age: 24, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 7.0 },
      { id: 'cru_10', name: 'Gabriel Veron', position: 'PD', ovr: 76, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'cru_11', name: 'Kaio Jorge', position: 'CA', ovr: 79, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0, isStar: true },
      { id: 'cru_12', name: 'Lautaro Díaz', position: 'PE', ovr: 76, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 4.5 },
      { id: 'cru_13', name: 'Lucas Silva', position: 'MC', ovr: 75, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'cru_14', name: 'Lucas Villalba', position: 'ZAG', ovr: 75, age: 30, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5 },
      { id: 'cru_15', name: 'Anderson', position: 'GOL', ovr: 73, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 }
    ]
  },

  // ==========================================
  // BRASIL 🇧🇷 - SÉRIE B
  // ==========================================
  'Grêmio Novorizontino': {
    id: 'novorizontino',
    name: 'Grêmio Novorizontino',
    shortName: 'Novorizontino',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/e/eb/Gremio_Novorizontino.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Estádio Jorge Ismael de Biasi (Jorjão)',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 4.5,
    colors: { primary: '#facc15', secondary: '#000000', text: '#000000' },
    rivalClubs: ['Mirassol', 'Ponte Preta', 'Botafogo-SP'],
    playStyle: 'Transição rápida e contra-ataques disciplinados',
    coachName: 'Eduardo Baptista',
    squad: [
      { id: 'novo_1', name: 'Jordi', position: 'GOL', ovr: 72, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'novo_airton', name: 'Airton', position: 'GOL', ovr: 68, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.3 },
      { id: 'novo_2', name: 'César Martins', position: 'ZAG', ovr: 71, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.7, isStar: true },
      { id: 'novo_patrick', name: 'Patrick', position: 'ZAG', ovr: 71, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'novo_luisao', name: 'Luisão', position: 'ZAG', ovr: 69, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 },
      { id: 'novo_rodrigo', name: 'Rodrigo Soares', position: 'LD', ovr: 70, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'novo_barcelos', name: 'Danilo Barcelos', position: 'LE', ovr: 70, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 },
      { id: 'novo_3', name: 'Marlon', position: 'VOL', ovr: 72, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.1, isStar: true },
      { id: 'novo_geovane', name: 'Geovane', position: 'VOL', ovr: 70, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.4 },
      { id: 'novo_farias', name: 'Willian Farias', position: 'MC', ovr: 71, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.4 },
      { id: 'novo_fabricio', name: 'Fabrício Daniel', position: 'MEI', ovr: 71, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 },
      { id: 'novo_waguininho', name: 'Waguininho', position: 'PE', ovr: 72, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.7, isStar: true },
      { id: 'novo_lucca', name: 'Lucca', position: 'PD', ovr: 70, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.4 },
      { id: 'novo_4', name: 'Neto Pessoa', position: 'CA', ovr: 72, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true },
      { id: 'novo_rodolfo', name: 'Rodolfo', position: 'CA', ovr: 70, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 }
    ]
  },
  'Santos': {
    id: 'santos',
    name: 'Santos FC',
    shortName: 'Santos',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Santos_Logo.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Vila Belmiro',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#ffffff', secondary: '#000000', text: '#000000' },
    rivalClubs: ['Palmeiras', 'Corinthians', 'São Paulo'],
    playStyle: 'DNA ofensivo, pontas dribladores e juventude',
    coachName: 'Fábio Carille',
    squad: [
      { id: 'san_1', name: 'Gabriel Brazão', position: 'GOL', ovr: 73, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'san_2', name: 'Gil', position: 'ZAG', ovr: 74, age: 37, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.4 },
      { id: 'san_3', name: 'Giuliano', position: 'MEI', ovr: 76, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2, isStar: true },
      { id: 'san_4', name: 'Guilherme', position: 'PE', ovr: 75, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.2 }
    ]
  },
  'Mirassol': {
    id: 'mirassol',
    name: 'Mirassol FC',
    shortName: 'Mirassol',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b2/Mirassol_FC.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Estádio Maião',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 5.0,
    colors: { primary: '#eab308', secondary: '#15803d', text: '#000000' },
    rivalClubs: ['Grêmio Novorizontino'],
    playStyle: 'Pressão alta e transição veloz',
    coachName: 'Mozart',
    squad: [
      { id: 'mir_def', name: 'Luiz Otávio', position: 'ZAG', ovr: 72, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'mir_1', name: 'Alex Muralha', position: 'GOL', ovr: 72, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.3 },
      { id: 'mir_2', name: 'Danielzinho', position: 'MC', ovr: 72, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2, isStar: true },
      { id: 'mir_3', name: 'Dellatorre', position: 'CA', ovr: 73, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true }
    ]
  },
  'Sport Recife': {
    id: 'sport',
    name: 'Sport Club do Recife',
    shortName: 'Sport',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Ilha do Retiro',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 9.0,
    colors: { primary: '#dc2626', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Ceará', 'Coritiba'],
    playStyle: 'Força da torcida na Ilha e bolas paradas',
    coachName: 'Pepa',
    squad: [
      { id: 'spo_def', name: 'Rafael Thyere', position: 'ZAG', ovr: 73, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'spo_1', name: 'Caíque França', position: 'GOL', ovr: 73, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'spo_2', name: 'Lucas Lima', position: 'MEI', ovr: 75, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true },
      { id: 'spo_3', name: 'Gustavo Coutinho', position: 'CA', ovr: 74, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 }
    ]
  },
  'Coritiba': {
    id: 'coritiba',
    name: 'Coritiba FC',
    shortName: 'Coritiba',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Coritiba_FBC_%282011%29_-_PR.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Couto Pereira',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 8.5,
    colors: { primary: '#15803d', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Sport Recife'],
    playStyle: 'Jogo vertical e contra-ataques rápidos',
    coachName: 'Jorginho',
    squad: [
      { id: 'cori_def', name: 'Maurício Antônio', position: 'ZAG', ovr: 72, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 },
      { id: 'cor_1', name: 'Pedro Morisco', position: 'GOL', ovr: 73, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5, isStar: true },
      { id: 'cor_2', name: 'Matheus Frizzo', position: 'MEI', ovr: 73, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Ceará': {
    id: 'ceara',
    name: 'Ceará SC',
    shortName: 'Ceará',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Cear%C3%A1_Sporting_Club_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Arena Castelão',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 7.5,
    colors: { primary: '#18181b', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Sport Recife'],
    playStyle: 'Velocidade nas pontas no Castelão',
    coachName: 'Léo Condé',
    squad: [
      { id: 'cea_1', name: 'Richard', position: 'GOL', ovr: 73, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'cea_def', name: 'David Ricardo', position: 'ZAG', ovr: 74, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'cea_2', name: 'Erick Pulga', position: 'PE', ovr: 76, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5, isStar: true }
    ]
  },

  // ==========================================
  // INGLATERRA 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - PREMIER LEAGUE (1ª Divisão)
  // ==========================================
  'Manchester City': {
    id: 'man_city',
    name: 'Manchester City FC',
    shortName: 'Man City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Etihad Stadium',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 260.0,
    colors: { primary: '#38bdf8', secondary: '#ffffff', text: '#0f172a' },
    rivalClubs: ['Arsenal', 'Liverpool', 'Manchester United'],
    playStyle: 'Controle posicional absoluto e pressão pós-perda',
    coachName: 'Pep Guardiola',
    squad: [
      { id: 'mci_1', name: 'Ederson', position: 'GOL', ovr: 88, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 35.0 },
      { id: 'mci_2', name: 'Rúben Dias', position: 'ZAG', ovr: 88, age: 27, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 80.0, isStar: true },
      { id: 'mci_3', name: 'Rodri', position: 'VOL', ovr: 91, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 130.0, isStar: true },
      { id: 'mci_4', name: 'Kevin De Bruyne', position: 'MEI', ovr: 90, age: 33, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 45.0, isStar: true },
      { id: 'mci_5', name: 'Erling Haaland', position: 'CA', ovr: 91, age: 24, nationality: 'Noruega', flag: '🇳🇴', marketValueEur: 200.0, isStar: true }
    ]
  },
  'Arsenal': {
    id: 'arsenal',
    name: 'Arsenal FC',
    shortName: 'Arsenal',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Emirates Stadium',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 190.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Chelsea', 'Tottenham', 'Manchester City'],
    playStyle: 'Bolas paradas mortíferas e transições verticais',
    coachName: 'Mikel Arteta',
    squad: [
      { id: 'ars_1', name: 'David Raya', position: 'GOL', ovr: 85, age: 29, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 35.0 },
      { id: 'ars_2', name: 'William Saliba', position: 'ZAG', ovr: 88, age: 23, nationality: 'França', flag: '🇫🇷', marketValueEur: 80.0, isStar: true },
      { id: 'ars_3', name: 'Declan Rice', position: 'VOL', ovr: 88, age: 25, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 120.0, isStar: true },
      { id: 'ars_4', name: 'Bukayo Saka', position: 'PD', ovr: 88, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 140.0, isStar: true }
    ]
  },
  'Liverpool': {
    id: 'liverpool',
    name: 'Liverpool FC',
    shortName: 'Liverpool',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Anfield',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 200.0,
    colors: { primary: '#b91c1c', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Manchester City', 'Everton'],
    playStyle: 'Pressão alta em Anfield e transição supersônica',
    coachName: 'Arne Slot',
    squad: [
      { id: 'liv_1', name: 'Alisson Becker', position: 'GOL', ovr: 89, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 28.0 },
      { id: 'liv_2', name: 'Virgil van Dijk', position: 'ZAG', ovr: 89, age: 33, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 30.0, isStar: true },
      { id: 'liv_3', name: 'Mohamed Salah', position: 'PD', ovr: 89, age: 32, nationality: 'Egito', flag: '🇪🇬', marketValueEur: 55.0, isStar: true }
    ]
  },
  'Chelsea': {
    id: 'chelsea',
    name: 'Chelsea FC',
    shortName: 'Chelsea',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Stamford Bridge',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 210.0,
    colors: { primary: '#1d4ed8', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Arsenal'],
    playStyle: 'Juventude explosiva e talento de Cole Palmer',
    coachName: 'Enzo Maresca',
    squad: [
      { id: 'che_def', name: 'Levi Colwill', position: 'ZAG', ovr: 81, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 50.0 },
      { id: 'che_1', name: 'Robert Sánchez', position: 'GOL', ovr: 80, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 20.0 },
      { id: 'che_2', name: 'Cole Palmer', position: 'MEI', ovr: 87, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 90.0, isStar: true }
    ]
  },
  'Brighton': {
    id: 'brighton',
    name: 'Brighton & Hove Albion',
    shortName: 'Brighton',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Amex Stadium',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 75.0,
    colors: { primary: '#0284c7', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Crystal Palace'],
    playStyle: 'Lapidação de jovens talentos e saída construída',
    coachName: 'Fabian Hürzeler',
    squad: [
      { id: 'bha_def', name: 'Lewis Dunk', position: 'ZAG', ovr: 80, age: 32, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 12.0 },
      { id: 'bha_1', name: 'Bart Verbruggen', position: 'GOL', ovr: 80, age: 22, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 22.0 },
      { id: 'bha_2', name: 'Kaoru Mitoma', position: 'PE', ovr: 82, age: 27, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 45.0, isStar: true },
      { id: 'bha_3', name: 'João Pedro', position: 'CA', ovr: 81, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 50.0, isStar: true }
    ]
  },

  // ==========================================
  // INGLATERRA 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - CHAMPIONSHIP (2ª Divisão)
  // ==========================================
  'Leeds United': {
    id: 'leeds',
    name: 'Leeds United FC',
    shortName: 'Leeds',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._logo.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Elland Road',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#ffffff', secondary: '#1d4ed8', text: '#000000' },
    rivalClubs: ['Manchester United', 'Burnley'],
    playStyle: 'Pressão intensa e ritmo alucinante em Elland Road',
    coachName: 'Daniel Farke',
    squad: [
      { id: 'lee_1', name: 'Illan Meslier', position: 'GOL', ovr: 77, age: 24, nationality: 'França', flag: '🇫🇷', marketValueEur: 18.0 },
      { id: 'lee_2', name: 'Pascal Struijk', position: 'ZAG', ovr: 76, age: 25, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 15.0 },
      { id: 'lee_3', name: 'Wilfried Gnonto', position: 'PE', ovr: 77, age: 20, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 16.0, isStar: true },
      { id: 'lee_4', name: 'Joël Piroe', position: 'CA', ovr: 76, age: 25, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 12.0 }
    ]
  },
  'Leicester City': {
    id: 'leicester',
    name: 'Leicester City FC',
    shortName: 'Leicester',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'King Power Stadium',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 40.0,
    colors: { primary: '#1e3a8a', secondary: '#facc15', text: '#ffffff' },
    rivalClubs: ['Nottingham Forest', 'Leeds'],
    playStyle: 'Transição rápida com bola nas costas dos zagueiros',
    coachName: 'Steve Cooper',
    squad: [
      { id: 'lei_def', name: 'Wout Faes', position: 'ZAG', ovr: 78, age: 26, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 20.0 },
      { id: 'lei_1', name: 'Mads Hermansen', position: 'GOL', ovr: 78, age: 24, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 12.0 },
      { id: 'lei_2', name: 'Harry Winks', position: 'MC', ovr: 77, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 10.0 },
      { id: 'lei_3', name: 'Jamie Vardy', position: 'CA', ovr: 78, age: 37, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Sunderland': {
    id: 'sunderland',
    name: 'Sunderland AFC',
    shortName: 'Sunderland',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/77/Logo_Sunderland_AFC.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Stadium of Light',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Newcastle'],
    playStyle: 'Juventude ousada no Stadium of Light',
    coachName: 'Régis Le Bris',
    squad: [
      { id: 'sun_def', name: 'Dan Ballard', position: 'ZAG', ovr: 75, age: 24, nationality: 'Irlanda do Norte', flag: '🇬🇧', marketValueEur: 8.0 },
      { id: 'sun_1', name: 'Anthony Patterson', position: 'GOL', ovr: 76, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 10.0 },
      { id: 'sun_2', name: 'Jobe Bellingham', position: 'MC', ovr: 76, age: 19, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 12.0, isStar: true }
    ]
  },

  // ==========================================
  // ESPANHA 🇪🇸 - LA LIGA (1ª Divisão)
  // ==========================================
  'Real Madrid': {
    id: 'real_madrid',
    name: 'Real Madrid CF',
    shortName: 'Real Madrid',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Santiago Bernabéu',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 290.0,
    colors: { primary: '#ffffff', secondary: '#6366f1', text: '#000000' },
    rivalClubs: ['Barcelona', 'Atlético de Madrid'],
    playStyle: 'Mentalidade galáctica e contragolpes cirúrgicos',
    coachName: 'Carlo Ancelotti',
    squad: [
      { id: 'rma_def', name: 'Antonio Rüdiger', position: 'ZAG', ovr: 88, age: 31, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 25.0, isStar: true },
      { id: 'rma_1', name: 'Thibaut Courtois', position: 'GOL', ovr: 89, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 25.0 },
      { id: 'rma_2', name: 'Jude Bellingham', position: 'MEI', ovr: 90, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 180.0, isStar: true },
      { id: 'rma_3', name: 'Vinícius Júnior', position: 'PE', ovr: 90, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 200.0, isStar: true },
      { id: 'rma_4', name: 'Kylian Mbappé', position: 'CA', ovr: 91, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 180.0, isStar: true }
    ]
  },
  'Barcelona': {
    id: 'barcelona',
    name: 'FC Barcelona',
    shortName: 'Barça',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Camp Nou',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 170.0,
    colors: { primary: '#1e3a8a', secondary: '#991b1b', text: '#ffffff' },
    rivalClubs: ['Real Madrid', 'Espanyol'],
    playStyle: 'Pressão alta sufocante e tiki-taka vertical incisivo',
    coachName: 'Hansi Flick',
    squad: [
      { id: 'bar_gk', name: 'Marc-André ter Stegen', position: 'GOL', ovr: 88, age: 32, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 28.0 },
      { id: 'bar_def', name: 'Pau Cubarsí', position: 'ZAG', ovr: 82, age: 17, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 40.0 },
      { id: 'bar_1', name: 'Pedri', position: 'MC', ovr: 87, age: 21, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 80.0, isStar: true },
      { id: 'bar_2', name: 'Lamine Yamal', position: 'PD', ovr: 86, age: 17, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 150.0, isStar: true },
      { id: 'bar_3', name: 'Raphinha', position: 'PE', ovr: 86, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 60.0, isStar: true },
      { id: 'bar_4', name: 'Robert Lewandowski', position: 'CA', ovr: 88, age: 36, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Atlético de Madrid': {
    id: 'atletico_madrid',
    name: 'Atlético de Madrid',
    shortName: 'Atlético',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Metropolitano',
    prestige: 5,
    formation: '4-4-2',
    budgetEur: 120.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Real Madrid'],
    playStyle: 'Intensidade física de Simeone e contragolpe letal',
    coachName: 'Diego Simeone',
    squad: [
      { id: 'atm_def', name: 'José María Giménez', position: 'ZAG', ovr: 83, age: 29, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 22.0 },
      { id: 'atm_1', name: 'Jan Oblak', position: 'GOL', ovr: 88, age: 31, nationality: 'Eslovênia', flag: '🇸🇮', marketValueEur: 28.0 },
      { id: 'atm_2', name: 'Antoine Griezmann', position: 'MEI', ovr: 88, age: 33, nationality: 'França', flag: '🇫🇷', marketValueEur: 25.0, isStar: true },
      { id: 'atm_3', name: 'Julián Álvarez', position: 'CA', ovr: 87, age: 24, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 90.0, isStar: true }
    ]
  },
  'Athletic Bilbao': {
    id: 'athletic_bilbao',
    name: 'Athletic Club (Bilbao)',
    shortName: 'Athletic',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_Bilbao_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'San Mamés',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 65.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Real Sociedad'],
    playStyle: 'Garra basca e velocidade nas pontas',
    coachName: 'Ernesto Valverde',
    squad: [
      { id: 'ath_def', name: 'Dani Vivian', position: 'ZAG', ovr: 81, age: 25, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 30.0 },
      { id: 'ath_1', name: 'Unai Simón', position: 'GOL', ovr: 85, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 30.0 },
      { id: 'ath_2', name: 'Nico Williams', position: 'PE', ovr: 86, age: 22, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 70.0, isStar: true }
    ]
  },

  // ==========================================
  // ESPANHA 🇪🇸 - SEGUNDA DIVISIÓN (La Liga Hypermotion)
  // ==========================================
  'Real Zaragoza': {
    id: 'zaragoza',
    name: 'Real Zaragoza',
    shortName: 'Zaragoza',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/07/Real_Zaragoza_logo.svg',
    leagueId: 'segunda_division',
    league: 'La Liga Hypermotion (2ª Divisão)',
    country: 'Espanha',
    stadium: 'La Romareda',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 18.0,
    colors: { primary: '#1d4ed8', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Huesca'],
    playStyle: 'Tradiçãocopeira em La Romareda e disciplina tática',
    coachName: 'Víctor Fernández',
    squad: [
      { id: 'zar_def', name: 'Jair Amador', position: 'ZAG', ovr: 74, age: 34, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 0.8 },
      { id: 'zar_1', name: 'Gaëtan Poussin', position: 'GOL', ovr: 74, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.0 },
      { id: 'zar_2', name: 'Francho Serrano', position: 'MC', ovr: 75, age: 23, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.0, isStar: true },
      { id: 'zar_3', name: 'Soberón', position: 'CA', ovr: 74, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.5 }
    ]
  },
  'Deportivo La Coruña': {
    id: 'deportivo',
    name: 'RC Deportivo La Coruña',
    shortName: 'Deportivo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4e/RC_Deportivo_La_Coru%C3%B1a_logo.svg',
    leagueId: 'segunda_division',
    league: 'La Liga Hypermotion (2ª Divisão)',
    country: 'Espanha',
    stadium: 'Riazor',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 20.0,
    colors: { primary: '#1e3a8a', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Celta de Vigo'],
    playStyle: 'O retorno do Super Dépor com apoio ensurdecedor em Riazor',
    coachName: 'Óscar Gilsanz',
    squad: [
      { id: 'dep_def', name: 'Pablo Vázquez', position: 'ZAG', ovr: 74, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.0 },
      { id: 'dep_1', name: 'Helton Leite', position: 'GOL', ovr: 75, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'dep_2', name: 'Yeremay Hernández', position: 'PE', ovr: 76, age: 21, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 5.0, isStar: true },
      { id: 'dep_3', name: 'Lucas Pérez', position: 'CA', ovr: 76, age: 36, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.2, isStar: true }
    ]
  },

  // ==========================================
  // ITÁLIA 🇮🇹 - SERIE A (1ª Divisão)
  // ==========================================
  'Inter de Milão': {
    id: 'inter_milao',
    name: 'FC Internazionale Milano',
    shortName: 'Inter Milão',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'San Siro (Giuseppe Meazza)',
    prestige: 5,
    formation: '3-5-2',
    budgetEur: 180.0,
    colors: { primary: '#1e3a8a', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Milan', 'Juventus'],
    playStyle: 'Futebol moderno de Inzaghi, alas ofensivos e dupla mortal de ataque',
    coachName: 'Simone Inzaghi',
    squad: [
      { id: 'intm_def', name: 'Alessandro Bastoni', position: 'ZAG', ovr: 87, age: 25, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 70.0, isStar: true },
      { id: 'intm_1', name: 'Yann Sommer', position: 'GOL', ovr: 86, age: 35, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 5.0 },
      { id: 'intm_2', name: 'Nicolò Barella', position: 'MC', ovr: 87, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 80.0, isStar: true },
      { id: 'intm_3', name: 'Lautaro Martínez', position: 'CA', ovr: 89, age: 27, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 110.0, isStar: true },
      { id: 'intm_4', name: 'Marcus Thuram', position: 'CA', ovr: 85, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 65.0 }
    ]
  },
  'Atalanta': {
    id: 'atalanta',
    name: 'Atalanta BC',
    shortName: 'Atalanta',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/66/AtalantaBC.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Gewiss Stadium (Bérgamo)',
    prestige: 4,
    formation: '3-5-2',
    budgetEur: 70.0,
    colors: { primary: '#1d4ed8', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Brescia', 'Inter de Milão', 'Milan'],
    playStyle: 'Pressão homem a homem implacável de Gasperini e alas avassaladores',
    coachName: 'Gian Piero Gasperini',
    squad: [
      { id: 'ata_1', name: 'Marco Carnesecchi', position: 'GOL', ovr: 83, age: 24, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 25.0 },
      { id: 'ata_2', name: 'Giorgio Scalvini', position: 'ZAG', ovr: 84, age: 21, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 45.0, isStar: true },
      { id: 'ata_3', name: 'Isak Hien', position: 'ZAG', ovr: 81, age: 25, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 20.0 },
      { id: 'ata_4', name: 'Matteo Ruggeri', position: 'LE', ovr: 81, age: 22, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 22.0 },
      { id: 'ata_5', name: 'Davide Zappacosta', position: 'LD', ovr: 80, age: 32, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 8.0 },
      { id: 'ata_6', name: 'Éderson', position: 'VOL', ovr: 83, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 40.0, isStar: true },
      { id: 'ata_7', name: 'Marten de Roon', position: 'VOL', ovr: 82, age: 33, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 10.0 },
      { id: 'ata_8', name: 'Charles De Ketelaere', position: 'MEI', ovr: 83, age: 23, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 35.0, isStar: true },
      { id: 'ata_9', name: 'Ademola Lookman', position: 'CA', ovr: 85, age: 27, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 45.0, isStar: true },
      { id: 'ata_10', name: 'Mateo Retegui', position: 'CA', ovr: 82, age: 25, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 30.0 }
    ]
  },
  'Juventus': {
    id: 'juventus',
    name: 'Juventus FC',
    shortName: 'Juventus',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Allianz Stadium (Turim)',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 150.0,
    colors: { primary: '#18181b', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Inter de Milão', 'Torino'],
    playStyle: 'Organização tática sob comando de Thiago Motta e juventude',
    coachName: 'Thiago Motta',
    squad: [
      { id: 'juv_def', name: 'Bremer', position: 'ZAG', ovr: 86, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 60.0, isStar: true },
      { id: 'juv_1', name: 'Michele Di Gregorio', position: 'GOL', ovr: 84, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 25.0 },
      { id: 'juv_2', name: 'Teun Koopmeiners', position: 'MEI', ovr: 86, age: 26, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 55.0, isStar: true },
      { id: 'juv_3', name: 'Kenan Yıldız', position: 'PE', ovr: 81, age: 19, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 40.0, isStar: true },
      { id: 'juv_4', name: 'Dušan Vlahović', position: 'CA', ovr: 85, age: 24, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 65.0 }
    ]
  },
  'AC Milan': {
    id: 'milan',
    name: 'AC Milan',
    shortName: 'Milan',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'San Siro',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 140.0,
    colors: { primary: '#dc2626', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Inter de Milão'],
    playStyle: 'Velocidade avassaladora de Rafael Leão e transições rápidas',
    coachName: 'Paulo Fonseca',
    squad: [
      { id: 'mil_def', name: 'Fikayo Tomori', position: 'ZAG', ovr: 83, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 40.0 },
      { id: 'mil_1', name: 'Mike Maignan', position: 'GOL', ovr: 87, age: 29, nationality: 'França', flag: '🇫🇷', marketValueEur: 40.0 },
      { id: 'mil_2', name: 'Christian Pulisic', position: 'PD', ovr: 84, age: 26, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 45.0 },
      { id: 'mil_3', name: 'Rafael Leão', position: 'PE', ovr: 87, age: 25, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 90.0, isStar: true },
      { id: 'mil_4', name: 'Álvaro Morata', position: 'CA', ovr: 83, age: 32, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 16.0 }
    ]
  },

  // ==========================================
  // ITÁLIA 🇮🇹 - SERIE B (2ª Divisão)
  // ==========================================
  'Sampdoria': {
    id: 'sampdoria',
    name: 'UC Sampdoria',
    shortName: 'Sampdoria',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d2/U.C._Sampdoria_logo.svg',
    leagueId: 'serie_b_ita',
    league: 'Serie B (Itália)',
    country: 'Itália',
    stadium: 'Stadio Luigi Ferraris',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 22.0,
    colors: { primary: '#2563eb', secondary: '#dc2626', text: '#ffffff' },
    rivalClubs: ['Genoa'],
    playStyle: 'Pressão histórica da torcida no Luigi Ferraris',
    coachName: 'Andrea Sottil',
    squad: [
      { id: 'sam_def', name: 'Alex Ferrari', position: 'ZAG', ovr: 74, age: 30, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 1.2 },
      { id: 'sam_1', name: 'Marco Silvestri', position: 'GOL', ovr: 76, age: 33, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 2.0 },
      { id: 'sam_2', name: 'Gennaro Tutino', position: 'CA', ovr: 76, age: 28, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 4.5, isStar: true },
      { id: 'sam_3', name: 'Massimo Coda', position: 'CA', ovr: 75, age: 36, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 1.0 }
    ]
  },
  'Sassuolo': {
    id: 'sassuolo',
    name: 'US Sassuolo Calcio',
    shortName: 'Sassuolo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/US_Sassuolo_Calcio_logo.svg',
    leagueId: 'serie_b_ita',
    league: 'Serie B (Itália)',
    country: 'Itália',
    stadium: 'Mapei Stadium',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#15803d', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Bologna'],
    playStyle: 'Ataque prolífico liderado pelo craque Domenico Berardi',
    coachName: 'Fabio Grosso',
    squad: [
      { id: 'sas_gk', name: 'Giacomo Satalino', position: 'GOL', ovr: 73, age: 25, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 1.0 },
      { id: 'sas_def', name: 'Filippo Romagna', position: 'ZAG', ovr: 75, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 2.0 },
      { id: 'sas_1', name: 'Domenico Berardi', position: 'PD', ovr: 82, age: 30, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 12.0, isStar: true },
      { id: 'sas_2', name: 'Armand Laurienté', position: 'PE', ovr: 78, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 14.0, isStar: true },
      { id: 'sas_3', name: 'Samuele Mulattieri', position: 'CA', ovr: 74, age: 24, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 4.0 }
    ]
  },

  // ==========================================
  // ALEMANHA 🇩🇪 - BUNDESLIGA (1ª Divisão)
  // ==========================================
  'Bayern de Munique': {
    id: 'bayern',
    name: 'FC Bayern München',
    shortName: 'Bayern',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Allianz Arena',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 260.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Borussia Dortmund'],
    playStyle: 'Dominância física, pressão asfixiante e letalidade de Harry Kane',
    coachName: 'Vincent Kompany',
    squad: [
      { id: 'bay_def', name: 'Dayot Upamecano', position: 'ZAG', ovr: 85, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 50.0 },
      { id: 'bay_1', name: 'Manuel Neuer', position: 'GOL', ovr: 87, age: 38, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 5.0 },
      { id: 'bay_2', name: 'Joshua Kimmich', position: 'MC', ovr: 88, age: 29, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 50.0, isStar: true },
      { id: 'bay_3', name: 'Jamal Musiala', position: 'MEI', ovr: 88, age: 21, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 130.0, isStar: true },
      { id: 'bay_4', name: 'Harry Kane', position: 'CA', ovr: 90, age: 31, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 100.0, isStar: true }
    ]
  },
  'Borussia Dortmund': {
    id: 'dortmund',
    name: 'Borussia Dortmund',
    shortName: 'Dortmund',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Signal Iduna Park',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 160.0,
    colors: { primary: '#facc15', secondary: '#000000', text: '#000000' },
    rivalClubs: ['Bayern de Munique', 'Schalke 04'],
    playStyle: 'A Muralha Amarela, transições supersônicas e revelação de craques',
    coachName: 'Nuri Şahin',
    squad: [
      { id: 'bvb_def', name: 'Nico Schlotterbeck', position: 'ZAG', ovr: 85, age: 24, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 40.0 },
      { id: 'bvb_1', name: 'Gregor Kobel', position: 'GOL', ovr: 87, age: 26, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 40.0 },
      { id: 'bvb_2', name: 'Julian Brandt', position: 'MEI', ovr: 84, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 40.0, isStar: true },
      { id: 'bvb_3', name: 'Serhou Guirassy', position: 'CA', ovr: 84, age: 28, nationality: 'Guiné', flag: '🇬🇳', marketValueEur: 45.0, isStar: true }
    ]
  },
  'Bayer Leverkusen': {
    id: 'leverkusen',
    name: 'Bayer 04 Leverkusen',
    shortName: 'Leverkusen',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'BayArena',
    prestige: 5,
    formation: '3-4-3',
    budgetEur: 140.0,
    colors: { primary: '#dc2626', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Köln'],
    playStyle: 'Futebol mágico e invicto de Xabi Alonso, alas letais e toque veloz',
    coachName: 'Xabi Alonso',
    squad: [
      { id: 'b04_def', name: 'Jonathan Tah', position: 'ZAG', ovr: 86, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 30.0, isStar: true },
      { id: 'b04_1', name: 'Lukáš Hrádecký', position: 'GOL', ovr: 84, age: 34, nationality: 'Finlândia', flag: '🇫🇮', marketValueEur: 3.0 },
      { id: 'b04_2', name: 'Granit Xhaka', position: 'VOL', ovr: 86, age: 32, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 20.0 },
      { id: 'b04_3', name: 'Florian Wirtz', position: 'MEI', ovr: 89, age: 21, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 130.0, isStar: true },
      { id: 'b04_4', name: 'Victor Boniface', position: 'CA', ovr: 83, age: 23, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 45.0 }
    ]
  },

  // ==========================================
  // ALEMANHA 🇩🇪 - 2. BUNDESLIGA (2ª Divisão)
  // ==========================================
  'Schalke 04': {
    id: 'schalke',
    name: 'FC Schalke 04',
    shortName: 'Schalke 04',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/FC_Schalke_04_Logo.svg',
    leagueId: '2_bundesliga',
    league: '2. Bundesliga',
    country: 'Alemanha',
    stadium: 'Veltins-Arena',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 28.0,
    colors: { primary: '#1d4ed8', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Borussia Dortmund'],
    playStyle: 'Empurrão de 60 mil fiéis na Veltins-Arena e luta pelo retorno',
    coachName: 'Kees van Wonderen',
    squad: [
      { id: 's04_def', name: 'Marcin Kamiński', position: 'ZAG', ovr: 73, age: 32, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 0.8 },
      { id: 's04_1', name: 'Justin Heekeren', position: 'GOL', ovr: 72, age: 23, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 1.5 },
      { id: 's04_2', name: 'Kenan Karaman', position: 'CA', ovr: 77, age: 30, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 3.5, isStar: true },
      { id: 's04_3', name: 'Moussa Sylla', position: 'CA', ovr: 75, age: 24, nationality: 'Mali', flag: '🇲🇱', marketValueEur: 4.0 }
    ]
  },
  'Hamburgo': {
    id: 'hsv',
    name: 'Hamburger SV',
    shortName: 'Hamburgo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/66/HSV-Logo.svg',
    leagueId: '2_bundesliga',
    league: '2. Bundesliga',
    country: 'Alemanha',
    stadium: 'Volksparkstadion',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 30.0,
    colors: { primary: '#1e3a8a', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['St. Pauli', 'Werder Bremen'],
    playStyle: 'Pressão da tradição alemã no Volksparkstadion',
    coachName: 'Steffen Baumgart',
    squad: [
      { id: 'hsv_def', name: 'Sebastian Schonlau', position: 'ZAG', ovr: 75, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 1.5 },
      { id: 'hsv_1', name: 'Daniel Heuer Fernandes', position: 'GOL', ovr: 75, age: 32, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 2.0 },
      { id: 'hsv_2', name: 'Ludovit Reis', position: 'MC', ovr: 76, age: 24, nationality: 'Países Baixos', flag: '🇳🇱', marketValueEur: 5.0, isStar: true },
      { id: 'hsv_3', name: 'Robert Glatzel', position: 'CA', ovr: 77, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 3.0, isStar: true }
    ]
  },

  // ==========================================
  // FRANÇA 🇫🇷 - LIGUE 1 (1ª Divisão)
  // ==========================================
  'Paris Saint-Germain': {
    id: 'psg',
    name: 'Paris Saint-Germain',
    shortName: 'PSG',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Parc des Princes',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 240.0,
    colors: { primary: '#1e3a8a', secondary: '#dc2626', text: '#ffffff' },
    rivalClubs: ['Marseille'],
    playStyle: 'Pressão asfixiante de Luis Enrique e pontas imprevisíveis',
    coachName: 'Luis Enrique',
    squad: [
      { id: 'psg_def', name: 'Marquinhos', position: 'ZAG', ovr: 87, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 50.0, isStar: true },
      { id: 'psg_1', name: 'Gianluigi Donnarumma', position: 'GOL', ovr: 88, age: 25, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 40.0 },
      { id: 'psg_2', name: 'Vitinha', position: 'MC', ovr: 86, age: 24, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 55.0, isStar: true },
      { id: 'psg_3', name: 'Ousmane Dembélé', position: 'PD', ovr: 86, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 60.0, isStar: true },
      { id: 'psg_4', name: 'Bradley Barcola', position: 'PE', ovr: 84, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 65.0, isStar: true }
    ]
  },
  'Olympique de Marseille': {
    id: 'marseille',
    name: 'Olympique de Marseille',
    shortName: 'Marseille',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Olympique_Marseille_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Vélodrome',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 80.0,
    colors: { primary: '#38bdf8', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ['PSG'],
    playStyle: 'Pressão passional e intensa de De Zerbi no Vélodrome',
    coachName: 'Roberto De Zerbi',
    squad: [
      { id: 'om_def', name: 'Leonardo Balerdi', position: 'ZAG', ovr: 80, age: 25, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 20.0 },
      { id: 'om_1', name: 'Gerónimo Rulli', position: 'GOL', ovr: 81, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 5.0 },
      { id: 'om_2', name: 'Pierre-Emile Højbjerg', position: 'VOL', ovr: 83, age: 29, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 20.0 },
      { id: 'om_3', name: 'Mason Greenwood', position: 'PD', ovr: 83, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 35.0, isStar: true }
    ]
  },

  // ==========================================
  // FRANÇA 🇫🇷 - LIGUE 2 (2ª Divisão)
  // ==========================================
  'FC Metz': {
    id: 'metz',
    name: 'FC Metz',
    shortName: 'Metz',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/FC_Metz_logo_2021.svg',
    leagueId: 'ligue_2',
    league: 'Ligue 2',
    country: 'França',
    stadium: 'Stade Saint-Symphorien',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 16.0,
    colors: { primary: '#881337', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Nancy'],
    playStyle: 'Solidez física e transição rápida',
    coachName: 'Stéphane Le Mignan',
    squad: [
      { id: 'met_def', name: 'Fali Candé', position: 'ZAG', ovr: 74, age: 26, nationality: 'Guiné-Bissau', flag: '🇬🇼', marketValueEur: 2.0 },
      { id: 'met_1', name: 'Alexandre Oukidja', position: 'GOL', ovr: 74, age: 36, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 1.0 },
      { id: 'met_2', name: 'Gauthier Hein', position: 'MEI', ovr: 76, age: 28, nationality: 'França', flag: '🇫🇷', marketValueEur: 3.5, isStar: true },
      { id: 'met_3', name: 'Cheikh Sabaly', position: 'PE', ovr: 75, age: 25, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 2.5 }
    ]
  },
  'Paris FC': {
    id: 'paris_fc',
    name: 'Paris FC',
    shortName: 'Paris FC',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Paris_FC_logo.svg',
    leagueId: 'ligue_2',
    league: 'Ligue 2',
    country: 'França',
    stadium: 'Stade Charléty (Paris)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#1e3a8a', secondary: '#0284c7', text: '#ffffff' },
    rivalClubs: ['Red Star', 'PSG'],
    playStyle: 'Projeto ambicioso com controle técnico da posse',
    coachName: 'Stéphane Gilli',
    squad: [
      { id: 'pfc_def', name: 'Moustapha Mbow', position: 'ZAG', ovr: 74, age: 24, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 2.5 },
      { id: 'pfc_1', name: 'Obed Nkambadio', position: 'GOL', ovr: 73, age: 21, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.0 },
      { id: 'pfc_2', name: 'Maxime Lopez', position: 'MC', ovr: 76, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 4.0, isStar: true },
      { id: 'pfc_3', name: 'Jean-Philippe Krasso', position: 'CA', ovr: 75, age: 27, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 3.5 }
    ]
  },

  // ==========================================
  // PORTUGAL 🇵🇹 - PRIMEIRA LIGA (1ª Divisão)
  // ==========================================
  'Benfica': {
    id: 'benfica',
    name: 'SL Benfica',
    shortName: 'Benfica',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio da Luz',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 95.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Sporting CP', 'Porto'],
    playStyle: 'Ataque avassalador no Estádio da Luz e fábrica de joias',
    coachName: 'Bruno Lage',
    squad: [
      { id: 'ben_def', name: 'Nicolás Otamendi', position: 'ZAG', ovr: 81, age: 36, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.0 },
      { id: 'slb_1', name: 'Anatoliy Trubin', position: 'GOL', ovr: 83, age: 23, nationality: 'Ucrânia', flag: '🇺🇦', marketValueEur: 25.0 },
      { id: 'slb_2', name: 'Orkun Kökçü', position: 'MC', ovr: 83, age: 23, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 28.0 },
      { id: 'slb_3', name: 'Ángel Di María', position: 'PD', ovr: 83, age: 36, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 3.0, isStar: true },
      { id: 'slb_4', name: 'Kerem Aktürkoğlu', position: 'PE', ovr: 82, age: 26, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 18.0 }
    ]
  },
  'Sporting CP': {
    id: 'sporting',
    name: 'Sporting CP',
    shortName: 'Sporting',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Sporting_Clube_de_Portugal_%28Logo%29.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio José Alvalade',
    prestige: 5,
    formation: '3-4-3',
    budgetEur: 90.0,
    colors: { primary: '#15803d', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Benfica', 'Porto'],
    playStyle: 'Intensidade tática e a letalidade de Viktor Gyökeres',
    coachName: 'João Pereira',
    squad: [
      { id: 'scp_def', name: 'Gonçalo Inácio', position: 'ZAG', ovr: 84, age: 23, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 45.0, isStar: true },
      { id: 'scp_1', name: 'Franco Israel', position: 'GOL', ovr: 79, age: 24, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 5.0 },
      { id: 'scp_2', name: 'Morten Hjulmand', position: 'VOL', ovr: 83, age: 25, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 40.0 },
      { id: 'scp_3', name: 'Francisco Trincão', position: 'PD', ovr: 82, age: 24, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 23.0 },
      { id: 'scp_4', name: 'Viktor Gyökeres', position: 'CA', ovr: 87, age: 26, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 70.0, isStar: true }
    ]
  },

  // ==========================================
  // PORTUGAL 🇵🇹 - LIGA PORTUGAL 2 (2ª Divisão)
  // ==========================================
  'Marítimo': {
    id: 'maritimo',
    name: 'CS Marítimo',
    shortName: 'Marítimo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/CS_Mar%C3%ADtimo_logo.svg',
    leagueId: 'segunda_liga_por',
    league: 'Liga Portugal 2',
    country: 'Portugal',
    stadium: 'Estádio do Marítimo (Madeira)',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 12.0,
    colors: { primary: '#15803d', secondary: '#dc2626', text: '#ffffff' },
    rivalClubs: ['Nacional'],
    playStyle: 'Força insular na Ilha da Madeira e bolas paradas',
    coachName: 'Jorge Silas',
    squad: [
      { id: 'mar_def', name: 'Zainadine Júnior', position: 'ZAG', ovr: 72, age: 36, nationality: 'Moçambique', flag: '🇲🇿', marketValueEur: 0.3 },
      { id: 'mar_1', name: 'Samú Silva', position: 'GOL', ovr: 72, age: 25, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 0.8 },
      { id: 'mar_2', name: 'Euller', position: 'PE', ovr: 73, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2, isStar: true }
    ]
  },
  'Paços de Ferreira': {
    id: 'pacos_ferreira',
    name: 'FC Paços de Ferreira',
    shortName: 'Paços',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/F.C._Pa%C3%A7os_de_Ferreira_logo.svg',
    leagueId: 'segunda_liga_por',
    league: 'Liga Portugal 2',
    country: 'Portugal',
    stadium: 'Estádio Capital do Móvel',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 10.0,
    colors: { primary: '#facc15', secondary: '#15803d', text: '#000000' },
    rivalClubs: ['Freamunde'],
    playStyle: 'Organização tática e disciplina defensiva',
    coachName: 'Ricardo Silva',
    squad: [
      { id: 'pac_def', name: 'Erick Ferigra', position: 'ZAG', ovr: 72, age: 25, nationality: 'Equador', flag: '🇪🇨', marketValueEur: 0.8 },
      { id: 'pac_1', name: 'Marafona', position: 'GOL', ovr: 73, age: 37, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 0.3 },
      { id: 'pac_2', name: 'Rui Fonte', position: 'CA', ovr: 73, age: 34, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 0.4, isStar: true }
    ]
  },

  // ==========================================
  // ARGENTINA 🇦🇷 - LIGA PROFESIONAL (1ª Divisão)
  // ==========================================
  'River Plate': {
    id: 'river_plate',
    name: 'CA River Plate',
    shortName: 'River Plate',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_del_C_A_River_Plate.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Estadio Mâs Monumental',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 65.0,
    colors: { primary: '#ffffff', secondary: '#dc2626', text: '#000000' },
    rivalClubs: ['Boca Juniors'],
    playStyle: 'Pressão infernal no Monumental de Gallardo e toque refinado',
    coachName: 'Marcelo Gallardo',
    squad: [
      { id: 'riv_1', name: 'Franco Armani', position: 'GOL', ovr: 79, age: 38, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.2 },
      { id: 'riv_2', name: 'Germán Pezzella', position: 'ZAG', ovr: 79, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 3.0 },
      { id: 'riv_3', name: 'Marcos Acuña', position: 'LE', ovr: 80, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 4.0 },
      { id: 'riv_4', name: 'Claudio Echeverri', position: 'MEI', ovr: 78, age: 18, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 18.0, isStar: true },
      { id: 'riv_5', name: 'Miguel Borja', position: 'CA', ovr: 80, age: 31, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Boca Juniors': {
    id: 'boca_juniors',
    name: 'CA Boca Juniors',
    shortName: 'Boca Juniors',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/41/CABJ_escudo.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'La Bombonera',
    prestige: 5,
    formation: '4-4-2',
    budgetEur: 60.0,
    colors: { primary: '#1d4ed8', secondary: '#facc15', text: '#ffffff' },
    rivalClubs: ['River Plate'],
    playStyle: 'Mística copera, raça xeneize que faz La Bombonera tremer',
    coachName: 'Fernando Gago',
    squad: [
      { id: 'boc_1', name: 'Sergio Romero', position: 'GOL', ovr: 78, age: 37, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.8 },
      { id: 'boc_2', name: 'Marcos Rojo', position: 'ZAG', ovr: 78, age: 34, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5 },
      { id: 'boc_3', name: 'Cristian Medina', position: 'MC', ovr: 80, age: 22, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 13.0, isStar: true },
      { id: 'boc_4', name: 'Edinson Cavani', position: 'CA', ovr: 80, age: 37, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 1.0, isStar: true },
      { id: 'boc_5', name: 'Miguel Merentiel', position: 'CA', ovr: 79, age: 28, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 7.0 }
    ]
  },

  // ==========================================
  // ARGENTINA 🇦🇷 - PRIMERA NACIONAL (2ª Divisão)
  // ==========================================
  'Colón de Santa Fe': {
    id: 'colon',
    name: 'CA Colón de Santa Fe',
    shortName: 'Colón',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Escudo_del_Club_Atl%C3%A9tico_Col%C3%B3n.svg',
    leagueId: 'primera_nacional',
    league: 'Primera Nacional (2ª Divisão)',
    country: 'Argentina',
    stadium: 'Estadio Brigadier General Estanislao López (Cemitério de Elefantes)',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 14.0,
    colors: { primary: '#dc2626', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Unión de Santa Fe'],
    playStyle: 'Garra santafesina no Cemitério de Elefantes',
    coachName: 'Diego Osella',
    squad: [
      { id: 'col_def', name: 'Paolo Goltz', position: 'ZAG', ovr: 73, age: 39, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.2 },
      { id: 'col_1', name: 'Manuel Vicentini', position: 'GOL', ovr: 73, age: 34, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.5 },
      { id: 'col_2', name: 'Sebastián Prediger', position: 'VOL', ovr: 74, age: 38, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.3 },
      { id: 'col_3', name: 'Javier Toledo', position: 'CA', ovr: 73, age: 38, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.2, isStar: true }
    ]
  },
  'Quilmes': {
    id: 'quilmes',
    name: 'Quilmes AC',
    shortName: 'Quilmes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escudo_del_Quilmes_Atl%C3%A9tico_Club.svg',
    leagueId: 'primera_nacional',
    league: 'Primera Nacional (2ª Divisão)',
    country: 'Argentina',
    stadium: 'Estadio Centenario Ciudad de Quilmes',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 11.0,
    colors: { primary: '#1e3a8a', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Argentino de Quilmes', 'Lanús'],
    playStyle: 'Futebol aguerrido argentino com pressão alta',
    coachName: 'Darío Franco',
    squad: [
      { id: 'qui_def', name: 'Federico Tévez', position: 'ZAG', ovr: 72, age: 24, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.5 },
      { id: 'qui_1', name: 'Esteban Glellel', position: 'GOL', ovr: 72, age: 25, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.6 },
      { id: 'qui_2', name: 'Federico Anselmo', position: 'CA', ovr: 73, age: 30, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.5, isStar: true }
    ]
  },
  // ==========================================
  // BRASIL 🇧🇷 - NOVOS GIGANTES & SÉRIE B
  // ==========================================
  'Vasco da Gama': {
    id: 'vasco',
    name: 'CR Vasco da Gama',
    shortName: 'Vasco',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Vasco_da_Gama_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'São Januário',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 42.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Flamengo', 'Fluminense', 'Botafogo'],
    playStyle: 'Pressão da torcida em São Januário, bolas alçadas e talento individual',
    coachName: 'Rafael Paiva',
    squad: [
      { id: 'vas_1', name: 'Léo Jardim', position: 'GOL', ovr: 79, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5 },
      { id: 'vas_2', name: 'João Victor', position: 'ZAG', ovr: 77, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0 },
      { id: 'vas_3', name: 'Hugo Moura', position: 'VOL', ovr: 76, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5 },
      { id: 'vas_4', name: 'Philippe Coutinho', position: 'MEI', ovr: 81, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 7.5, isStar: true },
      { id: 'vas_5', name: 'Dimitri Payet', position: 'MEI', ovr: 79, age: 37, nationality: 'França', flag: '🇫🇷', marketValueEur: 1.5, isStar: true },
      { id: 'vas_6', name: 'Pablo Vegetti', position: 'CA', ovr: 79, age: 35, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Fluminense': {
    id: 'fluminense',
    name: 'Fluminense FC',
    shortName: 'Fluminense',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Fluminense_FC_escudo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Maracanã',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#800020', secondary: '#006400', text: '#ffffff' },
    rivalClubs: ['Flamengo', 'Vasco', 'Botafogo'],
    playStyle: 'Posse de bola refinada, experiência e construção cadenciada',
    coachName: 'Mano Menezes',
    squad: [
      { id: 'flu_1', name: 'Fábio', position: 'GOL', ovr: 78, age: 43, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.3 },
      { id: 'flu_2', name: 'Thiago Silva', position: 'ZAG', ovr: 82, age: 39, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0, isStar: true },
      { id: 'flu_3', name: 'Martinelli', position: 'VOL', ovr: 78, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 9.0 },
      { id: 'flu_4', name: 'Ganso', position: 'MEI', ovr: 79, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true },
      { id: 'flu_5', name: 'Jhon Arias', position: 'PD', ovr: 82, age: 26, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 14.0, isStar: true },
      { id: 'flu_6', name: 'Germán Cano', position: 'CA', ovr: 80, age: 36, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Bahia': {
    id: 'bahia',
    name: 'EC Bahia',
    shortName: 'Bahia',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/2/20/Esporte_Clube_Bahia_logo.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Arena Fonte Nova',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 50.0,
    colors: { primary: '#0055a5', secondary: '#ef3340', text: '#ffffff' },
    rivalClubs: ['Vitória', 'Sport'],
    playStyle: 'Futebol moderno do Grupo City com passes curtos e amplitude',
    coachName: 'Rogério Ceni',
    squad: [
      { id: 'bah_1', name: 'Marcos Felipe', position: 'GOL', ovr: 76, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5 },
      { id: 'bah_2', name: 'Gabriel Xavier', position: 'ZAG', ovr: 77, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0 },
      { id: 'bah_3', name: 'Jean Lucas', position: 'MC', ovr: 78, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 7.0 },
      { id: 'bah_4', name: 'Cauly', position: 'MEI', ovr: 79, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0, isStar: true },
      { id: 'bah_5', name: 'Everton Ribeiro', position: 'MEI', ovr: 79, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0, isStar: true },
      { id: 'bah_6', name: 'Thaciano', position: 'CA', ovr: 77, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5 }
    ]
  },
  'Fortaleza': {
    id: 'fortaleza',
    name: 'Fortaleza EC',
    shortName: 'Fortaleza',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/FortalezaEC.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Arena Castelão',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 38.0,
    colors: { primary: '#113377', secondary: '#cc1122', text: '#ffffff' },
    rivalClubs: ['Ceará'],
    playStyle: 'Transição rápida em bloco fechado e intensidade de Vojvoda',
    coachName: 'Juan Pablo Vojvoda',
    squad: [
      { id: 'for_1', name: 'João Ricardo', position: 'GOL', ovr: 78, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'for_2', name: 'Benjamin Kuscevic', position: 'ZAG', ovr: 76, age: 28, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 2.5 },
      { id: 'for_3', name: 'Hércules', position: 'MC', ovr: 77, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.5 },
      { id: 'for_4', name: 'Tomás Pochettino', position: 'MEI', ovr: 78, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 4.5, isStar: true },
      { id: 'for_5', name: 'Yago Pikachu', position: 'PD', ovr: 77, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'for_6', name: 'Juan Martín Lucero', position: 'CA', ovr: 78, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Athletico Paranaense': {
    id: 'athletico_pr',
    name: 'Club Athletico Paranaense',
    shortName: 'Athletico-PR',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/c/c7/Club_Athletico_Paranaense_2018.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Ligga Arena (Baixada)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 40.0,
    colors: { primary: '#c8102e', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Coritiba'],
    playStyle: 'Força física no gramado sintético e agressividade nas pontas',
    coachName: 'Lucho González',
    squad: [
      { id: 'cap_1', name: 'Mycael', position: 'GOL', ovr: 75, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5 },
      { id: 'cap_2', name: 'Thiago Heleno', position: 'ZAG', ovr: 77, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'cap_3', name: 'Fernandinho', position: 'VOL', ovr: 79, age: 39, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true },
      { id: 'cap_4', name: 'Bruno Zapelli', position: 'MEI', ovr: 77, age: 22, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 6.0 },
      { id: 'cap_5', name: 'Agustín Canobbio', position: 'PE', ovr: 78, age: 25, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 7.0, isStar: true },
      { id: 'cap_6', name: 'Pablo', position: 'CA', ovr: 76, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 }
    ]
  },
  'Goiás': {
    id: 'goias',
    name: 'Goiás EC',
    shortName: 'Goiás',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Goias_Esporte_Clube_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Estádio da Serrinha',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 14.0,
    colors: { primary: '#005c3b', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Vila Nova', 'Atlético-GO'],
    playStyle: 'Jogo físico, contra-ataque veloz e apoio em Goiânia',
    coachName: 'Vagner Mancini',
    squad: [
      { id: 'goi_1', name: 'Tadeu', position: 'GOL', ovr: 78, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5, isStar: true },
      { id: 'goi_2', name: 'Messias', position: 'ZAG', ovr: 74, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'goi_3', name: 'Marcão Silva', position: 'VOL', ovr: 73, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'goi_4', name: 'Paulo Baya', position: 'PE', ovr: 74, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'América Mineiro': {
    id: 'america_mg',
    name: 'América FC (MG)',
    shortName: 'América-MG',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/America_Mineiro_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Independência',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 16.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Atlético-MG', 'Cruzeiro'],
    playStyle: 'Organização tática clássica mineira com transição pelos lados',
    coachName: 'Lisca',
    squad: [
      { id: 'ame_1', name: 'Dalberson', position: 'GOL', ovr: 73, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'ame_2', name: 'Ricardo Silva', position: 'ZAG', ovr: 74, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'ame_3', name: 'Juninho', position: 'MC', ovr: 75, age: 36, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5, isStar: true },
      { id: 'ame_4', name: 'Renato Marques', position: 'CA', ovr: 73, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 }
    ]
  },

  // ==========================================
  // INGLATERRA 🏴󠁧󠁢󠁥󠁮󠁧󠁿 - PREMIER LEAGUE
  // ==========================================
  'Tottenham Hotspur': {
    id: 'tottenham',
    name: 'Tottenham Hotspur FC',
    shortName: 'Tottenham',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Tottenham_Hotspur.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Tottenham Hotspur Stadium',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 110.0,
    colors: { primary: '#132257', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Arsenal', 'Chelsea', 'West Ham'],
    playStyle: 'Futebol ofensivo total de Ange Postecoglou com linha alta',
    coachName: 'Ange Postecoglou',
    squad: [
      { id: 'tot_1', name: 'Guglielmo Vicario', position: 'GOL', ovr: 83, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 35.0 },
      { id: 'tot_2', name: 'Cristian Romero', position: 'ZAG', ovr: 84, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 65.0, isStar: true },
      { id: 'tot_3', name: 'James Maddison', position: 'MEI', ovr: 84, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 70.0, isStar: true },
      { id: 'tot_4', name: 'Dejan Kulusevski', position: 'PD', ovr: 82, age: 24, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 55.0 },
      { id: 'tot_5', name: 'Heung-min Son', position: 'PE', ovr: 87, age: 32, nationality: 'Coreia do Sul', flag: '🇰🇷', marketValueEur: 45.0, isStar: true },
      { id: 'tot_6', name: 'Dominic Solanke', position: 'CA', ovr: 81, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 45.0 }
    ]
  },
  'Newcastle United': {
    id: 'newcastle',
    name: 'Newcastle United FC',
    shortName: 'Newcastle',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/5/56/Newcastle_United_Logo.png',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: "St. James' Park",
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 120.0,
    colors: { primary: '#241f20', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Sunderland', 'Manchester United'],
    playStyle: 'Pressão física avassaladora e transição letal no St. James Park',
    coachName: 'Eddie Howe',
    squad: [
      { id: 'new_1', name: 'Nick Pope', position: 'GOL', ovr: 82, age: 32, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 16.0 },
      { id: 'new_2', name: 'Sven Botman', position: 'ZAG', ovr: 82, age: 24, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 45.0 },
      { id: 'new_3', name: 'Bruno Guimarães', position: 'MC', ovr: 85, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 85.0, isStar: true },
      { id: 'new_4', name: 'Joelinton', position: 'MC', ovr: 82, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 40.0 },
      { id: 'new_5', name: 'Anthony Gordon', position: 'PE', ovr: 82, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 60.0 },
      { id: 'new_6', name: 'Alexander Isak', position: 'CA', ovr: 85, age: 24, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 75.0, isStar: true }
    ]
  },
  'Aston Villa': {
    id: 'aston_villa',
    name: 'Aston Villa FC',
    shortName: 'Aston Villa',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/1/15/Aston_Villa.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Villa Park',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 95.0,
    colors: { primary: '#670e36', secondary: '#94bee5', text: '#ffffff' },
    rivalClubs: ['Birmingham City', 'Wolverhampton'],
    playStyle: 'Mestre da armadilha de impedimento e transição de Unai Emery',
    coachName: 'Unai Emery',
    squad: [
      { id: 'av_1', name: 'Emiliano Martínez', position: 'GOL', ovr: 87, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 28.0, isStar: true },
      { id: 'av_2', name: 'Ezri Konsa', position: 'ZAG', ovr: 81, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 35.0 },
      { id: 'av_3', name: 'Youri Tielemans', position: 'MC', ovr: 82, age: 27, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 30.0 },
      { id: 'av_4', name: 'John McGinn', position: 'MC', ovr: 82, age: 29, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 30.0 },
      { id: 'av_5', name: 'Leon Bailey', position: 'PD', ovr: 82, age: 27, nationality: 'Jamaica', flag: '🇯🇲', marketValueEur: 42.0 },
      { id: 'av_6', name: 'Ollie Watkins', position: 'CA', ovr: 84, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 65.0, isStar: true }
    ]
  },
  'Manchester United': {
    id: 'man_united',
    name: 'Manchester United FC',
    shortName: 'Man United',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b9/Manchester_United_FC_crest.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Old Trafford',
    prestige: 5,
    formation: '4-2-3-1',
    budgetEur: 140.0,
    colors: { primary: '#da291c', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Manchester City', 'Liverpool', 'Leeds United', 'Arsenal'],
    playStyle: 'Tradição pesada em Old Trafford, velocidade nas pontas e pressão',
    coachName: 'Rúben Amorim',
    squad: [
      { id: 'mun_1', name: 'André Onana', position: 'GOL', ovr: 83, age: 28, nationality: 'Camarões', flag: '🇨🇲', marketValueEur: 35.0 },
      { id: 'mun_2', name: 'Matthijs de Ligt', position: 'ZAG', ovr: 84, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 65.0, isStar: true },
      { id: 'mun_3', name: 'Kobbie Mainoo', position: 'MC', ovr: 80, age: 19, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 55.0, isStar: true },
      { id: 'mun_4', name: 'Bruno Fernandes', position: 'MEI', ovr: 87, age: 29, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 65.0, isStar: true },
      { id: 'mun_5', name: 'Alejandro Garnacho', position: 'PE', ovr: 80, age: 20, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 50.0 },
      { id: 'mun_6', name: 'Marcus Rashford', position: 'PE', ovr: 81, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 60.0 }
    ]
  },

  // ==========================================
  // ESPANHA 🇪🇸 - LA LIGA
  // ==========================================
  'Real Sociedad': {
    id: 'real_sociedad',
    name: 'Real Sociedad',
    shortName: 'Real Sociedad',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/f/f1/Real_Sociedad_Logo.png',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Reale Arena (Anoeta)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 65.0,
    colors: { primary: '#004d98', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Athletic Bilbao'],
    playStyle: 'Futebol técnico basco, posse inteligente e desarme limpo',
    coachName: 'Imanol Alguacil',
    squad: [
      { id: 'rso_1', name: 'Álex Remiro', position: 'GOL', ovr: 83, age: 29, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 25.0 },
      { id: 'rso_2', name: 'Igor Zubeldia', position: 'ZAG', ovr: 81, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 22.0 },
      { id: 'rso_3', name: 'Martín Zubimendi', position: 'VOL', ovr: 84, age: 25, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 60.0, isStar: true },
      { id: 'rso_4', name: 'Brais Méndez', position: 'MC', ovr: 82, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 40.0 },
      { id: 'rso_5', name: 'Takefusa Kubo', position: 'PD', ovr: 83, age: 23, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 50.0, isStar: true },
      { id: 'rso_6', name: 'Mikel Oyarzabal', position: 'PE', ovr: 83, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 40.0, isStar: true }
    ]
  },
  'Real Betis': {
    id: 'real_betis',
    name: 'Real Betis Balompié',
    shortName: 'Betis',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/1/13/Real_betis_logo.png',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Benito Villamarín',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 50.0,
    colors: { primary: '#00954c', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Sevilla'],
    playStyle: 'Arte andaluz, criatividade e habilidade de Isco e Lo Celso',
    coachName: 'Manuel Pellegrini',
    squad: [
      { id: 'bet_1', name: 'Rui Silva', position: 'GOL', ovr: 80, age: 30, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 8.0 },
      { id: 'bet_2', name: 'Marc Bartra', position: 'ZAG', ovr: 78, age: 33, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.0 },
      { id: 'bet_3', name: 'Giovani Lo Celso', position: 'MEI', ovr: 82, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 16.0, isStar: true },
      { id: 'bet_4', name: 'Isco Alarcón', position: 'MEI', ovr: 83, age: 32, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 8.0, isStar: true },
      { id: 'bet_5', name: 'Pablo Fornals', position: 'MC', ovr: 80, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 14.0 },
      { id: 'bet_6', name: 'Vitor Roque', position: 'CA', ovr: 78, age: 19, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 30.0, isStar: true }
    ]
  },
  'Sevilla FC': {
    id: 'sevilla',
    name: 'Sevilla FC',
    shortName: 'Sevilla',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/c/c5/Sevilla_FC_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Ramón Sánchez-Pizjuán',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 55.0,
    colors: { primary: '#d4001f', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Real Betis'],
    playStyle: 'Caldeirão no Sánchez-Pizjuán com garra andaluza e velocidade',
    coachName: 'García Pimienta',
    squad: [
      { id: 'sev_1', name: 'Ørjan Nyland', position: 'GOL', ovr: 78, age: 33, nationality: 'Noruega', flag: '🇳🇴', marketValueEur: 2.5 },
      { id: 'sev_2', name: 'Loïc Badé', position: 'ZAG', ovr: 80, age: 24, nationality: 'França', flag: '🇫🇷', marketValueEur: 20.0 },
      { id: 'sev_3', name: 'Saúl Ñíguez', position: 'MC', ovr: 79, age: 29, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 7.5 },
      { id: 'sev_4', name: 'Jesús Navas', position: 'LD', ovr: 78, age: 38, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.0, isStar: true },
      { id: 'sev_5', name: 'Dodi Lukebakio', position: 'PD', ovr: 79, age: 26, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 15.0, isStar: true },
      { id: 'sev_6', name: 'Isaac Romero', position: 'CA', ovr: 77, age: 24, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 18.0 }
    ]
  },

  // ==========================================
  // ITÁLIA 🇮🇹 - SERIE A
  // ==========================================
  'Napoli': {
    id: 'napoli',
    name: 'SSC Napoli',
    shortName: 'Napoli',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/28/S.S.C._Napoli_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Diego Armando Maradona',
    prestige: 5,
    formation: '4-3-3',
    budgetEur: 90.0,
    colors: { primary: '#0080ff', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Juventus', 'Roma'],
    playStyle: 'Intensidade feroz de Antonio Conte e genialidade de Kvaratskhelia',
    coachName: 'Antonio Conte',
    squad: [
      { id: 'nap_1', name: 'Alex Meret', position: 'GOL', ovr: 81, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 12.0 },
      { id: 'nap_2', name: 'Alessandro Buongiorno', position: 'ZAG', ovr: 83, age: 25, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 35.0 },
      { id: 'nap_3', name: 'Stanislav Lobotka', position: 'MC', ovr: 83, age: 29, nationality: 'Eslováquia', flag: '🇸🇰', marketValueEur: 28.0 },
      { id: 'nap_4', name: 'Scott McTominay', position: 'MC', ovr: 82, age: 27, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 32.0 },
      { id: 'nap_5', name: 'Khvicha Kvaratskhelia', position: 'PE', ovr: 86, age: 23, nationality: 'Geórgia', flag: '🇬🇪', marketValueEur: 80.0, isStar: true },
      { id: 'nap_6', name: 'Romelu Lukaku', position: 'CA', ovr: 83, age: 31, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 30.0, isStar: true }
    ]
  },
  'AS Roma': {
    id: 'as_roma',
    name: 'AS Roma',
    shortName: 'Roma',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/5/5a/AS_Roma_Logo_2017.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Olimpico',
    prestige: 4,
    formation: '3-5-2',
    budgetEur: 70.0,
    colors: { primary: '#8b0000', secondary: '#f4a460', text: '#ffffff' },
    rivalClubs: ['Lazio', 'Juventus', 'Napoli'],
    playStyle: 'Paixão romana, talento puro de Dybala e zaga impenetrável',
    coachName: 'Claudio Ranieri',
    squad: [
      { id: 'rom_1', name: 'Mile Svilar', position: 'GOL', ovr: 81, age: 24, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 14.0 },
      { id: 'rom_2', name: 'Gianluca Mancini', position: 'ZAG', ovr: 82, age: 28, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 25.0 },
      { id: 'rom_3', name: 'Lorenzo Pellegrini', position: 'MEI', ovr: 82, age: 28, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 25.0, isStar: true },
      { id: 'rom_4', name: 'Paulo Dybala', position: 'MEI', ovr: 87, age: 30, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 20.0, isStar: true },
      { id: 'rom_5', name: 'Matías Soulé', position: 'PD', ovr: 79, age: 21, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 25.0 },
      { id: 'rom_6', name: 'Artem Dovbyk', position: 'CA', ovr: 82, age: 27, nationality: 'Ucrânia', flag: '🇺🇦', marketValueEur: 35.0, isStar: true }
    ]
  },
  'SS Lazio': {
    id: 'lazio',
    name: 'SS Lazio',
    shortName: 'Lazio',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/0/07/SS_Lazio.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Olimpico',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 60.0,
    colors: { primary: '#87ceeb', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Roma'],
    playStyle: 'Velocidade nas alas, verticalidade e espírito copeiro',
    coachName: 'Marco Baroni',
    squad: [
      { id: 'laz_1', name: 'Ivan Provedel', position: 'GOL', ovr: 82, age: 30, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 14.0 },
      { id: 'laz_2', name: 'Alessio Romagnoli', position: 'ZAG', ovr: 81, age: 29, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 15.0 },
      { id: 'laz_3', name: 'Mattéo Guendouzi', position: 'MC', ovr: 81, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 25.0 },
      { id: 'laz_4', name: 'Mattia Zaccagni', position: 'PE', ovr: 82, age: 29, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 20.0, isStar: true },
      { id: 'laz_5', name: 'Gustav Isaksen', position: 'PD', ovr: 78, age: 23, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 12.0 },
      { id: 'laz_6', name: 'Taty Castellanos', position: 'CA', ovr: 79, age: 25, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 18.0 }
    ]
  },

  // ==========================================
  // ALEMANHA 🇩🇪 - BUNDESLIGA
  // ==========================================
  'RB Leipzig': {
    id: 'rb_leipzig',
    name: 'RB Leipzig',
    shortName: 'Leipzig',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/49/RB_Leipzig_2020_Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Red Bull Arena (Leipzig)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 85.0,
    colors: { primary: '#ed1c24', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Bayern de Munique', 'Borussia Dortmund'],
    playStyle: 'Pressão alta asfixiante Gegenpressing e contra-ataques verticais',
    coachName: 'Marco Rose',
    squad: [
      { id: 'rbl_1', name: 'Péter Gulácsi', position: 'GOL', ovr: 82, age: 34, nationality: 'Hungria', flag: '🇭🇺', marketValueEur: 3.5 },
      { id: 'rbl_2', name: 'Willi Orbán', position: 'ZAG', ovr: 82, age: 31, nationality: 'Hungria', flag: '🇭🇺', marketValueEur: 10.0 },
      { id: 'rbl_3', name: 'Amadou Haidara', position: 'MC', ovr: 80, age: 26, nationality: 'Mali', flag: '🇲🇱', marketValueEur: 20.0 },
      { id: 'rbl_4', name: 'Xavi Simons', position: 'MEI', ovr: 85, age: 21, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 80.0, isStar: true },
      { id: 'rbl_5', name: 'Loïs Openda', position: 'CA', ovr: 84, age: 24, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 60.0, isStar: true },
      { id: 'rbl_6', name: 'Benjamin Šeško', position: 'CA', ovr: 82, age: 21, nationality: 'Eslovênia', flag: '🇸🇮', marketValueEur: 50.0, isStar: true }
    ]
  },
  'Eintracht Frankfurt': {
    id: 'eintracht',
    name: 'Eintracht Frankfurt',
    shortName: 'Frankfurt',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Deutsche Bank Park',
    prestige: 4,
    formation: '3-5-2',
    budgetEur: 65.0,
    colors: { primary: '#e1000f', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Mainz 05', 'Darmstadt'],
    playStyle: 'Velocidade devastadora em transições rápidas e festa da torcida',
    coachName: 'Dino Toppmöller',
    squad: [
      { id: 'fra_1', name: 'Kevin Trapp', position: 'GOL', ovr: 81, age: 34, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 4.0 },
      { id: 'fra_2', name: 'Robin Koch', position: 'ZAG', ovr: 81, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 18.0 },
      { id: 'fra_3', name: 'Mario Götze', position: 'MEI', ovr: 80, age: 32, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 5.5, isStar: true },
      { id: 'fra_4', name: 'Hugo Larsson', position: 'MC', ovr: 78, age: 20, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 28.0 },
      { id: 'fra_5', name: 'Omar Marmoush', position: 'CA', ovr: 84, age: 25, nationality: 'Egito', flag: '🇪🇬', marketValueEur: 40.0, isStar: true },
      { id: 'fra_6', name: 'Hugo Ekitiké', position: 'CA', ovr: 80, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 30.0 }
    ]
  },

  // ==========================================
  // FRANÇA 🇫🇷 - LIGUE 1
  // ==========================================
  'AS Monaco': {
    id: 'monaco',
    name: 'AS Monaco FC',
    shortName: 'Monaco',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/ba/AS_Monaco_FC.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Louis II',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 80.0,
    colors: { primary: '#e2001a', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Nice', 'PSG'],
    playStyle: 'Desenvolvimento de jovens craques mundiais e transição dinâmica',
    coachName: 'Adi Hütter',
    squad: [
      { id: 'mon_1', name: 'Philipp Köhn', position: 'GOL', ovr: 78, age: 26, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 7.0 },
      { id: 'mon_2', name: 'Wilfried Singo', position: 'ZAG', ovr: 80, age: 23, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 25.0 },
      { id: 'mon_3', name: 'Denis Zakaria', position: 'VOL', ovr: 82, age: 27, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 28.0 },
      { id: 'mon_4', name: 'Aleksandr Golovin', position: 'MEI', ovr: 82, age: 28, nationality: 'Rússia', flag: '🇷🇺', marketValueEur: 30.0, isStar: true },
      { id: 'mon_5', name: 'Eliesse Ben Seghir', position: 'PE', ovr: 79, age: 19, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 18.0, isStar: true },
      { id: 'mon_6', name: 'Breel Embolo', position: 'CA', ovr: 79, age: 27, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 12.0 }
    ]
  },
  'Olympique Lyonnais': {
    id: 'lyon',
    name: 'Olympique Lyonnais',
    shortName: 'Lyon',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/6/66/Olympique_lyonnais.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Groupama Stadium',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 65.0,
    colors: { primary: '#1e3a8a', secondary: '#ef4444', text: '#ffffff' },
    rivalClubs: ['Saint-Étienne', 'Marseille'],
    playStyle: 'Fábrica de talentos técnicos e liderança de Lacazette',
    coachName: 'Pierre Sage',
    squad: [
      { id: 'lyo_1', name: 'Lucas Perri', position: 'GOL', ovr: 80, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 10.0 },
      { id: 'lyo_2', name: 'Moussa Niakhaté', position: 'ZAG', ovr: 79, age: 28, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 16.0 },
      { id: 'lyo_3', name: 'Corentin Tolisso', position: 'MC', ovr: 80, age: 30, nationality: 'França', flag: '🇫🇷', marketValueEur: 6.0 },
      { id: 'lyo_4', name: 'Rayan Cherki', position: 'MEI', ovr: 80, age: 21, nationality: 'França', flag: '🇫🇷', marketValueEur: 20.0, isStar: true },
      { id: 'lyo_5', name: 'Malick Fofana', position: 'PE', ovr: 78, age: 19, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 15.0 },
      { id: 'lyo_6', name: 'Alexandre Lacazette', position: 'CA', ovr: 82, age: 33, nationality: 'França', flag: '🇫🇷', marketValueEur: 9.0, isStar: true }
    ]
  },

  // ==========================================
  // PORTUGAL 🇵🇹 - LIGA PORTUGAL
  // ==========================================
  'FC Porto': {
    id: 'porto',
    name: 'FC Porto',
    shortName: 'Porto',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/1/1b/FC_Porto.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio do Dragão',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 70.0,
    colors: { primary: '#0038a8', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Benfica', 'Sporting CP'],
    playStyle: 'Mística do Dragão, agressividade competitiva e velocidade',
    coachName: 'Vítor Bruno',
    squad: [
      { id: 'por_1', name: 'Diogo Costa', position: 'GOL', ovr: 84, age: 24, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 45.0, isStar: true },
      { id: 'por_2', name: 'Nehuén Pérez', position: 'ZAG', ovr: 79, age: 24, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 13.0 },
      { id: 'por_3', name: 'Alan Varela', position: 'VOL', ovr: 81, age: 23, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 35.0, isStar: true },
      { id: 'por_4', name: 'Nico González', position: 'MC', ovr: 80, age: 22, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 18.0 },
      { id: 'por_5', name: 'Galeno', position: 'PE', ovr: 82, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 25.0, isStar: true },
      { id: 'por_6', name: 'Samu Omorodion', position: 'CA', ovr: 79, age: 20, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 35.0 }
    ]
  },
  'SC Braga': {
    id: 'braga',
    name: 'Sporting Clube de Braga',
    shortName: 'Braga',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/7/79/Sporting_Clube_de_Braga_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio Municipal de Braga',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#d4001f', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Vitória de Guimarães'],
    playStyle: 'Futebol ofensivo dos Guerreiros do Minho e experiência',
    coachName: 'Carlos Carvalhal',
    squad: [
      { id: 'bra_1', name: 'Matheus', position: 'GOL', ovr: 79, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0 },
      { id: 'bra_2', name: 'Sikou Niakaté', position: 'ZAG', ovr: 77, age: 25, nationality: 'Mali', flag: '🇲🇱', marketValueEur: 6.0 },
      { id: 'bra_3', name: 'João Moutinho', position: 'MC', ovr: 78, age: 37, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 1.0, isStar: true },
      { id: 'bra_4', name: 'Rodrigo Zalazar', position: 'MEI', ovr: 79, age: 24, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 16.0 },
      { id: 'bra_5', name: 'Bruma', position: 'PE', ovr: 79, age: 29, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 7.0 },
      { id: 'bra_6', name: 'Ricardo Horta', position: 'PD', ovr: 81, age: 29, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 15.0, isStar: true }
    ]
  },

  // ==========================================
  // ARÁBIA SAUDITA & ESTADOS UNIDOS 🇸🇦 🇺🇸
  // ==========================================
  'Al-Hilal': {
    id: 'al_hilal',
    name: 'Al-Hilal SFC',
    shortName: 'Al-Hilal',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Al_Hilal_SFC.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Kingdom Arena',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 160.0,
    colors: { primary: '#003399', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Al-Nassr', 'Al-Ittihad'],
    playStyle: 'Potência milionária com astros de elite e controle total',
    coachName: 'Jorge Jesus',
    squad: [
      { id: 'hil_1', name: 'Yassine Bounou (Bono)', position: 'GOL', ovr: 85, age: 33, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 9.0, isStar: true },
      { id: 'hil_2', name: 'Kalidou Koulibaly', position: 'ZAG', ovr: 83, age: 33, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 9.0 },
      { id: 'hil_3', name: 'Rúben Neves', position: 'VOL', ovr: 84, age: 27, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 32.0, isStar: true },
      { id: 'hil_4', name: 'Sergej Milinković-Savić', position: 'MC', ovr: 85, age: 29, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 30.0, isStar: true },
      { id: 'hil_5', name: 'Malcom', position: 'PD', ovr: 82, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 28.0 },
      { id: 'hil_6', name: 'Neymar Jr', position: 'MEI', ovr: 88, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 30.0, isStar: true },
      { id: 'hil_7', name: 'Aleksandar Mitrović', position: 'CA', ovr: 83, age: 29, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 28.0, isStar: true }
    ]
  },
  'Al-Nassr': {
    id: 'al_nassr',
    name: 'Al-Nassr FC',
    shortName: 'Al-Nassr',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/8/87/Al-Nassr_FC.png',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Al-Awwal Park',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 150.0,
    colors: { primary: '#f6d200', secondary: '#002f6c', text: '#ffffff' },
    rivalClubs: ['Al-Hilal', 'Al-Ahli'],
    playStyle: 'Finalização implacável e liderança global de Cristiano Ronaldo',
    coachName: 'Stefano Pioli',
    squad: [
      { id: 'nas_1', name: 'Bento', position: 'GOL', ovr: 80, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 15.0 },
      { id: 'nas_2', name: 'Aymeric Laporte', position: 'ZAG', ovr: 83, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 20.0, isStar: true },
      { id: 'nas_3', name: 'Marcelo Brozović', position: 'VOL', ovr: 82, age: 31, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 16.0 },
      { id: 'nas_4', name: 'Otávio', position: 'MEI', ovr: 82, age: 29, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 25.0, isStar: true },
      { id: 'nas_5', name: 'Sadio Mané', position: 'PE', ovr: 83, age: 32, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 15.0, isStar: true },
      { id: 'nas_6', name: 'Cristiano Ronaldo', position: 'CA', ovr: 86, age: 39, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Inter Miami': {
    id: 'inter_miami',
    name: 'Inter Miami CF',
    shortName: 'Inter Miami',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/e/eb/Inter_Miami_CF_logo.svg',
    leagueId: 'mls',
    league: 'Major League Soccer (MLS)',
    country: 'Estados Unidos',
    stadium: 'Chase Stadium (Fort Lauderdale)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 75.0,
    colors: { primary: '#f7b5cd', secondary: '#231f20', text: '#ffffff' },
    rivalClubs: ['Orlando City'],
    playStyle: 'Magia e conexão sul-americana lendária de Messi e Suárez',
    coachName: 'Javier Mascherano',
    squad: [
      { id: 'mia_1', name: 'Drake Callender', position: 'GOL', ovr: 75, age: 26, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 3.0 },
      { id: 'mia_2', name: 'Jordi Alba', position: 'LE', ovr: 80, age: 35, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.5, isStar: true },
      { id: 'mia_3', name: 'Sergio Busquets', position: 'VOL', ovr: 80, age: 36, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.5, isStar: true },
      { id: 'mia_4', name: 'Diego Gómez', position: 'MC', ovr: 77, age: 21, nationality: 'Paraguai', flag: '🇵🇾', marketValueEur: 10.0 },
      { id: 'mia_5', name: 'Lionel Messi', position: 'PD', ovr: 88, age: 37, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 25.0, isStar: true },
      { id: 'mia_6', name: 'Luis Suárez', position: 'CA', ovr: 82, age: 37, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 4.0, isStar: true }
    ]
  },

  // =========================================================================
  // HOLANDA (PAÍSES BAIXOS) 🇳🇱 - Eredivisie & Eerste Divisie
  // =========================================================================
  'Ajax': {
    id: 'ajax',
    name: 'AFC Ajax',
    shortName: 'Ajax',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b8/AFC_Ajax_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Johan Cruyff Arena (Amsterdam)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 65.0,
    colors: { primary: '#D2122E', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Feyenoord', 'PSV Eindhoven'],
    playStyle: 'Futebol total holandês, posse ofensiva e quebra de linhas',
    coachName: 'Francesco Farioli',
    squad: [
      { id: 'ajx_1', name: 'Remko Pasveer', position: 'GOL', ovr: 77, age: 41, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 0.5 },
      { id: 'ajx_2', name: 'Jorrel Hato', position: 'ZAG', ovr: 80, age: 18, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0, isStar: true },
      { id: 'ajx_3', name: 'Josip Šutalo', position: 'ZAG', ovr: 79, age: 24, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 18.0 },
      { id: 'ajx_4', name: 'Jordan Henderson', position: 'VOL', ovr: 80, age: 34, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 4.0, isStar: true },
      { id: 'ajx_5', name: 'Kenneth Taylor', position: 'MC', ovr: 79, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 18.0 },
      { id: 'ajx_6', name: 'Steven Berghuis', position: 'MEI', ovr: 80, age: 33, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 6.0 },
      { id: 'ajx_7', name: 'Bertrand Traoré', position: 'PD', ovr: 78, age: 29, nationality: 'Burkina Faso', flag: '🇧🇫', marketValueEur: 9.0 },
      { id: 'ajx_8', name: 'Brian Brobbey', position: 'CA', ovr: 81, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0, isStar: true },
      { id: 'ajx_9', name: 'Wout Weghorst', position: 'CA', ovr: 79, age: 32, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 4.0 }
    ]
  },
  'PSV Eindhoven': {
    id: 'psv_eindhoven',
    name: 'PSV Eindhoven',
    shortName: 'PSV',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/0/05/PSV_Eindhoven.png',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Philips Stadion (Eindhoven)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 70.0,
    colors: { primary: '#FF0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Ajax', 'Feyenoord'],
    playStyle: 'Pressão sufocante no campo de ataque e finalizações letais',
    coachName: 'Peter Bosz',
    squad: [
      { id: 'psv_1', name: 'Walter Benítez', position: 'GOL', ovr: 81, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 12.0 },
      { id: 'psv_2', name: 'Olivier Boscagli', position: 'ZAG', ovr: 81, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 27.0 },
      { id: 'psv_3', name: 'Jerdy Schouten', position: 'VOL', ovr: 82, age: 27, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 28.0, isStar: true },
      { id: 'psv_4', name: 'Joey Veerman', position: 'MC', ovr: 82, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0, isStar: true },
      { id: 'psv_5', name: 'Johan Bakayoko', position: 'PD', ovr: 82, age: 21, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 45.0, isStar: true },
      { id: 'psv_6', name: 'Noa Lang', position: 'PE', ovr: 80, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 18.0 },
      { id: 'psv_7', name: 'Luuk de Jong', position: 'CA', ovr: 83, age: 34, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 5.0, isStar: true },
      { id: 'psv_8', name: 'Ricardo Pepi', position: 'CA', ovr: 78, age: 22, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 15.0 }
    ]
  },
  'Feyenoord': {
    id: 'feyenoord',
    name: 'Feyenoord Rotterdam',
    shortName: 'Feyenoord',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/9/90/Feyenoord_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'De Kuip (Rotterdam)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 55.0,
    colors: { primary: '#FF0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Ajax', 'PSV Eindhoven'],
    playStyle: 'Transição ultra-agressiva e intensidade nos duelos físicos',
    coachName: 'Brian Priske',
    squad: [
      { id: 'fey_1', name: 'Timon Wellenreuther', position: 'GOL', ovr: 78, age: 29, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 7.0 },
      { id: 'fey_2', name: 'Dávid Hancko', position: 'ZAG', ovr: 83, age: 27, nationality: 'Eslováquia', flag: '🇸🇰', marketValueEur: 35.0, isStar: true },
      { id: 'fey_3', name: 'Quinten Timber', position: 'MC', ovr: 81, age: 23, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0, isStar: true },
      { id: 'fey_4', name: 'Calvin Stengs', position: 'MEI', ovr: 80, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 15.0 },
      { id: 'fey_5', name: 'Igor Paixão', position: 'PE', ovr: 80, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 18.0, isStar: true },
      { id: 'fey_6', name: 'Santiago Giménez', position: 'CA', ovr: 83, age: 23, nationality: 'México', flag: '🇲🇽', marketValueEur: 40.0, isStar: true }
    ]
  },
  'AZ Alkmaar': {
    id: 'az_alkmaar',
    name: 'AZ Alkmaar',
    shortName: 'AZ',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/5/52/AZ_Alkmaar.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'AFAS Stadion (Alkmaar)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#D2122E', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Ajax'],
    playStyle: 'Futebol posicional refinado e valorização de revelações',
    coachName: 'Maarten Martens',
    squad: [
      { id: 'az_1', name: 'Rome-Jayden Owusu-Oduro', position: 'GOL', ovr: 76, age: 20, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 6.0 },
      { id: 'az_2', name: 'Wouter Goes', position: 'ZAG', ovr: 77, age: 20, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 10.0 },
      { id: 'az_3', name: 'Jordy Clasie', position: 'VOL', ovr: 79, age: 33, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 3.0 },
      { id: 'az_4', name: 'Sven Mijnans', position: 'MEI', ovr: 79, age: 24, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 12.0 },
      { id: 'az_5', name: 'Ernest Poku', position: 'PD', ovr: 76, age: 20, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 7.0 },
      { id: 'az_6', name: 'Troy Parrott', position: 'CA', ovr: 78, age: 22, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 14.0 }
    ]
  },
  'Willem II': {
    id: 'willem_ii',
    name: 'Willem II Tilburg',
    shortName: 'Willem II',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/Willem_II_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Koning Willem II Stadion',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 14.0,
    colors: { primary: '#002B7F', secondary: '#CE1126', text: '#ffffff' },
    rivalClubs: ['NAC Breda'],
    playStyle: 'Jogo pragmático em bloco baixo e contragolpe rápido',
    coachName: 'Peter Maes',
    squad: [
      { id: 'wil_1', name: 'Thomas Didillon-Hödl', position: 'GOL', ovr: 73, age: 29, nationality: 'França', flag: '🇫🇷', marketValueEur: 1.2 },
      { id: 'wil_2', name: 'Raffael Behounek', position: 'ZAG', ovr: 72, age: 27, nationality: 'Áustria', flag: '🇦🇹', marketValueEur: 1.0 },
      { id: 'wil_3', name: 'Jesse Bosch', position: 'MC', ovr: 73, age: 24, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 1.5 },
      { id: 'wil_4', name: 'Cisse Sandra', position: 'MEI', ovr: 73, age: 21, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 2.0 },
      { id: 'wil_5', name: 'Kvareshma', position: 'PE', ovr: 72, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 1.1 },
      { id: 'wil_6', name: 'Kyan Vaesen', position: 'CA', ovr: 73, age: 23, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 1.8 }
    ]
  },

  // =========================================================================
  // TURQUIA 🇹🇷 - Trendyol Süper Lig & 1. Lig
  // =========================================================================
  'Galatasaray': {
    id: 'galatasaray',
    name: 'Galatasaray SK',
    shortName: 'Galatasaray',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'RAMS Park (Istambul)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 90.0,
    colors: { primary: '#A90432', secondary: '#FDB913', text: '#ffffff' },
    rivalClubs: ['Fenerbahçe', 'Beşiktaş'],
    playStyle: 'Inferno em Istambul: ataque avassalador com Osimhen e Icardi',
    coachName: 'Okan Buruk',
    squad: [
      { id: 'gs_1', name: 'Fernando Muslera', position: 'GOL', ovr: 81, age: 38, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 1.5, isStar: true },
      { id: 'gs_2', name: 'Davinson Sánchez', position: 'ZAG', ovr: 82, age: 28, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 18.0 },
      { id: 'gs_3', name: 'Lucas Torreira', position: 'VOL', ovr: 82, age: 28, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 15.0, isStar: true },
      { id: 'gs_4', name: 'Gabriel Sara', position: 'MC', ovr: 81, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 22.0, isStar: true },
      { id: 'gs_5', name: 'Barış Alper Yılmaz', position: 'PD', ovr: 81, age: 24, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 21.0 },
      { id: 'gs_6', name: 'Dries Mertens', position: 'MEI', ovr: 80, age: 37, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 1.8 },
      { id: 'gs_7', name: 'Mauro Icardi', position: 'CA', ovr: 83, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 15.0, isStar: true },
      { id: 'gs_8', name: 'Victor Osimhen', position: 'CA', ovr: 87, age: 26, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 75.0, isStar: true }
    ]
  },
  'Fenerbahce': {
    id: 'fenerbahce',
    name: 'Fenerbahçe SK',
    shortName: 'Fenerbahçe',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/bd/Fenerbah%C3%A7e_SK_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Şükrü Saracoğlu (Istambul)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 85.0,
    colors: { primary: '#002D62', secondary: '#FEE123', text: '#ffffff' },
    rivalClubs: ['Galatasaray', 'Beşiktaş'],
    playStyle: 'Disciplina tática de José Mourinho com Fred e Džeko no ataque',
    coachName: 'José Mourinho',
    squad: [
      { id: 'fb_1', name: 'Dominik Livaković', position: 'GOL', ovr: 82, age: 30, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 11.0 },
      { id: 'fb_2', name: 'Çağlar Söyüncü', position: 'ZAG', ovr: 80, age: 28, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 10.0 },
      { id: 'fb_3', name: 'Fred', position: 'MC', ovr: 82, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 15.0, isStar: true },
      { id: 'fb_4', name: 'Sofyan Amrabat', position: 'VOL', ovr: 81, age: 28, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 22.0 },
      { id: 'fb_5', name: 'Sebastian Szymański', position: 'MEI', ovr: 81, age: 25, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 19.0 },
      { id: 'fb_6', name: 'Dušan Tadić', position: 'PE', ovr: 82, age: 36, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 3.2, isStar: true },
      { id: 'fb_7', name: 'Edin Džeko', position: 'CA', ovr: 82, age: 38, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 2.5, isStar: true },
      { id: 'fb_8', name: 'Youssef En-Nesyri', position: 'CA', ovr: 82, age: 27, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 22.0 }
    ]
  },
  'Besiktas': {
    id: 'besiktas',
    name: 'Beşiktaş JK',
    shortName: 'Beşiktaş',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_of_Be%C5%9Fikta%C5%9F_JK.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Tüpraş Stadyumu (Istambul)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 65.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Galatasaray', 'Fenerbahçe'],
    playStyle: 'Pressão alta com Rafa Silva e faro de gol de Ciro Immobile',
    coachName: 'Ole Gunnar Solskjær',
    squad: [
      { id: 'bjk_1', name: 'Mert Günok', position: 'GOL', ovr: 79, age: 35, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 1.2 },
      { id: 'bjk_2', name: 'Gabriel Paulista', position: 'ZAG', ovr: 80, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'bjk_3', name: 'Al-Musrati', position: 'VOL', ovr: 80, age: 28, nationality: 'Líbia', flag: '🇱🇾', marketValueEur: 14.0 },
      { id: 'bjk_4', name: 'Gedson Fernandes', position: 'MC', ovr: 81, age: 26, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 17.0, isStar: true },
      { id: 'bjk_5', name: 'Rafa Silva', position: 'MEI', ovr: 83, age: 31, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 14.0, isStar: true },
      { id: 'bjk_6', name: 'Milot Rashica', position: 'PD', ovr: 79, age: 28, nationality: 'Kosovo', flag: '🇽🇰', marketValueEur: 8.5 },
      { id: 'bjk_7', name: 'Ciro Immobile', position: 'CA', ovr: 82, age: 34, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 4.0, isStar: true },
      { id: 'bjk_8', name: 'Semih Kılıçsoy', position: 'CA', ovr: 77, age: 19, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Trabzonspor': {
    id: 'trabzonspor',
    name: 'Trabzonspor',
    shortName: 'Trabzonspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b3/Trabzonspor.png',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Papara Park (Trabzon)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 40.0,
    colors: { primary: '#800020', secondary: '#4169E1', text: '#ffffff' },
    rivalClubs: ['Galatasaray', 'Fenerbahçe'],
    playStyle: 'Futebol de raça e choque físico às margens do Mar Negro',
    coachName: 'Şenol Güneş',
    squad: [
      { id: 'ts_1', name: 'Uğurcan Çakır', position: 'GOL', ovr: 80, age: 28, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 8.5, isStar: true },
      { id: 'ts_2', name: 'Stefan Savić', position: 'ZAG', ovr: 80, age: 34, nationality: 'Montenegro', flag: '🇲🇪', marketValueEur: 2.5 },
      { id: 'ts_3', name: 'Batista Mendy', position: 'VOL', ovr: 79, age: 24, nationality: 'França', flag: '🇫🇷', marketValueEur: 10.0 },
      { id: 'ts_4', name: 'Muhammed Cham', position: 'MEI', ovr: 78, age: 24, nationality: 'Áustria', flag: '🇦🇹', marketValueEur: 6.0 },
      { id: 'ts_5', name: 'Edin Višća', position: 'PD', ovr: 79, age: 34, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 2.2 },
      { id: 'ts_6', name: 'Simon Banza', position: 'CA', ovr: 80, age: 28, nationality: 'República Democrática do Congo', flag: '🇨🇩', marketValueEur: 16.0 }
    ]
  },
  'Kocaelispor': {
    id: 'kocaelispor',
    name: 'Kocaelispor',
    shortName: 'Kocaelispor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/2/23/Kocaelispor.png',
    leagueId: 'tff_1_lig',
    league: '1. Lig',
    country: 'Turquia',
    stadium: 'Kocaeli Stadium',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 7.0,
    colors: { primary: '#008000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Sakaryaspor'],
    playStyle: 'Força defensiva e bolas paradas aéreas',
    coachName: 'Ertuğrul Sağlam',
    squad: [
      { id: 'koc_1', name: 'Gökhan Değirmenci', position: 'GOL', ovr: 71, age: 35, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 0.3 },
      { id: 'koc_2', name: 'Aaron Appindangoyé', position: 'ZAG', ovr: 73, age: 32, nationality: 'Gabão', flag: '🇬🇦', marketValueEur: 0.8 },
      { id: 'koc_3', name: 'Josip Vuković', position: 'VOL', ovr: 72, age: 32, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 0.7 },
      { id: 'koc_4', name: 'Pedrinho', position: 'MEI', ovr: 73, age: 32, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 0.9 },
      { id: 'koc_5', name: 'Ryan Mendes', position: 'PE', ovr: 73, age: 35, nationality: 'Cabo Verde', flag: '🇨🇻', marketValueEur: 0.8 },
      { id: 'koc_6', name: 'Markão', position: 'CA', ovr: 74, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 }
    ]
  },

  // =========================================================================
  // ESCÓCIA 🏴󠁧󠁢󠁳󠁣󠁴󠁿 - Scottish Premiership & Championship
  // =========================================================================
  'Celtic': {
    id: 'celtic',
    name: 'Celtic FC',
    shortName: 'Celtic',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/3/35/Celtic_FC_logo.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Celtic Park (Glasgow)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 55.0,
    colors: { primary: '#018749', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Rangers'],
    playStyle: 'Old Firm: posse acelerada, velocidade nas pontas e pressão alta',
    coachName: 'Brendan Rodgers',
    squad: [
      { id: 'cel_1', name: 'Kasper Schmeichel', position: 'GOL', ovr: 80, age: 38, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 1.0, isStar: true },
      { id: 'cel_2', name: 'Cameron Carter-Vickers', position: 'ZAG', ovr: 81, age: 27, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 14.0 },
      { id: 'cel_3', name: 'Callum McGregor', position: 'MC', ovr: 81, age: 31, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 8.5, isStar: true },
      { id: 'cel_4', name: 'Reo Hatate', position: 'MC', ovr: 80, age: 27, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 11.0 },
      { id: 'cel_5', name: 'Daizen Maeda', position: 'PE', ovr: 79, age: 27, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 8.0 },
      { id: 'cel_6', name: 'Nicolas Kühn', position: 'PD', ovr: 80, age: 25, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 10.0 },
      { id: 'cel_7', name: 'Kyogo Furuhashi', position: 'CA', ovr: 81, age: 30, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 14.0, isStar: true }
    ]
  },
  'Rangers': {
    id: 'rangers',
    name: 'Rangers FC',
    shortName: 'Rangers',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/43/Rangers_FC.png',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Ibrox Stadium (Glasgow)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#1B458F', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Celtic', 'Aberdeen'],
    playStyle: 'Jogo direto, apoio maciço dos laterais e força física aérea',
    coachName: 'Philippe Clement',
    squad: [
      { id: 'ran_1', name: 'Jack Butland', position: 'GOL', ovr: 80, age: 31, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.5 },
      { id: 'ran_2', name: 'John Souttar', position: 'ZAG', ovr: 78, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 4.0 },
      { id: 'ran_3', name: 'James Tavernier', position: 'LD', ovr: 80, age: 33, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 4.5, isStar: true },
      { id: 'ran_4', name: 'Nicolas Raskin', position: 'VOL', ovr: 78, age: 23, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 7.5 },
      { id: 'ran_5', name: 'Tom Lawrence', position: 'MEI', ovr: 78, age: 31, nationality: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', marketValueEur: 3.0 },
      { id: 'ran_6', name: 'Václav Černý', position: 'PD', ovr: 79, age: 27, nationality: 'República Tcheca', flag: '🇨🇿', marketValueEur: 8.0 },
      { id: 'ran_7', name: 'Cyriel Dessers', position: 'CA', ovr: 79, age: 30, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 4.5 }
    ]
  },
  'Aberdeen': {
    id: 'aberdeen',
    name: 'Aberdeen FC',
    shortName: 'Aberdeen',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b5/Aberdeen_FC.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Pittodrie Stadium (Aberdeen)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 20.0,
    colors: { primary: '#D2122E', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Rangers'],
    playStyle: 'Compactação nórdica e transição ofensiva fulminante',
    coachName: 'Jimmy Thelin',
    squad: [
      { id: 'ab_1', name: 'Dimitar Mitov', position: 'GOL', ovr: 76, age: 28, nationality: 'Bulgária', flag: '🇧🇬', marketValueEur: 1.5 },
      { id: 'ab_2', name: 'Slobodan Rubežić', position: 'ZAG', ovr: 76, age: 24, nationality: 'Montenegro', flag: '🇲🇪', marketValueEur: 2.0 },
      { id: 'ab_3', name: 'Graeme Shinnie', position: 'VOL', ovr: 77, age: 33, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 1.0 },
      { id: 'ab_4', name: 'Jamie McGrath', position: 'MEI', ovr: 77, age: 28, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 2.2 },
      { id: 'ab_5', name: 'Topi Keskinen', position: 'PE', ovr: 76, age: 21, nationality: 'Finlândia', flag: '🇫🇮', marketValueEur: 2.5 },
      { id: 'ab_6', name: 'Kevin Nisbet', position: 'CA', ovr: 77, age: 27, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 3.0 }
    ]
  },
  'Heart of Midlothian': {
    id: 'hearts',
    name: 'Heart of Midlothian FC',
    shortName: 'Hearts',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/4e/Hearts_logo.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Tynecastle Park (Edimburgo)',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 18.0,
    colors: { primary: '#800020', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Hibernian'],
    playStyle: 'Pressão física em Edimburgo com cruzamentos certeiros',
    coachName: 'Neil Critchley',
    squad: [
      { id: 'hrt_1', name: 'Craig Gordon', position: 'GOL', ovr: 76, age: 42, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.2 },
      { id: 'hrt_2', name: 'Frankie Kent', position: 'ZAG', ovr: 76, age: 29, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.8 },
      { id: 'hrt_3', name: 'Cammy Devlin', position: 'VOL', ovr: 76, age: 26, nationality: 'Austrália', flag: '🇦🇺', marketValueEur: 1.5 },
      { id: 'hrt_4', name: 'Beni Baningime', position: 'MC', ovr: 76, age: 26, nationality: 'República Democrática do Congo', flag: '🇨🇩', marketValueEur: 1.8 },
      { id: 'hrt_5', name: 'Alan Forrest', position: 'PE', ovr: 75, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 1.2 },
      { id: 'hrt_6', name: 'Lawrence Shankland', position: 'CA', ovr: 79, age: 29, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Partick Thistle': {
    id: 'partick_thistle',
    name: 'Partick Thistle FC',
    shortName: 'Partick Thistle',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/d/d4/Partick_Thistle_FC.svg',
    leagueId: 'scottish_championship',
    league: 'Championship',
    country: 'Escócia',
    stadium: 'Firhill Stadium (Glasgow)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 5.0,
    colors: { primary: '#FFCC00', secondary: '#CC0000', text: '#000000' },
    rivalClubs: ['Celtic', 'Rangers'],
    playStyle: 'Luta campal nas divisões escocesas com ligação direta',
    coachName: 'Kris Doolan',
    squad: [
      { id: 'par_1', name: 'David Mitchell', position: 'GOL', ovr: 71, age: 34, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.2 },
      { id: 'par_2', name: 'Lee Ashcroft', position: 'ZAG', ovr: 72, age: 31, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.4 },
      { id: 'par_3', name: 'Stuart Bannigan', position: 'MC', ovr: 72, age: 32, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.3 },
      { id: 'par_4', name: 'Aidan Fitzpatrick', position: 'PE', ovr: 73, age: 23, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.6 },
      { id: 'par_5', name: 'Brian Graham', position: 'CA', ovr: 73, age: 37, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.2 }
    ]
  },

  // =========================================================================
  // BÉLGICA 🇧🇪 - Jupiler Pro League
  // =========================================================================
  'Club Brugge': {
    id: 'club_brugge',
    name: 'Club Brugge KV',
    shortName: 'Club Brugge',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/46/Club_Brugge_KV.png',
    leagueId: 'pro_league_bel',
    league: 'Pro League',
    country: 'Bélgica',
    stadium: 'Jan Breydel Stadium (Brugge)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 55.0,
    colors: { primary: '#003399', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Anderlecht', 'Cercle Brugge'],
    playStyle: 'Futebol moderno veloz com Vanaken regendo o meio',
    coachName: 'Nicky Hayen',
    squad: [
      { id: 'bru_1', name: 'Simon Mignolet', position: 'GOL', ovr: 81, age: 36, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 2.2, isStar: true },
      { id: 'bru_2', name: 'Brandon Mechele', position: 'ZAG', ovr: 79, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 3.0 },
      { id: 'bru_3', name: 'Raphael Onyedika', position: 'VOL', ovr: 81, age: 23, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 20.0 },
      { id: 'bru_4', name: 'Hans Vanaken', position: 'MC', ovr: 82, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 8.0, isStar: true },
      { id: 'bru_5', name: 'Andreas Skov Olsen', position: 'PD', ovr: 82, age: 25, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 22.0, isStar: true },
      { id: 'bru_6', name: 'Christos Tzolis', position: 'PE', ovr: 80, age: 23, nationality: 'Grécia', flag: '🇬🇷', marketValueEur: 16.0 },
      { id: 'bru_7', name: 'Gustaf Nilsson', position: 'CA', ovr: 79, age: 27, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 10.0 }
    ]
  },
  'Anderlecht': {
    id: 'anderlecht',
    name: 'RSC Anderlecht',
    shortName: 'Anderlecht',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b3/RSC_Anderlecht.png',
    leagueId: 'pro_league_bel',
    league: 'Pro League',
    country: 'Bélgica',
    stadium: 'Lotto Park (Bruxelas)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 42.0,
    colors: { primary: '#5A2A82', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Club Brugge', 'Standard Liège'],
    playStyle: 'Tradição real belga com técnica refinada e intensidade',
    coachName: 'David Hubert',
    squad: [
      { id: 'and_1', name: 'Colin Coosemans', position: 'GOL', ovr: 77, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 1.5 },
      { id: 'and_2', name: 'Jan Vertonghen', position: 'ZAG', ovr: 79, age: 37, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 1.0, isStar: true },
      { id: 'and_3', name: 'Leander Dendoncker', position: 'VOL', ovr: 79, age: 29, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 7.0 },
      { id: 'and_4', name: 'Yari Verschaeren', position: 'MEI', ovr: 79, age: 23, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 9.0 },
      { id: 'and_5', name: 'Francis Amuzu', position: 'PE', ovr: 77, age: 25, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 6.0 },
      { id: 'and_6', name: 'Kasper Dolberg', position: 'CA', ovr: 81, age: 27, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 14.0, isStar: true }
    ]
  },

  // =========================================================================
  // ARÁBIA SAUDITA 🇸🇦 (Continuação) - Roshn Saudi League
  // =========================================================================
  'Al-Ittihad': {
    id: 'al_ittihad',
    name: 'Al-Ittihad Club',
    shortName: 'Al-Ittihad',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/c/cb/Al-Ittihad_Jeddah.png',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'King Abdullah Sports City (Jeddah)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 140.0,
    colors: { primary: '#FEE123', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ['Al-Hilal', 'Al-Ahli'],
    playStyle: 'Ataque de gala com Benzema e blindagem total de N\'Golo Kanté e Fabinho',
    coachName: 'Laurent Blanc',
    squad: [
      { id: 'itt_1', name: 'Predrag Rajković', position: 'GOL', ovr: 82, age: 29, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 10.0 },
      { id: 'itt_2', name: 'Danilo Pereira', position: 'ZAG', ovr: 81, age: 33, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 6.0 },
      { id: 'itt_3', name: 'Fabinho', position: 'VOL', ovr: 83, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 25.0, isStar: true },
      { id: 'itt_4', name: 'N\'Golo Kanté', position: 'MC', ovr: 85, age: 33, nationality: 'França', flag: '🇫🇷', marketValueEur: 15.0, isStar: true },
      { id: 'itt_5', name: 'Houssem Aouar', position: 'MEI', ovr: 81, age: 26, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 15.0 },
      { id: 'itt_6', name: 'Moussa Diaby', position: 'PD', ovr: 84, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 55.0, isStar: true },
      { id: 'itt_7', name: 'Steven Bergwijn', position: 'PE', ovr: 80, age: 27, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 18.0 },
      { id: 'itt_8', name: 'Karim Benzema', position: 'CA', ovr: 86, age: 37, nationality: 'França', flag: '🇫🇷', marketValueEur: 12.0, isStar: true }
    ]
  },
  'Al-Ahli': {
    id: 'al_ahli',
    name: 'Al-Ahli Saudi FC',
    shortName: 'Al-Ahli',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/43/Al-Ahli_Saudi_FC.png',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'King Abdullah Sports City (Jeddah)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 130.0,
    colors: { primary: '#005826', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ['Al-Ittihad', 'Al-Hilal'],
    playStyle: 'Ataque estelar de Premier League com Mahrez, Firmino e Ivan Toney',
    coachName: 'Matthias Jaissle',
    squad: [
      { id: 'ahl_1', name: 'Édouard Mendy', position: 'GOL', ovr: 82, age: 32, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 10.0, isStar: true },
      { id: 'ahl_2', name: 'Merih Demiral', position: 'ZAG', ovr: 81, age: 26, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 16.0 },
      { id: 'ahl_3', name: 'Franck Kessié', position: 'MC', ovr: 82, age: 28, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 18.0, isStar: true },
      { id: 'ahl_4', name: 'Gabri Veiga', position: 'MEI', ovr: 80, age: 22, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 25.0, isStar: true },
      { id: 'ahl_5', name: 'Riyad Mahrez', position: 'PD', ovr: 84, age: 33, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 16.0, isStar: true },
      { id: 'ahl_6', name: 'Roberto Firmino', position: 'CA', ovr: 82, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0, isStar: true },
      { id: 'ahl_7', name: 'Ivan Toney', position: 'CA', ovr: 83, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 45.0, isStar: true }
    ]
  },


  // ==========================================
  // PORTUGAL - PRIMEIRA LIGA (Expansao Oficial)
  // ==========================================
  "Vitória SC": {
    id: "vitoria_sc",
    name: "Vitória Sport Clube",
    shortName: "Vitória SC",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/8/82/Vitoria_Guimaraes.svg",
    leagueId: "primeira_liga",
    league: "Liga Portugal",
    country: "Portugal",
    stadium: "Estádio D. Afonso Henriques (Guimarães)",
    prestige: 3,
    formation: "4-3-3",
    budgetEur: 22.0,
    colors: { primary: "#ffffff", secondary: "#000000", text: "#000000" },
    rivalClubs: ["Braga", "Porto"],
    playStyle: "Paixão vitoriana, pressão em bloco médio e intensidade nas alas",
    coachName: "Rui Borges",
    squad: [
      { id: "vsc_1", name: "Bruno Varela", position: "GOL", ovr: 78, age: 29, nationality: "Cabo Verde", flag: "🇨🇻", marketValueEur: 4.0 },
      { id: "vsc_2", name: "Toni Borevković", position: "ZAG", ovr: 76, age: 27, nationality: "Croácia", flag: "🇭🇷", marketValueEur: 3.5 },
      { id: "vsc_3", name: "Tiago Silva", position: "MC", ovr: 77, age: 31, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 3.0 },
      { id: "vsc_4", name: "Nuno Santos", position: "MC", ovr: 76, age: 25, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 4.0 },
      { id: "vsc_5", name: "Kaio César", position: "PD", ovr: 75, age: 20, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 3.0 },
      { id: "vsc_6", name: "Nélson Oliveira", position: "CA", ovr: 75, age: 33, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 1.0 }
    ]
  },
  "Boavista": {
    id: "boavista",
    name: "Boavista FC",
    shortName: "Boavista",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/pt/4/41/Boavista_Futebol_Clube.svg",
    leagueId: "primeira_liga",
    league: "Liga Portugal",
    country: "Portugal",
    stadium: "Estádio do Bessa Século XXI",
    prestige: 3,
    formation: "4-2-3-1",
    budgetEur: 14.0,
    colors: { primary: "#000000", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Porto"],
    playStyle: "Tradição do Bessa, raça combativa e contra-ataques rápidos",
    coachName: "Cristiano Bacci",
    squad: [
      { id: "boa_1", name: "César", position: "GOL", ovr: 73, age: 29, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 1.0 },
      { id: "boa_2", name: "Rodrigo Abascal", position: "ZAG", ovr: 74, age: 30, nationality: "Uruguai", flag: "🇺🇾", marketValueEur: 1.2 },
      { id: "boa_3", name: "Sebastián Pérez", position: "VOL", ovr: 76, age: 31, nationality: "Colômbia", flag: "🇨🇴", marketValueEur: 2.5, isStar: true },
      { id: "boa_4", name: "Miguel Reisinho", position: "MC", ovr: 74, age: 25, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 2.0 },
      { id: "boa_5", name: "Salvador Agra", position: "PD", ovr: 74, age: 32, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 1.0 },
      { id: "boa_6", name: "Róbert Boženík", position: "CA", ovr: 77, age: 24, nationality: "Eslováquia", flag: "🇸🇰", marketValueEur: 5.0, isStar: true }
    ]
  },
  "Gil Vicente": {
    id: "gil_vicente",
    name: "Gil Vicente FC",
    shortName: "Gil Vicente",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/e/eb/Gil_Vicente_FC.svg",
    leagueId: "primeira_liga",
    league: "Liga Portugal",
    country: "Portugal",
    stadium: "Estádio Cidade de Barcelos",
    prestige: 2,
    formation: "4-3-3",
    budgetEur: 16.0,
    colors: { primary: "#dc2626", secondary: "#1e3a8a", text: "#ffffff" },
    rivalClubs: ["Braga", "Vitória SC"],
    playStyle: "Organização tática sólida e velocidade nos pontas",
    coachName: "Bruno Pinheiro",
    squad: [
      { id: "gil_1", name: "Andrew", position: "GOL", ovr: 76, age: 23, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 3.5 },
      { id: "gil_2", name: "Rúben Fernandes", position: "ZAG", ovr: 74, age: 38, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 0.5 },
      { id: "gil_3", name: "Kanya Fujimoto", position: "MEI", ovr: 76, age: 25, nationality: "Japão", flag: "🇯🇵", marketValueEur: 4.0, isStar: true },
      { id: "gil_4", name: "Félix Correia", position: "PE", ovr: 76, age: 23, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 4.5 },
      { id: "gil_5", name: "Jordi Mboula", position: "PD", ovr: 74, age: 25, nationality: "Espanha", flag: "🇪🇸", marketValueEur: 2.0 },
      { id: "gil_6", name: "Pablo", position: "CA", ovr: 74, age: 20, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 2.5 }
    ]
  },
  "Famalicão": {
    id: "famalicao",
    name: "FC Famalicão",
    shortName: "Famalicão",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/pt/d/d7/Futebol_Clube_de_Famalic%C3%A3o.png",
    leagueId: "primeira_liga",
    league: "Liga Portugal",
    country: "Portugal",
    stadium: "Estádio Municipal de Famalicão",
    prestige: 3,
    formation: "4-2-3-1",
    budgetEur: 20.0,
    colors: { primary: "#1e3a8a", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Braga", "Vitória SC"],
    playStyle: "Futebol jovem, pressão agressiva e muita criatividade",
    coachName: "Armando Evangelista",
    squad: [
      { id: "fam_1", name: "Ivan Zlobin", position: "GOL", ovr: 75, age: 27, nationality: "Rússia", flag: "🇷🇺", marketValueEur: 2.0 },
      { id: "fam_2", name: "Enea Mihaj", position: "ZAG", ovr: 75, age: 26, nationality: "Albânia", flag: "🇦🇱", marketValueEur: 3.0 },
      { id: "fam_3", name: "Mirko Topic", position: "VOL", ovr: 77, age: 23, nationality: "Sérvia", flag: "🇷🇸", marketValueEur: 5.0 },
      { id: "fam_4", name: "Gustavo Sá", position: "MEI", ovr: 77, age: 19, nationality: "Portugal", flag: "🇵🇹", marketValueEur: 8.0, isStar: true },
      { id: "fam_5", name: "Sorriso", position: "PD", ovr: 76, age: 23, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 4.0 },
      { id: "fam_6", name: "Óscar Aranda", position: "PE", ovr: 75, age: 22, nationality: "Espanha", flag: "🇪🇸", marketValueEur: 3.0 }
    ]
  },

  // ==========================================
  // HOLANDA - EREDIVISIE (Expansao Oficial)
  // ==========================================
  "Twente": {
    id: "twente",
    name: "FC Twente",
    shortName: "Twente",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/c/cc/FC_Twente.svg",
    leagueId: "eredivisie",
    league: "Eredivisie",
    country: "Holanda",
    stadium: "De Grolsch Veste (Enschede)",
    prestige: 3,
    formation: "4-2-3-1",
    budgetEur: 30.0,
    colors: { primary: "#dc2626", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Heracles", "Ajax"],
    playStyle: "Intensidade coletiva no caldeirão de Enschede e gols de Sem Steijn",
    coachName: "Joseph Oosting",
    squad: [
      { id: "twe_1", name: "Lars Unnerstall", position: "GOL", ovr: 81, age: 34, nationality: "Alemanha", flag: "🇩🇪", marketValueEur: 3.5 },
      { id: "twe_2", name: "Mees Hilgers", position: "ZAG", ovr: 78, age: 23, nationality: "Indonésia", flag: "🇮🇩", marketValueEur: 9.0 },
      { id: "twe_3", name: "Carel Eiting", position: "MC", ovr: 76, age: 26, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 3.0 },
      { id: "twe_4", name: "Sem Steijn", position: "MEI", ovr: 81, age: 22, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 15.0, isStar: true },
      { id: "twe_5", name: "Daan Rots", position: "PD", ovr: 77, age: 23, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 6.0 },
      { id: "twe_6", name: "Sam Lammers", position: "CA", ovr: 78, age: 27, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 5.0 }
    ]
  },
  "Utrecht": {
    id: "utrecht",
    name: "FC Utrecht",
    shortName: "Utrecht",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/FC_Utrecht.svg",
    leagueId: "eredivisie",
    league: "Eredivisie",
    country: "Holanda",
    stadium: "Stadion Galgenwaard",
    prestige: 3,
    formation: "4-3-3",
    budgetEur: 24.0,
    colors: { primary: "#dc2626", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Ajax"],
    playStyle: "Futebol direto, transições rápidas e organização compacta de Ron Jans",
    coachName: "Ron Jans",
    squad: [
      { id: "utr_1", name: "Vasilis Barkas", position: "GOL", ovr: 78, age: 30, nationality: "Grécia", flag: "🇬🇷", marketValueEur: 3.0 },
      { id: "utr_2", name: "Nick Viergever", position: "ZAG", ovr: 75, age: 35, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 0.8 },
      { id: "utr_3", name: "Paxten Aaronson", position: "MEI", ovr: 76, age: 21, nationality: "Estados Unidos", flag: "🇺🇸", marketValueEur: 4.5 },
      { id: "utr_4", name: "Taylor Booth", position: "PD", ovr: 76, age: 23, nationality: "Estados Unidos", flag: "🇺🇸", marketValueEur: 4.0 },
      { id: "utr_5", name: "Yoann Cathline", position: "PE", ovr: 75, age: 22, nationality: "França", flag: "🇫🇷", marketValueEur: 3.5 },
      { id: "utr_6", name: "Noah Ohio", position: "CA", ovr: 75, age: 21, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 3.0 }
    ]
  },

  // ==========================================
  // TURQUIA - SÜPER LIG (Expansao Oficial)
  // ==========================================
  "Basaksehir": {
    id: "basaksehir",
    name: "İstanbul Başakşehir FK",
    shortName: "Başakşehir",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/e/e0/%C4%B0stanbul_Ba%C5%9Fak%C5%9Fehir_logo.svg",
    leagueId: "super_lig",
    league: "Süper Lig",
    country: "Turquia",
    stadium: "Başakşehir Fatih Terim Stadyumu",
    prestige: 3,
    formation: "4-3-3",
    budgetEur: 28.0,
    colors: { primary: "#ea580c", secondary: "#1e3a8a", text: "#ffffff" },
    rivalClubs: ["Galatasaray", "Fenerbahçe", "Beşiktaş"],
    playStyle: "Futebol moderno de posse apoiada e faro de gol de Krzysztof Piątek",
    coachName: "Çağdaş Atan",
    squad: [
      { id: "bas_1", name: "Muhammed Şengezer", position: "GOL", ovr: 76, age: 27, nationality: "Turquia", flag: "🇹🇷", marketValueEur: 2.5 },
      { id: "bas_2", name: "Léo Duarte", position: "ZAG", ovr: 77, age: 28, nationality: "Brasil", flag: "🇧🇷", marketValueEur: 3.5 },
      { id: "bas_3", name: "Berkay Özcan", position: "MC", ovr: 77, age: 26, nationality: "Turquia", flag: "🇹🇷", marketValueEur: 4.0 },
      { id: "bas_4", name: "Deniz Türüç", position: "PD", ovr: 77, age: 31, nationality: "Turquia", flag: "🇹🇷", marketValueEur: 3.0 },
      { id: "bas_5", name: "Serdar Gürler", position: "PE", ovr: 76, age: 33, nationality: "Turquia", flag: "🇹🇷", marketValueEur: 1.5 },
      { id: "bas_6", name: "Krzysztof Piątek", position: "CA", ovr: 80, age: 29, nationality: "Polônia", flag: "🇵🇱", marketValueEur: 8.0, isStar: true }
    ]
  },
  "Samsunspor": {
    id: "samsunspor",
    name: "Samsunspor Club",
    shortName: "Samsunspor",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/Samsunspor_logo.png",
    leagueId: "super_lig",
    league: "Süper Lig",
    country: "Turquia",
    stadium: "Samsun 19 Mayıs Stadyumu",
    prestige: 2,
    formation: "4-2-3-1",
    budgetEur: 18.0,
    colors: { primary: "#dc2626", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Trabzonspor"],
    playStyle: "Sensação do Mar Negro com pressão alta e ritmo germânico de Thomas Reis",
    coachName: "Thomas Reis",
    squad: [
      { id: "sam_1", name: "Okan Kocuk", position: "GOL", ovr: 76, age: 29, nationality: "Turquia", flag: "🇹🇷", marketValueEur: 2.2 },
      { id: "sam_2", name: "Rick van Drongelen", position: "ZAG", ovr: 76, age: 25, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 3.0 },
      { id: "sam_3", name: "Youssef Aït Bennasser", position: "VOL", ovr: 76, age: 28, nationality: "Marrocos", flag: "🇲🇦", marketValueEur: 2.5 },
      { id: "sam_4", name: "Olivier Ntcham", position: "MC", ovr: 78, age: 28, nationality: "Camarões", flag: "🇨🇲", marketValueEur: 4.5, isStar: true },
      { id: "sam_5", name: "Carlo Holse", position: "MEI", ovr: 77, age: 25, nationality: "Dinamarca", flag: "🇩🇰", marketValueEur: 4.5 },
      { id: "sam_6", name: "Marius Mouandilmadji", position: "CA", ovr: 76, age: 26, nationality: "Chade", flag: "🇹🇩", marketValueEur: 3.0 }
    ]
  },

  // ==========================================
  // ESCÓCIA - SCOTTISH PREMIERSHIP (Expansao Oficial)
  // ==========================================
  "Hibernian": {
    id: "hibernian",
    name: "Hibernian FC",
    shortName: "Hibs",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/9/9e/Hibernian_FC_logo.svg",
    leagueId: "scottish_premiership",
    league: "Premiership",
    country: "Escócia",
    stadium: "Easter Road Stadium (Edinburgh)",
    prestige: 3,
    formation: "4-2-3-1",
    budgetEur: 18.0,
    colors: { primary: "#15803d", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Heart of Midlothian", "Celtic"],
    playStyle: "Clássico dérbi de Edimburgo, ritmo elétrico e velocidade pelas pontas",
    coachName: "David Gray",
    squad: [
      { id: "hib_1", name: "Josef Bursik", position: "GOL", ovr: 74, age: 24, nationality: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", marketValueEur: 1.5 },
      { id: "hib_2", name: "Rocky Bushiri", position: "ZAG", ovr: 74, age: 24, nationality: "RD Congo", flag: "🇨🇩", marketValueEur: 1.5 },
      { id: "hib_3", name: "Joe Newell", position: "MC", ovr: 75, age: 31, nationality: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", marketValueEur: 1.2 },
      { id: "hib_4", name: "Martin Boyle", position: "PD", ovr: 76, age: 31, nationality: "Austrália", flag: "🇦🇺", marketValueEur: 2.0, isStar: true },
      { id: "hib_5", name: "Élie Youan", position: "PE", ovr: 75, age: 25, nationality: "França", flag: "🇫🇷", marketValueEur: 2.5 },
      { id: "hib_6", name: "Kieron Bowie", position: "CA", ovr: 74, age: 21, nationality: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", marketValueEur: 2.0 }
    ]
  },
  "Motherwell": {
    id: "motherwell",
    name: "Motherwell FC",
    shortName: "Motherwell",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/9/99/Motherwell_FC_crest.svg",
    leagueId: "scottish_premiership",
    league: "Premiership",
    country: "Escócia",
    stadium: "Fir Park",
    prestige: 2,
    formation: "3-5-2",
    budgetEur: 12.0,
    colors: { primary: "#ea580c", secondary: "#831843", text: "#ffffff" },
    rivalClubs: ["Hamilton", "Aberdeen"],
    playStyle: "Futebol operário escocês, raça em bolas aéreas e jogo direto",
    coachName: "Stuart Kettlewell",
    squad: [
      { id: "mot_1", name: "Aston Oxborough", position: "GOL", ovr: 73, age: 26, nationality: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", marketValueEur: 0.8 },
      { id: "mot_2", name: "Paul McGinn", position: "ZAG", ovr: 73, age: 33, nationality: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", marketValueEur: 0.6 },
      { id: "mot_3", name: "Lennon Miller", position: "MC", ovr: 76, age: 18, nationality: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", marketValueEur: 5.0, isStar: true },
      { id: "mot_4", name: "Andy Halliday", position: "VOL", ovr: 73, age: 32, nationality: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", marketValueEur: 0.6 },
      { id: "mot_5", name: "Apostolos Stamatelopoulos", position: "CA", ovr: 74, age: 25, nationality: "Austrália", flag: "🇦🇺", marketValueEur: 1.5 },
      { id: "mot_6", name: "Zach Robinson", position: "CA", ovr: 72, age: 22, nationality: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", marketValueEur: 0.8 }
    ]
  },

  // ==========================================
  // BÉLGICA - PRO LEAGUE (Expansao Oficial)
  // ==========================================
  "Genk": {
    id: "genk",
    name: "KRC Genk",
    shortName: "Genk",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/f/f6/KRC_Genk_logo_2016.svg",
    leagueId: "pro_league_bel",
    league: "Pro League",
    country: "Bélgica",
    stadium: "Cegeka Arena",
    prestige: 4,
    formation: "4-2-3-1",
    budgetEur: 45.0,
    colors: { primary: "#1e40af", secondary: "#ffffff", text: "#ffffff" },
    rivalClubs: ["Club Brugge", "Standard Liège"],
    playStyle: "Futebol formador de elite mundial, velocidade fulminante e Tolu no ataque",
    coachName: "Thorsten Fink",
    squad: [
      { id: "gnk_1", name: "Hendrik Van Crombrugge", position: "GOL", ovr: 77, age: 31, nationality: "Bélgica", flag: "🇧🇪", marketValueEur: 2.0 },
      { id: "gnk_2", name: "Mujaid Sadick", position: "ZAG", ovr: 77, age: 24, nationality: "Espanha", flag: "🇪🇸", marketValueEur: 5.0 },
      { id: "gnk_3", name: "Bryan Heynen", position: "MC", ovr: 79, age: 27, nationality: "Bélgica", flag: "🇧🇪", marketValueEur: 8.0, isStar: true },
      { id: "gnk_4", name: "Patrik Hrošovský", position: "VOL", ovr: 78, age: 32, nationality: "Eslováquia", flag: "🇸🇰", marketValueEur: 3.5 },
      { id: "gnk_5", name: "Jarne Steuckers", position: "MEI", ovr: 77, age: 22, nationality: "Bélgica", flag: "🇧🇪", marketValueEur: 6.0 },
      { id: "gnk_6", name: "Tolu Arokodare", position: "CA", ovr: 80, age: 23, nationality: "Nigéria", flag: "🇳🇬", marketValueEur: 12.0, isStar: true }
    ]
  },
  "Union SG": {
    id: "union_sg",
    name: "Royale Union Saint-Gilloise",
    shortName: "Union SG",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/e/ed/Royale_Union_Saint-Gilloise_logo.svg",
    leagueId: "pro_league_bel",
    league: "Pro League",
    country: "Bélgica",
    stadium: "Stade Joseph Marien (Bruxelas)",
    prestige: 4,
    formation: "3-5-2",
    budgetEur: 40.0,
    colors: { primary: "#eab308", secondary: "#1e3a8a", text: "#000000" },
    rivalClubs: ["Anderlecht", "Club Brugge"],
    playStyle: "Pressão sufocante, intensidade tática coletiva e transição vertical",
    coachName: "Sébastien Pocognoli",
    squad: [
      { id: "usg_1", name: "Anthony Moris", position: "GOL", ovr: 78, age: 34, nationality: "Luxemburgo", flag: "🇱🇺", marketValueEur: 2.0 },
      { id: "usg_2", name: "Christian Burgess", position: "ZAG", ovr: 77, age: 32, nationality: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", marketValueEur: 1.5 },
      { id: "usg_3", name: "Koki Machida", position: "ZAG", ovr: 79, age: 27, nationality: "Japão", flag: "🇯🇵", marketValueEur: 10.0, isStar: true },
      { id: "usg_4", name: "Noah Sadiki", position: "VOL", ovr: 77, age: 19, nationality: "RD Congo", flag: "🇨🇩", marketValueEur: 7.0 },
      { id: "usg_5", name: "Alessio Castro-Montes", position: "LD", ovr: 78, age: 27, nationality: "Bélgica", flag: "🇧🇪", marketValueEur: 5.5 },
      { id: "usg_6", name: "Promise David", position: "CA", ovr: 76, age: 23, nationality: "Canadá", flag: "🇨🇦", marketValueEur: 3.5 }
    ]
  },

  // ==========================================
  // ARÁBIA SAUDITA - SAUDI LEAGUE (Expansao Oficial)
  // ==========================================
  "Al-Shabab": {
    id: "al_shabab",
    name: "Al-Shabab FC",
    shortName: "Al-Shabab",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/9/91/Al_Shabab_FC_%28Riyadh%29_logo.svg",
    leagueId: "saudi_pro",
    league: "Saudi League",
    country: "Arábia Saudita",
    stadium: "Al-Shabab Club Stadium (Riyadh)",
    prestige: 3,
    formation: "4-2-3-1",
    budgetEur: 70.0,
    colors: { primary: "#ffffff", secondary: "#000000", text: "#000000" },
    rivalClubs: ["Al-Hilal", "Al-Nassr"],
    playStyle: "Controle técnico experiente com Giacomo Bonaventura e velocidade de Carrasco",
    coachName: "Vítor Pereira",
    squad: [
      { id: "shb_1", name: "Kim Seung-gyu", position: "GOL", ovr: 79, age: 33, nationality: "Coreia do Sul", flag: "🇰🇷", marketValueEur: 2.0 },
      { id: "shb_2", name: "Wesley Hoedt", position: "ZAG", ovr: 79, age: 30, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 4.0 },
      { id: "shb_3", name: "Gustavo Cuéllar", position: "VOL", ovr: 78, age: 31, nationality: "Colômbia", flag: "🇨🇴", marketValueEur: 4.0 },
      { id: "shb_4", name: "Giacomo Bonaventura", position: "MC", ovr: 80, age: 34, nationality: "Itália", flag: "🇮🇹", marketValueEur: 3.5, isStar: true },
      { id: "shb_5", name: "Yannick Carrasco", position: "PE", ovr: 82, age: 30, nationality: "Bélgica", flag: "🇧🇪", marketValueEur: 14.0, isStar: true },
      { id: "shb_6", name: "Abderrazak Hamdallah", position: "CA", ovr: 80, age: 33, nationality: "Marrocos", flag: "🇲🇦", marketValueEur: 3.0 }
    ]
  },
  "Al-Ettifaq": {
    id: "al_ettifaq",
    name: "Al-Ettifaq FC",
    shortName: "Al-Ettifaq",
    badgeUrl: "https://upload.wikimedia.org/wikipedia/en/e/e3/Al-Ettifaq_FC_logo.svg",
    leagueId: "saudi_pro",
    league: "Saudi League",
    country: "Arábia Saudita",
    stadium: "Al-Ettifaq Club Stadium (Dammam)",
    prestige: 3,
    formation: "4-3-3",
    budgetEur: 65.0,
    colors: { primary: "#15803d", secondary: "#dc2626", text: "#ffffff" },
    rivalClubs: ["Al-Fateh", "Al-Qadsiah"],
    playStyle: "Intensidade física e meio-campo operário comandado por Steven Gerrard",
    coachName: "Steven Gerrard",
    squad: [
      { id: "ett_1", name: "Marek Rodák", position: "GOL", ovr: 77, age: 27, nationality: "Eslováquia", flag: "🇸🇰", marketValueEur: 3.0 },
      { id: "ett_2", name: "Jack Hendry", position: "ZAG", ovr: 77, age: 29, nationality: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", marketValueEur: 3.0 },
      { id: "ett_3", name: "Georginio Wijnaldum", position: "MC", ovr: 80, age: 33, nationality: "Holanda", flag: "🇳🇱", marketValueEur: 4.0, isStar: true },
      { id: "ett_4", name: "Seko Fofana", position: "MC", ovr: 81, age: 29, nationality: "Costa do Marfim", flag: "🇨🇮", marketValueEur: 16.0, isStar: true },
      { id: "ett_5", name: "Karl Toko Ekambi", position: "PE", ovr: 78, age: 31, nationality: "Camarões", flag: "🇨🇲", marketValueEur: 3.5 },
      { id: "ett_6", name: "Moussa Dembélé", position: "CA", ovr: 79, age: 28, nationality: "França", flag: "🇫🇷", marketValueEur: 10.0, isStar: true }
    ]
  },

  'West Ham United': {
    id: 'west_ham',
    name: 'West Ham United FC',
    shortName: 'West Ham',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'London Stadium',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 75.0,
    colors: { primary: '#7A263A', secondary: '#1BB1E7', text: '#ffffff' },
    rivalClubs: ["Tottenham Hotspur", "Chelsea"],
    playStyle: 'Futebol vertical pelos lados com bola aérea potente',
    coachName: 'Julen Lopetegui',
    squad: [
      { id: 'whu_1', name: 'Alphonse Areola', position: 'GOL', ovr: 80, age: 31, nationality: 'França', flag: '🇫🇷', marketValueEur: 10.0 },
      { id: 'whu_2', name: 'Max Kilman', position: 'ZAG', ovr: 81, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 35.0 },
      { id: 'whu_3', name: 'Lucas Paquetá', position: 'MEI', ovr: 84, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 65.0, isStar: true },
      { id: 'whu_4', name: 'Mohammed Kudus', position: 'PD', ovr: 83, age: 24, nationality: 'Gana', flag: '🇬🇭', marketValueEur: 50.0, isStar: true },
      { id: 'whu_5', name: 'Jarrod Bowen', position: 'CA', ovr: 82, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 50.0 }
    ]
  },
  'Fulham': {
    id: 'fulham',
    name: 'Fulham FC',
    shortName: 'Fulham',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Craven Cottage',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 55.0,
    colors: { primary: '#000000', secondary: '#CC0000', text: '#ffffff' },
    rivalClubs: ["Chelsea", "Brentford"],
    playStyle: 'Pressão alta agressiva e transição veloz pelos flancos',
    coachName: 'Marco Silva',
    squad: [
      { id: 'ful_1', name: 'Bernd Leno', position: 'GOL', ovr: 81, age: 32, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 13.0 },
      { id: 'ful_2', name: 'Joachim Andersen', position: 'ZAG', ovr: 81, age: 28, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 35.0 },
      { id: 'ful_3', name: 'Andreas Pereira', position: 'MEI', ovr: 80, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 20.0, isStar: true },
      { id: 'ful_4', name: 'Adama Traoré', position: 'PD', ovr: 78, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 10.0 },
      { id: 'ful_5', name: 'Raúl Jiménez', position: 'CA', ovr: 79, age: 33, nationality: 'México', flag: '🇲🇽', marketValueEur: 6.0 }
    ]
  },
  'Bournemouth': {
    id: 'bournemouth',
    name: 'AFC Bournemouth',
    shortName: 'Bournemouth',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Vitality Stadium',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 50.0,
    colors: { primary: '#DA291C', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Southampton"],
    playStyle: 'Intensidade sufocante de Andoni Iraola e recuperação no campo ofensivo',
    coachName: 'Andoni Iraola',
    squad: [
      { id: 'bou_1', name: 'Kepa Arrizabalaga', position: 'GOL', ovr: 80, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 12.0 },
      { id: 'bou_2', name: 'Illia Zabarnyi', position: 'ZAG', ovr: 80, age: 22, nationality: 'Ucrânia', flag: '🇺🇦', marketValueEur: 32.0 },
      { id: 'bou_3', name: 'Antoine Semenyo', position: 'PE', ovr: 80, age: 24, nationality: 'Gana', flag: '🇬🇭', marketValueEur: 25.0, isStar: true },
      { id: 'bou_4', name: 'Evanilson', position: 'CA', ovr: 81, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 35.0, isStar: true }
    ]
  },
  'Brentford': {
    id: 'brentford',
    name: 'Brentford FC',
    shortName: 'Brentford',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Gtech Community Stadium',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 45.0,
    colors: { primary: '#e30613', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Fulham", "Chelsea"],
    playStyle: 'Futebol analítico de dados, bolas paradas mortais e ritmo frenético',
    coachName: 'Thomas Frank',
    squad: [
      { id: 'bre_1', name: 'Mark Flekken', position: 'GOL', ovr: 79, age: 31, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 12.0 },
      { id: 'bre_2', name: 'Nathan Collins', position: 'ZAG', ovr: 79, age: 23, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 25.0 },
      { id: 'bre_3', name: 'Bryan Mbeumo', position: 'PD', ovr: 83, age: 25, nationality: 'Camarões', flag: '🇨🇲', marketValueEur: 40.0, isStar: true },
      { id: 'bre_4', name: 'Yoane Wissa', position: 'PE', ovr: 80, age: 28, nationality: 'RD Congo', flag: '🇨🇩', marketValueEur: 28.0 }
    ]
  },
  'Nottingham Forest': {
    id: 'nottingham',
    name: 'Nottingham Forest FC',
    shortName: 'Nottm Forest',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'City Ground',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 60.0,
    colors: { primary: '#DD0000', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Derby County", "Leicester City"],
    playStyle: 'Bloco baixo compacto com contra-ataques cirúrgicos liderados por Gibbs-White',
    coachName: 'Nuno Espírito Santo',
    squad: [
      { id: 'nfo_1', name: 'Matz Sels', position: 'GOL', ovr: 80, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 8.0 },
      { id: 'nfo_2', name: 'Murillo', position: 'ZAG', ovr: 82, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 40.0, isStar: true },
      { id: 'nfo_3', name: 'Morgan Gibbs-White', position: 'MEI', ovr: 82, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 45.0, isStar: true },
      { id: 'nfo_4', name: 'Chris Wood', position: 'CA', ovr: 80, age: 32, nationality: 'Nova Zelândia', flag: '🇳🇿', marketValueEur: 10.0 }
    ]
  },
  'Crystal Palace': {
    id: 'crystal_palace',
    name: 'Crystal Palace FC',
    shortName: 'Crystal Palace',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Selhurst Park',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 55.0,
    colors: { primary: '#1B458F', secondary: '#C4122E', text: '#ffffff' },
    rivalClubs: ["Brighton & Hove Albion"],
    playStyle: 'Linha de três dinâmica de Oliver Glasner com aproximações rápidas',
    coachName: 'Oliver Glasner',
    squad: [
      { id: 'cry_1', name: 'Dean Henderson', position: 'GOL', ovr: 79, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 15.0 },
      { id: 'cry_2', name: 'Marc Guéhi', position: 'ZAG', ovr: 82, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 45.0, isStar: true },
      { id: 'cry_3', name: 'Eberechi Eze', position: 'MEI', ovr: 83, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 60.0, isStar: true },
      { id: 'cry_4', name: 'Jean-Philippe Mateta', position: 'CA', ovr: 80, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 25.0 }
    ]
  },
  'Wolverhampton': {
    id: 'wolves',
    name: 'Wolverhampton Wanderers FC',
    shortName: 'Wolves',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Molineux Stadium',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#FDB913', secondary: '#231F20', text: '#000000' },
    rivalClubs: ["West Bromwich Albion", "Aston Villa"],
    playStyle: 'Duelos físicos duros e velocidade de Matheus Cunha no ataque',
    coachName: "Gary O'Neil",
    squad: [
      { id: 'wol_1', name: 'José Sá', position: 'GOL', ovr: 79, age: 31, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 12.0 },
      { id: 'wol_2', name: 'João Gomes', position: 'VOL', ovr: 81, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 40.0, isStar: true },
      { id: 'wol_3', name: 'Matheus Cunha', position: 'CA', ovr: 83, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 50.0, isStar: true }
    ]
  },
  'Everton': {
    id: 'everton',
    name: 'Everton FC',
    shortName: 'Everton',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_crest.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Goodison Park',
    prestige: 4,
    formation: '4-4-1-1',
    budgetEur: 40.0,
    colors: { primary: '#003399', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Liverpool"],
    playStyle: 'Futebol pragmático de Sean Dyche, bolas paradas e entrega física extrema',
    coachName: 'Sean Dyche',
    squad: [
      { id: 'eve_1', name: 'Jordan Pickford', position: 'GOL', ovr: 82, age: 30, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 22.0, isStar: true },
      { id: 'eve_2', name: 'Jarrad Branthwaite', position: 'ZAG', ovr: 82, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 50.0, isStar: true },
      { id: 'eve_3', name: 'Dwight McNeil', position: 'MEI', ovr: 80, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 25.0 },
      { id: 'eve_4', name: 'Dominic Calvert-Lewin', position: 'CA', ovr: 79, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 22.0 }
    ]
  },
  'Ipswich Town': {
    id: 'ipswich',
    name: 'Ipswich Town FC',
    shortName: 'Ipswich Town',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: 'Portman Road',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#004499', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Norwich City"],
    playStyle: 'Futebol corajoso e ofensivo de Kieran McKenna',
    coachName: 'Kieran McKenna',
    squad: [
      { id: 'ips_1', name: 'Arijanet Muric', position: 'GOL', ovr: 77, age: 25, nationality: 'Kosovo', flag: '🇽🇰', marketValueEur: 8.0 },
      { id: 'ips_2', name: 'Liam Delap', position: 'CA', ovr: 79, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 25.0, isStar: true }
    ]
  },
  'Southampton': {
    id: 'southampton',
    name: 'Southampton FC',
    shortName: 'Southampton',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg',
    leagueId: 'premier_league',
    league: 'Premier League',
    country: 'Inglaterra',
    stadium: "St Mary's Stadium",
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 40.0,
    colors: { primary: '#D71920', secondary: '#130C0E', text: '#ffffff' },
    rivalClubs: ["Portsmouth"],
    playStyle: 'Posse de bola paciente e construção apoiada desde o goleiro',
    coachName: 'Russell Martin',
    squad: [
      { id: 'sou_1', name: 'Aaron Ramsdale', position: 'GOL', ovr: 80, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 25.0, isStar: true },
      { id: 'sou_2', name: 'Cameron Archer', position: 'CA', ovr: 77, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 18.0 }
    ]
  },
  'Burnley': {
    id: 'burnley',
    name: 'Burnley FC',
    shortName: 'Burnley',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Turf Moor',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#6C1D45', secondary: '#99D6EA', text: '#ffffff' },
    rivalClubs: ["Blackburn Rovers"],
    playStyle: 'Futebol veloz de transição de Scott Parker buscando retorno imediato',
    coachName: 'Scott Parker',
    squad: [
      { id: 'bur_1', name: 'James Trafford', position: 'GOL', ovr: 78, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 18.0, isStar: true },
      { id: 'bur_2', name: 'Josh Brownhill', position: 'MC', ovr: 78, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 15.0 },
      { id: 'bur_3', name: 'Lyle Foster', position: 'CA', ovr: 76, age: 24, nationality: 'África do Sul', flag: '🇿🇦', marketValueEur: 12.0 }
    ]
  },
  'Sheffield United': {
    id: 'sheffield_utd',
    name: 'Sheffield United FC',
    shortName: 'Sheff Utd',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Bramall Lane',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 40.0,
    colors: { primary: '#EE2737', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Sheffield Wednesday"],
    playStyle: 'Batalha física feroz em Bramall Lane com zagueiros sobrepostos de Chris Wilder',
    coachName: 'Chris Wilder',
    squad: [
      { id: 'shu_1', name: 'Michael Cooper', position: 'GOL', ovr: 76, age: 25, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 6.0 },
      { id: 'shu_2', name: 'Vinicius Souza', position: 'VOL', ovr: 78, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 14.0, isStar: true },
      { id: 'shu_3', name: 'Kieffer Moore', position: 'CA', ovr: 75, age: 32, nationality: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', marketValueEur: 3.0 }
    ]
  },
  'West Bromwich Albion': {
    id: 'west_brom',
    name: 'West Bromwich Albion FC',
    shortName: 'West Brom',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'The Hawthorns',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#122F67', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Wolverhampton Wanderers", "Aston Villa"],
    playStyle: 'Estrutura defensiva de ferro de Carlos Corberán e contragolpes cirúrgicos',
    coachName: 'Carlos Corberán',
    squad: [
      { id: 'wba_1', name: 'Alex Palmer', position: 'GOL', ovr: 76, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 5.0 },
      { id: 'wba_2', name: 'Alex Mowatt', position: 'MC', ovr: 75, age: 29, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.5 },
      { id: 'wba_3', name: 'Josh Maja', position: 'CA', ovr: 77, age: 25, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Middlesbrough': {
    id: 'middlesbrough',
    name: 'Middlesbrough FC',
    shortName: 'Middlesbrough',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Middlesbrough_FC_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Riverside Stadium',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#D00027', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Sunderland", "Newcastle United"],
    playStyle: 'Futebol envolvente e moderno implementado por Michael Carrick',
    coachName: 'Michael Carrick',
    squad: [
      { id: 'mid_1', name: 'Seny Dieng', position: 'GOL', ovr: 76, age: 29, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 4.0 },
      { id: 'mid_2', name: 'Hayden Hackney', position: 'MC', ovr: 77, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 10.0, isStar: true },
      { id: 'mid_3', name: 'Emmanuel Latte Lath', position: 'CA', ovr: 77, age: 25, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Norwich City': {
    id: 'norwich',
    name: 'Norwich City FC',
    shortName: 'Norwich City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Norwich_City.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Carrow Road',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#FFF200', secondary: '#00A651', text: '#000000' },
    rivalClubs: ["Ipswich Town"],
    playStyle: 'Futebol dinamarquês veloz e apoio massivo da torcida de Carrow Road',
    coachName: 'Johannes Hoff Thorup',
    squad: [
      { id: 'nor_1', name: 'Angus Gunn', position: 'GOL', ovr: 76, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 4.0 },
      { id: 'nor_2', name: 'Marcelino Núñez', position: 'MC', ovr: 76, age: 24, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 6.0 },
      { id: 'nor_3', name: 'Josh Sargent', position: 'CA', ovr: 78, age: 24, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 14.0, isStar: true }
    ]
  },
  'Watford': {
    id: 'watford',
    name: 'Watford FC',
    shortName: 'Watford',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Vicarage Road',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 30.0,
    colors: { primary: '#FBEE23', secondary: '#ED2127', text: '#000000' },
    rivalClubs: ["Luton Town"],
    playStyle: 'Intensidade física com transições agressivas comandadas por Tom Cleverley',
    coachName: 'Tom Cleverley',
    squad: [
      { id: 'wat_1', name: 'Daniel Bachmann', position: 'GOL', ovr: 75, age: 30, nationality: 'Áustria', flag: '🇦🇹', marketValueEur: 2.5 },
      { id: 'wat_2', name: 'Moussa Sissoko', position: 'MC', ovr: 76, age: 35, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.0 },
      { id: 'wat_3', name: 'Vakoun Bayo', position: 'CA', ovr: 75, age: 27, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 3.0 }
    ]
  },
  'Coventry City': {
    id: 'coventry',
    name: 'Coventry City FC',
    shortName: 'Coventry',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/94/Coventry_City_FC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Coventry Building Society Arena',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#00AEEF', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Leicester City", "Aston Villa"],
    playStyle: 'Futebol audacioso com velocidade mortal de Haji Wright',
    coachName: 'Frank Lampard',
    squad: [
      { id: 'cov_1', name: 'Oliver Dovin', position: 'GOL', ovr: 74, age: 22, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 3.5 },
      { id: 'cov_2', name: 'Jack Rudoni', position: 'MC', ovr: 75, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 6.0 },
      { id: 'cov_3', name: 'Haji Wright', position: 'CA', ovr: 77, age: 26, nationality: 'Estados Unidos', flag: '🇺🇸', marketValueEur: 10.0, isStar: true }
    ]
  },
  'Luton Town': {
    id: 'luton',
    name: 'Luton Town FC',
    shortName: 'Luton',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Kenilworth Road',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 35.0,
    colors: { primary: '#F78F1E', secondary: '#002D62', text: '#ffffff' },
    rivalClubs: ["Watford"],
    playStyle: 'Pressão asfixiante e cruzamentos implacáveis em Kenilworth Road',
    coachName: 'Rob Edwards',
    squad: [
      { id: 'lut_1', name: 'Thomas Kaminski', position: 'GOL', ovr: 77, age: 31, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 5.0 },
      { id: 'lut_2', name: 'Carlton Morris', position: 'CA', ovr: 77, age: 28, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 9.0, isStar: true },
      { id: 'lut_3', name: 'Elijah Adebayo', position: 'CA', ovr: 76, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 8.0 }
    ]
  },
  'Red Bull Bragantino': {
    id: 'bragantino',
    name: 'Red Bull Bragantino',
    shortName: 'Bragantino',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/9/9e/RedBullBragantino.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Nabi Abi Chedid',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#e30613', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Ponte Preta", "Palmeiras"],
    playStyle: 'Intensidade física europeia com jovens promissores e pressão sufocante',
    coachName: 'Fernando Seabra',
    squad: [
      { id: 'brg_1', name: 'Cleiton', position: 'GOL', ovr: 78, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 6.0 },
      { id: 'brg_2', name: 'Eduardo Santos', position: 'ZAG', ovr: 76, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0 },
      { id: 'brg_3', name: 'Lucas Evangelista', position: 'MC', ovr: 79, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0, isStar: true },
      { id: 'brg_4', name: 'Eduardo Sasha', position: 'CA', ovr: 77, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5 }
    ]
  },
  'Vitória': {
    id: 'vitoria_ba',
    name: 'EC Vitória',
    shortName: 'Vitória',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/44/Esporte_Clube_Vit%C3%B3ria_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Barradão',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 15.0,
    colors: { primary: '#ff0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Bahia"],
    playStyle: 'Força no caldeirão do Barradão, contra-ataques velozes e entrega total',
    coachName: 'Thiago Carpini',
    squad: [
      { id: 'vit_1', name: 'Lucas Arcanjo', position: 'GOL', ovr: 77, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0 },
      { id: 'vit_2', name: 'Wagner Leonardo', position: 'ZAG', ovr: 78, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5, isStar: true },
      { id: 'vit_3', name: 'Matheuzinho', position: 'MEI', ovr: 79, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 5.0, isStar: true },
      { id: 'vit_4', name: 'Alerrandro', position: 'CA', ovr: 77, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0 }
    ]
  },
  'Criciúma': {
    id: 'criciuma',
    name: 'Criciúma EC',
    shortName: 'Criciúma',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Crici%C3%BAma_EC_crest.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Heriberto Hülse (Majestoso)',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 12.0,
    colors: { primary: '#f8c300', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Chapecoense", "Avaí"],
    playStyle: 'Pressão impulsionada pela torcida carvoeira e criatividade de Bolasie',
    coachName: 'Cláudio Tencati',
    squad: [
      { id: 'cri_1', name: 'Gustavo', position: 'GOL', ovr: 76, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'cri_2', name: 'Fellipe Mateus', position: 'MEI', ovr: 77, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'cri_3', name: 'Yannick Bolasie', position: 'PE', ovr: 78, age: 35, nationality: 'RD Congo', flag: '🇨🇩', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Juventude': {
    id: 'juventude',
    name: 'EC Juventude',
    shortName: 'Juventude',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Juventude_logo.svg',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Alfredo Jaconi',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 10.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Caxias", "Grêmio", "Internacional"],
    playStyle: 'Futebol combativo sob neblina da serra gaúcha com Nenê orquestrando lances',
    coachName: 'Fábio Matias',
    squad: [
      { id: 'juv_1', name: 'Gabriel Vasconcelos', position: 'GOL', ovr: 76, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'juv_2', name: 'Nenê', position: 'MEI', ovr: 77, age: 43, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5, isStar: true },
      { id: 'juv_3', name: 'Gilberto', position: 'CA', ovr: 76, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 }
    ]
  },
  'Cuiabá': {
    id: 'cuiaba',
    name: 'Cuiabá EC',
    shortName: 'Cuiabá',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/43/Cuiaba_EC.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Arena Pantanal',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 12.0,
    colors: { primary: '#00552b', secondary: '#f0b400', text: '#ffffff' },
    rivalClubs: ["Mixto"],
    playStyle: 'Jogo físico resistente ao calor pantaneiro e bolas longas em Isidro Pitta',
    coachName: 'Bernardo Franco',
    squad: [
      { id: 'cui_1', name: 'Walter', position: 'GOL', ovr: 78, age: 36, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true },
      { id: 'cui_2', name: 'Isidro Pitta', position: 'CA', ovr: 78, age: 25, nationality: 'Paraguai', flag: '🇵🇾', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Atlético Goianiense': {
    id: 'atletico_go',
    name: 'Atlético Clube Goianiense',
    shortName: 'Atlético-GO',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/AtleticoGoianiense.png',
    leagueId: 'serie_a',
    league: 'Brasileirão Série A',
    country: 'Brasil',
    stadium: 'Antônio Accioly',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 10.0,
    colors: { primary: '#cc0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Goiás", "Vila Nova"],
    playStyle: 'Raça no Castelo do Dragão e ataques pelas pontas em velocidade',
    coachName: 'Umberto Louzer',
    squad: [
      { id: 'atg_1', name: 'Ronaldo', position: 'GOL', ovr: 77, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5 },
      { id: 'atg_2', name: 'Shaylon', position: 'MEI', ovr: 78, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0, isStar: true },
      { id: 'atg_3', name: 'Luiz Fernando', position: 'PE', ovr: 77, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0 }
    ]
  },
  'Vila Nova': {
    id: 'vila_nova',
    name: 'Vila Nova FC',
    shortName: 'Vila Nova',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Vila_Nova_FC.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Onésio Brasileiro Alvarenga (OBA)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 6.0,
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Goiás", "Atlético-GO"],
    playStyle: 'Pressão feroz no caldeirão do OBA com apoio ensurdecedor da torcida',
    coachName: 'Thiago Carvalho',
    squad: [
      { id: 'vil_1', name: 'Dênis Júnior', position: 'GOL', ovr: 75, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 },
      { id: 'vil_2', name: 'Alesson', position: 'PE', ovr: 76, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Operário Ferroviário': {
    id: 'operario',
    name: 'Operário Ferroviário EC',
    shortName: 'Operário-PR',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Oper%C3%A1rio_Ferrovi%C3%A1rio_Esporte_Clube.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Germano Krüger',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 5.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Coritiba", "Athletico-PR"],
    playStyle: 'Futebol disciplinado e sólido em Ponta Grossa',
    coachName: 'Rafael Guanaes',
    squad: [
      { id: 'ope_1', name: 'Rafael Santos', position: 'GOL', ovr: 74, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 },
      { id: 'ope_2', name: 'Boschilia', position: 'MEI', ovr: 76, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Avaí': {
    id: 'avai',
    name: 'Avaí FC',
    shortName: 'Avaí',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Avai_FC_%2805-E%29.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Ressacada',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 8.0,
    colors: { primary: '#005baa', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Figueirense", "Chapecoense"],
    playStyle: 'Força na Ilha da Magia com cruzamentos e raça azurra',
    coachName: 'Enderson Moreira',
    squad: [
      { id: 'ava_1', name: 'César Augusto', position: 'GOL', ovr: 75, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 },
      { id: 'ava_2', name: 'Giovanni', position: 'MEI', ovr: 76, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Chapecoense': {
    id: 'chapecoense',
    name: 'Associação Chapecoense de Futebol',
    shortName: 'Chapecoense',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Chapecoense_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Arena Condá',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 6.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Avaí", "Criciúma"],
    playStyle: 'Espirito guerreiro incondicional na Arena Condá e contra-ataques velozes',
    coachName: 'Gilmar Dal Pozzo',
    squad: [
      { id: 'cha_1', name: 'Léo Vieira', position: 'GOL', ovr: 75, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.6 },
      { id: 'cha_2', name: 'Mário Sérgio', position: 'CA', ovr: 75, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'CRB': {
    id: 'crb',
    name: 'Clube de Regatas Brasil',
    shortName: 'CRB',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ae/CRB_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Rei Pelé (Trapichão)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 6.0,
    colors: { primary: '#dc2626', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["CSA"],
    playStyle: 'Calor de Maceió, jogadas aéreas com Anselmo Ramon e valentia alvirrubra',
    coachName: 'Hélio dos Anjos',
    squad: [
      { id: 'crb_1', name: 'Matheus Albino', position: 'GOL', ovr: 75, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'crb_2', name: 'Gegê', position: 'MEI', ovr: 76, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5 },
      { id: 'crb_3', name: 'Anselmo Ramon', position: 'CA', ovr: 77, age: 36, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2, isStar: true }
    ]
  },
  'Ponte Preta': {
    id: 'ponte_preta',
    name: 'Associação Atlética Ponte Preta',
    shortName: 'Ponte Preta',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Ponte_Preta_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Moisés Lucarelli (Majestoso)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 5.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Guarani"],
    playStyle: 'Tradicional raça campineira da Macaca empurrada pelo Majestoso',
    coachName: 'Nelsinho Baptista',
    squad: [
      { id: 'pon_1', name: 'Pedro Rocha', position: 'GOL', ovr: 74, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'pon_2', name: 'Elvis', position: 'MEI', ovr: 77, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2, isStar: true },
      { id: 'pon_3', name: 'Jeh', position: 'CA', ovr: 75, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 }
    ]
  },
  'Guarani': {
    id: 'guarani',
    name: 'Guarani FC',
    shortName: 'Guarani',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Guarani_FC_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Brinco de Ouro da Princesa',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 5.0,
    colors: { primary: '#00552b', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Ponte Preta"],
    playStyle: 'Futebol combativo do Bugre com tradição campeã brasileira',
    coachName: 'Allan Aal',
    squad: [
      { id: 'gua_1', name: 'Pegorari', position: 'GOL', ovr: 74, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'gua_2', name: 'Caio Dantas', position: 'CA', ovr: 76, age: 31, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Paysandu': {
    id: 'paysandu',
    name: 'Paysandu SC',
    shortName: 'Paysandu',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Paysandu_Sport_Club_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Curuzu (Vovô da Cidade)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 5.0,
    colors: { primary: '#0080ff', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Remo"],
    playStyle: 'Pressão avassaladora do Papão da Curuzu com a massa paraense',
    coachName: 'Márcio Fernandes',
    squad: [
      { id: 'pay_1', name: 'Diogo Silva', position: 'GOL', ovr: 75, age: 38, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.4 },
      { id: 'pay_2', name: 'Nicolas', position: 'CA', ovr: 76, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true }
    ]
  },
  'Villarreal': {
    id: 'villarreal',
    name: 'Villarreal CF',
    shortName: 'Villarreal',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Estadio de la Cerámica',
    prestige: 4,
    formation: '4-4-2',
    budgetEur: 70.0,
    colors: { primary: '#FFE600', secondary: '#0055A5', text: '#000000' },
    rivalClubs: ["Valencia"],
    playStyle: 'Futebol combinativo fluido de Marcelino com transições letais de Ayoze Pérez',
    coachName: 'Marcelino García Toral',
    squad: [
      { id: 'vil_1', name: 'Diego Conde', position: 'GOL', ovr: 78, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 8.0 },
      { id: 'vil_2', name: 'Raúl Albiol', position: 'ZAG', ovr: 79, age: 39, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.0 },
      { id: 'vil_3', name: 'Dani Parejo', position: 'MC', ovr: 82, age: 35, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.0 },
      { id: 'vil_4', name: 'Álex Baena', position: 'MEI', ovr: 83, age: 23, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 50.0, isStar: true },
      { id: 'vil_5', name: 'Ayoze Pérez', position: 'CA', ovr: 82, age: 31, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Girona': {
    id: 'girona',
    name: 'Girona FC',
    shortName: 'Girona',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/79/Girona_FC_Logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Estadi Montilivi',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 65.0,
    colors: { primary: '#CD1426', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Barcelona", "Espanyol"],
    playStyle: 'Futebol total de Míchel com circulação rápida e sobreposições constantes',
    coachName: 'Míchel',
    squad: [
      { id: 'gir_1', name: 'Paulo Gazzaniga', position: 'GOL', ovr: 80, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 5.0 },
      { id: 'gir_2', name: 'Daley Blind', position: 'ZAG', ovr: 80, age: 34, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 3.0 },
      { id: 'gir_3', name: 'Yangel Herrera', position: 'MC', ovr: 81, age: 26, nationality: 'Venezuela', flag: '🇻🇪', marketValueEur: 25.0 },
      { id: 'gir_4', name: 'Viktor Tsygankov', position: 'PD', ovr: 82, age: 27, nationality: 'Ucrânia', flag: '🇺🇦', marketValueEur: 30.0, isStar: true },
      { id: 'gir_5', name: 'Bojan Miovski', position: 'CA', ovr: 78, age: 25, nationality: 'Macedônia do Norte', flag: '🇲🇰', marketValueEur: 15.0 }
    ]
  },
  'Valencia': {
    id: 'valencia',
    name: 'Valencia CF',
    shortName: 'Valencia',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Mestalla',
    prestige: 4,
    formation: '4-4-2',
    budgetEur: 50.0,
    colors: { primary: '#000000', secondary: '#f36c21', text: '#ffffff' },
    rivalClubs: ["Villarreal", "Levante", "Real Madrid"],
    playStyle: 'Raça histórica de Mestalla com jovens talentosos e bloco compacto',
    coachName: 'Rubén Baraja',
    squad: [
      { id: 'val_1', name: 'Giorgi Mamardashvili', position: 'GOL', ovr: 84, age: 24, nationality: 'Geórgia', flag: '🇬🇪', marketValueEur: 45.0, isStar: true },
      { id: 'val_2', name: 'Cristhian Mosquera', position: 'ZAG', ovr: 80, age: 20, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 30.0, isStar: true },
      { id: 'val_3', name: 'Pepelu', position: 'VOL', ovr: 81, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 22.0 },
      { id: 'val_4', name: 'Javi Guerra', position: 'MC', ovr: 80, age: 21, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 25.0 },
      { id: 'val_5', name: 'Hugo Duro', position: 'CA', ovr: 79, age: 25, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 16.0 }
    ]
  },
  'Celta de Vigo': {
    id: 'celta',
    name: 'RC Celta de Vigo',
    shortName: 'Celta Vigo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Abanca-Balaídos',
    prestige: 3,
    formation: '3-4-3',
    budgetEur: 40.0,
    colors: { primary: '#87CEEB', secondary: '#CC0000', text: '#000000' },
    rivalClubs: ["Deportivo La Coruña"],
    playStyle: 'Futebol técnico e ofensivo de Claudio Giráldez liderado pela lenda Iago Aspas',
    coachName: 'Claudio Giráldez',
    squad: [
      { id: 'cel_1', name: 'Vicente Guaita', position: 'GOL', ovr: 78, age: 37, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.5 },
      { id: 'cel_2', name: 'Óscar Mingueza', position: 'LD', ovr: 80, age: 25, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 15.0 },
      { id: 'cel_3', name: 'Iago Aspas', position: 'CA', ovr: 82, age: 37, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.0, isStar: true },
      { id: 'cel_4', name: 'Borja Iglesias', position: 'CA', ovr: 78, age: 31, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 6.0 }
    ]
  },
  'Mallorca': {
    id: 'mallorca',
    name: 'RCD Mallorca',
    shortName: 'Mallorca',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Rcd_mallorca.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Son Moix',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#E20613', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Espanyol"],
    playStyle: 'Solidez tática nas Ilhas Baleares com velocidade de Muriqi',
    coachName: 'Jagoba Arrasate',
    squad: [
      { id: 'mal_1', name: 'Dominik Greif', position: 'GOL', ovr: 77, age: 27, nationality: 'Eslováquia', flag: '🇸🇰', marketValueEur: 4.0 },
      { id: 'mal_2', name: 'Antonio Raíllo', position: 'ZAG', ovr: 79, age: 33, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 3.0 },
      { id: 'mal_3', name: 'Vedat Muriqi', position: 'CA', ovr: 80, age: 30, nationality: 'Kosovo', flag: '🇽🇰', marketValueEur: 14.0, isStar: true }
    ]
  },
  'Fiorentina': {
    id: 'fiorentina',
    name: 'ACF Fiorentina',
    shortName: 'Fiorentina',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/ACF_Fiorentina_2022.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Artemio Franchi',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 65.0,
    colors: { primary: '#4c12a1', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Juventus", "Bologna"],
    playStyle: 'Charme de Florença com posse de bola fluida e gols decisivos de Moise Kean',
    coachName: 'Raffaele Palladino',
    squad: [
      { id: 'fio_1', name: 'David de Gea', position: 'GOL', ovr: 82, age: 34, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 6.0, isStar: true },
      { id: 'fio_2', name: 'Dodô', position: 'LD', ovr: 80, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 20.0 },
      { id: 'fio_3', name: 'Robin Gosens', position: 'LE', ovr: 80, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 12.0 },
      { id: 'fio_4', name: 'Edoardo Bove', position: 'MC', ovr: 78, age: 22, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 15.0 },
      { id: 'fio_5', name: 'Moise Kean', position: 'CA', ovr: 82, age: 24, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 25.0, isStar: true }
    ]
  },
  'Bologna': {
    id: 'bologna',
    name: 'Bologna FC 1909',
    shortName: 'Bologna',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bologna_F.C._1909_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: "Stadio Renato Dall'Ara",
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 55.0,
    colors: { primary: '#1A2F50', secondary: '#A81E2E', text: '#ffffff' },
    rivalClubs: ["Fiorentina", "Juventus"],
    playStyle: 'Futebol dinâmico europeu de Champions League com ritmo acelerado',
    coachName: 'Vincenzo Italiano',
    squad: [
      { id: 'bol_1', name: 'Łukasz Skorupski', position: 'GOL', ovr: 80, age: 33, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 4.0 },
      { id: 'bol_2', name: 'Sam Beukema', position: 'ZAG', ovr: 80, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 20.0 },
      { id: 'bol_3', name: 'Remo Freuler', position: 'VOL', ovr: 80, age: 32, nationality: 'Suíça', flag: '🇨🇭', marketValueEur: 8.0 },
      { id: 'bol_4', name: 'Riccardo Orsolini', position: 'PD', ovr: 81, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 20.0, isStar: true },
      { id: 'bol_5', name: 'Santiago Castro', position: 'CA', ovr: 78, age: 20, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 18.0, isStar: true }
    ]
  },
  'Torino': {
    id: 'torino',
    name: 'Torino FC',
    shortName: 'Torino',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Olimpico Grande Torino',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 45.0,
    colors: { primary: '#8B0000', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Juventus"],
    playStyle: 'Espírito do Granata: marcação homem a homem feroz e transição veloz',
    coachName: 'Paolo Vanoli',
    squad: [
      { id: 'tor_1', name: 'Vanja Milinković-Savić', position: 'GOL', ovr: 80, age: 27, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 10.0 },
      { id: 'tor_2', name: 'Saúl Coco', position: 'ZAG', ovr: 79, age: 25, nationality: 'Guiné Equatorial', flag: '🇬🇶', marketValueEur: 15.0 },
      { id: 'tor_3', name: 'Samuele Ricci', position: 'MC', ovr: 81, age: 23, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 30.0, isStar: true },
      { id: 'tor_4', name: 'Duván Zapata', position: 'CA', ovr: 81, age: 33, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Como': {
    id: 'como',
    name: 'Como 1907',
    shortName: 'Como',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Como_1907_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Giuseppe Sinigaglia',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 50.0,
    colors: { primary: '#003DA5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Varese", "Monza"],
    playStyle: 'Futebol artístico e moderno de Cesc Fàbregas à beira do Lago de Como',
    coachName: 'Cesc Fàbregas',
    squad: [
      { id: 'com_1', name: 'Pepe Reina', position: 'GOL', ovr: 76, age: 42, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.0 },
      { id: 'com_2', name: 'Sergi Roberto', position: 'MC', ovr: 79, age: 32, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.0 },
      { id: 'com_3', name: 'Nico Paz', position: 'MEI', ovr: 80, age: 20, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 25.0, isStar: true },
      { id: 'com_4', name: 'Patrick Cutrone', position: 'CA', ovr: 78, age: 26, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 8.0 }
    ]
  },
  'Parma': {
    id: 'parma',
    name: 'Parma Calcio 1913',
    shortName: 'Parma',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Parma_Calcio_1913_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Ennio Tardini',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 35.0,
    colors: { primary: '#FFED00', secondary: '#003F87', text: '#000000' },
    rivalClubs: ["Reggiana", "Bologna"],
    playStyle: 'Velocidade vertiginosa pelas pontas com Man e Mihăilă',
    coachName: 'Fabio Pecchia',
    squad: [
      { id: 'par_1', name: 'Zion Suzuki', position: 'GOL', ovr: 77, age: 22, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 9.0 },
      { id: 'par_2', name: 'Dennis Man', position: 'PD', ovr: 80, age: 26, nationality: 'Romênia', flag: '🇷🇴', marketValueEur: 18.0, isStar: true },
      { id: 'par_3', name: 'Ange-Yoan Bonny', position: 'CA', ovr: 78, age: 21, nationality: 'França', flag: '🇫🇷', marketValueEur: 15.0 }
    ]
  },
  'Stuttgart': {
    id: 'stuttgart',
    name: 'VfB Stuttgart',
    shortName: 'Stuttgart',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'MHPArena',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 65.0,
    colors: { primary: '#E30613', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Karlsruher SC", "SC Freiburg"],
    playStyle: 'Futebol ofensivo dinâmico e brilhante de Sebastian Hoeneß',
    coachName: 'Sebastian Hoeneß',
    squad: [
      { id: 'stu_1', name: 'Alexander Nübel', position: 'GOL', ovr: 81, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 15.0 },
      { id: 'stu_2', name: 'Angelo Stiller', position: 'VOL', ovr: 82, age: 23, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 30.0, isStar: true },
      { id: 'stu_3', name: 'Enzo Millot', position: 'MEI', ovr: 81, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 35.0 },
      { id: 'stu_4', name: 'Deniz Undav', position: 'CA', ovr: 83, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 35.0, isStar: true },
      { id: 'stu_5', name: 'Ermedin Demirović', position: 'CA', ovr: 80, age: 26, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 25.0 }
    ]
  },
  'Freiburg': {
    id: 'freiburg',
    name: 'SC Freiburg',
    shortName: 'Freiburg',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/de/f/f1/SC-Freiburg_Logo-neu.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Europa-Park Stadion',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#000000', secondary: '#CC0000', text: '#ffffff' },
    rivalClubs: ["VfB Stuttgart"],
    playStyle: 'Coesão coletiva perfeita na Floresta Negra e bolas paradas mortais',
    coachName: 'Julian Schuster',
    squad: [
      { id: 'fre_1', name: 'Noah Atubolu', position: 'GOL', ovr: 78, age: 22, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 12.0 },
      { id: 'fre_2', name: 'Matthias Ginter', position: 'ZAG', ovr: 80, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 12.0 },
      { id: 'fre_3', name: 'Vincenzo Grifo', position: 'PE', ovr: 81, age: 31, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 10.0, isStar: true },
      { id: 'fre_4', name: 'Ritsu Doan', position: 'PD', ovr: 80, age: 26, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 18.0, isStar: true }
    ]
  },
  'Werder Bremen': {
    id: 'werder',
    name: 'SV Werder Bremen',
    shortName: 'Werder Bremen',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Weserstadion',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 40.0,
    colors: { primary: '#1B7C3D', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Hamburger SV"],
    playStyle: 'Tradição do norte alemão com futebol ofensivo apoiado pelo Weserstadion',
    coachName: 'Ole Werner',
    squad: [
      { id: 'wer_1', name: 'Michael Zetterer', position: 'GOL', ovr: 78, age: 29, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 6.0 },
      { id: 'wer_2', name: 'Mitchell Weiser', position: 'LD', ovr: 80, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 8.0 },
      { id: 'wer_3', name: 'Romano Schmid', position: 'MEI', ovr: 79, age: 24, nationality: 'Áustria', flag: '🇦🇹', marketValueEur: 15.0, isStar: true },
      { id: 'wer_4', name: 'Marvin Ducksch', position: 'CA', ovr: 80, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 10.0, isStar: true }
    ]
  },
  'Borussia Mönchengladbach': {
    id: 'gladbach',
    name: 'Borussia Mönchengladbach',
    shortName: "M'gladbach",
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_M%C3%B6nchengladbach_logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Borussia-Park',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#000000', secondary: '#1B7C3D', text: '#ffffff' },
    rivalClubs: ["1. FC Köln"],
    playStyle: 'Os Potros (Die Fohlen): futebol elétrico e veloz pelos flancos',
    coachName: 'Gerardo Seoane',
    squad: [
      { id: 'gla_1', name: 'Moritz Nicolas', position: 'GOL', ovr: 77, age: 27, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 5.0 },
      { id: 'gla_2', name: 'Julian Weigl', position: 'VOL', ovr: 80, age: 29, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 8.0 },
      { id: 'gla_3', name: 'Alassane Pléa', position: 'CA', ovr: 80, age: 31, nationality: 'França', flag: '🇫🇷', marketValueEur: 7.0, isStar: true },
      { id: 'gla_4', name: 'Tim Kleindienst', position: 'CA', ovr: 80, age: 29, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 10.0, isStar: true }
    ]
  },
  'Lille': {
    id: 'lille',
    name: 'LOSC Lille',
    shortName: 'Lille',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/LOSC_Lille_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Decathlon Arena Stade Pierre-Mauroy',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 65.0,
    colors: { primary: '#D00027', secondary: '#002D62', text: '#ffffff' },
    rivalClubs: ["Lens"],
    playStyle: 'Futebol vistoso de Bruno Génésio com a pontaria letal de Jonathan David',
    coachName: 'Bruno Génésio',
    squad: [
      { id: 'lil_1', name: 'Lucas Chevalier', position: 'GOL', ovr: 82, age: 23, nationality: 'França', flag: '🇫🇷', marketValueEur: 25.0, isStar: true },
      { id: 'lil_2', name: 'Bafodé Diakité', position: 'ZAG', ovr: 80, age: 23, nationality: 'França', flag: '🇫🇷', marketValueEur: 20.0 },
      { id: 'lil_3', name: 'Benjamin André', position: 'VOL', ovr: 80, age: 34, nationality: 'França', flag: '🇫🇷', marketValueEur: 5.0 },
      { id: 'lil_4', name: 'Edon Zhegrova', position: 'PD', ovr: 82, age: 25, nationality: 'Kosovo', flag: '🇽🇰', marketValueEur: 30.0, isStar: true },
      { id: 'lil_5', name: 'Jonathan David', position: 'CA', ovr: 83, age: 24, nationality: 'Canadá', flag: '🇨🇦', marketValueEur: 50.0, isStar: true }
    ]
  },
  'Rennes': {
    id: 'rennes',
    name: 'Stade Rennais FC',
    shortName: 'Rennes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Roazhon Park',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 60.0,
    colors: { primary: '#E2001A', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Nantes"],
    playStyle: 'Fábrica formadora de joias mundiais na Bretanha e jogo de alta rotação',
    coachName: 'Jorge Sampaoli',
    squad: [
      { id: 'ren_1', name: 'Steve Mandanda', position: 'GOL', ovr: 78, age: 39, nationality: 'França', flag: '🇫🇷', marketValueEur: 1.0 },
      { id: 'ren_2', name: 'Christopher Wooh', position: 'ZAG', ovr: 78, age: 23, nationality: 'Camarões', flag: '🇨🇲', marketValueEur: 10.0 },
      { id: 'ren_3', name: 'Ludovic Blas', position: 'MEI', ovr: 80, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 15.0, isStar: true },
      { id: 'ren_4', name: 'Arnaud Kalimuendo', position: 'CA', ovr: 80, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 22.0, isStar: true }
    ]
  },
  'Nice': {
    id: 'nice',
    name: 'OGC Nice',
    shortName: 'Nice',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Allianz Riviera',
    prestige: 4,
    formation: '3-4-2-1',
    budgetEur: 55.0,
    colors: { primary: '#D00027', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Monaco", "Marseille"],
    playStyle: 'Futebol ofensivo dinâmico da Riviera Francesa com Franck Haise',
    coachName: 'Franck Haise',
    squad: [
      { id: 'nic_1', name: 'Marcin Bułka', position: 'GOL', ovr: 81, age: 25, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 20.0, isStar: true },
      { id: 'nic_2', name: 'Dante', position: 'ZAG', ovr: 78, age: 41, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'nic_3', name: 'Hicham Boudaoui', position: 'VOL', ovr: 80, age: 25, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 15.0 },
      { id: 'nic_4', name: 'Evann Guessand', position: 'CA', ovr: 79, age: 23, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 14.0, isStar: true }
    ]
  },
  'Lens': {
    id: 'lens',
    name: 'RC Lens',
    shortName: 'Lens',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/RC_Lens_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Bollaert-Delelis',
    prestige: 4,
    formation: '3-4-1-2',
    budgetEur: 50.0,
    colors: { primary: '#e41b13', secondary: '#f4e019', text: '#ffffff' },
    rivalClubs: ["Lille"],
    playStyle: 'Atmosfera vulcânica em Bollaert-Delelis e jogo físico intenso',
    coachName: 'Will Still',
    squad: [
      { id: 'len_1', name: 'Brice Samba', position: 'GOL', ovr: 81, age: 30, nationality: 'França', flag: '🇫🇷', marketValueEur: 15.0, isStar: true },
      { id: 'len_2', name: 'Facundo Medina', position: 'ZAG', ovr: 81, age: 25, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 25.0 },
      { id: 'len_3', name: 'Andy Diouf', position: 'MC', ovr: 79, age: 21, nationality: 'França', flag: '🇫🇷', marketValueEur: 12.0 },
      { id: 'len_4', name: "M'Bala Nzola", position: 'CA', ovr: 78, age: 28, nationality: 'Angola', flag: '🇦🇴', marketValueEur: 10.0 }
    ]
  },

  'Amazonas': {
    id: 'amazonas',
    name: 'Amazonas FC',
    shortName: 'Amazonas',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/4f/Amazonas_FC.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Arena da Amazônia',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 6.0,
    colors: { primary: '#ffcc00', secondary: '#000000', text: '#000000' },
    rivalClubs: ["Manaus FC"],
    playStyle: 'Futebol veloz com Sassá aproveitando o calor da floresta',
    coachName: 'Rafael Lacerda',
    squad: [
      { id: 'amz_1', name: 'Marcão', position: 'GOL', ovr: 75, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'amz_2', name: 'Sassá', position: 'CA', ovr: 76, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Botafogo-SP': {
    id: 'botafogo_sp',
    name: 'Botafogo FC (SP)',
    shortName: 'Botafogo-SP',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Botafogo_Futebol_Clube_%28Ribeir%C3%A3o_Preto%29.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Santa Cruz (Arena Nicnet)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 5.0,
    colors: { primary: '#cc0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Comercial", "Ponte Preta"],
    playStyle: 'Força no calor de Ribeirão Preto e velocidade pelos lados',
    coachName: 'Paulo Gomes',
    squad: [
      { id: 'bsp_1', name: 'João Carlos', position: 'GOL', ovr: 74, age: 36, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.3 },
      { id: 'bsp_2', name: 'Alexandre Jesus', position: 'CA', ovr: 75, age: 23, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.8, isStar: true }
    ]
  },
  'Brusque': {
    id: 'brusque',
    name: 'Brusque FC',
    shortName: 'Brusque',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Brusque_Futebol_Clube.png',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Augusto Bauer',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 4.5,
    colors: { primary: '#ffcc00', secondary: '#cc0000', text: '#ffffff' },
    rivalClubs: ["Chapecoense", "Avaí"],
    playStyle: 'Futebol disciplinado do Vale do Itajaí e marcação pesada',
    coachName: 'Marcelo Cabo',
    squad: [
      { id: 'bru_1', name: 'Matheus Nogueira', position: 'GOL', ovr: 74, age: 38, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.3 },
      { id: 'bru_2', name: 'Guilherme Queiróz', position: 'CA', ovr: 74, age: 34, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.5 }
    ]
  },
  'Ituano': {
    id: 'ituano',
    name: 'Ituano FC',
    shortName: 'Ituano',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Ituano_Futebol_Clube_logo.svg',
    leagueId: 'serie_b',
    league: 'Brasileirão Série B',
    country: 'Brasil',
    stadium: 'Novelli Júnior',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 5.0,
    colors: { primary: '#cc0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Ponte Preta", "Guarani"],
    playStyle: 'Galo de Itu com transições velozes e base experiente',
    coachName: 'Chico Elias',
    squad: [
      { id: 'itu_1', name: 'Jefferson Paulino', position: 'GOL', ovr: 75, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8 },
      { id: 'itu_2', name: 'Thonny Anderson', position: 'MEI', ovr: 76, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.8, isStar: true }
    ]
  },
  'Blackburn Rovers': {
    id: 'blackburn',
    name: 'Blackburn Rovers FC',
    shortName: 'Blackburn',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Ewood Park',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#009EE0', secondary: '#FFFFFF', text: '#000000' },
    rivalClubs: ["Burnley"],
    playStyle: 'Tradição campeã da Premier League com intensidade em Ewood Park',
    coachName: 'John Eustace',
    squad: [
      { id: 'bla_1', name: 'Aynsley Pears', position: 'GOL', ovr: 75, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 2.5 },
      { id: 'bla_2', name: 'Lewis Travis', position: 'VOL', ovr: 76, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 4.5 },
      { id: 'bla_3', name: 'Yuki Ohashi', position: 'CA', ovr: 76, age: 28, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Derby County': {
    id: 'derby',
    name: 'Derby County FC',
    shortName: 'Derby County',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Derby_County_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Pride Park Stadium',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#FFFFFF', secondary: '#000000', text: '#000000' },
    rivalClubs: ["Nottingham Forest"],
    playStyle: 'Paixão massiva em Pride Park e jogo aéreo implacável de Paul Warne',
    coachName: 'Paul Warne',
    squad: [
      { id: 'der_1', name: 'Jacob Widell Zetterström', position: 'GOL', ovr: 75, age: 26, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 3.0 },
      { id: 'der_2', name: 'Ebou Adams', position: 'VOL', ovr: 75, age: 28, nationality: 'Gâmbia', flag: '🇬🇲', marketValueEur: 2.5 }
    ]
  },
  'Stoke City': {
    id: 'stoke',
    name: 'Stoke City FC',
    shortName: 'Stoke City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Stoke_City_FC.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'bet365 Stadium (Britannia)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#E03A3E', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Port Vale"],
    playStyle: 'Ventos fortes no bet365 Stadium com duelos físicos duros',
    coachName: 'Narcís Pèlach',
    squad: [
      { id: 'stk_1', name: 'Viktor Johansson', position: 'GOL', ovr: 76, age: 26, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 4.0 },
      { id: 'stk_2', name: 'Million Manhoef', position: 'PD', ovr: 77, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 6.5, isStar: true }
    ]
  },
  'Queens Park Rangers': {
    id: 'qpr',
    name: 'Queens Park Rangers FC',
    shortName: 'QPR',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/3/31/Queens_Park_Rangers_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Loftus Road (MATRADE Loftus Road)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#1D5BA5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Chelsea", "Brentford", "Fulham"],
    playStyle: 'Pressão asfixiante nas dimensões curtas de Loftus Road',
    coachName: 'Martí Cifuentes',
    squad: [
      { id: 'qpr_1', name: 'Paul Nardi', position: 'GOL', ovr: 75, age: 30, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.0 },
      { id: 'qpr_2', name: 'Ilias Chair', position: 'MEI', ovr: 78, age: 27, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 9.0, isStar: true }
    ]
  },
  'Millwall': {
    id: 'millwall',
    name: 'Millwall FC',
    shortName: 'Millwall',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Millwall_FC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'The Den',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 20.0,
    colors: { primary: '#001A3A', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["West Ham United", "Crystal Palace"],
    playStyle: 'Intimidação lendária em The Den com disputas aéreas implacáveis',
    coachName: 'Neil Harris',
    squad: [
      { id: 'mil_1', name: 'Lukas Jensen', position: 'GOL', ovr: 74, age: 25, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 1.5 },
      { id: 'mil_2', name: 'Romain Esse', position: 'MEI', ovr: 76, age: 19, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Portsmouth': {
    id: 'portsmouth',
    name: 'Portsmouth FC',
    shortName: 'Portsmouth',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/3/38/Portsmouth_FC_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Fratton Park',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#001489', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Southampton"],
    playStyle: 'Empolgação histórica da torcida de Fratton Park e contragolpes',
    coachName: 'John Mousinho',
    squad: [
      { id: 'por_1', name: 'Will Norris', position: 'GOL', ovr: 74, age: 31, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.0 },
      { id: 'por_2', name: 'Callum Lang', position: 'PE', ovr: 76, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Hull City': {
    id: 'hull',
    name: 'Hull City AFC',
    shortName: 'Hull City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'MKM Stadium',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 30.0,
    colors: { primary: '#F5971E', secondary: '#000000', text: '#000000' },
    rivalClubs: ["Leeds United"],
    playStyle: 'Os Tigres com futebol veloz pelas pontas e apoio do MKM Stadium',
    coachName: 'Tim Walter',
    squad: [
      { id: 'hul_1', name: 'Ivor Pandur', position: 'GOL', ovr: 75, age: 24, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 3.0 },
      { id: 'hul_2', name: 'Mohamed Belloumi', position: 'PD', ovr: 76, age: 22, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Cardiff City': {
    id: 'cardiff',
    name: 'Cardiff City FC',
    shortName: 'Cardiff',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Cardiff City Stadium',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#0000ff', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Swansea City", "Bristol City"],
    playStyle: 'Fervor galês nos Bluebirds com bolas paradas de David Turnbull',
    coachName: 'Omer Riza',
    squad: [
      { id: 'car_1', name: 'Jak Alnwick', position: 'GOL', ovr: 74, age: 31, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.2 },
      { id: 'car_2', name: 'David Turnbull', position: 'MC', ovr: 76, age: 25, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Swansea City': {
    id: 'swansea',
    name: 'Swansea City AFC',
    shortName: 'Swansea',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f9/Swansea_City_AFC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Swansea.com Stadium (Liberty)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#FFFFFF', secondary: '#000000', text: '#000000' },
    rivalClubs: ["Cardiff City"],
    playStyle: 'Tradição de posse de bola controlada dos Cisnes galeses',
    coachName: 'Luke Williams',
    squad: [
      { id: 'swa_1', name: 'Lawrence Vigouroux', position: 'GOL', ovr: 75, age: 31, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 1.0 },
      { id: 'swa_2', name: 'Matt Grimes', position: 'VOL', ovr: 77, age: 29, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Osasuna': {
    id: 'osasuna',
    name: 'CA Osasuna',
    shortName: 'Osasuna',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/Osasuna_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'El Sadar (Pamplona)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#A51C30', secondary: '#0C2340', text: '#ffffff' },
    rivalClubs: ["Athletic Club", "Real Sociedad"],
    playStyle: 'Pressão avassaladora e entrega insana na fortaleza de El Sadar',
    coachName: 'Dani Pendín',
    squad: [
      { id: 'osa_1', name: 'Sergio Herrera', position: 'GOL', ovr: 79, age: 31, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 6.0 },
      { id: 'osa_2', name: 'Lucas Torró', position: 'VOL', ovr: 79, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 8.0 },
      { id: 'osa_3', name: 'Ante Budimir', position: 'CA', ovr: 81, age: 33, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Rayo Vallecano': {
    id: 'rayo',
    name: 'Rayo Vallecano de Madrid',
    shortName: 'Rayo Vallecano',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Rayo_Vallecano_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Campo de Fútbol de Vallecas',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#e30613', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Real Madrid", "Atlético de Madrid", "Getafe"],
    playStyle: 'Espírito operário rebelde de Vallecas com genialidade de James Rodríguez',
    coachName: 'Iñigo Pérez',
    squad: [
      { id: 'ray_1', name: 'Augusto Batalla', position: 'GOL', ovr: 78, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 5.0 },
      { id: 'ray_2', name: 'James Rodríguez', position: 'MEI', ovr: 82, age: 33, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 5.0, isStar: true },
      { id: 'ray_3', name: 'Isi Palazón', position: 'PD', ovr: 80, age: 29, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 8.0 }
    ]
  },
  'Las Palmas': {
    id: 'las_palmas',
    name: 'UD Las Palmas',
    shortName: 'Las Palmas',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/06/UD_Las_Palmas_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Estadio Gran Canaria',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#FFF200', secondary: '#0055A5', text: '#000000' },
    rivalClubs: ["Tenerife"],
    playStyle: 'Futebol canário de posse associativa e técnica apurada',
    coachName: 'Diego Martínez',
    squad: [
      { id: 'lpa_1', name: 'Jasper Cillessen', position: 'GOL', ovr: 78, age: 35, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 2.0 },
      { id: 'lpa_2', name: 'Kirian Rodríguez', position: 'MC', ovr: 80, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 12.0, isStar: true },
      { id: 'lpa_3', name: 'Fábio Silva', position: 'CA', ovr: 78, age: 22, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 12.0 }
    ]
  },
  'Getafe': {
    id: 'getafe',
    name: 'Getafe CF',
    shortName: 'Getafe',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Getafe_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Coliseum',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 30.0,
    colors: { primary: '#00529F', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Leganés", "Real Madrid", "Rayo Vallecano"],
    playStyle: 'Bordalás clássico: marcação impiedosa, bloco impenetrável e contra-ataques',
    coachName: 'José Bordalás',
    squad: [
      { id: 'get_1', name: 'David Soria', position: 'GOL', ovr: 80, age: 31, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 5.0 },
      { id: 'get_2', name: 'Mauro Arambarri', position: 'VOL', ovr: 80, age: 29, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 6.0, isStar: true },
      { id: 'get_3', name: 'Borja Mayoral', position: 'CA', ovr: 80, age: 27, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Deportivo Alavés': {
    id: 'alaves',
    name: 'Deportivo Alavés',
    shortName: 'Alavés',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f8/Deportivo_Alaves_logo_%282020%29.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Mendizorroza',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#0055A5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Athletic Club", "Real Sociedad"],
    playStyle: 'Intensidade basca e entrega nos 90 minutos em Mendizorroza',
    coachName: 'Luis García Plaza',
    squad: [
      { id: 'ala_1', name: 'Antonio Sivera', position: 'GOL', ovr: 78, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.0 },
      { id: 'ala_2', name: 'Kike García', position: 'CA', ovr: 77, age: 34, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Espanyol': {
    id: 'espanyol',
    name: 'RCD Espanyol de Barcelona',
    shortName: 'Espanyol',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Rcd_espanyol_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'RCDE Stadium',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 35.0,
    colors: { primary: '#0072CE', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Barcelona"],
    playStyle: 'Derbi barcelonês aguerrido com zaga sólida e oportunismo de Javi Puado',
    coachName: 'Manolo González',
    squad: [
      { id: 'esp_1', name: 'Joan García', position: 'GOL', ovr: 80, age: 23, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 10.0, isStar: true },
      { id: 'esp_2', name: 'Javi Puado', position: 'PE', ovr: 79, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Leganés': {
    id: 'leganes',
    name: 'CD Leganés',
    shortName: 'Leganés',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/02/Club_Deportivo_Legan%C3%A9s_logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'Estadio Municipal Butarque',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#0055A5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Getafe"],
    playStyle: 'Paciência defensiva e contra-ataques objetivos dos Pepineros',
    coachName: 'Borja Jiménez',
    squad: [
      { id: 'leg_1', name: 'Marko Dmitrović', position: 'GOL', ovr: 78, age: 32, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 2.5 },
      { id: 'leg_2', name: 'Juan Cruz', position: 'PD', ovr: 77, age: 24, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Real Valladolid': {
    id: 'valladolid',
    name: 'Real Valladolid CF',
    shortName: 'Valladolid',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6d/Real_Valladolid_Logo.svg',
    leagueId: 'la_liga',
    league: 'La Liga EA Sports',
    country: 'Espanha',
    stadium: 'José Zorrilla',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#4B0082', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Cultural Leonesa"],
    playStyle: 'Pucela: futebol veloz pelas alas com Raúl Moro desequilibrando',
    coachName: 'Paulo Pezzolano',
    squad: [
      { id: 'val_r1', name: 'Karl Hein', position: 'GOL', ovr: 77, age: 22, nationality: 'Estônia', flag: '🇪🇪', marketValueEur: 3.0 },
      { id: 'val_r2', name: 'Raúl Moro', position: 'PE', ovr: 78, age: 21, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Udinese': {
    id: 'udinese',
    name: 'Udinese Calcio',
    shortName: 'Udinese',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/ce/Udinese_Calcio_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Bluenergy Stadium (Friuli)',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 35.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Triestina", "Venezia"],
    playStyle: 'Poder físico assombroso com zaga alta e talento de Lorenzo Lucca',
    coachName: 'Kosta Runjaić',
    squad: [
      { id: 'udi_1', name: 'Maduka Okoye', position: 'GOL', ovr: 78, age: 25, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 7.5 },
      { id: 'udi_2', name: 'Jaka Bijol', position: 'ZAG', ovr: 80, age: 25, nationality: 'Eslovênia', flag: '🇸🇮', marketValueEur: 18.0 },
      { id: 'udi_3', name: 'Lorenzo Lucca', position: 'CA', ovr: 80, age: 24, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 18.0, isStar: true }
    ]
  },
  'Genoa': {
    id: 'genoa',
    name: 'Genoa CFC',
    shortName: 'Genoa',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Genoa_C.F.C._logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Luigi Ferraris (Marassi)',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 35.0,
    colors: { primary: '#002B49', secondary: '#A81E2E', text: '#ffffff' },
    rivalClubs: ["Sampdoria"],
    playStyle: 'O clube mais antigo da Itália: alma em Marassi e retorno triunfal de Balotelli',
    coachName: 'Patrick Vieira',
    squad: [
      { id: 'gen_1', name: 'Pierluigi Gollini', position: 'GOL', ovr: 78, age: 29, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 5.0 },
      { id: 'gen_2', name: 'Morten Frendrup', position: 'VOL', ovr: 80, age: 23, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 20.0, isStar: true },
      { id: 'gen_3', name: 'Mario Balotelli', position: 'CA', ovr: 77, age: 34, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 1.2, isStar: true }
    ]
  },
  'Verona': {
    id: 'verona',
    name: 'Hellas Verona FC',
    shortName: 'Verona',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/92/Hellas_Verona_FC_logo_%282020%29.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Marcantonio Bentegodi',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#002F6C', secondary: '#FFE000', text: '#ffffff' },
    rivalClubs: ["Chievo", "Vicenza"],
    playStyle: 'Intensidade agressiva no Bentegodi com transição de Tengstedt',
    coachName: 'Paolo Zanetti',
    squad: [
      { id: 'ver_1', name: 'Lorenzo Montipò', position: 'GOL', ovr: 78, age: 28, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 4.0 },
      { id: 'ver_2', name: 'Casper Tengstedt', position: 'CA', ovr: 77, age: 24, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Empoli': {
    id: 'empoli',
    name: 'Empoli FC',
    shortName: 'Empoli',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c2/Empoli_FC_1920.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Carlo Castellani',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 22.0,
    colors: { primary: '#0055A5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Fiorentina"],
    playStyle: "Futebol inteligente toscano com zaga sólida de Roberto D'Aversa",
    coachName: "Roberto D'Aversa",
    squad: [
      { id: 'emp_1', name: 'Devis Vásquez', position: 'GOL', ovr: 77, age: 26, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 3.0 },
      { id: 'emp_2', name: 'Sebastiano Esposito', position: 'CA', ovr: 77, age: 22, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Cagliari': {
    id: 'cagliari',
    name: 'Cagliari Calcio',
    shortName: 'Cagliari',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/61/Cagliari_Calcio_1920.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Unipol Domus',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#002B49', secondary: '#C8102E', text: '#ffffff' },
    rivalClubs: ["Torres"],
    playStyle: 'Orgulho sardo com valentia física e cruzamentos para Piccoli',
    coachName: 'Davide Nicola',
    squad: [
      { id: 'cag_1', name: 'Simone Scuffet', position: 'GOL', ovr: 77, age: 28, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 2.5 },
      { id: 'cag_2', name: 'Roberto Piccoli', position: 'CA', ovr: 77, age: 23, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Lecce': {
    id: 'lecce',
    name: 'US Lecce',
    shortName: 'Lecce',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c9/U.S._Lecce_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Via del Mare',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 22.0,
    colors: { primary: '#FFCC00', secondary: '#CC0000', text: '#000000' },
    rivalClubs: ["Bari"],
    playStyle: 'Fervor do sul italiano no Via del Mare e talento de Krstović',
    coachName: 'Marco Giampaolo',
    squad: [
      { id: 'lec_1', name: 'Wladimiro Falcone', position: 'GOL', ovr: 79, age: 29, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 5.0 },
      { id: 'lec_2', name: 'Nikola Krstović', position: 'CA', ovr: 78, age: 24, nationality: 'Montenegro', flag: '🇲🇪', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Monza': {
    id: 'monza',
    name: 'AC Monza',
    shortName: 'Monza',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/AC_Monza_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'U-Power Stadium (Brianteo)',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 30.0,
    colors: { primary: '#CC0000', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Como", "Milan"],
    playStyle: 'Futebol moderno lombardo com Daniel Maldini brilhando',
    coachName: 'Alessandro Nesta',
    squad: [
      { id: 'mon_1', name: 'Stefano Turati', position: 'GOL', ovr: 78, age: 23, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 7.0 },
      { id: 'mon_2', name: 'Matteo Pessina', position: 'MC', ovr: 80, age: 27, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 15.0, isStar: true },
      { id: 'mon_3', name: 'Daniel Maldini', position: 'MEI', ovr: 78, age: 23, nationality: 'Itália', flag: '🇮🇹', marketValueEur: 12.0, isStar: true }
    ]
  },
  'Venezia': {
    id: 'venezia',
    name: 'Venezia FC',
    shortName: 'Venezia',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Venezia_FC_logo.svg',
    leagueId: 'serie_a_ita',
    league: 'Serie A (Itália)',
    country: 'Itália',
    stadium: 'Stadio Pier Luigi Penzo',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 22.0,
    colors: { primary: '#E2725B', secondary: '#00552b', text: '#ffffff' },
    rivalClubs: ["Padova", "Verona"],
    playStyle: 'Futebol charmoso na lagoa de Veneza com gols de Pohjanpalo',
    coachName: 'Eusebio Di Francesco',
    squad: [
      { id: 'ven_1', name: 'Jesse Joronen', position: 'GOL', ovr: 76, age: 31, nationality: 'Finlândia', flag: '🇫🇮', marketValueEur: 2.0 },
      { id: 'ven_2', name: 'Joel Pohjanpalo', position: 'CA', ovr: 79, age: 30, nationality: 'Finlândia', flag: '🇫🇮', marketValueEur: 5.5, isStar: true }
    ]
  },

  'Union Berlin': {
    id: 'union_berlin',
    name: '1. FC Union Berlin',
    shortName: 'Union Berlin',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Stadion An der Alten Försterei',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 40.0,
    colors: { primary: '#e30613', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Hertha BSC"],
    playStyle: 'Paixão feroz na floresta de Köpenick com zaga impenetrável e entrega total',
    coachName: 'Bo Svensson',
    squad: [
      { id: 'unb_1', name: 'Frederik Rønnow', position: 'GOL', ovr: 80, age: 32, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 5.0 },
      { id: 'unb_2', name: 'Danilho Doekhi', position: 'ZAG', ovr: 80, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 17.0, isStar: true },
      { id: 'unb_3', name: 'Yorbe Vertessen', position: 'CA', ovr: 78, age: 23, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 8.0 }
    ]
  },
  'Mainz 05': {
    id: 'mainz',
    name: '1. FSV Mainz 05',
    shortName: 'Mainz 05',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Mainz_05.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Mewa Arena',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 35.0,
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Eintracht Frankfurt"],
    playStyle: 'Pressão alemã alta de Bo Henriksen com Burkardt e Amiri voando',
    coachName: 'Bo Henriksen',
    squad: [
      { id: 'mai_1', name: 'Robin Zentner', position: 'GOL', ovr: 78, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 4.0 },
      { id: 'mai_2', name: 'Nadiem Amiri', position: 'MEI', ovr: 80, age: 28, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 12.0, isStar: true },
      { id: 'mai_3', name: 'Jonathan Burkardt', position: 'CA', ovr: 80, age: 24, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 20.0, isStar: true }
    ]
  },
  'Augsburg': {
    id: 'augsburg',
    name: 'FC Augsburg',
    shortName: 'Augsburg',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/FC_Augsburg_logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'WWK Arena',
    prestige: 2,
    formation: '3-4-2-1',
    budgetEur: 30.0,
    colors: { primary: '#BA122B', secondary: '#00552b', text: '#ffffff' },
    rivalClubs: ["Bayern de Munique"],
    playStyle: 'Futebol combativo bávaro e oportunismo na área',
    coachName: 'Jess Thorup',
    squad: [
      { id: 'aug_1', name: 'Nediljko Labrović', position: 'GOL', ovr: 77, age: 25, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 4.5 },
      { id: 'aug_2', name: 'Alexis Claude-Maurice', position: 'MEI', ovr: 78, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Wolfsburg': {
    id: 'wolfsburg',
    name: 'VfL Wolfsburg',
    shortName: 'Wolfsburg',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo-VfL-Wolfsburg.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Volkswagen Arena',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 50.0,
    colors: { primary: '#65B32E', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Hannover 96", "Eintracht Braunschweig"],
    playStyle: 'Força física e velocidade pelas alas da Volkswagen Arena',
    coachName: 'Ralph Hasenhüttl',
    squad: [
      { id: 'wob_1', name: 'Kamil Grabara', position: 'GOL', ovr: 79, age: 25, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 14.0 },
      { id: 'wob_2', name: 'Maximilian Arnold', position: 'VOL', ovr: 80, age: 30, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 10.0, isStar: true },
      { id: 'wob_3', name: 'Lovro Majer', position: 'MEI', ovr: 80, age: 26, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 20.0, isStar: true }
    ]
  },
  'Heidenheim': {
    id: 'heidenheim',
    name: '1. FC Heidenheim 1846',
    shortName: 'Heidenheim',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/1._FC_Heidenheim_1846.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Voith-Arena',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#002B49', secondary: '#CC0000', text: '#ffffff' },
    rivalClubs: ["VfB Stuttgart"],
    playStyle: 'O milagre de Frank Schmidt: maior distância percorrida na Bundesliga e entrega física',
    coachName: 'Frank Schmidt',
    squad: [
      { id: 'hei_1', name: 'Kevin Müller', position: 'GOL', ovr: 77, age: 33, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 2.0 },
      { id: 'hei_2', name: 'Paul Wanner', position: 'MEI', ovr: 79, age: 18, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 18.0, isStar: true }
    ]
  },
  'St. Pauli': {
    id: 'st_pauli',
    name: 'FC St. Pauli',
    shortName: 'St. Pauli',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/FC_St._Pauli_crest.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Millerntor-Stadion',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 25.0,
    colors: { primary: '#663300', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Hamburger SV", "Hansa Rostock"],
    playStyle: 'Atmosfera cult do Millerntor ao som de Hells Bells e garra máxima',
    coachName: 'Alexander Blessin',
    squad: [
      { id: 'stp_1', name: 'Nikola Vasilj', position: 'GOL', ovr: 77, age: 28, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 3.0 },
      { id: 'stp_2', name: 'Jackson Irvine', position: 'MC', ovr: 78, age: 31, nationality: 'Austrália', flag: '🇦🇺', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Hoffenheim': {
    id: 'hoffenheim',
    name: 'TSG 1899 Hoffenheim',
    shortName: 'Hoffenheim',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Logo_TSG_1899_Hoffenheim.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'PreZero Arena',
    prestige: 3,
    formation: '3-4-1-2',
    budgetEur: 45.0,
    colors: { primary: '#0055A5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["VfB Stuttgart"],
    playStyle: 'Futebol ofensivo moderno com pontaria de Kramarić',
    coachName: 'Christian Ilzer',
    squad: [
      { id: 'hof_1', name: 'Oliver Baumann', position: 'GOL', ovr: 81, age: 34, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 4.0 },
      { id: 'hof_2', name: 'Andrej Kramarić', position: 'CA', ovr: 81, age: 33, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Holstein Kiel': {
    id: 'holstein_kiel',
    name: 'Holstein Kiel',
    shortName: 'Holstein Kiel',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Holstein_Kiel_Logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Holstein-Stadion',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 20.0,
    colors: { primary: '#004B93', secondary: '#ED1C24', text: '#ffffff' },
    rivalClubs: ["Hamburger SV", "St. Pauli"],
    playStyle: 'Estreia histórica na elite alemã com coragem no mar Báltico',
    coachName: 'Marcel Rapp',
    squad: [
      { id: 'kie_1', name: 'Timon Weiner', position: 'GOL', ovr: 75, age: 25, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 2.0 },
      { id: 'kie_2', name: 'Shuto Machino', position: 'CA', ovr: 77, age: 25, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Bochum': {
    id: 'bochum',
    name: 'VfL Bochum 1848',
    shortName: 'Bochum',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/VfL_Bochum_logo.svg',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    country: 'Alemanha',
    stadium: 'Vonovia Ruhrstadion',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 22.0,
    colors: { primary: '#005CA9', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Borussia Dortmund", "Schalke 04"],
    playStyle: 'Raça operária pura no lendário Ruhrstadion',
    coachName: 'Dieter Hecking',
    squad: [
      { id: 'boc_1', name: 'Patrick Drewes', position: 'GOL', ovr: 76, age: 31, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 1.5 },
      { id: 'boc_2', name: 'Dani de Wit', position: 'MEI', ovr: 77, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Brest': {
    id: 'brest',
    name: 'Stade Brestois 29',
    shortName: 'Brest',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/Stade_Brestois_29_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Francis-Le Blé',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 40.0,
    colors: { primary: '#E2001A', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Rennes", "Lorient"],
    playStyle: 'Sensação bretã de Eric Roy na Champions League com raça indomável',
    coachName: 'Éric Roy',
    squad: [
      { id: 'bre_1', name: 'Marco Bizot', position: 'GOL', ovr: 80, age: 33, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 4.0 },
      { id: 'bre_2', name: 'Pierre Lees-Melou', position: 'MC', ovr: 81, age: 31, nationality: 'França', flag: '🇫🇷', marketValueEur: 10.0, isStar: true },
      { id: 'bre_3', name: 'Ludovic Ajorque', position: 'CA', ovr: 79, age: 30, nationality: 'França', flag: '🇫🇷', marketValueEur: 5.0 }
    ]
  },
  'Strasbourg': {
    id: 'strasbourg',
    name: 'RC Strasbourg Alsace',
    shortName: 'Strasbourg',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/80/Racing_Club_de_Strasbourg_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade de la Meinau',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 45.0,
    colors: { primary: '#0055A5', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Metz"],
    playStyle: 'Jovens talentos dinâmicos do grupo BlueCo sob Liam Rosenior',
    coachName: 'Liam Rosenior',
    squad: [
      { id: 'str_1', name: 'Đorđe Petrović', position: 'GOL', ovr: 80, age: 25, nationality: 'Sérvia', flag: '🇷🇸', marketValueEur: 18.0 },
      { id: 'str_2', name: 'Andrey Santos', position: 'VOL', ovr: 80, age: 20, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 25.0, isStar: true },
      { id: 'str_3', name: 'Diego Moreira', position: 'PE', ovr: 78, age: 20, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 10.0 }
    ]
  },
  'Reims': {
    id: 'reims',
    name: 'Stade de Reims',
    shortName: 'Reims',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Stade_de_Reims_2020_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Auguste-Delaune',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Troyes"],
    playStyle: 'Futebol veloz com a dupla japonesa Junya Ito e Keito Nakamura',
    coachName: 'Luka Elsner',
    squad: [
      { id: 'rei_1', name: 'Yehvann Diouf', position: 'GOL', ovr: 78, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 7.0 },
      { id: 'rei_2', name: 'Junya Ito', position: 'PD', ovr: 81, age: 31, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 10.0, isStar: true },
      { id: 'rei_3', name: 'Keito Nakamura', position: 'PE', ovr: 80, age: 24, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 15.0, isStar: true }
    ]
  },
  'Toulouse': {
    id: 'toulouse',
    name: 'Toulouse FC',
    shortName: 'Toulouse',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Toulouse_FC_2018_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stadium de Toulouse',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 35.0,
    colors: { primary: '#5F259F', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Bordeaux"],
    playStyle: 'Futebol analítico moderno na cidade rosa de Carles Martínez Novell',
    coachName: 'Carles Martínez Novell',
    squad: [
      { id: 'tou_1', name: 'Guillaume Restes', position: 'GOL', ovr: 79, age: 19, nationality: 'França', flag: '🇫🇷', marketValueEur: 18.0, isStar: true },
      { id: 'tou_2', name: 'Zakaria Aboukhlal', position: 'PD', ovr: 79, age: 24, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 12.0 }
    ]
  },
  'Nantes': {
    id: 'nantes',
    name: 'FC Nantes',
    shortName: 'Nantes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/FC_Nantes_logo_%282019%29.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade de la Beaujoire',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#FFED00', secondary: '#008000', text: '#000000' },
    rivalClubs: ["Rennes"],
    playStyle: 'Os Canários: tradição na Beaujoire com entrega sob Antoine Kombouaré',
    coachName: 'Antoine Kombouaré',
    squad: [
      { id: 'nan_1', name: 'Alban Lafont', position: 'GOL', ovr: 79, age: 25, nationality: 'França', flag: '🇫🇷', marketValueEur: 9.0 },
      { id: 'nan_2', name: 'Moses Simon', position: 'PE', ovr: 79, age: 29, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 12.0, isStar: true }
    ]
  },
  'Saint-Étienne': {
    id: 'saint_etienne',
    name: 'AS Saint-Étienne',
    shortName: 'Saint-Étienne',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/AS_Saint-%C3%89tienne_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Geoffroy-Guichard (Le Chaudron)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 35.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Olympique Lyonnais"],
    playStyle: 'O Caldeirão Verde (Le Chaudron): 10 vezes campeão francês de volta à elite',
    coachName: "Olivier Dall'Oglio",
    squad: [
      { id: 'ste_1', name: 'Gautier Larsonneur', position: 'GOL', ovr: 77, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 4.0 },
      { id: 'ste_2', name: 'Zuriko Davitashvili', position: 'PE', ovr: 78, age: 23, nationality: 'Geórgia', flag: '🇬🇪', marketValueEur: 6.0, isStar: true }
    ]
  },
  'Montpellier': {
    id: 'montpellier',
    name: 'Montpellier HSC',
    shortName: 'Montpellier',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Montpellier_HSC_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade de la Mosson',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 25.0,
    colors: { primary: '#002B49', secondary: '#FF671F', text: '#ffffff' },
    rivalClubs: ["Nîmes", "Marseille"],
    playStyle: 'Futebol de combate no sul da França com liderança de Savanier',
    coachName: 'Jean-Louis Gasset',
    squad: [
      { id: 'mon_p1', name: 'Benjamin Lecomte', position: 'GOL', ovr: 78, age: 33, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.5 },
      { id: 'mon_p2', name: 'Téji Savanier', position: 'MEI', ovr: 80, age: 32, nationality: 'França', flag: '🇫🇷', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Auxerre': {
    id: 'auxerre',
    name: 'AJ Auxerre',
    shortName: 'Auxerre',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/AJ_Auxerre.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: "Stade de l'Abbé-Deschamps",
    prestige: 2,
    formation: '3-4-2-1',
    budgetEur: 25.0,
    colors: { primary: '#0055A5', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Dijon"],
    playStyle: 'Tradição histórica de formação da Borgonha sob Christophe Pélissier',
    coachName: 'Christophe Pélissier',
    squad: [
      { id: 'aux_1', name: 'Donovan Léon', position: 'GOL', ovr: 76, age: 32, nationality: 'Guiana Francesa', flag: '🇬🇫', marketValueEur: 1.2 },
      { id: 'aux_2', name: 'Gaëtan Perrin', position: 'MEI', ovr: 77, age: 28, nationality: 'França', flag: '🇫🇷', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Angers': {
    id: 'angers',
    name: 'Angers SCO',
    shortName: 'Angers',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_Angers_SCO.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Raymond-Kopa',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 20.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Nantes"],
    playStyle: 'Espírito aguerrido do vale do Loire buscando permanência firme',
    coachName: 'Alexandre Dujeux',
    squad: [
      { id: 'ang_1', name: 'Yahia Fofana', position: 'GOL', ovr: 77, age: 24, nationality: 'Costa do Marfim', flag: '🇨🇮', marketValueEur: 4.0 },
      { id: 'ang_2', name: 'Himad Abdelli', position: 'MEI', ovr: 77, age: 25, nationality: 'Argélia', flag: '🇩🇿', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Le Havre': {
    id: 'le_havre',
    name: 'Le Havre AC',
    shortName: 'Le Havre',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ec/Le_Havre_AC_logo.svg',
    leagueId: 'ligue_1',
    league: 'Ligue 1',
    country: 'França',
    stadium: 'Stade Océane',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 20.0,
    colors: { primary: '#002B49', secondary: '#87CEEB', text: '#ffffff' },
    rivalClubs: ["Caen"],
    playStyle: 'O clube pioneiro francês com jovens das categorias de base da Normandia',
    coachName: 'Didier Digard',
    squad: [
      { id: 'hav_1', name: 'Arthur Desmas', position: 'GOL', ovr: 76, age: 30, nationality: 'França', flag: '🇫🇷', marketValueEur: 2.0 },
      { id: 'hav_2', name: 'Abdoulaye Touré', position: 'VOL', ovr: 76, age: 30, nationality: 'Guiné', flag: '🇬🇳', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Dundee United': {
    id: 'dundee_united',
    name: 'Dundee United FC',
    shortName: 'Dundee Utd',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/7/75/Dundee_United_FC_logo.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Tannadice Park',
    prestige: 3,
    formation: '3-4-2-1',
    budgetEur: 15.0,
    colors: { primary: '#F78F1E', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Dundee FC", "Aberdeen"],
    playStyle: 'Os Tangerines em Tannadice com futebol físico e contra-ataques',
    coachName: 'Jim Goodwin',
    squad: [
      { id: 'dut_1', name: 'Jack Walton', position: 'GOL', ovr: 74, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.2 },
      { id: 'dut_2', name: 'Luca Stephenson', position: 'MC', ovr: 74, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.5, isStar: true }
    ]
  },
  'St. Mirren': {
    id: 'st_mirren',
    name: 'St. Mirren FC',
    shortName: 'St. Mirren',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/St_Mirren_FC_badge.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'The SMiSA Stadium',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 12.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Greenock Morton"],
    playStyle: 'Futebol direto e eficiente em Paisley de Stephen Robinson',
    coachName: 'Stephen Robinson',
    squad: [
      { id: 'stm_1', name: 'Ellery Balcombe', position: 'GOL', ovr: 73, age: 25, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 0.8 },
      { id: 'stm_2', name: 'Toyosi Olusanya', position: 'CA', ovr: 74, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.0, isStar: true }
    ]
  },
  'Kilmarnock': {
    id: 'kilmarnock',
    name: 'Kilmarnock FC',
    shortName: 'Kilmarnock',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Kilmarnock_crest.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Rugby Park',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 14.0,
    colors: { primary: '#0033A0', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Ayr United"],
    playStyle: 'Killie clássico em Rugby Park com marcação pesada de Derek McInnes',
    coachName: 'Derek McInnes',
    squad: [
      { id: 'kil_1', name: "Kieran O'Hara", position: 'GOL', ovr: 73, age: 28, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 0.7 },
      { id: 'kil_2', name: 'Marley Watkins', position: 'CA', ovr: 75, age: 34, nationality: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', marketValueEur: 0.8, isStar: true }
    ]
  },
  'Dundee FC': {
    id: 'dundee_fc',
    name: 'Dundee FC',
    shortName: 'Dundee',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Dundee_F.C._logo.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Dens Park',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 12.0,
    colors: { primary: '#001B44', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Dundee United"],
    playStyle: 'Os Dark Blues de Dens Park com futebol dinâmico',
    coachName: 'Tony Docherty',
    squad: [
      { id: 'dee_1', name: 'Jon McCracken', position: 'GOL', ovr: 73, age: 24, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.8 },
      { id: 'dee_2', name: 'Lyall Cameron', position: 'MC', ovr: 75, age: 22, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 2.0, isStar: true }
    ]
  },
  'St. Johnstone': {
    id: 'st_johnstone',
    name: 'St. Johnstone FC',
    shortName: 'St. Johnstone',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/1/14/St_Johnstone_FC_crest.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'McDiarmid Park',
    prestige: 2,
    formation: '4-4-2',
    budgetEur: 10.0,
    colors: { primary: '#003F87', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Dundee FC"],
    playStyle: 'Espírito combativo dos Saints em Perth',
    coachName: 'Simo Valakari',
    squad: [
      { id: 'stj_1', name: 'Ross Sinclair', position: 'GOL', ovr: 72, age: 23, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.5 },
      { id: 'stj_2', name: 'Benjamin Kimpioka', position: 'CA', ovr: 74, age: 24, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 1.2, isStar: true }
    ]
  },
  'Ross County': {
    id: 'ross_county',
    name: 'Ross County FC',
    shortName: 'Ross County',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Ross_County_FC_crest.svg',
    leagueId: 'scottish_premiership',
    league: 'Premiership',
    country: 'Escócia',
    stadium: 'Global Energy Stadium (Victoria Park)',
    prestige: 2,
    formation: '3-4-1-2',
    budgetEur: 10.0,
    colors: { primary: '#002B49', secondary: '#CC0000', text: '#ffffff' },
    rivalClubs: ["Inverness CT"],
    playStyle: 'Os Staggies das Terras Altas com futebol direto e raça',
    coachName: 'Don Cowie',
    squad: [
      { id: 'ros_1', name: 'Ross Laidlaw', position: 'GOL', ovr: 73, age: 32, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 0.6 },
      { id: 'ros_2', name: 'Ronan Hale', position: 'CA', ovr: 75, age: 26, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 1.5, isStar: true }
    ]
  },

  'Rio Ave': {
    id: 'rio_ave',
    name: 'Rio Ave FC',
    shortName: 'Rio Ave',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Rio_Ave_FC_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio dos Arcos (Vila do Conde)',
    prestige: 2,
    formation: '3-4-3',
    budgetEur: 15.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Varzim", "Porto"],
    playStyle: 'Futebol marítimo de Vila do Conde com velocidade de Clayton',
    coachName: 'Petit',
    squad: [
      { id: 'rio_1', name: 'Cezary Miszta', position: 'GOL', ovr: 74, age: 23, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 1.5 },
      { id: 'rio_2', name: 'Clayton', position: 'CA', ovr: 76, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Moreirense': {
    id: 'moreirense',
    name: 'Moreirense FC',
    shortName: 'Moreirense',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/50/Moreirense_F.C._logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Parque de Jogos Comendador Joaquim de Almeida Freitas',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 14.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Vitória SC"],
    playStyle: 'Coesão e disciplina tática com jogadas de Alan',
    coachName: 'César Peixoto',
    squad: [
      { id: 'mor_1', name: 'Kewin Silva', position: 'GOL', ovr: 75, age: 29, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.0 },
      { id: 'mor_2', name: 'Alan', position: 'MEI', ovr: 77, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Santa Clara': {
    id: 'santa_clara',
    name: 'CD Santa Clara',
    shortName: 'Santa Clara',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Clube_Desportivo_Santa_Clara.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio de São Miguel (Ponta Delgada)',
    prestige: 2,
    formation: '3-4-3',
    budgetEur: 14.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Marítimo"],
    playStyle: 'Orgulho açoriano invicto nas ilhas com futebol aguerrido de Vasco Matos',
    coachName: 'Vasco Matos',
    squad: [
      { id: 'scl_1', name: 'Gabriel Batista', position: 'GOL', ovr: 76, age: 26, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 2.5 },
      { id: 'scl_2', name: 'Vinícius Lopes', position: 'PE', ovr: 76, age: 25, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Estoril Praia': {
    id: 'estoril',
    name: 'GD Estoril Praia',
    shortName: 'Estoril',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/G.D._Estoril_Praia_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio António Coimbra da Mota',
    prestige: 2,
    formation: '3-4-3',
    budgetEur: 15.0,
    colors: { primary: '#FFED00', secondary: '#0055A5', text: '#000000' },
    rivalClubs: ["Belenenses", "Casa Pia"],
    playStyle: 'Futebol praiano veloz e criativo em Cascais',
    coachName: 'Ian Cathro',
    squad: [
      { id: 'est_1', name: 'Joel Robles', position: 'GOL', ovr: 76, age: 34, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 1.0 },
      { id: 'est_2', name: 'Alejandro Marqués', position: 'CA', ovr: 76, age: 24, nationality: 'Venezuela', flag: '🇻🇪', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Arouca': {
    id: 'arouca',
    name: 'FC Arouca',
    shortName: 'Arouca',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Futebol_Clube_de_Arouca.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio Municipal de Arouca',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 12.0,
    colors: { primary: '#FFED00', secondary: '#0055A5', text: '#000000' },
    rivalClubs: ["Feirense"],
    playStyle: 'Futebol espanholizado na serra com toques rápidos e gols de Jason',
    coachName: 'Vasco Seabra',
    squad: [
      { id: 'aro_1', name: 'Nico Mantl', position: 'GOL', ovr: 75, age: 24, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 2.0 },
      { id: 'aro_2', name: 'Jason', position: 'PD', ovr: 77, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Nacional da Madeira': {
    id: 'nacional_mad',
    name: 'CD Nacional (Madeira)',
    shortName: 'Nacional',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/CD_Nacional_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio da Madeira (Choupana)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 12.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Marítimo"],
    playStyle: 'O clube onde Cristiano Ronaldo começou: névoa da Choupana e entrega física',
    coachName: 'Tiago Margarido',
    squad: [
      { id: 'nac_1', name: 'Lucas França', position: 'GOL', ovr: 74, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.2 },
      { id: 'nac_2', name: 'Nigel Thomas', position: 'PD', ovr: 75, age: 23, nationality: 'Curaçau', flag: '🇨🇼', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Farense': {
    id: 'farense',
    name: 'SC Farense',
    shortName: 'Farense',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/SC_Farense_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio de São Luís (Faro)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 12.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Olhanense", "Portimonense"],
    playStyle: 'Os Leões de Faro: calor do Algarve e transições rápidas',
    coachName: 'Tozé Marreco',
    squad: [
      { id: 'far_1', name: 'Ricardo Velho', position: 'GOL', ovr: 77, age: 26, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 4.0, isStar: true },
      { id: 'far_2', name: 'Elves Baldé', position: 'PE', ovr: 75, age: 25, nationality: 'Guiné-Bissau', flag: '🇬🇼', marketValueEur: 2.0 }
    ]
  },
  'AVS SAD': {
    id: 'avs_sad',
    name: 'AVS Futebol SAD',
    shortName: 'AVS SAD',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/2/23/AVS_Futebol_SAD.png',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio do CD das Aves (Vila das Aves)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 14.0,
    colors: { primary: '#cc0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Tirsense"],
    playStyle: 'Futebol ofensivo experiente com lendas do futebol como Guillermo Ochoa',
    coachName: 'Daniel Ramos',
    squad: [
      { id: 'avs_1', name: 'Guillermo Ochoa', position: 'GOL', ovr: 78, age: 39, nationality: 'México', flag: '🇲🇽', marketValueEur: 1.5, isStar: true },
      { id: 'avs_2', name: 'Rodrigo Ribeiro', position: 'CA', ovr: 75, age: 19, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 3.5 }
    ]
  },
  'Estrela da Amadora': {
    id: 'estrela_amadora',
    name: 'CF Estrela da Amadora',
    shortName: 'E. Amadora',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/pt/4/4b/CF_Estrela_da_Amadora_logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio José Gomes (Reboleira)',
    prestige: 2,
    formation: '3-4-3',
    budgetEur: 12.0,
    colors: { primary: '#cc0000', secondary: '#008000', text: '#ffffff' },
    rivalClubs: ["Benfica", "Sporting CP"],
    playStyle: 'A força tricolor da Reboleira com experiência e velocidade de Nani',
    coachName: 'José Faria',
    squad: [
      { id: 'est_a1', name: 'Bruno Brígido', position: 'GOL', ovr: 75, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0 },
      { id: 'est_a2', name: 'Nani', position: 'PE', ovr: 78, age: 37, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Casa Pia': {
    id: 'casa_pia',
    name: 'Casa Pia AC',
    shortName: 'Casa Pia',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Casa_Pia_A.C._logo.svg',
    leagueId: 'primeira_liga',
    league: 'Liga Portugal',
    country: 'Portugal',
    stadium: 'Estádio Municipal de Rio Maior',
    prestige: 2,
    formation: '3-4-3',
    budgetEur: 12.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Belenenses"],
    playStyle: 'Gansos de Lisboa: disciplina tática ferrenha de João Pereira',
    coachName: 'João Pereira',
    squad: [
      { id: 'cas_1', name: 'Patrick Sequeira', position: 'GOL', ovr: 75, age: 25, nationality: 'Costa Rica', flag: '🇨🇷', marketValueEur: 1.8 },
      { id: 'cas_2', name: 'Cassiano', position: 'CA', ovr: 75, age: 35, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 0.8, isStar: true }
    ]
  },
  'Heerenveen': {
    id: 'heerenveen',
    name: 'sc Heerenveen',
    shortName: 'Heerenveen',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/23/SC_Heerenveen_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Abe Lenstra Stadion',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#003399', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Groningen", "Cambuur"],
    playStyle: 'Futebol frisio ofensivo do lendário Robin van Persie com jovens talentos',
    coachName: 'Robin van Persie',
    squad: [
      { id: 'hee_1', name: 'Andries Noppert', position: 'GOL', ovr: 77, age: 30, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 3.0, isStar: true },
      { id: 'hee_2', name: 'Jacob Trenskow', position: 'PD', ovr: 76, age: 23, nationality: 'Dinamarca', flag: '🇩🇰', marketValueEur: 4.0 }
    ]
  },
  'Go Ahead Eagles': {
    id: 'go_ahead',
    name: 'Go Ahead Eagles',
    shortName: 'GA Eagles',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/Go_Ahead_Eagles_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'De Adelaarshorst (Deventer)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#FFED00', text: '#ffffff' },
    rivalClubs: ["PEC Zwolle"],
    playStyle: 'As Águias em De Adelaarshorst com futebol vertical elétrico',
    coachName: 'Paul Simonis',
    squad: [
      { id: 'gae_1', name: 'Luca Plogmann', position: 'GOL', ovr: 75, age: 24, nationality: 'Alemanha', flag: '🇩🇪', marketValueEur: 2.0 },
      { id: 'gae_2', name: 'Oliver Edvardsen', position: 'PE', ovr: 76, age: 25, nationality: 'Noruega', flag: '🇳🇴', marketValueEur: 3.5, isStar: true }
    ]
  },
  'NEC Nijmegen': {
    id: 'nec',
    name: 'NEC Nijmegen',
    shortName: 'NEC',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/NEC_Nijmegen_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Goffertstadion',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#008000', text: '#ffffff' },
    rivalClubs: ["Vitesse"],
    playStyle: 'Futebol técnico e rápido com o maestro japonês Koki Ogawa',
    coachName: 'Rogier Meijer',
    squad: [
      { id: 'nec_1', name: 'Robin Roefs', position: 'GOL', ovr: 74, age: 21, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 2.0 },
      { id: 'nec_2', name: 'Koki Ogawa', position: 'CA', ovr: 76, age: 27, nationality: 'Japão', flag: '🇯🇵', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Groningen': {
    id: 'groningen',
    name: 'FC Groningen',
    shortName: 'Groningen',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/FC_Groningen_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Euroborg',
    prestige: 3,
    formation: '4-4-2',
    budgetEur: 20.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Heerenveen"],
    playStyle: 'O Orgulho do Norte: tradição na Euroborg com jovens promissores',
    coachName: 'Dick Lukkien',
    squad: [
      { id: 'gro_1', name: 'Etienne Vaessen', position: 'GOL', ovr: 76, age: 29, nationality: 'Suriname', flag: '🇸🇷', marketValueEur: 2.5 },
      { id: 'gro_2', name: 'Jorg Schreuders', position: 'MEI', ovr: 76, age: 20, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Eyüpspor': {
    id: 'eyupspor',
    name: 'Eyüpspor Club',
    shortName: 'Eyüpspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Ey%C3%BCpspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Recep Tayyip Erdoğan Stadyumu',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 25.0,
    colors: { primary: '#4B0082', secondary: '#FFD700', text: '#ffffff' },
    rivalClubs: ["Kasımpaşa", "Fatih Karagümrük"],
    playStyle: 'A sensação de Arda Turan na elite com posse e liderança',
    coachName: 'Arda Turan',
    squad: [
      { id: 'eyu_1', name: 'Berke Özer', position: 'GOL', ovr: 76, age: 24, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 3.5 },
      { id: 'eyu_2', name: 'Mame Thiam', position: 'CA', ovr: 78, age: 32, nationality: 'Senegal', flag: '🇸🇳', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Göztepe': {
    id: 'goztepe',
    name: 'Göztepe SK',
    shortName: 'Göztepe',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/G%C3%B6ztepe_S.K._logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Gürsel Aksel Stadyumu (İzmir)',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 22.0,
    colors: { primary: '#FFED00', secondary: '#CC0000', text: '#000000' },
    rivalClubs: ["Karşıyaka"],
    playStyle: 'Torcida mais apaixonada do Mar Egeu em İzmir com ritmo intenso de Stanimir Stoilov',
    coachName: 'Stanimir Stoilov',
    squad: [
      { id: 'goz_1', name: 'Mateusz Lis', position: 'GOL', ovr: 76, age: 27, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 2.0 },
      { id: 'goz_2', name: 'Rômulo', position: 'CA', ovr: 77, age: 22, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Antalyaspor': {
    id: 'antalyaspor',
    name: 'Antalyaspor Club',
    shortName: 'Antalyaspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/ad/Antalyaspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Corendon Airlines Park (Antalya)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Alanyaspor"],
    playStyle: 'Futebol litorâneo mediterrâneo sob Alex de Souza',
    coachName: 'Alex de Souza',
    squad: [
      { id: 'ant_1', name: 'Kenan Pirić', position: 'GOL', ovr: 75, age: 30, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 1.5 },
      { id: 'ant_2', name: 'Sam Larsson', position: 'PE', ovr: 77, age: 31, nationality: 'Suécia', flag: '🇸🇪', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Gent': {
    id: 'gent',
    name: 'KAA Gent',
    shortName: 'Gent',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/KAA_Gent_logo.svg',
    leagueId: 'pro_league_bel',
    league: 'Pro League',
    country: 'Bélgica',
    stadium: 'Planet Group Arena (Ghelamco)',
    prestige: 3,
    formation: '3-4-1-2',
    budgetEur: 35.0,
    colors: { primary: '#0055A5', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Club Brugge"],
    playStyle: 'Os Búfalos: posse de bola refinada sob Wouter Vrancken',
    coachName: 'Wouter Vrancken',
    squad: [
      { id: 'gnt_1', name: 'Davy Roef', position: 'GOL', ovr: 77, age: 30, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 2.5 },
      { id: 'gnt_2', name: 'Omri Gandelman', position: 'MC', ovr: 78, age: 24, nationality: 'Israel', flag: '🇮🇱', marketValueEur: 5.5, isStar: true }
    ]
  },
  'Royal Antwerp': {
    id: 'antwerp',
    name: 'Royal Antwerp FC',
    shortName: 'Antwerp',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Royal_Antwerp_FC_logo.svg',
    leagueId: 'pro_league_bel',
    league: 'Pro League',
    country: 'Bélgica',
    stadium: 'Bosuilstadion',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 40.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Beerschot", "Club Brugge"],
    playStyle: 'O mais antigo clube da Bélgica: fúria no Bosuilstadion e faro de gol de Janssen',
    coachName: 'Jonas De Roeck',
    squad: [
      { id: 'ant_w1', name: 'Senne Lammens', position: 'GOL', ovr: 76, age: 22, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 3.0 },
      { id: 'ant_w2', name: 'Toby Alderweireld', position: 'ZAG', ovr: 81, age: 35, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 3.0, isStar: true },
      { id: 'ant_w3', name: 'Vincent Janssen', position: 'CA', ovr: 80, age: 30, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Standard Liège': {
    id: 'standard_liege',
    name: 'Standard de Liège',
    shortName: 'Standard',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4b/Standard_Li%C3%A8ge_logo.svg',
    leagueId: 'pro_league_bel',
    league: 'Pro League',
    country: 'Bélgica',
    stadium: 'Stade Maurice Dufrasne (Sclessin)',
    prestige: 3,
    formation: '3-5-2',
    budgetEur: 25.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Anderlecht", "Sporting Charleroi"],
    playStyle: 'O Inferno de Sclessin: torcida inflamada da Valônia e raça pura',
    coachName: 'Ivan Leko',
    squad: [
      { id: 'sta_1', name: 'Matthieu Epolo', position: 'GOL', ovr: 75, age: 19, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 3.0 },
      { id: 'sta_2', name: 'Arnaud Bodart', position: 'GOL', ovr: 77, age: 26, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Al-Taawoun': {
    id: 'al_taawoun',
    name: 'Al-Taawoun FC',
    shortName: 'Al-Taawoun',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/87/Al-Taawoun_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'King Abdullah Sport City Stadium (Buraidah)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 40.0,
    colors: { primary: '#FFD700', secondary: '#000080', text: '#000000' },
    rivalClubs: ["Al-Raed"],
    playStyle: 'Os Lobos de Buraidah com o goleiro brasileiro Mailson intransponível',
    coachName: 'Rodolfo Arruabarrena',
    squad: [
      { id: 'taa_1', name: 'Mailson', position: 'GOL', ovr: 79, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 3.5, isStar: true },
      { id: 'taa_2', name: 'Musa Barrow', position: 'PE', ovr: 80, age: 25, nationality: 'Gâmbia', flag: '🇬🇲', marketValueEur: 8.0, isStar: true }
    ]
  },
  'Al-Qadsiah': {
    id: 'al_qadsiah',
    name: 'Al-Qadsiah FC',
    shortName: 'Al-Qadsiah',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Al-Qadsiah_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Prince Saud bin Jalawi Stadium (Khobar)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 75.0,
    colors: { primary: '#CC0000', secondary: '#FFD700', text: '#ffffff' },
    rivalClubs: ["Al-Ettifaq"],
    playStyle: 'O novo gigante saudita com Nacho Fernández na zaga e Pierre-Emerick Aubameyang no ataque',
    coachName: 'Míchel González',
    squad: [
      { id: 'qad_1', name: 'Koen Casteels', position: 'GOL', ovr: 81, age: 32, nationality: 'Bélgica', flag: '🇧🇪', marketValueEur: 6.0 },
      { id: 'qad_2', name: 'Nacho Fernández', position: 'ZAG', ovr: 82, age: 34, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 3.0, isStar: true },
      { id: 'qad_3', name: 'Ezequiel Fernández', position: 'VOL', ovr: 80, age: 22, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 15.0 },
      { id: 'qad_4', name: 'Pierre-Emerick Aubameyang', position: 'CA', ovr: 82, age: 35, nationality: 'Gabão', flag: '🇬🇦', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Al-Fateh': {
    id: 'al_fateh',
    name: 'Al-Fateh SC',
    shortName: 'Al-Fateh',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4e/Al-Fateh_SC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Al-Fateh Club Stadium (Al-Hasa)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#0033A0', secondary: '#008000', text: '#ffffff' },
    rivalClubs: ["Al-Ettifaq"],
    playStyle: 'Futebol veloz com a experiência e bolas paradas de Lucas Zelarayán',
    coachName: 'Jens Gustafsson',
    squad: [
      { id: 'fat_1', name: 'Péter Szappanos', position: 'GOL', ovr: 75, age: 34, nationality: 'Hungria', flag: '🇭🇺', marketValueEur: 1.2 },
      { id: 'fat_2', name: 'Lucas Zelarayán', position: 'MEI', ovr: 81, age: 32, nationality: 'Armênia', flag: '🇦🇲', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Racing Club': {
    id: 'racing_arg',
    name: 'Racing Club de Avellaneda',
    shortName: 'Racing',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Cilindro de Avellaneda (Presidente Perón)',
    prestige: 4,
    formation: '3-4-1-2',
    budgetEur: 25.0,
    colors: { primary: '#87CEEB', secondary: '#ffffff', text: '#000000' },
    rivalClubs: ["Independiente", "River Plate", "Boca Juniors"],
    playStyle: 'A Academia: intensidade vulcânica no Cilindro com o faro de Adrián Martínez',
    coachName: 'Gustavo Costas',
    squad: [
      { id: 'rac_1', name: 'Gabriel Arias', position: 'GOL', ovr: 79, age: 37, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 1.5 },
      { id: 'rac_2', name: 'Juan Fernando Quintero', position: 'MEI', ovr: 82, age: 31, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 2.5, isStar: true },
      { id: 'rac_3', name: 'Adrián Martínez', position: 'CA', ovr: 80, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 3.5, isStar: true }
    ]
  },
  'Independiente': {
    id: 'independiente',
    name: 'CA Independiente',
    shortName: 'Independiente',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Libertadores de América - Ricardo Enrique Bochini',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 20.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Racing", "Boca Juniors"],
    playStyle: 'Rey de Copas: tradição gigante em Avellaneda sob Julio Vaccari',
    coachName: 'Julio Vaccari',
    squad: [
      { id: 'ind_1', name: 'Rodrigo Rey', position: 'GOL', ovr: 78, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.8 },
      { id: 'ind_2', name: 'Felipe Loyola', position: 'MC', ovr: 78, age: 24, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 3.5, isStar: true },
      { id: 'ind_3', name: 'Gabriel Ávalos', position: 'CA', ovr: 77, age: 34, nationality: 'Paraguai', flag: '🇵🇾', marketValueEur: 1.5 }
    ]
  },
  'San Lorenzo': {
    id: 'san_lorenzo',
    name: 'CA San Lorenzo de Almagro',
    shortName: 'San Lorenzo',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Pedro Bidegain (Nuevo Gasómetro)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#002B49', secondary: '#A81E2E', text: '#ffffff' },
    rivalClubs: ["Huracán", "Boca Juniors"],
    playStyle: 'Los Cuervos de Boedo: raça argentina e liderança sob Miguel Ángel Russo com Iker Muniain',
    coachName: 'Miguel Ángel Russo',
    squad: [
      { id: 'slo_1', name: 'Gastón Gómez', position: 'GOL', ovr: 76, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5 },
      { id: 'slo_2', name: 'Iker Muniain', position: 'MEI', ovr: 80, age: 31, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 4.5, isStar: true }
    ]
  },
  'Vélez Sarsfield': {
    id: 'velez',
    name: 'CA Vélez Sarsfield',
    shortName: 'Vélez',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'José Amalfitani (El Fortín)',
    prestige: 4,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#003F87', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Ferro Carril Oeste", "San Lorenzo"],
    playStyle: 'El Fortín: futebol avassalador de Gustavo Quinteros liderando a Argentina',
    coachName: 'Gustavo Quinteros',
    squad: [
      { id: 'vel_1', name: 'Tomás Marchiori', position: 'GOL', ovr: 78, age: 29, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5 },
      { id: 'vel_2', name: 'Claudio Aquino', position: 'MEI', ovr: 80, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5, isStar: true },
      { id: 'vel_3', name: 'Braian Romero', position: 'CA', ovr: 79, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Estudiantes': {
    id: 'estudiantes',
    name: 'Estudiantes de La Plata',
    shortName: 'Estudiantes',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Escudo_de_Estudiantes_de_La_Plata.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Jorge Luis Hirschi (UNO)',
    prestige: 4,
    formation: '4-3-3',
    budgetEur: 22.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Gimnasia La Plata"],
    playStyle: 'Escola de La Plata: garra infinita, disciplina de ferro de Eduardo Domínguez e paixão no estádio UNO',
    coachName: 'Eduardo Domínguez',
    squad: [
      { id: 'elp_1', name: 'Matías Mansilla', position: 'GOL', ovr: 77, age: 28, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5 },
      { id: 'elp_2', name: 'Enzo Pérez', position: 'VOL', ovr: 79, age: 38, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.0, isStar: true },
      { id: 'elp_3', name: 'Guido Carrillo', position: 'CA', ovr: 78, age: 33, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5, isStar: true }
    ]
  },

  'Bristol City': {
    id: 'bristol_city',
    name: 'Bristol City FC',
    shortName: 'Bristol City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Ashton Gate Stadium',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#E03A3E', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Bristol Rovers", "Cardiff City"],
    playStyle: 'Futebol veloz no sudoeste inglês de Liam Manning',
    coachName: 'Liam Manning',
    squad: [
      { id: 'bri_1', name: "Max O'Leary", position: 'GOL', ovr: 75, age: 28, nationality: 'Irlanda', flag: '🇮🇪', marketValueEur: 2.0 },
      { id: 'bri_2', name: 'Anis Mehmeti', position: 'PE', ovr: 76, age: 23, nationality: 'Albânia', flag: '🇦🇱', marketValueEur: 3.5, isStar: true }
    ]
  },
  'Preston North End': {
    id: 'preston',
    name: 'Preston North End FC',
    shortName: 'Preston',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/82/Preston_North_End_FC.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Deepdale',
    prestige: 2,
    formation: '3-5-2',
    budgetEur: 20.0,
    colors: { primary: '#FFFFFF', secondary: '#002B49', text: '#000000' },
    rivalClubs: ["Blackpool", "Blackburn Rovers"],
    playStyle: 'O primeiro campeão inglês da história em Deepdale sob Paul Heckingbottom',
    coachName: 'Paul Heckingbottom',
    squad: [
      { id: 'pne_1', name: 'Freddie Woodman', position: 'GOL', ovr: 76, age: 27, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.0 },
      { id: 'pne_2', name: 'Sam Greenwood', position: 'MEI', ovr: 75, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.5, isStar: true }
    ]
  },
  'Sheffield Wednesday': {
    id: 'sheff_wed',
    name: 'Sheffield Wednesday FC',
    shortName: 'Sheff Wed',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/88/Sheffield_Wednesday_crest.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Hillsborough Stadium',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 24.0,
    colors: { primary: '#0055A5', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Sheffield United", "Leeds United"],
    playStyle: 'As Corujas de Hillsborough com futebol dinâmico de Danny Röhl',
    coachName: 'Danny Röhl',
    squad: [
      { id: 'shw_1', name: 'James Beadle', position: 'GOL', ovr: 75, age: 20, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 3.0 },
      { id: 'shw_2', name: 'Josh Windass', position: 'MEI', ovr: 76, age: 30, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Plymouth Argyle': {
    id: 'plymouth',
    name: 'Plymouth Argyle FC',
    shortName: 'Plymouth',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a8/Plymouth_Argyle_FC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Home Park',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#00552b', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Exeter City"],
    playStyle: 'Os Peregrinos com Wayne Rooney e talento de Morgan Whittaker',
    coachName: 'Wayne Rooney',
    squad: [
      { id: 'ply_1', name: 'Daniel Grimshaw', position: 'GOL', ovr: 74, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.5 },
      { id: 'ply_2', name: 'Morgan Whittaker', position: 'PD', ovr: 77, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 9.0, isStar: true }
    ]
  },
  'Oxford United': {
    id: 'oxford_utd',
    name: 'Oxford United FC',
    shortName: 'Oxford Utd',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/Oxford_United_FC_logo.svg',
    leagueId: 'championship',
    league: 'EFL Championship',
    country: 'Inglaterra',
    stadium: 'Kassam Stadium',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#FFED00', secondary: '#002B49', text: '#000000' },
    rivalClubs: ["Swindon Town"],
    playStyle: 'Futebol corajoso dos Amarelos na volta à Championship',
    coachName: 'Des Buckingham',
    squad: [
      { id: 'oxf_1', name: 'Jamie Cumming', position: 'GOL', ovr: 74, age: 25, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 1.5 },
      { id: 'oxf_2', name: 'Mark Harris', position: 'CA', ovr: 75, age: 25, nationality: 'País de Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Sparta Rotterdam': {
    id: 'sparta_rotterdam',
    name: 'Sparta Rotterdam',
    shortName: 'Sparta',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/Sparta_Rotterdam_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Het Kasteel',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 16.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Feyenoord", "Excelsior"],
    playStyle: 'O clube mais antigo do futebol profissional holandês no Het Kasteel',
    coachName: 'Maurice Steijn',
    squad: [
      { id: 'spa_1', name: 'Nick Olij', position: 'GOL', ovr: 77, age: 29, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 3.0, isStar: true },
      { id: 'spa_2', name: 'Tobias Lauritsen', position: 'CA', ovr: 76, age: 27, nationality: 'Noruega', flag: '🇳🇴', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Fortuna Sittard': {
    id: 'fortuna_sittard',
    name: 'Fortuna Sittard',
    shortName: 'Fortuna',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Fortuna_Sittard_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Fortuna Sittard Stadion',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 15.0,
    colors: { primary: '#008000', secondary: '#FFED00', text: '#ffffff' },
    rivalClubs: ["Roda JC", "MVV"],
    playStyle: 'Futebol tático de Limburgo sob Danny Buijs com Alen Halilović brilhando',
    coachName: 'Danny Buijs',
    squad: [
      { id: 'for_1', name: 'Mattijs Branderhorst', position: 'GOL', ovr: 75, age: 30, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 1.2 },
      { id: 'for_2', name: 'Alen Halilović', position: 'MEI', ovr: 78, age: 28, nationality: 'Croácia', flag: '🇭🇷', marketValueEur: 3.5, isStar: true }
    ]
  },
  'PEC Zwolle': {
    id: 'pec_zwolle',
    name: 'PEC Zwolle',
    shortName: 'PEC Zwolle',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f6/PEC_Zwolle_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'MAC³PARK Stadion',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 15.0,
    colors: { primary: '#0055A5', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Go Ahead Eagles"],
    playStyle: 'Derbi do rio IJssel com toque de bola dinâmico',
    coachName: 'Johnny Jansen',
    squad: [
      { id: 'pec_1', name: 'Jasper Schendelaar', position: 'GOL', ovr: 75, age: 24, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 2.0 },
      { id: 'pec_2', name: 'Dylan Vente', position: 'CA', ovr: 76, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 3.0, isStar: true }
    ]
  },
  'NAC Breda': {
    id: 'nac_breda',
    name: 'NAC Breda',
    shortName: 'NAC Breda',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9a/NAC_Breda_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Rat Verlegh Stadion',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 15.0,
    colors: { primary: '#FFED00', secondary: '#000000', text: '#000000' },
    rivalClubs: ["Willem II"],
    playStyle: "A mística da Avondje NAC sob os refletores de Breda",
    coachName: 'Carl Hoefkens',
    squad: [
      { id: 'nac_b1', name: 'Daniel Bielica', position: 'GOL', ovr: 74, age: 25, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 1.5 },
      { id: 'nac_b2', name: 'Dominik Janošek', position: 'MEI', ovr: 76, age: 26, nationality: 'República Tcheca', flag: '🇨🇿', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Heracles Almelo': {
    id: 'heracles',
    name: 'Heracles Almelo',
    shortName: 'Heracles',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Heracles_Almelo_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Asito Stadion',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 14.0,
    colors: { primary: '#000000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["FC Twente"],
    playStyle: 'Futebol disciplinado em Twente com grama veloz',
    coachName: 'Erwin van de Looi',
    squad: [
      { id: 'her_1', name: 'Fabian de Keijzer', position: 'GOL', ovr: 74, age: 24, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 1.2 },
      { id: 'her_2', name: 'Luka Kulenović', position: 'CA', ovr: 75, age: 25, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 2.0, isStar: true }
    ]
  },
  'RKC Waalwijk': {
    id: 'rkc_waalwijk',
    name: 'RKC Waalwijk',
    shortName: 'RKC',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/87/RKC_Waalwijk_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Mandemakers Stadion',
    prestige: 1,
    formation: '4-3-3',
    budgetEur: 12.0,
    colors: { primary: '#FFED00', secondary: '#0055A5', text: '#000000' },
    rivalClubs: ["Willem II"],
    playStyle: 'Futebol combativo de Brabante buscando superação',
    coachName: 'Henk Fraser',
    squad: [
      { id: 'rkc_1', name: 'Jeroen Houwen', position: 'GOL', ovr: 73, age: 28, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 0.8 },
      { id: 'rkc_2', name: 'Michiel Kramer', position: 'CA', ovr: 74, age: 36, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 0.5, isStar: true }
    ]
  },
  'Almere City': {
    id: 'almere_city',
    name: 'Almere City FC',
    shortName: 'Almere City',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Almere_City_FC_logo.svg',
    leagueId: 'eredivisie',
    league: 'Eredivisie',
    country: 'Holanda',
    stadium: 'Yanmar Stadion',
    prestige: 1,
    formation: '4-2-3-1',
    budgetEur: 12.0,
    colors: { primary: '#CC0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Ajax"],
    playStyle: 'O caçula da Eredivisie com energia pura em Flevoland',
    coachName: 'Hedwiges Maduro',
    squad: [
      { id: 'alm_1', name: 'Nordin Bakker', position: 'GOL', ovr: 74, age: 27, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 1.2 },
      { id: 'alm_2', name: 'Thomas Robinet', position: 'CA', ovr: 75, age: 28, nationality: 'França', flag: '🇫🇷', marketValueEur: 1.8, isStar: true }
    ]
  },
  'Kasımpaşa': {
    id: 'kasimpasa',
    name: 'Kasımpaşa SK',
    shortName: 'Kasımpaşa',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kas%C4%B1mpa%C5%9Fa_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Recep Tayyip Erdoğan Stadyumu (Istambul)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#002B49', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Eyüpspor", "Fatih Karagümrük"],
    playStyle: 'Futebol ofensivo do Bósforo com Haris Hajradinović desfilando',
    coachName: 'Sami Uğurlu',
    squad: [
      { id: 'kas_1', name: 'Andreas Gianniotis', position: 'GOL', ovr: 76, age: 31, nationality: 'Grécia', flag: '🇬🇷', marketValueEur: 1.8 },
      { id: 'kas_2', name: 'Haris Hajradinović', position: 'MEI', ovr: 78, age: 30, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 4.0, isStar: true }
    ]
  },
  'Sivasspor': {
    id: 'sivasspor',
    name: 'Sivasspor Kulübü',
    shortName: 'Sivasspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/3/30/Sivasspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Yeni 4 Eylül Stadyumu (Sivas)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Kayserispor"],
    playStyle: 'Frio implacável da Anatólia Central e contra-ataques cirúrgicos de Rey Manaj',
    coachName: 'Bülent Uygun',
    squad: [
      { id: 'siv_1', name: 'Ali Şaşal Vural', position: 'GOL', ovr: 75, age: 34, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 0.8 },
      { id: 'siv_2', name: 'Rey Manaj', position: 'CA', ovr: 79, age: 27, nationality: 'Albânia', flag: '🇦🇱', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Alanyaspor': {
    id: 'alanyaspor',
    name: 'Alanyaspor Kulübü',
    shortName: 'Alanyaspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/26/Alanyaspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Gain Park Stadyumu (Alanya)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#F78F1E', secondary: '#008000', text: '#ffffff' },
    rivalClubs: ["Antalyaspor"],
    playStyle: 'Futebol envolvente na Riviera Turca sob Fatih Tekke',
    coachName: 'Fatih Tekke',
    squad: [
      { id: 'ala_y1', name: 'Ertuğrul Taşkıran', position: 'GOL', ovr: 75, age: 35, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 0.8 },
      { id: 'ala_y2', name: 'Efecan Karaca', position: 'PD', ovr: 77, age: 35, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 1.2, isStar: true }
    ]
  },
  'Konyaspor': {
    id: 'konyaspor',
    name: 'Konyaspor Kulübü',
    shortName: 'Konyaspor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Konyaspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Medaş Konya Büyükşehir Stadyumu',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#008000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Antalyaspor"],
    playStyle: 'As Águias da Anatólia com disciplina tática e apoio de 40 mil torcedores',
    coachName: 'Recep Uçar',
    squad: [
      { id: 'kon_1', name: 'Jakub Słowik', position: 'GOL', ovr: 75, age: 33, nationality: 'Polônia', flag: '🇵🇱', marketValueEur: 1.0 },
      { id: 'kon_2', name: 'Pedrinho', position: 'MEI', ovr: 77, age: 31, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 2.2, isStar: true }
    ]
  },
  'Çaykur Rizespor': {
    id: 'rizespor',
    name: 'Çaykur Rizespor Kulübü',
    shortName: 'Rizespor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/%C3%87aykur_Rizespor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Çaykur Didi Stadyumu (Rize)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#0055A5', secondary: '#008000', text: '#ffffff' },
    rivalClubs: ["Trabzonspor"],
    playStyle: 'A força do chá turco no Mar Negro sob İlhan Palut com velocidade de Olawoyin',
    coachName: 'İlhan Palut',
    squad: [
      { id: 'riz_1', name: 'Gökhan Akkan', position: 'GOL', ovr: 75, age: 29, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 1.5 },
      { id: 'riz_2', name: 'Ibrahim Olawoyin', position: 'MC', ovr: 77, age: 26, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Kayserispor': {
    id: 'kayserispor',
    name: 'Kayserispor Kulübü',
    shortName: 'Kayserispor',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/3/30/Kayserispor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'RHG Enertürk Enerji Stadyumu (Kayseri)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 16.0,
    colors: { primary: '#FFED00', secondary: '#CC0000', text: '#000000' },
    rivalClubs: ["Sivasspor"],
    playStyle: 'Futebol guerreiro aos pés do vulcão Erciyes com o talento de Cardoso',
    coachName: 'Sinan Kaloğlu',
    squad: [
      { id: 'kay_1', name: 'Bilal Bayazit', position: 'GOL', ovr: 76, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 2.8 },
      { id: 'kay_2', name: 'Miguel Cardoso', position: 'PE', ovr: 77, age: 30, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Adana Demirspor': {
    id: 'adana_demirspor',
    name: 'Adana Demirspor Kulübü',
    shortName: 'Adana Demir',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/8/87/Adana_Demirspor_logo.svg',
    leagueId: 'super_lig',
    league: 'Süper Lig',
    country: 'Turquia',
    stadium: 'Yeni Adana Stadyumu',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 16.0,
    colors: { primary: '#002B49', secondary: '#87CEEB', text: '#ffffff' },
    rivalClubs: ["Adanaspor"],
    playStyle: 'Os Relâmpagos Azuis com calor ensurdecedor em Adana',
    coachName: 'Serkan Damla',
    squad: [
      { id: 'ada_1', name: 'Vedat Karakuş', position: 'GOL', ovr: 73, age: 26, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 0.8 },
      { id: 'ada_2', name: 'Semih Güler', position: 'ZAG', ovr: 75, age: 29, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Al-Kholood': {
    id: 'al_kholood',
    name: 'Al-Kholood Club',
    shortName: 'Al-Kholood',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6f/Al-Kholood_Club_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Al-Hazem Club Stadium (Ar Rass)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#CC0000', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Al-Hazem"],
    playStyle: 'Futebol saudita veloz com Alex Collado desequilibrando',
    coachName: 'Noureddine Zekri',
    squad: [
      { id: 'kho_1', name: 'Marcelo Grohe', position: 'GOL', ovr: 78, age: 37, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 1.0, isStar: true },
      { id: 'kho_2', name: 'Álex Collado', position: 'MEI', ovr: 78, age: 25, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 3.5, isStar: true }
    ]
  },
  'Al-Riyadh': {
    id: 'al_riyadh',
    name: 'Al-Riyadh SC',
    shortName: 'Al-Riyadh',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/0/07/Al-Riyadh_SC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Prince Turki bin Abdul Aziz Stadium (Riyadh)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 28.0,
    colors: { primary: '#CC0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Al-Shabab", "Al-Hilal"],
    playStyle: 'O tradicional clube da capital com o goleador veterano Mohamed Konaté',
    coachName: 'Sabri Lamouchi',
    squad: [
      { id: 'riy_1', name: 'Milan Borjan', position: 'GOL', ovr: 77, age: 37, nationality: 'Canadá', flag: '🇨🇦', marketValueEur: 1.0 },
      { id: 'riy_2', name: 'Bernard Mensah', position: 'MEI', ovr: 78, age: 30, nationality: 'Gana', flag: '🇬🇭', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Al-Fayha': {
    id: 'al_fayha',
    name: 'Al-Fayha FC',
    shortName: 'Al-Fayha',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Al-Fayha_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: "Al-Majma'ah Sports City",
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 30.0,
    colors: { primary: '#F78F1E', secondary: '#003F87', text: '#ffffff' },
    rivalClubs: ["Al-Faisaly"],
    playStyle: 'Futebol de combate no deserto com o talento de Alejandro Pozuelo',
    coachName: 'Christos Kontis',
    squad: [
      { id: 'fay_1', name: 'Orlando Mosquera', position: 'GOL', ovr: 75, age: 29, nationality: 'Panamá', flag: '🇵🇦', marketValueEur: 1.2 },
      { id: 'fay_2', name: 'Alejandro Pozuelo', position: 'MEI', ovr: 78, age: 33, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 2.5, isStar: true }
    ]
  },
  'Al-Khaleej': {
    id: 'al_khaleej',
    name: 'Al-Khaleej Club',
    shortName: 'Al-Khaleej',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/5/52/Al-Khaleej_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Al-Khaleej Club Stadium (Saihat)',
    prestige: 2,
    formation: '4-3-3',
    budgetEur: 28.0,
    colors: { primary: '#FFED00', secondary: '#008000', text: '#000000' },
    rivalClubs: ["Al-Ettifaq"],
    playStyle: 'As Águias do Golfo com a maestria de Fábio Martins e Kostas Fortounis',
    coachName: 'Georgios Donis',
    squad: [
      { id: 'kha_1', name: 'Ibrahim Šehić', position: 'GOL', ovr: 76, age: 36, nationality: 'Bósnia e Herzegovina', flag: '🇧🇦', marketValueEur: 0.8 },
      { id: 'kha_2', name: 'Kostas Fortounis', position: 'MEI', ovr: 79, age: 32, nationality: 'Grécia', flag: '🇬🇷', marketValueEur: 3.0, isStar: true },
      { id: 'kha_3', name: 'Fábio Martins', position: 'PE', ovr: 78, age: 31, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Damac': {
    id: 'damac',
    name: 'Damac FC',
    shortName: 'Damac',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/9/91/Damac_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'Damac Club Stadium (Khamis Mushait)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 28.0,
    colors: { primary: '#CC0000', secondary: '#FFED00', text: '#ffffff' },
    rivalClubs: ["Abha Club"],
    playStyle: 'Futebol de altitude nas montanhas de Asir com gols de Georges-Kévin Nkoudou',
    coachName: 'Cosmin Contra',
    squad: [
      { id: 'dam_1', name: 'Florin Niță', position: 'GOL', ovr: 77, age: 37, nationality: 'Romênia', flag: '🇷🇴', marketValueEur: 0.5 },
      { id: 'dam_2', name: 'Georges-Kévin Nkoudou', position: 'PE', ovr: 80, age: 29, nationality: 'Camarões', flag: '🇨🇲', marketValueEur: 5.0, isStar: true }
    ]
  },
  'Al-Wehda': {
    id: 'al_wehda',
    name: 'Al-Wehda FC',
    shortName: 'Al-Wehda',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Al-Wehda_FC_logo.svg',
    leagueId: 'saudi_pro',
    league: 'Saudi League',
    country: 'Arábia Saudita',
    stadium: 'King Abdul Aziz Stadium (Makkah)',
    prestige: 2,
    formation: '4-2-3-1',
    budgetEur: 28.0,
    colors: { primary: '#CC0000', secondary: '#FFFFFF', text: '#ffffff' },
    rivalClubs: ["Al-Ahli", "Al-Ittihad"],
    playStyle: 'O clube dos Cavaleiros de Meca com liderança de Odion Ighalo',
    coachName: 'Josef Zinnbauer',
    squad: [
      { id: 'weh_1', name: 'Munir Mohamedi', position: 'GOL', ovr: 77, age: 35, nationality: 'Marrocos', flag: '🇲🇦', marketValueEur: 1.2 },
      { id: 'weh_2', name: 'Odion Ighalo', position: 'CA', ovr: 78, age: 35, nationality: 'Nigéria', flag: '🇳🇬', marketValueEur: 1.8, isStar: true }
    ]
  },
  'Talleres': {
    id: 'talleres',
    name: 'CA Talleres (Córdoba)',
    shortName: 'Talleres',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Club_Atl%C3%A9tico_Talleres_%28C%C3%B3rdoba%29.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Mario Alberto Kempes (Córdoba)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 22.0,
    colors: { primary: '#002B49', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Belgrano", "Instituto"],
    playStyle: 'A Matilha de Córdoba: 55 mil no Kempes e velocidade absurda no ataque',
    coachName: 'Alexander Medina',
    squad: [
      { id: 'tal_1', name: 'Guido Herrera', position: 'GOL', ovr: 78, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5 },
      { id: 'tal_2', name: 'Rubén Botta', position: 'MEI', ovr: 79, age: 34, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.0, isStar: true }
    ]
  },
  'Huracán': {
    id: 'huracan',
    name: 'CA Huracán',
    shortName: 'Huracán',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Escudo_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Tomás Adolfo Ducó (El Palacio)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["San Lorenzo"],
    playStyle: 'O Globo do Parque Patricios: zaga impenetrável sob Frank Kudelka',
    coachName: 'Frank Kudelka',
    squad: [
      { id: 'hur_1', name: 'Hernán Galíndez', position: 'GOL', ovr: 78, age: 37, nationality: 'Equador', flag: '🇪🇨', marketValueEur: 1.0, isStar: true },
      { id: 'hur_2', name: 'Rodrigo Echeverría', position: 'VOL', ovr: 78, age: 29, nationality: 'Chile', flag: '🇨🇱', marketValueEur: 3.0, isStar: true }
    ]
  },
  'Lanús': {
    id: 'lanus',
    name: 'CA Lanús',
    shortName: 'Lanús',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Escudo_del_Club_Atl%C3%A9tico_Lan%C3%BAs.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Ciudad de Lanús - Néstor Díaz Pérez (La Fortaleza)',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#800020', secondary: '#ffffff', text: '#ffffff' },
    rivalClubs: ["Banfield"],
    playStyle: 'La Fortaleza Granate: raça sul-americana com a lenda Walter Bou',
    coachName: 'Ricardo Zielinski',
    squad: [
      { id: 'lan_1', name: 'Nahuel Losada', position: 'GOL', ovr: 77, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5 },
      { id: 'lan_2', name: 'Walter Bou', position: 'CA', ovr: 79, age: 31, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 2.5, isStar: true }
    ]
  },
  "Newell's Old Boys": {
    id: 'newells',
    name: "CA Newell's Old Boys",
    shortName: "Newell's",
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Marcelo Bielsa (El Coloso del Parque)',
    prestige: 3,
    formation: '4-3-3',
    budgetEur: 18.0,
    colors: { primary: '#CC0000', secondary: '#000000', text: '#ffffff' },
    rivalClubs: ["Rosario Central"],
    playStyle: 'O berço de Messi e Bielsa no Coloso de Rosario com fervor histórico',
    coachName: 'Ricardo Lunari',
    squad: [
      { id: 'new_1', name: 'Ramiro Macagno', position: 'GOL', ovr: 76, age: 27, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5 },
      { id: 'new_2', name: 'Éver Banega', position: 'MC', ovr: 80, age: 36, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.5, isStar: true }
    ]
  },
  'Rosario Central': {
    id: 'rosario_central',
    name: 'CA Rosario Central',
    shortName: 'Rosario Central',
    badgeUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Escudo_del_Club_Atl%C3%A9tico_Rosario_Central.svg',
    leagueId: 'liga_argentina',
    league: 'Liga Profesional Argentina',
    country: 'Argentina',
    stadium: 'Gigante de Arroyito',
    prestige: 3,
    formation: '4-2-3-1',
    budgetEur: 18.0,
    colors: { primary: '#002B49', secondary: '#FFED00', text: '#ffffff' },
    rivalClubs: ["Newell's Old Boys"],
    playStyle: 'O Gigante de Arroyito tremendo na paixão canalla sob Ariel Holan',
    coachName: 'Ariel Holan',
    squad: [
      { id: 'cen_1', name: 'Jorge Broun', position: 'GOL', ovr: 77, age: 38, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 0.8 },
      { id: 'cen_2', name: 'Ignacio Malcorra', position: 'MEI', ovr: 78, age: 37, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 1.0, isStar: true }
    ]
  },

  'Gaziantep FK': {
    "key": "Gaziantep FK",
    "id": "gaziantep",
    "name": "Gaziantep FK",
    "shortName": "Gaziantep",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a2/Gaziantep_FK_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Kalyon Stadium",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#E31E24",
      "secondary": "#000000",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Hatayspor",
      "Adana Demirspor"
    ],
    "playStyle": "Intensidade física do sul turco e bolas paradas",
    "coachName": "Selçuk İnan",
    "squad": [
      {
        "id": "gaz_1",
        "name": "Mustafa Burak Bozan",
        "position": "GOL",
        "ovr": 72,
        "age": 24,
        "nationality": "Turquia",
        "flag": "🇹🇷",
        "marketValueEur": 1.0
      },
      {
        "id": "gaz_2",
        "name": "Alexandru Maxim",
        "position": "MEI",
        "ovr": 75,
        "age": 34,
        "nationality": "Romênia",
        "flag": "🇷🇴",
        "marketValueEur": 2.0,
        "isStar": true
      },
      {
        "id": "gaz_3",
        "name": "David Okereke",
        "position": "CA",
        "ovr": 74,
        "age": 27,
        "nationality": "Nigéria",
        "flag": "🇳🇬",
        "marketValueEur": 2.8
      }
    ]
  },
  'Bodrum FK': {
    "key": "Bodrum FK",
    "id": "bodrum_fk",
    "name": "Bodrum FK",
    "shortName": "Bodrum FK",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Bodrum_FK_logo.png",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Bodrum İlçe Stadium",
    "prestige": 2,
    "formation": "4-1-4-1",
    "budgetEur": 14.0,
    "colors": {
      "primary": "#009639",
      "secondary": "#ffffff",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Göztepe",
      "Antalyaspor"
    ],
    "playStyle": "Pressão no meio-campo e velocidade costeira",
    "coachName": "Volkan Demirel",
    "squad": [
      {
        "id": "bod_1",
        "name": "Diogo Sousa",
        "position": "GOL",
        "ovr": 71,
        "age": 26,
        "nationality": "Portugal",
        "flag": "🇵🇹",
        "marketValueEur": 1.2
      },
      {
        "id": "bod_2",
        "name": "George Pușcaș",
        "position": "CA",
        "ovr": 73,
        "age": 28,
        "nationality": "Romênia",
        "flag": "🇷🇴",
        "marketValueEur": 2.2,
        "isStar": true
      },
      {
        "id": "bod_3",
        "name": "Taulant Seferi",
        "position": "PE",
        "ovr": 73,
        "age": 27,
        "nationality": "Albânia",
        "flag": "🇦🇱",
        "marketValueEur": 2.0
      }
    ]
  },
  'Hatayspor': {
    "key": "Hatayspor",
    "id": "hatayspor",
    "name": "Hatayspor Kulübü",
    "shortName": "Hatayspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e0/Hatayspor_logo.png",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Mersin Stadium",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 16.0,
    "colors": {
      "primary": "#800020",
      "secondary": "#ffffff",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Gaziantep FK",
      "Adana Demirspor"
    ],
    "playStyle": "Futebol de superação e contra-ataques verticais",
    "coachName": "Rıza Çalımbay",
    "squad": [
      {
        "id": "hat_1",
        "name": "Erce Kardeşler",
        "position": "GOL",
        "ovr": 72,
        "age": 30,
        "nationality": "Turquia",
        "flag": "🇹🇷",
        "marketValueEur": 1.0
      },
      {
        "id": "hat_2",
        "name": "Vincent Aboubakar",
        "position": "CA",
        "ovr": 78,
        "age": 32,
        "nationality": "Camarões",
        "flag": "🇨🇲",
        "marketValueEur": 3.8,
        "isStar": true
      },
      {
        "id": "hat_3",
        "name": "Joelson Fernandes",
        "position": "PE",
        "ovr": 73,
        "age": 21,
        "nationality": "Portugal",
        "flag": "🇵🇹",
        "marketValueEur": 2.2
      }
    ]
  },
  'Al-Okhdood': {
    "key": "Al-Okhdood",
    "id": "al_okhdood",
    "name": "Al-Okhdood Club",
    "shortName": "Al-Okhdood",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Al-Okhdood_Club_logo.png",
    "leagueId": "saudi_pro",
    "league": "Saudi Pro League",
    "country": "Arábia Saudita",
    "stadium": "Prince Hathloul Stadium",
    "prestige": 2,
    "formation": "5-3-2",
    "budgetEur": 16.0,
    "colors": {
      "primary": "#0055A5",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Damac FC",
      "Al-Wehda"
    ],
    "playStyle": "Linha de 5 defensiva com contra-golpe físico",
    "coachName": "Stjepan Tomas",
    "squad": [
      {
        "id": "okh_1",
        "name": "Paulo Vítor",
        "position": "GOL",
        "ovr": 73,
        "age": 35,
        "nationality": "Brasil",
        "flag": "🇧🇷",
        "marketValueEur": 1.0
      },
      {
        "id": "okh_2",
        "name": "Christian Bassogog",
        "position": "PD",
        "ovr": 75,
        "age": 29,
        "nationality": "Camarões",
        "flag": "🇨🇲",
        "marketValueEur": 2.8,
        "isStar": true
      },
      {
        "id": "okh_3",
        "name": "Ibrahima Koné",
        "position": "CA",
        "ovr": 74,
        "age": 25,
        "nationality": "Mali",
        "flag": "🇲🇱",
        "marketValueEur": 3.0
      }
    ]
  },
  'Al-Orobah': {
    "key": "Al-Orobah",
    "id": "al_orobah",
    "name": "Al-Orobah FC",
    "shortName": "Al-Orobah",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/87/Al-Orobah_FC_logo.png",
    "leagueId": "saudi_pro",
    "league": "Saudi Pro League",
    "country": "Arábia Saudita",
    "stadium": "Al-Orobah Club Stadium",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#FFFF00",
      "secondary": "#008000",
      "text": "#000000"
    },
    "rivalClubs": [
      "Al-Raed",
      "Al-Fayha"
    ],
    "playStyle": "Futebol veloz com Kurt Zouma na zaga e Tello no ataque",
    "coachName": "Álvaro Pacheco",
    "squad": [
      {
        "id": "oro_1",
        "name": "Gaëtan Coucke",
        "position": "GOL",
        "ovr": 73,
        "age": 26,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 1.8
      },
      {
        "id": "oro_2",
        "name": "Kurt Zouma",
        "position": "ZAG",
        "ovr": 78,
        "age": 30,
        "nationality": "França",
        "flag": "🇫🇷",
        "marketValueEur": 8.0,
        "isStar": true
      },
      {
        "id": "oro_3",
        "name": "Cristian Tello",
        "position": "PE",
        "ovr": 76,
        "age": 33,
        "nationality": "Espanha",
        "flag": "🇪🇸",
        "marketValueEur": 3.0
      }
    ]
  },
  'Al-Raed': {
    "key": "Al-Raed",
    "id": "al_raed",
    "name": "Al-Raed FC",
    "shortName": "Al-Raed",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f7/Al-Raed_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi Pro League",
    "country": "Arábia Saudita",
    "stadium": "King Abdullah Sport City Stadium (Buraidah)",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 19.0,
    "colors": {
      "primary": "#D21034",
      "secondary": "#000000",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Al-Taawoun",
      "Al-Fayha"
    ],
    "playStyle": "Clássico de Al-Qassim com velocidade pelas pontas",
    "coachName": "Odair Hellmann",
    "squad": [
      {
        "id": "rae_1",
        "name": "André Moreira",
        "position": "GOL",
        "ovr": 74,
        "age": 29,
        "nationality": "Portugal",
        "flag": "🇵🇹",
        "marketValueEur": 1.5
      },
      {
        "id": "rae_2",
        "name": "Amir Sayoud",
        "position": "MEI",
        "ovr": 77,
        "age": 34,
        "nationality": "Argélia",
        "flag": "🇩🇿",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "rae_3",
        "name": "Mehdi Abeid",
        "position": "VOL",
        "ovr": 74,
        "age": 32,
        "nationality": "Argélia",
        "flag": "🇩🇿",
        "marketValueEur": 1.8
      }
    ]
  },
  'Argentinos Juniors': {
    "key": "Argentinos Juniors",
    "id": "argentinos_juniors",
    "name": "Asociación Atlética Argentinos Juniors",
    "shortName": "Argentinos Jrs",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Argentinos_Juniors_logo.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Diego Armando Maradona",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {
      "primary": "#DA291C",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Platense",
      "Vélez Sarsfield"
    ],
    "playStyle": "O Semillero del Mundo: posse técnica e toque refinado",
    "coachName": "Cristian Zermatten",
    "squad": [
      {
        "id": "aaaj_1",
        "name": "Diego Rodríguez",
        "position": "GOL",
        "ovr": 74,
        "age": 35,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.0
      },
      {
        "id": "aaaj_2",
        "name": "Alan Lescano",
        "position": "MEI",
        "ovr": 76,
        "age": 23,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 4.5,
        "isStar": true
      },
      {
        "id": "aaaj_3",
        "name": "Gastón Verón",
        "position": "CA",
        "ovr": 74,
        "age": 23,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 3.0
      }
    ]
  },
  'Belgrano': {
    "key": "Belgrano",
    "id": "belgrano",
    "name": "Club Atlético Belgrano",
    "shortName": "Belgrano",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Escudo_Oficial_del_Club_Atl%C3%A9tico_Belgrano.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Julio César Villagra (El Gigante)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 20.0,
    "colors": {
      "primary": "#75AADB",
      "secondary": "#000000",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Talleres",
      "Instituto"
    ],
    "playStyle": "La Pasión Pirata: intensidade em Córdoba e garra pura",
    "coachName": "Juan Cruz Real",
    "squad": [
      {
        "id": "bel_1",
        "name": "Ignacio Chicco",
        "position": "GOL",
        "ovr": 73,
        "age": 28,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.2
      },
      {
        "id": "bel_2",
        "name": "Bryan Reyna",
        "position": "PE",
        "ovr": 75,
        "age": 26,
        "nationality": "Peru",
        "flag": "🇵🇪",
        "marketValueEur": 3.2,
        "isStar": true
      },
      {
        "id": "bel_3",
        "name": "Franco Jara",
        "position": "CA",
        "ovr": 74,
        "age": 36,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.0
      }
    ]
  },
  'Defensa y Justicia': {
    "key": "Defensa y Justicia",
    "id": "defensa_y_justicia",
    "name": "Club Social y Deportivo Defensa y Justicia",
    "shortName": "Defensa y Justicia",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Defensa_y_Justicia_logo.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Norberto Tito Tomaghello",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#008000",
      "secondary": "#FFFF00",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Quilmes",
      "Lanús"
    ],
    "playStyle": "Futebol dinâmico, rotação ofensiva e transição veloz",
    "coachName": "Pablo De Muner",
    "squad": [
      {
        "id": "dyj_1",
        "name": "Cristopher Fiermarín",
        "position": "GOL",
        "ovr": 74,
        "age": 26,
        "nationality": "Uruguai",
        "flag": "🇺🇾",
        "marketValueEur": 1.5
      },
      {
        "id": "dyj_2",
        "name": "Aaron Molinas",
        "position": "MEI",
        "ovr": 75,
        "age": 24,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 3.5,
        "isStar": true
      },
      {
        "id": "dyj_3",
        "name": "Juan Miritello",
        "position": "CA",
        "ovr": 73,
        "age": 25,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 2.2
      }
    ]
  },
  'Godoy Cruz': {
    "key": "Godoy Cruz",
    "id": "godoy_cruz",
    "name": "Club Deportivo Godoy Cruz Antonio Tomba",
    "shortName": "Godoy Cruz",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Club_Deportivo_Godoy_Cruz_Antonio_Tomba.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Malvinas Argentinas (Mendoza)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#002B7F",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Independiente Rivadavia",
      "San Martín"
    ],
    "playStyle": "Futebol veloz aos pés da Cordilheira dos Andes",
    "coachName": "Daniel Oldrá",
    "squad": [
      {
        "id": "god_1",
        "name": "Franco Petroli",
        "position": "GOL",
        "ovr": 75,
        "age": 26,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 2.5
      },
      {
        "id": "god_2",
        "name": "Santino Andino",
        "position": "PE",
        "ovr": 74,
        "age": 19,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 4.0,
        "isStar": true
      },
      {
        "id": "god_3",
        "name": "Salomón Rodríguez",
        "position": "CA",
        "ovr": 73,
        "age": 24,
        "nationality": "Uruguai",
        "flag": "🇺🇾",
        "marketValueEur": 2.2
      }
    ]
  },
  'Banfield': {
    "key": "Banfield",
    "id": "banfield",
    "name": "Club Atlético Banfield",
    "shortName": "Banfield",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/50/Escudo_Club_Atl%C3%A9tico_Banfield.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Florencio Sola (El Lencho)",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 17.0,
    "colors": {
      "primary": "#00853F",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Lanús",
      "Los Andes"
    ],
    "playStyle": "Clássico del Sur com pressão na intermediária",
    "coachName": "Gustavo Munúa",
    "squad": [
      {
        "id": "ban_1",
        "name": "Facundo Sanguinetti",
        "position": "GOL",
        "ovr": 72,
        "age": 23,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.2
      },
      {
        "id": "ban_2",
        "name": "Gerónimo Rivera",
        "position": "PE",
        "ovr": 74,
        "age": 21,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 3.5,
        "isStar": true
      },
      {
        "id": "ban_3",
        "name": "Bruno Sepúlveda",
        "position": "CA",
        "ovr": 73,
        "age": 32,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.5
      }
    ]
  },
  'Gimnasia LP': {
    "key": "Gimnasia LP",
    "id": "gimnasia_lp",
    "name": "Club de Gimnasia y Esgrima La Plata",
    "shortName": "Gimnasia LP",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/8/86/Escudo_del_Club_de_Gimnasia_y_Esgrima_La_Plata.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Juan Carmelo Zerillo (El Bosque)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#002B7F",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Estudiantes LP",
      "San Lorenzo"
    ],
    "playStyle": "El Lobo platense: raça histórica e pressão total no Bosque",
    "coachName": "Marcelo Méndez",
    "squad": [
      {
        "id": "gelp_1",
        "name": "Marcos Ledesma",
        "position": "GOL",
        "ovr": 73,
        "age": 28,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.4
      },
      {
        "id": "gelp_2",
        "name": "Rodrigo Castillo",
        "position": "CA",
        "ovr": 74,
        "age": 25,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "gelp_3",
        "name": "Lucas Castro",
        "position": "MEI",
        "ovr": 73,
        "age": 35,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.0
      }
    ]
  },
  'Tigre': {
    "key": "Tigre",
    "id": "tigre",
    "name": "Club Atlético Tigre",
    "shortName": "Tigre",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Escudo_del_Club_Atl%C3%A9tico_Tigre.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio José Dellagiovanna (Victoria)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 17.0,
    "colors": {
      "primary": "#0033A0",
      "secondary": "#D21034",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Platense",
      "Chacarita"
    ],
    "playStyle": "El Matador de Victoria: futebol vertical e intenso",
    "coachName": "Sebastián Domínguez",
    "squad": [
      {
        "id": "tig_1",
        "name": "Felipe Zenobio",
        "position": "GOL",
        "ovr": 72,
        "age": 24,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.2
      },
      {
        "id": "tig_2",
        "name": "Florián Monzón",
        "position": "CA",
        "ovr": 74,
        "age": 23,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "tig_3",
        "name": "Gonzalo Maroni",
        "position": "MEI",
        "ovr": 73,
        "age": 25,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 2.0
      }
    ]
  },
  'Platense': {
    "key": "Platense",
    "id": "platense",
    "name": "Club Atlético Platense",
    "shortName": "Platense",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Escudo_del_Club_Atl%C3%A9tico_Platense.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional",
    "country": "Argentina",
    "stadium": "Estadio Ciudad de Vicente López",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 16.0,
    "colors": {
      "primary": "#4B2816",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Argentinos Juniors",
      "Tigre"
    ],
    "playStyle": "El Calamar: defesa estruturada e contragolpes cirúrgicos",
    "coachName": "Favio Orsi & Sergio Gómez",
    "squad": [
      {
        "id": "pla_1",
        "name": "Juan Pablo Cozzani",
        "position": "GOL",
        "ovr": 74,
        "age": 26,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.8
      },
      {
        "id": "pla_2",
        "name": "Mateo Pellegrino",
        "position": "CA",
        "ovr": 75,
        "age": 23,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 3.0,
        "isStar": true
      },
      {
        "id": "pla_3",
        "name": "Guido Mainero",
        "position": "PD",
        "ovr": 73,
        "age": 29,
        "nationality": "Argentina",
        "flag": "🇦🇷",
        "marketValueEur": 1.5
      }
    ]
  },
  'Cercle Brugge': {
    "key": "Cercle Brugge",
    "id": "cercle_brugge",
    "name": "Cercle Brugge KSV",
    "shortName": "Cercle Brugge",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/87/Cercle_Brugge_KSV_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Jan Breydel Stadium",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {
      "primary": "#008000",
      "secondary": "#000000",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Club Brugge",
      "Gent"
    ],
    "playStyle": "Pressão agressiva em bloco alto e intensidade física",
    "coachName": "Miron Muslic",
    "squad": [
      {
        "id": "cer_1",
        "name": "Warleson",
        "position": "GOL",
        "ovr": 75,
        "age": 28,
        "nationality": "Brasil",
        "flag": "🇧🇷",
        "marketValueEur": 2.5
      },
      {
        "id": "cer_2",
        "name": "Kévin Denkey",
        "position": "CA",
        "ovr": 78,
        "age": 24,
        "nationality": "Togo",
        "flag": "🇹🇬",
        "marketValueEur": 12.0,
        "isStar": true
      },
      {
        "id": "cer_3",
        "name": "Alan Minda",
        "position": "PE",
        "ovr": 75,
        "age": 21,
        "nationality": "Equador",
        "flag": "🇪🇨",
        "marketValueEur": 6.0
      }
    ]
  },
  'KV Mechelen': {
    "key": "KV Mechelen",
    "id": "kv_mechelen",
    "name": "Yellow Red KV Mechelen",
    "shortName": "KV Mechelen",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/05/KV_Mechelen_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "AFAS-stadion Achter de Kazerne",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {
      "primary": "#E21836",
      "secondary": "#FFDE00",
      "text": "#000000"
    },
    "rivalClubs": [
      "Antwerp",
      "Lierse"
    ],
    "playStyle": "Futebol vertical pelos corredores de Flandres",
    "coachName": "Besnik Hasi",
    "squad": [
      {
        "id": "mec_1",
        "name": "Ortwin De Wolf",
        "position": "GOL",
        "ovr": 73,
        "age": 27,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 1.5
      },
      {
        "id": "mec_2",
        "name": "Kerim Mrabti",
        "position": "MEI",
        "ovr": 75,
        "age": 30,
        "nationality": "Suécia",
        "flag": "🇸🇪",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "mec_3",
        "name": "Benito Raman",
        "position": "CA",
        "ovr": 74,
        "age": 30,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 2.0
      }
    ]
  },
  'Sint-Truiden': {
    "key": "Sint-Truiden",
    "id": "sint_truiden",
    "name": "Koninklijke Sint-Truidense Voetbalvereniging",
    "shortName": "STVV",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/84/K._Sint-Truidense_V.V._logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Daio Wasabi Stayen Stadium",
    "prestige": 2,
    "formation": "3-4-2-1",
    "budgetEur": 17.0,
    "colors": {
      "primary": "#FFDE00",
      "secondary": "#0033A0",
      "text": "#000000"
    },
    "rivalClubs": [
      "Genk",
      "Standard Liège"
    ],
    "playStyle": "Disciplina tática oriental e transições rápidas",
    "coachName": "Felice Mazzù",
    "squad": [
      {
        "id": "stv_1",
        "name": "Leo Kokubo",
        "position": "GOL",
        "ovr": 73,
        "age": 23,
        "nationality": "Japão",
        "flag": "🇯🇵",
        "marketValueEur": 1.8
      },
      {
        "id": "stv_2",
        "name": "Joel Chima Fujita",
        "position": "VOL",
        "ovr": 75,
        "age": 22,
        "nationality": "Japão",
        "flag": "🇯🇵",
        "marketValueEur": 3.5,
        "isStar": true
      },
      {
        "id": "stv_3",
        "name": "Adriano Bertaccini",
        "position": "CA",
        "ovr": 75,
        "age": 24,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 3.0
      }
    ]
  },
  'Charleroi': {
    "key": "Charleroi",
    "id": "charleroi",
    "name": "Royal Charleroi Sporting Club",
    "shortName": "Charleroi",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/7b/R._Charleroi_S.C._logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Stade du Pays de Charleroi",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 19.0,
    "colors": {
      "primary": "#000000",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Standard Liège",
      "Mons"
    ],
    "playStyle": "Les Zèbres: futebol físico e contra-ataques na Valônia",
    "coachName": "Rik De Mil",
    "squad": [
      {
        "id": "cha_1",
        "name": "Martin Delavallée",
        "position": "GOL",
        "ovr": 72,
        "age": 20,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 1.5
      },
      {
        "id": "cha_2",
        "name": "Daan Heymans",
        "position": "MEI",
        "ovr": 76,
        "age": 25,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 3.5,
        "isStar": true
      },
      {
        "id": "cha_3",
        "name": "Parfait Guiagon",
        "position": "MEI",
        "ovr": 75,
        "age": 23,
        "nationality": "Costa do Marfim",
        "flag": "🇨🇮",
        "marketValueEur": 3.5
      }
    ]
  },
  'OH Leuven': {
    "key": "OH Leuven",
    "id": "oh_leuven",
    "name": "Oud-Heverlee Leuven",
    "shortName": "OH Leuven",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c2/OH_Leuven_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "King Power at Den Dreef",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 16.0,
    "colors": {
      "primary": "#FFFFFF",
      "secondary": "#E21836",
      "text": "#000000"
    },
    "rivalClubs": [
      "Mechelen",
      "Sint-Truiden"
    ],
    "playStyle": "Organização defensiva e saída longa apoiada",
    "coachName": "Óscar García",
    "squad": [
      {
        "id": "ohl_1",
        "name": "Tobe Leysen",
        "position": "GOL",
        "ovr": 74,
        "age": 23,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 2.5
      },
      {
        "id": "ohl_2",
        "name": "Ezechiel Banzuzi",
        "position": "MEI",
        "ovr": 75,
        "age": 19,
        "nationality": "Holanda",
        "flag": "🇳🇱",
        "marketValueEur": 4.0,
        "isStar": true
      },
      {
        "id": "ohl_3",
        "name": "Youssef Maziz",
        "position": "MEI",
        "ovr": 74,
        "age": 26,
        "nationality": "França",
        "flag": "🇫🇷",
        "marketValueEur": 2.5
      }
    ]
  },
  'Westerlo': {
    "key": "Westerlo",
    "id": "westerlo",
    "name": "Koninklijke KVC Westerlo",
    "shortName": "Westerlo",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/90/K.V.C._Westerlo_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Het Kuipje",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 17.0,
    "colors": {
      "primary": "#FFDE00",
      "secondary": "#0033A0",
      "text": "#000000"
    },
    "rivalClubs": [
      "Mechelen",
      "Genk"
    ],
    "playStyle": "Futebol vistoso, jovem e muito veloz no terço final",
    "coachName": "Timmy Simons",
    "squad": [
      {
        "id": "wes_1",
        "name": "Sinan Bolat",
        "position": "GOL",
        "ovr": 74,
        "age": 36,
        "nationality": "Turquia",
        "flag": "🇹🇷",
        "marketValueEur": 1.0
      },
      {
        "id": "wes_2",
        "name": "Allahyar Sayyadmanesh",
        "position": "PD",
        "ovr": 75,
        "age": 23,
        "nationality": "Irã",
        "flag": "🇮🇷",
        "marketValueEur": 3.0,
        "isStar": true
      },
      {
        "id": "wes_3",
        "name": "Matija Frigan",
        "position": "CA",
        "ovr": 74,
        "age": 21,
        "nationality": "Croácia",
        "flag": "🇭🇷",
        "marketValueEur": 4.5
      }
    ]
  },
  'Dender': {
    "key": "Dender",
    "id": "dender",
    "name": "FCV Dender EH",
    "shortName": "Dender",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/4c/FCV_Dender_EH_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Florent Beeckmanstadion",
    "prestige": 1,
    "formation": "5-3-2",
    "budgetEur": 12.0,
    "colors": {
      "primary": "#0033A0",
      "secondary": "#E21836",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Anderlecht",
      "Gent"
    ],
    "playStyle": "Sensação de Denderleeuw com bloco fechado e superação",
    "coachName": "Vincent Euvrard",
    "squad": [
      {
        "id": "den_1",
        "name": "Michael Verrips",
        "position": "GOL",
        "ovr": 72,
        "age": 28,
        "nationality": "Holanda",
        "flag": "🇳🇱",
        "marketValueEur": 1.2
      },
      {
        "id": "den_2",
        "name": "Bruny Nsimba",
        "position": "CA",
        "ovr": 73,
        "age": 24,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 2.0,
        "isStar": true
      },
      {
        "id": "den_3",
        "name": "Lennard Hens",
        "position": "MEI",
        "ovr": 71,
        "age": 28,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 1.0
      }
    ]
  },
  'Kortrijk': {
    "key": "Kortrijk",
    "id": "kortrijk",
    "name": "KV Kortrijk",
    "shortName": "Kortrijk",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/d/dd/KV_Kortrijk_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Guldensporenstadion",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 15.0,
    "colors": {
      "primary": "#E21836",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Zulte Waregem",
      "Cercle Brugge"
    ],
    "playStyle": "Garra de Kortrijk com linhas compactas",
    "coachName": "Freyr Alexandersson",
    "squad": [
      {
        "id": "kor_1",
        "name": "Patrik Gunnarsson",
        "position": "GOL",
        "ovr": 72,
        "age": 24,
        "nationality": "Islândia",
        "flag": "🇮🇸",
        "marketValueEur": 1.4
      },
      {
        "id": "kor_2",
        "name": "Nacho Ferri",
        "position": "CA",
        "ovr": 73,
        "age": 20,
        "nationality": "Espanha",
        "flag": "🇪🇸",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "kor_3",
        "name": "Takuro Kaneko",
        "position": "PD",
        "ovr": 74,
        "age": 27,
        "nationality": "Japão",
        "flag": "🇯🇵",
        "marketValueEur": 2.2
      }
    ]
  },
  'Beerschot': {
    "key": "Beerschot",
    "id": "beerschot",
    "name": "Koninklijke Beerschot Voetbalclub Antwerpen",
    "shortName": "Beerschot",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Beerschot_VA_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Jupiler Pro League",
    "country": "Bélgica",
    "stadium": "Olympisch Stadion (Antuérpia)",
    "prestige": 1,
    "formation": "4-2-3-1",
    "budgetEur": 13.0,
    "colors": {
      "primary": "#502B7D",
      "secondary": "#FFFFFF",
      "text": "#ffffff"
    },
    "rivalClubs": [
      "Antwerp",
      "Mechelen"
    ],
    "playStyle": "Derby da Antuérpia e intensidade pura no Kiel",
    "coachName": "Dirk Kuyt",
    "squad": [
      {
        "id": "bee_1",
        "name": "Nick Shinton",
        "position": "GOL",
        "ovr": 71,
        "age": 23,
        "nationality": "Bélgica",
        "flag": "🇧🇪",
        "marketValueEur": 1.0
      },
      {
        "id": "bee_2",
        "name": "Marwan Al-Sahafi",
        "position": "PE",
        "ovr": 73,
        "age": 20,
        "nationality": "Arábia Saudita",
        "flag": "🇸🇦",
        "marketValueEur": 2.5,
        "isStar": true
      },
      {
        "id": "bee_3",
        "name": "Faisal Al-Ghamdi",
        "position": "VOL",
        "ovr": 73,
        "age": 23,
        "nationality": "Arábia Saudita",
        "flag": "🇸🇦",
        "marketValueEur": 2.5
      }
    ]
  },
};

/**
 * Proxy inteligente que busca clubes por qualquer chave:
 * chave do objeto ('Flamengo'), ID ('flamengo'), nome completo ('CR Flamengo') ou nome curto ('Flamengo')
 */
export const CLUBS: Record<string, Club> = new Proxy(RAW_CLUBS, {
  get(target, prop: string) {
    if (typeof prop !== 'string') return (target as any)[prop];
    if (prop in target) return target[prop];
    const p = prop.toLowerCase().trim();
    const all = Object.values(target);
    return all.find(c => 
      c.id.toLowerCase() === p ||
      c.name.toLowerCase() === p ||
      c.shortName.toLowerCase() === p
    );
  }
});

/**
 * Busca segura e infalível por qualquer identificador de clube
 */
export function findClub(query: string | undefined): Club {
  if (!query) return RAW_CLUBS['Grêmio Novorizontino'] || Object.values(RAW_CLUBS)[0];
  const direct = CLUBS[query];
  if (direct) return direct;
  const q = query.toLowerCase().trim();
  const all = Object.values(RAW_CLUBS);
  return (
    all.find(c => 
      c.id.toLowerCase() === q ||
      c.name.toLowerCase() === q ||
      c.shortName.toLowerCase() === q ||
      c.name.toLowerCase().includes(q) ||
      q.includes(c.shortName.toLowerCase())
    ) || RAW_CLUBS['Grêmio Novorizontino'] || all[0]
  );
}

export const INITIAL_CLUB_KEY = 'novorizontino';

/**
 * Retorna os clubes iniciais organizados para a nacionalidade do jogador,
 * priorizando a 2ª divisão (formação da base) ou 1ª divisão do país escolhido!
 */
export function getStartingClubsForNationality(countryName: string): { 
  thirdTierClubs: Club[];
  secondTierClubs: Club[];
  firstTierClubs: Club[];
  allNationalClubs: Club[];
  internationalClubs: Club[];
} {
  // Filtra estritamente clubes das 19 ligas jogáveis oficiais (NUNCA clubes exclusivos de copas continentais)
  const all = Object.values(CLUBS).filter(c => !c.isContinentalOnly && Boolean(LEAGUES[c.leagueId]));
  const countryLower = (countryName || '').toLowerCase();

  let targetCountry = 'Brasil';

  if (['Inglaterra', 'Reino Unido', 'País de Gales', 'Irlanda', 'Estados Unidos', 'Canadá', 'Austrália', 'Japão', 'Coreia do Sul', 'Nigéria', 'Gana', 'Egito'].includes(countryName)) {
    targetCountry = 'Inglaterra';
  } else if (countryName === 'Escócia') {
    targetCountry = 'Escócia';
  } else if (['Espanha', 'México', 'Colômbia', 'Chile', 'Peru', 'Equador', 'Venezuela'].includes(countryName)) {
    targetCountry = 'Espanha';
  } else if (['Itália', 'Croácia', 'Sérvia'].includes(countryName)) {
    targetCountry = 'Itália';
  } else if (countryName === 'Grécia') {
    targetCountry = 'Grécia';
  } else if (countryName === 'Rússia') {
    targetCountry = 'Rússia';
  } else if (countryName === 'Bélgica') {
    targetCountry = 'Bélgica';
  } else if (countryName === 'Holanda') {
    targetCountry = 'Holanda';
  } else if (countryName === 'Turquia') {
    targetCountry = 'Turquia';
  } else if (['Alemanha', 'Áustria', 'Suíça', 'Polônia', 'Dinamarca', 'Suécia', 'Noruega'].includes(countryName)) {
    targetCountry = 'Alemanha';
  } else if (['França', 'Senegal', 'Costa do Marfim', 'Argélia', 'Marrocos', 'Camarões'].includes(countryName)) {
    targetCountry = 'França';
  } else if (['Portugal', 'Angola', 'Moçambique', 'Cabo Verde'].includes(countryName)) {
    targetCountry = 'Portugal';
  } else if (['Argentina', 'Uruguai', 'Paraguai'].includes(countryName)) {
    targetCountry = 'Argentina';
  } else if (['Brasil', 'Bolívia'].includes(countryName)) {
    targetCountry = 'Brasil';
  } else if (all.some(c => c.country.toLowerCase() === countryLower)) {
    targetCountry = countryName;
  } else {
    targetCountry = 'Inglaterra';
  }

  const nationalClubs = all.filter(c => c.country.toLowerCase() === targetCountry.toLowerCase());

  const thirdTierClubs = nationalClubs.filter(c => LEAGUES[c.leagueId]?.tier === 3);
  const secondTierClubs = nationalClubs.filter(c => LEAGUES[c.leagueId]?.tier === 2);
  const firstTierClubs = nationalClubs.filter(c => LEAGUES[c.leagueId]?.tier === 1);
  const internationalClubs = all.filter(c => !nationalClubs.some(nc => nc.id === c.id));

  return { 
    thirdTierClubs,
    secondTierClubs, 
    firstTierClubs, 
    allNationalClubs: [...thirdTierClubs, ...secondTierClubs, ...firstTierClubs],
    internationalClubs 
  };
}

/**
 * Ofertas de transferência adaptadas para todas as 19 divisões jogáveis.
 * Clubes exclusivos de copas continentais (isContinentalOnly) NUNCA fazem propostas ao nosso atleta!
 */
export function getTransferOffersForPlayer(currentClubName: string, ovr: number, age: number): string[] {
  const currentClub = CLUBS[currentClubName];
  const playableClubs = Object.values(CLUBS).filter(c => !c.isContinentalOnly && Boolean(LEAGUES[c.leagueId]));
  const offers: string[] = [];
  const currentTier = LEAGUES[currentClub?.leagueId || '']?.tier || 1;

  if (currentTier === 3) {
    // Atleta na Série C: recebe propostas da Série B ou clubes emergentes da Série A se brilhar
    const tier2Same = playableClubs.filter(c => c.country === currentClub?.country && LEAGUES[c.leagueId]?.tier === 2);
    if (tier2Same.length > 0) {
      offers.push(tier2Same[ovr % tier2Same.length].name);
      if (tier2Same[(ovr + 3) % tier2Same.length]) offers.push(tier2Same[(ovr + 3) % tier2Same.length].name);
    }
    if (ovr >= 73) {
      const tier1Same = playableClubs.filter(c => c.country === currentClub?.country && LEAGUES[c.leagueId]?.tier === 1);
      if (tier1Same.length > 0) offers.push(tier1Same[age % tier1Same.length].name);
    }
  } else if (currentTier === 2) {
    if (ovr >= 70) {
      const firstTierOfSameCountry = playableClubs.filter(
        c => c.country === currentClub?.country && c.id !== currentClub?.id && LEAGUES[c.leagueId]?.tier === 1
      );
      if (firstTierOfSameCountry.length > 0) {
        offers.push(firstTierOfSameCountry[ovr % firstTierOfSameCountry.length].name);
        if (firstTierOfSameCountry[(ovr + 2) % firstTierOfSameCountry.length]) {
          offers.push(firstTierOfSameCountry[(ovr + 2) % firstTierOfSameCountry.length].name);
        }
      }
    }
    if (ovr >= 76) {
      const bridgeLeagues = playableClubs.filter(c => ['primeira_liga', 'eredivisie', 'russian_premier', 'super_league_gre', 'pro_league_bel'].includes(c.leagueId) && c.prestige >= 4);
      if (bridgeLeagues.length > 0) offers.push(bridgeLeagues[age % bridgeLeagues.length].name);
    }
  } else {
    if (ovr >= 80) {
      offers.push('Real Madrid', 'Barcelona', 'Manchester City', 'Arsenal', 'Bayern de Munique', 'PSG', 'Inter de Milão');
    } else if (ovr >= 75) {
      const euroStepping = playableClubs.filter(
        c => c.id !== currentClub?.id && ['premier_league', 'la_liga', 'serie_a_ita', 'bundesliga', 'ligue_1', 'primeira_liga', 'eredivisie', 'super_lig', 'russian_premier', 'saudi_pro', 'super_league_gre'].includes(c.leagueId) && c.prestige >= 4
      );
      if (euroStepping.length > 0) {
        offers.push(euroStepping[ovr % euroStepping.length].name);
        offers.push(euroStepping[(ovr + 5) % euroStepping.length].name);
      }
    } else {
      const otherTier1 = playableClubs.filter(
        c => c.country === currentClub?.country && c.id !== currentClub?.id && LEAGUES[c.leagueId]?.tier === 1
      );
      if (otherTier1.length > 0) offers.push(otherTier1[ovr % otherTier1.length].name);
      if (otherTier1[1]) offers.push(otherTier1[(ovr + 1) % otherTier1.length].name);
    }
  }

  // Filtra garantindo que apenas clubes válidos das 19 ligas apareçam
  const validOfferNames = offers.filter(name => {
    const found = CLUBS[name];
    return found && !found.isContinentalOnly && Boolean(LEAGUES[found.leagueId]);
  });

  if (!validOfferNames.includes(currentClubName)) {
    validOfferNames.unshift(currentClubName);
  }

  return Array.from(new Set(validOfferNames)).slice(0, 4);
}

export const WORLD_TRANSFERS_FEED: WorldTransferEvent[] = [
  {
    id: 'wt_1',
    playerName: 'Kylian Mbappé',
    fromClub: 'PSG',
    toClub: 'Real Madrid',
    feeEur: 0,
    dateStr: 'Janela Europeia',
    headline: 'Mbappé é apresentado no Bernabéu com a camisa 9 diante de 80 mil torcedores'
  },
  {
    id: 'wt_2',
    playerName: 'Estêvão',
    fromClub: 'Palmeiras',
    toClub: 'Chelsea',
    feeEur: 61.5,
    dateStr: 'Janela Europeia',
    headline: 'Joia alviverde acerta venda milionária para a Premier League'
  },
  {
    id: 'wt_3',
    playerName: 'Julián Álvarez',
    fromClub: 'Manchester City',
    toClub: 'Atlético de Madrid',
    feeEur: 75.0,
    dateStr: 'Mercado Europeu',
    headline: 'Atacante campeão do mundo reforça o time de Simeone por €75M'
  },
  {
    id: 'wt_4',
    playerName: 'Viktor Gyökeres',
    fromClub: 'Sporting CP',
    toClub: 'Arsenal',
    feeEur: 85.0,
    dateStr: 'Sondagem',
    headline: 'Arsenal prepara investida astronômica pelo artilheiro sueco'
  }
];

// ========================================================
// CATÁLOGO ESTRUTURADO HIERÁRQUICO (PAÍS ➔ LIGA ➔ CLUBES)
// ========================================================

export interface LeagueCatalogItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  tier: 1 | 2 | 3;
  clubCount: number;
}

export interface CountryCatalogItem {
  name: string;
  flag: string;
  totalClubs: number;
  leagues: LeagueCatalogItem[];
}

export const COUNTRY_FLAGS: Record<string, string> = {
  'Brasil': '🇧🇷',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Espanha': '🇪🇸',
  'Itália': '🇮🇹',
  'Alemanha': '🇩🇪',
  'França': '🇫🇷',
  'Portugal': '🇵🇹',
  'Holanda': '🇳🇱',
  'Turquia': '🇹🇷',
  'Rússia': '🇷🇺',
  'Escócia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Bélgica': '🇧🇪',
  'Grécia': '🇬🇷',
  'Argentina': '🇦🇷',
  'Arábia Saudita': '🇸🇦'
};

export function getCountryCatalog(): CountryCatalogItem[] {
  const allClubs = Object.values(CLUBS).filter(c => !c.isContinentalOnly && Boolean(LEAGUES[c.leagueId]));
  const countryMap = new Map<string, { flag: string; clubs: Club[] }>();

  allClubs.forEach(club => {
    const cName = club.country || 'Brasil';
    if (!countryMap.has(cName)) {
      countryMap.set(cName, {
        flag: COUNTRY_FLAGS[cName] || LEAGUES[club.leagueId]?.countryFlag || '🌍',
        clubs: []
      });
    }
    countryMap.get(cName)!.clubs.push(club);
  });

  const catalog: CountryCatalogItem[] = [];

  countryMap.forEach((val, countryName) => {
    const leagueMap = new Map<string, { name: string; tier: 1 | 2 | 3; clubs: Club[] }>();
    val.clubs.forEach(c => {
      const lId = c.leagueId;
      const meta = LEAGUES[lId];
      if (!meta) return;
      const tier = (meta.tier === 3 ? 3 : meta.tier === 2 ? 2 : 1) as 1 | 2 | 3;

      if (!leagueMap.has(lId)) {
        leagueMap.set(lId, {
          name: meta.name,
          tier,
          clubs: []
        });
      }
      leagueMap.get(lId)!.clubs.push(c);
    });

    const leagues: LeagueCatalogItem[] = Array.from(leagueMap.entries())
      .map(([lId, lVal]) => ({
        id: lId,
        name: lVal.name,
        country: countryName,
        flag: val.flag,
        tier: lVal.tier,
        clubCount: lVal.clubs.length
      }))
      .sort((a, b) => a.tier - b.tier);

    if (leagues.length > 0) {
      catalog.push({
        name: countryName,
        flag: val.flag,
        totalClubs: val.clubs.length,
        leagues
      });
    }
  });

  const countryOrder = [
    'Brasil', 'Inglaterra', 'Itália', 'Espanha', 'Alemanha', 'França',
    'Portugal', 'Holanda', 'Turquia', 'Rússia', 'Arábia Saudita',
    'Argentina', 'Escócia', 'Bélgica', 'Grécia'
  ];
  return catalog.sort((a, b) => {
    const idxA = countryOrder.indexOf(a.name);
    const idxB = countryOrder.indexOf(b.name);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
}

export function getClubsFiltered(country?: string, leagueId?: string): Club[] {
  const all = Object.values(CLUBS).filter(c => !c.isContinentalOnly && Boolean(LEAGUES[c.leagueId]));
  return all.filter(c => {
    if (country && c.country.toLowerCase() !== country.toLowerCase()) return false;
    if (leagueId && c.leagueId !== leagueId) return false;
    return true;
  });
}
