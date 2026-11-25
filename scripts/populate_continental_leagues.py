#!/usr/bin/env python3
import json
import re

CLUBS_PATH = '/Users/pedro/.gemini/antigravity/scratch/craque-carreira/src/data/clubs.ts'

CONTINENTAL_CLUBS = [
  # ==========================================
  # ALEMANHA - BUNDESLIGA (COMPLETANDO 18 CLUBES)
  # ==========================================
  {
    "key": "Union Berlin",
    "id": "union_berlin",
    "name": "1. FC Union Berlin",
    "shortName": "Union Berlin",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/4/44/1._FC_Union_Berlin_Logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Stadion An der Alten Försterei",
    "prestige": 3,
    "formation": "3-5-2",
    "budgetEur": 40.0,
    "colors": {"primary": "#e30613", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Hertha BSC"],
    "playStyle": "Paixão feroz na floresta de Köpenick com zaga impenetrável e entrega total",
    "coachName": "Bo Svensson",
    "squad": [
      {"id": "unb_1", "name": "Frederik Rønnow", "position": "GOL", "ovr": 80, "age": 32, "nationality": "Dinamarca", "flag": "🇩🇰", "marketValueEur": 5.0},
      {"id": "unb_2", "name": "Danilho Doekhi", "position": "ZAG", "ovr": 80, "age": 26, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 17.0, "isStar": True},
      {"id": "unb_3", "name": "Yorbe Vertessen", "position": "CA", "ovr": 78, "age": 23, "nationality": "Bélgica", "flag": "🇧🇪", "marketValueEur": 8.0}
    ]
  },
  {
    "key": "Mainz 05",
    "id": "mainz",
    "name": "1. FSV Mainz 05",
    "shortName": "Mainz 05",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Mainz_05.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Mewa Arena",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#cc0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Eintracht Frankfurt"],
    "playStyle": "Pressão alemã alta de Bo Henriksen com Burkardt e Amiri voando",
    "coachName": "Bo Henriksen",
    "squad": [
      {"id": "mai_1", "name": "Robin Zentner", "position": "GOL", "ovr": 78, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 4.0},
      {"id": "mai_2", "name": "Nadiem Amiri", "position": "MEI", "ovr": 80, "age": 28, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 12.0, "isStar": True},
      {"id": "mai_3", "name": "Jonathan Burkardt", "position": "CA", "ovr": 80, "age": 24, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 20.0, "isStar": True}
    ]
  },
  {
    "key": "Augsburg",
    "id": "augsburg",
    "name": "FC Augsburg",
    "shortName": "Augsburg",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c5/FC_Augsburg_logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "WWK Arena",
    "prestige": 2,
    "formation": "3-4-2-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#BA122B", "secondary": "#00552b", "text": "#ffffff"},
    "rivalClubs": ["Bayern de Munique"],
    "playStyle": "Futebol combativo bávaro e oportunismo na área",
    "coachName": "Jess Thorup",
    "squad": [
      {"id": "aug_1", "name": "Nediljko Labrović", "position": "GOL", "ovr": 77, "age": 25, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 4.5},
      {"id": "aug_2", "name": "Alexis Claude-Maurice", "position": "MEI", "ovr": 78, "age": 26, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Wolfsburg",
    "id": "wolfsburg",
    "name": "VfL Wolfsburg",
    "shortName": "Wolfsburg",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Logo-VfL-Wolfsburg.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Volkswagen Arena",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 50.0,
    "colors": {"primary": "#65B32E", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Hannover 96", "Eintracht Braunschweig"],
    "playStyle": "Força física e velocidade pelas alas da Volkswagen Arena",
    "coachName": "Ralph Hasenhüttl",
    "squad": [
      {"id": "wob_1", "name": "Kamil Grabara", "position": "GOL", "ovr": 79, "age": 25, "nationality": "Polônia", "flag": "🇵🇱", "marketValueEur": 14.0},
      {"id": "wob_2", "name": "Maximilian Arnold", "position": "VOL", "ovr": 80, "age": 30, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 10.0, "isStar": True},
      {"id": "wob_3", "name": "Lovro Majer", "position": "MEI", "ovr": 80, "age": 26, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 20.0, "isStar": True}
    ]
  },
  {
    "key": "Heidenheim",
    "id": "heidenheim",
    "name": "1. FC Heidenheim 1846",
    "shortName": "Heidenheim",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9d/1._FC_Heidenheim_1846.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Voith-Arena",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 25.0,
    "colors": {"primary": "#002B49", "secondary": "#CC0000", "text": "#ffffff"},
    "rivalClubs": ["VfB Stuttgart"],
    "playStyle": "O milagre de Frank Schmidt: maior distância percorrida na Bundesliga e entrega física",
    "coachName": "Frank Schmidt",
    "squad": [
      {"id": "hei_1", "name": "Kevin Müller", "position": "GOL", "ovr": 77, "age": 33, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 2.0},
      {"id": "hei_2", "name": "Paul Wanner", "position": "MEI", "ovr": 79, "age": 18, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 18.0, "isStar": True}
    ]
  },
  {
    "key": "St. Pauli",
    "id": "st_pauli",
    "name": "FC St. Pauli",
    "shortName": "St. Pauli",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/91/FC_St._Pauli_crest.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Millerntor-Stadion",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#663300", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Hamburger SV", "Hansa Rostock"],
    "playStyle": "Atmosfera cult do Millerntor ao som de Hells Bells e garra máxima",
    "coachName": "Alexander Blessin",
    "squad": [
      {"id": "stp_1", "name": "Nikola Vasilj", "position": "GOL", "ovr": 77, "age": 28, "nationality": "Bósnia e Herzegovina", "flag": "🇧🇦", "marketValueEur": 3.0},
      {"id": "stp_2", "name": "Jackson Irvine", "position": "MC", "ovr": 78, "age": 31, "nationality": "Austrália", "flag": "🇦🇺", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Hoffenheim",
    "id": "hoffenheim",
    "name": "TSG 1899 Hoffenheim",
    "shortName": "Hoffenheim",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Logo_TSG_1899_Hoffenheim.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "PreZero Arena",
    "prestige": 3,
    "formation": "3-4-1-2",
    "budgetEur": 45.0,
    "colors": {"primary": "#0055A5", "secondary": "#FFFFFF", "text": "#ffffff"},
    "rivalClubs": ["VfB Stuttgart"],
    "playStyle": "Futebol ofensivo moderno com pontaria de Kramarić",
    "coachName": "Christian Ilzer",
    "squad": [
      {"id": "hof_1", "name": "Oliver Baumann", "position": "GOL", "ovr": 81, "age": 34, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 4.0},
      {"id": "hof_2", "name": "Andrej Kramarić", "position": "CA", "ovr": 81, "age": 33, "nationality": "Croácia", "flag": "🇭🇷", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Holstein Kiel",
    "id": "holstein_kiel",
    "name": "Holstein Kiel",
    "shortName": "Holstein Kiel",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/52/Holstein_Kiel_Logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Holstein-Stadion",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 20.0,
    "colors": {"primary": "#004B93", "secondary": "#ED1C24", "text": "#ffffff"},
    "rivalClubs": ["Hamburger SV", "St. Pauli"],
    "playStyle": "Estreia histórica na elite alemã com coragem no mar Báltico",
    "coachName": "Marcel Rapp",
    "squad": [
      {"id": "kie_1", "name": "Timon Weiner", "position": "GOL", "ovr": 75, "age": 25, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 2.0},
      {"id": "kie_2", "name": "Shuto Machino", "position": "CA", "ovr": 77, "age": 25, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 4.5, "isStar": True}
    ]
  },
  {
    "key": "Bochum",
    "id": "bochum",
    "name": "VfL Bochum 1848",
    "shortName": "Bochum",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/7/72/VfL_Bochum_logo.svg",
    "leagueId": "bundesliga",
    "league": "Bundesliga",
    "country": "Alemanha",
    "stadium": "Vonovia Ruhrstadion",
    "prestige": 2,
    "formation": "4-3-3",
    "budgetEur": 22.0,
    "colors": {"primary": "#005CA9", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Borussia Dortmund", "Schalke 04"],
    "playStyle": "Raça operária pura no lendário Ruhrstadion",
    "coachName": "Dieter Hecking",
    "squad": [
      {"id": "boc_1", "name": "Patrick Drewes", "position": "GOL", "ovr": 76, "age": 31, "nationality": "Alemanha", "flag": "🇩🇪", "marketValueEur": 1.5},
      {"id": "boc_2", "name": "Dani de Wit", "position": "MEI", "ovr": 77, "age": 26, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 5.0, "isStar": True}
    ]
  },

  # ==========================================
  # FRANÇA - LIGUE 1 (COMPLETANDO 18 CLUBES)
  # ==========================================
  {
    "key": "Brest",
    "id": "brest",
    "name": "Stade Brestois 29",
    "shortName": "Brest",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/0/05/Stade_Brestois_29_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Francis-Le Blé",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 40.0,
    "colors": {"primary": "#E2001A", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Rennes", "Lorient"],
    "playStyle": "Sensação bretã de Eric Roy na Champions League com raça indomável",
    "coachName": "Éric Roy",
    "squad": [
      {"id": "bre_1", "name": "Marco Bizot", "position": "GOL", "ovr": 80, "age": 33, "nationality": "Holanda", "flag": "🇳🇱", "marketValueEur": 4.0},
      {"id": "bre_2", "name": "Pierre Lees-Melou", "position": "MC", "ovr": 81, "age": 31, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 10.0, "isStar": True},
      {"id": "bre_3", "name": "Ludovic Ajorque", "position": "CA", "ovr": 79, "age": 30, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 5.0}
    ]
  },
  {
    "key": "Strasbourg",
    "id": "strasbourg",
    "name": "RC Strasbourg Alsace",
    "shortName": "Strasbourg",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/8/80/Racing_Club_de_Strasbourg_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade de la Meinau",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 45.0,
    "colors": {"primary": "#0055A5", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Metz"],
    "playStyle": "Jovens talentos dinâmicos do grupo BlueCo sob Liam Rosenior",
    "coachName": "Liam Rosenior",
    "squad": [
      {"id": "str_1", "name": "Đorđe Petrović", "position": "GOL", "ovr": 80, "age": 25, "nationality": "Sérvia", "flag": "🇷🇸", "marketValueEur": 18.0},
      {"id": "str_2", "name": "Andrey Santos", "position": "VOL", "ovr": 80, "age": 20, "nationality": "Brasil", "flag": "🇧🇷", "marketValueEur": 25.0, "isStar": True},
      {"id": "str_3", "name": "Diego Moreira", "position": "PE", "ovr": 78, "age": 20, "nationality": "Portugal", "flag": "🇵🇹", "marketValueEur": 10.0}
    ]
  },
  {
    "key": "Reims",
    "id": "reims",
    "name": "Stade de Reims",
    "shortName": "Reims",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/0/08/Stade_de_Reims_2020_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Auguste-Delaune",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 35.0,
    "colors": {"primary": "#CC0000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Troyes"],
    "playStyle": "Futebol veloz com a dupla japonesa Junya Ito e Keito Nakamura",
    "coachName": "Luka Elsner",
    "squad": [
      {"id": "rei_1", "name": "Yehvann Diouf", "position": "GOL", "ovr": 78, "age": 25, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 7.0},
      {"id": "rei_2", "name": "Junya Ito", "position": "PD", "ovr": 81, "age": 31, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 10.0, "isStar": True},
      {"id": "rei_3", "name": "Keito Nakamura", "position": "PE", "ovr": 80, "age": 24, "nationality": "Japão", "flag": "🇯🇵", "marketValueEur": 15.0, "isStar": True}
    ]
  },
  {
    "key": "Toulouse",
    "id": "toulouse",
    "name": "Toulouse FC",
    "shortName": "Toulouse",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a2/Toulouse_FC_2018_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stadium de Toulouse",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 35.0,
    "colors": {"primary": "#5F259F", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Bordeaux"],
    "playStyle": "Futebol analítico moderno na cidade rosa de Carles Martínez Novell",
    "coachName": "Carles Martínez Novell",
    "squad": [
      {"id": "tou_1", "name": "Guillaume Restes", "position": "GOL", "ovr": 79, "age": 19, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 18.0, "isStar": True},
      {"id": "tou_2", "name": "Zakaria Aboukhlal", "position": "PD", "ovr": 79, "age": 24, "nationality": "Marrocos", "flag": "🇲🇦", "marketValueEur": 12.0}
    ]
  },
  {
    "key": "Nantes",
    "id": "nantes",
    "name": "FC Nantes",
    "shortName": "Nantes",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5c/FC_Nantes_logo_%282019%29.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade de la Beaujoire",
    "prestige": 3,
    "formation": "4-2-3-1",
    "budgetEur": 30.0,
    "colors": {"primary": "#FFED00", "secondary": "#008000", "text": "#000000"},
    "rivalClubs": ["Rennes"],
    "playStyle": "Os Canários: tradição na Beaujoire com entrega sob Antoine Kombouaré",
    "coachName": "Antoine Kombouaré",
    "squad": [
      {"id": "nan_1", "name": "Alban Lafont", "position": "GOL", "ovr": 79, "age": 25, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 9.0},
      {"id": "nan_2", "name": "Moses Simon", "position": "PE", "ovr": 79, "age": 29, "nationality": "Nigéria", "flag": "🇳🇬", "marketValueEur": 12.0, "isStar": True}
    ]
  },
  {
    "key": "Saint-Étienne",
    "id": "saint_etienne",
    "name": "AS Saint-Étienne",
    "shortName": "Saint-Étienne",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/2/22/AS_Saint-%C3%89tienne_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Geoffroy-Guichard (Le Chaudron)",
    "prestige": 3,
    "formation": "4-3-3",
    "budgetEur": 35.0,
    "colors": {"primary": "#008000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Olympique Lyonnais"],
    "playStyle": "O Caldeirão Verde (Le Chaudron): 10 vezes campeão francês de volta à elite",
    "coachName": "Olivier Dall'Oglio",
    "squad": [
      {"id": "ste_1", "name": "Gautier Larsonneur", "position": "GOL", "ovr": 77, "age": 27, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 4.0},
      {"id": "ste_2", "name": "Zuriko Davitashvili", "position": "PE", "ovr": 78, "age": 23, "nationality": "Geórgia", "flag": "🇬🇪", "marketValueEur": 6.0, "isStar": True}
    ]
  },
  {
    "key": "Montpellier",
    "id": "montpellier",
    "name": "Montpellier HSC",
    "shortName": "Montpellier",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/a/a8/Montpellier_HSC_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade de la Mosson",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#002B49", "secondary": "#FF671F", "text": "#ffffff"},
    "rivalClubs": ["Nîmes", "Marseille"],
    "playStyle": "Futebol de combate no sul da França com liderança de Savanier",
    "coachName": "Jean-Louis Gasset",
    "squad": [
      {"id": "mon_p1", "name": "Benjamin Lecomte", "position": "GOL", "ovr": 78, "age": 33, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 2.5},
      {"id": "mon_p2", "name": "Téji Savanier", "position": "MEI", "ovr": 80, "age": 32, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Auxerre",
    "id": "auxerre",
    "name": "AJ Auxerre",
    "shortName": "Auxerre",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/e0/AJ_Auxerre.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade de l'Abbé-Deschamps",
    "prestige": 2,
    "formation": "3-4-2-1",
    "budgetEur": 25.0,
    "colors": {"primary": "#0055A5", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Dijon"],
    "playStyle": "Tradição histórica de formação da Borgonha sob Christophe Pélissier",
    "coachName": "Christophe Pélissier",
    "squad": [
      {"id": "aux_1", "name": "Donovan Léon", "position": "GOL", "ovr": 76, "age": 32, "nationality": "Guiana Francesa", "flag": "🇬🇫", "marketValueEur": 1.2},
      {"id": "aux_2", "name": "Gaëtan Perrin", "position": "MEI", "ovr": 77, "age": 28, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 4.0, "isStar": True}
    ]
  },
  {
    "key": "Angers",
    "id": "angers",
    "name": "Angers SCO",
    "shortName": "Angers",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_Angers_SCO.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Raymond-Kopa",
    "prestige": 2,
    "formation": "4-2-3-1",
    "budgetEur": 20.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Nantes"],
    "playStyle": "Espírito aguerrido do vale do Loire buscando permanência firme",
    "coachName": "Alexandre Dujeux",
    "squad": [
      {"id": "ang_1", "name": "Yahia Fofana", "position": "GOL", "ovr": 77, "age": 24, "nationality": "Costa do Marfim", "flag": "🇨🇮", "marketValueEur": 4.0},
      {"id": "ang_2", "name": "Himad Abdelli", "position": "MEI", "ovr": 77, "age": 25, "nationality": "Argélia", "flag": "🇩🇿", "marketValueEur": 5.0, "isStar": True}
    ]
  },
  {
    "key": "Le Havre",
    "id": "le_havre",
    "name": "Le Havre AC",
    "shortName": "Le Havre",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/ec/Le_Havre_AC_logo.svg",
    "leagueId": "ligue_1",
    "league": "Ligue 1",
    "country": "França",
    "stadium": "Stade Océane",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 20.0,
    "colors": {"primary": "#002B49", "secondary": "#87CEEB", "text": "#ffffff"},
    "rivalClubs": ["Caen"],
    "playStyle": "O clube pioneiro francês com jovens das categorias de base da Normandia",
    "coachName": "Didier Digard",
    "squad": [
      {"id": "hav_1", "name": "Arthur Desmas", "position": "GOL", "ovr": 76, "age": 30, "nationality": "França", "flag": "🇫🇷", "marketValueEur": 2.0},
      {"id": "hav_2", "name": "Abdoulaye Touré", "position": "VOL", "ovr": 76, "age": 30, "nationality": "Guiné", "flag": "🇬🇳", "marketValueEur": 2.5, "isStar": True}
    ]
  },

  # ==========================================
  # ESCÓCIA - SCOTTISH PREMIERSHIP (COMPLETANDO 12 CLUBES)
  # ==========================================
  {
    "key": "Dundee United",
    "id": "dundee_united",
    "name": "Dundee United FC",
    "shortName": "Dundee Utd",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/7/75/Dundee_United_FC_logo.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "Tannadice Park",
    "prestige": 3,
    "formation": "3-4-2-1",
    "budgetEur": 15.0,
    "colors": {"primary": "#F78F1E", "secondary": "#000000", "text": "#ffffff"},
    "rivalClubs": ["Dundee FC", "Aberdeen"],
    "playStyle": "Os Tangerines em Tannadice com futebol físico e contra-ataques",
    "coachName": "Jim Goodwin",
    "squad": [
      {"id": "dut_1", "name": "Jack Walton", "position": "GOL", "ovr": 74, "age": 26, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.2},
      {"id": "dut_2", "name": "Luca Stephenson", "position": "MC", "ovr": 74, "age": 21, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.5, "isStar": True}
    ]
  },
  {
    "key": "St. Mirren",
    "id": "st_mirren",
    "name": "St. Mirren FC",
    "shortName": "St. Mirren",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/90/St_Mirren_FC_badge.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "The SMiSA Stadium",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 12.0,
    "colors": {"primary": "#000000", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Greenock Morton"],
    "playStyle": "Futebol direto e eficiente em Paisley de Stephen Robinson",
    "coachName": "Stephen Robinson",
    "squad": [
      {"id": "stm_1", "name": "Ellery Balcombe", "position": "GOL", "ovr": 73, "age": 25, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 0.8},
      {"id": "stm_2", "name": "Toyosi Olusanya", "position": "CA", "ovr": 74, "age": 27, "nationality": "Inglaterra", "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "marketValueEur": 1.0, "isStar": True}
    ]
  },
  {
    "key": "Kilmarnock",
    "id": "kilmarnock",
    "name": "Kilmarnock FC",
    "shortName": "Kilmarnock",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/e/eb/Kilmarnock_crest.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "Rugby Park",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 14.0,
    "colors": {"primary": "#0033A0", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Ayr United"],
    "playStyle": "Killie clássico em Rugby Park com marcação pesada de Derek McInnes",
    "coachName": "Derek McInnes",
    "squad": [
      {"id": "kil_1", "name": "Kieran O'Hara", "position": "GOL", "ovr": 73, "age": 28, "nationality": "Irlanda", "flag": "🇮🇪", "marketValueEur": 0.7},
      {"id": "kil_2", "name": "Marley Watkins", "position": "CA", "ovr": 75, "age": 34, "nationality": "País de Gales", "flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "marketValueEur": 0.8, "isStar": True}
    ]
  },
  {
    "key": "Dundee FC",
    "id": "dundee_fc",
    "name": "Dundee FC",
    "shortName": "Dundee",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/9/9f/Dundee_F.C._logo.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "Dens Park",
    "prestige": 2,
    "formation": "3-5-2",
    "budgetEur": 12.0,
    "colors": {"primary": "#001B44", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Dundee United"],
    "playStyle": "Os Dark Blues de Dens Park com futebol dinâmico",
    "coachName": "Tony Docherty",
    "squad": [
      {"id": "dee_1", "name": "Jon McCracken", "position": "GOL", "ovr": 73, "age": 24, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 0.8},
      {"id": "dee_2", "name": "Lyall Cameron", "position": "MC", "ovr": 75, "age": 22, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 2.0, "isStar": True}
    ]
  },
  {
    "key": "St. Johnstone",
    "id": "st_johnstone",
    "name": "St. Johnstone FC",
    "shortName": "St. Johnstone",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/1/14/St_Johnstone_FC_crest.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "McDiarmid Park",
    "prestige": 2,
    "formation": "4-4-2",
    "budgetEur": 10.0,
    "colors": {"primary": "#003F87", "secondary": "#ffffff", "text": "#ffffff"},
    "rivalClubs": ["Dundee FC"],
    "playStyle": "Espírito combativo dos Saints em Perth",
    "coachName": "Simo Valakari",
    "squad": [
      {"id": "stj_1", "name": "Ross Sinclair", "position": "GOL", "ovr": 72, "age": 23, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 0.5},
      {"id": "stj_2", "name": "Benjamin Kimpioka", "position": "CA", "ovr": 74, "age": 24, "nationality": "Suécia", "flag": "🇸🇪", "marketValueEur": 1.2, "isStar": True}
    ]
  },
  {
    "key": "Ross County",
    "id": "ross_county",
    "name": "Ross County FC",
    "shortName": "Ross County",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/en/c/c5/Ross_County_FC_crest.svg",
    "leagueId": "scottish_premiership",
    "league": "Premiership",
    "country": "Escócia",
    "stadium": "Global Energy Stadium (Victoria Park)",
    "prestige": 2,
    "formation": "3-4-1-2",
    "budgetEur": 10.0,
    "colors": {"primary": "#002B49", "secondary": "#CC0000", "text": "#ffffff"},
    "rivalClubs": ["Inverness CT"],
    "playStyle": "Os Staggies das Terras Altas com futebol direto e raça",
    "coachName": "Don Cowie",
    "squad": [
      {"id": "ros_1", "name": "Ross Laidlaw", "position": "GOL", "ovr": 73, "age": 32, "nationality": "Escócia", "flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "marketValueEur": 0.6},
      {"id": "ros_2", "name": "Ronan Hale", "position": "CA", "ovr": 75, "age": 26, "nationality": "Irlanda", "flag": "🇮🇪", "marketValueEur": 1.5, "isStar": True}
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

    for club in CONTINENTAL_CLUBS:
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

    print(f"Sucesso! {added} clubes continentais adicionados.")

if __name__ == '__main__':
    run()
