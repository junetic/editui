export type VersionBump = 'none' | 'patch' | 'minor' | 'major';

const BUMPS = new Set<VersionBump>(['none', 'patch', 'minor', 'major']);

export function isVersionBump(value: string): value is VersionBump {
  return BUMPS.has(value as VersionBump);
}

export function nextVersion(current: string, bump: VersionBump): string {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(current);
  if (!match) throw new Error(`Version must be major.minor.patch, got ${current}`);
  if (bump === 'none') return current;
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

export function replacePackageVersion(source: string, next: string): string {
  const match = /"version": "(\d+\.\d+\.\d+)"/.exec(source);
  if (!match?.[1]) throw new Error('package.json has no major.minor.patch version');
  return source.replace(`"version": "${match[1]}"`, `"version": "${next}"`);
}
