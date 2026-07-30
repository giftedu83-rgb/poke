import { Map, BookOpenText, Package, User } from 'lucide-react';
import type { ScreenName } from '../types';

interface Props {
  current: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

// 모바일 하단 고정 내비게이션 - 지도 / 도감 / 아이템 / 내 기록
export function BottomNav({ current, onNavigate }: Props) {
  const items: { key: ScreenName; label: string; icon: typeof Map }[] = [
    { key: 'map', label: '지도', icon: Map },
    { key: 'dex', label: '도감', icon: BookOpenText },
    { key: 'items', label: '아이템', icon: Package },
    { key: 'records', label: '내 기록', icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ key, label, icon: Icon }) => {
          const active = current === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
                active ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className={active ? 'font-semibold' : ''}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
