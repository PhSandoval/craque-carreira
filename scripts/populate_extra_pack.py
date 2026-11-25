#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

EXTRA_CLUBS = [
  # ==========================================
  # HOLANDA - EREDIVISIE (COMPLETANDO 18 CLUBES)
  # ==========================================
  {
    "key": "Willem II",
    "id": "willem_ii",
    "name": "Willem II Tilburg",
    "shortName": "Willem II",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/2/23/Willem_II_logo.svg",
    "leagueId": "eredivisie",
    "league": "Eredivisie",
    "country": "Holanda",
    "stadium": "Koning Willem II Stadion",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 14.0,
    "colors": {"primary": "#0D2C6C", "secondary": "#E31B23", "text": "#ffffff"},
    "rivalClubs": ["NAC Breda", "RKC Waalwijk"],
    "playStyle": "Futebol combativo em bloco baixo e transição rápida",
    "coachName": "Peter Maes",
    "squad": [
      {"id": "wil_1", "name": "Thomas Didillon-Hödl", "position": "GOL", "ovr": 72, "age": 28, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 1.2},
      {"id": "wil_2", "name": "Cisse Sandra", "position": "MEI", "ovr": 73, "age": 20, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 2.5, "isStar": True},
      {"id": "wil_3", "name": "Kyan Vaesen", "position": "CA", "ovr": 72, "age": 23, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.8}
    ]
  },

  # ==========================================
  # TURQUIA - SÜPER LIG (COMPLETANDO 19 CLUBES)
  # ==========================================
  {
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
    "colors": {"primary": "#E31E24", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Hatayspor", "Adana Demirspor"],
    "playStyle": "Intensidade física do sul turco e bolas paradas",
    "coachName": "Selçuk İnan",
    "squad": [
      {"id": "gaz_1", "name": "Mustafa Burak Bozan", "position": "GOL", "ovr": 72, "age": 24, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.0},
      {"id": "gaz_2", "name": "Alexandru Maxim", "position": "MEI", "ovr": 75, "age": 34, "nationality": "Romênia", "flag": "🇷🇴", "marketValueEur": 2.0, "isStar": True},
      {"id": "gaz_3", "name": "David Okereke", "position": "CA", "ovr": 74, "age": 27, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 2.8}
    ]
  },
  {
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
    "colors": {"primary": "#009639", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Göztepe", "Antalyaspor"],
    "playStyle": "Pressão no meio-campo e velocidade costeira",
    "coachName": "Volkan Demirel",
    "squad": [
      {"id": "bod_1", "name": "Diogo Sousa", "position": "GOL", "ovr": 71, "age": 26, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 1.2},
      {"id": "bod_2", "name": "George Pușcaș", "position": "CA", "ovr": 73, "age": 28, "nationality": "Romênia", "flag": "🇷🇴", "marketValueEur": 2.2, "isStar": True},
      {"id": "bod_3", "name": "Taulant Seferi", "position": "PE", "ovr": 73, "age": 27, "nationality": "Albânia", "flag": "🇦🇱", "marketValueEur": 2.0}
    ]
  },
  {
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
    "colors": {"primary": "#800020", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Gaziantep FK", "Adana Demirspor"],
    "playStyle": "Futebol de superação e contra-ataques verticais",
    "coachName": "Rıza Çalımbay",
    "squad": [
      {"id": "hat_1", "name": "Erce Kardeşler", "position": "GOL", "ovr": 72, "age": 30, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.0},
      {"id": "hat_2", "name": "Vincent Aboubakar", "position": "CA", "ovr": 78, "age": 32, "nationality": "Camarões", "flag": "🇨🇲", "marketValueEur": 3.8, "isStar": True},
      {"id": "hat_3", "name": "Joelson Fernandes", "position": "PE", "ovr": 73, "age": 21, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 2.2}
    ]
  },

  # ==========================================
  # ARÁBIA SAUDITA - SAUDI PRO LEAGUE (COMPLETANDO 18 CLUBES)
  # ==========================================
  {
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
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Damac FC", "Al-Wehda"],
    "playStyle": "Linha de 5 defensiva com contra-golpe físico",
    "coachName": "Stjepan Tomas",
    "squad": [
      {"id": "okh_1", "name": "Paulo Vítor", "position": "GOL", "ovr": 73, "age": 35, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 1.0},
      {"id": "okh_2", "name": "Christian Bassogog", "position": "PD", "ovr": 75, "age": 29, "nationality": "Camarões", "flag": "🇨🇲", "marketValueEur": 2.8, "isStar": True},
      {"id": "okh_3", "name": "Ibrahima Koné", "position": "CA", "ovr": 74, "age": 25, "nationality": "Mali", "flag": "🇲🇱", "marketValueEur": 3.0}
    ]
  },
  {
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
    "colors": {"primary": "#FFFF00", "secondary": "#008000", "text": "#000000"},
    "rivalClubs": ["Al-Raed", "Al-Fayha"],
    "playStyle": "Futebol veloz com Kurt Zouma na zaga e Tello no ataque",
    "coachName": "Álvaro Pacheco",
    "squad": [
      {"id": "oro_1", "name": "Gaëtan Coucke", "position": "GOL", "ovr": 73, "age": 26, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.8},
      {"id": "oro_2", "name": "Kurt Zouma", "position": "ZAG", "ovr": 78, "age": 30, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 8.0, "isStar": True},
      {"id": "oro_3", "name": "Cristian Tello", "position": "PE", "ovr": 76, "age": 33, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 3.0}
    ]
  },
  {
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
    "colors": {"primary": "#D21034", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Al-Taawoun", "Al-Fayha"],
    "playStyle": "Clássico de Al-Qassim com velocidade pelas pontas",
    "coachName": "Odair Hellmann",
    "squad": [
      {"id": "rae_1", "name": "André Moreira", "position": "GOL", "ovr": 74, "age": 29, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 1.5},
      {"id": "rae_2", "name": "Amir Sayoud", "position": "MEI", "ovr": 77, "age": 34, "nationality": "Argélia", "flag": "🇩🇿", "marketValueEur": 2.5, "isStar": True},
      {"id": "rae_3", "name": "Mehdi Abeid", "position": "VOL", "ovr": 74, "age": 32, "nationality": "Argélia", "flag": "🇩🇿", "marketValueEur": 1.8}
    ]
  },

  # ==========================================
  # ARGENTINA - LIGA PROFESIONAL (COMPLETANDO 20 CLUBES)
  # ==========================================
  {
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
    "colors": {"primary": "#DA291C", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Platense", "Vélez Sarsfield"],
    "playStyle": "O Semillero del Mundo: posse técnica e toque refinado",
    "coachName": "Cristian Zermatten",
    "squad": [
      {"id": "aaaj_1", "name": "Diego Rodríguez", "position": "GOL", "ovr": 74, "age": 35, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.0},
      {"id": "aaaj_2", "name": "Alan Lescano", "position": "MEI", "ovr": 76, "age": 23, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 4.5, "isStar": True},
      {"id": "aaaj_3", "name": "Gastón Verón", "position": "CA", "ovr": 74, "age": 23, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 3.0}
    ]
  },
  {
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
    "colors": {"primary": "#75AADB", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Talleres", "Instituto"],
    "playStyle": "La Pasión Pirata: intensidade em Córdoba e garra pura",
    "coachName": "Juan Cruz Real",
    "squad": [
      {"id": "bel_1", "name": "Ignacio Chicco", "position": "GOL", "ovr": 73, "age": 28, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.2},
      {"id": "bel_2", "name": "Bryan Reyna", "position": "PE", "ovr": 75, "age": 26, "nationality": "Peru", "flag": "🇵🇪", "marketValueEur": 3.2, "isStar": True},
      {"id": "bel_3", "name": "Franco Jara", "position": "CA", "ovr": 74, "age": 36, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.0}
    ]
  },
  {
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
    "colors": {"primary": "#008000", "secondary": "#FFFF00", "text": "#ffffff"},
    "rivalClubs": ["Quilmes", "Lanús"],
    "playStyle": "Futebol dinâmico, rotação ofensiva e transição veloz",
    "coachName": "Pablo De Muner",
    "squad": [
      {"id": "dyj_1", "name": "Cristopher Fiermarín", "position": "GOL", "ovr": 74, "age": 26, "nationality": "Uruguai", "flag": "🇺🇾", "marketValueEur": 1.5},
      {"id": "dyj_2", "name": "Aaron Molinas", "position": "MEI", "ovr": 75, "age": 24, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 3.5, "isStar": True},
      {"id": "dyj_3", "name": "Juan Miritello", "position": "CA", "ovr": 73, "age": 25, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.2}
    ]
  },
  {
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
    "colors": {"primary": "#002B7F", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Independiente Rivadavia", "San Martín"],
    "playStyle": "Futebol veloz aos pés da Cordilheira dos Andes",
    "coachName": "Daniel Oldrá",
    "squad": [
      {"id": "god_1", "name": "Franco Petroli", "position": "GOL", "ovr": 75, "age": 26, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5},
      {"id": "god_2", "name": "Santino Andino", "position": "PE", "ovr": 74, "age": 19, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 4.0, "isStar": True},
      {"id": "god_3", "name": "Salomón Rodríguez", "position": "CA", "ovr": 73, "age": 24, "nationality": "Uruguai", "flag": "🇺🇾", "marketValueEur": 2.2}
    ]
  },
  {
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
    "colors": {"primary": "#00853F", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Lanús", "Los Andes"],
    "playStyle": "Clássico del Sur com pressão na intermediária",
    "coachName": "Gustavo Munúa",
    "squad": [
      {"id": "ban_1", "name": "Facundo Sanguinetti", "position": "GOL", "ovr": 72, "age": 23, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.2},
      {"id": "ban_2", "name": "Gerónimo Rivera", "position": "PE", "ovr": 74, "age": 21, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 3.5, "isStar": True},
      {"id": "ban_3", "name": "Bruno Sepúlveda", "position": "CA", "ovr": 73, "age": 32, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5}
    ]
  },
  {
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
    "colors": {"primary": "#002B7F", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Estudiantes LP", "San Lorenzo"],
    "playStyle": "El Lobo platense: raça histórica e pressão total no Bosque",
    "coachName": "Marcelo Méndez",
    "squad": [
      {"id": "gelp_1", "name": "Marcos Ledesma", "position": "GOL", "ovr": 73, "age": 28, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.4},
      {"id": "gelp_2", "name": "Rodrigo Castillo", "position": "CA", "ovr": 74, "age": 25, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5, "isStar": True},
      {"id": "gelp_3", "name": "Lucas Castro", "position": "MEI", "ovr": 73, "age": 35, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.0}
    ]
  },
  {
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
    "colors": {"primary": "#0033A0", "secondary": "#D21034", "text": "#ffffff"},
    "rivalClubs": ["Platense", "Chacarita"],
    "playStyle": "El Matador de Victoria: futebol vertical e intenso",
    "coachName": "Sebastián Domínguez",
    "squad": [
      {"id": "tig_1", "name": "Felipe Zenobio", "position": "GOL", "ovr": 72, "age": 24, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.2},
      {"id": "tig_2", "name": "Florián Monzón", "position": "CA", "ovr": 74, "age": 23, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.5, "isStar": True},
      {"id": "tig_3", "name": "Gonzalo Maroni", "position": "MEI", "ovr": 73, "age": 25, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 2.0}
    ]
  },
  {
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
    "colors": {"primary": "#4B2816", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Argentinos Juniors", "Tigre"],
    "playStyle": "El Calamar: defesa estruturada e contragolpes cirúrgicos",
    "coachName": "Favio Orsi & Sergio Gómez",
    "squad": [
      {"id": "pla_1", "name": "Juan Pablo Cozzani", "position": "GOL", "ovr": 74, "age": 26, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.8},
      {"id": "pla_2", "name": "Mateo Pellegrino", "position": "CA", "ovr": 75, "age": 23, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 3.0, "isStar": True},
      {"id": "pla_3", "name": "Guido Mainero", "position": "PD", "ovr": 73, "age": 29, "nationality": "Argentina", "flag": "🇦🇷", "marketValueEur": 1.5}
    ]
  },

  # ==========================================
  # BÉLGICA - JUPILER PRO LEAGUE (COMPLETANDO 16 CLUBES)
  # ==========================================
  {
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
    "colors": {"primary": "#008000", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Club Brugge", "Gent"],
    "playStyle": "Pressão agressiva em bloco alto e intensidade física",
    "coachName": "Miron Muslic",
    "squad": [
      {"id": "cer_1", "name": "Warleson", "position": "GOL", "ovr": 75, "age": 28, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 2.5},
      {"id": "cer_2", "name": "Kévin Denkey", "position": "CA", "ovr": 78, "age": 24, "nationality": "Togo", "flag": "🇹🇬", "marketValueEur": 12.0, "isStar": True},
      {"id": "cer_3", "name": "Alan Minda", "position": "PE", "ovr": 75, "age": 21, "nationality": "Equador", "flag": "🇪🇨", "marketValueEur": 6.0}
    ]
  },
  {
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
    "colors": {"primary": "#E21836", "secondary": "#FFDE00", "text": "#000000"},
    "rivalClubs": ["Antwerp", "Lierse"],
    "playStyle": "Futebol vertical pelos corredores de Flandres",
    "coachName": "Besnik Hasi",
    "squad": [
      {"id": "mec_1", "name": "Ortwin De Wolf", "position": "GOL", "ovr": 73, "age": 27, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.5},
      {"id": "mec_2", "name": "Kerim Mrabti", "position": "MEI", "ovr": 75, "age": 30, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 2.5, "isStar": True},
      {"id": "mec_3", "name": "Benito Raman", "position": "CA", "ovr": 74, "age": 30, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 2.0}
    ]
  },
  {
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
    "colors": {"primary": "#FFDE00", "secondary": "#0033A0", "text": "#000000"},
    "rivalClubs": ["Genk", "Standard Liège"],
    "playStyle": "Disciplina tática oriental e transições rápidas",
    "coachName": "Felice Mazzù",
    "squad": [
      {"id": "stv_1", "name": "Leo Kokubo", "position": "GOL", "ovr": 73, "age": 23, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 1.8},
      {"id": "stv_2", "name": "Joel Chima Fujita", "position": "VOL", "ovr": 75, "age": 22, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 3.5, "isStar": True},
      {"id": "stv_3", "name": "Adriano Bertaccini", "position": "CA", "ovr": 75, "age": 24, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 3.0}
    ]
  },
  {
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
    "colors": {"primary": "#000000", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Standard Liège", "Mons"],
    "playStyle": "Les Zèbres: futebol físico e contra-ataques na Valônia",
    "coachName": "Rik De Mil",
    "squad": [
      {"id": "cha_1", "name": "Martin Delavallée", "position": "GOL", "ovr": 72, "age": 20, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.5},
      {"id": "cha_2", "name": "Daan Heymans", "position": "MEI", "ovr": 76, "age": 25, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 3.5, "isStar": True},
      {"id": "cha_3", "name": "Parfait Guiagon", "position": "MEI", "ovr": 75, "age": 23, "nationality": "Costa do Marfim", "flag": "🇨🇮", "marketValueEur": 3.5}
    ]
  },
  {
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
    "colors": {"primary": "#FFFFFF", "secondary": "#E21836", "text": "#000000"},
    "rivalClubs": ["Mechelen", "Sint-Truiden"],
    "playStyle": "Organização defensiva e saída longa apoiada",
    "coachName": "Óscar García",
    "squad": [
      {"id": "ohl_1", "name": "Tobe Leysen", "position": "GOL", "ovr": 74, "age": 23, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 2.5},
      {"id": "ohl_2", "name": "Ezechiel Banzuzi", "position": "MEI", "ovr": 75, "age": 19, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 4.0, "isStar": True},
      {"id": "ohl_3", "name": "Youssef Maziz", "position": "MEI", "ovr": 74, "age": 26, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 2.5}
    ]
  },
  {
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
    "colors": {"primary": "#FFDE00", "secondary": "#0033A0", "text": "#000000"},
    "rivalClubs": ["Mechelen", "Genk"],
    "playStyle": "Futebol vistoso, jovem e muito veloz no terço final",
    "coachName": "Timmy Simons",
    "squad": [
      {"id": "wes_1", "name": "Sinan Bolat", "position": "GOL", "ovr": 74, "age": 36, "nationality": "Turquia", "flag": "🇹🇷", "marketValueEur": 1.0},
      {"id": "wes_2", "name": "Allahyar Sayyadmanesh", "position": "PD", "ovr": 75, "age": 23, "nationality": "Irã", "flag": "🇮🇷", "marketValueEur": 3.0, "isStar": True},
      {"id": "wes_3", "name": "Matija Frigan", "position": "CA", "ovr": 74, "age": 21, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 4.5}
    ]
  },
  {
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
    "colors": {"primary": "#0033A0", "secondary": "#E21836", "text": "#ffffff"},
    "rivalClubs": ["Anderlecht", "Gent"],
    "playStyle": "Sensação de Denderleeuw com bloco fechado e superação",
    "coachName": "Vincent Euvrard",
    "squad": [
      {"id": "den_1", "name": "Michael Verrips", "position": "GOL", "ovr": 72, "age": 28, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 1.2},
      {"id": "den_2", "name": "Bruny Nsimba", "position": "CA", "ovr": 73, "age": 24, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 2.0, "isStar": True},
      {"id": "den_3", "name": "Lennard Hens", "position": "MEI", "ovr": 71, "age": 28, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.0}
    ]
  },
  {
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
    "colors": {"primary": "#E21836", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Zulte Waregem", "Cercle Brugge"],
    "playStyle": "Garra de Kortrijk com linhas compactas",
    "coachName": "Freyr Alexandersson",
    "squad": [
      {"id": "kor_1", "name": "Patrik Gunnarsson", "position": "GOL", "ovr": 72, "age": 24, "nationality": "Islândia", "flag": "🇮🇸", "marketValueEur": 1.4},
      {"id": "kor_2", "name": "Nacho Ferri", "position": "CA", "ovr": 73, "age": 20, "nationality": "Espanha", "flag": "🇪🇸", "marketValueEur": 2.5, "isStar": True},
      {"id": "kor_3", "name": "Takuro Kaneko", "position": "PD", "ovr": 74, "age": 27, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 2.2}
    ]
  },
  {
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
    "colors": {"primary": "#502B7D", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["Antwerp", "Mechelen"],
    "playStyle": "Derby da Antuérpia e intensidade pura no Kiel",
    "coachName": "Dirk Kuyt",
    "squad": [
      {"id": "bee_1", "name": "Nick Shinton", "position": "GOL", "ovr": 71, "age": 23, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 1.0},
      {"id": "bee_2", "name": "Marwan Al-Sahafi", "position": "PE", "ovr": 73, "age": 20, "nationality": "Arábia Saudita", "flag": "🇸🇦", "marketValueEur": 2.5, "isStar": True},
      {"id": "bee_3", "name": "Faisal Al-Ghamdi", "position": "VOL", "ovr": 73, "age": 23, "nationality": "Arábia Saudita", "flag": "🇸🇦", "marketValueEur": 2.5}
    ]
  }
]

with open(CLUBS_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Locate RAW_CLUBS closing brace
marker = "export const CLUBS: Record<string, Club> = new Proxy(RAW_CLUBS,"
idx = content.find(marker)
if idx == -1:
    print("ERRO: Marcador CLUBS Proxy nao encontrado")
    exit(1)

before_marker = content[:idx]
after_marker = content[idx:]

last_brace = before_marker.rfind("};")
if last_brace == -1:
    print("ERRO: Fechamento de RAW_CLUBS nao encontrado")
    exit(1)

inserted_code = ""
for c in EXTRA_CLUBS:
    k = c["key"]
    # check if key already in before_marker
    if f"'{k}':" in before_marker or f'"{k}":' in before_marker:
        continue
    club_json = json.dumps(c, indent=2, ensure_ascii=False)
    # adjust indent
    indented = "\n".join("  " + line for line in club_json.split("\n"))
    # remove outermost { and }
    indented_inner = "\n".join("  " + line for line in club_json.split("\n")[1:-1])
    inserted_code += f"  '{k}': {{\n{indented_inner}\n  }},\n"

new_content = before_marker[:last_brace] + inserted_code + before_marker[last_brace:] + after_marker

with open(CLUBS_PATH, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Sucesso! {len(EXTRA_CLUBS)} clubes extras adicionados a clubs.ts.")
