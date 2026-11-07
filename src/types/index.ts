// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  status_message: string | null
  is_online: boolean
  last_seen: string
  created_at: string
}

export interface Conversation {
  id: string
  type: 'dm' | 'group'
  name: string | null
  description: string | null
  avatar_url: string | null
  created_by: string
  created_at: string
  members: ConversationMember[]
  last_message: Message | null
  unread_count: number
}

export interface ConversationMember {
  conversation_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  last_read_at: string | null
  profile: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  type: 'text' | 'image' | 'file' | 'ai'
  metadata: Record<string, any> | null
  reply_to_id: string | null
  reply_to: Message | null
  edited_at: string | null
  deleted_at: string | null
  created_at: string
  sender: Profile
  reactions: MessageReaction[]
  attachments: FileAttachment[]
}

export interface MessageReaction {
  id: string
  message_id: string
  user_id: string
  emoji: string
  created_at: string
  profile: Profile
}

export interface FileAttachment {
  id: string
  message_id: string
  url: string
  name: string
  size: number
  mime_type: string
  created_at: string
}

// ─── Payload Types ─────────────────────────────────────────────────────────────

export type SendMessagePayload = {
  conversation_id: string
  content: string
  type?: Message['type']
  reply_to_id?: string | null
  metadata?: Record<string, any> | null
  attachments?: Array<Omit<FileAttachment, 'id' | 'message_id' | 'created_at'>>
}

export type CreateConversationPayload = {
  type: 'dm' | 'group'
  name?: string | null
  description?: string | null
  avatar_url?: string | null
  member_ids: string[]
}

export type UpdateProfilePayload = {
  username?: string
  full_name?: string
  avatar_url?: string | null
  bio?: string | null
  status_message?: string | null
}
