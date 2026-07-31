import React, { useState } from 'react';

interface SettingsModalProps {
  onReset: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onReset,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    onReset();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content settings-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>
        <h2>⚙️ 설정</h2>

        <div className="settings-section">
          <h3>📱 조작법</h3>
          <div className="settings-controls-info">
            <p>🔹 방향키 / WASD: 이동</p>
            <p>🔹 Shift + 방향키: 빠른 이동</p>
            <p>🔹 Space: 포획 게임 입력</p>
            <p>🔹 모바일: 화면 방향 패드</p>
          </div>
        </div>

        <div className="settings-section">
          <h3>ℹ️ 정보</h3>
          <p>부산 바다 탐험대 DEMO</p>
          <p>시연 지역: 광안리</p>
        </div>

        <div className="settings-section settings-danger">
          <h3>🗑️ 데이터 관리</h3>
          {!confirmReset ? (
            <button
              className="btn btn-danger"
              onClick={() => setConfirmReset(true)}
            >
              시연 데이터 초기화
            </button>
          ) : (
            <div className="reset-confirm">
              <p>모든 도감, 아이템, 퀴즈 진행이 초기화됩니다.</p>
              <p>정말 초기화하시겠어요?</p>
              <div className="reset-confirm-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmReset(false)}>
                  취소
                </button>
                <button className="btn btn-danger" onClick={handleReset}>
                  초기화
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
