# Leonida Trophy Guide — GTA VI

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/bismilahdestia/gta6-trophy-guide-01-entry-v1/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/bismilahdestia/gta6-trophy-guide-01-entry-v1/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — an entry for the [make.fun GTA 6 Trophy Guide bounty](https://make.fun/c/gta6-trophy-guide-01).

## What it is

- **Every trophy, with its official name, description and grade** exactly as PlayStation publishes them (Exophase / PSNProfiles, 18 Nov 2026).
- **A guide in our own words for each trophy** — what to do, where and how, when it can be missed — with its sources named beside it. Where no method was confirmed at launch, the guide says so instead of guessing.
- **A roadmap to the platinum** in three stages (story → 100% completion → clean-up), with the 100% checklist numbers and the warnings that protect a run.
- **A tracker**: tick trophies off, progress saves in the browser (localStorage), export to a file and import it back; filters by kind (story, missable, collectibles, activities, robberies, characters, money, online) and by grade; a spoiler setting that hides story trophy names and descriptions until they are earned.

## Run it

Static files, no build step, no network requests at runtime:

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` from any static file server with `app/` at its root.

## Layout

- `app/index.html` — the page shell
- `app/style.css` — the look (original design, system fonts, no external assets)
- `app/main.js` — boot: loads the data, wires the toolbar, views and hash routes
- `app/tracker.js` — earned-trophy state (localStorage, export/import) and filter matching
- `app/render.js` — the checklist UI: chips, progress, trophy cards, spoiler mask
- `app/roadmap.js` — the platinum roadmap data and rendering
- `app/data/trophies.json` — the 55 trophies with guides and sources
- `main.ts` — the make.fun entrypoint: copies `app/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — real renders of the guide in a browser

## Screenshots

Real renders of the guide in desktop Chrome (1280×800, taken headlessly):

1. `1-cover.jpg` — the checklist with the first guides open
2. `2-guide-missable.jpg` — Positive Mental Attitude, the possibly missable trophy, with its guide and sources
3. `3-roadmap.jpg` — the roadmap to the platinum
4. `4-tracker.jpg` — the tracker at work: seeded progress, spoiler masking on hidden story trophies

## Sources

- [Planet GTA 6 — trophy list](https://www.planetgta6.com/en/gta-6-trophies/) (official names/descriptions/grades, via Exophase & PSNProfiles)
- [KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [Output Lag — GTA 6 Trophy List](https://outputlag.com/guides/gta-6-trophy-list/)
- [eGamers — GTA 6 Trophy List](https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/)

Fan-made guide, not affiliated with Rockstar Games. It uses no Rockstar logo, artwork or screenshots.

## License

MIT — see [LICENSE](LICENSE).
