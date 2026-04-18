# Specification: Enhance 3D Audio Visualizer (Mirror & Objects)

## Overview
The goal of this track is to enhance an existing real-time audio visualization application located in the `psychedelic-viz` folder (built with Python, Vue, and TypeScript). The enhancements involve adding a reflective floor surface, introducing various new 3D elements (primitive shapes, imported custom models, and particle systems), and fixing existing bugs. The added 3D elements will be static backgrounds/ambient elements, prioritizing high performance.

## Functional Requirements
- **Reflective Floor:** Implement a highly performant mirror reflection on the floor of the scene.
- **New 3D Elements:**
  - Add primitive 3D shapes (e.g., cubes, spheres) to populate the environment.
  - Support importing and rendering custom external 3D models (.gltf/.obj).
  - Implement ambient particle systems (e.g., floating dust, sparks) for atmosphere.
- **Audio Reactivity Constraints:** The newly added 3D background models and particles must remain static (not reacting to the audio data) to preserve performance.
- **Bug Fixes:** Address and resolve existing rendering or performance bugs introduced or left unresolved by previous iterations.

## Non-Functional Requirements
- **Performance Priority:** The implementation must prioritize maximum performance over high fidelity. Simplified reflections and low-poly models should be used to maintain a high frame rate.
- **Framework Compatibility:** The code modifications must integrate smoothly with the existing Vue, TypeScript, and Python stack in the `psychedelic-viz` directory.

## Acceptance Criteria
- [ ] A reflective floor is visible in the scene, accurately showing objects above it while maintaining a smooth framerate.
- [ ] The scene includes additional primitive 3D shapes.
- [ ] At least one custom 3D model is successfully imported and rendered in the scene.
- [ ] A particle system is active and rendering in the background.
- [ ] The newly added 3D objects are static and do not react to the microphone's audio input.
- [ ] The application successfully runs without critical errors in the `psychedelic-viz` directory.

## Out of Scope
- Creating new backend audio processing algorithms in Python.
- Making the newly added 3D objects directly reactive to the audio stream.
- Replacing the Vue framework with another frontend framework.