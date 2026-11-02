import { readFileSync } from 'node:fs';
import { publishChromeStore } from '../lib/publish-chrome.ts';
import { chromeZipPath, requireSecrets } from '../lib/store-package.ts';

const version = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version;
const secrets = requireSecrets(process.env, [
  'CHROME_CLIENT_ID',
  'CHROME_CLIENT_SECRET',
  'CHROME_REFRESH_TOKEN',
  'CHROME_PUBLISHER_ID',
]);
const zip = chromeZipPath(version);
const result = await publishChromeStore({
  publisherId: secrets.CHROME_PUBLISHER_ID ?? '',
  clientId: secrets.CHROME_CLIENT_ID ?? '',
  clientSecret: secrets.CHROME_CLIENT_SECRET ?? '',
  refreshToken: secrets.CHROME_REFRESH_TOKEN ?? '',
  version,
  zip: readFileSync(zip),
  fetch,
});
process.stdout.write(`Chrome ${version} ${result}\n`);
