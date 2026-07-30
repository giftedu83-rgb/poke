import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Tooltip, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { LocateFixed, FlaskConical, AlertTriangle } from 'lucide-react';
import { MONSTERS } from '../data/monsters';
import { EXPLORE_SPOTS } from '../data/spots';
import { useGame } from '../context/GameContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { getDistanceMeters, formatDistance, isWithinRadius } from '../utils/geo';
import { createMonsterIcon, createSpotIcon, createUserIcon } from '../utils/mapIcons';
import { BottomSheet } from './BottomSheet';
import { MonsterSheet } from './MonsterSheet';
import { SpotSheet } from './SpotSheet';

const GWANGALLI_CENTER: [number, number] = [35.1532, 129.1187];

interface Props {
  onOpenMonster: (id: string) => void;
  onOpenSpot: (id: string) => void;
}

// 지도 인스턴스를 상위 컴포넌트 state로 끌어올리기 위한 헬퍼 (react-leaflet v4)
function MapInstanceBridge({ onReady }: { onReady: (map: LeafletMap) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

// 시연 모드에서 지도를 탭하면 가상 사용자 위치를 이동시킨다.
function DemoClickHandler({ enabled, onMove }: { enabled: boolean; onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (enabled) onMove(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Selected = { type: 'monster'; id: string } | { type: 'spot'; id: string } | null;

export function MapScreen({ onOpenMonster, onOpenSpot }: Props) {
  const { userPosition, setUserPosition, settings, isMonsterCollected, isSpotVisited } = useGame();
  const { error: geoError } = useGeolocation();
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [selected, setSelected] = useState<Selected>(null);

  const isDemo = settings.mode === 'demo';

  // 사용자 위치가 없을 경우(GPS 확인 중) 지도는 광안리 중심을 기본값으로 보여준다.
  const center: [number, number] = userPosition ? [userPosition.lat, userPosition.lng] : GWANGALLI_CENTER;

  const distanceTo = (lat: number, lng: number) =>
    userPosition ? getDistanceMeters(userPosition.lat, userPosition.lng, lat, lng) : Infinity;

  const handleRecenter = () => {
    if (map && userPosition) {
      map.flyTo([userPosition.lat, userPosition.lng], 17, { duration: 0.6 });
    }
  };

  const handleDemoMove = (lat: number, lng: number) => {
    setUserPosition({ lat, lng, accuracy: 12 });
  };

  // 바텀시트에서 "이 위치로 이동"을 누르면 대상 근처(반경의 60%)로 살짝 이동시켜 접근 가능 상태로 만든다.
  const moveNearTarget = (lat: number, lng: number) => {
    const jitter = 0.00008; // 약 8~9m 오차를 주어 자연스럽게 만든다.
    setUserPosition({ lat: lat + jitter, lng: lng + jitter, accuracy: 10 });
  };

  const selectedMonster = useMemo(
    () => (selected?.type === 'monster' ? MONSTERS.find((m) => m.id === selected.id) : undefined),
    [selected]
  );
  const selectedSpot = useMemo(
    () => (selected?.type === 'spot' ? EXPLORE_SPOTS.find((s) => s.id === selected.id) : undefined),
    [selected]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer center={center} zoom={16} className="h-full w-full" zoomControl={false}>
        <MapInstanceBridge onReady={setMap} />
        <DemoClickHandler enabled={isDemo} onMove={handleDemoMove} />
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 사용자 현재 위치 + GPS 정확도 원 */}
        {userPosition && (
          <>
            <Circle
              center={[userPosition.lat, userPosition.lng]}
              radius={userPosition.accuracy}
              pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.12, weight: 1 }}
            />
            <Marker position={[userPosition.lat, userPosition.lng]} icon={createUserIcon()}>
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                내 위치 (오차 ±{Math.round(userPosition.accuracy)}m)
              </Tooltip>
            </Marker>
          </>
        )}

        {/* 몬스터 마커 */}
        {MONSTERS.map((monster) => {
          const dist = distanceTo(monster.latitude, monster.longitude);
          const collected = isMonsterCollected(monster.id);
          const highlighted = !collected && isWithinRadius(dist, monster.collectionRadius);
          return (
            <Marker
              key={monster.id}
              position={[monster.latitude, monster.longitude]}
              icon={createMonsterIcon(monster, { highlighted, collected })}
              eventHandlers={{ click: () => setSelected({ type: 'monster', id: monster.id }) }}
            >
              <Tooltip direction="top" offset={[0, -22]}>
                {collected ? monster.name : '???'} · {formatDistance(dist)}
              </Tooltip>
            </Marker>
          );
        })}

        {/* 탐험 스팟 마커 */}
        {EXPLORE_SPOTS.map((spot) => {
          const dist = distanceTo(spot.latitude, spot.longitude);
          const visited = isSpotVisited(spot.id);
          const highlighted = isWithinRadius(dist, spot.radius);
          return (
            <Marker
              key={spot.id}
              position={[spot.latitude, spot.longitude]}
              icon={createSpotIcon(spot, { highlighted, visited })}
              eventHandlers={{ click: () => setSelected({ type: 'spot', id: spot.id }) }}
            >
              <Tooltip direction="top" offset={[0, -22]}>
                {spot.name} · {formatDistance(dist)}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* 상단 안내 배너 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] flex flex-col gap-2 p-3">
        <div className="pointer-events-auto flex items-center justify-between rounded-2xl bg-slate-950/85 px-4 py-2.5 text-xs text-slate-200 shadow-lg backdrop-blur">
          <span className="font-bold text-cyan-300">광안 몬스터 탐험대</span>
          {userPosition ? (
            <span>GPS 정확도 ±{Math.round(userPosition.accuracy)}m</span>
          ) : (
            <span className="text-amber-300">위치 확인 중...</span>
          )}
        </div>
        {isDemo && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-fuchsia-950/80 px-4 py-2 text-[11px] text-fuchsia-200 shadow-lg backdrop-blur">
            <FlaskConical size={14} />
            시연 모드 (개발/발표용) · 지도를 탭하면 내 위치가 이동해요
          </div>
        )}
        {geoError && !isDemo && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-amber-950/80 px-4 py-2 text-[11px] text-amber-200 shadow-lg backdrop-blur">
            <AlertTriangle size={14} />
            {geoError}
          </div>
        )}
      </div>

      {/* 내 위치로 이동 버튼 */}
      <button
        onClick={handleRecenter}
        disabled={!userPosition}
        className="absolute bottom-5 right-4 z-[400] flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/90 text-cyan-300 shadow-xl active:scale-95 disabled:opacity-50"
        aria-label="내 위치로 이동"
      >
        <LocateFixed size={22} />
      </button>

      {/* 몬스터 바텀 시트 */}
      <BottomSheet open={!!selectedMonster} onClose={() => setSelected(null)}>
        {selectedMonster && (
          <MonsterSheet
            monster={selectedMonster}
            distance={distanceTo(selectedMonster.latitude, selectedMonster.longitude)}
            canInteract={isWithinRadius(
              distanceTo(selectedMonster.latitude, selectedMonster.longitude),
              selectedMonster.collectionRadius
            )}
            isCollected={isMonsterCollected(selectedMonster.id)}
            isDemoMode={isDemo}
            onDiscover={() => onOpenMonster(selectedMonster.id)}
            onMoveHere={() => moveNearTarget(selectedMonster.latitude, selectedMonster.longitude)}
          />
        )}
      </BottomSheet>

      {/* 탐험 스팟 바텀 시트 */}
      <BottomSheet open={!!selectedSpot} onClose={() => setSelected(null)}>
        {selectedSpot && (
          <SpotSheet
            spot={selectedSpot}
            distance={distanceTo(selectedSpot.latitude, selectedSpot.longitude)}
            isVisited={isSpotVisited(selectedSpot.id)}
            isDemoMode={isDemo}
            onOpenInfo={() => onOpenSpot(selectedSpot.id)}
            onMoveHere={() => moveNearTarget(selectedSpot.latitude, selectedSpot.longitude)}
          />
        )}
      </BottomSheet>
    </div>
  );
}
