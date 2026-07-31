(() => {
  "use strict";

  const STORAGE_KEY = "gam_capture_inventory_v2";
  const OLD_COLLECTION_KEY = "gam_collected_monsters";
  const SPAWN_LIFETIME = 150000;
  const rarityLabels = {
    common: "흔함",
    uncommon: "고급",
    rare: "희귀",
    legendary: "전설",
  };

  const monsters = [
    {
      id: "m1",
      name: "윈드갈",
      species: "바람 갈매기",
      rarity: "common",
      emoji: "🕊️",
      sheet: "./images/monsters/windgal-flying-sheet.png",
      feature: "갈매기의 날갯짓에서 태어난 바람의 정령으로, 산들바람을 몰고 다닙니다.",
    },
    {
      id: "m2",
      name: "루미젤",
      species: "빛 해파리",
      rarity: "uncommon",
      emoji: "🎐",
      sheet: "./images/monsters/lumizel-floating-sheet.png",
      feature: "몸속에 은은한 빛을 품고 있어 어두워질수록 아름답게 빛납니다.",
    },
    {
      id: "m3",
      name: "먹물이",
      species: "장난꾸러기 문어",
      rarity: "common",
      emoji: "🐙",
      sheet: "./images/monsters/meokmuri-waving-sheet.png",
      feature: "호기심이 많고 사람을 만나면 여러 다리를 흔들며 인사를 건넵니다.",
    },
    {
      id: "m4",
      name: "철갑이",
      species: "방패 꽃게",
      rarity: "uncommon",
      emoji: "🦀",
      sheet: "./images/monsters/cheolgap-guard-sheet.png",
      feature: "단단한 등딱지로 몸을 지키며, 위협을 느끼면 집게를 높이 들어 올립니다.",
    },
    {
      id: "m5",
      name: "뽀글이",
      species: "겁쟁이 복어",
      rarity: "common",
      emoji: "🐡",
      sheet: "./images/monsters/ppogeuli-swimming-sheet.png",
      feature: "작은 소리에도 깜짝 놀라 몸을 동그랗고 크게 부풀립니다.",
    },
    {
      id: "m6",
      name: "아라",
      species: "신비 돌고래",
      rarity: "rare",
      emoji: "🐬",
      sheet: "./images/monsters/ara-swimming-sheet.png",
      feature: "광안리 앞바다에 드물게 나타나며 매끄럽고 빠른 몸놀림이 특징입니다.",
    },
    {
      id: "m7",
      name: "별밤이",
      species: "야광 불가사리",
      rarity: "rare",
      emoji: "⭐",
      feature: "낮에는 모래 속에 숨어 있다가 밤이 되면 별처럼 반짝입니다.",
    },
    {
      id: "m8",
      name: "해랑",
      species: "파도의 정령",
      rarity: "legendary",
      emoji: "🌊",
      feature: "광안리의 파도와 물방울이 모여 만들어졌다는 전설의 바다 정령입니다.",
    },
  ];

  const quizzes = [
    {
      id: "s1",
      name: "광안리해수욕장",
      question: "광안리해수욕장에서 바다 건너 가장 잘 보이는 부산의 대표 구조물은?",
      choices: ["광안대교", "부산타워", "영도대교"],
      answer: 0,
    },
    {
      id: "s2",
      name: "광안대교 전망 지점",
      question: "광안대교의 야간 경관을 더욱 돋보이게 하는 것은?",
      choices: ["경관 조명", "풍차", "케이블카"],
      answer: 0,
    },
    {
      id: "s3",
      name: "민락수변공원",
      question: "민락수변공원에서 가까이 즐길 수 있는 자연 경관은?",
      choices: ["바다와 해안", "설산", "사막"],
      answer: 0,
    },
    {
      id: "s4",
      name: "민락회센터 인근",
      question: "민락회센터 일대의 대표적인 먹거리는?",
      choices: ["신선한 해산물", "산채 비빔밥", "목장 치즈"],
      answer: 0,
    },
    {
      id: "s5",
      name: "광안리 해변 산책로",
      question: "해변 산책로를 안전하게 이용하는 방법은?",
      choices: ["보행로를 따라 걷기", "차도로 걷기", "휴대폰만 보며 걷기"],
      answer: 0,
    },
    {
      id: "s6",
      name: "남천해변공원 방향",
      question: "남천해변공원 방향 산책에서 이어지는 풍경은?",
      choices: ["광안리 해안선", "고원 초원", "화산 분화구"],
      answer: 0,
    },
  ];

  const state = loadState();
  const activeSpawns = [];
  let spawnLayer = null;
  let toastTimer = null;
  let spawnTimer = null;

  function defaultState() {
    return { nets: 0, captures: [], awardedSpots: [], migrated: false };
  }

  function loadState() {
    try {
      return { ...defaultState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch (_) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderHud();
  }

  function migrateExistingCaptures() {
    if (state.migrated) return;
    try {
      const oldCaptures = JSON.parse(localStorage.getItem(OLD_COLLECTION_KEY) || "[]");
      oldCaptures.forEach((old, index) => {
        const monster = monsters.find((item) => item.id === old.monsterId);
        if (!monster) return;
        state.captures.push({
          id: `legacy-${old.monsterId}-${index}`,
          monsterId: old.monsterId,
          caughtAt: old.collectedAt || new Date().toISOString(),
          location: "광안리 일대",
          latitude: null,
          longitude: null,
          migrated: true,
        });
      });
    } catch (_) {
      // 기존 기록을 읽지 못해도 새 인벤토리는 정상 동작합니다.
    }
    state.migrated = true;
    saveState();
  }

  function visualMarkup(monster, extraClass = "") {
    if (monster.sheet) {
      return `<span class="wild-visual ${extraClass}" style="background-image:url('${monster.sheet}')" role="img" aria-label="${monster.name}"></span>`;
    }
    return `<span class="wild-visual wild-emoji ${extraClass}" role="img" aria-label="${monster.name}">${monster.emoji}</span>`;
  }

  function weightedMonster() {
    const roll = Math.random();
    const pool =
      roll < 0.52
        ? monsters.filter((monster) => monster.rarity === "common")
        : roll < 0.8
          ? monsters.filter((monster) => monster.rarity === "uncommon")
          : roll < 0.97
            ? monsters.filter((monster) => monster.rarity === "rare")
            : monsters.filter((monster) => monster.rarity === "legendary");
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function visibleMap() {
    const map = document.querySelector(".leaflet-container");
    return map && map.getBoundingClientRect().height > 100 ? map : null;
  }

  function ensureSpawnLayer() {
    const map = visibleMap();
    if (!map) {
      spawnLayer = null;
      return null;
    }
    if (spawnLayer && spawnLayer.isConnected && spawnLayer.parentElement === map) return spawnLayer;
    spawnLayer = document.createElement("div");
    spawnLayer.className = "wild-spawn-layer";
    spawnLayer.setAttribute("aria-label", "야생 생물 출현 영역");
    map.appendChild(spawnLayer);
    renderSpawns();
    return spawnLayer;
  }

  function suppressFixedMonsterMarkers() {
    const monsterEmoji = ["🐦", "🎐", "🐙", "🦀", "🐡", "🐬", "✨", "🌊"];
    document.querySelectorAll(".leaflet-marker-pane > *").forEach((marker) => {
      const isMonster =
        marker.querySelector(".windgal-flight, .user-monster-sprite") ||
        monsterEmoji.some((emoji) => marker.textContent.includes(emoji));
      if (isMonster) {
        marker.classList.add("legacy-monster-marker");
        marker.setAttribute("aria-hidden", "true");
      }
    });
  }

  function createSpawn() {
    if (!ensureSpawnLayer() || activeSpawns.length >= 3) return;
    const monster = weightedMonster();
    activeSpawns.push({
      id: `spawn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      monsterId: monster.id,
      left: 14 + Math.random() * 72,
      top: 22 + Math.random() * 55,
      expiresAt: Date.now() + SPAWN_LIFETIME,
    });
    renderSpawns();
  }

  function renderSpawns() {
    if (!spawnLayer || !spawnLayer.isConnected) return;
    const now = Date.now();
    for (let index = activeSpawns.length - 1; index >= 0; index -= 1) {
      if (activeSpawns[index].expiresAt <= now) activeSpawns.splice(index, 1);
    }
    spawnLayer.innerHTML = activeSpawns
      .map((spawn) => {
        const monster = monsters.find((item) => item.id === spawn.monsterId);
        const seconds = Math.max(0, Math.ceil((spawn.expiresAt - now) / 1000));
        return `
          <button class="wild-creature" style="left:${spawn.left}%;top:${spawn.top}%"
            data-spawn-id="${spawn.id}" aria-label="야생 ${monster.name} 포획하기">
            ${visualMarkup(monster)}
            <span class="wild-timer">${seconds}초</span>
          </button>`;
      })
      .join("");
  }

  function scheduleSpawn() {
    clearTimeout(spawnTimer);
    const delay = activeSpawns.length ? 22000 + Math.random() * 26000 : 4500;
    spawnTimer = setTimeout(() => {
      createSpawn();
      scheduleSpawn();
    }, delay);
  }

  function removeSpawn(id) {
    const index = activeSpawns.findIndex((spawn) => spawn.id === id);
    if (index >= 0) activeSpawns.splice(index, 1);
    renderSpawns();
  }

  function modal(content) {
    document.querySelector(".net-modal")?.remove();
    const overlay = document.createElement("div");
    overlay.className = "net-modal";
    overlay.innerHTML = `<div class="net-dialog" role="dialog" aria-modal="true">${content}</div>`;
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay || event.target.closest("[data-net-close]")) overlay.remove();
    });
    document.body.appendChild(overlay);
    overlay.querySelector("button")?.focus();
    return overlay;
  }

  function openEncounter(spawnId) {
    const spawn = activeSpawns.find((item) => item.id === spawnId);
    if (!spawn) return;
    const monster = monsters.find((item) => item.id === spawn.monsterId);
    const overlay = modal(`
      <div class="net-dialog-top">
        <div>
          <p class="net-kicker">야생 생물 발견</p>
          <h2>${monster.name}</h2>
          <span class="rarity-chip">${monster.species} · ${rarityLabels[monster.rarity]}</span>
        </div>
        <button class="net-close" data-net-close aria-label="닫기">×</button>
      </div>
      <div class="encounter-visual">${visualMarkup(monster)}</div>
      <p class="net-help">그물을 던지면 1개가 소모됩니다. 희귀한 생물일수록 빠져나갈 가능성이 높아요.</p>
      <button class="net-primary" data-capture ${state.nets < 1 ? "disabled" : ""}>
        🥅 그물 던지기 · 보유 ${state.nets}개
      </button>
      ${state.nets < 1 ? '<button class="net-secondary" data-net-close>명소 퀴즈에서 그물 얻기</button>' : ""}
    `);
    overlay.querySelector("[data-capture]")?.addEventListener("click", () => capture(spawn, monster, overlay));
  }

  function capture(spawn, monster, overlay) {
    if (state.nets < 1) return;
    state.nets -= 1;
    const chances = { common: 0.92, uncommon: 0.78, rare: 0.6, legendary: 0.38 };
    const success = Math.random() < chances[monster.rarity];
    removeSpawn(spawn.id);

    if (!success) {
      saveState();
      overlay.querySelector(".net-dialog").innerHTML = `
        <p class="net-kicker">포획 실패</p>
        <h2>${monster.name}이(가) 빠져나갔어요</h2>
        <div class="encounter-visual">${visualMarkup(monster)}</div>
        <p class="net-help">야생 생물은 달아났지만 곧 다른 생물이 지도에 나타날 거예요.</p>
        <button class="net-primary" data-net-close>지도로 돌아가기</button>`;
      return;
    }

    getCapturePosition().then((position) => {
      state.captures.unshift({
        id: `capture-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        monsterId: monster.id,
        caughtAt: new Date().toISOString(),
        location: position.location,
        latitude: position.latitude,
        longitude: position.longitude,
      });
      saveState();
      overlay.querySelector(".net-dialog").innerHTML = `
        <p class="net-kicker">포획 성공</p>
        <h2>${monster.name}을(를) 인벤토리에 담았어요!</h2>
        <div class="encounter-visual">${visualMarkup(monster)}</div>
        <p class="capture-place">📍 ${position.location}<br>🕐 ${formatDate(new Date().toISOString())}</p>
        <button class="net-primary" data-open-inventory>인벤토리 확인</button>
        <button class="net-secondary" data-net-close>계속 탐험하기</button>`;
      overlay.querySelector("[data-open-inventory]").addEventListener("click", () => {
        overlay.remove();
        openInventory();
      });
    });
  }

  function getCapturePosition() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ location: "광안리 일대", latitude: null, longitude: null });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const closest = nearestLandmark(coords.latitude, coords.longitude);
          resolve({
            location: closest ? `${closest.name} 인근` : "광안리 일대",
            latitude: Number(coords.latitude.toFixed(5)),
            longitude: Number(coords.longitude.toFixed(5)),
          });
        },
        () => resolve({ location: "광안리 일대", latitude: null, longitude: null }),
        { enableHighAccuracy: true, timeout: 3500, maximumAge: 30000 }
      );
    });
  }

  function nearestLandmark(latitude, longitude) {
    const locations = [
      { name: "광안리해수욕장", latitude: 35.1532, longitude: 129.1187 },
      { name: "광안대교 전망 지점", latitude: 35.1544, longitude: 129.1213 },
      { name: "민락수변공원", latitude: 35.1576, longitude: 129.1249 },
      { name: "민락회센터", latitude: 35.1567, longitude: 129.1245 },
      { name: "남천해변공원", latitude: 35.15, longitude: 129.1158 },
    ];
    return locations
      .map((place) => ({
        ...place,
        distance: Math.hypot(latitude - place.latitude, longitude - place.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)[0];
  }

  function enhanceNavigation() {
    document.querySelectorAll("nav button").forEach((button) => {
      const label = button.textContent.trim();
      if (label === "도감") {
        const textNode = [...button.childNodes].find(
          (node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === "도감"
        );
        if (textNode) textNode.nodeValue = "인벤토리";
      }
    });
  }

  function enhanceSpotModals() {
    document.querySelectorAll("h2").forEach((heading) => {
      if (heading.textContent.trim() !== "장소 설명") return;
      let container = heading.parentElement;
      while (container && !container.className?.toString().includes("overflow-y-auto")) {
        container = container.parentElement;
      }
      if (!container || container.querySelector("[data-net-quiz-wrap]")) return;
      const quiz = quizzes.find((item) => container.textContent.includes(item.name));
      if (!quiz) return;
      const earned = state.awardedSpots.includes(quiz.id);
      const wrap = document.createElement("section");
      wrap.className = "spot-quiz-wrap";
      wrap.dataset.netQuizWrap = quiz.id;
      wrap.innerHTML = `
        <p>${earned ? "이 명소의 그물을 이미 획득했어요." : "명소 퀴즈를 맞히고 포획용 그물 1개를 받으세요."}</p>
        <button class="spot-quiz-button ${earned ? "is-earned" : ""}" data-quiz-id="${quiz.id}" ${earned ? "disabled" : ""}>
          ${earned ? "✓ 그물 획득 완료" : "🥅 명소 퀴즈 풀기"}
        </button>`;
      container.appendChild(wrap);
    });
  }

  function openQuiz(quizId) {
    const quiz = quizzes.find((item) => item.id === quizId);
    if (!quiz || state.awardedSpots.includes(quiz.id)) return;
    const overlay = modal(`
      <div class="net-dialog-top">
        <div><p class="net-kicker">명소 퀴즈</p><h2>${quiz.name}</h2></div>
        <button class="net-close" data-net-close aria-label="닫기">×</button>
      </div>
      <p>${quiz.question}</p>
      <div data-quiz-choices>
        ${quiz.choices.map((choice, index) => `<button class="quiz-choice" data-choice="${index}">${index + 1}. ${choice}</button>`).join("")}
      </div>
    `);
    overlay.querySelector("[data-quiz-choices]").addEventListener("click", (event) => {
      const choice = event.target.closest("[data-choice]");
      if (!choice) return;
      if (Number(choice.dataset.choice) !== quiz.answer) {
        showToast("아쉬워요! 명소 설명을 살펴보고 다시 골라보세요.");
        choice.style.background = "#7f1d1d";
        return;
      }
      state.nets += 1;
      state.awardedSpots.push(quiz.id);
      saveState();
      overlay.querySelector(".net-dialog").innerHTML = `
        <p class="net-kicker">정답!</p>
        <h2>그물 1개를 획득했어요 🥅</h2>
        <p class="net-help">${quiz.name}에 대해 알아본 보상이에요. 지도에 나타난 생물을 포획해보세요.</p>
        <button class="net-primary" data-net-close>탐험 계속하기</button>`;
      showToast("그물 1개 획득! 야생 생물을 찾아보세요.");
    });
  }

  function openInventory() {
    document.querySelector(".inventory-screen")?.remove();
    const screen = document.createElement("div");
    screen.className = "inventory-screen";
    screen.innerHTML = `
      <main class="inventory-inner">
        <header class="inventory-header">
          <button class="inventory-back" data-inventory-close aria-label="인벤토리 닫기">←</button>
          <div>
            <p class="net-kicker">MY CREATURES</p>
            <h1>생물 인벤토리</h1>
          </div>
        </header>
        <div class="inventory-summary">
          <div class="summary-card"><strong>${state.captures.length}</strong><span>보관 중인 생물</span></div>
          <div class="summary-card"><strong>${state.nets}</strong><span>보유한 그물</span></div>
        </div>
        <section class="inventory-grid" aria-label="포획한 생물 목록">
          ${
            state.captures.length
              ? state.captures.map(inventoryCard).join("")
              : `<div class="inventory-empty"><div style="font-size:44px">🥅</div><strong>아직 포획한 생물이 없어요</strong><p>명소 퀴즈에서 그물을 얻고<br>지도에 나타난 생물을 포획해보세요.</p></div>`
          }
        </section>
      </main>`;
    screen.addEventListener("click", (event) => {
      if (event.target.closest("[data-inventory-close]")) screen.remove();
      const card = event.target.closest("[data-capture-id]");
      if (card) openCaptureDetail(card.dataset.captureId);
    });
    document.body.appendChild(screen);
    screen.querySelector("[data-inventory-close]")?.focus();
  }

  function inventoryCard(capture) {
    const monster = monsters.find((item) => item.id === capture.monsterId);
    if (!monster) return "";
    return `
      <button class="inventory-card" data-capture-id="${capture.id}">
        <span class="inventory-card-visual">${visualMarkup(monster)}</span>
        <strong>${monster.name}</strong>
        <small>${monster.species} · ${rarityLabels[monster.rarity]}</small>
        <small>📍 ${capture.location}</small>
        <small>🕐 ${formatDate(capture.caughtAt)}</small>
      </button>`;
  }

  function openCaptureDetail(captureId) {
    const capture = state.captures.find((item) => item.id === captureId);
    const monster = capture && monsters.find((item) => item.id === capture.monsterId);
    if (!capture || !monster) return;
    modal(`
      <div class="net-dialog-top">
        <div>
          <p class="net-kicker">인벤토리 생물 정보</p>
          <h2>${monster.name}</h2>
          <span class="rarity-chip">${monster.species} · ${rarityLabels[monster.rarity]}</span>
        </div>
        <button class="net-close" data-net-close aria-label="닫기">×</button>
      </div>
      <div class="encounter-visual">${visualMarkup(monster)}</div>
      <p>${monster.feature}</p>
      <div class="detail-meta">
        <div><span>획득 위치</span><strong>${capture.location}</strong></div>
        <div><span>획득 시간</span><strong>${formatDate(capture.caughtAt)}</strong></div>
      </div>
      ${
        capture.latitude
          ? `<p class="capture-place">위치 좌표 ${capture.latitude}, ${capture.longitude}</p>`
          : ""
      }
      <button class="net-primary" data-net-close>인벤토리로 돌아가기</button>
    `);
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  function ensureHud() {
    if (document.querySelector(".net-hud")) return;
    const hud = document.createElement("button");
    hud.className = "net-hud";
    hud.type = "button";
    hud.addEventListener("click", openInventory);
    document.body.appendChild(hud);
    renderHud();
  }

  function renderHud() {
    const hud = document.querySelector(".net-hud");
    if (!hud) return;
    hud.innerHTML = `<span>🥅 ${state.nets}</span><span>·</span><span>🎒 ${state.captures.length}</span>`;
    hud.setAttribute("aria-label", `그물 ${state.nets}개, 포획 생물 ${state.captures.length}마리. 인벤토리 열기`);
    hud.classList.toggle("is-visible", Boolean(visibleMap()));
  }

  function showToast(message) {
    document.querySelector(".net-toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "net-toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.remove(), 3000);
  }

  document.addEventListener(
    "click",
    (event) => {
      const spawnButton = event.target.closest("[data-spawn-id]");
      if (spawnButton) {
        event.preventDefault();
        event.stopPropagation();
        openEncounter(spawnButton.dataset.spawnId);
        return;
      }

      const quizButton = event.target.closest("[data-quiz-id]");
      if (quizButton) {
        event.preventDefault();
        event.stopPropagation();
        openQuiz(quizButton.dataset.quizId);
        return;
      }

      const navButton = event.target.closest("nav button");
      if (navButton && ["도감", "인벤토리"].includes(navButton.textContent.trim())) {
        event.preventDefault();
        event.stopPropagation();
        openInventory();
      }
    },
    true
  );

  const observer = new MutationObserver(() => {
    ensureSpawnLayer();
    suppressFixedMonsterMarkers();
    enhanceNavigation();
    enhanceSpotModals();
    renderHud();
  });

  migrateExistingCaptures();
  ensureHud();
  ensureSpawnLayer();
  suppressFixedMonsterMarkers();
  enhanceNavigation();
  enhanceSpotModals();
  observer.observe(document.body, { childList: true, subtree: true });
  scheduleSpawn();
  setInterval(renderSpawns, 1000);
})();
