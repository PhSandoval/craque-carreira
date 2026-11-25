import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PlayerProfile } from '../types';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebaseConfig';
import { ensurePlayerEconomy } from './economyAndContractService';

export interface CloudUserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface CloudSaveMetadata {
  playerName: string;
  club: string;
  ovr: number;
  age: number;
  seasonYear: number;
  currentMatchDay: number;
  updatedAt: number;
  schemaVersion: number;
}

interface FullSaveBundle {
  schemaVersion: number;
  exportedAt: number;
  player: PlayerProfile;
  worldStorage: Record<string, string | null>;
}

const WORLD_STORAGE_KEYS = [
  'craque_active_leagues_v2',
  'craque_sync_leagues_v2',
  'craque_state_cup_results_v1',
  'craque_world_state_v1'
];

export function buildFullSaveBundle(player: PlayerProfile): FullSaveBundle {
  const worldStorage: Record<string, string | null> = {};
  WORLD_STORAGE_KEYS.forEach(k => {
    try {
      worldStorage[k] = localStorage.getItem(k);
    } catch {
      worldStorage[k] = null;
    }
  });

  return {
    schemaVersion: 1,
    exportedAt: Date.now(),
    player: ensurePlayerEconomy(player),
    worldStorage
  };
}

export function restoreFullSaveBundle(bundle: FullSaveBundle): PlayerProfile {
  if (!bundle || !bundle.player || !bundle.player.currentClub) {
    throw new Error('Arquivo de save inválido ou corrompido.');
  }
  if (bundle.worldStorage && typeof bundle.worldStorage === 'object') {
    Object.entries(bundle.worldStorage).forEach(([k, val]) => {
      if (!WORLD_STORAGE_KEYS.includes(k)) return;
      try {
        if (typeof val === 'string') localStorage.setItem(k, val);
        else localStorage.removeItem(k);
      } catch {
        // ignore quota errors
      }
    });
  }
  return ensurePlayerEconomy(bundle.player);
}

export function exportSaveToJsonString(player: PlayerProfile): string {
  return JSON.stringify(buildFullSaveBundle(player), null, 2);
}

export function importSaveFromJsonString(raw: string): PlayerProfile {
  const parsed = JSON.parse(raw);
  if (parsed && parsed.player) {
    return restoreFullSaveBundle(parsed as FullSaveBundle);
  }
  if (parsed && parsed.name && parsed.currentClub) {
    return ensurePlayerEconomy(parsed as PlayerProfile);
  }
  throw new Error('Formato JSON não reconhecido para este jogo.');
}

function mapFirebaseAuthError(err: any): string {
  const code = err?.code || '';
  if (code === 'auth/unauthorized-domain') {
    return 'Domínio não autorizado no Firebase Console (Authentication > Settings > Authorized domains).';
  }
  if (code === 'auth/popup-blocked') {
    return 'Pop-up bloqueado pelo navegador. Libere os pop-ups ou use E-mail e Senha.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Login cancelado antes de concluir.';
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'E-mail ou senha inválidos.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'Este e-mail já está cadastrado. Tente entrar com sua senha.';
  }
  if (code === 'auth/weak-password') {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }
  return err?.message || 'Erro ao autenticar com o Firebase.';
}

export function subscribeCloudAuth(cb: (user: CloudUserInfo | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (u: User | null) => {
    if (!u) {
      cb(null);
    } else {
      cb({ uid: u.uid, email: u.email, displayName: u.displayName });
    }
  });
}

export async function signInWithGoogle(): Promise<CloudUserInfo> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase não configurado neste ambiente.');
  try {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    return { uid: res.user.uid, email: res.user.email, displayName: res.user.displayName };
  } catch (err) {
    throw new Error(mapFirebaseAuthError(err));
  }
}

export async function signInWithEmail(email: string, password: string): Promise<CloudUserInfo> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase não configurado neste ambiente.');
  try {
    const res = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { uid: res.user.uid, email: res.user.email, displayName: res.user.displayName };
  } catch (err) {
    throw new Error(mapFirebaseAuthError(err));
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<CloudUserInfo> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase não configurado neste ambiente.');
  try {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
    return { uid: res.user.uid, email: res.user.email, displayName: res.user.displayName };
  } catch (err) {
    throw new Error(mapFirebaseAuthError(err));
  }
}

export async function signOutCloud(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
}

export async function saveCareerToCloud(uid: string, player: PlayerProfile): Promise<number> {
  if (!isFirebaseConfigured()) throw new Error('Firebase não configurado.');
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore indisponível.');

  const bundle = buildFullSaveBundle(player);
  const payloadJson = JSON.stringify(bundle);
  if (payloadJson.length > 880_000) {
    // Mantém notícias e memórias enxutas caso o save cresça muito
    bundle.player = {
      ...bundle.player,
      newsFeed: (bundle.player.newsFeed || []).slice(0, 15),
      memories: (bundle.player.memories || []).slice(0, 80)
    };
  }

  const finalJson = JSON.stringify(bundle);
  const updatedAt = Date.now();
  const ref = doc(db, 'users', uid, 'saves', 'career_v1');

  await setDoc(ref, {
    payloadJson: finalJson,
    updatedAt,
    playerName: `${player.name} "${player.surname}"`.slice(0, 110),
    club: (player.currentClub || 'Clube').slice(0, 110),
    ovr: Math.min(99, Math.max(1, Math.round(player.ovr || 65))),
    age: Math.min(55, Math.max(15, Math.round(player.age || 17))),
    seasonYear: Math.min(2150, Math.max(2020, Math.round(player.seasonYear || 2026))),
    currentMatchDay: Math.min(60, Math.max(1, Math.round(player.currentMatchDay || 1))),
    schemaVersion: 1
  });

  return updatedAt;
}

export async function getCloudSaveMetadata(uid: string): Promise<CloudSaveMetadata | null> {
  const db = getFirebaseDb();
  if (!db) return null;
  const ref = doc(db, 'users', uid, 'saves', 'career_v1');
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    playerName: data.playerName,
    club: data.club,
    ovr: data.ovr,
    age: data.age,
    seasonYear: data.seasonYear,
    currentMatchDay: data.currentMatchDay,
    updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
    schemaVersion: data.schemaVersion || 1
  };
}

export async function loadCareerFromCloud(uid: string): Promise<{ player: PlayerProfile; metadata: CloudSaveMetadata }> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firestore indisponível.');
  const ref = doc(db, 'users', uid, 'saves', 'career_v1');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error('Nenhuma carreira salva encontrada nesta conta.');
  }
  const data = snap.data() as any;
  const bundle = JSON.parse(data.payloadJson) as FullSaveBundle;
  const restored = restoreFullSaveBundle(bundle);
  return {
    player: restored,
    metadata: {
      playerName: data.playerName,
      club: data.club,
      ovr: data.ovr,
      age: data.age,
      seasonYear: data.seasonYear,
      currentMatchDay: data.currentMatchDay,
      updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
      schemaVersion: data.schemaVersion || 1
    }
  };
}
