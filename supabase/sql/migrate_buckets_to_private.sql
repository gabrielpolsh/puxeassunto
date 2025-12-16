-- =====================================================
-- MIGRAÇÃO: Tornar buckets PRIVADOS
-- Execute este SQL uma única vez para aplicar segurança
-- =====================================================

-- 1. Tornar bucket 'puxeassunto' privado
UPDATE storage.buckets 
SET public = false 
WHERE id = 'puxeassunto';

-- 2. Criar bucket 'puxeassunto-sem-login' como privado (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('puxeassunto-sem-login', 'puxeassunto-sem-login', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- =====================================================
-- ATUALIZAR POLICIES DO BUCKET 'puxeassunto'
-- =====================================================

-- Remover policy de acesso público (IMPORTANTE!)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- Remover policy antiga se existir
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;

-- Criar policy para usuários lerem apenas SUAS PRÓPRIAS imagens
-- Isso permite tanto acesso direto quanto signed URLs
CREATE POLICY "Users can read their own files"
  ON storage.objects FOR SELECT
  USING ( 
    bucket_id = 'puxeassunto' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- POLICIES DO BUCKET 'puxeassunto-sem-login'
-- =====================================================

-- Permitir uploads anônimos (para funcionar sem login)
DROP POLICY IF EXISTS "Guest images upload" ON storage.objects;
CREATE POLICY "Guest images upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'puxeassunto-sem-login' );

-- NÃO criar policy de SELECT = Ninguém pode acessar as imagens via URL
-- Apenas service_role (admin) pode ver

-- =====================================================
-- RESULTADO:
-- ✅ Bucket 'puxeassunto': Privado, usuários veem só suas imagens
-- ✅ Bucket 'puxeassunto-sem-login': Privado, ninguém pode ver/listar
-- ✅ URLs públicas não funcionam mais
-- ✅ Signed URLs funcionam para usuários autenticados
-- ✅ Imagens antigas continuam salvas, acessíveis via signed URL
-- =====================================================
