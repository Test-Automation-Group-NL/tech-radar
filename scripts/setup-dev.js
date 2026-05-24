#!/usr/bin/env node
/**
 * Interactive dev setup script.
 * Creates symlinks from the plugin and theme into a local WP install.
 * Run once per developer: `node scripts/setup-dev.js`
 */

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_FILE = path.join(__dirname, '..', '.dev-config.json');
const REPO_ROOT   = path.join(__dirname, '..');

const PLUGIN_SRC = path.join(REPO_ROOT, 'wp-plugin-radar');
const THEME_SRC  = path.join(REPO_ROOT, 'wp-theme');

function question(rl, prompt) {
    return new Promise((resolve) => rl.question(prompt, resolve));
}

function loadExistingConfig() {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch {
        return null;
    }
}

function createSymlink(src, dest, label) {
    if (fs.existsSync(dest)) {
        const stat = fs.lstatSync(dest);
        if (stat.isSymbolicLink()) {
            const current = fs.readlinkSync(dest);
            if (current === src) {
                console.log(`  ✓ ${label} symlink already correct`);
                return;
            }
            fs.unlinkSync(dest);
            console.log(`  ↻ ${label} symlink updated (was pointing elsewhere)`);
        } else {
            console.error(`  ✗ ${dest} exists but is not a symlink — remove it manually first`);
            process.exit(1);
        }
    }

    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        console.error(`  ✗ Directory does not exist: ${destDir}`);
        console.error(`    Is the WP path correct? Is the WP install running?`);
        process.exit(1);
    }

    fs.symlinkSync(src, dest);
    console.log(`  ✓ ${label} symlinked`);
}

async function main() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  Test Automation Tech Radar — Dev Setup ║');
    console.log('╚════════════════════════════════════════╝\n');

    const existing = loadExistingConfig();
    if (existing) {
        console.log(`Found existing config at .dev-config.json:`);
        console.log(`  WP path: ${existing.wpPath}\n`);
        const reuse = await question(rl, 'Use this config? (Y/n): ');
        if (reuse.trim().toLowerCase() !== 'n') {
            rl.close();
            applyConfig(existing);
            return;
        }
    }

    console.log('Enter the absolute path to your local WordPress install root.');
    console.log('Example: /Users/yourname/Git/techchamps/techradar-wp/app/public\n');

    let wpPath = (await question(rl, 'WP path: ')).trim();
    wpPath = wpPath.replace(/\/$/, ''); // strip trailing slash

    if (!fs.existsSync(wpPath)) {
        console.error(`\n✗ Path does not exist: ${wpPath}`);
        rl.close();
        process.exit(1);
    }

    const config = { wpPath };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log('\n✓ Config saved to .dev-config.json (gitignored)\n');

    rl.close();
    applyConfig(config);
}

function applyConfig({ wpPath }) {
    const pluginsDir = path.join(wpPath, 'wp-content', 'plugins');
    const themesDir  = path.join(wpPath, 'wp-content', 'themes');

    // Build dist assets if they're missing (dist/ is not committed to git)
    const distJs    = path.join(REPO_ROOT, 'wp-plugin-radar', 'assets', 'dist', 'radar.js');
    const themeJs   = path.join(REPO_ROOT, 'wp-theme', 'assets', 'dist', 'theme.js');
    if (!fs.existsSync(distJs) || !fs.existsSync(themeJs)) {
        console.log('\nBuilding compiled assets (dist/ is not in git)...');
        const { execSync } = require('child_process');
        try {
            execSync('npm run build', { cwd: REPO_ROOT, stdio: 'inherit' });
        } catch {
            console.error('  ✗ Build failed — run `npm run build` manually before activating the plugin.');
        }
    }

    console.log('\nCreating symlinks...');
    createSymlink(PLUGIN_SRC, path.join(pluginsDir, 'techradar'), 'Plugin');
    createSymlink(THEME_SRC,  path.join(themesDir,  'techradar'), 'Theme');

    console.log('\n✓ Done! Start developing with:\n');
    console.log('  npm run dev\n');
    console.log('Then activate the "techradar" plugin and theme in WP Admin.\n');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
