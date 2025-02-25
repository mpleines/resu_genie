import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date,
  options?: {
    displayTodayAndYesterdayAsString?: boolean;
  }
) {
  if (options?.displayTodayAndYesterdayAsString) {
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

    return format(date, 'MMMM dd, yyyy');
  }

  return format(date, 'MMMM dd, yyyy');
}
