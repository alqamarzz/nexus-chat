'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

// ─── Schema ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

// ─── Icons ────────────────────────────────────────────────────────────────────

function NexusLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Nexus Chat logo">
      <defs>
        <linearGradient id="nexus-login-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#nexus-login-grad)" />
      <path
        d="M12 28L20 12L28 28M15.5 22H24.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw error
      toast.success('Welcome back!')
      router.push('/chat')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in with Google'
      toast.error(message)
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-slide-up">
      {/* Card */}
      <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <NexusLogo />
          </div>
          <h1 className="text-2xl font-bold text-[#f8fafc]">Welcome back</h1>
          <p className="mt-1 text-sm text-[#94a3b8]">Sign in to your Nexus account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[#94a3b8]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg border bg-[#16161f] px-4 py-2.5 text-sm text-[#f8fafc] placeholder:text-[#64748b] outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 ${
                errors.email ? 'border-red-500/70' : 'border-[#1e1e2e]'
              }`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#94a3b8]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#6366f1] hover:text-[#818cf8] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-[#16161f] px-4 py-2.5 pr-11 text-sm text-[#f8fafc] placeholder:text-[#64748b] outline-none transition-colors focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 ${
                  errors.password ? 'border-red-500/70' : 'border-[#1e1e2e]'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition-all hover:from-[#4f46e5] hover:to-[#7c3aed] hover:shadow-indigo-900/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#1e1e2e]" />
          <span className="text-xs text-[#64748b]">or continue with</span>
          <div className="h-px flex-1 bg-[#1e1e2e]" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#1e1e2e] bg-[#16161f] px-4 py-2.5 text-sm font-medium text-[#f8fafc] transition-all hover:border-[#6366f1]/40 hover:bg-[#1e1e2e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <span className="h-4 w-4 rounded-full border-2 border-[#94a3b8]/30 border-t-[#94a3b8] animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-[#94a3b8]">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-[#6366f1] hover:text-[#818cf8] transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
