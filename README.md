# SmartPose AI - Computer Vision Scene Director & Interactive Pose Guide

A full-stack TypeScript application combining **Node.js / Express** on the backend and **React 19 / Vite** on the frontend. The system analyzes uploaded or live-captured scene backgrounds, extracts lighting and color palettes, and generates pose guidelines with interactive ghost overlays for photographers and models.

---

## 🛠 Project Architecture & Tech Stack

### 1. Backend (`server.ts`)
- **Runtime**: Node.js with TypeScript (`tsx` execution engine)
- **Framework**: Express.js
- **Computer Vision & AI**: `@google/genai` TypeScript SDK
- **Architecture Highlights**:
  - **Server-Side API Security**: Gemini API calls are strictly encapsulated in Express proxy routes (`/api/*`), preventing client-side API key leakage.
  - **Structured JSON Schema Output**: AI vision responses are enforced using Gemini JSON schema typing (`Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, etc.) to guarantee predictable 2D keypoints and color hex codes.
  - **Graceful Fallback Pipeline**: Built-in deterministic scene fallbacks ensure the service maintains zero downtime even when offline or during transient API spikes.

### 2. Frontend (`src/`)
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Camera Viewfinder**: HTML5 WebRTC `MediaDevices.getUserMedia()` with interactive canvas image capture, rule-of-thirds grid, and live audio countdown shutter.
- **Pose Engine (`HumanAvatarFigure.tsx`)**: High-contrast vector silhouette engine that renders distinct physical gestures, postures, and props (tree leaning, holding sandals, coffee mug, summit power stance, etc.).

---

## 🚀 How to Run Locally in VS Code

### Step 1: Open the Project in VS Code
1. Download or clone this repository to your laptop.
2. Open **Visual Studio Code**.
3. Go to `File > Open Folder...` and select the project directory.

### Step 2: Install Node.js Dependencies
Open the built-in terminal in VS Code (`Ctrl + ~` or `Terminal > New Terminal`) and run:

```bash
npm install
```

### Step 3: Configure Environment Variables
Create a file named `.env` in the root folder:

```bash
GEMINI_API_KEY="your_gemini_api_key_here"
```
*(Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) if you don't already have one).*

### Step 4: Start the Full-Stack Server
Run the dev script:

```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

---

## 🎓 What to Show Your Professors (Viva / Project Evaluation Guide)

When your evaluators ask to see the **Backend**, open these specific files and explain the following points:

### 1. The Core Backend Server (`server.ts`)
- Show them lines **600–920** in `server.ts`.
- **Key explanation**:
  > *"Here is our Express backend server. We wrote dedicated RESTful endpoints. The main endpoint is `POST /api/analyze-scene`. It accepts base64 image data from the user's camera, parses the MIME type, passes it to the Google GenAI vision model with strict structured schema validation, and returns the scene classification, color harmony palette, and 2D keypoint coordinates."*

### 2. Structured JSON Schema Engine (`server.ts`)
- Show them the `analysisSchema` definition in `server.ts`.
- **Key explanation**:
  > *"To ensure type safety and prevent AI hallucinations, we designed a formal JSON schema defining the exact data types for lighting temperature, RGB/HEX color swatches, wardrobe recommendations, and 2D joint coordinates for the skeleton avatar."*

### 3. Interactive WebRTC Camera Integration (`src/components/CameraViewfinder.tsx`)
- Show them how you access the hardware camera using the native WebRTC browser API:
  - `navigator.mediaDevices.getUserMedia({ video: { facingMode } })`
  - Drawing video frames onto an offscreen `<canvas>` to take full-resolution photos.
  - Real-time ghost silhouette overlay that models can align their bodies against before pressing the shutter.

### 4. Mathematical Avatar Renderer (`src/components/HumanAvatarFigure.tsx`)
- Show them how the SVG coordinates are dynamically computed and mapped across the 240×280 coordinate plane, ensuring natural human anatomy, weight distribution, and props matching the venue.

---

## 📂 Key File Map

```
├── server.ts                       # Express REST backend + Gemini vision API routes
├── src/
│   ├── App.tsx                     # Main application state & tab controller
│   ├── components/
│   │   ├── CameraViewfinder.tsx    # Live WebRTC camera, ghost overlay & shutter
│   │   ├── HumanAvatarFigure.tsx   # Vector avatar renderer with gestures & props
│   │   ├── PoseCard.tsx            # Minimalist pose cards with directing cues
│   │   ├── LightingColorPalette.tsx# Extracted scene hex palette & wardrobe matching
│   │   └── ShootCardExport.tsx     # Printable call sheet & pose guide exporter
│   ├── data/
│   │   └── mockAnalysis.ts         # Deterministic scene presets (Hills, Beach, Forest, Cafe, Buildings)
│   └── types.ts                    # TypeScript interfaces for full-stack types
├── package.json                    # Project dependencies & scripts
└── tsconfig.json                   # TypeScript compiler configuration
```
