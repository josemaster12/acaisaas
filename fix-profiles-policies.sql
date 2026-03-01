-- =====================================================
-- CORREÇÃO - Remover trigger problemático
-- Execute no Supabase SQL Editor
-- =====================================================

-- 1. Remover o trigger que está causando o erro
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover a função antiga
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. Adicionar policy para permitir criação de perfis
-- Usuários podem criar seu próprio perfil
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Adicionar policy para usuários verem seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 5. Adicionar policy para usuários atualizarem seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. Verificar policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
