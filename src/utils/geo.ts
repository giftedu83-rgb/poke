/**
 * 지리 좌표 관련 유틸리티
 * Haversine 공식 기반 실제 미터 단위 거리 계산
 */

const EARTH_RADIUS_M = 6_371_000;

/** 각도를 라디안으로 변환 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine 공식으로 두 좌표 간 거리를 미터 단위로 계산
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

/**
 * 주어진 위치에서 방향과 거리만큼 이동한 새 좌표 계산
 * @param lat 현재 위도
 * @param lng 현재 경도
 * @param bearingDeg 이동 방향 (0=북, 90=동, 180=남, 270=서)
 * @param distanceM 이동 거리 (미터)
 */
export function moveLatLng(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceM: number
): { lat: number; lng: number } {
  const bearing = toRad(bearingDeg);
  const angularDist = distanceM / EARTH_RADIUS_M;
  const lat1 = toRad(lat);
  const lng1 = toRad(lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDist) +
      Math.cos(lat1) * Math.sin(angularDist) * Math.cos(bearing)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDist) * Math.cos(lat1),
      Math.cos(angularDist) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (lng2 * 180) / Math.PI,
  };
}

/**
 * 좌표가 bounds 안에 있는지 확인
 */
export function isInBounds(
  lat: number,
  lng: number,
  bounds: { south: number; north: number; west: number; east: number }
): boolean {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
}

/**
 * 좌표를 bounds 안으로 클램프
 */
export function clampToBounds(
  lat: number,
  lng: number,
  bounds: { south: number; north: number; west: number; east: number }
): { lat: number; lng: number } {
  return {
    lat: Math.max(bounds.south, Math.min(bounds.north, lat)),
    lng: Math.max(bounds.west, Math.min(bounds.east, lng)),
  };
}
