import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

// 지도 화면에서 마커 선택 시 아래에서 올라오는 공용 바텀 시트
export function BottomSheet({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500]">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* 시트 본문 */}
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md animate-[slideUp_0.25s_ease-out] rounded-t-3xl bg-slate-900 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-700" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-slate-800 p-1.5 text-slate-300"
          aria-label="닫기"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
