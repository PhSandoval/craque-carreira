import React, { useState, useRef } from 'react';
import { PlayerProfile } from '../types';
import { getActiveLeagueIds, setActiveLeagueIds } from '../services/syncLeagueSimulationService';
import { getServerGeminiStatus, ServerGeminiStatus } from '../services/geminiClient';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import {
  CloudUserInfo,
  CloudSaveMetadata,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOutCloud,
  saveCareerToCloud,
  loadCareerFromCloud,
  getCloudSaveMetadata,
  exportSaveToJsonString,
  importSaveFromJsonString
} from '../services/cloudSaveService';
import {
  isHapticsEnabled,
  setHapticsEnabled,
  isHapticsSupported,
  triggerHaptic,
  HAPTIC_TEST_ITEMS
} from '../services/hapticsService';
import { LEAGUES } from '../data/leagues';
import { CLUBS } from '../data/clubs';
import { Settings, Sparkles, RotateCcw, Share2, Check, X, ShieldCheck, Globe, Activity, AlertCircle, Cloud, Download, Upload, Smartphone, LogOut, LogIn } from 'lucide-react';

interface SettingsModalProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onResetCareer: () => void;
  player: PlayerProfile;
  onImportPlayer?: (imported: PlayerProfile) => void;
  cloudUser?: CloudUserInfo | null;
  lastCloudSyncAt?: number | null;
  onCloudSynced?: (ts: number) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  apiKey,
  onSaveApiKey,
  onResetCareer,
  player,
  onImportPlayer,
  cloudUser,
  lastCloudSyncAt,
  onCloudSynced,
  onClose
}) => {
  const currentClubObj = CLUBS[player.currentClub];
  const currentLeagueId = currentClubObj?.leagueId || 'serie_a';

  const [inputKey] = useState(apiKey || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeLeagues, setActiveLeagues] = useState<string[]>(() => getActiveLeagueIds(currentLeagueId));
  const [leagueError, setLeagueError] = useState<string | null>(null);

  // Haptics (Somente Vibração — ZERO Som)
  const [hapticsOn, setHapticsOn] = useState<boolean>(() => isHapticsEnabled());
  const hapticsSupported = isHapticsSupported();

  // Firebase Cloud Save & JSON Backup
  const firebaseReady = isFirebaseConfigured();
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [cloudMeta, setCloudMeta] = useState<CloudSaveMetadata | null>(null);
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  const [serverStatus, setServerStatus] = useState<ServerGeminiStatus>({ configured: false });
  const isApiConnected = serverStatus.configured || (apiKey && apiKey.trim().length > 10) || (envKey && envKey.trim().length > 10);

  React.useEffect(() => {
    getServerGeminiStatus().then(setServerStatus).catch(() => setServerStatus({ configured: false }));
  }, []);

  React.useEffect(() => {
    if (cloudUser?.uid && firebaseReady) {
      getCloudSaveMetadata(cloudUser.uid).then(setCloudMeta).catch(() => setCloudMeta(null));
    } else {
      setCloudMeta(null);
    }
  }, [cloudUser?.uid, firebaseReady]);

  const handleToggleHaptics = () => {
    const next = !hapticsOn;
    setHapticsOn(next);
    setHapticsEnabled(next);
    if (next) triggerHaptic('tap', true);
  };

  const handleGoogleSignIn = async () => {
    setCloudBusy(true);
    setCloudStatus(null);
    try {
      const user = await signInWithGoogle();
      setCloudStatus({ ok: true, text: `Conectado como ${user.email || user.displayName || 'Usuário'}!` });
    } catch (err: any) {
      setCloudStatus({ ok: false, text: err?.message || 'Falha no login Google.' });
    } finally {
      setCloudBusy(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || authPassword.length < 6) {
      setCloudStatus({ ok: false, text: 'Informe um e-mail válido e senha com no mínimo 6 caracteres.' });
      return;
    }
    setCloudBusy(true);
    setCloudStatus(null);
    try {
      const user = authMode === 'login'
        ? await signInWithEmail(authEmail, authPassword)
        : await signUpWithEmail(authEmail, authPassword);
      setCloudStatus({ ok: true, text: `Autenticado como ${user.email}!` });
    } catch (err: any) {
      setCloudStatus({ ok: false, text: err?.message || 'Erro de autenticação.' });
    } finally {
      setCloudBusy(false);
    }
  };

  const handleUploadCloudSave = async () => {
    if (!cloudUser?.uid) return;
    setCloudBusy(true);
    setCloudStatus(null);
    try {
      const ts = await saveCareerToCloud(cloudUser.uid, player);
      onCloudSynced?.(ts);
      const meta = await getCloudSaveMetadata(cloudUser.uid);
      setCloudMeta(meta);
      triggerHaptic('trophy_award');
      setCloudStatus({ ok: true, text: 'Carreira enviada para a Nuvem Firebase com sucesso!' });
    } catch (err: any) {
      setCloudStatus({ ok: false, text: err?.message || 'Falha ao salvar na nuvem.' });
    } finally {
      setCloudBusy(false);
    }
  };

  const handleDownloadCloudSave = async () => {
    if (!cloudUser?.uid || !onImportPlayer) return;
    setCloudBusy(true);
    setCloudStatus(null);
    try {
      const res = await loadCareerFromCloud(cloudUser.uid);
      onImportPlayer(res.player);
      onCloudSynced?.(res.metadata.updatedAt);
      triggerHaptic('trophy_award');
      setCloudStatus({ ok: true, text: `Save de ${res.metadata.playerName} (${res.metadata.club}) restaurado!` });
    } catch (err: any) {
      setCloudStatus({ ok: false, text: err?.message || 'Falha ao carregar da nuvem.' });
    } finally {
      setCloudBusy(false);
    }
  };

  const handleExportJson = () => {
    try {
      const jsonStr = exportSaveToJsonString(player);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `craque-${player.surname.toLowerCase()}-t${player.seasonYear}-r${player.currentMatchDay}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setCloudStatus({ ok: true, text: 'Arquivo de backup (.json) baixado com sucesso!' });
    } catch {
      setCloudStatus({ ok: false, text: 'Erro ao exportar arquivo JSON.' });
    }
  };

  const handleImportJsonFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportPlayer) return;
    try {
      const text = await file.text();
      const restored = importSaveFromJsonString(text);
      onImportPlayer(restored);
      triggerHaptic('trophy_award');
      setCloudStatus({ ok: true, text: `Carreira de ${restored.name} "${restored.surname}" importada com sucesso!` });
    } catch (err: any) {
      setCloudStatus({ ok: false, text: err?.message || 'Arquivo de save inválido.' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleLeague = (id: string) => {
    if (id === currentLeagueId) return; // Liga atual é obrigatória
    let updated = [...activeLeagues];

    if (updated.includes(id)) {
      if (updated.length <= 5) {
        setLeagueError('Mínimo de 5 ligas ativas exigido para o ecossistema sincronizado.');
        return;
      }
      updated = updated.filter(l => l !== id);
      setLeagueError(null);
    } else {
      if (updated.length >= 10) {
        setLeagueError('Limite máximo de 10 ligas ativas simultâneas alcançado.');
        return;
      }
      updated.push(id);
      setLeagueError(null);
    }

    setActiveLeagues(updated);
    setActiveLeagueIds(updated, currentLeagueId);
  };

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setActiveLeagueIds(activeLeagues, currentLeagueId);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleShareWithFriends = () => {
    const text = `*MEU CRAQUE NO MODO CARREIRA*
*${player.name} "${player.surname}"* (#${player.number})
Posição: ${player.position} (${player.preferredFoot})
Clube Atual: ${player.currentClub}
OVR: ${player.ovr} | Idade: ${player.age} anos
Valor de Mercado: €${player.marketValueEur.toFixed(1)}M
Estatísticas: ${player.careerTotals.games} Jogos, ${player.careerTotals.goals} Gols, ${player.careerTotals.assists} Assistências
Fatos Marcantes: ${player.memories?.length || 0} lembranças registradas na carreira!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Fecha com a tecla ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92dvh] bg-[#12151c] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Header fixo no topo */}
        <div className="bg-[#181d28] border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Configurações & Central da Carreira</h2>
              <p className="text-xs text-slate-400">Preferências do jogo, IA narrativa e resenha</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/80 transition-colors"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com rolagem suave */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 overscroll-contain">
          
          {/* Card de Status da Inteligência Artificial */}
          <div className="bg-[#161b26] border border-slate-700/70 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Motor Narrativo & Inteligência de Jogo
                  </h3>
                  <span className="text-[11px] text-slate-400">Google Gemini & Geração Dinâmica de Carreira</span>
                </div>
              </div>

              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm ${
                isApiConnected
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                <span>{isApiConnected ? 'Gemini Ativo (/api/gemini)' : 'Modo Híbrido (Adicione GEMINI_API_KEY no .env)'}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              A inteligência artificial está integrada e em execução contínua no jogo. Ela gera automaticamente:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Notícias (ge.globo, UOL, TNT)</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Posts & Repercussão no X</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zona Mista & Entrevistas</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Memória & Dossiê Contínuo</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Novas Opções de Escolha nos Jogos</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Lesões Reais e Laudos do DM</span>
              </div>
              <div className="bg-[#10131a] p-2 rounded-xl border border-slate-800/80 flex items-center gap-2 col-span-1 sm:col-span-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Desafios de Carreira (Scouts Europeus, Patrocínios, Seleção)</span>
              </div>
            </div>

            {/* Status da Conexão Central Nativa */}
            <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Conexão Própria Integrada (Servidor Central Ativo)</span>
              </span>
              <span className="text-[10px] bg-[#10131a] border border-slate-800 px-2.5 py-0.5 rounded-full text-slate-400 font-mono">
                Gemini 2.5 Flash • Anti-Sequestro Ativo
              </span>
            </div>

            {serverStatus.budget && (
              <div className="bg-[#10131a] border border-slate-800/90 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">
                    Trava Rígida de Gasto Mensal ({serverStatus.budget.month})
                  </span>
                  <span className={`font-mono font-black ${serverStatus.budget.capReached ? 'text-rose-400' : 'text-emerald-400'}`}>
                    US$ {serverStatus.budget.spentUsd.toFixed(4)} / US$ {serverStatus.budget.limitUsd.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${serverStatus.budget.capReached ? 'bg-rose-500' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, (serverStatus.budget.spentUsd / Math.max(0.01, serverStatus.budget.limitUsd)) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  {serverStatus.budget.callsCount} chamadas no mês • Ao atingir o teto, o servidor bloqueia cobranças extras e ativa o modo gratuito.
                </p>
              </div>
            )}
          </div>

          {/* Simulação Sincronizada das Ligas (Modelo Football Manager: 5 a 10 Ligas) */}
          <div className="bg-[#161b26] border border-slate-700/70 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-950/60 border border-sky-800 flex items-center justify-center text-sky-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Ligas Vivas & Simulação Sincronizada
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Modelo Football Manager: Escolha de 5 a 10 ligas ativas
                  </span>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto border ${
                activeLeagues.length >= 5 && activeLeagues.length <= 10
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  : 'bg-rose-950/80 text-rose-300 border-rose-700/60'
              }`}>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeLeagues.length} de 10 Ligas Ativas</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              As ligas selecionadas são simuladas <strong>jogo a jogo em sincronia com a sua rodada</strong>. Confrontos reais, gols, vitórias e empates alimentam as tabelas e o mercado de transferências.
            </p>

            {leagueError && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{leagueError}</span>
              </div>
            )}

            {/* Grid Interativo de Seleção de Ligas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {Object.values(LEAGUES).map(league => {
                const isCurrent = league.id === currentLeagueId;
                const isSelected = activeLeagues.includes(league.id);

                return (
                  <button
                    key={league.id}
                    type="button"
                    onClick={() => handleToggleLeague(league.id)}
                    className={`text-left p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-emerald-950/40 border-emerald-500/80 text-white cursor-default shadow-sm'
                        : isSelected
                        ? 'bg-[#1a2334] border-sky-500/80 text-white shadow-sm'
                        : 'bg-[#10131a] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">{league.countryFlag}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold block truncate">{league.name}</span>
                        <span className="text-[10px] text-slate-400">
                          {isCurrent ? 'Sua Liga Atual (Fixa)' : `${league.tier}ª Divisão • ${league.country}`}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isCurrent ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                          FIXA
                        </span>
                      ) : isSelected ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-900/80 text-sky-300 border border-sky-700">
                          ATIVA
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          INATIVA
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1">
              Todos os confrontos e classificações são processados instantaneamente sem travamento e armazenados no seu dispositivo.
            </p>
          </div>

          {/* Vibração Tátil (Somente Vibração — ZERO Som) */}
          <div className="bg-[#161b26] border border-slate-700/70 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-950/60 border border-amber-700/60 flex items-center justify-center text-amber-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Vibração & Efeitos Táteis (Sem Som)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Pulsos exclusivos no celular para gols, cartões, lesões e troféus
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleHaptics}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all border shrink-0 ${
                  hapticsOn
                    ? 'bg-emerald-500 text-black border-emerald-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {hapticsOn ? 'Ativada' : 'Desativada'}
              </button>
            </div>

            {!hapticsSupported && (
              <p className="text-[10px] text-amber-300/80 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1.5 rounded-lg">
                Este navegador/aparelho não expõe a API de vibração (ex: Safari desktop). No Android/Chrome Mobile funciona automaticamente!
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              {HAPTIC_TEST_ITEMS.map(item => (
                <button
                  key={item.event}
                  type="button"
                  onClick={() => triggerHaptic(item.event, true)}
                  className="text-left p-2.5 rounded-xl bg-[#10131a] hover:bg-[#1a202c] border border-slate-800 transition-colors"
                >
                  <span className="text-xs font-bold text-white block">{item.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sincronização em Nuvem (Firebase PC ↔ Celular) + Backup JSON */}
          <div className="bg-[#161b26] border border-slate-700/70 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-inner">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-950/60 border border-sky-700/60 flex items-center justify-center text-sky-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Save em Nuvem (PC ↔ Celular)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Firebase Auth + Firestore ou transferência manual via Backup JSON
                  </span>
                </div>
              </div>

              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                cloudUser
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                  : firebaseReady
                  ? 'bg-sky-950/80 text-sky-300 border-sky-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {cloudUser ? 'Conectado' : firebaseReady ? 'Firebase Pronto' : 'Aguardando Config .env'}
              </span>
            </div>

            {cloudStatus && (
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${
                cloudStatus.ok
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
              }`}>
                {cloudStatus.text}
              </div>
            )}

            {firebaseReady ? (
              cloudUser ? (
                <div className="space-y-3 bg-[#10131a] p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Conta Conectada</span>
                      <span className="font-bold text-white">{cloudUser.displayName || cloudUser.email || cloudUser.uid}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOutCloud()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sair</span>
                    </button>
                  </div>

                  {cloudMeta && (
                    <div className="text-[11px] text-slate-300 bg-[#161b26] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
                      <span>Nuvem: <strong>{cloudMeta.playerName}</strong> • {cloudMeta.club} ({cloudMeta.ovr} OVR • R{cloudMeta.currentMatchDay})</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(cloudMeta.updatedAt).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  )}

                  {lastCloudSyncAt && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      Último sync automático: {new Date(lastCloudSyncAt).toLocaleTimeString('pt-BR')}
                    </span>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={cloudBusy}
                      onClick={handleUploadCloudSave}
                      className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-colors"
                    >
                      Enviar Carreira para Nuvem
                    </button>
                    <button
                      type="button"
                      disabled={cloudBusy || !cloudMeta}
                      onClick={handleDownloadCloudSave}
                      className="py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xs transition-colors"
                    >
                      Baixar Carreira da Nuvem
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 bg-[#10131a] p-3.5 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    disabled={cloudBusy}
                    onClick={handleGoogleSignIn}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-200 text-black font-black text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Entrar com Google (Sincronizar PC e Celular)</span>
                  </button>

                  <form onSubmit={handleEmailAuth} className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="bg-[#161b26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                      <input
                        type="password"
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="Senha (mín. 6 caracteres)"
                        className="bg-[#161b26] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')}
                        className="text-[11px] text-sky-400 hover:underline font-semibold"
                      >
                        {authMode === 'login' ? 'Criar nova conta com e-mail' : 'Já tenho conta — fazer login'}
                      </button>
                      <button
                        type="submit"
                        disabled={cloudBusy}
                        className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs"
                      >
                        {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="bg-[#10131a] p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                <p className="font-bold text-amber-300">Para ativar a nuvem automática no Firebase:</p>
                <p className="text-slate-400">
                  1. Crie um projeto gratuito no Firebase Console e ative <strong>Authentication</strong> (Google/E-mail) e <strong>Firestore</strong>.<br />
                  2. Copie as 6 variáveis <code className="text-emerald-300">VITE_FIREBASE_*</code> para seu <code className="text-emerald-300">.env</code> (e Vercel).<br />
                  3. Publique as regras seguras já criadas em <code className="text-emerald-300">firestore.rules</code>.
                </p>
              </div>
            )}

            {/* Backup Manual JSON (sempre disponível!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="py-2.5 px-3 rounded-xl bg-[#10131a] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exportar Save (.json)</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2.5 px-3 rounded-xl bg-[#10131a] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-sky-400" />
                <span>Importar Save (.json)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportJsonFile}
                className="hidden"
              />
            </div>
          </div>

          {/* Compartilhar Carreira no WhatsApp */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Mandar no Grupo dos Amigos
            </span>
            <button
              type="button"
              onClick={handleShareWithFriends}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copiado para a área de transferência!' : 'Copiar Resumo da Carreira (WhatsApp)'}</span>
            </button>
          </div>

          {/* Reiniciar Carreira */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja reiniciar sua carreira e criar um novo jogador do zero?')) {
                  onResetCareer();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Carreira (Criar Novo Jogador)</span>
            </button>
          </div>
        </div>

        {/* Rodapé fixo na base */}
        <div className="bg-[#181d28] border-t border-slate-800 p-4 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">Craque: Modo Carreira RPG v2.5</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow-md"
            >
              {savedSuccess ? 'Salvo!' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
