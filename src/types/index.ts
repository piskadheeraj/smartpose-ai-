export type WardrobeCategory = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  colorName: string;
  colorHex: string;
  material: string;
  styleVibe: string;
  imageUrl?: string;
  inTodayBag?: boolean;
}

export interface SkeletonPoint {
  x: number;
  y: number;
}

export interface SkeletonKeypoints {
  head: SkeletonPoint;
  neck: SkeletonPoint;
  leftShoulder: SkeletonPoint;
  rightShoulder: SkeletonPoint;
  leftElbow: SkeletonPoint;
  rightElbow: SkeletonPoint;
  leftWrist: SkeletonPoint;
  rightWrist: SkeletonPoint;
  leftHip: SkeletonPoint;
  rightHip: SkeletonPoint;
  leftKnee: SkeletonPoint;
  rightKnee: SkeletonPoint;
  leftAnkle: SkeletonPoint;
  rightAnkle: SkeletonPoint;
}

export interface PoseSuggestion {
  id: string;
  title: string;
  category: 'seated' | 'standing' | 'walking' | 'leaning' | 'candid' | string;
  vibe: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Editorial' | string;
  summary: string;
  stepByStep: string[];
  anatomyFocus: {
    head: string;
    armsAndHands: string;
    torsoAndSpine: string;
    legsAndFeet: string;
  };
  photographerDirections: {
    cameraHeight: string;
    distance: string;
    shutterTiming: string;
  };
  propIdea: string;
  skeletonKeypoints: SkeletonKeypoints;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'dominant' | 'secondary' | 'accent' | string;
}

export interface EnvironmentAnalysis {
  settingType: string;
  venueDescription: string;
  lightingAnalysis: {
    primarySource: string;
    direction: string;
    mood: string;
    colorTemperature: string;
    lightingTips: string;
  };
  colorPalette: ColorSwatch[];
  depthAndFraming: {
    leadingLines: string;
    suggestedDepth: string;
    focalAnchor: string;
    cameraAngle: string;
  };
}

export interface MatchedOutfitPiece {
  itemId?: string;
  name: string;
  category: string;
  color?: string;
  whyThisPiece: string;
}

export interface MatchedOutfit {
  title: string;
  vibe: string;
  pieces: MatchedOutfitPiece[];
  overallHarmony: string;
  stylingHack: string;
}

export interface WardrobeRecommendations {
  matchedOutfits: MatchedOutfit[];
  paletteGuidance: {
    recommendedColors: string[];
    colorsToAvoid: string[];
    textureAdvice: string[];
  };
}

export interface SceneAnalysisData {
  environment: EnvironmentAnalysis;
  poseSuggestions: PoseSuggestion[];
  wardrobeRecommendations: WardrobeRecommendations;
}

export interface PresetScene {
  id: string;
  title: string;
  location: string;
  settingType: string;
  imageUrl: string;
  description: string;
  lightingVibe: string;
}
