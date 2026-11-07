# ⚡ Nexus Chat — Fullstack Real-Time Chat & AI Platform

> **Where conversations connect.** Built with Next.js 15 (App Router), TypeScript, Supabase Realtime & Auth, Tailwind CSS, and Google Gemini AI.

---

## 🌟 Highlights & Features

### 🎨 Cinematic Landing Page (Scrolltide & Modern SaaS Inspired)
- **Hero Section**: Animated gradient mesh background, high-contrast typography, interactive mock chat demo with live-feeling messages, and smooth CTAs.
- **Features Bento Grid**: 6 feature highlights (Real-time WebSockets, AI Assistant, Group Rooms, Rich Media, Privacy & RLS, Night-Owl Dark UI).
- **How It Works**: 3-step animated onboarding pipeline with connected paths.
- **Nexus AI Spotlight**: Interactive demo preview showcasing Gemini-powered conversational intelligence with typewriter effects.
- **Pricing Matrix**: 3-tier plans (Free, Pro with popular badge, Team) with hover scale dynamics.
- **FAQ Accordion**: 7 interactive collapsible answers addressing common questions.
- **Conversion CTA**: Full-width gradient banner and studio-grade footer with quick links and newsletter signup.

---

### 💬 Fullstack Chat Application
- **Direct Messaging (1-on-1)**: Instant real-time messaging with live typing indicator, timestamp, read receipts, and sound toggles.
- **Group Chats**: Create channels, invite teammates, and manage members.
- **Nexus AI Assistant**: Built-in AI companion powered by Google Gemini 1.5 Flash (`/chat/ai`), providing smart recommendations, code assistance, and conversation generation.
- **Message Interactions**:
  - Emoji reactions (👍, ❤️, 🔥, 😂, 🎉, 🚀)
  - Message replies with contextual quotes
  - Message editing & deletion
  - Image & file uploads
- **Presence & Profiles**: Live online status indicators, custom avatars, bio, and status messages.
- **Settings Suite**:
  - Profile customization & avatar presets
  - Appearance themes (Dark Obsidian, True Black OLED, Midnight Blue)
  - Notification sounds and privacy toggles

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 + `clsx` + `tailwind-merge` |
| **Animations** | Framer Motion |
| **Database & Realtime** | Supabase (PostgreSQL with Row Level Security) + Supabase Realtime |
| **Authentication** | Supabase Auth (Email/Password + Google OAuth) |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) |
| **Icons** | Lucide React |
| **State Management** | Zustand (with devtools middleware) |
| **Forms & Validation** | React Hook Form + Zod |
| **Notifications** | Sonner |

---

## 📁 Project Structure

```
connect/
├── src/
│   ├── app/
│   │   ├── (landing)/
│   │   │   ├── layout.tsx             # Clean landing layout
│   │   │   └── page.tsx               # Scrolltide-inspired landing page
│   │   ├── (auth)/
│   │   │   ├── layout.tsx             # Glassmorphism auth shell
│   │   │   ├── login/page.tsx         # Sign in with email or Google
│   │   │   └── register/page.tsx      # Sign up with avatar selector
│   │   ├── (app)/
│   │   │   ├── layout.tsx             # Chat app shell + sidebar
│   │   │   ├── chat/
│   │   │   │   ├── page.tsx           # Empty state & welcome hub
│   │   │   │   └── [id]/page.tsx      # Live conversation view (DMs & AI)
│   │   │   └── settings/page.tsx      # Profile, Theme, Notifications
│   │   └── api/
│   │       ├── ai/route.ts            # Gemini 1.5 Flash assistant route
│   │       └── upload/route.ts        # Supabase storage attachment handler
│   ├── components/
│   │   ├── landing/                   # 9 modular landing sections
│   │   ├── chat/                      # Sidebar, MessageBubble, Input, Modals
│   │   └── ui/                        # Button, Avatar, Modal, Input, Spinner
│   ├── context/                       # ChatContext provider
│   ├── hooks/                         # useAuth, useConversations, useMessages
│   ├── lib/                           # Supabase clients & utility helpers
│   ├── stores/                        # Zustand global chat store
│   └── types/                         # Strict TypeScript definitions
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql     # Full database schema & RLS policies
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local` and add your Supabase and Gemini keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Migration
In your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**, run the entire contents of:
[`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/alkam/OneDrive/Documents/CRUD/connect/supabase/migrations/001_initial_schema.sql)

This script sets up:
- `profiles`, `conversations`, `conversation_members`, `messages`, `message_reactions`, `file_attachments` tables
- Complete Row-Level-Security (RLS) policies
- Automated profile creation triggers upon auth signup
- Real-time subscriptions for instant synchronization
- Storage bucket configuration for avatars & attachments

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application!
- **Landing Page**: `http://localhost:3000/`
- **Sign In**: `http://localhost:3000/login`
- **Sign Up**: `http://localhost:3000/register`
- **Chat App**: `http://localhost:3000/chat`
- **Nexus AI**: `http://localhost:3000/chat/ai`
- **Settings**: `http://localhost:3000/settings`

### 5. Production Build
```bash
npm run build
npm run start
```
