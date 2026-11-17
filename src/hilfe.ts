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
  kurzanleitungen: ['angebot', 'regiebericht-zur-rechnung', 'plantafel', 'pruefprotokoll'],
  handbuch: ['installation', 'update', 'sicherung', 'weitere-betriebe'],
} as const;

function read(folder: HelpText['folder'], found: Record<string, Text>): HelpText[] {
  return Object.entries(found)
    .map(([path, text]) => {
      const slug = path.slice(path.lastIndexOf('/') + 1).replace(/\.md$/, '');
      const title = text.getHeadings().find((heading) => heading.depth === 1)?.text ?? slug;
      const lead =
        text
          .rawContent()
          .split(/\n\s*\n/)
          .map((block) => block.trim())
          .find((block) => block !== '' && !block.startsWith('#')) ?? '';
      return { folder, slug, title, lead, Content: text.Content };
    })
    .sort(
      (one, other) =>
        (order[folder] as readonly string[]).indexOf(one.slug) -
        (order[folder] as readonly string[]).indexOf(other.slug),
    );
}

export const guides = read(
  'kurzanleitungen',
  import.meta.glob<Text>('./hilfe/kurzanleitungen/*.md', { eager: true }),
);
export const chapters = read('handbuch', import.meta.glob<Text>('./hilfe/handbuch/*.md', { eager: true }));
