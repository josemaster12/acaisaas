-- =====================================================
-- ATIVAR USUÁRIOS - MÉTODO FINAL TESTADO
-- =====================================================
-- confirmed_at é coluna GERADA - não pode atualizar!
-- Atualize APENAS email_confirmed_at
-- =====================================================

-- =====================================================
-- PASSO 1: Ver usuários pendentes
-- =====================================================
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email_confirmed_at IS NULL
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- PASSO 2: Ativar usuário ESPECÍFICO
-- =====================================================
-- Substitua pelo email do usuário que quer ativar

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'seu-email@teste.com'
  AND email_confirmed_at IS NULL;

-- =====================================================
-- PASSO 3: Ativar TODOS os pendentes
-- =====================================================

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- =====================================================
-- PASSO 4: Verificar resultado
-- =====================================================

SELECT 
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmado'
    ELSE '⏳ Pendente'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- PASSO 5: Resumo
-- =====================================================

SELECT 
  'Total de usuários:' as descricao,
  COUNT(*) as quantidade
FROM auth.users
UNION ALL
SELECT 
  'Confirmados:',
  COUNT(*)
FROM auth.users
WHERE email_confirmed_at IS NOT NULL
UNION ALL
SELECT 
  'Pendentes:',
  COUNT(*)
FROM auth.users
WHERE email_confirmed_at IS NULL;

-- =====================================================
-- IMPORTANTE: confirmed_at é atualizado AUTOMATICAMENTE
-- quando email_confirmed_at é definido!
-- =====================================================

SELECT '✅ Usuários ativados! confirmed_at foi atualizado automaticamente.' as status;
