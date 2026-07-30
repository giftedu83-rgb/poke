import type { Monster } from '../types';

// ⚠️ 임시 데이터 안내
// 아래 좌표는 광안리 해수욕장 산책로 주변의 "시연용 샘플 좌표"이다.
// 실제 서비스 배포 전 관리자가 안전한 위치(인도, 산책로 등)로 재검수 및 수정해야 한다.
// 바다 안, 차도, 통제 구역에는 배치하지 않았다.
export const MONSTERS: Monster[] = [
  {
    id: 'm1',
    name: '윈드갈',
    species: '바람 갈매기',
    description:
      '광안리 해변을 자유롭게 날아다니는 바람의 정령. 갈매기의 날갯짓에서 태어났으며 산들바람을 몰고 다닌다.',
    rarity: 'common',
    latitude: 35.1533,
    longitude: 129.1178,
    habitat: '광안리 해수욕장 백사장 인근 산책로',
    collectionRadius: 50,
    colorFrom: '#8ec5fc',
    colorTo: '#e0c3fc',
    rewardItemId: 'item-feather',
  },
  {
    id: 'm2',
    name: '루미젤',
    species: '빛 해파리',
    description:
      '몸속에 은은한 빛을 품은 해파리 몬스터. 어두워질수록 더 아름답게 빛나며 밤바다를 밝힌다.',
    rarity: 'uncommon',
    latitude: 35.1522,
    longitude: 129.1201,
    habitat: '광안리 해변 산책로 중앙 구간',
    collectionRadius: 50,
    colorFrom: '#a1ffce',
    colorTo: '#faffd1',
    rewardItemId: 'item-jelly-shard',
  },
  {
    id: 'm3',
    name: '먹물이',
    species: '장난꾸러기 문어',
    description:
      '호기심이 많고 장난기가 넘치는 문어 몬스터. 사람을 보면 다리를 흔들며 인사를 건넨다.',
    rarity: 'common',
    latitude: 35.1544,
    longitude: 129.1213,
    habitat: '광안대교 전망 지점 부근 산책로',
    collectionRadius: 50,
    colorFrom: '#f6d365',
    colorTo: '#fda085',
    rewardItemId: 'item-ink-pouch',
  },
  {
    id: 'm4',
    name: '철갑이',
    species: '방패 꽃게',
    description:
      '단단한 등딱지로 몸을 지키는 방어형 몬스터. 위협을 느끼면 집게를 들어 올리며 자세를 잡는다.',
    rarity: 'uncommon',
    latitude: 35.1576,
    longitude: 129.1249,
    habitat: '민락수변공원 산책로 인근',
    collectionRadius: 50,
    colorFrom: '#ff9a9e',
    colorTo: '#fecfef',
    rewardItemId: 'item-shell-plate',
  },
  {
    id: 'm5',
    name: '뽀글이',
    species: '겁쟁이 복어',
    description:
      '작은 소리에도 몸을 크게 부풀리는 겁 많은 복어 몬스터. 놀랐을 때 모습이 귀엽다는 소문이 있다.',
    rarity: 'common',
    latitude: 35.1568,
    longitude: 129.1240,
    habitat: '민락회센터 인근 산책로',
    collectionRadius: 50,
    colorFrom: '#fbc2eb',
    colorTo: '#a6c1ee',
    rewardItemId: 'item-puffer-spike',
  },
  {
    id: 'm6',
    name: '아라',
    species: '신비 돌고래',
    description:
      '광안리 앞바다에 아주 가끔 나타난다는 희귀한 돌고래 몬스터. 매끄러운 몸놀림이 인상적이다.',
    rarity: 'rare',
    latitude: 35.1500,
    longitude: 129.1158,
    habitat: '남천해변공원 방향 산책로',
    collectionRadius: 50,
    colorFrom: '#4facfe',
    colorTo: '#00f2fe',
    rewardItemId: 'item-dolphin-scale',
  },
  {
    id: 'm7',
    name: '별밤이',
    species: '야광 불가사리',
    description:
      '밤이 되면 별처럼 반짝이는 불가사리 몬스터. 낮에는 모래 속에 숨어 있다가 밤에만 모습을 드러낸다.',
    rarity: 'rare',
    latitude: 35.1540,
    longitude: 129.1168,
    habitat: '광안리 해변 산책로 서쪽 구간',
    collectionRadius: 50,
    colorFrom: '#30cfd0',
    colorTo: '#330867',
    rewardItemId: 'item-star-fragment',
  },
  {
    id: 'm8',
    name: '해랑',
    species: '파도의 정령',
    description:
      '광안리 바다의 파도와 물방울이 모여 만들어진 전설의 몬스터. 광안 몬스터 탐험대를 상징하는 대표 몬스터다.',
    rarity: 'legendary',
    latitude: 35.1528,
    longitude: 129.1190,
    habitat: '광안리 해수욕장 중앙 산책로',
    collectionRadius: 50,
    colorFrom: '#43cea2',
    colorTo: '#185a9d',
    rewardItemId: 'item-wave-orb',
  },
];

export const getMonsterById = (id: string): Monster | undefined =>
  MONSTERS.find((m) => m.id === id);
