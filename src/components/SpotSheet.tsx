import { MapPin, Navigation, Info, CheckCircle2 } from 'lucide-react';
import type { ExploreSpot } from '../types';
import { formatDistance } from '../utils/geo';

interface Props {
  spot: ExploreSpot;
  distance: number;
  isVisited: boolean;
  isDemoMode: boolean;
  onOpenInfo: () => void;
  onMoveHere: () => void;
}

// 탐험 스팟 마커를 눌렀을 때 나타나는 바텀 시트 내용
export function SpotSheet({ spot, distance, isVisited, isDemoMode, onOpenInfo, onMoveHere }: Props) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-3xl"
          style={{ background: `linear-gradient(135deg, ${spot.colorFrom}, ${spot.colorTo})` }}
        >
          📍
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">{spot.name}</h3>
            {isVisited && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-semibold text-emerald-100">
                <CheckCircle2 size={12} /> 방문완료
              </span>
            )}
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <MapPin size={12} /> 탐험 스팟
          </p>
          <p className="mt-1 text-xs text-cyan-300">현재 거리 약 {formatDistance(distance)}</p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-300">{spot.shortIntro}</p>

      <div className="mt-4 flex gap-2">
        {isDemoMode && (
          <button
            onClick={onMoveHere}
            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-cyan-500 px-4 py-3 text-sm font-semibold text-cyan-300 active:scale-95"
          >
            <Navigation size={16} /> 이 위치로 이동
          </button>
        )}
        <button
          onClick={onOpenInfo}
          className="flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg active:scale-95"
        >
          <Info size={16} /> 장소 정보 확인
        </button>
      </div>
    </div>
  );
}
