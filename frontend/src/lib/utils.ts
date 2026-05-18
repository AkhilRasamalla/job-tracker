import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind class names safely, resolving conflicts with twMerge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
