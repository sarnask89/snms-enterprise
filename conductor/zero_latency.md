# Implementation Plan: Zero-Latency 100% 3D Audio Visualizer

## 1. Objective
Eliminate audio-to-visual latency by rewriting the Python backend and React frontend data pipeline. Completely remove the laggy 2D Canvas rendering engine and replace it with 100% 3D React Three Fiber (R3F) environments. Establish strict, clean frequency reactivity rules (Bass for scale/power, Mids for structure, Highs for intensity) and decouple colors from audio to reduce visual noise.

## 2. Key Files & Context
- `main.py`: Python backend handling microphone capture and FFT.
- `frontend/src/hooks/useAudioData.ts`: Frontend WebSocket consumer.
- `frontend/src/App.tsx`: Main UI and state manager.
- `frontend/src/components/ThreeVisualizer.tsx`: The main 3D scene container.
- `frontend/src/components/VisualizerCanvas.tsx`: **[TO BE DELETED]**
- `frontend/src/components/RenderEngine.ts`: **[TO BE DELETED]**

## 3. Implementation Steps

### Phase 1: Backend Latency Annihilation (`main.py`)
- Reduce `BLOCK_SIZE` in the audio stream from 1024 to 512 to cut capture latency in half.
- Remove the `queue.Queue` buffer system.
- Implement a `latest_data` variable that constantly overwrites itself.
- Modify `broadcast_audio_data` to broadcast the absolute latest FFT data at a high refresh rate (~60-120Hz), dropping any missed frames to ensure zero latency.

### Phase 2: Frontend Data Pipeline Upgrade (`useAudioData.ts`)
- Refactor `useAudioData` to bypass React's `setState` cycle for the high-frequency audio array.
- Store the incoming WebSocket data directly in a mutable reference (`useRef`) or a globally accessible state object.
- Allow the R3F `useFrame` loop to read this reference directly, ensuring the GPU renders the absolute newest data instantly without waiting for a React re-render.

### Phase 3: Purge 2D and Build 3D Environments
- Delete `VisualizerCanvas.tsx` and `RenderEngine.ts`.
- Update `App.tsx` to remove all 2D modes from the dropdown. Add new 3D modes (e.g., "Male3D Dancer", "Equalizer Tunnel", "Particle Storm").
- Build the "Equalizer Tunnel" and "Particle Storm" components in R3F.
- Apply the strict reactivity rules to all new 3D components:
  - **Bass (0-1000Hz / Bins 0-2)**: Drives macro scale, heavy movement, and camera shake.
  - **Mids**: Drives secondary geometric expansion.
  - **Highs (10kHz+ / Bins 30-63)**: Drives particle velocity, light intensity, and emission.
  - **Colors**: Smooth, continuous time-based shifting (no audio flashing).

## 4. Verification & Testing
- Run `main.py` and start the Vite dev server.
- Perform a clap test: clap into the microphone and verify that the 3D scene reacts instantaneously with zero perceptible delay.
- Switch between the new 3D modes and confirm the strict frequency mapping rules are visually obvious and clean.