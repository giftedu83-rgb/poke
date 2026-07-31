/**
 * localStorage 유틸리티
 */

import type { GameSaveData } from '@/types/game';

const STORAGE_KEY = 'busan-sea-explorer-save';

/** 기본 저장 데이터 */
export function getDefaultSaveData(): GameSaveData {
  return {
    collection: {},
    completedLandmarks: [],
    waveCharmCount: 0,
    tutorialSeen: false,
    totalCaptures: 0,
  };
}

/**
 * 게임 데이터 로드
 * 데이터가 없거나 손상된 경우 기본값으로 복구
 */
export function loadGameData(): GameSaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSaveData();

    const parsed = JSON.parse(raw) as Partial<GameSaveData>;
    const defaults = getDefaultSaveData();

    return {
      collection:
        parsed.collection && typeof parsed.collection === 'object'
          ? parsed.collection
          : defaults.collection,
      completedLandmarks: Array.isArray(parsed.completedLandmarks)
        ? parsed.completedLandmarks
        : defaults.completedLandmarks,
      waveCharmCount:
        typeof parsed.waveCharmCount === 'number'
          ? parsed.waveCharmCount
          : defaults.waveCharmCount,
      tutorialSeen:
        typeof parsed.tutorialSeen === 'boolean'
          ? parsed.tutorialSeen
          : defaults.tutorialSeen,
      totalCaptures:
        typeof parsed.totalCaptures === 'number'
          ? parsed.totalCaptures
          : defaults.totalCaptures,
    };
  } catch {
    return getDefaultSaveData();
  }
}

/**
 * 게임 데이터 저장
 */
export function saveGameData(data: GameSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('localStorage 저장 실패');
  }
}

/**
 * 데이터 초기화
 */
export function resetGameData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
