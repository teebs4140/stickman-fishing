function startGame() {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  const castButton = document.getElementById("cast-btn");
  const reelButton = document.getElementById("reel-btn");
  const upgradeButton = document.getElementById("upgrade-btn");
  const toggleCollectionButton = document.getElementById("toggle-collection-btn");
  const closeCollectionButton = document.getElementById("close-collection-btn");
  const statusText = document.getElementById("status-text");
  const coinsValue = document.getElementById("coins-value");
  const baitLevelLabel = document.getElementById("bait-level");
  const collectionPanel = document.getElementById("collection-panel");
  const collectionList = document.getElementById("collection-list");
  const catchOverlay = document.getElementById("catch-overlay");
  const catchImage = document.getElementById("catch-image");
  const catchName = document.getElementById("catch-name");
  const catchStats = document.getElementById("catch-stats");
  const closeCatchBtn = document.getElementById("close-catch-btn");
  const sellCatchBtn = document.getElementById("sell-fish-btn");

  if (
    !canvas ||
    !ctx ||
    !castButton ||
    !reelButton ||
    !upgradeButton ||
    !toggleCollectionButton ||
    !closeCollectionButton ||
    !statusText ||
    !coinsValue ||
    !baitLevelLabel ||
    !collectionPanel ||
    !collectionList ||
    !catchOverlay ||
    !catchImage ||
    !catchName ||
    !catchStats ||
    !closeCatchBtn ||
    !sellCatchBtn
  ) {
    console.error("Fishing game failed to initialize: missing required DOM nodes.");
    return;
  }

  const CONFIG = {
    waterline: canvas.height * 0.45,
    castDurationMs: 1100,
    reelDurationMs: 900,
    idleBobberRange: 6,
    hookedBobberRange: 16,
    hookDelayRangeMs: [2200, 5200],
  };

  const RARITY_ORDER = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];

  const FISH_POOL = [
    { id: "minnow", name: "Lively Minnow", rarity: "Common", baseValue: 5, minBait: 1, lengthRange: [18, 26] },
    { id: "sunny", name: "Sunny Sunfish", rarity: "Common", baseValue: 7, minBait: 1, lengthRange: [20, 30] },
    { id: "perch", name: "Yellow Perch", rarity: "Common", baseValue: 9, minBait: 1, lengthRange: [22, 34] },
    { id: "bass", name: "River Bass", rarity: "Uncommon", baseValue: 14, minBait: 1, lengthRange: [30, 52] },
    { id: "catfish", name: "Mudcat", rarity: "Uncommon", baseValue: 18, minBait: 2, lengthRange: [40, 70] },
    { id: "pike", name: "Needle Pike", rarity: "Uncommon", baseValue: 22, minBait: 2, lengthRange: [55, 85] },
    { id: "koi", name: "Glowing Koi", rarity: "Rare", baseValue: 32, minBait: 2, lengthRange: [45, 68] },
    { id: "salmon", name: "Silver Salmon", rarity: "Rare", baseValue: 40, minBait: 3, lengthRange: [60, 88] },
    { id: "eel", name: "Storm Eel", rarity: "Rare", baseValue: 55, minBait: 3, lengthRange: [75, 110] },
    { id: "angler", name: "Glimmer Angler", rarity: "Epic", baseValue: 75, minBait: 3, lengthRange: [40, 65] },
    { id: "swordfish", name: "Azure Swordfish", rarity: "Epic", baseValue: 95, minBait: 4, lengthRange: [90, 140] },
    { id: "dragonfin", name: "Dragonfin Carp", rarity: "Epic", baseValue: 115, minBait: 4, lengthRange: [65, 100] },
    { id: "leviathan", name: "Echoing Leviathan", rarity: "Legendary", baseValue: 180, minBait: 5, lengthRange: [150, 210] },
    { id: "starlit", name: "Starlit Ray", rarity: "Legendary", baseValue: 210, minBait: 5, lengthRange: [130, 190] },
  ];

  const BAIT_TIERS = [
    { level: 1, name: "Basic Bait", upgradeCost: 40, odds: { Common: 0.82, Uncommon: 0.16, Rare: 0.02, Epic: 0, Legendary: 0 } },
    { level: 2, name: "Feather Lure", upgradeCost: 90, odds: { Common: 0.68, Uncommon: 0.24, Rare: 0.07, Epic: 0.01, Legendary: 0 } },
    { level: 3, name: "Shimmer Spinner", upgradeCost: 160, odds: { Common: 0.48, Uncommon: 0.32, Rare: 0.15, Epic: 0.04, Legendary: 0.01 } },
    { level: 4, name: "Prism Jig", upgradeCost: 260, odds: { Common: 0.32, Uncommon: 0.36, Rare: 0.2, Epic: 0.1, Legendary: 0.02 } },
    { level: 5, name: "Mythic Lure", upgradeCost: null, odds: { Common: 0.2, Uncommon: 0.34, Rare: 0.24, Epic: 0.14, Legendary: 0.08 } },
  ];

  const FISH_ART = {
    minnow: { body: "#7dd3fc", belly: "#dbeafe", fin: "#0ea5e9", pattern: "#38bdf8" },
    sunny: { body: "#facc15", belly: "#fef3c7", fin: "#ea580c", pattern: "#f97316" },
    perch: { body: "#f97316", belly: "#fed7aa", fin: "#c2410c", pattern: "#fb923c" },
    bass: { body: "#4ade80", belly: "#dcfce7", fin: "#15803d", pattern: "#22c55e" },
    catfish: { body: "#a78bfa", belly: "#ede9fe", fin: "#7c3aed", pattern: "#8b5cf6" },
    pike: { body: "#86efac", belly: "#d9f99d", fin: "#22c55e", pattern: "#4ade80" },
    koi: { body: "#f87171", belly: "#fee2e2", fin: "#ef4444", pattern: "#fb7185" },
    salmon: { body: "#94a3b8", belly: "#cbd5f5", fin: "#475569", pattern: "#a1a1aa" },
    eel: { body: "#38bdf8", belly: "#bae6fd", fin: "#0ea5e9", pattern: "#22d3ee" },
    angler: { body: "#fbbf24", belly: "#fef9c3", fin: "#d97706", pattern: "#f59e0b" },
    swordfish: { body: "#60a5fa", belly: "#bfdbfe", fin: "#2563eb", pattern: "#3b82f6" },
    dragonfin: { body: "#f472b6", belly: "#fbcfe8", fin: "#db2777", pattern: "#ec4899" },
    leviathan: { body: "#6366f1", belly: "#c7d2fe", fin: "#4338ca", pattern: "#818cf8" },
    starlit: { body: "#fde68a", belly: "#fef3c7", fin: "#fbbf24", pattern: "#fcd34d" },
  };

  const DEFAULT_FISH_ART = { body: "#38bdf8", belly: "#bae6fd", fin: "#0284c7", pattern: "#0ea5e9" };

  const layout = {
    dockX: 0,
    dockWidth: 0,
    dockHeight: 0,
    dockTop: 0,
    deckThickness: 0,
    deckY: 0,
  };

  const state = {
    coins: 0,
    baitLevel: 1,
    linePhase: "idle", // idle | casting | waiting | hooked | reeling
    castTimer: 0,
    reelTimer: 0,
    hookDelay: 0,
    hookTimer: 0,
    bobber: {
      baseX: canvas.width * 0.7,
      baseY: CONFIG.waterline + 30,
      x: canvas.width * 0.7,
      y: CONFIG.waterline + 30,
    },
    pendingCatch: null,
    collection: new Map(),
  };

  const stickman = {
    x: canvas.width * 0.22,
    baseY: CONFIG.waterline,
    height: 140,
    headRadius: 18,
    handX: 0,
    handY: 0,
  };

  let lastTimestamp = performance.now();
  let catchOverlayTimer = null;
  let overlayMode = "hidden";
  let currentCollectionOverlayId = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getFishPalette(fishId) {
    return FISH_ART[fishId] ?? DEFAULT_FISH_ART;
  }

  function createFishImageUrl(catchResult) {
    const { body, belly, fin, pattern } = getFishPalette(catchResult.id);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e0f2fe"/>
            <stop offset="100%" stop-color="#bae6fd"/>
          </linearGradient>
        </defs>
        <rect width="200" height="120" rx="22" fill="url(#bg)"/>
        <g transform="translate(18 22)">
          <polygon points="0,38 28,22 28,54" fill="${fin}" opacity="0.85"/>
          <ellipse cx="96" cy="38" rx="86" ry="34" fill="${body}"/>
          <ellipse cx="92" cy="42" rx="72" ry="24" fill="${belly}" opacity="0.9"/>
          <path d="M42 20 Q70 6 110 18" stroke="${pattern}" stroke-width="6" fill="none" opacity="0.5"/>
          <path d="M40 56 Q70 70 108 60" stroke="${pattern}" stroke-width="6" fill="none" opacity="0.45"/>
          <polygon points="170,20 190,38 170,56" fill="${fin}"/>
          <circle cx="134" cy="34" r="11" fill="#0f172a" opacity="0.88"/>
          <circle cx="137" cy="32" r="5.5" fill="#f8fafc"/>
          <circle cx="138" cy="31" r="2.5" fill="#0f172a"/>
        </g>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function getBaitTier(level = state.baitLevel) {
    return BAIT_TIERS.find((tier) => tier.level === level);
  }

  function getNextBaitTier() {
    return getBaitTier(state.baitLevel + 1);
  }

  function chooseRarityForCurrentBait() {
    const tier = getBaitTier();
    const available = RARITY_ORDER.filter((rarity) => {
      const weight = tier.odds[rarity] ?? 0;
      if (weight <= 0) return false;
      return FISH_POOL.some(
        (fish) => fish.rarity === rarity && fish.minBait <= state.baitLevel
      );
    });

    if (available.length === 0) {
      return "Common";
    }

    const totalWeight = available.reduce((sum, rarity) => sum + tier.odds[rarity], 0);
    let roll = Math.random() * totalWeight;
    for (const rarity of available) {
      roll -= tier.odds[rarity];
      if (roll <= 0) {
        return rarity;
      }
    }
    return available[available.length - 1];
  }

  function rollCatchForCurrentBait() {
    const rarity = chooseRarityForCurrentBait();
    const candidates = FISH_POOL.filter(
      (fish) => fish.rarity === rarity && fish.minBait <= state.baitLevel
    );

    if (!candidates.length) {
      return null;
    }

    const fish = candidates[Math.floor(Math.random() * candidates.length)];
    const length = randomRange(fish.lengthRange[0], fish.lengthRange[1]);
    const tier = getBaitTier();
    const valueMultiplier = 1 + (tier.level - 1) * 0.18;
    const value = Math.round(fish.baseValue * valueMultiplier);

    return {
      ...fish,
      value,
      length: Math.round(length * 10) / 10,
    };
  }

  function formatLengthCm(length) {
    return `${length.toFixed(1)} cm`;
  }

  function getEntryStats(entry) {
    const hasRange = Array.isArray(entry.fish.lengthRange) && entry.fish.lengthRange.length > 0;
    const fallbackLength = hasRange
      ? entry.fish.lengthRange[1] ?? entry.fish.lengthRange[0]
      : 30;
    const bestLength = entry.bestLength > 0 ? entry.bestLength : fallbackLength;
    const bestValue = entry.bestValue > 0 ? entry.bestValue : entry.fish.baseValue;
    return { bestLength, bestValue };
  }

  function computeSaleValue(entry) {
    const rarityIndex = Math.max(0, RARITY_ORDER.indexOf(entry.fish.rarity));
    const rarityMultiplier = 1 + rarityIndex * 0.25;
    const bestBonus =
      entry.bestValue > entry.fish.baseValue
        ? (entry.bestValue - entry.fish.baseValue) * 0.2
        : 0;
    return Math.max(
      entry.fish.baseValue,
      Math.round(entry.fish.baseValue * rarityMultiplier + bestBonus)
    );
  }

  function renderFishOverlay({
    fish,
    title,
    stats,
    autoHideMs,
    buttonLabel,
    mode = "manual",
    sellValue,
    canSell = false,
    onSell,
  }) {
    const imageUrl = createFishImageUrl(fish);
    catchImage.src = imageUrl;
    catchImage.alt = `${fish.name} illustration`;
    catchName.textContent = title;
    catchStats.textContent = stats;
    closeCatchBtn.textContent = buttonLabel ?? (mode === "catch" ? "Showcase Later" : "Close");

    sellCatchBtn.classList.add("hidden");
    sellCatchBtn.disabled = false;
    sellCatchBtn.onclick = null;

    if (onSell) {
      if (canSell) {
        sellCatchBtn.classList.remove("hidden");
        sellCatchBtn.disabled = false;
        sellCatchBtn.textContent = `Sell One (+${sellValue} coins)`;
        sellCatchBtn.onclick = onSell;
      } else {
        sellCatchBtn.classList.remove("hidden");
        sellCatchBtn.disabled = true;
        sellCatchBtn.textContent = "Sold Out";
      }
    }

    catchOverlay.classList.remove("hidden");
    overlayMode = mode;
    catchOverlay.dataset.mode = overlayMode;
    if (catchOverlayTimer) {
      clearTimeout(catchOverlayTimer);
      catchOverlayTimer = null;
    }
    if (autoHideMs) {
      catchOverlayTimer = window.setTimeout(() => {
        hideCatchOverlay();
      }, autoHideMs);
    }
  }

  function showCatchOverlay(catchResult) {
    currentCollectionOverlayId = null;
    renderFishOverlay({
      fish: catchResult,
      title: `${catchResult.rarity} ${catchResult.name}`,
      stats: `Length: ${formatLengthCm(catchResult.length)} | Worth ${catchResult.value} coins`,
      autoHideMs: 5000,
      buttonLabel: "Showcase Later",
      mode: "catch",
    });
  }

  function showCollectionFishOverlay(entry) {
    const { bestLength, bestValue } = getEntryStats(entry);
    const preview = {
      ...entry.fish,
      length: bestLength,
      value: bestValue,
    };
    const statsParts = [`Caught ${entry.count}`];
    if (bestLength > 0) {
      statsParts.push(`Best: ${formatLengthCm(bestLength)}`);
    }
    statsParts.push(`Top Value: ${bestValue} coins`);
    const saleValue = computeSaleValue(entry);
    renderFishOverlay({
      fish: preview,
      title: entry.fish.name,
      stats: statsParts.join(" | "),
      buttonLabel: "Close",
      mode: "collection",
      sellValue: saleValue,
      canSell: entry.count > 0,
      onSell: entry.count > 0 ? () => sellFishFromCollection(entry.fish.id) : null,
    });
    currentCollectionOverlayId = entry.fish.id;
  }

  function showCollectionFishOverlayById(fishId) {
    const entry = state.collection.get(fishId);
    if (!entry) return;
    showCollectionFishOverlay(entry);
  }

  function sellFishFromCollection(fishId) {
    const entry = state.collection.get(fishId);
    if (!entry) {
      setStatus("No fish data available to sell.");
      hideCatchOverlay();
      return;
    }
    if (entry.count <= 0) {
      setStatus(`No ${entry.fish.name} left to sell.`);
      showCollectionFishOverlay(entry);
      return;
    }

    const saleValue = computeSaleValue(entry);
    entry.count -= 1;
    state.coins += saleValue;
    setStatus(`Sold a ${entry.fish.name} for ${saleValue} coins.`);
    state.collection.set(fishId, entry);
    updateUI();
    renderCollection();
    showCollectionFishOverlay(entry);
  }

  function hideCatchOverlay() {
    if (!catchOverlay.classList.contains("hidden")) {
      catchOverlay.classList.add("hidden");
    }
    if (catchOverlayTimer) {
      clearTimeout(catchOverlayTimer);
      catchOverlayTimer = null;
    }
    sellCatchBtn.classList.add("hidden");
    sellCatchBtn.disabled = false;
    sellCatchBtn.onclick = null;
    overlayMode = "hidden";
    catchOverlay.dataset.mode = "hidden";
    currentCollectionOverlayId = null;
  }

  function drawDock() {
    const deckY = layout.deckY;
    const deckHeight = layout.deckThickness;
    const supportHeight = canvas.height - deckY + 40;

    ctx.fillStyle = "#8b5a2a";
    ctx.fillRect(layout.dockX, layout.dockTop, layout.dockWidth, deckHeight);

    ctx.fillStyle = "#6b3f1d";
    ctx.fillRect(layout.dockX, deckY, layout.dockWidth, deckHeight * 0.45);

    ctx.fillStyle = "#4b2c0c";
    const postCount = 5;
    const postWidth = Math.max(12, layout.dockWidth * 0.05);
    for (let i = 0; i < postCount; i++) {
      const fraction = postCount === 1 ? 0.5 : i / (postCount - 1);
      const postX = layout.dockX + fraction * (layout.dockWidth - postWidth);
      ctx.fillRect(postX, deckY, postWidth, supportHeight);
    }
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width;
    canvas.height = rect.height;

    CONFIG.waterline = clamp(canvas.height * 0.62, canvas.height * 0.45, canvas.height * 0.72);

    layout.dockHeight = Math.max(140, canvas.height * 0.22);
    layout.dockWidth = Math.max(320, canvas.width * 0.32);
    layout.dockX = canvas.width * 0.04;
    layout.dockTop = CONFIG.waterline - layout.dockHeight;
    layout.deckThickness = layout.dockHeight * 0.24;
    layout.deckY = layout.dockTop + layout.deckThickness;

    stickman.height = Math.max(150, canvas.height * 0.24);
    stickman.headRadius = stickman.height * 0.16;
    stickman.x = layout.dockX + layout.dockWidth * 0.55;
    stickman.baseY = layout.dockTop + layout.deckThickness * 0.2;
    stickman.handX = stickman.x + stickman.height * 0.34;
    stickman.handY = stickman.baseY - stickman.height * 0.46;

    state.bobber.baseX = canvas.width * 0.72;
    state.bobber.baseY = CONFIG.waterline + 60;
    if (state.linePhase === "idle") {
      state.bobber.x = state.bobber.baseX;
      state.bobber.y = state.bobber.baseY;
    }
  }

  function setStatus(text) {
    statusText.textContent = text;
  }

  function updateUI() {
    coinsValue.textContent = state.coins.toString();
    const tier = getBaitTier();
    baitLevelLabel.textContent = `Lv. ${tier.level} | ${tier.name}`;
    castButton.disabled = state.linePhase !== "idle";
    reelButton.disabled = state.linePhase !== "hooked";

    const nextTier = getNextBaitTier();
    if (nextTier) {
      upgradeButton.disabled = state.coins < nextTier.upgradeCost;
      upgradeButton.textContent = `Upgrade Bait (${nextTier.upgradeCost} coins)`;
    } else {
      upgradeButton.disabled = true;
      upgradeButton.textContent = "Bait Maxed";
    }
  }

  function toggleCollectionPanel(forceOpen) {
    const shouldOpen =
      typeof forceOpen === "boolean"
        ? forceOpen
        : collectionPanel.classList.contains("hidden");
    if (shouldOpen) {
      hideCatchOverlay();
      renderCollection();
      collectionPanel.classList.remove("hidden");
    } else {
      collectionPanel.classList.add("hidden");
    }
  }

  function castLine() {
    if (state.linePhase !== "idle") return;
    state.linePhase = "casting";
    state.castTimer = 0;
    state.pendingCatch = null;
    setStatus("Casting line...");
    updateUI();
  }

  function reelLine() {
    if (state.linePhase !== "hooked") return;
    state.linePhase = "reeling";
    state.reelTimer = 0;
    setStatus("Reeling in...");
    updateUI();
  }

  function upgradeBait() {
    const nextTier = getNextBaitTier();
    if (!nextTier) {
      setStatus("Your bait is already the best in town!");
      return;
    }
    if (state.coins < nextTier.upgradeCost) {
      const shortfall = nextTier.upgradeCost - state.coins;
      setStatus(`Need ${shortfall} more coins to upgrade bait.`);
      return;
    }

    state.coins -= nextTier.upgradeCost;
    state.baitLevel = nextTier.level;
    setStatus(`Upgraded to ${nextTier.name}! Rarer fish feel the lure.`);
    updateUI();
  }

  function updateLine(dt) {
    switch (state.linePhase) {
      case "idle": {
        const wobble = Math.sin(performance.now() * 0.003) * CONFIG.idleBobberRange;
        state.bobber.y = state.bobber.baseY + wobble;
        break;
      }
      case "casting": {
        state.castTimer += dt;
        const t = clamp(state.castTimer / CONFIG.castDurationMs, 0, 1);
        const start = { x: stickman.handX, y: stickman.handY };
        state.bobber.x = start.x + (state.bobber.baseX - start.x) * t;
        state.bobber.y = start.y + (state.bobber.baseY - start.y) * t;

        if (t >= 1) {
          state.linePhase = "waiting";
          state.hookDelay = randomRange(...CONFIG.hookDelayRangeMs);
          state.hookTimer = 0;
          setStatus("Line in the water...");
        }
        break;
      }
      case "waiting": {
        state.hookTimer += dt;
        const gentleBob = Math.sin(performance.now() * 0.0035) * CONFIG.idleBobberRange;
        state.bobber.y = state.bobber.baseY + gentleBob;

        if (state.hookTimer >= state.hookDelay) {
          state.linePhase = "hooked";
          state.pendingCatch = rollCatchForCurrentBait();
          if (!state.pendingCatch) {
            // Fallback in case no fish were eligible for the current tier.
            state.pendingCatch = {
              id: "minnow",
              name: "Lively Minnow",
              rarity: "Common",
              value: 5,
              length: 22.5,
            };
          }
          setStatus("You feel a tug! Reel it in!");
          updateUI();
        }
        break;
      }
      case "hooked": {
        const franticBob = Math.sin(performance.now() * 0.02) * CONFIG.hookedBobberRange;
        state.bobber.y = state.bobber.baseY + franticBob;
        break;
      }
      case "reeling": {
        state.reelTimer += dt;
        const t = clamp(state.reelTimer / CONFIG.reelDurationMs, 0, 1);
        const startY = state.bobber.baseY;
        state.bobber.y = startY - 120 * t;

        if (t >= 1) {
          grantCatchRewards();
          resetLine();
        }
        break;
      }
      default:
        break;
    }
  }

  function grantCatchRewards() {
    if (!state.pendingCatch) return;
    state.coins += state.pendingCatch.value;
    addCatchToCollection(state.pendingCatch);
    setStatus(
      `Caught a ${state.pendingCatch.rarity} ${state.pendingCatch.name}! +${state.pendingCatch.value} coins (${formatLengthCm(
        state.pendingCatch.length
      )})`
    );
    showCatchOverlay(state.pendingCatch);
    updateUI();
  }

  function resetLine() {
    state.linePhase = "idle";
    state.pendingCatch = null;
    state.bobber.x = state.bobber.baseX;
    state.bobber.y = state.bobber.baseY;
    updateUI();
  }

  function addCatchToCollection(catchResult) {
    const baseFish = FISH_POOL.find((fish) => fish.id === catchResult.id) ?? catchResult;
    const existing = state.collection.get(baseFish.id) ?? {
      fish: baseFish,
      count: 0,
      bestLength: 0,
      bestValue: 0,
    };

    existing.count += 1;
    existing.bestLength = Math.max(existing.bestLength, catchResult.length);
    existing.bestValue = Math.max(existing.bestValue, catchResult.value);
    state.collection.set(baseFish.id, existing);
    renderCollection();
  }

  function renderCollection() {
    collectionList.innerHTML = "";
    const entries = Array.from(state.collection.values());

    if (!entries.length) {
      const li = document.createElement("li");
      li.classList.add("empty");
      li.textContent = "No fish caught yet.";
      collectionList.appendChild(li);
      return;
    }

    entries.sort((a, b) => {
      const rarityDelta =
        RARITY_ORDER.indexOf(a.fish.rarity) - RARITY_ORDER.indexOf(b.fish.rarity);
      if (rarityDelta !== 0) return rarityDelta;
      return a.fish.name.localeCompare(b.fish.name);
    });

    for (const entry of entries) {
      const li = document.createElement("li");
      const { bestLength, bestValue } = getEntryStats(entry);
      const saleValue = computeSaleValue(entry);

      const thumb = document.createElement("img");
      thumb.className = "fish-thumb";
      thumb.src = createFishImageUrl({
        ...entry.fish,
        length: bestLength,
        value: bestValue,
      });
      thumb.alt = `${entry.fish.name} illustration`;
      li.appendChild(thumb);

      const info = document.createElement("div");
      info.className = "fish-info";

      const name = document.createElement("span");
      name.className = "fish-name";
      name.textContent = entry.fish.name;
      info.appendChild(name);

      const meta = document.createElement("span");
      meta.className = "fish-meta";

      const rarityTag = document.createElement("span");
      rarityTag.className = `rarity-${entry.fish.rarity}`;
      rarityTag.textContent = entry.fish.rarity;
      meta.appendChild(rarityTag);

      const lengthTag = document.createElement("span");
      lengthTag.textContent = `Best: ${
        bestLength > 0 ? formatLengthCm(bestLength) : "—"
      }`;
      meta.appendChild(lengthTag);

      meta.appendChild(document.createTextNode(` | Value: ${bestValue} coins`));
      meta.appendChild(document.createTextNode(` | Sell: +${saleValue} coins`));
      info.appendChild(meta);

      li.appendChild(info);

      const count = document.createElement("span");
      count.className = "fish-count";
      count.textContent = `x${entry.count}`;
      li.appendChild(count);

      const fishId = entry.fish.id;
      const openOverlay = () => showCollectionFishOverlayById(fishId);
      li.classList.add("collection-item");
      li.tabIndex = 0;
      li.addEventListener("click", openOverlay);
      li.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openOverlay();
        }
      });

      collectionList.appendChild(li);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawDock();
    drawStickman();
    drawFishingLine();
    drawBobber();
  }

  function drawBackground() {
    const time = performance.now();
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CONFIG.waterline);
    skyGradient.addColorStop(0, "#dff1ff");
    skyGradient.addColorStop(0.45, "#a3d4ff");
    skyGradient.addColorStop(1, "#7ec0ff");
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, CONFIG.waterline);

    const waterGradient = ctx.createLinearGradient(0, CONFIG.waterline, 0, canvas.height);
    waterGradient.addColorStop(0, "#6dc7ff");
    waterGradient.addColorStop(0.55, "#4098d7");
    waterGradient.addColorStop(1, "#2b6cb0");
    ctx.fillStyle = waterGradient;
    ctx.fillRect(0, CONFIG.waterline, canvas.width, canvas.height - CONFIG.waterline);

    ctx.fillStyle = "rgba(188, 214, 238, 0.6)";
    ctx.fillRect(0, CONFIG.waterline - 18, canvas.width, 20);

    const sunX = canvas.width * 0.82;
    const sunY = CONFIG.waterline * 0.35;
    const sunRadius = Math.min(70, canvas.width * 0.08);
    const sunGradient = ctx.createRadialGradient(
      sunX,
      sunY,
      sunRadius * 0.2,
      sunX,
      sunY,
      sunRadius
    );
    sunGradient.addColorStop(0, "rgba(255,255,255,0.9)");
    sunGradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 5; i++) {
      const baseY = CONFIG.waterline + 36 + i * 42;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      for (let x = 0; x <= canvas.width; x += 18) {
        const wave = Math.sin((x + time * 0.12 + i * 120) * 0.02) * 4;
        ctx.lineTo(x, baseY + wave);
      }
      ctx.stroke();
    }
  }

  function drawStickman() {
    const headRadius = stickman.headRadius;
    const headCenterY = stickman.baseY - stickman.height + headRadius;
    const shoulderY = headCenterY + headRadius * 1.2;
    const hipY = stickman.baseY - stickman.height * 0.28;
    const limbThickness = Math.max(5, stickman.height * 0.05);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineWidth = limbThickness;
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(stickman.x, shoulderY);
    ctx.lineTo(stickman.x, hipY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(stickman.x, hipY);
    ctx.lineTo(stickman.x - stickman.height * 0.18, stickman.baseY);
    ctx.moveTo(stickman.x, hipY);
    ctx.lineTo(stickman.x + stickman.height * 0.16, stickman.baseY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(stickman.x, shoulderY + limbThickness * 0.15);
    ctx.lineTo(stickman.handX, stickman.handY);
    ctx.stroke();

    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(stickman.x, headCenterY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const hatWidth = headRadius * 2.4;
    const hatHeight = headRadius * 0.8;
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(stickman.x - hatWidth / 2, headCenterY - headRadius * 1.35, hatWidth, hatHeight);
    ctx.fillRect(
      stickman.x - hatWidth / 1.6,
      headCenterY - headRadius * 0.9,
      hatWidth * 1.25,
      hatHeight * 0.55
    );

    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = limbThickness * 0.55;
    ctx.beginPath();
    const rodTipX = stickman.handX + stickman.height * 0.62;
    const rodTipY = stickman.handY - stickman.height * 0.36;
    ctx.moveTo(stickman.handX, stickman.handY);
    ctx.lineTo(rodTipX, rodTipY);
    ctx.stroke();

    stickman.rodTipX = rodTipX;
    stickman.rodTipY = rodTipY;

    ctx.restore();
  }

  function drawFishingLine() {
    ctx.strokeStyle = "#dce6f2";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const tipX = stickman.rodTipX ?? stickman.handX;
    const tipY = stickman.rodTipY ?? stickman.handY;
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(
      (tipX + state.bobber.x) / 2,
      tipY - stickman.height * 0.5,
      state.bobber.x,
      state.bobber.y - 10
    );
    ctx.stroke();
  }

  function drawBobber() {
    const radius = Math.max(8, canvas.width * 0.011);
    ctx.fillStyle = "#f94144";
    ctx.beginPath();
    ctx.arc(state.bobber.x, state.bobber.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f9f9f9";
    ctx.beginPath();
    ctx.arc(state.bobber.x, state.bobber.y - radius * 0.35, radius * 0.75, 0, Math.PI * 2);
    ctx.fill();
  }

  function update(timestamp) {
    const dt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    updateLine(dt);
    draw();
    requestAnimationFrame(update);
  }

  function wireControls() {
    castButton.addEventListener("click", castLine);
    reelButton.addEventListener("click", reelLine);
    upgradeButton.addEventListener("click", upgradeBait);
    toggleCollectionButton.addEventListener("click", () => toggleCollectionPanel());
    closeCollectionButton.addEventListener("click", () => toggleCollectionPanel(false));
    closeCatchBtn.addEventListener("click", () => hideCatchOverlay());
    catchOverlay.addEventListener("click", (event) => {
      if (event.target === catchOverlay) {
        hideCatchOverlay();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!catchOverlay.classList.contains("hidden")) {
        if (event.code === "Escape") {
          hideCatchOverlay();
          event.preventDefault();
          return;
        }
        if (overlayMode === "collection") {
          if (event.code === "KeyS") {
            if (
              !sellCatchBtn.classList.contains("hidden") &&
              !sellCatchBtn.disabled
            ) {
              sellCatchBtn.click();
              event.preventDefault();
            }
            return;
          }
          if (event.code === "Space" || event.code === "Enter") {
            event.preventDefault();
            return;
          }
        } else if (event.code === "Space" || event.code === "Enter") {
          hideCatchOverlay();
          event.preventDefault();
          return;
        }
      }

      if (event.code === "Space") {
        if (state.linePhase === "idle") {
          castLine();
        } else if (state.linePhase === "hooked") {
          reelLine();
        }
      } else if (event.code === "Escape") {
        toggleCollectionPanel(false);
      } else if (event.code === "KeyU") {
        upgradeBait();
      }
    });
  }

  function init() {
    wireControls();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    updateUI();
    requestAnimationFrame(update);
  }

  init();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", startGame);
} else {
  startGame();
}
