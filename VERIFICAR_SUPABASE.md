# ✅ Verificação da Configuração do Supabase

## 🎯 Status: SQL Executado com Sucesso!

O script `supabase-schema.sql` foi executado e retornou sucesso.

---

## ✅ Passo 1: Verificar Tabelas Criadas

No Supabase, vá para **Database** → **Tables** e verifique se as tabelas foram criadas:

- [ ] `profiles`
- [ ] `stores`
- [ ] `products`
- [ ] `orders`
- [ ] `loyalty_programs`
- [ ] `coupons`

Se todas estiverem lá, **ótimo!** Vamos para o próximo passo.

---

## ✅ Passo 2: Criar Usuário Admin

### Opção A: Via Interface (Recomendado)

1. No Supabase, vá em **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha:
   - **Email:** `josetecnico21@gmail.com`
   - **Password:** `tenderbr0`
   - ✅ **Marque:** "Confirm email"
4. Clique em **Add User**

### Opção B: Via SQL (Alternativa)

Se preferir criar via SQL, execute no **SQL Editor**:

```sql
-- Nota: Este script apenas verifica, não cria usuário diretamente
-- Usuários devem ser criados via Authentication

-- Verificar se existe algum usuário
SELECT * FROM auth.users;

-- Verificar perfis
SELECT * FROM profiles;
```

---

## ✅ Passo 3: Atualizar Usuário para Admin

Após criar o usuário via Authentication:

1. Vá em **SQL Editor**
2. Execute:

```sql
-- Atualizar usuário para admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'josetecnico21@gmail.com';

-- Verificar se atualizou
SELECT email, role FROM profiles WHERE email = 'josetecnico21@gmail.com';
```

---

## ✅ Passo 4: Testar Conexão no Projeto

### 1. Verificar `.env`

```env
VITE_SUPABASE_URL=https://fwtvjjejycorwukqzwjc.supabase.co
VITE_SUPABASE_PROJECT_ID=fwtvjjejycorwukqzwjc
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT
VITE_USE_MOCK=false
```

### 2. Rodar Projeto

```bash
npm run dev
```

### 3. Fazer Login

Acesse: http://localhost:5173/login

- **Email:** `josetecnico21@gmail.com`
- **Senha:** `tenderbr0`

---

## 🔍 Debug: Verificar Tabelas via SQL

Se quiser verificar se tudo está correto, execute no **SQL Editor**:

```sql
-- Listar todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Contar registros em cada tabela
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles_count,
  (SELECT COUNT(*) FROM stores) as stores_count,
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM loyalty_programs) as loyalty_count,
  (SELECT COUNT(*) FROM coupons) as coupons_count;

-- Verificar policies de RLS
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

## 🎯 Estrutura Esperada

### Tabela `profiles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária (referencia auth.users) |
| email | TEXT | Email único |
| name | TEXT | Nome do usuário |
| phone | TEXT | Telefone (opcional) |
| role | TEXT | `customer`, `owner`, ou `admin` |
| avatar_url | TEXT | URL do avatar |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### Tabela `stores`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Chave primária |
| owner_id | UUID | Dono da loja (FK → profiles) |
| name | TEXT | Nome da loja |
| slug | TEXT | URL única |
| is_active | BOOLEAN | Loja ativa? |
| loyalty_enabled | BOOLEAN | Programa de fidelidade ativo? |
| loyalty_points | INTEGER | Pontos para prêmio |
| ... | ... | ... |

---

## 🐛 Problemas Comuns

### "Tabela não existe"

**Solução:**
- Execute o SQL novamente
- Verifique se não houve erro
- Aguarde 10 segundos e atualize a página

### "Não consigo fazer login"

**Solução:**
- Verifique se criou o usuário em **Authentication** → **Users**
- Verifique se o email está confirmado
- Tente recuperar a senha

### "Erro de permissão"

**Solução:**
- Verifique se as policies de RLS foram criadas
- Execute o SQL novamente
- Verifique se o usuário tem role `admin`

---

## ✅ Checklist Final

- [ ] SQL executado com sucesso
- [ ] Tabelas criadas (6 tabelas)
- [ ] Usuário admin criado via Authentication
- [ ] Usuário atualizado para role `admin`
- [ ] `.env` configurado com `VITE_USE_MOCK=false`
- [ ] Projeto rodando (`npm run dev`)
- [ ] Login funcionou

---

## 🎉 Tudo Pronto!

Se todos os itens acima estiverem marcados, **seu projeto está 100% configurado!**

Agora você pode:
- ✅ Criar lojas
- ✅ Cadastrar produtos
- ✅ Receber pedidos
- ✅ Gerenciar fidelidade
- ✅ Tudo sincronizado com Supabase!

---

**Próximo:** Comece a usar o sistema! 🚀
