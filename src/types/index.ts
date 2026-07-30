// 앱 전역에서 사용하는 공통 타입 정의

// 몬스터 등급
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export const RARITY_LABEL: Record<Rarity, string> = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  legendary: '전설',
};

// 몬스터 데이터 구조
export interface Monster {
  id: string;
  name: string; // 몬스터 이름
  species: string; // 종(모티브가 된 해양 생물)
  description: string; // 설명
  rarity: Rarity; // 등급
  latitude: number;
  longitude: number;
  habitat: string; // 서식/출몰 장소 설명
  collectionRadius: number; // 수집 가능 반경(m) - 데이터에서 조정 가능
  colorFrom: string; // 카드/아트 그라디언트 색상
  colorTo: string;
  rewardItemId: string; // 보상 아이템 id
}

// 탐험 스팟(명소) 데이터 구조
export interface ExploreSpot {
  id: string;
  name: string;
  shortIntro: string; // 짧은 소개(바텀시트용)
  description: string; // 장소 설명
  history: string; // 역사/특징
  tip: string; // 관광 팁
  photoTip: string; // 추천 사진 구도
  latitude: number;
  longitude: number;
  radius: number; // 방문 인정 반경(m)
  colorFrom: string;
  colorTo: string;
}

// 아이템 데이터 구조
export interface GameItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

// 수집한 몬스터 기록
export interface CollectedMonsterRecord {
  monsterId: string;
  collectedAt: string; // ISO 날짜 문자열
}

// 보유 아이템 기록
export interface OwnedItemRecord {
  itemId: string;
  count: number;
  firstObtainedAt: string;
  lastObtainedAt: string;
}

// 방문 완료한 탐험 스팟 기록
export interface VisitedSpotRecord {
  spotId: string;
  visitedAt: string;
}

// 위치 모드
export type LocationMode = 'gps' | 'demo';

// 앱 설정
export interface AppSettings {
  mode: LocationMode;
}

// 사용자 좌표
export interface UserPosition {
  lat: number;
  lng: number;
  accuracy: number; // GPS 정확도(m). 시연 모드에서는 임의값 사용
}

// 앱 화면 구분(내부 라우팅용)
export type ScreenName =
  | 'start'
  | 'map'
  | 'dex'
  | 'items'
  | 'records'
  | 'discovery'
  | 'spotInfo';
