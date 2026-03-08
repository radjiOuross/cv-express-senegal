
CREATE TABLE public.validators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  linkedin text NOT NULL UNIQUE,
  verified boolean NOT NULL DEFAULT true,
  avatar_url text
);

CREATE TABLE public.validation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  skill text NOT NULL,
  validator_id uuid REFERENCES public.validators(id),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id uuid REFERENCES public.cvs(id) ON DELETE CASCADE NOT NULL,
  validator_id uuid REFERENCES public.validators(id) NOT NULL,
  skill_validated text NOT NULL,
  comment text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.validators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read validators" ON public.validators FOR SELECT USING (true);
CREATE POLICY "Anyone can read validation_requests" ON public.validation_requests FOR SELECT USING (true);
CREATE POLICY "Anyone can insert validation_requests" ON public.validation_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update validation_requests" ON public.validation_requests FOR UPDATE USING (true);
CREATE POLICY "Anyone can read validations" ON public.validations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert validations" ON public.validations FOR INSERT WITH CHECK (true);

INSERT INTO public.validators (name, title, company, linkedin) VALUES
  ('A.D.', 'DRH', 'Orange Sénégal', 'https://linkedin.com/in/ad-orange'),
  ('M.T.', 'Directeur Tech', 'Wave', 'https://linkedin.com/in/mt-wave'),
  ('F.N.', 'CEO', 'Startup Dakar', 'https://linkedin.com/in/fn-startup'),
  ('I.S.', 'Recruteur', 'Sonatel', 'https://linkedin.com/in/is-sonatel'),
  ('K.B.', 'Directeur', 'Gainde 2000', 'https://linkedin.com/in/kb-gainde');
