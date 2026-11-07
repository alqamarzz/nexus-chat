'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { useAuth } from '@/hooks/useAuth'

interface ChatContextValue {
  isReady: boolean
}

const ChatContext = createContext<ChatContextValue>({ isReady: false })

export function ChatProvider({ children }: { children: ReactNode }) {
  const { profile, isLoading } = useAuth()
  const setCurrentUser = useChatStore((s) => s.setCurrentUser)

  useEffect(() => {
    if (profile) {
      setCurrentUser(profile)
    }
  }, [profile, setCurrentUser])

  return (
    <ChatContext.Provider value={{ isReady: !isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  return useContext(ChatContext)
}
