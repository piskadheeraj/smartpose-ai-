import React, { useState } from 'react';
import { SceneAnalysisData, PoseSuggestion, MatchedOutfit } from '../types';
import { HumanAvatarFigure } from './HumanAvatarFigure';
import { Share2, Download, Check, Sparkles, X, Printer, ArrowLeft } from 'lucide-react';

interface ShootCardExportProps {
  sceneData: SceneAnalysisData;
  selectedPose: PoseSuggestion;
  currentImage: string | null;
  onClose: () => void;
}

export const ShootCardExport: React.FC<ShootCardExportProps> = ({
  sceneData,
  selectedPose,
  currentImage,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const featuredLook = sceneData.wardrobeRecommendations.matchedOutfits[0];

  const handleCopySummary = () => {
    const text = `📸 SMARTPOSE SHOOT CARD
Venue: ${sceneData.environment.venueDescription}
Lighting: ${sceneData.environment.lightingAnalysis.primarySource} (${sceneData.environment.lightingAnalysis.colorTemperature})
Pose: ${selectedPose.title} (${selectedPose.category}, ${selectedPose.vibe})
Photographer Cue: ${selectedPose.photographerDirections.cameraHeight}, ${selectedPose.photographerDirections.distance}
Prop: ${selectedPose.propIdea}
Outfit: ${featuredLook?.title || 'Harmonized look'}
Styling: ${featuredLook?.stylingHack || ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 shadow-2xl my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl transition-colors"
              title="Go back to studio"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back</span>
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SmartPose Photography Guide</span>
              </div>
              <h3 className="text-xl font-bold text-stone-100 font-display">
                Photography Shoot Card
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="mt-6 space-y-6 bg-stone-950 p-6 rounded-2xl border border-stone-800/80">
          {/* Top Row: Background Photo + Pose Outline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Scene Location"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-stone-500">
                  No Image Available
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 bg-stone-950/80 backdrop-blur-sm p-2 rounded-lg text-[11px] text-stone-300">
                <span className="font-semibold text-amber-400 block">Setting:</span>
                <span className="truncate block">{sceneData.environment.venueDescription}</span>
              </div>
            </div>

            {/* Avatar Pose Diagram */}
            <div className="relative aspect-[4/3] rounded-xl bg-stone-900 border border-stone-800 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-semibold text-stone-200">{selectedPose.title}</span>
                <span className="font-mono text-amber-400 text-[11px]">{selectedPose.vibe}</span>
              </div>
              <div className="flex-1 w-full max-h-40 my-auto flex items-center justify-center">
                <HumanAvatarFigure
                  settingType={sceneData.environment.settingType}
                  poseIndex={sceneData.poseSuggestions.findIndex((p) => p.id === selectedPose.id)}
                  poseId={selectedPose.id}
                  category={selectedPose.category}
                  title={selectedPose.title}
                  summary={selectedPose.summary}
                  propIdea={selectedPose.propIdea}
                  keypoints={selectedPose.skeletonKeypoints}
                  color="#F59E0B"
                  opacity={1}
                />
              </div>
              <div className="text-[11px] text-stone-400 flex justify-between">
                <span>{selectedPose.photographerDirections.cameraHeight}</span>
                <span>{selectedPose.photographerDirections.distance}</span>
              </div>
            </div>
          </div>

          {/* Pose Cues list */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Step-by-Step Pose Cues
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-300">
              {selectedPose.stepByStep.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-stone-900/60 p-2 rounded-lg border border-stone-800/60">
                  <span className="font-mono text-amber-500">0{idx + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outfit Match Breakdown */}
          {featuredLook && (
            <div className="space-y-2 pt-2 border-t border-stone-800/80">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Outfit Styling & Colour Harmony: {featuredLook.title}
              </h4>
              <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800/60 text-xs space-y-1.5">
                <div className="text-stone-300">
                  <span className="font-semibold text-stone-200">Ensemble: </span>
                  {featuredLook.pieces.map((p) => p.name).join(' + ')}
                </div>
                <div className="text-stone-400 text-[11px]">
                  <span className="text-amber-300 font-medium">Styling Hack: </span>
                  {featuredLook.stylingHack}
                </div>
              </div>
            </div>
          )}

          {/* Palette Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800/80">
            <span className="text-[11px] text-stone-400">Scene Harmonized Palette:</span>
            <div className="flex items-center gap-1.5">
              {sceneData.environment.colorPalette.map((s, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-md border border-stone-700/60"
                  style={{ backgroundColor: s.hex }}
                  title={`${s.name} (${s.hex})`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions with Back Button */}
        <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Back to Studio</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Call Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
