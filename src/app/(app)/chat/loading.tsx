import React from 'react'

export default function ChatLoading() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0f] overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 border-b border-[#1e1e2e] bg-[#111118]/80 px-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1e1e2e]" />
        <div className="flex flex-col gap-1.5">
          <div className="w-32 h-3.5 rounded bg-[#1e1e2e]" />
          <div className="w-20 h-2.5 rounded bg-[#1a1a26]" />
        </div>
      </div>

      {/* Messages skeleton */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`flex gap-3 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-8 h-8 rounded-full bg-[#1e1e2e] shrink-0 self-end" />
            <div
              className={`space-y-1 max-w-[60%] ${i % 2 === 1 ? 'items-end' : 'items-start'} flex flex-col`}
            >
              <div
                className="h-10 rounded-2xl bg-[#1e1e2e]"
                style={{ width: `${120 + (i * 37) % 120}px` }}
              />
              <div className="w-10 h-2 rounded bg-[#1a1a26]" />
            </div>
          </div>
        ))}
      </div>

      {/* Input skeleton */}
      <div className="border-t border-[#1e1e2e] bg-[#111118]/80 px-4 py-3">
        <div className="h-10 rounded-2xl bg-[#1e1e2e]" />
      </div>
    </div>
  )
}
