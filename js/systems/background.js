/* =========================================================================
   REALISTIC LUNAR SURFACE, CRATERS & EARTHRISE BACKGROUND CANVAS
   ========================================================================= */
const lunarCanvas = document.getElementById('lunar-bg-canvas');
const lunarCtx = lunarCanvas.getContext('2d');

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function drawLunarLandscape() {
  const w = (lunarCanvas.width = window.innerWidth);
  const h = (lunarCanvas.height = window.innerHeight);
  const rand = seededRandom(42026);

  const skyGrad = lunarCtx.createLinearGradient(0, 0, 0, h * 0.72);
  skyGrad.addColorStop(0, '#020408');
  skyGrad.addColorStop(0.75, '#060c14');
  skyGrad.addColorStop(1, '#0d1722');
  lunarCtx.fillStyle = skyGrad;
  lunarCtx.fillRect(0, 0, w, h);

  const starCount = Math.floor((w * h) / 5500);
  for (let i = 0; i < starCount; i++) {
    const sx = rand() * w;
    const sy = rand() * (h * 0.68);
    const radius = rand() > 0.85 ? 1.5 : 0.9;
    const alpha = 0.35 + rand() * 0.65;
    lunarCtx.fillStyle = rand() > 0.9 ? `rgba(180, 225, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
    lunarCtx.beginPath();
    lunarCtx.arc(sx, sy, radius, 0, Math.PI * 2);
    lunarCtx.fill();
  }

  const earthX = w * 0.82;
  const earthY = h * 0.19;
  const earthR = Math.max(26, Math.min(48, w * 0.036));

  const haloGrad = lunarCtx.createRadialGradient(earthX, earthY, earthR * 0.8, earthX, earthY, earthR * 2.1);
  haloGrad.addColorStop(0, 'rgba(72, 168, 255, 0.32)');
  haloGrad.addColorStop(1, 'rgba(72, 168, 255, 0)');
  lunarCtx.fillStyle = haloGrad;
  lunarCtx.beginPath();
  lunarCtx.arc(earthX, earthY, earthR * 2.1, 0, Math.PI * 2);
  lunarCtx.fill();

  lunarCtx.save();
  lunarCtx.beginPath();
  lunarCtx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  lunarCtx.clip();

  const oceanGrad = lunarCtx.createRadialGradient(
    earthX - earthR * 0.35,
    earthY - earthR * 0.35,
    earthR * 0.1,
    earthX,
    earthY,
    earthR * 1.1
  );
  oceanGrad.addColorStop(0, '#4bb4ff');
  oceanGrad.addColorStop(0.65, '#1558a8');
  oceanGrad.addColorStop(1, '#061833');
  lunarCtx.fillStyle = oceanGrad;
  lunarCtx.fillRect(earthX - earthR, earthY - earthR, earthR * 2, earthR * 2);

  lunarCtx.fillStyle = 'rgba(76, 175, 112, 0.72)';
  lunarCtx.beginPath();
  lunarCtx.ellipse(earthX - earthR * 0.25, earthY - earthR * 0.15, earthR * 0.34, earthR * 0.22, 0.4, 0, Math.PI * 2);
  lunarCtx.ellipse(earthX + earthR * 0.22, earthY + earthR * 0.12, earthR * 0.28, earthR * 0.32, -0.3, 0, Math.PI * 2);
  lunarCtx.fill();

  lunarCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  lunarCtx.beginPath();
  lunarCtx.ellipse(earthX - earthR * 0.1, earthY - earthR * 0.42, earthR * 0.55, earthR * 0.11, 0.2, 0, Math.PI * 2);
  lunarCtx.ellipse(earthX + earthR * 0.15, earthY + earthR * 0.28, earthR * 0.48, earthR * 0.09, -0.15, 0, Math.PI * 2);
  lunarCtx.fill();

  const shadowGrad = lunarCtx.createLinearGradient(earthX - earthR, earthY - earthR * 0.3, earthX + earthR, earthY + earthR * 0.6);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(0.58, 'rgba(2, 6, 16, 0.25)');
  shadowGrad.addColorStop(0.85, 'rgba(2, 5, 12, 0.88)');
  lunarCtx.fillStyle = shadowGrad;
  lunarCtx.fillRect(earthX - earthR, earthY - earthR, earthR * 2, earthR * 2);
  lunarCtx.restore();

  const horizonY = h * 0.64;
  lunarCtx.fillStyle = '#1b2028';
  lunarCtx.beginPath();
  lunarCtx.moveTo(0, horizonY);
  const ridgeSteps = 26;
  for (let i = 0; i <= ridgeSteps; i++) {
    const rx = (w / ridgeSteps) * i;
    const peak = Math.sin(i * 0.65) * 18 + Math.cos(i * 1.45) * 14 + (rand() - 0.5) * 10;
    lunarCtx.lineTo(rx, horizonY - 14 - Math.abs(peak));
  }
  lunarCtx.lineTo(w, h);
  lunarCtx.lineTo(0, h);
  lunarCtx.closePath();
  lunarCtx.fill();

  const groundGrad = lunarCtx.createLinearGradient(0, horizonY - 10, 0, h);
  groundGrad.addColorStop(0, '#2a303a');
  groundGrad.addColorStop(0.35, '#20252e');
  groundGrad.addColorStop(1, '#12161c');
  lunarCtx.fillStyle = groundGrad;
  lunarCtx.beginPath();
  lunarCtx.moveTo(0, horizonY + 4);
  lunarCtx.quadraticCurveTo(w * 0.32, horizonY - 14, w * 0.66, horizonY + 6);
  lunarCtx.quadraticCurveTo(w * 0.85, horizonY + 14, w, horizonY - 2);
  lunarCtx.lineTo(w, h);
  lunarCtx.lineTo(0, h);
  lunarCtx.closePath();
  lunarCtx.fill();

  const craters = [
    { x: w * 0.14, y: h * 0.76, rx: 68, ry: 18 },
    { x: w * 0.46, y: h * 0.72, rx: 44, ry: 11 },
    { x: w * 0.78, y: h * 0.81, rx: 92, ry: 24 },
    { x: w * 0.30, y: h * 0.89, rx: 110, ry: 27 },
    { x: w * 0.62, y: h * 0.92, rx: 56, ry: 14 },
    { x: w * 0.89, y: h * 0.70, rx: 36, ry: 9 },
    { x: w * 0.08, y: h * 0.93, rx: 48, ry: 12 }
  ];

  craters.forEach((c) => {
    lunarCtx.fillStyle = 'rgba(130, 142, 160, 0.22)';
    lunarCtx.beginPath();
    lunarCtx.ellipse(c.x, c.y + 2, c.rx * 1.05, c.ry * 1.08, 0, 0, Math.PI * 2);
    lunarCtx.fill();

    const bowlGrad = lunarCtx.createLinearGradient(c.x - c.rx, c.y - c.ry, c.x + c.rx, c.y + c.ry);
    bowlGrad.addColorStop(0, '#0c0f14');
    bowlGrad.addColorStop(0.55, '#191e26');
    bowlGrad.addColorStop(1, '#39414f');
    lunarCtx.fillStyle = bowlGrad;
    lunarCtx.beginPath();
    lunarCtx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
    lunarCtx.fill();
  });

  for (let i = 0; i < 38; i++) {
    const px = rand() * w;
    const py = horizonY + 16 + rand() * (h - horizonY - 20);
    const pr = 1.5 + rand() * 3.5;
    lunarCtx.fillStyle = rand() > 0.5 ? 'rgba(95, 105, 120, 0.38)' : 'rgba(10, 13, 18, 0.55)';
    lunarCtx.beginPath();
    lunarCtx.ellipse(px, py, pr * 1.4, pr * 0.8, rand(), 0, Math.PI * 2);
    lunarCtx.fill();
  }
}

window.addEventListener('resize', drawLunarLandscape);
drawLunarLandscape();