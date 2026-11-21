import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.platform !== 'win32') {
  throw new Error('The standalone Windows executable must be built on Windows.');
}

const cliDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(cliDir, 'dist');
const bundlePath = path.join(distDir, 'tempe.cjs');
const configPath = path.join(distDir, 'sea-config.json');
const blobPath = path.join(distDir, 'tempe-sea.blob');
const executablePath = path.join(distDir, 'tempe.exe');

fs.mkdirSync(distDir, { recursive: true });

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: cliDir,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${args.join(' ')}`);
  }
}

runNode([
  path.join(cliDir, 'node_modules', 'esbuild', 'bin', 'esbuild'),
  'bin/tempe.js',
  '--bundle',
  '--platform=node',
  '--format=cjs',
  `--outfile=${bundlePath}`,
]);

fs.writeFileSync(
  configPath,
  JSON.stringify({
    main: bundlePath,
    output: blobPath,
    disableExperimentalSEAWarning: true,
  }),
);
runNode(['--experimental-sea-config', configPath]);
fs.copyFileSync(process.execPath, executablePath);
runNode([
  path.join(cliDir, 'node_modules', 'postject', 'dist', 'cli.js'),
  executablePath,
  'NODE_SEA_BLOB',
  blobPath,
  '--sentinel-fuse',
  'NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2',
]);

console.log(`Created ${executablePath}`);
