import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'isomorphic-dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeHtml(content: string): string {
  return DOMPurify.sanitize(content, {
    ADD_TAGS: ['iframe'], // In case you need to allow iframe tags for embedded content
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'], // Needed attributes for iframes
  });
}