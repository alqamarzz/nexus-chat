'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'

interface AuthTransitionScreenProps {
  title?: string
  subtitle?: string
  mode?: 'login' | 'register'
}

export function AuthTransitionScreen({
  title = 'Connecting to Nexus',
  subtitle = 'Setting up your secure workspace and loading chats...',
  mode = 'login',
}: AuthTransitionScreenProps) {
  const [progress, setProgress] = useState(20)
  const [stepIndex, setStepIndex] = useState(0)

  const steps =
    mode === 'login'
      ? [
          'Verifying session credentials',
          'Decrypting profile data',
          'Connecting to realtime channels',
          'Entering workspace...',
        ]
      : [
          'Provisioning profile & security keys',
          'Configuring personal chat storage',
          'Joining global channels',
          'Welcome aboard...',
        ]

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(50)
      setStepIndex(1)
    }, 400)

    const timer2 = setTimeout(() => {
      setProgress(80)
      setStepIndex(2)
    }, 900)

    const timer3 = setTimeout(() => {
      setProgress(100)
      setStepIndex(3)
    }, 1500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0f] text-slate-100 overflow-hidden font-sans">
      {/* Dynamic ambient background glow */}
      <div className="absolute w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none -bottom-20 -right-20 animate-pulse delay-500" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-sm w-full mx-auto px-6 flex flex-col items-center text-center">
        {/* Glowing Logo Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-400 p-[2px] shadow-2xl shadow-indigo-500/30 animate-pulse">
            <div className="w-full h-full bg-[#0d0d15] rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-indigo-400 animate-spin-slow" />
            </div>
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-30 blur-lg animate-ping" />
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
          {title}
        </h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-xs">
          {subtitle}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#161622] border border-[#242436] rounded-full h-2 p-0.5 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500 ease-out shadow-sm shadow-indigo-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="w-full space-y-2 bg-[#12121c]/80 border border-[#1e1e2e] rounded-xl p-3.5 backdrop-blur-md">
          {steps.map((step, idx) => {
            const isDone = idx < stepIndex
            const isCurrent = idx === stepIndex
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-indigo-300'
                    : isCurrent
                    ? 'text-white font-medium'
                    : 'text-slate-500 opacity-40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                )}
                <span className="truncate">{step}</span>
              </div>
            )
          })}
        </div>

        {/* Security badge footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-500 select-none">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400/80" />
          <span>End-to-End Encrypted Session</span>
        </div>
      </div>
    </div>
  )
}
