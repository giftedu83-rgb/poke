/**
 * 해양 생물 SVG 캐릭터 컴포넌트
 * 각 생물의 특징이 드러나는 독창적인 벡터 캐릭터
 */

import React from 'react';

interface CreatureSVGProps {
  svgType: string;
  color: string;
  accentColor: string;
  size?: number;
  className?: string;
}

export const CreatureSVG: React.FC<CreatureSVGProps> = ({
  svgType,
  color,
  accentColor,
  size = 48,
  className = '',
}) => {
  const props = { color, accentColor, size };

  switch (svgType) {
    case 'mackerel':
      return <MackerelSVG {...props} className={className} />;
    case 'anchovy':
      return <AnchovySVG {...props} className={className} />;
    case 'starfish':
      return <StarfishSVG {...props} className={className} />;
    case 'crab':
      return <CrabSVG {...props} className={className} />;
    case 'shrimp':
      return <ShrimpSVG {...props} className={className} />;
    case 'octopus':
      return <OctopusSVG {...props} className={className} />;
    case 'seahorse':
      return <SeahorseSVG {...props} className={className} />;
    case 'pufferfish':
      return <PufferfishSVG {...props} className={className} />;
    case 'cuttlefish':
      return <CuttlefishSVG {...props} className={className} />;
    case 'porpoise':
      return <PorpoiseSVG {...props} className={className} />;
    case 'turtle':
      return <TurtleSVG {...props} className={className} />;
    case 'dolphin':
      return <DolphinSVG {...props} className={className} />;
    default:
      return <DefaultFishSVG {...props} className={className} />;
  }
};

interface SVGProps {
  color: string;
  accentColor: string;
  size: number;
  className?: string;
}

// 고등어
const MackerelSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="32" cy="32" rx="26" ry="12" fill={color} />
    <ellipse cx="32" cy="32" rx="26" ry="12" fill="url(#mackerel-grad)" />
    <path d="M56 32 L64 24 L64 40 Z" fill={accentColor} />
    <path d="M10 24 Q16 20 24 22" stroke={accentColor} strokeWidth="1.5" fill="none" />
    <path d="M12 28 Q18 24 26 26" stroke={accentColor} strokeWidth="1.5" fill="none" />
    <path d="M10 36 Q16 40 24 38" stroke={accentColor} strokeWidth="1.5" fill="none" />
    <circle cx="12" cy="30" r="3" fill="white" />
    <circle cx="12" cy="30" r="1.5" fill="#333" />
    <path d="M32 20 L36 14 L40 20" fill={accentColor} opacity="0.7" />
    <defs>
      <linearGradient id="mackerel-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
        <stop offset="50%" stopColor="transparent" />
        <stop offset="100%" stopColor="silver" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

// 멸치
const AnchovySVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="30" cy="32" rx="20" ry="7" fill={color} />
    <ellipse cx="30" cy="35" rx="18" ry="4" fill="silver" opacity="0.6" />
    <path d="M49 32 L58 26 L58 38 Z" fill={accentColor} />
    <circle cx="14" cy="30" r="3.5" fill="white" />
    <circle cx="14" cy="30" r="2" fill="#333" />
    <path d="M10 32 L6 34 L10 34" fill={accentColor} opacity="0.5" />
  </svg>
);

// 불가사리
const StarfishSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <polygon
      points="32,4 37,22 56,22 41,34 46,52 32,42 18,52 23,34 8,22 27,22"
      fill={color}
      stroke={accentColor}
      strokeWidth="1.5"
    />
    <circle cx="32" cy="28" r="6" fill={accentColor} opacity="0.3" />
    <circle cx="28" cy="26" r="1.5" fill="#333" />
    <circle cx="36" cy="26" r="1.5" fill="#333" />
    <circle cx="32" cy="30" r="1" fill={accentColor} />
    {/* 흡반 점들 */}
    <circle cx="32" cy="14" r="1" fill={accentColor} opacity="0.5" />
    <circle cx="44" cy="28" r="1" fill={accentColor} opacity="0.5" />
    <circle cx="40" cy="44" r="1" fill={accentColor} opacity="0.5" />
    <circle cx="24" cy="44" r="1" fill={accentColor} opacity="0.5" />
    <circle cx="20" cy="28" r="1" fill={accentColor} opacity="0.5" />
  </svg>
);

// 꽃게
const CrabSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="32" cy="36" rx="18" ry="12" fill={color} />
    <circle cx="24" cy="24" r="5" fill={color} />
    <circle cx="40" cy="24" r="5" fill={color} />
    <circle cx="24" cy="23" r="2.5" fill="white" />
    <circle cx="24" cy="23" r="1.2" fill="#333" />
    <circle cx="40" cy="23" r="2.5" fill="white" />
    <circle cx="40" cy="23" r="1.2" fill="#333" />
    {/* 집게발 */}
    <path d="M10 30 Q6 26 10 22 Q14 22 14 28" fill={accentColor} stroke={accentColor} strokeWidth="1" />
    <path d="M54 30 Q58 26 54 22 Q50 22 50 28" fill={accentColor} stroke={accentColor} strokeWidth="1" />
    <line x1="14" y1="32" x2="10" y2="30" stroke={accentColor} strokeWidth="2.5" />
    <line x1="50" y1="32" x2="54" y2="30" stroke={accentColor} strokeWidth="2.5" />
    {/* 다리 */}
    <line x1="18" y1="42" x2="12" y2="50" stroke={accentColor} strokeWidth="2" />
    <line x1="22" y1="44" x2="16" y2="52" stroke={accentColor} strokeWidth="2" />
    <line x1="26" y1="46" x2="22" y2="54" stroke={accentColor} strokeWidth="2" />
    <line x1="46" y1="42" x2="52" y2="50" stroke={accentColor} strokeWidth="2" />
    <line x1="42" y1="44" x2="48" y2="52" stroke={accentColor} strokeWidth="2" />
    <line x1="38" y1="46" x2="42" y2="54" stroke={accentColor} strokeWidth="2" />
  </svg>
);

// 보리새우
const ShrimpSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path
      d="M20 20 Q32 10 44 18 Q50 24 48 32 Q44 42 36 46 Q28 48 22 44 Q16 38 18 30 Z"
      fill={color}
    />
    <path d="M36 46 Q34 52 30 56 Q28 58 26 56 Q24 52 26 48" fill={accentColor} />
    <circle cx="24" cy="22" r="3" fill="white" />
    <circle cx="24" cy="22" r="1.5" fill="#333" />
    {/* 더듬이 */}
    <path d="M20 18 Q16 8 10 6" stroke={accentColor} strokeWidth="1.5" fill="none" />
    <path d="M22 16 Q20 6 16 4" stroke={accentColor} strokeWidth="1.5" fill="none" />
    {/* 마디 */}
    <path d="M38 26 Q44 28 46 32" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M36 30 Q42 32 44 36" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" />
    <path d="M34 34 Q40 36 42 40" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" />
  </svg>
);

// 문어
const OctopusSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="32" cy="22" rx="16" ry="14" fill={color} />
    <circle cx="26" cy="20" r="4" fill="white" />
    <circle cx="38" cy="20" r="4" fill="white" />
    <circle cx="27" cy="20" r="2" fill="#333" />
    <circle cx="39" cy="20" r="2" fill="#333" />
    <ellipse cx="32" cy="28" rx="3" ry="1.5" fill={accentColor} />
    {/* 다리 */}
    <path d="M18 32 Q12 42 10 54 Q12 56 14 52 Q16 44 20 36" fill={accentColor} opacity="0.8" />
    <path d="M22 34 Q18 46 16 56 Q18 58 20 54 Q22 46 24 38" fill={color} opacity="0.9" />
    <path d="M28 36 Q26 48 24 58 Q26 60 28 56 Q30 48 30 40" fill={accentColor} opacity="0.8" />
    <path d="M34 36 Q34 48 36 58 Q38 60 38 56 Q38 48 36 40" fill={color} opacity="0.9" />
    <path d="M40 34 Q42 46 44 56 Q46 58 46 54 Q44 46 42 38" fill={accentColor} opacity="0.8" />
    <path d="M46 32 Q50 42 52 54 Q54 56 54 52 Q52 44 48 36" fill={color} opacity="0.9" />
    {/* 흡반 */}
    <circle cx="12" cy="48" r="1.5" fill="white" opacity="0.4" />
    <circle cx="18" cy="50" r="1.5" fill="white" opacity="0.4" />
    <circle cx="36" cy="52" r="1.5" fill="white" opacity="0.4" />
    <circle cx="50" cy="48" r="1.5" fill="white" opacity="0.4" />
  </svg>
);

// 해마
const SeahorseSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path
      d="M32 6 Q40 6 42 14 Q44 20 40 26 Q38 30 36 34 Q34 40 34 46 Q34 52 30 56 Q26 58 26 54 Q26 50 28 48 Q30 46 30 42 Q30 38 28 34"
      fill={color}
      stroke={accentColor}
      strokeWidth="1"
    />
    <ellipse cx="34" cy="14" rx="8" ry="8" fill={color} />
    <circle cx="36" cy="12" r="3" fill="white" />
    <circle cx="37" cy="12" r="1.5" fill="#333" />
    <path d="M42 10 L48 8 L46 12" fill={accentColor} opacity="0.6" />
    {/* 왕관 모양 등지느러미 */}
    <path d="M26 16 L24 10 L28 14 L26 8 L30 14" fill={accentColor} opacity="0.5" />
    {/* 배 무늬 */}
    <path d="M34 24 Q38 24 38 28" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M34 30 Q38 30 38 34" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
    <path d="M32 36 Q36 36 36 40" stroke="white" strokeWidth="1" fill="none" opacity="0.4" />
  </svg>
);

// 복어
const PufferfishSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <circle cx="30" cy="32" r="18" fill={color} />
    <circle cx="30" cy="32" r="18" fill="white" opacity="0.15" />
    {/* 가시 */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 30 + Math.cos(rad) * 18;
      const y1 = 32 + Math.sin(rad) * 18;
      const x2 = 30 + Math.cos(rad) * 22;
      const y2 = 32 + Math.sin(rad) * 22;
      return (
        <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accentColor} strokeWidth="1.5" />
      );
    })}
    <circle cx="24" cy="28" r="4" fill="white" />
    <circle cx="36" cy="28" r="4" fill="white" />
    <circle cx="25" cy="28" r="2" fill="#333" />
    <circle cx="37" cy="28" r="2" fill="#333" />
    <ellipse cx="30" cy="36" rx="4" ry="2.5" fill={accentColor} opacity="0.6" />
    {/* 점 무늬 */}
    <circle cx="22" cy="38" r="2" fill={accentColor} opacity="0.3" />
    <circle cx="38" cy="34" r="2" fill={accentColor} opacity="0.3" />
    <circle cx="30" cy="44" r="1.5" fill={accentColor} opacity="0.3" />
    {/* 꼬리 */}
    <path d="M48 32 L56 28 L56 36 Z" fill={accentColor} opacity="0.7" />
  </svg>
);

// 갑오징어
const CuttlefishSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="32" cy="30" rx="20" ry="14" fill={color} />
    {/* 옆 지느러미 */}
    <path d="M12 30 Q8 20 12 16 Q14 24 14 30" fill={accentColor} opacity="0.6" />
    <path d="M52 30 Q56 20 52 16 Q50 24 50 30" fill={accentColor} opacity="0.6" />
    <path d="M12 30 Q8 40 12 44 Q14 36 14 30" fill={accentColor} opacity="0.6" />
    <path d="M52 30 Q56 40 52 44 Q50 36 50 30" fill={accentColor} opacity="0.6" />
    {/* 눈 */}
    <ellipse cx="24" cy="26" rx="5" ry="6" fill="white" />
    <ellipse cx="40" cy="26" rx="5" ry="6" fill="white" />
    <ellipse cx="24" cy="26" rx="2" ry="4" fill="#333" />
    <ellipse cx="40" cy="26" rx="2" ry="4" fill="#333" />
    {/* 다리 */}
    <path d="M26 44 Q24 52 22 56" stroke={accentColor} strokeWidth="2" fill="none" />
    <path d="M30 44 Q30 52 28 56" stroke={color} strokeWidth="2" fill="none" />
    <path d="M34 44 Q34 52 36 56" stroke={accentColor} strokeWidth="2" fill="none" />
    <path d="M38 44 Q40 52 42 56" stroke={color} strokeWidth="2" fill="none" />
    {/* 줄무늬 */}
    <path d="M18 28 Q32 24 46 28" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M16 32 Q32 28 48 32" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.3" />
  </svg>
);

// 상괭이
const PorpoiseSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path
      d="M8 32 Q8 22 20 20 Q32 18 44 20 Q54 22 58 28 Q60 32 56 34 Q50 38 38 38 Q26 40 16 38 Q8 36 8 32 Z"
      fill={color}
    />
    <path d="M8 32 Q8 36 16 38 Q26 40 38 38 Q50 38 56 34" fill={accentColor} opacity="0.2" />
    {/* 입 - 미소 */}
    <path d="M10 30 Q6 32 4 30" stroke={accentColor} strokeWidth="1.5" fill="none" />
    <circle cx="14" cy="26" r="2.5" fill="white" />
    <circle cx="14" cy="26" r="1.2" fill="#333" />
    {/* 가슴지느러미 */}
    <path d="M28 36 Q26 44 22 46 Q24 42 28 38" fill={accentColor} opacity="0.6" />
    {/* 꼬리 */}
    <path d="M56 30 Q62 24 64 20 Q60 26 58 28" fill={accentColor} opacity="0.7" />
    <path d="M56 32 Q62 38 64 42 Q60 36 58 34" fill={accentColor} opacity="0.7" />
  </svg>
);

// 푸른바다거북
const TurtleSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    {/* 등딱지 */}
    <ellipse cx="32" cy="34" rx="20" ry="16" fill={color} />
    {/* 등딱지 패턴 */}
    <path d="M32 18 L22 28 L32 34 L42 28 Z" fill={accentColor} opacity="0.3" />
    <path d="M22 28 L14 34 L22 40 L32 34 Z" fill={accentColor} opacity="0.2" />
    <path d="M42 28 L50 34 L42 40 L32 34 Z" fill={accentColor} opacity="0.2" />
    <path d="M22 40 L32 50 L42 40 L32 34 Z" fill={accentColor} opacity="0.3" />
    {/* 머리 */}
    <ellipse cx="32" cy="14" rx="8" ry="6" fill={color} />
    <circle cx="28" cy="12" r="2" fill="white" />
    <circle cx="36" cy="12" r="2" fill="white" />
    <circle cx="28" cy="12" r="1" fill="#333" />
    <circle cx="36" cy="12" r="1" fill="#333" />
    <ellipse cx="32" cy="16" rx="2" ry="1" fill={accentColor} opacity="0.5" />
    {/* 앞다리 */}
    <path d="M14 28 Q6 22 4 26 Q6 30 14 32" fill={color} opacity="0.8" />
    <path d="M50 28 Q58 22 60 26 Q58 30 50 32" fill={color} opacity="0.8" />
    {/* 뒷다리 */}
    <path d="M16 42 Q10 46 8 44 Q10 40 16 40" fill={color} opacity="0.7" />
    <path d="M48 42 Q54 46 56 44 Q54 40 48 40" fill={color} opacity="0.7" />
    {/* 꼬리 */}
    <path d="M32 50 L32 56" stroke={color} strokeWidth="3" />
  </svg>
);

// 참돌고래
const DolphinSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <path
      d="M6 30 Q4 24 10 20 Q18 16 30 18 Q42 18 50 22 Q56 26 58 30 Q58 34 52 36 Q42 40 30 40 Q18 40 10 36 Q6 34 6 30 Z"
      fill={color}
    />
    {/* 배 밝은 부분 */}
    <path
      d="M10 32 Q18 38 30 38 Q42 38 52 34"
      fill="none"
      stroke="white"
      strokeWidth="4"
      opacity="0.2"
    />
    {/* 등지느러미 */}
    <path d="M34 18 L32 8 L38 16" fill={accentColor} />
    {/* 주둥이 */}
    <path d="M6 28 L0 26 L0 30 L6 30" fill={accentColor} opacity="0.8" />
    {/* 눈 */}
    <circle cx="14" cy="26" r="3" fill="white" />
    <circle cx="14" cy="26" r="1.5" fill="#333" />
    {/* 입 */}
    <path d="M6 30 Q4 32 6 32" stroke={accentColor} strokeWidth="1" fill="none" />
    {/* 가슴지느러미 */}
    <path d="M24 36 Q20 44 16 46 Q18 42 22 38" fill={accentColor} opacity="0.7" />
    {/* 꼬리 */}
    <path d="M56 28 Q62 22 64 18 Q60 24 58 28" fill={accentColor} />
    <path d="M56 32 Q62 38 64 44 Q60 36 58 32" fill={accentColor} />
  </svg>
);

// 기본 물고기 (폴백)
const DefaultFishSVG: React.FC<SVGProps> = ({ color, accentColor, size, className }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
    <ellipse cx="28" cy="32" rx="20" ry="12" fill={color} />
    <path d="M48 32 L60 22 L60 42 Z" fill={accentColor} />
    <circle cx="16" cy="28" r="3" fill="white" />
    <circle cx="16" cy="28" r="1.5" fill="#333" />
  </svg>
);

export default CreatureSVG;
