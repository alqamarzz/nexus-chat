import React from 'react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AppLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-slate-500 animate-pulse">Loading Nexus…</p>
      </div>
    </div>
  )
}
