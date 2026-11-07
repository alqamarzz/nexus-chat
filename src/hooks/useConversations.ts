'use client'

import { useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useChatStore } from '@/stores/chat-store'
import { Conversation } from '@/types'
import { useAuth } from './useAuth'

interface UseConversationsReturn {
  conversations: Conversation[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useConversations(): UseConversationsReturn {
  const { user } = useAuth()
  const supabase = createClient()
  const {
    conversations,
    setConversations,
    addConversation,
    updateConversation,
    isLoadingMessages: isLoading,
    setIsLoadingMessages: setIsLoading,
  } = useChatStore()
  const errorRef = useRef<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  const fetchConversations = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    errorRef.current = null

    try {
      // Fetch conversations the user is a member of, with members + last message
      const { data, error } = await supabase
        .from('conversation_members')
        .select(
          `
          conversation:conversations (
            id,
            type,
            name,
            description,
            avatar_url,
            created_by,
            created_at,
            members:conversation_members (
              conversation_id,
              user_id,
              role,
              joined_at,
              last_read_at,
              profile:profiles (*)
            )
          )
        `
        )
        .eq('user_id', user.id)

      if (error) throw error

      // Flatten nested conversations
      const rawConversations = (data ?? [])
        .map((row: any) => row.conversation)
        .filter(Boolean)

      // For each conversation, fetch last message and unread count
      const enriched: Conversation[] = await Promise.all(
        rawConversations.map(async (conv: any) => {
          const memberRecord = conv.members?.find(
            (m: any) => m.user_id === user.id
          )
          const lastReadAt = memberRecord?.last_read_at

          // Last message
          const { data: lastMsgs } = await supabase
            .from('messages')
            .select('*, sender:profiles(*), reactions:message_reactions(*), attachments:file_attachments(*)')
            .eq('conversation_id', conv.id)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(1)

          const lastMessage = lastMsgs?.[0] ?? null

          // Unread count
          let unreadQuery = supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .is('deleted_at', null)

          if (lastReadAt) {
            unreadQuery = unreadQuery.gt('created_at', lastReadAt)
          }

          const { count: unreadCount } = await unreadQuery

          return {
            ...conv,
            last_message: lastMessage,
            unread_count: unreadCount ?? 0,
          } as Conversation
        })
      )

      // Sort by last message time descending
      enriched.sort((a, b) => {
        const aTime = a.last_message?.created_at ?? a.created_at
        const bTime = b.last_message?.created_at ?? b.created_at
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })

      setConversations(enriched)
    } catch (err: any) {
      errorRef.current = err.message ?? 'Failed to load conversations'
    } finally {
      setIsLoading(false)
    }
  }, [user, supabase, setConversations, setIsLoading])

  // Set up Realtime subscription
  useEffect(() => {
    if (!user) return

    fetchConversations()

    // Subscribe to conversation_members changes (new conversations)
    const channel = supabase
      .channel(`conversations:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_members',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Refetch when added to a new conversation
          fetchConversations()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: any) => {
          // Update the last message in the relevant conversation
          const msg = payload.new
          if (!msg?.conversation_id) return

          // Refetch sender profile + reactions for the message
          const { data: fullMsg } = await supabase
            .from('messages')
            .select('*, sender:profiles(*), reactions:message_reactions(*), attachments:file_attachments(*)')
            .eq('id', msg.id)
            .single()

          if (fullMsg) {
            updateConversation(msg.conversation_id, {
              last_message: fullMsg as any,
            })
          }
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
  }, [user?.id])

  return {
    conversations,
    isLoading,
    error: errorRef.current,
    refetch: fetchConversations,
  }
}
