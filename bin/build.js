#!/usr/bin/env node

const { build } = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BIN_DIR = __dirname;
const DIST_DIR = path.join(BIN_DIR, 'dist');
const RELEASES_DIR = path.join(BIN_DIR, 'releases');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    platform: process.platform === 'win32' ? 'windows' : process.platform,
    arch: process.arch === 'x64' ? 'x64' : process.arch === 'arm64' ? 'arm64' : process.arch,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--platform' && args[i + 1]) {
      opts.platform = args[i + 1];
      i++;
    }
    if (args[i] === '--arch' && args[i + 1]) {
      opts.arch = args[i + 1];
      i++;
    }
    if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage: node bin/build.js [options]

Options:
  --platform <name>   Target platform: linux, macos, windows (default: current)
  --arch <arch>       Target architecture: x64, arm64 (default: current)
  --help, -h          Show this help

Examples:
  node bin/build.js                              # Build for current platform
  node bin/build.js --platform linux --arch x64  # Build for Linux x64
  node bin/build.js --platform macos --arch arm64 # Build for macOS ARM64
`);
      process.exit(0);
    }
  }

  return opts;
}

function getBinaryName(platform, arch) {
  if (platform === 'windows') {
    return `djawa-windows-${arch}.exe`;
  }
  return `djawa-${platform}-${arch}`;
}

async function bundle() {
  console.log('Step 1: Bundling with esbuild...');

  fs.mkdirSync(DIST_DIR, { recursive: true });

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8')
  );

  await build({
    entryPoints: [path.join(ROOT_DIR, 'cli.js')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: path.join(DIST_DIR, 'djawa-bundled.cjs'),
    target: 'node18',
    absWorkingDir: ROOT_DIR,
    banner: {
      js: `const __djawa_version = ${JSON.stringify(packageJson.version)};`,
    },
    logLevel: 'info',
  });

  // Patch the bundled file to fix import.meta.url for SEA compatibility
  const bundledPath = path.join(DIST_DIR, 'djawa-bundled.cjs');
  let bundled = fs.readFileSync(bundledPath, 'utf8');

  // Replace empty import.meta with a polyfill that works in SEA
  bundled = bundled.replace(
    /var import_meta = \{\};/g,
    `var import_meta = { url: require("url").pathToFileURL(__filename).href };`
  );

  fs.writeFileSync(bundledPath, bundled);

  console.log('Bundle complete: dist/djawa-bundled.cjs');
}

function generateSEA(platform, arch) {
  console.log('\nStep 2: Generating SEA blob...');

  fs.mkdirSync(RELEASES_DIR, { recursive: true });

  const seaConfig = path.join(BIN_DIR, 'sea-config.json');
  execSync(`node --build-sea ${seaConfig}`, {
    cwd: BIN_DIR,
    stdio: 'inherit',
  });

  console.log('SEA blob generated.');
}

function copyAndRenameNode(platform, arch) {
  console.log('\nStep 3: Creating executable...');

  const binaryName = getBinaryName(platform, arch);
  const outputPath = path.join(RELEASES_DIR, binaryName);
  const seaOutput = path.join(RELEASES_DIR, 'djawa');

  if (platform === 'windows') {
    // On Windows, --build-sea already creates .exe
    if (fs.existsSync(seaOutput + '.exe')) {
      fs.renameSync(seaOutput + '.exe', outputPath);
    } else {
      // Fallback: copy node.exe
      const nodePath = execSync('where node', { encoding: 'utf8' }).trim().split('\n')[0];
      fs.copyFileSync(nodePath, outputPath);
    }
  } else {
    // For Linux/macOS, the SEA output is already the executable
    if (fs.existsSync(seaOutput)) {
      fs.renameSync(seaOutput, outputPath);
      fs.chmodSync(outputPath, 0o755);
    } else {
      // Fallback: copy node binary
      const nodePath = execSync('which node', { encoding: 'utf8' }).trim();
      fs.copyFileSync(nodePath, outputPath);
      fs.chmodSync(outputPath, 0o755);
    }
  }

  console.log(`Executable created: bin/releases/${binaryName}`);
  return outputPath;
}

function signMacOS(outputPath) {
  if (process.platform !== 'darwin') return;

  console.log('\nStep 4: Code signing (macOS)...');
  try {
    execSync(`codesign --force --sign - "${outputPath}"`, {
      stdio: 'inherit',
    });
    console.log('Code signing complete.');
  } catch (e) {
    console.warn('Warning: Code signing failed. Binary may not work on macOS without it.');
  }
}

function printSize(outputPath) {
  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`\nBuild complete!`);
  console.log(`  File: ${outputPath}`);
  console.log(`  Size: ${sizeMB} MB`);
}

async function main() {
  const opts = parseArgs();

  console.log(`Building Djawa Script for ${opts.platform}-${opts.arch}...\n`);

  await bundle();
  generateSEA(opts.platform, opts.arch);
  const outputPath = copyAndRenameNode(opts.platform, opts.arch);
  signMacOS(outputPath);
  printSize(outputPath);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
