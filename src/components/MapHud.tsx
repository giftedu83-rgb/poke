import React from 'react';

interface MapHudProps {
  waveCharmCount: number;
  activeCreatureCount: number;
  onCenterPlayer: () => void;
  onOpenSettings: () => void;
}

export const MapHud: React.FC<MapHudProps> = ({
  waveCharmCount,
  activeCreatureCount,
  onCenterPlayer,
  onOpenSettings,
}) => {
  return (
    <>
      {/* 상단 HUD */}
      <div className="map-hud-top">
        <div className="hud-badge demo-badge">DEMO</div>
        <div className="hud-info-row">
          <div className="hud-item" title="잔잔한 파도 부적">
            <span className="hud-icon">🌊</span>
            <span className="hud-value">{waveCharmCount}</span>
          </div>
          <div className="hud-item" title="활성 생물 수">
            <span className="hud-icon">🐠</span>
            <span className="hud-value">{activeCreatureCount}/5</span>
          </div>
        </div>
      </div>

      {/* 우측 버튼들 */}
      <div className="map-hud-right">
        <button
          className="hud-circle-btn"
          onClick={onCenterPlayer}
          title="내 위치로 이동"
          aria-label="내 위치로 이동"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
        <button
          className="hud-circle-btn"
          onClick={onOpenSettings}
          title="설정"
          aria-label="설정"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>
      </div>

      {/* 시연 지역 표시 */}
      <div className="map-hud-location">
        📍 광안리 시연 구역
      </div>
    </>
  );
};

export default MapHud;
