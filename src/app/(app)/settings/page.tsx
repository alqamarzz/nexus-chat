'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Palette,
  Bell,
  Shield,
  Save,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus1',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus2',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus3',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=nexus6',
]

export default function SettingsPage() {
  const router = useRouter()
  const { profile, signOut } = useAuth()

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'account'>('profile')

  // Form states
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Appearance & notifications toggles
  const [theme, setTheme] = useState('dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [readReceipts, setReadReceipts] = useState(true)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setUsername(profile.username || '')
      setBio(profile.bio || '')
      setStatusMessage(profile.status_message || '')
      setSelectedAvatar(profile.avatar_url || AVATAR_PRESETS[0])
    }
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          bio: bio.trim(),
          status_message: statusMessage.trim(),
          avatar_url: selectedAvatar,
        })
        .eq('id', profile.id)

      if (error) {
        throw new Error(error.message)
      }

      toast.success('Profile updated successfully!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0a0a0f] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.push('/chat')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#161622] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
            <p className="text-xs text-slate-400">Manage your profile, theme, and chat preferences</p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 p-1 bg-[#12121b] border border-[#1e1e2e] rounded-2xl mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'appearance'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            Appearance
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeTab === 'account'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Account
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e2e] space-y-6">
              <h2 className="text-base font-semibold text-slate-100">Personal Information</h2>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <Avatar src={selectedAvatar} name={fullName || username || 'U'} size="lg" />
                  <div className="flex flex-wrap gap-2">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(preset)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedAvatar === preset
                            ? 'border-indigo-500 scale-105 shadow-md shadow-indigo-500/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 outline-none"
                  placeholder="Your Name"
                />
              </div>

              {/* Username (read-only) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">@</span>
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full pl-8 pr-3.5 py-2.5 bg-[#0e0e14] border border-[#1e1e2e] text-slate-400 rounded-xl text-sm cursor-not-allowed outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Username cannot be changed after registration</p>
              </div>

              {/* Status Message */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Status Message</label>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 outline-none"
                  placeholder="e.g. In a meeting / Coding Next.js"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#0a0a0f] border border-[#1e1e2e] focus:border-indigo-500 rounded-xl text-sm text-slate-100 outline-none resize-none"
                  placeholder="Tell others a little about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Appearance */}
        {activeTab === 'appearance' && (
          <div className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e2e] space-y-6">
            <h2 className="text-base font-semibold text-slate-100">Theme Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'dark', label: 'Dark Obsidian', desc: 'Deep indigo & pure darkness' },
                { id: 'oled', label: 'True Black', desc: 'Optimized for OLED displays' },
                { id: 'midnight', label: 'Midnight Blue', desc: 'Subtle slate blue tones' },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setTheme(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    theme === item.id
                      ? 'bg-indigo-500/10 border-indigo-500'
                      : 'bg-[#0a0a0f] border-[#1e1e2e] hover:border-[#2e2e42]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                    {theme === item.id && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e2e] space-y-6">
            <h2 className="text-base font-semibold text-slate-100">Notifications & Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <div>
                  <p className="text-sm font-medium text-slate-200">Message Sounds</p>
                  <p className="text-xs text-slate-400">Play sound effect on incoming messages</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <div>
                  <p className="text-sm font-medium text-slate-200">Read Receipts</p>
                  <p className="text-xs text-slate-400">Let others know when you have read their messages</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReadReceipts(!readReceipts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    readReceipts ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      readReceipts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Account */}
        {activeTab === 'account' && (
          <div className="p-6 rounded-2xl bg-[#111118] border border-[#1e1e2e] space-y-6">
            <h2 className="text-base font-semibold text-slate-100">Account Credentials</h2>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <p className="text-xs text-slate-400">User ID</p>
                <p className="text-xs font-mono text-slate-200 mt-0.5">{profile?.id || 'N/A'}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e]">
                <p className="text-xs text-slate-400">Registered Username</p>
                <p className="text-xs font-mono text-slate-200 mt-0.5">@{profile?.username}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1e1e2e]">
              <button
                onClick={() => signOut().then(() => router.push('/login'))}
                className="px-4 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
              >
                Sign Out of Nexus
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
