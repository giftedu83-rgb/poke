import React, { useState, useEffect, useCallback } from 'react';
import type { TabId } from '@/types/game';
import { GAME_CONFIG } from '@/data/config';
import { haversineDistance } from '@/utils/geo';
import { useGameState } from '@/hooks/useGameState';
import { MapScreen } from '@/components/MapScreen';
import { CollectionScreen } from '@/components/CollectionScreen';
import { TutorialModal } from '@/components/TutorialModal';
import './styles.css';

const App: React.FC = () => {
  const {
    saveData,
    playerPos,
    setPlayerPos,
    spawns,
    removeAndRespawn,
    recordCapture,
    completeLandmark,
    useCharm,
    markTutorialSeen,
    resetAll,
  } = useGameState();

  const [activeTab, setActiveTab] = useState<TabId>('explore');
  const [showTutorial, setShowTutorial] = useState(false);
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // 초기 위치 결정
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dist = haversineDistance(
            pos.coords.latitude,
            pos.coords.longitude,
            GAME_CONFIG.DEMO_CENTER.lat,
            GAME_CONFIG.DEMO_CENTER.lng
          );
          if (dist > GAME_CONFIG.FAR_FROM_DEMO_DISTANCE) {
            setGeoMessage('시연을 위해 광안리 시작 지점으로 이동합니다');
            setPlayerPos(GAME_CONFIG.DEMO_CENTER);
          } else {
            setPlayerPos({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          }
        },
        () => {
          // GPS 거부 또는 오류
          setPlayerPos(GAME_CONFIG.DEMO_CENTER);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setPlayerPos(GAME_CONFIG.DEMO_CENTER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 튜토리얼 표시
  useEffect(() => {
    if (!saveData.tutorialSeen) {
      const timer = setTimeout(() => setShowTutorial(true), 500);
      return () => clearTimeout(timer);
    }
  }, [saveData.tutorialSeen]);

  // GPS 메시지 자동 숨기기
  useEffect(() => {
    if (geoMessage) {
      const timer = setTimeout(() => setGeoMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [geoMessage]);

  const handleTutorialClose = useCallback(() => {
    setShowTutorial(false);
    markTutorialSeen();
  }, [markTutorialSeen]);

  const handleSwitchToCollection = useCallback((_creatureId?: string) => {
    setActiveTab('collection');
  }, []);

  return (
    <div className="app-container">
      {/* GPS 메시지 */}
      {geoMessage && (
        <div className="geo-message">
          📍 {geoMessage}
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        {activeTab === 'explore' && (
          <MapScreen
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            spawns={spawns}
            saveData={saveData}
            removeAndRespawn={removeAndRespawn}
            recordCapture={recordCapture}
            completeLandmark={completeLandmark}
            useCharm={useCharm}
            resetAll={resetAll}
            onSwitchToCollection={handleSwitchToCollection}
          />
        )}
        {activeTab === 'collection' && (
          <CollectionScreen saveData={saveData} />
        )}
      </div>

      {/* 하단 탭 바 */}
      <nav className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <span className="tab-icon">🗺️</span>
          <span className="tab-label">탐험</span>
        </button>
        <button
          className={`tab-item ${activeTab === 'collection' ? 'active' : ''}`}
          onClick={() => setActiveTab('collection')}
        >
          <span className="tab-icon">📖</span>
          <span className="tab-label">바다 도감</span>
        </button>
      </nav>

      {/* 튜토리얼 */}
      {showTutorial && <TutorialModal onClose={handleTutorialClose} />}
    </div>
  );
};

export default App;
