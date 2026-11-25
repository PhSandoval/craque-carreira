import { Position, TacticalFormation, RealPlayer } from '../types';

export interface NationalTeam {
  id: string;
  name: string;
  shortName: string;
  nickname: string;
  country: string;
  flag: string;
  confederation: 'CONMEBOL' | 'UEFA' | 'AFC' | 'CONCACAF';
  coachName: string;
  stadium: string;
  formation: TacticalFormation;
  colors: { primary: string; secondary: string; text: string };
  squad: RealPlayer[];
  trophies: string[];
}

export const NATIONAL_TEAMS: Record<string, NationalTeam> = {
  'brasil': {
    id: 'brasil',
    name: 'Seleção Brasileira',
    shortName: 'Brasil',
    nickname: 'A Amarelinha',
    country: 'Brasil',
    flag: '🇧🇷',
    confederation: 'CONMEBOL',
    coachName: 'Dorival Júnior',
    stadium: 'Estádio do Maracanã (Rio de Janeiro)',
    formation: '4-3-3',
    colors: { primary: '#FCD116', secondary: '#002776', text: '#002776' },
    trophies: ['Pentacampeão Mundial (5 Copas do Mundo)', '9 Copas América', '4 Copas das Confederações'],
    squad: [
      { id: 'bra_1', name: 'Alisson Becker', position: 'GOL', ovr: 89, age: 32, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 28.0, isStar: true },
      { id: 'bra_2', name: 'Marquinhos', position: 'ZAG', ovr: 86, age: 30, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 45.0, isStar: true },
      { id: 'bra_3', name: 'Gabriel Magalhães', position: 'ZAG', ovr: 86, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 70.0, isStar: true },
      { id: 'bra_4', name: 'Danilo', position: 'LD', ovr: 81, age: 33, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 8.0 },
      { id: 'bra_5', name: 'Guilherme Arana', position: 'LE', ovr: 80, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 12.0 },
      { id: 'bra_6', name: 'Bruno Guimarães', position: 'VOL', ovr: 86, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 85.0, isStar: true },
      { id: 'bra_7', name: 'Lucas Paquetá', position: 'MEI', ovr: 84, age: 27, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 65.0, isStar: true },
      { id: 'bra_8', name: 'Rodrygo', position: 'PD', ovr: 86, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 110.0, isStar: true },
      { id: 'bra_9', name: 'Vinicius Júnior', position: 'PE', ovr: 90, age: 24, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 200.0, isStar: true },
      { id: 'bra_10', name: 'Raphinha', position: 'PD', ovr: 87, age: 28, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 60.0, isStar: true },
      { id: 'bra_11', name: 'Endrick', position: 'CA', ovr: 80, age: 18, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 60.0, isStar: true },
      { id: 'bra_12', name: 'Estêvão', position: 'PD', ovr: 81, age: 17, nationality: 'Brasil', flag: '🇧🇷', marketValueEur: 45.0, isStar: true }
    ]
  },

  'argentina': {
    id: 'argentina',
    name: 'Seleção Argentina',
    shortName: 'Argentina',
    nickname: 'La Albiceleste',
    country: 'Argentina',
    flag: '🇦🇷',
    confederation: 'CONMEBOL',
    coachName: 'Lionel Scaloni',
    stadium: 'Mâs Monumental (Buenos Aires)',
    formation: '4-3-3',
    colors: { primary: '#75AADB', secondary: '#ffffff', text: '#002776' },
    trophies: ['Tricampeão Mundial (3 Copas do Mundo)', '16 Copas América'],
    squad: [
      { id: 'arg_1', name: 'Emiliano Martínez (Dibu)', position: 'GOL', ovr: 88, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 28.0, isStar: true },
      { id: 'arg_2', name: 'Cristian Romero', position: 'ZAG', ovr: 86, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 65.0, isStar: true },
      { id: 'arg_3', name: 'Lisandro Martínez', position: 'ZAG', ovr: 84, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 50.0 },
      { id: 'arg_4', name: 'Nahuel Molina', position: 'LD', ovr: 81, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 28.0 },
      { id: 'arg_5', name: 'Nicolás Tagliafico', position: 'LE', ovr: 81, age: 32, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 8.0 },
      { id: 'arg_6', name: 'Rodrigo De Paul', position: 'MC', ovr: 84, age: 30, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 30.0 },
      { id: 'arg_7', name: 'Enzo Fernández', position: 'MC', ovr: 84, age: 23, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 75.0, isStar: true },
      { id: 'arg_8', name: 'Alexis Mac Allister', position: 'MC', ovr: 86, age: 26, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 75.0, isStar: true },
      { id: 'arg_9', name: 'Lionel Messi', position: 'PD', ovr: 88, age: 37, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 25.0, isStar: true },
      { id: 'arg_10', name: 'Lautaro Martínez', position: 'CA', ovr: 88, age: 27, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 110.0, isStar: true },
      { id: 'arg_11', name: 'Julián Álvarez', position: 'CA', ovr: 86, age: 24, nationality: 'Argentina', flag: '🇦🇷', marketValueEur: 90.0, isStar: true }
    ]
  },

  'franca': {
    id: 'franca',
    name: 'Seleção Francesa',
    shortName: 'França',
    nickname: 'Les Bleus',
    country: 'França',
    flag: '🇫🇷',
    confederation: 'UEFA',
    coachName: 'Didier Deschamps',
    stadium: 'Stade de France (Paris)',
    formation: '4-3-3',
    colors: { primary: '#002395', secondary: '#ffffff', text: '#ffffff' },
    trophies: ['Bicampeão Mundial (2 Copas do Mundo)', '2 UEFA Euro'],
    squad: [
      { id: 'fra_1', name: 'Mike Maignan', position: 'GOL', ovr: 87, age: 29, nationality: 'França', flag: '🇫🇷', marketValueEur: 38.0, isStar: true },
      { id: 'fra_2', name: 'William Saliba', position: 'ZAG', ovr: 88, age: 23, nationality: 'França', flag: '🇫🇷', marketValueEur: 80.0, isStar: true },
      { id: 'fra_3', name: 'Dayot Upamecano', position: 'ZAG', ovr: 85, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 50.0 },
      { id: 'fra_4', name: 'Jules Koundé', position: 'LD', ovr: 85, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 55.0 },
      { id: 'fra_5', name: 'Theo Hernández', position: 'LE', ovr: 87, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 60.0, isStar: true },
      { id: 'fra_6', name: 'Aurélien Tchouaméni', position: 'VOL', ovr: 86, age: 24, nationality: 'França', flag: '🇫🇷', marketValueEur: 100.0, isStar: true },
      { id: 'fra_7', name: 'Eduardo Camavinga', position: 'MC', ovr: 86, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 100.0, isStar: true },
      { id: 'fra_8', name: 'Ousmane Dembélé', position: 'PD', ovr: 86, age: 27, nationality: 'França', flag: '🇫🇷', marketValueEur: 60.0 },
      { id: 'fra_9', name: 'Kylian Mbappé', position: 'PE', ovr: 91, age: 26, nationality: 'França', flag: '🇫🇷', marketValueEur: 180.0, isStar: true },
      { id: 'fra_10', name: 'Antoine Griezmann', position: 'MEI', ovr: 87, age: 33, nationality: 'França', flag: '🇫🇷', marketValueEur: 25.0, isStar: true },
      { id: 'fra_11', name: 'Bradley Barcola', position: 'PE', ovr: 83, age: 22, nationality: 'França', flag: '🇫🇷', marketValueEur: 65.0 }
    ]
  },

  'espanha': {
    id: 'espanha',
    name: 'Seleção Espanhola',
    shortName: 'Espanha',
    nickname: 'La Furia Roja',
    country: 'Espanha',
    flag: '🇪🇸',
    confederation: 'UEFA',
    coachName: 'Luis de la Fuente',
    stadium: 'Santiago Bernabéu (Madrid)',
    formation: '4-3-3',
    colors: { primary: '#C60B1E', secondary: '#FFC400', text: '#FFC400' },
    trophies: ['Campeão Mundial (1 Copa do Mundo)', '4 UEFA Euro (Atuais Campeões da Europa)'],
    squad: [
      { id: 'esp_1', name: 'David Raya', position: 'GOL', ovr: 86, age: 29, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 35.0 },
      { id: 'esp_2', name: 'Robin Le Normand', position: 'ZAG', ovr: 84, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 40.0 },
      { id: 'esp_3', name: 'Aymeric Laporte', position: 'ZAG', ovr: 83, age: 30, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 20.0 },
      { id: 'esp_4', name: 'Dani Carvajal', position: 'LD', ovr: 86, age: 32, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 12.0, isStar: true },
      { id: 'esp_5', name: 'Marc Cucurella', position: 'LE', ovr: 83, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 30.0 },
      { id: 'esp_6', name: 'Rodri', position: 'VOL', ovr: 91, age: 28, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 130.0, isStar: true },
      { id: 'esp_7', name: 'Pedri', position: 'MC', ovr: 87, age: 22, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 80.0, isStar: true },
      { id: 'esp_8', name: 'Dani Olmo', position: 'MEI', ovr: 86, age: 26, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 60.0, isStar: true },
      { id: 'esp_9', name: 'Lamine Yamal', position: 'PD', ovr: 86, age: 17, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 150.0, isStar: true },
      { id: 'esp_10', name: 'Nico Williams', position: 'PE', ovr: 85, age: 22, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 70.0, isStar: true },
      { id: 'esp_11', name: 'Álvaro Morata', position: 'CA', ovr: 83, age: 32, nationality: 'Espanha', flag: '🇪🇸', marketValueEur: 16.0 }
    ]
  },

  'inglaterra': {
    id: 'inglaterra',
    name: 'Seleção Inglesa',
    shortName: 'Inglaterra',
    nickname: 'The Three Lions',
    country: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    confederation: 'UEFA',
    coachName: 'Thomas Tuchel',
    stadium: 'Wembley Stadium (Londres)',
    formation: '4-2-3-1',
    colors: { primary: '#FFFFFF', secondary: '#002B49', text: '#002B49' },
    trophies: ['Campeão Mundial (1 Copa do Mundo)'],
    squad: [
      { id: 'eng_1', name: 'Jordan Pickford', position: 'GOL', ovr: 84, age: 30, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 22.0 },
      { id: 'eng_2', name: 'John Stones', position: 'ZAG', ovr: 85, age: 30, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 38.0 },
      { id: 'eng_3', name: 'Marc Guéhi', position: 'ZAG', ovr: 83, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 45.0 },
      { id: 'eng_4', name: 'Kyle Walker', position: 'LD', ovr: 84, age: 34, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 13.0 },
      { id: 'eng_5', name: 'Trent Alexander-Arnold', position: 'LD', ovr: 86, age: 26, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 70.0, isStar: true },
      { id: 'eng_6', name: 'Declan Rice', position: 'VOL', ovr: 87, age: 25, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 120.0, isStar: true },
      { id: 'eng_7', name: 'Jude Bellingham', position: 'MEI', ovr: 90, age: 21, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 180.0, isStar: true },
      { id: 'eng_8', name: 'Bukayo Saka', position: 'PD', ovr: 88, age: 23, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 140.0, isStar: true },
      { id: 'eng_9', name: 'Phil Foden', position: 'MEI', ovr: 88, age: 24, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 150.0, isStar: true },
      { id: 'eng_10', name: 'Harry Kane', position: 'CA', ovr: 90, age: 31, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 100.0, isStar: true },
      { id: 'eng_11', name: 'Cole Palmer', position: 'MEI', ovr: 87, age: 22, nationality: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', marketValueEur: 90.0, isStar: true }
    ]
  },

  'portugal': {
    id: 'portugal',
    name: 'Seleção Portuguesa',
    shortName: 'Portugal',
    nickname: 'A Seleção das Quinas',
    country: 'Portugal',
    flag: '🇵🇹',
    confederation: 'UEFA',
    coachName: 'Roberto Martínez',
    stadium: 'Estádio da Luz (Lisboa)',
    formation: '4-3-3',
    colors: { primary: '#E42518', secondary: '#006600', text: '#ffffff' },
    trophies: ['Campeão da UEFA Euro 2016', 'Campeão da Nations League 2019'],
    squad: [
      { id: 'por_1', name: 'Diogo Costa', position: 'GOL', ovr: 85, age: 25, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 45.0, isStar: true },
      { id: 'por_2', name: 'Rúben Dias', position: 'ZAG', ovr: 88, age: 27, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 80.0, isStar: true },
      { id: 'por_3', name: 'Gonçalo Inácio', position: 'ZAG', ovr: 83, age: 23, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 45.0 },
      { id: 'por_4', name: 'Diogo Dalot', position: 'LD', ovr: 83, age: 25, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 40.0 },
      { id: 'por_5', name: 'Nuno Mendes', position: 'LE', ovr: 85, age: 22, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 55.0, isStar: true },
      { id: 'por_6', name: 'João Palhinha', position: 'VOL', ovr: 84, age: 29, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 50.0 },
      { id: 'por_7', name: 'Vitinha', position: 'MC', ovr: 86, age: 24, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 55.0, isStar: true },
      { id: 'por_8', name: 'Bruno Fernandes', position: 'MEI', ovr: 88, age: 30, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 65.0, isStar: true },
      { id: 'por_9', name: 'Bernardo Silva', position: 'PD', ovr: 88, age: 30, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 70.0, isStar: true },
      { id: 'por_10', name: 'Rafael Leão', position: 'PE', ovr: 86, age: 25, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 90.0, isStar: true },
      { id: 'por_11', name: 'Cristiano Ronaldo', position: 'CA', ovr: 86, age: 39, nationality: 'Portugal', flag: '🇵🇹', marketValueEur: 15.0, isStar: true }
    ]
  },

  'holanda': {
    id: 'holanda',
    name: 'Seleção Holandesa',
    shortName: 'Holanda',
    nickname: 'A Laranja Mecânica',
    country: 'Holanda',
    flag: '🇳🇱',
    confederation: 'UEFA',
    coachName: 'Ronald Koeman',
    stadium: 'Johan Cruyff Arena (Amsterdam)',
    formation: '4-3-3',
    colors: { primary: '#F36C21', secondary: '#ffffff', text: '#ffffff' },
    trophies: ['Campeão da UEFA Euro 1988', '3x Vice-Campeão Mundial'],
    squad: [
      { id: 'ned_1', name: 'Bart Verbruggen', position: 'GOL', ovr: 82, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 22.0 },
      { id: 'ned_2', name: 'Virgil van Dijk', position: 'ZAG', ovr: 89, age: 33, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 30.0, isStar: true },
      { id: 'ned_3', name: 'Nathan Aké', position: 'ZAG', ovr: 84, age: 29, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 40.0 },
      { id: 'ned_4', name: 'Denzel Dumfries', position: 'LD', ovr: 83, age: 28, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 24.0 },
      { id: 'ned_5', name: 'Micky van de Ven', position: 'LE', ovr: 83, age: 23, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 55.0 },
      { id: 'ned_6', name: 'Ryan Gravenberch', position: 'VOL', ovr: 83, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 40.0 },
      { id: 'ned_7', name: 'Tijjani Reijnders', position: 'MC', ovr: 84, age: 26, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 30.0 },
      { id: 'ned_8', name: 'Xavi Simons', position: 'MEI', ovr: 85, age: 21, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 80.0, isStar: true },
      { id: 'ned_9', name: 'Donyell Malen', position: 'PD', ovr: 81, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0 },
      { id: 'ned_10', name: 'Cody Gakpo', position: 'PE', ovr: 84, age: 25, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 55.0, isStar: true },
      { id: 'ned_11', name: 'Brian Brobbey', position: 'CA', ovr: 80, age: 22, nationality: 'Holanda', flag: '🇳🇱', marketValueEur: 35.0 }
    ]
  },

  'turquia': {
    id: 'turquia',
    name: 'Seleção Turca',
    shortName: 'Turquia',
    nickname: 'Ay-Yıldızlılar',
    country: 'Turquia',
    flag: '🇹🇷',
    confederation: 'UEFA',
    coachName: 'Vincenzo Montella',
    stadium: 'Atatürk Olympic Stadium (Istambul)',
    formation: '4-2-3-1',
    colors: { primary: '#E30A17', secondary: '#ffffff', text: '#ffffff' },
    trophies: ['3º Lugar na Copa do Mundo 2002', 'Semifinalista da Euro 2008'],
    squad: [
      { id: 'tur_1', name: 'Uğurcan Çakır', position: 'GOL', ovr: 80, age: 28, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 8.5 },
      { id: 'tur_2', name: 'Merih Demiral', position: 'ZAG', ovr: 81, age: 26, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 16.0 },
      { id: 'tur_3', name: 'Abdülkerim Bardakcı', position: 'ZAG', ovr: 80, age: 30, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 7.5 },
      { id: 'tur_4', name: 'Mert Müldür', position: 'LD', ovr: 78, age: 25, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 7.0 },
      { id: 'tur_5', name: 'Ferdi Kadıoğlu', position: 'LE', ovr: 82, age: 25, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 30.0, isStar: true },
      { id: 'tur_6', name: 'İsmail Yüksek', position: 'VOL', ovr: 79, age: 25, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 14.0 },
      { id: 'tur_7', name: 'Hakan Çalhanoğlu', position: 'MC', ovr: 86, age: 30, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 45.0, isStar: true },
      { id: 'tur_8', name: 'Orkun Kökçü', position: 'MC', ovr: 82, age: 24, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 28.0 },
      { id: 'tur_9', name: 'Arda Güler', position: 'MEI', ovr: 82, age: 19, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 45.0, isStar: true },
      { id: 'tur_10', name: 'Kerem Aktürkoğlu', position: 'PE', ovr: 82, age: 26, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 18.0 },
      { id: 'tur_11', name: 'Kenan Yıldız', position: 'PD', ovr: 80, age: 19, nationality: 'Turquia', flag: '🇹🇷', marketValueEur: 40.0, isStar: true }
    ]
  },

  'escocia': {
    id: 'escocia',
    name: 'Seleção Escocesa',
    shortName: 'Escócia',
    nickname: 'The Tartan Army',
    country: 'Escócia',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    confederation: 'UEFA',
    coachName: 'Steve Clarke',
    stadium: 'Hampden Park (Glasgow)',
    formation: '3-5-2',
    colors: { primary: '#002B49', secondary: '#ffffff', text: '#ffffff' },
    trophies: ['Histórico tradicional britânico desde 1872'],
    squad: [
      { id: 'sco_1', name: 'Angus Gunn', position: 'GOL', ovr: 77, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 3.5 },
      { id: 'sco_2', name: 'Jack Hendry', position: 'ZAG', ovr: 76, age: 29, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 2.8 },
      { id: 'sco_3', name: 'Scott McKenna', position: 'ZAG', ovr: 76, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 9.0 },
      { id: 'sco_4', name: 'Anthony Ralston', position: 'LD', ovr: 75, age: 26, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 2.5 },
      { id: 'sco_5', name: 'Andy Robertson', position: 'LE', ovr: 85, age: 30, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 30.0, isStar: true },
      { id: 'sco_6', name: 'Billy Gilmour', position: 'VOL', ovr: 79, age: 23, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 18.0 },
      { id: 'sco_7', name: 'Callum McGregor', position: 'MC', ovr: 80, age: 31, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 8.5 },
      { id: 'sco_8', name: 'Scott McTominay', position: 'MEI', ovr: 82, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 32.0, isStar: true },
      { id: 'sco_9', name: 'John McGinn', position: 'MEI', ovr: 81, age: 30, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 30.0 },
      { id: 'sco_10', name: 'Ryan Christie', position: 'PD', ovr: 78, age: 29, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 12.0 },
      { id: 'sco_11', name: 'Ché Adams', position: 'CA', ovr: 78, age: 28, nationality: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', marketValueEur: 15.0 }
    ]
  },

  'uruguai': {
    id: 'uruguai',
    name: 'Seleção Uruguaia',
    shortName: 'Uruguai',
    nickname: 'La Celeste',
    country: 'Uruguai',
    flag: '🇺🇾',
    confederation: 'CONMEBOL',
    coachName: 'Marcelo Bielsa',
    stadium: 'Estadio Centenario (Montevidéu)',
    formation: '4-3-3',
    colors: { primary: '#5C9CD6', secondary: '#000000', text: '#ffffff' },
    trophies: ['Bicampeão Mundial (2 Copas do Mundo)', '15 Copas América'],
    squad: [
      { id: 'uru_1', name: 'Sergio Rochet', position: 'GOL', ovr: 80, age: 31, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 4.0 },
      { id: 'uru_2', name: 'Ronald Araújo', position: 'ZAG', ovr: 85, age: 25, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 70.0, isStar: true },
      { id: 'uru_3', name: 'José María Giménez', position: 'ZAG', ovr: 83, age: 30, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 12.0 },
      { id: 'uru_4', name: 'Nahitan Nández', position: 'LD', ovr: 80, age: 29, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 5.0 },
      { id: 'uru_5', name: 'Mathías Olivera', position: 'LE', ovr: 81, age: 27, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 15.0 },
      { id: 'uru_6', name: 'Manuel Ugarte', position: 'VOL', ovr: 83, age: 23, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 50.0 },
      { id: 'uru_7', name: 'Federico Valverde', position: 'MC', ovr: 89, age: 26, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 130.0, isStar: true },
      { id: 'uru_8', name: 'Giorgian De Arrascaeta', position: 'MEI', ovr: 83, age: 30, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 15.0 },
      { id: 'uru_9', name: 'Facundo Pellistri', position: 'PD', ovr: 77, age: 23, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 10.0 },
      { id: 'uru_10', name: 'Maximiliano Araújo', position: 'PE', ovr: 79, age: 24, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 12.0 },
      { id: 'uru_11', name: 'Darwin Núñez', position: 'CA', ovr: 83, age: 25, nationality: 'Uruguai', flag: '🇺🇾', marketValueEur: 65.0, isStar: true }
    ]
  },

  'colombia': {
    id: 'colombia',
    name: 'Seleção Colombiana',
    shortName: 'Colômbia',
    nickname: 'Los Cafeteros',
    country: 'Colômbia',
    flag: '🇨🇴',
    confederation: 'CONMEBOL',
    coachName: 'Néstor Lorenzo',
    stadium: 'Metropolitano Roberto Meléndez (Barranquilla)',
    formation: '4-3-3',
    colors: { primary: '#FCD116', secondary: '#002776', text: '#002776' },
    trophies: ['Campeão da Copa América 2001', 'Vice-Campeão da Copa América 2024'],
    squad: [
      { id: 'col_1', name: 'Camilo Vargas', position: 'GOL', ovr: 80, age: 35, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 1.5 },
      { id: 'col_2', name: 'Jhon Lucumí', position: 'ZAG', ovr: 81, age: 26, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 17.0 },
      { id: 'col_3', name: 'Davinson Sánchez', position: 'ZAG', ovr: 81, age: 28, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 18.0 },
      { id: 'col_4', name: 'Daniel Muñoz', position: 'LD', ovr: 82, age: 28, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 23.0 },
      { id: 'col_5', name: 'Johan Mojica', position: 'LE', ovr: 79, age: 32, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 2.5 },
      { id: 'col_6', name: 'Jefferson Lerma', position: 'VOL', ovr: 81, age: 30, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 18.0 },
      { id: 'col_7', name: 'Richard Ríos', position: 'MC', ovr: 80, age: 24, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 15.0 },
      { id: 'col_8', name: 'James Rodríguez', position: 'MEI', ovr: 83, age: 33, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 5.0, isStar: true },
      { id: 'col_9', name: 'Jhon Arias', position: 'PD', ovr: 82, age: 27, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 15.0 },
      { id: 'col_10', name: 'Luis Díaz', position: 'PE', ovr: 85, age: 27, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 80.0, isStar: true },
      { id: 'col_11', name: 'Jhon Durán', position: 'CA', ovr: 81, age: 21, nationality: 'Colômbia', flag: '🇨🇴', marketValueEur: 35.0, isStar: true }
    ]
  }
};

/**
 * Retorna a Seleção Nacional correspondente à nacionalidade do jogador
 */
export function getNationalTeamForPlayer(nationality: string): NationalTeam {
  const norm = nationality.toLowerCase().trim();
  if (norm.includes('brasil')) return NATIONAL_TEAMS['brasil'];
  if (norm.includes('argentin')) return NATIONAL_TEAMS['argentina'];
  if (norm.includes('espanh')) return NATIONAL_TEAMS['espanha'];
  if (norm.includes('franç') || norm.includes('franc')) return NATIONAL_TEAMS['franca'];
  if (norm.includes('inglat')) return NATIONAL_TEAMS['inglaterra'];
  if (norm.includes('portug')) return NATIONAL_TEAMS['portugal'];
  if (norm.includes('holand') || norm.includes('países baixos')) return NATIONAL_TEAMS['holanda'];
  if (norm.includes('turqui')) return NATIONAL_TEAMS['turquia'];
  if (norm.includes('escóc') || norm.includes('scot')) return NATIONAL_TEAMS['escocia'];
  if (norm.includes('urugu')) return NATIONAL_TEAMS['uruguai'];
  if (norm.includes('colôm') || norm.includes('colom')) return NATIONAL_TEAMS['colombia'];

  // Padrão Brasil caso não encontre
  return NATIONAL_TEAMS['brasil'];
}
