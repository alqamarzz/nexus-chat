import Link from 'next/link'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-[#111118] border border-[#1e1e2e] p-8 rounded-2xl">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Nexus Chat, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">2. Acceptable Use</h2>
            <p>
              Nexus is built for respectful, fast, and real-time communication. You agree not to transmit abusive, unlawful, or infringing content, nor attempt to circumvent platform access controls or rate limits.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">3. Accounts & Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Nexus implements secure sessions and cryptographic token storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white">4. Service Availability</h2>
            <p>
              We strive for 99.9% uptime with instant Supabase Realtime synchronization. Scheduled maintenance and updates will be communicated transparently.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
