ALTER TABLE public.cvs ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX idx_cvs_user_id ON public.cvs(user_id);
CREATE POLICY "Users can update their own CVs" ON public.cvs FOR UPDATE USING (auth.uid() = user_id);