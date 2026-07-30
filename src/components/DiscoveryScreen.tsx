import { useEffect, useRef, useState } from 'react';
import { X, Sparkles, CameraOff, PartyPopper } from 'lucide-react';
import { getMonsterById } from '../data/monsters';
import { getItemById } from '../data/items';
import { useGame } from '../context/GameContext';
import { MonsterArt } from './MonsterArt';
import { RARITY_LABEL } from '../types';

interface Props {
  monsterId: string;
  onClose: () => void;
}

// 몬스터 발견(카메라 오버레이) 화면
// 실제 공간 인식형 AR은 구현하지 않고, 카메라 화면 위에 몬스터를 겹쳐 보여주는 연출만 제공한다.
export function DiscoveryScreen({ monsterId, onClose }: Props) {
  const monster = getMonsterById(monsterId);
  const { collectMonster, isMonsterCollected } = useGame();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [collected, setCollected] = useState(false);
  const alreadyCollected = monster ? isMonsterCollected(monster.id) : false;

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      // 브라우저가 카메라를 지원하지 않으면 바로 대체 배경으로 전환
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState('unavailable');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraState('ready');
      } catch (e) {
        // 권한 거부, 카메라 없음 등 모든 예외 상황에서 대체 배경으로 전환한다.
        console.warn('카메라를 사용할 수 없습니다.', e);
        setCameraState('unavailable');
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  if (!monster) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center text-white">
        <p>몬스터 정보를 찾을 수 없습니다.</p>
        <button onClick={onClose} className="rounded-full bg-slate-800 px-5 py-2.5">
          닫기
        </button>
      </div>
    );
  }

  const rewardItem = getItemById(monster.rewardItemId);

  const handleCollect = () => {
    collectMonster(monster.id);
    setCollected(true);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black text-white">
      {/* 카메라 배경 또는 대체 배경 */}
      {cameraState === 'ready' ? (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-gwangan.jpg')" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      {/* 상단 바 */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        <button onClick={onClose} className="rounded-full bg-black/50 p-2" aria-label="닫기">
          <X size={20} />
        </button>
        {cameraState === 'unavailable' && (
          <span className="flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs text-amber-300">
            <CameraOff size={14} /> 카메라를 사용할 수 없어 배경 화면으로 대체합니다
          </span>
        )}
      </div>

      {/* 몬스터 오버레이 */}
      {!collected && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="relative animate-floaty">
            <Sparkles className="absolute -left-6 -top-4 animate-sparkle text-yellow-200" size={22} />
            <Sparkles className="absolute -right-8 top-8 animate-sparkle text-cyan-200" size={16} />
            <div
              className="flex h-52 w-52 items-center justify-center rounded-full backdrop-blur-sm"
              style={{ background: `radial-gradient(circle, ${monster.colorFrom}55, transparent 70%)` }}
            >
              <MonsterArt monster={monster} size={170} />
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-black/50 px-4 py-2 text-center">
            <p className="text-lg font-bold">{monster.name}</p>
            <p className="text-xs text-slate-300">{RARITY_LABEL[monster.rarity]} · {monster.species}</p>
          </div>
        </div>
      )}

      {/* 하단 액션 영역 */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {alreadyCollected && !collected ? (
          <div className="rounded-2xl bg-emerald-900/60 px-4 py-3 text-center text-sm text-emerald-200">
            이미 도감에 등록된 몬스터입니다. 구경만 하고 돌아가볼까요?
          </div>
        ) : !collected ? (
          <button
            onClick={handleCollect}
            className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 py-4 text-lg font-bold shadow-xl shadow-cyan-900/50 active:scale-95"
          >
            수집하기
          </button>
        ) : (
          <CelebrationPanel monsterName={monster.name} itemName={rewardItem?.name} itemEmoji={rewardItem?.emoji} onClose={onClose} />
        )}
      </div>

      {/* 물방울 상승 애니메이션 (수집 성공 연출) */}
      {collected && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="animate-bubble absolute bottom-0 block rounded-full bg-cyan-200/70"
              style={{
                left: `${(i * 8 + 5) % 100}%`,
                width: `${8 + (i % 4) * 4}px`,
                height: `${8 + (i % 4) * 4}px`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CelebrationPanel({
  monsterName,
  itemName,
  itemEmoji,
  onClose,
}: {
  monsterName: string;
  itemName?: string;
  itemEmoji?: string;
  onClose: () => void;
}) {
  return (
    <div className="rounded-3xl bg-slate-900/95 p-5 text-center shadow-2xl">
      <div className="mb-2 flex items-center justify-center gap-2 text-amber-300">
        <PartyPopper size={22} />
        <span className="text-lg font-bold">수집 성공!</span>
      </div>
      <p className="text-sm text-slate-300">
        <span className="font-semibold text-white">{monsterName}</span>을(를) 도감에 등록했어요.
      </p>
      {itemName && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3">
          <span className="text-2xl">{itemEmoji}</span>
          <span className="text-sm">
            아이템 <span className="font-semibold text-cyan-300">{itemName}</span> 획득!
          </span>
        </div>
      )}
      <button
        onClick={onClose}
        className="mt-4 w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 py-3 font-bold active:scale-95"
      >
        지도로 돌아가기
      </button>
    </div>
  );
}
