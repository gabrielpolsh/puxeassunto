-- =====================================================
-- CORREÇÃO: Policies de Storage para Signed URLs
-- =====================================================
-- Este SQL corrige as policies de storage para permitir que:
-- 1. Usuários vejam suas próprias imagens via signed URL
-- 2. Admins vejam todas as imagens
-- =====================================================

-- Primeiro, verificar se o bucket existe e está configurado corretamente
UPDATE storage.buckets 
SET public = false 
WHERE id = 'puxeassunto';

-- =====================================================
-- REMOVER POLICIES ANTIGAS
-- =====================================================

-- Remover todas as policies existentes no bucket puxeassunto
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;

-- =====================================================
-- CRIAR NOVAS POLICIES
-- =====================================================

-- Policy 1: Usuários autenticados podem VER suas próprias imagens
-- Isso permite criar signed URLs para as próprias imagens
CREATE POLICY "Users can read their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'puxeassunto' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 2: ADMINS podem ver TODAS as imagens
-- Isso permite que o admin veja qualquer imagem no dashboard admin
CREATE POLICY "Admins can read all files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'puxeassunto' 
    AND is_admin()
  );

-- Policy 3: Usuários autenticados podem FAZER UPLOAD de imagens na sua pasta
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'puxeassunto' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Usuários podem DELETAR suas próprias imagens
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'puxeassunto' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- TESTE: Verificar policies criadas
-- =====================================================
-- Execute após criar as policies para verificar:
-- SELECT policyname, roles, cmd, qual FROM pg_policies WHERE tablename = 'objects';

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. storage.foldername(name)[1] extrai a primeira parte do path
--    Ex: "uuid-123/image.png" -> "uuid-123"
--
-- 2. auth.uid() retorna o ID do usuário autenticado como UUID
--
-- 3. Para signed URLs funcionarem, a policy de SELECT precisa permitir
--    que o usuário acesse a imagem
--
-- 4. Signed URLs são gerados pelo servidor usando service_role,
--    mas a policy de SELECT ainda é verificada quando a URL é acessada
--
-- =====================================================
-- SE AINDA NÃO FUNCIONAR
-- =====================================================
-- Verifique no console do Supabase:
-- 1. Authentication > Users > verifique o ID do usuário
-- 2. Storage > puxeassunto > verifique se as imagens estão no path correto
--    (devem estar em: user_id/filename.png)
-- 3. SQL Editor > Execute: SELECT * FROM storage.objects WHERE bucket_id = 'puxeassunto' LIMIT 10;
--    para verificar os paths das imagens
