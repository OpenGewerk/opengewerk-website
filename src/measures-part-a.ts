/**
 * Part A of the technical and organisational measures, "Was die Anwendung
 * mitbringt", for the templates of the contract on processing on behalf, one
 * for each application (opengewerk-haustechnik#358, opengewerk#319). It is not
 * written here: it is read at build time from the template the application
 * makes the measures of an operator or a business from, on `main` of its
 * repository, so that the page and the made document say the same (one
 * source, decided on 19.10.2026).
 *
 * A build that cannot read the template fails rather than show an old part A.
 * After part A changed in an application, the deploy of the website is run by
 * hand (`gh workflow run deploy.yml`); section 11 of the description of the
 * processing of the Haustechnik says so.
 */

export const partASource =
  'https://raw.githubusercontent.com/OpenGewerk/opengewerk-haustechnik/main/packages/server/templates/measures.md';

/** The template of the trades application, without the proofs in square brackets the Haustechnik has. */
export const tradesPartASource =
  'https://raw.githubusercontent.com/OpenGewerk/opengewerk/main/packages/server/templates/measures.md';

export interface PartASection {
  /** "A.1 Anmeldung" */
  readonly title: string;
  readonly statements: readonly string[];
}

/** Part A out of the template: its sections with their statements, without the proofs in square brackets. */
export function partAOf(template: string): readonly PartASection[] {
  const start = template.indexOf('## Teil A:');
  const end = template.indexOf('## Teil B:');

  if (start < 0 || end < start) {
    throw new Error('The template of the measures has no part A before its part B.');
  }

  const sections: { title: string; statements: string[] }[] = [];

  for (const line of template.slice(start, end).split('\n')) {
    const heading = /^### (A\.\d+ .+)$/.exec(line);

    if (heading) {
      sections.push({ title: heading[1] ?? '', statements: [] });
      continue;
    }

    if (line.startsWith('- ') && sections.length > 0) {
      const statement = line
        .slice(2)
        .replace(/\s*\[(?:[BK][\d.]+(?:, )?)+\]\s*$/, '')
        .trim();

      sections[sections.length - 1]?.statements.push(statement);
    }
  }

  if (sections.length === 0 || sections.some((section) => section.statements.length === 0)) {
    throw new Error('Part A of the template of the measures has a section without a statement.');
  }

  return sections;
}

export async function partA(source: string = partASource): Promise<readonly PartASection[]> {
  const answer = await fetch(source);

  if (!answer.ok) {
    throw new Error(`Part A could not be read from ${source}: ${String(answer.status)}.`);
  }

  return partAOf(await answer.text());
}
