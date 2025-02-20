import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addZeroString = (data: number) => {
  if (data < 10) {
    return `0${data}`
  }
  return data
}
