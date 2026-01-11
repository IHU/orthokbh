import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils/buildBreadcrumbs.ts
export function buildBreadcrumbs(path: string): { name: string; href: string }[] {
    const parts = path.split("/").filter(Boolean); // remove empty items

    const breadcrumbs: { name: string; href: string }[] = [
        { name: "Home", href: "/" },
    ];

    let currentPath = "";
    for (const part of parts) {
        currentPath += `/${part}`;
        breadcrumbs.push({
            name: toTitleCase(decodeURIComponent(part.replace(/-/g, " "))), // e.g. "vores-behandlinger"
            href: currentPath,
        });
    }

    return breadcrumbs;
}

export function toTitleCase(str: string): string {
  return str
    .replace(/[_\-]+/g, ' ') // Replace underscores/hyphens with space
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}