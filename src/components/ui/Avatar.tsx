'use client'

import React from 'react'
import { cn, getInitials, stringToHslColor } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  name: string
  size?: AvatarSize
  showOnline?: boolean
  isOnline?: boolean
  className?: string
}

// ── Size Maps ─────────────────────────────────────────────────────────────────

const sizeMap: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  sm: { container: 'w-6 h-6', text: 'text-[9px]', dot: 'w-2 h-2 border' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5 border-2' },
  lg: { container: 'w-14 h-14', text: 'text-lg', dot: 'w-3 h-3 border-2' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', dot: 'w-4 h-4 border-2' },
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Avatar({
  src,
  name,
  size = 'md',
  showOnline = false,
  isOnline = false,
  className,
}: AvatarProps) {
  const { container, text, dot } = sizeMap[size]
  const initials = getInitials(name)
  const bgColor = stringToHslColor(name)

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold select-none',
          container
        )}
        style={!src ? { backgroundColor: bgColor } : undefined}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // On image load error, hide the img and show initials
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <span className={cn('text-white/90 font-bold', text)}>{initials}</span>
        )}
      </div>

      {showOnline && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-[#0a0a0f]',
            dot,
            isOnline ? 'bg-emerald-400' : 'bg-gray-500'
          )}
        />
      )}
    </div>
  )
}
