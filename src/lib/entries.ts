import { getCollection, type CollectionEntry } from 'astro:content';
import { tabs, impact, activeTabs, fields, tabById, fieldById } from '../site.config';
import { galleryForTab } from './galleries';

export type Entry = CollectionEntry<'entries'>;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2025' → '2025' · '2025-03' → 'Mar 2025' · '2025-03-14' → 'Mar 14, 2025' */
export function formatDate(value?: string): string {
  if (!value) return '';
  const [y, m, d] = value.split('-').map(Number);
  if (!m) return String(y);
  if (!d) return `${MONTHS[m - 1]} ${y}`;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function formatRange(start?: string, end?: string): string {
  if (!start) return formatDate(end);
  if (!end) return formatDate(start);
  const s = formatDate(start);
  const e = formatDate(end);
  // '2025' → '2026' reads better as '2025—26'
  if (start.length === 4 && end.length === 4) {
    return `${start}—${end.slice(2)}`;
  }
  return `${s} — ${e}`;
}

/** Manual order first, then most recent. Archived work is kept but hidden. */
function rank(a: Entry, b: Entry): number {
  if (a.data.order !== b.data.order) return a.data.order - b.data.order;
  return (b.data.date ?? '').localeCompare(a.data.date ?? '');
}

const warned = new Set<string>();

/** Report a problem once per build, not once per page. */
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[portfolio] ${message}`);
}

/**
 * Point out ids in content that no longer exist in site.config.ts.
 * These are warnings, not errors: deleting a section should remove it
 * from the site, not break the build.
 */
function reportUnknownIds(all: Entry[]) {
  const knownTabs = new Set(tabs.map((t) => t.id));
  const knownFields = new Set(fields.map((f) => f.id));
  const knownImpact = new Set(impact.tags.map((t) => t.id));

  const unknownTabs = new Map<string, string[]>();
  const unknownFields = new Set<string>();
  const unknownImpact = new Set<string>();

  for (const entry of all) {
    if (entry.data.status === 'archived') continue;
    if (!knownTabs.has(entry.data.tab)) {
      unknownTabs.set(entry.data.tab, [
        ...(unknownTabs.get(entry.data.tab) ?? []),
        entry.id,
      ]);
    }
    entry.data.fields.forEach((id) => knownFields.has(id) || unknownFields.add(id));
    entry.data.impact.forEach((id) => knownImpact.has(id) || unknownImpact.add(id));
  }

  for (const [tab, ids] of unknownTabs) {
    warnOnce(
      `tab:${tab}`,
      `${ids.length} entr${ids.length === 1 ? 'y is' : 'ies are'} hidden — tab "${tab}" is not in site.config.ts (${ids.join(', ')}).`,
    );
  }
  if (unknownFields.size) {
    warnOnce(
      'fields',
      `Unknown field id(s) ignored: ${[...unknownFields].join(', ')}. Add them to \`fields\` in site.config.ts.`,
    );
  }
  if (unknownImpact.size) {
    warnOnce(
      'impact',
      `Unknown impact id(s) ignored: ${[...unknownImpact].join(', ')}. Add them to \`impact.tags\` in site.config.ts.`,
    );
  }
}

/**
 * Only entries belonging to an enabled tab are ever returned, so
 * disabling or deleting a tab in site.config.ts never leaves a
 * dangling route or a phantom card behind.
 */
export async function visibleEntries(): Promise<Entry[]> {
  const enabled = new Set(activeTabs().map((t) => t.id));
  const all = await getCollection('entries');
  reportUnknownIds(all);
  return all
    .filter((e) => enabled.has(e.data.tab) && e.data.status === 'active')
    .sort(rank);
}

export async function entriesForTab(tabId: string): Promise<Entry[]> {
  return (await visibleEntries()).filter((e) => e.data.tab === tabId);
}

export async function entriesForField(fieldId: string): Promise<Entry[]> {
  return (await visibleEntries()).filter((e) => e.data.fields.includes(fieldId));
}

export async function featuredEntries(): Promise<Entry[]> {
  return (await visibleEntries()).filter((e) => e.data.featured);
}

/**
 * [ { id, label, count, unit } ] in config order — drives the nav and
 * the overview's section list. Gallery tabs count images, not entries.
 */
export async function tabCounts() {
  const all = await visibleEntries();
  const counts = await Promise.all(
    activeTabs().map(async (tab) => {
      if (tab.layout === 'gallery') {
        const gallery = await galleryForTab(tab.id);
        return { ...tab, count: gallery?.data.images.length ?? 0, unit: 'image' as const };
      }
      // A page-style tab ('about') has no entries to count. Reporting 0
      // is what lets the nav and the overview drop the number entirely.
      if (tab.layout === 'about') {
        return { ...tab, count: 0, unit: 'entry' as const };
      }
      return {
        ...tab,
        count: all.filter((e) => e.data.tab === tab.id).length,
        unit: 'entry' as const,
      };
    }),
  );
  return counts;
}

export async function fieldCounts() {
  const all = await visibleEntries();
  return fields.map((field) => ({
    ...field,
    count: all.filter((e) => e.data.fields.includes(field.id)).length,
  }));
}

/** Chronological for the timeline layouts; most recent last. */
export function chronologically(list: Entry[]): Entry[] {
  return [...list].sort((a, b) =>
    (a.data.date ?? '').localeCompare(b.data.date ?? '') || rank(a, b),
  );
}

export function fieldsOf(entry: Entry) {
  return entry.data.fields.map((id) => fieldById(id)).filter(Boolean);
}

export function tabOf(entry: Entry) {
  return tabById(entry.data.tab);
}

export const entryHref = (entry: Entry) =>
  `/${entry.data.tab}/${entry.id}`;
