import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Conversation, Message, Profile } from '@/types'

// ─── State & Actions Interface ─────────────────────────────────────────────────

interface ChatState {
  // ── Data ──────────────────────────────────────────────────────────────────
  conversations: Conversation[]
  activeConversationId: string | null
  messages: Record<string, Message[]>
  currentUser: Profile | null

  // ── UI Flags ──────────────────────────────────────────────────────────────
  isLoadingMessages: boolean
  isSidebarOpen: boolean

  // ── Conversation Actions ───────────────────────────────────────────────────
  setConversations: (conversations: Conversation[]) => void
  addConversation: (conversation: Conversation) => void
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void
  removeConversation: (conversationId: string) => void
  setActiveConversation: (id: string | null) => void
  updateConversationLastMessage: (conversationId: string, message: Message) => void
  markConversationAsRead: (conversationId: string) => void

  // ── Message Actions ────────────────────────────────────────────────────────
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  prependMessages: (conversationId: string, messages: Message[]) => void

  // ── User Actions ───────────────────────────────────────────────────────────
  setCurrentUser: (user: Profile | null) => void

  // ── UI Actions ────────────────────────────────────────────────────────────
  setIsLoadingMessages: (loading: boolean) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // ── Derived / Selectors (helpers) ─────────────────────────────────────────
  getActiveConversation: () => Conversation | undefined
  getMessages: (conversationId: string) => Message[]
  getTotalUnreadCount: () => number
}

// ─── Store Implementation ──────────────────────────────────────────────────────

export const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────
      conversations: [],
      activeConversationId: null,
      messages: {},
      currentUser: null,
      isLoadingMessages: false,
      isSidebarOpen: true,

      // ── Conversation Actions ─────────────────────────────────────────────
      setConversations: (conversations) => set({ conversations }, false, 'setConversations'),

      addConversation: (conversation) =>
        set(
          (state) => ({
            conversations: [conversation, ...state.conversations],
          }),
          false,
          'addConversation'
        ),

      updateConversation: (conversationId, updates) =>
        set(
          (state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, ...updates } : c
            ),
          }),
          false,
          'updateConversation'
        ),

      removeConversation: (conversationId) =>
        set(
          (state) => ({
            conversations: state.conversations.filter((c) => c.id !== conversationId),
            activeConversationId:
              state.activeConversationId === conversationId
                ? null
                : state.activeConversationId,
          }),
          false,
          'removeConversation'
        ),

      setActiveConversation: (id) => set({ activeConversationId: id }, false, 'setActiveConversation'),

      updateConversationLastMessage: (conversationId, message) =>
        set(
          (state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, last_message: message } : c
            ),
          }),
          false,
          'updateConversationLastMessage'
        ),

      markConversationAsRead: (conversationId) =>
        set(
          (state) => ({
            conversations: state.conversations.map((c) =>
              c.id === conversationId ? { ...c, unread_count: 0 } : c
            ),
          }),
          false,
          'markConversationAsRead'
        ),

      // ── Message Actions ──────────────────────────────────────────────────
      setMessages: (conversationId, messages) =>
        set(
          (state) => ({
            messages: { ...state.messages, [conversationId]: messages },
          }),
          false,
          'setMessages'
        ),

      addMessage: (conversationId, message) =>
        set(
          (state) => ({
            messages: {
              ...state.messages,
              [conversationId]: [...(state.messages[conversationId] || []), message],
            },
          }),
          false,
          'addMessage'
        ),

      updateMessage: (conversationId, messageId, updates) =>
        set(
          (state) => ({
            messages: {
              ...state.messages,
              [conversationId]: (state.messages[conversationId] || []).map((m) =>
                m.id === messageId ? { ...m, ...updates } : m
              ),
            },
          }),
          false,
          'updateMessage'
        ),

      deleteMessage: (conversationId, messageId) =>
        set(
          (state) => ({
            messages: {
              ...state.messages,
              [conversationId]: (state.messages[conversationId] || []).map((m) =>
                m.id === messageId ? { ...m, deleted_at: new Date().toISOString() } : m
              ),
            },
          }),
          false,
          'deleteMessage'
        ),

      prependMessages: (conversationId, messages) =>
        set(
          (state) => ({
            messages: {
              ...state.messages,
              [conversationId]: [...messages, ...(state.messages[conversationId] || [])],
            },
          }),
          false,
          'prependMessages'
        ),

      // ── User Actions ─────────────────────────────────────────────────────
      setCurrentUser: (user) => set({ currentUser: user }, false, 'setCurrentUser'),

      // ── UI Actions ───────────────────────────────────────────────────────
      setIsLoadingMessages: (loading) =>
        set({ isLoadingMessages: loading }, false, 'setIsLoadingMessages'),

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'toggleSidebar'),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }, false, 'setSidebarOpen'),

      // ── Derived Selectors ─────────────────────────────────────────────────
      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId)
      },

      getMessages: (conversationId) => {
        return get().messages[conversationId] || []
      },

      getTotalUnreadCount: () => {
        return get().conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)
      },
    }),
    { name: 'nexus-chat-store' }
  )
)
