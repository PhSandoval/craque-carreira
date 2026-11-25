#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

# Dicionário de clubes a serem adicionados se ainda não existirem
CLUBS_DATA = [
  # ==========================================
  # INGLATERRA - PREMIER LEAGUE
  # ==========================================
  {
    "key": "West Ham United",
    "id": "west_ham",
    "name": "West Ham United FC",
    "shortName": "West Ham",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "London Stadium",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 75.0,
    "colors": {"primary": "#7A263A", "secondary": "#1BB1E7", "text": "#ffffff"},
    "rivalClubs": ["Tottenham Hotspur", "Chelsea"],
    "playStyle": "Futebol vertical pelos lados com bola aérea potente",
    "coachName": "Julen Lopetegui",
    "squad": [
      {"id": "whu_1", "name": "Alphonse Areola", "position": "GOL", "ovr": 80, "age": 31, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 10.0},
      {"id": "whu_2", "name": "Max Kilman", "position": "ZAG", "ovr": 81, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 35.0},
      {"id": "whu_3", "name": "Lucas Paquetá", "position": "MEI", "ovr": 84, "age": 27, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 65.0, "isStar": True},
      {"id": "whu_4", "name": "Mohammed Kudus", "position": "PD", "ovr": 83, "age": 24, "nationality": "Gana", "flag": "🇬🇭", "marketValueEur": 50.0, "isStar": True},
      {"id": "whu_5", "name": "Jarrod Bowen", "position": "CA", "ovr": 82, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 50.0}
    ]
  },
  {
    "key": "Fulham",
    "id": "fulham",
    "name": "Fulham FC",
    "shortName": "Fulham",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Fulham_FC_%28shield%29.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Craven Cottage",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 55.0,
    "colors": {"primary": "#000000", "secondary": "#CC0000", "text": "#ffffff"},
    "rivalClubs": ["Chelsea", "Brentford"],
    "playStyle": "Pressão alta agressiva e transição veloz pelos flancos",
    "coachName": "Marco Silva",
    "squad": [
      {"id": "ful_1", "name": "Bernd Leno", "position": "GOL", "ovr": 81, "age": 32, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 13.0},
      {"id": "ful_2", "name": "Joachim Andersen", "position": "ZAG", "ovr": 81, "age": 28, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 35.0},
      {"id": "ful_3", "name": "Andreas Pereira", "position": "MEI", "ovr": 80, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 20.0, "isStar": True},
      {"id": "ful_4", "name": "Adama Traoré", "position": "PD", "ovr": 78, "age": 28, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 10.0},
      {"id": "ful_5", "name": "Raúl Jiménez", "position": "CA", "ovr": 79, "age": 33, "nationality": "México", "flag": "🇲🇽", "marketValueEur": 6.0}
    ]
  },
  {
    "key": "Bournemouth",
    "id": "bournemouth",
    "name": "AFC Bournemouth",
    "shortName": "Bournemouth",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth_%282013%29.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Vitality Stadium",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 50.0,
    "colors": {"primary": "#DA291C", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Southampton"],
    "playStyle": "Intensidade sufocante de Andoni Iraola e recuperação no campo ofensivo",
    "coachName": "Andoni Iraola",
    "squad": [
      {"id": "bou_1", "name": "Kepa Arrizabalaga", "position": "GOL", "ovr": 80, "age": 30, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 12.0},
      {"id": "bou_2", "name": "Illia Zabarnyi", "position": "ZAG", "ovr": 80, "age": 22, "nationality": "Ucrânia", "flag": "🇺🇦", "marketValueEur": 32.0},
      {"id": "bou_3", "name": "Antoine Semenyo", "position": "PE", "ovr": 80, "age": 24, "nationality": "Gana", "flag": "🇬🇭", "marketValueEur": 25.0, "isStar": True},
      {"id": "bou_4", "name": "Evanilson", "position": "CA", "ovr": 81, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 35.0, "isStar": True}
    ]
  },
  {
    "key": "Brentford",
    "id": "brentford",
    "name": "Brentford FC",
    "shortName": "Brentford",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Gtech Community Stadium",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 45.0,
    "colors": {"primary": "#e30613", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Fulham", "Chelsea"],
    "playStyle": "Futebol analítico de dados, bolas paradas mortais e ritmo frenético",
    "coachName": "Thomas Frank",
    "squad": [
      {"id": "bre_1", "name": "Mark Flekken", "position": "GOL", "ovr": 79, "age": 31, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 12.0},
      {"id": "bre_2", "name": "Nathan Collins", "position": "ZAG", "ovr": 79, "age": 23, "nationality": "Irlanda", "flag": "🇮🇪", "marketValueEur": 25.0},
      {"id": "bre_3", "name": "Bryan Mbeumo", "position": "PD", "ovr": 83, "age": 25, "nationality": "Camarões", "flag": "🇨🇲", "marketValueEur": 40.0, "isStar": True},
      {"id": "bre_4", "name": "Yoane Wissa", "position": "PE", "ovr": 80, "age": 28, "nationality": "RD Congo", "flag": "🇨🇩", "marketValueEur": 28.0}
    ]
  },
  {
    "key": "Nottingham Forest",
    "id": "nottingham",
    "name": "Nottingham Forest FC",
    "shortName": "Nottm Forest",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e5/Nottingham_Forest_F.C._logo.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "City Ground",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 60.0,
    "colors": {"primary": "#DD0000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Derby County", "Leicester City"],
    "playStyle": "Bloco baixo compacto com contra-ataques cirúrgicos liderados por Gibbs-White",
    "coachName": "Nuno Espírito Santo",
    "squad": [
      {"id": "nfo_1", "name": "Matz Sels", "position": "GOL", "ovr": 80, "age": 32, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 8.0},
      {"id": "nfo_2", "name": "Murillo", "position": "ZAG", "ovr": 82, "age": 22, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 40.0, "isStar": True},
      {"id": "nfo_3", "name": "Morgan Gibbs-White", "position": "MEI", "ovr": 82, "age": 24, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 45.0, "isStar": True},
      {"id": "nfo_4", "name": "Chris Wood", "position": "CA", "ovr": 80, "age": 32, "nationality": "Nova Zelândia", "flag": "🇳🇿", "marketValueEur": 10.0}
    ]
  },
  {
    "key": "Crystal Palace",
    "id": "crystal_palace",
    "name": "Crystal Palace FC",
    "shortName": "Crystal Palace",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a2/Crystal_Palace_FC_logo_%282022%29.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Selhurst Park",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 55.0,
    "colors": {"primary": "#1B458F", "secondary": "#C4122E", "text": "#ffffff"},
    "rivalClubs": ["Brighton & Hove Albion"],
    "playStyle": "Linha de três dinâmica de Oliver Glasner com aproximações rápidas",
    "coachName": "Oliver Glasner",
    "squad": [
      {"id": "cry_1", "name": "Dean Henderson", "position": "GOL", "ovr": 79, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 15.0},
      {"id": "cry_2", "name": "Marc Guéhi", "position": "ZAG", "ovr": 82, "age": 24, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 45.0, "isStar": True},
      {"id": "cry_3", "name": "Eberechi Eze", "position": "MEI", "ovr": 83, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 60.0, "isStar": True},
      {"id": "cry_4", "name": "Jean-Philippe Mateta", "position": "CA", "ovr": 80, "age": 27, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 25.0}
    ]
  },
  {
    "key": "Wolverhampton",
    "id": "wolves",
    "name": "Wolverhampton Wanderers FC",
    "shortName": "Wolves",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Molineux Stadium",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 45.0,
    "colors": {"primary": "#FDB913", "secondary": "#231F20", "text": "#000000"},
    "rivalClubs": ["West Bromwich Albion", "Aston Villa"],
    "playStyle": "Duelos físicos duros e velocidade de Matheus Cunha no ataque",
    "coachName": "Gary O'Neil",
    "squad": [
      {"id": "wol_1", "name": "José Sá", "position": "GOL", "ovr": 79, "age": 31, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 12.0},
      {"id": "wol_2", "name": "João Gomes", "position": "VOL", "ovr": 81, "age": 23, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 40.0, "isStar": True},
      {"id": "wol_3", "name": "Matheus Cunha", "position": "CA", "ovr": 83, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 50.0, "isStar": True}
    ]
  },
  {
    "key": "Everton",
    "id": "everton",
    "name": "Everton FC",
    "shortName": "Everton",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_crest.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Goodison Park",
    "prestige": 4,
    "formation": "4-4-1-1",
    "budgetEur": 40.0,
    "colors": {"primary": "#003399", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Liverpool"],
    "playStyle": "Futebol pragmático de Sean Dyche, bolas paradas e entrega física extrema",
    "coachName": "Sean Dyche",
    "squad": [
      {"id": "eve_1", "name": "Jordan Pickford", "position": "GOL", "ovr": 82, "age": 30, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 22.0, "isStar": True},
      {"id": "eve_2", "name": "Jarrad Branthwaite", "position": "ZAG", "ovr": 82, "age": 22, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 50.0, "isStar": True},
      {"id": "eve_3", "name": "Dwight McNeil", "position": "MEI", "ovr": 80, "age": 24, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 25.0},
      {"id": "eve_4", "name": "Dominic Calvert-Lewin", "position": "CA", "ovr": 79, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 22.0}
    ]
  },
  {
    "key": "Ipswich Town",
    "id": "ipswich",
    "name": "Ipswich Town FC",
    "shortName": "Ipswich Town",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/43/Ipswich_Town.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "Portman Road",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#004499", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Norwich City"],
    "playStyle": "Futebol corajoso e ofensivo de Kieran McKenna",
    "coachName": "Kieran McKenna",
    "squad": [
      {"id": "ips_1", "name": "Arijanet Muric", "position": "GOL", "ovr": 77, "age": 25, "nationality": "Kosovo", "flag": "🇽🇰", "marketValueEur": 8.0},
      {"id": "ips_2", "name": "Liam Delap", "position": "CA", "ovr": 79, "age": 21, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 25.0, "isStar": True}
    ]
  },
  {
    "key": "Southampton",
    "id": "southampton",
    "name": "Southampton FC",
    "shortName": "Southampton",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg",
    "leagueId": "premier_league",
    "league": "Premier League",
    "country": "Inglaterra",
    "stadium": "St Mary's Stadium",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 40.0,
    "colors": {"primary": "#D71920", "secondary": "#130C0E", "text": "#ffffff"},
    "rivalClubs": ["Portsmouth"],
    "playStyle": "Posse de bola paciente e construção apoiada desde o goleiro",
    "coachName": "Russell Martin",
    "squad": [
      {"id": "sou_1", "name": "Aaron Ramsdale", "position": "GOL", "ovr": 80, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 25.0, "isStar": True},
      {"id": "sou_2", "name": "Cameron Archer", "position": "CA", "ovr": 77, "age": 22, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 18.0}
    ]
  },

  # ==========================================
  # INGLATERRA - EFL CHAMPIONSHIP (Top Times)
  # ==========================================
  {
    "key": "Burnley",
    "id": "burnley",
    "name": "Burnley FC",
    "shortName": "Burnley",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Turf Moor",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 45.0,
    "colors": {"primary": "#6C1D45", "secondary": "#99D6EA", "text": "#ffffff"},
    "rivalClubs": ["Blackburn Rovers"],
    "playStyle": "Futebol veloz de transição de Scott Parker buscando retorno imediato",
    "coachName": "Scott Parker",
    "squad": [
      {"id": "bur_1", "name": "James Trafford", "position": "GOL", "ovr": 78, "age": 22, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 18.0, "isStar": True},
      {"id": "bur_2", "name": "Josh Brownhill", "position": "MC", "ovr": 78, "age": 28, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 15.0},
      {"id": "bur_3", "name": "Lyle Foster", "position": "CA", "ovr": 76, "age": 24, "nationality": "África do Sul", "flag": "🇿🇦", "marketValueEur": 12.0}
    ]
  },
  {
    "key": "Sheffield United",
    "id": "sheffield_utd",
    "name": "Sheffield United FC",
    "shortName": "Sheff Utd",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/9c/Sheffield_United_FC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Bramall Lane",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 40.0,
    "colors": {"primary": "#EE2737", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Sheffield Wednesday"],
    "playStyle": "Batalha física feroz em Bramall Lane com zagueiros sobrepostos de Chris Wilder",
    "coachName": "Chris Wilder",
    "squad": [
      {"id": "shu_1", "name": "Michael Cooper", "position": "GOL", "ovr": 76, "age": 25, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 6.0},
      {"id": "shu_2", "name": "Vinicius Souza", "position": "VOL", "ovr": 78, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 14.0, "isStar": True},
      {"id": "shu_3", "name": "Kieffer Moore", "position": "CA", "ovr": 75, "age": 32, "nationality": "País de Gales", "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "marketValueEur": 3.0}
    ]
  },
  {
    "key": "West Bromwich Albion",
    "id": "west_brom",
    "name": "West Bromwich Albion FC",
    "shortName": "West Brom",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/8b/West_Bromwich_Albion.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "The Hawthorns",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#122F67", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Wolverhampton Wanderers", "Aston Villa"],
    "playStyle": "Estrutura defensiva de ferro de Carlos Corberán e contragolpes cirúrgicos",
    "coachName": "Carlos Corberán",
    "squad": [
      {"id": "wba_1", "name": "Alex Palmer", "position": "GOL", "ovr": 76, "age": 28, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 5.0},
      {"id": "wba_2", "name": "Alex Mowatt", "position": "MC", "ovr": 75, "age": 29, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 3.5},
      {"id": "wba_3", "name": "Josh Maja", "position": "CA", "ovr": 77, "age": 25, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Middlesbrough",
    "id": "middlesbrough",
    "name": "Middlesbrough FC",
    "shortName": "Middlesbrough",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2c/Middlesbrough_FC_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Riverside Stadium",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#D00027", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Sunderland", "Newcastle United"],
    "playStyle": "Futebol envolvente e moderno implementado por Michael Carrick",
    "coachName": "Michael Carrick",
    "squad": [
      {"id": "mid_1", "name": "Seny Dieng", "position": "GOL", "ovr": 76, "age": 29, "nationality": "Senegal", "flag": "🇸🇳", "marketValueEur": 4.0},
      {"id": "mid_2", "name": "Hayden Hackney", "position": "MC", "ovr": 77, "age": 22, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 10.0, "isStar": True},
      {"id": "mid_3", "name": "Emmanuel Latte Lath", "position": "CA", "ovr": 77, "age": 25, "nationality": "Costa do Marfim", "flag": "🇨🇮", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Norwich City",
    "id": "norwich",
    "name": "Norwich City FC",
    "shortName": "Norwich City",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/8c/Norwich_City.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Carrow Road",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 35.0,
    "colors": {"primary": "#FFF200", "secondary": "#00A651", "text": "#000000"},
    "rivalClubs": ["Ipswich Town"],
    "playStyle": "Futebol dinamarquês veloz e apoio massivo da torcida de Carrow Road",
    "coachName": "Johannes Hoff Thorup",
    "squad": [
      {"id": "nor_1", "name": "Angus Gunn", "position": "GOL", "ovr": 76, "age": 28, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 4.0},
      {"id": "nor_2", "name": "Marcelino Núñez", "position": "MC", "ovr": 76, "age": 24, "nationality": "Chile", "flag": "🇨🇱", "marketValueEur": 6.0},
      {"id": "nor_3", "name": "Josh Sargent", "position": "CA", "ovr": 78, "age": 24, "nationality": "Estados Unidos", "flag": "🇺🇸", "marketValueEur": 14.0, "isStar": True}
    ]
  },
  {
    "key": "Watford",
    "id": "watford",
    "name": "Watford FC",
    "shortName": "Watford",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e2/Watford.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Vicarage Road",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#FBEE23", "secondary": "#ED2127", "text": "#000000"},
    "rivalClubs": ["Luton Town"],
    "playStyle": "Intensidade física com transições agressivas comandadas por Tom Cleverley",
    "coachName": "Tom Cleverley",
    "squad": [
      {"id": "wat_1", "name": "Daniel Bachmann", "position": "GOL", "ovr": 75, "age": 30, "nationality": "Áustria", "flag": "🇦🇹", "marketValueEur": 2.5},
      {"id": "wat_2", "name": "Moussa Sissoko", "position": "MC", "ovr": 76, "age": 35, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 2.0},
      {"id": "wat_3", "name": "Vakoun Bayo", "position": "CA", "ovr": 75, "age": 27, "nationality": "Costa do Marfim", "flag": "🇨🇮", "marketValueEur": 3.0}
    ]
  },
  {
    "key": "Coventry City",
    "id": "coventry",
    "name": "Coventry City FC",
    "shortName": "Coventry",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/94/Coventry_City_FC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Coventry Building Society Arena",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#00AEEF", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Leicester City", "Aston Villa"],
    "playStyle": "Futebol audacioso com velocidade mortal de Haji Wright",
    "coachName": "Frank Lampard",
    "squad": [
      {"id": "cov_1", "name": "Oliver Dovin", "position": "GOL", "ovr": 74, "age": 22, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 3.5},
      {"id": "cov_2", "name": "Jack Rudoni", "position": "MC", "ovr": 75, "age": 23, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 6.0},
      {"id": "cov_3", "name": "Haji Wright", "position": "CA", "ovr": 77, "age": 26, "nationality": "Estados Unidos", "flag": "🇺🇸", "marketValueEur": 10.0, "isStar": True}
    ]
  },
  {
    "key": "Luton Town",
    "id": "luton",
    "name": "Luton Town FC",
    "shortName": "Luton",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/9d/Luton_Town_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Kenilworth Road",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 35.0,
    "colors": {"primary": "#F78F1E", "secondary": "#002D62", "text": "#ffffff"},
    "rivalClubs": ["Watford"],
    "playStyle": "Pressão asfixiante e cruzamentos implacáveis em Kenilworth Road",
    "coachName": "Rob Edwards",
    "squad": [
      {"id": "lut_1", "name": "Thomas Kaminski", "position": "GOL", "ovr": 77, "age": 31, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 5.0},
      {"id": "lut_2", "name": "Carlton Morris", "position": "CA", "ovr": 77, "age": 28, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 9.0, "isStar": True},
      {"id": "lut_3", "name": "Elijah Adebayo", "position": "CA", "ovr": 76, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 8.0}
    ]
  },

  # ==========================================
  # BRASIL - SÉRIE A (COMPLETANDO OS 20 CLUBES)
  # ==========================================
  {
    "key": "Red Bull Bragantino",
    "id": "bragantino",
    "name": "Red Bull Bragantino",
    "shortName": "Bragantino",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/9/9e/RedBullBragantino.png",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Nabi Abi Chedid",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#e30613", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Ponte Preta", "Palmeiras"],
    "playStyle": "Intensidade física europeia com jovens promissores e pressão sufocante",
    "coachName": "Fernando Seabra",
    "squad": [
      {"id": "brg_1", "name": "Cleiton", "position": "GOL", "ovr": 78, "age": 27, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 6.0},
      {"id": "brg_2", "name": "Eduardo Santos", "position": "ZAG", "ovr": 76, "age": 27, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.0},
      {"id": "brg_3", "name": "Lucas Evangelista", "position": "MC", "ovr": 79, "age": 29, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 5.0, "isStar": True},
      {"id": "brg_4", "name": "Eduardo Sasha", "position": "CA", "ovr": 77, "age": 32, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.5}
    ]
  },
  {
    "key": "Vitória",
    "id": "vitoria_ba",
    "name": "EC Vitória",
    "shortName": "Vitória",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/4/44/Esporte_Clube_Vit%C3%B3ria_logo.svg",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Barradão",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 15.0,
    "colors": {"primary": "#ff0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Bahia"],
    "playStyle": "Força no caldeirão do Barradão, contra-ataques velozes e entrega total",
    "coachName": "Thiago Carpini",
    "squad": [
      {"id": "vit_1", "name": "Lucas Arcanjo", "position": "GOL", "ovr": 77, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.0},
      {"id": "vit_2", "name": "Wagner Leonardo", "position": "ZAG", "ovr": 78, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 4.5, "isStar": True},
      {"id": "vit_3", "name": "Matheuzinho", "position": "MEI", "ovr": 79, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 5.0, "isStar": True},
      {"id": "vit_4", "name": "Alerrandro", "position": "CA", "ovr": 77, "age": 24, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 4.0}
    ]
  },
  {
    "key": "Criciúma",
    "id": "criciuma",
    "name": "Criciúma EC",
    "shortName": "Criciúma",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/Crici%C3%BAma_EC_crest.svg",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Heriberto Hülse (Majestoso)",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 12.0,
    "colors": {"primary": "#f8c300", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Chapecoense", "Avaí"],
    "playStyle": "Pressão impulsionada pela torcida carvoeira e criatividade de Bolasie",
    "coachName": "Cláudio Tencati",
    "squad": [
      {"id": "cri_1", "name": "Gustavo", "position": "GOL", "ovr": 76, "age": 31, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5},
      {"id": "cri_2", "name": "Fellipe Mateus", "position": "MEI", "ovr": 77, "age": 33, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5},
      {"id": "cri_3", "name": "Yannick Bolasie", "position": "PE", "ovr": 78, "age": 35, "nationality": "RD Congo", "flag": "🇨🇩", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "Juventude",
    "id": "juventude",
    "name": "EC Juventude",
    "shortName": "Juventude",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Juventude_logo.svg",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Alfredo Jaconi",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 10.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Caxias", "Grêmio", "Internacional"],
    "playStyle": "Futebol combativo sob neblina da serra gaúcha com Nenê orquestrando lances",
    "coachName": "Fábio Matias",
    "squad": [
      {"id": "juv_1", "name": "Gabriel Vasconcelos", "position": "GOL", "ovr": 76, "age": 31, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5},
      {"id": "juv_2", "name": "Nenê", "position": "MEI", "ovr": 77, "age": 43, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.5, "isStar": True},
      {"id": "juv_3", "name": "Gilberto", "position": "CA", "ovr": 76, "age": 35, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2}
    ]
  },
  {
    "key": "Cuiabá",
    "id": "cuiaba",
    "name": "Cuiabá EC",
    "shortName": "Cuiabá",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/4/43/Cuiaba_EC.png",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Arena Pantanal",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 12.0,
    "colors": {"primary": "#00552b", "secondary": "#f0b400", "text": "#ffffff"},
    "rivalClubs": ["Mixto"],
    "playStyle": "Jogo físico resistente ao calor pantaneiro e bolas longas em Isidro Pitta",
    "coachName": "Bernardo Franco",
    "squad": [
      {"id": "cui_1", "name": "Walter", "position": "GOL", "ovr": 78, "age": 36, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0, "isStar": True},
      {"id": "cui_2", "name": "Isidro Pitta", "position": "CA", "ovr": 78, "age": 25, "nationality": "Paraguai", "flag": "🇵🇾", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Atlético Goianiense",
    "id": "atletico_go",
    "name": "Atlético Clube Goianiense",
    "shortName": "Atlético-GO",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1a/AtleticoGoianiense.png",
    "leagueId": "serie_a",
    "league": "Brasileirão Série A",
    "country": "Brasil",
    "stadium": "Antônio Accioly",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 10.0,
    "colors": {"primary": "#cc0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Goiás", "Vila Nova"],
    "playStyle": "Raça no Castelo do Dragão e ataques pelas pontas em velocidade",
    "coachName": "Umberto Louzer",
    "squad": [
      {"id": "atg_1", "name": "Ronaldo", "position": "GOL", "ovr": 77, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.5},
      {"id": "atg_2", "name": "Shaylon", "position": "MEI", "ovr": 78, "age": 27, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 4.0, "isStar": True},
      {"id": "atg_3", "name": "Luiz Fernando", "position": "PE", "ovr": 77, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.0}
    ]
  },

  # ==========================================
  # BRASIL - SÉRIE B (COMPLETANDO OS 20 CLUBES)
  # ==========================================
  {
    "key": "Vila Nova",
    "id": "vila_nova",
    "name": "Vila Nova FC",
    "shortName": "Vila Nova",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Vila_Nova_FC.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Onésio Brasileiro Alvarenga (OBA)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 6.0,
    "colors": {"primary": "#cc0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Goiás", "Atlético-GO"],
    "playStyle": "Pressão feroz no caldeirão do OBA com apoio ensurdecedor da torcida",
    "coachName": "Thiago Carvalho",
    "squad": [
      {"id": "vil_1", "name": "Dênis Júnior", "position": "GOL", "ovr": 75, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2},
      {"id": "vil_2", "name": "Alesson", "position": "PE", "ovr": 76, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Operário Ferroviário",
    "id": "operario",
    "name": "Operário Ferroviário EC",
    "shortName": "Operário-PR",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/8/87/Oper%C3%A1rio_Ferrovi%C3%A1rio_Esporte_Clube.png",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Germano Krüger",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 5.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Coritiba", "Athletico-PR"],
    "playStyle": "Futebol disciplinado e sólido em Ponta Grossa",
    "coachName": "Rafael Guanaes",
    "squad": [
      {"id": "ope_1", "name": "Rafael Santos", "position": "GOL", "ovr": 74, "age": 35, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.5},
      {"id": "ope_2", "name": "Boschilia", "position": "MEI", "ovr": 76, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "Avaí",
    "id": "avai",
    "name": "Avaí FC",
    "shortName": "Avaí",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Avai_FC_%2805-E%29.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Ressacada",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 8.0,
    "colors": {"primary": "#005baa", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Figueirense", "Chapecoense"],
    "playStyle": "Força na Ilha da Magia com cruzamentos e raça azurra",
    "coachName": "Enderson Moreira",
    "squad": [
      {"id": "ava_1", "name": "César Augusto", "position": "GOL", "ovr": 75, "age": 29, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2},
      {"id": "ava_2", "name": "Giovanni", "position": "MEI", "ovr": 76, "age": 30, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Chapecoense",
    "id": "chapecoense",
    "name": "Associação Chapecoense de Futebol",
    "shortName": "Chapecoense",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/0/07/Chapecoense_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Arena Condá",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 6.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Avaí", "Criciúma"],
    "playStyle": "Espirito guerreiro incondicional na Arena Condá e contra-ataques velozes",
    "coachName": "Gilmar Dal Pozzo",
    "squad": [
      {"id": "cha_1", "name": "Léo Vieira", "position": "GOL", "ovr": 75, "age": 34, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.6},
      {"id": "cha_2", "name": "Mário Sérgio", "position": "CA", "ovr": 75, "age": 29, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "CRB",
    "id": "crb",
    "name": "Clube de Regatas Brasil",
    "shortName": "CRB",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/a/ae/CRB_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Rei Pelé (Trapichão)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 6.0,
    "colors": {"primary": "#dc2626", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["CSA"],
    "playStyle": "Calor de Maceió, jogadas aéreas com Anselmo Ramon e valentia alvirrubra",
    "coachName": "Hélio dos Anjos",
    "squad": [
      {"id": "crb_1", "name": "Matheus Albino", "position": "GOL", "ovr": 75, "age": 29, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0},
      {"id": "crb_2", "name": "Gegê", "position": "MEI", "ovr": 76, "age": 30, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5},
      {"id": "crb_3", "name": "Anselmo Ramon", "position": "CA", "ovr": 77, "age": 36, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2, "isStar": True}
    ]
  },
  {
    "key": "Ponte Preta",
    "id": "ponte_preta",
    "name": "Associação Atlética Ponte Preta",
    "shortName": "Ponte Preta",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Ponte_Preta_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Moisés Lucarelli (Majestoso)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 5.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Guarani"],
    "playStyle": "Tradicional raça campineira da Macaca empurrada pelo Majestoso",
    "coachName": "Nelsinho Baptista",
    "squad": [
      {"id": "pon_1", "name": "Pedro Rocha", "position": "GOL", "ovr": 74, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0},
      {"id": "pon_2", "name": "Elvis", "position": "MEI", "ovr": 77, "age": 34, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2, "isStar": True},
      {"id": "pon_3", "name": "Jeh", "position": "CA", "ovr": 75, "age": 24, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.0}
    ]
  },
  {
    "key": "Guarani",
    "id": "guarani",
    "name": "Guarani FC",
    "shortName": "Guarani",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/0/08/Guarani_FC_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Brinco de Ouro da Princesa",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 5.0,
    "colors": {"primary": "#00552b", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Ponte Preta"],
    "playStyle": "Futebol combativo do Bugre com tradição campeã brasileira",
    "coachName": "Allan Aal",
    "squad": [
      {"id": "gua_1", "name": "Pegorari", "position": "GOL", "ovr": 74, "age": 33, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.8},
      {"id": "gua_2", "name": "Caio Dantas", "position": "CA", "ovr": 76, "age": 31, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Paysandu",
    "id": "paysandu",
    "name": "Paysandu SC",
    "shortName": "Paysandu",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c8/Paysandu_Sport_Club_logo.svg",
    "leagueId": "serie_b",
    "league": "Brasileirão Série B",
    "country": "Brasil",
    "stadium": "Curuzu (Vovô da Cidade)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 5.0,
    "colors": {"primary": "#0080ff", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Remo"],
    "playStyle": "Pressão avassaladora do Papão da Curuzu com a massa paraense",
    "coachName": "Márcio Fernandes",
    "squad": [
      {"id": "pay_1", "name": "Diogo Silva", "position": "GOL", "ovr": 75, "age": 38, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.4},
      {"id": "pay_2", "name": "Nicolas", "position": "CA", "ovr": 76, "age": 35, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0, "isStar": True}
    ]
  },

  # ==========================================
  # ESPANHA - LA LIGA EA SPORTS
  # ==========================================
  {
    "key": "Villarreal",
    "id": "villarreal",
    "name": "Villarreal CF",
    "shortName": "Villarreal",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/70/Villarreal_CF_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Estadio de la Cerámica",
    "prestige": 4,
    "formation": "4-4-2",
    "budgetEur": 70.0,
    "colors": {"primary": "#FFE600", "secondary": "#0055A5", "text": "#000000"},
    "rivalClubs": ["Valencia"],
    "playStyle": "Futebol combinativo fluido de Marcelino com transições letais de Ayoze Pérez",
    "coachName": "Marcelino García Toral",
    "squad": [
      {"id": "vil_1", "name": "Diego Conde", "position": "GOL", "ovr": 78, "age": 26, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 8.0},
      {"id": "vil_2", "name": "Raúl Albiol", "position": "ZAG", "ovr": 79, "age": 39, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 2.0},
      {"id": "vil_3", "name": "Dani Parejo", "position": "MC", "ovr": 82, "age": 35, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 4.0},
      {"id": "vil_4", "name": "Álex Baena", "position": "MEI", "ovr": 83, "age": 23, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 50.0, "isStar": True},
      {"id": "vil_5", "name": "Ayoze Pérez", "position": "CA", "ovr": 82, "age": 31, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 15.0, "isStar": True}
    ]
  },
  {
    "key": "Girona",
    "id": "girona",
    "name": "Girona FC",
    "shortName": "Girona",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/79/Girona_FC_Logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Estadi Montilivi",
    "prestige": 4,
    "formation": "4-3-3",
    "budgetEur": 65.0,
    "colors": {"primary": "#CD1426", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Barcelona", "Espanyol"],
    "playStyle": "Futebol total de Míchel com circulação rápida e sobreposições constantes",
    "coachName": "Míchel",
    "squad": [
      {"id": "gir_1", "name": "Paulo Gazzaniga", "position": "GOL", "ovr": 80, "age": 32, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 5.0},
      {"id": "gir_2", "name": "Daley Blind", "position": "ZAG", "ovr": 80, "age": 34, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 3.0},
      {"id": "gir_3", "name": "Yangel Herrera", "position": "MC", "ovr": 81, "age": 26, "nationality": "Venezuela", "flag": "🇻🇪", "marketValueEur": 25.0},
      {"id": "gir_4", "name": "Viktor Tsygankov", "position": "PD", "ovr": 82, "age": 27, "nationality": "Ucrânia", "flag": "🇺🇦", "marketValueEur": 30.0, "isStar": True},
      {"id": "gir_5", "name": "Bojan Miovski", "position": "CA", "ovr": 78, "age": 25, "nationality": "Macedônia do Norte", "flag": "🇲🇰", "marketValueEur": 15.0}
    ]
  },
  {
    "key": "Valencia",
    "id": "valencia",
    "name": "Valencia CF",
    "shortName": "Valencia",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Mestalla",
    "prestige": 4,
    "formation": "4-4-2",
    "budgetEur": 50.0,
    "colors": {"primary": "#000000", "secondary": "#f36c21", "text": "#ffffff"},
    "rivalClubs": ["Villarreal", "Levante", "Real Madrid"],
    "playStyle": "Raça histórica de Mestalla com jovens talentosos e bloco compacto",
    "coachName": "Rubén Baraja",
    "squad": [
      {"id": "val_1", "name": "Giorgi Mamardashvili", "position": "GOL", "ovr": 84, "age": 24, "nationality": "Geórgia", "flag": "🇬🇪", "marketValueEur": 45.0, "isStar": True},
      {"id": "val_2", "name": "Cristhian Mosquera", "position": "ZAG", "ovr": 80, "age": 20, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 30.0, "isStar": True},
      {"id": "val_3", "name": "Pepelu", "position": "VOL", "ovr": 81, "age": 26, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 22.0},
      {"id": "val_4", "name": "Javi Guerra", "position": "MC", "ovr": 80, "age": 21, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 25.0},
      {"id": "val_5", "name": "Hugo Duro", "position": "CA", "ovr": 79, "age": 25, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 16.0}
    ]
  },
  {
    "key": "Celta de Vigo",
    "id": "celta",
    "name": "RC Celta de Vigo",
    "shortName": "Celta Vigo",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Abanca-Balaídos",
    "prestige": 3,
    "formation": "3-4-3",
    "budgetEur": 40.0,
    "colors": {"primary": "#87CEEB", "secondary": "#CC0000", "text": "#000000"},
    "rivalClubs": ["Deportivo La Coruña"],
    "playStyle": "Futebol técnico e ofensivo de Claudio Giráldez liderado pela lenda Iago Aspas",
    "coachName": "Claudio Giráldez",
    "squad": [
      {"id": "cel_1", "name": "Vicente Guaita", "position": "GOL", "ovr": 78, "age": 37, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 1.5},
      {"id": "cel_2", "name": "Óscar Mingueza", "position": "LD", "ovr": 80, "age": 25, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 15.0},
      {"id": "cel_3", "name": "Iago Aspas", "position": "CA", "ovr": 82, "age": 37, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 4.0, "isStar": True},
      {"id": "cel_4", "name": "Borja Iglesias", "position": "CA", "ovr": 78, "age": 31, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 6.0}
    ]
  },
  {
    "key": "Mallorca",
    "id": "mallorca",
    "name": "RCD Mallorca",
    "shortName": "Mallorca",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e0/Rcd_mallorca.svg",
    "leagueId": "la_liga",
    "league": "La Liga EA Sports",
    "country": "Espanha",
    "stadium": "Son Moix",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#E20613", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Espanyol"],
    "playStyle": "Solidez tática nas Ilhas Baleares com velocidade de Muriqi",
    "coachName": "Jagoba Arrasate",
    "squad": [
      {"id": "mal_1", "name": "Dominik Greif", "position": "GOL", "ovr": 77, "age": 27, "nationality": "Eslováquia", "flag": "🇸🇰", "marketValueEur": 4.0},
      {"id": "mal_2", "name": "Antonio Raíllo", "position": "ZAG", "ovr": 79, "age": 33, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 3.0},
      {"id": "mal_3", "name": "Vedat Muriqi", "position": "CA", "ovr": 80, "age": 30, "nationality": "Kosovo", "flag": "🇽🇰", "marketValueEur": 14.0, "isStar": True}
    ]
  },

  # ==========================================
  # ITÁLIA - SERIE A (COMPLETANDO OS 20 CLUBES)
  # ==========================================
  {
    "key": "Fiorentina",
    "id": "fiorentina",
    "name": "ACF Fiorentina",
    "shortName": "Fiorentina",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/79/ACF_Fiorentina_2022.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Artemio Franchi",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 65.0,
    "colors": {"primary": "#4c12a1", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Juventus", "Bologna"],
    "playStyle": "Charme de Florença com posse de bola fluida e gols decisivos de Moise Kean",
    "coachName": "Raffaele Palladino",
    "squad": [
      {"id": "fio_1", "name": "David de Gea", "position": "GOL", "ovr": 82, "age": 34, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 6.0, "isStar": True},
      {"id": "fio_2", "name": "Dodô", "position": "LD", "ovr": 80, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 20.0},
      {"id": "fio_3", "name": "Robin Gosens", "position": "LE", "ovr": 80, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 12.0},
      {"id": "fio_4", "name": "Edoardo Bove", "position": "MC", "ovr": 78, "age": 22, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 15.0},
      {"id": "fio_5", "name": "Moise Kean", "position": "CA", "ovr": 82, "age": 24, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 25.0, "isStar": True}
    ]
  },
  {
    "key": "Bologna",
    "id": "bologna",
    "name": "Bologna FC 1909",
    "shortName": "Bologna",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Bologna_F.C._1909_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Renato Dall'Ara",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 55.0,
    "colors": {"primary": "#1A2F50", "secondary": "#A81E2E", "text": "#ffffff"},
    "rivalClubs": ["Fiorentina", "Juventus"],
    "playStyle": "Futebol dinâmico europeu de Champions League com ritmo acelerado",
    "coachName": "Vincenzo Italiano",
    "squad": [
      {"id": "bol_1", "name": "Łukasz Skorupski", "position": "GOL", "ovr": 80, "age": 33, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 4.0},
      {"id": "bol_2", "name": "Sam Beukema", "position": "ZAG", "ovr": 80, "age": 26, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 20.0},
      {"id": "bol_3", "name": "Remo Freuler", "position": "VOL", "ovr": 80, "age": 32, "nationality": "Suíça", "flag": "🇨🇭", "marketValueEur": 8.0},
      {"id": "bol_4", "name": "Riccardo Orsolini", "position": "PD", "ovr": 81, "age": 27, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 20.0, "isStar": True},
      {"id": "bol_5", "name": "Santiago Castro", "position": "CA", "ovr": 78, "age": 20, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 18.0, "isStar": True}
    ]
  },
  {
    "key": "Torino",
    "id": "torino",
    "name": "Torino FC",
    "shortName": "Torino",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Olimpico Grande Torino",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 45.0,
    "colors": {"primary": "#8B0000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Juventus"],
    "playStyle": "Espírito do Granata: marcação homem a homem feroz e transição veloz",
    "coachName": "Paolo Vanoli",
    "squad": [
      {"id": "tor_1", "name": "Vanja Milinković-Savić", "position": "GOL", "ovr": 80, "age": 27, "nationality": "Sérvia", "flag": "🇷🇸", "marketValueEur": 10.0},
      {"id": "tor_2", "name": "Saúl Coco", "position": "ZAG", "ovr": 79, "age": 25, "nationality": "Guiné Equatorial", "flag": "🇬🇶", "marketValueEur": 15.0},
      {"id": "tor_3", "name": "Samuele Ricci", "position": "MC", "ovr": 81, "age": 23, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 30.0, "isStar": True},
      {"id": "tor_4", "name": "Duván Zapata", "position": "CA", "ovr": 81, "age": 33, "nationality": "Colômbia", "flag": "🇨🇴", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Como",
    "id": "como",
    "name": "Como 1907",
    "shortName": "Como",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Como_1907_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Giuseppe Sinigaglia",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 50.0,
    "colors": {"primary": "#003DA5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Varese", "Monza"],
    "playStyle": "Futebol artístico e moderno de Cesc Fàbregas à beira do Lago de Como",
    "coachName": "Cesc Fàbregas",
    "squad": [
      {"id": "com_1", "name": "Pepe Reina", "position": "GOL", "ovr": 76, "age": 42, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 1.0},
      {"id": "com_2", "name": "Sergi Roberto", "position": "MC", "ovr": 79, "age": 32, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 4.0},
      {"id": "com_3", "name": "Nico Paz", "position": "MEI", "ovr": 80, "age": 20, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 25.0, "isStar": True},
      {"id": "com_4", "name": "Patrick Cutrone", "position": "CA", "ovr": 78, "age": 26, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 8.0}
    ]
  },
  {
    "key": "Parma",
    "id": "parma",
    "name": "Parma Calcio 1913",
    "shortName": "Parma",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/9/98/Parma_Calcio_1913_logo.svg",
    "leagueId": "serie_a_ita",
    "league": "Serie A (Itália)",
    "country": "Itália",
    "stadium": "Stadio Ennio Tardini",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#FFED00", "secondary": "#003F87", "text": "#000000"},
    "rivalClubs": ["Reggiana", "Bologna"],
    "playStyle": "Velocidade vertiginosa pelas pontas com Man e Mihăilă",
    "coachName": "Fabio Pecchia",
    "squad": [
      {"id": "par_1", "name": "Zion Suzuki", "position": "GOL", "ovr": 77, "age": 22, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 9.0},
      {"id": "par_2", "name": "Dennis Man", "position": "PD", "ovr": 80, "age": 26, "nationality": "Romênia", "flag": "🇷🇴", "marketValueEur": 18.0, "isStar": True},
      {"id": "par_3", "name": "Ange-Yoan Bonny", "position": "CA", "ovr": 78, "age": 21, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 15.0}
    ]
  },

  # ==========================================
  # ALEMANHA - BUNDESLIGA
  # ==========================================
  {
    "key": "Stuttgart",
    "id": "stuttgart",
    "name": "VfB Stuttgart",
    "shortName": "Stuttgart",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/VfB_Stuttgart_1893_Logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "MHPArena",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 65.0,
    "colors": {"primary": "#E30613", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Karlsruher SC", "SC Freiburg"],
    "playStyle": "Futebol ofensivo dinâmico e brilhante de Sebastian Hoeneß",
    "coachName": "Sebastian Hoeneß",
    "squad": [
      {"id": "stu_1", "name": "Alexander Nübel", "position": "GOL", "ovr": 81, "age": 28, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 15.0},
      {"id": "stu_2", "name": "Angelo Stiller", "position": "VOL", "ovr": 82, "age": 23, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 30.0, "isStar": True},
      {"id": "stu_3", "name": "Enzo Millot", "position": "MEI", "ovr": 81, "age": 22, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 35.0},
      {"id": "stu_4", "name": "Deniz Undav", "position": "CA", "ovr": 83, "age": 28, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 35.0, "isStar": True},
      {"id": "stu_5", "name": "Ermedin Demirović", "position": "CA", "ovr": 80, "age": 26, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 25.0}
    ]
  },
  {
    "key": "Freiburg",
    "id": "freiburg",
    "name": "SC Freiburg",
    "shortName": "Freiburg",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/de/f/f1/SC-Freiburg_Logo-neu.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Europa-Park Stadion",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 45.0,
    "colors": {"primary": "#000000", "secondary": "#CC0000", "text": "#ffffff"},
    "rivalClubs": ["VfB Stuttgart"],
    "playStyle": "Coesão coletiva perfeita na Floresta Negra e bolas paradas mortais",
    "coachName": "Julian Schuster",
    "squad": [
      {"id": "fre_1", "name": "Noah Atubolu", "position": "GOL", "ovr": 78, "age": 22, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 12.0},
      {"id": "fre_2", "name": "Matthias Ginter", "position": "ZAG", "ovr": 80, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 12.0},
      {"id": "fre_3", "name": "Vincenzo Grifo", "position": "PE", "ovr": 81, "age": 31, "nationality": "Itália", "flag": "🇮🇹", "marketValueEur": 10.0, "isStar": True},
      {"id": "fre_4", "name": "Ritsu Doan", "position": "PD", "ovr": 80, "age": 26, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 18.0, "isStar": True}
    ]
  },
  {
    "key": "Werder Bremen",
    "id": "werder",
    "name": "SV Werder Bremen",
    "shortName": "Werder Bremen",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/b/be/SV-Werder-Bremen-Logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Weserstadion",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 40.0,
    "colors": {"primary": "#1B7C3D", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Hamburger SV"],
    "playStyle": "Tradição do norte alemão com futebol ofensivo apoiado pelo Weserstadion",
    "coachName": "Ole Werner",
    "squad": [
      {"id": "wer_1", "name": "Michael Zetterer", "position": "GOL", "ovr": 78, "age": 29, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 6.0},
      {"id": "wer_2", "name": "Mitchell Weiser", "position": "LD", "ovr": 80, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 8.0},
      {"id": "wer_3", "name": "Romano Schmid", "position": "MEI", "ovr": 79, "age": 24, "nationality": "Áustria", "flag": "🇦🇹", "marketValueEur": 15.0, "isStar": True},
      {"id": "wer_4", "name": "Marvin Ducksch", "position": "CA", "ovr": 80, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 10.0, "isStar": True}
    ]
  },
  {
    "key": "Borussia Mönchengladbach",
    "id": "gladbach",
    "name": "Borussia Mönchengladbach",
    "shortName": "M'gladbach",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_M%C3%B6nchengladbach_logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Borussia-Park",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 45.0,
    "colors": {"primary": "#000000", "secondary": "#1B7C3D", "text": "#ffffff"},
    "rivalClubs": ["1. FC Köln"],
    "playStyle": "Os Potros (Die Fohlen): futebol elétrico e veloz pelos flancos",
    "coachName": "Gerardo Seoane",
    "squad": [
      {"id": "gla_1", "name": "Moritz Nicolas", "position": "GOL", "ovr": 77, "age": 27, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 5.0},
      {"id": "gla_2", "name": "Julian Weigl", "position": "VOL", "ovr": 80, "age": 29, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 8.0},
      {"id": "gla_3", "name": "Alassane Pléa", "position": "CA", "ovr": 80, "age": 31, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 7.0, "isStar": True},
      {"id": "gla_4", "name": "Tim Kleindienst", "position": "CA", "ovr": 80, "age": 29, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 10.0, "isStar": True}
    ]
  },

  # ==========================================
  # FRANÇA - LIGUE 1
  # ==========================================
  {
    "key": "Lille",
    "id": "lille",
    "name": "LOSC Lille",
    "shortName": "Lille",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/LOSC_Lille_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Decathlon Arena Stade Pierre-Mauroy",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 65.0,
    "colors": {"primary": "#D00027", "secondary": "#002D62", "text": "#ffffff"},
    "rivalClubs": ["Lens"],
    "playStyle": "Futebol vistoso de Bruno Génésio com a pontaria letal de Jonathan David",
    "coachName": "Bruno Génésio",
    "squad": [
      {"id": "lil_1", "name": "Lucas Chevalier", "position": "GOL", "ovr": 82, "age": 23, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 25.0, "isStar": True},
      {"id": "lil_2", "name": "Bafodé Diakité", "position": "ZAG", "ovr": 80, "age": 23, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 20.0},
      {"id": "lil_3", "name": "Benjamin André", "position": "VOL", "ovr": 80, "age": 34, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 5.0},
      {"id": "lil_4", "name": "Edon Zhegrova", "position": "PD", "ovr": 82, "age": 25, "nationality": "Kosovo", "flag": "🇽🇰", "marketValueEur": 30.0, "isStar": True},
      {"id": "lil_5", "name": "Jonathan David", "position": "CA", "ovr": 83, "age": 24, "nationality": "Canadá", "flag": "🇨🇦", "marketValueEur": 50.0, "isStar": True}
    ]
  },
  {
    "key": "Rennes",
    "id": "rennes",
    "name": "Stade Rennais FC",
    "shortName": "Rennes",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/9e/Stade_Rennais_FC.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Roazhon Park",
    "prestige": 4,
    "formation": "4-3-3",
    "budgetEur": 60.0,
    "colors": {"primary": "#E2001A", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Nantes"],
    "playStyle": "Fábrica formadora de joias mundiais na Bretanha e jogo de alta rotação",
    "coachName": "Jorge Sampaoli",
    "squad": [
      {"id": "ren_1", "name": "Steve Mandanda", "position": "GOL", "ovr": 78, "age": 39, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 1.0},
      {"id": "ren_2", "name": "Christopher Wooh", "position": "ZAG", "ovr": 78, "age": 23, "nationality": "Camarões", "flag": "🇨🇲", "marketValueEur": 10.0},
      {"id": "ren_3", "name": "Ludovic Blas", "position": "MEI", "ovr": 80, "age": 26, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 15.0, "isStar": True},
      {"id": "ren_4", "name": "Arnaud Kalimuendo", "position": "CA", "ovr": 80, "age": 22, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 22.0, "isStar": True}
    ]
  },
  {
    "key": "Nice",
    "id": "nice",
    "name": "OGC Nice",
    "shortName": "Nice",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2e/OGC_Nice_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Allianz Riviera",
    "prestige": 4,
    "formation": "3-4-2-1",
    "budgetEur": 55.0,
    "colors": {"primary": "#D00027", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Monaco", "Marseille"],
    "playStyle": "Futebol ofensivo dinâmico da Riviera Francesa com Franck Haise",
    "coachName": "Franck Haise",
    "squad": [
      {"id": "nic_1", "name": "Marcin Bułka", "position": "GOL", "ovr": 81, "age": 25, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 20.0, "isStar": True},
      {"id": "nic_2", "name": "Dante", "position": "ZAG", "ovr": 78, "age": 41, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0},
      {"id": "nic_3", "name": "Hicham Boudaoui", "position": "VOL", "ovr": 80, "age": 25, "nationality": "Argélia", "flag": "🇩🇿", "marketValueEur": 15.0},
      {"id": "nic_4", "name": "Evann Guessand", "position": "CA", "ovr": 79, "age": 23, "nationality": "Costa do Marfim", "flag": "🇨🇮", "marketValueEur": 14.0, "isStar": True}
    ]
  },
  {
    "key": "Lens",
    "id": "lens",
    "name": "RC Lens",
    "shortName": "Lens",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/52/RC_Lens_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Bollaert-Delelis",
    "prestige": 4,
    "formation": "3-4-1-2",
    "budgetEur": 50.0,
    "colors": {"primary": "#e41b13", "secondary": "#f4e019", "text": "#ffffff"},
    "rivalClubs": ["Lille"],
    "playStyle": "Atmosfera vulcânica em Bollaert-Delelis e jogo físico intenso",
    "coachName": "Will Still",
    "squad": [
      {"id": "len_1", "name": "Brice Samba", "position": "GOL", "ovr": 81, "age": 30, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 15.0, "isStar": True},
      {"id": "len_2", "name": "Facundo Medina", "position": "ZAG", "ovr": 81, "age": 25, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 25.0},
      {"id": "len_3", "name": "Andy Diouf", "position": "MC", "ovr": 79, "age": 21, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 12.0},
      {"id": "len_4", "name": "M'Bala Nzola", "position": "CA", "ovr": 78, "age": 28, "nationality": "Angola", "flag": "🇦🇴", "marketValueEur": 10.0}
    ]
  }
]

def load_and_append_clubs():
    with open(CLUBS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Move Leicester City to Premier League
    content = content.replace("leagueId: 'championship',", "leagueId: 'premier_league',", 1)
    content = content.replace("league: 'EFL Championship',", "league: 'Premier League',", 1)

    # Identifica o ponto onde RAW_CLUBS fecha
    closing_pattern = r'(\n\}\;\s*\n\/\*\*[\s\S]*?export const CLUBS)'
    match = re.search(closing_pattern, content)
    if not match:
        print("Erro: Nao encontrou o fechamento de RAW_CLUBS!")
        return

    insert_idx = match.start(1)

    # Monta a string TypeScript dos novos clubes
    added_count = 0
    ts_code = "\n"
    for club in CLUBS_DATA:
        # Checa se o clube ja existe no arquivo
        if f"id: '{club['id']}'" in content or f'id: "{club["id"]}"' in content or f"'{club['key']}': {{" in content:
            continue

        added_count += 1
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

    print(f"Sucesso! {added_count} novos clubes adicionados a RAW_CLUBS.")

if __name__ == '__main__':
    load_and_append_clubs()
