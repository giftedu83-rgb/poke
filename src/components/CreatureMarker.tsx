import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { SpawnedCreature, CreatureData, Rarity } from '@/types/game';
import { haversineDistance } from '@/utils/geo';

interface CreatureMarkerProps {
  spawn: SpawnedCreature;
  creature: CreatureData;
  playerPos: { lat: number; lng: number };
  onClick: (spawn: SpawnedCreature, distance: number) => void;
}

function getStars(rarity: Rarity): string {
  return '⭐'.repeat(rarity);
}

function createCreatureIcon(creature: CreatureData): L.DivIcon {
  const shimmer = creature.rarity === 3 ? 'creature-shimmer' : '';
  const bgColor =
    creature.rarity === 3
      ? 'rgba(255,215,0,0.15)'
      : creature.rarity === 2
        ? 'rgba(147,112,219,0.1)'
        : 'rgba(100,180,255,0.08)';

  return L.divIcon({
    className: `creature-marker ${shimmer}`,
    html: `<div class="creature-marker-inner" style="background:${bgColor}">
      <div class="creature-bounce">
        <div class="creature-emoji" style="font-size:28px">${getCreatureEmoji(creature.svgType)}</div>
      </div>
      <div class="creature-stars">${getStars(creature.rarity)}</div>
      <div class="creature-name-label">${creature.name}</div>
    </div>`,
    iconSize: [60, 72],
    iconAnchor: [30, 36],
  });
}

function getCreatureEmoji(svgType: string): string {
  const emojiMap: Record<string, string> = {
    mackerel: '🐟',
    anchovy: '🐠',
    starfish: '⭐',
    crab: '🦀',
    shrimp: '🦐',
    octopus: '🐙',
    seahorse: '🐡',
    pufferfish: '🐡',
    cuttlefish: '🦑',
    porpoise: '🐬',
    turtle: '🐢',
    dolphin: '🐬',
  };
  return emojiMap[svgType] || '🐟';
}

export const CreatureMarker: React.FC<CreatureMarkerProps> = ({
  spawn,
  creature,
  playerPos,
  onClick,
}) => {
  const icon = useMemo(() => createCreatureIcon(creature), [creature]);

  const distance = useMemo(
    () =>
      haversineDistance(playerPos.lat, playerPos.lng, spawn.lat, spawn.lng),
    [playerPos, spawn.lat, spawn.lng]
  );

  const handleClick = () => {
    onClick(spawn, distance);
  };

  return (
    <Marker
      position={[spawn.lat, spawn.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
      zIndexOffset={500}
    />
  );
};

export default CreatureMarker;
