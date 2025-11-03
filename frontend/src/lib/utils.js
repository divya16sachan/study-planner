import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { format, parse } from 'date-fns';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return format(date, 'h:mm'); // e.g., "1:30 PM"
};

export const getAmPm = (time24) => {
  if(!time24) return '';
  const [hours] = time24.split(':');
  return +hours >= 12 ? "PM" : "AM";
}

export const formatTime24Hour = (time12) => {
  if (!time12) return '';
  try {
    const parsedTime = parse(time12, 'h:mm a', new Date());
    return format(parsedTime, 'HH:mm'); // e.g., "13:30"
  } catch (e) {
    console.error("Invalid time format:", time12);
    return '';
  }
};