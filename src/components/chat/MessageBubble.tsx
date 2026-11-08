'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck, Bot, FileText, Download, Smile, Trash2, Edit2, Reply } from 'lucide-react'
import { Message } from '@/types'
import { Avatar } from '@/components/ui/Avatar'
import { formatMessageTime, formatFileSize, isImageFile, isVideoFile } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  showSender?: boolean
  onReply?: (message: Message) => void
  onDelete?: (messageId: string) => void
  onEdit?: (messageId: string, content: string) => void
  onReact?: (messageId: string, emoji: string) => void
}

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '😂', '🎉', '🚀']

export function MessageBubble({
  message,
  isOwn,
  showSender = false,
  onReply,
  onDelete,
  onEdit,
  onReact,
}: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)

  const isDeleted = Boolean(message.deleted_at)
  const isAI = message.type === 'ai' || message.sender_id === 'nexus-ai'

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() && editContent !== message.content) {
      onEdit(message.id, editContent)
    }
    setIsEditing(false)
  }

  return (
    <div
      className={`group relative flex gap-3 my-2 px-2 transition-all ${
        isOwn ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Sender Avatar */}
      {(!isOwn || isAI) && (
        <div className="shrink-0 self-end mb-1">
          {isAI ? (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
          ) : (
            <Avatar
              src={message.sender?.avatar_url}
              name={message.sender?.full_name || message.sender?.username || 'User'}
              size="sm"
            />
          )}
        </div>
      )}

      {/* Message Content Container */}
      <div className={`relative max-w-[75%] sm:max-w-[65%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name in group */}
        {showSender && !isOwn && (
          <span className="text-[11px] font-medium text-indigo-400 mb-1 ml-1">
            {message.sender?.full_name || message.sender?.username}
          </span>
        )}

        {/* Reply To Preview */}
        {message.reply_to && (
          <div
            className={`text-xs px-3 py-1.5 mb-1 rounded-xl border border-[#1e1e2e] bg-[#16161f]/60 text-slate-400 flex items-center gap-2 max-w-full overflow-hidden ${
              isOwn ? 'rounded-br-none' : 'rounded-bl-none'
            }`}
          >
            <Reply className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-300 shrink-0">
              {message.reply_to.sender?.full_name || 'User'}:
            </span>
            <span className="truncate">{message.reply_to.content}</span>
          </div>
        )}

        {/* Main Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
            isOwn
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-xs'
              : isAI
              ? 'bg-[#151520] border border-indigo-500/30 text-slate-100 rounded-bl-xs shadow-indigo-500/5'
              : 'bg-[#181824] border border-[#222232] text-slate-100 rounded-bl-xs'
          }`}
        >
          {isDeleted ? (
            <span className="italic text-slate-400 text-xs flex items-center gap-1.5">
              This message was deleted
            </span>
          ) : isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="bg-black/30 border border-white/20 rounded px-2 py-1 text-sm text-white outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-1 text-xs">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 rounded text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Attachments */}
              {(() => {
                const attachments =
                  message.attachments && message.attachments.length > 0
                    ? message.attachments
                    : (message.metadata?.attachments as any[]) || []

                if (!attachments || attachments.length === 0) return null

                return (
                  <div className="mb-2 space-y-2">
                    {attachments.map((att: any, idx: number) => {
                      const isImg = isImageFile(att.mime_type, att.url || att.name)
                      const isVid = isVideoFile(att.mime_type, att.url || att.name)

                      return (
                        <div key={att.id || att.url || idx} className="overflow-hidden rounded-lg">
                          {isImg ? (
                            <a href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                              <img
                                src={att.url}
                                alt={att.name || 'Image'}
                                className="max-h-72 w-auto max-w-full rounded-lg object-contain bg-black/20 hover:opacity-95 transition-opacity"
                                loading="lazy"
                              />
                            </a>
                          ) : isVid ? (
                            <div className="rounded-lg overflow-hidden bg-black/40 max-w-full">
                              <video
                                src={att.url}
                                controls
                                preload="metadata"
                                playsInline
                                className="max-h-80 w-auto max-w-full rounded-lg"
                              />
                            </div>
                          ) : (
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
                            >
                              <FileText className="w-6 h-6 text-indigo-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">{att.name}</p>
                                <p className="text-[10px] text-slate-400">{formatFileSize(att.size || 0)}</p>
                              </div>
                              <Download className="w-4 h-4 text-slate-400" />
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {/* Text Content (hide if only a fallback filename placeholder for the attachment) */}
              {(() => {
                const attachments =
                  message.attachments && message.attachments.length > 0
                    ? message.attachments
                    : (message.metadata?.attachments as any[]) || []

                const shouldHideContent =
                  attachments.length > 0 &&
                  attachments.some(
                    (att: any) =>
                      att.name === message.content ||
                      message.content === 'Media attachment' ||
                      att.url === message.content
                  )

                if (!message.content || shouldHideContent) return null
                return <div className="whitespace-pre-wrap">{message.content}</div>
              })()}

              {/* Message Footer Info */}
              <div
                className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] select-none ${
                  isOwn ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {message.edited_at && <span className="text-[9px] opacity-80">(edited)</span>}
                <span>{formatMessageTime(message.created_at)}</span>
                {isOwn && (
                  <span>
                    <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Reactions List */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs bg-[#1a1a26] border border-[#262638] text-slate-200"
              >
                <span>{reaction.emoji}</span>
              </span>
            ))}
          </div>
        )}

        {/* Hover Actions Menu */}
        {!isDeleted && (
          <div
            className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 p-1 rounded-lg bg-[#181824] border border-[#2a2a3e] shadow-lg z-10 ${
              isOwn ? 'right-0 -translate-x-4' : 'left-0 translate-x-4'
            }`}
          >
            {/* Quick Emoji Reaction */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252538] transition-colors"
                title="React"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>

              {showReactions && (
                <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 p-1 bg-[#1c1c2b] border border-[#2a2a3e] rounded-xl shadow-xl z-20">
                  {QUICK_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact?.(message.id, emoji)
                        setShowReactions(false)
                      }}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reply */}
            <button
              type="button"
              onClick={() => onReply?.(message)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252538] transition-colors"
              title="Reply"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            {/* Edit (Own only) */}
            {isOwn && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#252538] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete (Own only) */}
            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete?.(message.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-[#252538] transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
