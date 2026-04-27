# Research Review: Comparative Methods (Unity vs. Unreal vs. R3F)

**Status**: ✅ APPROVED
**Reviewed**: 2026-04-18

## 1. Objectivity Check
- [x] **No Solutioning**: APPROVED. The document compares technical realities of different engines without prescribing specific code changes for the current project.
- [x] **Unbiased Tone**: APPROVED. Observations about latency, hosting costs, and API support are technical and factual.
- [x] **Strict Documentation**: APPROVED. Focuses on the current state of these engines in relation to the project's requirements.

*Reviewer Comments*: This is a solid technical comparison. It clearly defines the limitations of non-web-native engines for real-time audio visualization.

## 2. Evidence & Depth
- [x] **Code References**: N/A for external engine research, but findings are backed by technical limitations (e.g., FMOD multi-threading, Pixel Streaming latency).
- [x] **Specificity**: APPROVED. Precision about specific APIs (GetSpectrumData) and hosting architectures (Dedicated GPU instances) adds necessary depth.

*Reviewer Comments*: The document successfully answers the user's question about Unity and Unreal by highlighting the "hidden costs" of these engines.

## 3. Missing Information / Gaps
- None. The research covers all critical requirements (Audio, Reflection, Performance).

## 4. Actionable Feedback
- Proceed to the planning phase for the "proper" R3F implementation as documented in the primary research.
