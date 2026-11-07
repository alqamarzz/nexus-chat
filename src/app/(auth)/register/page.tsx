'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Lock, Sparkles, Check, ArrowRight } from 'lucide-react'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be under 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus6',
]

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

export default function RegisterPage() {
  const router = useRouter()
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0])
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
            avatar_url: selectedAvatar,
          },
        },
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      // Check if user profile was created or create/update it
      if (authData.user) {
        await supabase.from('profiles').upsert({
          id: authData.user.id,
          full_name: data.fullName,
          username: data.username.toLowerCase(),
          avatar_url: selectedAvatar,
          is_online: true,
          last_seen: new Date().toISOString(),
        })
      }

      // Check if session was returned or email confirmation is needed
      if (!authData.session) {
        toast.success('Account created! Please check your email inbox to verify your account, then sign in.')
        router.push('/login')
      } else {
        toast.success('Account created successfully! Welcome to Nexus.')
        router.push('/chat')
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error(error.message)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-up failed'
      toast.error(message)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-[#111118]/80 backdrop-blur-xl border border-[#1e1e2e] shadow-2xl relative">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">Create an account</h1>
        <p className="text-sm text-slate-400 mt-1">Join the next-generation chat platform</p>
      </div>

      <button
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading || isLoading}
        type="button"
        className="w-full py-2.5 px-4 rounded-xl border border-[#1e1e2e] bg-[#16161f] hover:bg-[#1f1f2e] text-slate-200 font-medium text-sm flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
      >
        <GoogleIcon />
        {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#1e1e2e]"></div>
        </div>
        <span className="relative px-3 text-xs uppercase tracking-wider text-slate-500 bg-[#111118]">
          Or register with email
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar Selection */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Choose Avatar</label>
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
            {AVATAR_OPTIONS.map((avatar, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(avatar)}
                className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedAvatar === avatar
                    ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                {selectedAvatar === avatar && (
                  <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('fullName')}
              placeholder="Alex Johnson"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
          {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono">@</span>
            <input
              {...register('username')}
              placeholder="alexj"
              className="w-full pl-9 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
          {errors.username && <p className="text-xs text-rose-500 mt-1">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="alex@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-colors"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-500 mt-1">{errors.confirmPassword.message}</p>
          )}
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
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  )
}
