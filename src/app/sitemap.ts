import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "@/lib/metadata";
import { getNavigationRoutes } from "@/lib/navigation";

const STATIC_PATHS = ["/demo"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const addEntry = (path: string, lastModified?: string) => {
    const url = buildCanonicalUrl(path);

    if (!url || seen.has(url)) {
      return;
    }
    const entry: MetadataRoute.Sitemap[number] = { url };
     

    if (lastModified) {
      const parsed = new Date(lastModified);

      if (!Number.isNaN(parsed.valueOf())) {
        entry.lastModified = parsed;
      }
    }

    seen.add(url);
    entries.push(entry);
  };

  addEntry("/");

  const navigationRoutes = await getNavigationRoutes();

  for (const route of navigationRoutes) {
    addEntry(route.path, route.lastModified);
  }

  for (const staticPath of STATIC_PATHS) {
    addEntry(staticPath);
  }

  return entries;
}
