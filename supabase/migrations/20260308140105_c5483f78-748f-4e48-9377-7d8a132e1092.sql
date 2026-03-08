
-- Add new columns to cvs table
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS profile_public boolean NOT NULL DEFAULT true;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS show_email boolean NOT NULL DEFAULT false;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS show_phone boolean NOT NULL DEFAULT false;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS video_script text;
ALTER TABLE public.cvs ADD COLUMN IF NOT EXISTS profile_slug text UNIQUE;

-- Create profile_views table
CREATE TABLE public.profile_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  referrer text
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert profile views (anonymous tracking)
CREATE POLICY "Anyone can insert profile_views" ON public.profile_views FOR INSERT WITH CHECK (true);
-- Anyone can read profile views
CREATE POLICY "Anyone can read profile_views" ON public.profile_views FOR SELECT USING (true);

-- Create video-cvs storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('video-cvs', 'video-cvs', true, 104857600, ARRAY['video/webm', 'video/mp4']);

-- Allow anyone to upload to video-cvs bucket (authenticated users)
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'video-cvs');
-- Allow anyone to read videos
CREATE POLICY "Anyone can read videos" ON storage.objects FOR SELECT USING (bucket_id = 'video-cvs');
-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'video-cvs');
