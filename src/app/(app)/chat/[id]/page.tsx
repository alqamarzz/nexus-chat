import { Suspense } from 'react'
import { ConversationView } from '@/components/chat/ConversationView'

export default function ChatDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 h-full flex items-center justify-center bg-[#0a0a0f] text-xs text-slate-500">
          Loading conversation...
        </div>
      }
    >
      <ConversationView />
    </Suspense>
  )
}
