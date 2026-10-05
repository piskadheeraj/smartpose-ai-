import React, { useRef, useState, useEffect } from 'react';
import { PoseSuggestion } from '../types';
import { HumanAvatarFigure } from './HumanAvatarFigure';
import {
  Camera,
  RefreshCw,
  Grid3X3,
  Sliders,
  Sparkles,
  Upload,
  FlipHorizontal,
  ChevronLeft,
  ChevronRight,
  Timer,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface CameraViewfinderProps {
  currentImage: string | null;
  settingType?: string;
  onImageCaptured: (imageDataUrl: string) => void;
  onAnalyzeScene: (imageDataUrl: string) => void;
  isAnalyzing: boolean;
  selectedPose: PoseSuggestion | null;
  allPoses: PoseSuggestion[];
  onSelectPose: (pose: PoseSuggestion) => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  currentImage,
  settingType = 'cafe',
  onImageCaptured,
  onAnalyzeScene,
  isAnalyzing,
  selectedPose,
  allPoses,
  onSelectPose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Overlay state
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0.85);
  const [ghostScale, setGhostScale] = useState<number>(1);
  const [ghostFlip, setGhostFlip] = useState<boolean>(false);
  const [ghostOffsetX, setGhostOffsetX] = useState<number>(0);
  const [ghostOffsetY, setGhostOffsetY] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Shutter timer state
  const [timerDuration, setTimerDuration] = useState<0 | 3 | 5>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Sound generator
  const playBeep = (freq = 800, dur = 0.1) => {
    if (!isAudioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + dur);
    } catch {
      // AudioContext may be restricted before user gesture
    }
  };

  // Start Camera
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    setCameraError(null);
    try {
      // Stop any existing tracks
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(
        'Camera access was denied or is not supported in this frame. You can still upload any background photo or choose an aesthetic preset!'
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Toggle Camera Facing
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    if (isCameraActive) {
      startCamera(nextFacing);
    }
  };

  // Snap photo from video feed
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (cameraFacing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopCamera();
    onImageCaptured(dataUrl);
    playBeep(1200, 0.2);
  };

  // Handle Shutter Click with Countdown
  const handleShutterClick = () => {
    if (timerDuration === 0) {
      capturePhoto();
      return;
    }

    setCountdown(timerDuration);
    let current = timerDuration;
    playBeep(600, 0.08);

    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
        playBeep(600, 0.08);
      } else {
        clearInterval(interval);
        setCountdown(null);
        capturePhoto();
      }
    }, 1000);
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        stopCamera();
        onImageCaptured(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl flex flex-col">
      {/* Viewfinder Main Stage */}
      <div className="relative aspect-[4/3] md:aspect-[16/10] w-full bg-stone-900 overflow-hidden flex items-center justify-center select-none">
        {/* Hidden video & canvas elements for camera capture */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            isCameraActive ? 'block' : 'hidden'
          } ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Static Background Image Preview (when not in live camera) */}
        {!isCameraActive && currentImage && (
          <img
            src={currentImage}
            alt="Venue Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Empty State when no camera and no image */}
        {!isCameraActive && !currentImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-950">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-4 text-amber-400">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-100 font-display">
              Capture or Upload Your Background
            </h3>
            <p className="text-sm text-stone-400 max-w-md mt-1.5 leading-relaxed">
              Snap a live photo of your cafe, beach, or street setting, or upload an image to let
              SmartPose detect lighting, compose framing, and generate your outfit colour chart.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => startCamera()}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-colors text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>Open Live Camera</span>
              </button>

              <label className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium px-5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm border border-stone-700">
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {cameraError && (
              <div className="mt-4 max-w-md flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border border-amber-900/50 p-2.5 rounded-lg text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        )}

        {/* Rule of Thirds Grid Overlay */}
        {showGrid && (isCameraActive || currentImage) && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
            <div className="border-r border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-r border-b border-white/15" />
            <div className="border-b border-white/15" />
            <div className="border-r border-white/15" />
            <div className="border-r border-white/15" />
            <div />
          </div>
        )}

        {/* Interactive Human Avatar Pose Ghost Overlay */}
        {selectedPose && (isCameraActive || currentImage) && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-4">
            <HumanAvatarFigure
              settingType={settingType}
              poseIndex={Math.max(0, allPoses.findIndex((p) => p.id === selectedPose.id))}
              poseId={selectedPose.id}
              category={selectedPose.category}
              title={selectedPose.title}
              summary={selectedPose.summary}
              propIdea={selectedPose.propIdea}
              keypoints={selectedPose.skeletonKeypoints}
              isGhost={true}
              opacity={ghostOpacity}
              scale={ghostScale}
              flipHorizontal={ghostFlip}
              offsetX={ghostOffsetX}
              offsetY={ghostOffsetY}
              color="#F59E0B"
            />
          </div>
        )}

        {/* Shutter Countdown Pulse */}
        {countdown !== null && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <span className="text-8xl font-black text-amber-400 font-mono animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Top Control Bar (Inside Viewfinder) */}
        {(isCameraActive || currentImage) && (
          <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
            {/* Left controls: Grid & Ghost sliders */}
            <div className="flex items-center gap-1.5 bg-stone-950/70 backdrop-blur-md border border-stone-800/80 rounded-xl p-1 text-stone-300">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-stone-800'
                }`}
                title="Toggle Rule of Thirds Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              {selectedPose && (
                <button
                  onClick={() => setShowControls(!showControls)}
                  className={`p-2 rounded-lg transition-colors ${
                    showControls ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-stone-800'
                  }`}
                  title="Adjust Ghost Pose Size & Opacity"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              )}

              {selectedPose && (
                <button
                  onClick={() => setGhostFlip(!ghostFlip)}
                  className={`p-2 rounded-lg transition-colors ${
                    ghostFlip ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-stone-800'
                  }`}
                  title="Mirror / Flip Pose"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right controls: Camera toggle, Shutter Timer, Audio */}
            <div className="flex items-center gap-1.5 bg-stone-950/70 backdrop-blur-md border border-stone-800/80 rounded-xl p-1 text-stone-300">
              <button
                onClick={() =>
                  setTimerDuration(timerDuration === 0 ? 3 : timerDuration === 3 ? 5 : 0)
                }
                className={`p-2 rounded-lg flex items-center gap-1 text-xs font-mono transition-colors ${
                  timerDuration > 0 ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-stone-800'
                }`}
                title="Shutter Timer"
              >
                <Timer className="w-4 h-4" />
                {timerDuration > 0 && <span>{timerDuration}s</span>}
              </button>

              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className="p-2 rounded-lg hover:bg-stone-800 transition-colors"
                title="Toggle Shutter Beep"
              >
                {isAudioEnabled ? (
                  <Volume2 className="w-4 h-4 text-stone-300" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-500" />
                )}
              </button>

              {isCameraActive && (
                <button
                  onClick={toggleCameraFacing}
                  className="p-2 rounded-lg hover:bg-stone-800 transition-colors"
                  title="Switch Front/Rear Camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Ghost Position & Opacity Floating Slider Panel */}
        {showControls && selectedPose && (isCameraActive || currentImage) && (
          <div className="absolute top-16 left-4 z-30 w-64 bg-stone-950/90 backdrop-blur-md border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3 pointer-events-auto animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-200">
              <span>Pose Overlay Ghost</span>
              <button
                onClick={() => {
                  setGhostScale(1);
                  setGhostOpacity(0.85);
                  setGhostOffsetX(0);
                  setGhostOffsetY(0);
                  setGhostFlip(false);
                }}
                className="text-[11px] text-amber-400 hover:underline"
              >
                Reset
              </button>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Opacity</span>
                <span className="font-mono">{Math.round(ghostOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={ghostOpacity}
                onChange={(e) => setGhostOpacity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>Scale Size</span>
                <span className="font-mono">{Math.round(ghostScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={ghostScale}
                onChange={(e) => setGhostScale(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-1 text-[11px] text-stone-400">
              <span>Nudge Position</span>
              <div className="grid grid-cols-3 gap-1">
                <div />
                <button
                  onClick={() => setGhostOffsetY((y) => y - 3)}
                  className="px-2 py-1 bg-stone-800 rounded text-stone-200 hover:bg-stone-700"
                >
                  ↑
                </button>
                <div />
                <button
                  onClick={() => setGhostOffsetX((x) => x - 3)}
                  className="px-2 py-1 bg-stone-800 rounded text-stone-200 hover:bg-stone-700"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    setGhostOffsetX(0);
                    setGhostOffsetY(0);
                  }}
                  className="px-1.5 py-1 bg-stone-800 rounded text-stone-300 hover:bg-stone-700 text-[10px]"
                >
                  ●
                </button>
                <button
                  onClick={() => setGhostOffsetX((x) => x + 3)}
                  className="px-2 py-1 bg-stone-800 rounded text-stone-200 hover:bg-stone-700"
                >
                  →
                </button>
                <div />
                <button
                  onClick={() => setGhostOffsetY((y) => y + 3)}
                  className="px-2 py-1 bg-stone-800 rounded text-stone-200 hover:bg-stone-700"
                >
                  ↓
                </button>
                <div />
              </div>
            </div>
          </div>
        )}

        {/* Live Cue Directing Ticker at bottom of viewfinder */}
        {selectedPose && (isCameraActive || currentImage) && (
          <div className="absolute bottom-4 inset-x-4 z-20 pointer-events-auto">
            <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800/90 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold mb-0.5">
                  <span className="font-mono">Pose Guide:</span>
                  <span className="text-stone-200 truncate">{selectedPose.title}</span>
                </div>
                <p className="text-xs text-stone-300 truncate">
                  {selectedPose.stepByStep[activeStepIndex] || selectedPose.summary}
                </p>
              </div>

              {selectedPose.stepByStep.length > 1 && (
                <div className="flex items-center gap-1 shrink-0 text-stone-400">
                  <button
                    onClick={() =>
                      setActiveStepIndex((idx) =>
                        idx > 0 ? idx - 1 : selectedPose.stepByStep.length - 1
                      )
                    }
                    className="p-1 hover:text-stone-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono text-stone-300">
                    {activeStepIndex + 1}/{selectedPose.stepByStep.length}
                  </span>
                  <button
                    onClick={() =>
                      setActiveStepIndex((idx) =>
                        idx < selectedPose.stepByStep.length - 1 ? idx + 1 : 0
                      )
                    }
                    className="p-1 hover:text-stone-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shutter & Viewfinder Bottom Control Deck */}
      <div className="p-4 bg-stone-950 border-t border-stone-800/80 flex flex-col gap-4">
        {/* Poses Quick Selector Carousel */}
        {allPoses.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-stone-400 font-medium shrink-0 mr-1">Poses:</span>
            {allPoses.map((pose) => {
              const active = selectedPose?.id === pose.id;
              return (
                <button
                  key={pose.id}
                  onClick={() => onSelectPose(pose)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                    active
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <div className="w-3.5 h-3.5 shrink-0 rounded-full border border-current flex items-center justify-center text-[9px]">
                    {pose.title[0]}
                  </div>
                  <span className="whitespace-nowrap">{pose.title}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Shutter Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left Actions: Switch input mode */}
          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={() => startCamera()}
                className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-xl border border-stone-800 transition-colors"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Live View</span>
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 text-xs font-medium rounded-xl border border-stone-800 transition-colors"
              >
                Stop Live
              </button>
            )}

            <label className="flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-xl border border-stone-800 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-stone-400" />
              <span>Replace Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Center: Big Shutter Button when camera active */}
          {isCameraActive && (
            <div className="flex items-center justify-center">
              <button
                onClick={handleShutterClick}
                className="w-16 h-16 rounded-full border-4 border-amber-500/40 p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              >
                <div className="w-full h-full rounded-full bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/30 flex items-center justify-center text-stone-950 font-bold" />
              </button>
            </div>
          )}

          {/* Right Action: Analyze Scene with Gemini */}
          <div>
            {currentImage && !isCameraActive && (
              <button
                onClick={() => onAnalyzeScene(currentImage)}
                disabled={isAnalyzing}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg transition-all ${
                  isAnalyzing
                    ? 'bg-amber-600/50 text-stone-300 cursor-wait'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 active:scale-95'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing Lighting & Poses...' : 'Analyze Scene & Style'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
