import { describe, expect, it } from 'vitest';
import { isVersionBump, nextVersion, replacePackageVersion } from './release-version';

describe('nextVersion', () => {
  it('keeps the current version when the bump is none', () => {
    expect(nextVersion('1.0.2', 'none')).toBe('1.0.2');
  });

  it('bumps patch, minor, and major', () => {
    expect(nextVersion('1.0.2', 'patch')).toBe('1.0.3');
    expect(nextVersion('1.0.2', 'minor')).toBe('1.1.0');
    expect(nextVersion('1.0.2', 'major')).toBe('2.0.0');
  });

  it('rejects a version that is not major.minor.patch', () => {
    expect(() => nextVersion('1.0', 'patch')).toThrow(/major\.minor\.patch/);
  });
});

describe('replacePackageVersion', () => {
  it('replaces only the package version field', () => {
    const source = '{\n  "name": "editui",\n  "version": "1.0.2",\n  "type": "module"\n}\n';
    expect(replacePackageVersion(source, '1.0.3')).toBe(
      '{\n  "name": "editui",\n  "version": "1.0.3",\n  "type": "module"\n}\n',
    );
  });
});

describe('isVersionBump', () => {
  it('accepts the workflow choices', () => {
    expect(isVersionBump('none')).toBe(true);
    expect(isVersionBump('patch')).toBe(true);
    expect(isVersionBump('beta')).toBe(false);
  });
});
