'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Bot, Users, Paperclip, ShieldCheck, Moon } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-Time Messaging',
    description: 'Instant delivery, zero lag. Messages arrive the moment they\'re sent — powered by WebSockets.',
    color: 'from-yellow-400 to-orange-500',
    glow: 'rgba(234,179,8,0.15)',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Built-in Nexus AI powered by Gemini. Ask anything, generate content, debug code — right in chat.',
    color: 'from-indigo-400 to-cyan-500',
    glow: 'rgba(99,102,241,0.15)',
    span: 'col-span-1',
  },
  {
    icon: Users,
    title: 'Group Chats',
    description: 'Create rooms, invite your team, and collaborate at scale with organized channels.',
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16,185,129,0.15)',
    span: 'col-span-1',
  },
  {
    icon: Paperclip,
    title: 'File Sharing',
    description: 'Send images, documents, videos, and more with beautiful previews and instant access.',
    color: 'from-pink-400 to-rose-500',
    glow: 'rgba(236,72,153,0.15)',
    span: 'col-span-1',
  },
  {
    icon: ShieldCheck,
    title: 'End-to-End Security',
    description: 'Your privacy, guaranteed. All messages are encrypted and your data is never sold.',
    color: 'from-violet-400 to-purple-500',
    glow: 'rgba(139,92,246,0.15)',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: Moon,
    title: 'Beautiful Dark UI',
    description: 'Crafted for night owls. A cinematic dark interface that\'s easy on the eyes, day or night.',
    color: 'from-slate-400 to-blue-500',
    glow: 'rgba(100,116,139,0.15)',
    span: 'col-span-1',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" className="relative py-32 bg-transparent">
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              stay connected
            </span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Nexus combines powerful real-time communication with cutting-edge AI to give you an experience like no other.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`group relative rounded-2xl border border-[#1e1e2e] bg-[#111118] p-6 overflow-hidden cursor-default
                  hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 ${feat.span}`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${feat.glow}, transparent 70%)`,
                  }}
                />
                {/* Gradient border glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${feat.glow} 0%, transparent 60%)`,
                    pointerEvents: 'none',
                  }}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.color} mb-5 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{feat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
