import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { isVersionBump, nextVersion, replacePackageVersion } from '../lib/release-version.ts';

const bump = process.argv[2] ?? 'none';
if (!isVersionBump(bump)) throw new Error(`Unknown bump ${bump}`);

const source = readFileSync('package.json', 'utf8');
const current = (JSON.parse(source) as { version: string }).version;
const next = nextVersion(current, bump);
if (next !== current) writeFileSync('package.json', replacePackageVersion(source, next));
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${next}\n`);
process.stdout.write(`${next}\n`);
