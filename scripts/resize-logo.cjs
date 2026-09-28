// Gera versões pré-redimensionadas da logo com reamostragem de área (box filter),
// muito superior ao downscale de 20:1 que o navegador fazia em tempo real.
// Uso: node scripts/resize-logo.cjs  (requer pngjs instalado)
const fs = require("fs");
const path = require("path");
const { PNG } = require(path.join(process.cwd(), "node_modules", "pngjs"));

const SRC = "public/media/bem-bonita-logo-transparente.png";
const src = PNG.sync.read(fs.readFileSync(SRC));
const { width: W, height: H, data } = src;

// Reamostragem por área com premultiplicação alfa (evita halo escuro em bordas transparentes).
function resizeArea(targetW, targetH) {
  const out = Buffer.alloc(targetW * targetH * 4);
  const xRatio = W / targetW;
  const yRatio = H / targetH;

  for (let ty = 0; ty < targetH; ty += 1) {
    const y0 = Math.floor(ty * yRatio);
    const y1 = Math.min(H, Math.max(y0 + 1, Math.ceil((ty + 1) * yRatio)));
    for (let tx = 0; tx < targetW; tx += 1) {
      const x0 = Math.floor(tx * xRatio);
      const x1 = Math.min(W, Math.max(x0 + 1, Math.ceil((tx + 1) * xRatio)));

      let aSum = 0;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      for (let y = y0; y < y1; y += 1) {
        for (let x = x0; x < x1; x += 1) {
          const i = (y * W + x) * 4;
          const alpha = data[i + 3];
          const w = alpha / 255;
          aSum += alpha;
          rSum += data[i] * w;
          gSum += data[i + 1] * w;
          bSum += data[i + 2] * w;
        }
      }
      const count = (y1 - y0) * (x1 - x0);
      const o = (ty * targetW + tx) * 4;
      const aAvg = aSum / count;
      const wAvg = aAvg / 255;
      out[o] = wAvg > 0 ? Math.round(rSum / count / wAvg) : 0;
      out[o + 1] = wAvg > 0 ? Math.round(gSum / count / wAvg) : 0;
      out[o + 2] = wAvg > 0 ? Math.round(bSum / count / wAvg) : 0;
      out[o + 3] = Math.round(aAvg);
    }
  }
  return out;
}

const targets = [
  { w: 640, suffix: "640" },
  { w: 960, suffix: "960" },
];
for (const t of targets) {
  const targetH = Math.round((H * t.w) / W);
  const raw = resizeArea(t.w, targetH);
  const png = new PNG({ width: t.w, height: targetH });
  raw.copy(png.data);
  const dest = `public/media/bem-bonita-logo-${t.suffix}.png`;
  fs.writeFileSync(dest, PNG.sync.write(png, { deflateLevel: 9 }));
  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(`${dest} -> ${t.w}x${targetH}, ${kb} KB`);
}
console.log("concluido");
