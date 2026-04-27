# Gold-Standard Mirror & Spectrum Implementation Plan

## Overview
Replacing the current experimental components with a high-fidelity, professional-grade 3D visualizer. This plan implements real-time ray-traced reflections, a vertical LED-segment gradient spectrum, and a stabilized GPGPU-inspired ripple simulation. I'm Pickle Rick, and this is the "No-Jerry" timeline.

## Scope Definition (CRITICAL)
### In Scope
- Formalizing the **DSP Engine** in `useAudioData.ts`: Implementing proper decibel conversion, frequency-dependent gain (tilt), and a high-precision attack/release envelope.
- Rewriting **`MirrorLake.tsx`**: Implementing a robust `MeshReflectorMaterial` that accurately reflects the scene (including the Galaxy/Moon) and the spectrum bars.
- Developing a **Precision LED Shader**: A custom fragment shader for the spectrum bars that renders a segmented Green -> Yellow -> Red vertical gradient.
- Optimizing **Ripple Physics**: Moving the ripple calculations to a more stable "History Displacement" shader to ensure long-distance propagation without numerical divergence (flying tiles).

### Out of Scope (DO NOT TOUCH)
- Modifying `Male3D.tsx` or `EqualizerTunnel.tsx`.
- Modifying the Python backend (it's already broadcasting at a stable rate).

## Current State Analysis
- `MirrorLake.tsx`: Uses `onBeforeCompile` which is prone to breaking R3F reflector buffers.
- `EarthquakeMatrix.tsx`: Physics is CPU-bound and unstable at high momentum.
- `useAudioData.ts`: Naive logarithmic math lacks pro-grade weighting and calibration.

## Implementation Phases
### Phase 1: The Pro DSP Engine
- **Goal**: Provide a clean, weighted, and snappy audio signal.
- **Steps**:
  1. [ ] Refactor `useAudioData.ts`.
  2. [ ] Implement `20 * log10` dB conversion.
  3. [ ] Apply a +6dB/octave tilt curve to the spectrum array.
  4. [ ] Implement a fast-attack (0.1ms) / slow-release (150ms) envelope follower.
- **Verification**: Bars react instantly to sharp transients (claps) and fall smoothly without jitter.

### Phase 2: The Studio Mirror Material
- **Goal**: achieve 100% reflective, high-performance ground mirror.
- **Steps**:
  1. [ ] Update `MirrorLake.tsx` to use a clean `MeshReflectorMaterial` without fragile `onBeforeCompile` hacks.
  2. [ ] Ensure the ground is a deep "Obsidian Black" (`#020202`) with 1.0 metalness.
  3. [ ] Configure `blur`, `mixStrength`, and `resolution` for high-end performance.
- **Verification**: The Moon and Galaxy are visible in the floor reflection.

### Phase 3: Segmented LED Analyzer
- **Goal**: Render the classic "Equalizer Tower" look with vertical gradients.
- **Steps**:
  1. [ ] Develop a custom shader for the `instancedMesh` analyzer bars.
  2. [ ] Fragment Shader: Map `vUv.y` to a 3-tier color segment (0.0-0.6: Green, 0.6-0.85: Yellow, 0.85-1.0: Red).
  3. [ ] Vertex Shader: Ensure bars physically "punch" out of the floor (Y-displacement).
- **Verification**: Each bar shows a clean color gradient from its base to its peak.

### Phase 4: Stabilized Fluid Displacement
- **Goal**: Create smooth, continuous ripples that don't fly away.
- **Steps**:
  1. [ ] Implement a **Rolling History Displacement** shader on the mirror plane.
  2. [ ] Use a decaying sine-propagation function driven directly by the `HistoryTexture`.
  3. [ ] Ensure tiles return to exactly `y=0` when silent.
- **Verification**: Ripples travel across the entire mirror floor and die out gracefully.
