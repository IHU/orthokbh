#!/usr/bin/env ts-node
/**
 * create-startup-kit.ts
 *
 * Production-ready script for cloning a clean Next.js “startup kit” from a baseline project.
 * Usage examples are provided after the script body.
 */

import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

type CLIArgs = {
  source?: string;
  name?: string;
  dest?: string;
  config?: string;
  help?: boolean;
};

type StartupKitConfig = {
  excludes?: string[];
};

type CopyStats = {
  filesCopied: number;
  directoriesCreated: number;
  skipped: number;
};

const DEFAULTS = {
  baselineDirName: 'baseline',
  projectName: 'next-startup-kit',
};

const DEFAULT_EXCLUDES = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache',
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml',
];

async function main() {
  const cli = parseArgs(process.argv.slice(2));
  if (cli.help) {
    printUsage();
    process.exit(0);
  }

  const cwd = process.cwd();
  const sourceInput = cli.source ?? DEFAULTS.baselineDirName;
  const projectName = sanitizeName(cli.name ?? DEFAULTS.projectName);
  const sourceBaselineDir = await resolveBaselineDir(sourceInput, cwd);
  const destinationRoot = await resolveDestinationRoot(cli.dest, sourceBaselineDir, cwd);
  const destinationPath = path.join(destinationRoot, projectName);

  await ensureDestinationAvailable(destinationPath, sourceBaselineDir);
  const config = await loadConfig(cli.config, cwd);
  const excludes = new Set(config.excludes ?? DEFAULT_EXCLUDES);

  logSection('Startup kit scaffolding');
  logInfo(`Source baseline: ${sourceBaselineDir}`);
  logInfo(`Destination root: ${destinationRoot}`);
  logInfo(`Project name: ${projectName}`);
  logInfo(`Resolved destination: ${destinationPath}`);
  logInfo(`Excluding: ${Array.from(excludes).join(', ') || '(none)'}`);

  await fs.mkdir(destinationPath, { recursive: false });
  logStep(`Created project directory`);

  const stats: CopyStats = {
    filesCopied: 0,
    directoriesCreated: 0,
    skipped: 0,
  };

  await copyDirectoryRecursive({
    sourceRoot: sourceBaselineDir,
    sourceDir: sourceBaselineDir,
    destinationDir: destinationPath,
    excludes,
    stats,
  });

  logSection('Summary');
  logInfo(`Directories created: ${stats.directoriesCreated}`);
  logInfo(`Files copied: ${stats.filesCopied}`);
  logInfo(`Entries skipped: ${stats.skipped}`);
  logSuccess('Startup kit created successfully');
}

async function resolveBaselineDir(input: string, cwd: string): Promise<string> {
  const resolved = path.resolve(cwd, input);
  const stat = await safeStat(resolved);
  if (!stat?.isDirectory()) {
    throw new Error(`Source path is not a directory: ${resolved}`);
  }

  if (path.basename(resolved) === DEFAULTS.baselineDirName) {
    return resolved;
  }

  const candidate = path.join(resolved, DEFAULTS.baselineDirName);
  const candidateStat = await safeStat(candidate);
  if (candidateStat?.isDirectory()) {
    return candidate;
  }

  throw new Error(
    `Could not locate "${DEFAULTS.baselineDirName}" directory. Provide a direct path to it or to a folder containing it.`,
  );
}

async function resolveDestinationRoot(
  destArg: string | undefined,
  sourceBaselineDir: string,
  cwd: string,
): Promise<string> {
  if (destArg) {
    const resolved = path.resolve(cwd, destArg);
    await fs.mkdir(resolved, { recursive: true });
    return resolved;
  }

  return path.dirname(sourceBaselineDir);
}

async function ensureDestinationAvailable(destPath: string, sourceBaselineDir: string) {
  const existingStat = await safeStat(destPath);
  if (existingStat) {
    throw new Error(`Destination already exists: ${destPath}`);
  }

  const relative = path.relative(sourceBaselineDir, destPath);
  if (!relative || !relative.startsWith('..')) {
    throw new Error(
      `Destination must be outside the source baseline directory.\nSource: ${sourceBaselineDir}\nDestination: ${destPath}`,
    );
  }
}

async function copyDirectoryRecursive(options: {
  sourceRoot: string;
  sourceDir: string;
  destinationDir: string;
  excludes: Set<string>;
  stats: CopyStats;
}) {
  const { sourceRoot, sourceDir, destinationDir, excludes, stats } = options;
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const relativePath = path.relative(sourceRoot, sourcePath);
    const shouldSkip = isExcluded(relativePath, excludes, entry);

    if (shouldSkip) {
      stats.skipped += 1;
      logSkip(relativePath);
      continue;
    }

    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      stats.directoriesCreated += 1;
      logStep(`Created directory: ${relativePath}`);
      await copyDirectoryRecursive({
        sourceRoot,
        sourceDir: sourcePath,
        destinationDir: destinationPath,
        excludes,
        stats,
      });
    } else if (entry.isFile()) {
      await fs.copyFile(sourcePath, destinationPath);
      stats.filesCopied += 1;
      logStep(`Copied file: ${relativePath}`);
    } else if (entry.isSymbolicLink()) {
      const target = await fs.readlink(sourcePath);
      await fs.symlink(target, destinationPath);
      stats.filesCopied += 1;
      logStep(`Copied symlink: ${relativePath} -> ${target}`);
    } else {
      stats.skipped += 1;
      logSkip(`${relativePath} (unsupported entry type)`);
    }
  }
}

function isExcluded(relativePath: string, excludes: Set<string>, entry: import('fs').Dirent): boolean {
  if (!relativePath) {
    return false;
  }

  const segments = relativePath.split(path.sep);
  if (segments.some((segment) => excludes.has(segment))) {
    return true;
  }

  if (entry.isFile()) {
    return false;
  }

  return false;
}

function parseArgs(argv: string[]): CLIArgs {
  const args: CLIArgs = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      continue;
    }
    const key = token.slice(2);

    switch (key) {
      case 'help':
      case 'h':
        args.help = true;
        break;
      case 'source':
        args.source = requireValue(argv, ++i, '--source');
        break;
      case 'name':
        args.name = requireValue(argv, ++i, '--name');
        break;
      case 'dest':
        args.dest = requireValue(argv, ++i, '--dest');
        break;
      case 'config':
        args.config = requireValue(argv, ++i, '--config');
        break;
      default:
        throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function requireValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function sanitizeName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Project name cannot be empty.');
  }
  const sanitized = trimmed.replace(/[^a-zA-Z0-9-_]/g, '-');
  return sanitized.toLowerCase();
}

async function loadConfig(configArg: string | undefined, cwd: string): Promise<StartupKitConfig> {
  if (!configArg) {
    return { excludes: DEFAULT_EXCLUDES };
  }

  const configPath = path.resolve(cwd, configArg);
  const configStat = await safeStat(configPath);
  if (!configStat?.isFile()) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  const raw = await fs.readFile(configPath, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse config JSON: ${configPath}\n${(error as Error).message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Invalid config file: ${configPath}`);
  }

  const config = parsed as StartupKitConfig;
  if (config.excludes && !Array.isArray(config.excludes)) {
    throw new Error('Config property "excludes" must be an array of strings.');
  }

  return {
    excludes: config.excludes ?? DEFAULT_EXCLUDES,
  };
}

async function safeStat(target: string) {
  try {
    return await fs.stat(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function logSection(message: string) {
  console.log(`\n=== ${message} ===`);
}

function logInfo(message: string) {
  console.log(`• ${message}`);
}

function logStep(message: string) {
  console.log(`  ↳ ${message}`);
}

function logSkip(message: string) {
  console.log(`  ↳ Skipped: ${message}`);
}

function logSuccess(message: string) {
  console.log(`\n✅ ${message}`);
}

function printUsage() {
  console.log(`Usage:
  ts-node create-startup-kit.ts [--source <path>] [--name <project-name>] [--dest <destination>] [--config <config-file>]

Options:
  --source   Path to the existing baseline project or folder containing "baseline" (default: ./baseline)
  --name     Name for the new startup kit directory (default: next-startup-kit)
  --dest     Destination directory where the kit will be created (default: parent of source baseline)
  --config   Path to a JSON config file with an "excludes" array override
  --help     Show this message
`);
}

main().catch((error) => {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});