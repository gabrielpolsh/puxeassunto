-- Script de DEBUG para verificar o problema do trigger
-- Execute cada seção separadamente no SQL Editor do Supabase

-- ============================================
-- 1. VERIFICAR SE A TABELA pending_purchases EXISTE E TEM DADOS
-- ============================================
SELECT 
  id,
  email,
  LOWER(TRIM(email)) as email_normalizado,
  sale_id,
  plan_type,
  duration_months,
  created_at,
  claimed_at,
  claimed_by
FROM pending_purchases
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 2. VERIFICAR SE O TRIGGER EXISTE
-- ============================================
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name,
  tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass;

-- ============================================
-- 3. VERIFICAR A FUNÇÃO handle_new_user ATUAL
-- ============================================
SELECT 
  proname,
  prosrc as function_source
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- ============================================
-- 4. VERIFICAR O ÚLTIMO USUÁRIO CRIADO
-- ============================================
SELECT 
  au.id,
  au.email,
  LOWER(TRIM(au.email)) as email_normalizado,
  au.created_at as user_created_at,
  p.is_pro,
  p.plan_type,
  p.subscription_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
ORDER BY au.created_at DESC
LIMIT 5;

-- ============================================
-- 5. VERIFICAR SE EXISTE COMPRA PENDENTE PARA O EMAIL DO ÚLTIMO USUÁRIO
-- ============================================
-- Substitua 'EMAIL_DO_USUARIO' pelo email real
SELECT 
  pp.*,
  CASE 
    WHEN pp.email = LOWER(TRIM('EMAIL_DO_USUARIO')) THEN 'MATCH EXATO'
    WHEN LOWER(TRIM(pp.email)) = LOWER(TRIM('EMAIL_DO_USUARIO')) THEN 'MATCH COM NORMALIZE'
    ELSE 'SEM MATCH'
  END as match_status
FROM pending_purchases pp
WHERE pp.email ILIKE '%EMAIL_DO_USUARIO%'
   OR LOWER(TRIM(pp.email)) = LOWER(TRIM('EMAIL_DO_USUARIO'));

-- ============================================
-- 6. FORÇAR ATUALIZAÇÃO MANUAL PARA TESTE
-- ============================================
-- Substitua os valores corretos
/*
UPDATE profiles p
SET 
  is_pro = true,
  plan_type = (SELECT plan_type FROM pending_purchases WHERE email = LOWER(TRIM('EMAIL')) AND claimed_at IS NULL LIMIT 1),
  subscription_end_date = NOW() + interval '3 months',
  subscription_status = 'approved'
WHERE p.email = 'EMAIL';

UPDATE pending_purchases
SET claimed_at = NOW()
WHERE email = LOWER(TRIM('EMAIL')) AND claimed_at IS NULL;
*/
