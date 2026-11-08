'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, MessageSquare, Bot, Users, ShieldCheck, Zap } from 'lucide-react'
import { NewChatModal } from '@/components/chat/NewChatModal'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { BeanBagCoder } from '@/components/ui/BeanBagCoder'
import { useChatStore } from '@/stores/chat-store'

export default function ChatOverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  useEffect(() => {
    setActiveConversation(null)
  }, [setActiveConversation])

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0e0e16] to-[#0a0a0f]">
      {/* Top right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle size="sm" />
      </div>

      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -bottom-20 -right-20" />

      <div className="max-w-lg w-full relative z-10 flex flex-col items-center">
        {/* Scrolltide Bean Bag Nap Animated Coder */}
        <div className="mb-6 w-full flex justify-center">
          <BeanBagCoder size="md" showStickyNote={true} stickyText="Nexus AI... connected." />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-indigo-400 to-violet-400">Nexus</span>
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-md">
          For the ones who ship between naps. Select a conversation from the sidebar, start a new chat, or bounce ideas off Nexus AI.
        </p>

        {/* Quick action buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#13131c] border border-[#1e1e2e] hover:border-indigo-500/40 hover:bg-[#181824] transition-all text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">New Chat</span>
          </button>

          <Link
            href="/chat/ai"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#13131c] border border-[#1e1e2e] hover:border-indigo-500/40 hover:bg-[#181824] transition-all text-slate-200"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Chat with AI</span>
          </Link>
        </div>

        {/* Security / Performance Badges */}
        <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Row Level Security
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Realtime Subscriptions
          </span>
        </div>
      </div>

      <NewChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
