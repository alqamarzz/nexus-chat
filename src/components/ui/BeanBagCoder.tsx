'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { Sparkles, Coffee } from 'lucide-react'

interface BeanBagCoderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'hero'
  showStatusBubble?: boolean
  showStickyNote?: boolean
  stickyText?: string
}

const QUOTES = [
  'Compiling... myself ☕',
  'For the ones who ship between naps ✨',
  'Late night commits hit different 🌙',
  '1 more bug, then 10 min nap 😴',
  'Nexus AI is watching my code 👀',
]

export function BeanBagCoder({
  className = '',
  size = 'md',
  showStatusBubble = true,
  showStickyNote = true,
  stickyText = 'Compiling... myself.',
}: BeanBagCoderProps) {
  const { isDark } = useTheme()
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [isWaking, setIsWaking] = useState(false)

  const handlePoke = () => {
    setIsWaking(true)
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    setTimeout(() => setIsWaking(false), 2400)
  }

  // Sizing definitions
  const sizeClasses = {
    sm: 'max-w-[280px]',
    md: 'max-w-[420px]',
    lg: 'max-w-[560px]',
    hero: 'max-w-[720px]',
  }

  return (
    <div
      className={`relative group select-none ${sizeClasses[size]} ${className}`}
      onClick={handlePoke}
      role="button"
      tabIndex={0}
      title="Click the bean bag coder to wake him up!"
    >
      {/* Warm Ambient Lamp Halo behind character */}
      <div
        className={`absolute -top-12 -left-12 w-64 h-64 rounded-full pointer-events-none blur-[70px] transition-all duration-700 ${
          isDark
            ? 'bg-amber-500/15 group-hover:bg-amber-500/25'
            : 'bg-amber-400/25 group-hover:bg-amber-400/40'
        }`}
      />

      {/* Main Video Animation Frame */}
      <div className="relative overflow-hidden rounded-3xl border transition-all duration-500 shadow-xl group-hover:scale-[1.01] border-black/5 dark:border-white/10 shadow-stone-900/10 dark:shadow-black/50">
        <video
          src="/animations/bean-bag-nap.mp4"
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-auto object-cover transition-all duration-700 ${
            isDark
              ? 'brightness-[0.92] contrast-[1.05] saturate-[0.95]'
              : 'brightness-[1] contrast-[1]'
          }`}
        />

        {/* Ambient Dark Mode Studio Vignette */}
        {isDark && (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#100f14]/80 via-transparent to-[#100f14]/40" />
        )}

        {/* Tactile Edge Gradient Blend */}
        <div
          className={`absolute inset-0 pointer-events-none border-[1px] rounded-3xl transition-colors duration-500 ${
            isDark ? 'border-white/5' : 'border-stone-900/5'
          }`}
        />
      </div>

      {/* Yellow Sticky Note ("Compiling... myself.") */}
      {showStickyNote && (
        <motion.div
          initial={{ rotate: -6 }}
          animate={{ rotate: isWaking ? [ -6, 2, -6 ] : -6 }}
          transition={{ duration: 0.6 }}
          className="absolute -top-3 left-4 sm:left-6 px-3 py-1.5 rounded shadow-md bg-[#FFE66D] border border-[#ECD147] text-[#4A3E00] text-[11px] font-mono font-medium -rotate-6 z-10 pointer-events-none select-none flex items-center gap-1"
        >
          <span>📌</span>
          <span>{stickyText}</span>
        </motion.div>
      )}

      {/* Speech / Status Bubble on Poke */}
      <AnimatePresence mode="wait">
        {showStatusBubble && (
          <motion.div
            key={quoteIndex}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`absolute -bottom-4 right-4 sm:right-6 px-3.5 py-1.5 rounded-full text-xs font-medium border shadow-lg backdrop-blur-md z-20 flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#1e1c26]/90 border-amber-500/30 text-amber-300 shadow-black/50'
                : 'bg-[#faf7f2]/95 border-amber-600/20 text-stone-800 shadow-stone-800/10'
            }`}
          >
            {isWaking ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
            ) : (
              <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            <span>{QUOTES[quoteIndex]}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BeanBagCoder
