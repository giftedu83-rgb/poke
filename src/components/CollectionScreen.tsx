import React, { useState } from 'react';
import type { GameSaveData, CreatureData, Rarity } from '@/types/game';
import { CREATURES } from '@/data/creatures';
import { CreatureSVG } from './CreatureSVG';
import { CreatureDetailModal } from './CreatureDetailModal';

interface CollectionScreenProps {
  saveData: GameSaveData;
}

function renderStars(rarity: Rarity) {
  return Array.from({ length: rarity }, (_, i) => (
    <span key={i} className="star-icon-sm">⭐</span>
  ));
}

function formatLength(cm: number): string {
  if (cm >= 100) return `${(cm / 100).toFixed(1)}m`;
  return `${cm.toFixed(1)}cm`;
}



export const CollectionScreen: React.FC<CollectionScreenProps> = ({
  saveData,
}) => {
  const [selectedCreature, setSelectedCreature] = useState<CreatureData | null>(
    null
  );

  const discoveredCount = Object.keys(saveData.collection).length;
  const totalCount = CREATURES.length;
  const completionPercent = Math.round((discoveredCount / totalCount) * 100);

  const star1 = CREATURES.filter(
    (c) => c.rarity === 1 && saveData.collection[c.id]
  ).length;
  const star1Total = CREATURES.filter((c) => c.rarity === 1).length;
  const star2 = CREATURES.filter(
    (c) => c.rarity === 2 && saveData.collection[c.id]
  ).length;
  const star2Total = CREATURES.filter((c) => c.rarity === 2).length;
  const star3 = CREATURES.filter(
    (c) => c.rarity === 3 && saveData.collection[c.id]
  ).length;
  const star3Total = CREATURES.filter((c) => c.rarity === 3).length;

  return (
    <div className="collection-screen">
      {/* 상단 통계 */}
      <div className="collection-header">
        <h2>🐚 바다 도감</h2>
        <div className="collection-stats">
          <div className="stat-main">
            <span className="stat-big">{discoveredCount}</span>
            <span className="stat-divider">/</span>
            <span className="stat-total">{totalCount}</span>
            <span className="stat-label-text">종 발견</span>
          </div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="stat-percent">{completionPercent}% 완성</span>
        </div>
        <div className="collection-rarity-stats">
          <span>⭐ {star1}/{star1Total}</span>
          <span>⭐⭐ {star2}/{star2Total}</span>
          <span>⭐⭐⭐ {star3}/{star3Total}</span>
        </div>
        <div className="collection-total-captures">
          총 포획: {saveData.totalCaptures}회
        </div>
      </div>

      {/* 생물 카드 그리드 */}
      <div className="collection-grid">
        {CREATURES.map((creature) => {
          const entry = saveData.collection[creature.id];
          const discovered = !!entry;

          return (
            <div
              key={creature.id}
              className={`collection-card ${discovered ? 'discovered' : 'undiscovered'}`}
              onClick={() => {
                if (discovered) {
                  setSelectedCreature(creature);
                }
              }}
            >
              <div className="card-creature-wrap">
                {discovered ? (
                  <CreatureSVG
                    svgType={creature.svgType}
                    color={creature.color}
                    accentColor={creature.accentColor}
                    size={56}
                  />
                ) : (
                  <div className="card-silhouette">
                    <CreatureSVG
                      svgType={creature.svgType}
                      color="#333"
                      accentColor="#222"
                      size={56}
                    />
                  </div>
                )}
              </div>
              <div className="card-info">
                <span className="card-name">
                  {discovered ? creature.name : '미발견'}
                </span>
                <div className="card-stars">{renderStars(creature.rarity)}</div>
                {discovered && entry && (
                  <div className="card-capture-info">
                    <span className="card-count">🎣 {entry.captureCount}회</span>
                    <span className="card-size">
                      📏 {formatLength(entry.maxLengthCm)}
                    </span>
                  </div>
                )}
                {!discovered && (
                  <p className="card-undiscovered-hint">
                    직접 발견하고 포획해 보세요
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 상세 모달 */}
      {selectedCreature && (
        <CreatureDetailModal
          creature={selectedCreature}
          entry={saveData.collection[selectedCreature.id]}
          onClose={() => setSelectedCreature(null)}
        />
      )}
    </div>
  );
};

export default CollectionScreen;
