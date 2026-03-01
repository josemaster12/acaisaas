# 🍧 Pronto Açaí Now - Sistema SaaS para Lojas de Açaí

Sistema completo e multi-tenant para gerenciamento de lojas de açaí, com painel administrativo, página pública da loja, e finalização de pedidos via WhatsApp.

## ✨ Funcionalidades

### Para o Dono da Loja

- **Dashboard Completo**
  - Visão geral com total de produtos, pedidos e receita
  - Gráficos e analytics (plano Premium)
  - Pedidos em tempo real

- **Gerenciamento de Produtos**
  - CRUD completo de produtos
  - Upload de imagens
  - Controle de estoque
  - Tamanhos variados (300ml, 500ml, 700ml, 1L)
  - Adicionais/opcionais com preço extra
  - Produtos em destaque

- **Gerenciamento de Pedidos**
  - Acompanhamento em tempo real
  - Atualização de status (Pendente → Em Preparo → Entregue)
  - Histórico completo

- **Configurações da Loja**
  - Personalização (nome, logo, cor principal)
  - Horário de funcionamento
  - Taxa de entrega e valor mínimo
  - WhatsApp para pedidos

### Para o Cliente

- **Página Pública da Loja**
  - URL personalizada (prontoacai.com/loja/nome-da-loja)
  - Cardápio completo com fotos
  - Filtro por categorias
  - Busca por nome

- **Carrinho de Compras**
  - Seleção de tamanhos e adicionais
  - Cálculo automático do total
  - Persistência no localStorage

- **Finalização via WhatsApp**
  - Pedido formatado automaticamente
  - Envio direto para o WhatsApp da loja
  - Sem necessidade de cadastro

## 🏗️ Arquitetura

### Frontend
- **React 18** com TypeScript
- **Vite** para build
- **TailwindCSS** para estilização
- **shadcn/ui** para componentes
- **React Router** para navegação
- **React Query** para estado do servidor

### Backend
- **Node.js** com Express
- **PostgreSQL** (Supabase)
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **API REST** organizada em controllers, services e routes

### Banco de Dados
- **Supabase** (PostgreSQL)
- **Row Level Security (RLS)** para segurança multi-tenant
- Tabelas principais:
  - `users` (auth.users do Supabase)
  - `stores` (lojas)
  - `products` (produtos)
  - `categories` (categorias)
  - `orders` (pedidos)
  - `order_items` (itens do pedido)
  - `addons` (adicionais)
  - `subscriptions` (planos SaaS)
  - `plans` (planos disponíveis)

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- PostgreSQL ou conta no Supabase
- npm ou bun

### 1. Instalar Dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

**Frontend (.env)**
```env
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_PROJECT_ID=seu_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
VITE_API_URL=http://localhost:3333
```

**Backend (backend/.env)**
```env
PORT=3333
NODE_ENV=development

# Supabase PostgreSQL
SUPABASE_DB_URL=postgresql://postgres:senha@ref.supabase.co:5432/postgres

# JWT
JWT_SECRET=sua_chave_secreta_jwt

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### 3. Configurar Banco de Dados

Execute o script SQL no Supabase:

```bash
# No Supabase SQL Editor, execute:
backend/database/schema.sql
```

### 4. Rodar a Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

O backend rodará em `http://localhost:3333`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

O frontend rodará em `http://localhost:5173`

## 📱 Rotas da Aplicação

### Públicas
- `/` - Página inicial
- `/loja/:slug` - Página pública da loja
- `/cardapio` - Cardápio completo
- `/carrinho` - Carrinho de compras
- `/checkout` - Finalização do pedido

### Autenticação
- `/login` - Login do dono da loja
- `/cadastro` - Cadastro de nova conta

### Dashboard (Protegido)
- `/dashboard` - Visão geral das lojas
- `/dashboard/loja/:storeId` - Dashboard da loja específica
  - Produtos
  - Pedidos
  - Configurações

## 💎 Planos SaaS

### Gratuito
- Até 10 produtos
- Até 50 pedidos/mês
- Suporte básico

### Profissional (R$ 49,90/mês)
- Produtos ilimitados
- Até 500 pedidos/mês
- Suporte prioritário
- Analytics básico

### Premium (R$ 99,90/mês)
- Produtos ilimitados
- Pedidos ilimitados
- Suporte 24/7
- Analytics completo
- Relatórios PDF

## 🔒 Segurança

- **Autenticação JWT** com expiração de 7 dias
- **Row Level Security (RLS)** no PostgreSQL
- **Hash de senhas** com bcrypt
- **Validação de dados** no backend
- **Sanitização de inputs**
- **CORS** configurado
- **Headers de segurança**

## 📁 Estrutura do Projeto

```
pronto-acai-now/
├── src/                      # Frontend
│   ├── components/           # Componentes React
│   │   ├── products/         # Componentes de produtos
│   │   ├── orders/           # Componentes de pedidos
│   │   └── settings/         # Componentes de configurações
│   ├── contexts/             # Contextos React
│   ├── pages/                # Páginas da aplicação
│   ├── services/             # Serviços de API
│   └── ...
├── backend/                  # Backend
│   ├── config/               # Configurações
│   ├── controllers/          # Controllers da API
│   ├── middleware/           # Middlewares (auth, upload)
│   ├── routes/               # Rotas da API
│   ├── services/             # Serviços de negócio
│   ├── database/             # Scripts SQL
│   └── src/                  # Código fonte backend
└── ...
```

## 🛠️ Tecnologias

| Frontend | Backend |
|----------|---------|
| React 18 | Node.js |
| TypeScript | Express |
| Vite | PostgreSQL |
| TailwindCSS | JWT |
| shadcn/ui | Multer |
| React Router | bcryptjs |
| React Query | jsonwebtoken |

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

### Lojas
- `GET /api/stores/my` - Minhas lojas
- `POST /api/stores` - Criar loja
- `GET /api/stores/:id` - Detalhes da loja
- `PUT /api/stores/:id` - Atualizar loja
- `GET /api/stores/slug/:slug` - Loja por slug (público)

### Produtos
- `GET /api/products/store/:storeId` - Produtos da loja
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Excluir produto

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/store/:storeId` - Pedidos da loja
- `PATCH /api/orders/:id/status` - Atualizar status

## 🔄 Próximos Passos

- [ ] Integração com Stripe/Mercado Pago para assinaturas
- [ ] Subdomínios automáticos (loja.prontoacai.com)
- [ ] PWA instalável
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] App mobile (React Native)

## 📄 Licença

MIT - Ver arquivo LICENSE

## 👨‍💻 Desenvolvedor

Pronto Açaí Now - Sistema SaaS para delivery de açaí

---

**Feito com ❤️ para revolucionar o delivery de açaí!** 🍧
