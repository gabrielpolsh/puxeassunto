-- Script para corrigir o trigger handle_new_user para ativar PRO automaticamente
-- quando usuário cria conta e existe uma compra pendente para o email
-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE

-- ============================================
-- PASSO 1: DROPAR TRIGGER ANTIGO (IMPORTANTE!)
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================
-- PASSO 2: CRIAR/SUBSTITUIR A FUNÇÃO
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  pending_record RECORD;
  subscription_end timestamp with time zone;
  normalized_email text;
BEGIN
  -- Normalizar email do novo usuário
  normalized_email := LOWER(TRIM(COALESCE(NEW.email, '')));
  
  -- Log para debug
  RAISE LOG 'handle_new_user: Processing new user with email: %', normalized_email;
  
  -- Verificar se existe compra pendente para este email
  -- Usar ILIKE para ser case-insensitive
  SELECT * INTO pending_record
  FROM public.pending_purchases
  WHERE LOWER(TRIM(email)) = normalized_email
    AND claimed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  -- CORREÇÃO: Usar FOUND ao invés de IS NOT NULL (RECORD nunca é NULL em PL/pgSQL)
  IF FOUND AND pending_record.id IS NOT NULL THEN
    -- Log para debug
    RAISE LOG 'handle_new_user: Found pending purchase for %, plan: %, duration: % months', 
      normalized_email, pending_record.plan_type, pending_record.duration_months;
    
    -- Calcular data de expiração baseado no plano
    subscription_end := NOW() + (pending_record.duration_months || ' months')::interval;
    
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
    
    RAISE LOG 'handle_new_user: User % created with PRO from pending purchase %', NEW.email, pending_record.sale_id;
  ELSE
    RAISE LOG 'handle_new_user: No pending purchase found for %, creating free profile', normalized_email;
    
    -- Criar profile normal (free)
    INSERT INTO public.profiles (id, email, is_pro)
    VALUES (NEW.id, NEW.email, false);
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Em caso de erro, logar e tentar criar profile básico
    RAISE LOG 'handle_new_user ERROR: % - %', SQLERRM, SQLSTATE;
    
    -- Tentar criar profile básico se ainda não existe
    BEGIN
      INSERT INTO public.profiles (id, email, is_pro)
      VALUES (NEW.id, NEW.email, false)
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE LOG 'handle_new_user: Could not create fallback profile: %', SQLERRM;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================
-- PASSO 3: CRIAR O TRIGGER NOVO
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Verificar se a tabela pending_purchases existe e criar se não existir
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

-- 4. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_pending_purchases_email ON pending_purchases(email);
CREATE INDEX IF NOT EXISTS idx_pending_purchases_sale_id ON pending_purchases(sale_id);

-- 5. Habilitar RLS
ALTER TABLE pending_purchases ENABLE ROW LEVEL SECURITY;

-- 6. Verificar compras pendentes que podem ser ativadas para usuários existentes
-- (Roda manualmente para ativar PRO de quem já criou conta)
DO $$
DECLARE
  pending RECORD;
  user_record RECORD;
  subscription_end timestamp with time zone;
BEGIN
  -- Para cada compra pendente não resgatada
  FOR pending IN 
    SELECT * FROM pending_purchases 
    WHERE claimed_at IS NULL
  LOOP
    -- Verificar se existe um usuário com esse email
    SELECT p.* INTO user_record
    FROM profiles p
    WHERE LOWER(TRIM(p.email)) = pending.email
    LIMIT 1;
    
    IF user_record IS NOT NULL THEN
      -- Calcular data de expiração
      subscription_end := NOW() + (pending.duration_months || ' months')::interval;
      
      -- Atualizar o perfil para PRO
      UPDATE profiles
      SET 
        is_pro = true,
        plan_type = pending.plan_type,
        subscription_end_date = subscription_end,
        subscription_status = 'approved',
        updated_at = NOW()
      WHERE id = user_record.id;
      
      -- Marcar como resgatada
      UPDATE pending_purchases
      SET claimed_at = NOW(), claimed_by = user_record.id
      WHERE id = pending.id;
      
      RAISE NOTICE 'Activated PRO for existing user: % (plan: %, ends: %)', 
        user_record.email, pending.plan_type, subscription_end;
    END IF;
  END LOOP;
END $$;

-- 7. Mostrar resultado
SELECT 
  email, 
  plan_type, 
  duration_months,
  created_at,
  claimed_at,
  CASE WHEN claimed_at IS NOT NULL THEN 'ATIVADO' ELSE 'PENDENTE' END as status
FROM pending_purchases
ORDER BY created_at DESC;
