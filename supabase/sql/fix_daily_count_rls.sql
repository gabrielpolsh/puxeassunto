-- Fix RLS for daily_count table
-- Esta tabela provavelmente foi criada sem RLS

-- 1. Habilitar RLS na tabela
ALTER TABLE public.daily_count ENABLE ROW LEVEL SECURITY;

-- 2. Criar política para usuários só verem seus próprios dados
CREATE POLICY "Users can view own daily_count"
  ON public.daily_count FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily_count"
  ON public.daily_count FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily_count"
  ON public.daily_count FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily_count"
  ON public.daily_count FOR DELETE
  USING (auth.uid() = user_id);

-- ALTERNATIVA: Se a tabela não tiver coluna user_id e for usada apenas internamente
-- você pode simplesmente bloquear acesso direto:
-- 
-- CREATE POLICY "No direct access to daily_count"
--   ON public.daily_count FOR ALL
--   USING (false);
--
-- E usar SECURITY DEFINER nas functions que precisam acessar
