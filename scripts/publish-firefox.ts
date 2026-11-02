import { readFileSync } from 'node:fs';
import { publishFirefoxAddon, readFirefoxListing } from '../lib/publish-firefox.ts';
import { firefoxSourcesZipPath, firefoxZipPath, requireSecrets } from '../lib/store-package.ts';

const version = (JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }).version;
const secrets = requireSecrets(process.env, ['AMO_JWT_ISSUER', 'AMO_JWT_SECRET']);
const result = await publishFirefoxAddon({
  version,
  zip: readFileSync(firefoxZipPath(version)),
  source: readFileSync(firefoxSourcesZipPath(version)),
  listing: readFirefoxListing('store/firefox-listing.json'),
  issuer: secrets.AMO_JWT_ISSUER ?? '',
  secret: secrets.AMO_JWT_SECRET ?? '',
  fetch,
});
process.stdout.write(`Firefox ${version} ${result}\n`);
