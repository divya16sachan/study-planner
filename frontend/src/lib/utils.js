import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatTime = (isoString) => {
  const date = new Date(isoString);

  // Get time components
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
  return formattedTime;
}

export const formatDate = (isoString) => {
  const date = new Date(isoString);

  // Get date components
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  
  // Construct date and time strings
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

