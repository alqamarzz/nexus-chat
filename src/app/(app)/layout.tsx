'use client'

import React from 'react'
import { ChatProvider } from '@/context/ChatContext'
import { ChatSidebar } from '@/components/chat/ChatSidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <div className="flex h-screen w-full bg-[#0a0a0f] text-slate-100 overflow-hidden font-sans">
        <ChatSidebar />
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          {children}
        </main>
      </div>
    </ChatProvider>
  )
}
