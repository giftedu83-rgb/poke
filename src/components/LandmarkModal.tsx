import React, { useState } from 'react';
import type { LandmarkData, LandmarkPhase } from '@/types/game';

interface LandmarkModalProps {
  landmark: LandmarkData;
  alreadyCompleted: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export const LandmarkModal: React.FC<LandmarkModalProps> = ({
  landmark,
  alreadyCompleted,
  onComplete,
  onClose,
}) => {
  const [phase, setPhase] = useState<LandmarkPhase>('story');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null && isCorrect) return;

    setSelectedOption(index);
    if (index === landmark.quiz.correctIndex) {
      setIsCorrect(true);
      setShowHint(false);
      if (!alreadyCompleted && !rewardGiven) {
        onComplete();
        setRewardGiven(true);
      }
      setTimeout(() => setPhase('result'), 800);
    } else {
      setShowHint(true);
      // 잘못된 선택 초기화 (다시 선택 가능)
      setTimeout(() => setSelectedOption(null), 600);
    }
  };

  const getLandmarkEmoji = () => {
    switch (landmark.icon) {
      case 'beach': return '🏖️';
      case 'bridge': return '🌉';
      case 'park': return '🌊';
      default: return '📍';
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content landmark-modal">
        {/* 헤더 */}
        <div className="landmark-modal-header">
          <span className="landmark-modal-emoji">{getLandmarkEmoji()}</span>
          <h2>{landmark.name}</h2>
          {alreadyCompleted && !rewardGiven && (
            <span className="landmark-revisit-badge">재방문</span>
          )}
        </div>

        {/* 스토리 단계 */}
        {phase === 'story' && (
          <div className="landmark-story-phase">
            <div className="landmark-arrival">
              <div className="arrival-sparkle">✨</div>
              <p className="arrival-text">관광명소에 도착했어요!</p>
            </div>
            <div className="story-card">
              <p className="story-text">{landmark.story}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setPhase('quiz')}>
              퀴즈 풀기 🧩
            </button>
          </div>
        )}

        {/* 퀴즈 단계 */}
        {phase === 'quiz' && (
          <div className="landmark-quiz-phase">
            <div className="quiz-question">
              <span className="quiz-icon">❓</span>
              <p>{landmark.quiz.question}</p>
            </div>
            <div className="quiz-options">
              {landmark.quiz.options.map((option, i) => {
                let optClass = 'quiz-option';
                if (selectedOption === i) {
                  optClass += isCorrect ? ' correct' : ' wrong';
                }
                return (
                  <button
                    key={i}
                    className={optClass}
                    onClick={() => handleOptionClick(i)}
                    disabled={isCorrect}
                  >
                    <span className="option-number">{i + 1}</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
            {showHint && !isCorrect && (
              <div className="quiz-hint">
                <span>💡</span> {landmark.quiz.hint}
              </div>
            )}
            {isCorrect && (
              <div className="quiz-correct-flash">
                <span>🎉 정답!</span>
              </div>
            )}
          </div>
        )}

        {/* 결과 단계 */}
        {phase === 'result' && (
          <div className="landmark-result-phase">
            <div className="result-explanation">
              <span className="result-icon">📖</span>
              <p>{landmark.quiz.explanation}</p>
            </div>
            {rewardGiven && (
              <div className="reward-card">
                <div className="reward-animation">
                  <span className="reward-emoji">🌊</span>
                </div>
                <p className="reward-title">잔잔한 파도 부적 획득!</p>
                <p className="reward-desc">
                  다음 포획 시 게이지 속도가 느려져요
                </p>
              </div>
            )}
            {alreadyCompleted && !rewardGiven && (
              <div className="reward-card reward-already">
                <p>이미 획득한 보상이에요</p>
              </div>
            )}
            <button className="btn btn-primary" onClick={onClose}>
              탐험 계속하기 🗺️
            </button>
          </div>
        )}

        <button className="modal-close-btn" onClick={onClose} aria-label="닫기">
          ✕
        </button>
      </div>
    </div>
  );
};

export default LandmarkModal;
