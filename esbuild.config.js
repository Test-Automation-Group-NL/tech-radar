#!/usr/bin/env node

const esbuild = require('esbuild');
const bs = require('browser-sync');
const path = require('path');

const isDev = process.argv.includes('--dev');

const outDir = path.join(__dirname, 'wp-plugin-radar/assets/dist');

const buildOptions = {
  entryPoints: {
    radar: 'src/index.ts',       // TS entry — CSS imports inside produce radar.css
  },
  bundle: true,
  outdir: outDir,
  target: ['es2017', 'chrome80', 'firefox80', 'safari13'],
  sourcemap: isDev,
  minify: !isDev,
  metafile: true,
  loader: { '.css': 'css' },
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
  },
};

async function build() {
  if (isDev) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('[esbuild] Watching for changes...');

    // BrowserSync proxies the local WP install — update the URL to match your Local site
    const localWpUrl = process.env.WP_URL || 'http://testautomationtechradar.local';
    const server = bs.create();
    server.init({
      proxy: localWpUrl,
      files: [`${outDir}/**`],
      open: false,
      notify: false,
      reloadDelay: 100,
    });

    console.log(`[BrowserSync] Proxying ${localWpUrl}`);
  } else {
    const result = await esbuild.build(buildOptions);
    const { outputs } = result.metafile;
    console.log('[esbuild] Production build complete:');
    Object.entries(outputs).forEach(([file, meta]) => {
      const kb = (meta.bytes / 1024).toFixed(1);
      console.log(`  ${path.basename(file)}: ${kb} kB`);
    });
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
