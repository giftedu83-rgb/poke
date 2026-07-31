import React from 'react';
import { Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GAME_CONFIG } from '@/data/config';

interface PlayerMarkerProps {
  position: { lat: number; lng: number };
}

const playerIcon = L.divIcon({
  className: 'player-marker',
  html: `<div class="player-marker-inner">
    <div class="player-pulse"></div>
    <div class="player-dot">
      <svg width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="#1E88E5" stroke="white" stroke-width="3"/>
        <path d="M14 6 L18 14 L14 12 L10 14 Z" fill="white" opacity="0.9"/>
      </svg>
    </div>
  </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({ position }) => {
  return (
    <>
      <Circle
        center={[position.lat, position.lng]}
        radius={GAME_CONFIG.PLAYER_RADIUS}
        pathOptions={{
          color: '#1E88E5',
          fillColor: '#1E88E5',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4 4',
        }}
      />
      <Marker
        position={[position.lat, position.lng]}
        icon={playerIcon}
        zIndexOffset={1000}
      />
    </>
  );
};

/** 지도 중심을 플레이어에게 맞추는 유틸 컴포넌트 */
export const MapFollower: React.FC<{
  position: { lat: number; lng: number };
  follow: boolean;
}> = ({ position, follow }) => {
  const map = useMap();

  React.useEffect(() => {
    if (follow) {
      map.setView([position.lat, position.lng], map.getZoom(), {
        animate: true,
        duration: 0.3,
      });
    }
  }, [position, follow, map]);

  return null;
};

export default PlayerMarker;
