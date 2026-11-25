// Walks the built site and checks two things a build log never shows.
//
// Title and description stay inside what a search result shows (#65): a longer
// one is cut off in the snippet, a shorter one wastes the room. Pages with
// noindex are left out, no search result shows them.
//
// Nothing inline runs or styles a page (#64). The vHost sends a
// Content-Security-Policy that allows scripts and styles from the site itself
// only, so an inline <script>, a <style>, a style attribute or an on* handler
// would be blocked in the browser without a word. JSON-LD is data, not code,
// and stays allowed.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath rather than url.pathname: the path of this checkout contains a
// space, and pathname hands it back percent encoded.
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const TITLE = { min: 30, max: 60 };
const DESCRIPTION = { min: 70, max: 155 };

async function htmlFiles(directory) {
  const found = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, item.name);
    if (item.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (item.name.endsWith('.html')) found.push(full);
  }
  return found;
}

// The few entities Astro writes into attributes and the title.
const decode = (text) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function lengthProblems(html) {
  const head = html.slice(0, html.indexOf('</head>'));
  if (/<meta name="robots" content="[^"]*noindex/.test(head)) return [];
  const problems = [];
  const title = decode(head.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (title.length < TITLE.min || title.length > TITLE.max) {
    problems.push(`Titel mit ${title.length} Zeichen, erlaubt ${TITLE.min} bis ${TITLE.max}: "${title}"`);
  }
  const description = decode(head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (description.length < DESCRIPTION.min || description.length > DESCRIPTION.max) {
    problems.push(
      `Beschreibung mit ${description.length} Zeichen, erlaubt ${DESCRIPTION.min} bis ${DESCRIPTION.max}`,
    );
  }
  return problems;
}

function inlineProblems(html) {
  const problems = [];
  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    const attributes = match[1];
    // src as an attribute of its own, not the tail of data-src.
    if (/(?:^|\s)src\s*=/i.test(attributes) || /type="application\/ld\+json"/i.test(attributes)) continue;
    problems.push('eingebettetes <script>');
  }
  if (/<style\b/i.test(html)) problems.push('eingebettetes <style>');
  if (/\shref\s*=\s*["']?\s*javascript:/i.test(html)) problems.push('javascript:-Verweis');
  // The attribute name alone counts: double, single or no quotes, with or
  // without space around the equals sign.
  if (/<[a-z][^>]*\sstyle\s*=/i.test(html)) problems.push('style-Attribut');
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(html)) problems.push('on…-Attribut (Event-Handler)');
  return problems;
}

const pages = await htmlFiles(DIST);
const problems = [];

for (const page of pages) {
  const html = await readFile(page, 'utf8');
  for (const problem of [...lengthProblems(html), ...inlineProblems(html)]) {
    problems.push(`${page.slice(DIST.length)}: ${problem}`);
  }
}

if (problems.length > 0) {
  console.error('Seiten, die die Prüfung nicht bestehen:');
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`${pages.length} Seiten geprüft: Titel und Beschreibung in den Grenzen, nichts eingebettet.`);
