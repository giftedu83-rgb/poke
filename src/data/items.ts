import type { GameItem } from '../types';

// 아이템 데이터 - 몬스터를 수집할 때 함께 획득한다.
// MVP에서는 아이템을 실제로 사용하는 기능은 없으며 보관함에서만 확인 가능하다.
export const ITEMS: GameItem[] = [
  {
    id: 'item-feather',
    name: '갈매기 깃털',
    description: '바닷바람을 머금은 부드러운 깃털. 행운을 가져다준다는 이야기가 있다.',
    emoji: '🪶',
  },
  {
    id: 'item-jelly-shard',
    name: '빛나는 젤리 조각',
    description: '은은하게 빛나는 투명한 조각. 밤에 더 밝게 빛난다.',
    emoji: '💎',
  },
  {
    id: 'item-ink-pouch',
    name: '먹물 주머니',
    description: '문어 몬스터가 남기고 간 작은 먹물 주머니. 장난기가 가득하다.',
    emoji: '🖤',
  },
  {
    id: 'item-shell-plate',
    name: '단단한 게 딱지',
    description: '꽃게 몬스터의 단단한 등딱지 조각. 방어력이 느껴진다.',
    emoji: '🐚',
  },
  {
    id: 'item-puffer-spike',
    name: '복어 가시',
    description: '부풀었을 때 생기는 작은 가시. 겁이 많아 쉽게 놀란다.',
    emoji: '🔺',
  },
  {
    id: 'item-dolphin-scale',
    name: '돌고래의 비늘',
    description: '매끄럽고 푸른빛이 도는 희귀한 비늘 조각.',
    emoji: '🔷',
  },
  {
    id: 'item-star-fragment',
    name: '별빛 조각',
    description: '밤바다에서만 볼 수 있는 반짝이는 조각.',
    emoji: '✨',
  },
  {
    id: 'item-wave-orb',
    name: '파도의 구슬',
    description: '광안리 바다의 기운이 담긴 전설의 구슬.',
    emoji: '🔮',
  },
];

export const getItemById = (id: string): GameItem | undefined =>
  ITEMS.find((item) => item.id === id);
