import { getCollection, type CollectionEntry } from 'astro:content';
import { tabs } from '../site.config';

export type Gallery = CollectionEntry<'galleries'>;

const warned = new Set<string>();

function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[portfolio] ${message}`);
}

/**
 * One gallery per tab. If two files claim the same tab the lower
 * `order` wins and the other is reported, rather than silently
 * rendering nothing.
 */
export async function galleryForTab(tabId: string): Promise<Gallery | undefined> {
  const all = (await getCollection('galleries'))
    .filter((g) => g.data.tab === tabId)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));

  if (all.length > 1) {
    warnOnce(
      `gallery:${tabId}`,
      `${all.length} galleries claim tab "${tabId}" (${all.map((g) => g.id).join(', ')}). Using "${all[0].id}" — set a lower \`order\` on the one you want.`,
    );
  }

  return all[0];
}

/** Report galleries pointing at a tab that no longer exists. */
export async function reportOrphanGalleries() {
  const known = new Set(tabs.map((t) => t.id));
  for (const gallery of await getCollection('galleries')) {
    if (!known.has(gallery.data.tab)) {
      warnOnce(
        `gallery-orphan:${gallery.id}`,
        `Gallery "${gallery.id}" points at tab "${gallery.data.tab}", which is not in site.config.ts. It is not published.`,
      );
    }
  }
}
