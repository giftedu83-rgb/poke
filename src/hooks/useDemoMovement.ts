/**
 * 시연용 키보드/방향패드 이동 훅
 */

import { useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG } from '@/data/config';
import { moveLatLng, clampToBounds } from '@/utils/geo';

interface UseDemoMovementOptions {
  playerPos: { lat: number; lng: number };
  setPlayerPos: (pos: { lat: number; lng: number }) => void;
  disabled: boolean; // 모달 열림 등으로 이동 차단
}

type Direction = 'up' | 'down' | 'left' | 'right';

/** 방향 → 방위각 매핑 */
const BEARING_MAP: Record<Direction, number> = {
  up: 0,     // 북
  down: 180, // 남
  left: 270, // 서
  right: 90, // 동
};

export function useDemoMovement({
  playerPos,
  setPlayerPos,
  disabled,
}: UseDemoMovementOptions) {
  const pressedKeys = useRef<Set<string>>(new Set());
  const shiftHeld = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const playerPosRef = useRef(playerPos);

  // playerPos를 ref에 동기화
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  const move = useCallback(
    (direction: Direction, fast: boolean) => {
      const dist = fast
        ? GAME_CONFIG.MOVE_DISTANCE * GAME_CONFIG.FAST_MOVE_MULTIPLIER
        : GAME_CONFIG.MOVE_DISTANCE;
      const bearing = BEARING_MAP[direction];
      const current = playerPosRef.current;
      const next = moveLatLng(current.lat, current.lng, bearing, dist);
      const clamped = clampToBounds(
        next.lat,
        next.lng,
        GAME_CONFIG.DEMO_BOUNDS
      );
      setPlayerPos(clamped);
    },
    [setPlayerPos]
  );

  /** 방향패드용 이동 함수 (외부 호출용) */
  const moveDirection = useCallback(
    (dir: Direction) => {
      if (disabled) return;
      move(dir, false);
    },
    [disabled, move]
  );

  // 키보드 입력 처리
  useEffect(() => {
    function getDirection(key: string): Direction | null {
      switch (key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          return 'up';
        case 'arrowdown':
        case 's':
          return 'down';
        case 'arrowleft':
        case 'a':
          return 'left';
        case 'arrowright':
        case 'd':
          return 'right';
        default:
          return null;
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (disabled) return;
      if (e.key === 'Shift') {
        shiftHeld.current = true;
        return;
      }
      const dir = getDirection(e.key);
      if (dir) {
        e.preventDefault();
        pressedKeys.current.add(dir);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Shift') {
        shiftHeld.current = false;
        return;
      }
      const dir = getDirection(e.key);
      if (dir) {
        pressedKeys.current.delete(dir);
      }
    }

    function tick(timestamp: number) {
      const elapsed = timestamp - lastTickRef.current;
      // 약 60ms마다 이동 (연속 키 홀드)
      if (elapsed >= 60 && pressedKeys.current.size > 0 && !disabled) {
        lastTickRef.current = timestamp;
        const fast = shiftHeld.current;
        for (const dir of pressedKeys.current) {
          move(dir as Direction, fast);
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      pressedKeys.current.clear();
    };
  }, [disabled, move]);

  return { moveDirection };
}
