'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is Nexus free to use?',
    answer:
      'Yes! Nexus has a generous free tier that includes 1:1 direct messages, up to 100 messages per day, and 100MB of storage. You can upgrade to Pro or Team for more features and higher limits.',
  },
  {
    question: 'How does the AI assistant work?',
    answer:
      'Nexus AI is powered by Google Gemini. You can open a dedicated AI chat or mention it in any conversation with @NexusAI. It can help with coding, writing, analysis, creative tasks, and much more — with full context of your conversation.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. All messages are encrypted in transit using TLS 1.3, and sensitive data is encrypted at rest. We never sell your data or use it to train AI models. Your privacy is non-negotiable.',
  },
  {
    question: 'Can I use Nexus on mobile?',
    answer:
      'Nexus works beautifully on all devices through the web browser. Native iOS and Android apps are currently in development and will be available soon. Stay tuned for announcements!',
  },
  {
    question: 'How many people can be in a group chat?',
    answer:
      'On the Free plan, group chats are not available. Pro users can create group chats with up to 50 members. Team plan users can have up to 500 members per channel with advanced moderation tools.',
  },
  {
    question: 'What file types can I share?',
    answer:
      'You can share images (PNG, JPG, GIF, WebP), documents (PDF, DOCX, XLSX, PPTX), code files, archives (ZIP, RAR), and videos (MP4, WebM) up to your plan\'s storage limit. Files are previewed inline when possible.',
  },
  {
    question: 'Can I export my chat history?',
    answer:
      'Yes! Pro and Team users can export their full chat history in JSON or CSV format from the account settings. Free users can export the last 30 days of messages. Data exports are delivered as a downloadable archive.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-indigo-500/30 transition-colors"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-[#111118] hover:bg-[#111118]/80 transition-colors"
        aria-expanded={open}
      >
        <span className="text-slate-900 dark:text-white font-semibold text-sm sm:text-base">{faq.question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${open ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-gray-500'}`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 pt-1 bg-[#111118]">
              <div className="h-px bg-[#1e1e2e] mb-4" />
              <p className="text-slate-700 dark:text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative py-32 bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Frequently asked{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg">
            Everything you need to know about Nexus.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.question} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
