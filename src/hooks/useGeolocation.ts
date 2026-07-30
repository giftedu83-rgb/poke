import { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';

// 실제 GPS 모드일 때 지속적으로 위치를 감시(watch)하여 컨텍스트에 반영하는 훅
export function useGeolocation() {
  const { settings, setUserPosition } = useGame();
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // 시연 모드에서는 실제 GPS를 사용하지 않는다.
    if (settings.mode !== 'gps') {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setError('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        setError(err.message || '위치 정보를 가져올 수 없습니다.');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
    watchIdRef.current = id;

    return () => {
      navigator.geolocation.clearWatch(id);
      watchIdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.mode]);

  return { error };
}
