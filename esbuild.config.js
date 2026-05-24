#!/usr/bin/env node

const esbuild = require('esbuild');
const bs = require('browser-sync');
const path = require('path');

const isDev = process.argv.includes('--dev');

const pluginDir = path.join(__dirname, 'wp-plugin-radar/assets/dist');
const themeDir  = path.join(__dirname, 'wp-theme/assets/dist');

const sharedOptions = {
  bundle: true,
  target: ['es2017', 'chrome80', 'firefox80', 'safari13'],
  sourcemap: isDev,
  minify: !isDev,
  loader: { '.css': 'css' },
  define: {
    'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
  },
};

const pluginOptions = {
  ...sharedOptions,
  entryPoints: { radar: 'src/index.ts' },
  outdir: pluginDir,
  metafile: true,
};

const themeOptions = {
  ...sharedOptions,
  entryPoints: { theme: 'src/theme-entry.js' },
  outdir: themeDir,
  metafile: true,
};

function logOutputs(label, metafile) {
  console.log(`[esbuild] ${label} build complete:`);
  Object.entries(metafile.outputs).forEach(([file, meta]) => {
    if (!file.endsWith('.map')) {
      const kb = (meta.bytes / 1024).toFixed(1);
      console.log(`  ${path.basename(file)}: ${kb} kB`);
    }
  });
}

async function build() {
  if (isDev) {
    const [pluginCtx, themeCtx] = await Promise.all([
      esbuild.context(pluginOptions),
      esbuild.context(themeOptions),
    ]);

    await Promise.all([pluginCtx.watch(), themeCtx.watch()]);
    console.log('[esbuild] Watching for changes...');

    const localWpUrl = process.env.WP_URL || 'http://testautomationtechradar.local';
    const server = bs.create();
    server.init({
      proxy: localWpUrl,
      files: [`${pluginDir}/**`, `${themeDir}/**`],
      open: false,
      notify: false,
      reloadDelay: 100,
    });

    console.log(`[BrowserSync] Proxying ${localWpUrl}`);
  } else {
    const [pluginResult, themeResult] = await Promise.all([
      esbuild.build(pluginOptions),
      esbuild.build(themeOptions),
    ]);

    logOutputs('Plugin', pluginResult.metafile);
    logOutputs('Theme', themeResult.metafile);
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
