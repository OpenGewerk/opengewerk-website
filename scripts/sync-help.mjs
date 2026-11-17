// Copies the quick guides and the manual from a checkout of opengewerk into
// src/hilfe (#269 of opengewerk). The help ships with the application and is
// read there without a network; these pages are a copy of the same files for
// whoever has no instance at hand, so the application is the source and this
// is run after a change there:
//
//   node scripts/sync-help.mjs ../opengewerk
//
// Files that are gone there are removed here, and the script names every file
// it changed.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const checkout = process.argv[2];

if (!checkout || !existsSync(join(checkout, 'packages/web/help'))) {
  console.error('Aufruf: node scripts/sync-help.mjs <Pfad zu einem Checkout von opengewerk>');
  process.exit(1);
}

const folders = { guides: 'kurzanleitungen', manual: 'handbuch' };

for (const [from, to] of Object.entries(folders)) {
  const source = join(checkout, 'packages/web/help', from);
  const target = join('src/hilfe', to);
  mkdirSync(target, { recursive: true });
  const wanted = readdirSync(source).filter((name) => name.endsWith('.md'));

  for (const name of wanted) {
    const before = existsSync(join(target, name)) ? readFileSync(join(target, name), 'utf8') : null;
    copyFileSync(join(source, name), join(target, name));
    if (before !== readFileSync(join(target, name), 'utf8')) console.log(`geändert: ${to}/${name}`);
  }

  for (const name of readdirSync(target)) {
    if (!wanted.includes(name)) {
      rmSync(join(target, name));
      console.log(`entfernt: ${to}/${name}`);
    }
  }
}
