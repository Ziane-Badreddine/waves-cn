import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(duration: number) {
  const formattedTime = [
    Math.floor((duration % 3600000) / 60000),
    Math.floor((duration % 60000) / 1000),
  ]
    .map((v) => (v < 10 ? "0" + v : v))
    .join(":");

  return formattedTime;
}
