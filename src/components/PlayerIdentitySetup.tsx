import React, { useState, useRef } from 'react';
import { Foot, PlayerProfile, Position } from '../types';
import { COUNTRIES, Country } from '../data/countries';
import { JerseyPreview } from './JerseyPreview';
import { TacticalPitch } from './TacticalPitch';
import { ClubBadge } from './ClubBadge';
import { CLUBS, findClub, getStartingClubsForNationality, getCountryCatalog, getClubsFiltered } from '../data/clubs';
import { ensureSupplementalClubsHydrated } from '../services/syncLeagueSimulationService';
import { ensurePlayerEconomy } from '../services/economyAndContractService';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import { signInWithGoogle, loadCareerFromCloud, importSaveFromJsonString } from '../services/cloudSaveService';
import { getArchetypesForPosition, PlayerArchetype } from '../data/archetypes';
import { Search, Check, Sparkles, Shield, Compass, ChevronRight, MapPin, Globe, Filter, Layers, Cloud, Upload } from 'lucide-react';

interface PlayerIdentitySetupProps {
  onComplete: (player: PlayerProfile) => void;
  onLoadExistingCareer?: (player: PlayerProfile) => void;
}

export const PlayerIdentitySetup: React.FC<PlayerIdentitySetupProps> = ({ onComplete, onLoadExistingCareer }) => {
  const [importBusy, setImportBusy] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleLoadFromCloud = async () => {
    if (!onLoadExistingCareer) return;
    setImportBusy(true);
    setImportMsg(null);
    try {
      const user = await signInWithGoogle();
      const loaded = await loadCareerFromCloud(user.uid);
      onLoadExistingCareer(loaded.player);
    } catch (err: any) {
      setImportMsg({ ok: false, text: err?.message || 'Não foi possível carregar da nuvem.' });
    } finally {
      setImportBusy(false);
    }
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onLoadExistingCareer) return;
    try {
      const txt = await file.text();
      const restored = importSaveFromJsonString(txt);
      onLoadExistingCareer(restored);
    } catch (err: any) {
      setImportMsg({ ok: false, text: err?.message || 'Arquivo de save inválido.' });
    } finally {
      if (importInputRef.current) importInputRef.current.value = '';
    }
  };
  ensureSupplementalClubsHydrated();
  const [surname, setSurname] = useState('SANDS');
  const [firstName, setFirstName] = useState('Pedro');
  const [number, setNumber] = useState<number>(10);
  const [dominantFoot, setDominantFoot] = useState<Foot>('Direita');
  const [startingAge, setStartingAge] = useState<number>(17);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.name === 'Brasil') || COUNTRIES[0]
  );
  const [selectedPosition, setSelectedPosition] = useState<Position>('MEI');
  const [selectedClubId, setSelectedClubId] = useState<string>('novorizontino');
  const [clubDivisionTab, setClubDivisionTab] = useState<'tier3' | 'tier2' | 'tier1' | 'international'>('tier2');
  const [searchQuery, setSearchQuery] = useState('');

  // Catálogo e Filtro Hierárquico de Ligas Estrangeiras (País ➔ Liga ➔ Clube)
  const countryCatalog = getCountryCatalog();
  const [filterCountryName, setFilterCountryName] = useState<string>('Inglaterra');
  const activeCountryCatalog = countryCatalog.find(c => c.name === filterCountryName) || countryCatalog[0];
  const [filterLeagueId, setFilterLeagueId] = useState<string>(activeCountryCatalog?.leagues[0]?.id || 'premier_league');

  // Estilo de Jogo dinâmico baseado na posição escolhida
  const availableArchetypes = getArchetypesForPosition(selectedPosition);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>(availableArchetypes[0].id);

  // Se a posição mudar e o arquétipo atual não pertencer a ela, seleciona o primeiro compatível
  const currentArchetype = availableArchetypes.find(a => a.id === selectedArchetypeId) || availableArchetypes[0];

  const handlePositionChange = (pos: Position) => {
    setSelectedPosition(pos);
    const newArchetypes = getArchetypesForPosition(pos);
    if (!newArchetypes.some(a => a.id === selectedArchetypeId)) {
      setSelectedArchetypeId(newArchetypes[0].id);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Adapta os clubes de início para o país escolhido (prioriza 2ª divisão do país para início de carreira)
    const { secondTierClubs, firstTierClubs } = getStartingClubsForNationality(country.name);
    const recommended = secondTierClubs.length > 0 ? secondTierClubs : firstTierClubs;
    if (recommended.length > 0) {
      setSelectedClubId(recommended[0].id);
      setClubDivisionTab(secondTierClubs.length > 0 ? 'tier2' : 'tier1');
    }
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Busca segura que nunca falha e reflete 100% a escolha do usuário
  const selectedClub = findClub(selectedClubId);

  // Separa clubes por divisões da nacionalidade escolhida
  const { thirdTierClubs, secondTierClubs, firstTierClubs, internationalClubs } = getStartingClubsForNationality(selectedCountry.name);

  const handleConfirm = () => {
    // Atributos base equilibrados
    const baseAttrs = {
      finalization: 64,
      passing: 66,
      dribbling: 68,
      pace: 70,
      defense: 50,
      physical: 62,
      vision: 68
    };

    // Aplica os modificadores do estilo de jogo escolhido (ex: Lateral Ofensivo)
    if (currentArchetype.attributeModifiers) {
      Object.entries(currentArchetype.attributeModifiers).forEach(([key, val]) => {
        if (val !== undefined && key in baseAttrs) {
          (baseAttrs as any)[key] = Math.min(99, Math.max(30, (baseAttrs as any)[key] + val));
        }
      });
    }

    // Bônus de maturidade caso comece com mais idade
    const ageBonus = (startingAge - 17) * 2;
    const calculatedOvr = Math.min(99, Math.max(55, Math.round(
      (baseAttrs.finalization + baseAttrs.passing + baseAttrs.dribbling + baseAttrs.pace + baseAttrs.defense + baseAttrs.physical + baseAttrs.vision) / 7
    ) + ageBonus));

    const newPlayer: PlayerProfile = {
      id: 'player_' + Date.now(),
      name: firstName.trim() || 'Craque',
      surname: surname.trim() || 'SANDS',
      number: number || 10,
      nationality: selectedCountry.name,
      flag: selectedCountry.flag,
      position: selectedPosition,
      preferredFoot: dominantFoot,
      playStyleId: currentArchetype.id,
      playStyleName: currentArchetype.name,
      age: startingAge,
      seasonYear: 2026,
      currentMatchDay: 1,
      currentClub: selectedClub.name,
      ovr: calculatedOvr,
      marketValueEur: selectedClub.leagueId === 'premier_league' ? 8.0 : selectedClub.leagueId === 'serie_a' ? 4.5 : 2.0,
      energy: 100,
      moral: 85,
      lifestylePersona: 'disciplinado_extremo',
      lifestylePersonaLabel: 'Profissional Obsessivo (Zero Festas)',
      attributes: baseAttrs,
      relationships: {
        coach: 65,
        fans: 75,
        board: 70,
        teammates: 70,
        veteransRespect: 75,
        partyCliqueChemistry: 55
      },
      personalityTags: [startingAge <= 17 ? 'Jovem Promessa' : 'Revelação', currentArchetype.name, ...currentArchetype.tags],
      rivals: [],
      memories: [
        {
          id: 'mem_debut',
          age: startingAge,
          seasonYear: 2026,
          club: selectedClub.name,
          category: 'milestone',
          title: `Primeiro Contrato Profissional no ${selectedClub.name}`,
          description: `Assinou aos ${startingAge} anos com o ${selectedClub.name} (${selectedClub.league}) vestindo a camisa #${number}. Estilo tático: ${currentArchetype.name}.`,
          impactSummary: `Início oficial da jornada profissional aos ${startingAge} anos`,
          tags: ['estreia', 'profissional', currentArchetype.id, selectedClub.shortName.toLowerCase()],
          importance: 'alta',
          dateStr: `Ano 2026 • ${startingAge} anos`
        }
      ],
      history: [], // Histórico limpo, 100% construído pelo jogador a partir da Rodada 1!
      currentSeasonStats: {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        ratingSum: 0
      },
      careerTotals: {
        games: 0,
        goals: 0,
        assists: 0,
        trophies: 0
      }
    };

    onComplete(ensurePlayerEconomy(newPlayer));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#12151c] border border-slate-800/80 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Defina sua identidade & Estilo de Jogo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Personalize seu atleta, escolha onde começar e defina seu arquétipo tático em campo.
          </p>
        </div>

        {onLoadExistingCareer && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isFirebaseConfigured() && (
              <button
                type="button"
                disabled={importBusy}
                onClick={handleLoadFromCloud}
                className="px-3 py-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Carregar da Nuvem</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-[#181d28] hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importar Save (.json)</span>
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportJson}
              className="hidden"
            />
          </div>
        )}
      </div>

      {importMsg && (
        <div className={`p-3 rounded-xl border text-xs font-bold ${
          importMsg.ok
            ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
            : 'bg-rose-950/50 border-rose-700 text-rose-200'
        }`}>
          {importMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Coluna 1: Identidade & Camisa */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 self-start">Identidade</h2>
          
          {/* Camisa vestindo as cores oficiais do clube escolhido */}
          <JerseyPreview
            surname={surname}
            number={number}
            primaryColor={selectedClub.colors.primary}
            secondaryColor={selectedClub.colors.secondary}
            textColor={selectedClub.colors.text}
          />

          <div className="w-full space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sobrenome
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={e => setSurname(e.target.value.toUpperCase())}
                  maxLength={12}
                  className="w-full bg-[#181c26] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Número
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={number}
                  onChange={e => setNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#181c26] border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm text-center focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Escolha da Idade Inicial */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Idade Inicial
                </label>
                <span className="text-[10px] font-bold text-emerald-400">
                  {startingAge === 16 ? 'Joia da Base' : startingAge <= 18 ? 'Estreia Profissional' : 'Atleta Pronto'}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-1 bg-[#181c26] p-1 rounded-xl border border-slate-800">
                {[16, 17, 18, 19, 20, 21].map(ageVal => (
                  <button
                    key={ageVal}
                    type="button"
                    onClick={() => setStartingAge(ageVal)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      startingAge === ageVal
                        ? 'bg-white text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ageVal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
                Perna Dominante
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#181c26] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setDominantFoot('Esquerda')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    dominantFoot === 'Esquerda'
                      ? 'bg-white text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Esquerda
                </button>
                <button
                  type="button"
                  onClick={() => setDominantFoot('Direita')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all ${
                    dominantFoot === 'Direita'
                      ? 'bg-white text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Direita
                </button>
              </div>
            </div>

            {/* Mini Card de Prévia do Clube Atualmente Selecionado */}
            <div className="space-y-1.5">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Clube Escolhido ({selectedCountry.name})
              </span>
              <div className="bg-[#181c26]/90 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-2.5 truncate">
                  <ClubBadge club={selectedClub} size="sm" />
                  <div className="truncate">
                    <span className="text-xs font-bold text-white block leading-tight truncate">{selectedClub.name}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{selectedClub.stadium}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 block">
                    {selectedClub.league}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                    Téc. {selectedClub.coachName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Posição & Prancheta Tática */}
        <div className="flex flex-col items-center space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 self-start">Posição Tática</h2>
          <TacticalPitch
            selectedPosition={selectedPosition}
            onSelectPosition={handlePositionChange}
          />
        </div>

        {/* Coluna 3: Nacionalidade */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-sm font-semibold text-slate-400">Nacionalidade</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar país"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#181c26] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {filteredCountries.map(country => {
              const isSelected = selectedCountry.name === country.name;
              return (
                <button
                  key={country.name}
                  type="button"
                  onClick={() => handleCountryChange(country)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-950/80 border border-emerald-500 text-white'
                      : 'bg-[#181d28]/60 hover:bg-[#1f2430] text-slate-300 border border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* SEÇÃO PRINCIPAL: ESCOLHA VISUAL DO CLUBE ONDE SUA CARREIRA COMEÇA */}
      <div className="bg-[#181d28]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Onde sua Carreira Começa?</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 font-mono font-bold">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Toque no clube desejado para assinar seu primeiro contrato profissional.
              </p>
            </div>
          </div>

          {/* Abas de Divisão do País */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#12151c] p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            {thirdTierClubs.length > 0 && (
              <button
                type="button"
                onClick={() => setClubDivisionTab('tier3')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  clubDivisionTab === 'tier3'
                    ? 'bg-amber-400 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3ª Divisão (Série C)
              </button>
            )}
            {secondTierClubs.length > 0 && (
              <button
                type="button"
                onClick={() => setClubDivisionTab('tier2')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  clubDivisionTab === 'tier2'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2ª Divisão (Base & Minutagem)
              </button>
            )}
            {firstTierClubs.length > 0 && (
              <button
                type="button"
                onClick={() => setClubDivisionTab('tier1')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  clubDivisionTab === 'tier1'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1ª Divisão (Gigantes)
              </button>
            )}
            <button
              type="button"
              onClick={() => setClubDivisionTab('international')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                clubDivisionTab === 'international'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Outras Ligas (País ➔ Liga ➔ Time)
            </button>
          </div>
        </div>

        {/* FILTRO HIERÁRQUICO QUANDO ESTIVER EM OUTRAS LIGAS: PAÍS ➔ LIGA ➔ CLUBE */}
        {clubDivisionTab === 'international' && (
          <div className="bg-[#12151c] border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-inner animate-in fade-in duration-150">
            
            {/* 1º Passo: Escolha o País */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                1º Passo: Escolha o País ({countryCatalog.length} Países Disponíveis)
              </span>
              <div className="flex flex-wrap items-center gap-2 pb-1">
                {countryCatalog.map(c => {
                  const isCountrySelected = filterCountryName === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setFilterCountryName(c.name);
                        if (c.leagues.length > 0) {
                          setFilterLeagueId(c.leagues[0].id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isCountrySelected
                          ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 scale-[1.02]'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">({c.totalClubs})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2º Passo: Escolha da Liga */}
            {activeCountryCatalog && activeCountryCatalog.leagues.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  2º Passo: Escolha a Liga ({activeCountryCatalog.flag} {activeCountryCatalog.name})
                </span>
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  {activeCountryCatalog.leagues.map(league => {
                    const isLeagueSelected = filterLeagueId === league.id;
                    return (
                      <button
                        key={league.id}
                        type="button"
                        onClick={() => setFilterLeagueId(league.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isLeagueSelected
                            ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 scale-[1.02]'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        <span>{league.name}</span>
                        <span className="text-[10px] opacity-75 font-mono">({league.clubCount} times)</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Grade de Clubes Clicáveis com Escudo Grande, Cores e Estádio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(clubDivisionTab === 'tier3' && thirdTierClubs.length > 0
            ? thirdTierClubs
            : clubDivisionTab === 'tier2' && secondTierClubs.length > 0 
            ? secondTierClubs 
            : clubDivisionTab === 'tier1' && firstTierClubs.length > 0 
            ? firstTierClubs 
            : getClubsFiltered(filterCountryName, filterLeagueId)
          ).map(club => {
            const isSelected = selectedClub.id === club.id;

            return (
              <button
                key={club.id}
                type="button"
                onClick={() => setSelectedClubId(club.id)}
                className={`text-left p-3.5 rounded-2xl border flex items-center justify-between space-x-3 transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] ring-1 ring-emerald-500'
                    : 'bg-[#12151c] border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-[#151922]'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <ClubBadge club={club} size="md" />
                  <div className="truncate">
                    <h4 className="font-extrabold text-sm text-white truncate">{club.name}</h4>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{club.stadium}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold block">
                      Téc. {club.coachName}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-transparent">
                      •
                    </div>
                  )}
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                    {club.league.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEÇÃO ESPECIAL: ESTILO DE JOGO & ARQUÉTIPO (O diferencial solicitado!) */}
      <div className="bg-[#181d28]/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Estilo de Jogo & Arquétipo ({selectedPosition})
              </h3>
              <p className="text-xs text-slate-400">
                Seu arquétipo define pontos fortes, fraquezas e como você aparece nos lances das partidas.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableArchetypes.map(archetype => {
            const isSelected = selectedArchetypeId === archetype.id;

            return (
              <button
                key={archetype.id}
                type="button"
                onClick={() => setSelectedArchetypeId(archetype.id)}
                className={`text-left p-4 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                    : 'bg-[#12151c] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-extrabold text-sm text-white">{archetype.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{archetype.description}</p>
                </div>

                <div className="space-y-1 text-[10px] pt-1 border-t border-slate-800">
                  <div className="text-emerald-400 font-semibold leading-tight">
                    ▲ Vantagem: {archetype.pros}
                  </div>
                  <div className="text-rose-400 font-semibold leading-tight">
                    ▼ Desvantagem: {archetype.cons}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Botões do Rodapé */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSurname('SANDS');
            setNumber(10);
            setSelectedPosition('MEI');
            setSelectedClubId('novorizontino');
            setStartingAge(17);
          }}
          className="px-5 py-2.5 rounded-full text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          Redefinir
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-sm hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Confirmar identidade & Iniciar Carreira</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
