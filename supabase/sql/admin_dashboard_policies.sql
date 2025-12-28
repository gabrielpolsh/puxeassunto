-- =============================================
-- Admin Dashboard Policies
-- =============================================
-- Permite que usuários administradores acessem todos os dados
-- IMPORTANTE: Execute com cuidado, pois dá acesso a todos os dados

-- Lista de emails de administradores
-- Adicione ou remova emails conforme necessário
-- Usa auth.jwt() para pegar o email do token, evitando acesso direto a auth.users
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Pega o email diretamente do JWT token (não precisa acessar auth.users)
  user_email := auth.jwt() ->> 'email';
  
  RETURN user_email IN (
    'biellgga@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Policies para PROFILES
-- =============================================

-- Admins podem ver todos os profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- =============================================
-- Policies para CHATS
-- =============================================

-- Política existente: usuários veem seus próprios chats
-- Adicionar: admins podem ver todos os chats

DROP POLICY IF EXISTS "Users can view own chats" ON chats;
DROP POLICY IF EXISTS "Admins can view all chats" ON chats;

CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats"
  ON chats FOR SELECT
  USING (is_admin());

-- =============================================
-- Policies para MESSAGES
-- =============================================

DROP POLICY IF EXISTS "Users can view messages from own chats" ON messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON messages;

CREATE POLICY "Users can view messages from own chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  USING (is_admin());

-- =============================================
-- Policies para PENDING_PURCHASES
-- =============================================

-- Apenas service_role e admins podem ver pending_purchases
DROP POLICY IF EXISTS "Admins can view pending purchases" ON pending_purchases;

CREATE POLICY "Admins can view pending purchases"
  ON pending_purchases FOR SELECT
  USING (is_admin());

-- =============================================
-- Funções auxiliares para estatísticas
-- =============================================

-- Função para contar mensagens por dia (para gráficos)
CREATE OR REPLACE FUNCTION admin_get_daily_message_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  message_count BIGINT,
  image_count BIGINT
) AS $$
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN QUERY
  SELECT 
    DATE(m.created_at) as date,
    COUNT(*) as message_count,
    COUNT(m.image_data) as image_count
  FROM messages m
  WHERE m.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(m.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para contar novos usuários por dia
CREATE OR REPLACE FUNCTION admin_get_daily_user_stats(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  total_users BIGINT,
  pro_users BIGINT
) AS $$
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN QUERY
  SELECT 
    DATE(p.created_at) as date,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE p.is_pro = true) as pro_users
  FROM profiles p
  WHERE p.created_at >= NOW() - (days_back || ' days')::INTERVAL
  GROUP BY DATE(p.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter resumo geral (para dashboard)
CREATE OR REPLACE FUNCTION admin_get_dashboard_summary()
RETURNS TABLE (
  total_users BIGINT,
  pro_users BIGINT,
  free_users BIGINT,
  total_chats BIGINT,
  total_messages BIGINT,
  total_images BIGINT,
  users_today BIGINT,
  users_this_week BIGINT,
  users_this_month BIGINT
) AS $$
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM profiles WHERE is_pro = true) as pro_users,
    (SELECT COUNT(*) FROM profiles WHERE is_pro = false OR is_pro IS NULL) as free_users,
    (SELECT COUNT(*) FROM chats) as total_chats,
    (SELECT COUNT(*) FROM messages) as total_messages,
    (SELECT COUNT(*) FROM messages WHERE image_data IS NOT NULL) as total_images,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE) as users_today,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as users_this_week,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as users_this_month;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Índices para performance
-- =============================================

-- Índice para buscar profiles por email rapidamente
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Índice para buscar chats por user_id
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- Índice para buscar messages por chat_id
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);

-- Índice para filtrar mensagens com imagens (usando expressão booleana, não o valor)
-- NÃO indexar image_data diretamente pois pode conter base64 muito grande
CREATE INDEX IF NOT EXISTS idx_messages_has_image ON messages((image_data IS NOT NULL)) WHERE image_data IS NOT NULL;

-- Índice para ordenar por created_at
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
