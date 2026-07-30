import { useState } from 'react';
import { MapPinned, ShieldCheck, RotateCcw, FlaskConical, Satellite } from 'lucide-react';
import { EXPLORE_SPOTS } from '../data/spots';
import { MONSTERS } from '../data/monsters';
import { useGame } from '../context/GameContext';

// 내 기록 화면: 방문한 탐험 스팟 목록 + 설정(GPS/시연 모드 전환) + 초기화 + 안전 안내
export function RecordScreen() {
  const { visitedSpots, collectedMonsters, settings, setMode, resetProgress, userPosition } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-8">
      <h1 className="text-xl font-extrabold">내 기록</h1>

      {/* 요약 카드 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-900 p-4 text-center">
          <p className="text-2xl font-extrabold text-cyan-300">{collectedMonsters.length}</p>
          <p className="text-xs text-slate-400">수집한 몬스터 ({MONSTERS.length}종 중)</p>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-center">
          <p className="text-2xl font-extrabold text-emerald-300">{visitedSpots.length}</p>
          <p className="text-xs text-slate-400">방문한 탐험 스팟 ({EXPLORE_SPOTS.length}곳 중)</p>
        </div>
      </div>

      {/* 위치 모드 설정 */}
      <section className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-cyan-300">위치 모드 설정</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('gps')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${
              settings.mode === 'gps' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Satellite size={16} /> 실제 GPS 모드
          </button>
          <button
            onClick={() => setMode('demo')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold ${
              settings.mode === 'demo' ? 'bg-fuchsia-700 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <FlaskConical size={16} /> 시연 모드
          </button>
        </div>
        {settings.mode === 'demo' && (
          <p className="mt-2 text-[11px] text-fuchsia-300">
            시연 모드는 개발 및 발표용 기능입니다. 지도를 탭하거나 바텀시트의 "이 위치로 이동"
            버튼으로 가상 위치를 바꿀 수 있어요.
          </p>
        )}
        {userPosition && (
          <p className="mt-2 text-[11px] text-slate-500">
            현재 위치: {userPosition.lat.toFixed(5)}, {userPosition.lng.toFixed(5)} (오차 ±
            {Math.round(userPosition.accuracy)}m)
          </p>
        )}
      </section>

      {/* 방문한 탐험 스팟 목록 */}
      <section className="mt-6">
        <h2 className="mb-2 flex items-center gap-1 text-sm font-bold text-cyan-300">
          <MapPinned size={16} /> 방문한 탐험 스팟
        </h2>
        {visitedSpots.length === 0 ? (
          <p className="text-xs text-slate-500">아직 방문 완료한 스팟이 없어요.</p>
        ) : (
          <div className="space-y-2">
            {visitedSpots.map((v) => {
              const spot = EXPLORE_SPOTS.find((s) => s.id === v.spotId);
              if (!spot) return null;
              return (
                <div key={v.spotId} className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2.5">
                  <span className="text-sm">{spot.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(v.visitedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 안전 및 개인정보 안내 */}
      <section className="mt-6 rounded-2xl bg-slate-900 p-4">
        <h2 className="mb-2 flex items-center gap-1 text-sm font-bold text-emerald-300">
          <ShieldCheck size={16} /> 안전 및 개인정보 안내
        </h2>
        <ul className="space-y-1 text-[11px] leading-relaxed text-slate-400">
          <li>· 앱 화면을 보면서 이동할 때 차도, 계단, 통제 구역을 주의해주세요.</li>
          <li>· 모든 위치 정보는 이 기기 안에서만 사용되며 서버로 전송되지 않습니다.</li>
          <li>· 카메라 화면과 사진은 저장되거나 서버로 전송되지 않습니다.</li>
          <li>· 수집 기록은 이 브라우저의 localStorage에만 저장됩니다.</li>
        </ul>
      </section>

      {/* 기록 초기화 */}
      <section className="mt-6">
        <button
          onClick={handleReset}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
            confirmReset ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
          }`}
        >
          <RotateCcw size={16} />
          {confirmReset ? '정말 초기화할까요? 다시 눌러 확인' : '수집 기록 전체 초기화'}
        </button>
        {confirmReset && (
          <button
            onClick={() => setConfirmReset(false)}
            className="mt-2 w-full rounded-xl px-4 py-2 text-xs text-slate-400"
          >
            취소
          </button>
        )}
      </section>
    </div>
  );
}
