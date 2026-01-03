-- EXECUTE ISSO NO SQL EDITOR DO SUPABASE
-- Vai criar uma tabela de log e atualizar o trigger para logar tudo

-- 1. Criar tabela de debug
CREATE TABLE IF NOT EXISTS debug_log (
  id serial PRIMARY KEY,
  created_at timestamp with time zone DEFAULT NOW(),
  message text,
  data jsonb
);

-- 2. Permitir que o trigger escreva nela
ALTER TABLE debug_log DISABLE ROW LEVEL SECURITY;

-- 3. Atualizar a função com logs na tabela
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
      'found', FOUND,
      'pending_id', pending_record.id,
      'pending_email', pending_record.email,
      'plan_type', pending_record.plan_type
    )
  );

  -- CORREÇÃO: Usar FOUND ao invés de IS NOT NULL
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
      jsonb_build_object('user_id', NEW.id, 'email', NEW.email)
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

-- 4. Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Limpar profile antigo e resetar pending para testar
DELETE FROM profiles WHERE email = 'hectorgamer13@hotmail.com';
UPDATE pending_purchases SET claimed_at = NULL, claimed_by = NULL WHERE email = 'hectorgamer13@hotmail.com';

-- 6. Mostrar estado atual
SELECT 'PENDING:' as tipo, email, plan_type, claimed_at FROM pending_purchases WHERE email ILIKE '%hectorgamer%'
UNION ALL
SELECT 'PROFILE:' as tipo, email, CASE WHEN is_pro THEN 'PRO' ELSE 'FREE' END, created_at FROM profiles WHERE email ILIKE '%hectorgamer%';
