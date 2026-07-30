// 위치 계산 관련 유틸리티 함수 모음

/**
 * Haversine 공식을 이용해 두 위경도 좌표 사이의 거리를 미터 단위로 계산한다.
 */
export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // 지구 반지름(m)
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 거리 값이 주어진 반경 이내인지 판정한다. (기본 50m)
 */
export function isWithinRadius(distanceMeters: number, radius = 50): boolean {
  return distanceMeters <= radius;
}

/**
 * 거리 값을 사람이 읽기 좋은 문자열로 변환한다.
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}
