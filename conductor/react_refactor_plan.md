# Psychedelic Visualizer React Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the vanilla JS visualizer frontend into a modern Vite + React + TypeScript SPA for better reactivity and state management.

**Architecture:** The UI will be managed by React components (Mode selector, sensitivity, strobe). The high-performance rendering loop will be contained within a dedicated `VisualizerCanvas` component using `useRef` and `requestAnimationFrame`. WebSockets will be handled by a custom hook.

**Tech Stack:** React 18, Vite, TypeScript, FastAPI (Backend).

---

### Task 1: Initialize Vite Frontend Project

**Files:**
- Create: `psychedelic-viz/frontend/package.json`
- Create: `psychedelic-viz/frontend/vite.config.ts`
- Create: `psychedelic-viz/frontend/index.html`

- [ ] **Step 1: Scaffold Vite project with React/TS template**

Run: `npm create vite@latest frontend -- --template react-ts` in `C:\Users\xxx\psychedelic-viz/`

- [ ] **Step 2: Install dependencies**

Run: `cd psychedelic-viz/frontend && npm install`

- [ ] **Step 3: Configure Vite Proxy for Backend**

```typescript
// psychedelic-viz/frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ws': {
        target: 'ws://localhost:8000',
        ws: true,
      },
    },
  },
})
```

- [ ] **Step 4: Verify scaffolding**

Run: `npm run build` in `frontend` directory.
Expected: Build passes.

---

### Task 2: Implement Audio WebSocket Hook

**Files:**
- Create: `psychedelic-viz/frontend/src/hooks/useAudioData.ts`

- [ ] **Step 1: Write the hook logic**

```typescript
// psychedelic-viz/frontend/src/hooks/useAudioData.ts
import { useState, useEffect } from 'react';

export const useAudioData = () => {
  const [audioData, setAudioData] = useState<number[]>(new Array(64).fill(0));
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//localhost:8000/ws`);

    ws.onopen = () => setStatus('Connected');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'audio_data') {
        setAudioData(msg.data);
      }
    };
    ws.onclose = () => setStatus('Disconnected');

    return () => ws.close();
  }, []);

  return { audioData, status };
};
```

- [ ] **Step 2: Verify hook types**

Run: `npx tsc --noEmit` in `frontend` directory.

---

### Task 3: Port Canvas Engine to React Component

**Files:**
- Create: `psychedelic-viz/frontend/src/components/VisualizerCanvas.tsx`

- [ ] **Step 1: Implement the VisualizerCanvas component**

```tsx
// Port drawing functions from old app.js into this component.
// Use a ref for the canvas and a requestAnimationFrame loop.
// Ensure mode, sensitivity, and strobe are passed as props.
```

- [ ] **Step 2: Port specific drawing modes**

```tsx
// Implement drawDNA, drawPickles, drawRobot, etc. as methods within the component or imported utils.
```

---

### Task 4: Rebuild UI Overlay & State Management

**Files:**
- Modify: `psychedelic-viz/frontend/src/App.tsx`

- [ ] **Step 1: Define Global State**

```tsx
const [mode, setMode] = useState('dna');
const [sensitivity, setSensitivity] = useState(5.0);
const [strobeEnabled, setStrobeEnabled] = useState(false);
const [strobeFrequency, setStrobeFrequency] = useState(20);
```

- [ ] **Step 2: Build UI Components**

```tsx
// Create reactive inputs for sensitivity and mode selection.
```

---

### Task 5: Backend CORS & Service Update

**Files:**
- Modify: `psychedelic-viz/main.py`

- [ ] **Step 1: Add CORS Middleware**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- [ ] **Step 2: Run verification**

Run backend and frontend concurrently and verify connectivity.
