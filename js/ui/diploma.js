/* =========================================================================
   PIXEL-ART REALISTIC NASA DIPLOMA GENERATOR & PNG EXPORT
   ========================================================================= */
function getFinalRankInfo() {
  const systemsAvg = Math.round((game.air + game.battery + game.shield + game.hull) / 4);

  if (game.science >= 80 && systemsAvg >= 45) {
    return {
      title: 'LEGENDARY ARTEMIS IV COMMANDER',
      subtitle: 'Mastered all lunar survival & returned a full Orion science vault!',
      tierColor: '#ffd166'
    };
  } else if (game.science >= 55) {
    return {
      title: 'MISSION COMMANDER',
      subtitle: 'Completed 30 days on the Moon with strong scientific discoveries.',
      tierColor: '#00ff66'
    };
  } else if (game.science >= 30) {
    return {
      title: 'ARTEMIS IV FIELD SPECIALIST',
      subtitle: 'Survived 30 lunar days and brought back partial research samples.',
      tierColor: '#61caff'
    };
  } else {
    return {
      title: 'ROOKIE LUNAR SURVIVOR',
      subtitle: 'Survived the 30 days, but Orion returned with minimal science data.',
      tierColor: '#ff9e9e'
    };
  }
}

function renderPixelDiplomaCanvas() {
  const canvas = document.getElementById('diploma-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const rankInfo = getFinalRankInfo();
  const systemsAvg = Math.round((game.air + game.battery + game.shield + game.hull) / 4);

  ctx.imageSmoothingEnabled = false;

  ctx.fillStyle = '#f5eedc';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = '#ebe1c8';
  for (let y = 16; y < H - 16; y += 8) {
    for (let x = 16; x < W - 16; x += 8) {
      if ((x + y) % 16 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  ctx.fillStyle = '#0b2240';
  ctx.fillRect(8, 8, W - 16, 8);
  ctx.fillRect(8, H - 16, W - 16, 8);
  ctx.fillRect(8, 8, 8, H - 16);
  ctx.fillRect(W - 16, 8, 8, H - 16);

  ctx.fillStyle = '#c9972b';
  ctx.fillRect(20, 20, W - 40, 4);
  ctx.fillRect(20, H - 24, W - 40, 4);
  ctx.fillRect(20, 20, 4, H - 40);
  ctx.fillRect(W - 24, 20, 4, H - 40);

  const corners = [
    [14, 14],
    [W - 26, 14],
    [14, H - 26],
    [W - 26, H - 26]
  ];
  corners.forEach(([cx, cy]) => {
    ctx.fillStyle = '#c9972b';
    ctx.fillRect(cx, cy, 12, 12);
    ctx.fillStyle = '#fc3d21';
    ctx.fillRect(cx + 4, cy + 4, 4, 4);
  });

  const badgeX = 68;
  const badgeY = 66;
  for (let dy = -24; dy <= 24; dy += 2) {
    for (let dx = -24; dx <= 24; dx += 2) {
      if (dx * dx + dy * dy <= 24 * 24) {
        ctx.fillStyle = '#0b3d91';
        ctx.fillRect(badgeX + dx, badgeY + dy, 2, 2);
      }
    }
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(badgeX - 12, badgeY - 10, 2, 2);
  ctx.fillRect(badgeX + 10, badgeY - 12, 2, 2);
  ctx.fillRect(badgeX + 12, badgeY + 8, 2, 2);
  ctx.fillRect(badgeX - 10, badgeY + 12, 2, 2);

  ctx.fillStyle = '#fc3d21';
  for (let i = -20; i <= 20; i += 2) {
    const yOff = Math.abs(i) * 0.7 - 10;
    ctx.fillRect(badgeX + i, badgeY + yOff, 3, 4);
  }
  ctx.fillStyle = '#ffffff';
  for (let i = -22; i <= 22; i += 2) {
    ctx.fillRect(badgeX + i, badgeY - i * 0.35, 2, 2);
  }

  const moonX = W - 68;
  const moonY = 66;
  for (let dy = -22; dy <= 22; dy += 2) {
    for (let dx = -22; dx <= 22; dx += 2) {
      if (dx * dx + dy * dy <= 22 * 22) {
        ctx.fillStyle = (dx + dy > 8) ? '#8f99a8' : '#cfd6e0';
        ctx.fillRect(moonX + dx, moonY + dy, 2, 2);
      }
    }
  }
  ctx.fillStyle = '#737d8c';
  ctx.fillRect(moonX - 8, moonY - 6, 6, 6);
  ctx.fillRect(moonX + 6, moonY + 4, 8, 6);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(moonX - 16, moonY - 18, 8, 6);
  ctx.fillStyle = '#fc3d21';
  ctx.fillRect(moonX - 20, moonY - 16, 4, 2);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0b3d91';
  ctx.font = 'bold 13px "Press Start 2P", monospace';
  ctx.fillText('NATIONAL AERONAUTICS & SPACE AGENCY', W / 2, 56);

  ctx.fillStyle = '#fc3d21';
  ctx.font = 'bold 10px "Press Start 2P", monospace';
  ctx.fillText('ARTEMIS IV • ORION LUNAR OUTPOST', W / 2, 76);

  ctx.fillStyle = '#c9972b';
  ctx.fillRect(110, 88, W - 220, 2);

  ctx.fillStyle = '#222b38';
  ctx.font = 'bold 11px "Chakra Petch", sans-serif';
  ctx.fillText('THIS OFFICIAL MISSION DIPLOMA CERTIFIES THAT', W / 2, 114);

  ctx.fillStyle = '#0b2240';
  ctx.fillRect(90, 124, W - 180, 42);
  ctx.fillStyle = '#c9972b';
  ctx.fillRect(90, 124, W - 180, 2);
  ctx.fillRect(90, 164, W - 180, 2);

  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 18px "Press Start 2P", monospace';
  ctx.fillText(game.astronautName.toUpperCase(), W / 2, 153);

  ctx.fillStyle = '#222b38';
  ctx.font = 'bold 12px "Chakra Petch", sans-serif';
  ctx.fillText('SUCCESSFULLY SURVIVED 30 REAL DAYS ON THE MOON & EARNED THE RANK OF:', W / 2, 188);

  ctx.fillStyle = '#0b3d91';
  ctx.font = 'bold 12px "Press Start 2P", monospace';
  ctx.fillText(rankInfo.title, W / 2, 212);

  ctx.fillStyle = '#3b4859';
  ctx.font = 'bold 12px "Nunito", sans-serif';
  ctx.fillText(rankInfo.subtitle, W / 2, 232);

  ctx.fillStyle = '#e6dcc3';
  ctx.fillRect(64, 246, W - 128, 66);
  ctx.strokeStyle = '#0b2240';
  ctx.lineWidth = 2;
  ctx.strokeRect(64, 246, W - 128, 66);

  ctx.fillStyle = '#0b2240';
  ctx.font = 'bold 12px "Chakra Petch", sans-serif';
  const diffTag = (typeof DIFFICULTY_CONFIGS !== 'undefined' && DIFFICULTY_CONFIGS[game.difficulty])
    ? DIFFICULTY_CONFIGS[game.difficulty].diplomaLabel
    : 'RECOMMENDED';
  ctx.fillText(`DIFFICULTY: ${diffTag}   |   NASA LOG: ${game.windowStart} TO ${game.windowEnd}`, W / 2, 266);
  ctx.fillText(
    `ORION SCIENCE PROGRESS: ${game.science}% (${game.samplesCollected} SAMPLES)   |   BASE HEALTH AVG: ${systemsAvg}%`,
    W / 2,
    286
  );
  ctx.fillText(
    `FINAL SYSTEMS: AIR ${game.air}%  •  BATTERY ${game.battery}%  •  SHIELD ${game.shield}%  •  HULL ${game.hull}%`,
    W / 2,
    304
  );

  const sealX = W / 2;
  const sealY = 356;
  for (let dy = -22; dy <= 22; dy += 2) {
    for (let dx = -22; dx <= 22; dx += 2) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 22) {
        ctx.fillStyle = dist > 17 ? '#b88218' : '#f2be42';
        ctx.fillRect(sealX + dx, sealY + dy, 2, 2);
      }
    }
  }
  ctx.fillStyle = '#0b2240';
  ctx.font = 'bold 7px "Press Start 2P", monospace';
  ctx.fillText('NASA', sealX, sealY - 2);
  ctx.fillText('30 SOL', sealX, sealY + 9);

  ctx.fillStyle = '#0b2240';
  ctx.fillRect(58, 366, 175, 2);
  ctx.font = 'italic bold 14px Georgia, serif';
  ctx.fillText('E. Vance', 145, 360);
  ctx.font = 'bold 10px "Chakra Petch", sans-serif';
  ctx.fillText('LEAD FLIGHT DIRECTOR, JSC', 145, 380);

  ctx.fillRect(W - 233, 366, 175, 2);
  ctx.font = 'italic bold 14px Georgia, serif';
  ctx.fillText('M. Torres', W - 145, 360);
  ctx.font = 'bold 10px "Chakra Petch", sans-serif';
  ctx.fillText('ARTEMIS IV MISSION MANAGER', W - 145, 380);
}

function showVictoryScreen() {
  playActionSound('victory');
  const rankInfo = getFinalRankInfo();
  document.getElementById('victory-subtitle').textContent =
    `Welcome home, ${game.astronautName}! Rank earned: ${rankInfo.title}`;
  renderPixelDiplomaCanvas();
  document.getElementById('victory-screen').classList.remove('hidden');
}

function downloadDiplomaPNG() {
  playActionSound('choice');
  const canvas = document.getElementById('diploma-canvas');
  const link = document.createElement('a');
  const safeName = game.astronautName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.download = `NASA_Artemis_IV_Diploma_${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}