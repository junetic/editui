import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  assertChromeManifest,
  assertFirefoxManifest,
  chromeZipPath,
  firefoxSourcesZipPath,
  firefoxZipPath,
  readZipManifest,
  requireSecrets,
  submissionState,
} from './store-package';

const firefoxManifest = {
  version: '1.0.2',
  browser_specific_settings: {
    gecko: {
      id: 'editui@editui.app',
      strict_min_version: '128.0',
      data_collection_permissions: { required: ['none'] },
    },
  },
};

describe('store package paths', () => {
  it('names both store zips from the package version', () => {
    expect(chromeZipPath('1.0.2')).toBe('output/editui-1.0.2-chrome.zip');
    expect(firefoxZipPath('1.0.2')).toBe('output/editui-1.0.2-firefox.zip');
    expect(firefoxSourcesZipPath('1.0.2')).toBe('output/editui-1.0.2-sources.zip');
  });
});

describe('requireSecrets', () => {
  it('names every missing secret', () => {
    expect(() => requireSecrets({ CHROME_CLIENT_ID: ' ' }, ['CHROME_CLIENT_ID', 'CHROME_PUBLISHER_ID'])).toThrow(
      'Missing CHROME_CLIENT_ID, CHROME_PUBLISHER_ID',
    );
  });
});

describe('submissionState', () => {
  it('treats a duplicate version as already submitted', () => {
    expect(submissionState('You have already uploaded version 1.0.2')).toBe('already');
    expect(submissionState('Version 1.0.2 already exists.')).toBe('already');
  });

  it('rejects a package that is not newer than the published version', () => {
    expect(submissionState('The version must be greater than the published version')).toBe('rejected');
  });
});

describe('manifest checks', () => {
  it('accepts a Chrome manifest for the requested version', () => {
    expect(() => assertChromeManifest({ version: '1.0.2' }, '1.0.2')).not.toThrow();
  });

  it('rejects a Chrome package that carries the Firefox id', () => {
    expect(() => assertChromeManifest(firefoxManifest, '1.0.2')).toThrow(/Firefox add-on id/);
  });

  it('requires the Firefox id, minimum version, and data-collection declaration', () => {
    expect(() => assertFirefoxManifest(firefoxManifest, '1.0.2')).not.toThrow();
    expect(() => assertFirefoxManifest({ version: '1.0.2' }, '1.0.2')).toThrow(/Firefox package id/);
  });

  it('reads the manifest from a zip', () => {
    const dir = mkdtempSync(join(tmpdir(), 'editui-zip-'));
    try {
      writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ version: '1.0.2' }));
      execFileSync('zip', ['-q', 'package.zip', 'manifest.json'], { cwd: dir });
      expect(readZipManifest(join(dir, 'package.zip')).version).toBe('1.0.2');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
