import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { GAME_CONFIG } from '@/data/config';
import { LANDMARKS } from '@/data/landmarks';
import { getCreatureById } from '@/data/creatures';
import { haversineDistance } from '@/utils/geo';
import { generateCaptureStats } from '@/utils/random';
import { useDemoMovement } from '@/hooks/useDemoMovement';
import type {
  SpawnedCreature,
  GameSaveData,
  CreatureData,
  LandmarkData,
} from '@/types/game';

import { PlayerMarker, MapFollower } from './PlayerMarker';
import { CreatureMarker } from './CreatureMarker';
import { LandmarkMarker } from './LandmarkMarker';
import { DirectionPad } from './DirectionPad';
import { MapHud } from './MapHud';
import { LandmarkModal } from './LandmarkModal';
import { EncounterIntro } from './EncounterIntro';
import { CaptureGaugeGame } from './CaptureGaugeGame';
import { CaptureSuccess, CaptureFailure } from './CaptureResult';
import { SettingsModal } from './SettingsModal';

interface MapScreenProps {
  playerPos: { lat: number; lng: number };
  setPlayerPos: (pos: { lat: number; lng: number }) => void;
  spawns: SpawnedCreature[];
  saveData: GameSaveData;
  removeAndRespawn: (instanceId: string, delay: number) => void;
  recordCapture: (id: string, length: number, weight: number) => void;
  completeLandmark: (id: string) => void;
  useCharm: () => void;
  resetAll: () => void;
  onSwitchToCollection: (creatureId?: string) => void;
}

type ModalState =
  | { type: 'none' }
  | { type: 'landmark'; landmark: LandmarkData }
  | {
      type: 'encounter';
      spawn: SpawnedCreature;
      creature: CreatureData;
    }
  | {
      type: 'capture';
      spawn: SpawnedCreature;
      creature: CreatureData;
      charmUsed: boolean;
    }
  | {
      type: 'success';
      creature: CreatureData;
      lengthCm: number;
      weightG: number;
      isNew: boolean;
      instanceId: string;
    }
  | {
      type: 'failure';
      creature: CreatureData;
      instanceId: string;
    }
  | { type: 'settings' }
  | { type: 'tooFar'; name: string; distance: number };

export const MapScreen: React.FC<MapScreenProps> = ({
  playerPos,
  setPlayerPos,
  spawns,
  saveData,
  removeAndRespawn,
  recordCapture,
  completeLandmark,
  useCharm,
  resetAll,
  onSwitchToCollection,
}) => {
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [followPlayer, setFollowPlayer] = useState(true);
  const captureProcessed = useRef(false);

  const isModalOpen = modal.type !== 'none';

  const { moveDirection } = useDemoMovement({
    playerPos,
    setPlayerPos,
    disabled: isModalOpen,
  });

  // 플레이어 위치로 지도 이동
  const handleCenterPlayer = useCallback(() => {
    setFollowPlayer(true);
  }, []);

  // 생물 클릭
  const handleCreatureClick = useCallback(
    (spawn: SpawnedCreature, distance: number) => {
      if (isModalOpen) return;
      const creature = getCreatureById(spawn.creatureId);
      if (!creature) return;

      if (distance <= GAME_CONFIG.CREATURE_CAPTURE_DISTANCE) {
        setModal({ type: 'encounter', spawn, creature });
      } else {
        setModal({
          type: 'tooFar',
          name: creature.name,
          distance: Math.round(distance),
        });
      }
    },
    [isModalOpen]
  );

  // 관광명소 클릭
  const handleLandmarkClick = useCallback(
    (landmark: LandmarkData, distance: number) => {
      if (isModalOpen) return;
      if (distance <= GAME_CONFIG.LANDMARK_TRIGGER_DISTANCE) {
        setModal({ type: 'landmark', landmark });
      } else {
        setModal({
          type: 'tooFar',
          name: landmark.name,
          distance: Math.round(distance),
        });
      }
    },
    [isModalOpen]
  );

  // 포획 시작
  const handleStartCapture = useCallback(
    (charmUsed: boolean) => {
      if (modal.type !== 'encounter') return;
      captureProcessed.current = false;
      setModal({
        type: 'capture',
        spawn: modal.spawn,
        creature: modal.creature,
        charmUsed,
      });
    },
    [modal]
  );

  // 포획 성공
  const handleCaptureSuccess = useCallback(() => {
    if (modal.type !== 'capture' || captureProcessed.current) return;
    captureProcessed.current = true;

    const { creature, spawn, charmUsed } = modal;
    const stats = generateCaptureStats(creature);
    const isNew = !saveData.collection[creature.id];

    recordCapture(creature.id, stats.lengthCm, stats.weightG);
    removeAndRespawn(spawn.instanceId, GAME_CONFIG.RESPAWN_DELAY_SUCCESS);

    if (charmUsed) {
      useCharm();
    }

    setModal({
      type: 'success',
      creature,
      lengthCm: stats.lengthCm,
      weightG: stats.weightG,
      isNew,
      instanceId: spawn.instanceId,
    });
  }, [modal, saveData.collection, recordCapture, removeAndRespawn, useCharm]);

  // 포획 실패
  const handleCaptureFailure = useCallback(() => {
    if (modal.type !== 'capture' || captureProcessed.current) return;
    captureProcessed.current = true;

    const { creature, spawn, charmUsed } = modal;

    removeAndRespawn(spawn.instanceId, GAME_CONFIG.RESPAWN_DELAY_FAILURE);

    if (charmUsed) {
      useCharm();
    }

    setModal({
      type: 'failure',
      creature,
      instanceId: spawn.instanceId,
    });
  }, [modal, removeAndRespawn, useCharm]);

  // 관광명소 완료
  const handleLandmarkComplete = useCallback(() => {
    if (modal.type === 'landmark') {
      completeLandmark(modal.landmark.id);
    }
  }, [modal, completeLandmark]);

  const closeModal = useCallback(() => {
    setModal({ type: 'none' });
  }, []);

  // 지도 드래그 감지
  const handleMapDrag = useCallback(() => {
    setFollowPlayer(false);
  }, []);

  return (
    <div className="map-screen">
      {/* Leaflet 지도 */}
      <div className="map-container">
        <MapContainer
          center={[GAME_CONFIG.DEMO_CENTER.lat, GAME_CONFIG.DEMO_CENTER.lng]}
          zoom={GAME_CONFIG.DEFAULT_ZOOM}
          className="leaflet-map"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            errorTileUrl=""
          />
          <MapFollower position={playerPos} follow={followPlayer} />
          <MapDragDetector onDrag={handleMapDrag} />
          <PlayerMarker position={playerPos} />

          {/* 해양 생물 마커 */}
          {spawns.map((spawn) => {
            const creature = getCreatureById(spawn.creatureId);
            if (!creature) return null;
            return (
              <CreatureMarker
                key={spawn.instanceId}
                spawn={spawn}
                creature={creature}
                playerPos={playerPos}
                onClick={handleCreatureClick}
              />
            );
          })}

          {/* 관광명소 마커 */}
          {LANDMARKS.map((lm) => (
            <LandmarkMarker
              key={lm.id}
              landmark={lm}
              playerPos={playerPos}
              completed={saveData.completedLandmarks.includes(lm.id)}
              onClick={handleLandmarkClick}
            />
          ))}
        </MapContainer>

        {/* Fallback 배경 (지도 타일 로드 실패 시) */}
        <div className="map-fallback" aria-hidden="true">
          <div className="fallback-sea" />
          <div className="fallback-beach" />
          <div className="fallback-text">🌊 지도 로딩 중...</div>
        </div>
      </div>

      {/* HUD */}
      <MapHud
        waveCharmCount={saveData.waveCharmCount}
        activeCreatureCount={spawns.length}
        onCenterPlayer={handleCenterPlayer}
        onOpenSettings={() => setModal({ type: 'settings' })}
      />

      {/* 방향 패드 */}
      {!isModalOpen && (
        <DirectionPad onMove={moveDirection} />
      )}

      {/* 거리 정보 패널 */}
      {!isModalOpen && (
        <DistancePanel
          playerPos={playerPos}
          spawns={spawns}
          landmarks={LANDMARKS}
          completedLandmarks={saveData.completedLandmarks}
        />
      )}

      {/* 모달들 */}
      {modal.type === 'tooFar' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content too-far-modal" onClick={(e) => e.stopPropagation()}>
            <p className="too-far-text">
              조금 더 가까이 가야 해요! 🏃
            </p>
            <p className="too-far-name">{modal.name}</p>
            <p className="too-far-distance">
              남은 거리: 약 {modal.distance}m
            </p>
            <button className="btn btn-primary" onClick={closeModal}>
              확인
            </button>
          </div>
        </div>
      )}

      {modal.type === 'landmark' && (
        <LandmarkModal
          landmark={modal.landmark}
          alreadyCompleted={saveData.completedLandmarks.includes(
            modal.landmark.id
          )}
          onComplete={handleLandmarkComplete}
          onClose={closeModal}
        />
      )}

      {modal.type === 'encounter' && (
        <EncounterIntro
          creature={modal.creature}
          waveCharmCount={saveData.waveCharmCount}
          onStart={handleStartCapture}
          onClose={closeModal}
        />
      )}

      {modal.type === 'capture' && (
        <CaptureGaugeGame
          creature={modal.creature}
          useCharm={modal.charmUsed}
          onSuccess={handleCaptureSuccess}
          onFailure={handleCaptureFailure}
        />
      )}

      {modal.type === 'success' && (
        <CaptureSuccess
          creature={modal.creature}
          lengthCm={modal.lengthCm}
          weightG={modal.weightG}
          isNewDiscovery={modal.isNew}
          onViewCollection={() => {
            closeModal();
            onSwitchToCollection(modal.creature.id);
          }}
          onClose={closeModal}
        />
      )}

      {modal.type === 'failure' && (
        <CaptureFailure creature={modal.creature} onClose={closeModal} />
      )}

      {modal.type === 'settings' && (
        <SettingsModal onReset={resetAll} onClose={closeModal} />
      )}
    </div>
  );
};

/** 지도 드래그 감지 유틸 */
import { useMapEvents } from 'react-leaflet';

const MapDragDetector: React.FC<{ onDrag: () => void }> = ({ onDrag }) => {
  useMapEvents({
    dragstart: onDrag,
  });
  return null;
};

/** 거리 정보 패널 */
const DistancePanel: React.FC<{
  playerPos: { lat: number; lng: number };
  spawns: SpawnedCreature[];
  landmarks: LandmarkData[];
  completedLandmarks: string[];
}> = ({ playerPos, spawns, landmarks, completedLandmarks }) => {
  // 가장 가까운 생물과 관광명소 계산
  const nearestCreature = spawns.reduce<{
    name: string;
    dist: number;
  } | null>((nearest, spawn) => {
    const creature = getCreatureById(spawn.creatureId);
    if (!creature) return nearest;
    const dist = haversineDistance(
      playerPos.lat,
      playerPos.lng,
      spawn.lat,
      spawn.lng
    );
    if (!nearest || dist < nearest.dist) {
      return { name: creature.name, dist };
    }
    return nearest;
  }, null);

  const nearestLandmark = landmarks.reduce<{
    name: string;
    dist: number;
    completed: boolean;
  } | null>((nearest, lm) => {
    const dist = haversineDistance(
      playerPos.lat,
      playerPos.lng,
      lm.lat,
      lm.lng
    );
    if (!nearest || dist < nearest.dist) {
      return {
        name: lm.name,
        dist,
        completed: completedLandmarks.includes(lm.id),
      };
    }
    return nearest;
  }, null);

  return (
    <div className="distance-panel">
      {nearestCreature && (
        <div className="distance-item">
          <span>🐠 {nearestCreature.name}</span>
          <span className="distance-value">
            {Math.round(nearestCreature.dist)}m
          </span>
        </div>
      )}
      {nearestLandmark && (
        <div className="distance-item">
          <span>
            {nearestLandmark.completed ? '✅' : '📍'} {nearestLandmark.name}
          </span>
          <span className="distance-value">
            {Math.round(nearestLandmark.dist)}m
          </span>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
