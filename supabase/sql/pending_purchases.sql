-- Tabela para armazenar compras de usuários que ainda não criaram conta
-- Quando o usuário criar conta com o email, o plano PRO será ativado automaticamente

CREATE TABLE IF NOT EXISTS pending_purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  sale_id text NOT NULL UNIQUE, -- ID da venda no Kirvano (evita duplicatas)
  plan_type text NOT NULL DEFAULT 'monthly', -- monthly, quarterly, yearly
  duration_months integer NOT NULL DEFAULT 1,
  price numeric(10,2),
  payload jsonb, -- Payload completo do webhook para referência
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  claimed_at timestamp with time zone, -- Quando foi resgatado
  claimed_by uuid REFERENCES profiles(id) -- Quem resgatou
);

-- Index para buscar por email rapidamente
CREATE INDEX IF NOT EXISTS idx_pending_purchases_email ON pending_purchases(email);
CREATE INDEX IF NOT EXISTS idx_pending_purchases_sale_id ON pending_purchases(sale_id);

-- RLS: Apenas service_role pode acessar (webhook usa service_role)
ALTER TABLE pending_purchases ENABLE ROW LEVEL SECURITY;

-- Nenhuma política pública - só service_role acessa
-- (O webhook roda com SUPABASE_SERVICE_ROLE_KEY)

-- Atualizar o trigger que cria profiles para verificar compras pendentes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  pending_record RECORD;
  subscription_end timestamp with time zone;
BEGIN
  -- Verificar se existe compra pendente para este email
  SELECT * INTO pending_record
  FROM pending_purchases
  WHERE email = NEW.email
    AND claimed_at IS NULL
  ORDER BY created_at DESC
  LIMIT 1;

  IF pending_record IS NOT NULL THEN
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
    UPDATE pending_purchases
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar o trigger (se já existir, DROP primeiro)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
