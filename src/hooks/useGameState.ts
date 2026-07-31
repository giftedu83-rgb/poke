/**
 * 게임 전역 상태 관리 훅
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  GameSaveData,
  CollectionEntry,
  CaptureRecord,
  SpawnedCreature,
} from '@/types/game';
import { GAME_CONFIG } from '@/data/config';
import { CREATURES } from '@/data/creatures';
import {
  loadGameData,
  saveGameData,
  resetGameData,
  getDefaultSaveData,
} from '@/utils/storage';
import {
  weightedRandomCreature,
  randomSpawnPosition,
  generateId,
} from '@/utils/random';

export function useGameState() {
  const [saveData, setSaveData] = useState<GameSaveData>(() => loadGameData());
  const [playerPos, setPlayerPos] = useState(GAME_CONFIG.DEMO_CENTER);
  const [spawns, setSpawns] = useState<SpawnedCreature[]>([]);
  const spawnLock = useRef(false);
  const initializedRef = useRef(false);

  // 저장 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    saveGameData(saveData);
  }, [saveData]);

  // 초기 생물 생성 (StrictMode 중복 방지)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const initial = generateInitialSpawns(playerPos.lat, playerPos.lng);
    setSpawns(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 초기 생물 일괄 생성 */
  function generateInitialSpawns(
    lat: number,
    lng: number
  ): SpawnedCreature[] {
    const result: SpawnedCreature[] = [];
    const recentIds: string[] = [];

    for (let i = 0; i < GAME_CONFIG.MAX_CREATURES; i++) {
      const creature = weightedRandomCreature(CREATURES, recentIds);
      recentIds.push(creature.id);
      const pos = randomSpawnPosition(lat, lng, result);
      if (pos) {
        result.push({
          instanceId: generateId(),
          creatureId: creature.id,
          lat: pos.lat,
          lng: pos.lng,
          spawnedAt: Date.now(),
        });
      }
    }
    return result;
  }

  /** 생물 제거 후 새 생물 생성 */
  const removeAndRespawn = useCallback(
    (instanceId: string, delay: number) => {
      if (spawnLock.current) return;
      spawnLock.current = true;

      setSpawns((prev) => prev.filter((s) => s.instanceId !== instanceId));

      setTimeout(() => {
        setSpawns((prev) => {
          if (prev.length >= GAME_CONFIG.MAX_CREATURES) {
            spawnLock.current = false;
            return prev;
          }

          const recentIds = prev.map((s) => s.creatureId);
          const creature = weightedRandomCreature(CREATURES, recentIds);
          const pos = randomSpawnPosition(
            playerPos.lat,
            playerPos.lng,
            prev
          );

          spawnLock.current = false;

          if (!pos) return prev;

          return [
            ...prev,
            {
              instanceId: generateId(),
              creatureId: creature.id,
              lat: pos.lat,
              lng: pos.lng,
              spawnedAt: Date.now(),
            },
          ];
        });
      }, delay);
    },
    [playerPos]
  );

  /** 포획 성공 기록 */
  const recordCapture = useCallback(
    (creatureId: string, lengthCm: number, weightG: number) => {
      setSaveData((prev) => {
        const record: CaptureRecord = {
          creatureId,
          lengthCm,
          weightG,
          capturedAt: Date.now(),
        };

        const existing = prev.collection[creatureId];
        const entry: CollectionEntry = existing
          ? {
              ...existing,
              captureCount: existing.captureCount + 1,
              records: [
                record,
                ...existing.records.slice(
                  0,
                  GAME_CONFIG.MAX_RECORDS_PER_CREATURE - 1
                ),
              ],
              maxLengthCm: Math.max(existing.maxLengthCm, lengthCm),
              maxWeightG: Math.max(existing.maxWeightG, weightG),
            }
          : {
              creatureId,
              captureCount: 1,
              records: [record],
              maxLengthCm: lengthCm,
              maxWeightG: weightG,
            };

        return {
          ...prev,
          collection: { ...prev.collection, [creatureId]: entry },
          totalCaptures: prev.totalCaptures + 1,
        };
      });
    },
    []
  );

  /** 관광명소 완료 처리 */
  const completeLandmark = useCallback((landmarkId: string) => {
    setSaveData((prev) => {
      if (prev.completedLandmarks.includes(landmarkId)) return prev;
      return {
        ...prev,
        completedLandmarks: [...prev.completedLandmarks, landmarkId],
        waveCharmCount: prev.waveCharmCount + 1,
      };
    });
  }, []);

  /** 아이템 사용 */
  const useCharm = useCallback(() => {
    setSaveData((prev) => {
      if (prev.waveCharmCount <= 0) return prev;
      return { ...prev, waveCharmCount: prev.waveCharmCount - 1 };
    });
  }, []);

  /** 튜토리얼 확인 */
  const markTutorialSeen = useCallback(() => {
    setSaveData((prev) => ({ ...prev, tutorialSeen: true }));
  }, []);

  /** 데이터 초기화 */
  const resetAll = useCallback(() => {
    resetGameData();
    const defaults = getDefaultSaveData();
    setSaveData(defaults);
    const initial = generateInitialSpawns(
      GAME_CONFIG.DEMO_CENTER.lat,
      GAME_CONFIG.DEMO_CENTER.lng
    );
    setSpawns(initial);
    setPlayerPos(GAME_CONFIG.DEMO_CENTER);
  }, []);

  return {
    saveData,
    playerPos,
    setPlayerPos,
    spawns,
    setSpawns,
    removeAndRespawn,
    recordCapture,
    completeLandmark,
    useCharm,
    markTutorialSeen,
    resetAll,
  };
}
