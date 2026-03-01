-- =====================================================
-- DESABILITAR EMAIL CONFIRMATION - SUPABASE
-- =====================================================
-- Execute este script no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new
-- =====================================================

-- Opção 1: Via função do Supabase (se disponível)
-- SELECT auth.set_config('enable_email_confirmations', 'false', true);

-- Opção 2: Atualizar configuração diretamente
-- Nota: Em alguns casos, é necessário usar o dashboard

-- =====================================================
-- MÉTODO RECOMENDADO: Usar o Dashboard
-- =====================================================
-- 
-- 1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings
-- 2. Role até "Email Settings" ou "Email Auth"
-- 3. Desmarque: "Enable email confirmations"
-- 4. Clique em "Save"
-- 
-- =====================================================

-- =====================================================
-- VERIFICAR CONFIGURAÇÃO ATUAL
-- =====================================================

-- Verificar se há usuários pendentes de confirmação
SELECT 
  COUNT(*) FILTER (WHERE confirmed_at IS NULL) as usuarios_nao_confirmados,
  COUNT(*) FILTER (WHERE confirmed_at IS NOT NULL) as usuarios_confirmados,
  COUNT(*) as total_usuarios
FROM auth.users;

-- =====================================================
-- CONFIRMAR USUÁRIOS EXISTENTES (OPCIONAL)
-- =====================================================
-- Se quiser confirmar todos os usuários existentes:

UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;

-- =====================================================
-- PERMITIR LOGIN SEM CONFIRMAÇÃO PARA DESENVOLVIMENTO
-- =====================================================

-- Criar política para permitir login sem confirmação
-- (isso é apenas para desenvolvimento!)

DO $$
BEGIN
  -- Tentar desabilitar via GUC (Grand Unified Configuration)
  -- Nota: Pode não funcionar em todos os planos do Supabase
  EXECUTE format('ALTER DATABASE postgres SET "auth.enable_email_confirmations" = false');
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Não foi possível alterar via SQL. Use o dashboard.';
END $$;

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================

SELECT 
  'Configuração atual:' as info,
  'Verifique em: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings' as instrucao;

SELECT 
  '✅ Script executado!' as status,
  'Agora desabilite email confirmation no dashboard' as proximo_passo;
