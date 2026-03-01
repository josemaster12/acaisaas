# Pronto Açaí Now - SaaS

Sistema de gerenciamento de pedidos de açaí para lojistas.

## 🚀 Deploy

O projeto está disponível em:
- **Produção:** https://acaisaas3.vercel.app
- **Cadastro de Lojista:** https://acaisaas3.vercel.app/cadastro-lojista

## 📋 Variáveis de Ambiente

Configure no `.env` ou na Vercel:

```env
# Supabase (Obrigatório)
VITE_SUPABASE_URL=https://fwtvjjejycorwukqzwjc.supabase.co
VITE_SUPABASE_PROJECT_ID=fwtvjjejycorwukqzwjc
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT

# Mock Mode (false = produção, true = desenvolvimento)
VITE_USE_MOCK=false
```

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📁 Estrutura

```
├── src/
│   ├── components/     # Componentes React
│   ├── contexts/       # Contextos (Auth, etc)
│   ├── lib/            # Configurações (Supabase, utils)
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços de API
│   └── App.tsx         # App principal
├── public/             # Arquivos estáticos
├── package.json
├── vite.config.ts
└── vercel.json
```

## 🔧 Supabase

### Desabilitar Confirmação de Email

1. Acesse: https://supabase.com/dashboard/project/fwtvjjejycorwukqzwjc/auth/settings
2. Desmarque **"Enable email confirmations"**
3. Clique em **"Save"**

### Confirmar Usuários Existentes

Execute no SQL Editor do Supabase:

```sql
UPDATE auth.users
SET confirmed_at = NOW(), email_confirmed_at = NOW()
WHERE confirmed_at IS NULL OR email_confirmed_at IS NULL;
```

## 📄 Licença

MIT
