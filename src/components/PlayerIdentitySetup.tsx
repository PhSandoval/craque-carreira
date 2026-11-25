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
  Shield,
  ChevronRight,
  ChevronLeft,
  Globe,
  Cloud,
  Upload,
  Plus,
  Minus,
  RotateCcw
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

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [importBusy, setImportBusy] = useState(false);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Etapa 1
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

  // Etapa 2
  const [selectedPosition, setSelectedPosition] = useState<Position>('MEI');
  const [allocatedPoints, setAllocatedPoints] = useState<Record<CoreAttributeKey, number>>(() => {
    const initialArchs = getArchetypesForPosition('MEI');
    return getSuggestedPointsForArchetype('MEI', initialArchs[0], CREATION_POINTS_TOTAL);
  });

  // Etapa 3
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
      setStep1Error('Preencha o Nome do jogador.');
      return;
    }
    if (!lastName.trim()) {
      setStep1Error('Preencha o Sobrenome do jogador.');
      return;
    }
    if (!knownName.trim()) {
      setStep1Error('Informe como o jogador é conhecido.');
      return;
    }
    setStep1Error(null);
    triggerHaptic('tap');
    setStep(2);
  };

  const handleConfirm = () => {
    const cleanFirst = firstName.trim() || 'Pedro';
    const cleanLast = lastName.trim() || 'Sandoval';
    const cleanKnown = knownName.trim() || cleanFirst.toUpperCase();
    const chosenArch = derivedStyle.archetype;

    const newPlayer: PlayerProfile = {
      id: 'player_' + Date.now(),
      name: cleanFirst,
      lastName: cleanLast,
      knownName: cleanKnown,
      surname: cleanKnown,
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
    <div className="w-full max-w-4xl mx-auto bg-[#11151d] border border-white/[0.07] rounded-2xl p-5 sm:p-7 space-y-6">
      {/* Cabeçalho + Carregar Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 block">
            Novo Jogador • Etapa {step} de 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {step === 1 && 'Identidade & País'}
            {step === 2 && 'Posição, Atributos & Estilo'}
            {step === 3 && 'Clube Inicial'}
          </h1>
        </div>

        {onLoadExistingCareer && step === 1 && (
          <div className="flex items-center gap-2 shrink-0">
            {isFirebaseConfigured() && (
              <button
                type="button"
                disabled={importBusy}
                onClick={handleLoadFromCloud}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5 text-sky-400" />
                <span>Nuvem</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importar Save</span>
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

      {/* Stepper Minimalista */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { num: 1 as const, label: '1. Identidade' },
          { num: 2 as const, label: '2. Posição & Estilo' },
          { num: 3 as const, label: '3. Clube' }
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
              className="text-left space-y-1.5"
            >
              <div
                className={`h-1 rounded-full transition-colors ${
                  isCurrent
                    ? 'bg-emerald-400'
                    : isDone
                    ? 'bg-emerald-500/40'
                    : 'bg-white/[0.08]'
                }`}
              />
              <span
                className={`text-xs block ${
                  isCurrent
                    ? 'text-white font-bold'
                    : isDone
                    ? 'text-slate-300 font-medium cursor-pointer'
                    : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {importMsg && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold ${
            importMsg.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {importMsg.text}
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 1: NOME, SOBRENOME, CONHECIDO, PAÍS E NÚMERO                    */}
      {/* ===================================================================== */}
      {step === 1 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Esquerda: Camisa + Campos */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                <div className="shrink-0 scale-90 -my-3">
                  <JerseyPreview
                    surname={displayKnown}
                    number={number}
                    primaryColor="#10b981"
                    secondaryColor="#064e3b"
                    textColor="#ffffff"
                  />
                </div>
                <div className="flex-1 w-full space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
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
                        className="w-full bg-[#0a0d12] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
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
                        className="w-full bg-[#0a0d12] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-emerald-400 mb-1">
                        Como é conhecido (camisa)
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
                        className="w-full bg-[#0a0d12] border border-emerald-500/40 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
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
                        className="w-full bg-[#0a0d12] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-center text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                    Idade inicial
                  </label>
                  <div className="grid grid-cols-6 gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06]">
                    {[16, 17, 18, 19, 20, 21].map(ageVal => (
                      <button
                        key={ageVal}
                        type="button"
                        onClick={() => setStartingAge(ageVal)}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                          startingAge === ageVal
                            ? 'bg-emerald-500 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {ageVal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                    Perna dominante
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06]">
                    {(['Esquerda', 'Direita', 'Ambidestro'] as Foot[]).map(foot => (
                      <button
                        key={foot}
                        type="button"
                        onClick={() => setDominantFoot(foot)}
                        className={`py-1.5 text-[11px] font-bold rounded-lg transition-colors ${
                          dominantFoot === foot
                            ? 'bg-emerald-500 text-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {foot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Direita: País */}
            <div className="lg:col-span-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>País</span>
                </span>
                <span className="font-bold text-white">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar país..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0d12] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="max-h-[210px] overflow-y-auto divide-y divide-white/[0.04] pr-1 custom-scrollbar">
                {filteredCountries.map(country => {
                  const isSelected = selectedCountry.name === country.name;
                  return (
                    <button
                      key={country.name}
                      type="button"
                      onClick={() => handleCountryChange(country)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors ${
                        isSelected
                          ? 'text-emerald-400 font-bold bg-emerald-500/10 rounded-lg'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-base">{country.flag}</span>
                        <span>{country.name}</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {step1Error && (
            <p className="text-xs font-semibold text-rose-400">{step1Error}</p>
          )}

          <div className="pt-3 border-t border-white/[0.06] flex justify-end">
            <button
              type="button"
              onClick={handleGoToStep2}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Avançar: Posição & Atributos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 2: POSIÇÃO & ATRIBUTOS -> DEFINEM O ESTILO                      */}
      {/* ===================================================================== */}
      {step === 2 && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center space-y-2">
              <div className="w-full flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Posição</span>
                <span className="font-bold text-emerald-400">{selectedPosition}</span>
              </div>
              <TacticalPitch
                selectedPosition={selectedPosition}
                onSelectPosition={handlePositionChange}
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">
                    Distribua seus pontos livres
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Restam {remainingPoints}/{CREATION_POINTS_TOTAL}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAllocatedPoints({ ...EMPTY_POINTS })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06]"
                      title="Zerar pontos"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {CORE_KEYS.map(key => {
                    const meta = CORE_ATTRIBUTE_LABELS[key];
                    const added = allocatedPoints[key] || 0;
                    const totalVal = finalAttributes[key];

                    return (
                      <div key={key} className="flex items-center gap-3 py-1">
                        <span className="w-28 text-xs text-slate-300 truncate shrink-0">
                          {meta.label}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-150"
                            style={{ width: `${Math.min(100, totalVal)}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={added <= 0}
                            onClick={() => adjustAttributePoint(key, -1)}
                            aria-label={`Diminuir ${meta.label}`}
                            className="w-6 h-6 rounded-md bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 text-white flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-bold text-white">
                            {totalVal}
                          </span>
                          <button
                            type="button"
                            disabled={remainingPoints <= 0 || added >= MAX_POINTS_PER_ATTR}
                            onClick={() => adjustAttributePoint(key, +1)}
                            aria-label={`Aumentar ${meta.label}`}
                            className="w-6 h-6 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 text-black flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Atalhos de perfil */}
                <div className="pt-2 border-t border-white/[0.06] flex flex-wrap gap-1.5">
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
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        derivedStyle.archetype.id === arch.id
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {arch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo Conquistado */}
              <div className="bg-white/[0.02] border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                      Estilo de Jogo Desbloqueado · {derivedStyle.matchPct}%
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {derivedStyle.archetype.name}
                    </h3>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    OVR {previewOvr}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {derivedStyle.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap');
                setStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span>Avançar: Escolher Time</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ETAPA 3: ESCOLHA DO TIME INICIAL                                      */}
      {/* ===================================================================== */}
      {step === 3 && (
        <div className="space-y-5 animate-fadeIn">
          {/* Resumo fino */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs space-y-0.5">
              <span className="text-sm font-bold text-white block">
                {selectedCountry.flag} {displayKnown}{' '}
                <span className="text-xs font-normal text-slate-400">
                  ({firstName} {lastName} · #{number} {selectedPosition})
                </span>
              </span>
              <span className="text-emerald-400 font-medium block">
                {derivedStyle.archetype.name} · OVR {previewOvr}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <ClubBadge club={selectedClub} size="sm" />
              <div>
                <span className="font-bold text-white block">{selectedClub.name}</span>
                <span className="text-[11px] text-slate-400">{selectedClub.league}</span>
              </div>
            </div>
          </div>

          {/* Seletor limpo de clubes */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06] w-fit">
              {thirdTierClubs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setClubDivisionTab('tier3')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clubDivisionTab === 'tier3' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3ª Divisão (Série C)
                </button>
              )}
              {secondTierClubs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setClubDivisionTab('tier2')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clubDivisionTab === 'tier2' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2ª Divisão (Série B)
                </button>
              )}
              {firstTierClubs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setClubDivisionTab('tier1')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    clubDivisionTab === 'tier1' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1ª Divisão (Gigantes)
                </button>
              )}
              <button
                type="button"
                onClick={() => setClubDivisionTab('international')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  clubDivisionTab === 'international' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Outras Ligas
              </button>
            </div>

            {clubDivisionTab === 'international' && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 space-y-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {countryCatalog.map(c => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setFilterCountryName(c.name);
                        if (c.leagues.length > 0) setFilterLeagueId(c.leagues[0].id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        filterCountryName === c.name
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-white/[0.04] text-slate-300 hover:text-white'
                      }`}
                    >
                      {c.flag} {c.name}
                    </button>
                  ))}
                </div>
                {activeCountryCatalog && activeCountryCatalog.leagues.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                    {activeCountryCatalog.leagues.map(league => (
                      <button
                        key={league.id}
                        type="button"
                        onClick={() => setFilterLeagueId(league.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          filterLeagueId === league.id
                            ? 'bg-white text-black font-bold'
                            : 'bg-white/[0.04] text-slate-300 hover:text-white'
                        }`}
                      >
                        {league.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
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
                    className={`text-left p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/60'
                        : 'bg-white/[0.02] border-white/[0.06] hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ClubBadge club={club} size="sm" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-white truncate">{club.name}</h4>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {club.league}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 text-xs font-semibold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Assinar Contrato & Iniciar Carreira</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
