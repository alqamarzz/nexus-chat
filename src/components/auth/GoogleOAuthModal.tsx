'use client'

import React, { useState } from 'react'
import { Sparkles, ExternalLink, X, ShieldAlert, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface GoogleOAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessRedirect: (email: string) => void
}

export function GoogleOAuthModal({
  isOpen,
  onClose,
  onSuccessRedirect,
}: GoogleOAuthModalProps) {
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  if (!isOpen) return null

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true)
    try {
      const res = await fetch('/api/auth/google-demo', {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize Google test account')
      }

      toast.success('Signed in with Google test profile!')
      onSuccessRedirect(data.email || 'google.user@nexuschat.io')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Demo sign in failed'
      toast.error(message)
      setIsDemoLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111118] border border-[#222232] shadow-2xl p-6 sm:p-7 text-slate-100 overflow-hidden">
        {/* Glow blob */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c1c2a] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Google OAuth Setup Required</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Google Sign-In is not enabled in your Supabase project dashboard yet.
            </p>
          </div>
        </div>

        {/* Instructions box */}
        <div className="space-y-3 bg-[#0c0c12] border border-[#1e1e2e] rounded-xl p-4 text-xs text-slate-300 mb-5 leading-relaxed">
          <p className="font-semibold text-indigo-300">To enable real Google OAuth:</p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
            <li>
              Go to <span className="text-white font-mono">Supabase Dashboard &rarr; Authentication &rarr; Providers</span>
            </li>
            <li>
              Enable <span className="text-white font-medium">Google provider</span>
            </li>
            <li>
              Paste your Google Cloud <span className="text-white font-medium">Client ID</span> & <span className="text-white font-medium">Client Secret</span>
            </li>
            <li>
              Set redirect URL to:
              <div className="mt-1 p-2 rounded bg-[#161622] font-mono text-[11px] text-cyan-300 select-all break-all">
                https://jvfxowcxxqstgqjjtctp.supabase.co/auth/v1/callback
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={isDemoLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-violet-700 disabled:opacity-50 transition-all"
          >
            {isDemoLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-300" />
            )}
            Continue with Google Demo Profile
          </button>

          <a
            href="https://supabase.com/dashboard/project/jvfxowcxxqstgqjjtctp/auth/providers"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-[#28283c] bg-[#161622] px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-[#1e1e30] hover:text-white transition-colors"
          >
            <span>Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
