-- =====================================================
-- VERIFICAR TRIGGER E FUNÇÃO
-- Execute no Supabase SQL Editor
-- =====================================================

-- 1. Verificar se o trigger existe
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 2. Verificar se a função existe
SELECT 
  proname as function_name,
  prosrc as source
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 3. Testar inserção manual de perfil
-- (isto testa se as policies estão funcionando)
INSERT INTO profiles (id, email, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'teste@teste.com',
  'Teste Manual',
  'owner'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Verificar se o perfil foi criado
SELECT * FROM profiles WHERE email = 'teste@teste.com';

-- 5. Limpar teste
DELETE FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001';

-- 6. Contar perfis totais
SELECT COUNT(*) as total_perfis FROM profiles;
