import React from 'react';
import { SkeletonKeypoints } from '../types';

export interface HumanAvatarFigureProps {
  settingType?: string;
  poseIndex?: number;
  poseId?: string;
  category?: string;
  title?: string;
  summary?: string;
  propIdea?: string;
  keypoints?: SkeletonKeypoints;
  className?: string;
  isGhost?: boolean;
  opacity?: number;
  scale?: number;
  flipHorizontal?: boolean;
  offsetX?: number;
  offsetY?: number;
  color?: string;
  showHandCallouts?: boolean;
}

export const HumanAvatarFigure: React.FC<HumanAvatarFigureProps> = ({
  settingType = 'cafe',
  poseIndex = 0,
  poseId = '',
  category = 'standing',
  title = '',
  summary = '',
  propIdea = '',
  keypoints,
  className = '',
  isGhost = false,
  opacity = 1,
  scale = 1,
  flipHorizontal = false,
  offsetX = 0,
  offsetY = 0,
  color = '#F59E0B',
  showHandCallouts = true,
}) => {
  const transform = `translate(${offsetX}, ${offsetY}) scale(${flipHorizontal ? -scale : scale}, ${scale})`;

  // High-contrast clean tones
  const skin = isGhost ? color : '#FCD34D';
  const hair = isGhost ? color : '#1E1B18';
  const outline = isGhost ? color : '#0F172A';
  const strokeW = 2.5;

  const s = (settingType || '').toLowerCase();
  const text = `${title} ${summary} ${propIdea} ${poseId}`.toLowerCase();

  // STRICT ENVIRONMENT IDENTIFIERS (Ensures forest poses never inherit cafe tables!)
  const isForest = s.includes('forest') || s.includes('wood') || s.includes('tree') || text.includes('forest');
  const isBeach = s.includes('beach') || s.includes('ocean') || s.includes('sea') || text.includes('beach') || text.includes('shoreline') || text.includes('sandal');
  const isHills = s.includes('hill') || s.includes('mountain') || text.includes('hill') || text.includes('ridge') || text.includes('summit');
  const isBldg = s.includes('building') || s.includes('urban') || s.includes('city') || text.includes('bldg') || text.includes('architect') || text.includes('pillar');
  const isCafe = !isForest && !isBeach && !isHills && !isBldg;

  // Environment-matched clothing colors
  const topColor = isGhost ? color : isForest ? '#D97706' : isBeach ? '#F8FAFC' : isBldg ? '#1E293B' : isHills ? '#DC2626' : '#2563EB';
  const bottomColor = isGhost ? color : isForest ? '#374151' : isBeach ? '#0284C7' : isBldg ? '#475569' : isHills ? '#1F2937' : '#1E1B4B';
  const shoeColor = isGhost ? color : isForest ? '#78350F' : isBeach ? '#FDE68A' : isBldg ? '#0F172A' : isHills ? '#451A03' : '#451A03';

  // Helper to render SVG wrapper with Hand & Gesture Callout Badges
  const renderWrapper = (
    children: React.ReactNode,
    handTags?: { x: number; y: number; label: string; side?: 'left' | 'right' }[]
  ) => (
    <svg
      viewBox="0 0 240 280"
      className={`w-full h-full pointer-events-none select-none ${className}`}
      style={{ opacity }}
    >
      <defs>
        <filter id={`ghost-glow-${poseId || 'avatar'}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <g
        transform={transform}
        style={{ transformOrigin: '120px 140px' }}
        filter={isGhost ? `url(#ghost-glow-${poseId || 'avatar'})` : undefined}
      >
        {children}

        {/* HIGH-VISIBILITY GESTURE INDICATORS */}
        {showHandCallouts && !isGhost && handTags && handTags.map((tag, i) => (
          <g key={i} className="pointer-events-none">
            <circle cx={tag.x} cy={tag.y} r="8" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx={tag.x} cy={tag.y} r="3" fill="#F59E0B" />
            <g transform={`translate(${tag.x + (tag.side === 'left' ? -98 : 14)}, ${tag.y - 11})`}>
              <rect
                x="0"
                y="0"
                width="90"
                height="20"
                rx="6"
                fill="#0F172A"
                stroke="#F59E0B"
                strokeWidth="1.5"
                opacity="0.95"
              />
              <text
                x="45"
                y="13"
                textAnchor="middle"
                fill="#FDE68A"
                fontSize="8.5"
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {tag.label}
              </text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );

  const idx = poseIndex % 3;

  // =========================================================================
  // 1. FOREST SCENE POSES (Strictly Forest - Pine Tree Lean, Trail Walk, Canopy Inhale)
  // =========================================================================
  if (isForest) {
    if (idx === 0 || text.includes('tree') || text.includes('trunk') || text.includes('bark') || text.includes('lean')) {
      // Forest 0: Pine Tree Trunk Lean with Thumbs in Pockets
      return renderWrapper(
        <g>
          {/* Vertical Pine Tree Trunk with textured bark */}
          <rect x="22" y="10" width="38" height="260" rx="6" fill={isGhost ? color : '#5C3D2E'} stroke={outline} strokeWidth={strokeW} />
          {!isGhost && (
            <g stroke="#3D2817" strokeWidth="2.5" strokeLinecap="round">
              <line x1="32" y1="35" x2="32" y2="85" />
              <line x1="44" y1="60" x2="44" y2="130" />
              <line x1="36" y1="150" x2="36" y2="210" />
              <line x1="48" y1="180" x2="48" y2="245" />
            </g>
          )}

          {/* Model leaning back against tree, foot propped back near base of trunk */}
          <path d="M 112 145 L 104 200 L 102 258" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 132 145 L 115 195 L 75 245" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="102" cy="260" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="73" cy="246" rx="11" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Jacket Torso leaning against trunk */}
          <path d="M 92 82 C 82 100, 88 140, 98 146 L 138 146 C 148 140, 152 100, 142 82 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Both hands with thumbs hooked outside pocket rims */}
          <path d="M 94 84 L 76 116 L 98 136" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="100" cy="136" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 96 130 Q 102 122 106 130" fill="none" stroke={outline} strokeWidth="2.5" strokeLinecap="round" />

          <path d="M 142 84 L 158 116 L 136 136" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="136" cy="136" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 140 130 Q 134 122 130 130" fill="none" stroke={outline} strokeWidth="2.5" strokeLinecap="round" />

          {/* Head looking down the trail */}
          <rect x="110" y="65" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="46" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 42 C 101 22, 134 22, 138 42 C 142 54, 138 64, 138 64 C 131 54, 126 54, 118 52 C 108 52, 101 60, 101 60 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 38, y: 70, label: '🌲 Leans on Tree', side: 'left' },
          { x: 136, y: 136, label: '✋ Thumbs in Pockets', side: 'right' },
        ]
      );
    } else if (idx === 1 || text.includes('trail') || text.includes('walk') || text.includes('shoulder')) {
      // Forest 1: Earthy Trail Walking Stride Looking Over Shoulder (NO TABLES!)
      return renderWrapper(
        <g>
          {/* Earthy Forest Path */}
          <path d="M 25 262 Q 120 252, 215 262" fill="none" stroke={isGhost ? color : '#78350F'} strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="265" r="3" fill="#166534" />
          <circle cx="180" cy="264" r="2.5" fill="#166534" />

          {/* Dynamic Walking Stride Legs */}
          <path d="M 108 145 L 86 195 L 72 254" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 128 145 L 148 195 L 166 254" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="68" cy="258" rx="13" ry="7" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="170" cy="258" rx="13" ry="7" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Torso twisting toward camera */}
          <path d="M 96 82 C 86 100, 92 140, 102 146 L 134 146 C 144 140, 148 100, 138 82 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Natural Walking Arm Swings with Open Fingers */}
          <path d="M 96 86 L 72 122 L 56 160" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="54" cy="164" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <path d="M 138 86 L 158 122 L 176 156" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="178" cy="160" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Head looking back over shoulder at camera */}
          <rect x="110" y="65" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="125" cy="46" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 108 42 C 108 22, 142 22, 144 42 C 146 54, 140 64, 140 64 C 134 54, 128 54, 120 52 C 112 52, 108 60, 108 60 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 54, y: 164, label: '🚶 Trail Stride', side: 'left' },
          { x: 178, y: 160, label: '👀 Look Over Shoulder', side: 'right' },
        ]
      );
    } else {
      // Forest 2: Canopy Sunbeam Inhale & Foliage Touch
      return renderWrapper(
        <g>
          {/* Mossy Forest Ground */}
          <path d="M 25 262 Q 120 252, 215 262" fill="none" stroke={isGhost ? color : '#166534'} strokeWidth="5" strokeLinecap="round" />

          {/* Standing legs shoulder-width */}
          <path d="M 106 145 L 102 200 L 98 256" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <path d="M 128 145 L 132 200 L 136 256" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <ellipse cx="96" cy="260" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="138" cy="260" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Open chest torso */}
          <path d="M 94 80 C 84 98, 88 140, 98 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left hand reaching out to touch nearby tree branch */}
          <path d="M 94 84 L 62 108 L 44 80" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="44" cy="80" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          {/* Small green leaf branch */}
          <path d="M 28 70 Q 44 76, 52 70" stroke="#15803D" strokeWidth="2.5" fill="none" />
          <ellipse cx="36" cy="71" rx="4" ry="2" fill="#22C55E" />

          {/* Right hand resting relaxed by thigh */}
          <path d="M 142 84 L 160 120 L 152 155" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="152" cy="155" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Head tilted upward gazing into forest canopy */}
          <rect x="110" y="60" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="40" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 36 C 101 16, 134 16, 138 36 C 142 48, 138 56, 138 56 C 131 48, 126 48, 118 46 C 108 46, 101 54, 101 54 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 44, y: 80, label: '🌿 Touch Foliage', side: 'left' },
          { x: 152, y: 155, label: '☀️ Canopy Inhale', side: 'right' },
        ]
      );
    }
  }

  // =========================================================================
  // 2. BEACH SCENE POSES (Strictly Beach - Sandal Stride, Horizon Shield, Dune Recline)
  // =========================================================================
  if (isBeach) {
    if (idx === 0 || text.includes('sandal') || text.includes('surf') || text.includes('barefoot')) {
      // Beach 0: Barefoot Surf Stride Holding Sandals
      return renderWrapper(
        <g>
          {/* Ocean Surf Foam Ripples */}
          <path d="M 15 260 Q 60 250, 120 260 T 225 258" fill="none" stroke={isGhost ? color : '#38BDF8'} strokeWidth="4" strokeLinecap="round" />
          <path d="M 30 268 Q 90 262, 150 268 T 210 266" fill="none" stroke={isGhost ? color : '#BAE6FD'} strokeWidth="2" strokeLinecap="round" />

          {/* Barefoot legs stepping through surf */}
          <path d="M 106 145 L 84 196 L 70 252" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 128 145 L 148 196 L 166 252" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="66" cy="256" rx="13" ry="5" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="168" cy="256" rx="13" ry="5" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Linen Shirt Torso */}
          <path d="M 94 80 C 84 98, 88 140, 98 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left arm: Free swinging */}
          <path d="M 94 84 L 70 122 L 54 158" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="54" cy="158" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* RIGHT HAND HOLDING LEATHER STRAP SANDALS */}
          <path d="M 142 84 L 166 118 L 156 148" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="156" cy="148" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          {/* Real Leather Sandals Dangling */}
          <path d="M 154 148 L 152 165" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M 158 148 L 160 165" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <rect x="146" y="165" width="10" height="24" rx="4" fill="#B45309" stroke={outline} strokeWidth="2" />
          <line x1="146" y1="172" x2="156" y2="172" stroke="#78350F" strokeWidth="2.5" />
          <line x1="146" y1="178" x2="156" y2="178" stroke="#78350F" strokeWidth="2.5" />
          <rect x="156" y="168" width="10" height="24" rx="4" fill="#92400E" stroke={outline} strokeWidth="2" />
          <line x1="156" y1="175" x2="166" y2="175" stroke="#78350F" strokeWidth="2.5" />

          {/* Head looking down at waves */}
          <rect x="110" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 40 C 101 20, 134 20, 138 40 C 142 52, 138 60, 138 60 C 131 52, 126 52, 118 50 C 108 50, 101 58, 101 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 54, y: 158, label: '🌊 Barefoot Stride', side: 'left' },
          { x: 158, y: 152, label: '🩴 Holding Sandals', side: 'right' },
        ]
      );
    } else if (idx === 1 || text.includes('ocean') || text.includes('gaze') || text.includes('shield')) {
      // Beach 1: Sun-Shield Ocean Gaze
      return renderWrapper(
        <g>
          {/* Golden Sand Beach */}
          <path d="M 20 262 Q 120 252, 220 262" fill="none" stroke={isGhost ? color : '#FDE68A'} strokeWidth="5" strokeLinecap="round" />

          {/* Standing legs */}
          <path d="M 106 145 L 102 200 L 100 256" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <path d="M 128 145 L 132 200 L 134 256" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />

          {/* Torso */}
          <path d="M 94 80 C 84 98, 88 140, 98 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left hand relaxed */}
          <path d="M 94 84 L 78 122 L 80 156" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="80" cy="156" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Right hand shielding eyes against bright ocean sun */}
          <path d="M 142 84 L 168 88 L 132 48" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="132" cy="48" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 122 45 L 142 45" stroke={outline} strokeWidth="3" strokeLinecap="round" />

          {/* Head looking across horizon */}
          <rect x="110" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 40 C 101 20, 134 20, 138 40 C 142 52, 138 60, 138 60 C 131 52, 126 52, 118 50 C 108 50, 101 58, 101 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 80, y: 156, label: '🌊 Relaxed Arm', side: 'left' },
          { x: 132, y: 48, label: '✋ Shielding Eyes', side: 'right' },
        ]
      );
    } else {
      // Beach 2: Dry Sand Dune Recline
      return renderWrapper(
        <g>
          {/* Sand Dune Slope */}
          <path d="M 20 240 Q 120 220, 220 250 L 220 275 L 20 275 Z" fill={isGhost ? color : '#FDE68A'} stroke={outline} strokeWidth={strokeW} />

          {/* Reclining legs */}
          <path d="M 95 190 L 80 230 L 60 256" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 120 190 L 140 215 L 175 245" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

          {/* Torso leaning back */}
          <path d="M 88 115 C 78 132, 82 180, 94 188 L 138 188 C 150 180, 152 132, 144 115 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Palms planted behind in sand */}
          <path d="M 88 118 L 65 155 L 48 195" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="195" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <path d="M 144 118 L 168 155 L 185 195" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="185" cy="195" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <rect x="110" y="90" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="72" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 68 C 101 48, 134 48, 134 68 C 137 80, 134 86, 134 86 C 127 78, 122 78, 116 76 C 106 76, 101 86, 101 86 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 48, y: 195, label: '🏖️ Palm in Sand', side: 'left' },
          { x: 185, y: 195, label: '🏖️ Palm in Sand', side: 'right' },
        ]
      );
    }
  }

  // =========================================================================
  // 3. HILLS / MOUNTAIN POSES (Strictly Mountain - Summit Hips, Ledge Knee Sit, Valley Overlook)
  // =========================================================================
  if (isHills) {
    if (idx === 0 || text.includes('summit') || text.includes('hip') || text.includes('power')) {
      // Hills 0: Summit Hands-on-Hips Power Posture
      return renderWrapper(
        <g>
          {/* Mountain Ridge Boulder Peak */}
          <path d="M 25 255 Q 120 240, 215 255 L 215 275 L 25 275 Z" fill={isGhost ? color : '#475569'} stroke={outline} strokeWidth={strokeW} />

          {/* Sturdy athletic stance */}
          <path d="M 104 145 L 86 198 L 76 250" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 134 145 L 152 198 L 162 250" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="74" cy="254" rx="13" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="164" cy="254" rx="13" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Windbreaker Jacket Torso */}
          <path d="M 94 80 C 84 98, 88 140, 98 145 L 140 145 C 150 140, 154 98, 144 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* BOTH HANDS FIRMLY PLANTED ON HIPS (Flared elbows, high confidence) */}
          <path d="M 94 82 L 58 114 L 92 134" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 94 82 L 66 106" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" />
          <circle cx="94" cy="134" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <path d="M 144 82 L 180 114 L 146 134" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 144 82 L 172 106" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" />
          <circle cx="144" cy="134" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Head looking across valley with windblown hair */}
          <rect x="112" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="119" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 102 40 C 102 20, 136 20, 140 40 C 148 48, 156 56, 160 60 C 145 56, 134 52, 124 50 C 110 50, 102 58, 102 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 94, y: 134, label: '⛰️ Hand on Hip', side: 'left' },
          { x: 144, y: 134, label: '⛰️ Hand on Hip', side: 'right' },
        ]
      );
    } else if (idx === 1 || text.includes('ledge') || text.includes('knee-up') || text.includes('boulder') || category.includes('sit') || category.includes('seat')) {
      // Hills 1: High Boulder Ledge Knee-Up Sit
      return renderWrapper(
        <g>
          {/* High Mountain Boulder Cliff Ledge */}
          <path d="M 35 185 L 210 185 L 220 275 L 25 275 Z" fill={isGhost ? color : '#334155'} stroke={outline} strokeWidth={strokeW} />

          {/* Left leg dangling over cliff */}
          <path d="M 98 185 L 94 235 L 92 265" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <ellipse cx="92" cy="268" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Right leg BENT UP TO CHEST */}
          <path d="M 132 185 L 152 138 L 140 180" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="140" cy="184" rx="11" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Torso leaning forward toward raised knee */}
          <path d="M 88 105 C 78 122, 82 175, 94 185 L 138 185 C 150 175, 152 122, 144 105 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left hand resting back on rock */}
          <path d="M 88 108 L 62 145 L 54 182" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="54" cy="182" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Right arm WRAPPED AROUND RAISED KNEE */}
          <path d="M 142 108 L 168 130 L 146 140" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 142 108 L 160 126" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" />
          <circle cx="146" cy="140" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Head resting near knee */}
          <rect x="110" y="80" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="62" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 56 C 101 36, 134 36, 136 56 C 140 68, 136 74, 136 74 C 128 66, 122 66, 116 64 C 106 64, 101 74, 101 74 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 54, y: 182, label: '⛰️ Palm on Rock', side: 'left' },
          { x: 146, y: 140, label: '✋ Arm Hooked on Knee', side: 'right' },
        ]
      );
    } else {
      // Hills 2: Valley Horizon Gaze with Hand Shielding Brow
      return renderWrapper(
        <g>
          {/* Mountain Ridge */}
          <path d="M 25 255 Q 120 240, 215 255 L 215 275 L 25 275 Z" fill={isGhost ? color : '#475569'} stroke={outline} strokeWidth={strokeW} />

          {/* 3/4 stance */}
          <path d="M 102 145 L 94 200 L 90 252" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 126 145 L 136 200 L 144 252" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="88" cy="256" rx="13" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="146" cy="256" rx="13" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Torso */}
          <path d="M 94 80 C 84 98, 88 140, 98 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left hand in pocket */}
          <path d="M 94 84 L 80 116 L 98 136" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="98" cy="136" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Right hand shielding brow */}
          <path d="M 142 84 L 172 88 L 134 48" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 142 84 L 164 88" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" />
          <circle cx="134" cy="48" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 124 45 L 144 45" stroke={outline} strokeWidth="3" strokeLinecap="round" />

          {/* Head looking across valley */}
          <rect x="110" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 40 C 101 20, 134 20, 138 40 C 146 48, 152 56, 156 60 C 142 56, 132 52, 124 50 C 110 50, 101 58, 101 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 98, y: 136, label: '👖 Hand in Pocket', side: 'left' },
          { x: 134, y: 48, label: '✋ Shielding Brow', side: 'right' },
        ]
      );
    }
  }

  // =========================================================================
  // 4. BUILDINGS / URBAN ARCHITECTURE POSES (Strictly Architecture)
  // =========================================================================
  if (isBldg) {
    if (idx === 0 || text.includes('pillar') || text.includes('column') || text.includes('lean')) {
      // Buildings 0: Concrete Pillar Lean
      return renderWrapper(
        <g>
          {/* Concrete Column */}
          <rect x="25" y="10" width="22" height="260" fill={isGhost ? color : '#64748B'} stroke={outline} strokeWidth={strokeW} />

          {/* Tailored Legs */}
          <path d="M 108 145 L 104 200 L 102 258" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 128 145 L 128 200 L 128 258" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="100" cy="260" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="130" cy="260" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Blazer Torso */}
          <path d="M 96 80 C 86 98, 90 140, 100 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Hands in coat pockets */}
          <path d="M 96 82 L 80 114 L 102 136" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="102" cy="136" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <path d="M 142 82 L 158 114 L 136 136" fill="none" stroke={topColor} strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="136" cy="136" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          {/* Head with Sunglasses */}
          <rect x="112" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="119" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 102 40 C 102 20, 135 20, 139 40 C 142 52, 138 60, 138 60 C 131 52, 126 52, 118 50 C 108 50, 102 58, 102 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
          <rect x="110" y="40" width="22" height="7" rx="2" fill={isGhost ? color : '#0F172A'} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 36, y: 70, label: '🏛️ Lean on Pillar', side: 'left' },
          { x: 136, y: 136, label: '🧥 Hands in Pockets', side: 'right' },
        ]
      );
    } else if (idx === 1 || text.includes('watch') || text.includes('stride') || text.includes('walk')) {
      // Buildings 1: Street Crossing Walk & Watch Check
      return renderWrapper(
        <g>
          <path d="M 25 260 L 215 260" stroke={isGhost ? color : '#64748B'} strokeWidth="4" strokeLinecap="round" />

          {/* Stride Legs */}
          <path d="M 106 145 L 86 195 L 72 254" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 128 145 L 148 195 L 166 254" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="68" cy="258" rx="13" ry="7" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="170" cy="258" rx="13" ry="7" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          <path d="M 94 80 C 84 98, 88 140, 98 145 L 138 145 C 148 140, 152 98, 142 80 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Left hand checking wristwatch */}
          <path d="M 94 84 L 75 118 L 115 118" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="115" cy="118" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <rect x="100" y="115" width="7" height="7" fill="#F59E0B" />

          {/* Right arm swinging */}
          <path d="M 142 84 L 164 120 L 176 150" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="176" cy="150" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <rect x="110" y="62" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="44" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 40 C 101 20, 134 20, 138 40 C 142 52, 138 60, 138 60 C 131 52, 126 52, 118 50 C 108 50, 101 58, 101 58 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 115, y: 118, label: '⌚ Checking Watch', side: 'left' },
          { x: 176, y: 150, label: '🚶 Urban Stride', side: 'right' },
        ]
      );
    } else {
      // Buildings 2: Architectural Steps Sit
      return renderWrapper(
        <g>
          {/* Wide Stone Steps */}
          <rect x="25" y="190" width="190" height="25" fill={isGhost ? color : '#475569'} stroke={outline} strokeWidth={strokeW} />
          <rect x="15" y="215" width="210" height="60" fill={isGhost ? color : '#334155'} stroke={outline} strokeWidth={strokeW} />

          {/* Seated Legs on Steps */}
          <path d="M 98 190 L 88 235 L 82 265" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <path d="M 132 190 L 142 235 L 148 265" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
          <ellipse cx="80" cy="268" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="150" cy="268" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

          {/* Torso */}
          <path d="M 88 110 C 78 128, 82 178, 94 188 L 138 188 C 150 178, 152 128, 144 110 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

          {/* Elbows on knees */}
          <path d="M 88 114 L 72 165 L 86 195" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="86" cy="195" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <path d="M 144 114 L 160 165 L 144 195" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="144" cy="195" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

          <rect x="110" y="80" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <ellipse cx="118" cy="62" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
          <path d="M 101 56 C 101 36, 134 36, 136 56 C 140 68, 136 74, 136 74 C 128 66, 122 66, 116 64 C 106 64, 101 74, 101 74 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
        </g>,
        [
          { x: 86, y: 195, label: '🏛️ Elbows on Knees', side: 'left' },
          { x: 144, y: 195, label: '🧱 Stone Steps', side: 'right' },
        ]
      );
    }
  }

  // =========================================================================
  // 5. CAFE POSES (Strictly Cafe - Mug Hold, Chin on Hand, Bistro Book)
  // =========================================================================
  if (idx === 0 || text.includes('mug') || text.includes('coffee') || text.includes('cup') || text.includes('tea')) {
    // Cafe 0: Table Lean & Ceramic Mug Grip
    return renderWrapper(
      <g>
        {/* Wooden Cafe Table Surface */}
        <rect x="25" y="170" width="185" height="15" rx="5" fill={isGhost ? color : '#78350F'} stroke={outline} strokeWidth={strokeW} />
        <rect x="45" y="185" width="12" height="85" fill={isGhost ? color : '#451A03'} stroke={outline} strokeWidth={strokeW} />
        <rect x="165" y="185" width="12" height="85" fill={isGhost ? color : '#451A03'} stroke={outline} strokeWidth={strokeW} />

        {/* Seated Legs */}
        <path d="M 100 170 L 95 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M 135 170 L 140 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
        <ellipse cx="93" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
        <ellipse cx="142" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

        {/* Torso */}
        <path d="M 88 95 C 78 112, 82 165, 94 172 L 140 172 C 152 165, 156 112, 146 95 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

        {/* Right Hand on Table */}
        <path d="M 88 98 Q 72 135 80 168 L 108 168" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="112" cy="168" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

        {/* Left Hand Gripping Ceramic Mug with Steam */}
        <path d="M 146 98 Q 164 128 148 152 L 138 152" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="132" cy="168" rx="16" ry="5" fill={isGhost ? color : '#E2E8F0'} stroke={outline} strokeWidth={strokeW} />
        <path d="M 122 146 L 144 146 C 144 164, 122 164, 122 146 Z" fill={isGhost ? color : '#FFFFFF'} stroke={outline} strokeWidth={strokeW} />
        <path d="M 144 149 C 150 149, 150 160, 144 160" fill="none" stroke={outline} strokeWidth="2" />
        {!isGhost && <path d="M 133 142 Q 136 134 131 128" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />}
        <circle cx="146" cy="152" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

        {/* Head */}
        <rect x="110" y="72" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <ellipse cx="118" cy="54" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <path d="M 101 48 C 101 28, 134 28, 134 48 C 137 60, 134 66, 134 66 C 127 58, 122 58, 116 56 C 106 56, 101 66, 101 66 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
      </g>,
      [
        { x: 112, y: 168, label: '✋ Palm on Table', side: 'left' },
        { x: 146, y: 152, label: '☕ Gripping Mug', side: 'right' },
      ]
    );
  } else if (idx === 1 || text.includes('chin') || text.includes('jaw') || text.includes('dreamer')) {
    // Cafe 1: Chin on Hand Window Dreamer
    return renderWrapper(
      <g>
        {/* Table */}
        <rect x="25" y="170" width="185" height="15" rx="5" fill={isGhost ? color : '#78350F'} stroke={outline} strokeWidth={strokeW} />

        {/* Legs */}
        <path d="M 100 170 L 95 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M 135 170 L 140 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
        <ellipse cx="93" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
        <ellipse cx="142" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

        {/* Torso */}
        <path d="M 88 95 C 78 112, 82 165, 94 172 L 140 172 C 152 165, 156 112, 146 95 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

        {/* Left elbow on table, chin resting on knuckles */}
        <path d="M 88 98 L 74 170 L 110 74" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="110" cy="72" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

        {/* Right hand casually near saucer */}
        <path d="M 146 98 L 160 140 L 152 170" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="152" cy="170" r="8" fill={skin} stroke={outline} strokeWidth={strokeW} />

        {/* Head */}
        <ellipse cx="120" cy="54" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <path d="M 103 48 C 103 28, 136 28, 136 48 C 139 60, 136 66, 136 66 C 129 58, 124 58, 118 56 C 108 56, 103 66, 103 66 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
      </g>,
      [
        { x: 110, y: 72, label: '✋ Chin on Hand', side: 'left' },
        { x: 152, y: 170, label: '✋ Beside Saucer', side: 'right' },
      ]
    );
  } else {
    // Cafe 2: Bistro Chair Cross-Leg & Book
    return renderWrapper(
      <g>
        {/* Chair Back & Seat */}
        <rect x="55" y="120" width="12" height="145" rx="4" fill={isGhost ? color : '#334155'} stroke={outline} strokeWidth={strokeW} />
        <rect x="55" y="180" width="110" height="12" rx="4" fill={isGhost ? color : '#334155'} stroke={outline} strokeWidth={strokeW} />

        {/* Legs Crossed at Knee */}
        <path d="M 110 180 L 105 225 L 100 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" />
        <path d="M 125 180 L 110 205 L 140 260" fill="none" stroke={bottomColor} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="98" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />
        <ellipse cx="142" cy="264" rx="12" ry="6" fill={shoeColor} stroke={outline} strokeWidth={strokeW} />

        {/* Torso */}
        <path d="M 90 98 C 80 115, 84 170, 96 178 L 138 178 C 148 170, 152 115, 142 98 Z" fill={topColor} stroke={outline} strokeWidth={strokeW} />

        {/* Hands holding open book/journal in lap */}
        <path d="M 90 102 L 75 145 L 108 160" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 142 102 L 155 145 L 126 160" fill="none" stroke={skin} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="105" y="152" width="28" height="18" rx="2" fill={isGhost ? color : '#E2E8F0'} stroke={outline} strokeWidth="2" />
        <circle cx="106" cy="160" r="7" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <circle cx="132" cy="160" r="7" fill={skin} stroke={outline} strokeWidth={strokeW} />

        {/* Head tilted forward reading */}
        <rect x="110" y="74" width="14" height="20" rx="4" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <ellipse cx="118" cy="56" rx="17" ry="20" fill={skin} stroke={outline} strokeWidth={strokeW} />
        <path d="M 101 50 C 101 30, 134 30, 134 50 C 137 62, 134 68, 134 68 C 127 60, 122 60, 116 58 C 106 58, 101 68, 101 68 Z" fill={hair} stroke={outline} strokeWidth={strokeW} />
      </g>,
      [
        { x: 106, y: 160, label: '📖 Holds Book', side: 'left' },
        { x: 132, y: 160, label: '📖 Holds Book', side: 'right' },
      ]
    );
  }
};
