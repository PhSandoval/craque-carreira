#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

WORLD_CLUBS = [
  # ==========================================
  # PORTUGAL - LIGA PORTUGAL (COMPLETANDO 18)
  # ==========================================
  {
    "key": "Rio Ave",
    "id": "rio_ave",
    "name": "Rio Ave FC",
    "shortName": "Rio Ave",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e5/Rio_Ave_FC_logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio dos Arcos (Vila do Conde)",
    "prestige": 2,
    "formation": "3-4-3",
    "budgetEur": 15.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Varzim", "Porto"],
    "playStyle": "Futebol marítimo de Vila do Conde com velocidade de Clayton",
    "coachName": "Petit",
    "squad": [
      {"id": "rio_1", "name": "Cezary Miszta", "position": "GOL", "ovr": 74, "age": 23, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 1.5},
      {"id": "rio_2", "name": "Clayton", "position": "CA", "ovr": 76, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Moreirense",
    "id": "moreirense",
    "name": "Moreirense FC",
    "shortName": "Moreirense",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/50/Moreirense_F.C._logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Parque de Jogos Comendador Joaquim de Almeida Freitas",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 14.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Vitória SC"],
    "playStyle": "Coesão e disciplina tática com jogadas de Alan",
    "coachName": "César Peixoto",
    "squad": [
      {"id": "mor_1", "name": "Kewin Silva", "position": "GOL", "ovr": 75, "age": 29, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.0},
      {"id": "mor_2", "name": "Alan", "position": "MEI", "ovr": 77, "age": 24, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Santa Clara",
    "id": "santa_clara",
    "name": "CD Santa Clara",
    "shortName": "Santa Clara",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a2/Clube_Desportivo_Santa_Clara.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio de São Miguel (Ponta Delgada)",
    "prestige": 2,
    "formation": "3-4-3",
    "budgetEur": 14.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Marítimo"],
    "playStyle": "Orgulho açoriano invicto nas ilhas com futebol aguerrido de Vasco Matos",
    "coachName": "Vasco Matos",
    "squad": [
      {"id": "scl_1", "name": "Gabriel Batista", "position": "GOL", "ovr": 76, "age": 26, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.5},
      {"id": "scl_2", "name": "Vinícius Lopes", "position": "PE", "ovr": 76, "age": 25, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Estoril Praia",
    "id": "estoril",
    "name": "GD Estoril Praia",
    "shortName": "Estoril",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/G.D._Estoril_Praia_logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio António Coimbra da Mota",
    "prestige": 2,
    "formation": "3-4-3",
    "budgetEur": 15.0,
    "colors": {"primary": "#FFED00", "secondary": "#0055A5", "text": "#000000"},
    "rivalClubs": ["Belenenses", "Casa Pia"],
    "playStyle": "Futebol praiano veloz e criativo em Cascais",
    "coachName": "Ian Cathro",
    "squad": [
      {"id": "est_1", "name": "Joel Robles", "position": "GOL", "ovr": 76, "age": 34, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 1.0},
      {"id": "est_2", "name": "Alejandro Marqués", "position": "CA", "ovr": 76, "age": 24, "nationality": "Venezuela", "flag": "🇻🇪", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Arouca",
    "id": "arouca",
    "name": "FC Arouca",
    "shortName": "Arouca",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/b/b4/Futebol_Clube_de_Arouca.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio Municipal de Arouca",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 12.0,
    "colors": {"primary": "#FFED00", "secondary": "#0055A5", "text": "#000000"},
    "rivalClubs": ["Feirense"],
    "playStyle": "Futebol espanholizado na serra com toques rápidos e gols de Jason",
    "coachName": "Vasco Seabra",
    "squad": [
      {"id": "aro_1", "name": "Nico Mantl", "position": "GOL", "ovr": 75, "age": 24, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 2.0},
      {"id": "aro_2", "name": "Jason", "position": "PD", "ovr": 77, "age": 30, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Nacional da Madeira",
    "id": "nacional_mad",
    "name": "CD Nacional (Madeira)",
    "shortName": "Nacional",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f6/CD_Nacional_logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio da Madeira (Choupana)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 12.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Marítimo"],
    "playStyle": "O clube onde Cristiano Ronaldo começou: névoa da Choupana e entrega física",
    "coachName": "Tiago Margarido",
    "squad": [
      {"id": "nac_1", "name": "Lucas França", "position": "GOL", "ovr": 74, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.2},
      {"id": "nac_2", "name": "Nigel Thomas", "position": "PD", "ovr": 75, "age": 23, "nationality": "Curaçau", "flag": "🇨🇼", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "Farense",
    "id": "farense",
    "name": "SC Farense",
    "shortName": "Farense",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a9/SC_Farense_logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio de São Luís (Faro)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 12.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Olhanense", "Portimonense"],
    "playStyle": "Os Leões de Faro: calor do Algarve e transições rápidas",
    "coachName": "Tozé Marreco",
    "squad": [
      {"id": "far_1", "name": "Ricardo Velho", "position": "GOL", "ovr": 77, "age": 26, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 4.0, "isStar": True},
      {"id": "far_2", "name": "Elves Baldé", "position": "PE", "ovr": 75, "age": 25, "nationality": "Guiné-Bissau", "flag": "🇬🇼", "marketValueEur": 2.0}
    ]
  },
  {
    "key": "AVS SAD",
    "id": "avs_sad",
    "name": "AVS Futebol SAD",
    "shortName": "AVS SAD",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/2/23/AVS_Futebol_SAD.png",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio do CD das Aves (Vila das Aves)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 14.0,
    "colors": {"primary": "#cc0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Tirsense"],
    "playStyle": "Futebol ofensivo experiente com lendas do futebol como Guillermo Ochoa",
    "coachName": "Daniel Ramos",
    "squad": [
      {"id": "avs_1", "name": "Guillermo Ochoa", "position": "GOL", "ovr": 78, "age": 39, "nationality": "México", "flag": "🇲🇽", "marketValueEur": 1.5, "isStar": True},
      {"id": "avs_2", "name": "Rodrigo Ribeiro", "position": "CA", "ovr": 75, "age": 19, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 3.5}
    ]
  },
  {
    "key": "Estrela da Amadora",
    "id": "estrela_amadora",
    "name": "CF Estrela da Amadora",
    "shortName": "E. Amadora",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/pt/4/4b/CF_Estrela_da_Amadora_logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio José Gomes (Reboleira)",
    "prestige": 2,
    "formation": "3-4-3",
    "budgetEur": 12.0,
    "colors": {"primary": "#cc0000", "secondary": "#008000", "text": "#ffffff"},
    "rivalClubs": ["Benfica", "Sporting CP"],
    "playStyle": "A força tricolor da Reboleira com experiência e velocidade de Nani",
    "coachName": "José Faria",
    "squad": [
      {"id": "est_a1", "name": "Bruno Brígido", "position": "GOL", "ovr": 75, "age": 33, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0},
      {"id": "est_a2", "name": "Nani", "position": "PE", "ovr": 78, "age": 37, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Casa Pia",
    "id": "casa_pia",
    "name": "Casa Pia AC",
    "shortName": "Casa Pia",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/91/Casa_Pia_A.C._logo.svg",
    "leagueId": "primeira_liga",
    "league": "Liga Portugal",
    "country": "Portugal",
    "stadium": "Estádio Municipal de Rio Maior",
    "prestige": 2,
    "formation": "3-4-3",
    "budgetEur": 12.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Belenenses"],
    "playStyle": "Gansos de Lisboa: disciplina tática ferrenha de João Pereira",
    "coachName": "João Pereira",
    "squad": [
      {"id": "cas_1", "name": "Patrick Sequeira", "position": "GOL", "ovr": 75, "age": 25, "nationality": "Costa Rica", "flag": "🇨🇷", "marketValueEur": 1.8},
      {"id": "cas_2", "name": "Cassiano", "position": "CA", "ovr": 75, "age": 35, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 0.8, "isStar": True}
    ]
  },

  # ==========================================
  # HOLANDA - EREDIVISIE (COMPLETANDO 18)
  # ==========================================
  {
    "key": "Heerenveen",
    "id": "heerenveen",
    "name": "sc Heerenveen",
    "shortName": "Heerenveen",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/23/SC_Heerenveen_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Abe Lenstra Stadion",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#003399", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Groningen", "Cambuur"],
    "playStyle": "Futebol frisio ofensivo do lendário Robin van Persie com jovens talentos",
    "coachName": "Robin van Persie",
    "squad": [
      {"id": "hee_1", "name": "Andries Noppert", "position": "GOL", "ovr": 77, "age": 30, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 3.0, "isStar": True},
      {"id": "hee_2", "name": "Jacob Trenskow", "position": "PD", "ovr": 76, "age": 23, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 4.0}
    ]
  },
  {
    "key": "Go Ahead Eagles",
    "id": "go_ahead",
    "name": "Go Ahead Eagles",
    "shortName": "GA Eagles",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/52/Go_Ahead_Eagles_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "De Adelaarshorst (Deventer)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFED00", "text": "#ffffff"},
    "rivalClubs": ["PEC Zwolle"],
    "playStyle": "As Águias em De Adelaarshorst com futebol vertical elétrico",
    "coachName": "Paul Simonis",
    "squad": [
      {"id": "gae_1", "name": "Luca Plogmann", "position": "GOL", "ovr": 75, "age": 24, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 2.0},
      {"id": "gae_2", "name": "Oliver Edvardsen", "position": "PE", "ovr": 76, "age": 25, "nationality": "Noruega", "flag": "🇳🇴", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "NEC Nijmegen",
    "id": "nec",
    "name": "NEC Nijmegen",
    "shortName": "NEC",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a2/NEC_Nijmegen_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Goffertstadion",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#008000", "text": "#ffffff"},
    "rivalClubs": ["Vitesse"],
    "playStyle": "Futebol técnico e rápido com o maestro japonês Koki Ogawa",
    "coachName": "Rogier Meijer",
    "squad": [
      {"id": "nec_1", "name": "Robin Roefs", "position": "GOL", "ovr": 74, "age": 21, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 2.0},
      {"id": "nec_2", "name": "Koki Ogawa", "position": "CA", "ovr": 76, "age": 27, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Groningen",
    "id": "groningen",
    "name": "FC Groningen",
    "shortName": "Groningen",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/52/FC_Groningen_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Euroborg",
    "prestige": 3,
    "formation": "4-4-2",
    "budgetEur": 20.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Heerenveen"],
    "playStyle": "O Orgulho do Norte: tradição na Euroborg com jovens promissores",
    "coachName": "Dick Lukkien",
    "squad": [
      {"id": "gro_1", "name": "Etienne Vaessen", "position": "GOL", "ovr": 76, "age": 29, "nationality": "Suriname", "flag": "🇸🇷", "marketValueEur": 2.5},
      {"id": "gro_2", "name": "Jorg Schreuders", "position": "MEI", "ovr": 76, "age": 20, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 4.0, "isStar": True}
    ]
  },

  # ==========================================
  # TURQUIA - SÜPER LIG (COMPLETANDO 19)
  # ==========================================
  {
    "key": "Eyüpspor",
    "id": "eyupspor",
    "name": "Eyüpspor Club",
    "shortName": "Eyüpspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e6/Ey%C3%BCpspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Recep Tayyip Erdoğan Stadyumu",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#4B0082", "secondary": "#FFD700", "text": "#ffffff"},
    "rivalClubs": ["Kasımpaşa", "Fatih Karagümrük"],
    "playStyle": "A sensação de Arda Turan na elite com posse e liderança",
    "coachName": "Arda Turan",
    "squad": [
      {"id": "eyu_1", "name": "Berke Özer", "position": "GOL", "ovr": 76, "age": 24, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 3.5},
      {"id": "eyu_2", "name": "Mame Thiam", "position": "CA", "ovr": 78, "age": 32, "nationality": "Senegal", "flag": "🇸🇳", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Göztepe",
    "id": "goztepe",
    "name": "Göztepe SK",
    "shortName": "Göztepe",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/G%C3%B6ztepe_S.K._logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Gürsel Aksel Stadyumu (İzmir)",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 22.0,
    "colors": {"primary": "#FFED00", "secondary": "#CC0000", "text": "#000000"},
    "rivalClubs": ["Karşıyaka"],
    "playStyle": "Torcida mais apaixonada do Mar Egeu em İzmir com ritmo intenso de Stanimir Stoilov",
    "coachName": "Stanimir Stoilov",
    "squad": [
      {"id": "goz_1", "name": "Mateusz Lis", "position": "GOL", "ovr": 76, "age": 27, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 2.0},
      {"id": "goz_2", "name": "Rômulo", "position": "CA", "ovr": 77, "age": 22, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 4.5, "isStar": True}
    ]
  },
  {
    "key": "Antalyaspor",
    "id": "antalyaspor",
    "name": "Antalyaspor Club",
    "shortName": "Antalyaspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/ad/Antalyaspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Corendon Airlines Park (Antalya)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Alanyaspor"],
    "playStyle": "Futebol litorâneo mediterrâneo sob Alex de Souza",
    "coachName": "Alex de Souza",
    "squad": [
      {"id": "ant_1", "name": "Kenan Pirić", "position": "GOL", "ovr": 75, "age": 30, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 1.5},
      {"id": "ant_2", "name": "Sam Larsson", "position": "PE", "ovr": 77, "age": 31, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 2.5, "isStar": True}
    ]
  },

  # ==========================================
  # BÉLGICA - PRO LEAGUE (COMPLETANDO)
  # ==========================================
  {
    "key": "Gent",
    "id": "gent",
    "name": "KAA Gent",
    "shortName": "Gent",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f4/KAA_Gent_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Pro League",
    "country": "Bélgica",
    "stadium": "Planet Group Arena (Ghelamco)",
    "prestige": 3,
    "formation": "3-4-1-2",
    "budgetEur": 35.0,
    "colors": {"primary": "#0055A5", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Club Brugge"],
    "playStyle": "Os Búfalos: posse de bola refinada sob Wouter Vrancken",
    "coachName": "Wouter Vrancken",
    "squad": [
      {"id": "gnt_1", "name": "Davy Roef", "position": "GOL", "ovr": 77, "age": 30, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 2.5},
      {"id": "gnt_2", "name": "Omri Gandelman", "position": "MC", "ovr": 78, "age": 24, "nationality": "Israel", "flag": "🇮🇱", "marketValueEur": 5.5, "isStar": True}
    ]
  },
  {
    "key": "Royal Antwerp",
    "id": "antwerp",
    "name": "Royal Antwerp FC",
    "shortName": "Antwerp",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Royal_Antwerp_FC_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Pro League",
    "country": "Bélgica",
    "stadium": "Bosuilstadion",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 40.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Beerschot", "Club Brugge"],
    "playStyle": "O mais antigo clube da Bélgica: fúria no Bosuilstadion e faro de gol de Janssen",
    "coachName": "Jonas De Roeck",
    "squad": [
      {"id": "ant_w1", "name": "Senne Lammens", "position": "GOL", "ovr": 76, "age": 22, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 3.0},
      {"id": "ant_w2", "name": "Toby Alderweireld", "position": "ZAG", "ovr": 81, "age": 35, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 3.0, "isStar": True},
      {"id": "ant_w3", "name": "Vincent Janssen", "position": "CA", "ovr": 80, "age": 30, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Standard Liège",
    "id": "standard_liege",
    "name": "Standard de Liège",
    "shortName": "Standard",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/4b/Standard_Li%C3%A8ge_logo.svg",
    "leagueId": "pro_league_bel",
    "league": "Pro League",
    "country": "Bélgica",
    "stadium": "Stade Maurice Dufrasne (Sclessin)",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 25.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Anderlecht", "Sporting Charleroi"],
    "playStyle": "O Inferno de Sclessin: torcida inflamada da Valônia e raça pura",
    "coachName": "Ivan Leko",
    "squad": [
      {"id": "sta_1", "name": "Matthieu Epolo", "position": "GOL", "ovr": 75, "age": 19, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 3.0},
      {"id": "sta_2", "name": "Arnaud Bodart", "position": "GOL", "ovr": 77, "age": 26, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 4.0, "isStar": True}
    ]
  },

  # ==========================================
  # ARÁBIA SAUDITA - SAUDI PRO LEAGUE (COMPLETANDO)
  # ==========================================
  {
    "key": "Al-Taawoun",
    "id": "al_taawoun",
    "name": "Al-Taawoun FC",
    "shortName": "Al-Taawoun",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/87/Al-Taawoun_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "King Abdullah Sport City Stadium (Buraidah)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 40.0,
    "colors": {"primary": "#FFD700", "secondary": "#000080", "text": "#000000"},
    "rivalClubs": ["Al-Raed"],
    "playStyle": "Os Lobos de Buraidah com o goleiro brasileiro Mailson intransponível",
    "coachName": "Rodolfo Arruabarrena",
    "squad": [
      {"id": "taa_1", "name": "Mailson", "position": "GOL", "ovr": 79, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 3.5, "isStar": True},
      {"id": "taa_2", "name": "Musa Barrow", "position": "PE", "ovr": 80, "age": 25, "nationality": "Gâmbia", "flag": "🇬🇲", "marketValueEur": 8.0, "isStar": True}
    ]
  },
  {
    "key": "Al-Qadsiah",
    "id": "al_qadsiah",
    "name": "Al-Qadsiah FC",
    "shortName": "Al-Qadsiah",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/8a/Al-Qadsiah_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Prince Saud bin Jalawi Stadium (Khobar)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 75.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFD700", "text": "#ffffff"},
    "rivalClubs": ["Al-Ettifaq"],
    "playStyle": "O novo gigante saudita com Nacho Fernández na zaga e Pierre-Emerick Aubameyang no ataque",
    "coachName": "Míchel González",
    "squad": [
      {"id": "qad_1", "name": "Koen Casteels", "position": "GOL", "ovr": 81, "age": 32, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 6.0},
      {"id": "qad_2", "name": "Nacho Fernández", "position": "ZAG", "ovr": 82, "age": 34, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 3.0, "isStar": True},
      {"id": "qad_3", "name": "Ezequiel Fernández", "position": "VOL", "ovr": 80, "age": 22, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 15.0},
      {"id": "qad_4", "name": "Pierre-Emerick Aubameyang", "position": "CA", "ovr": 82, "age": 35, "nationality": "Gabão", "flag": "🇬🇦", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Al-Fateh",
    "id": "al_fateh",
    "name": "Al-Fateh SC",
    "shortName": "Al-Fateh",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/4e/Al-Fateh_SC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Al-Fateh Club Stadium (Al-Hasa)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#0033A0", "secondary": "#008000", "text": "#ffffff"},
    "rivalClubs": ["Al-Ettifaq"],
    "playStyle": "Futebol veloz com a experiência e bolas paradas de Lucas Zelarayán",
    "coachName": "Jens Gustafsson",
    "squad": [
      {"id": "fat_1", "name": "Péter Szappanos", "position": "GOL", "ovr": 75, "age": 34, "nationality": "Hungria", "flag": "🇭🇺", "marketValueEur": 1.2},
      {"id": "fat_2", "name": "Lucas Zelarayán", "position": "MEI", "ovr": 81, "age": 32, "nationality": "Armênia", "flag": "🇦🇲", "marketValueEur": 5.0, "isStar": True}
    ]
  },

  # ==========================================
  # ARGENTINA - LIGA PROFESIONAL (TOP GIGANTES)
  # ==========================================
  {
    "key": "Racing Club",
    "id": "racing_arg",
    "name": "Racing Club de Avellaneda",
    "shortName": "Racing",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/56/Escudo_de_Racing_Club_%282014%29.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Cilindro de Avellaneda (Presidente Perón)",
    "prestige": 4,
    "formation": "3-4-1-2",
    "budgetEur": 25.0,
    "colors": {"primary": "#87CEEB", "secondary": "#ffffff", "text": "#000000"},
    "rivalClubs": ["Independiente", "River Plate", "Boca Juniors"],
    "playStyle": "A Academia: intensidade vulcânica no Cilindro com o faro de Adrián Martínez",
    "coachName": "Gustavo Costas",
    "squad": [
      {"id": "rac_1", "name": "Gabriel Arias", "position": "GOL", "ovr": 79, "age": 37, "nationality": "Chile", "flag": "🇨🇱", "marketValueEur": 1.5},
      {"id": "rac_2", "name": "Juan Fernando Quintero", "position": "MEI", "ovr": 82, "age": 31, "nationality": "Colômbia", "flag": "🇨🇴", "marketValueEur": 2.5, "isStar": True},
      {"id": "rac_3", "name": "Adrián Martínez", "position": "CA", "ovr": 80, "age": 32, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "Independiente",
    "id": "independiente",
    "name": "CA Independiente",
    "shortName": "Independiente",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Escudo_del_Club_Atl%C3%A9tico_Independiente.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Libertadores de América - Ricardo Enrique Bochini",
    "prestige": 4,
    "formation": "4-3-3",
    "budgetEur": 20.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Racing", "Boca Juniors"],
    "playStyle": "Rey de Copas: tradição gigante em Avellaneda sob Julio Vaccari",
    "coachName": "Julio Vaccari",
    "squad": [
      {"id": "ind_1", "name": "Rodrigo Rey", "position": "GOL", "ovr": 78, "age": 33, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.8},
      {"id": "ind_2", "name": "Felipe Loyola", "position": "MC", "ovr": 78, "age": 24, "nationality": "Chile", "flag": "🇨🇱", "marketValueEur": 3.5, "isStar": True},
      {"id": "ind_3", "name": "Gabriel Ávalos", "position": "CA", "ovr": 77, "age": 34, "nationality": "Paraguai", "flag": "🇵🇾", "marketValueEur": 1.5}
    ]
  },
  {
    "key": "San Lorenzo",
    "id": "san_lorenzo",
    "name": "CA San Lorenzo de Almagro",
    "shortName": "San Lorenzo",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/77/Escudo_del_Club_Atl%C3%A9tico_San_Lorenzo_de_Almagro.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Pedro Bidegain (Nuevo Gasómetro)",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#002B49", "secondary": "#A81E2E", "text": "#ffffff"},
    "rivalClubs": ["Huracán", "Boca Juniors"],
    "playStyle": "Los Cuervos de Boedo: raça argentina e liderança sob Miguel Ángel Russo com Iker Muniain",
    "coachName": "Miguel Ángel Russo",
    "squad": [
      {"id": "slo_1", "name": "Gastón Gómez", "position": "GOL", "ovr": 76, "age": 28, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5},
      {"id": "slo_2", "name": "Iker Muniain", "position": "MEI", "ovr": 80, "age": 31, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 4.5, "isStar": True}
    ]
  },
  {
    "key": "Vélez Sarsfield",
    "id": "velez",
    "name": "CA Vélez Sarsfield",
    "shortName": "Vélez",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Escudo_del_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "José Amalfitani (El Fortín)",
    "prestige": 4,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#003F87", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Ferro Carril Oeste", "San Lorenzo"],
    "playStyle": "El Fortín: futebol avassalador de Gustavo Quinteros liderando a Argentina",
    "coachName": "Gustavo Quinteros",
    "squad": [
      {"id": "vel_1", "name": "Tomás Marchiori", "position": "GOL", "ovr": 78, "age": 29, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5},
      {"id": "vel_2", "name": "Claudio Aquino", "position": "MEI", "ovr": 80, "age": 33, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5, "isStar": True},
      {"id": "vel_3", "name": "Braian Romero", "position": "CA", "ovr": 79, "age": 33, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "Estudiantes",
    "id": "estudiantes",
    "name": "Estudiantes de La Plata",
    "shortName": "Estudiantes",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/4/47/Escudo_de_Estudiantes_de_La_Plata.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Jorge Luis Hirschi (UNO)",
    "prestige": 4,
    "formation": "4-3-3",
    "budgetEur": 22.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Gimnasia La Plata"],
    "playStyle": "Escola de La Plata: garra infinita, disciplina de ferro de Eduardo Domínguez e paixão no estádio UNO",
    "coachName": "Eduardo Domínguez",
    "squad": [
      {"id": "elp_1", "name": "Matías Mansilla", "position": "GOL", "ovr": 77, "age": 28, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5},
      {"id": "elp_2", "name": "Enzo Pérez", "position": "VOL", "ovr": 79, "age": 38, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.0, "isStar": True},
      {"id": "elp_3", "name": "Guido Carrillo", "position": "CA", "ovr": 78, "age": 33, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5, "isStar": True}
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

    for club in WORLD_CLUBS:
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

    print(f"Sucesso! {added} clubes mundiais adicionados.")

if __name__ == '__main__':
    run()
