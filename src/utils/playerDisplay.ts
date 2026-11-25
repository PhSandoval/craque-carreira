import { PlayerProfile } from '../types';

/**
 * Retorna como o jogador é conhecido publicamente (nome na camisa e narração).
 * Mantém compatibilidade total com saves legados que só possuíam `surname`.
 */
export function getPlayerKnownName(
  player: Partial<Pick<PlayerProfile, 'knownName' | 'surname' | 'name'>>
): string {
  return (
    player.knownName?.trim() ||
    player.surname?.trim() ||
    player.name?.trim() ||
    'Craque'
  );
}

/**
 * Retorna o nome completo civil (Nome + Sobrenome) para dossiês e cabeçalhos.
 */
export function getPlayerFullName(
  player: Partial<Pick<PlayerProfile, 'name' | 'lastName' | 'surname'>>
): string {
  const full = [player.name?.trim(), player.lastName?.trim()]
    .filter(Boolean)
    .join(' ')
    .trim();
  return full || player.name?.trim() || player.surname?.trim() || 'Craque';
}
