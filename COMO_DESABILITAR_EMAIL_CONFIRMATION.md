# 📧 Como Desabilitar Email Confirmation no Supabase

## ⚡ Método Rápido (Dashboard)

### Passo 1: Acesse o Dashboard

Clique aqui: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings

### Passo 2: Encontre "Email Settings"

Role a página até encontrar a seção **"Email Settings"** ou **"Email Auth"**

### Passo 3: Desabilite a Confirmação

Procure por:
- ☑️ **Enable email confirmations** ← Desmarque esta opção

### Passo 4: Salve

Clique em **"Save"** ou **"Update"**

---

## 🔧 Método Alternativo (SQL)

Se não encontrar no dashboard, execute este SQL:

### Passo 1: Acesse o SQL Editor

https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new

### Passo 2: Execute este comando

```sql
-- Confirmar todos os usuários pendentes
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;

-- Verificar resultado
SELECT email, confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Passo 3: Clique em "Run" (ou Ctrl+Enter)

---

## ✅ Verificar se Funcionou

### Teste o Cadastro

1. Acesse: https://acaisaas3.vercel.app/cadastro-lojista
2. Preencha com:
   - Nome: `Teste Silva`
   - Email: `teste123@gmail.com` (use email real)
   - Senha: `Teste123!`
3. Clique em "Criar Conta"
4. **Deve redirecionar para o dashboard** (sem pedir confirmação)

---

## 🎯 Configuração Ideal para Desenvolvimento

| Configuração | Valor |
|-------------|-------|
| Enable email confirmations | ❌ Desmarcado |
| Enable double opt-in | ❌ Desmarcado |
| Site URL | `https://acaisaas3.vercel.app` |
| Redirect URLs | `https://acaisaas3.vercel.app/**` |

---

## 📍 Onde Encontrar Cada Configuração

### Auth Settings
```
Dashboard → Authentication → Settings
├─ Email Settings
│  ├─ ☑ Enable email confirmations ← DESMARQUE
│  └─ ☑ Enable double opt-in ← DESMARQUE
├─ Site URL
│  └─ https://acaisaas3.vercel.app
└─ Redirect URLs
   └─ https://acaisaas3.vercel.app/**
```

### API Settings (para scripts)
```
Dashboard → Settings → API
├─ Project URL
├─ API Keys
│  ├─ anon/public key
│  └─ service_role key ← (use com cuidado!)
```

---

## ⚠️ Importante

### Para Desenvolvimento:
- ❌ Desabilite email confirmations
- ✅ Use emails reais para teste
- ✅ Confirme usuários manualmente se necessário

### Para Produção:
- ✅ Habilite email confirmations
- ✅ Configure SMTP próprio (evita rate limit)
- ✅ Use double opt-in para segurança

---

## 🆘 Problemas Comuns

### "Não encontro a opção no dashboard"

1. Verifique se está no projeto correto
2. Atualize a página (F5)
3. Tente outro navegador

### "Cadastro funciona mas não faz login"

Execute este SQL:
```sql
-- Confirmar todos os usuários
UPDATE auth.users 
SET confirmed_at = NOW() 
WHERE confirmed_at IS NULL;
```

### "Rate limit de emails"

Isso é normal no plano free. Soluções:
1. Desabilite email confirmations (desenvolvimento)
2. Configure SMTP próprio (produção)
3. Use o mesmo email para múltiplos testes

---

## 🔗 Links Úteis

- **Auth Settings**: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings
- **SQL Editor**: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/sql/new
- **Dashboard**: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc
- **Site Vercel**: https://acaisaas3.vercel.app

---

## ✅ Checklist

- [ ] Acessei o dashboard do Supabase
- [ ] Fui em Auth → Settings
- [ ] Desmarquei "Enable email confirmations"
- [ ] Salvei as alterações
- [ ] Testei o cadastro no site
- [ ] Funcionou! 🎉

---

**Precisa de ajuda?** Execute o script `disable-email-confirmation.sql` no SQL Editor!
