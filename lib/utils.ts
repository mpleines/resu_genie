import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (
    date.toDateString() ===
    new Date(today.setDate(today.getDate() - 1)).toDateString()
  ) {
    return 'Yesterday';
  }

  return date.toDateString();
}
