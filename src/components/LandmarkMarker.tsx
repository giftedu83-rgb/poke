import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { LandmarkData } from '@/types/game';
import { haversineDistance } from '@/utils/geo';

interface LandmarkMarkerProps {
  landmark: LandmarkData;
  playerPos: { lat: number; lng: number };
  completed: boolean;
  onClick: (landmark: LandmarkData, distance: number) => void;
}

function getLandmarkEmoji(icon: string): string {
  switch (icon) {
    case 'beach':
      return '🏖️';
    case 'bridge':
      return '🌉';
    case 'park':
      return '🌊';
    default:
      return '📍';
  }
}

function createLandmarkIcon(
  landmark: LandmarkData,
  completed: boolean
): L.DivIcon {
  const emoji = getLandmarkEmoji(landmark.icon);
  const check = completed ? '<span class="landmark-check">✅</span>' : '';

  return L.divIcon({
    className: 'landmark-marker',
    html: `<div class="landmark-marker-inner ${completed ? 'landmark-completed' : ''}">
      <div class="landmark-icon-wrap">
        <span style="font-size:24px">${emoji}</span>
        ${check}
      </div>
      <div class="landmark-name-label">${landmark.name}</div>
    </div>`,
    iconSize: [80, 56],
    iconAnchor: [40, 28],
  });
}

export const LandmarkMarker: React.FC<LandmarkMarkerProps> = ({
  landmark,
  playerPos,
  completed,
  onClick,
}) => {
  const icon = useMemo(
    () => createLandmarkIcon(landmark, completed),
    [landmark, completed]
  );

  const distance = useMemo(
    () =>
      haversineDistance(
        playerPos.lat,
        playerPos.lng,
        landmark.lat,
        landmark.lng
      ),
    [playerPos, landmark]
  );

  const handleClick = () => {
    onClick(landmark, distance);
  };

  return (
    <Marker
      position={[landmark.lat, landmark.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
      zIndexOffset={800}
    />
  );
};

export default LandmarkMarker;
