import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getHostFromUrl = (url: string) => {
  if (!url || url === "direct") return "Direct";
  try {
    const urlWithProtocol = url.startsWith("http") ? url : `http://${url}`;
    return new URL(urlWithProtocol).host;
  } catch {
    return url;
  }
};

export const getSimplePath = (url: string) => {
  try {
    return new URL(url).pathname || url;
  } catch {
    return url;
  }
};