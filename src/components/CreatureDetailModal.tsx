import React from 'react';
import type { CreatureData, CollectionEntry, Rarity } from '@/types/game';
import { CreatureSVG } from './CreatureSVG';

interface CreatureDetailModalProps {
  creature: CreatureData;
  entry: CollectionEntry;
  onClose: () => void;
}

function renderStars(rarity: Rarity) {
  return Array.from({ length: rarity }, (_, i) => (
    <span key={i} className="star-icon">⭐</span>
  ));
}

function formatLength(cm: number): string {
  if (cm >= 100) return `${(cm / 100).toFixed(1)}m`;
  return `${cm.toFixed(1)}cm`;
}

function formatWeight(g: number): string {
  if (g >= 1000) return `${(g / 1000).toFixed(1)}kg`;
  return `${g.toFixed(1)}g`;
}

export const CreatureDetailModal: React.FC<CreatureDetailModalProps> = ({
  creature,
  entry,
  onClose,
}) => {
  const latestRecord = entry.records[0];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content creature-detail-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>

        {/* 헤더 */}
        <div className="detail-header">
          <div className={`detail-creature-wrap rarity-${creature.rarity}`}>
            <CreatureSVG
              svgType={creature.svgType}
              color={creature.color}
              accentColor={creature.accentColor}
              size={100}
            />
          </div>
          <h2>{creature.name}</h2>
          <p className="detail-english">{creature.englishName}</p>
          <div className="detail-stars">{renderStars(creature.rarity)}</div>
        </div>

        {/* 기록 요약 */}
        <div className="detail-records-summary">
          <div className="record-item">
            <span className="record-label">포획 횟수</span>
            <span className="record-value">{entry.captureCount}회</span>
          </div>
          <div className="record-item">
            <span className="record-label">최대 길이</span>
            <span className="record-value">
              {formatLength(entry.maxLengthCm)}
            </span>
          </div>
          <div className="record-item">
            <span className="record-label">최대 무게</span>
            <span className="record-value">
              {formatWeight(entry.maxWeightG)}
            </span>
          </div>
        </div>

        {/* 최근 기록 */}
        {latestRecord && (
          <div className="detail-section">
            <h3>📋 최근 포획</h3>
            <div className="recent-record">
              <span>📏 {formatLength(latestRecord.lengthCm)}</span>
              <span>⚖️ {formatWeight(latestRecord.weightG)}</span>
              <span>
                📅 {new Date(latestRecord.capturedAt).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        )}

        {/* 서식 환경 */}
        <div className="detail-section">
          <h3>🏠 서식 환경</h3>
          <p>{creature.habitat}</p>
        </div>

        {/* 특징 */}
        <div className="detail-section">
          <h3>📝 특징</h3>
          <p>{creature.description}</p>
        </div>

        {/* 흥미로운 사실 */}
        <div className="detail-section">
          <h3>💡 흥미로운 사실</h3>
          <ul className="fun-facts-list">
            {creature.funFacts.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </div>

        {/* 생태계 역할 */}
        <div className="detail-section">
          <h3>🌍 생태계에서의 역할</h3>
          <p>{creature.ecosystemRole}</p>
        </div>

        {/* 보호 팁 */}
        <div className="detail-section">
          <h3>🛡️ 관찰 & 보호 팁</h3>
          <p>{creature.conservationTip}</p>
        </div>

        {/* 포획 기록 목록 */}
        {entry.records.length > 1 && (
          <div className="detail-section">
            <h3>📊 포획 기록</h3>
            <div className="records-list">
              {entry.records.slice(0, 5).map((rec, i) => (
                <div key={i} className="record-row">
                  <span>#{i + 1}</span>
                  <span>{formatLength(rec.lengthCm)}</span>
                  <span>{formatWeight(rec.weightG)}</span>
                  <span>
                    {new Date(rec.capturedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatureDetailModal;
