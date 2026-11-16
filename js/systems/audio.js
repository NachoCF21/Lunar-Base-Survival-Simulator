/* =========================================================================
   BALANCED SOFT SFX + CHILL SPACE LO-FI AMBIENT ENGINE
   ========================================================================= */
let sfxEnabled = true;
let lofiEnabled = true;
let audioContext = null;
let lofiTimer = null;
let lofiChordStep = 0;
let lofiNoiseNode = null;

function ensureAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(ctx, freq, startOffset, duration, wave = 'triangle', peakGain = 0.08, endFreq = null) {
  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, now);
  if (endFreq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playActionSound(type) {
  if (!sfxEnabled) return;
  try {
    const ctx = ensureAudioContext();
    if (type === 'start') {
      playTone(ctx, 523.25, 0.00, 0.13, 'triangle', 0.085);
      playTone(ctx, 659.25, 0.10, 0.13, 'triangle', 0.085);
      playTone(ctx, 783.99, 0.20, 0.22, 'triangle', 0.095);
    } else if (type === 'choice') {
      playTone(ctx, 440.00, 0.00, 0.08, 'sine', 0.080);
      playTone(ctx, 659.25, 0.06, 0.13, 'triangle', 0.085);
    } else if (type === 'danger') {
      playTone(ctx, 246.94, 0.00, 0.12, 'sawtooth', 0.065);
      playTone(ctx, 185.00, 0.11, 0.18, 'sawtooth', 0.070);
    } else if (type === 'nextDay') {
      playTone(ctx, 587.33, 0.00, 0.10, 'sine', 0.080);
      playTone(ctx, 880.00, 0.08, 0.20, 'triangle', 0.090);
    } else if (type === 'outside') {
      playTone(ctx, 190.00, 0.00, 0.07, 'sine', 0.038, 140.00);
    } else if (type === 'victory') {
      playTone(ctx, 523.25, 0.00, 0.14, 'triangle', 0.090);
      playTone(ctx, 659.25, 0.11, 0.14, 'triangle', 0.090);
      playTone(ctx, 783.99, 0.22, 0.14, 'triangle', 0.095);
      playTone(ctx, 1046.5, 0.34, 0.32, 'triangle', 0.105);
    } else if (type === 'defeat') {
      playTone(ctx, 293.66, 0.00, 0.20, 'sawtooth', 0.075);
      playTone(ctx, 220.00, 0.18, 0.30, 'sawtooth', 0.080);
    }
  } catch (e) {}
}

document.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (btn) {
    const soundType = btn.getAttribute('data-sound');
    if (soundType === 'ui') {
      playActionSound('choice');
    }
    return;
  }
  if (event.target.closest('.tech-term') || event.target.closest('input') || event.target.closest('label')) {
    return;
  }
  playActionSound('outside');
});

function toggleAudio() {
  sfxEnabled = !sfxEnabled;
  document.getElementById('sound-btn').textContent = sfxEnabled ? '🔊 SFX' : '🔇 SFX';
}

const LOFI_CHORDS = [
  [174.61, 220.00, 261.63, 329.63],
  [164.81, 196.00, 246.94, 293.66],
  [146.83, 174.61, 220.00, 261.63],
  [130.81, 196.00, 246.94, 293.66]
];

function startLoFiAmbient() {
  if (!lofiEnabled || lofiTimer) return;
  try {
    const ctx = ensureAudioContext();

    const masterLofiGain = ctx.createGain();
    masterLofiGain.gain.value = 0.085;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 740;
    lowpass.Q.value = 0.8;

    lowpass.connect(masterLofiGain);
    masterLofiGain.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.14;
    }
    lofiNoiseNode = ctx.createBufferSource();
    lofiNoiseNode.buffer = noiseBuffer;
    lofiNoiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1100;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.018;

    lofiNoiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    lofiNoiseNode.start();

    const playLofiBar = () => {
      if (!lofiEnabled) return;
      const now = ctx.currentTime;
      const chord = LOFI_CHORDS[lofiChordStep % LOFI_CHORDS.length];
      lofiChordStep++;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * (1 + (idx - 1.5) * 0.0018), now);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(idx === 0 ? 0.28 : 0.16, now + 0.18);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);

        osc.connect(noteGain);
        noteGain.connect(lowpass);
        osc.start(now);
        osc.stop(now + 3.2);
      });

      [0, 1.6].forEach((beatOffset) => {
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(105, now + beatOffset);
        kick.frequency.exponentialRampToValueAtTime(42, now + beatOffset + 0.14);
        kickGain.gain.setValueAtTime(0.11, now + beatOffset);
        kickGain.gain.exponentialRampToValueAtTime(0.0001, now + beatOffset + 0.18);
        kick.connect(kickGain);
        kickGain.connect(ctx.destination);
        kick.start(now + beatOffset);
        kick.stop(now + beatOffset + 0.2);
      });
    };

    playLofiBar();
    lofiTimer = setInterval(playLofiBar, 3200);
  } catch (e) {}
}

function stopLoFiAmbient() {
  if (lofiTimer) {
    clearInterval(lofiTimer);
    lofiTimer = null;
  }
  if (lofiNoiseNode) {
    try {
      lofiNoiseNode.stop();
    } catch (e) {}
    lofiNoiseNode = null;
  }
}

function toggleLoFiMusic() {
  lofiEnabled = !lofiEnabled;
  document.getElementById('music-btn').textContent = lofiEnabled ? '🎵 Lo-Fi ON' : '🎵 Lo-Fi OFF';
  if (lofiEnabled) {
    startLoFiAmbient();
  } else {
    stopLoFiAmbient();
  }
}
