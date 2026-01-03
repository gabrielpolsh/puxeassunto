-- ============================================
-- SCRIPT FINAL - CORREÇÃO COMPLETA
-- Execute TODO este script no SQL Editor do Supabase
-- ============================================

-- 1. Criar tabela de debug
CREATE TABLE IF NOT EXISTS debug_log (
  id serial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT NOW(),
  message text,
  data jsonb
);
ALTER TABLE debug_log DISABLE ROW LEVEL SECURITY;

-- 2. Limpar logs antigos
DELETE FROM debug_log;

-- 3. Dropar trigger antigo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Criar função CORRIGIDA (usando FOUND ao invés de IS NOT NULL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  pending_record RECORD;
  subscription_end timestamp with time zone;
  normalized_email text;
BEGIN
  -- Normalizar email do novo usuário
  normalized_email := LOWER(TRIM(COALESCE(NEW.email, '')));
  
  -- LOG 1: Trigger iniciou
  INSERT INTO debug_log (message, data) VALUES (
    'TRIGGER STARTED',
    jsonb_build_object('user_id', NEW.id, 'email', NEW.email, 'normalized', normalized_email)
  );
  
  -- Verificar se existe compra pendente para este email
  SELECT * INTO pending_record
  FROM public.pending_purchases
  WHERE LOWER(TRIM(email)) = normalized_email
    AND claimed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  -- LOG 2: Resultado da busca
  INSERT INTO debug_log (message, data) VALUES (
    'PENDING SEARCH RESULT',
    jsonb_build_object(
      'email', normalized_email, 
      'sql_found', FOUND,
      'pending_id', pending_record.id,
      'pending_email', pending_record.email,
      'plan_type', pending_record.plan_type
    )
  );

  -- CORREÇÃO PRINCIPAL: Usar FOUND (variável especial do PostgreSQL)
  -- Em PL/pgSQL, uma variável RECORD nunca é NULL, apenas seus campos ficam NULL
  IF FOUND AND pending_record.id IS NOT NULL THEN
    -- Calcular data de expiração baseado no plano
    subscription_end := NOW() + (pending_record.duration_months || ' months')::interval;
    
    -- LOG 3: Vai criar como PRO
    INSERT INTO debug_log (message, data) VALUES (
      'CREATING PRO PROFILE',
      jsonb_build_object('user_id', NEW.id, 'plan', pending_record.plan_type, 'expires', subscription_end)
    );
    
    -- Criar profile já como PRO
    INSERT INTO public.profiles (id, email, is_pro, plan_type, subscription_end_date, subscription_status)
    VALUES (
      NEW.id, 
      NEW.email, 
      true, 
      pending_record.plan_type,
      subscription_end,
      'approved'
    );
    
    -- Marcar compra como resgatada
    UPDATE public.pending_purchases
    SET claimed_at = NOW(), claimed_by = NEW.id
    WHERE id = pending_record.id;
    
    -- LOG 4: Sucesso
    INSERT INTO debug_log (message, data) VALUES (
      'PRO PROFILE CREATED SUCCESS',
      jsonb_build_object('user_id', NEW.id, 'email', NEW.email, 'plan', pending_record.plan_type)
    );
  ELSE
    -- LOG 5: Vai criar como free
    INSERT INTO debug_log (message, data) VALUES (
      'CREATING FREE PROFILE',
      jsonb_build_object('user_id', NEW.id, 'email', NEW.email, 'reason', 'no pending purchase found')
    );
    
    -- Criar profile normal (free)
    INSERT INTO public.profiles (id, email, is_pro)
    VALUES (NEW.id, NEW.email, false);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- LOG ERROR
    INSERT INTO debug_log (message, data) VALUES (
      'TRIGGER ERROR',
      jsonb_build_object('error', SQLERRM, 'state', SQLSTATE, 'user_id', NEW.id, 'email', NEW.email)
    );
    
    -- Tentar criar profile básico se ainda não existe
    BEGIN
      INSERT INTO public.profiles (id, email, is_pro)
      VALUES (NEW.id, NEW.email, false)
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        INSERT INTO debug_log (message, data) VALUES ('FALLBACK ALSO FAILED', jsonb_build_object('error', SQLERRM));
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Criar trigger novo
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Garantir que tabela pending_purchases existe
CREATE TABLE IF NOT EXISTS pending_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  sale_id text NOT NULL UNIQUE,
  plan_type text NOT NULL DEFAULT 'monthly',
  duration_months integer NOT NULL DEFAULT 1,
  price numeric(10,2),
  payload jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  claimed_at timestamp with time zone,
  claimed_by uuid REFERENCES profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_pending_purchases_email ON pending_purchases(email);
ALTER TABLE pending_purchases ENABLE ROW LEVEL SECURITY;

-- 7. Limpar dados de teste do hectorgamer
DELETE FROM profiles WHERE email = 'hectorgamer13@hotmail.com';
UPDATE pending_purchases SET claimed_at = NULL, claimed_by = NULL WHERE email = 'hectorgamer13@hotmail.com';

-- 8. Mostrar estado final
SELECT '=== PENDING PURCHASES ===' as info;
SELECT email, plan_type, duration_months, claimed_at FROM pending_purchases WHERE claimed_at IS NULL ORDER BY created_at DESC;

SELECT '=== TRIGGER STATUS ===' as info;
SELECT tgname, tgenabled FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass AND tgname = 'on_auth_user_created';

SELECT '=== PRONTO! Agora crie a conta com hectorgamer13@hotmail.com ===' as info;
