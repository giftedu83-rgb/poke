/**
 * 랜덤 유틸리티 함수들
 */

import { GAME_CONFIG } from '@/data/config';
import type { CreatureData, SpawnedCreature } from '@/types/game';
import { haversineDistance } from './geo';

/**
 * min ~ max 사이의 랜덤 실수
 */
export function randomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * min ~ max 사이의 랜덤 정수
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomFloat(min, max + 1));
}

/**
 * 고유 ID 생성
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * 가중치 기반 랜덤 생물 선택
 * 각 생물의 spawnWeight를 기준으로 확률적 선택
 */
export function weightedRandomCreature(
  creatures: CreatureData[],
  recentIds: string[] = []
): CreatureData {
  // 최근 생성된 생물의 가중치를 낮춰서 중복 방지
  const adjusted = creatures.map((c) => ({
    creature: c,
    weight: recentIds.includes(c.id) ? c.spawnWeight * 0.3 : c.spawnWeight,
  }));

  const totalWeight = adjusted.reduce((sum, a) => sum + a.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const a of adjusted) {
    roll -= a.weight;
    if (roll <= 0) return a.creature;
  }

  return creatures[0];
}

/**
 * 플레이어 주변 랜덤 위치 생성
 * - 반경 내 랜덤 좌표
 * - 기존 생물과 최소 거리 유지
 * - 플레이어와 동일 좌표 방지
 */
export function randomSpawnPosition(
  playerLat: number,
  playerLng: number,
  existingSpawns: SpawnedCreature[],
  maxAttempts: number = 20
): { lat: number; lng: number } | null {
  const radius = GAME_CONFIG.CREATURE_SPAWN_RADIUS;
  const minSpacing = GAME_CONFIG.CREATURE_MIN_SPACING;
  const bounds = GAME_CONFIG.CREATURE_SPAWN_AREA;

  for (let i = 0; i < maxAttempts; i++) {
    // 랜덤 각도와 거리
    const angle = Math.random() * 2 * Math.PI;
    const dist = 10 + Math.random() * (radius - 10); // 최소 10m 떨어진 곳

    // 위도/경도 변환 (근사값, 짧은 거리에서 충분히 정확)
    const dLat = (dist * Math.cos(angle)) / 111320;
    const dLng =
      (dist * Math.sin(angle)) /
      (111320 * Math.cos((playerLat * Math.PI) / 180));

    const lat = playerLat + dLat;
    const lng = playerLng + dLng;

    // bounds 체크
    if (
      lat < bounds.south ||
      lat > bounds.north ||
      lng < bounds.west ||
      lng > bounds.east
    ) {
      continue;
    }

    // 기존 생물과의 최소 거리 체크
    const tooClose = existingSpawns.some(
      (s) => haversineDistance(lat, lng, s.lat, s.lng) < minSpacing
    );
    if (tooClose) continue;

    return { lat, lng };
  }

  // 최대 시도 횟수 초과 시 간단한 위치 반환
  const fallbackAngle = Math.random() * 2 * Math.PI;
  const fallbackDist = 15 + Math.random() * 20;
  const dLat = (fallbackDist * Math.cos(fallbackAngle)) / 111320;
  const dLng =
    (fallbackDist * Math.sin(fallbackAngle)) /
    (111320 * Math.cos((playerLat * Math.PI) / 180));

  return {
    lat: Math.max(bounds.south, Math.min(bounds.north, playerLat + dLat)),
    lng: Math.max(bounds.west, Math.min(bounds.east, playerLng + dLng)),
  };
}

/**
 * 포획 시 개체의 길이와 무게를 생성
 * 길이와 무게 사이에 상관관계 적용
 */
export function generateCaptureStats(creature: CreatureData): {
  lengthCm: number;
  weightG: number;
} {
  // 0~1 사이 정규화된 크기 비율 (약간의 변동)
  const sizeRatio = Math.random() * 0.6 + 0.2; // 0.2 ~ 0.8
  const variance = (Math.random() - 0.5) * 0.15; // ±0.075 변동

  const lengthRatio = Math.max(0, Math.min(1, sizeRatio + variance));
  const weightRatio = Math.max(
    0,
    Math.min(1, sizeRatio + (Math.random() - 0.5) * 0.2)
  );

  const lengthCm =
    creature.minLengthCm +
    lengthRatio * (creature.maxLengthCm - creature.minLengthCm);
  const weightG =
    creature.minWeightG +
    weightRatio * (creature.maxWeightG - creature.minWeightG);

  return {
    lengthCm: Math.round(lengthCm * 10) / 10,
    weightG: Math.round(weightG * 10) / 10,
  };
}
