-- =====================================================
-- CONFIRMAR USUÁRIO PENDENTE
-- =====================================================
-- Este método usa a API interna do Supabase
-- =====================================================

-- =====================================================
-- MÉTODO 1: Via função auth (se disponível)
-- =====================================================

-- Verificar se a função existe
SELECT proname 
FROM pg_proc 
WHERE proname = 'activate_user' 
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth');

-- Se existir, use:
-- SELECT auth.activate_user('EMAIL-DO-USUARIO');

-- =====================================================
-- MÉTODO 2: Update direto na coluna email_confirmed_at
-- =====================================================

-- Primeiro, veja o email do usuário pendente
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- Agora atualize APENAS email_confirmed_at (NÃO confirmed_at!)
-- Substitua PELO EMAIL REAL do usuário
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL
RETURNING email, email_confirmed_at;

-- =====================================================
-- MÉTODO 3: Se o update não funcionar (RLS bloqueando)
-- =====================================================
-- Use o Dashboard:
-- 1. https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/users
-- 2. Clique nos 3 pontinhos (⋮) ao lado do usuário
-- 3. Selecione "Confirm email"

-- =====================================================
-- VERIFICAR RESULTADO
-- =====================================================

SELECT 
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '⏳ Pendente'
  END as status
FROM auth.users;
