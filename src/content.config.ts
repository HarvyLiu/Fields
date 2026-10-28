import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * `tab`, `fields` and `impact` are deliberately plain strings rather than
 * enums derived from site.config.ts.
 *
 * An enum would need the dev server restarted every time you add a section,
 * and it would break the build when you delete one. Instead, unknown ids are
 * reported as build warnings by `lib/entries.ts` and the entry is hidden —
 * adding a section works immediately, deleting one never breaks anything.
 */

const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    /** Card + page title */
    title: z.string(),
    /** Which sidebar tab this belongs to. Must exist in site.config.ts */
    tab: z.string(),
    /** One sentence. The claim, not the description. */
    summary: z.string().max(200),
    /** Disciplines this sits in (filter chips) */
    fields: z.array(z.string()).default([]),
    /** Values this serves (second axis) */
    impact: z.array(z.string()).default([]),
    /** Optional UN SDG numbers, 1–17 */
    sdg: z.array(z.number().int().min(1).max(17)).default([]),
    /** ISO-ish: 2025, 2025-03, or 2025-03-14. Sorts as a string. */
    date: z
      .string()
      .regex(/^\d{4}(-\d{2})?(-\d{2})?$/, 'Use YYYY, YYYY-MM, or YYYY-MM-DD')
      .optional(),
    /** For ranges: events, courses, ongoing roles */
    end: z
      .string()
      .regex(/^\d{4}(-\d{2})?(-\d{2})?$/, 'Use YYYY, YYYY-MM, or YYYY-MM-DD')
      .optional(),
    /** Issuer, school, venue, or employer */
    org: z.string().optional(),
    /** Your part in it: "Solo build", "Editor", "Volunteer" */
    role: z.string().optional(),
    /** External artifact: repo, demo, published piece */
    link: z.string().url().optional(),
    linkLabel: z.string().optional(),
    /** Image in /public, e.g. /artifacts/reader.png */
    image: z.string().optional(),
    /** Certificate serial, award citation, etc. */
    credential: z.string().optional(),
    /** Show on the overview page */
    featured: z.boolean().default(false),
    /** Archiving keeps the work but drops it out of the main flow */
    status: z.enum(['active', 'archived']).default('active'),
    /** Manual sort weight within a tab (lower first) */
    order: z.number().default(100),
  }),
});

/**
 * A gallery is ONE markdown file holding a list of images. Point `tab` at a
 * tab whose `layout` is 'gallery' and that tab renders this file instead of
 * entry cards.
 *
 * `src` is relative to the markdown file, so images live in src/assets/ and
 * Astro can read their real dimensions (no layout shift) and serve resized
 * WebP. `image()` comes from the schema context, not from the import.
 */
const galleries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galleries' }),
  schema: ({ image }) =>
    z.object({
      /** Page title */
      title: z.string(),
      /** Must match a tab id in site.config.ts */
      tab: z.string(),
      /** Optional line under the title */
      summary: z.string().max(240).optional(),
      /** Lower first, when more than one gallery claims the same tab */
      order: z.number().default(100),
      images: z
        .array(
          z.object({
            src: image(),
            /** Required: shown on hover, and read by screen readers */
            alt: z.string().min(3),
            /** Optional second line, e.g. a place or date */
            caption: z.string().optional(),
          }),
        )
        .default([]),
    }),
});

export const collections = { entries, galleries };
