const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function analyzeAndRecolor() {
  const inputPath = path.join(__dirname, '../public/assets/crfal-logo-original.webp');
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Dimensions: ${width}x${height}, channels: ${channels}`);

  // Let's analyze the colors:
  // In the original logo:
  // - "CRF" and the bowl/dark blue parts: dark blue (e.g. R: 40-70, G: 60-90, B: 110-150)
  // - "AL": vibrant red (R: 200-255, G: 30-70, B: 40-80)
  // - Cyan/sky blue mosaic tiles on the sail: light blues (R: 0-150, G: 150-240, B: 200-255)
  // - Transparent background: alpha == 0
  
  // We want to transform:
  // 1. Maintain exact alpha and pixel boundaries (preserves 100% of the format, edges, curves and geometric features)
  // 2. Map every pixel into the noble colors of the carteira profissional:
  //    - Marrom e Dourado (Couro Marrom Nobre & Ouro Nobre/Dourado Metálico da carteira)
  // Let's create:
  // Option A: Pure Metallic Gold Foil (like the stamped gold foil on the leather cover: letters CRF, AL, bowl and sail in rich golden metallic tones with natural gradient and luminance preserved).
  // Option B: Dual Tone Marrom & Dourado (CRF in rich warm dark chocolate brown / leather tone with gold highlight, AL in radiant gold foil, and the sail / bowl with gold & warm amber gradients).
  // Option C: Full Gold Foil Edition (just like the gold lettering on the front of the carteira profissional).
  
  // Let's generate both and see!

  // --- VERSION 1: Pure Gold Foil (Embossed Gold like the Carteira front cover) ---
  const goldData = Buffer.from(data);
  for (let i = 0; i < goldData.length; i += 4) {
    const r = goldData[i];
    const g = goldData[i + 1];
    const b = goldData[i + 2];
    const a = goldData[i + 3];

    if (a > 5) {
      // Calculate luminance of the original pixel
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // Horizontal or luminance factor to give a subtle metallic gold sheen
      // Gold palette from dark gold to radiant champagne:
      // Dark gold: #8A6517 (138, 101, 23)
      // Classic gold: #D4AF37 (212, 175, 55)
      // Light gold / highlight: #FFF0B3 (255, 240, 179)
      
      let outR, outG, outB;
      if (lum < 0.35) {
        // Deep warm gold/bronze
        const t = lum / 0.35;
        outR = Math.round(180 + t * 45); // 180 -> 225
        outG = Math.round(135 + t * 45); // 135 -> 180
        outB = Math.round(35 + t * 30);  // 35 -> 65
      } else if (lum < 0.7) {
        // Rich vibrant gold
        const t = (lum - 0.35) / 0.35;
        outR = Math.round(225 + t * 25); // 225 -> 250
        outG = Math.round(180 + t * 40); // 180 -> 220
        outB = Math.round(65 + t * 65);  // 65 -> 130
      } else {
        // Radiant highlight gold
        const t = (lum - 0.7) / 0.3;
        outR = Math.round(250 + t * 5);  // 250 -> 255
        outG = Math.round(220 + t * 30); // 220 -> 250
        outB = Math.round(130 + t * 90); // 130 -> 220
      }

      goldData[i] = Math.min(255, outR);
      goldData[i + 1] = Math.min(255, outG);
      goldData[i + 2] = Math.min(255, outB);
      // Keep exact original alpha!
      goldData[i + 3] = a;
    }
  }

  // --- VERSION 2: Marrom & Dourado (Dual Tone Carteira: CRF in warm brown/caramel, AL in bright gold, Sail in golden amber) ---
  const marromDouradoData = Buffer.from(data);
  for (let i = 0; i < marromDouradoData.length; i += 4) {
    const r = marromDouradoData[i];
    const g = marromDouradoData[i + 1];
    const b = marromDouradoData[i + 2];
    const a = marromDouradoData[i + 3];

    if (a > 5) {
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isRedish = (r > g + 40 && r > b + 40); // The "AL" letters
      const isCyanLight = (b > r + 30 && g > r + 20 && lum > 0.4); // The light tiles of the sail

      let outR, outG, outB;

      if (isRedish) {
        // "AL" in Radiant Gold Foil (#F5D061 -> #D4AF37)
        outR = Math.round(230 + lum * 25);
        outG = Math.round(185 + lum * 45);
        outB = Math.round(60 + lum * 70);
      } else if (isCyanLight) {
        // Sail mosaic tiles: Warm golden champagne / amber gradient
        outR = Math.round(245 + lum * 10);
        outG = Math.round(210 + lum * 35);
        outB = Math.round(120 + lum * 90);
      } else {
        // "CRF" and chalice: Deep warm leather brown / bronze gold (#E5BA55 on darker leather or warm golden bronze)
        // Since background of site is dark brown, the logo must be light/golden enough to contrast beautifully!
        outR = Math.round(210 + lum * 40);
        outG = Math.round(165 + lum * 50);
        outB = Math.round(50 + lum * 60);
      }

      marromDouradoData[i] = Math.min(255, Math.max(0, outR));
      marromDouradoData[i + 1] = Math.min(255, Math.max(0, outG));
      marromDouradoData[i + 2] = Math.min(255, Math.max(0, outB));
      marromDouradoData[i + 3] = a;
    }
  }

  // --- VERSION 3: Dual Tone with distinct Marrom & Dourado separation ---
  // Where CRF is warm bronze/caramel gold (#C59B27) and AL is radiant golden foil (#FFDF78)
  const dualToneData = Buffer.from(data);
  for (let i = 0; i < dualToneData.length; i += 4) {
    const r = dualToneData[i];
    const g = dualToneData[i + 1];
    const b = dualToneData[i + 2];
    const a = dualToneData[i + 3];

    if (a > 5) {
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isRedish = (r > g + 30 && r > b + 30); // "AL"

      let outR, outG, outB;
      if (isRedish) {
        // "AL" in Brilliant Light Gold Foil
        outR = Math.round(255 * (0.85 + lum * 0.15));
        outG = Math.round(225 * (0.8 + lum * 0.2));
        outB = Math.round(120 * (0.6 + lum * 0.4));
      } else {
        // "CRF" and Chalice in Classic Deep Gold Foil
        outR = Math.round(212 * (0.7 + lum * 0.3));
        outG = Math.round(175 * (0.7 + lum * 0.3));
        outB = Math.round(55 * (0.7 + lum * 0.3));
      }

      dualToneData[i] = Math.min(255, outR);
      dualToneData[i + 1] = Math.min(255, outG);
      dualToneData[i + 2] = Math.min(255, outB);
      dualToneData[i + 3] = a;
    }
  }

  // Save all variants as high quality PNGs (lossless alpha)
  await sharp(goldData, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '../public/assets/crfal-logo-dourado.png'));

  await sharp(marromDouradoData, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '../public/assets/crfal-logo-marrom-dourado.png'));

  await sharp(dualToneData, { raw: { width, height, channels } })
    .png({ quality: 100 })
    .toFile(path.join(__dirname, '../public/assets/crfal-logo-carteira.png'));

  console.log('Successfully generated pixel-exact recolored versions of the logo!');
}

analyzeAndRecolor().catch(err => {
  console.error('Error recoloring logo:', err);
  process.exit(1);
});
