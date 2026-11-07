'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus, Users, Check, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { Profile } from '@/types'
import { useChatStore } from '@/stores/chat-store'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const router = useRouter()
  const [tab, setTab] = useState<'dm' | 'group'>('dm')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Group state
  const [groupName, setGroupName] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const currentUser = useChatStore((s) => s.currentUser)
  const addConversation = useChatStore((s) => s.addConversation)

  useEffect(() => {
    if (!isOpen) {
      setSearch('')
      setSelectedUserIds([])
      setGroupName('')
      return
    }

    const searchUsers = async () => {
      setIsLoading(true)
      try {
        const supabase = createClient()
        let query = supabase
          .from('profiles')
          .select('*')
          .neq('id', currentUser?.id || '')
          .limit(20)

        if (search.trim()) {
          query = query.or(
            `username.ilike.%${search.trim()}%,full_name.ilike.%${search.trim()}%`
          )
        }

        const { data, error } = await query
        if (!error && data) {
          setUsers(data as Profile[])
        }
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(searchUsers, 200)
    return () => clearTimeout(timer)
  }, [isOpen, search, currentUser?.id])

  const startDM = async (otherUser: Profile) => {
    if (!currentUser) return
    setIsCreating(true)
    try {
      const supabase = createClient()

      // Call database function or insert directly
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'dm',
          created_by: currentUser.id,
        })
        .select()
        .single()

      if (convError || !convData) {
        throw new Error(convError?.message || 'Failed to create conversation')
      }

      // Add both members
      await supabase.from('conversation_members').insert([
        { conversation_id: convData.id, user_id: currentUser.id, role: 'owner' },
        { conversation_id: convData.id, user_id: otherUser.id, role: 'member' },
      ])

      onClose()
      router.push(`/chat/${convData.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not start conversation'
      toast.error(msg)
    } finally {
      setIsCreating(false)
    }
  }

  const createGroup = async () => {
    if (!currentUser) return
    if (!groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }
    if (selectedUserIds.length === 0) {
      toast.error('Select at least one member')
      return
    }

    setIsCreating(true)
    try {
      const supabase = createClient()
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'group',
          name: groupName.trim(),
          created_by: currentUser.id,
        })
        .select()
        .single()

      if (convError || !convData) {
        throw new Error(convError?.message || 'Failed to create group')
      }

      // Add creator as owner
      const membersToInsert = [
        { conversation_id: convData.id, user_id: currentUser.id, role: 'owner' },
        ...selectedUserIds.map((uid) => ({
          conversation_id: convData.id,
          user_id: uid,
          role: 'member',
        })),
      ]

      await supabase.from('conversation_members').insert(membersToInsert)

      toast.success('Group created!')
      onClose()
      router.push(`/chat/${convData.id}`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not create group'
      toast.error(msg)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start a Conversation" maxWidth="md">
      {/* Tabs */}
      <div className="flex border-b border-[#1e1e2e] mb-4">
        <button
          onClick={() => setTab('dm')}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors ${
            tab === 'dm'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Direct Message
        </button>
        <button
          onClick={() => setTab('group')}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 flex items-center justify-center gap-2 transition-colors ${
            tab === 'group'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          New Group
        </button>
      </div>

      {/* Group Details Input (if tab is group) */}
      {tab === 'group' && (
        <div className="mb-4">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name (e.g. Design Team)"
            className="w-full px-3.5 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 outline-none"
          />
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or username..."
          className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 outline-none"
        />
      </div>

      {/* Users List */}
      <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin my-2">
        {isLoading ? (
          <div className="text-center py-6 text-xs text-slate-500">Searching users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            {search ? 'No users found' : 'No contacts yet'}
          </div>
        ) : (
          users.map((u) => {
            const isSelected = selectedUserIds.includes(u.id)
            return (
              <div
                key={u.id}
                onClick={() => (tab === 'dm' ? startDM(u) : toggleSelectUser(u.id))}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-500/15 border border-indigo-500/30' : 'hover:bg-[#161622]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar_url} name={u.full_name || u.username} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {u.full_name || u.username}
                    </p>
                    <p className="text-xs text-slate-500">@{u.username}</p>
                  </div>
                </div>

                {tab === 'group' && (
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-[#2e2e42] bg-[#0a0a0f]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Group Create Button */}
      {tab === 'group' && (
        <div className="mt-4 pt-3 border-t border-[#1e1e2e] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {selectedUserIds.length} member{selectedUserIds.length === 1 ? '' : 's'} selected
          </span>
          <button
            onClick={createGroup}
            disabled={isCreating || !groupName.trim() || selectedUserIds.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm rounded-xl disabled:opacity-50 transition-all shadow-md shadow-indigo-500/20"
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      )}
    </Modal>
  )
}
