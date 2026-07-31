import React, { useState } from 'react';

interface TutorialModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    emoji: '🕹️',
    title: '이동하기',
    desc: '방향키 또는 화면 패드로 이동하세요.\nShift+방향키로 빠르게 이동할 수 있어요.',
  },
  {
    emoji: '🐠',
    title: '생물 포획',
    desc: '해양 생물 가까이 다가가면 포획할 수 있어요.\n게이지 게임에서 타이밍을 맞춰 보세요!',
  },
  {
    emoji: '🏖️',
    title: '관광명소 퀴즈',
    desc: '관광명소에 도착하면 이야기를 듣고 퀴즈를 풀어 보세요.\n정답을 맞히면 포획 아이템을 받아요!',
  },
  {
    emoji: '📖',
    title: '바다 도감',
    desc: '포획한 생물의 정보는 바다 도감에서 확인하세요.\n12종을 모두 모아 도감을 완성해 보세요!',
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="modal-overlay">
      <div className="modal-content tutorial-modal">
        <div className="tutorial-content">
          <div className="tutorial-emoji">{current.emoji}</div>
          <h2 className="tutorial-title">{current.title}</h2>
          <p className="tutorial-desc">{current.desc}</p>
        </div>

        <div className="tutorial-progress">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`tutorial-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
            />
          ))}
        </div>

        <div className="tutorial-actions">
          {step > 0 && (
            <button
              className="btn btn-text"
              onClick={() => setStep((s) => s - 1)}
            >
              이전
            </button>
          )}
          {isLast ? (
            <button className="btn btn-primary" onClick={onClose}>
              시작하기! 🚀
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setStep((s) => s + 1)}
            >
              다음
            </button>
          )}
        </div>

        <button className="btn btn-text tutorial-skip" onClick={onClose}>
          다시 보지 않기
        </button>
      </div>
    </div>
  );
};

export default TutorialModal;
