export async function generatePoster(quote) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // 1. Dark Vignette Background
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(0, 0, 1080, 1080);

  // 2. Load and draw the Portrait (Left aligned, black & white with smooth fade)
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = quote.image;

  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve; // proceed even if image fails
  });

  if (img.complete && img.naturalWidth > 0) {
    // Draw portrait on the right or left with grayscale & high contrast
    ctx.save();
    ctx.filter = 'grayscale(100%) contrast(120%) brightness(85%)';
    // Position so head is visible dramatically
    const scale = Math.max(1080 / img.naturalHeight, 600 / img.naturalWidth);
    const sw = img.naturalWidth * scale;
    const sh = img.naturalHeight * scale;
    ctx.drawImage(img, 1080 - sw + 80, (1080 - sh) / 2, sw, sh);
    ctx.restore();

    // Dark gradient overlay from left to right so text is ultra readable
    const grad = ctx.createLinearGradient(0, 0, 1080, 0);
    grad.addColorStop(0, 'rgba(10, 10, 12, 0.98)');
    grad.addColorStop(0.45, 'rgba(10, 10, 12, 0.85)');
    grad.addColorStop(0.75, 'rgba(10, 10, 12, 0.3)');
    grad.addColorStop(1, 'rgba(10, 10, 12, 0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);
  }

  // 3. Film Grain texture effect
  const grainCanvas = document.createElement('canvas');
  grainCanvas.width = 120;
  grainCanvas.height = 120;
  const gctx = grainCanvas.getContext('2d');
  const gData = gctx.createImageData(120, 120);
  for (let i = 0; i < gData.data.length; i += 4) {
    const v = Math.random() * 255;
    gData.data[i] = v;
    gData.data[i + 1] = v;
    gData.data[i + 2] = v;
    gData.data[i + 3] = 18;
  }
  gctx.putImageData(gData, 0, 0);
  ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat');
  ctx.fillRect(0, 0, 1080, 1080);

  // 4. White vertical accent bar
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(80, 160, 6, 420);

  // 5. Draw Quote Text (Wrapped, with alternating white and golden-yellow words)
  ctx.textBaseline = 'top';
  ctx.font = '900 44px "Montserrat", "Segoe UI", sans-serif';

  const words = quote.text.split(' ');
  let line = '';
  let y = 160;
  const maxWidth = 540;
  const lineHeight = 62;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      renderStyledLine(ctx, line.trim(), 105, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  renderStyledLine(ctx, line.trim(), 105, y);

  // 6. Draw Author & Title
  y += lineHeight + 35;
  ctx.font = '700 32px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillStyle = '#eab308'; // Emre Göksan Gold
  ctx.fillText(`- ${quote.author} -`, 105, y);

  y += 42;
  ctx.font = '500 20px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText(quote.title, 105, y);

  // 7. University Crest & Emre Göksan Simulator Badge at bottom left
  ctx.font = '700 16px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText('EMRE GÖKSAN ENSTİTÜSÜ', 80, 960);
  ctx.font = '400 14px "Montserrat", "Segoe UI", sans-serif';
  ctx.fillText('RIGA TECHNICAL UNIVERSITY • FELSEFE VE ABSÜRT BİLİMLER', 80, 985);

  // Download Trigger
  const link = document.createElement('a');
  link.download = `emre_goksan_aforizma_${quote.id}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function renderStyledLine(ctx, lineText, x, y) {
  const parts = lineText.split(' ');
  let curX = x;
  parts.forEach((word) => {
    // Check if word should be highlighted gold (if uppercase or specific keywords)
    const isGold = word.length > 5 && (word.toUpperCase() === word || Math.random() > 0.65);
    ctx.fillStyle = isGold ? '#eab308' : '#ffffff';
    ctx.fillText(word + ' ', curX, y);
    curX += ctx.measureText(word + ' ').width;
  });
}
