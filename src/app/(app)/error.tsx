'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-[#0a0a0f] px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-rose-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Something went wrong</h2>
        <p className="mt-1 text-sm text-slate-400 max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors shadow-md shadow-indigo-500/20"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}
