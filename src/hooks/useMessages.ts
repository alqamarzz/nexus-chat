'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/stores/chat-store'
import { Message, SendMessagePayload } from '@/types'
import { useAuth } from './useAuth'

interface UseMessagesReturn {
  messages: Message[]
  isLoading: boolean
  sendMessage: (payload: SendMessagePayload) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  editMessage: (messageId: string, content: string) => Promise<void>
  addReaction: (messageId: string, emoji: string) => Promise<void>
}

const AI_CONVERSATION_ID = 'ai'

export function useMessages(conversationId: string): UseMessagesReturn {
  const { user } = useAuth()
  const supabase = createClient()
  const {
    getMessages,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage: deleteMessageInStore,
    setIsLoadingMessages,
    isLoadingMessages: isLoading,
  } = useChatStore()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const [aiTyping, setAiTyping] = useState(false)

  const messages = getMessages(conversationId)

  // ── Fetch Messages ──────────────────────────────────────────────────────────

  const fetchMessages = useCallback(async () => {
    if (!conversationId || conversationId === AI_CONVERSATION_ID) return
    setIsLoadingMessages(true)

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(
          `
          *,
          sender:profiles(*),
          reactions:message_reactions(
            *,
            profile:profiles(*)
          ),
          attachments:file_attachments(*),
          reply_to:messages!reply_to_id(
            *,
            sender:profiles(*)
          )
        `
        )
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error

      setMessages(conversationId, (data ?? []) as Message[])
    } catch (err) {
      console.error('[useMessages] fetchMessages error:', err)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [conversationId, supabase, setMessages, setIsLoadingMessages])

  // ── Mark as Read ────────────────────────────────────────────────────────────

  const markAsRead = useCallback(async () => {
    if (!user || !conversationId || conversationId === AI_CONVERSATION_ID) return

    await supabase
      .from('conversation_members')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
  }, [user, conversationId, supabase])

  // ── Realtime Subscription ────────────────────────────────────────────────────

  useEffect(() => {
    if (!conversationId || conversationId === AI_CONVERSATION_ID) return

    fetchMessages().then(() => markAsRead())

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: any) => {
          // Fetch the full message with relations
          const { data } = await supabase
            .from('messages')
            .select(
              `*, sender:profiles(*), reactions:message_reactions(*, profile:profiles(*)), attachments:file_attachments(*), reply_to:messages!reply_to_id(*, sender:profiles(*))`
            )
            .eq('id', payload.new.id)
            .single()

          if (data) {
            addMessage(conversationId, data as Message)
            markAsRead()
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'file_attachments',
        },
        async (payload: any) => {
          const newAtt = payload.new
          if (newAtt?.message_id) {
            const { data } = await supabase
              .from('messages')
              .select(
                `*, sender:profiles(*), reactions:message_reactions(*, profile:profiles(*)), attachments:file_attachments(*), reply_to:messages!reply_to_id(*, sender:profiles(*))`
              )
              .eq('id', newAtt.message_id)
              .single()

            if (data) {
              updateMessage(conversationId, newAtt.message_id, data as Message)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload: any) => {
          const { data } = await supabase
            .from('messages')
            .select(
              `*, sender:profiles(*), reactions:message_reactions(*, profile:profiles(*)), attachments:file_attachments(*), reply_to:messages!reply_to_id(*, sender:profiles(*))`
            )
            .eq('id', payload.new.id)
            .single()

          if (data) {
            updateMessage(conversationId, payload.new.id, data as Partial<Message>)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'message_reactions',
        },
        () => {
          // Refetch to get updated reactions
          fetchMessages()
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  // ── Send Message ────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (payload: SendMessagePayload) => {
      if (!user) return

      if (conversationId === AI_CONVERSATION_ID) {
        // Handle AI conversation via Gemini
        const userMessage: Message = {
          id: `temp-${Date.now()}`,
          conversation_id: AI_CONVERSATION_ID,
          sender_id: user.id,
          content: payload.content,
          type: 'text',
          metadata: null,
          reply_to_id: null,
          reply_to: null,
          edited_at: null,
          deleted_at: null,
          created_at: new Date().toISOString(),
          sender: { id: user.id } as any,
          reactions: [],
          attachments: [],
        }
        addMessage(AI_CONVERSATION_ID, userMessage)

        setAiTyping(true)
        try {
          const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: payload.content }],
            }),
          })
          const data = await response.json()
          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            conversation_id: AI_CONVERSATION_ID,
            sender_id: 'nexus-ai',
            content: data.reply ?? '...',
            type: 'ai',
            metadata: null,
            reply_to_id: null,
            reply_to: null,
            edited_at: null,
            deleted_at: null,
            created_at: new Date().toISOString(),
            sender: { id: 'nexus-ai', full_name: 'Nexus AI', username: 'nexus_ai', avatar_url: null } as any,
            reactions: [],
            attachments: [],
          }
          addMessage(AI_CONVERSATION_ID, aiMessage)
        } catch {
          // Handle AI error silently
        } finally {
          setAiTyping(false)
        }
        return
      }

      // Normal message
      const { data: msg, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: payload.content,
          type: payload.type ?? 'text',
          reply_to_id: payload.reply_to_id ?? null,
          metadata: payload.metadata ?? null,
        })
        .select('*')
        .single()

      if (error) {
        console.error('[useMessages] sendMessage error:', error)
        return
      }

      // If there are attachments, insert them
      if (payload.attachments?.length && msg) {
        const { data: insertedAtts, error: attError } = await supabase
          .from('file_attachments')
          .insert(
            payload.attachments.map((att) => ({ ...att, message_id: msg.id }))
          )
          .select('*')

        if (attError) {
          console.error('[useMessages] file_attachments insert error:', attError)
        } else if (insertedAtts?.length) {
          updateMessage(conversationId, msg.id, {
            attachments: insertedAtts as any,
          })
        }
      }
    },
    [user, conversationId, supabase, addMessage]
  )

  // ── Delete Message ───────────────────────────────────────────────────────────

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!user) return

      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id)

      if (!error) {
        deleteMessageInStore(conversationId, messageId)
      }
    },
    [user, conversationId, supabase, deleteMessageInStore]
  )

  // ── Edit Message ─────────────────────────────────────────────────────────────

  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      if (!user) return

      const { error } = await supabase
        .from('messages')
        .update({ content, edited_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', user.id)

      if (!error) {
        updateMessage(conversationId, messageId, {
          content,
          edited_at: new Date().toISOString(),
        })
      }
    },
    [user, conversationId, supabase, updateMessage]
  )

  // ── Add Reaction ─────────────────────────────────────────────────────────────

  const addReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!user) return

      // Toggle: remove if already exists, add if not
      const existing = messages
        .find((m) => m.id === messageId)
        ?.reactions?.find((r) => r.user_id === user.id && r.emoji === emoji)

      if (existing) {
        await supabase.from('message_reactions').delete().eq('id', existing.id)
      } else {
        await supabase.from('message_reactions').insert({
          message_id: messageId,
          user_id: user.id,
          emoji,
        })
      }
    },
    [user, messages, supabase]
  )

  return {
    messages,
    isLoading,
    sendMessage,
    deleteMessage,
    editMessage,
    addReaction,
  }
}
