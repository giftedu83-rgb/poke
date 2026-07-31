/**
 * 해양 생물 데이터
 * 부산 및 한국 연안에서 관찰 가능한 해양 생물
 */

import type { CreatureData } from '@/types/game';

export const CREATURES: CreatureData[] = [
  // ===== 1성 생물 (60% 확률) =====
  {
    id: 'mackerel',
    name: '고등어',
    englishName: 'Chub Mackerel',
    rarity: 1,
    color: '#4A90D9',
    accentColor: '#2E5F8A',
    minLengthCm: 25,
    maxLengthCm: 45,
    minWeightG: 300,
    maxWeightG: 900,
    habitat: '연안과 먼바다를 오가는 회유성 어류',
    description:
      '등 쪽에 특유의 물결 무늬가 있는 대표적인 바닷물고기예요. 떼를 지어 빠르게 헤엄치며, 가을이면 부산 앞바다에 풍부하게 나타나요.',
    funFacts: [
      '고등어는 시속 30km 이상으로 헤엄칠 수 있어요.',
      '부산 자갈치시장의 대표 생선 중 하나예요.',
      '몸에 좋은 오메가-3 지방산이 풍부해요.',
    ],
    ecosystemRole:
      '작은 물고기와 플랑크톤을 먹고, 큰 물고기와 해양 포유류의 먹이가 되는 중요한 먹이사슬 연결고리예요.',
    conservationTip:
      '제철이 아닌 어린 고등어는 바다로 돌려보내 주세요. 지속 가능한 어업이 바다를 지켜요.',
    spawnWeight: 14,
    svgType: 'mackerel',
  },
  {
    id: 'anchovy',
    name: '멸치',
    englishName: 'Japanese Anchovy',
    rarity: 1,
    color: '#7BAFD4',
    accentColor: '#4A7FA0',
    minLengthCm: 8,
    maxLengthCm: 15,
    minWeightG: 5,
    maxWeightG: 30,
    habitat: '연안 표층에서 큰 떼를 지어 생활',
    description:
      '작지만 바다에서 아주 중요한 물고기예요. 은빛으로 반짝이는 몸을 가지고 있으며, 수천 마리가 함께 헤엄쳐요.',
    funFacts: [
      '멸치는 눈이 크고 투명한 편이에요.',
      '부산 기장은 멸치 축제로 유명해요.',
      '칼슘이 풍부해서 뼈를 튼튼하게 해줘요.',
    ],
    ecosystemRole:
      '플랑크톤을 먹고 더 큰 물고기, 새, 해양 포유류에게 에너지를 전달하는 바다 먹이사슬의 기초예요.',
    conservationTip:
      '멸치 떼가 해변 가까이 오면 관찰만 하고, 물을 더럽히지 않는 것이 가장 좋은 보호 방법이에요.',
    spawnWeight: 14,
    svgType: 'anchovy',
  },
  {
    id: 'starfish',
    name: '불가사리',
    englishName: 'Starfish',
    rarity: 1,
    color: '#E88B5A',
    accentColor: '#C06A3A',
    minLengthCm: 8,
    maxLengthCm: 25,
    minWeightG: 30,
    maxWeightG: 200,
    habitat: '갯바위와 해저 바닥',
    description:
      '다섯 개의 팔을 가진 별 모양의 바다 동물이에요. 갯바위 근처에서 천천히 움직이며 조개를 찾아 먹어요.',
    funFacts: [
      '불가사리는 팔이 잘려도 다시 자라나요.',
      '위장을 몸 밖으로 내밀어서 먹이를 소화해요.',
      '눈은 각 팔 끝에 하나씩 있어요.',
    ],
    ecosystemRole:
      '조개류의 개체 수를 조절하여 갯바위 생태계의 균형을 유지하는 역할을 해요.',
    conservationTip:
      '해변에서 불가사리를 발견하면 만져보고 싶겠지만, 제자리에 놓아두는 것이 좋아요.',
    spawnWeight: 12,
    svgType: 'starfish',
  },
  {
    id: 'crab',
    name: '꽃게',
    englishName: 'Blue Swimming Crab',
    rarity: 1,
    color: '#3B8686',
    accentColor: '#2A6363',
    minLengthCm: 10,
    maxLengthCm: 22,
    minWeightG: 100,
    maxWeightG: 400,
    habitat: '연안 모래와 갯벌',
    description:
      '옆으로 빠르게 걷는 게 중에서도 예쁜 무늬를 가진 꽃게예요. 가을이면 살이 꽉 차서 맛도 좋아져요.',
    funFacts: [
      '꽃게는 뒤쪽 다리가 노처럼 생겨서 헤엄칠 수 있어요.',
      '위험을 느끼면 집게발을 높이 들어 위협해요.',
      '부산에서는 가을 꽃게가 특히 유명해요.',
    ],
    ecosystemRole:
      '해저의 죽은 생물과 유기물을 청소하는 바다의 청소부 역할을 해요.',
    conservationTip:
      '산란기의 암컷 꽃게를 보호하면 내년에도 풍성한 바다를 만날 수 있어요.',
    spawnWeight: 10,
    svgType: 'crab',
  },
  {
    id: 'shrimp',
    name: '보리새우',
    englishName: 'Whiskered Velvet Shrimp',
    rarity: 1,
    color: '#E89B7B',
    accentColor: '#C47A5A',
    minLengthCm: 12,
    maxLengthCm: 20,
    minWeightG: 15,
    maxWeightG: 50,
    habitat: '연안 모래 바닥',
    description:
      '투명한 몸에 붉은빛이 도는 새우예요. 보리가 익을 무렵 많이 잡혀서 보리새우라는 이름이 붙었어요.',
    funFacts: [
      '새우는 심장이 머리에 있어요.',
      '위험할 때 꼬리를 튕겨 뒤로 순간 도망쳐요.',
      '탈피를 반복하며 성장해요.',
    ],
    ecosystemRole:
      '바닥의 유기물을 먹고, 물고기들의 중요한 먹이가 되어 에너지 순환에 기여해요.',
    conservationTip:
      '새우를 잡을 때는 정해진 크기 이상만 가져가고, 작은 새우는 돌려보내 주세요.',
    spawnWeight: 10,
    svgType: 'shrimp',
  },

  // ===== 2성 생물 (30% 확률) =====
  {
    id: 'octopus',
    name: '문어',
    englishName: 'Common Octopus',
    rarity: 2,
    color: '#9B59B6',
    accentColor: '#7D3C98',
    minLengthCm: 30,
    maxLengthCm: 90,
    minWeightG: 500,
    maxWeightG: 5000,
    habitat: '갯바위 틈과 해저 바위 지대',
    description:
      '여덟 개의 팔을 가진 매우 똑똑한 바다 동물이에요. 몸 색깔을 순식간에 바꿀 수 있어서 바위에 숨으면 찾기 어려워요.',
    funFacts: [
      '문어는 뇌가 9개예요. 팔마다 작은 뇌가 하나씩!',
      '유리병 뚜껑을 안에서 열 정도로 똑똑해요.',
      '심장이 3개이고, 피는 파란색이에요.',
    ],
    ecosystemRole:
      '갑각류와 조개를 잡아먹으며 개체 수 조절에 기여하고, 큰 포식자의 먹이이기도 해요.',
    conservationTip:
      '바다에서 문어를 만나면 손으로 잡으려 하지 마세요. 스트레스를 받으면 먹물을 뿜어요.',
    spawnWeight: 9,
    svgType: 'octopus',
  },
  {
    id: 'seahorse',
    name: '해마',
    englishName: 'Seahorse',
    rarity: 2,
    color: '#F5A623',
    accentColor: '#D4891A',
    minLengthCm: 5,
    maxLengthCm: 15,
    minWeightG: 2,
    maxWeightG: 20,
    habitat: '해조류와 산호 근처',
    description:
      '말 머리를 닮은 독특한 생김새의 물고기예요. 꼬리로 해초를 감싸고 천천히 떠다니며, 수컷이 새끼를 낳는 신기한 동물이에요.',
    funFacts: [
      '해마의 수컷이 배 주머니에서 새끼를 품어 출산해요.',
      '해마는 위장이 없어서 하루 종일 먹어야 해요.',
      '두 눈을 각각 다른 방향으로 움직일 수 있어요.',
    ],
    ecosystemRole:
      '작은 플랑크톤과 갑각류 유생을 먹으며, 해초 숲 생태계의 일원이에요.',
    conservationTip:
      '해마는 전 세계적으로 보호가 필요한 생물이에요. 바다에서 만나면 조용히 관찰만 해주세요.',
    spawnWeight: 8,
    svgType: 'seahorse',
  },
  {
    id: 'pufferfish',
    name: '복어',
    englishName: 'Pufferfish',
    rarity: 2,
    color: '#F7DC6F',
    accentColor: '#D4AC0D',
    minLengthCm: 15,
    maxLengthCm: 40,
    minWeightG: 200,
    maxWeightG: 1500,
    habitat: '연안과 하구 근처',
    description:
      '위험을 느끼면 몸을 공처럼 부풀리는 물고기예요. 귀여운 생김새와 달리 강한 독을 가지고 있어서 전문 요리사만 조리할 수 있어요.',
    funFacts: [
      '복어 독은 청산가리의 수십 배나 강해요.',
      '부산은 복어 요리로 유명한 도시예요.',
      '부풀릴 때 물이나 공기를 위장에 가득 채워요.',
    ],
    ecosystemRole:
      '저서 생물과 갑각류를 잡아먹으며, 독으로 인해 천적이 적어 생태계에서 독특한 위치를 차지해요.',
    conservationTip:
      '절대 맨손으로 만지지 마세요! 복어 독은 피부로도 흡수될 수 있어요.',
    spawnWeight: 7,
    svgType: 'pufferfish',
  },
  {
    id: 'cuttlefish',
    name: '갑오징어',
    englishName: 'Common Cuttlefish',
    rarity: 2,
    color: '#A0522D',
    accentColor: '#7B3F24',
    minLengthCm: 20,
    maxLengthCm: 45,
    minWeightG: 200,
    maxWeightG: 2000,
    habitat: '연안 모래와 해초 지대',
    description:
      '넓적한 몸과 큰 눈을 가진 두족류예요. 몸 색깔과 무늬를 자유자재로 바꾸는 위장의 달인이에요.',
    funFacts: [
      '갑오징어는 색맹인데도 완벽한 위장술을 보여줘요.',
      '몸속에 "갑"이라는 단단한 뼈가 있어요. 새장에 걸어두는 오징어뼈가 바로 이거예요.',
      '먹물을 뿜어 적을 혼란시키고 도망쳐요.',
    ],
    ecosystemRole:
      '새우, 게, 작은 물고기를 잡아먹고, 상어나 돌고래의 먹이가 되기도 해요.',
    conservationTip:
      '산란기에 해변 가까이 오는 갑오징어를 방해하지 않으면 건강한 바다를 유지할 수 있어요.',
    spawnWeight: 6,
    svgType: 'cuttlefish',
  },

  // ===== 3성 생물 (10% 확률) =====
  {
    id: 'finless-porpoise',
    name: '상괭이',
    englishName: 'Finless Porpoise',
    rarity: 3,
    color: '#5D6D7E',
    accentColor: '#3B4A5A',
    minLengthCm: 120,
    maxLengthCm: 190,
    minWeightG: 30000,
    maxWeightG: 72000,
    habitat: '연안 얕은 바다',
    description:
      '등지느러미가 없는 작은 돌고래 친척이에요. 한국 연안에서 볼 수 있는 귀한 해양 포유류로, 천연기념물로 지정되어 보호받고 있어요.',
    funFacts: [
      '상괭이는 등지느러미가 없는 게 특징이에요.',
      '한국 바다의 대표적인 해양 포유류예요.',
      '미소 짓는 것처럼 보이는 입 모양이 귀여워요.',
    ],
    ecosystemRole:
      '바다 먹이사슬 상위에 위치하며, 상괭이의 존재는 해양 생태계가 건강하다는 신호예요.',
    conservationTip:
      '바다에서 상괭이를 발견하면 가까이 가거나 소리를 지르지 마세요. 해양수산부에 목격 정보를 제보할 수 있어요.',
    spawnWeight: 4,
    svgType: 'porpoise',
  },
  {
    id: 'green-turtle',
    name: '푸른바다거북',
    englishName: 'Green Sea Turtle',
    rarity: 3,
    color: '#27AE60',
    accentColor: '#1E8449',
    minLengthCm: 70,
    maxLengthCm: 150,
    minWeightG: 50000,
    maxWeightG: 200000,
    habitat: '온대와 열대 바다',
    description:
      '아름다운 녹색빛 등딱지를 가진 바다거북이에요. 전 세계를 여행하며, 가끔 한국 남해안에도 나타나요.',
    funFacts: [
      '바다거북은 2억 년 전부터 지구에 살아온 고대 동물이에요.',
      '알을 낳을 때 태어난 해변으로 수천 km를 돌아와요.',
      '해파리를 즐겨 먹는데, 비닐봉지를 해파리로 착각하기도 해요.',
    ],
    ecosystemRole:
      '해초를 뜯어 먹으며 해초밭이 건강하게 자랄 수 있도록 도와주는 바다의 정원사예요.',
    conservationTip:
      '바다에 비닐이나 플라스틱을 버리지 않는 것이 바다거북을 지키는 가장 쉬운 방법이에요.',
    spawnWeight: 3,
    svgType: 'turtle',
  },
  {
    id: 'bottlenose-dolphin',
    name: '참돌고래',
    englishName: 'Common Bottlenose Dolphin',
    rarity: 3,
    color: '#2C82C9',
    accentColor: '#1A5276',
    minLengthCm: 200,
    maxLengthCm: 380,
    minWeightG: 150000,
    maxWeightG: 650000,
    habitat: '연안과 외해',
    description:
      '뛰어난 지능과 장난기 넘치는 성격을 가진 바다의 인기 스타예요. 무리 지어 헤엄치며, 가끔 부산 앞바다에서도 목격돼요.',
    funFacts: [
      '돌고래는 잠잘 때 뇌의 절반만 쉬어요.',
      '초음파로 소통하고 먹이를 찾아요.',
      '서로 이름처럼 쓰는 고유한 소리가 있어요.',
    ],
    ecosystemRole:
      '바다 먹이사슬의 최상위 포식자 중 하나로, 어류 개체 수 균형을 유지하는 데 중요한 역할을 해요.',
    conservationTip:
      '돌고래를 바다에서 만나면 배의 속도를 줄이고, 100m 이상 거리를 유지해 주세요.',
    spawnWeight: 3,
    svgType: 'dolphin',
  },
];

/**
 * ID로 생물 데이터 조회
 */
export function getCreatureById(id: string): CreatureData | undefined {
  return CREATURES.find((c) => c.id === id);
}
