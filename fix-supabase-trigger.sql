-- =====================================================
-- CORREÇÃO DO TRIGGER DE CRIAÇÃO DE PERFIS
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Verificar se a função existe e recriar se necessário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro para debug
    RAISE NOTICE 'Erro ao criar perfil: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Garantir que o trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 3. Adicionar policy para permitir insert via trigger
-- A policy já deve existir, mas vamos garantir
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;
CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

-- 4. Verificar status
SELECT 
  'Trigger configurado!' as status,
  COUNT(*) as total_profiles
FROM profiles;
