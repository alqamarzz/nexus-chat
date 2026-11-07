-- ============================================================================
-- Nexus Chat — Initial Database Schema (Fixed & Fully Ordered)
-- Migration: 001_initial_schema.sql
-- ============================================================================
-- Order of Execution:
--   1. Extensions
--   2. Table Definitions (All DDLs created before any dependent policies)
--      • profiles
--      • conversations
--      • conversation_members
--      • messages
--      • message_reactions
--      • file_attachments
--   3. Indexes
--   4. Helper Functions for RLS (SECURITY DEFINER to avoid RLS recursion)
--   5. Row Level Security (RLS) Policies
--   6. Business Logic Triggers & Functions
--   7. Supabase Realtime Configuration
--   8. Storage Buckets & Policies
-- ============================================================================

-- ─── 1. EXTENSIONS ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLE DEFINITIONS (Created in strict topological dependency order)
-- ============================================================================

-- ─── 2a. PROFILES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT        NOT NULL UNIQUE,
  full_name       TEXT        NOT NULL DEFAULT '',
  avatar_url      TEXT,
  bio             TEXT,
  status_message  TEXT,
  is_online       BOOLEAN     NOT NULL DEFAULT FALSE,
  last_seen       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT username_length    CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format    CHECK (username ~ '^[a-zA-Z0-9_]+$'),
  CONSTRAINT full_name_length   CHECK (char_length(full_name) <= 100),
  CONSTRAINT bio_length         CHECK (char_length(bio) <= 500),
  CONSTRAINT status_msg_length  CHECK (char_length(status_message) <= 150)
);

-- ─── 2b. CONVERSATIONS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT        NOT NULL CHECK (type IN ('dm', 'group')),
  name        TEXT,
  description TEXT,
  avatar_url  TEXT,
  created_by  UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT group_name_required CHECK (
    type = 'dm' OR (type = 'group' AND name IS NOT NULL AND char_length(name) >= 1)
  ),
  CONSTRAINT name_length         CHECK (char_length(name) <= 100),
  CONSTRAINT description_length  CHECK (char_length(description) <= 500)
);

-- ─── 2c. CONVERSATION MEMBERS ────────────────────────────────────────────────
-- Created BEFORE any policies or triggers on conversations or messages
CREATE TABLE IF NOT EXISTS public.conversation_members (
  conversation_id  UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES public.profiles(id)      ON DELETE CASCADE,
  role             TEXT        NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at     TIMESTAMPTZ,

  PRIMARY KEY (conversation_id, user_id)
);

-- ─── 2d. MESSAGES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  UUID        NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id        UUID        REFERENCES public.profiles(id)               ON DELETE SET NULL,
  content          TEXT        NOT NULL DEFAULT '',
  type             TEXT        NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'ai')),
  metadata         JSONB,
  reply_to_id      UUID        REFERENCES public.messages(id)              ON DELETE SET NULL,
  edited_at        TIMESTAMPTZ,
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT content_not_empty CHECK (
    deleted_at IS NOT NULL OR char_length(content) > 0
  )
);

-- ─── 2e. MESSAGE REACTIONS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id)  ON DELETE CASCADE,
  emoji       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (message_id, user_id, emoji),
  CONSTRAINT emoji_not_empty CHECK (char_length(emoji) >= 1 AND char_length(emoji) <= 8)
);

-- ─── 2f. FILE ATTACHMENTS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.file_attachments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  UUID        NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  name        TEXT        NOT NULL,
  size        BIGINT      NOT NULL CHECK (size >= 0),
  mime_type   TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT url_not_empty       CHECK (char_length(url) > 0),
  CONSTRAINT name_not_empty      CHECK (char_length(name) > 0),
  CONSTRAINT mime_type_not_empty CHECK (char_length(mime_type) > 0)
);

-- ============================================================================
-- 3. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS conversations_created_by_idx ON public.conversations(created_by);
CREATE INDEX IF NOT EXISTS conv_members_user_id_idx ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS conv_members_conversation_id_idx ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_created_at_idx ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_reply_to_id_idx ON public.messages(reply_to_id);
CREATE INDEX IF NOT EXISTS message_reactions_message_id_idx ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS message_reactions_user_id_idx ON public.message_reactions(user_id);
CREATE INDEX IF NOT EXISTS file_attachments_message_id_idx ON public.file_attachments(message_id);

-- ============================================================================
-- 4. SECURITY DEFINER HELPER FUNCTIONS (Prevents RLS Infinite Recursion)
-- ============================================================================

-- Check if user is a member of a conversation without triggering RLS checks
CREATE OR REPLACE FUNCTION public.is_conversation_member(
  _conversation_id UUID,
  _user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = _conversation_id
      AND user_id = _user_id
  );
$$;

-- Get user's role in a conversation without triggering RLS checks
CREATE OR REPLACE FUNCTION public.get_conversation_role(
  _conversation_id UUID,
  _user_id UUID DEFAULT auth.uid()
)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.conversation_members
  WHERE conversation_id = _conversation_id
    AND user_id = _user_id
  LIMIT 1;
$$;

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- ─── 5a. PROFILES POLICIES ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── 5b. CONVERSATIONS POLICIES ──────────────────────────────────────────────
-- Members can view the conversation, OR the creator can view it right after insert
DROP POLICY IF EXISTS "conversations_select_member" ON public.conversations;
DROP POLICY IF EXISTS "conversations_select" ON public.conversations;
CREATE POLICY "conversations_select"
  ON public.conversations FOR SELECT
  USING (
    created_by = auth.uid()
    OR public.is_conversation_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "conversations_insert_authenticated" ON public.conversations;
CREATE POLICY "conversations_insert_authenticated"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "conversations_update_admin" ON public.conversations;
CREATE POLICY "conversations_update_admin"
  ON public.conversations FOR UPDATE
  USING (
    created_by = auth.uid()
    OR public.get_conversation_role(id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "conversations_delete_owner" ON public.conversations;
CREATE POLICY "conversations_delete_owner"
  ON public.conversations FOR DELETE
  USING (
    created_by = auth.uid()
    OR public.get_conversation_role(id, auth.uid()) = 'owner'
  );

-- ─── 5c. CONVERSATION MEMBERS POLICIES ───────────────────────────────────────
-- Avoids infinite recursion by using user_id check + SECURITY DEFINER function
DROP POLICY IF EXISTS "conv_members_select_member" ON public.conversation_members;
CREATE POLICY "conv_members_select_member"
  ON public.conversation_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_conversation_member(conversation_id, auth.uid())
  );

DROP POLICY IF EXISTS "conv_members_insert" ON public.conversation_members;
CREATE POLICY "conv_members_insert"
  ON public.conversation_members FOR INSERT
  WITH CHECK (
    -- User can add themselves
    user_id = auth.uid()
    -- OR user created this conversation
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.created_by = auth.uid()
    )
    -- OR user is an admin/owner of this conversation
    OR public.get_conversation_role(conversation_id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "conv_members_update" ON public.conversation_members;
CREATE POLICY "conv_members_update"
  ON public.conversation_members FOR UPDATE
  USING (
    user_id = auth.uid()
    OR public.get_conversation_role(conversation_id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "conv_members_delete" ON public.conversation_members;
CREATE POLICY "conv_members_delete"
  ON public.conversation_members FOR DELETE
  USING (
    user_id = auth.uid()
    OR public.get_conversation_role(conversation_id, auth.uid()) IN ('owner', 'admin')
  );

-- ─── 5d. MESSAGES POLICIES ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "messages_select_member" ON public.messages;
CREATE POLICY "messages_select_member"
  ON public.messages FOR SELECT
  USING (
    public.is_conversation_member(conversation_id, auth.uid())
  );

DROP POLICY IF EXISTS "messages_insert_member" ON public.messages;
CREATE POLICY "messages_insert_member"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND public.is_conversation_member(conversation_id, auth.uid())
  );

DROP POLICY IF EXISTS "messages_update_sender" ON public.messages;
CREATE POLICY "messages_update_sender"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

DROP POLICY IF EXISTS "messages_delete_sender" ON public.messages;
CREATE POLICY "messages_delete_sender"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- ─── 5e. MESSAGE REACTIONS POLICIES ──────────────────────────────────────────
DROP POLICY IF EXISTS "reactions_select_member" ON public.message_reactions;
CREATE POLICY "reactions_select_member"
  ON public.message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
        AND public.is_conversation_member(m.conversation_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "reactions_insert_member" ON public.message_reactions;
CREATE POLICY "reactions_insert_member"
  ON public.message_reactions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
        AND public.is_conversation_member(m.conversation_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "reactions_delete_own" ON public.message_reactions;
CREATE POLICY "reactions_delete_own"
  ON public.message_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- ─── 5f. FILE ATTACHMENTS POLICIES ───────────────────────────────────────────
DROP POLICY IF EXISTS "attachments_select_member" ON public.file_attachments;
CREATE POLICY "attachments_select_member"
  ON public.file_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
        AND public.is_conversation_member(m.conversation_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "attachments_insert_sender" ON public.file_attachments;
CREATE POLICY "attachments_insert_sender"
  ON public.file_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
        AND m.sender_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "attachments_delete_sender" ON public.file_attachments;
CREATE POLICY "attachments_delete_sender"
  ON public.file_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      WHERE m.id = message_id
        AND m.sender_id = auth.uid()
    )
  );

-- ============================================================================
-- 6. BUSINESS LOGIC TRIGGERS & FUNCTIONS
-- ============================================================================

-- ─── 6a. Auto-create profile on user signup ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _username TEXT;
BEGIN
  _username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );

  -- Sanitize username characters
  _username := regexp_replace(_username, '[^a-zA-Z0-9_]', '_', 'g');
  IF char_length(_username) < 3 THEN
    _username := _username || '_user';
  END IF;
  IF char_length(_username) > 25 THEN
    _username := substr(_username, 1, 25);
  END IF;

  -- Ensure uniqueness by appending suffix if taken
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = _username) THEN
    _username := substr(_username, 1, 24) || '_' || substr(md5(random()::text), 1, 5);
  END IF;

  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    _username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', _username),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 6b. Update conversations.updated_at on new message ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_message_inserted ON public.messages;
CREATE TRIGGER on_message_inserted
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- ─── 6c. User presence update ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_user_presence(
  p_user_id   UUID,
  p_is_online BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET is_online = p_is_online,
      last_seen = CASE WHEN NOT p_is_online THEN NOW() ELSE last_seen END
  WHERE id = p_user_id;
END;
$$;

-- ─── 6d. Get conversations for user (with unread count, last_msg, members) ───
CREATE OR REPLACE FUNCTION public.get_conversations_for_user(p_user_id UUID)
RETURNS TABLE (
  id              UUID,
  type            TEXT,
  name            TEXT,
  description     TEXT,
  avatar_url      TEXT,
  created_by      UUID,
  created_at      TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ,
  unread_count    BIGINT,
  last_message    JSONB,
  members         JSONB
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.type,
    c.name,
    c.description,
    c.avatar_url,
    c.created_by,
    c.created_at,
    c.updated_at,
    (
      SELECT COUNT(*)
      FROM public.messages m2
      WHERE m2.conversation_id = c.id
        AND m2.deleted_at IS NULL
        AND m2.sender_id <> p_user_id
        AND (
          my_membership.last_read_at IS NULL
          OR m2.created_at > my_membership.last_read_at
        )
    ) AS unread_count,
    (
      SELECT row_to_json(lm.*)::JSONB
      FROM (
        SELECT
          m.id, m.conversation_id, m.sender_id, m.content, m.type,
          m.metadata, m.reply_to_id, m.edited_at, m.deleted_at, m.created_at,
          row_to_json(p.*)::JSONB AS sender
        FROM public.messages m
        JOIN public.profiles p ON p.id = m.sender_id
        WHERE m.conversation_id = c.id
          AND m.deleted_at IS NULL
        ORDER BY m.created_at DESC
        LIMIT 1
      ) lm
    ) AS last_message,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'conversation_id', cm2.conversation_id,
          'user_id',         cm2.user_id,
          'role',            cm2.role,
          'joined_at',       cm2.joined_at,
          'last_read_at',    cm2.last_read_at,
          'profile',         row_to_json(p2.*)::JSONB
        )
      )
      FROM public.conversation_members cm2
      JOIN public.profiles p2 ON p2.id = cm2.user_id
      WHERE cm2.conversation_id = c.id
    ) AS members
  FROM public.conversations c
  JOIN public.conversation_members my_membership
    ON my_membership.conversation_id = c.id
   AND my_membership.user_id = p_user_id
  ORDER BY c.updated_at DESC;
END;
$$;

-- ─── 6e. Get paginated messages for a conversation ────────────────────────────
CREATE OR REPLACE FUNCTION public.get_messages_for_conversation(
  p_conversation_id UUID,
  p_limit           INT         DEFAULT 50,
  p_before          TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id               UUID,
  conversation_id  UUID,
  sender_id        UUID,
  content          TEXT,
  type             TEXT,
  metadata         JSONB,
  reply_to_id      UUID,
  reply_to         JSONB,
  edited_at        TIMESTAMPTZ,
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ,
  sender           JSONB,
  reactions        JSONB,
  attachments      JSONB
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_conversation_member(p_conversation_id, auth.uid()) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    m.id,
    m.conversation_id,
    m.sender_id,
    m.content,
    m.type,
    m.metadata,
    m.reply_to_id,
    (
      SELECT row_to_json(rt.*)::JSONB
      FROM (
        SELECT rm.id, rm.sender_id, rm.content, rm.type, rm.created_at,
               row_to_json(rp.*)::JSONB AS sender
        FROM public.messages rm
        JOIN public.profiles rp ON rp.id = rm.sender_id
        WHERE rm.id = m.reply_to_id
      ) rt
    ) AS reply_to,
    m.edited_at,
    m.deleted_at,
    m.created_at,
    row_to_json(p.*)::JSONB AS sender,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id',         mr.id,
            'message_id', mr.message_id,
            'user_id',    mr.user_id,
            'emoji',      mr.emoji,
            'created_at', mr.created_at,
            'profile',    row_to_json(rp2.*)::JSONB
          )
        )
        FROM public.message_reactions mr
        JOIN public.profiles rp2 ON rp2.id = mr.user_id
        WHERE mr.message_id = m.id
      ),
      '[]'::JSONB
    ) AS reactions,
    COALESCE(
      (
        SELECT jsonb_agg(row_to_json(fa.*)::JSONB)
        FROM public.file_attachments fa
        WHERE fa.message_id = m.id
      ),
      '[]'::JSONB
    ) AS attachments
  FROM public.messages m
  JOIN public.profiles p ON p.id = m.sender_id
  WHERE m.conversation_id = p_conversation_id
    AND (p_before IS NULL OR m.created_at < p_before)
  ORDER BY m.created_at DESC
  LIMIT p_limit;
END;
$$;

-- ─── 6f. Create DM conversation (idempotent) ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_dm_conversation(
  p_other_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _existing_id UUID;
  _new_id      UUID;
BEGIN
  SELECT c.id INTO _existing_id
  FROM public.conversations c
  WHERE c.type = 'dm'
    AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = c.id AND cm.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = c.id AND cm.user_id = p_other_user_id
    )
  LIMIT 1;

  IF _existing_id IS NOT NULL THEN
    RETURN _existing_id;
  END IF;

  INSERT INTO public.conversations (type, created_by)
  VALUES ('dm', auth.uid())
  RETURNING id INTO _new_id;

  INSERT INTO public.conversation_members (conversation_id, user_id, role)
  VALUES
    (_new_id, auth.uid(),       'member'),
    (_new_id, p_other_user_id,  'member');

  RETURN _new_id;
END;
$$;

-- ─── 6g. Create Group conversation ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.create_group_conversation(
  p_name        TEXT,
  p_description TEXT,
  p_member_ids  UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _new_id UUID;
  _uid    UUID;
BEGIN
  INSERT INTO public.conversations (type, name, description, created_by)
  VALUES ('group', p_name, p_description, auth.uid())
  RETURNING id INTO _new_id;

  INSERT INTO public.conversation_members (conversation_id, user_id, role)
  VALUES (_new_id, auth.uid(), 'owner');

  FOREACH _uid IN ARRAY p_member_ids LOOP
    IF _uid <> auth.uid() THEN
      INSERT INTO public.conversation_members (conversation_id, user_id, role)
      VALUES (_new_id, _uid, 'member')
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  RETURN _new_id;
END;
$$;

-- ─── 6h. Mark conversation read ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.mark_conversation_read(
  p_conversation_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversation_members
  SET last_read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND user_id = auth.uid();
END;
$$;

-- ============================================================================
-- 7. REALTIME CONFIGURATION
-- ============================================================================
-- Enable full replica identity so updates and deletes broadcast all columns
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_members REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Idempotently add tables to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversation_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'message_reactions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
  WHEN duplicate_object THEN
    NULL;
END $$;

-- ============================================================================
-- 8. STORAGE BUCKETS & STORAGE POLICIES
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  TRUE,
  5242880,   -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  FALSE,
  52428800,  -- 50 MB
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- ─── Storage RLS: avatars ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "avatars_select_public" ON storage.objects;
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;
CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
  );

-- ─── Storage RLS: attachments ─────────────────────────────────────────────────
DROP POLICY IF EXISTS "attachments_select_authenticated" ON storage.objects;
CREATE POLICY "attachments_select_authenticated"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "attachments_insert_authenticated" ON storage.objects;
CREATE POLICY "attachments_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "attachments_delete_own" ON storage.objects;
CREATE POLICY "attachments_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'attachments'
    AND auth.role() = 'authenticated'
  );

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
