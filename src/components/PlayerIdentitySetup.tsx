import React, { useState, useRef, useMemo } from 'react';
import { Foot, PlayerProfile, Position } from '../types';
import { COUNTRIES, Country } from '../data/countries';
import { JerseyPreview } from './JerseyPreview';
import { TacticalPitch } from './TacticalPitch';
import { ClubBadge } from './ClubBadge';
import {
  findClub,
  getStartingClubsForNationality,
  getCountryCatalog,
  getClubsFiltered
} from '../data/clubs';
import { ensureSupplementalClubsHydrated } from '../services/syncLeagueSimulationService';
import { ensurePlayerEconomy } from '../services/economyAndContractService';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import { signInWithGoogle, loadCareerFromCloud, importSaveFromJsonString } from '../services/cloudSaveService';
import {
  getArchetypesForPosition,
  getPositionBaseAttributes,
  deriveArchetypeFromAttributes,
  getSuggestedPointsForArchetype,
  CORE_ATTRIBUTE_LABELS,
  CoreAttributeKey
} from '../data/archetypes';
import { triggerHaptic } from '../services/hapticsService';
import {
  Search,
  Check,
  Sparkles,
  Shield,
  Compass,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Globe,
  Layers,
  Cloud,
  Upload,
  User,
  Sliders,
  Plus,
  Minus,
  RotateCcw,
  Wand2
} from 'lucide-react';

interface PlayerIdentitySetupProps {
  onComplete: (player: PlayerProfile) => void;
  onLoadExistingCareer?: (player: PlayerProfile) => void;
}

const CREATION_POINTS_TOTAL = 28;
const MAX_POINTS_PER_ATTR = 18;
const CORE_KEYS = Object.keys(CORE_ATTRIBUTE_LABELS) as CoreAttributeKey[];

const EMPTY_POINTS: Record<CoreAttributeKey, number> = {
  finalization: 0,
  passing: 0,
  dribbling: 0,
  pace: 0,
  defense: 0,
  physical: 0,
  vision: 0
};

export const PlayerIdentitySetup: React.FC<PlayerIdentitySetupProps> = ({
  onComplete,
  onLoadExistingCareer
}) => {
  ensureSupplementalClubsHydrated();

  // Wizard Steps: 1 (Identidade & País) -> 2 (Posição, Atributos & Estilo) -> 3 (Clube Inicial)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Cloud / JSON Import
  const [importBusy, setImportBusy] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Etapa 1: Nome, Sobrenome, Apelido/Conhecido, Número, Idade, Perna e País
  const [firstName, setFirstName] = useState('Pedro');
  const [lastName, setLastName] = useState('Sandoval');
  const [knownName, setKnownName] = useState('SANDS');
  const [number, setNumber] = useState<number>(10);
  const [dominantFoot, setDominantFoot] = useState<Foot>('Direita');
  const [startingAge, setStartingAge] = useState<number>(17);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES.find(c => c.name === 'Brasil') || COUNTRIES[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [step1Error, setStep1Error] = useState<string | null>(null);

  // Etapa 2: Posição + Atributos Livres que definem o Estilo de Jogo
  const [selectedPosition, setSelectedPosition] = useState<Position>('MEI');
  const [allocatedPoints, setAllocatedPoints] = useState<Record<CoreAttributeKey, number>>(() => {
    const initialArchs = getArchetypesForPosition('MEI');
    return getSuggestedPointsForArchetype('MEI', initialArchs[0], CREATION_POINTS_TOTAL);
  });

  // Etapa 3: Clube Inicial
  const [selectedClubId, setSelectedClubId] = useState<string>('novorizontino');
  const [clubDivisionTab, setClubDivisionTab] = useState<'tier3' | 'tier2' | 'tier1' | 'international'>('tier2');
  const countryCatalog = getCountryCatalog();
  const [filterCountryName, setFilterCountryName] = useState<string>('Inglaterra');
  const activeCountryCatalog =
    countryCatalog.find(c => c.name === filterCountryName) || countryCatalog[0];
  const [filterLeagueId, setFilterLeagueId] = useState<string>(
    activeCountryCatalog?.leagues[0]?.id || 'premier_league'
  );

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

  const handlePositionChange = (pos: Position) => {
    triggerHaptic('tap');
    setSelectedPosition(pos);
    const archs = getArchetypesForPosition(pos);
    setAllocatedPoints(getSuggestedPointsForArchetype(pos, archs[0], CREATION_POINTS_TOTAL));
  };

  const handleCountryChange = (country: Country) => {
    triggerHaptic('tap');
    setSelectedCountry(country);
    const { secondTierClubs, firstTierClubs, thirdTierClubs } = getStartingClubsForNationality(country.name);
    const recommended = secondTierClubs.length > 0 ? secondTierClubs : firstTierClubs;
    if (recommended.length > 0) {
      setSelectedClubId(recommended[0].id);
      setClubDivisionTab(secondTierClubs.length > 0 ? 'tier2' : thirdTierClubs.length > 0 ? 'tier3' : 'tier1');
    }
  };

  // Cálculos da Etapa 2 (Base + Pontos + Estilo Conquistado)
  const baseAttributes = useMemo(
    () => getPositionBaseAttributes(selectedPosition),
    [selectedPosition]
  );

  const usedPoints = useMemo(
    () => CORE_KEYS.reduce((sum, key) => sum + (allocatedPoints[key] || 0), 0),
    [allocatedPoints]
  );
  const remainingPoints = CREATION_POINTS_TOTAL - usedPoints;

  const finalAttributes = useMemo(() => {
    const merged = { ...baseAttributes };
    CORE_KEYS.forEach(k => {
      merged[k] = Math.min(99, Math.max(30, baseAttributes[k] + (allocatedPoints[k] || 0)));
    });
    return merged;
  }, [baseAttributes, allocatedPoints]);

  const derivedStyle = useMemo(
    () => deriveArchetypeFromAttributes(selectedPosition, finalAttributes),
    [selectedPosition, finalAttributes]
  );

  const availableArchetypes = useMemo(
    () => getArchetypesForPosition(selectedPosition),
    [selectedPosition]
  );

  const ageBonus = (startingAge - 17) * 2;
  const previewOvr = Math.min(
    99,
    Math.max(
      55,
      Math.round(
        CORE_KEYS.reduce((acc, k) => acc + finalAttributes[k], 0) / CORE_KEYS.length + ageBonus
      )
    )
  );

  const adjustAttributePoint = (key: CoreAttributeKey, delta: number) => {
    const curr = allocatedPoints[key] || 0;
    if (delta > 0 && (remainingPoints <= 0 || curr >= MAX_POINTS_PER_ATTR)) return;
    if (delta < 0 && curr <= 0) return;
    triggerHaptic('tap');
    setAllocatedPoints(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(MAX_POINTS_PER_ATTR, (prev[key] || 0) + delta))
    }));
  };

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClub = findClub(selectedClubId);
  const { thirdTierClubs, secondTierClubs, firstTierClubs, internationalClubs } =
    getStartingClubsForNationality(selectedCountry.name);

  const displayKnown = knownName.trim() || firstName.trim() || lastName.trim() || 'CRAQUE';

  const handleGoToStep2 = () => {
    if (!firstName.trim()) {
      setStep1Error('Preencha o Nome do jogador para continuar.');
      return;
    }
    if (!lastName.trim()) {
      setStep1Error('Preencha o Sobrenome do jogador para continuar.');
      return;
    }
    if (!knownName.trim()) {
      setStep1Error('Informe como o jogador é conhecido (nome na camisa e narração).');
      return;
    }
    setStep1Error(null);
    triggerHaptic('tap');
    setStep(2);
  };

  const handleGoToStep3 = () => {
    triggerHaptic('tap');
    setStep(3);
  };

  const handleConfirm = () => {
    const cleanFirst = firstName.trim() || 'Pedro';
    const cleanLast = lastName.trim() || 'Silva';
    const cleanKnown = knownName.trim() || cleanFirst.toUpperCase();
    const chosenArch = derivedStyle.archetype;

    const newPlayer: PlayerProfile = {
      id: 'player_' + Date.now(),
      name: cleanFirst,
      lastName: cleanLast,
      knownName: cleanKnown,
      surname: cleanKnown, // Mantém compatibilidade total em narrações, notícias e IA
      number: number || 10,
      nationality: selectedCountry.name,
      flag: selectedCountry.flag,
      position: selectedPosition,
      preferredFoot: dominantFoot,
      playStyleId: chosenArch.id,
      playStyleName: chosenArch.name,
      age: startingAge,
      seasonYear: 2026,
      currentMatchDay: 1,
      currentWeekDay: 1,
      currentClub: selectedClub.name,
      ovr: previewOvr,
      marketValueEur:
        selectedClub.leagueId === 'premier_league'
          ? 8.0
          : selectedClub.leagueId === 'serie_a'
          ? 4.5
          : 2.0,
      energy: 100,
      moral: 85,
      lifestylePersona: 'disciplinado_extremo',
      lifestylePersonaLabel: 'Profissional Obsessivo (Zero Festas)',
      attributes: finalAttributes,
      relationships: {
        coach: 65,
        fans: 75,
        board: 70,
        teammates: 70,
        veteransRespect: 75,
        partyCliqueChemistry: 55
      },
      personalityTags: [
        startingAge <= 17 ? 'Jovem Promessa' : 'Revelação',
        chosenArch.name,
        ...chosenArch.tags
      ],
      rivals: [],
      memories: [
        {
          id: 'mem_debut',
          age: startingAge,
          seasonYear: 2026,
          club: selectedClub.name,
          category: 'milestone',
          title: `Primeiro Contrato Profissional no ${selectedClub.name}`,
          description: `${cleanFirst} ${cleanLast}, conhecido nos gramados como "${cleanKnown}", assinou aos ${startingAge} anos com o ${selectedClub.name} (${selectedClub.league}) vestindo a camisa #${number}. Estilo conquistado: ${chosenArch.name}.`,
          impactSummary: `Início oficial da jornada profissional aos ${startingAge} anos`,
          tags: ['estreia', 'profissional', chosenArch.id, selectedClub.shortName.toLowerCase()],
          importance: 'alta',
          dateStr: `Ano 2026 • ${startingAge} anos`
        }
      ],
      history: [],
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

    triggerHaptic('trophy_award');
    onComplete(ensurePlayerEconomy(newPlayer));
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-[#12151c] border border-slate-800/80 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* Topo + Cloud / JSON Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
            Criação de Carreira • Etapa {step} de 3
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {step === 1 && 'Identidade, Nacionalidade & Camisa'}
            {step === 2 && 'Posição, Atributos & Estilo de Jogo'}
            {step === 3 && 'Escolha seu Clube Inicial'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {step === 1 && 'Defina nome completo, como você será chamado nas narrações, número e país.'}
            {step === 2 && 'Escolha onde atua em campo e distribua pontos nos atributos para desbloquear seu estilo.'}
            {step === 3 && 'Assine seu primeiro contrato profissional e comece sua trajetória.'}
          </p>
        </div>

        {onLoadExistingCareer && step === 1 && (
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

      {/* Stepper Visual Fluido */}
      <div className="grid grid-cols-3 gap-2 bg-[#0d1017] p-1.5 rounded-2xl border border-slate-800">
        {[
          { num: 1 as const, label: '1. Identidade & País', icon: <User className="w-3.5 h-3.5" /> },
          { num: 2 as const, label: '2. Posição & Estilo', icon: <Sliders className="w-3.5 h-3.5" /> },
          { num: 3 as const, label: '3. Clube Inicial', icon: <Shield className="w-3.5 h-3.5" /> }
        ].map(item => {
          const isCurrent = step === item.num;
          const isDone = step > item.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => {
                if (item.num < step) setStep(item.num);
              }}
              disabled={item.num > step}
              className={`py-2.5 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                isCurrent
                  ? 'bg-emerald-500 text-black shadow-md'
                  : isDone
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 cursor-pointer hover:bg-emerald-900/50'
                  : 'text-slate-500 cursor-not-allowed'
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : item.icon}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {importMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-bold ${
            importMsg.ok
              ? 'bg-emerald-950/50 border-emerald-700 text-emerald-200'
              : 'bg-rose-950/50 border-rose-700 text-rose-200'
          }`}
        >
          {importMsg.text}
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 1: NOME, SOBRENOME, CONHECIDO, PAÍS E NÚMERO */}
      {/* ===================================================================== */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Camisa ao vivo */}
            <div className="lg:col-span-4 flex flex-col items-center bg-[#161b26] border border-slate-800 rounded-2xl p-5 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Prévia da Camisa
              </span>
              <JerseyPreview
                surname={displayKnown}
                number={number}
                primaryColor="#10b981"
                secondaryColor="#064e3b"
                textColor="#ffffff"
              />
              <div className="text-center space-y-0.5">
                <p className="text-sm font-black text-white">
                  {selectedCountry.flag} {firstName || 'Nome'} {lastName || 'Sobrenome'}
                </p>
                <p className="text-xs text-emerald-400 font-bold">
                  Conhecido como: "{displayKnown}" • #{number}
                </p>
              </div>
            </div>

            {/* Campos de Identidade */}
            <div className="lg:col-span-4 space-y-3.5 bg-[#161b26] border border-slate-800 rounded-2xl p-5">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Dados do Atleta</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Pedro"
                    value={firstName}
                    onChange={e => {
                      setFirstName(e.target.value);
                      setStep1Error(null);
                    }}
                    maxLength={18}
                    className="w-full bg-[#0f131b] border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sandoval"
                    value={lastName}
                    onChange={e => {
                      setLastName(e.target.value);
                      setStep1Error(null);
                    }}
                    maxLength={22}
                    className="w-full bg-[#0f131b] border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                    Como é conhecido (Camisa)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: SANDS / PEDRINHO"
                    value={knownName}
                    onChange={e => {
                      setKnownName(e.target.value.toUpperCase());
                      setStep1Error(null);
                    }}
                    maxLength={14}
                    className="w-full bg-[#0f131b] border border-emerald-700/70 rounded-xl px-3 py-2 text-white font-black text-sm focus:outline-none focus:border-emerald-400"
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
                    onChange={e =>
                      setNumber(Math.min(99, Math.max(1, parseInt(e.target.value, 10) || 1)))
                    }
                    className="w-full bg-[#0f131b] border border-slate-700 rounded-xl px-3 py-2 text-white font-black text-sm text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Atalhos rápidos para Apelido */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                <span className="text-slate-500 font-semibold">Sugestões:</span>
                {firstName.trim() && (
                  <button
                    type="button"
                    onClick={() => setKnownName(firstName.trim().toUpperCase())}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Usar "{firstName.trim().toUpperCase()}"
                  </button>
                )}
                {lastName.trim() && (
                  <button
                    type="button"
                    onClick={() => setKnownName(lastName.trim().toUpperCase())}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Usar "{lastName.trim().toUpperCase()}"
                  </button>
                )}
              </div>

              {/* Idade Inicial */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Idade Inicial
                  </label>
                  <span className="text-[10px] font-bold text-emerald-400">
                    {startingAge === 16
                      ? 'Joia da Base'
                      : startingAge <= 18
                      ? 'Estreia Profissional'
                      : 'Atleta Pronto'}
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1 bg-[#0f131b] p-1 rounded-xl border border-slate-800">
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

              {/* Perna Dominante */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Perna Dominante
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-[#0f131b] p-1 rounded-xl border border-slate-800">
                  {(['Esquerda', 'Direita', 'Ambidestro'] as Foot[]).map(foot => (
                    <button
                      key={foot}
                      type="button"
                      onClick={() => setDominantFoot(foot)}
                      className={`py-2 text-[11px] font-bold rounded-lg transition-all ${
                        dominantFoot === foot
                          ? 'bg-white text-black shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {foot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Nacionalidade */}
            <div className="lg:col-span-4 space-y-3 bg-[#161b26] border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>País de Origem</span>
                </h2>
                <span className="text-xs font-bold text-emerald-300">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0f131b] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                {filteredCountries.map(country => {
                  const isSelected = selectedCountry.name === country.name;
                  return (
                    <button
                      key={country.name}
                      type="button"
                      onClick={() => handleCountryChange(country)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-emerald-950/80 border border-emerald-500 text-white'
                          : 'bg-[#0f131b] hover:bg-[#1f2430] text-slate-300 border border-slate-800/60'
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

          {step1Error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-700/70 text-xs font-bold text-rose-200">
              {step1Error}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setFirstName('Pedro');
                setLastName('Sandoval');
                setKnownName('SANDS');
                setNumber(10);
                setStartingAge(17);
                setStep1Error(null);
              }}
              className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              Restaurar Padrão
            </button>

            <button
              type="button"
              onClick={handleGoToStep2}
              className="px-6 sm:px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <span>Avançar: Posição & Atributos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 2: POSIÇÃO & DISTRIBUIÇÃO DE ATRIBUTOS -> GERA ESTILO */}
      {/* ===================================================================== */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Prancheta Tática */}
            <div className="lg:col-span-5 bg-[#161b26] border border-slate-800 rounded-2xl p-5 flex flex-col items-center space-y-3">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-sm font-bold text-white">1. Posição em Campo</h2>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700">
                  {selectedPosition}
                </span>
              </div>
              <TacticalPitch
                selectedPosition={selectedPosition}
                onSelectPosition={handlePositionChange}
              />
            </div>

            {/* Distribuição de Pontos + Estilo Desbloqueado */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>2. Distribua seus Pontos para Definir o Estilo</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Seus atributos moldam automaticamente o estilo de jogo do atleta em campo.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black font-mono border ${
                        remainingPoints > 0
                          ? 'bg-amber-950/70 text-amber-300 border-amber-600/70'
                          : 'bg-emerald-950/70 text-emerald-300 border-emerald-600/70'
                      }`}
                    >
                      Pontos: {remainingPoints}/{CREATION_POINTS_TOTAL}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAllocatedPoints({ ...EMPTY_POINTS })}
                      className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Zerar pontos distribuídos"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sliders/Steppers dos 7 atributos */}
                <div className="space-y-2.5">
                  {CORE_KEYS.map(key => {
                    const meta = CORE_ATTRIBUTE_LABELS[key];
                    const baseVal = baseAttributes[key];
                    const added = allocatedPoints[key] || 0;
                    const totalVal = finalAttributes[key];

                    return (
                      <div
                        key={key}
                        className="bg-[#0f131b] border border-slate-800 rounded-xl p-2.5 flex items-center gap-3"
                      >
                        <div className="w-28 sm:w-36 shrink-0">
                          <span className="text-xs font-bold text-white block leading-tight">
                            {meta.label}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Base {baseVal} {added > 0 ? `+ ${added}` : ''}
                          </span>
                        </div>

                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-150"
                            style={{
                              width: `${Math.min(100, totalVal)}%`,
                              backgroundColor: meta.color
                            }}
                          />
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={added <= 0}
                            onClick={() => adjustAttributePoint(key, -1)}
                            aria-label={`Diminuir ${meta.label}`}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-white flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-8 text-center font-mono text-sm font-black text-white">
                            {totalVal}
                          </span>

                          <button
                            type="button"
                            disabled={remainingPoints <= 0 || added >= MAX_POINTS_PER_ATTR}
                            onClick={() => adjustAttributePoint(key, +1)}
                            aria-label={`Aumentar ${meta.label}`}
                            className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-35 text-black flex items-center justify-center font-black"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Atalhos rápidos para testar perfis da posição */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Wand2 className="w-3 h-3 text-purple-400" />
                    <span>Predefinições rápidas para {selectedPosition} (opcional):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableArchetypes.map(arch => (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic('tap');
                          setAllocatedPoints(
                            getSuggestedPointsForArchetype(selectedPosition, arch, CREATION_POINTS_TOTAL)
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                          derivedStyle.archetype.id === arch.id
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                            : 'bg-[#0f131b] border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {arch.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card do Estilo Conquistado pelos Atributos */}
              <div className="bg-gradient-to-br from-emerald-950/50 via-[#151b26] to-[#12151c] border border-emerald-500/60 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 block">
                        Estilo de Jogo Desbloqueado ({derivedStyle.matchPct}% de afinidade)
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {derivedStyle.archetype.name}
                      </h3>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-black/50 border border-emerald-500/40 text-center">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">OVR Inicial</span>
                    <span className="text-lg font-black text-emerald-400 font-['Teko']">{previewOvr}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {derivedStyle.reason} {derivedStyle.archetype.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-black/35 border border-emerald-900/50 rounded-xl p-2.5 text-emerald-300 font-semibold">
                    ▲ Vantagem: {derivedStyle.archetype.pros}
                  </div>
                  <div className="bg-black/35 border border-rose-900/50 rounded-xl p-2.5 text-rose-300 font-semibold">
                    ▼ Desvantagem: {derivedStyle.archetype.cons}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={handleGoToStep3}
              className="px-6 sm:px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50"
            >
              <span>Avançar: Escolher Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 3: ESCOLHA DO TIME INICIAL */}
      {/* ===================================================================== */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          {/* Resumo Compacto do Jogador Criado + Clube Selecionado */}
          <div className="bg-[#161b26] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-slate-900 border border-emerald-500/50 flex flex-col items-center justify-center shrink-0">
                <span className="text-[9px] font-bold text-emerald-300">OVR</span>
                <span className="text-2xl font-black text-white font-['Teko']">{previewOvr}</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-black text-white">
                    {selectedCountry.flag} {displayKnown}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({firstName} {lastName}) • #{number} • {selectedPosition} • {startingAge} anos
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estilo: {derivedStyle.archetype.name}</span>
                </span>
              </div>
            </div>

            <div className="bg-[#0f131b] border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-2.5 w-full sm:w-auto">
              <ClubBadge club={selectedClub} size="sm" />
              <div className="min-w-0">
                <span className="text-xs font-black text-white block truncate">{selectedClub.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {selectedClub.league} • Téc. {selectedClub.coachName}
                </span>
              </div>
            </div>
          </div>

          {/* Seletor de Clube */}
          <div className="bg-[#181d28]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
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

            {clubDivisionTab === 'international' && (
              <div className="bg-[#12151c] border border-slate-800 rounded-2xl p-4 space-y-3.5 shadow-inner">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {(clubDivisionTab === 'tier3' && thirdTierClubs.length > 0
                ? thirdTierClubs
                : clubDivisionTab === 'tier2' && secondTierClubs.length > 0
                ? secondTierClubs
                : clubDivisionTab === 'tier1' && firstTierClubs.length > 0
                ? firstTierClubs
                : clubDivisionTab === 'international'
                ? getClubsFiltered(filterCountryName, filterLeagueId)
                : internationalClubs
              ).map(club => {
                const isSelected = selectedClubId === club.id || selectedClub.id === club.id;
                return (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap');
                      setSelectedClubId(club.id);
                    }}
                    className={`text-left p-3.5 rounded-2xl border flex items-center justify-between space-x-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                        : 'bg-[#12151c] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <ClubBadge club={club} size="md" />
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-white truncate">{club.name}</h4>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{club.stadium}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold block truncate mt-0.5">
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

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-black text-xs sm:text-sm hover:bg-slate-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Assinar Contrato & Iniciar Carreira</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
