'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, Sparkles, Send } from 'lucide-react'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setIsSent(true)
      toast.success('Password reset email sent!')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#111118]/80 backdrop-blur-xl border border-[#1e1e2e] shadow-2xl relative">
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Reset your password</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isSent
            ? 'Check your email for the recovery link'
            : 'Enter your email and we will send you a reset link'}
        </p>
      </div>

      {isSent ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <p className="text-xs text-indigo-300 leading-relaxed">
              We have dispatched a password recovery link to your inbox. Follow the instructions in the email to set a new password.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-xl bg-[#161622] hover:bg-[#1e1e2d] text-slate-200 text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-[#1e1e2e]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Reset Link
              </>
            )}
          </button>

          <Link
            href="/login"
            className="w-full py-2.5 text-xs text-center text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Sign In
          </Link>
        </form>
      )}
    </div>
  )
}
