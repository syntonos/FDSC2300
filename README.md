# FDSC 2300 — Culinary + Science

React + TypeScript (TSX), Vite, and Markdown. The site keeps the culinary-magazine design, mobile diagonal cover, layered scroll parallax, year/category filters, and student-work carousels.

## Run

Use Node.js 22.12 or newer; `.nvmrc` selects Node 24.

```sh
npm ci --cache /tmp/fdsc2300-npm-cache
npm run dev
```

The development server listens on port 3000. Run these commands from the repository root.

```sh
npm run check        # TypeScript, frontmatter, routes, and image references
npm test             # Markdown and archive behavior tests
npm run build        # Production React app and direct-entry route files
npm run preview      # Serve the production build
npm run preview:file # Build a single offline browser preview: preview.html
```

Download/open `preview.html` in a browser to review the complete site without a server. It contains React, Markdown content, images, and local fonts; navigation uses URL hashes in this offline file. Rebuild it after edits. Deploy `dist/` for the production website with clean URLs. Generated route folders support direct entry on static hosting; configure unknown paths to use `404.html` or the SPA fallback.

## GitHub Pages

The workflow in `.github/workflows/pages.yml` tests, builds, and deploys this site on pushes to `main`. In the repository's **Settings → Pages**, the source must be **GitHub Actions**. It can also be run manually from the Actions tab.

The workflow obtains the site's base path from GitHub Pages so images, fonts, and React navigation work at `https://syntonos.github.io/FDSC2300/`. Markdown links and image paths remain `/notes/...`, `/dishes/...`, and `/images/...`; the application adds the deployment prefix automatically. Files in `dist/` include each known route for direct visits and refreshes.

To test the project-path production build locally:

```sh
SITE_BASE_PATH=/FDSC2300/ npm run build
SITE_BASE_PATH=/FDSC2300/ npm run preview
```

Open `/FDSC2300/` on the preview server. The default local build still uses `/`.

## Organization

```text
content/
  pages/                  # Home, resources, archive/menu labels, link destinations
  dishes/2026/            # One Markdown file per dish, grouped by year
  notes/                  # Class notes, grouped in the UI by category
  settings/site.md        # Course identity, address, contacts
public/
  images/
    brand/                # Official Cornell identity asset
    pages/home/           # About collage photography
    dishes/<category>/<dish>/cover.jpg
    student-work/<year>/<dish>/
    notes/<topic>/
    library/              # Reusable reference photographs
  fonts/                  # Local fonts and licenses
src/
  components/layout/      # Sliding navigation and shared page layout
  components/dishes/      # Dish cards, archive, student-work carousel
  components/ui/          # Markdown, images, category picker, small controls
  pages/                  # React TSX page components
  hooks/                  # Metadata and scroll/parallax effects
  lib/                    # Typed Markdown loading, schemas, asset helpers
  styles/                 # Site, component, and cardstock styles
scripts/                  # Content validation, route generation, offline preview
templates/                # Copyable Markdown starters
```

## Common updates

| To change | Edit |
| --- | --- |
| Cover labels and divider words | `content/pages/home.md` |
| Mise en Place resources | `content/pages/mise-en-place.md` |
| Class notes | Copy the note template in `templates/` into `content/notes/` |
| Menu and dish archive entries | Copy `templates/dish.md` into `content/dishes/<year>/` |
| Course name, address, and contacts | `content/settings/site.md` |
| Cover typography and footer colors | `src/styles/global.css` |
| Mise en Place and Notes widths | The shared reading layout in `src/styles/components.css` |

Run `npm run check` after editing Markdown or moving images. It checks frontmatter, routes, and image references.

## Edit pages and links

Edit `content/pages/home.md` for cover words, section headings, the About paragraph, and `scrollLabel`/`dividerWords`. Other page Markdown files control resources and archive/menu labels. Shared contacts and course identity live in `content/settings/site.md`.

Submit and Instagram are direct external links. Their `externalUrl` fields live in `content/pages/submit.md` and `instagram.md`; they currently point to the services' general homepages as placeholders. Replace them with the actual Google Form and class profile. No API keys or passwords are needed.

## Add a dish

Copy `templates/dish.md` into `content/dishes/<year>/<dish-name>.md`, then update its frontmatter and body. Files are discovered automatically; no route or navigation code needs editing.

```yaml
title: Citrus tart
date: '2026-04-16'
status: past
category: Pastry
image: /images/dishes/pastry/citrus-tart/cover.jpg
imageAlt: A citrus tart with a golden crust.
description: Citrus curd in a crisp pastry shell.
technique: Custards & coagulation
skills: [Protein Coagulation, Temperature Control, Pastry]
duration: 90 minutes + cooling
ingredients: [Pastry shell, Citrus juice and zest, Eggs, Sugar, Butter]
team: FDSC 2300 kitchen
```

Use `past` or `upcoming` for `status`. The date determines sorting and year grouping; `category` drives the dropdown. Skills appear beneath dish titles, separated by dots. If omitted, the technique provides fallback labels.

The optional `ingredients` list appears below **Expected time** on the dish page. Each entry can include a quantity, such as `200 g flour`; edit these entries to match the assigned recipe.

The opening image is food-only. For an image with an unwanted decorative edge, optional `imageInset` crops a percentage from its edges without changing the source file (the salmon cover uses `5`).

### Student demo

The **Student demo** carousel appears after each dish's notes and before **More dishes**. Add actual photographs and credits with an optional `gallery` array:

```yaml
gallery:
  - image: /images/student-work/2026/citrus-tart/team-01.jpg
    student: Student or team name
    caption: Lemon curd with a hand-shaped pastry shell.
    alt: A finished citrus tart on a white plate.
```

Each image retains its name/team credit and caption. With no student photos, the site shows a clearly marked placeholder. Controls appear for two or more photos; keyboard and horizontal touch swipes work without blocking vertical scrolling. There is no autoplay.

## Add notes

Copy `templates/note.md` into `content/notes/`. Set `title`, `description`, `category`, and optional numeric `order`, then write the note in Markdown. Notes appear automatically at `/notes/` and receive a detail page. Link them from Mise en place or another note with `/notes/<filename>/`. Store note photographs in `public/images/notes/<topic>/` and reference them normally in Markdown.

## Assets and sample content

Use local paths beginning `/images/`. Categories and folders can be added freely. `npm run check` validates metadata and reports missing image files before a build. Font and image provenance are recorded in `public/fonts/`, `public/IMAGE-CREDITS.md`, and `public/BRAND-CREDITS.md`.

The included dishes, dates, reference photographs, and notes are demonstration material, not an official class record or schedule. No reference images are represented as student work. Replace examples with course content and images you have permission to publish.
