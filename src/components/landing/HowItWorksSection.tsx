'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, Search, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email or Google account. No credit card required, ever.',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    number: '02',
    icon: Search,
    title: 'Find Your People',
    description: 'Search for users by name, create group channels, or start an AI-powered conversation with Nexus AI.',
    color: 'from-violet-500 to-pink-600',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Start Connecting',
    description: 'Send messages, share files, go real-time with video, and let AI supercharge your conversations.',
    color: 'from-cyan-500 to-indigo-600',
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how-it-works" className="relative py-32 bg-[#0a0a0f]">
      {/* Background accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <span className="inline-block text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get started in{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            From sign-up to your first conversation in under two minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[16.5%] right-[16.5%] h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full origin-left"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
              }}
            />
            {/* Dots on connector */}
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left"
                >
                  {/* Number + Icon badge */}
                  <div className="relative mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className={`absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center`}
                    >
                      <span className="text-[10px] font-black text-white">{i + 1}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
