import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function createPageUrl(pageName) {
  if (pageName.includes('?')) {
    const [page, query] = pageName.split('?');
    return `/${page}?${query}`;
  }
  return `/${pageName}`;
}