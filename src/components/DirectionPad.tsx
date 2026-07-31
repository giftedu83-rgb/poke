import React, { useRef, useCallback, useEffect } from 'react';

interface DirectionPadProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DirectionPad: React.FC<DirectionPadProps> = ({ onMove }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRepeat = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      onMove(dir);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => onMove(dir), 80);
    },
    [onMove]
  );

  const stopRepeat = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const btnClass = 'dpad-btn';

  return (
    <div className="direction-pad">
      <button
        className={`${btnClass} dpad-up`}
        onPointerDown={() => startRepeat('up')}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        aria-label="북쪽 이동"
      >
        ▲
      </button>
      <button
        className={`${btnClass} dpad-left`}
        onPointerDown={() => startRepeat('left')}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        aria-label="서쪽 이동"
      >
        ◀
      </button>
      <div className="dpad-center">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="rgba(30,136,229,0.3)" stroke="rgba(30,136,229,0.5)" strokeWidth="1" />
          <circle cx="10" cy="10" r="3" fill="rgba(30,136,229,0.6)" />
        </svg>
      </div>
      <button
        className={`${btnClass} dpad-right`}
        onPointerDown={() => startRepeat('right')}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        aria-label="동쪽 이동"
      >
        ▶
      </button>
      <button
        className={`${btnClass} dpad-down`}
        onPointerDown={() => startRepeat('down')}
        onPointerUp={stopRepeat}
        onPointerLeave={stopRepeat}
        onPointerCancel={stopRepeat}
        aria-label="남쪽 이동"
      >
        ▼
      </button>
    </div>
  );
};

export default DirectionPad;
