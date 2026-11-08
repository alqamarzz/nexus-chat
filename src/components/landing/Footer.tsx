'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { BeanBagCoder } from '@/components/ui/BeanBagCoder';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'AI Assistant', href: '#ai-spotlight' },
  ],
  Company: [
    { label: 'About Nexus', href: '#hero' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Community', href: '#features' },
    { label: 'Support', href: '#faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security & RLS', href: '/privacy' },
    { label: 'Cookie Policy', href: '/terms' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const id = href.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-transparent border-t border-stone-300 dark:border-[#1e1e2e] overflow-hidden transition-colors duration-500">
      {/* Background warm lamp ambient glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand & Bean Bag Nap Character column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 group mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-slate-900 dark:text-white font-bold text-2xl tracking-tight">Nexus</span>
              </Link>
              <p className="text-slate-600 dark:text-gray-500 text-sm leading-relaxed mb-4 max-w-xs font-medium">
                For the ones who ship between naps. Real-time messaging and AI superpowers in one cozy app.
              </p>
            </div>

            {/* Scrolltide Bean Bag Nap Animated Coder */}
            <div className="my-2">
              <BeanBagCoder size="sm" showStickyNote={true} stickyText="Shipping... between naps." />
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-stone-300 dark:border-[#1e1e2e] bg-stone-100 dark:bg-[#111118] flex items-center justify-center text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:border-indigo-500/40 transition-all duration-200"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl border border-stone-300 dark:border-[#1e1e2e] bg-stone-100 dark:bg-[#111118] flex items-center justify-center text-slate-600 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:border-indigo-500/40 transition-all duration-200"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="text-sm text-slate-600 dark:text-gray-500 hover:text-slate-950 dark:hover:text-gray-300 transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 dark:text-gray-500 hover:text-slate-950 dark:hover:text-gray-300 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter (Bean Bag Nap "Wake me for updates" style) */}
          <div className="lg:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-semibold text-base mb-1">Wake me for updates</h4>
            <p className="text-slate-600 dark:text-gray-500 text-sm mb-4 leading-relaxed">
              Release notes, new features, and the occasional thought from our sleepy but dedicated team.
            </p>
            {submitted ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm">
                ✓ You&apos;re subscribed! We will wake you when new features drop.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white dark:bg-[#111118] border border-stone-300 dark:border-[#1e1e2e] text-slate-900 dark:text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#171513] text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 shadow-md"
                  aria-label="Subscribe"
                >
                  <span className="text-white dark:text-black">Subscribe</span>
                  <ArrowRight className="w-4 h-4 text-white dark:text-black" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1e1e2e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Nexus Chat. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Built with ❤️ using Next.js, Tailwind CSS & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
