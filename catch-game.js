(() => {
  /* =========================================================
   * 광안 몬스터 탐험대 — 명소 퀴즈 & 야생 몬스터 포획 확장 기능
   * - 기존 앱의 저장 스키마(gam_*)와 충돌하지 않도록 별도의
   *   localStorage 키(gam_ext_*)를 사용하는 독립 애드온입니다.
   * ========================================================= */

  const KEYS = {
    nets: "gam_ext_nets",
    catches: "gam_ext_wild_catches",
    lastQuiz: "gam_ext_last_quiz_idx",
  };

  /* ---------------- 몬스터 데이터 ---------------- */
  const MONSTERS = [
    { id: "m1", name: "윈드갈", species: "바람 갈매기", rarity: "common",
      colorFrom: "#8ec5fc", colorTo: "#e0c3fc",
      sheet: "./images/monsters/windgal-flying-sheet.png", emoji: "🕊️" },
    { id: "m2", name: "루미젤", species: "빛 해파리", rarity: "uncommon",
      colorFrom: "#a1ffce", colorTo: "#faffd1",
      sheet: "./images/monsters/lumizel-floating-sheet.png", emoji: "🎐" },
    { id: "m3", name: "먹물이", species: "장난꾸러기 문어", rarity: "common",
      colorFrom: "#f6d365", colorTo: "#fda085",
      sheet: "./images/monsters/meokmuri-waving-sheet.png", emoji: "🐙" },
    { id: "m4", name: "철갑이", species: "방패 꽃게", rarity: "uncommon",
      colorFrom: "#ff9a9e", colorTo: "#fecfef",
      sheet: "./images/monsters/cheolgap-guard-sheet.png", emoji: "🦀" },
    { id: "m5", name: "뽀글이", species: "겁쟁이 복어", rarity: "common",
      colorFrom: "#fbc2eb", colorTo: "#a6c1ee",
      sheet: "./images/monsters/ppogeuli-swimming-sheet.png", emoji: "🐡" },
    { id: "m6", name: "아라", species: "신비 돌고래", rarity: "rare",
      colorFrom: "#4facfe", colorTo: "#00f2fe",
      sheet: "./images/monsters/ara-swimming-sheet.png", emoji: "🐬" },
    { id: "m7", name: "별밤이", species: "야광 불가사리", rarity: "rare",
      colorFrom: "#30cfd0", colorTo: "#330867", emoji: "⭐" },
    { id: "m8", name: "해랑", species: "파도의 정령", rarity: "legendary",
      colorFrom: "#43cea2", colorTo: "#185a9d", emoji: "🌊" },
  ];

  const RARITY_LABEL = { common: "일반", uncommon: "고급", rare: "희귀", legendary: "전설" };
  const RARITY_WEIGHT = { common: 50, uncommon: 30, rare: 15, legendary: 5 };
  const RARITY_CATCH_RATE = { common: 0.85, uncommon: 0.65, rare: 0.45, legendary: 0.25 };

  const SPOT_NAMES = [
    "광안리해수욕장", "광안대교 전망 지점", "민락수변공원",
    "민락회센터 인근", "광안리 해변 산책로", "남천해변공원 방향",
  ];

  /* ---------------- 명소 퀴즈 문제 은행 ---------------- */
  const QUIZ = [
    { q: "부산 수영구에 위치한 도심형 해수욕장으로, 광안리의 시작점이라 불리는 이곳은?",
      options: ["광안리해수욕장", "민락수변공원", "해운대해수욕장", "송정해수욕장"], answer: 0,
      fact: "광안리해수욕장은 넓은 백사장과 편의시설을 갖춰 사계절 관광객이 찾는 명소예요." },
    { q: "광안리해수욕장을 방문하기 가장 좋은 시간대로 소개된 것은?",
      options: ["이른 아침", "정오", "해 질 무렵", "자정"], answer: 2,
      fact: "해 질 무렵 방문하면 노을과 함께 야경 준비 과정을 모두 즐길 수 있어요." },
    { q: "광안리해수욕장 촬영 팁으로 소개된 방법은?",
      options: ["드론으로 위에서 촬영", "백사장에서 낮은 각도로 촬영", "밤에 플래시 사용", "실내에서 촬영"], answer: 1,
      fact: "백사장에서 바다를 정면으로 두고 낮게 앉아 촬영하면 하늘과 바다가 넓게 담겨요." },

    { q: "부산 해운대구와 수영구를 잇는 해상 교량으로, 광안리의 대표 야경으로 손꼽히는 것은?",
      options: ["부산항대교", "광안대교", "영도대교", "남항대교"], answer: 1,
      fact: "광안대교는 야간 경관 조명이 아름다워 광안리의 상징으로 불려요." },
    { q: "광안대교는 몇 년에 개통되었을까요?",
      options: ["1998년", "2003년", "2010년", "2015년"], answer: 1,
      fact: "2003년 개통된 국내 최초의 복층 해상 교량이에요." },
    { q: "광안대교가 국내 최초로 기록된 교량 형태는?",
      options: ["복층 해상 교량", "사장교 전용 도로", "지하 터널교", "목조 다리"], answer: 0,
      fact: "매일 다양한 색의 조명 연출이 진행되어 밤바다 분위기를 더해요." },

    { q: "잔디밭과 산책로가 잘 조성되어 현지인들의 나들이 장소로 유명한 이 공원은?",
      options: ["민락수변공원", "태종대", "이기대공원", "용두산공원"], answer: 0,
      fact: "민락수변공원은 광안리 동쪽에 자리한 넓은 수변 공원이에요." },
    { q: "민락수변공원에서 주말 저녁에 종종 열리는 것은?",
      options: ["불꽃놀이", "버스킹 공연", "야시장", "마라톤"], answer: 1,
      fact: "주말 저녁 버스킹 공연 시간에 맞춰 방문하면 더욱 즐거워요." },
    { q: "민락수변공원은 원래 무엇을 정비하여 조성되었을까요?",
      options: ["매립지", "폐철도 부지", "산비탈", "저수지"], answer: 0,
      fact: "매립지를 정비해 조성된 이후 대표 야경 산책 코스로 자리 잡았어요." },

    { q: "신선한 활어회와 바다 전망을 함께 즐길 수 있는 부산의 대표 상권은?",
      options: ["자갈치시장", "민락회센터", "국제시장", "부평시장"], answer: 1,
      fact: "민락회센터는 신선한 수산물을 맛보며 바다 전망을 즐길 수 있는 곳이에요." },
    { q: "민락회센터에서 야경을 함께 즐기려면 어떻게 하는 게 좋을까요?",
      options: ["1층에서 포장", "2층 이상 식당 이용", "주차장에서 관람", "새벽에 방문"], answer: 1,
      fact: "2층 이상 식당을 이용하면 식사와 함께 광안대교 야경을 감상할 수 있어요." },
    { q: "민락회센터는 오랜 기간 어떤 산업과 함께 발전해 왔을까요?",
      options: ["지역 어업", "조선업", "관광 숙박업", "섬유 산업"], answer: 0,
      fact: "지역 어업과 함께 발전해 온 상권으로, 지금은 관광객에게도 인기가 많아요." },

    { q: "백사장을 따라 이어지는 광안리의 대표 산책 코스는?",
      options: ["광안리 해변 산책로", "감천 문화마을길", "동백섬 둘레길", "황령산 등산로"], answer: 0,
      fact: "도보와 자전거 이용객 모두에게 인기가 많은 구간이에요." },
    { q: "광안리 해변 산책로가 야간에 사랑받는 이유는?",
      options: ["조명이 켜져서", "인적이 드물어서", "차량이 다녀서", "안개가 껴서"], answer: 0,
      fact: "밤에는 조명이 켜져 야간 산책 코스로도 인기가 많아요." },
    { q: "광안리 해변 산책로에서 추천하는 촬영 구도는?",
      options: ["난간과 바다를 대각선 구도로", "발밑만 클로즈업", "역광 무시하고 정면", "인물 없이 하늘만"], answer: 0,
      fact: "난간과 바다를 함께 담아 대각선 구도로 촬영하면 입체감이 생겨요." },

    { q: "광안리에서 조금 걸어 만나는 조용한 해변 공원은?",
      options: ["남천해변공원", "을숙도공원", "삼락생태공원", "장산공원"], answer: 0,
      fact: "남천동 방향으로 이어지는, 상대적으로 한적한 해변 공원이에요." },
    { q: "남천해변공원 인근은 봄철에 무엇과 바다를 함께 즐길 수 있을까요?",
      options: ["벚꽃", "단풍", "눈꽃", "유채꽃"], answer: 0,
      fact: "인근 삼익비치타운의 벚꽃길과 이어져 봄철 방문객이 많아요." },
    { q: "남천해변공원 방향은 광안리 중심가에 비해 분위기가 어떨까요?",
      options: ["더 혼잡함", "더 한적함", "동일함", "출입 통제됨"], answer: 1,
      fact: "여유롭게 산책하고 싶을 때 방문하기 좋은 구간이에요." },
  ];

  /* ---------------- 저장소 헬퍼 ---------------- */
  const store = {
    getNets() {
      return Number(localStorage.getItem(KEYS.nets) || "0");
    },
    setNets(n) {
      localStorage.setItem(KEYS.nets, String(Math.max(0, n)));
      updateNetBadge();
    },
    addNet(n = 1) {
      store.setNets(store.getNets() + n);
    },
    getCatches() {
      try {
        return JSON.parse(localStorage.getItem(KEYS.catches) || "{}");
      } catch {
        return {};
      }
    },
    addCatch(id) {
      const c = store.getCatches();
      c[id] = (c[id] || 0) + 1;
      localStorage.setItem(KEYS.catches, JSON.stringify(c));
    },
    getLastQuizIdx() {
      const v = localStorage.getItem(KEYS.lastQuiz);
      return v === null ? -1 : Number(v);
    },
    setLastQuizIdx(i) {
      localStorage.setItem(KEYS.lastQuiz, String(i));
    },
  };

  /* ---------------- 스타일 ---------------- */
  const style = document.createElement("style");
  style.textContent = `
    .gam-ext-hidden { display: none !important; }

    .gam-ext-fab {
      position: fixed;
      left: 16px;
      bottom: calc(20px + env(safe-area-inset-bottom));
      z-index: 320;
      width: 56px;
      height: 56px;
      border-radius: 999px;
      background: linear-gradient(135deg, #0ea5e9, #0891b2);
      box-shadow: 0 8px 20px rgba(8, 145, 178, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      border: none;
      cursor: pointer;
      color: #fff;
    }
    .gam-ext-fab .gam-ext-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 20px;
      height: 20px;
      padding: 0 5px;
      border-radius: 999px;
      background: #f59e0b;
      color: #1e293b;
      font-size: 11px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      border: 2px solid #0f172a;
    }

    .gam-ext-banner {
      position: fixed;
      top: calc(10px + env(safe-area-inset-top));
      left: 12px;
      right: 12px;
      z-index: 400;
      background: rgba(15, 23, 42, 0.94);
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 18px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      animation: gam-ext-slide-down 0.35s ease-out;
      font-family: system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif;
    }
    @keyframes gam-ext-slide-down {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .gam-ext-banner-icon {
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: 200% 200%;
      image-rendering: pixelated;
      animation: gam-ext-four-frame 0.72s step-end infinite;
    }
    .gam-ext-banner-text { flex: 1; min-width: 0; }
    .gam-ext-banner-title { color: #f1f5f9; font-size: 13px; font-weight: 700; }
    .gam-ext-banner-sub { color: #94a3b8; font-size: 11.5px; margin-top: 1px; }
    .gam-ext-banner-btn {
      flex: 0 0 auto;
      background: linear-gradient(135deg, #0ea5e9, #0891b2);
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
    }
    .gam-ext-banner-close {
      flex: 0 0 auto;
      background: transparent;
      border: none;
      color: #64748b;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
    }

    .gam-ext-overlay {
      position: fixed;
      inset: 0;
      z-index: 600;
      display: flex;
      align-items: flex-end;
      font-family: system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif;
    }
    .gam-ext-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.55);
    }
    .gam-ext-sheet {
      position: relative;
      margin: 0 auto;
      width: 100%;
      max-width: 460px;
      background: #0f172a;
      border-radius: 24px 24px 0 0;
      padding: 18px 18px calc(20px + env(safe-area-inset-bottom));
      box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
      animation: gam-ext-slide-up 0.28s ease-out;
      max-height: 88vh;
      overflow-y: auto;
    }
    @keyframes gam-ext-slide-up {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .gam-ext-handle {
      width: 40px;
      height: 5px;
      border-radius: 999px;
      background: #334155;
      margin: 0 auto 14px;
    }
    .gam-ext-close-x {
      position: absolute;
      right: 16px;
      top: 16px;
      background: #1e293b;
      border: none;
      color: #cbd5e1;
      width: 30px;
      height: 30px;
      border-radius: 999px;
      font-size: 15px;
      cursor: pointer;
    }
    .gam-ext-h1 { color: #f1f5f9; font-size: 17px; font-weight: 800; margin: 0 0 4px; }
    .gam-ext-sub { color: #94a3b8; font-size: 12.5px; margin: 0 0 14px; }

    .gam-ext-net-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e293b;
      border-radius: 14px;
      padding: 12px 14px;
      margin-bottom: 14px;
    }
    .gam-ext-net-count { color: #f1f5f9; font-weight: 800; font-size: 15px; }
    .gam-ext-net-count span { color: #38bdf8; }
    .gam-ext-primary-btn {
      width: 100%;
      background: linear-gradient(135deg, #0ea5e9, #0891b2);
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 13px;
      font-size: 14.5px;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .gam-ext-primary-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .gam-ext-secondary-btn {
      width: 100%;
      background: #1e293b;
      color: #cbd5e1;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 12px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
    }

    .gam-ext-log-title { color: #cbd5e1; font-size: 12.5px; font-weight: 700; margin: 16px 0 8px; }
    .gam-ext-log-empty { color: #64748b; font-size: 12.5px; padding: 10px 2px; }
    .gam-ext-log-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 4px;
      border-bottom: 1px solid #1e293b;
    }
    .gam-ext-log-emoji {
      width: 30px; height: 30px; border-radius: 999px;
      display: flex; align-items: center; justify-content: center; font-size: 16px;
    }
    .gam-ext-log-name { color: #e2e8f0; font-size: 13px; font-weight: 600; flex: 1; }
    .gam-ext-log-count { color: #64748b; font-size: 12px; }

    .gam-ext-q-text {
      color: #f1f5f9;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.5;
      margin-bottom: 14px;
    }
    .gam-ext-option {
      width: 100%;
      text-align: left;
      background: #1e293b;
      border: 1px solid #334155;
      color: #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 13.5px;
      margin-bottom: 8px;
      cursor: pointer;
    }
    .gam-ext-option.correct { background: rgba(16,185,129,0.18); border-color: #10b981; color: #6ee7b7; }
    .gam-ext-option.wrong { background: rgba(239,68,68,0.16); border-color: #ef4444; color: #fca5a5; }
    .gam-ext-option:disabled { cursor: default; }
    .gam-ext-feedback {
      font-size: 12.5px;
      color: #94a3b8;
      background: #1e293b;
      border-radius: 12px;
      padding: 10px 12px;
      margin: 6px 0 14px;
    }
    .gam-ext-reward-toast {
      position: fixed;
      left: 50%;
      top: 30%;
      transform: translate(-50%, -50%) scale(0.85);
      z-index: 700;
      background: rgba(15,23,42,0.95);
      border: 1px solid #38bdf8;
      color: #f1f5f9;
      padding: 16px 22px;
      border-radius: 18px;
      font-size: 15px;
      font-weight: 800;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      animation: gam-ext-pop 1.4s ease-out forwards;
      pointer-events: none;
    }
    @keyframes gam-ext-pop {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
      15% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
      25% { transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%, -60%) scale(1); }
    }

    .gam-ext-encounter-stage {
      position: relative;
      height: 220px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .gam-ext-encounter-monster {
      width: 130px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 62px;
      animation: gam-ext-float 2.2s ease-in-out infinite;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: 200% 200%;
      image-rendering: pixelated;
    }
    .gam-ext-encounter-monster.sheet {
      animation: gam-ext-float 2.2s ease-in-out infinite, gam-ext-four-frame 0.72s step-end infinite;
    }
    @keyframes gam-ext-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes gam-ext-four-frame {
      0%, 24.99% { background-position: 0 0; }
      25%, 49.99% { background-position: 100% 0; }
      50%, 74.99% { background-position: 0 100%; }
      75%, 100% { background-position: 100% 100%; }
    }
    .gam-ext-net-throw {
      position: absolute;
      font-size: 34px;
      left: 20px;
      bottom: 14px;
      animation: gam-ext-throw 0.55s ease-in forwards;
    }
    @keyframes gam-ext-throw {
      0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
      70% { transform: translate(90px, -80px) rotate(200deg) scale(1.1); opacity: 1; }
      100% { transform: translate(110px, -70px) rotate(240deg) scale(0.6); opacity: 0; }
    }
    .gam-ext-shake { animation: gam-ext-shake 0.5s ease-in-out; }
    @keyframes gam-ext-shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    .gam-ext-rarity-pill {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 9px;
      border-radius: 999px;
      background: rgba(15,23,42,0.55);
      color: #f1f5f9;
      border: 1px solid rgba(255,255,255,0.25);
    }
    .gam-ext-result-title { font-size: 17px; font-weight: 800; color: #f1f5f9; text-align: center; margin-bottom: 6px; }
    .gam-ext-result-sub { font-size: 12.5px; color: #94a3b8; text-align: center; margin-bottom: 16px; }
  `;
  document.head.appendChild(style);

  /* ---------------- 유틸 ---------------- */
  const monsterById = (id) => MONSTERS.find((m) => m.id === id);

  const pickWeightedMonster = () => {
    const total = MONSTERS.reduce((s, m) => s + RARITY_WEIGHT[m.rarity], 0);
    let r = Math.random() * total;
    for (const m of MONSTERS) {
      r -= RARITY_WEIGHT[m.rarity];
      if (r <= 0) return m;
    }
    return MONSTERS[0];
  };

  const monsterVisualStyle = (m) =>
    `background: linear-gradient(135deg, ${m.colorFrom}, ${m.colorTo});`;

  const monsterFaceHtml = (m, big) => {
    if (m.sheet) {
      const cls = big ? "gam-ext-encounter-monster sheet" : "gam-ext-banner-icon";
      return `<div class="${cls}" style="background-image:url('${m.sheet}')"></div>`;
    }
    const cls = big ? "gam-ext-encounter-monster" : "gam-ext-banner-icon";
    return `<div class="${cls}" style="${monsterVisualStyle(m)}">${m.emoji}</div>`;
  };

  /* ---------------- FAB + 뱃지 ---------------- */
  const fab = document.createElement("button");
  fab.className = "gam-ext-fab";
  fab.setAttribute("aria-label", "포획 도구");
  fab.innerHTML = `🥅<span class="gam-ext-badge" id="gam-ext-net-count">0</span>`;
  document.body.appendChild(fab);

  function updateNetBadge() {
    const el = document.getElementById("gam-ext-net-count");
    if (el) el.textContent = String(store.getNets());
  }
  updateNetBadge();

  fab.addEventListener("click", () => openToolsSheet());

  /* ---------------- 오버레이 공통 헬퍼 ---------------- */
  function closeOverlay(overlayEl) {
    overlayEl.remove();
  }

  function buildOverlay(innerHtml) {
    const overlay = document.createElement("div");
    overlay.className = "gam-ext-overlay";
    overlay.innerHTML = `
      <div class="gam-ext-backdrop"></div>
      <div class="gam-ext-sheet">
        <div class="gam-ext-handle"></div>
        <button class="gam-ext-close-x" aria-label="닫기">✕</button>
        ${innerHtml}
      </div>
    `;
    overlay.querySelector(".gam-ext-backdrop").addEventListener("click", () => closeOverlay(overlay));
    overlay.querySelector(".gam-ext-close-x").addEventListener("click", () => closeOverlay(overlay));
    document.body.appendChild(overlay);
    return overlay;
  }

  function showRewardToast(text) {
    const toast = document.createElement("div");
    toast.className = "gam-ext-reward-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1450);
  }

  /* ---------------- 포획 도구 시트 ---------------- */
  function openToolsSheet() {
    const catches = store.getCatches();
    const entries = Object.keys(catches);
    const logHtml = entries.length
      ? entries
          .map((id) => {
            const m = monsterById(id);
            if (!m) return "";
            const iconHtml = m.sheet
              ? `<div class="gam-ext-log-emoji" style="background-image:url('${m.sheet}');background-size:200% 200%;background-position:0 0;"></div>`
              : `<div class="gam-ext-log-emoji" style="${monsterVisualStyle(m)}">${m.emoji}</div>`;
            return `<div class="gam-ext-log-item">${iconHtml}<div class="gam-ext-log-name">${m.name}</div><div class="gam-ext-log-count">${catches[id]}마리 포획</div></div>`;
          })
          .join("")
      : `<div class="gam-ext-log-empty">아직 포획한 야생 몬스터가 없어요. 명소 퀴즈로 그물을 얻고 근처에 나타난 몬스터를 잡아보세요!</div>`;

    const overlay = buildOverlay(`
      <div class="gam-ext-h1">🥅 포획 도구</div>
      <div class="gam-ext-sub">명소 퀴즈를 풀면 그물을 얻고, 그물로 랜덤하게 나타나는 야생 몬스터를 포획할 수 있어요.</div>
      <div class="gam-ext-net-row">
        <div>보유 그물</div>
        <div class="gam-ext-net-count"><span>${store.getNets()}</span> 개</div>
      </div>
      <button class="gam-ext-primary-btn" id="gam-ext-open-quiz">📖 명소 퀴즈 풀고 그물 얻기</button>
      <div class="gam-ext-log-title">야생 포획 기록</div>
      ${logHtml}
    `);
    overlay.querySelector("#gam-ext-open-quiz").addEventListener("click", () => {
      closeOverlay(overlay);
      openQuiz();
    });
  }

  /* ---------------- 퀴즈 ---------------- */
  function pickQuestionIndex() {
    if (QUIZ.length <= 1) return 0;
    const last = store.getLastQuizIdx();
    let idx;
    do {
      idx = Math.floor(Math.random() * QUIZ.length);
    } while (idx === last);
    return idx;
  }

  function openQuiz() {
    const idx = pickQuestionIndex();
    const question = QUIZ[idx];
    store.setLastQuizIdx(idx);

    const overlay = buildOverlay(`
      <div class="gam-ext-h1">📖 광안리 명소 퀴즈</div>
      <div class="gam-ext-sub">정답을 맞히면 그물을 1개 드려요.</div>
      <div class="gam-ext-q-text">${question.q}</div>
      <div id="gam-ext-options"></div>
      <div class="gam-ext-feedback gam-ext-hidden" id="gam-ext-feedback"></div>
      <button class="gam-ext-primary-btn gam-ext-hidden" id="gam-ext-next">다른 문제 풀기</button>
      <button class="gam-ext-secondary-btn gam-ext-hidden" id="gam-ext-done">닫기</button>
    `);

    const optionsWrap = overlay.querySelector("#gam-ext-options");
    question.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "gam-ext-option";
      btn.textContent = opt;
      btn.addEventListener("click", () => answerQuiz(overlay, question, i));
      optionsWrap.appendChild(btn);
    });

    overlay.querySelector("#gam-ext-next").addEventListener("click", () => {
      closeOverlay(overlay);
      openQuiz();
    });
    overlay.querySelector("#gam-ext-done").addEventListener("click", () => closeOverlay(overlay));
  }

  function answerQuiz(overlay, question, chosenIdx) {
    const buttons = overlay.querySelectorAll(".gam-ext-option");
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === question.answer) b.classList.add("correct");
      else if (i === chosenIdx) b.classList.add("wrong");
    });

    const feedback = overlay.querySelector("#gam-ext-feedback");
    feedback.classList.remove("gam-ext-hidden");
    overlay.querySelector("#gam-ext-next").classList.remove("gam-ext-hidden");
    overlay.querySelector("#gam-ext-done").classList.remove("gam-ext-hidden");

    if (chosenIdx === question.answer) {
      store.addNet(1);
      feedback.textContent = `정답이에요! ${question.fact}`;
      showRewardToast(`🥅 그물 획득! (보유 ${store.getNets()}개)`);
    } else {
      feedback.textContent = `아쉬워요! 정답은 "${question.options[question.answer]}"예요. ${question.fact}`;
    }
  }

  /* ---------------- 야생 몬스터 랜덤 출현 ---------------- */
  let currentSpawn = null;
  let despawnTimer = null;
  let bannerEl = null;

  function scheduleNextSpawn(delay = 25000 + Math.random() * 35000) {
    setTimeout(trySpawn, delay);
  }

  function trySpawn() {
    if (currentSpawn || document.hidden) {
      scheduleNextSpawn(8000);
      return;
    }
    const monster = pickWeightedMonster();
    const spot = SPOT_NAMES[Math.floor(Math.random() * SPOT_NAMES.length)];
    currentSpawn = { monster, spot, spawnedAt: Date.now() };
    showBanner(currentSpawn);
    despawnTimer = setTimeout(() => {
      if (currentSpawn) {
        removeBanner();
        currentSpawn = null;
        scheduleNextSpawn();
      }
    }, 90000);
  }

  function showBanner(spawn) {
    removeBanner();
    bannerEl = document.createElement("div");
    bannerEl.className = "gam-ext-banner";
    bannerEl.innerHTML = `
      ${monsterFaceHtml(spawn.monster, false)}
      <div class="gam-ext-banner-text">
        <div class="gam-ext-banner-title">${spawn.monster.name}이(가) 근처에 나타났어요!</div>
        <div class="gam-ext-banner-sub">${spawn.spot} 부근 · ${RARITY_LABEL[spawn.monster.rarity]} 등급</div>
      </div>
      <button class="gam-ext-banner-btn">잡으러 가기</button>
      <button class="gam-ext-banner-close" aria-label="닫기">✕</button>
    `;
    bannerEl.querySelector(".gam-ext-banner-btn").addEventListener("click", () => openEncounter());
    bannerEl.querySelector(".gam-ext-banner-close").addEventListener("click", () => {
      removeBanner();
    });
    document.body.appendChild(bannerEl);
  }

  function removeBanner() {
    if (bannerEl) {
      bannerEl.remove();
      bannerEl = null;
    }
  }

  function resolveSpawnGone() {
    clearTimeout(despawnTimer);
    currentSpawn = null;
    removeBanner();
    scheduleNextSpawn();
  }

  function openEncounter() {
    if (!currentSpawn) return;
    const { monster, spot } = currentSpawn;
    const nets = store.getNets();
    removeBanner();

    const overlay = buildOverlay(`
      <div class="gam-ext-h1">${monster.name} 등장!</div>
      <div class="gam-ext-sub">${spot} 부근에 나타난 ${RARITY_LABEL[monster.rarity]} 등급 몬스터예요.</div>
      <div class="gam-ext-encounter-stage" style="background: radial-gradient(circle at 50% 35%, ${monster.colorFrom}33, #0f172a 75%);" id="gam-ext-stage">
        <div class="gam-ext-rarity-pill">${RARITY_LABEL[monster.rarity]}</div>
        ${monsterFaceHtml(monster, true)}
      </div>
      <div class="gam-ext-net-row">
        <div>보유 그물</div>
        <div class="gam-ext-net-count"><span id="gam-ext-enc-nets">${nets}</span> 개</div>
      </div>
      <button class="gam-ext-primary-btn" id="gam-ext-throw" ${nets <= 0 ? "disabled" : ""}>
        🥅 그물 던지기
      </button>
      <div class="gam-ext-feedback gam-ext-hidden" id="gam-ext-enc-feedback"></div>
      ${nets <= 0 ? `<button class="gam-ext-secondary-btn" id="gam-ext-goto-quiz">그물이 없어요 · 퀴즈 풀러 가기</button>` : ""}
    `);

    const gotoQuizBtn = overlay.querySelector("#gam-ext-goto-quiz");
    if (gotoQuizBtn) {
      gotoQuizBtn.addEventListener("click", () => {
        closeOverlay(overlay);
        openQuiz();
      });
    }

    overlay.querySelector("#gam-ext-throw").addEventListener("click", () => {
      throwNet(overlay, monster);
    });

    // X버튼/배경 클릭으로 그냥 나가면, 몬스터가 아직 야생에 남아있는 경우
    // 배너를 다시 띄워 남은 시간 동안 재도전할 수 있게 합니다.
    const reshowIfStillWild = () => {
      if (currentSpawn && currentSpawn.monster.id === monster.id) {
        showBanner(currentSpawn);
      }
    };
    overlay.querySelector(".gam-ext-backdrop").addEventListener("click", reshowIfStillWild);
    overlay.querySelector(".gam-ext-close-x").addEventListener("click", reshowIfStillWild);
  }

  function throwNet(overlay, monster) {
    const throwBtn = overlay.querySelector("#gam-ext-throw");
    if (store.getNets() <= 0) return;
    throwBtn.disabled = true;

    store.setNets(store.getNets() - 1);
    const enc = overlay.querySelector("#gam-ext-enc-nets");
    if (enc) enc.textContent = String(store.getNets());

    const stage = overlay.querySelector("#gam-ext-stage");
    const netFly = document.createElement("div");
    netFly.className = "gam-ext-net-throw";
    netFly.textContent = "🥅";
    stage.appendChild(netFly);

    setTimeout(() => {
      netFly.remove();
      const success = Math.random() < RARITY_CATCH_RATE[monster.rarity];
      if (success) {
        store.addCatch(monster.id);
        clearTimeout(despawnTimer);
        currentSpawn = null;
        scheduleNextSpawn();
        showResult(overlay, monster, true);
      } else {
        stage.classList.add("gam-ext-shake");
        setTimeout(() => stage.classList.remove("gam-ext-shake"), 500);
        showResult(overlay, monster, false);
      }
    }, 600);
  }

  function showResult(overlay, monster, success) {
    const feedback = overlay.querySelector("#gam-ext-enc-feedback");
    const throwBtn = overlay.querySelector("#gam-ext-throw");
    const nets = store.getNets();

    if (success) {
      feedback.classList.remove("gam-ext-hidden");
      feedback.innerHTML = `<div class="gam-ext-result-title">🎉 수집 성공!</div><div class="gam-ext-result-sub">${monster.name}을(를) 포획했어요. 포획 기록에서 확인해보세요.</div>`;
      throwBtn.remove();
      const goto = overlay.querySelector("#gam-ext-goto-quiz");
      if (goto) goto.remove();
      const closeBtn = document.createElement("button");
      closeBtn.className = "gam-ext-primary-btn";
      closeBtn.textContent = "확인";
      closeBtn.addEventListener("click", () => closeOverlay(overlay));
      feedback.after(closeBtn);
    } else {
      feedback.classList.remove("gam-ext-hidden");
      feedback.innerHTML = `<div class="gam-ext-result-title">아깝다!</div><div class="gam-ext-result-sub">${monster.name}이(가) 그물을 피해 도망쳤어요.</div>`;
      if (nets > 0) {
        throwBtn.disabled = false;
        throwBtn.textContent = "🥅 다시 그물 던지기";
      } else {
        throwBtn.remove();
        const goto = overlay.querySelector("#gam-ext-goto-quiz");
        if (!goto) {
          const q = document.createElement("button");
          q.className = "gam-ext-secondary-btn";
          q.textContent = "그물이 없어요 · 퀴즈 풀러 가기";
          q.addEventListener("click", () => {
            closeOverlay(overlay);
            openQuiz();
          });
          feedback.after(q);
        }
      }
    }
  }

  /* ---------------- 시작 ---------------- */
  scheduleNextSpawn(10000 + Math.random() * 10000);
})();
