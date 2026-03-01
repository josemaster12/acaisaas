-- =====================================================
-- ATIVAR USUÁRIOS - PRONTO AÇAÍ NOW
-- =====================================================
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new
-- =====================================================

-- 1. Confirmar todos os usuários existentes (para que possam fazer login)
UPDATE auth.users
SET 
  confirmed_at = NOW(),
  email_confirmed_at = NOW()
WHERE confirmed_at IS NULL OR email_confirmed_at IS NULL;

-- 2. Verificar usuários confirmados
SELECT 
  id,
  email,
  created_at,
  confirmed_at,
  email_confirmed_at,
  CASE 
    WHEN confirmed_at IS NOT NULL AND email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    WHEN confirmed_at IS NOT NULL THEN '⚠️ Apenas confirmed_at'
    WHEN email_confirmed_at IS NOT NULL THEN '⚠️ Apenas email_confirmed_at'
    ELSE '❌ Não confirmado'
  END as status
FROM auth.users
ORDER BY created_at DESC;

-- 3. Verificar perfis criados
SELECT 
  u.email,
  p.name,
  p.role,
  p.is_active,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Perfil existe'
    ELSE '❌ Perfil não encontrado'
  END as perfil_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- =====================================================
-- INSTRUÇÕES PARA DESABILITAR EMAIL CONFIRMATION
-- =====================================================
-- Para desabilitar permanentemente a confirmação de email:
--
-- 1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings
-- 2. Role até "Email Settings" ou "Email Auth"  
-- 3. Desmarque: "Enable email confirmations"
-- 4. Clique em "Save"
--
-- =====================================================
