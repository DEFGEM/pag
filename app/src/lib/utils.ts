import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function difficultyBadge(diff: string) {
  const styles: Record<string, string> = {
    basico: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermedio: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    avanzado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };
  return styles[diff] || styles.basico;
}
