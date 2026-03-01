# 🔧 Guia de Configuração do Supabase

## 📋 Visão Geral

Este guia mostra como configurar o projeto para se conectar com o banco de dados Supabase.

---

## 🎯 Projeto Supabase

**URL:** `https://fwtvjjejycorwukqzwjc.supabase.co`
**Project ID:** `fwtvjjejycorwukqzwjc`
**Project Name:** `acaisaas`

---

## 🚀 Passos para Configuração

### 1. **Configurar Banco de Dados no Supabase**

1. Acesse https://supabase.com
2. Faça login na sua conta
3. Selecione o projeto `acaisaas`
4. Vá para **SQL Editor** no menu lateral
5. Clique em **New Query**
6. Copie e cole o conteúdo do arquivo `supabase-schema.sql`
7. Clique em **Run** para executar o script

**O script cria:**
- ✅ Todas as tabelas (profiles, stores, products, orders, loyalty_programs, coupons)
- ✅ Índices para performance
- ✅ Triggers para updated_at
- ✅ Row Level Security (RLS)
- ✅ Policies de segurança
- ✅ Função para criar perfil automaticamente

---

### 2. **Configurar Variáveis de Ambiente**

O arquivo `.env` já está configurado com:

```env
VITE_SUPABASE_URL=https://fwtvjjejycorwukqzwjc.supabase.co
VITE_SUPABASE_PROJECT_ID=fwtvjjejycorwukqzwjc
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT
VITE_USE_MOCK=false
```

⚠️ **Importante:** Verifique se a API Key está correta!

---

### 3. **Criar Usuário Admin**

1. No Supabase, vá para **Authentication** → **Users**
2. Clique em **Add User**
3. Preencha:
   - Email: `josetecnico21@gmail.com`
   - Senha: `tenderbr0`
   - **Marque:** "Confirm email"
4. Após criar, vá em **SQL Editor**
5. Execute:

```sql
-- Atualizar usuário para admin
UPDATE profiles
SET role = 'admin'
WHERE email = 'josetecnico21@gmail.com';
```

---

### 4. **Testar Conexão**

No terminal do projeto:

```bash
# Instalar dependências (se necessário)
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` e faça login com:
- Email: `josetecnico21@gmail.com`
- Senha: `tenderbr0`

---

## 📁 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/supabase.ts` | Cliente Supabase configurado |
| `src/lib/database.types.ts` | Tipos TypeScript do banco |
| `src/lib/supabase.services.ts` | Serviços para CRUD |
| `supabase-schema.sql` | Script SQL completo |
| `SUPABASE_SETUP.md` | Este guia |

---

## 🔑 Estrutura do Banco de Dados

### Tabelas Principais:

```
profiles (perfis de usuários)
├── id (UUID, PK)
├── email (TEXT, unique)
├── name (TEXT)
├── phone (TEXT)
├── role (customer | owner | admin)
└── ...

stores (lojas)
├── id (UUID, PK)
├── owner_id (FK → profiles)
├── name (TEXT)
├── slug (TEXT, unique)
├── is_active (BOOLEAN)
├── loyalty_enabled (BOOLEAN)
└── ...

products (produtos)
├── id (UUID, PK)
├── store_id (FK → stores)
├── name (TEXT)
├── category (TEXT)
├── sizes (JSONB)
└── ...

orders (pedidos)
├── id (UUID, PK)
├── store_id (FK → stores)
├── customer_id (FK → profiles)
├── status (TEXT)
├── total (DECIMAL)
└── ...

loyalty_programs (fidelidade)
├── id (UUID, PK)
├── customer_id (FK → profiles)
├── store_id (FK → stores)
├── points (INTEGER)
└── ...

coupons (cupons)
├── id (UUID, PK)
├── customer_id (FK → profiles)
├── code (TEXT, unique)
└── ...
```

---

## 🔄 Migrando Dados do Mock

Se você tem dados no localStorage e quer migrar para o Supabase:

### 1. Exportar Dados do Mock

No console do navegador (com o site aberto):

```javascript
// Exportar clientes
const customers = JSON.parse(localStorage.getItem('mock-customers') || '[]');
console.log(JSON.stringify(customers, null, 2));

// Exportar lojas
const stores = JSON.parse(localStorage.getItem('mock-stores') || '[]');
console.log(JSON.stringify(stores, null, 2));
```

### 2. Inserir no Supabase

Use o SQL Editor ou os serviços TypeScript:

```typescript
import { supabase } from './lib/supabase';

// Inserir lojas
await supabase
  .from('stores')
  .insert(mockStoresData);
```

---

## 🛠️ Usando os Serviços

### Exemplo: Criar Loja

```typescript
import { storesService } from '@/lib/supabase.services';

const store = await storesService.create({
  owner_id: 'uuid-do-usuario',
  name: 'Açaí Express',
  slug: 'acai-express',
  whatsapp: '11999999999',
  primary_color: '#8B5CF6',
  loyalty_enabled: true,
  loyalty_points: 10,
});
```

### Exemplo: Buscar Pedidos

```typescript
import { ordersService } from '@/lib/supabase.services';

const orders = await ordersService.getByStore('store-id', 'pendente');
```

### Exemplo: Adicionar Pontos de Fidelidade

```typescript
import { loyaltyService } from '@/lib/supabase.services';

await loyaltyService.addPoints('customer-id', 'store-id', 1);
```

---

## 🔒 Row Level Security (RLS)

O banco está configurado com RLS ativado. As policies garantem:

- ✅ Clientes veem apenas seus próprios dados
- ✅ Lojistas veem apenas suas lojas e pedidos
- ✅ Admin vê todos os dados
- ✅ Qualquer um pode ver lojas ativas e produtos

---

## 🐛 Troubleshooting

### Erro: "Invalid API key"

**Solução:**
1. Verifique se a key no `.env` está correta
2. A key deve começar com `sb_publishable_` ou `eyJ...`
3. Reinicie o servidor de desenvolvimento

### Erro: "relation does not exist"

**Solução:**
1. Execute o script `supabase-schema.sql` no Supabase
2. Verifique se as tabelas foram criadas
3. Aguarde alguns segundos e tente novamente

### Erro: "JWT expired"

**Solução:**
1. Faça logout e login novamente
2. O token é renovado automaticamente

---

## 📊 Dashboard do Supabase

Acesse o dashboard em:
https://fwtvjjejycorwukqzwjc.supabase.co

**Menu:**
- **Authentication** → Usuários cadastrados
- **Database** → Tabelas e dados
- **SQL Editor** → Executar queries SQL
- **API Settings** → Chaves da API

---

## 🚀 Próximos Passos

1. ✅ Configurar banco de dados (executar SQL)
2. ✅ Criar usuário admin
3. ✅ Testar conexão
4. ⚠️ Atualizar serviços para usar Supabase (em vez de mock)
5. ⚠️ Migrar dados existentes (opcional)
6. ⚠️ Configurar email templates (opcional)

---

## 📞 Suporte

**Documentação Supabase:** https://supabase.com/docs
**Discord Supabase:** https://discord.supabase.com

---

**Projeto:** acaisaas
**Versão:** 1.0.0
**Atualizado:** 2025-02-28
