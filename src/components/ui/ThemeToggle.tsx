'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

interface ThemeToggleProps {
  className?: string
  size?: 'sm' | 'md'
  showLabel?: boolean
}

/**
 * Pixel Art Moon with stars and subtle shaded inner sphere
 * Matches reference video frame_0.jpg
 */
function PixelMoonIcon({ size = 16 }: { size?: number }) {
  // Grid-aligned pixel blocks on a 20x20 canvas
  const pixelSize = 1.35
  const gap = 0.25
  const step = pixelSize + gap

  // Crescent lit pixels (x, y grid coords 0..11)
  const litPixels: [number, number][] = [
    // Top horn
    [4, 1], [5, 1],
    [3, 2], [4, 2],
    [2, 3], [3, 3],
    [2, 4], [3, 4],
    // Middle spine
    [1, 5], [2, 5], [3, 5],
    [1, 6], [2, 6], [3, 6],
    [1, 7], [2, 7], [3, 7],
    [2, 8], [3, 8],
    [2, 9], [3, 9],
    // Bottom horn
    [3, 10], [4, 10],
    [4, 11], [5, 11], [6, 11],
  ]

  // Inner shaded pixels (faint dark silhouette of moon)
  const shadedPixels: [number, number][] = [
    [5, 2], [6, 2],
    [4, 3], [5, 3], [6, 3], [7, 3],
    [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
    [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
    [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
    [4, 7], [5, 7], [6, 7], [7, 7],
    [4, 8], [5, 8], [6, 8],
    [4, 9], [5, 9],
    [7, 10],
  ]

  // Floating star pixels (top-right)
  const star1: [number, number][] = [
    [9, 1],
    [8, 2], [9, 2], [10, 2],
    [9, 3],
  ]
  const star2: [number, number][] = [
    [11, 4],
  ]

  const originX = 1.8
  const originY = 1.8

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none pointer-events-none"
      shapeRendering="crispEdges"
    >
      {/* Shaded/Unlit part of moon */}
      {shadedPixels.map(([gx, gy], i) => (
        <rect
          key={`s-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="rgba(255, 255, 255, 0.28)"
        />
      ))}

      {/* Lit crescent pixels */}
      {litPixels.map(([gx, gy], i) => (
        <rect
          key={`l-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="#FFFFFF"
        />
      ))}

      {/* Star 1 */}
      {star1.map(([gx, gy], i) => (
        <rect
          key={`st1-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="#FFFFFF"
        />
      ))}

      {/* Star 2 */}
      {star2.map(([gx, gy], i) => (
        <rect
          key={`st2-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="rgba(255, 255, 255, 0.85)"
        />
      ))}
    </svg>
  )
}

/**
 * Pixel Art Sun with rays and dot matrix core
 * Matches reference video frame_step_2.jpg
 */
function PixelSunIcon({ size = 16 }: { size?: number }) {
  const pixelSize = 1.35
  const gap = 0.25
  const step = pixelSize + gap

  // Center disk 5x5 / 6x6 with rounded corners
  const centerDisk: [number, number][] = [
    // row 3
    [4, 3], [5, 3], [6, 3],
    // row 4
    [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
    // row 5
    [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
    // row 6
    [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
    // row 7
    [4, 7], [5, 7], [6, 7],
  ]

  // 8 Directional pixel rays
  const rays: [number, number][] = [
    // Top ray (vertical)
    [5, 0], [5, 1],
    // Bottom ray (vertical)
    [5, 9], [5, 10],
    // Left ray (horizontal)
    [0, 5], [1, 5],
    // Right ray (horizontal)
    [9, 5], [10, 5],
    // Top-left diagonal
    [1, 1], [2, 2],
    // Top-right diagonal
    [9, 1], [8, 2],
    // Bottom-left diagonal
    [1, 9], [2, 8],
    // Bottom-right diagonal
    [9, 9], [8, 8],
  ]

  const originX = 2.4
  const originY = 2.4

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none pointer-events-none"
      shapeRendering="crispEdges"
    >
      {/* Central sun disk */}
      {centerDisk.map(([gx, gy], i) => (
        <rect
          key={`cd-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="#1C1E24"
        />
      ))}

      {/* Solar rays */}
      {rays.map(([gx, gy], i) => (
        <rect
          key={`r-${i}`}
          x={originX + gx * step}
          y={originY + gy * step}
          width={pixelSize}
          height={pixelSize}
          fill="#1C1E24"
        />
      ))}
    </svg>
  )
}

export function ThemeToggle({
  className = '',
  size = 'sm',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dimensions based on size
  const isSm = size === 'sm'
  const trackWidth = isSm ? 54 : 64
  const trackHeight = isSm ? 30 : 36
  const thumbSize = isSm ? 24 : 28
  const padding = 3
  const travelDistance = trackWidth - thumbSize - padding * 2 // ~24px for sm

  // Prevent hydration mismatch
  const currentIsDark = mounted ? isDark : true

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        role="switch"
        aria-checked={!currentIsDark}
        aria-label={currentIsDark ? 'Switch to Day theme' : 'Switch to Night theme'}
        title={currentIsDark ? 'Switch to Day theme' : 'Switch to Night theme'}
        className={`relative inline-flex items-center p-0 rounded-full cursor-pointer outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2 ${
          currentIsDark
            ? 'bg-[#121319] border border-[#232533] shadow-[inset_0_2px_5px_rgba(0,0,0,0.65)] hover:border-[#353849]'
            : 'bg-[#e2e5eb] border border-[#cbd0dc] shadow-[inset_0_2px_5px_rgba(0,0,0,0.12)] hover:border-[#b8becd]'
        }`}
        style={{
          width: trackWidth,
          height: trackHeight,
        }}
      >
        {/* Sliding Thumb Container */}
        <motion.div
          className={`relative rounded-[11px] flex items-center justify-center transition-all duration-300 ${
            currentIsDark
              ? 'bg-[#222430]/95 backdrop-blur-md border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.45)]'
              : 'bg-gradient-to-b from-[#ffffff] to-[#eef1f6] border border-white/80 shadow-[0_3px_10px_rgba(0,0,0,0.16),0_1px_3px_rgba(0,0,0,0.08)]'
          }`}
          style={{
            width: thumbSize,
            height: thumbSize,
            marginLeft: padding,
          }}
          animate={{
            x: currentIsDark ? 0 : travelDistance,
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 32,
          }}
        >
          {/* NEON RIM GLOW EFFECT */}
          {/* In Dark mode: Curved Electric Indigo/Violet glowing arc on the BOTTOM edge */}
          {currentIsDark && (
            <div
              className="absolute -bottom-[1px] inset-x-0 h-1/2 rounded-b-[11px] pointer-events-none border-b-[2px] border-b-[#818cf8]"
              style={{
                boxShadow:
                  '0 3px 10px 0 rgba(99, 102, 241, 0.85), 0 0 16px 2px rgba(129, 140, 248, 0.45)',
              }}
            />
          )}

          {/* In Light mode: Curved Warm Amber/Sunburst glowing arc on the TOP edge */}
          {!currentIsDark && (
            <div
              className="absolute -top-[1px] inset-x-0 h-1/2 rounded-t-[11px] pointer-events-none border-t-[2px] border-t-[#f59e0b]"
              style={{
                boxShadow:
                  '0 -3px 10px 0 rgba(245, 158, 11, 0.85), 0 0 18px 3px rgba(251, 191, 36, 0.5)',
              }}
            />
          )}

          {/* ICON DISPLAY WITH SMOOTH TRANSITION */}
          <AnimatePresence mode="wait" initial={false}>
            {currentIsDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.65, rotate: -25 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.65, rotate: 25 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 flex items-center justify-center"
              >
                <PixelMoonIcon size={isSm ? 15 : 18} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.65, rotate: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.65, rotate: -30 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 flex items-center justify-center"
              >
                <PixelSunIcon size={isSm ? 15 : 18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      {showLabel && (
        <span
          className={`text-xs font-medium cursor-pointer ${
            currentIsDark ? 'text-slate-300' : 'text-slate-700'
          }`}
          onClick={toggleTheme}
        >
          {currentIsDark ? 'Night' : 'Day'}
        </span>
      )}
    </div>
  )
}
export default ThemeToggle
