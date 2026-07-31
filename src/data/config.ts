/**
 * 게임 설정 상수
 * 좌표, 거리, 게임 수치를 한 곳에서 관리
 */

export const GAME_CONFIG = {
  /** 시연 시작 좌표 (광안리 해변 중심부) */
  DEMO_CENTER: {
    lat: 35.1531,
    lng: 129.1186,
  },

  /** 시연 구역 경계 */
  DEMO_BOUNDS: {
    south: 35.1480,
    north: 35.1590,
    west: 129.1100,
    east: 129.1310,
  },

  /** 생물 생성 허용 구역 (해변 ~ 바다 앞 영역) */
  CREATURE_SPAWN_AREA: {
    south: 35.1495,
    north: 35.1570,
    west: 129.1110,
    east: 129.1280,
  },

  /** 관광명소 도착 판정 거리 (미터) */
  LANDMARK_TRIGGER_DISTANCE: 22,

  /** 생물 포획 가능 거리 (미터) */
  CREATURE_CAPTURE_DISTANCE: 13,

  /** 플레이어 주변 표시 원 반경 (미터) */
  PLAYER_RADIUS: 50,

  /** 생물 생성 반경 (미터) */
  CREATURE_SPAWN_RADIUS: 50,

  /** 생물 간 최소 간격 (미터) */
  CREATURE_MIN_SPACING: 8,

  /** 최대 동시 생물 수 */
  MAX_CREATURES: 5,

  /** 기본 이동 거리 (미터) */
  MOVE_DISTANCE: 5,

  /** 빠른 이동 배수 */
  FAST_MOVE_MULTIPLIER: 4,

  /** 기본 지도 줌 레벨 */
  DEFAULT_ZOOM: 17,

  /** 포획 성공 후 재생성 대기 (ms) */
  RESPAWN_DELAY_SUCCESS: 1500,

  /** 포획 실패 후 재생성 대기 (ms) */
  RESPAWN_DELAY_FAILURE: 3000,

  /** 포획 게임 게이지 기본 속도 (픽셀/초) */
  GAUGE_BASE_SPEED: 280,

  /** 느림 아이템 속도 감소 비율 */
  SLOW_CHARM_RATIO: 0.6,

  /** 포획 게임 성공 구역 비율 (전체 트랙 대비) */
  GAUGE_SUCCESS_ZONE_RATIO: 0.25,

  /** 포획 게임 입력 쿨다운 (ms) */
  GAUGE_INPUT_COOLDOWN: 400,

  /** 시연 지역에서 떨어져 있다고 판단하는 거리 (미터) */
  FAR_FROM_DEMO_DISTANCE: 2000,

  /** 도감에 저장할 개체당 최대 기록 수 */
  MAX_RECORDS_PER_CREATURE: 10,
};
