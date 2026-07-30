import { useMemo, useState } from 'react';
import { ArrowLeft, Camera, History, Lightbulb, MapPin, CheckCircle2 } from 'lucide-react';
import { getSpotById } from '../data/spots';
import { useGame } from '../context/GameContext';
import { getDistanceMeters, formatDistance, isWithinRadius } from '../utils/geo';

interface Props {
  spotId: string;
  onClose: () => void;
}

// 탐험 스팟(광안리 명소) 정보 화면
export function SpotInfoScreen({ spotId, onClose }: Props) {
  const spot = getSpotById(spotId);
  const { userPosition, isSpotVisited, visitSpot } = useGame();
  const [justVisited, setJustVisited] = useState(false);

  const distance = useMemo(() => {
    if (!spot || !userPosition) return Infinity;
    return getDistanceMeters(userPosition.lat, userPosition.lng, spot.latitude, spot.longitude);
  }, [spot, userPosition]);

  if (!spot) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center text-white">
        <p>스팟 정보를 찾을 수 없습니다.</p>
        <button onClick={onClose} className="rounded-full bg-slate-800 px-5 py-2.5">
          닫기
        </button>
      </div>
    );
  }

  const visited = isSpotVisited(spot.id) || justVisited;
  const canVisit = isWithinRadius(distance, spot.radius);

  const handleVisit = () => {
    visitSpot(spot.id);
    setJustVisited(true);
  };

  return (
    <div className="h-dvh w-full overflow-y-auto bg-slate-950 pb-10 text-white">
      {/* 상단 대표 이미지 영역 (실제 사진 대신 그라디언트 + 아이콘으로 표현) */}
      <div
        className="relative flex h-56 w-full items-end p-5"
        style={{ background: `linear-gradient(135deg, ${spot.colorFrom}, ${spot.colorTo})` }}
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full bg-black/30 p-2 backdrop-blur"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold drop-shadow">{spot.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
            <MapPin size={14} /> 현재 거리 약 {formatDistance(distance)}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        {visited && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-900/40 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={18} /> 방문 완료로 기록된 장소예요.
          </div>
        )}

        <section>
          <h2 className="mb-1 text-sm font-bold text-cyan-300">장소 설명</h2>
          <p className="text-sm leading-relaxed text-slate-200">{spot.description}</p>
        </section>

        <section>
          <h2 className="mb-1 flex items-center gap-1 text-sm font-bold text-cyan-300">
            <History size={16} /> 역사와 특징
          </h2>
          <p className="text-sm leading-relaxed text-slate-200">{spot.history}</p>
        </section>

        <section>
          <h2 className="mb-1 flex items-center gap-1 text-sm font-bold text-cyan-300">
            <Lightbulb size={16} /> 관광 팁
          </h2>
          <p className="text-sm leading-relaxed text-slate-200">{spot.tip}</p>
        </section>

        <section>
          <h2 className="mb-1 flex items-center gap-1 text-sm font-bold text-cyan-300">
            <Camera size={16} /> 추천 사진 구도
          </h2>
          <p className="text-sm leading-relaxed text-slate-200">{spot.photoTip}</p>
        </section>

        <p className="text-[11px] leading-relaxed text-slate-500">
          ※ 본 정보는 시연을 위한 샘플 데이터입니다. 실제 방문 전 최신 정보를 확인해주세요.
        </p>

        {!visited && (
          <button
            onClick={handleVisit}
            disabled={!canVisit}
            className="w-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-600 py-4 font-bold shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400"
          >
            {canVisit ? '방문 완료 처리' : '조금 더 가까이 이동하세요 (50m 이내)'}
          </button>
        )}
      </div>
    </div>
  );
}
