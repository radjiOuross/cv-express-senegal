-- =============================================
-- DUMP SQL COMPLET - Base de données
-- =============================================

-- 1. TABLE: cvs
CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL DEFAULT ''::text,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_data JSONB,
  template TEXT NOT NULL DEFAULT 'classique'::text,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_public BOOLEAN NOT NULL DEFAULT true,
  show_email BOOLEAN NOT NULL DEFAULT false,
  show_phone BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  video_script TEXT,
  profile_slug TEXT UNIQUE
);

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read CVs" ON public.cvs FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert CVs" ON public.cvs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can update their own CVs" ON public.cvs FOR UPDATE TO public USING (auth.uid() = user_id);

-- 2. TABLE: profile_views
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert profile_views" ON public.profile_views FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read profile_views" ON public.profile_views FOR SELECT TO public USING (true);

-- 3. TABLE: validators
CREATE TABLE public.validators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  linkedin TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT
);

ALTER TABLE public.validators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read validators" ON public.validators FOR SELECT TO public USING (true);

-- 4. TABLE: validation_requests
CREATE TABLE public.validation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  validator_id UUID REFERENCES public.validators(id),
  status TEXT NOT NULL DEFAULT 'pending'::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.validation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert validation_requests" ON public.validation_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read validation_requests" ON public.validation_requests FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can update validation_requests" ON public.validation_requests FOR UPDATE TO public USING (true);

-- 5. TABLE: validations
CREATE TABLE public.validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cv_id UUID NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  validator_id UUID NOT NULL REFERENCES public.validators(id),
  skill_validated TEXT NOT NULL,
  comment TEXT DEFAULT ''::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert validations" ON public.validations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can read validations" ON public.validations FOR SELECT TO public USING (true);

-- 6. STORAGE
-- Bucket: video-cvs (public)
