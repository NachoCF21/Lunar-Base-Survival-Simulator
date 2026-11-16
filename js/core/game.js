 /* =========================================================================
   0. DIFFICULTY MODES CONFIGURATION (EASY / RECOMMENDED / EXTREME)
   ========================================================================= */
const DIFFICULTY_CONFIGS = {
  easy: {
    id: 'easy',
    label: 'EASY',
    badgeText: '🌱 EASY MODE',
    diplomaLabel: 'EASY',
    tagline: 'Almost everything rises, minimal losses & minerals on almost every choice.',
    initialStats: { air: 85, battery: 85, shield: 85, hull: 85 },
    positiveMult: 1.35,          // +35% en ganancias positivas
    safeNegativeFloor: 2,        // En decisiones seguras, pequeños costes (-3/-5) pasan a +2%
    failedPenaltyMult: 0.30,     // Los fallos críticos solo aplican el 30% del daño original
    allowDrawbacks: false,       // Los fallos no dejan averías diarias permanentes
    drawbackDuration: 0,
    drawbackPenaltyMult: 0,
    bonusSampleChance: 0.92,     // 92% de conseguir minerales en cualquier elección sin muestra
    failedSampleChance: 0.65,    // 65% de rescatar Roca Lunar incluso al fallar
    dailyDrain: {
      dayBattery: 8,
      nightBattery: -2,
      air: -2,
      shieldNormal: -1,
      shieldStorm: -3,
      hull: -1
    }
  },
  normal: {
    id: 'normal',
    label: 'RECOMMENDED',
    badgeText: '⭐ RECOMMENDED',
    diplomaLabel: 'RECOMMENDED',
    tagline: 'Balanced survival: mistakes set you back instead of causing an instant loss.',
    initialStats: { air: 75, battery: 75, shield: 75, hull: 80 },
    positiveMult: 1.15,          // +15% en ganancias positivas
    safeNegativeFloor: null,     // Mantiene pequeños costes tácticos (-3/-5) en cartas normales
    failedPenaltyMult: 0.45,     // Los errores críticos hacen menos de la mitad de daño (45%)
    allowDrawbacks: true,
    drawbackDuration: 3,         // Las averías se auto-reparan solas tras 3 días
    drawbackPenaltyMult: 0.5,    // La penalización diaria por avería es la mitad
    bonusSampleChance: 0.25,     // 25% extra de encontrar Roca Lunar en cartas normales
    failedSampleChance: 0.0,
    dailyDrain: {
      dayBattery: 6,
      nightBattery: -5,
      air: -3,
      shieldNormal: -2,
      shieldStorm: -4,
      hull: -1
    }
  },
  extreme: {
    id: 'extreme',
    label: 'EXTREME',
    badgeText: '🔥 EXTREME MODE',
    diplomaLabel: 'EXTREME',
    tagline: 'Original hardcore simulation: unforgiving hazards, heavy drain & permanent damage.',
    initialStats: { air: 70, battery: 70, shield: 70, hull: 75 },
    positiveMult: 1.0,
    safeNegativeFloor: null,
    failedPenaltyMult: 1.0,
    allowDrawbacks: true,
    drawbackDuration: null,      // Permanente hasta repararlo en una misión
    drawbackPenaltyMult: 1.0,
    bonusSampleChance: 0.0,
    failedSampleChance: 0.0,
    dailyDrain: {
      dayBattery: 5,
      nightBattery: -7,
      air: -5,
      shieldNormal: -3,
      shieldStorm: -6,
      hull: -2
    }
  }
};

let selectedDifficulty = 'normal';

function selectDifficulty(diffKey) {
  if (!DIFFICULTY_CONFIGS[diffKey]) return;
  selectedDifficulty = diffKey;

  const modes = ['easy', 'normal', 'extreme'];
  for (const m of modes) {
    const btn = document.getElementById(`btn-diff-${m}`);
    if (!btn) continue;
    btn.classList.remove('diff-card-active-easy', 'diff-card-active-normal', 'diff-card-active-extreme');
    if (m === diffKey) {
      btn.classList.add(`diff-card-active-${m}`);
    }
  }

  const descEl = document.getElementById('difficulty-desc-text');
  if (descEl) {
    descEl.textContent = DIFFICULTY_CONFIGS[diffKey].tagline;
  }
}

/* =========================================================================
   1. AUTOMATIC ARCHIVE CONNECTION
   ========================================================================= */
let activeNasaArchive = [];
const ARCHIVE_FILENAME = 'nasa_120_days_6.js';
const ARCHIVE_PATH = `data/${ARCHIVE_FILENAME}`;

function initArchiveData() {
  const box = document.getElementById('archive-status-box');
  const statusText = document.getElementById('archive-status-text');
  const previewText = document.getElementById('archive-window-preview');
  const launchBtn = document.getElementById('btn-launch-mission');

  if (
    !window.__archiveScriptFailed &&
    typeof NASA_120_DAY_ARCHIVE !== 'undefined' &&
    Array.isArray(NASA_120_DAY_ARCHIVE) &&
    NASA_120_DAY_ARCHIVE.length >= 30
  ) {
    activeNasaArchive = [...NASA_120_DAY_ARCHIVE];
    const firstDate = activeNasaArchive[0].date;
    const lastDate = activeNasaArchive[activeNasaArchive.length - 1].date;

    box.className = 'bg-[#061c11] border-2 border-[#00ff66]/70 rounded-xl p-3 text-left space-y-1';
    statusText.className = 'font-display text-xs sm:text-sm font-bold text-[#00ff66]';
    statusText.textContent = `✅ DATA LOADED (${activeNasaArchive.length} DAYS)`;
    previewText.className = 'text-xs text-[#9effc4] leading-snug';
    previewText.textContent = `NASA Telemetry Window: ${firstDate} → ${lastDate} (30 consecutive days selected per mission).`;
    launchBtn.disabled = false;
  } else {
    box.className = 'bg-[#280808] border-2 border-[#ff3b3b] rounded-xl p-3 text-left space-y-1';
    statusText.className = 'font-display text-xs sm:text-sm font-bold text-[#ff7a7a]';
    statusText.textContent = '❌ ERROR: TELEMETRY ARCHIVE NOT FOUND';
    previewText.className = 'text-xs text-[#ffd6d6] leading-snug';
    previewText.textContent = `Make sure "${ARCHIVE_FILENAME}" is inside the "data/" folder.`;
    launchBtn.disabled = true;
  }

  selectDifficulty(selectedDifficulty);
}

/* =========================================================================
   2. UI HELPER: REVEALED STAT CHIPS
   ========================================================================= */
function renderRevealedChips(effects, sampleKey, addDrawback, clearDrawback) {
  const chips = [];
  const statMeta = [
    { key: 'air', icon: '🫁', unit: '%' },
    { key: 'battery', icon: '🔋', unit: '%' },
    { key: 'shield', icon: '🛡️', unit: '%' },
    { key: 'hull', icon: '🛠️', unit: '%' }
  ];

  for (const s of statMeta) {
    const val = (effects && effects[s.key]) || 0;
    if (val > 0) {
      chips.push(`<span class="px-2 py-0.5 rounded-md bg-[#00ff66]/20 border border-[#00ff66]/60 text-[#7dffb3] font-display text-xs font-bold">▲ +${val}${s.unit} ${s.icon}</span>`);
    } else if (val < 0) {
      chips.push(`<span class="px-2 py-0.5 rounded-md bg-[#ff3b3b]/25 border border-[#ff3b3b]/60 text-[#ff9e9e] font-display text-xs font-bold">▼ ${val}${s.unit} ${s.icon}</span>`);
    }
  }

  if (sampleKey && SAMPLE_TYPES[sampleKey]) {
    const smp = SAMPLE_TYPES[sampleKey];
    chips.push(`<span class="px-2 py-0.5 rounded-md bg-[#61caff]/20 border border-[#61caff]/60 text-[#a8e8ff] font-display text-xs font-bold">+1 ${smp.emoji} (+${smp.scienceGain}% 🔬)</span>`);
  }

  if (addDrawback && DRAWBACK_DEFS[addDrawback]) {
    chips.push(`<span class="px-2 py-0.5 rounded-md bg-[#ff3b3b]/35 border border-[#ff3b3b] text-white font-display text-xs font-bold">⚠️ SYSTEM DAMAGED!</span>`);
  }

  if (clearDrawback && DRAWBACK_DEFS[clearDrawback]) {
    chips.push(`<span class="px-2 py-0.5 rounded-md bg-[#00ff66]/25 border border-[#00ff66] text-[#9effc4] font-display text-xs font-bold">🔧 SYSTEM REPAIRED!</span>`);
  }

  return `<div class="flex flex-wrap gap-1.5 pt-1 animate-appear">${chips.join('')}</div>`;
}

/* =========================================================================
   3. GAME STATE & CORE LOOP
   ========================================================================= */
let game = {};
let autoEndTimeout = null;

function shuffleList(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function clampPercent(val) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

function resetGameState(astronautName, difficultyKey) {
  if (autoEndTimeout) {
    clearTimeout(autoEndTimeout);
    autoEndTimeout = null;
  }

  const diff = DIFFICULTY_CONFIGS[difficultyKey] || DIFFICULTY_CONFIGS.normal;
  const startIndex = Math.floor(Math.random() * (activeNasaArchive.length - 30 + 1));
  const missionArchive = activeNasaArchive.slice(startIndex, startIndex + 30);

  game = {
    astronautName: astronautName || 'Cmdr. Explorer',
    difficulty: diff.id,
    day: 1,
    missionArchive,
    windowStart: missionArchive[0].date,
    windowEnd: missionArchive[29].date,

    air: diff.initialStats.air,
    battery: diff.initialStats.battery,
    shield: diff.initialStats.shield,
    hull: diff.initialStats.hull,

    science: 0,
    samplesCollected: 0,
    lastSampleLabel: 'Collect lunar samples',

    // Map<drawbackId, remainingDays> (Infinity en Extremo, 3 en Normal)
    activeDrawbacks: new Map(),
    dayStartSnapshot: null,

    missionPool: shuffleList(BASE_MISSIONS_BANK),
    alertPool: shuffleList(SPACE_ALERTS_BANK),

    todayRecord: null,
    currentMission: null,
    missionDone: false,
    chosenMissionOpt: null,
    todayAlert: null,
    dayIsClosing: false
  };
}

function startNewGame() {
  if (activeNasaArchive.length < 30) return;

  const rawName = (document.getElementById('astronaut-name-input').value || '').trim();
  const cleanName = rawName.length > 0 ? rawName : 'Cmdr. Explorer';

  playActionSound('start');
  startLoFiAmbient();
  resetGameState(cleanName, selectedDifficulty);

  const diffCfg = DIFFICULTY_CONFIGS[game.difficulty];
  document.getElementById('hud-astronaut-badge').textContent = `👩‍🚀 ${game.astronautName.toUpperCase()}`;

  const diffBadge = document.getElementById('hud-difficulty-badge');
  diffBadge.textContent = diffCfg.badgeText;
  if (game.difficulty === 'easy') {
    diffBadge.className = 'px-2.5 py-0.5 rounded-full border border-[#61caff]/70 bg-[#071f2e] text-[#61caff] font-display font-bold text-xs tracking-wide';
  } else if (game.difficulty === 'extreme') {
    diffBadge.className = 'px-2.5 py-0.5 rounded-full border border-[#ff4d4d]/70 bg-[#2b0909] text-[#ff7a7a] font-display font-bold text-xs tracking-wide';
  } else {
    diffBadge.className = 'px-2.5 py-0.5 rounded-full border border-[#00ff66]/70 bg-[#082b1a] text-[#00ff66] font-display font-bold text-xs tracking-wide';
  }

  document.getElementById('intro-screen').classList.add('hidden');
  const board = document.getElementById('game-board');
  board.classList.remove('hidden');
  board.classList.add('flex');

  startDay();
}

function returnToIntro() {
  playActionSound('start');
  if (autoEndTimeout) {
    clearTimeout(autoEndTimeout);
    autoEndTimeout = null;
  }
  hideGlossaryTooltip();
  document.getElementById('defeat-screen').classList.add('hidden');
  document.getElementById('victory-screen').classList.add('hidden');
  document.getElementById('day-summary-modal').classList.add('hidden');
  document.getElementById('game-board').classList.add('hidden');
  document.getElementById('game-board').classList.remove('flex');
  document.getElementById('intro-screen').classList.remove('hidden');
}

function startDay() {
  game.missionDone = false;
  game.chosenMissionOpt = null;
  game.dayIsClosing = false;

  game.dayStartSnapshot = {
    air: game.air,
    battery: game.battery,
    shield: game.shield,
    hull: game.hull,
    science: game.science
  };

  game.todayRecord = game.missionArchive[game.day - 1];

  if (game.missionPool.length === 0) {
    game.missionPool = shuffleList(BASE_MISSIONS_BANK);
  }
  const rawMission = game.missionPool.pop();
  const swapMission = Math.random() < 0.5;
  game.currentMission = {
    ...rawMission,
    opt1: swapMission ? rawMission.opt2 : rawMission.opt1,
    opt2: swapMission ? rawMission.opt1 : rawMission.opt2
  };

  setupDeterministicDailyAlert();

  updateTopHeaderAndVitals();
  renderDrawbacksBar();
  renderMissionCard();
  renderScienceProgress();
  renderAlertPanel();
}

/* =========================================================================
   4. HEADER, VITALS & DRAWBACKS
   ========================================================================= */
function getDecisionsRemaining() {
  return (game.missionDone ? 0 : 1) + (game.todayAlert && !game.todayAlert.resolved ? 1 : 0);
}

function updateTopHeaderAndVitals() {
  document.getElementById('day-heading').textContent = `DAY ${game.day} / 30`;

  const phasePill = document.getElementById('lunar-phase-pill');
  if (game.day <= 15) {
    phasePill.innerHTML = glossarizeText('☀️ LUNAR DAY (+110°C)');
    phasePill.className = 'px-2.5 py-0.5 rounded-full border border-[#ffbe3b] bg-[#291e07] text-[#ffd885] font-extrabold text-xs tracking-wide';
  } else {
    phasePill.innerHTML = glossarizeText('🌙 LUNAR NIGHT (-170°C)');
    phasePill.className = 'px-2.5 py-0.5 rounded-full border border-[#61caff] bg-[#071f2e] text-[#a3e3ff] font-extrabold text-xs tracking-wide';
  }

  const pending = getDecisionsRemaining();
  const progressPill = document.getElementById('turn-progress-pill');
  if (pending > 0) {
    progressPill.textContent = `${pending} DECISION${pending > 1 ? 'S' : ''} LEFT`;
    progressPill.className = 'px-3 py-0.5 rounded-full bg-[#082617] border border-[#00ff66]/65 text-xs font-extrabold text-[#b8ffd6]';
  } else {
    progressPill.textContent = 'SOL COMPLETE ✓';
    progressPill.className = 'px-3 py-0.5 rounded-full bg-[#00ff66] border border-[#00ff66] text-xs font-extrabold text-[#040a07]';
  }

  updateSingleVitalMeter('air', game.air);
  updateSingleVitalMeter('battery', game.battery);
  updateSingleVitalMeter('shield', game.shield);
  updateSingleVitalMeter('hull', game.hull);
}

function updateSingleVitalMeter(key, percent) {
  const valueEl = document.getElementById(`val-${key}`);
  const barEl = document.getElementById(`bar-${key}`);

  valueEl.textContent = `${percent}%`;
  barEl.style.width = `${percent}%`;

  let barColor = 'bg-[#00ff66]';
  let textColor = 'text-[#00ff66]';

  if (percent <= 25) {
    barColor = 'bg-[#ff3b3b]';
    textColor = 'text-[#ff5252]';
  } else if (percent <= 50) {
    barColor = 'bg-[#ffbe3b]';
    textColor = 'text-[#ffd166]';
  }

  barEl.className = `vital-bar-fill h-full rounded-full ${barColor}`;
  valueEl.className = `font-display text-sm ${textColor}`;
}

function renderDrawbacksBar() {
  const bar = document.getElementById('active-drawbacks-bar');
  if (game.activeDrawbacks.size === 0) {
    bar.classList.add('hidden');
    bar.classList.remove('flex');
    bar.innerHTML = '';
    return;
  }

  const items = Array.from(game.activeDrawbacks.entries())
    .filter(([id]) => DRAWBACK_DEFS[id])
    .map(([id, daysLeft]) => {
      const timerTag = Number.isFinite(daysLeft) ? ` [Auto-repair in ${daysLeft}d]` : '';
      return `<span class="px-2 py-0.5 rounded-lg bg-[#470d0d] border border-[#ff5252] text-[11px] font-extrabold text-white">${DRAWBACK_DEFS[id].label}${timerTag}</span>`;
    })
    .join('');

  bar.innerHTML = `<span class="font-display text-[11px] uppercase tracking-wider text-[#ff6b6b]">⚠️ ACTIVE DAMAGE:</span> ${items}`;
  bar.classList.remove('hidden');
  bar.classList.add('flex');
}

/* =========================================================================
   5. DECISION 1: BASE MISSION & SCIENCE PROGRESS (DIFFICULTY-SCALED)
   ========================================================================= */
function rollBonusMineral(difficultyKey) {
  if (difficultyKey === 'easy') {
    const r = Math.random();
    if (r < 0.45) return 'rock';
    if (r < 0.80) return 'water';
    return 'helium';
  }
  return 'rock';
}

function resolveOptionForDifficulty(opt) {
  const cfg = DIFFICULTY_CONFIGS[game.difficulty] || DIFFICULTY_CONFIGS.extreme;
  if (cfg.id === 'extreme') {
    return opt;
  }

  const scaledEffects = {};
  if (opt.effects) {
    for (const [stat, rawVal] of Object.entries(opt.effects)) {
      if (rawVal > 0) {
        scaledEffects[stat] = Math.max(1, Math.round(rawVal * cfg.positiveMult));
      } else if (rawVal < 0) {
        if (opt.failed) {
          scaledEffects[stat] = Math.min(-1, Math.round(rawVal * cfg.failedPenaltyMult));
        } else if (cfg.safeNegativeFloor !== null) {
          scaledEffects[stat] = cfg.safeNegativeFloor;
        } else {
          scaledEffects[stat] = rawVal;
        }
      } else {
        scaledEffects[stat] = 0;
      }
    }
  }

  let resolvedSample = opt.sample || null;
  if (!resolvedSample) {
    if (!opt.failed && Math.random() < cfg.bonusSampleChance) {
      resolvedSample = rollBonusMineral(cfg.id);
    } else if (opt.failed && Math.random() < cfg.failedSampleChance) {
      resolvedSample = 'rock';
    }
  }

  const resolvedAddDrawback = cfg.allowDrawbacks ? (opt.addDrawback || null) : null;

  return {
    ...opt,
    effects: scaledEffects,
    sample: resolvedSample,
    addDrawback: resolvedAddDrawback
  };
}

function applyOptionOutcome(opt) {
  const cfg = DIFFICULTY_CONFIGS[game.difficulty] || DIFFICULTY_CONFIGS.extreme;

  if (opt.effects) {
    game.air = clampPercent(game.air + (opt.effects.air || 0));
    game.battery = clampPercent(game.battery + (opt.effects.battery || 0));
    game.shield = clampPercent(game.shield + (opt.effects.shield || 0));
    game.hull = clampPercent(game.hull + (opt.effects.hull || 0));
  }

  if (opt.sample && SAMPLE_TYPES[opt.sample]) {
    const smp = SAMPLE_TYPES[opt.sample];
    game.science = clampPercent(game.science + smp.scienceGain);
    game.samplesCollected += 1;
    game.lastSampleLabel = `Last: +1 ${smp.emoji} ${smp.name} (+${smp.scienceGain}%)`;
  }

  if (opt.addDrawback && DRAWBACK_DEFS[opt.addDrawback] && cfg.allowDrawbacks) {
    const duration = cfg.drawbackDuration === null ? Infinity : cfg.drawbackDuration;
    game.activeDrawbacks.set(opt.addDrawback, duration);
  }

  if (opt.clearDrawback && game.activeDrawbacks.has(opt.clearDrawback)) {
    game.activeDrawbacks.delete(opt.clearDrawback);
  }

  renderDrawbacksBar();
}

function renderMissionCard() {
  const m = game.currentMission;
  document.getElementById('mission-emoji').textContent = m.emoji;
  document.getElementById('mission-area').textContent = m.area;
  document.getElementById('mission-description').innerHTML = glossarizeText(m.desc);

  const statusBadge = document.getElementById('mission-status-badge');
  statusBadge.textContent = 'YOUR MOVE';
  statusBadge.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#00ff66]/15 border border-[#00ff66]/60 text-[#00ff66]';

  const btn1 = document.getElementById('btn-mission-opt1');
  const btn2 = document.getElementById('btn-mission-opt2');

  btn1.disabled = false;
  btn2.disabled = false;
  btn1.className = 'choice-btn-neutral-green p-2.5 sm:p-3 text-left cursor-pointer flex flex-col justify-between gap-1.5';
  btn2.className = 'choice-btn-neutral-green p-2.5 sm:p-3 text-left cursor-pointer flex flex-col justify-between gap-1.5';

  btn1.innerHTML = `
    <div>
      <div class="opt-status-tag text-[11px] font-display font-bold uppercase tracking-wider text-[#9effc4] mb-0.5">OPTION A</div>
      <div class="font-extrabold text-xs sm:text-sm text-white leading-snug">${glossarizeText(m.opt1.title)}</div>
    </div>
  `;

  btn2.innerHTML = `
    <div>
      <div class="opt-status-tag text-[11px] font-display font-bold uppercase tracking-wider text-[#9effc4] mb-0.5">OPTION B</div>
      <div class="font-extrabold text-xs sm:text-sm text-white leading-snug">${glossarizeText(m.opt2.title)}</div>
    </div>
  `;
}

function selectMissionOption(optionNumber) {
  if (game.missionDone || game.dayIsClosing) return;

  const m = game.currentMission;
  const rawChosen = optionNumber === 1 ? m.opt1 : m.opt2;
  const chosen = resolveOptionForDifficulty(rawChosen);

  game.missionDone = true;
  game.chosenMissionOpt = optionNumber;

  playActionSound(chosen.failed ? 'danger' : 'choice');
  applyOptionOutcome(chosen);

  const btn1 = document.getElementById('btn-mission-opt1');
  const btn2 = document.getElementById('btn-mission-opt2');
  btn1.disabled = true;
  btn2.disabled = true;

  const chosenStyle = chosen.failed ? 'btn-chosen-bad' : 'btn-chosen-good';
  const chosenHeader = chosen.failed ? '✖ CHOSEN (FAILED)' : '✓ CHOSEN';

  if (optionNumber === 1) {
    btn1.className = `choice-btn-neutral-green ${chosenStyle} p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5`;
    btn1.querySelector('.opt-status-tag').textContent = chosenHeader;
    btn1.insertAdjacentHTML('beforeend', renderRevealedChips(chosen.effects, chosen.sample, chosen.addDrawback, chosen.clearDrawback));

    btn2.className = 'choice-btn-neutral-green btn-not-chosen p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5';
    btn2.querySelector('.opt-status-tag').textContent = 'NOT CHOSEN';
  } else {
    btn2.className = `choice-btn-neutral-green ${chosenStyle} p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5`;
    btn2.querySelector('.opt-status-tag').textContent = chosenHeader;
    btn2.insertAdjacentHTML('beforeend', renderRevealedChips(chosen.effects, chosen.sample, chosen.addDrawback, chosen.clearDrawback));

    btn1.className = 'choice-btn-neutral-green btn-not-chosen p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5';
    btn1.querySelector('.opt-status-tag').textContent = 'NOT CHOSEN';
  }

  const statusBadge = document.getElementById('mission-status-badge');
  statusBadge.textContent = chosen.failed ? '⚠️ DAMAGED' : '✓ DONE';
  statusBadge.className = chosen.failed
    ? 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#ff3b3b] text-white'
    : 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#00ff66] text-[#040a07]';

  updateTopHeaderAndVitals();
  renderScienceProgress();

  if (checkDefeatCondition()) return;
  checkIfAllDecisionsCompleted();
}

function renderScienceProgress() {
  document.getElementById('val-science').textContent = `${game.science}%`;
  document.getElementById('bar-science').style.width = `${game.science}%`;
  document.getElementById('last-sample-pill').textContent = game.lastSampleLabel;
}

/* =========================================================================
   6. DECISION 2: NASA SPACE WEATHER ALERTS
   ========================================================================= */
function pullAlertByCategory(category, dynamicTelemetryTag) {
  if (game.alertPool.filter(a => a.category === category).length === 0) {
    game.alertPool.push(...shuffleList(SPACE_ALERTS_BANK.filter(a => a.category === category)));
  }
  const idx = game.alertPool.findIndex(a => a.category === category);
  const card = game.alertPool.splice(idx, 1)[0];
  const swapAlert = Math.random() < 0.5;
  return {
    ...card,
    opt1: swapAlert ? card.opt2 : card.opt1,
    opt2: swapAlert ? card.opt1 : card.opt2,
    dynamicBadge: dynamicTelemetryTag || card.sourceLabel,
    resolved: false,
    chosenOption: null,
    resolvedChosen: null,
    failedChoice: false,
    outcomeMessage: ''
  };
}

function setupDeterministicDailyAlert() {
  const rec = game.todayRecord;

  const hasCloseNeo = !rec.neo.startsWith('None');
  const hasSepStorm = rec.sep === 'SEP Storm' || rec.radDose >= 45;
  const hasXFlare = rec.flare.startsWith('X');
  const hasMFlare = rec.flare.startsWith('M');

  if (hasCloseNeo) {
    game.todayAlert = pullAlertByCategory('METEORITE', `☄️ NEO FLYBY: ${rec.neo}`);
  } else if (hasSepStorm) {
    const flareNote = rec.flare !== 'None' ? ` • FLARE ${rec.flare}` : '';
    game.todayAlert = pullAlertByCategory('RADIATION', `☢️ ${rec.sep.toUpperCase()}: ${rec.radDose} µGy/h${flareNote}`);
  } else if (hasXFlare) {
    game.todayAlert = pullAlertByCategory('SOLAR_X', `🌞 X-CLASS FLARE: ${rec.flare}`);
  } else if (hasMFlare) {
    game.todayAlert = pullAlertByCategory('SOLAR_M', `☀️ M-CLASS FLARE: ${rec.flare}`);
  } else {
    const flareStatus = rec.flare === 'None' ? 'NO FLARES' : `MINOR ${rec.flare} FLARE`;
    game.todayAlert = pullAlertByCategory('NOMINAL', `✅ NOMINAL LOG • ${flareStatus} • ${rec.radDose} µGy/h`);
  }
}

function renderAlertPanel() {
  const rec = game.todayRecord;
  const al = game.todayAlert;
  const isNominal = al.category === 'NOMINAL';

  const panel = document.getElementById('alerts-panel');
  const titlebar = document.getElementById('alerts-titlebar');
  const heading = document.getElementById('alerts-panel-heading');
  const datePill = document.getElementById('historical-date-pill');
  const telemBar = document.getElementById('alerts-telemetry-bar');

  if (isNominal) {
    panel.className = 'lg:col-span-6 panel-nominal overflow-hidden flex flex-col justify-between min-h-0';
    titlebar.className = 'titlebar-nominal px-3.5 py-2 flex items-center justify-between flex-wrap gap-2';
    heading.className = 'font-display text-sm sm:text-base font-bold tracking-wide text-[#8ce0ff]';
    heading.textContent = '🛰️ 2. NASA SPACE WEATHER (NOMINAL)';
    datePill.className = 'font-display text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#61caff]/20 border border-[#61caff]/60 text-[#bceaff]';
    telemBar.className = 'px-3.5 py-1.5 bg-[#071c2b] border-b border-[#61caff]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold';
  } else {
    panel.className = `lg:col-span-6 panel-red ${!al.resolved ? 'red-pulse-active' : ''} overflow-hidden flex flex-col justify-between min-h-0`;
    titlebar.className = 'titlebar-red px-3.5 py-2 flex items-center justify-between flex-wrap gap-2';
    heading.className = 'font-display text-sm sm:text-base font-bold tracking-wide text-[#ff5c5c] glow-red';
    heading.textContent = '🚨 2. NASA SPACE ALERT';
    datePill.className = 'font-display text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#ff3b3b]/20 border border-[#ff3b3b]/60 text-[#ffb8b8]';
    telemBar.className = 'px-3.5 py-1.5 bg-[#240707] border-b border-[#ff3b3b]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold';
  }

  datePill.textContent = `📅 NASA LOG: ${rec.date}`;
  document.getElementById('telem-flare').textContent = rec.flare;
  document.getElementById('telem-sep').textContent = rec.sep;
  document.getElementById('telem-rad').textContent = `${rec.radDose}`;
  document.getElementById('telem-neo').textContent = rec.neo;

  const baseBtnClass = isNominal ? 'choice-btn-neutral-nominal' : 'choice-btn-neutral-alert';
  const chosenStyle = al.failedChoice ? 'btn-chosen-bad' : 'btn-chosen-good';

  const btn1Class = al.resolved
    ? (al.chosenOption === 1 ? `${baseBtnClass} ${chosenStyle}` : `${baseBtnClass} btn-not-chosen`)
    : `${baseBtnClass} cursor-pointer`;

  const btn2Class = al.resolved
    ? (al.chosenOption === 2 ? `${baseBtnClass} ${chosenStyle}` : `${baseBtnClass} btn-not-chosen`)
    : `${baseBtnClass} cursor-pointer`;

  const btn1Tag = al.resolved
    ? (al.chosenOption === 1 ? (al.failedChoice ? '✖ CHOSEN (FAILED)' : '✓ CHOSEN') : 'NOT CHOSEN')
    : 'OPTION A';
  const btn2Tag = al.resolved
    ? (al.chosenOption === 2 ? (al.failedChoice ? '✖ CHOSEN (FAILED)' : '✓ CHOSEN') : 'NOT CHOSEN')
    : 'OPTION B';

  const resolvedOpt = al.resolvedChosen || (al.chosenOption === 1 ? al.opt1 : al.opt2);
  const opt1Revealed = al.resolved && al.chosenOption === 1
    ? renderRevealedChips(resolvedOpt.effects, resolvedOpt.sample, resolvedOpt.addDrawback, resolvedOpt.clearDrawback)
    : '';
  const opt2Revealed = al.resolved && al.chosenOption === 2
    ? renderRevealedChips(resolvedOpt.effects, resolvedOpt.sample, resolvedOpt.addDrawback, resolvedOpt.clearDrawback)
    : '';

  const cardBoxClass = isNominal
    ? 'bg-[#082236] border border-[#61caff]/45 rounded-xl p-2.5 flex items-start gap-2.5'
    : 'bg-[#280808] border border-[#ff3b3b]/45 rounded-xl p-2.5 flex items-start gap-2.5';

  const badgeTextClass = isNominal
    ? 'font-display text-[11px] font-extrabold uppercase tracking-wider text-[#8ce0ff] mb-0.5'
    : 'font-display text-[11px] font-extrabold uppercase tracking-wider text-[#ff8a8a] mb-0.5';

  const descTextClass = isNominal
    ? 'text-xs sm:text-sm text-[#d4f2ff] mt-0.5 leading-snug'
    : 'text-xs sm:text-sm text-[#ffd6d6] mt-0.5 leading-snug';

  const optTagColorClass = isNominal
    ? 'text-[11px] font-display font-bold uppercase tracking-wider text-[#9ee4ff] mb-0.5'
    : 'text-[11px] font-display font-bold uppercase tracking-wider text-[#ffb8b8] mb-0.5';

  document.getElementById('alerts-cards-container').innerHTML = `
    <div class="${cardBoxClass}">
      <div class="text-2xl sm:text-3xl shrink-0">${al.emoji}</div>
      <div>
        <div class="${badgeTextClass}">
          ${glossarizeText(al.dynamicBadge)}
        </div>
        <h3 class="text-sm sm:text-base font-extrabold text-white leading-snug">
          ${glossarizeText(al.title)}
        </h3>
        <p class="${descTextClass}">
          ${glossarizeText(al.desc)}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <button
        data-sound="choice"
        onclick="selectAlertOption(1)"
        ${al.resolved ? 'disabled' : ''}
        class="${btn1Class} p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5"
      >
        <div>
          <div class="${optTagColorClass}">${btn1Tag}</div>
          <div class="font-extrabold text-xs sm:text-sm text-white leading-snug">${glossarizeText(al.opt1.label)}</div>
        </div>
        ${opt1Revealed}
      </button>

      <button
        data-sound="choice"
        onclick="selectAlertOption(2)"
        ${al.resolved ? 'disabled' : ''}
        class="${btn2Class} p-2.5 sm:p-3 text-left flex flex-col justify-between gap-1.5"
      >
        <div>
          <div class="${optTagColorClass}">${btn2Tag}</div>
          <div class="font-extrabold text-xs sm:text-sm text-white leading-snug">${glossarizeText(al.opt2.label)}</div>
        </div>
        ${opt2Revealed}
      </button>
    </div>
  `;
}

function selectAlertOption(optionNumber) {
  const alertObj = game.todayAlert;
  if (!alertObj || alertObj.resolved || game.dayIsClosing) return;

  const rawChosen = optionNumber === 1 ? alertObj.opt1 : alertObj.opt2;
  const chosen = resolveOptionForDifficulty(rawChosen);

  alertObj.resolved = true;
  alertObj.chosenOption = optionNumber;
  alertObj.resolvedChosen = chosen;
  alertObj.failedChoice = Boolean(chosen.failed);
  alertObj.outcomeMessage = chosen.resultText;

  playActionSound(chosen.failed ? 'danger' : 'choice');
  applyOptionOutcome(chosen);

  updateTopHeaderAndVitals();
  renderScienceProgress();
  renderAlertPanel();

  if (checkDefeatCondition()) return;
  checkIfAllDecisionsCompleted();
}

/* =========================================================================
   7. AUTOMATIC END-OF-DAY SUMMARY MODAL & DEFEAT CHECK
   ========================================================================= */
function checkIfAllDecisionsCompleted() {
  if (getDecisionsRemaining() > 0 || game.dayIsClosing) return;

  game.dayIsClosing = true;
  autoEndTimeout = setTimeout(() => {
    completeCurrentDayAndShowSummary();
  }, 1150);
}

function completeCurrentDayAndShowSummary() {
  const isDaytime = game.day <= 15;
  const rec = game.todayRecord;
  const cfg = DIFFICULTY_CONFIGS[game.difficulty] || DIFFICULTY_CONFIGS.extreme;
  const drain = cfg.dailyDrain;
  const dbMult = cfg.drawbackPenaltyMult;

  let batteryCycleDelta = isDaytime ? drain.dayBattery : drain.nightBattery;
  if (game.activeDrawbacks.has('solarDamaged')) {
    if (game.difficulty === 'extreme') {
      batteryCycleDelta = isDaytime ? -4 : batteryCycleDelta - 4;
    } else {
      batteryCycleDelta -= Math.round(4 * dbMult);
    }
  }
  if (game.activeDrawbacks.has('coolantCracked')) {
    batteryCycleDelta -= Math.round(6 * dbMult);
  }

  let airDailyDelta = drain.air;
  if (game.activeDrawbacks.has('airlockLeak')) {
    airDailyDelta -= Math.round(6 * dbMult);
  }
  if (game.activeDrawbacks.has('hullMicrofracture')) {
    airDailyDelta -= Math.round(3 * dbMult);
  }

  let radShieldDrain = rec.radDose >= 55 ? drain.shieldStorm : drain.shieldNormal;
  if (game.activeDrawbacks.has('shieldDegraded')) {
    radShieldDrain -= Math.round(6 * dbMult);
  }

  let hullThermalWear = drain.hull;
  if (game.activeDrawbacks.has('coolantCracked')) {
    hullThermalWear -= Math.round(3 * dbMult);
  }
  if (game.activeDrawbacks.has('hullMicrofracture')) {
    hullThermalWear -= Math.round(5 * dbMult);
  }

  game.battery = clampPercent(game.battery + batteryCycleDelta);
  game.air = clampPercent(game.air + airDailyDelta);
  game.shield = clampPercent(game.shield + radShieldDrain);
  game.hull = clampPercent(game.hull + hullThermalWear);

  // En modo Normal, las averías temporales se auto-reparan tras expirar sus días
  if (game.activeDrawbacks.size > 0) {
    for (const [id, daysLeft] of Array.from(game.activeDrawbacks.entries())) {
      if (Number.isFinite(daysLeft)) {
        if (daysLeft <= 1) {
          game.activeDrawbacks.delete(id);
        } else {
          game.activeDrawbacks.set(id, daysLeft - 1);
        }
      }
    }
    renderDrawbacksBar();
  }

  updateTopHeaderAndVitals();

  if (checkDefeatCondition()) return;

  document.getElementById('modal-summary-icon').textContent = isDaytime ? '☀️📊' : '🌙📊';
  document.getElementById('modal-summary-title').textContent = `DAY ${game.day} COMPLETED`;
  document.getElementById('modal-summary-nasa-date').textContent =
    `NASA Log: ${rec.date} • Flare ${rec.flare} • SEP ${rec.sep} • RadLab ${rec.radDose} µGy/h`;

  const continueBtn = document.getElementById('modal-continue-btn');
  continueBtn.textContent = game.day >= 30
    ? 'BOARD ORION & CLAIM NASA DIPLOMA 🏆'
    : `CONTINUE TO DAY ${game.day + 1} ➔`;

  const snap = game.dayStartSnapshot;
  const metrics = [
    { label: 'Air', icon: '🫁', delta: game.air - snap.air },
    { label: 'Battery', icon: '🔋', delta: game.battery - snap.battery },
    { label: 'Shield', icon: '🛡️', delta: game.shield - snap.shield },
    { label: 'Hull', icon: '🛠️', delta: game.hull - snap.hull },
    { label: 'Science Progress', icon: '🔬', delta: game.science - snap.science }
  ];

  const changedRows = metrics
    .filter(m => m.delta !== 0)
    .map(m => {
      if (m.delta > 0) {
        return `
          <div class="flex items-center justify-between bg-[#0c3a23] border border-[#00ff66]/55 rounded-lg px-3.5 py-1.5 text-[#7dffb3]">
            <span>${m.icon} ${m.label}</span>
            <span class="font-display text-base">▲ +${m.delta}%</span>
          </div>
        `;
      } else {
        return `
          <div class="flex items-center justify-between bg-[#2b0909] border border-[#ff3b3b]/55 rounded-lg px-3.5 py-1.5 text-[#ff9e9e]">
            <span>${m.icon} ${m.label}</span>
            <span class="font-display text-base">▼ ${m.delta}%</span>
          </div>
        `;
      }
    });

  document.getElementById('modal-summary-changes').innerHTML = changedRows.length > 0
    ? changedRows.join('')
    : `<div class="text-center text-[#c9ffdf]">All systems held steady at 0% net change today!</div>`;

  const summaryDrawbacksEl = document.getElementById('modal-summary-drawbacks');
  if (game.activeDrawbacks.size > 0) {
    const list = Array.from(game.activeDrawbacks.entries())
      .filter(([id]) => DRAWBACK_DEFS[id])
      .map(([id, daysLeft]) => {
        const timerTag = Number.isFinite(daysLeft) ? ` (Auto-repair in ${daysLeft}d)` : '';
        return `${DRAWBACK_DEFS[id].label}${timerTag}`;
      })
      .join('<br/>');
    summaryDrawbacksEl.innerHTML = `⚠️ <strong>UNREPAIRED SUBSYSTEM DAMAGE:</strong><br/>${list}`;
    summaryDrawbacksEl.classList.remove('hidden');
  } else {
    summaryDrawbacksEl.classList.add('hidden');
  }

  document.getElementById('modal-summary-vitals').innerHTML = `
    <div class="bg-[#082617] border border-[#00ff66]/45 rounded-lg p-2">
      🫁 Air<br/><span class="font-display text-sm text-white">${game.air}%</span>
    </div>
    <div class="bg-[#082617] border border-[#00ff66]/45 rounded-lg p-2">
      🔋 Battery<br/><span class="font-display text-sm text-white">${game.battery}%</span>
    </div>
    <div class="bg-[#082617] border border-[#00ff66]/45 rounded-lg p-2">
      🛡️ Shield<br/><span class="font-display text-sm text-white">${game.shield}%</span>
    </div>
    <div class="bg-[#082617] border border-[#00ff66]/45 rounded-lg p-2">
      🛠️ Hull<br/><span class="font-display text-sm text-white">${game.hull}%</span>
    </div>
  `;

  document.getElementById('day-summary-modal').classList.remove('hidden');
}

function proceedAfterSummary() {
  playActionSound('nextDay');
  document.getElementById('day-summary-modal').classList.add('hidden');

  if (game.day >= 30) {
    showVictoryScreen();
    return;
  }

  game.day += 1;
  startDay();
}

function checkDefeatCondition() {
  let msg = '';
  let advice = '';

  if (game.air <= 0) {
    msg = `On Day ${game.day} (${game.todayRecord.date}), Breathable Air hit 0%. Orion had to abort the mission!`;
    advice = '💡 Artemis Tip: Keep Airlock seals repaired and prioritize Oxygen Generator, Hydroponic, and Air Scrubber missions.';
  } else if (game.battery <= 0) {
    msg = `On Day ${game.day} (${game.todayRecord.date}), Battery Power hit 0%. Life support lost power!`;
    advice = '💡 Artemis Tip: Protect Solar Arrays during storms (damaged arrays drain power!) and conserve energy during Lunar Night.';
  } else if (game.shield <= 0) {
    msg = `On Day ${game.day} (${game.todayRecord.date}), Radiation Shield fell to 0%. Solar radiation exceeded safe limits!`;
    advice = '💡 Artemis Tip: Power magnetic shields during SEP radiation storms and stack Water Wall shielding.';
  } else if (game.hull <= 0) {
    msg = `On Day ${game.day} (${game.todayRecord.date}), Hull Integrity dropped to 0%. Habitat pressure was lost!`;
    advice = '💡 Artemis Tip: Avoid reckless surface maneuvers and patch micrometeorite impacts and hull micro-fractures right away.';
  }

  if (!msg) return false;

  if (autoEndTimeout) {
    clearTimeout(autoEndTimeout);
    autoEndTimeout = null;
  }

  playActionSound('defeat');
  document.getElementById('day-summary-modal').classList.add('hidden');
  document.getElementById('defeat-message').textContent = msg;
  document.getElementById('defeat-advice').textContent = advice;
  document.getElementById('defeat-screen').classList.remove('hidden');
  return true;
}

// Iniciar conexión automática al cargar la página
initArchiveData();
