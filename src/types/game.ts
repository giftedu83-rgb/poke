/** 희귀도 등급 */
export type Rarity = 1 | 2 | 3;

/** 해양 생물 기본 데이터 (고정 데이터) */
export interface CreatureData {
  id: string;
  name: string;
  englishName: string;
  rarity: Rarity;
  color: string;
  accentColor: string;
  minLengthCm: number;
  maxLengthCm: number;
  minWeightG: number;
  maxWeightG: number;
  habitat: string;
  description: string;
  funFacts: string[];
  ecosystemRole: string;
  conservationTip: string;
  spawnWeight: number;
  /** SVG 타입 식별자 */
  svgType: string;
}

/** 지도에 생성된 해양 생물 인스턴스 */
export interface SpawnedCreature {
  instanceId: string;
  creatureId: string;
  lat: number;
  lng: number;
  spawnedAt: number;
}

/** 포획된 개체 기록 */
export interface CaptureRecord {
  creatureId: string;
  lengthCm: number;
  weightG: number;
  capturedAt: number;
}

/** 도감 엔트리 */
export interface CollectionEntry {
  creatureId: string;
  captureCount: number;
  records: CaptureRecord[];
  maxLengthCm: number;
  maxWeightG: number;
}

/** 관광명소 데이터 */
export interface LandmarkData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  icon: string;
  story: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
    explanation: string;
  };
}

/** 게임 저장 데이터 */
export interface GameSaveData {
  collection: Record<string, CollectionEntry>;
  completedLandmarks: string[];
  waveCharmCount: number;
  tutorialSeen: boolean;
  totalCaptures: number;
}

/** 포획 게임 상태 */
export type CapturePhase = 'intro' | 'playing' | 'success' | 'failure';

/** 관광명소 인터랙션 단계 */
export type LandmarkPhase = 'story' | 'quiz' | 'result';

/** 탭 식별자 */
export type TabId = 'explore' | 'collection';
