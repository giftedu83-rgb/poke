(() => {
  const monsters = {
    루미젤: {
      id: "m2",
      marker: "🎐",
      sheet: "./images/monsters/lumizel-floating-sheet.png",
    },
    먹물이: {
      id: "m3",
      marker: "🐙",
      sheet: "./images/monsters/meokmuri-waving-sheet.png",
    },
    철갑이: {
      id: "m4",
      marker: "🦀",
      sheet: "./images/monsters/cheolgap-guard-sheet.png",
    },
    뽀글이: {
      id: "m5",
      marker: "🐡",
      sheet: "./images/monsters/ppogeuli-swimming-sheet.png",
    },
    아라: {
      id: "m6",
      marker: "🐬",
      sheet: "./images/monsters/ara-swimming-sheet.png",
    },
  };

  const style = document.createElement("style");
  style.textContent = `
    .user-monster-sprite {
      display: inline-block;
      flex: 0 0 auto;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: 200% 200%;
      image-rendering: pixelated;
      animation: user-monster-four-frame 0.72s step-end infinite;
    }
    ${Object.values(monsters)
      .map(
        ({ id, sheet }) =>
          `.user-monster-${id}{background-image:url("${sheet}")}`
      )
      .join("")}
    @keyframes user-monster-four-frame {
      0%, 24.99% { background-position: 0 0; }
      25%, 49.99% { background-position: 100% 0; }
      50%, 74.99% { background-position: 0 100%; }
      75%, 100% { background-position: 100% 100%; }
    }
  `;
  document.head.appendChild(style);

  const createSprite = (monster, width, height, extraClass = "") => {
    const sprite = document.createElement("span");
    sprite.className =
      `user-monster-sprite user-monster-${monster.id} ${extraClass}`.trim();
    sprite.style.width = `${width}px`;
    sprite.style.height = `${height}px`;
    sprite.setAttribute("role", "img");
    return sprite;
  };

  const decorateIllustrations = () => {
    for (const [name, monster] of Object.entries(monsters)) {
      const selector = `[aria-label="${name}"]:not([data-user-sprite-ready])`;
      for (const illustration of document.querySelectorAll(selector)) {
        if (illustration.classList.contains("user-monster-sprite")) {
          continue;
        }

        const width =
          Number(illustration.getAttribute("width")) ||
          illustration.getBoundingClientRect().width ||
          120;
        const height =
          Number(illustration.getAttribute("height")) ||
          illustration.getBoundingClientRect().height ||
          width;
        const sprite = createSprite(
          monster,
          width,
          height,
          illustration.getAttribute("class") || ""
        );
        sprite.setAttribute("aria-label", name);
        sprite.dataset.userSpriteReady = "true";
        illustration.style.display = "none";
        illustration.dataset.userSpriteReady = "true";
        illustration.insertAdjacentElement("afterend", sprite);
      }
    }
  };

  const decorateMapMarkers = () => {
    const markerPane = document.querySelector(".leaflet-marker-pane");
    if (!markerPane) return;

    const markerByEmoji = new Map(
      Object.values(monsters).map((monster) => [monster.marker, monster])
    );
    const walker = document.createTreeWalker(
      markerPane,
      NodeFilter.SHOW_TEXT
    );
    const matches = [];
    while (walker.nextNode()) {
      const value = walker.currentNode.nodeValue.trim();
      if (markerByEmoji.has(value)) {
        matches.push([walker.currentNode, markerByEmoji.get(value)]);
      }
    }

    for (const [textNode, monster] of matches) {
      const parent = textNode.parentElement;
      if (!parent || parent.dataset.userSpriteReady) continue;
      textNode.nodeValue = "";
      const sprite = createSprite(monster, 36, 36);
      sprite.setAttribute("aria-hidden", "true");
      parent.appendChild(sprite);
      parent.dataset.userSpriteReady = "true";
    }
  };

  let scheduled = false;
  const refresh = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      decorateIllustrations();
      decorateMapMarkers();
    });
  };

  new MutationObserver(refresh).observe(document.body, {
    childList: true,
    subtree: true,
  });
  refresh();
})();
