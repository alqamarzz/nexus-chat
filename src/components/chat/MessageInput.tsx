'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, X, Image as ImageIcon, Sparkles } from 'lucide-react'
import { Message } from '@/types'

interface MessageInputProps {
  onSendMessage: (content: string, replyToId?: string, files?: File[]) => Promise<void>
  replyingTo: Message | null
  onCancelReply: () => void
  disabled?: boolean
  isAI?: boolean
}

export function MessageInput({
  onSendMessage,
  replyingTo,
  onCancelReply,
  disabled = false,
  isAI = false,
}: MessageInputProps) {
  const [content, setContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const EMOJIS = ['👋', '😊', '🚀', '🔥', '❤️', '🎉', '💯', '👍', '✨', '🙌', '🤖', '💡']

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [content])

  const handleSend = async () => {
    if ((!content.trim() && selectedFiles.length === 0) || disabled || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onSendMessage(content.trim(), replyingTo?.id, selectedFiles)
      setContent('')
      setSelectedFiles([])
      if (replyingTo) onCancelReply()
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji)
    setShowEmojiPicker(false)
    textareaRef.current?.focus()
  }

  return (
    <div className="relative border-t border-[#1e1e2e] bg-[#111118]/80 backdrop-blur-md px-4 py-3">
      {/* Reply Banner */}
      {replyingTo && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 mb-2 rounded-xl bg-[#181824] border border-indigo-500/20 text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="text-indigo-400 font-semibold shrink-0">
              Replying to {replyingTo.sender?.full_name || 'User'}:
            </span>
            <span className="truncate text-slate-400">{replyingTo.content}</span>
          </div>
          <button
            onClick={onCancelReply}
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Selected Attachments Preview */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1a1a28] border border-[#26263b] text-xs text-slate-200"
            >
              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-slate-400 hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-4 mb-2 p-2 rounded-xl bg-[#161622] border border-[#242436] shadow-2xl grid grid-cols-6 gap-1 z-30">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => addEmoji(emoji)}
              className="p-1.5 text-lg hover:bg-[#252538] rounded-lg transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input controls */}
      <div className="flex items-end gap-2 bg-[#0d0d14] border border-[#1e1e2e] focus-within:border-indigo-500/50 rounded-2xl px-3 py-2 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1a1a26] rounded-xl transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Emoji button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-[#1a1a26] rounded-xl transition-colors"
          title="Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAI ? 'Ask Nexus AI anything...' : 'Type a message...'}
          rows={1}
          disabled={disabled || isSubmitting}
          className="flex-1 bg-transparent border-0 text-slate-100 placeholder:text-slate-500 text-sm focus:ring-0 outline-none resize-none max-h-32 py-1 leading-5"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={(!content.trim() && selectedFiles.length === 0) || disabled || isSubmitting}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md shadow-indigo-500/20 shrink-0"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isAI ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
