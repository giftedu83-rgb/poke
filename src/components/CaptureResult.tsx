import React from 'react';
import type { CreatureData, Rarity } from '@/types/game';
import { CreatureSVG } from './CreatureSVG';

interface CaptureSuccessProps {
  creature: CreatureData;
  lengthCm: number;
  weightG: number;
  isNewDiscovery: boolean;
  onViewCollection: () => void;
  onClose: () => void;
}

interface CaptureFailureProps {
  creature: CreatureData;
  onClose: () => void;
}

function renderStars(rarity: Rarity) {
  return Array.from({ length: rarity }, (_, i) => (
    <span key={i} className="star-icon">⭐</span>
  ));
}

function formatLength(cm: number): string {
  if (cm >= 100) {
    return `${(cm / 100).toFixed(1)}m`;
  }
  return `${cm.toFixed(1)}cm`;
}

function formatWeight(g: number): string {
  if (g >= 1000) {
    return `${(g / 1000).toFixed(1)}kg`;
  }
  return `${g.toFixed(1)}g`;
}

export const CaptureSuccess: React.FC<CaptureSuccessProps> = ({
  creature,
  lengthCm,
  weightG,
  isNewDiscovery,
  onViewCollection,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content capture-result success">
        <div className="capture-success-animation">
          <div className="success-bubbles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bubble" style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }} />
            ))}
          </div>
          <div className="success-glow" />
          <CreatureSVG
            svgType={creature.svgType}
            color={creature.color}
            accentColor={creature.accentColor}
            size={100}
            className="success-creature-svg"
          />
        </div>

        <div className="capture-result-info">
          <h2 className="success-title">
            {isNewDiscovery
              ? '🎉 도감에 새로운 친구가 등록되었어요!'
              : '✨ 다시 만났어요!'}
          </h2>
          <h3 className="result-creature-name">{creature.name}</h3>
          <div className="result-stars">{renderStars(creature.rarity)}</div>

          <div className="result-stats">
            <div className="stat-item">
              <span className="stat-label">📏 길이</span>
              <span className="stat-value">{formatLength(lengthCm)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">⚖️ 무게</span>
              <span className="stat-value">{formatWeight(weightG)}</span>
            </div>
          </div>
        </div>

        <div className="result-actions">
          <button className="btn btn-secondary" onClick={onViewCollection}>
            📖 도감에서 보기
          </button>
          <button className="btn btn-primary" onClick={onClose}>
            🗺️ 지도로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export const CaptureFailure: React.FC<CaptureFailureProps> = ({
  creature,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content capture-result failure">
        <div className="capture-failure-animation">
          <div className="failure-waves">
            <div className="wave wave-1" />
            <div className="wave wave-2" />
            <div className="wave wave-3" />
          </div>
          <div className="failure-creature-fade">
            <CreatureSVG
              svgType={creature.svgType}
              color={creature.color}
              accentColor={creature.accentColor}
              size={80}
              className="failure-creature-svg"
            />
          </div>
        </div>

        <h2 className="failure-title">아쉽게도 바다로 돌아갔어요 🌊</h2>
        <p className="failure-subtitle">{creature.name}이(가) 도망갔어요</p>
        <p className="failure-encourage">다음에 다시 만날 수 있을 거예요!</p>

        <button className="btn btn-primary" onClick={onClose}>
          🗺️ 다시 탐험하기
        </button>
      </div>
    </div>
  );
};
