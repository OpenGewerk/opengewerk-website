// The help of the craft software on the website (#269 of opengewerk): the
// quick guides and the manual, copied from packages/web/help of the
// application by scripts/sync-help.mjs. The application is the source; these
// pages are for whoever has no instance at hand, before the first one or
// while one is down.
import type { MarkdownInstance } from 'astro';

type Text = MarkdownInstance<Record<string, never>>;

export interface HelpText {
  readonly folder: 'kurzanleitungen' | 'handbuch';
  readonly slug: string;
  readonly title: string;
  readonly lead: string;
  readonly Content: Text['Content'];
}

/** The order of the application: the core flows of section 8, the chapters as a setup needs them. */
const order = {
  kurzanleitungen: ['angebot', 'regiebericht-zur-rechnung', 'plantafel', 'protokoll'],
  handbuch: ['installation', 'update', 'sicherung', 'weitere-betriebe'],
} as const;

/**
 * The first paragraph in plain words, as the application shows it under a
 * title: the signs of code, emphasis and links taken out, the words kept.
 */
function plain(paragraph: string): string {
  return paragraph
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ');
}

function read(folder: HelpText['folder'], found: Record<string, Text>): HelpText[] {
  return Object.entries(found)
    .map(([path, text]) => {
      const slug = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
      const title = text.getHeadings().find((heading) => heading.depth === 1)?.text ?? slug;
      const lead = plain(
        text
          .rawContent()
          .split(/\n\s*\n/)
          .map((block) => block.trim())
          .find((block) => block !== '' && !/^(?:#|[-*+] |\d+\. |>)/.test(block)) ?? '',
      );
      return { folder, slug, title, lead, Content: text.Content };
    })
    .sort((one, other) => place(folder, one.slug) - place(folder, other.slug));
}

/** Where a text stands in its order; one the order does not name yet comes last. */
function place(folder: HelpText['folder'], slug: string): number {
  const at = (order[folder] as readonly string[]).indexOf(slug);
  return at === -1 ? Number.MAX_SAFE_INTEGER : at;
}

/**
 * The tags a text may become: exactly the part of Markdown the application
 * reads (headings, paragraphs, lists, bold, code and links to https). The
 * application shows these texts as words and never as HTML; the website
 * renders them with the whole of Markdown, so a tag outside this part, raw
 * HTML or a link to anything but https, stops the build instead of reaching
 * a page.
 */
const allowedTag =
  /^<(?:\/?(?:h[1-3]|p|ul|ol|li|strong|code|a)|h[1-3] id="[^"]*"|ol start="[0-9]+"|a href="https:\/\/[^"]*")>$/;

async function holdToSubset(found: Record<string, Text>): Promise<Record<string, Text>> {
  for (const [path, text] of Object.entries(found)) {
    const html = await text.compiledContent();
    for (const [tag] of html.matchAll(/<[^>]*>/g)) {
      if (!allowedTag.test(tag)) {
        throw new Error(`${path}: ${tag} steht nicht in dem Teil von Markdown, den die Anwendung liest.`);
      }
    }
    // A tag without its ">" escapes the loop above, and the page around the
    // text would close it. Text writes "<" as &lt;, so once every tag above has
    // passed, a "<" after the last ">" can only be such a tag.
    if (html.lastIndexOf('<') > html.lastIndexOf('>')) {
      throw new Error(`${path}: ein Tag ohne Ende steht nicht in dem Teil von Markdown, den die Anwendung liest.`);
    }
  }
  return found;
}

// The sources as written, checked before any text is loaded as a module:
// frontmatter can name a layout, and Astro imports that as code while the
// module of the text loads. A text starts with its title, so nothing can.
const sources = import.meta.glob<string>('./hilfe/*/*.md', { query: '?raw', import: 'default', eager: true });
for (const [path, source] of Object.entries(sources)) {
  if (!source.startsWith('# ')) {
    throw new Error(`${path}: beginnt nicht mit seinem Titel, davor stünde Frontmatter.`);
  }
  // Raw HTML outside code, even a tag the subset knows: the application shows
  // it as words, so it is no part of a text. Inside code it stays code.
  const prose = source.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  const raw = /<[A-Za-z/!?]/.exec(prose);
  if (raw) {
    throw new Error(`${path}: rohes HTML (${raw[0]}…) steht nicht in dem Teil von Markdown, den die Anwendung liest.`);
  }
}

async function load(found: Record<string, () => Promise<Text>>): Promise<Record<string, Text>> {
  const loaded: Record<string, Text> = {};
  for (const [path, loader] of Object.entries(found)) loaded[path] = await loader();
  return loaded;
}

export const guides = read(
  'kurzanleitungen',
  await holdToSubset(await load(import.meta.glob<Text>('./hilfe/kurzanleitungen/*.md'))),
);
export const chapters = read(
  'handbuch',
  await holdToSubset(await load(import.meta.glob<Text>('./hilfe/handbuch/*.md'))),
);
