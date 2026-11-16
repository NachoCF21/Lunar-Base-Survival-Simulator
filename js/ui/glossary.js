/* =========================================================================
   NASA KID-FRIENDLY GLOSSARY TOOLTIPS (AUTO-DISMISS AFTER 10 SECONDS)
   ========================================================================= */
const NASA_GLOSSARY = {
  'Artemis IV': 'NASA’s fourth Artemis mission that brings astronauts to Lunar Gateway and the Moon’s South Pole.',
  'Orion': 'NASA’s deep-space crew spacecraft that carries astronauts from Earth to the Moon and safely home.',
  'Lunar Gateway': 'NASA’s space station orbiting the Moon where Orion docks before lunar landings.',
  'South Pole': 'The Moon’s southern region where permanently shadowed craters hold ancient water ice.',
  'Solar Flare': 'A sudden bright explosion of energy and X-rays from the Sun.',
  'Solar Flares': 'Sudden bright explosions of energy and X-rays from the Sun.',
  'X-Class': 'The strongest category of solar flares measured by NASA satellites (10x stronger than M-Class).',
  'M-Class': 'Moderate-strength solar flares measured by NASA satellites that can cause radio static.',
  'RadLab': 'NASA radiation sensors that measure space radiation hitting the Moon.',
  'µGy/h': 'Micrograys per hour — a unit measuring radiation dose rate.',
  'NEO': 'Near-Earth Object — an asteroid or comet passing near Earth and the Moon (measured in Lunar Distances, LD).',
  'Helium-3': 'A rare, valuable gas trapped in Moon dust that could power future clean fusion.',
  'Regolith': 'The layer of sharp, static-charged gray rock dust covering the lunar surface.',
  'Hydroponic': 'Growing plants in nutrient-rich water instead of soil to make food and oxygen.',
  'Protons': 'Fast, high-energy particles shot out by the Sun during solar energetic particle (SEP) storms.',
  'Proton': 'A fast, high-energy particle shot out by the Sun during solar storms.',
  'Cosmic Ray': 'A super-fast particle traveling through deep space from distant stars.',
  'Cosmic Rays': 'Super-fast particles traveling through deep space from distant stars.',
  'Micrometeorite': 'A tiny grain of space rock moving faster than a bullet.',
  'Lunar Day': '14 Earth days of non-stop sunlight on the Moon (+110°C).',
  'Lunar Night': '14 Earth days of freezing darkness on the Moon (-170°C).',
  'Airlock': 'A sealed double-door room that keeps breathable air inside when astronauts go out.',
  'Solar Plasma': 'Hot, electrically charged gas blown outward from the Sun.',
  'Electrolysis': 'Using electricity to split water into breathable oxygen and hydrogen.',
  'Seismometer': 'A sensitive instrument that detects moonquakes and ground vibrations.',
  'Cupola': 'An armored observation window dome looking out onto the lunar surface.'
};

const tooltipEl = document.getElementById('nasa-tooltip');
const tooltipTitleEl = document.getElementById('nasa-tooltip-title');
const tooltipDescEl = document.getElementById('nasa-tooltip-desc');
let tooltipAutoHideTimer = null;

function glossarizeText(text) {
  const terms = Object.keys(NASA_GLOSSARY).sort((a, b) => b.length - a.length);
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g');
  return text.replace(regex, (match) => {
    const canonical = terms.find(t => t.toLowerCase() === match.toLowerCase()) || match;
    return `<span class="tech-term" tabindex="0" data-term="${canonical}">${match}</span>`;
  });
}

function showGlossaryTooltip(targetEl) {
  const term = targetEl.getAttribute('data-term');
  const definition = NASA_GLOSSARY[term];
  if (!definition) return;

  if (tooltipAutoHideTimer) {
    clearTimeout(tooltipAutoHideTimer);
    tooltipAutoHideTimer = null;
  }

  tooltipTitleEl.textContent = `🛰️ ${term}`;
  tooltipDescEl.textContent = definition;
  tooltipEl.classList.remove('hidden');

  const rect = targetEl.getBoundingClientRect();
  const tipRect = tooltipEl.getBoundingClientRect();

  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  left = Math.max(12, Math.min(window.innerWidth - tipRect.width - 12, left));

  let top = rect.top - tipRect.height - 10;
  if (top < 12) {
    top = rect.bottom + 10;
  }

  tooltipEl.style.left = `${left}px`;
  tooltipEl.style.top = `${top}px`;
  tooltipEl.classList.remove('opacity-0');

  tooltipAutoHideTimer = setTimeout(() => {
    hideGlossaryTooltip();
  }, 10000);
}

function hideGlossaryTooltip() {
  if (tooltipAutoHideTimer) {
    clearTimeout(tooltipAutoHideTimer);
    tooltipAutoHideTimer = null;
  }
  tooltipEl.classList.add('opacity-0');
  tooltipEl.classList.add('hidden');
}

document.addEventListener('mouseover', (e) => {
  const termEl = e.target.closest('.tech-term');
  if (termEl) showGlossaryTooltip(termEl);
});

document.addEventListener('mouseout', (e) => {
  const termEl = e.target.closest('.tech-term');
  if (termEl) hideGlossaryTooltip();
});

document.addEventListener('click', (e) => {
  const termEl = e.target.closest('.tech-term');
  if (termEl) {
    showGlossaryTooltip(termEl);
  }
});

document.addEventListener('focusin', (e) => {
  const termEl = e.target.closest('.tech-term');
  if (termEl) showGlossaryTooltip(termEl);
});

document.addEventListener('focusout', (e) => {
  const termEl = e.target.closest('.tech-term');
  if (termEl) hideGlossaryTooltip();
});

document.querySelectorAll('.js-glossarize').forEach(el => {
  el.innerHTML = glossarizeText(el.innerHTML);
});
