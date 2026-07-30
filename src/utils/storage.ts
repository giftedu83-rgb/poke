import type {
  CollectedMonsterRecord,
  OwnedItemRecord,
  VisitedSpotRecord,
  AppSettings,
} from '../types';

// localStorage 저장 키 모음
const KEYS = {
  MONSTERS: 'gam_collected_monsters',
  ITEMS: 'gam_owned_items',
  SPOTS: 'gam_visited_spots',
  SETTINGS: 'gam_settings',
} as const;

const DEFAULT_SETTINGS: AppSettings = { mode: 'gps' };

// 공통 안전 파서: 값이 없거나 손상되어도 기본값을 반환하고 앱이 죽지 않게 한다.
function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    return parsed as T;
  } catch (e) {
    console.warn('localStorage 데이터 파싱 실패, 기본값을 사용합니다.', e);
    return fallback;
  }
}

function safeWrite(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // 저장 공간 부족 등 예외가 발생해도 앱이 중단되지 않도록 처리
    console.warn('localStorage 저장 실패', e);
  }
}

export const storageService = {
  // ---- 수집한 몬스터 ----
  loadCollectedMonsters(): CollectedMonsterRecord[] {
    return safeParse<CollectedMonsterRecord[]>(
      window.localStorage.getItem(KEYS.MONSTERS),
      []
    );
  },
  saveCollectedMonsters(records: CollectedMonsterRecord[]) {
    safeWrite(KEYS.MONSTERS, records);
  },

  // ---- 보유 아이템 ----
  loadOwnedItems(): OwnedItemRecord[] {
    return safeParse<OwnedItemRecord[]>(
      window.localStorage.getItem(KEYS.ITEMS),
      []
    );
  },
  saveOwnedItems(records: OwnedItemRecord[]) {
    safeWrite(KEYS.ITEMS, records);
  },

  // ---- 방문한 탐험 스팟 ----
  loadVisitedSpots(): VisitedSpotRecord[] {
    return safeParse<VisitedSpotRecord[]>(
      window.localStorage.getItem(KEYS.SPOTS),
      []
    );
  },
  saveVisitedSpots(records: VisitedSpotRecord[]) {
    safeWrite(KEYS.SPOTS, records);
  },

  // ---- 앱 설정(실제 GPS / 시연 모드) ----
  loadSettings(): AppSettings {
    return safeParse<AppSettings>(
      window.localStorage.getItem(KEYS.SETTINGS),
      DEFAULT_SETTINGS
    );
  },
  saveSettings(settings: AppSettings) {
    safeWrite(KEYS.SETTINGS, settings);
  },

  // ---- 전체 초기화(내 기록 화면에서 사용) ----
  resetAll() {
    try {
      window.localStorage.removeItem(KEYS.MONSTERS);
      window.localStorage.removeItem(KEYS.ITEMS);
      window.localStorage.removeItem(KEYS.SPOTS);
      window.localStorage.removeItem(KEYS.SETTINGS);
    } catch (e) {
      console.warn('localStorage 초기화 실패', e);
    }
  },
};
