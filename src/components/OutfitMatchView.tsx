import React, { useState } from 'react';
import { EnvironmentAnalysis, WardrobeRecommendations } from '../types';
import {
  Palette,
  Sun,
  Sparkles,
  Copy,
  Check,
  Camera,
  Compass,
} from 'lucide-react';

interface OutfitMatchViewProps {
  environment: EnvironmentAnalysis;
  wardrobeRecs?: WardrobeRecommendations;
  currentImage?: string | null;
  onBackToStudio?: () => void;
}

export const OutfitMatchView: React.FC<OutfitMatchViewProps> = ({
  environment,
  currentImage,
  onBackToStudio,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* SECTION 1: VENUE & LIGHTING BREAKDOWN BANNER */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold tracking-wide">
                {environment.settingType} Photography
              </span>
              <span className="text-stone-500" aria-hidden="true">·</span>
              <span className="text-stone-300 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {environment.lightingAnalysis.colorTemperature}
              </span>
              <span className="text-stone-500" aria-hidden="true">·</span>
              <span className="text-stone-400">{environment.lightingAnalysis.mood}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-stone-100 font-display tracking-tight">
              Lighting & Photo Colour Palette
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {environment.venueDescription}
            </p>

            {/* Lighting Tip Note */}
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-200/90 leading-relaxed">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block mb-0.5">Lighting Direction & Tip:</span>
                <span>{environment.lightingAnalysis.lightingTips}</span>
              </div>
            </div>
          </div>

          {/* Photo Thumbnail */}
          {currentImage && (
            <div className="shrink-0 bg-stone-950/80 border border-stone-800 rounded-2xl p-3 max-w-xs w-full lg:w-64">
              <div className="relative rounded-xl overflow-hidden border border-stone-800 aspect-video w-full bg-stone-900">
                <img
                  src={currentImage}
                  alt="Uploaded scene"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-stone-950/85 backdrop-blur-sm border border-stone-800 text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded">
                  Uploaded Photo
                </div>
              </div>
              <div className="mt-2 text-center text-[11px] text-stone-400 capitalize">
                {environment.settingType} Environment
              </div>
            </div>
          )}
        </div>

        {/* Framing & Camera Specs Bar */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-stone-500 text-[11px]">Primary Light</span>
            <span className="font-medium text-stone-200">{environment.lightingAnalysis.primarySource}</span>
          </div>
          <div>
            <span className="block text-stone-500 text-[11px]">Light Direction</span>
            <span className="font-medium text-stone-200">{environment.lightingAnalysis.direction}</span>
          </div>
          <div>
            <span className="block text-stone-500 text-[11px]">Camera Angle</span>
            <span className="font-medium text-stone-200">{environment.depthAndFraming.cameraAngle}</span>
          </div>
          <div>
            <span className="block text-stone-500 text-[11px]">Aperture Depth</span>
            <span className="font-medium text-stone-200">{environment.depthAndFraming.suggestedDepth}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: EXTRACTED PHOTO PALETTE (THE STAR OF THIS VIEW) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>Extracted Photo Palette</span>
              <span className="text-stone-500" aria-hidden="true">·</span>
              <span className="text-stone-400">{environment.colorPalette.length} Dominant & Accent Colours</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-100 font-display">
              Scene Colour Palette
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Exact ambient and architectural color swatches extracted from this particular photo.
            </p>
          </div>

          {onBackToStudio && (
            <button
              onClick={onBackToStudio}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-xl transition-colors self-start sm:self-auto"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Studio</span>
            </button>
          )}
        </div>

        {/* Big Swatches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {environment.colorPalette.map((swatch, idx) => (
            <div
              key={idx}
              className="bg-stone-900/50 hover:bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 transition-all shadow-sm flex items-center gap-4 group"
            >
              {/* Big Color Block */}
              <div
                className="w-16 h-16 rounded-2xl border-2 border-stone-700/80 shadow-md shrink-0 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: swatch.hex }}
              />

              {/* Swatch Info & Copy */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h4 className="text-sm font-bold text-stone-100 font-display truncate">
                    {swatch.name}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-400 shrink-0">
                    {swatch.role}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-300 uppercase">
                    {swatch.hex}
                  </span>

                  <button
                    onClick={() => handleCopyHex(swatch.hex)}
                    className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                    title={`Copy ${swatch.hex}`}
                  >
                    {copiedHex === swatch.hex ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-sans">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span className="font-sans">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Continuous Palette Strip */}
        <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-stone-400 text-xs">Continuous Palette Gradient:</span>
          <div className="flex items-center h-7 rounded-xl overflow-hidden border border-stone-700/80 w-full sm:w-auto sm:min-w-[320px]">
            {environment.colorPalette.map((s, idx) => (
              <div
                key={idx}
                className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity"
                style={{ backgroundColor: s.hex }}
                title={`${s.name} (${s.hex})`}
                onClick={() => handleCopyHex(s.hex)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
