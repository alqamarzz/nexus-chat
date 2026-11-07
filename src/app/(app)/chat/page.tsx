'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sparkles, MessageSquare, Bot, Users, ShieldCheck, Zap } from 'lucide-react'
import { NewChatModal } from '@/components/chat/NewChatModal'

export default function ChatOverviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-b from-[#0e0e16] to-[#0a0a0f]">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -bottom-20 -right-20" />

      <div className="max-w-md w-full relative z-10 flex flex-col items-center">
        {/* Animated App Emblem */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-cyan-400 p-0.5 shadow-2xl shadow-indigo-500/25">
            <div className="w-full h-full bg-[#0e0e17] rounded-[22px] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-indigo-400" />
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0a0f] flex items-center justify-center" />
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Nexus</span>
        </h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Select an existing conversation from the sidebar, start a new chat with your teammates, or converse with Nexus AI.
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
