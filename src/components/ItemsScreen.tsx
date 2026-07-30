import { Package } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getItemById } from '../data/items';

// 아이템 보관함 화면: 몬스터 수집시 함께 얻는 아이템 목록을 보여준다. (MVP에서는 사용 기능 없음)
export function ItemsScreen() {
  const { ownedItems } = useGame();

  return (
    <div className="h-full overflow-y-auto p-4 pb-8">
      <h1 className="flex items-center gap-2 text-xl font-extrabold">
        <Package size={22} /> 아이템 보관함
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        몬스터를 수집하면 함께 얻는 아이템이에요. 총 {ownedItems.length}종 보유 중.
      </p>

      {ownedItems.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-500">
          <span className="text-4xl">🎒</span>
          <p className="text-sm">아직 획득한 아이템이 없어요.</p>
          <p className="text-xs">지도에서 몬스터를 수집해보세요!</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {ownedItems.map((owned) => {
            const item = getItemById(owned.itemId);
            if (!item) return null;
            return (
              <div key={owned.itemId} className="flex items-center gap-3 rounded-2xl bg-slate-900 p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-3xl">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="rounded-full bg-cyan-900/60 px-2 py-0.5 text-[11px] font-semibold text-cyan-300">
                      보유 {owned.count}개
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">{item.description}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    최근 획득: {new Date(owned.lastObtainedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
