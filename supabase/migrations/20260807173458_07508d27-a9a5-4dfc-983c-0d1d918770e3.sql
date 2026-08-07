
CREATE TABLE public.briefings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'Novo',
  full_name TEXT NOT NULL,
  brand_name TEXT,
  instagram_handle TEXT,
  website TEXT,
  niche TEXT,
  contact TEXT,
  main_need TEXT,
  needs_details TEXT,
  post_frequency TEXT,
  team_structure TEXT,
  reference_links TEXT,
  budget_range TEXT,
  currency TEXT,
  timeline TEXT,
  files JSONB NOT NULL DEFAULT '[]'::jsonb,
  audio_url TEXT
);

GRANT INSERT ON public.briefings TO anon, authenticated;
GRANT ALL ON public.briefings TO service_role;
ALTER TABLE public.briefings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a briefing" ON public.briefings FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  client_name TEXT NOT NULL,
  tax_id TEXT,
  monthly_investment TEXT,
  currency TEXT,
  deliverables TEXT,
  duration_months INTEGER,
  start_date DATE,
  notes TEXT
);

GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
