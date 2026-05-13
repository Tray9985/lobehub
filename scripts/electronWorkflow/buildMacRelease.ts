import { execSync } from 'node:child_process';
import path from 'node:path';

import fs from 'fs-extra';

const rootDir = path.resolve(__dirname, '../..');
const desktopPackageJsonPath = path.join(rootDir, 'apps/desktop/package.json');
const desktopReleaseDir = path.join(rootDir, 'apps/desktop/release');
const rootPackageJsonPath = path.join(rootDir, 'package.json');

const isFlag = (value: string) => value.startsWith('-');

const parseArgs = (args: string[]) => {
  let dryRun = false;
  let version = '';
  let keepChanges = false;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '--version' || arg === '-v') {
      version = args[i + 1] ?? '';
      i += 1;
      continue;
    }

    if (arg === '--keep-changes') {
      keepChanges = true;
      continue;
    }

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (!isFlag(arg) && !version) {
      version = arg;
    }
  }

  return { dryRun, keepChanges, version };
};

const resolveDefaultVersion = () => {
  const rootPackageJson = fs.readJsonSync(rootPackageJsonPath);
  return rootPackageJson.version as string | undefined;
};

const runCommand = (command: string, env?: Record<string, string | undefined>) => {
  execSync(command, {
    cwd: rootDir,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
};

const main = async () => {
  const { dryRun, keepChanges, version: rawVersion } = parseArgs(process.argv.slice(2));
  const version = rawVersion || resolveDefaultVersion();

  if (!version) {
    console.error('Missing version. Provide it or ensure root package.json has a version.');
    process.exit(1);
  }

  const packageJsonBackup = await fs.readFile(desktopPackageJsonPath);

  console.log('🚦 macOS release build: stable');
  console.log(`🏷️  Desktop version: ${version}`);
  console.log(`🧩 Keep local changes: ${keepChanges ? 'yes' : 'no'}`);

  if (dryRun) {
    console.log(`DRY RUN: npm run workflow:set-desktop-version ${version} stable`);
    console.log('DRY RUN: clean apps/desktop/release');
    console.log('DRY RUN: UPDATE_CHANNEL=stable npm run package:mac --prefix=./apps/desktop');
    return;
  }

  try {
    runCommand(`npm run workflow:set-desktop-version ${version} stable`);
    await fs.remove(desktopReleaseDir);
    console.log('🧹 Cleaned desktop release output.');
    runCommand('npm run package:mac --prefix=./apps/desktop', { UPDATE_CHANNEL: 'stable' });
  } catch (error) {
    console.error('❌ macOS release build failed:', error);
    process.exitCode = 1;
  } finally {
    if (!keepChanges) {
      await fs.writeFile(desktopPackageJsonPath, packageJsonBackup);
      console.log('🧹 Restored local desktop package metadata.');
    }
  }
};

main();
