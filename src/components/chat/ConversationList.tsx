'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Bot, Users } from 'lucide-react'
import { Conversation, Profile } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { formatMessageTime } from '@/lib/utils'
import { useChatStore } from '@/stores/chat-store'

interface ConversationListProps {
  conversations: Conversation[]
  currentUser: Profile | null
  searchQuery: string
  onSelectConversation?: (id: string) => void
}

export function ConversationList({
  conversations,
  currentUser,
  searchQuery,
  onSelectConversation,
}: ConversationListProps) {
  const params = useParams()
  const activeId = params?.id as string | undefined
  const markConversationAsRead = useChatStore((s) => s.markConversationAsRead)

  const filtered = conversations.filter((c) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    if (c.type === 'group') {
      return c.name?.toLowerCase().includes(q)
    }
    const otherMember = c.members?.find((m) => m.user_id !== currentUser?.id)
    const name = otherMember?.profile?.full_name || otherMember?.profile?.username || ''
    return name.toLowerCase().includes(q)
  })

  return (
    <div className="flex-1 overflow-y-auto space-y-1 px-2 py-1 scrollbar-thin">
      {/* Pinned Nexus AI Bot */}
      <Link
        href="/chat/ai"
        onClick={() => onSelectConversation?.('ai')}
        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
          activeId === 'ai'
            ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 text-slate-100 font-semibold'
            : 'hover:bg-[#161622] text-slate-300'
        }`}
      >
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#111118] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-100">Nexus AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                BOT
              </span>
            </div>
            <span className="text-[10px] text-indigo-400">Online</span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            Your personal AI assistant powered by Gemini
          </p>
        </div>
      </Link>

      {/* Normal Conversations */}
      {filtered.length === 0 && conversations.length > 0 && searchQuery && (
        <div className="text-center py-6 text-xs text-slate-500">No chats matching &quot;{searchQuery}&quot;</div>
      )}

      {filtered.map((conv) => {
        const isGroup = conv.type === 'group'
        const otherMember = conv.members?.find((m) => m.user_id !== currentUser?.id)
        const title = isGroup
          ? conv.name || 'Group Chat'
          : otherMember?.profile?.full_name || otherMember?.profile?.username || 'Chat'
        const avatarUrl = isGroup ? conv.avatar_url : otherMember?.profile?.avatar_url
        const isOnline = !isGroup && Boolean(otherMember?.profile?.is_online)
        const lastMsg = conv.last_message
        const isActive = activeId === conv.id

        return (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            onClick={() => {
              markConversationAsRead(conv.id)
              onSelectConversation?.(conv.id)
            }}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-indigo-500/30 text-slate-100 font-semibold'
                : 'hover:bg-[#161622] text-slate-300'
            }`}
          >
            {/* Avatar */}
            <div className="shrink-0 relative">
              {isGroup ? (
                <div className="w-10 h-10 rounded-full bg-[#1e1e2e] flex items-center justify-center text-slate-300 border border-[#2a2a3e]">
                  <Users className="w-5 h-5 text-indigo-400" />
                </div>
              ) : (
                <Avatar
                  src={avatarUrl}
                  name={title}
                  size="md"
                  showOnline
                  isOnline={isOnline}
                />
              )}
            </div>

            {/* Conversation Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm text-slate-100 truncate">{title}</span>
                {lastMsg && (
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {formatMessageTime(lastMsg.created_at)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 truncate">
                  {lastMsg ? (
                    <>
                      {lastMsg.sender_id === currentUser?.id ? 'You: ' : ''}
                      {lastMsg.content || (lastMsg.attachments?.length ? 'Sent an attachment' : '')}
                    </>
                  ) : (
                    'No messages yet'
                  )}
                </p>
                {conv.unread_count > 0 && !isActive && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full min-w-4 text-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
