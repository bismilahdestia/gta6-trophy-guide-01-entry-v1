// Hands in the Leonida Trophy Guide (Node 22, standard library only).
//
// The guide itself is plain static files under app/ — index.html, a
// stylesheet, a few ES modules and data/trophies.json — served with the
// network off. This program copies app/ and screenshots/ next to this file
// into the output directory (MAKEFUN_OUTPUT_DIR outside the grader, /output
// inside it) and writes dossier.json there with the vendored make.fun
// library. vendor/makefun-frontend.ts stays untouched: the scorer rebuilds
// the dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputRoot = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree when it exists; the screenshots folder is optional
// in the sense that the gate refuses an entry without images, but copying
// only when present keeps a missing folder a gate failure, not a crash here.
function copyTree(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from)) return;
  cpSync(from, join(outputRoot, name), { recursive: true });
}

// Fail loudly when the guide itself is missing, instead of handing in an
// empty output directory the scorer would refuse without explanation.
if (!existsSync(join(repoRoot, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing: nothing to hand in');
}

mkdirSync(outputRoot, { recursive: true });
copyTree('app');
mkdirSync(join(outputRoot, 'screenshots'), { recursive: true });
copyTree('screenshots');

// The scorer's caps for this bounty: the text budget shapes the dossier,
// the rest refuse an entry the scorer would refuse anyway (too many
// screenshots, one too big, app/ too large or too many files).
const dossierOptions = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};
writeFileSync(join(outputRoot, 'dossier.json'), buildDossier(outputRoot, dossierOptions));
