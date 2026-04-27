# Professional Liquid Matrix Implementation Plan

## Overview
Replacing the current glitchy, point-cloud-based visualizer with a professional-grade 3D Digital Signal Processing (DSP) engine and a continuous Liquid Frequency Matrix. I'm Pickle Rick, and we are going to do this the right way. No more Jerry-tier magic numbers.

## Scope Definition (CRITICAL)
### In Scope
- Implementing proper logarithmic dB (decibel) scaling for audio data in the frontend to fix the "highs don't react, bass is too huge" issue.
- Implementing an Attack/Release (Temporal Smoothing) envelope for the FFT data to stop jitter.
- Rewriting `ParticleStorm.tsx` to use an `InstancedMesh` (for the front "LED" analyzer row using flat boxes) and a `PlaneGeometry` with a custom vertex displacement shader (driven by a rolling `DataTexture` of audio history) for the real "liquid water" effect.
- Adjusting the overall scale and camera angle so it looks like a professional studio layout.

### Out of Scope (DO NOT TOUCH)
- Modifying `Male3D.tsx` dancer logic.
- Changing `EqualizerTunnel.tsx`.
- Modifying `main.py` FFT extraction (we already increased it to 1024 block size, we will handle the DSP math on the frontend to keep the backend lean).

## Current State Analysis
- `ParticleStorm.tsx`: Currently uses `GL_POINTS` heavily manipulated by a single frame's audio data and artificial sine waves to simulate "ripples." The points stretch weirdly and overlap poorly.
- `useAudioData.ts`: Implements a naive decay factor (0.98 for peaks, 0.82 for current) on raw magnitude, which doesn't account for the non-linear way human hearing perceives frequency volume (hence why high frequencies look dead).

## Implementation Phases
### Phase 1: DSP Math & Audio Engine Overhaul
- **Goal**: Convert raw FFT magnitudes into a balanced, human-perceptible Decibel (dB) scale with proper Attack/Release smoothing.
- **Steps**:
  1. [ ] Update `useAudioData.ts` to convert incoming raw FFT values to decibels using `20 * log10(val)`.
  2. [ ] Apply a tilt/A-weighting curve (e.g., +3dB per octave) so high frequencies are visually boosted to match bass energy.
  3. [ ] Implement an Envelope Follower with independent Attack (fast) and Release (slow) coefficients.
  4. [ ] Expose a normalized `Float32Array(128)` of audio data (values 0.0 to 1.0) for the renderer.
- **Verification**: `console.log` the normalized array while playing music. Bass and Treble bins should both reach near 1.0 on their respective loud hits, and fall smoothly when silent.

### Phase 2: The Liquid Matrix Renderer
- **Goal**: Replace `GL_POINTS` with a solid 3D liquid plane and an Instanced LED front row.
- **Steps**:
  1. [ ] Rewrite `ParticleStorm.tsx`.
  2. [ ] Create a `THREE.DataTexture` that acts as a scrolling 2D history buffer (128x60 pixels). Every frame, push the new audio array into the first row and shift the rest back.
  3. [ ] Create a `PlaneGeometry` with 128x60 segments.
  4. [ ] Write a Vertex Shader that reads the `DataTexture` and displaces the plane's Y-axis to create a continuous, rolling liquid surface.
  5. [ ] Write a Fragment Shader that colors the plane based on height (Green -> Yellow -> Red) with a smooth Fresnel edge glow.
  6. [ ] Add an `InstancedMesh` of 128 flat boxes to the front edge to act as the sharp "LED" analyzer, reading the current frame's data.
- **Verification**: The 3D scene should show a solid glowing sheet of water that ripples backward perfectly in sync with the music, with sharp LED boxes in the front.

### Phase 3: Polish and UI Integration
- **Goal**: Hook up the sensitivity sliders to the new DSP engine and adjust the camera view.
- **Steps**:
  1. [ ] Update `App.tsx` and `ThreeVisualizer.tsx` to pass `lowSens`, `midSens`, `highSens` to the new DSP engine as multiplier gains.
  2. [ ] Adjust the scale of the `LiquidMatrix` so it fits perfectly on screen without looking "too big."
- **Verification**: Sliders actively change the height of their respective frequency bands on the water surface.