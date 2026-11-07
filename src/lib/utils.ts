import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

/**
 * Merges Tailwind CSS class names with conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a message timestamp for display in the chat list or message bubble.
 * - Today → "HH:mm"
 * - Yesterday → "Yesterday"
 * - Older → "MMM d" (e.g. "Jan 5")
 */
export function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d')
}

/**
 * Returns a human-readable relative time string for the last-seen timestamp.
 * e.g. "3 minutes ago", "about 2 hours ago"
 */
export function formatLastSeen(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

/**
 * Extracts up to two initials from a display name.
 * e.g. "John Doe" → "JD", "Alice" → "AL"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Formats a byte count into a human-readable file size string.
 * e.g. 1500 → "1.5 KB", 2048000 → "2.0 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Returns true if the given MIME type represents an image file.
 */
export function isImageFile(mimeType?: string | null): boolean {
  if (!mimeType) return false
  return mimeType.startsWith('image/')
}

/**
 * Returns true if the given MIME type represents a video file.
 */
export function isVideoFile(mimeType?: string | null): boolean {
  if (!mimeType) return false
  return mimeType.startsWith('video/')
}

/**
 * Truncates a string to `maxLength` characters, appending "…" if truncated.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

/**
 * Generates a deterministic HSL colour from a string (e.g. a user ID or name)
 * for use as a default avatar background.
 */
export function stringToHslColor(str: string, saturation = 65, lightness = 50): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Checks whether a URL points to a valid image by attempting to load it.
 */
export async function isValidImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

/**
 * Debounces a function call.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
