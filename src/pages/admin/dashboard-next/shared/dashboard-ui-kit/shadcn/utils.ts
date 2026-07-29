import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Class merger — mirrors shadcn `cn` (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
