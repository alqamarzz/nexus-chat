'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '\$0',
    period: 'forever',
    description: 'Perfect for personal use and trying out Nexus.',
    features: [
      '1:1 Direct Messages',
      '100 messages / day',
      '100MB storage',
      'Basic AI access',
      'Web & desktop app',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlighted: false,
    gradient: null,
  },
  {
    name: 'Pro',
    price: '\$9',
    period: 'per month',
    description: 'Everything you need for power users and creators.',
    features: [
      'Everything in Free',
      'Group chats & channels',
      'Unlimited messages',
      '10GB storage',
      'Full Nexus AI access',
      'Priority delivery',
    ],
    cta: 'Start Pro Trial',
    href: '/register?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Team',
    price: '\$29',
    period: 'per month',
    description: 'Built for teams that need control and scale.',
    features: [
      'Everything in Pro',
      'Up to 25 members',
      'Admin controls & roles',
      '100GB storage',
      'Priority support',
      'Usage analytics',
    ],
    cta: 'Get Team Plan',
    href: '/register?plan=team',
    highlighted: false,
    gradient: null,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-32 bg-[#0a0a0f]">
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
          <span className="inline-block text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-4">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              pricing
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: plan.highlighted ? 1.03 : 1.02 }}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-[#111118] border-2 border-transparent'
                  : 'bg-[#111118] border border-[#1e1e2e] hover:border-indigo-500/30'
              }`}
              style={
                plan.highlighted
                  ? {
                      backgroundImage:
                        'linear-gradient(#111118, #111118), linear-gradient(135deg, #6366f1, #8b5cf6)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                      boxShadow: '0 0 40px rgba(99,102,241,0.2)',
                    }
                  : undefined
              }
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className={`text-4xl font-black ${plan.highlighted ? 'bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent' : 'text-white'}`}>
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                      plan.highlighted ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-[#1e1e2e]'
                    }`}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm text-center transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/30'
                    : 'border border-[#1e1e2e] text-white hover:bg-white/5 hover:border-white/20'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
