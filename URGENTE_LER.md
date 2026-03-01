# ⚠️ URGENTE: Corrigir Erro no Supabase

## 🚨 Problema Detectado

O site https://acaisaas3.vercel.app/ está **online**, mas o cadastro de usuários está falhando.

**Erro:** `Database error saving new user`

**Causa:** Políticas de RLS (Row Level Security) com recursão infinita na tabela `profiles`.

---

## ✅ Solução (5 minutos)

### Passo 1: Acesse o Supabase Dashboard

https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new

### Passo 2: Copie o SQL abaixo

```sql
-- =====================================================
-- CORREÇÃO URGENTE - RLS INFINITE RECURSION
-- =====================================================

-- 1. Remover políticas problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;

-- 2. Recriar políticas SEM recursão
CREATE POLICY "enable_insert_for_authenticated_users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "enable_select_for_authenticated_users"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR role = 'owner');

CREATE POLICY "enable_update_for_authenticated_users"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "enable_delete_for_authenticated_users"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Verificar
SELECT '✅ Corrigido!' as status, COUNT(*) as total_profiles FROM profiles;
```

### Passo 3: Execute o SQL

Clique em **"Run"** ou pressione `Ctrl+Enter`

### Passo 4: Teste o Site

Volte para https://acaisaas3.vercel.app/ e tente criar uma conta.

---

## ✅ Após a Correção

O fluxo completo funcionará:
- ✅ Cadastro de lojista
- ✅ Login
- ✅ Criação de loja
- ✅ Cadastro de produtos
- ✅ Pedidos

---

## 📞 Dúvidas?

O arquivo `fix-rls-urgent.sql` está no repositório GitHub.

**GitHub:** https://github.com/josemaster12/acaisaas
