# 🚨 URGENTE: Corrigir Email Confirmation

## ⚠️ Problema

O Supabase atualizou e agora `confirmed_at` é uma coluna **gerada automaticamente**.
**Não é possível atualizar via SQL direto!**

---

## ✅ Soluções Disponíveis

### 🎯 Solução 1: Dashboard (MAIS FÁCIL - RECOMENDADA)

#### Passo 1: Acesse o Dashboard
https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings

#### Passo 2: Desabilite Email Confirmation
- Role até **"Email Settings"**
- **Desmarque**: `Enable email confirmations`
- Clique em **"Save"**

#### Passo 3: Teste o Cadastro
https://acaisaas3.vercel.app/cadastro-lojista

---

### 🔧 Solução 2: Ativar Usuários Existentes (SQL)

Se já criou usuários e estão pendentes:

#### Acesse o SQL Editor
https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new

#### Execute este script:

```sql
-- Listar usuários pendentes
SELECT id, email, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL 
ORDER BY created_at DESC;

-- Ativar CADA usuário manualmente (substitua o UUID)
-- SELECT auth.admin_activate_user('COLE-O-UUID-AQUI');

-- OU ativar TODOS automaticamente:
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM auth.users WHERE email_confirmed_at IS NULL
  LOOP
    PERFORM auth.admin_activate_user(user_record.id);
  END LOOP;
  
  RAISE NOTICE '✅ Usuários ativados com sucesso!';
END $$;

-- Verificar resultado
SELECT 
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as pendentes,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmados,
  COUNT(*) as total
FROM auth.users;
```

---

### 💻 Solução 3: Script Node.js (Automático)

#### Instale dependência:
```bash
npm install node-fetch
```

#### Obtenha a Service Role Key:
1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/settings/api
2. Copie a **service_role** key (cuidado: é super poderosa!)

#### Execute o script:
```bash
# Windows PowerShell:
$env:SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"; node manage-users.js

# Windows CMD:
set SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui && node manage-users.js

# Linux/Mac:
SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui" node manage-users.js
```

---

## 📊 Resumo das Soluções

| Método | Dificuldade | Tempo | Recomendado |
|--------|-------------|-------|-------------|
| Dashboard | Fácil | 1 min | ✅ **SIM** |
| SQL | Médio | 3 min | Para usuários existentes |
| Script Node.js | Avançado | 5 min | Automação |

---

## ✅ Checklist

### Para Desenvolvimento:
- [ ] Acessei o dashboard do Supabase
- [ ] Fui em Auth → Settings
- [ ] Desmarquei "Enable email confirmations"
- [ ] Salvei
- [ ] Testei cadastro no site
- [ ] Funcionou! 🎉

### Se já tem usuários criados:
- [ ] Executei o SQL para ativar usuários
- [ ] Verifiquei que todos estão confirmados
- [ ] Testei login
- [ ] Funcionou! 🎉

---

## 🔗 Links Diretos

| Ação | Link |
|------|------|
| Desabilitar Email Confirmation | [Acessar](https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings) |
| SQL Editor | [Acessar](https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new) |
| Ver Usuários | [Acessar](https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/users) |
| API Keys | [Acessar](https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/settings/api) |
| Testar Site | [Acessar](https://acaisaas3.vercel.app/cadastro-lojista) |

---

## 🆘 Problemas Comuns

### "Não encontro a opção no dashboard"
- Atualize a página (F5)
- Verifique se está logado na conta correta
- Tente navegador anônimo

### "Script SQL dá erro"
- Copie e cole exatamente como está
- Verifique se está no SQL Editor correto
- Execute cada parte separadamente

### "Cadastro funciona mas pede email"
- Desabilite email confirmation no dashboard
- Ou confirme o email recebido
- Ou use o SQL para ativar usuários

---

## 📝 Nota Importante

**Para PRODUÇÃO:**
- ✅ Reabilite email confirmations
- ✅ Configure SMTP próprio
- ✅ Use double opt-in

**Para DESENVOLVIMENTO:**
- ❌ Desabilite email confirmations
- ✅ Teste livremente
- ✅ Use emails reais ou temporários

---

**Dúvidas?** Execute o script `fix-users-confirm.sql` no SQL Editor!
