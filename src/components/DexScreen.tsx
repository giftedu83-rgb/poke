import { useMemo, useState } from 'react';
import { MONSTERS } from '../data/monsters';
import { useGame } from '../context/GameContext';
import { MonsterArt } from './MonsterArt';
import { RARITY_LABEL, type Rarity } from '../types';

type Filter = 'all' | 'collected' | 'uncollected';
type RarityFilter = 'all' | Rarity;

const RARITY_BADGE: Record<Rarity, string> = {
  common: 'bg-slate-700 text-slate-200',
  uncommon: 'bg-emerald-700 text-emerald-100',
  rare: 'bg-sky-700 text-sky-100',
  legendary: 'bg-amber-600 text-amber-50',
};

// 몬스터 도감 화면: 전체/수집완료/미수집 필터 + 등급 필터 + 카드 그리드
export function DexScreen() {
  const { collectedMonsters, isMonsterCollected } = useGame();
  const [filter, setFilter] = useState<Filter>('all');
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all');

  const collectedCount = collectedMonsters.length;
  const total = MONSTERS.length;
  const progress = Math.round((collectedCount / total) * 100);

  const filtered = useMemo(() => {
    return MONSTERS.filter((m) => {
      const collected = isMonsterCollected(m.id);
      if (filter === 'collected' && !collected) return false;
      if (filter === 'uncollected' && collected) return false;
      if (rarityFilter !== 'all' && m.rarity !== rarityFilter) return false;
      return true;
    });
  }, [filter, rarityFilter, isMonsterCollected]);

  return (
    <div className="h-full overflow-y-auto p-4 pb-8">
      <h1 className="text-xl font-extrabold">몬스터 도감</h1>

      {/* 수집 진행률 */}
      <div className="mt-4 rounded-2xl bg-slate-900 p-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-slate-300">수집 진행률</span>
          <span className="text-lg font-bold text-cyan-300">
            {collectedCount} / {total}
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-slate-400">{progress}% 완료</p>
      </div>

      {/* 전체/수집완료/미수집 필터 */}
      <div className="mt-4 flex gap-2">
        {(
          [
            { key: 'all', label: '전체' },
            { key: 'collected', label: '수집 완료' },
            { key: 'uncollected', label: '미수집' },
          ] as { key: Filter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold ${
              filter === key ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 등급 필터 */}
      <div className="mt-2 flex flex-wrap gap-2">
        {(['all', 'common', 'uncommon', 'rare', 'legendary'] as RarityFilter[]).map((r) => (
          <button
            key={r}
            onClick={() => setRarityFilter(r)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              rarityFilter === r ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {r === 'all' ? '전체 등급' : RARITY_LABEL[r]}
          </button>
        ))}
      </div>

      {/* 카드 그리드 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {filtered.map((monster) => {
          const collected = isMonsterCollected(monster.id);
          const record = collectedMonsters.find((r) => r.monsterId === monster.id);
          return (
            <div
              key={monster.id}
              className={`rounded-2xl border p-3 ${
                collected ? 'border-slate-700 bg-slate-900' : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex items-center justify-center rounded-xl bg-slate-950/60 py-3">
                <MonsterArt monster={monster} silhouette={!collected} size={72} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold">{collected ? monster.name : '???'}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${RARITY_BADGE[monster.rarity]}`}>
                  {RARITY_LABEL[monster.rarity]}
                </span>
              </div>
              {collected ? (
                <>
                  <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">{monster.description}</p>
                  <p className="mt-1 text-[10px] text-slate-500">발견 장소: {monster.habitat}</p>
                  {record && (
                    <p className="text-[10px] text-slate-500">
                      수집일: {new Date(record.collectedAt).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-1 text-[11px] text-slate-500">아직 발견하지 못한 몬스터예요.</p>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-slate-500">조건에 맞는 몬스터가 없어요.</p>
      )}
    </div>
  );
}
