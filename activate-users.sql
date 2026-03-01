-- =====================================================
-- ATIVAR USUÁRIOS - MÉTODO CORRETO
-- =====================================================
-- A função admin_activate_user não existe nesta versão
-- Vamos usar o método direto via update na tabela auth.users
-- =====================================================

-- =====================================================
-- MÉTODO 1: Atualizar diretamente (RECOMENDADO)
-- =====================================================

-- Ver usuários pendentes
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- Ativar usuário específico (substitua o email)
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'seu-email@teste.com'
  AND email_confirmed_at IS NULL;

-- OU ativar TODOS os pendentes de uma vez:
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Verificar resultado
SELECT 
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as pendentes,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmados,
  COUNT(*) as total
FROM auth.users;

-- =====================================================
-- MÉTODO 2: Usar o Dashboard (MAIS FÁCIL)
-- =====================================================
-- 
-- 1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/users
-- 2. Encontre o usuário pendente
-- 3. Clique nos 3 pontinhos (⋮)
-- 4. Selecione "Confirm email" ou "Activate"
-- 
-- =====================================================

-- =====================================================
-- DESABILITAR PARA FUTUROS CADASTROS
-- =====================================================
-- 
-- Isso SÓ pode ser feito pelo Dashboard:
-- 
-- 1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings
-- 2. Role até "Email Settings"
-- 3. Desmarque: "Enable email confirmations"
-- 4. Clique em "Save"
-- 
-- =====================================================

SELECT '✅ Usuários atualizados! Agora desabilite email confirmation no dashboard.' as status;
