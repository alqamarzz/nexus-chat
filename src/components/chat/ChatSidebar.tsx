'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MessageSquarePlus,
  Search,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useConversations } from '@/hooks/useConversations'
import { useChatStore } from '@/stores/chat-store'
import { ConversationList } from './ConversationList'
import { NewChatModal } from './NewChatModal'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function ChatSidebar() {
  const router = useRouter()
  const { profile, signOut } = useAuth()
  const { conversations, isLoading } = useConversations()
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)

  const isSidebarOpen = useChatStore((s) => s.isSidebarOpen)
  const toggleSidebar = useChatStore((s) => s.toggleSidebar)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-80 md:w-84 h-full bg-[#111118] border-r border-[#1e1e2e] flex flex-col transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#1e1e2e] flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Nexus</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <ThemeToggle size="sm" />
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1a1a26] transition-colors"
              title="New Message"
            >
              <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#1e1e2e]/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500/60 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading && conversations.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Loading chats...
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
                  Loading chats...
                </div>
              }
            >
              <ConversationList
                conversations={conversations}
                currentUser={profile}
                searchQuery={searchQuery}
                onSelectConversation={() => {
                  if (window.innerWidth < 768) toggleSidebar()
                }}
              />
            </Suspense>
          )}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-[#1e1e2e] bg-[#0d0d14]/80 flex items-center justify-between">
          <Link
            href="/settings"
            className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-xl hover:bg-[#181824] transition-colors"
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || profile?.username || 'User'}
              size="sm"
              showOnline
              isOnline={profile?.is_online ?? true}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {profile?.full_name || profile?.username || 'My Profile'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                @{profile?.username || 'user'}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#181824] rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#181824] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* New Chat Modal */}
      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
    </>
  )
}
