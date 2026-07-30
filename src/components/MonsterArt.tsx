import type { Monster } from '../types';

interface Props {
  monster: Monster;
  silhouette?: boolean; // 미수집 상태일 때 실루엣으로 표시
  size?: number;
  className?: string;
}

// 저작권 문제 없는 자체 제작 SVG로 각 몬스터를 표현한다.
// 실제 이미지 파일에 의존하지 않고 벡터 도형 + 그라디언트로 구성한다.
export function MonsterArt({ monster, silhouette = false, size = 120, className = '' }: Props) {
  const gradId = `grad-${monster.id}`;
  const fill = silhouette ? '#334155' : `url(#${gradId})`;
  const stroke = silhouette ? '#1e293b' : 'rgba(255,255,255,0.35)';

  // 윈드갈은 제공받은 4프레임 픽셀 아트를 사용한다. 미수집 상태는 기존 실루엣을 유지한다.
  if (monster.id === 'm1' && !silhouette) {
    return (
      <div
        className={`windgal-flight ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={monster.name}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={silhouette ? '미확인 몬스터' : monster.name}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={monster.colorFrom} />
          <stop offset="100%" stopColor={monster.colorTo} />
        </linearGradient>
      </defs>

      {renderBody(monster.id, fill, stroke)}

      {silhouette && (
        <text
          x="100"
          y="115"
          textAnchor="middle"
          fontSize="48"
          fontWeight="bold"
          fill="#64748b"
        >
          ?
        </text>
      )}
    </svg>
  );
}

// 몬스터 id에 따라 서로 다른 도형 조합을 그려 개성을 표현한다.
function renderBody(id: string, fill: string, stroke: string) {
  switch (id) {
    case 'm1': // 윈드갈 - 바람 갈매기
      return (
        <g stroke={stroke} strokeWidth={3}>
          <path d="M30 120 Q100 40 170 110 Q120 95 100 130 Q80 95 30 120 Z" fill={fill} />
          <circle cx="100" cy="105" r="16" fill={fill} />
          <path d="M92 100 q8 -6 16 0" stroke="#0f172a" strokeWidth="3" fill="none" />
        </g>
      );
    case 'm2': // 루미젤 - 빛 해파리
      return (
        <g stroke={stroke} strokeWidth={3}>
          <path d="M60 90 A40 40 0 0 1 140 90 Z" fill={fill} />
          <path d="M65 95 Q60 130 55 160" fill="none" />
          <path d="M85 98 Q82 135 78 165" fill="none" />
          <path d="M115 98 Q118 135 122 165" fill="none" />
          <path d="M135 95 Q140 130 145 160" fill="none" />
          <circle cx="100" cy="75" r="10" fill="#fff" opacity="0.7" />
        </g>
      );
    case 'm3': // 먹물이 - 장난꾸러기 문어
      return (
        <g stroke={stroke} strokeWidth={3}>
          <circle cx="100" cy="90" r="45" fill={fill} />
          <circle cx="85" cy="85" r="6" fill="#0f172a" />
          <circle cx="115" cy="85" r="6" fill="#0f172a" />
          <path d="M60 120 Q50 150 65 165" fill="none" />
          <path d="M80 130 Q75 160 85 175" fill="none" />
          <path d="M100 133 Q100 165 100 178" fill="none" />
          <path d="M120 130 Q125 160 115 175" fill="none" />
          <path d="M140 120 Q150 150 135 165" fill="none" />
        </g>
      );
    case 'm4': // 철갑이 - 방패 꽃게
      return (
        <g stroke={stroke} strokeWidth={3}>
          <ellipse cx="100" cy="105" rx="55" ry="38" fill={fill} />
          <circle cx="55" cy="80" r="16" fill={fill} />
          <circle cx="145" cy="80" r="16" fill={fill} />
          <circle cx="80" cy="90" r="5" fill="#0f172a" />
          <circle cx="120" cy="90" r="5" fill="#0f172a" />
          <path d="M60 140 L45 160 M85 148 L75 168 M115 148 L125 168 M140 140 L155 160" fill="none" />
        </g>
      );
    case 'm5': // 뽀글이 - 겁쟁이 복어
      return (
        <g stroke={stroke} strokeWidth={3}>
          <circle cx="100" cy="105" r="50" fill={fill} />
          <circle cx="82" cy="95" r="6" fill="#0f172a" />
          <circle cx="118" cy="95" r="6" fill="#0f172a" />
          <path
            d="M60 60 L65 72 M75 48 L78 62 M100 45 L100 60 M125 48 L122 62 M140 60 L135 72"
            fill="none"
          />
          <path d="M85 120 Q100 130 115 120" fill="none" />
        </g>
      );
    case 'm6': // 아라 - 신비 돌고래
      return (
        <g stroke={stroke} strokeWidth={3}>
          <path
            d="M35 120 Q70 60 130 70 Q160 75 175 60 Q165 90 140 100 Q110 150 60 140 Q40 135 35 120 Z"
            fill={fill}
          />
          <circle cx="70" cy="100" r="5" fill="#0f172a" />
        </g>
      );
    case 'm7': // 별밤이 - 야광 불가사리
      return (
        <g stroke={stroke} strokeWidth={3}>
          <path
            d="M100 30 L118 78 L168 82 L128 112 L142 162 L100 132 L58 162 L72 112 L32 82 L82 78 Z"
            fill={fill}
          />
          <circle cx="100" cy="95" r="5" fill="#0f172a" />
        </g>
      );
    case 'm8': // 해랑 - 파도의 정령(대표)
      return (
        <g stroke={stroke} strokeWidth={3}>
          <path
            d="M30 130 Q60 90 90 130 Q120 90 150 130 Q170 130 170 130 Q150 150 120 140 Q100 155 80 140 Q50 155 30 130 Z"
            fill={fill}
          />
          <circle cx="100" cy="70" r="22" fill={fill} />
          <circle cx="93" cy="65" r="4" fill="#0f172a" />
          <circle cx="107" cy="65" r="4" fill="#0f172a" />
        </g>
      );
    default:
      return <circle cx="100" cy="100" r="50" fill={fill} />;
  }
}
