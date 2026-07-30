import { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StartScreen } from './components/StartScreen';
import { BottomNav } from './components/BottomNav';
import { MapScreen } from './components/MapScreen';
import { DexScreen } from './components/DexScreen';
import { ItemsScreen } from './components/ItemsScreen';
import { RecordScreen } from './components/RecordScreen';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { SpotInfoScreen } from './components/SpotInfoScreen';
import type { ScreenName } from './types';

// 앱 내부 라우팅을 별도 라우터 라이브러리 없이 화면 상태로 관리한다.
function AppShell() {
  const [screen, setScreen] = useState<ScreenName>('start');
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const { setUserPosition, setMode } = useGame();

  // 브라우저 Geolocation API로 위치 권한을 요청한다. 실패 시 false를 반환한다.
  const requestLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
          setMode('gps');
          resolve(true);
        },
        () => resolve(false),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  };

  // 시연 모드 진입: 광안리 중심 좌표를 가상 현재 위치로 설정한다.
  const enterDemoMode = () => {
    setMode('demo');
    setUserPosition({ lat: 35.1532, lng: 129.1187, accuracy: 15 });
    setScreen('map');
  };

  const openMonster = (id: string) => {
    setSelectedMonsterId(id);
    setScreen('discovery');
  };
  const openSpot = (id: string) => {
    setSelectedSpotId(id);
    setScreen('spotInfo');
  };

  const mainScreens: ScreenName[] = ['map', 'dex', 'items', 'records'];

  return (
    <div className="mx-auto h-dvh max-w-md bg-slate-950 text-white">
      {screen === 'start' && (
        <StartScreen
          onRequestLocation={requestLocation}
          onEnterDemo={enterDemoMode}
          onEnterApp={() => setScreen('map')}
        />
      )}

      {mainScreens.includes(screen) && (
        <div className="relative h-full">
          <div className="h-full pb-16">
            {screen === 'map' && (
              <MapScreen onOpenMonster={openMonster} onOpenSpot={openSpot} />
            )}
            {screen === 'dex' && <DexScreen />}
            {screen === 'items' && <ItemsScreen />}
            {screen === 'records' && <RecordScreen />}
          </div>
          <BottomNav current={screen} onNavigate={setScreen} />
        </div>
      )}

      {screen === 'discovery' && selectedMonsterId && (
        <DiscoveryScreen
          monsterId={selectedMonsterId}
          onClose={() => setScreen('map')}
        />
      )}

      {screen === 'spotInfo' && selectedSpotId && (
        <SpotInfoScreen spotId={selectedSpotId} onClose={() => setScreen('map')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <AppShell />
      </GameProvider>
    </ErrorBoundary>
  );
}
