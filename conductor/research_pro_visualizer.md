# Research: Proper Methods for 3D Mirror & Colorful Spectrum

**Date**: 2026-04-18

## 1. Executive Summary
The current implementation of `MirrorLake` and `EarthquakeMatrix` uses valid R3F components (`MeshReflectorMaterial`, `InstancedMesh`) but suffers from performance bottlenecks and visual inconsistencies due to CPU-bound physics and fragile shader injections (`onBeforeCompile`). The "Proper Method" involves shifting to a GPGPU architecture for ripples and a robust Post-Processing pipeline for neon aesthetics.

## 2. Technical Context
- **Mirroring**: Current `MirrorLake.tsx` uses `MeshReflectorMaterial` from `@react-three/drei`.
- **Analyzer**: `InstancedMesh` of 128 boxes is used for the spectrum bars.
- **Physics**: `EarthquakeMatrix.tsx` performs spring-chain calculations on the CPU within a `useFrame` loop (4,096 iterations per frame).
- **Audio Processing**: `useAudioData.ts` performs a basic logarithmic tilt and attack/release envelope on the CPU.

## 3. Findings & Analysis

### A. Real-Time Reflections (The Mirror)
- **Standard**: `MeshReflectorMaterial` is the correct R3F abstraction for ground reflections. It handles the secondary camera pass automatically.
- **Optimization**: To improve "shininess," the material must have `mirror: 1.0`, `metalness: 1.0`, and a dedicated `Environment` map to provide distant reflections (sky/stars) that fill the gaps between active objects.
- **Issue**: The current white screen crashes are likely due to `onBeforeCompile` modifying the `Reflector`'s internal shader in a way that breaks its reflection buffer lookup.

### B. High-Fidelity Spectrum (The Color)
- **Human Perception**: Frequency bins should be mapped using a **Mel Scale** or **Logarithmic X-axis** because we hear octaves, not raw Hz.
- **Color Mapping**: Pro-grade visualizers use **Vertical Fragment Gradients**. Instead of coloring the whole box, the shader should calculate the color based on `vUv.y` or `vPosition.y` to create the Green -> Yellow -> Red segment look.
- **Emission**: To avoid the bars looking "black," they must use `Emissive` materials with high intensity (>5.0).

### C. Performance (The Ripples)
- **The GPGPU Way**: The "Proper Method" for neighbor-to-neighbor ripples (Wave Equation) is using a **Computation Shader** (`GPUComputationRenderer`).
- **Current Bottleneck**: 4,096 JS calculations per frame in `EarthquakeMatrix` will eventually choke a laptop CPU. Shifting the height/velocity math to a 2D Texture on the GPU is the standard professional approach.

## 4. Technical Constraints
- **Library Dependency**: Requires `@react-three/drei` for Reflector and `@react-three/postprocessing` for Bloom (essential for "shiny" looks).
- **Audio Latency**: The backend block size (1024) adds ~23ms inherent latency. Reducing this to 512 is the limit for stable FFT on standard hardware.

## 5. Architecture Documentation
- **Pattern**: Data-driven Instanced Rendering.
- **State**: Shared global audio buffer (`sharedAudioBuffer`) updated at 60Hz.
- **Rendering**: Combined Shader-Materials with standard R3F lighting.
