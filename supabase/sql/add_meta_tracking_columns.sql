-- Adiciona colunas para armazenar parâmetros do Meta no perfil do usuário
-- Esses dados são capturados no navegador e usados pelo webhook para enviar eventos com melhor matching

-- Colunas de tracking do Meta (não precisam de hash - já são identificadores)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_fbc text;        -- Facebook Click ID (vem de anúncios)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_fbp text;        -- Facebook Browser ID (cookie _fbp)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_user_agent text; -- User Agent do navegador
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_client_ip text;  -- IP do cliente (preferencialmente IPv6)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS meta_updated_at timestamp with time zone; -- Quando os dados foram atualizados

-- Criar índice para busca rápida por email (usado pelo webhook)
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON profiles(LOWER(email));

-- Comentários para documentação
COMMENT ON COLUMN profiles.meta_fbc IS 'Facebook Click ID - capturado do navegador quando usuário vem de anúncio';
COMMENT ON COLUMN profiles.meta_fbp IS 'Facebook Browser ID - cookie _fbp do navegador';
COMMENT ON COLUMN profiles.meta_user_agent IS 'User Agent do navegador do cliente';
COMMENT ON COLUMN profiles.meta_client_ip IS 'IP do cliente (preferencialmente IPv6)';
COMMENT ON COLUMN profiles.meta_updated_at IS 'Última atualização dos dados de tracking do Meta';

-- Também adicionar na tabela pending_purchases para usuários que compram antes de criar conta
ALTER TABLE pending_purchases ADD COLUMN IF NOT EXISTS meta_fbc text;
ALTER TABLE pending_purchases ADD COLUMN IF NOT EXISTS meta_fbp text;
ALTER TABLE pending_purchases ADD COLUMN IF NOT EXISTS meta_user_agent text;
ALTER TABLE pending_purchases ADD COLUMN IF NOT EXISTS meta_client_ip text;
