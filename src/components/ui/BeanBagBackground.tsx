'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'

export function BeanBagBackground() {
  const { isDark } = useTheme()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
    >
      {/* Warm Ambient Lamp Halo behind the coder position */}
      <div
        className={`absolute bottom-[-10%] left-[-5%] w-[600px] sm:w-[900px] h-[500px] sm:h-[700px] rounded-full blur-[110px] pointer-events-none transition-colors duration-700 ${
          isDark ? 'bg-amber-500/12' : 'bg-amber-400/20'
        }`}
      />

      {/* Persistent Full-Page Ambient Video Layer */}
      <div
        className={`absolute bottom-0 left-0 w-full sm:w-[85vw] md:w-[75vw] lg:w-[65vw] max-w-[1300px] aspect-video transition-all duration-700 ${
          isDark
            ? 'opacity-40 brightness-[0.75] contrast-[1.15] saturate-[0.85]'
            : 'opacity-85 brightness-[1] contrast-[1]'
        }`}
        style={{
          maskImage:
            'radial-gradient(ellipse 95% 85% at 15% 75%, black 40%, rgba(0,0,0,0.6) 65%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 85% at 15% 75%, black 40%, rgba(0,0,0,0.6) 65%, transparent 100%)',
        }}
      >
        <video
          src="/animations/bean-bag-nap.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-left-bottom"
        />

        {/* Studio Dark Mode Lighting Overlay */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#100f14]/85 via-[#100f14]/50 to-transparent mix-blend-multiply pointer-events-none" />
        )}
      </div>

      {/* Gentle Top-Right Ambient Indigo Glow */}
      <div
        className={`absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none transition-colors duration-700 ${
          isDark ? 'bg-indigo-600/10' : 'bg-amber-600/5'
        }`}
      />
    </div>
  )
}

export default BeanBagBackground
