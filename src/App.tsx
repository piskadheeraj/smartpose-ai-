/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PoseSuggestion,
  SceneAnalysisData,
  PresetScene,
} from './types';
import { PRESET_SCENES } from './data/defaultWardrobe';
import { DEFAULT_CAFE_ANALYSIS, PRESET_ANALYSES } from './data/mockAnalysis';
import { detectSettingFromImage, SettingCategory } from './utils/imageClassifier';
import { CameraViewfinder } from './components/CameraViewfinder';
import { PoseCard } from './components/PoseCard';
import { OutfitMatchView } from './components/OutfitMatchView';
import { ShootCardExport } from './components/ShootCardExport';
import {
  Camera,
  Sparkles,
  Palette,
  FileText,
  MapPin,
  RefreshCw,
  Sliders,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Bulletproof Fallback Data so every venue always has rich poses even if local files are outdated
const BACKUP_VENUE_POSES: Record<string, SceneAnalysisData> = {
  'scene-beach': {
    environment: {
      settingType: 'beach',
      venueDescription: 'Sunlit ocean shoreline with rolling waves, coastal sea breeze, and golden sand horizon.',
      lightingAnalysis: {
        primarySource: 'High-intensity direct sunlight reflecting off ocean water',
        direction: 'Bright backlight with strong ambient water reflection',
        mood: 'Carefree, sun-kissed, and cinematic coastal radiance',
        colorTemperature: 'Warm daylight 5600K with golden sand bounce',
        lightingTips: 'Position yourself with the sun behind or at 45° to catch ocean sparkle in the background without squinting.',
      },
      colorPalette: [
        { name: 'Warm Dune Sand', hex: '#E6C280', role: 'dominant' },
        { name: 'Ocean Turquoise', hex: '#2A9D8F', role: 'dominant' },
        { name: 'Sky Cerulean', hex: '#457B9D', role: 'secondary' },
        { name: 'Seafoam White', hex: '#F1FAEE', role: 'accent' },
        { name: 'Sunset Terracotta', hex: '#E76F51', role: 'accent' },
      ],
      depthAndFraming: {
        leadingLines: 'Diagonal shoreline where water meets wet sand.',
        suggestedDepth: 'f/2.8 to keep subject crisp while ocean waves blur into soft bokeh.',
        focalAnchor: 'Place subject along the right third, looking out toward the open horizon.',
        cameraAngle: 'Low angle near wet sand level to elongate legs against the sky.',
      },
    },
    poseSuggestions: [
      {
        id: 'beach-pose-1',
        title: 'The Shoreline Surf Stride',
        category: 'walking',
        vibe: 'Carefree Coastal Motion',
        difficulty: 'Beginner Friendly',
        summary: 'Barefoot walk right at the edge of the lapping ocean waves, kicking up gentle water droplets.',
        stepByStep: [
          'Walk barefoot parallel to the shoreline where shallow foam laps your feet.',
          'Look downward at the water with a spontaneous, natural smile.',
          'Hold your footwear or sunglasses in one hand by your side.',
          'Allow the sea breeze to catch your hair and flowing garments naturally.',
        ],
        anatomyFocus: {
          head: 'Tilted downward toward the surf with joyful, candid expression.',
          armsAndHands: 'One arm swinging naturally; other hand carrying sandals or tote.',
          torsoAndSpine: 'Tall, light stride.',
          legsAndFeet: 'Mid-step with one heel lifting from wet sand.',
        },
        photographerDirections: {
          cameraHeight: 'Knee level from a low angle to capture the water reflection on wet sand.',
          distance: 'Full body (~3.5 meters).',
          shutterTiming: '1/1000s shutter speed to freeze water droplet splashes.',
        },
        propIdea: 'Carrying sandals in hand or woven beach tote.',
        skeletonKeypoints: {
          head: { x: 0.50, y: 0.16 }, neck: { x: 0.50, y: 0.24 },
          leftShoulder: { x: 0.41, y: 0.29 }, rightShoulder: { x: 0.59, y: 0.29 },
          leftElbow: { x: 0.36, y: 0.42 }, rightElbow: { x: 0.63, y: 0.43 },
          leftWrist: { x: 0.38, y: 0.55 }, rightWrist: { x: 0.66, y: 0.56 },
          leftHip: { x: 0.46, y: 0.54 }, rightHip: { x: 0.54, y: 0.54 },
          leftKnee: { x: 0.39, y: 0.70 }, rightKnee: { x: 0.61, y: 0.69 },
          leftAnkle: { x: 0.35, y: 0.88 }, rightAnkle: { x: 0.67, y: 0.86 },
        },
      },
      {
        id: 'beach-pose-2',
        title: 'The Sun-Shield Horizon Gaze',
        category: 'standing',
        vibe: 'Cinematic Wonder',
        difficulty: 'Beginner Friendly',
        summary: 'Standing near the water with hand raised to shield eyes, looking out toward the distant waves.',
        stepByStep: [
          'Stand facing 45° toward the crashing waves.',
          'Raise your ocean-side hand up to your brow as if shielding bright sunshine.',
          'Keep your elbow flared slightly outward to create clean triangular arm geometry.',
          'Shift weight onto your back leg and let your other hand rest on your hip or thigh.',
        ],
        anatomyFocus: {
          head: 'Profile gaze looking across the open ocean.',
          armsAndHands: 'Hand at forehead shading eyes without obscuring your face.',
          torsoAndSpine: 'Firm, open posture facing the sea breeze.',
          legsAndFeet: 'Feet anchored in sand, weight shifted back.',
        },
        photographerDirections: {
          cameraHeight: 'Waist height, keeping horizon line below subject shoulders.',
          distance: 'Medium full shot (~2.8 meters).',
          shutterTiming: 'Shoot when a large wave crests in the background.',
        },
        propIdea: 'Sunglasses resting on collar or woven hat.',
        skeletonKeypoints: {
          head: { x: 0.51, y: 0.16 }, neck: { x: 0.50, y: 0.24 },
          leftShoulder: { x: 0.42, y: 0.29 }, rightShoulder: { x: 0.59, y: 0.28 },
          leftElbow: { x: 0.35, y: 0.36 }, rightElbow: { x: 0.62, y: 0.44 },
          leftWrist: { x: 0.47, y: 0.18 }, rightWrist: { x: 0.58, y: 0.56 },
          leftHip: { x: 0.45, y: 0.55 }, rightHip: { x: 0.55, y: 0.54 },
          leftKnee: { x: 0.44, y: 0.72 }, rightKnee: { x: 0.57, y: 0.72 },
          leftAnkle: { x: 0.44, y: 0.88 }, rightAnkle: { x: 0.58, y: 0.88 },
        },
      },
      {
        id: 'beach-pose-3',
        title: 'The Sand Lean & Cross-Leg Sit',
        category: 'seated',
        vibe: 'Relaxed & Earthy',
        difficulty: 'Intermediate',
        summary: 'Seated directly on dry sand with knees bent and hands braced behind in the warm sand.',
        stepByStep: [
          'Sit on dry sand with knees bent and feet resting flat.',
          'Brace both palms in the sand slightly behind your hips.',
          'Tilt your chest toward the blue sky, letting the sea wind blow across your hair.',
          'Look sideways over your shoulder toward the camera lens.',
        ],
        anatomyFocus: {
          head: 'Tilted back 15° with chin up, soaking in the sunlight.',
          armsAndHands: 'Arms straight behind bearing upper torso weight.',
          torsoAndSpine: 'Arching gently open to maximize sky and sea background.',
          legsAndFeet: 'Knees bent together angled sideways.',
        },
        photographerDirections: {
          cameraHeight: 'Sit directly on the sand level with the model.',
          distance: '2.0 meters.',
          shutterTiming: 'Shoot as hair blows gently in the ocean wind.',
        },
        propIdea: 'Straw hat or beach towel.',
        skeletonKeypoints: {
          head: { x: 0.48, y: 0.24 }, neck: { x: 0.49, y: 0.32 },
          leftShoulder: { x: 0.40, y: 0.38 }, rightShoulder: { x: 0.60, y: 0.38 },
          leftElbow: { x: 0.34, y: 0.52 }, rightElbow: { x: 0.66, y: 0.52 },
          leftWrist: { x: 0.32, y: 0.66 }, rightWrist: { x: 0.68, y: 0.66 },
          leftHip: { x: 0.44, y: 0.65 }, rightHip: { x: 0.56, y: 0.65 },
          leftKnee: { x: 0.38, y: 0.74 }, rightKnee: { x: 0.62, y: 0.74 },
          leftAnkle: { x: 0.44, y: 0.88 }, rightAnkle: { x: 0.56, y: 0.88 },
        },
      },
    ],
    wardrobeRecommendations: {
      matchedOutfits: [
        {
          title: 'The Breezy Coastal Linen & Slide',
          vibe: 'Sun-Soaked Resort Chic',
          pieces: [
            { name: 'Breezy Linen Shirt or Sundress', category: 'top', whyThisPiece: 'Light natural fibers catch sea breezes with high-end fluid motion.' },
            { name: 'Handcrafted Leather Slides', category: 'shoes', whyThisPiece: 'Easy slip-off for shoreline walking.' },
            { name: 'Woven Raffia / Jute Tote', category: 'accessory', whyThisPiece: 'Organic texture harmonizes with sand dunes.' },
          ],
          overallHarmony: 'Earthy beige, whites, and light indigo pop against the deep turquoise ocean.',
          stylingHack: 'Keep garments flowy; roll up trouser cuffs above ankles to prevent wet hems.',
        },
      ],
      paletteGuidance: {
        recommendedColors: ['Cream', 'Linen White', 'Ocean Sky Blue', 'Warm Dune Sand', 'Coral Terracotta', 'Deep Navy'],
        colorsToAvoid: ['Heavy pure jet black', 'Glaring high-visibility neon', 'Muddy drab grey'],
        textureAdvice: ['Lightweight mulmul cotton, breathable linen, and sheer silks that flutter in sea wind.'],
      },
    },
  },
  'scene-buildings': {
    environment: {
      settingType: 'buildings',
      venueDescription: 'Modern urban architectural plaza with glass skyscrapers, geometric concrete pillars, and outdoor staircases.',
      lightingAnalysis: {
        primarySource: 'Directional sky light with glass reflections',
        direction: 'High contrast side-light creating razor-sharp building shadows',
        mood: 'Sleek, powerful, and metropolitan high-fashion',
        colorTemperature: 'Crisp daylight 5200K with cool blue glass reflections',
        lightingTips: 'Position yourself where shadow and light split across a concrete pillar to create high-contrast chiaroscuro drama.',
      },
      colorPalette: [
        { name: 'Polished Concrete Grey', hex: '#9AA0A6', role: 'dominant' },
        { name: 'Facade Architectural Charcoal', hex: '#2D3136', role: 'dominant' },
        { name: 'Sky Mirror Blue', hex: '#4B7BEC', role: 'secondary' },
        { name: 'Chrome Silver', hex: '#E0E0E0', role: 'accent' },
        { name: 'Structural Black', hex: '#1A1A1A', role: 'accent' },
      ],
      depthAndFraming: {
        leadingLines: 'Vertical skyscraper columns and angled concrete steps.',
        suggestedDepth: 'f/4.0 - f/8.0 deep focus for sharp geometric patterns.',
        focalAnchor: 'Position subject at apex of concrete staircase.',
        cameraAngle: 'Dramatic low-angle shooting upward to emphasize scale.',
      },
    },
    poseSuggestions: [
      {
        id: 'bldg-pose-1',
        title: 'The Concrete Pillar Power Lean',
        category: 'leaning',
        vibe: 'Architectural & Confident',
        difficulty: 'Beginner Friendly',
        summary: 'Resting back against a grand concrete pillar, hands in pockets, looking off-camera with calm power.',
        stepByStep: [
          'Rest your shoulder blades against the vertical concrete column.',
          'Cross your legs at the ankles, planting one heel firmly on the pavement.',
          'Place both hands deep in your trouser pockets.',
          'Turn your jaw 30° toward the open plaza light, chin held level.',
        ],
        anatomyFocus: {
          head: 'Turned toward light source with strong jawline angle.',
          armsAndHands: 'Hands submerged in pockets; elbows relaxed slightly outward.',
          torsoAndSpine: 'Leaning back at 10° against stone pillar.',
          legsAndFeet: 'Crossed ankles forming a clean lower silhouette.',
        },
        photographerDirections: {
          cameraHeight: 'Chest level, aligning pillar edges vertically.',
          distance: '3.0 meters.',
          shutterTiming: 'Shoot when ambient plaza pedestrians clear the background.',
        },
        propIdea: 'Structured handbag or sunglasses.',
        skeletonKeypoints: {
          head: { x: 0.50, y: 0.15 }, neck: { x: 0.50, y: 0.23 },
          leftShoulder: { x: 0.42, y: 0.28 }, rightShoulder: { x: 0.58, y: 0.28 },
          leftElbow: { x: 0.38, y: 0.42 }, rightElbow: { x: 0.62, y: 0.42 },
          leftWrist: { x: 0.44, y: 0.53 }, rightWrist: { x: 0.56, y: 0.53 },
          leftHip: { x: 0.45, y: 0.54 }, rightHip: { x: 0.55, y: 0.54 },
          leftKnee: { x: 0.48, y: 0.72 }, rightKnee: { x: 0.52, y: 0.72 },
          leftAnkle: { x: 0.49, y: 0.88 }, rightAnkle: { x: 0.51, y: 0.89 },
        },
      },
      {
        id: 'bldg-pose-2',
        title: 'The Glass Facade Editorial Stride',
        category: 'walking',
        vibe: 'Metropolitan Runway Flow',
        difficulty: 'Intermediate',
        summary: 'Mid-stride walking past reflective glass skyscraper windows, coat unbuttoned, looking ahead.',
        stepByStep: [
          'Walk briskly parallel to the towering glass window wall.',
          'Let your coat or jacket flutter slightly with forward momentum.',
          'Look straight ahead down the urban avenue with sharp, confident focus.',
          'Swing your arms in clean architectural lines.',
        ],
        anatomyFocus: {
          head: 'Held high, eyes fixed forward down the sidewalk.',
          armsAndHands: 'One arm extended forward in stride; other back.',
          torsoAndSpine: 'Upright, leaning forward 5° in purposeful motion.',
          legsAndFeet: 'Long forward step with front heel striking pavement.',
        },
        photographerDirections: {
          cameraHeight: 'Low hip level to make subject look statuesque.',
          distance: '4.0 meters.',
          shutterTiming: 'Continuous burst at 1/800s to capture coat flare.',
        },
        propIdea: 'Leather portfolio or coffee tumbler.',
        skeletonKeypoints: {
          head: { x: 0.52, y: 0.16 }, neck: { x: 0.51, y: 0.23 },
          leftShoulder: { x: 0.43, y: 0.28 }, rightShoulder: { x: 0.59, y: 0.28 },
          leftElbow: { x: 0.38, y: 0.41 }, rightElbow: { x: 0.64, y: 0.42 },
          leftWrist: { x: 0.40, y: 0.54 }, rightWrist: { x: 0.67, y: 0.54 },
          leftHip: { x: 0.47, y: 0.53 }, rightHip: { x: 0.55, y: 0.53 },
          leftKnee: { x: 0.41, y: 0.71 }, rightKnee: { x: 0.61, y: 0.70 },
          leftAnkle: { x: 0.36, y: 0.88 }, rightAnkle: { x: 0.66, y: 0.86 },
        },
      },
      {
        id: 'bldg-pose-3',
        title: 'The Architectural Staircase Perch',
        category: 'seated',
        vibe: 'Sophisticated & Structured',
        difficulty: 'Beginner Friendly',
        summary: 'Seated casually on wide concrete plaza steps, one knee elevated, resting arm on knee.',
        stepByStep: [
          'Sit on the third or fourth step of the wide stone staircase.',
          'Bend one knee upwards and plant that foot flat on the lower step.',
          'Drape one forearm comfortably across your elevated knee.',
          'Angle your torso slightly toward the sunlit building facade.',
        ],
        anatomyFocus: {
          head: 'Relaxed 3/4 turn toward camera.',
          armsAndHands: 'One forearm on elevated knee; other braced behind.',
          torsoAndSpine: 'Relaxed posture leaning slightly into steps.',
          legsAndFeet: 'Asymmetrical leg positioning creates visual depth.',
        },
        photographerDirections: {
          cameraHeight: 'Eye level with seated model, framing repeating staircase lines.',
          distance: '2.5 meters.',
          shutterTiming: 'Shoot during calm pause between breaths.',
        },
        propIdea: 'Minimalist watch or tailored jacket draped over shoulder.',
        skeletonKeypoints: {
          head: { x: 0.50, y: 0.20 }, neck: { x: 0.50, y: 0.28 },
          leftShoulder: { x: 0.40, y: 0.34 }, rightShoulder: { x: 0.60, y: 0.34 },
          leftElbow: { x: 0.35, y: 0.48 }, rightElbow: { x: 0.65, y: 0.48 },
          leftWrist: { x: 0.42, y: 0.56 }, rightWrist: { x: 0.68, y: 0.58 },
          leftHip: { x: 0.44, y: 0.60 }, rightHip: { x: 0.56, y: 0.60 },
          leftKnee: { x: 0.40, y: 0.68 }, rightKnee: { x: 0.60, y: 0.74 },
          leftAnkle: { x: 0.40, y: 0.86 }, rightAnkle: { x: 0.62, y: 0.88 },
        },
      },
    ],
    wardrobeRecommendations: {
      matchedOutfits: [
        {
          title: 'The Modern Monochrome Tailored Suit',
          vibe: 'Metropolitan High-Fashion',
          pieces: [
            { name: 'Oversized Charcoal or Camel Blazer', category: 'outerwear', whyThisPiece: 'Sharp lapels echo building geometry.' },
            { name: 'Wide-Leg Pleated Trousers', category: 'bottom', whyThisPiece: 'Flows cleanly with brisk walking motion.' },
            { name: 'Pointed Toe Boots or Chunky Loafers', category: 'shoes', whyThisPiece: 'Gives grounding architectural authority.' },
          ],
          overallHarmony: 'Sharp neutral blacks, greys, and warm camel pop against glass and stone.',
          stylingHack: 'Push sleeves up to mid-forearm to break up rigid tailoring.',
        },
      ],
      paletteGuidance: {
        recommendedColors: ['Charcoal Grey', 'Camel Tan', 'Crisp White', 'Cobalt Blue', 'Midnight Black'],
        colorsToAvoid: ['Earthy muddy brown', 'Faded floral prints'],
        textureAdvice: ['Structured wool, matte poplin, heavy twill, and polished leather.'],
      },
    },
  },
};

// Safe helper to resolve scene data reliably across presets, uploads and overrides
const resolveSceneData = (keyOrType: string): SceneAnalysisData => {
  const sceneKey = keyOrType.startsWith('scene-') ? keyOrType : `scene-${keyOrType}`;
  if (PRESET_ANALYSES && PRESET_ANALYSES[sceneKey] && PRESET_ANALYSES[sceneKey].poseSuggestions?.length >= 3) {
    return PRESET_ANALYSES[sceneKey];
  }
  if (BACKUP_VENUE_POSES[sceneKey]) {
    return BACKUP_VENUE_POSES[sceneKey];
  }
  if (PRESET_ANALYSES && PRESET_ANALYSES[sceneKey]) {
    return PRESET_ANALYSES[sceneKey];
  }
  return DEFAULT_CAFE_ANALYSIS;
};

export default function App() {
  // Navigation tabs - Studio Viewfinder and Light & Outfits
  const [activeTab, setActiveTab] = useState<'studio' | 'outfits'>('studio');

  // Current background image (data URL or preset URL)
  const [currentImage, setCurrentImage] = useState<string | null>(PRESET_SCENES[0].imageUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_SCENES[0].id);

  // Analysis result
  const [analysisData, setAnalysisData] = useState<SceneAnalysisData>(DEFAULT_CAFE_ANALYSIS);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Active pose for camera ghost overlay
  const [selectedPose, setSelectedPose] = useState<PoseSuggestion | null>(
    DEFAULT_CAFE_ANALYSIS.poseSuggestions[0]
  );

  // Custom pose refinement input
  const [customPosePrompt, setCustomPosePrompt] = useState<string>('');
  const [isRefiningPose, setIsRefiningPose] = useState<boolean>(false);

  // Shoot card export modal
  const [isShootCardOpen, setIsShootCardOpen] = useState<boolean>(false);

  // Convert preset image URL to base64 if needed for Gemini API
  const convertUrlToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn('Direct fetch failed, returning url directly', err);
      return url;
    }
  };

  // Helper to downscale large user uploads to prevent network timeouts
  const resizeImageIfNeeded = (dataUrl: string, maxDim = 1200): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width <= maxDim && height <= maxDim) {
          resolve(dataUrl);
          return;
        }
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Analyze Scene using Gemini Vision Server Endpoint
  const handleAnalyzeScene = async (imageData: string, hintCategory?: SettingCategory) => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      let payloadImage = imageData;
      if (imageData.startsWith('http')) {
        payloadImage = await convertUrlToBase64(imageData);
      }

      // Optimize image before sending to prevent timeouts
      const optimizedImage = await resizeImageIfNeeded(payloadImage);

      const res = await fetch('/api/analyze-scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: optimizedImage,
          userPreferences: {
            vibeGoal: 'Aesthetic, natural, effortless editorial',
            hintSetting: hintCategory,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || json.details || 'Analysis request failed');
      }

      // Ensure every background has at least 3 pose suggestions
      if (Array.isArray(json.data?.poseSuggestions) && json.data.poseSuggestions.length < 3) {
        const fallbackKey = hintCategory ? `scene-${hintCategory}` : 'scene-cafe';
        const fallback = PRESET_ANALYSES[fallbackKey] || DEFAULT_CAFE_ANALYSIS;
        for (const p of fallback.poseSuggestions) {
          if (json.data.poseSuggestions.length >= 3) break;
          if (!json.data.poseSuggestions.some((existing: any) => existing.id === p.id)) {
            json.data.poseSuggestions.push(p);
          }
        }
      }

      setAnalysisData(json.data);
      if (json.data.poseSuggestions?.length > 0) {
        setSelectedPose(json.data.poseSuggestions[0]);
      }
    } catch (error: any) {
      console.warn('Scene analysis network issue, keeping venue poses:', error);
      // Keep current venue poses, or ensure hintCategory is loaded
      if (hintCategory) {
        const fallback = resolveSceneData(hintCategory);
        setAnalysisData(fallback);
        if (fallback.poseSuggestions?.length > 0) {
          setSelectedPose(fallback.poseSuggestions[0]);
        }
      }
      setAnalysisError(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle manual venue override (e.g. switch to Beach, Buildings, Hills, Forest, Cafe)
  const handleSwitchSetting = (setting: SettingCategory) => {
    setSelectedPresetId(`scene-${setting}`);
    const sceneData = resolveSceneData(setting);
    setAnalysisData(sceneData);
    if (sceneData.poseSuggestions?.length > 0) {
      setSelectedPose(sceneData.poseSuggestions[0]);
    }
  };

  // Handle Preset Scene Selection
  const handleSelectPreset = (preset: PresetScene) => {
    setSelectedPresetId(preset.id);
    setCurrentImage(preset.imageUrl);
    const sceneData = resolveSceneData(preset.id);
    setAnalysisData(sceneData);
    if (sceneData.poseSuggestions?.length > 0) {
      setSelectedPose(sceneData.poseSuggestions[0]);
    }
  };

  // Handle custom captured photo or uploaded background
  const handleImageCaptured = async (dataUrl: string) => {
    setCurrentImage(dataUrl);
    setSelectedPresetId('');

    // Instant browser detection (<50ms):
    const detectedSetting = await detectSettingFromImage(dataUrl);
    const sceneData = resolveSceneData(detectedSetting);
    setAnalysisData(sceneData);
    if (sceneData.poseSuggestions?.length > 0) {
      setSelectedPose(sceneData.poseSuggestions[0]);
    }

    // Run Gemini Vision Server Analysis in the background
    handleAnalyzeScene(dataUrl, detectedSetting);
  };

  // Handle Custom Pose Refinement Prompt
  const handleRefinePose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPosePrompt.trim() || isRefiningPose) return;

    setIsRefiningPose(true);
    try {
      const res = await fetch('/api/refine-pose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settingType: analysisData.environment.settingType,
          currentVibe: analysisData.environment.lightingAnalysis.mood,
          customPrompt: customPosePrompt.trim(),
          wardrobeSummary: 'Harmonized color palette',
        }),
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setAnalysisData((prev) => ({
          ...prev,
          poseSuggestions: [...json.data, ...prev.poseSuggestions],
        }));
        setSelectedPose(json.data[0]);
        setCustomPosePrompt('');
      }
    } catch (err) {
      console.warn('Pose refinement fallback handled', err);
    } finally {
      setIsRefiningPose(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Sticky App Header */}
      <header className="sticky top-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-wider text-stone-100 font-display">
                  SMARTPOSE
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/50 px-1.5 py-0.5 rounded">
                  AI VISION
                </span>
              </div>
              <span className="text-[11px] text-stone-400 block -mt-0.5">
                Pose Guidance & Light Colour Stylist
              </span>
            </div>
          </div>

          {/* Navigation Tabs - Studio Viewfinder and Light & Outfits */}
          <nav className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'studio'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Studio Viewfinder</span>
            </button>

            <button
              onClick={() => setActiveTab('outfits')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'outfits'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Light & Outfits</span>
            </button>
          </nav>

          {/* Call Sheet Export Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setIsShootCardOpen(true)}
              disabled={!selectedPose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 rounded-xl transition-colors disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Shoot Call Sheet</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {/* TAB 1: STUDIO (Camera Viewfinder + Live Pose Ghost + Pose Catalog) */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* 5 Background Places Quick-Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>5 Background Places (Cafe · Beach · Forest · Buildings · Hills):</span>
                </div>
                <span className="text-[11px] text-stone-500">
                  Select a place or upload your own background photo
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {PRESET_SCENES.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative flex items-center gap-2.5 p-2 rounded-xl text-left border transition-all overflow-hidden group ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/20 shadow-md ring-1 ring-amber-500/50'
                          : 'border-stone-800/80 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900'
                      }`}
                    >
                      <img
                        src={preset.imageUrl}
                        alt={preset.title}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-700/60 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs text-stone-100 truncate">
                            {preset.title}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 capitalize block truncate">
                          {preset.settingType} · {preset.location.split(',')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Studio Layout: Viewfinder on Left, Pose Guidance on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Camera Viewfinder (Ghost Pose Overlay) */}
              <div className="lg:col-span-7 space-y-4">
                <CameraViewfinder
                  currentImage={currentImage}
                  settingType={analysisData.environment.settingType}
                  onImageCaptured={handleImageCaptured}
                  onAnalyzeScene={(img) => handleAnalyzeScene(img)}
                  isAnalyzing={isAnalyzing}
                  selectedPose={selectedPose}
                  allPoses={analysisData.poseSuggestions}
                  onSelectPose={(p) => setSelectedPose(p)}
                />

                {/* Environment Summary & Quick Setting Switcher */}
                <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-3.5 space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-medium">Active Venue:</span>
                      <span className="px-2 py-0.5 rounded-md font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 capitalize">
                        {analysisData.environment.settingType}
                      </span>
                      <span className="text-stone-600 hidden sm:inline">|</span>
                      <span className="text-stone-300 truncate max-w-xs hidden sm:inline">
                        {analysisData.environment.venueDescription}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveTab('outfits')}
                      className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>View Colour & Outfits</span>
                    </button>
                  </div>

                  {/* 1-Click Setting Override Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 border-t border-stone-800/60">
                    <span className="text-[11px] text-stone-400 font-medium shrink-0">Switch Venue:</span>
                    {[
                      { id: 'beach', label: '🏖️ Beach & Waves' },
                      { id: 'buildings', label: '🏙️ Modern Buildings' },
                      { id: 'hills', label: '🏔️ Hills & Mountains' },
                      { id: 'forest', label: '🌲 Lush Forest' },
                      { id: 'cafe', label: '☕ Cozy Cafe' },
                    ].map((item) => {
                      const isActive = analysisData.environment.settingType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSwitchSetting(item.id as SettingCategory)}
                          className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                            isActive
                              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                              : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Error Notification if any */}
                {analysisError && (
                  <div className="flex items-center gap-2 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{analysisError}</span>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Pose Director & Anatomical Cards */}
              <div className="lg:col-span-5 space-y-4">
                {/* Director Header */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Pose Recommendations</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-100 font-display">
                      {analysisData.poseSuggestions.length} Poses for this Scene
                    </h3>
                  </div>

                  <span className="text-[11px] font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded capitalize">
                    {analysisData.environment.settingType}
                  </span>
                </div>

                {/* Custom Pose AI Refinement Input Box */}
                <form
                  onSubmit={handleRefinePose}
                  className="flex items-center gap-2 bg-stone-900/80 border border-stone-800 rounded-xl p-1.5"
                >
                  <input
                    type="text"
                    placeholder="Ask for custom pose (e.g. 'holding coffee looking away')..."
                    value={customPosePrompt}
                    onChange={(e) => setCustomPosePrompt(e.target.value)}
                    className="flex-1 bg-transparent px-2.5 py-1 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isRefiningPose || !customPosePrompt.trim()}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors disabled:opacity-40"
                    title="Generate custom pose"
                  >
                    <Send className={`w-3.5 h-3.5 ${isRefiningPose ? 'animate-pulse' : ''}`} />
                  </button>
                </form>

                {/* Pose Cards List */}
                <div className="space-y-4 max-h-[750px] overflow-y-auto pr-1">
                  {analysisData.poseSuggestions.map((pose, idx) => (
                    <PoseCard
                      key={pose.id || idx}
                      pose={pose}
                      index={idx}
                      settingType={analysisData.environment.settingType}
                      isSelected={selectedPose?.id === pose.id}
                      onSelectForCamera={(p) => {
                        setSelectedPose(p);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIGHTING & DEDICATED COLOUR CHART FOR UPLOADED PICTURE */}
        {activeTab === 'outfits' && (
          <OutfitMatchView
            environment={analysisData.environment}
            wardrobeRecs={analysisData.wardrobeRecommendations}
            currentImage={currentImage}
            onBackToStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Photography Call Sheet Modal */}
      {isShootCardOpen && selectedPose && (
        <ShootCardExport
          sceneData={analysisData}
          selectedPose={selectedPose}
          currentImage={currentImage}
          onClose={() => setIsShootCardOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-400">SmartPose AI</span>
            <span>—</span>
            <span>Intelligent pose guidance & light colour chart for enhanced photography</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Powered by Gemini Vision</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsShootCardOpen(true)}
              className="text-stone-400 hover:text-stone-200 transition-colors"
            >
              Export Call Sheet
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
