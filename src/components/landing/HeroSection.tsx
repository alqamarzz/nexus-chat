'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, MessageCircle, Zap } from 'lucide-react';
import { BeanBagCoder } from '@/components/ui/BeanBagCoder';

const fakeContacts = [
  { name: 'Sarah K.', color: 'from-pink-500 to-rose-500', lastMsg: 'Hey! Are you free later?', time: '2m' },
  { name: 'Nexus AI', color: 'from-indigo-500 to-cyan-500', lastMsg: 'Sure! I can help with that.', time: '5m', isAI: true },
  { name: 'Dev Team', color: 'from-emerald-500 to-teal-500', lastMsg: 'Sprint review at 3pm!', time: '1h' },
];

const fakeMessages = [
  { from: 'other', text: 'Hey! Just pushed the new design 🎨', name: 'Sarah' },
  { from: 'me', text: 'Looks incredible! Love the dark theme.', name: 'You' },
  { from: 'other', text: 'Thanks! Nexus AI helped me refine the color palette 🤖', name: 'Sarah' },
  { from: 'me', text: 'That\'s so cool. This app is game-changing 🚀', name: 'You' },
  { from: 'other', text: 'Right?! Real-time + AI = 🔥', name: 'Sarah' },
];

function ParticleDot({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-indigo-400/40"
      style={{ left: x, top: y }}
      animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
      transition={{ duration: 3 + delay, repeat: Infinity, delay }}
    />
  );
}

const particles = Array.from({ length: 24 }, (_, i) => ({
  x: `${Math.round(((i * 37 + 11) % 97))}%`,
  y: `${Math.round(((i * 53 + 7) % 90))}%`,
  delay: (i * 0.3) % 3,
}));

export default function HeroSection() {
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-transparent">
        <motion.div
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 15, 0], y: [0, 25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <ParticleDot key={i} x={p.x} y={p.y} delay={p.delay} />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8"
        >
          <Zap className="w-3.5 h-3.5" />
          Powered by Gemini AI
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6"
        >
          Chat That Moves{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-600 dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">
            At The Speed Of Thought
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl text-lg sm:text-xl text-slate-700 dark:text-gray-400 mb-10 leading-relaxed"
        >
          Real-time messaging, AI-powered conversations, and seamless collaboration — all in one beautiful app.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-12"
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-white">Start Chatting Free</span>
          </Link>
          <button
            onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-900 dark:text-white border border-slate-900/25 dark:border-white/20 bg-white/70 dark:bg-transparent hover:border-slate-900/40 dark:hover:border-white/40 hover:bg-white dark:hover:bg-white/5 transition-all duration-200 backdrop-blur-sm shadow-xs"
          >
            See How It Works
          </button>
        </motion.div>

        {/* Bean Bag Nap Coder Featured in Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-14 w-full flex justify-center"
        >
          <BeanBagCoder size="md" showStickyNote={true} stickyText="Compiling... myself." />
        </motion.div>

        {/* Chat Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          ref={previewRef}
          className="w-full max-w-4xl rounded-2xl border border-[#1e1e2e] bg-[#111118] shadow-2xl shadow-black/60 overflow-hidden"
          style={{
            boxShadow: '0 0 80px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d14]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center justify-center">
              <span className="text-[10px] text-gray-500">app.nexuschat.io</span>
            </div>
          </div>

          <div className="flex h-80">
            {/* Sidebar */}
            <div className="w-64 border-r border-[#1e1e2e] bg-[#0d0d14] flex flex-col">
              <div className="px-3 py-3 border-b border-[#1e1e2e]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-xs text-gray-500">🔍 Search...</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-2 space-y-1">
                {fakeContacts.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      i === 0 ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                      {c.isAI ? (
                        <Sparkles className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-[10px] font-bold text-white">{c.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{c.name}</span>
                        <span className="text-[10px] text-gray-500">{c.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{c.lastMsg}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">S</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Sarah K.</p>
                  <p className="text-[10px] text-emerald-400">● Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-hidden p-3 space-y-2">
                {fakeMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-1.5 rounded-2xl text-[11px] leading-relaxed ${
                        msg.from === 'me'
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm'
                          : 'bg-[#1e1e2e] text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input bar */}
              <div className="px-3 py-2 border-t border-[#1e1e2e]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1e1e2e]">
                  <span className="text-[10px] text-gray-500 flex-1">Type a message…</span>
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                    <span className="text-[8px] text-white">↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-12 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-600">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
