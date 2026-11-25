#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

ADDITIONAL_CLUBS = [
  # ==========================================
  # BRASIL - SÉRIE B (COMPLETANDO 20 CLUBES)
  # ==========================================
  {
    "key": "Amazonas",
    "id": "amazonas",
    "name": "Amazonas FC",
    "shortName": "Amazonas",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/4/4f/Amazonas_FC.png",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Arena da Amazônia",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 6.0,
    "colors": {"primary": "#ffcc00", "secondary": "#000000", "text": "#000000"},
    "rivalClubs": ["Manaus FC"],
    "playStyle": "Futebol veloz com Sassá aproveitando o calor da floresta",
    "coachName": "Rafael Lacerda",
    "squad": [
      {"id": "amz_1", "name": "Marcão", "position": "GOL", "ovr": 75, "age": 32, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.8},
      {"id": "amz_2", "name": "Sassá", "position": "CA", "ovr": 76, "age": 30, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Botafogo-SP",
    "id": "botafogo_sp",
    "name": "Botafogo FC (SP)",
    "shortName": "Botafogo-SP",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Botafogo_Futebol_Clube_%28Ribeir%C3%A3o_Preto%29.png",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Santa Cruz (Arena Nicnet)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 5.0,
    "colors": {"primary": "#cc0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Comercial", "Ponte Preta"],
    "playStyle": "Força no calor de Ribeirão Preto e velocidade pelos lados",
    "coachName": "Paulo Gomes",
    "squad": [
      {"id": "bsp_1", "name": "João Carlos", "position": "GOL", "ovr": 74, "age": 36, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.3},
      {"id": "bsp_2", "name": "Alexandre Jesus", "position": "CA", "ovr": 75, "age": 23, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.8, "isStar": True}
    ]
  },
  {
    "key": "Brusque",
    "id": "brusque",
    "name": "Brusque FC",
    "shortName": "Brusque",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/2/23/Brusque_Futebol_Clube.png",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Augusto Bauer",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 4.5,
    "colors": {"primary": "#ffcc00", "secondary": "#cc0000", "text": "#ffffff"},
    "rivalClubs": ["Chapecoense", "Avaí"],
    "playStyle": "Futebol disciplinado do Vale do Itajaí e marcação pesada",
    "coachName": "Marcelo Cabo",
    "squad": [
      {"id": "bru_1", "name": "Matheus Nogueira", "position": "GOL", "ovr": 74, "age": 38, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.3},
      {"id": "bru_2", "name": "Guilherme Queiróz", "position": "CA", "ovr": 74, "age": 34, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.5}
    ]
  },
  {
    "key": "Ituano",
    "id": "ituano",
    "name": "Ituano FC",
    "shortName": "Ituano",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Ituano_Futebol_Clube_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Novelli Júnior",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 5.0,
    "colors": {"primary": "#cc0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Ponte Preta", "Guarani"],
    "playStyle": "Galo de Itu com transições velozes e base experiente",
    "coachName": "Chico Elias",
    "squad": [
      {"id": "itu_1", "name": "Jefferson Paulino", "position": "GOL", "ovr": 75, "age": 32, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.8},
      {"id": "itu_2", "name": "Thonny Anderson", "position": "MEI", "ovr": 76, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.8, "isStar": True}
    ]
  },

  # ==========================================
  # INGLATERRA - EFL CHAMPIONSHIP (COMPLETANDO)
  # ==========================================
  {
    "key": "Blackburn Rovers",
    "id": "blackburn",
    "name": "Blackburn Rovers FC",
    "shortName": "Blackburn",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Ewood Park",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#009EE0", "secondary": "#FFFFFF", "text": "#000000"},
    "rivalClubs": ["Burnley"],
    "playStyle": "Tradição campeã da Premier League com intensidade em Ewood Park",
    "coachName": "John Eustace",
    "squad": [
      {"id": "bla_1", "name": "Aynsley Pears", "position": "GOL", "ovr": 75, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 2.5},
      {"id": "bla_2", "name": "Lewis Travis", "position": "VOL", "ovr": 76, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 4.5},
      {"id": "bla_3", "name": "Yuki Ohashi", "position": "CA", "ovr": 76, "age": 28, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Derby County",
    "id": "derby",
    "name": "Derby County FC",
    "shortName": "Derby County",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/4a/Derby_County_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Pride Park Stadium",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#FFFFFF", "secondary": "#000000", "text": "#000000"},
    "rivalClubs": ["Nottingham Forest"],
    "playStyle": "Paixão massiva em Pride Park e jogo aéreo implacável de Paul Warne",
    "coachName": "Paul Warne",
    "squad": [
      {"id": "der_1", "name": "Jacob Widell Zetterström", "position": "GOL", "ovr": 75, "age": 26, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 3.0},
      {"id": "der_2", "name": "Ebou Adams", "position": "VOL", "ovr": 75, "age": 28, "nationality": "Gâmbia", "flag": "🇬🇲", "marketValueEur": 2.5}
    ]
  },
  {
    "key": "Stoke City",
    "id": "stoke",
    "name": "Stoke City FC",
    "shortName": "Stoke City",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/1/11/Stoke_City_FC.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "bet365 Stadium (Britannia)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#E03A3E", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Port Vale"],
    "playStyle": "Ventos fortes no bet365 Stadium com duelos físicos duros",
    "coachName": "Narcís Pèlach",
    "squad": [
      {"id": "stk_1", "name": "Viktor Johansson", "position": "GOL", "ovr": 76, "age": 26, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 4.0},
      {"id": "stk_2", "name": "Million Manhoef", "position": "PD", "ovr": 77, "age": 22, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 6.5, "isStar": True}
    ]
  },
  {
    "key": "Queens Park Rangers",
    "id": "qpr",
    "name": "Queens Park Rangers FC",
    "shortName": "QPR",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/3/31/Queens_Park_Rangers_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Loftus Road (MATRADE Loftus Road)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#1D5BA5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Chelsea", "Brentford", "Fulham"],
    "playStyle": "Pressão asfixiante nas dimensões curtas de Loftus Road",
    "coachName": "Martí Cifuentes",
    "squad": [
      {"id": "qpr_1", "name": "Paul Nardi", "position": "GOL", "ovr": 75, "age": 30, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 2.0},
      {"id": "qpr_2", "name": "Ilias Chair", "position": "MEI", "ovr": 78, "age": 27, "nationality": "Marrocos", "flag": "🇲🇦", "marketValueEur": 9.0, "isStar": True}
    ]
  },
  {
    "key": "Millwall",
    "id": "millwall",
    "name": "Millwall FC",
    "shortName": "Millwall",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/b/b3/Millwall_FC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "The Den",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 20.0,
    "colors": {"primary": "#001A3A", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["West Ham United", "Crystal Palace"],
    "playStyle": "Intimidação lendária em The Den com disputas aéreas implacáveis",
    "coachName": "Neil Harris",
    "squad": [
      {"id": "mil_1", "name": "Lukas Jensen", "position": "GOL", "ovr": 74, "age": 25, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 1.5},
      {"id": "mil_2", "name": "Romain Esse", "position": "MEI", "ovr": 76, "age": 19, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Portsmouth",
    "id": "portsmouth",
    "name": "Portsmouth FC",
    "shortName": "Portsmouth",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/3/38/Portsmouth_FC_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Fratton Park",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#001489", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Southampton"],
    "playStyle": "Empolgação histórica da torcida de Fratton Park e contragolpes",
    "coachName": "John Mousinho",
    "squad": [
      {"id": "por_1", "name": "Will Norris", "position": "GOL", "ovr": 74, "age": 31, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.0},
      {"id": "por_2", "name": "Callum Lang", "position": "PE", "ovr": 76, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Hull City",
    "id": "hull",
    "name": "Hull City AFC",
    "shortName": "Hull City",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "MKM Stadium",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 30.0,
    "colors": {"primary": "#F5971E", "secondary": "#000000", "text": "#000000"},
    "rivalClubs": ["Leeds United"],
    "playStyle": "Os Tigres com futebol veloz pelas pontas e apoio do MKM Stadium",
    "coachName": "Tim Walter",
    "squad": [
      {"id": "hul_1", "name": "Ivor Pandur", "position": "GOL", "ovr": 75, "age": 24, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 3.0},
      {"id": "hul_2", "name": "Mohamed Belloumi", "position": "PD", "ovr": 76, "age": 22, "nationality": "Argélia", "flag": "🇩🇿", "marketValueEur": 4.5, "isStar": True}
    ]
  },
  {
    "key": "Cardiff City",
    "id": "cardiff",
    "name": "Cardiff City FC",
    "shortName": "Cardiff",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/3/3c/Cardiff_City_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Cardiff City Stadium",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#0000ff", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Swansea City", "Bristol City"],
    "playStyle": "Fervor galês nos Bluebirds com bolas paradas de David Turnbull",
    "coachName": "Omer Riza",
    "squad": [
      {"id": "car_1", "name": "Jak Alnwick", "position": "GOL", "ovr": 74, "age": 31, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.2},
      {"id": "car_2", "name": "David Turnbull", "position": "MC", "ovr": 76, "age": 25, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Swansea City",
    "id": "swansea",
    "name": "Swansea City AFC",
    "shortName": "Swansea",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f9/Swansea_City_AFC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Swansea.com Stadium (Liberty)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#FFFFFF", "secondary": "#000000", "text": "#000000"},
    "rivalClubs": ["Cardiff City"],
    "playStyle": "Tradição de posse de bola controlada dos Cisnes galeses",
    "coachName": "Luke Williams",
    "squad": [
      {"id": "swa_1", "name": "Lawrence Vigouroux", "position": "GOL", "ovr": 75, "age": 31, "nationality": "Chile", "flag": "🇨🇱", "marketValueEur": 1.0},
      {"id": "swa_2", "name": "Matt Grimes", "position": "VOL", "ovr": 77, "age": 29, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 4.5, "isStar": True}
    ]
  },

  # ==========================================
  # ESPANHA - LA LIGA (COMPLETANDO OS 20 CLUBES)
  # ==========================================
  {
    "key": "Osasuna",
    "id": "osasuna",
    "name": "CA Osasuna",
    "shortName": "Osasuna",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/d/db/Osasuna_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "El Sadar (Pamplona)",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 35.0,
    "colors": {"primary": "#A51C30", "secondary": "#0C2340", "text": "#ffffff"},
    "rivalClubs": ["Athletic Club", "Real Sociedad"],
    "playStyle": "Pressão avassaladora e entrega insana na fortaleza de El Sadar",
    "coachName": "Dani Pendín",
    "squad": [
      {"id": "osa_1", "name": "Sergio Herrera", "position": "GOL", "ovr": 79, "age": 31, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 6.0},
      {"id": "osa_2", "name": "Lucas Torró", "position": "VOL", "ovr": 79, "age": 30, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 8.0},
      {"id": "osa_3", "name": "Ante Budimir", "position": "CA", "ovr": 81, "age": 33, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Rayo Vallecano",
    "id": "rayo",
    "name": "Rayo Vallecano de Madrid",
    "shortName": "Rayo Vallecano",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/1/17/Rayo_Vallecano_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Campo de Fútbol de Vallecas",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#e30613", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Real Madrid", "Atlético de Madrid", "Getafe"],
    "playStyle": "Espírito operário rebelde de Vallecas com genialidade de James Rodríguez",
    "coachName": "Iñigo Pérez",
    "squad": [
      {"id": "ray_1", "name": "Augusto Batalla", "position": "GOL", "ovr": 78, "age": 28, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 5.0},
      {"id": "ray_2", "name": "James Rodríguez", "position": "MEI", "ovr": 82, "age": 33, "nationality": "Colômbia", "flag": "🇨🇴", "marketValueEur": 5.0, "isStar": True},
      {"id": "ray_3", "name": "Isi Palazón", "position": "PD", "ovr": 80, "age": 29, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 8.0}
    ]
  },
  {
    "key": "Las Palmas",
    "id": "las_palmas",
    "name": "UD Las Palmas",
    "shortName": "Las Palmas",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/06/UD_Las_Palmas_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Estadio Gran Canaria",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#FFF200", "secondary": "#0055A5", "text": "#000000"},
    "rivalClubs": ["Tenerife"],
    "playStyle": "Futebol canário de posse associativa e técnica apurada",
    "coachName": "Diego Martínez",
    "squad": [
      {"id": "lpa_1", "name": "Jasper Cillessen", "position": "GOL", "ovr": 78, "age": 35, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 2.0},
      {"id": "lpa_2", "name": "Kirian Rodríguez", "position": "MC", "ovr": 80, "age": 28, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 12.0, "isStar": True},
      {"id": "lpa_3", "name": "Fábio Silva", "position": "CA", "ovr": 78, "age": 22, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 12.0}
    ]
  },
  {
    "key": "Getafe",
    "id": "getafe",
    "name": "Getafe CF",
    "shortName": "Getafe",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/7f/Getafe_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Coliseum",
    "prestige": 3,
    "formation": "4-4-2",
    "budgetEur": 30.0,
    "colors": {"primary": "#00529F", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Leganés", "Real Madrid", "Rayo Vallecano"],
    "playStyle": "Bordalás clássico: marcação impiedosa, bloco impenetrável e contra-ataques",
    "coachName": "José Bordalás",
    "squad": [
      {"id": "get_1", "name": "David Soria", "position": "GOL", "ovr": 80, "age": 31, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 5.0},
      {"id": "get_2", "name": "Mauro Arambarri", "position": "VOL", "ovr": 80, "age": 29, "nationality": "Uruguai", "flag": "🇺🇾", "marketValueEur": 6.0, "isStar": True},
      {"id": "get_3", "name": "Borja Mayoral", "position": "CA", "ovr": 80, "age": 27, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 15.0, "isStar": True}
    ]
  },
  {
    "key": "Deportivo Alavés",
    "id": "alaves",
    "name": "Deportivo Alavés",
    "shortName": "Alavés",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f8/Deportivo_Alaves_logo_%282020%29.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Mendizorroza",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Athletic Club", "Real Sociedad"],
    "playStyle": "Intensidade basca e entrega nos 90 minutos em Mendizorroza",
    "coachName": "Luis García Plaza",
    "squad": [
      {"id": "ala_1", "name": "Antonio Sivera", "position": "GOL", "ovr": 78, "age": 28, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 4.0},
      {"id": "ala_2", "name": "Kike García", "position": "CA", "ovr": 77, "age": 34, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Espanyol",
    "id": "espanyol",
    "name": "RCD Espanyol de Barcelona",
    "shortName": "Espanyol",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/d/d6/Rcd_espanyol_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "RCDE Stadium",
    "prestige": 3,
    "formation": "4-4-2",
    "budgetEur": 35.0,
    "colors": {"primary": "#0072CE", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Barcelona"],
    "playStyle": "Derbi barcelonês aguerrido com zaga sólida e oportunismo de Javi Puado",
    "coachName": "Manolo González",
    "squad": [
      {"id": "esp_1", "name": "Joan García", "position": "GOL", "ovr": 80, "age": 23, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 10.0, "isStar": True},
      {"id": "esp_2", "name": "Javi Puado", "position": "PE", "ovr": 79, "age": 26, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Leganés",
    "id": "leganes",
    "name": "CD Leganés",
    "shortName": "Leganés",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/02/Club_Deportivo_Legan%C3%A9s_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Estadio Municipal Butarque",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Getafe"],
    "playStyle": "Paciência defensiva e contra-ataques objetivos dos Pepineros",
    "coachName": "Borja Jiménez",
    "squad": [
      {"id": "leg_1", "name": "Marko Dmitrović", "position": "GOL", "ovr": 78, "age": 32, "nationality": "Sérvia", "flag": "🇷🇸", "marketValueEur": 2.5},
      {"id": "leg_2", "name": "Juan Cruz", "position": "PD", "ovr": 77, "age": 24, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Real Valladolid",
    "id": "valladolid",
    "name": "Real Valladolid CF",
    "shortName": "Valladolid",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6d/Real_Valladolid_Logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "José Zorrilla",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#4B0082", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Cultural Leonesa"],
    "playStyle": "Pucela: futebol veloz pelas alas com Raúl Moro desequilibrando",
    "coachName": "Paulo Pezzolano",
    "squad": [
      {"id": "val_r1", "name": "Karl Hein", "position": "GOL", "ovr": 77, "age": 22, "nationality": "Estônia", "flag": "🇪🇪", "marketValueEur": 3.0},
      {"id": "val_r2", "name": "Raúl Moro", "position": "PE", "ovr": 78, "age": 21, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 6.0, "isStar": True}
    ]
  },

  # ==========================================
  # ITÁLIA - SERIE A (COMPLETANDO OS 20 CLUBES)
  # ==========================================
  {
    "key": "Udinese",
    "id": "udinese",
    "name": "Udinese Calcio",
    "shortName": "Udinese",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/ce/Udinese_Calcio_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Bluenergy Stadium (Friuli)",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 35.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Triestina", "Venezia"],
    "playStyle": "Poder físico assombroso com zaga alta e talento de Lorenzo Lucca",
    "coachName": "Kosta Runjaić",
    "squad": [
      {"id": "udi_1", "name": "Maduka Okoye", "position": "GOL", "ovr": 78, "age": 25, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 7.5},
      {"id": "udi_2", "name": "Jaka Bijol", "position": "ZAG", "ovr": 80, "age": 25, "nationality": "Eslovênia", "flag": "🇸🇮", "marketValueEur": 18.0},
      {"id": "udi_3", "name": "Lorenzo Lucca", "position": "CA", "ovr": 80, "age": 24, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 18.0, "isStar": True}
    ]
  },
  {
    "key": "Genoa",
    "id": "genoa",
    "name": "Genoa CFC",
    "shortName": "Genoa",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6c/Genoa_C.F.C._logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Luigi Ferraris (Marassi)",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 35.0,
    "colors": {"primary": "#002B49", "secondary": "#A81E2E", "text": "#ffffff"},
    "rivalClubs": ["Sampdoria"],
    "playStyle": "O clube mais antigo da Itália: alma em Marassi e retorno triunfal de Balotelli",
    "coachName": "Patrick Vieira",
    "squad": [
      {"id": "gen_1", "name": "Pierluigi Gollini", "position": "GOL", "ovr": 78, "age": 29, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 5.0},
      {"id": "gen_2", "name": "Morten Frendrup", "position": "VOL", "ovr": 80, "age": 23, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 20.0, "isStar": True},
      {"id": "gen_3", "name": "Mario Balotelli", "position": "CA", "ovr": 77, "age": 34, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 1.2, "isStar": True}
    ]
  },
  {
    "key": "Verona",
    "id": "verona",
    "name": "Hellas Verona FC",
    "shortName": "Verona",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/92/Hellas_Verona_FC_logo_%282020%29.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Marcantonio Bentegodi",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#002F6C", "secondary": "#FFE000", "text": "#ffffff"},
    "rivalClubs": ["Chievo", "Vicenza"],
    "playStyle": "Intensidade agressiva no Bentegodi com transição de Tengstedt",
    "coachName": "Paolo Zanetti",
    "squad": [
      {"id": "ver_1", "name": "Lorenzo Montipò", "position": "GOL", "ovr": 78, "age": 28, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 4.0},
      {"id": "ver_2", "name": "Casper Tengstedt", "position": "CA", "ovr": 77, "age": 24, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Empoli",
    "id": "empoli",
    "name": "Empoli FC",
    "shortName": "Empoli",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c2/Empoli_FC_1920.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Carlo Castellani",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 22.0,
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Fiorentina"],
    "playStyle": "Futebol inteligente toscano com zaga sólida de Roberto D'Aversa",
    "coachName": "Roberto D'Aversa",
    "squad": [
      {"id": "emp_1", "name": "Devis Vásquez", "position": "GOL", "ovr": 77, "age": 26, "nationality": "Colômbia", "flag": "🇨🇴", "marketValueEur": 3.0},
      {"id": "emp_2", "name": "Sebastiano Esposito", "position": "CA", "ovr": 77, "age": 22, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Cagliari",
    "id": "cagliari",
    "name": "Cagliari Calcio",
    "shortName": "Cagliari",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/61/Cagliari_Calcio_1920.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Unipol Domus",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#002B49", "secondary": "#C8102E", "text": "#ffffff"},
    "rivalClubs": ["Torres"],
    "playStyle": "Orgulho sardo com valentia física e cruzamentos para Piccoli",
    "coachName": "Davide Nicola",
    "squad": [
      {"id": "cag_1", "name": "Simone Scuffet", "position": "GOL", "ovr": 77, "age": 28, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 2.5},
      {"id": "cag_2", "name": "Roberto Piccoli", "position": "CA", "ovr": 77, "age": 23, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Lecce",
    "id": "lecce",
    "name": "US Lecce",
    "shortName": "Lecce",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c9/U.S._Lecce_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Via del Mare",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 22.0,
    "colors": {"primary": "#FFCC00", "secondary": "#CC0000", "text": "#000000"},
    "rivalClubs": ["Bari"],
    "playStyle": "Fervor do sul italiano no Via del Mare e talento de Krstović",
    "coachName": "Marco Giampaolo",
    "squad": [
      {"id": "lec_1", "name": "Wladimiro Falcone", "position": "GOL", "ovr": 79, "age": 29, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 5.0},
      {"id": "lec_2", "name": "Nikola Krstović", "position": "CA", "ovr": 78, "age": 24, "nationality": "Montenegro", "flag": "🇲🇪", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Monza",
    "id": "monza",
    "name": "AC Monza",
    "shortName": "Monza",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2e/AC_Monza_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "U-Power Stadium (Brianteo)",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Como", "Milan"],
    "playStyle": "Futebol moderno lombardo com Daniel Maldini brilhando",
    "coachName": "Alessandro Nesta",
    "squad": [
      {"id": "mon_1", "name": "Stefano Turati", "position": "GOL", "ovr": 78, "age": 23, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 7.0},
      {"id": "mon_2", "name": "Matteo Pessina", "position": "MC", "ovr": 80, "age": 27, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 15.0, "isStar": True},
      {"id": "mon_3", "name": "Daniel Maldini", "position": "MEI", "ovr": 78, "age": 23, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 12.0, "isStar": True}
    ]
  },
  {
    "key": "Venezia",
    "id": "venezia",
    "name": "Venezia FC",
    "shortName": "Venezia",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Venezia_FC_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Pier Luigi Penzo",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 22.0,
    "colors": {"primary": "#E2725B", "secondary": "#00552b", "text": "#ffffff"},
    "rivalClubs": ["Padova", "Verona"],
    "playStyle": "Futebol charmoso na lagoa de Veneza com gols de Pohjanpalo",
    "coachName": "Eusebio Di Francesco",
    "squad": [
      {"id": "ven_1", "name": "Jesse Joronen", "position": "GOL", "ovr": 76, "age": 31, "nationality": "Finlândia", "flag": "🇫🇮", "marketValueEur": 2.0},
      {"id": "ven_2", "name": "Joel Pohjanpalo", "position": "CA", "ovr": 79, "age": 30, "nationality": "Finlândia", "flag": "🇫🇮", "marketValueEur": 5.5, "isStar": True}
    ]
  }
]

def run():
    with open(CLUBS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    closing_pattern = r'(\n\}\;\s*\n\/\*\*[\s\S]*?export const CLUBS)'
    match = re.search(closing_pattern, content)
    if not match:
        print("Erro: Fechamento nao encontrado!")
        return

    insert_idx = match.start(1)
    added = 0
    ts_code = "\n"

    for club in ADDITIONAL_CLUBS:
        if f"id: '{club['id']}'" in content or f'id: "{club["id"]}"' in content or f"'{club['key']}': {{" in content:
            continue

        added += 1
        ts_code += f"  '{club['key']}': {{\n"
        ts_code += f"    id: '{club['id']}',\n"
        ts_code += f"    name: '{club['name']}',\n"
        ts_code += f"    shortName: '{club['shortName']}',\n"
        ts_code += f"    badgeUrl: '{club['badgeUrl']}',\n"
        ts_code += f"    leagueId: '{club['leagueId']}',\n"
        ts_code += f"    league: '{club['league']}',\n"
        ts_code += f"    country: '{club['country']}',\n"
        ts_code += f"    stadium: '{club['stadium']}',\n"
        ts_code += f"    prestige: {club['prestige']},\n"
        ts_code += f"    formation: '{club['formation']}',\n"
        ts_code += f"    budgetEur: {club['budgetEur']},\n"
        ts_code += f"    colors: {{ primary: '{club['colors']['primary']}', secondary: '{club['colors']['secondary']}', text: '{club['colors']['text']}' }},\n"
        ts_code += f"    rivalClubs: {json.dumps(club['rivalClubs'], ensure_ascii=False)},\n"
        ts_code += f"    playStyle: '{club['playStyle']}',\n"
        ts_code += f"    coachName: '{club['coachName']}',\n"
        ts_code += f"    squad: [\n"
        for p in club['squad']:
            star_prop = ", isStar: true" if p.get('isStar') else ""
            ts_code += f"      {{ id: '{p['id']}', name: '{p['name']}', position: '{p['position']}', ovr: {p['ovr']}, age: {p['age']}, nationality: '{p['nationality']}', flag: '{p['flag']}', marketValueEur: {p['marketValueEur']}{star_prop} }},\n"
        ts_code = ts_code.rstrip(',\n') + "\n"
        ts_code += f"    ]\n"
        ts_code += f"  }},\n"

    ts_code = ts_code.rstrip(',\n') + "\n"
    new_content = content[:insert_idx] + ts_code + content[insert_idx:]

    with open(CLUBS_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"Sucesso! {added} clubes adicionados.")

if __name__ == '__main__':
    run()
