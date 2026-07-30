import { MapPin, Sparkles, Navigation } from 'lucide-react';
import type { Monster } from '../types';
import { RARITY_LABEL } from '../types';
import { MonsterArt } from './MonsterArt';
import { formatDistance } from '../utils/geo';

interface Props {
  monster: Monster;
  distance: number;
  canInteract: boolean;
  isCollected: boolean;
  isDemoMode: boolean;
  onDiscover: () => void;
  onMoveHere: () => void; // 시연 모드: 이 위치로 이동
}

const RARITY_BADGE: Record<Monster['rarity'], string> = {
  common: 'bg-slate-700 text-slate-200',
  uncommon: 'bg-emerald-700 text-emerald-100',
  rare: 'bg-sky-700 text-sky-100',
  legendary: 'bg-amber-600 text-amber-50',
};

// 몬스터 마커를 눌렀을 때 나타나는 바텀 시트 내용
export function MonsterSheet({
  monster,
  distance,
  canInteract,
  isCollected,
  isDemoMode,
  onDiscover,
  onMoveHere,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${monster.colorFrom}33, ${monster.colorTo}33)`,
          }}
        >
          <MonsterArt monster={monster} silhouette={!isCollected} size={80} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{isCollected ? monster.name : '???'}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${RARITY_BADGE[monster.rarity]}`}>
              {RARITY_LABEL[monster.rarity]}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={12} /> {monster.habitat}
          </p>
          <p className="mt-1 text-xs text-cyan-300">현재 거리 약 {formatDistance(distance)}</p>
        </div>
      </div>

      {isCollected && (
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{monster.description}</p>
      )}

      {isCollected ? (
        <div className="mt-4 rounded-xl bg-emerald-900/40 px-4 py-3 text-sm text-emerald-300">
          ✅ 이미 도감에 등록된 몬스터예요.
        </div>
      ) : (
        <>
          {!canInteract && (
            <p className="mt-3 rounded-xl bg-amber-900/30 px-4 py-2 text-sm text-amber-300">
              조금 더 가까이 이동하세요! (50m 이내에서 발견 가능)
            </p>
          )}
          <div className="mt-4 flex gap-2">
            {isDemoMode && !canInteract && (
              <button
                onClick={onMoveHere}
                className="flex flex-1 items-center justify-center gap-1 rounded-full border border-cyan-500 px-4 py-3 text-sm font-semibold text-cyan-300 active:scale-95"
              >
                <Navigation size={16} /> 이 위치로 이동
              </button>
            )}
            <button
              onClick={onDiscover}
              disabled={!canInteract}
              className="flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400"
            >
              <Sparkles size={16} /> 몬스터 발견하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
