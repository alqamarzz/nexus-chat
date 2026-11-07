import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Nexus Chat',
    template: '%s | Nexus Chat',
  },
  description:
    'Real-time messaging with AI superpowers. Connect with friends, teams, and your personal AI assistant in one place.',
  keywords: ['chat', 'messaging', 'AI', 'real-time', 'collaboration'],
  authors: [{ name: 'Nexus Chat' }],
  creator: 'Nexus Chat',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Nexus Chat',
    description:
      'Real-time messaging with AI superpowers.',
    siteName: 'Nexus Chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus Chat',
    description: 'Real-time messaging with AI superpowers.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            },
          }}
        />
      </body>
    </html>
  )
}
