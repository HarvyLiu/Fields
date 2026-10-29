# Fields — a portfolio template for students with too many interests

A static, config-driven portfolio. The whole site is generated from **one config
file** and **one folder of markdown**: adding a section is one object, adding a
project is one file, and no component anywhere knows the name of any section.

Two themes ship with it — a dark poster ground and a lilac paper one — switched
by a button in the top-right corner. Dark is the default.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/ (pure HTML, deploy anywhere)
npm run preview  # serve the built dist/ locally
```

Requires **Node 22.23.4 or newer** (the version Astro 7 declares).

---

## Contents

1. [The mental model](#1-the-mental-model)
2. [File map](#2-file-map)
3. [`profile` — who you are](#3-profile--who-you-are)
4. [`tabs` — the sections](#4-tabs--the-sections)
5. [Entries — your work](#5-entries--your-work)
6. [`fields` — what you work in](#6-fields--what-you-work-in)
7. [`impact` — what the work is for](#7-impact--what-the-work-is-for)
8. [`about` — the About page](#8-about--the-about-page)
9. [`theme` — colour, light/dark, type, spacing](#9-theme--colour-lightdark-type-spacing)
10. [Entry layouts, one by one](#10-entry-layouts-one-by-one)
11. [The gallery](#11-the-gallery)
12. [Routes](#12-routes)
13. [The only JavaScript on the site](#13-the-only-javascript-on-the-site)
14. [Recipe book (copy-paste)](#14-recipe-book-copy-paste)
15. [Build warnings and what they mean](#15-build-warnings-and-what-they-mean)
16. [Styles that are not in the config](#16-styles-that-are-not-in-the-config)
17. [Deployment](#17-deployment)
18. [Accessibility, print and performance](#18-accessibility-print-and-performance)
19. [Writing that works](#19-writing-that-works)
20. [The intro scene](#20-the-intro-scene)
21. [Credits](#21-credits)

---

## 1. The mental model

There are two axes and one list of sections.

- **`fields`** — *what* you work in: Computer Science, English, Music. A discipline.
- **`impact`** — *what the work is for*: Access, Equity, Care, Climate. A value.
- **`tabs`** — *where things live*: Projects, Writing, Awards, Certificates,
  Events, Gallery, About.

An entry belongs to exactly one `tab`, and can carry any number of `fields` and
`impact` tags at once. That is what lets one project be "a CS project that exists
to widen access" instead of forcing it into a single bucket.

Everything else is derived. A tab object produces its nav link, its route, its
page header, its numeral and its layout. A field produces its filter chip and its
`/field/…` page. Delete either one and the derived things go with it — no dead
links, no orphaned pages, no placeholder cards.

---

## 2. File map

```
src/
  site.config.ts          ← the whole site's shape. Edit this first.
  content.config.ts       ← the frontmatter schema. Edit only to add fields.
  content/
    entries/*.md          ← your work, one markdown file each
    galleries/*.md        ← one file listing every photo in a gallery
  assets/gallery/*.png    ← photos, processed and resized by Astro
  layouts/Shell.astro     ← top bar, theme toggle, page frame, all behaviour
  components/
    EntryCard.astro       ← one entry, as a card (grid layout)
    EntryRow.astro        ← one entry, as a row (list layout)
    TimelineItem.astro    ← one entry, on the rail (timeline layout)
    EntryList.astro       ← picks one of the three above per tab
    Gallery.astro         ← the photo wall
    Chips.astro           ← filter chips
    Marquee.astro         ← the scrolling outline band on the overview
    AboutBody.astro       ← renders the About sections
  pages/
    index.astro           ← overview
    [tab].astro           ← EVERY section, generated from config
    [tab]/[slug].astro    ← every entry's detail page
    field/[field].astro   ← every discipline, generated from config
    404.astro
  styles/global.css       ← design tokens and every component style
public/
  favicon.svg             ← replace with your own
  …                       ← put card images here
```

You can read the whole site by looking at `site.config.ts`, `global.css` and the
files in `src/pages`. Everything else is a component that takes props.

---

## 3. `profile` — who you are

`src/site.config.ts` → `profile`. These values appear in more places than you
would expect, so this table lists every one and what it actually changes.

| Key | Type | Where it appears | Notes |
| --- | --- | --- | --- |
| `name` | string | Top bar brand, page `<title>`, footer | Also used in every `<title>` as "Page — Name" |
| `location` | string | Eyebrow above the overview headline (`Portland, Oregon · Portfolio 2026`) | Free text; can be `''` |
| `thesis` | string | The giant headline on the overview | Your one-sentence argument. Keep it under ~10 words or the headline gets cramped |
| `thesisAccent` | string | The words *inside* `thesis` painted in the accent colour | Must be a literal substring of `thesis`, or nothing is painted. Set to `''` to paint nothing |
| `status` | string | The small pill above the headline (`Open to 2027 intake`) | Set to `''` to remove the pill entirely |
| `intro` | string | Paragraph under the headline; also the default `<meta name="description">` | Two sentences is the sweet spot |
| `email` | string | Nothing in the bar prints it | The About contact block builds its `mailto:` link from it |
| `links` | `{ label, href, icon? }[]` | The About page's contact pills | Add as many as you want. External links get `target="_blank"` automatically. Each pill shows an icon, detected from the href unless you set `icon` |
| `updated` | string | Footer (`Updated 2026-10`); the year in the overview eyebrow | `YYYY-MM` by convention. Nothing parses it, so any string works |

`thesisAccent` is worth understanding: the headline is not split into two config
values. You write the sentence once, then name the part to colour.

```ts
thesis: 'I build quiet tools that make overlooked things legible.',
thesisAccent: 'quiet tools',   // → "quiet tools" renders in the accent colour
```

---

## 4. `tabs` — the sections

`src/site.config.ts` → `tabs` is an ordered array. **Order in the array is order
in the nav.**

| Key | Type | Required | What it does |
| --- | --- | --- | --- |
| `id` | string | yes | The URL slug: `projects` → `/projects`. Also what entry frontmatter points at (`tab: projects`) |
| `label` | string | yes | The text in the nav and the `<h1>` of the page |
| `blurb` | string | yes | One line under the page title; also the page's meta description and the subtitle in the overview's section list |
| `layout` | `'grid' \| 'list' \| 'timeline' \| 'gallery' \| 'about'` | yes | How the page draws (see [§10](#10-entry-layouts-one-by-one)) |
| `enabled` | boolean | yes | `false` hides the tab and its route without deleting anything |

That one object produces:

- the nav item,
- the route `/<id>`,
- the numbered page header (`01`, `02`, … in array order),
- the chosen layout,
- an entry in the overview's "Everything, by section" list.

`id` must be lowercase, hyphenated and unique. Renaming `id` changes the URL, so
update any entry whose `tab:` pointed at the old one — the build will warn you.

---

## 5. Entries — your work

One markdown file per entry, in `src/content/entries/`. **The filename is the
URL**: `braille-reader.md` → `/projects/braille-reader`.

Only three keys are required. Everything else is optional and simply does not
render when absent, so a certificate needs no `end` and a project needs no
`credential`.

| Key | Type | Required | What it does |
| --- | --- | --- | --- |
| `title` | string | **yes** | Card title, detail headline, row title |
| `tab` | string | **yes** | Must match a `tabs[].id`. Unknown = entry hidden + warning |
| `summary` | string, max **200** chars | **yes** | The claim, not the description. On a card, on a timeline item, and as the detail page's standfirst |
| `fields` | string[] | no (default `[]`) | Field ids. Drives filter chips, `/field/…` pages, card labels |
| `impact` | string[] | no (default `[]`) | Impact tag ids. Shown as pills on the detail page |
| `sdg` | number[] | no (default `[]`) | UN goals, integers 1–17. Rendered as `SDG 4` pills |
| `date` | string | no | `YYYY`, `YYYY-MM` or `YYYY-MM-DD` only |
| `end` | string | no | Same format. Turns `date` into a range (`2025—26`, `Mar 2025 — Apr 2026`) |
| `org` | string | no | School, employer, venue, issuer. Shows in the card footer, the row subtitle, the timeline meta and the detail page's facts |
| `role` | string | no | Your part in it (`Solo build`, `Editor`). Same places as `org` |
| `link` | URL | no | External artifact. Renders a button at the foot of the detail page |
| `linkLabel` | string | no | Button text. Defaults to `View it` |
| `image` | string path | no | Card image, 16:9 crop. Put the file in `public/` and write the path from the root: `/artifacts/reader.jpg` |
| `credential` | string | no | Serial, citation number, certificate id. Appears as `Reference` in the detail facts |
| `featured` | boolean | no (default `false`) | Also show it in the overview's "Selected work" |
| `status` | `'active' \| 'archived'` | no (default `'active'`) | `archived` keeps the file and its URL but drops it from every list, count and filter |
| `order` | number | no (default `100`) | Manual sort weight inside its tab: lower first |

**Full example**

```md
---
title: A braille reader that works without wifi
tab: projects
summary: A one-dollar device that reads printed text aloud, built for a school library with no network.
fields: [cs]
impact: [access, equity]
sdg: [4, 10]
date: 2025-05
end: 2026-01
org: Portland School for the Blind
role: Solo build
link: https://github.com
linkLabel: Read the code
credential: 9ZB4XQ2LMR
featured: true
status: active
order: 10
---

Everything below the frontmatter is the detail page, in Markdown.
```

**Sorting**

1. `order` ascending (default `100`), then
2. `date` descending — newest first.

`timeline` tabs override that and read oldest → newest, because a timeline is a
story. `gallery` tabs ignore entries entirely.

---

## 6. `fields` — what you work in

`src/site.config.ts` → `fields`. Each object produces a card on the overview, a
filter chip on every tab that uses it, the label above a card's title, and a
whole page at `/field/<id>`.

| Key | Type | Required | What it does |
| --- | --- | --- | --- |
| `id` | string | yes | Referenced from entry frontmatter: `fields: [cs]` |
| `label` | string | yes | Full name, used on `/field/<id>` and in the detail page's `Field` fact |
| `short` | string | yes | The abbreviation on cards and in the marquee (`CS`, `English`) |
| `blurb` | string | yes | One line on the field card and the field page |
| `accent` | CSS colour | yes | That field's ink on the **dark** ground: card labels, field-page headings, the gradient orb |
| `accentLight` | CSS colour | no | The same hue as an ink for the **light** ground. Falls back to `accent` |

**What colour should `accent` be?** Write it **bright** — a mid-to-light value
with real saturation, because it is being drawn on near-black. A deep, muted
ink (a printed green like `#1f5d4f`) turns to mud there. Then give
`accentLight` the deep version of the same hue for paper.

The two are not mixed or derived: each theme simply uses the value intended for
it, so the colour keeps its saturation on both grounds instead of being washed
toward white. The shipped pair is a bright mint (`#5ee0b0`) over a deep teal
(`#06705a`) — 11.1:1 on the dark ground, 5.4:1 on paper.

Two or three fields is the sweet spot for admissions. Five reads as unfocused —
which is what the archived entries and the single index are for.

---

## 7. `impact` — what the work is for

`src/site.config.ts` → `impact`. This is the second axis: values, not subjects.

| Key | Type | What it does |
| --- | --- | --- |
| `label` | string | The heading of the impact section on the overview (`Social Impact`) |
| `blurb` | string | The paragraph under that heading |
| `tags` | `{ id, label, note }[]` | One card each on the overview, and the pills on an entry's detail page |

- `id` is what entries reference: `impact: [access, equity]`.
- `note` is the sentence shown under the tag's name on the overview. It is not
  shown on entry pages.
- There is no `/impact/…` route. Impact is a tag axis plus one overview section,
  deliberately: it is the thread, not a fifth bucket.

On the detail page, impact pills render filled in the accent colour and SDG
numbers render as outline pills. Both only appear if the entry has them.

---

## 8. `about` — the About page

The About page is a **tab like any other** — it gets its nav link, numeral and
route from `tabs` — but it is not a list of entries. Its content lives in
`src/site.config.ts` → `about.sections`.

`about.sections` is an ordered array of blocks. Reorder the array and the page
follows; delete a block and it is gone. Blocks are numbered automatically in the
page, so you never edit a number.

| Key | Type | Required | Renders as |
| --- | --- | --- | --- |
| `id` | string | yes | The anchor (`/about#story`) and the `aria-labelledby` target |
| `title` | string | yes | The block's `<h2>` |
| `kicker` | string | yes | The small uppercase word at the right of the heading (`Identity`, `Origin`). Hidden on phones |
| `intro` | string | no | One paragraph directly under the heading |
| `paragraphs` | string[] | no | Further prose paragraphs |
| `items` | `{ label, value }[]` | no | Hairline rows: label left, sentence right. Great for facts, not for prose |
| `points` | string[] | no | Bulleted lines with an accent dash |
| `quote` | string | no | Pull quote in the display face |
| `quoteBy` | string | no | Attribution under the quote |
| `links` | `{ label, href, icon? }[]` | no | Pill links at the foot of the block, each with an icon |

A block can combine any of `intro`, `paragraphs`, `items`, `points`, `quote` and
`links` — they render in that order. The seven blocks that ship cover identity,
character, origin story, wider interests, what you want from college, personal
context, and contact.

The last block reuses your profile links rather than duplicating them:

```ts
links: [
  { label: 'Email', href: `mailto:${profile.email}` },
  ...profile.links,
],
```

The page title comes from the tab's `blurb`, and the thesis at the top is
`profile.thesis` with `profile.thesisAccent` painted — written once, shown in two
places.

**The About page is special-cased by `layout: 'about'`, not by its name.** If you
rename the tab `id` to `me`, the URL becomes `/me` and everything still works. If
you add a *second* `layout: 'about'` tab it will render the same seven blocks.

---

## 9. `theme` — colour, light/dark, type, spacing

`src/site.config.ts` → `theme` has three keys.

| Key | Type | What it drives |
| --- | --- | --- |
| `accent` | CSS colour | The accent on the **dark** ground: highlighted words, active nav pill, chips, buttons, timeline dates, section numerals |
| `accentLight` | CSS colour | The same accent on the **light** ground |
| `density` | number | Multiplies vertical rhythm. `1` default, `1.2` airier, `0.85` tighter |

### Why two accents

A colour that reads beautifully as pale lavender on near-black is invisible as
text on paper. The accent is used both as **text** and as a **fill behind text**,
so each ground needs its own value:

- `accent: '#d3b8ff'` — light violet, 10.5:1 on `#171415`.
- `accentLight: '#6a36dc'` — vivid violet, 5.9:1 as text on `#f3f0fb` and 6.6:1
  behind white text.

Change one and you have changed the whole site. If you **omit `accentLight`**,
one is derived by mixing `accent` 48% with ink, which lands safely dark on
paper — the shipped lavender derives to 4.9:1 on the light ground and 5.6:1
behind white text. Check it anyway if you use an unusual hue.

### How the toggle works

- **Dark is the default.** The OS `prefers-color-scheme` setting is deliberately
  ignored; only the button changes the theme.
- The button is the circular icon at the far right of the top bar: a sun on the
  dark ground, a moon on the light one.
- The choice is stored in `localStorage` under the key **`theme`** with the value
  `dark` or `light`.
- The attribute lives on the `<html>` element: `<html data-theme="dark">`.
- A tiny inline script in `<head>` (`Shell.astro`) sets the attribute **before
  first paint**, so there is no flash of the wrong ground. If storage is blocked
  (private mode, strict settings) the site simply stays dark.
- The choice survives client-side navigation (re-applied on `astro:after-swap`)
  and full reloads.
- `meta[name="theme-color"]` is updated too, so mobile browser chrome matches.
- Print always uses the light, ink-on-paper token set, whichever ground is on
  screen.

### The token table

All of these live at the top of `src/styles/global.css` under
`:root, [data-theme='dark']` and `[data-theme='light']`. Override a value there
and every component follows — nothing is styled twice.

| Token | Dark | Light | Used for |
| --- | --- | --- | --- |
| `--bg` | `#171415` | `#f3f0fb` | Page ground |
| `--bg-2` | `#1e1a1c` | `#fbf9ff` | Cards, facts, field cards, row hover |
| `--bg-3` | `#262024` | `#ece8fa` | Card hover |
| `--fg` | `#eae5de` | `#15101f` | Headings and body text |
| `--fg-2` | `rgba(255,255,255,.7)` | `rgba(21,16,31,.72)` | Secondary paragraphs (7.1:1 light) |
| `--fg-3` | `rgba(255,255,255,.52)` | `rgba(21,16,31,.62)` | Small uppercase labels, counts, meta (5.0:1 light) |
| `--line` | `rgba(255,255,255,.13)` | `rgba(21,16,31,.14)` | Section rules |
| `--line-2` | `rgba(255,255,255,.07)` | `rgba(21,16,31,.08)` | Hairlines inside cards |
| `--line-strong` | `rgba(255,255,255,.4)` | `rgba(21,16,31,.42)` | Chip hover borders |
| `--hover` | `rgba(255,255,255,.06)` | `rgba(21,16,31,.06)` | Nav hover fill |
| `--code-bg` | `rgba(255,255,255,.08)` | `rgba(21,16,31,.07)` | Inline `code` |
| `--stroke` | `rgba(255,255,255,.28)` | `rgba(21,16,31,.3)` | Marquee outline type |
| `--body` | `rgba(255,255,255,.86)` | `rgba(21,16,31,.86)` | Long-form prose |
| `--accent` | `theme.accent` | `theme.accentLight` | Accent type, pills, fills |
| `--accent-ink` | `#171415` | `#ffffff` | Text on top of an accent fill |

Theme-independent tokens, also at the top of `global.css`:

| Token | Default | What it does |
| --- | --- | --- |
| `--measure` | `1120px` | Max content width of the bar and page |
| `--gutter` | `clamp(20px, 4vw, 24px)` | Side padding |
| `--density` | from config | Vertical rhythm multiplier |
| `--pill` | `999px` | Every pill-shaped thing |
| `--corner` | `0 40px 0 0` | The asymmetric card corner |
| `--corner-sm` | `0 18px 0 0` | The smaller corner (facts, images, gallery) |
| `--font-display` | `'Bebas Neue'` | Headings, numerals, marquee, quotes |
| `--font-body` | `'Poppins'` | Everything else |
| `--font-mono` | system mono | Inline `code` |
| `--ease` | `cubic-bezier(.22,.61,.36,1)` | Every transition |
| `--accent-soft` | accent @ 16% | The glow behind the status dot |

### Changing the ground colours

- **Dark ground:** the block beginning `:root, [data-theme='dark']`.
- **Light ground:** the block beginning `[data-theme='light']`.

If you add a colour that is only used in one theme, add it to both blocks with a
different value in each, or it will inherit the other theme's value and look
wrong.

---

## 10. Entry layouts, one by one

| `layout` | Draws | Feels right for | Required frontmatter |
| --- | --- | --- | --- |
| `grid` | Cards with an optional 16:9 image, field labels, title, 3-line summary, org and date | Projects, writing | `title`, `summary`, plus `image` if you have one |
| `list` | Dense hairline rows: title left, date right, org · role beneath | Awards, certificates, anything scannable | `title`; `date` strongly recommended |
| `timeline` | A dated rail, oldest first, summary under each title | Events, roles, a chronology | `date` (or the item says `Undated`) |
| `gallery` | A masonry photo wall from one gallery file — **ignores entries** | Photographs, scans | none (see [§11](#11-the-gallery)) |
| `about` | Seven personal blocks from `about.sections` — **ignores entries** | The About page | none (see [§8](#8-about--the-about-page)) |

Two behaviours worth knowing:

- **Filter chips** appear above any `grid`/`list`/`timeline` tab only when at
  least **two different fields** are present in that tab. One field, or none, and
  the chips row is hidden rather than showing a lone, useless button.
- **Counts live in the overview**, in its "Everything, by section" list, not in
  the nav — the tabs stay clean and the bar stays narrow. A `gallery` tab counts
  *images*, a page-style (`about`) tab reads `Profile`, and a tab with no entries
  shows nothing rather than a `0`.

---

## 11. The gallery

A gallery is **one markdown file** in `src/content/galleries/` that lists every
image. Point it at a tab whose layout is `gallery`, and that tab renders the wall
instead of entry cards.

```md
---
title: Gallery
tab: gallery                    # must match a tab id whose layout is 'gallery'
summary: One optional line under the title.
order: 100                      # tie-break if two files claim the same tab
images:
  - src: ../../assets/gallery/darkroom.png
    alt: A red safelight over trays of developer.
    caption: Print room         # optional second line
---

Any prose here appears above the images, as an intro.
```

| Key | Required | Notes |
| --- | --- | --- |
| `title` | yes | Not currently printed — the tab's `label` is the page title |
| `tab` | yes | Must match a tab id |
| `summary` | no | One line under the page title (max 240 chars) |
| `order` | no | Lower wins if two galleries claim the same tab |
| `images[].src` | yes | **Relative to the markdown file** — that is why it starts `../../assets/` |
| `images[].alt` | yes, min 3 chars | Shown on hover and read by screen readers. There is no way to leave it out |
| `images[].caption` | no | Second line in the accent colour |

- Put the files in `src/assets/gallery/`, not `public/`. Astro reads their real
  dimensions (so the wall does not jump while loading) and serves resized WebP
  at several widths — a 4000px photo still arrives as a small thumbnail.
- **Layout is automatic:** three columns wide, two on a tablet, one on a phone.
  Order in the list is order on the wall.
- Hover reveals the description; on touch devices the descriptions are always
  visible, because a hover that cannot happen is not information.

---

## 12. Routes

| URL | Built from | Notes |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Overview: thesis, marquee, fields, selected work, impact, section list |
| `/<tab>` | `tabs[]` | One per enabled tab, in config order |
| `/<tab>/<filename>` | `entries/*.md` | The filename minus `.md` |
| `/field/<field>` | `fields[]` | One per field, even with zero entries |
| `/about` | the tab with `layout: 'about'` | Its URL is whatever that tab's `id` is |
| `/404` | `src/pages/404.astro` | Served by most hosts automatically |

Every page is prebuilt HTML. There is no server, no database and no API.

---

## 13. The only JavaScript on the site

Four small jobs, all in `Shell.astro`, all progressive — the site is fully
readable with JavaScript disabled:

1. **Theme** — the toggle, plus the inline `<head>` script that prevents a flash.
2. **Field filtering** — the chips. Clicks are delegated from `document`, so
   filtering keeps working after a client-side navigation.
3. **Scroll reveal** — a rAF-throttled sweep that un-hides blocks as they enter
   the viewport. It also catches blocks *above* the viewport, so jumping straight
   to a section cannot strand content invisible. There is a 2.5s watchdog that
   un-hides everything if the module fails to load at all, and with
   `prefers-reduced-motion` everything is simply visible.

4. **Intro scene** — the inline `<head>` script decides whether the front page
   should play it; a click or a key cuts it short, and the cleanup releases the
   scroll lock. The animation itself is pure CSS, so a failed module cannot hide
   the page.

The reveal animation is opt-in per element: add `data-reveal` to any block of
your own and it joins in.

---

## 14. Recipe book (copy-paste)

### Add a tab

Append one object to `tabs` in `src/site.config.ts`:

```ts
{
  id: 'volunteering',
  label: 'Volunteering',
  blurb: 'Weekly commitments, and what they taught me.',
  layout: 'timeline',
  enabled: true,
},
```

Nothing else. The nav item, the route `/volunteering`, the numeral, the page
header and the layout all appear. Then write entries with `tab: volunteering`.

### Remove a tab

Delete its object. The route stops being generated, the nav item disappears, and
any entries that pointed at it are hidden with a build warning rather than left
as broken links. Delete those markdown files too when you are ready.

### Hide a tab without deleting it

```ts
enabled: false,
```

Same as removing it from the visitor's point of view, but your entries and
content stay in the repository.

### Rename a tab

Change `label` (the visible text) freely. Changing `id` changes the URL, so also
update every entry whose frontmatter says `tab: <old-id>`.

### Reorder the nav

Move objects within the `tabs` array. The overview's numbered sections and the
per-page numerals follow the same order.

### Change a tab's layout

Set `layout` to `grid`, `list`, `timeline`, `gallery` or `about`. No other edit is
needed — the same entries are re-drawn.

### Add an entry

Create `src/content/entries/my-thing.md` with at least:

```md
---
title: My thing
tab: projects
summary: One sentence that makes a claim.
---

The detail page, in Markdown.
```

### Archive an entry

```yaml
status: archived
```

The file and its URL stay, but it disappears from lists, counts, filters and the
overview. This is how you keep older work without diluting the front page.

### Feature an entry on the overview

```yaml
featured: true
```

### Force a position inside a tab

```yaml
order: 10    # lower comes first; default is 100
```

### Add a field

Append to `fields`:

```ts
{
  id: 'bio',
  label: 'Biology',
  short: 'Bio',
  blurb: 'Field work, microscopy, and the ethics of sampling.',
  accent: '#6ee7a8',        // bright: drawn on near-black
  accentLight: '#2f6b3a',   // the same hue as an ink for paper
},
```

You get an overview card, filter chips that include it, and `/field/bio`. Tag
entries with `fields: [bio]` — or with several: `fields: [bio, cs]`.

### Delete a field

Delete the object. Its card, chip and page go. Entries that still list the id
build with a warning and the id is ignored — so a typo never breaks the build,
but it is worth reading the warning.

### Add an impact tag

```ts
{ id: 'mentorship', label: 'Mentorship', note: 'Teaching the next person the thing you struggled with.' },
```

Then tag entries with `impact: [mentorship]`.

### Map work to a UN goal

```yaml
sdg: [4, 10]
```

Integers 1–17. They render as `SDG 4` pills beside the impact tags. Use them
only where the connection is honest — a number attached to nothing substantive
reads as decoration.

### Change the accent colour

Two values, one idea:

```ts
theme: {
  accent: '#d3b8ff',        // on the dark ground
  accentLight: '#6a36dc',   // on the light ground
}
```

Pick a light value that carries **white text** (it is used as a fill behind the
active nav pill) and is dark enough to read as text on paper. Anything above
about 4.5:1 on both counts is safe.

### Change the ground colours themselves

`src/styles/global.css`, the `:root, [data-theme='dark']` block for the poster,
`[data-theme='light']` for the paper. Then re-check `--fg-3` on your new ground:
the small uppercase labels are the first thing to fail contrast.

### Make the site follow the OS preference instead of defaulting to dark

In `src/layouts/Shell.astro`, find the inline `<head>` script and replace the
`document.documentElement.setAttribute(...)` call with:

```js
var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.documentElement.setAttribute(
  'data-theme',
  stored || (prefersLight ? 'light' : 'dark'),
);
```

The toggle still wins once the visitor has clicked it.

### Change the spacing density

```ts
theme: { density: 1.2 }   // 1 default · 0.85 tighter · 1.2 airier
```

It multiplies section margins, card padding and list padding together, so the
whole page breathes as one thing.

### Swap the fonts

1. `npm install @fontsource/your-font`
2. Import the weights at the top of `src/layouts/Shell.astro`, next to the
   existing imports.
3. Change `--font-display` / `--font-body` in `global.css`.

Keep the display face if you can — headings are set in uppercase with a line
height of 0.9, which only looks right with a condensed face.

### Add an About block

Append to `about.sections`:

```ts
{
  id: 'reading',
  kicker: 'Currently',
  title: 'On my desk',
  intro: 'What I am reading while I write applications.',
  points: ['A biography of the Oxford English Dictionary.'],
},
```

It appears at the end with the next number. Move it up by moving it in the array.

### Remove an About block

Delete the object from `about.sections`. It is not referenced anywhere else.

### Add a contact link

```ts
profile: {
  links: [
    { label: 'GitHub', href: 'https://github.com/you' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/you' },
  ],
}
```

It appears in the About contact block automatically (that block spreads
`profile.links`). Links starting with `http` open in a new tab with
`rel="noopener noreferrer"`.

Each pill carries an icon, chosen from the href: `mailto:` gets a mail icon,
`github.com`, `linkedin.com`, `x.com`/`twitter.com` and `instagram.com` get the
brand mark, and a label of `Writing` or `Blog` gets a pen. Anything else falls
back to a chain link. Override it with `icon` — one of `mail`, `github`,
`linkedin`, `x`, `instagram`, `pen`, `link`:

```ts
profile: {
  links: [
    { label: 'Mastodon', href: 'https://mastodon.social/@you', icon: 'link' },
  ],
}
```

### Change the email

`profile.email`. The About contact block's email pill builds its `mailto:` link
from it.

### Put an image on a card

1. Drop the file in `public/`, e.g. `public/artifacts/reader.jpg`.
2. Add `image: /artifacts/reader.jpg` to the entry.

The card crops it to 16:9. Gallery photos are different: they live in
`src/assets/` and are optimised (see [§11](#11-the-gallery)).

### Add a page that is not a list of entries

Create `src/pages/cv.astro`:

```astro
---
import Shell from '../layouts/Shell.astro';
---

<Shell title="CV">
  <header class="page-head"><h1>CV</h1></header>
  <div class="prose">
    <p>Anything you like, in Markdown-like HTML.</p>
  </div>
</Shell>
```

Link it from `profile.links` or from an About block. Do **not** also add a tab
with the same id — two routes would claim the same URL.

### Change the domain

`astro.config.mjs` → `site`. Set it before you deploy so links you share later
are canonical. (Nothing in the template reads it yet; it is there for a sitemap
or canonical tags when you add them.)

### Delete the sample content

- Entries: delete the markdown files in `src/content/entries/`.
- Photos: delete `src/assets/gallery/*.png`.
- Start from your own facts: rewrite `profile`, `about.sections` and the tabs you
  do not need.

---

## 15. Build warnings and what they mean

These are **warnings, never errors**. Deleting a section must never leave you
with an unbuildable site, so unknown ids are reported and skipped. Every one is
prefixed `[portfolio]`.

| Warning | Cause | Fix |
| --- | --- | --- |
| `N entries are hidden — tab "x" is not in site.config.ts (a, b).` | An entry's `tab` does not match any tab id | Fix the id in the entry, or add that tab |
| `Unknown field id(s) ignored: x. Add them to \`fields\` in site.config.ts.` | An entry references a field that no longer exists | Fix the id or add the field |
| `Unknown impact id(s) ignored: x. Add them to \`impact.tags\` in site.config.ts.` | Same, for impact | Fix the id or add the tag |
| `N galleries claim tab "x" (a, b). Using "a" — set a lower \`order\` on the one you want.` | Two gallery files point at one tab | Delete one or give it a lower `order` |
| `Gallery "x" points at tab "y", which is not in site.config.ts. It is not published.` | A gallery survived a tab deletion | Repoint `tab` or delete the file |

Two other things that look like bugs but are not:

- **A tab exists in the nav but the page is empty** — no entry has that `tab`, or
  its entries all have `status: archived`.
- **An entry is missing from its tab** — check `status: archived`, and check the
  `tab` id against `tabs` (see the warning above).

---

## 16. Styles that are not in the config

Some styling is intentionally in `global.css` rather than in the config, because
it is a design decision rather than data:

| I want to change | Look for |
| --- | --- |
| The headline size on the overview | `.hero h1 { font-size: clamp(52px, 13.2vw, 196px) }` |
| Page-title size on section pages | `.page-head h1` |
| The marquee speed | `.marquee__track { animation: marquee 38s linear infinite }` |
| The marquee content | It is generated from your field `short` names and impact `label`s, in `src/pages/index.astro` |
| The asymmetric corner | `--corner` / `--corner-sm` |
| Card hover lift | `.card:hover { transform: translateY(-3px) }` |
| Reveal animation feel | `html.js [data-reveal]` and its `.is-in` state |
| The status pill's dot | `.status::before` |
| Column counts in the gallery | `.gallery { columns: 3 }` plus the two media queries below it |

---

## 17. Deployment

`npm run build` writes a completely static `dist/`. Upload it anywhere.

| Host | Setup |
| --- | --- |
| **Vercel** | Import the repo. Astro is detected; build `npm run build`, output `dist` |
| **Netlify** | Build `npm run build`, publish directory `dist` |
| **Cloudflare Pages** | Framework preset Astro; build `npm run build`, output `dist` |
| **GitHub Pages** | Build and publish `dist` via an action. See the subpath caveat below |
| **Any static host / S3** | Copy `dist/` |

Notes:

- `build.format: 'directory'` means each page is written as `page/index.html`,
  so URLs work without `.html` on any static host.
- **Subpath caveat.** Internal links are written as root-absolute paths
  (`/projects`). Deploying to a project subpath such as
  `https://user.github.io/repo/` requires either a custom domain (recommended) or
  prefixing every internal `href` with `import.meta.env.BASE_URL`. Deploying at a
  domain root avoids the whole problem.
- Nothing here needs a server, a database or environment variables. The only
  configuration is `astro.config.mjs` → `site`.

---

## 18. Accessibility, print and performance

- **Contrast** is checked against the actual rendered colours on both grounds:
  body text 16.6:1 on paper, `--fg-3` labels 5.0:1, the light accent 5.9:1 as
  text and 6.6:1 behind white. On the dark ground the smallest labels are above
  the 4.5:1 AA threshold too. If you change a ground colour, the 11px uppercase
  labels are the first thing to re-check.
- **Focus** is visible everywhere: a 2px accent outline with a 3px offset.
- **Motion**: everything that moves respects `prefers-reduced-motion`. The
  marquee stops, reveals are instant, the gallery does not scale on hover, and
  the intro scene never plays at all.
- **No JavaScript, no problem.** All content is server-rendered HTML. The chips,
  the toggle and the filter chips are enhancements; without them the site reads
  exactly the same, and it stays on the dark ground.
- **Print** flips to black on white, drops the top bar, marquee, chips and
  buttons, and avoids breaking cards across pages. It always prints the light
  token set, whichever theme is on screen.
- **Weight**: no client framework. The JS is a single small module; the fonts are
  self-hosted and subset by `@fontsource`; gallery images are resized WebP. Run
  `npm run build` and look at the "page(s) built" line — the whole site is static
  HTML.

---

## 19. Writing that works

The schema rewards evidence over adjectives.

- **`summary` is a claim, not a description.** "A one-dollar reader for a library
  with no wifi" beats "A project about accessibility."
- **Put the outcome in the body.** Numbers, a failure log, one honest paragraph
  about what did not work. That is what distinguishes a portfolio from a list.
- **Name your part.** `role: Solo build` versus `role: Two-person team, wrote the
  parser` changes how a reader weighs the rest.
- **Two or three fields, not five.** Focus reads as confidence; breadth reads as
  a hobby list.
- **Archive rather than delete.** Old work you are not proud of still proves you
  were working. `status: archived` keeps it out of the way.

---

## 20. The intro scene

The front page can open with a short scene: the name, then two fragments of the
thesis rolling up through a masked window like a reel, then two curtains split
apart to reveal the site. It lives in its own `splash` export in
`src/site.config.ts`, right after `theme`:

```ts
export const splash = {
  enabled: true,
  words: [profile.name, 'quiet tools', 'made legible'],
  step: 620,
  hold: 480,
  exit: 780,
};
```

| Key | Type | Default | What it does |
| --- | --- | --- | --- |
| `enabled` | boolean | `true` | `false` removes the scene entirely. Nothing else needs changing. |
| `words` | string[] | name + thesis fragments | One line at a time, in order. The last line is painted in the accent **when there is more than one word**; a lone word stays in `--fg`. An empty array is also a skip. |
| `step` | number | `620` | Milliseconds the reel spends on each line. |
| `hold` | number | `480` | Extra time the last line holds before the curtains split. |
| `exit` | number | `780` | Milliseconds for the two curtains to leave. |

**Timing is computed, never configured separately.** The total is
`words.length * step + hold + exit` — with the defaults, `3 × 620 + 480 + 780 =`
**3120ms**. Add a fourth line and the total grows on its own; the reel delays,
the bar and the split all stay in sync.

What a reader sees, in order: the first line rolls up from below the window and
lands with a slight overshoot; while it leaves, the next is already climbing in
behind it, so the reel never sits empty; the last line lands in the accent and
holds. Then the stage fades, a 2px accent hairline appears in the seam, and two
half-height curtains slide apart — top up, bottom down — onto the finished page,
with the 3px accent bar riding the bottom curtain out. A `Click to skip` hint
fades in at 400ms.

### When it plays

| Rule | How it is enforced |
| --- | --- |
| **Once per tab session** | `sessionStorage` key `intro`, written the moment the scene arms — so a blocked module can never make it replay |
| **Front page only** | The markup is rendered only when the route is `/`; `Shell.astro` already knows the path |
| **Fresh document only** | The arming script runs on a real page load, so a client-side navigation to `/` does not replay it |
| **Never with reduced motion** | `matchMedia('(prefers-reduced-motion: reduce)')` bails before arming, and the flag is left unset, so it can still play once if the preference changes later |
| **Never with JS off** | `.splash` is `display: none` until `<html data-splash="on">` is set by script; without script the site is exactly as it was |
| **Never in print** | Listed in the `@media print` hide block |

### Editing it

- **Change the words** — edit the `words` array. Nothing else needs touching;
  the last line's accent and the longer hold follow automatically.
- **Make it faster or slower** — `step` is the whole knob. `520` is brisk,
  `760` is deliberate. Keep the total under about six seconds.
- **Replay it after editing** — in the browser console:
  `sessionStorage.removeItem('intro')`, then reload. A new tab also works.
- **Turn it off** — `enabled: false`. The `words`, `@keyframes` and listeners all
  become inert; the markup is not even rendered.

### Why it cannot trap the page

The CSS owns the sequence, so the panel finishes and hides itself even if the
whole module fails to load. The only thing CSS cannot release is the scroll lock
(`html[data-splash='on'] { overflow: hidden }`), so the inline `<head>` script
sets an 8-second watchdog that clears the attribute no matter what. A
client-side navigation mid-scene also clears it in `astro:after-swap`, and print
and reduced-motion rules hide the panel outright.

---

## 21. Credits

- Built with [Astro](https://astro.build) — static output, no client framework.
- **Bebas Neue** and **Poppins**, both OFL, self-hosted via `@fontsource`, so
  there is nothing to license and nothing fetched from a third party at runtime.
- The sample student, projects, awards and photographs are fictional
  placeholders. Delete them.
