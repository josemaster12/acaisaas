# 🍇 Açaí SaaS - Configuração Supabase

## ✅ Projeto Configurado!

Seu projeto agora está configurado para se conectar com o Supabase.

---

## 🎯 Dados do Projeto

- **URL:** https://fwtvjjejycorwukqzwjc.supabase.co
- **Project ID:** fwtvjjejycorwukqzwjc
- **Project Name:** acaisaas

---

## 🚀 Passos Rápidos

### 1. Executar Script SQL

1. Acesse https://supabase.com
2. Entre no projeto `acaisaas`
3. Vá em **SQL Editor**
4. Cole o conteúdo de `supabase-schema.sql`
5. Clique em **Run**

### 2. Criar Admin

No SQL Editor, após criar as tabelas:

```sql
-- Criar usuário admin manualmente se necessário
-- (melhor fazer via Authentication → Add User)
```

### 3. Testar

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 📁 Arquivos de Configuração

| Arquivo | Descrição |
|---------|-----------|
| `.env` | Variáveis de ambiente |
| `src/lib/supabase.ts` | Cliente Supabase |
| `src/lib/database.types.ts` | Tipos TypeScript |
| `src/lib/supabase.services.ts` | Serviços CRUD |
| `supabase-schema.sql` | Script SQL completo |
| `SUPABASE_SETUP.md` | Guia completo |

---

## 🔄 Alternar entre Mock e Supabase

No arquivo `.env`:

```env
# Usar Mock (dados locais)
VITE_USE_MOCK=true

# Usar Supabase (banco de dados real)
VITE_USE_MOCK=false
```

---

## 📊 Como Usar

### Criar Perfil

```typescript
import { profilesService } from '@/lib/supabase.services';

const profile = await profilesService.create({
  id: 'user-id',
  email: 'teste@email.com',
  name: 'João Silva',
  role: 'customer',
});
```

### Criar Loja

```typescript
import { storesService } from '@/lib/supabase.services';

const store = await storesService.create({
  owner_id: 'user-id',
  name: 'Açaí Express',
  slug: 'acai-express',
  whatsapp: '11999999999',
  loyalty_enabled: true,
});
```

### Criar Pedido

```typescript
import { ordersService } from '@/lib/supabase.services';

const order = await ordersService.create({
  store_id: 'store-id',
  customer_name: 'João Silva',
  customer_phone: '11999999999',
  customer_address: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
  },
  items: [...],
  subtotal: 35.00,
  delivery_fee: 5.00,
  total: 40.00,
  payment_method: 'pix',
  status: 'pendente',
});
```

---

## 🔐 Autenticação

```typescript
import { supabaseAuth } from '@/lib/supabase';

// Sign up
const { user, error } = await supabaseAuth.signUp(
  'email@teste.com',
  'senha123',
  { name: 'João Silva' }
);

// Sign in
const { user, session } = await supabaseAuth.signIn(
  'email@teste.com',
  'senha123'
);

// Sign out
await supabaseAuth.signOut();
```

---

## 🎁 Programa de Fidelidade

```typescript
import { loyaltyService } from '@/lib/supabase.services';

// Adicionar ponto
await loyaltyService.addPoints('customer-id', 'store-id', 1);

// Verificar pontos
const program = await loyaltyService.getByCustomerAndStore(
  'customer-id',
  'store-id'
);

// Resgatar prêmio
await loyaltyService.redeemReward('customer-id', 'store-id');
```

---

## 🐛 Problemas Comuns

### "Invalid API key"
- Verifique `.env`
- Reinicie o servidor

### "relation does not exist"
- Execute o SQL no Supabase
- Aguarde alguns segundos

### "JWT expired"
- Faça logout e login novamente

---

## 📞 Suporte

- **Docs:** https://supabase.com/docs
- **Dashboard:** https://fwtvjjejycorwukqzwjc.supabase.co

---

**Pronto!** 🎉 Seu projeto está configurado com Supabase.
