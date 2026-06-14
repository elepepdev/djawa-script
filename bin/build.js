#!/usr/bin/env node

const { build } = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const BIN_DIR = __dirname;
const DIST_DIR = path.join(BIN_DIR, 'dist');
const RELEASES_DIR = path.join(BIN_DIR, 'releases');

const NODE_SEA_SENTINEL = 'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2';

function getNodeVersion() {
  const v = process.version.replace('v', '').split('.').map(Number);
  return { major: v[0], minor: v[1], patch: v[2] };
}

function supportsBuildSEA() {
  const v = getNodeVersion();
  return v.major > 25 || (v.major === 25 && v.minor >= 5);
}

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

function generateSEA() {
  console.log('\nStep 2: Generating SEA blob...');

  fs.mkdirSync(RELEASES_DIR, { recursive: true });

  if (supportsBuildSEA()) {
    // Node.js 25.5+ : use --build-sea
    console.log('Using --build-sea (Node.js >= 25.5)');
    const seaConfig = path.join(BIN_DIR, 'sea-config.json');
    execSync(`node --build-sea ${seaConfig}`, {
      cwd: BIN_DIR,
      stdio: 'inherit',
    });
  } else {
    // Node.js 20-24 : use --experimental-sea-config + postject
    console.log('Using --experimental-sea-config + postject (Node.js < 25.5)');

    // Create a temporary sea-config for blob generation
    const blobPath = path.join(RELEASES_DIR, 'sea-prep.blob');
    const tempConfig = path.join(BIN_DIR, 'sea-config-temp.json');
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(BIN_DIR, 'sea-config.json'), 'utf8')
    );

    // For --experimental-sea-config, output is the blob path
    const tempConfigData = {
      ...packageJson,
      output: blobPath,
    };
    fs.writeFileSync(tempConfig, JSON.stringify(tempConfigData));

    try {
      // Generate the blob
      execSync(`node --experimental-sea-config ${tempConfig}`, {
        cwd: BIN_DIR,
        stdio: 'inherit',
      });

      // Copy node binary
      const nodePath = process.execPath;
      const seaOutput = path.join(RELEASES_DIR, 'djawa');
      fs.copyFileSync(nodePath, seaOutput);
      fs.chmodSync(seaOutput, 0o755);

      // Remove signature on macOS before injection
      if (process.platform === 'darwin') {
        try {
          execSync(`codesign --remove-signature "${seaOutput}"`, { stdio: 'ignore' });
        } catch (e) {
          // Ignore errors on non-signed binaries
        }
      }

      // Inject blob with postject
      console.log('Injecting SEA blob with postject...');
      execSync(
        `npx postject "${seaOutput}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse ${NODE_SEA_SENTINEL}`,
        { cwd: BIN_DIR, stdio: 'inherit' }
      );

      // Re-sign on macOS
      if (process.platform === 'darwin') {
        try {
          execSync(`codesign --force --sign - "${seaOutput}"`, { stdio: 'inherit' });
        } catch (e) {
          // Ignore
        }
      }
    } finally {
      // Clean up temp config
      if (fs.existsSync(tempConfig)) fs.unlinkSync(tempConfig);
    }
  }

  console.log('SEA blob generated.');
}

function renameOutput(platform, arch) {
  console.log('\nStep 3: Renaming output...');

  const binaryName = getBinaryName(platform, arch);
  const outputPath = path.join(RELEASES_DIR, binaryName);
  const seaOutput = path.join(RELEASES_DIR, 'djawa');

  // Check what file exists
  const candidates = [seaOutput, seaOutput + '.exe'];
  let found = null;
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      found = c;
      break;
    }
  }

  if (found && found !== outputPath) {
    fs.renameSync(found, outputPath);
  }

  if (platform !== 'windows' && fs.existsSync(outputPath)) {
    fs.chmodSync(outputPath, 0o755);
  }

  console.log(`Executable created: bin/releases/${binaryName}`);
  return outputPath;
}

function printSize(outputPath) {
  if (!fs.existsSync(outputPath)) return;
  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`\nBuild complete!`);
  console.log(`  File: ${outputPath}`);
  console.log(`  Size: ${sizeMB} MB`);
}

async function main() {
  const opts = parseArgs();

  const v = getNodeVersion();
  console.log(`Building Djawa Script for ${opts.platform}-${opts.arch}...`);
  console.log(`Node.js v${v.major}.${v.minor}.${v.patch} (${supportsBuildSEA() ? '--build-sea' : '--experimental-sea-config + postject'})\n`);

  await bundle();
  generateSEA();
  const outputPath = renameOutput(opts.platform, opts.arch);
  printSize(outputPath);
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
