# GangTerm Agent Developer Guide (AGENTS.md)

**CRITICAL NOTE:** This document is the foundational blueprint for the GangTerm project. It outlines the core architectural philosophies and development constraints. It **MUST NOT** be deleted or substantially altered without a full architectural review. It is the primary onboarding document for any AI or human developer contributing to this project.

---

## 1. Core Philosophy: The Agentic Superlab

GangTerm is not a simple collection of tools; it is an **agentic, mobile-first, professional AI codespace**. Every design decision must serve this core mission. The environment is designed to be:

-   **Mobile-First:** The UI and workflow must be optimized for a mobile device, specifically within a Termux-like environment. The frontend must remain lightweight and responsive.
-   **Agentic:** The AI is not a feature; it is a persistent, context-aware partner. The system is built around the AI's ability to observe, understand, and act within the environment.
-   **Professional-Grade:** All generated code, especially shell scripts, must be production-quality. This means prioritizing security, robustness, error handling, and auditability.

## 2. The "Head Honcho" Architecture: Backend Agnosticism

A non-negotiable principle of GangTerm is **backend agnosticism**. We are never locked into a single AI provider or a single cloud environment.

-   **Decoupled Frontend:** The frontend (this codebase) is exclusively a UI and state management layer. It **MUST NOT** contain hardcoded logic for any specific AI model or heavy processing task.
-   **WebSocket Bridge:** All communication with the AI "brain" is handled via a standard WebSocket connection. The `AIConsole` component manages this connection.
-   **Pluggable Backends:** The WebSocket URL is user-configurable. This allows GangTerm to connect to any compatible backend, whether it's a self-hosted model on Kaggle (`Kaggle AI Offload`), a Jupyter environment (`NoteFormers Docker Lab`), a local Ollama instance, or a commercial API.
-   **Lightweight Client:** This architecture ensures the mobile client (the APK) remains extremely lightweight, offloading all intensive computation to the powerful "Head Honcho" server.

## 3. Global AI Companion & Context Awareness

The AI's power comes from its ability to understand the user's current context without needing constant explanation. This is achieved through a centralized state management system.

-   **`AppContext.tsx`:** This is the central nervous system of the application. It holds the state for all tools (`ApkFusionTool`, `ScriptLabTool`, etc.).
-   **Floating `AIConsole.tsx`:** The AI Console is a global, top-level component. It is not tied to any single tool. It subscribes to `AppContext`.
-   **Contextual Payloads:** When the user sends a message to the AI, the `AIConsole` automatically packages the state of the `activeTool` (and its associated data) and sends it along with the user's prompt.
-   **Implication for Developers:** When creating a new tool or modifying an existing one, its state **MUST** be added to `AppContext` to make it "visible" to the AI. Local, unmanaged state within a component is invisible to the global AI.

## 4. Anti-Destructive Safeguards

The development environment must be resilient against accidental destruction.

-   **Immutable Core Files:** This file (`AGENTS.md`) and `AGENTS_INSTRUCT_SANDBOX.md` are considered immutable core assets. They are here to guide development.
-   **UI Warnings:** For any action that can cause data loss or has significant consequences (e.g., `pkg purge`, deleting snippets, running a powerful script), the UI must present a clear, unavoidable warning or confirmation dialog.
-   **No Direct Destructive API Calls:** The frontend should never make a direct call that deletes a resource on the backend without a user confirmation step. The backend should also have its own safeguards.
-   **Principle of Least Surprise:** The UI should behave predictably. A button labeled "Generate Script" should generate a script; it should not execute it without further user interaction.

By adhering to these principles, we ensure that GangTerm remains a powerful, flexible, and stable platform for agentic development.