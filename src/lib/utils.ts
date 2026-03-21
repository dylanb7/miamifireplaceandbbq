import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export const getOptimizedImage = (url: string | undefined, width = 800) => {
    if (!url) return '';
    // Skip formatting for SVGs or empty urls
    if (url.endsWith('.svg')) return url;
    return `/.netlify/images?url=${encodeURIComponent(url)}&w=${width}&q=80`;
};
