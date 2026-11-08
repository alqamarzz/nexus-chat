'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useChatStore } from '@/stores/chat-store'
import { useAuth } from '@/hooks/useAuth'
import { AuthTransitionScreen } from '@/components/ui/AuthTransitionScreen'

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

  if (isLoading) {
    return (
      <AuthTransitionScreen
        mode="login"
        title="Loading Nexus Chat..."
        subtitle="Connecting to encrypted realtime channels and restoring your workspace..."
      />
    )
  }

  return (
    <ChatContext.Provider value={{ isReady: true }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  return useContext(ChatContext)
}
