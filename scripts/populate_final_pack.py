#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

FINAL_CLUBS = [
  # ==========================================
  # INGLATERRA - EFL CHAMPIONSHIP (COMPLETANDO 24)
  # ==========================================
  {
    "key": "Bristol City",
    "id": "bristol_city",
    "name": "Bristol City FC",
    "shortName": "Bristol City",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Ashton Gate Stadium",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#E03A3E", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Bristol Rovers", "Cardiff City"],
    "playStyle": "Futebol veloz no sudoeste inglês de Liam Manning",
    "coachName": "Liam Manning",
    "squad": [
      {"id": "bri_1", "name": "Max O'Leary", "position": "GOL", "ovr": 75, "age": 28, "nationality": "Irlanda", "flag": "🇮🇪", "marketValueEur": 2.0},
      {"id": "bri_2", "name": "Anis Mehmeti", "position": "PE", "ovr": 76, "age": 23, "nationality": "Albânia", "flag": "🇦🇱", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "Preston North End",
    "id": "preston",
    "name": "Preston North End FC",
    "shortName": "Preston",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/82/Preston_North_End_FC.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Deepdale",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 20.0,
    "colors": {"primary": "#FFFFFF", "secondary": "#002B49", "text": "#000000"},
    "rivalClubs": ["Blackpool", "Blackburn Rovers"],
    "playStyle": "O primeiro campeão inglês da história em Deepdale sob Paul Heckingbottom",
    "coachName": "Paul Heckingbottom",
    "squad": [
      {"id": "pne_1", "name": "Freddie Woodman", "position": "GOL", "ovr": 76, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 3.0},
      {"id": "pne_2", "name": "Sam Greenwood", "position": "MEI", "ovr": 75, "age": 22, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "Sheffield Wednesday",
    "id": "sheff_wed",
    "name": "Sheffield Wednesday FC",
    "shortName": "Sheff Wed",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/88/Sheffield_Wednesday_crest.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Hillsborough Stadium",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 24.0,
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Sheffield United", "Leeds United"],
    "playStyle": "As Corujas de Hillsborough com futebol dinâmico de Danny Röhl",
    "coachName": "Danny Röhl",
    "squad": [
      {"id": "shw_1", "name": "James Beadle", "position": "GOL", "ovr": 75, "age": 20, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 3.0},
      {"id": "shw_2", "name": "Josh Windass", "position": "MEI", "ovr": 76, "age": 30, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Plymouth Argyle",
    "id": "plymouth",
    "name": "Plymouth Argyle FC",
    "shortName": "Plymouth",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a8/Plymouth_Argyle_FC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Home Park",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#00552b", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Exeter City"],
    "playStyle": "Os Peregrinos com Wayne Rooney e talento de Morgan Whittaker",
    "coachName": "Wayne Rooney",
    "squad": [
      {"id": "ply_1", "name": "Daniel Grimshaw", "position": "GOL", "ovr": 74, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.5},
      {"id": "ply_2", "name": "Morgan Whittaker", "position": "PD", "ovr": 77, "age": 23, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 9.0, "isStar": True}
    ]
  },
  {
    "key": "Oxford United",
    "id": "oxford_utd",
    "name": "Oxford United FC",
    "shortName": "Oxford Utd",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c3/Oxford_United_FC_logo.svg",
    "leagueId": "championship",
    "league": "EFL Championship",
    "country": "Inglaterra",
    "stadium": "Kassam Stadium",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {"primary": "#FFED00", "secondary": "#002B49", "text": "#000000"},
    "rivalClubs": ["Swindon Town"],
    "playStyle": "Futebol corajoso dos Amarelos na volta à Championship",
    "coachName": "Des Buckingham",
    "squad": [
      {"id": "oxf_1", "name": "Jamie Cumming", "position": "GOL", "ovr": 74, "age": 25, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.5},
      {"id": "oxf_2", "name": "Mark Harris", "position": "CA", "ovr": 75, "age": 25, "nationality": "País de Gales", "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "marketValueEur": 2.5, "isStar": True}
    ]
  },

  # ==========================================
  # HOLANDA - EREDIVISIE (COMPLETANDO)
  # ==========================================
  {
    "key": "Sparta Rotterdam",
    "id": "sparta_rotterdam",
    "name": "Sparta Rotterdam",
    "shortName": "Sparta",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/96/Sparta_Rotterdam_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Het Kasteel",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 16.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Feyenoord", "Excelsior"],
    "playStyle": "O clube mais antigo do futebol profissional holandês no Het Kasteel",
    "coachName": "Maurice Steijn",
    "squad": [
      {"id": "spa_1", "name": "Nick Olij", "position": "GOL", "ovr": 77, "age": 29, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 3.0, "isStar": True},
      {"id": "spa_2", "name": "Tobias Lauritsen", "position": "CA", "ovr": 76, "age": 27, "nationality": "Noruega", "flag": "🇳🇴", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Fortuna Sittard",
    "id": "fortuna_sittard",
    "name": "Fortuna Sittard",
    "shortName": "Fortuna",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/Fortuna_Sittard_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Fortuna Sittard Stadion",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 15.0,
    "colors": {"primary": "#008000", "secondary": "#FFED00", "text": "#ffffff"},
    "rivalClubs": ["Roda JC", "MVV"],
    "playStyle": "Futebol tático de Limburgo sob Danny Buijs com Alen Halilović brilhando",
    "coachName": "Danny Buijs",
    "squad": [
      {"id": "for_1", "name": "Mattijs Branderhorst", "position": "GOL", "ovr": 75, "age": 30, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 1.2},
      {"id": "for_2", "name": "Alen Halilović", "position": "MEI", "ovr": 78, "age": 28, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "PEC Zwolle",
    "id": "pec_zwolle",
    "name": "PEC Zwolle",
    "shortName": "PEC Zwolle",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/f/f6/PEC_Zwolle_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "MAC³PARK Stadion",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 15.0,
    "colors": {"primary": "#0055A5", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Go Ahead Eagles"],
    "playStyle": "Derbi do rio IJssel com toque de bola dinâmico",
    "coachName": "Johnny Jansen",
    "squad": [
      {"id": "pec_1", "name": "Jasper Schendelaar", "position": "GOL", "ovr": 75, "age": 24, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 2.0},
      {"id": "pec_2", "name": "Dylan Vente", "position": "CA", "ovr": 76, "age": 25, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "NAC Breda",
    "id": "nac_breda",
    "name": "NAC Breda",
    "shortName": "NAC Breda",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/9a/NAC_Breda_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Rat Verlegh Stadion",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 15.0,
    "colors": {"primary": "#FFED00", "secondary": "#000000", "text": "#000000"},
    "rivalClubs": ["Willem II"],
    "playStyle": "A mística da 'Avondje NAC' sob os refletores de Breda",
    "coachName": "Carl Hoefkens",
    "squad": [
      {"id": "nac_b1", "name": "Daniel Bielica", "position": "GOL", "ovr": 74, "age": 25, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 1.5},
      {"id": "nac_b2", "name": "Dominik Janošek", "position": "MEI", "ovr": 76, "age": 26, "nationality": "República Tcheca", "flag": "🇨🇿", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Heracles Almelo",
    "id": "heracles",
    "name": "Heracles Almelo",
    "shortName": "Heracles",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Heracles_Almelo_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Asito Stadion",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 14.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["FC Twente"],
    "playStyle": "Futebol disciplinado em Twente com grama veloz",
    "coachName": "Erwin van de Looi",
    "squad": [
      {"id": "her_1", "name": "Fabian de Keijzer", "position": "GOL", "ovr": 74, "age": 24, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 1.2},
      {"id": "her_2", "name": "Luka Kulenović", "position": "CA", "ovr": 75, "age": 25, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "RKC Waalwijk",
    "id": "rkc_waalwijk",
    "name": "RKC Waalwijk",
    "shortName": "RKC",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/87/RKC_Waalwijk_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Mandemakers Stadion",
    "prestige": 1,
    "formation": "4-3-3",
    "budgetEur": 12.0,
    "colors": {"primary": "#FFED00", "secondary": "#0055A5", "text": "#000000"},
    "rivalClubs": ["Willem II"],
    "playStyle": "Futebol combativo de Brabante buscando superação",
    "coachName": "Henk Fraser",
    "squad": [
      {"id": "rkc_1", "name": "Jeroen Houwen", "position": "GOL", "ovr": 73, "age": 28, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 0.8},
      {"id": "rkc_2", "name": "Michiel Kramer", "position": "CA", "ovr": 74, "age": 36, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 0.5, "isStar": True}
    ]
  },
  {
    "key": "Almere City",
    "id": "almere_city",
    "name": "Almere City FC",
    "shortName": "Almere City",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Almere_City_FC_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Yanmar Stadion",
    "prestige": 1,
    "formation": "4-2-3-1",
    "budgetEur": 12.0,
    "colors": {"primary": "#CC0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Ajax"],
    "playStyle": "O caçula da Eredivisie com energia pura em Flevoland",
    "coachName": "Hedwiges Maduro",
    "squad": [
      {"id": "alm_1", "name": "Nordin Bakker", "position": "GOL", "ovr": 74, "age": 27, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 1.2},
      {"id": "alm_2", "name": "Thomas Robinet", "position": "CA", "ovr": 75, "age": 28, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 1.8, "isStar": True}
    ]
  },

  # ==========================================
  # TURQUIA - SÜPER LIG (COMPLETANDO)
  # ==========================================
  {
    "key": "Kasımpaşa",
    "id": "kasimpasa",
    "name": "Kasımpaşa SK",
    "shortName": "Kasımpaşa",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/4/4c/Kas%C4%B1mpa%C5%9Fa_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Recep Tayyip Erdoğan Stadyumu (Istambul)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#002B49", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Eyüpspor", "Fatih Karagümrük"],
    "playStyle": "Futebol ofensivo do Bósforo com Haris Hajradinović desfilando",
    "coachName": "Sami Uğurlu",
    "squad": [
      {"id": "kas_1", "name": "Andreas Gianniotis", "position": "GOL", "ovr": 76, "age": 31, "nationality": "Grécia", "flag": "🇬🇷", "marketValueEur": 1.8},
      {"id": "kas_2", "name": "Haris Hajradinović", "position": "MEI", "ovr": 78, "age": 30, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Sivasspor",
    "id": "sivasspor",
    "name": "Sivasspor Kulübü",
    "shortName": "Sivasspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/3/30/Sivasspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Yeni 4 Eylül Stadyumu (Sivas)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Kayserispor"],
    "playStyle": "Frio implacável da Anatólia Central e contra-ataques cirúrgicos de Rey Manaj",
    "coachName": "Bülent Uygun",
    "squad": [
      {"id": "siv_1", "name": "Ali Şaşal Vural", "position": "GOL", "ovr": 75, "age": 34, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 0.8},
      {"id": "siv_2", "name": "Rey Manaj", "position": "CA", "ovr": 79, "age": 27, "nationality": "Albânia", "flag": "🇦🇱", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Alanyaspor",
    "id": "alanyaspor",
    "name": "Alanyaspor Kulübü",
    "shortName": "Alanyaspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/26/Alanyaspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Gain Park Stadyumu (Alanya)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#F78F1E", "secondary": "#008000", "text": "#ffffff"},
    "rivalClubs": ["Antalyaspor"],
    "playStyle": "Futebol envolvente na Riviera Turca sob Fatih Tekke",
    "coachName": "Fatih Tekke",
    "squad": [
      {"id": "ala_y1", "name": "Ertuğrul Taşkıran", "position": "GOL", "ovr": 75, "age": 35, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 0.8},
      {"id": "ala_y2", "name": "Efecan Karaca", "position": "PD", "ovr": 77, "age": 35, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.2, "isStar": True}
    ]
  },
  {
    "key": "Konyaspor",
    "id": "konyaspor",
    "name": "Konyaspor Kulübü",
    "shortName": "Konyaspor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/91/Konyaspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Medaş Konya Büyükşehir Stadyumu",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Antalyaspor"],
    "playStyle": "As Águias da Anatólia com disciplina tática e apoio de 40 mil torcedores",
    "coachName": "Recep Uçar",
    "squad": [
      {"id": "kon_1", "name": "Jakub Słowik", "position": "GOL", "ovr": 75, "age": 33, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 1.0},
      {"id": "kon_2", "name": "Pedrinho", "position": "MEI", "ovr": 77, "age": 31, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 2.2, "isStar": True}
    ]
  },
  {
    "key": "Çaykur Rizespor",
    "id": "rizespor",
    "name": "Çaykur Rizespor Kulübü",
    "shortName": "Rizespor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/%C3%87aykur_Rizespor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Çaykur Didi Stadyumu (Rize)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#0055A5", "secondary": "#008000", "text": "#ffffff"},
    "rivalClubs": ["Trabzonspor"],
    "playStyle": "A força do chá turco no Mar Negro sob İlhan Palut com velocidade de Olawoyin",
    "coachName": "İlhan Palut",
    "squad": [
      {"id": "riz_1", "name": "Gökhan Akkan", "position": "GOL", "ovr": 75, "age": 29, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.5},
      {"id": "riz_2", "name": "Ibrahim Olawoyin", "position": "MC", "ovr": 77, "age": 26, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Kayserispor",
    "id": "kayserispor",
    "name": "Kayserispor Kulübü",
    "shortName": "Kayserispor",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/3/30/Kayserispor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "RHG Enertürk Enerji Stadyumu (Kayseri)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 16.0,
    "colors": {"primary": "#FFED00", "secondary": "#CC0000", "text": "#000000"},
    "rivalClubs": ["Sivasspor"],
    "playStyle": "Futebol guerreiro aos pés do vulcão Erciyes com o talento de Cardoso",
    "coachName": "Sinan Kaloğlu",
    "squad": [
      {"id": "kay_1", "name": "Bilal Bayazit", "position": "GOL", "ovr": 76, "age": 25, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 2.8},
      {"id": "kay_2", "name": "Miguel Cardoso", "position": "PE", "ovr": 77, "age": 30, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Adana Demirspor",
    "id": "adana_demirspor",
    "name": "Adana Demirspor Kulübü",
    "shortName": "Adana Demir",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/87/Adana_Demirspor_logo.svg",
    "leagueId": "super_lig",
    "league": "Süper Lig",
    "country": "Turquia",
    "stadium": "Yeni Adana Stadyumu",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 16.0,
    "colors": {"primary": "#002B49", "secondary": "#87CEEB", "text": "#ffffff"},
    "rivalClubs": ["Adanaspor"],
    "playStyle": "Os Relâmpagos Azuis com calor ensurdecedor em Adana",
    "coachName": "Serkan Damla",
    "squad": [
      {"id": "ada_1", "name": "Vedat Karakuş", "position": "GOL", "ovr": 73, "age": 26, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 0.8},
      {"id": "ada_2", "name": "Semih Güler", "position": "ZAG", "ovr": 75, "age": 29, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },

  # ==========================================
  # ARÁBIA SAUDITA - SAUDI PRO LEAGUE (COMPLETANDO)
  # ==========================================
  {
    "key": "Al-Kholood",
    "id": "al_kholood",
    "name": "Al-Kholood Club",
    "shortName": "Al-Kholood",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/6/6f/Al-Kholood_Club_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Al-Hazem Club Stadium (Ar Rass)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Al-Hazem"],
    "playStyle": "Futebol saudita veloz com Alex Collado desequilibrando",
    "coachName": "Noureddine Zekri",
    "squad": [
      {"id": "kho_1", "name": "Marcelo Grohe", "position": "GOL", "ovr": 78, "age": 37, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0, "isStar": True},
      {"id": "kho_2", "name": "Álex Collado", "position": "MEI", "ovr": 78, "age": 25, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 3.5, "isStar": True}
    ]
  },
  {
    "key": "Al-Riyadh",
    "id": "al_riyadh",
    "name": "Al-Riyadh SC",
    "shortName": "Al-Riyadh",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/07/Al-Riyadh_SC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Prince Turki bin Abdul Aziz Stadium (Riyadh)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 28.0,
    "colors": {"primary": "#CC0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Al-Shabab", "Al-Hilal"],
    "playStyle": "O tradicional clube da capital com o goleador veterano Mohamed Konaté",
    "coachName": "Sabri Lamouchi",
    "squad": [
      {"id": "riy_1", "name": "Milan Borjan", "position": "GOL", "ovr": 77, "age": 37, "nationality": "Canadá", "flag": "🇨🇦", "marketValueEur": 1.0},
      {"id": "riy_2", "name": "Bernard Mensah", "position": "MEI", "ovr": 78, "age": 30, "nationality": "Gana", "flag": "🇬🇭", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Al-Fayha",
    "id": "al_fayha",
    "name": "Al-Fayha FC",
    "shortName": "Al-Fayha",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/2e/Al-Fayha_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Al-Majma'ah Sports City",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#F78F1E", "secondary": "#003F87", "text": "#ffffff"},
    "rivalClubs": ["Al-Faisaly"],
    "playStyle": "Futebol de combate no deserto com o talento de Alejandro Pozuelo",
    "coachName": "Christos Kontis",
    "squad": [
      {"id": "fay_1", "name": "Orlando Mosquera", "position": "GOL", "ovr": 75, "age": 29, "nationality": "Panamá", "flag": "🇵🇦", "marketValueEur": 1.2},
      {"id": "fay_2", "name": "Alejandro Pozuelo", "position": "MEI", "ovr": 78, "age": 33, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Al-Khaleej",
    "id": "al_khaleej",
    "name": "Al-Khaleej Club",
    "shortName": "Al-Khaleej",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/5/52/Al-Khaleej_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Al-Khaleej Club Stadium (Saihat)",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 28.0,
    "colors": {"primary": "#FFED00", "secondary": "#008000", "text": "#000000"},
    "rivalClubs": ["Al-Ettifaq"],
    "playStyle": "As Águias do Golfo com a maestria de Fábio Martins e Kostas Fortounis",
    "coachName": "Georgios Donis",
    "squad": [
      {"id": "kha_1", "name": "Ibrahim Šehić", "position": "GOL", "ovr": 76, "age": 36, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 0.8},
      {"id": "kha_2", "name": "Kostas Fortounis", "position": "MEI", "ovr": 79, "age": 32, "nationality": "Grécia", "flag": "🇬🇷", "marketValueEur": 3.0, "isStar": True},
      {"id": "kha_3", "name": "Fábio Martins", "position": "PE", "ovr": 78, "age": 31, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Damac",
    "id": "damac",
    "name": "Damac FC",
    "shortName": "Damac",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/91/Damac_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "Damac Club Stadium (Khamis Mushait)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 28.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFED00", "text": "#ffffff"},
    "rivalClubs": ["Abha Club"],
    "playStyle": "Futebol de altitude nas montanhas de Asir com gols de Georges-Kévin Nkoudou",
    "coachName": "Cosmin Contra",
    "squad": [
      {"id": "dam_1", "name": "Florin Niță", "position": "GOL", "ovr": 77, "age": 37, "nationality": "Romênia", "flag": "🇷🇴", "marketValueEur": 0.5},
      {"id": "dam_2", "name": "Georges-Kévin Nkoudou", "position": "PE", "ovr": 80, "age": 29, "nationality": "Camarões", "flag": "🇨🇲", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Al-Wehda",
    "id": "al_wehda",
    "name": "Al-Wehda FC",
    "shortName": "Al-Wehda",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e0/Al-Wehda_FC_logo.svg",
    "leagueId": "saudi_pro",
    "league": "Saudi League",
    "country": "Arábia Saudita",
    "stadium": "King Abdul Aziz Stadium (Makkah)",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 28.0,
    "colors": {"primary": "#CC0000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Al-Ahli", "Al-Ittihad"],
    "playStyle": "O clube dos Cavaleiros de Meca com liderança de Odion Ighalo",
    "coachName": "Josef Zinnbauer",
    "squad": [
      {"id": "weh_1", "name": "Munir Mohamedi", "position": "GOL", "ovr": 77, "age": 35, "nationality": "Marrocos", "flag": "🇲🇦", "marketValueEur": 1.2},
      {"id": "weh_2", "name": "Odion Ighalo", "position": "CA", "ovr": 78, "age": 35, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 1.8, "isStar": True}
    ]
  },

  # ==========================================
  # ARGENTINA - LIGA PROFESIONAL (COMPLETANDO)
  # ==========================================
  {
    "key": "Talleres",
    "id": "talleres",
    "name": "CA Talleres (Córdoba)",
    "shortName": "Talleres",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Club_Atl%C3%A9tico_Talleres_%28C%C3%B3rdoba%29.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Mario Alberto Kempes (Córdoba)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 22.0,
    "colors": {"primary": "#002B49", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Belgrano", "Instituto"],
    "playStyle": "A Matilha de Córdoba: 55 mil no Kempes e velocidade absurda no ataque",
    "coachName": "Alexander Medina",
    "squad": [
      {"id": "tal_1", "name": "Guido Herrera", "position": "GOL", "ovr": 78, "age": 32, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5},
      {"id": "tal_2", "name": "Rubén Botta", "position": "MEI", "ovr": 79, "age": 34, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "Huracán",
    "id": "huracan",
    "name": "CA Huracán",
    "shortName": "Huracán",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Escudo_del_Club_Atl%C3%A9tico_Hurac%C3%A1n.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Tomás Adolfo Ducó (El Palacio)",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["San Lorenzo"],
    "playStyle": "O Globo do Parque Patricios: zaga impenetrável sob Frank Kudelka",
    "coachName": "Frank Kudelka",
    "squad": [
      {"id": "hur_1", "name": "Hernán Galíndez", "position": "GOL", "ovr": 78, "age": 37, "nationality": "Equador", "flag": "🇪🇨", "marketValueEur": 1.0, "isStar": True},
      {"id": "hur_2", "name": "Rodrigo Echeverría", "position": "VOL", "ovr": 78, "age": 29, "nationality": "Chile", "flag": "🇨🇱", "marketValueEur": 3.0, "isStar": True}
    ]
  },
  {
    "key": "Lanús",
    "id": "lanus",
    "name": "CA Lanús",
    "shortName": "Lanús",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Escudo_del_Club_Atl%C3%A9tico_Lan%C3%BAs.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Ciudad de Lanús - Néstor Díaz Pérez (La Fortaleza)",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#800020", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Banfield"],
    "playStyle": "La Fortaleza Granate: raça sul-americana com a lenda Walter Bou",
    "coachName": "Ricardo Zielinski",
    "squad": [
      {"id": "lan_1", "name": "Nahuel Losada", "position": "GOL", "ovr": 77, "age": 31, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5},
      {"id": "lan_2", "name": "Walter Bou", "position": "CA", "ovr": 79, "age": 31, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5, "isStar": True}
    ]
  },
  {
    "key": "Newell's Old Boys",
    "id": "newells",
    "name": "CA Newell's Old Boys",
    "shortName": "Newell's",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/0/00/Escudo_del_Club_Atl%C3%A9tico_Newell%27s_Old_Boys.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Marcelo Bielsa (El Coloso del Parque)",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 18.0,
    "colors": {"primary": "#CC0000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Rosario Central"],
    "playStyle": "O berço de Messi e Bielsa no Coloso de Rosario com fervor histórico",
    "coachName": "Ricardo Lunari",
    "squad": [
      {"id": "new_1", "name": "Ramiro Macagno", "position": "GOL", "ovr": 76, "age": 27, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5},
      {"id": "new_2", "name": "Éver Banega", "position": "MC", "ovr": 80, "age": 36, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "Rosario Central",
    "id": "rosario_central",
    "name": "CA Rosario Central",
    "shortName": "Rosario Central",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/70/Escudo_del_Club_Atl%C3%A9tico_Rosario_Central.svg",
    "leagueId": "liga_argentina",
    "league": "Liga Profesional Argentina",
    "country": "Argentina",
    "stadium": "Gigante de Arroyito",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 18.0,
    "colors": {"primary": "#002B49", "secondary": "#FFED00", "text": "#ffffff"},
    "rivalClubs": ["Newell's Old Boys"],
    "playStyle": "O Gigante de Arroyito tremendo na paixão canalla sob Ariel Holan",
    "coachName": "Ariel Holan",
    "squad": [
      {"id": "cen_1", "name": "Jorge Broun", "position": "GOL", "ovr": 77, "age": 38, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 0.8},
      {"id": "cen_2", "name": "Ignacio Malcorra", "position": "MEI", "ovr": 78, "age": 37, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.0, "isStar": True}
    ]
  }
]

def run():
    with open(CLUBS_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    closing_pattern = r'(\n\}\;\s*\n\/\*\*[\s\S]*?export const CLUBS)'
    match = re.search(closing_pattern, content)
    if not match:
        print("Erro: Fechamento de RAW_CLUBS nao encontrado!")
        return

    insert_idx = match.start(1)
    added = 0
    ts_code = "\n"

    for club in FINAL_CLUBS:
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

    print(f"Sucesso! {added} clubes do pacote final adicionados.")

if __name__ == '__main__':
    run()
