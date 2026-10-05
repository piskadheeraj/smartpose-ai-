/**
 * Client-side fast computer-vision heuristic to accurately classify
 * uploaded photos into one of the 5 supported settings:
 * 'beach' | 'buildings' | 'hills' | 'forest' | 'cafe'
 */

export type SettingCategory = 'cafe' | 'beach' | 'forest' | 'buildings' | 'hills';

export async function detectSettingFromImage(imageDataUrl: string): Promise<SettingCategory> {
  return new Promise((resolve) => {
    try {
      const img = new Image();

      img.onload = () => {
        try {
          const sampleSize = 64;
          const canvas = document.createElement('canvas');
          canvas.width = sampleSize;
          canvas.height = sampleSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve('beach');
            return;
          }

          ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
          const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
          const data = imgData.data;

          let pureGreenCount = 0;       // Forest foliage
          let waterOrSkyBlueCount = 0;   // Beach ocean & open sky
          let sandOrShoreCount = 0;      // Beach golden/tan sand
          let urbanNeutralCount = 0;     // Buildings: concrete, glass, steel, asphalt
          let indoorWarmDimCount = 0;    // Cafe: interior warm incandescent light
          let mountainHazeCount = 0;     // Hills: high-altitude horizon & peaks
          let totalSamples = 0;
          let totalBrightness = 0;

          // Top half vs bottom half spatial distribution
          let topBlueCount = 0;
          let bottomSandOrGroundCount = 0;

          const halfHeight = sampleSize / 2;

          for (let y = 0; y < sampleSize; y += 2) {
            for (let x = 0; x < sampleSize; x += 2) {
              const idx = (y * sampleSize + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              totalSamples++;

              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const delta = max - min;
              const brightness = (r + g + b) / 3;
              totalBrightness += brightness;

              const sat = max === 0 ? 0 : delta / max;

              let hue = 0;
              if (delta !== 0) {
                if (max === r) hue = ((g - b) / delta) % 6;
                else if (max === g) hue = (b - r) / delta + 2;
                else hue = (r - g) / delta + 4;
                hue = Math.round(hue * 60);
                if (hue < 0) hue += 360;
              }

              const isTop = y < halfHeight;

              // 1. BEACH: Blue water/sky (hue 170°-250°) AND warm shoreline sand (hue 30°-55°, brightness > 125, r > g > b)
              const isBlueWaterSky = (hue >= 170 && hue <= 250 && b > r && sat > 0.12 && brightness > 80);
              const isSand = (hue >= 28 && hue <= 56 && brightness >= 120 && r >= g && g > b && sat >= 0.12 && sat <= 0.65);

              if (isBlueWaterSky) {
                waterOrSkyBlueCount++;
                if (isTop) topBlueCount++;
              }
              if (isSand) {
                sandOrShoreCount++;
                if (!isTop) bottomSandOrGroundCount++;
              }

              // 2. URBAN / BUILDINGS:
              // Modern architecture is dominated by low-saturation neutrals (concrete, steel, glass, stone, asphalt)
              // OR high-contrast architectural edges (pure blacks, whites, grays)
              const isUrbanNeutral = (sat < 0.22 && brightness > 35 && brightness < 235);
              const isGlassReflection = (hue >= 180 && hue <= 225 && sat < 0.35 && brightness > 110);
              if (isUrbanNeutral || isGlassReflection) {
                urbanNeutralCount++;
              }

              // 3. FOREST:
              // Must be DISTINCTLY green (hue 70°-160° with green significantly higher than red and blue)
              const isRealGreenLeaf = (hue >= 70 && hue <= 160 && g > r * 1.15 && g > b * 1.15 && sat > 0.20);
              if (isRealGreenLeaf) {
                pureGreenCount++;
              }

              // 4. CAFE / INDOOR:
              // Warm indoor incandescent illumination, espresso wood, terracotta, low-to-mid overall brightness
              const isCafeWarmth = (hue >= 15 && hue <= 42 && r > g * 1.25 && g > b * 1.25 && brightness < 160 && brightness > 40);
              if (isCafeWarmth) {
                indoorWarmDimCount++;
              }

              // 5. HILLS / MOUNTAINS:
              // Sky above, jagged terrain/valley below
              if (hue >= 185 && hue <= 235 && brightness > 160 && sat < 0.45) {
                mountainHazeCount++;
              }
            }
          }

          const avgBrightness = totalBrightness / (totalSamples || 1);

          // Spatial Beach confirmation: Blue top (sky/sea) + sand bottom + bright overall
          const beachSpatialBoost = (topBlueCount > 15 && bottomSandOrGroundCount > 10 && avgBrightness > 115) ? 1.6 : 1.0;

          // Building architecture confirmation: Dominant neutral surfaces + moderate-to-bright contrast
          const buildingBoost = (urbanNeutralCount > totalSamples * 0.35 && pureGreenCount < totalSamples * 0.15) ? 1.5 : 1.0;

          // Weighted scoring
          const scores = {
            beach: (waterOrSkyBlueCount * 1.4 + sandOrShoreCount * 1.6) * beachSpatialBoost,
            buildings: (urbanNeutralCount * 1.35) * buildingBoost,
            forest: pureGreenCount * 2.2, // green is specific, so higher weight per pixel
            cafe: indoorWarmDimCount * 1.3 * (avgBrightness < 130 ? 1.4 : 0.7),
            hills: mountainHazeCount * 1.1,
          };

          let bestCategory: SettingCategory = 'buildings';
          let maxScore = -1;

          for (const [cat, score] of Object.entries(scores)) {
            if (score > maxScore) {
              maxScore = score;
              bestCategory = cat as SettingCategory;
            }
          }

          resolve(bestCategory);
        } catch {
          resolve('beach');
        }
      };

      img.onerror = () => resolve('beach');
      img.src = imageDataUrl;
    } catch {
      resolve('beach');
    }
  });
}
