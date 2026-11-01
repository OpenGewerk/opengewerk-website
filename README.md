<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/opengewerk/.github/main/brand/opengewerk-logo-dark.svg">
    <img alt="OpenGewerk" src="https://raw.githubusercontent.com/opengewerk/.github/main/brand/opengewerk-logo.svg" width="320">
  </picture>
</p>

<p align="center"><strong>Die Website von OpenGewerk unter opengewerk.de</strong></p>

<p align="center">
  <a href="https://github.com/opengewerk/opengewerk-website/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/opengewerk/opengewerk-website/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/opengewerk/opengewerk-website/actions/workflows/deploy.yml"><img alt="Ausliefern" src="https://github.com/opengewerk/opengewerk-website/actions/workflows/deploy.yml/badge.svg"></a>
</p>

## Zweck

Der Quelltext von [opengewerk.de](https://opengewerk.de), statisch gebaut mit Astro, eine Seite je Thema. Die Website stellt zwei Open-Source-Anwendungen vor, beide self-hosted: die Handwerkersoftware mit CRM und ERP in einem, unter `/funktionen/` mit den Unterseiten Elektro und PV und Buchhaltung, und OpenGewerk Haustechnik, ein CAFM für Betreiber von Gebäuden, unter `/haustechnik/`. Die Startseite führt zu beiden. Dazu kommen Seiten zum Selbsthosten, ein Vergleich mit anderen Lösungen, der Stand beider Anwendungen und wie man mitmacht.

Jede Seite nennt, was gebaut ist und was nicht. Die Vergleichsseite nennt auch die Fälle, in denen ein anderes Produkt heute besser passt, und ein Bild, das nicht die gebaute Oberfläche zeigt, trägt die Marke "Entwurf".

## Entwickeln

Vorausgesetzt werden Node 24 und ein aktiviertes Corepack. pnpm kommt in der Version, die im Wurzelpaket steht.

```bash
pnpm install
pnpm run dev          # Entwicklungsserver
pnpm run check        # Typen
pnpm run build        # baut nach dist/
pnpm run check:links  # braucht ein gebautes dist/
```

Dieselben Schritte laufen in der CI. Ein Push auf `main` baut und spielt die Seite aus.

## Dokumentation

| Was | Wo |
| --- | --- |
| Aufbau, Schreibweise, Breiten, Bilder der Oberfläche, Marke, Suchmaschinen | [`docs/entwicklung.md`](docs/entwicklung.md) |
| Ausliefern: Abgleich auf den Server, Schlüssel und Secrets | [`docs/ausliefern.md`](docs/ausliefern.md) |

## Mitmachen

- Ein Fehler auf der Seite, ein veralteter Stand oder ein toter Verweis gehört als [Issue](https://github.com/opengewerk/opengewerk-website/issues) hierher, eine Frage zu den Anwendungen in deren Discussions.
- Sicherheitslücken bitte nicht öffentlich, sondern wie in der [SECURITY.md](https://github.com/opengewerk/.github/blob/main/SECURITY.md) beschrieben.
- Die Beitragsregeln stehen in der [CONTRIBUTING.md](https://github.com/opengewerk/.github/blob/main/CONTRIBUTING.md).

## Lizenz

[AGPL-3.0](LICENSE), wie die Anwendungen. Texte und Bilder dieser Seite gehören zum Projekt.
