'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Menu,
  Phone,
  Video,
  Info,
  Bot,
  Sparkles,
  ArrowLeft,
  Users,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useMessages } from '@/hooks/useMessages'
import { useChatStore } from '@/stores/chat-store'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { Avatar } from '@/components/ui/Avatar'
import { Message } from '@/types'
import { toast } from 'sonner'
import { isImageFile, isVideoFile } from '@/lib/utils'

export function ConversationView() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params?.id as string

  const { profile } = useAuth()
  const conversations = useChatStore((s) => s.conversations)
  const toggleSidebar = useChatStore((s) => s.toggleSidebar)

  const isAI = conversationId === 'ai'

  // Hook for standard messages
  const {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    editMessage,
    addReaction,
  } = useMessages(conversationId)

  // Local state for AI chat messages when in AI mode
  const [aiMessages, setAiMessages] = useState<Message[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Find active conversation details from store
  const activeConversation = conversations.find((c) => c.id === conversationId)
  const isGroup = activeConversation?.type === 'group'
  const otherMember = activeConversation?.members?.find((m) => m.user_id !== profile?.id)

  const chatTitle = isAI
    ? 'Nexus AI'
    : isGroup
    ? activeConversation?.name || 'Group Chat'
    : otherMember?.profile?.full_name || otherMember?.profile?.username || 'Chat'

  const chatAvatar = isAI
    ? null
    : isGroup
    ? activeConversation?.avatar_url
    : otherMember?.profile?.avatar_url

  const isOnline = isAI ? true : !isGroup && Boolean(otherMember?.profile?.is_online)

  // Scroll to bottom on message changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, aiMessages, isAiLoading])

  // Initial welcome message for AI bot
  useEffect(() => {
    if (isAI && aiMessages.length === 0) {
      setAiMessages([
        {
          id: 'welcome-ai',
          conversation_id: 'ai',
          sender_id: 'nexus-ai',
          content:
            "👋 Hi there! I'm Nexus AI, your personal AI assistant built into Nexus Chat. Ask me anything, generate ideas, analyze text, or write code!",
          type: 'ai',
          metadata: null,
          reply_to_id: null,
          reply_to: null,
          edited_at: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          sender: {
            id: 'nexus-ai',
            username: 'nexus_ai',
            full_name: 'Nexus AI',
            avatar_url: null,
            bio: 'AI Assistant',
            status_message: 'Always available',
            is_online: true,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          reactions: [],
          attachments: [],
        },
      ])
    }
  }, [isAI, aiMessages.length])

  // Handle sending messages (both standard chat and AI chat)
  const handleSendMessage = async (
    content: string,
    replyToId?: string,
    files?: File[]
  ) => {
    if (!profile) return

    if (isAI) {
      // User message for AI
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        conversation_id: 'ai',
        sender_id: profile.id,
        content,
        type: 'text',
        metadata: null,
        reply_to_id: replyToId || null,
        reply_to: replyingTo,
        edited_at: null,
        deleted_at: null,
        created_at: new Date().toISOString(),
        sender: profile,
        reactions: [],
        attachments: [],
      }

      setAiMessages((prev) => [...prev, userMsg])
      setIsAiLoading(true)

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...aiMessages, userMsg].map((m) => ({
              role: m.sender_id === 'nexus-ai' ? 'model' : 'user',
              content: m.content,
            })),
          }),
        })

        const data = await response.json()
        const botReply = data.reply || 'Sorry, I could not generate a response.'

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          conversation_id: 'ai',
          sender_id: 'nexus-ai',
          content: botReply,
          type: 'ai',
          metadata: null,
          reply_to_id: userMsg.id,
          reply_to: userMsg,
          edited_at: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          sender: {
            id: 'nexus-ai',
            username: 'nexus_ai',
            full_name: 'Nexus AI',
            avatar_url: null,
            bio: 'AI Assistant',
            status_message: 'Always available',
            is_online: true,
            last_seen: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          reactions: [],
          attachments: [],
        }

        setAiMessages((prev) => [...prev, aiMsg])
      } catch (err: unknown) {
        toast.error('AI assistant failed to respond')
      } finally {
        setIsAiLoading(false)
      }
    } else {
      // Standard Supabase messaging
      const uploadedAttachments: Array<{
        url: string
        name: string
        size: number
        mime_type: string
      }> = []
      let messageType: 'text' | 'image' | 'file' = 'text'

      if (files && files.length > 0) {
        const uploadToast = toast.loading(`Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`)
        try {
          for (const file of files) {
            const formData = new FormData()
            formData.append('file', file)
            if (profile.id) formData.append('userId', profile.id)

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })
            const uploadData = await uploadRes.json()

            if (!uploadRes.ok || !uploadData.url) {
              throw new Error(uploadData.error || `Failed to upload ${file.name}`)
            }

            uploadedAttachments.push({
              url: uploadData.url,
              name: uploadData.name || file.name,
              size: uploadData.size || file.size,
              mime_type: uploadData.mime_type || file.type || 'application/octet-stream',
            })
          }
          toast.dismiss(uploadToast)
        } catch (uploadErr: unknown) {
          toast.dismiss(uploadToast)
          const msg = uploadErr instanceof Error ? uploadErr.message : 'Upload failed'
          toast.error(msg)
          return
        }

        const hasVideo = uploadedAttachments.some((att) => isVideoFile(att.mime_type, att.url || att.name))
        const hasImage = uploadedAttachments.some((att) => isImageFile(att.mime_type, att.url || att.name))
        messageType = hasVideo ? 'file' : hasImage ? 'image' : 'file'
      }

      // Ensure content is never empty (satisfies SQL constraint: content_not_empty)
      const finalContent =
        content.trim() ||
        (uploadedAttachments.length > 0 ? uploadedAttachments[0].name : '')

      if (!finalContent && uploadedAttachments.length === 0) return

      await sendMessage({
        conversation_id: conversationId,
        content: finalContent,
        reply_to_id: replyToId,
        type: messageType,
        attachments: uploadedAttachments,
      })
    }
  }

  const currentMessages = isAI ? aiMessages : messages

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0f] overflow-hidden">
      {/* Top Chat Header */}
      <div className="h-16 border-b border-[#1e1e2e] bg-[#111118]/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <button
            onClick={() => router.push('/chat')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hidden md:block"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* User / Group Avatar */}
          <div className="relative">
            {isAI ? (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
            ) : isGroup ? (
              <div className="w-10 h-10 rounded-full bg-[#1e1e2e] flex items-center justify-center text-slate-300 border border-[#2a2a3e]">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
            ) : (
              <Avatar
                src={chatAvatar}
                name={chatTitle}
                size="md"
                showOnline
                isOnline={isOnline}
              />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm sm:text-base text-slate-100">{chatTitle}</h2>
              {isAI && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">
                  AI ASSISTANT
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {isAI
                ? 'Powered by Gemini 1.5'
                : isGroup
                ? `${activeConversation?.members?.length || 0} members`
                : isOnline
                ? 'Active now'
                : 'Offline'}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => toast.info('Voice calling coming soon to Nexus Pro!')}
            className="p-2 hover:text-slate-100 hover:bg-[#1a1a26] rounded-xl transition-colors"
            title="Start Call"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => toast.info('Video calling coming soon to Nexus Pro!')}
            className="p-2 hover:text-slate-100 hover:bg-[#1a1a26] rounded-xl transition-colors"
            title="Start Video"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={() => toast.info(`Chat with ${chatTitle}`)}
            className="p-2 hover:text-slate-100 hover:bg-[#1a1a26] rounded-xl transition-colors"
            title="Conversation Info"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin">
        {isLoading && !isAI ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            Loading messages...
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No messages yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Send a greeting to break the ice and start the conversation.
            </p>
          </div>
        ) : (
          currentMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === profile?.id}
              showSender={isGroup}
              onReply={(m) => setReplyingTo(m)}
              onDelete={deleteMessage}
              onEdit={editMessage}
              onReact={addReaction}
            />
          ))
        )}

        {/* AI Typing Indicator */}
        {isAiLoading && (
          <div className="flex items-center gap-3 my-2 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-3 rounded-2xl bg-[#151520] border border-indigo-500/30 text-slate-400 text-xs flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-150" />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-300" />
              <span className="ml-2 text-indigo-300 text-[11px]">Nexus AI is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bottom Area */}
      <MessageInput
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        isAI={isAI}
      />
    </div>
  )
}
