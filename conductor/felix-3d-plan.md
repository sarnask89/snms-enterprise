# Felix 3D Rigged Model Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the `skeleton.3DS` rigged model into the React visualizer using `@react-three/fiber` and `TDSLoader`. Make the bones react to DnB frequencies for a "dance move" effect.

**Architecture:** Use the `felix` assets in `public/models/felix`. Create a `FelixSkeleton` component using `useLoader` with `TDSLoader`. Traverse the scene graph to find the bones/nodes. Use `useFrame` to apply audio-reactive transformations (rotation/scale) to specific bone groups to simulate dancing.

**Tech Stack:** React 18, Vite, TypeScript, `three`, `@react-three/fiber`, `@react-three/drei`.

---

### Task 1: Setup 3D Dependencies and Assets (COMPLETE)
- [x] **Step 1: Move assets to public**
- [x] **Step 2: Install Three.js dependencies**
- [x] **Step 3: Commit**

---

### Task 2: Create the Rigged Felix Component

**Files:**
- Create: `psychedelic-viz/frontend/src/components/FelixSkeleton.tsx`

- [ ] **Step 1: Implement the TDSLoader and bone animation logic**

```tsx
// psychedelic-viz/frontend/src/components/FelixSkeleton.tsx
import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import * as THREE from 'three';
import { useAudioData } from '../hooks/useAudioData';

interface FelixProps {
  sensitivity: number;
}

export const FelixSkeleton = ({ sensitivity }: FelixProps) => {
  const { audioData } = useAudioData();
  const audioDataRef = useRef(audioData);
  const meshRef = useRef<THREE.Group>(null);

  audioDataRef.current = audioData;

  const scene = useLoader(TDSLoader, '/models/felix/skeleton.3DS');

  // Pre-process materials and textures
  useMemo(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = new THREE.MeshPhongMaterial({
          color: '#4CAF50',
          wireframe: true, // "Cool skeleton vibe"
        });
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const data = audioDataRef.current;
    
    const bass = data.slice(0, 5).reduce((a,b)=>a+b,0)/5;
    const highs = data.slice(40, 60).reduce((a,b)=>a+b,0)/20;
    const mids = data.slice(10, 30).reduce((a,b)=>a+b,0)/20;
    
    // Global pulse
    const targetScale = 0.5 + (bass * sensitivity * 0.02);
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    
    // Simulate "dance moves" by oscillating joints
    scene.traverse((node) => {
      if (node.name.toLowerCase().includes('arm') || node.name.toLowerCase().includes('leg')) {
        node.rotation.z = Math.sin(state.clock.elapsedTime * 10 + bass) * (mids * 0.05);
      }
      if (node.name.toLowerCase().includes('head')) {
        node.rotation.y = Math.cos(state.clock.elapsedTime * 15) * (highs * 0.05);
      }
    });

    meshRef.current.rotation.y += 0.02 + (bass * 0.01);
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} position={[0, -2, 0]} />
    </group>
  );
};
```

- [ ] **Step 2: Commit**

---

### Task 3: Create Three.js Canvas Wrapper

**Files:**
- Create: `psychedelic-viz/frontend/src/components/ThreeVisualizer.tsx`

- [ ] **Step 1: Write the Three.js Canvas setup**

---

### Task 4: Integrate 3D Mode into App UI

**Files:**
- Modify: `psychedelic-viz/frontend/src/App.tsx`

- [ ] **Step 1: Add 'felix_skeleton' to mode selector**

---
