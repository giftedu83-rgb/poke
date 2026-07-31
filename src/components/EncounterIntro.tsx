import React from 'react';
import type { CreatureData, Rarity } from '@/types/game';
import { CreatureSVG } from './CreatureSVG';

interface EncounterIntroProps {
  creature: CreatureData;
  waveCharmCount: number;
  onStart: (useCharm: boolean) => void;
  onClose: () => void;
}

function renderStars(rarity: Rarity) {
  return Array.from({ length: rarity }, (_, i) => (
    <span key={i} className="star-icon">⭐</span>
  ));
}

export const EncounterIntro: React.FC<EncounterIntroProps> = ({
  creature,
  waveCharmCount,
  onStart,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content encounter-intro">
        <div className="encounter-header">
          <div className="encounter-flash">!</div>
          <p className="encounter-subtitle">야생의 해양 생물을 발견했어요!</p>
        </div>

        <div className="encounter-creature-display">
          <div className={`encounter-creature-wrap rarity-${creature.rarity}`}>
            <CreatureSVG
              svgType={creature.svgType}
              color={creature.color}
              accentColor={creature.accentColor}
              size={120}
            />
          </div>
          <h2 className="encounter-creature-name">{creature.name}</h2>
          <div className="encounter-stars">{renderStars(creature.rarity)}</div>
          <p className="encounter-english">{creature.englishName}</p>
        </div>

        <div className="encounter-item-section">
          <div className="item-info">
            <span className="item-icon">🌊</span>
            <span className="item-label">잔잔한 파도 부적</span>
            <span className="item-count">× {waveCharmCount}</span>
          </div>
          <p className="item-desc">사용 시 게이지 속도가 느려져요</p>
        </div>

        <div className="encounter-actions">
          <button
            className="btn btn-secondary"
            onClick={() => onStart(false)}
          >
            아이템 없이 시작
          </button>
          <button
            className="btn btn-primary btn-charm"
            onClick={() => onStart(true)}
            disabled={waveCharmCount <= 0}
          >
            🌊 부적 사용하고 시작
          </button>
        </div>

        <button className="btn btn-text" onClick={onClose}>
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default EncounterIntro;
