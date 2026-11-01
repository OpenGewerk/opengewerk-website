// One place for everything that appears in more than one file: the name, the
// canonical host, the navigation and the outbound links. A second copy of any
// of these is a copy that drifts.

export const SITE = {
  name: 'OpenGewerk',
  url: 'https://opengewerk.de',
  tagline: 'Self-hosted Software für Handwerk und Haustechnik',
  /** What the project is in two sentences. The front page and llms.txt both open with it. */
  description:
    'Open-Source-Software auf dem eigenen Server: die Handwerkersoftware für Elektro und PV, CRM und ERP in einem, und OpenGewerk Haustechnik für Betreiber von Gebäuden. Offline vor Ort, ohne Lizenzkosten, AGPL-3.0.',
  /** Falls back as the Open Graph image wherever a page brings none. */
  socialImage: '/marke/social.png',
} as const;

/** Provider details. Used by the two legal pages, so they cannot drift apart. */
export const PROVIDER = {
  name: 'Moritz Kohm',
  street: 'Hauptstraße 103',
  city: '68535 Edingen-Neckarhausen',
  country: 'Deutschland',
  email: 'info@opengewerk.de',
  vatId: 'DE364543992',
  // The institution's own name, which does not change with whoever holds the
  // office. Inventing a gendered form here would be a guess.
  supervisoryAuthority:
    'Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg',
  /** The rented machine this site runs on. A processor under Art. 28 GDPR. */
  hoster: 'netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe',
  /** How long the web server keeps its log files. */
  logRetention: '14 Tagen',
  /** Shown at the foot of both legal pages. */
  legalAsOf: 'September 2026',
} as const;

export const LINKS = {
  github: 'https://github.com/opengewerk',
  repository: 'https://github.com/opengewerk/opengewerk',
  dockerHub: 'https://hub.docker.com/r/opengewerk/opengewerk',
  discussions: 'https://github.com/opengewerk/opengewerk/discussions',
  issues: 'https://github.com/opengewerk/opengewerk/issues/new/choose',
  discord: 'https://discord.gg/NRrEvbQdxz',
  reddit: 'https://www.reddit.com/r/OpenGewerk/',
  concept:
    'https://github.com/opengewerk/opengewerk/blob/main/docs/konzept/Feature-Gliederung.md',
  decisions: 'https://github.com/opengewerk/opengewerk/tree/main/docs/adr',
  contributing:
    'https://github.com/opengewerk/.github/blob/main/CONTRIBUTING.md',
  license: 'https://github.com/opengewerk/opengewerk/blob/main/LICENSE',
  kanzlei: 'https://github.com/opengewerk/opengewerk-kanzlei',
  haustechnik: 'https://github.com/opengewerk/opengewerk-haustechnik',
  haustechnikConcept:
    'https://github.com/opengewerk/opengewerk-haustechnik/blob/main/docs/konzept/Planungskonzept.md',
  haustechnikProcedure:
    'https://github.com/opengewerk/opengewerk-haustechnik/blob/main/docs/verfahrensbeschreibung/Verfahrensbeschreibung.md',
  haustechnikPackages:
    'https://github.com/opengewerk/opengewerk-haustechnik/tree/main/pakete',
  apiSpec: 'https://github.com/opengewerk/opengewerk-api-spec',
} as const;

// The main navigation names each thing a visitor might be looking for once:
// the two applications, running them, the comparison, the state and how to
// take part. Pages that belong to an application sit under it; `also` lists
// them so the entry stays marked there.
export const NAVIGATION = [
  {
    href: '/funktionen/',
    label: 'Handwerkersoftware',
    also: ['/elektro-und-pv/', '/buchhaltung/'],
  },
  { href: '/haustechnik/', label: 'Haustechnik', also: [] },
  { href: '/self-hosting/', label: 'Selbst hosten', also: [] },
  { href: '/alternativen/', label: 'Vergleich', also: [] },
  { href: '/roadmap/', label: 'Stand', also: [] },
  { href: '/mitmachen/', label: 'Mitmachen', also: [] },
] as const;

// Every page with its one-line hint, in reading order. The footer, the page
// that catches a wrong address and llms.txt list these; the navigation has no
// room for the hints.
export const PAGES = [
  {
    href: '/funktionen/',
    label: 'Handwerkersoftware',
    hint: 'CRM & ERP für Elektro- und PV-Betriebe: vom Angebot bis zur E-Rechnung, mit dem Stand je Bereich.',
  },
  {
    href: '/elektro-und-pv/',
    label: 'Elektro und PV',
    hint: 'Die Anlage bis zum Stromkreis, das Prüfprotokoll und die PV-Struktur.',
  },
  {
    href: '/buchhaltung/',
    label: 'Buchhaltung',
    hint: 'Was geplant ist: eigenes Journal, GoBD, E-Rechnung im Ein- und Ausgang.',
  },
  {
    href: '/haustechnik/',
    label: 'Haustechnik',
    hint: 'CAFM für Betreiber von Gebäuden: Anlagen, Pflichten, Rundgänge und Nachweise.',
  },
  {
    href: '/haustechnik/stand/',
    label: 'Stand der Haustechnik',
    hint: 'Was in OpenGewerk Haustechnik gebaut ist und was als Nächstes kommt.',
  },
  {
    href: '/self-hosting/',
    label: 'Selbst hosten',
    hint: 'Start über Docker, Sicherung, Update und was der Server braucht.',
  },
  {
    href: '/alternativen/',
    label: 'Vergleich',
    hint: 'Gegenüber openHandwerk, plancraft, sevdesk, Odoo, Dolibarr und ERPNext.',
  },
  {
    href: '/roadmap/',
    label: 'Stand der Handwerkersoftware',
    hint: 'Die Phasen und wo die Handwerkersoftware gerade steht.',
  },
  {
    href: '/mitmachen/',
    label: 'Mitmachen',
    hint: 'Wobei gerade konkret geholfen werden kann.',
  },
] as const;
