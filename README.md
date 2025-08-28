M4A Content-Type Demo (Express + TypeScript)

This small server exposes three endpoints to serve the same audio file with two different `Content-Type` headers. Use it to compare playback differences across devices/browsers.

Endpoints
- `/`: Dark-theme HTML page with two audio players
- `/audio/m4a`: Streams `resource/demo.m4a` with `Content-Type: audio/m4a`
- `/audio/octet`: Streams the same file with `Content-Type: application/octet-stream`

Getting Started
1) Requirements
- Node.js 18 or newer

2) Install
- `npm install`

3) Run (development)
- `npm run dev` (may not work in restricted sandboxes)

4) Run (direct)
- `npm start`

The server binds to `127.0.0.1` and chooses a free port using `get-port`.
Check the startup log for the exact URL, e.g. `Server running on http://127.0.0.1:3001`.

Project Notes
- TypeScript runs via `tsx` (no separate build step required).
- The audio file path is `resource/demo.m4a`. Ensure it exists before starting.
- The page uses a simple inline `<style>` for a clean dark theme.
 - In restricted environments where inspecting network interfaces is blocked, the server falls back to an OS-chosen ephemeral port.
