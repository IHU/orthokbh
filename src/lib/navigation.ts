import "@/lib/umbracoConfig";

import {
  ContentContentModel,
  ContentService,
  HomeContentResponseModel,
  IApiContentModelBase,
} from "@ihu/umbraco-components/dist/api/umbraco";
import { normalizeCanonicalPath } from "@/lib/metadata";

// Helper function to fetch children for a navigation item
export async function fetchContentChildren(
  parentId: string
): Promise<ContentContentModel[]> {
  const apiKey = process.env.NEXT_APP_UMBRACO_SITE_API_KEY!;

  try {
    const response = await ContentService.getContent20({
      apiKey: apiKey,
      fetch: "descendants:" + parentId,
    });

    if (!response?.items) {
      return [];
    }

    // Filter children that are visible in navigation.
    const visibleChildren = response.items.filter(
      (child) => (child as ContentContentModel).properties?.visibleToNavigation
    );
    return visibleChildren.map(child => child as ContentContentModel);
  } catch (error) {
    console.error(`Error fetching children for ${parentId}:`, error);
    return [];
  }
}

export interface SiteRoute {
  path: string;
  lastModified?: string;
}

function normalizeRoutePath(path?: string | null): string | null {
  if (!path) {
    return null;
  }

  const normalized = normalizeCanonicalPath(path);

  // Avoid treating empty/invalid routes as root entries unintentionally.
  if (normalized === "/" && path.trim() !== "/") {
    return null;
  }

  return normalized;
}

async function fetchVisibleDescendants(
  parentId: string,
  apiKey: string
): Promise<ContentContentModel[]> {
  try {
    const response = await ContentService.getContent20({
      apiKey,
      fetch: `descendants:${parentId}`,
    });

    if (!response?.items) {
      return [];
    }

    return response.items
      .map((item) => item as ContentContentModel)
      .filter(
        (child) => child.properties?.visibleToNavigation === true
      );
  } catch (error) {
    console.error(`Error fetching descendants for ${parentId}:`, error);
    return [];
  }
}

export async function getNavigationRoutes(): Promise<SiteRoute[]> {
  const apiKey = process.env.NEXT_APP_UMBRACO_SITE_API_KEY;
  const startItem = process.env.NEXT_APP_UMBRACO_START_ITEM;

  if (!apiKey || !startItem) {
    return [];
  }

  try {
    const response = await ContentService.getContentItemById20({
      id: startItem,
      apiKey,
      expand: "properties[navigations[properties[visibleToNavigation]]]",
    });

    if (!response) {
      return [];
    }

    const homeContent = response as HomeContentResponseModel;
    const result = new Map<string, SiteRoute>();

    const addRoute = (path?: string | null, lastModified?: string | null) => {
      const normalized = normalizeRoutePath(path);

      if (!normalized) {
        return;
      }

      const existing = result.get(normalized);

      if (existing) {
        if (!existing.lastModified && lastModified) {
          existing.lastModified = lastModified;
        }

        return;
      }

      result.set(normalized, {
        path: normalized,
        lastModified: lastModified ?? undefined,
      });
    };

    addRoute(homeContent.route?.path ?? "/", homeContent.updateDate ?? undefined);

    const navigationItems = Array.isArray(homeContent.properties?.navigations)
      ? (homeContent.properties?.navigations as IApiContentModelBase[])
      : [];

    const visibleParents = navigationItems.filter((item) => {
      const content = item as ContentContentModel;
      return content.properties?.visibleToNavigation === true;
    });

    for (const parent of visibleParents) {
      addRoute(parent.route?.path, parent.updateDate ?? undefined);

      const descendants = await fetchVisibleDescendants(parent.id, apiKey);

      for (const descendant of descendants) {
        addRoute(descendant.route?.path, descendant.updateDate ?? undefined);
      }
    }

    return Array.from(result.values());
  } catch (error) {
    console.error("Error building navigation routes:", error);
    return [];
  }
}
