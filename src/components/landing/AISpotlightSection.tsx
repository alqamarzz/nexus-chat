'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, PenLine, BarChart3, Wand2 } from 'lucide-react';

const aiMessages = [
  { from: 'user', text: 'Can you write a Python function to sort a list by frequency?' },
  {
    from: 'ai',
    text: 'Sure! Here\'s a clean solution:\n```python\nfrom collections import Counter\n\ndef sort_by_freq(lst):\n    count = Counter(lst)\n    return sorted(lst, key=lambda x: -count[x])\n```\nThis preserves order among equal-frequency items.',
  },
  { from: 'user', text: 'Perfect! Now explain it like I\'m 10.' },
  {
    from: 'ai',
    text: 'Imagine you have a bag of marbles 🎱. We first count how many of each colour you have, then put them back in order — most common colour first! That\'s exactly what this code does.',
  },
];

const capabilities = [
  { icon: Code, label: 'Code help', desc: 'Debug, explain, and generate code in any language' },
  { icon: PenLine, label: 'Writing', desc: 'Draft emails, essays, summaries, and creative content' },
  { icon: BarChart3, label: 'Analysis', desc: 'Analyze data, documents, and complex topics' },
  { icon: Wand2, label: 'Creative tasks', desc: 'Brainstorm ideas, roleplay, and explore possibilities' },
];

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        onDone();
      }
    }, 18);
    return () => clearInterval(timer);
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayed}<span className="animate-pulse">▋</span></span>;
}

export default function AISpotlightSection() {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<typeof aiMessages>([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setVisibleMessages([]);
    setCurrentMsg(0);
    setTyping(false);
    const timer = setTimeout(() => addNextMessage(0), 500);
    return () => clearTimeout(timer);
  }, []);

  function addNextMessage(idx: number) {
    if (idx >= aiMessages.length) {
      // Loop after delay
      setTimeout(() => {
        setVisibleMessages([]);
        setTimeout(() => addNextMessage(0), 500);
      }, 3000);
      return;
    }
    const msg = aiMessages[idx];
    if (msg.from === 'user') {
      setVisibleMessages((prev) => [...prev, msg]);
      setTimeout(() => addNextMessage(idx + 1), 800);
    } else {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setVisibleMessages((prev) => [...prev, msg]);
        setTimeout(() => addNextMessage(idx + 1), 1200);
      }, msg.text.length * 15 + 400);
    }
  }

  return (
    <section id="ai-spotlight" className="relative py-32 bg-[#0a0a0f] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Nexus AI
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Meet{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Nexus AI
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Your always-on AI companion, powered by Gemini. Available in every conversation, 
              ready to assist with anything — from writing and coding to analysis and creative brainstorming.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {capabilities.map((cap) => {
                const Icon = cap.icon;
                return (
                  <div
                    key={cap.label}
                    className="flex items-start gap-3 p-4 rounded-xl border border-[#1e1e2e] bg-[#111118] hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{cap.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: AI Chat Demo */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Glow behind */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2), transparent 70%)',
                transform: 'scale(0.9) translateY(20px)',
              }}
            />

            <div className="relative rounded-2xl border border-[#1e1e2e] bg-[#111118] overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(99,102,241,0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e2e] bg-[#0d0d14]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Nexus AI</p>
                  <p className="text-xs text-emerald-400">● Always available</p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 min-h-[320px] max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {visibleMessages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.from === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.from === 'user'
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm'
                            : 'bg-[#1e1e2e] text-gray-200 rounded-bl-sm'
                        }`}
                      >
                        {msg.from === 'ai' && i === visibleMessages.length - 1 ? (
                          <TypewriterText text={msg.text} onDone={() => {}} />
                        ) : (
                          <span className="whitespace-pre-wrap">{msg.text}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div className="px-4 py-2.5 rounded-2xl bg-[#1e1e2e] flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-500"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
