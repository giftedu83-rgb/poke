import L from 'leaflet';
import type { Monster, ExploreSpot } from '../types';

// react-leaflet에서 사용할 커스텀 마커 아이콘(L.divIcon)을 생성하는 유틸 함수 모음
// 몬스터/스팟/내 위치 마커를 색상과 모양으로 구분한다.

const MONSTER_EMOJI: Record<string, string> = {
  m1: '🐦',
  m2: '🎐',
  m3: '🐙',
  m4: '🦀',
  m5: '🐡',
  m6: '🐬',
  m7: '✨',
  m8: '🌊',
};

const SPOT_EMOJI: Record<string, string> = {
  s1: '🏖️',
  s2: '🌉',
  s3: '🌳',
  s4: '🍣',
  s5: '🚶',
  s6: '🌸',
};

export function createMonsterIcon(monster: Monster, opts: { highlighted: boolean; collected: boolean }) {
  const { highlighted, collected } = opts;
  const emoji = MONSTER_EMOJI[monster.id] ?? '❓';
  const visual = monster.id === 'm1'
    ? '<span class="windgal-flight block h-9 w-9" aria-label="윈드갈"></span>'
    : emoji;
  const html = `
    <div class="flex items-center justify-center ${highlighted ? 'marker-pulse' : ''}">
      <div class="flex h-11 w-11 items-center justify-center rounded-full text-xl border-2 ${
        collected ? 'border-slate-400/60 opacity-60 grayscale' : 'border-white/80'
      } shadow-lg" style="background: linear-gradient(135deg, ${monster.colorFrom}, ${monster.colorTo})">
        ${visual}
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createSpotIcon(spot: ExploreSpot, opts: { highlighted: boolean; visited: boolean }) {
  const { highlighted, visited } = opts;
  const emoji = SPOT_EMOJI[spot.id] ?? '📍';
  const html = `
    <div class="flex items-center justify-center ${highlighted ? 'marker-pulse' : ''}">
      <div class="flex h-11 w-11 items-center justify-center rounded-xl text-xl border-2 ${
        visited ? 'border-emerald-300' : 'border-white/80'
      } shadow-lg" style="background: linear-gradient(135deg, ${spot.colorFrom}, ${spot.colorTo})">
        ${emoji}
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export function createUserIcon() {
  const html = `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <span class="absolute h-6 w-6 rounded-full bg-cyan-400/40 animate-ping"></span>
      <span class="relative h-3.5 w-3.5 rounded-full bg-cyan-400 border-2 border-white shadow"></span>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}
