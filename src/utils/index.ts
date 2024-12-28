import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createResponse ({
  statusCode,
  message = "Success",
  data = {},
}: {
  statusCode: number
  message?: string
  data?: unknown
}) {
  return {
    statusCode: statusCode || 200,
    message,
    data: JSON.parse(JSON.stringify(data)),
  }
}