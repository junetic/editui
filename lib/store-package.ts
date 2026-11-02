import { execFileSync } from 'node:child_process';

export const CHROME_EXTENSION_ID = 'kolehloegjbpkeehflbdkjkdmljobfak';
export const FIREFOX_EXTENSION_ID = 'editui@editui.app';

export function chromeZipPath(version: string): string {
  return `output/editui-${version}-chrome.zip`;
}

export function firefoxZipPath(version: string): string {
  return `output/editui-${version}-firefox.zip`;
}

export function firefoxSourcesZipPath(version: string): string {
  return `output/editui-${version}-sources.zip`;
}

export function requireSecrets(env: Record<string, string | undefined>, names: string[]): Record<string, string> {
  const missing = names.filter((name) => !env[name]?.trim());
  if (missing.length) throw new Error(`Missing ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, env[name]?.trim() ?? '']));
}

export function submissionState(message: string): 'already' | 'rejected' | 'unknown' {
  const text = message.toLowerCase();
  if (/higher than|greater than|must be increased|version must be/.test(text)) return 'rejected';
  if (/already uploaded|already been uploaded|already exists|already submitted|duplicate version|same as the published/.test(text)) {
    return 'already';
  }
  return 'unknown';
}

interface StoreManifest {
  version?: string;
  browser_specific_settings?: {
    gecko?: {
      id?: string;
      strict_min_version?: string;
      data_collection_permissions?: { required?: string[] };
    };
  };
}

export function assertChromeManifest(manifest: StoreManifest, version: string): void {
  if (manifest.version !== version) throw new Error(`Chrome package is ${manifest.version ?? 'missing'}, expected ${version}`);
  if (manifest.browser_specific_settings?.gecko) throw new Error('Chrome package includes a Firefox add-on id');
}

export function assertFirefoxManifest(manifest: StoreManifest, version: string): void {
  if (manifest.version !== version) throw new Error(`Firefox package is ${manifest.version ?? 'missing'}, expected ${version}`);
  const gecko = manifest.browser_specific_settings?.gecko;
  if (gecko?.id !== FIREFOX_EXTENSION_ID) throw new Error(`Firefox package id is ${gecko?.id ?? 'missing'}`);
  if (gecko.strict_min_version !== '128.0') throw new Error('Firefox package is missing the minimum version');
  if (!gecko.data_collection_permissions?.required?.includes('none')) {
    throw new Error('Firefox package is missing the data-collection declaration');
  }
}

export function readZipManifest(zipPath: string): StoreManifest {
  const stdout = execFileSync('unzip', ['-p', zipPath, 'manifest.json'], { encoding: 'utf8' });
  return JSON.parse(stdout) as StoreManifest;
}
