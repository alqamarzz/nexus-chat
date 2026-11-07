import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium mb-8 p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Nexus Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Privacy & Security Policy</h1>
            <p className="text-xs text-slate-400">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-[#111118] border border-[#1e1e2e] p-8 rounded-2xl">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Information We Collect</h2>
            <p>
              When you register on Nexus, we collect your display name, username, email address, and avatar choice.
              Your authentication is securely managed using industry-standard cryptography via Supabase Auth.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Message Privacy & Row-Level Security</h2>
            <p>
              All direct messages and group conversations are strictly governed by PostgreSQL Row-Level Security (RLS) policies.
              Only verified members of a conversation can read or post messages. Neither third parties nor non-members can access your private data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Nexus AI & LLM Processing</h2>
            <p>
              Conversations directed to the Nexus AI bot are processed securely using Google Gemini 1.5 Flash. We do not use your private human-to-human chats to train public machine learning models.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Your Rights</h2>
            <p>
              You can modify your profile details, update your status, or sign out at any time from your Nexus Settings panel.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
