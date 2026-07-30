import { useState } from 'react';
import { Compass, ShieldAlert, MapPin, Sparkles } from 'lucide-react';

interface Props {
  onRequestLocation: () => Promise<boolean>; // 위치 권한 요청, 성공 여부 반환
  onEnterDemo: () => void; // 시연 모드로 입장
  onEnterApp: () => void; // (권한 허용 후) 앱 시작
}

// 앱 첫 진입 화면: 로고/설명 + 위치 권한 요청 + 시연 모드 진입
export function StartScreen({ onRequestLocation, onEnterDemo, onEnterApp }: Props) {
  const [status, setStatus] = useState<'idle' | 'requesting' | 'denied'>('idle');

  const handleRequest = async () => {
    setStatus('requesting');
    const ok = await onRequestLocation();
    if (ok) {
      onEnterApp();
    } else {
      setStatus('denied');
    }
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-y-auto bg-slate-950 text-white">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: "url('/images/hero-gwangan.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 py-10 text-center">
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-700 shadow-lg shadow-cyan-900/50">
            <Compass size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">광안 몬스터 탐험대</h1>
          <p className="max-w-xs text-sm leading-relaxed text-slate-200">
            광안리 해변을 실제로 걸으며 숨겨진 해양 몬스터를 발견하고, 광안리 곳곳의 명소를
            탐험해보세요.
          </p>
        </div>

        <div className="my-8 grid w-full max-w-xs grid-cols-3 gap-3 text-xs text-slate-200">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <MapPin size={20} className="text-cyan-300" />
            <span>위치 기반 탐색</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <Sparkles size={20} className="text-amber-300" />
            <span>몬스터 수집</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-white/10 p-3 backdrop-blur">
            <ShieldAlert size={20} className="text-emerald-300" />
            <span>안전한 산책</span>
          </div>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            onClick={handleRequest}
            disabled={status === 'requesting'}
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-4 text-base font-bold shadow-lg shadow-cyan-900/40 active:scale-95 disabled:opacity-60"
          >
            <MapPin size={20} />
            {status === 'requesting' ? '위치 확인 중...' : '탐험 시작 (위치 권한 허용)'}
          </button>

          {status === 'denied' && (
            <p className="text-xs text-amber-300">
              위치 권한이 거부되었어요. 아래 시연 모드로 모든 기능을 체험할 수 있습니다.
            </p>
          )}

          <button
            onClick={onEnterDemo}
            className="rounded-full border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur active:scale-95"
          >
            시연 모드로 입장하기
          </button>

          <div className="mt-2 rounded-xl bg-black/30 p-3 text-left text-[11px] leading-relaxed text-slate-300">
            <p className="mb-1 font-semibold text-slate-200">⚠️ 안전 및 개인정보 안내</p>
            <p>· 위치 정보는 서버로 전송되지 않으며 이 기기 안에서만 사용됩니다.</p>
            <p>· 카메라 화면은 저장되지 않습니다.</p>
            <p>· 이동 중에는 차도, 위험 구역을 주의하고 안전하게 산책해주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
