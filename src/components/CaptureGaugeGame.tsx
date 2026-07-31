/**
 * 게이지 바 포획 미니게임
 * requestAnimationFrame 기반으로 정확한 위치 판정
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { CreatureData, Rarity } from '@/types/game';
import { CreatureSVG } from './CreatureSVG';
import { GAME_CONFIG } from '@/data/config';

interface CaptureGaugeGameProps {
  creature: CreatureData;
  useCharm: boolean;
  onSuccess: () => void;
  onFailure: () => void;
}

function renderStars(rarity: Rarity) {
  return Array.from({ length: rarity }, (_, i) => (
    <span key={i} className="star-icon">⭐</span>
  ));
}

export const CaptureGaugeGame: React.FC<CaptureGaugeGameProps> = ({
  creature,
  useCharm,
  onSuccess,
  onFailure,
}) => {
  const TRACK_WIDTH = 300;
  const SUCCESS_ZONE_WIDTH = Math.round(
    TRACK_WIDTH * GAME_CONFIG.GAUGE_SUCCESS_ZONE_RATIO
  );

  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [pointerPos, setPointerPos] = useState(0);
  const [successZoneStart, setSuccessZoneStart] = useState(() =>
    Math.floor(Math.random() * (TRACK_WIDTH - SUCCESS_ZONE_WIDTH))
  );
  const [gameOver, setGameOver] = useState(false);
  const [lastResult, setLastResult] = useState<'hit' | 'miss' | null>(null);
  const [inputLocked, setInputLocked] = useState(false);

  const pointerRef = useRef(0);
  const directionRef = useRef(1); // 1 = 오른쪽, -1 = 왼쪽
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gameOverRef = useRef(false);
  const inputLockedRef = useRef(false);
  const successZoneRef = useRef(successZoneStart);
  const onSuccessRef = useRef(onSuccess);
  const onFailureRef = useRef(onFailure);

  // Sync refs
  useEffect(() => {
    successZoneRef.current = successZoneStart;
  }, [successZoneStart]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onFailureRef.current = onFailure;
  }, [onSuccess, onFailure]);

  const speed = useCharm
    ? GAME_CONFIG.GAUGE_BASE_SPEED * GAME_CONFIG.SLOW_CHARM_RATIO
    : GAME_CONFIG.GAUGE_BASE_SPEED;

  // 게이지 애니메이션 루프
  useEffect(() => {
    function animate(timestamp: number) {
      if (gameOverRef.current) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      let delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // 탭 비활성 복귀 시 큰 점프 방지
      if (delta > 0.1) delta = 0.016;

      const move = speed * delta;
      let newPos = pointerRef.current + move * directionRef.current;

      if (newPos >= TRACK_WIDTH) {
        newPos = TRACK_WIDTH;
        directionRef.current = -1;
      } else if (newPos <= 0) {
        newPos = 0;
        directionRef.current = 1;
      }

      pointerRef.current = newPos;
      setPointerPos(newPos);

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current !== null) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [speed, TRACK_WIDTH]);

  const handleCapture = useCallback(() => {
    if (gameOverRef.current || inputLockedRef.current) return;

    inputLockedRef.current = true;
    setInputLocked(true);

    const pos = pointerRef.current;
    const zoneStart = successZoneRef.current;
    const isHit = pos >= zoneStart && pos <= zoneStart + SUCCESS_ZONE_WIDTH;

    if (isHit) {
      setLastResult('hit');
      setSuccessCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          gameOverRef.current = true;
          setGameOver(true);
          setTimeout(() => onSuccessRef.current(), 600);
        } else {
          // 성공 구역 재배치
          setTimeout(() => {
            const newStart = Math.floor(
              Math.random() * (TRACK_WIDTH - SUCCESS_ZONE_WIDTH)
            );
            setSuccessZoneStart(newStart);
          }, 300);
        }
        return next;
      });
    } else {
      setLastResult('miss');
      setFailCount((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          gameOverRef.current = true;
          setGameOver(true);
          setTimeout(() => onFailureRef.current(), 600);
        }
        return next;
      });
    }

    // 입력 쿨다운
    setTimeout(() => {
      inputLockedRef.current = false;
      setInputLocked(false);
      setLastResult(null);
    }, GAME_CONFIG.GAUGE_INPUT_COOLDOWN);
  }, [SUCCESS_ZONE_WIDTH, TRACK_WIDTH]);

  // 키보드 이벤트
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault();
        handleCapture();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleCapture]);

  return (
    <div className="modal-overlay">
      <div className="modal-content capture-game">
        {/* 생물 정보 */}
        <div className="capture-creature-info">
          <CreatureSVG
            svgType={creature.svgType}
            color={creature.color}
            accentColor={creature.accentColor}
            size={80}
            className="capture-creature-svg"
          />
          <div>
            <h3>{creature.name}</h3>
            <div>{renderStars(creature.rarity)}</div>
          </div>
        </div>

        {useCharm && (
          <div className="charm-active-banner">
            🌊 파도가 잔잔해졌어요
          </div>
        )}

        {/* 점수 */}
        <div className="capture-score-row">
          <div className="score-item score-success">
            <span>성공</span>
            <span className="score-value">
              {successCount} / 3
            </span>
          </div>
          <div className="score-item score-fail">
            <span>실패</span>
            <span className="score-value">
              {failCount} / 3
            </span>
          </div>
        </div>

        {/* 게이지 트랙 */}
        <div className="gauge-track-container">
          <div
            className="gauge-track"
            style={{ width: TRACK_WIDTH }}
          >
            {/* 성공 구역 */}
            <div
              className="gauge-success-zone"
              style={{
                left: successZoneStart,
                width: SUCCESS_ZONE_WIDTH,
              }}
            />
            {/* 포인터 */}
            <div
              className={`gauge-pointer ${lastResult === 'hit' ? 'pointer-hit' : ''} ${lastResult === 'miss' ? 'pointer-miss' : ''}`}
              style={{ left: pointerPos }}
            />
          </div>
        </div>

        {/* 포획 버튼 */}
        <button
          className={`btn btn-capture ${gameOver ? 'disabled' : ''}`}
          onClick={handleCapture}
          disabled={gameOver || inputLocked}
        >
          {gameOver
            ? successCount >= 3
              ? '포획 성공! 🎉'
              : '도망갔어요...'
            : '🎯 지금 포획!'}
        </button>

        <p className="capture-hint-text">
          {gameOver
            ? ''
            : 'Space 키 또는 버튼을 눌러 포획하세요'}
        </p>
      </div>
    </div>
  );
};

export default CaptureGaugeGame;
