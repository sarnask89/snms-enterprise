# Research: Comparative Methods (Unity vs. Unreal vs. R3F)

**Date**: 2026-04-18

## 1. Executive Summary
Investigated the feasibility of migrating the 3D visualizer to Unity (WebGL) or Unreal Engine (Pixel Streaming). Both engines offer superior out-of-the-box visual fidelity but introduce extreme technical hurdles for web-based real-time audio processing and high-performance reflections. React Three Fiber (R3F) remains the objectively superior choice for this specific use case.

## 2. Technical Context
- **Current Target**: Low-latency web browser environment.
- **Critical Requirement**: Real-time FFT analysis (microphone input).
- **Critical Requirement**: High-fidelity planar reflections (Mirror).

## 3. Findings & Analysis

### A. Unity (WebGL)
- **Audio Analysis**: `AudioSource.GetSpectrumData` is **not supported** in WebGL builds. Accessing real-time frequency data requires writing a custom JavaScript bridge (`.jslib`) to interface with the Web Audio API and passing data back to C#, adding complexity and overhead.
- **Reflection Performance**: Unity's Planar Reflections are CPU-heavy and poorly optimized for WebGL's single-threaded nature.
- **Asset Size**: Average hello-world build is >15MB compressed, compared to our current <2MB bundle.

### B. Unreal Engine (Pixel Streaming)
- **Architecture**: Requires a dedicated GPU-powered server instance per user to render the scene and stream the video feed.
- **Audio Latency**: Capturing microphone input from the client, sending it to the server for FFT, and streaming the visual back introduces a minimum round-trip latency of >100ms, making "snappy" visuals impossible.
- **Cost**: Hosting costs for Pixel Streaming are astronomically higher than static web hosting.
- **Planar Reflections**: Requires "Support Global Clip Plane" which adds a **15% GPU tax** to the entire project.

### C. React Three Fiber (The "God-Tier" Way)
- **Audio**: Native access to Web Audio API with zero latency.
- **Reflection**: `MeshReflectorMaterial` is a highly optimized specific implementation for R3F that handles the reflection pass without a dedicated server.
- **Performance**: Direct GPU control via GLSL shaders (which we are already using).

## 4. Technical Constraints
- **Unity/Unreal**: Neither engine supports native real-time audio spectrum analysis in a web environment without significant, fragile workarounds.

## 5. Architecture Documentation
- **Industry Standard**: Web-based audio visualizers almost exclusively use Three.js/R3F for the balance of performance, audio access, and bundle size.
