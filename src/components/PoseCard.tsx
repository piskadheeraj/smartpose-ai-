import React, { useState } from 'react';
import { PoseSuggestion } from '../types';
import { HumanAvatarFigure } from './HumanAvatarFigure';
import { Camera, ChevronDown, ChevronUp, Copy, Check, Maximize2, X, Hand } from 'lucide-react';

interface PoseCardProps {
  pose: PoseSuggestion;
  index: number;
  settingType?: string;
  isSelected?: boolean;
  onSelectForCamera: (pose: PoseSuggestion) => void;
}

export const PoseCard: React.FC<PoseCardProps> = ({
  pose,
  index,
  settingType = 'cafe',
  isSelected,
  onSelectForCamera,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Extract a clean, minimal 1-sentence summary
  const cleanSummary = pose.summary ? pose.summary.split('.')[0] + '.' : pose.title;

  // Extract a short hands cue (max 6-8 words)
  const shortHandCue = pose.anatomyFocus?.armsAndHands
    ? pose.anatomyFocus.armsAndHands.split(',')[0].split('.')[0]
    : 'Natural hand placement';

  const handleCopyInstructions = () => {
    const text = `${pose.title}: ${cleanSummary} (Hands: ${shortHandCue})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative rounded-3xl border transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'bg-stone-900/95 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-950/30'
          : 'bg-stone-900/50 border-stone-800 hover:border-stone-700 hover:bg-stone-900/80'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Header: Clean Number, Title & Category */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-400 font-mono font-bold text-xs bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-lg">
              0{index + 1}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-100 tracking-tight font-display">
              {pose.title}
            </h3>
          </div>

          <span className="text-[11px] font-medium text-stone-400 capitalize px-2 py-0.5 bg-stone-800/80 rounded-full shrink-0">
            {pose.category}
          </span>
        </div>

        {/* VISUAL AVATAR STAGE + MINIMAL CUES */}
        <div className="bg-stone-950/90 rounded-2xl border border-stone-800/80 p-3 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
          {/* Avatar Graphic Canvas */}
          <div className="w-32 h-44 sm:w-36 sm:h-48 shrink-0 bg-stone-900/60 rounded-xl border border-stone-800 p-2 flex items-center justify-center relative group">
            <HumanAvatarFigure
              settingType={settingType}
              poseIndex={index}
              poseId={pose.id}
              category={pose.category}
              title={pose.title}
              summary={pose.summary}
              propIdea={pose.propIdea}
              keypoints={pose.skeletonKeypoints}
              color={isSelected ? '#F59E0B' : '#E2E8F0'}
              opacity={1}
              showHandCallouts={true}
            />

            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-2 right-2 p-1.5 bg-stone-950/80 hover:bg-stone-800 text-stone-400 hover:text-stone-100 rounded-lg transition-colors border border-stone-700/80 opacity-0 group-hover:opacity-100"
              title="Enlarge Avatar Figure"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimal Cue Content (Clean, No walls of text) */}
          <div className="flex-1 w-full space-y-2.5 text-xs">
            {/* Single crisp 1-sentence action cue */}
            <p className="text-xs text-stone-200 font-medium leading-relaxed">
              {cleanSummary}
            </p>

            {/* Quick Micro-Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-300 text-[11px]">
                <Hand className="w-3 h-3 shrink-0 text-amber-400" />
                <span className="font-semibold">Hands:</span>
                <span className="truncate max-w-[140px]">{shortHandCue}</span>
              </div>

              {pose.photographerDirections?.cameraHeight && (
                <div className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 text-[11px]">
                  <span>{pose.photographerDirections.cameraHeight}</span>
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-800/60">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-200 transition-colors"
              >
                <span>{showDetails ? 'Less' : 'Directing tips'}</span>
                {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyInstructions}
                  title="Copy cue"
                  className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onSelectForCamera(pose)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-sm hover:bg-amber-400'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  }`}
                >
                  <Camera className="w-3 h-3" />
                  <span>{isSelected ? 'Active Ghost' : 'Use Pose'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Collapsed Minimal Tips (Only shown if user taps 'Directing tips') */}
        {showDetails && (
          <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-[11px] text-stone-300 space-y-1.5 animate-in fade-in duration-150">
            {pose.stepByStep?.slice(0, 2).map((s, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{s}</span>
              </div>
            ))}
            {pose.propIdea && (
              <div className="text-stone-400 pt-0.5">
                <span className="text-amber-400 font-medium">Prop: </span>
                {pose.propIdea}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Large Zoom Modal for Avatar Figure */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div>
                <h4 className="text-sm font-bold text-stone-100 font-display">{pose.title}</h4>
                <span className="text-[11px] text-amber-400 font-mono capitalize">{pose.category} Pose</span>
              </div>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[4/5] bg-stone-950 rounded-2xl border border-stone-800 p-4 flex items-center justify-center">
              <HumanAvatarFigure
                settingType={settingType}
                poseIndex={index}
                poseId={pose.id}
                category={pose.category}
                title={pose.title}
                summary={pose.summary}
                propIdea={pose.propIdea}
                keypoints={pose.skeletonKeypoints}
                color="#F59E0B"
                opacity={1}
                showHandCallouts={true}
              />
            </div>

            <p className="text-center text-xs text-stone-300 font-medium">
              {cleanSummary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
