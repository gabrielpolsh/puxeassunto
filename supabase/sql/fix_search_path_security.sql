-- Fix mutable search_path for all functions
-- Isso previne ataques de "search path injection"

-- 1. Fix handle_updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix get_daily_message_count
CREATE OR REPLACE FUNCTION public.get_daily_message_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_count integer;
  start_of_day timestamp with time zone;
BEGIN
  -- Calculate start of day in Brazil (UTC-3)
  start_of_day := date_trunc('day', now() - interval '3 hours') + interval '3 hours';

  -- Count messages for the current user created after the start of the day
  SELECT count(*)
  INTO daily_count
  FROM messages m
  JOIN chats c ON m.chat_id = c.id
  WHERE c.user_id = auth.uid()
  AND m.role = 'user'
  AND m.created_at >= start_of_day;

  RETURN daily_count;
END;
$$;

-- 3. Fix handle_new_user (with pending_purchases check)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  pending_record RECORD;
  subscription_end timestamp with time zone;
BEGIN
  -- Verificar se existe compra pendente para este email
  SELECT * INTO pending_record
  FROM public.pending_purchases
  WHERE email = LOWER(TRIM(NEW.email))
    AND claimed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  -- CORREÇÃO: Usar FOUND ao invés de IS NOT NULL (RECORD nunca é NULL em PL/pgSQL)
  IF FOUND AND pending_record.id IS NOT NULL THEN
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
    
    RAISE NOTICE 'User % created with PRO from pending purchase %', NEW.email, pending_record.sale_id;
  ELSE
    -- Criar profile normal (free)
    INSERT INTO public.profiles (id, email, is_pro)
    VALUES (NEW.id, NEW.email, false);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
