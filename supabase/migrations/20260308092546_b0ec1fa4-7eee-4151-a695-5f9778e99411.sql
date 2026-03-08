CREATE TABLE public.cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_data JSONB,
  template TEXT NOT NULL DEFAULT 'classique',
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert CVs" ON public.cvs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read CVs" ON public.cvs FOR SELECT USING (true);