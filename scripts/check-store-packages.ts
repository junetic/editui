import { existsSync, readFileSync } from 'node:fs';
import {
  assertChromeManifest,
  assertFirefoxManifest,
  chromeZipPath,
  firefoxSourcesZipPath,
  firefoxZipPath,
  readZipManifest,
} from '../lib/store-package.ts';

const version = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version;
assertChromeManifest(readZipManifest(chromeZipPath(version)), version);
assertFirefoxManifest(readZipManifest(firefoxZipPath(version)), version);
const sources = firefoxSourcesZipPath(version);
if (!existsSync(sources)) throw new Error(`Missing ${sources}`);
process.stdout.write(`Store packages match ${version}\n`);
