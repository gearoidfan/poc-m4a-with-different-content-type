import express, { Request, Response } from 'express';
import getPort from 'get-port';
import path from 'node:path';
import fs from 'node:fs';

const app = express();

const projectRoot = path.resolve(process.cwd());
const audioPath = path.join(projectRoot, 'resource', 'demo.m4a');
const audioPathAAC = path.join(projectRoot, 'resource', 'demo-aac.m4a');

function ensureAudioExists() {
  if (!fs.existsSync(audioPath)) {
    // Fail fast with a helpful message in English per requirement.
    throw new Error(`Audio file not found at: ${audioPath}`);
    }
  }

app.get('/', (_req: Request, res: Response) => {
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>M4A Content-Type Demo</title>
      <style>
        :root {
          --bg: #0b0f14;
          --panel: #101722;
          --text: #d7e1f0;
          --muted: #8aa0b8;
          --accent: #5aa9ff;
          --border: #203043;
        }
        *, *::before, *::after { box-sizing: border-box; }
        html, body { height: 100%; }
        body {
          margin: 0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          background: radial-gradient(1200px 800px at 10% 10%, #111826 0%, var(--bg) 55%) fixed;
          color: var(--text);
          display: grid;
          place-items: center;
        }
        .wrap {
          width: min(900px, 92vw);
          padding: 28px 28px 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
        }
        header { margin-bottom: 16px; }
        h1 {
          margin: 0 0 6px;
          font-size: 22px;
          letter-spacing: 0.2px;
        }
        p { margin: 0; color: var(--muted); }
        .grid { display: grid; gap: 18px; grid-template-columns: 1fr; }
        .card {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }
        .label { font-weight: 600; margin-bottom: 8px; color: var(--accent); }
        audio { width: 100%; height: 40px; }
        footer { margin-top: 18px; font-size: 12px; color: var(--muted); }
        code { color: #b6d7ff; }
        .note { margin-top: 6px; font-size: 12px; color: var(--muted); }
      </style>
    </head>
    <body>
      <main class="wrap">
        <header>
          <h1>M4A Content-Type Playback Test</h1>
          <p>Two players stream the same file with different <code>Content-Type</code>s.</p>
        </header>
        <section class="grid">
          <div class="card">
            <div class="label">Standard: <code>audio/m4a</code></div>
            <audio controls preload="none" src="/audio/m4a"></audio>
            <div class="note">Endpoint: <code>GET /audio/m4a</code></div>
          </div>
          <div class="card">
            <div class="label">Generic: <code>application/octet-stream</code></div>
            <audio controls preload="none" src="/audio/m4a/aac"></audio>
            <div class="note">Endpoint: <code>GET /audio/m4a/aac</code></div>
          </div>
          <div class="card">
            <div class="label">Generic: <code>application/octet-stream</code></div>
            <audio controls preload="none" src="/audio/octet"></audio>
            <div class="note">Endpoint: <code>GET /audio/octet</code></div>
          </div>
        </section>
        <footer>
          Tip: Try this on different devices/browsers to compare behavior.
        </footer>
      </main>
    </body>
  </html>`;
  res.status(200).type('html').send(html);
});

app.get('/audio/m4a', (_req: Request, res: Response) => {
  ensureAudioExists();
  res.setHeader('Content-Type', 'audio/m4a');
  res.setHeader('Accept-Ranges', 'bytes');
  res.sendFile(audioPath);
});

app.get('/audio/octet', (_req: Request, res: Response) => {
  ensureAudioExists();
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Accept-Ranges', 'bytes');
  res.sendFile(audioPath);
});

app.get('/audio/m4a/aac', (_req: Request, res: Response) => {
  ensureAudioExists();
  res.setHeader('Content-Type', 'audio/m4a');
  res.setHeader('Accept-Ranges', 'bytes');
  res.sendFile(audioPathAAC);
});


app.use((err: unknown, _req: Request, res: Response, _next: Function) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  res.status(500).json({ error: message });
});

async function bootstrap() {
  const preferred = process.env.PORT ? Number(process.env.PORT) : 3000;
  let port = preferred;
  try {
    port = await getPort({ port: preferred });
  } catch {
    // Fallback when get-port cannot inspect interfaces in restricted sandboxes.
    port = 0; // Let the OS choose an ephemeral port
  }
  app.listen(port, () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
