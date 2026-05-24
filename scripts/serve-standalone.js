#!/usr/bin/env node
/**
 * Serves the standalone radar preview.
 * Serves from the repo root so relative paths in standalone/index.html work correctly.
 * Auto-finds a free port if the requested one is already in use.
 *
 * Usage:
 *   node scripts/serve-standalone.js          → http://localhost:3000
 *   node scripts/serve-standalone.js 8080     → http://localhost:8080 (or next free)
 *   npm run preview
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const net   = require('net');
const { exec } = require('child_process');

const PREFERRED_PORT = parseInt(process.argv[2] ?? '3000', 10);
const REPO_ROOT      = path.join(__dirname, '..');

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

const requestHandler = (req, res) => {
  // Strip query strings and decode URI
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
  fs.createReadStream(resolved).pipe(res);
};

async function main() {
  const port = await findFreePort(PREFERRED_PORT);

  if (port !== PREFERRED_PORT) {
    console.log(`  Port ${PREFERRED_PORT} in use — using ${port} instead.`);
  }

  const server = http.createServer(requestHandler);

  server.listen(port, () => {
    const url = `http://localhost:${port}`;

    console.log('');
    console.log('  Test Automation Tech Radar — Standalone Preview');
    console.log('');
    console.log(`  → ${url}`);
    console.log('');
    console.log('  Press Ctrl+C to stop.');
    console.log('');

    // Open the default browser (cross-platform)
    const cmd = process.platform === 'win32' ? `start "" "${url}"`
              : process.platform === 'darwin' ? `open "${url}"`
              : `xdg-open "${url}"`;

    exec(cmd, (err) => {
      if (err) console.log('  (Could not open browser automatically — open the URL above manually.)');
    });
  });
}

main();
