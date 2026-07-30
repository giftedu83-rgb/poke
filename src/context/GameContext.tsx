import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  AppSettings,
  CollectedMonsterRecord,
  OwnedItemRecord,
  VisitedSpotRecord,
  UserPosition,
} from '../types';
import { storageService } from '../utils/storage';
import { getMonsterById } from '../data/monsters';

// 앱 전역에서 공유하는 게임 상태(수집기록, 위치, 설정)를 관리하는 컨텍스트

interface GameContextValue {
  // 수집/보유 기록
  collectedMonsters: CollectedMonsterRecord[];
  ownedItems: OwnedItemRecord[];
  visitedSpots: VisitedSpotRecord[];
  collectMonster: (monsterId: string) => void; // 몬스터+보상 아이템 수집 처리
  visitSpot: (spotId: string) => void; // 탐험 스팟 방문 완료 처리
  isMonsterCollected: (monsterId: string) => boolean;
  isSpotVisited: (spotId: string) => boolean;
  resetProgress: () => void;

  // 설정(GPS/시연 모드)
  settings: AppSettings;
  setMode: (mode: AppSettings['mode']) => void;

  // 위치
  userPosition: UserPosition | null;
  setUserPosition: (pos: UserPosition | null) => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  // 최초 로드시 localStorage에서 안전하게 불러온다.
  const [collectedMonsters, setCollectedMonsters] = useState<CollectedMonsterRecord[]>(() =>
    storageService.loadCollectedMonsters()
  );
  const [ownedItems, setOwnedItems] = useState<OwnedItemRecord[]>(() =>
    storageService.loadOwnedItems()
  );
  const [visitedSpots, setVisitedSpots] = useState<VisitedSpotRecord[]>(() =>
    storageService.loadVisitedSpots()
  );
  const [settings, setSettings] = useState<AppSettings>(() => storageService.loadSettings());
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);

  // 변경될 때마다 localStorage에 즉시 반영 -> 새로고침/재실행해도 유지됨
  useEffect(() => {
    storageService.saveCollectedMonsters(collectedMonsters);
  }, [collectedMonsters]);

  useEffect(() => {
    storageService.saveOwnedItems(ownedItems);
  }, [ownedItems]);

  useEffect(() => {
    storageService.saveVisitedSpots(visitedSpots);
  }, [visitedSpots]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const isMonsterCollected = (monsterId: string) =>
    collectedMonsters.some((r) => r.monsterId === monsterId);

  const isSpotVisited = (spotId: string) => visitedSpots.some((r) => r.spotId === spotId);

  const collectMonster = (monsterId: string) => {
    if (isMonsterCollected(monsterId)) return; // 중복 수집 방지
    const monster = getMonsterById(monsterId);
    const now = new Date().toISOString();

    setCollectedMonsters((prev) => [...prev, { monsterId, collectedAt: now }]);

    if (monster) {
      setOwnedItems((prev) => {
        const existing = prev.find((it) => it.itemId === monster.rewardItemId);
        if (existing) {
          return prev.map((it) =>
            it.itemId === monster.rewardItemId
              ? { ...it, count: it.count + 1, lastObtainedAt: now }
              : it
          );
        }
        return [
          ...prev,
          { itemId: monster.rewardItemId, count: 1, firstObtainedAt: now, lastObtainedAt: now },
        ];
      });
    }
  };

  const visitSpot = (spotId: string) => {
    if (isSpotVisited(spotId)) return;
    setVisitedSpots((prev) => [...prev, { spotId, visitedAt: new Date().toISOString() }]);
  };

  const resetProgress = () => {
    storageService.resetAll();
    setCollectedMonsters([]);
    setOwnedItems([]);
    setVisitedSpots([]);
    setSettings({ mode: 'gps' });
  };

  const setMode = (mode: AppSettings['mode']) => {
    setSettings((prev) => ({ ...prev, mode }));
  };

  const value = useMemo<GameContextValue>(
    () => ({
      collectedMonsters,
      ownedItems,
      visitedSpots,
      collectMonster,
      visitSpot,
      isMonsterCollected,
      isSpotVisited,
      resetProgress,
      settings,
      setMode,
      userPosition,
      setUserPosition,
    }),
    [collectedMonsters, ownedItems, visitedSpots, settings, userPosition]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame은 GameProvider 내부에서만 사용할 수 있습니다.');
  }
  return ctx;
}
