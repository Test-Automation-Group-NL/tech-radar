#!/usr/bin/env node
/**
 * Serves the standalone radar preview.
 * Serves from the repo root so relative paths in standalone/index.html work correctly.
 * Auto-finds a free port if the requested one is already in use.
 *
 * Usage:
 *   node scripts/serve-standalone.js          → http://localhost:3000
 *   node scripts/serve-standalone.js 8080     → http://localhost:8080 (or next free)
 *   node scripts/serve-standalone.js --watch  → live-reloads the browser when standalone/radar.json changes
 *   npm run preview
 *   npm run preview:watch
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const net   = require('net');
const { exec } = require('child_process');

const args          = process.argv.slice(2).filter((arg) => arg !== '--watch');
const WATCH          = process.argv.includes('--watch');
const PREFERRED_PORT = parseInt(args[0] ?? '3000', 10);
const REPO_ROOT      = path.join(__dirname, '..');
const RADAR_JSON     = path.join(REPO_ROOT, 'standalone', 'radar.json');
const LIVE_RELOAD_PATH = '/__techradar-live-reload';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

// Injected into HTML pages in watch mode. Opens an SSE connection and reloads
// the page whenever the server tells us standalone/radar.json changed.
const LIVE_RELOAD_SNIPPET = `
<script>
(function () {
  var source = new EventSource('${LIVE_RELOAD_PATH}');
  source.onmessage = function (event) {
    if (event.data === 'reload') location.reload();
  };
})();
</script>
`;

/** Returns the first free port >= start */
function findFreePort(start) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(start, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findFreePort(start + 1)));
  });
}

/** Waits (up to timeoutMs) for a file to exist — covers the startup race with `radar:watch`. */
function waitForFile(filePath, timeoutMs = 10000, intervalMs = 200) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    (function poll() {
      if (fs.existsSync(filePath)) return resolve();
      if (Date.now() >= deadline) return reject(new Error(`Timed out waiting for ${filePath}`));
      setTimeout(poll, intervalMs);
    })();
  });
}

function resolveUrlPath(req) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    urlPath = req.url.split('?')[0];
  }

  // Root → standalone preview
  if (urlPath === '/') {
    urlPath = '/standalone/index.html';
  }

  // /radar.json → standalone/radar.json
  // Mirrors production where radar.json lives at the WP site root
  if (urlPath === '/radar.json') {
    urlPath = '/standalone/radar.json';
  }

  return urlPath;
}

function createRequestHandler(sseClients) {
  return (req, res) => {
    const urlPath = resolveUrlPath(req);

    if (WATCH && urlPath === LIVE_RELOAD_PATH) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    // Resolve against repo root and normalise
    const resolved = path.normalize(path.join(REPO_ROOT, urlPath));

    // Security: never escape the repo root
    if (!resolved.startsWith(REPO_ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    // Must be an existing file
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not found: ${urlPath}`);
      return;
    }

    const ext  = path.extname(resolved).toLowerCase();
    const mime = MIME[ext] ?? 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type':  mime,
      'Cache-Control': 'no-cache',
    });

    if (WATCH && ext === '.html') {
      const html = fs.readFileSync(resolved, 'utf8');
      const withSnippet = html.includes('</body>')
        ? html.replace('</body>', `${LIVE_RELOAD_SNIPPET}</body>`)
        : html + LIVE_RELOAD_SNIPPET;
      res.end(withSnippet);
      return;
    }

    fs.createReadStream(resolved).pipe(res);
  };
}

/** Watches standalone/ for radar.json rewrites and pushes a reload event to connected clients. */
function watchRadarJson(sseClients) {
  const standaloneDir = path.dirname(RADAR_JSON);
  let debounceTimer = null;

  fs.watch(standaloneDir, (eventType, filename) => {
    if (filename !== 'radar.json') return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log('  ↻ standalone/radar.json changed — reloading browser');
      sseClients.forEach((res) => res.write('data: reload\n\n'));
    }, 150);
  });
}

function openBrowser(url) {
  const cmd = process.platform === 'win32' ? `start "" "${url}"`
            : process.platform === 'darwin' ? `open "${url}"`
            : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) console.log('  (Could not open browser automatically — open the URL above manually.)');
  });
}

async function main() {
  if (WATCH) {
    try {
      await waitForFile(RADAR_JSON);
    } catch {
      console.log('');
      console.log('  ⚠  standalone/radar.json was not generated in time.');
      console.log('  Make sure `npm run radar:watch` is running alongside this preview');
      console.log('  (or just use `npm run preview:watch`, which starts both together).');
      console.log('');
      process.exit(1);
    }
  } else if (!fs.existsSync(RADAR_JSON)) {
    console.log('');
    console.log('  ⚠  standalone/radar.json not found.');
    console.log('');
    console.log('  Generate it first by running:');
    console.log('');
    console.log('    npm run radar:generate-json:prod   (one-off)');
    console.log('    npm run radar:watch                (watches for changes)');
    console.log('');
    console.log('  Then run npm run preview again.');
    console.log('');
    process.exit(1);
  }

  const port = await findFreePort(PREFERRED_PORT);

  if (port !== PREFERRED_PORT) {
    console.log(`  Port ${PREFERRED_PORT} in use — using ${port} instead.`);
  }

  const sseClients = new Set();
  const server = http.createServer(createRequestHandler(sseClients));

  if (WATCH) {
    watchRadarJson(sseClients);
  }

  server.listen(port, () => {
    const url = `http://localhost:${port}`;

    console.log('');
    console.log(`  Test Automation Tech Radar — Standalone Preview${WATCH ? ' (watch mode)' : ''}`);
    console.log('');
    console.log(`  → ${url}`);
    console.log('');

    if (WATCH) {
      console.log('  Watching standalone/radar.json — the browser refreshes automatically');
      console.log('  whenever a blip changes (run alongside `npm run radar:watch`, or use');
      console.log('  `npm run preview:watch` to start both together).');
      console.log('');
    }

    console.log('  Press Ctrl+C to stop.');
    console.log('');

    openBrowser(url);
  });
}

main();
