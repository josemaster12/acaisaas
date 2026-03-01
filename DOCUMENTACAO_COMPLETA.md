# 🍇 Pronto Açaí Now - Documentação Completa

## 📋 Visão Geral

**Pronto Açaí Now** é uma plataforma completa para gerenciamento de lojas de açaí, permitindo que clientes façam pedidos online e lojistas gerenciem suas operações.

### 🎯 Funcionalidades Principais

- 🛒 **Cardápio Online** com personalização de produtos
- 📱 **Pedidos via WhatsApp** integrados
- 👥 **Sistema de Clientes** com cadastro e login
- 🏪 **Multi-lojas** com painéis individuais
- 🎁 **Programa de Fidelidade** (10 compras = 1 açaí grátis)
- 📊 **Painel Administrativo** completo
- 🛵 **Acompanhamento de Pedidos** em tempo real
- 🔐 **Recuperação de Senha** automática

---

## 🏗️ Arquitetura do Sistema

### Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|-----------|
| **Frontend** | React 18.3 + TypeScript |
| **Build Tool** | Vite 5.4 |
| **Estilização** | TailwindCSS 3.4 |
| **Componentes UI** | Radix UI + shadcn/ui |
| **Rotas** | React Router 6.30 |
| **Estado** | Context API + React Query |
| **Ícones** | Lucide React |
| **PWA** | Vite PWA Plugin |

### Estrutura de Pastas

```
pronto-acai-now-main/
├── src/
│   ├── assets/              # Imagens e arquivos estáticos
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/             # Componentes UI (Radix)
│   │   ├── products/       # Componentes de produtos
│   │   ├── orders/         # Componentes de pedidos
│   │   └── settings/       # Configurações
│   ├── contexts/           # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/               # Dados mockados
│   │   └── mockData.ts
│   ├── pages/              # Páginas do site
│   │   ├── Index.tsx
│   │   ├── Menu.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Login.tsx
│   │   ├── CustomerRegister.tsx
│   │   ├── CustomerProfile.tsx
│   │   ├── RecoverPassword.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── StoreDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── DebugPage.tsx
│   ├── services/           # APIs e serviços
│   │   ├── api.ts
│   │   └── mockApi.ts
│   ├── types/              # Tipos TypeScript
│   └── App.tsx             # Rotas principais
├── backend/                # Backend (Node.js + Express)
├── package.json
└── README.md
```

---

## 👥 Tipos de Usuários

### 1. 🟢 Cliente Consumidor

**Para quem:** Pessoas que querem fazer pedidos de açaí

**Cadastro:** `/cadastro`

**Campos do Cadastro:**
- Nome completo *
- WhatsApp (somente números com DDD) *
- E-mail *
- Endereço:
  - Rua *
  - Número *
  - Bairro *
  - Cidade *
  - Ponto de Referência (opcional)
- Senha * (mínimo 6 caracteres)
- Confirmar Senha *

**Funcionalidades:**
- ✅ Fazer pedidos online
- ✅ Personalizar produtos (tamanhos, adicionais)
- ✅ Acompanhar status do pedido
- ✅ Programa de fidelidade (pontos)
- ✅ Histórico de pedidos
- ✅ Endereço salvo para próximos pedidos
- ✅ Recuperação de senha

**Acesso:**
- Login: `/login`
- Perfil: `/meu-perfil`
- Recuperação: `/recuperar-senha`

---

### 2. 🟣 Lojista (Dono de Loja)

**Para quem:** Pessoas que querem ter uma loja de açaí

**Cadastro:** `/cadastro-lojista`

**Campos do Cadastro:**
- Nome completo *
- E-mail *
- Senha * (mínimo 6 caracteres)
- Confirmar Senha *

**Funcionalidades:**
- ✅ Criar múltiplas lojas
- ✅ Cadastrar produtos com tamanhos e preços
- ✅ Gerenciar categorias de produtos
- ✅ Receber e gerenciar pedidos
- ✅ Atualizar status dos pedidos
- ✅ Configurar loja (horários, taxas, cores)
- ✅ Ativar/desativar programa de fidelidade
- ✅ Ver estatísticas da loja

**Acesso:**
- Dashboard: `/dashboard`
- Loja específica: `/dashboard/loja/:id`

---

### 3. 🔴 Administrador Global

**Para quem:** Administrador da plataforma

**Credenciais Padrão:**
- Email: `josetecnico21@gmail.com`
- Senha: `tenderbr0`

**Funcionalidades:**
- ✅ Ver TODAS as lojas da plataforma
- ✅ Ativar/Desativar lojas
- ✅ Excluir lojas permanentemente
- ✅ Alterar senha de lojistas
- ✅ Acessar dashboard de qualquer loja
- ✅ Estatísticas gerais da plataforma

**Acesso:**
- Painel Admin: `/admin`

---

## 📄 Páginas e Rotas

### 🌍 Rotas Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Index | Home/Cardápio da loja |
| `/cardapio` | Menu | Cardápio completo |
| `/carrinho` | Cart | Carrinho de compras |
| `/checkout` | Checkout | Finalização do pedido |
| `/loja/:slug` | Index | Cardápio de loja específica |

### 🔐 Rotas de Autenticação

| Rota | Página | Descrição |
|------|--------|-----------|
| `/login` | Login | Login de usuários |
| `/cadastro` | CustomerRegister | Cadastro de cliente |
| `/cadastro-lojista` | Register | Cadastro de lojista |
| `/recuperar-senha` | RecoverPassword | Recuperação de senha |

### 👤 Rotas do Cliente

| Rota | Página | Descrição |
|------|--------|-----------|
| `/meu-perfil` | CustomerProfile | Perfil do cliente |

### 🏪 Rotas do Lojista

| Rota | Página | Descrição |
|------|--------|-----------|
| `/dashboard` | Dashboard | Lista de lojas do lojista |
| `/dashboard/loja/:id` | StoreDashboard | Gestão de uma loja |

### 🛡️ Rotas do Admin

| Rota | Página | Descrição |
|------|--------|-----------|
| `/admin` | AdminDashboard | Painel administrativo |

### 🔧 Rotas de Desenvolvimento

| Rota | Página | Descrição |
|------|--------|-----------|
| `/debug` | DebugPage | Debug de dados mockados |

---

## 🎯 Funcionalidades Detalhadas

### 1. 🛒 Sistema de Pedidos

#### Fluxo do Cliente:

```
1. Acessa o cardápio (/)
2. Seleciona produto
3. Escolhe tamanho (P, M, G, GG)
4. Adiciona complementos:
   - Grátis (banana, morango, granola, etc.)
   - Pagos (Nutella, Ovomaltine, etc.)
5. Adiciona observações (opcional)
6. Vai para o carrinho
7. Finaliza pedido
8. Preenche endereço (ou usa salvo)
9. Escolhe forma de pagamento
10. Pedido enviado para WhatsApp da loja
```

#### Status do Pedido:

| Status | Ícone | Cor | Descrição |
|--------|-------|-----|-----------|
| `pendente` | ⏳ | Amarelo | Aguardando início |
| `em_preparo` | 👨‍🍳 | Azul | Sendo preparado |
| `saiu_para_entrega` | 🛵 | Roxo | Sendo entregue |
| `entregue` | ✅ | Verde | Finalizado |
| `cancelado` | ❌ | Vermelho | Cancelado |

#### Fluxo do Lojista:

```
1. Recebe pedido no WhatsApp
2. Acessa dashboard da loja
3. Vai em "Pedidos"
4. Vê pedido como "Pendente"
5. Clica em "Iniciar Preparo" → Status: Em Preparo
6. Após pronto, clica em "Saiu para Entrega"
7. Após entrega, clica em "Marcar como Entregue"
```

---

### 2. 🎁 Programa de Fidelidade

#### Como Funciona:

```
Cliente faz pedido → Ganha 1 ponto
Completa 10 pontos → Ganha 1 açaí grátis
Resgata prêmio → Cupom de 100% desconto
```

#### Configuração (Lojista):

No painel da loja → Configurações:
- **Ativar Fidelidade:** Sim/Não
- **Pontos para Prêmio:** 1-100 (padrão: 10)
- **Descrição do Prêmio:** Texto personalizado

#### Benefícios (Cliente):

No `/meu-perfil` → Fidelidade:
- Barra de progresso visual
- Estrelas preenchidas (⭐⭐⭐⭐⭐⭐⭐☆☆☆)
- Histórico de pontos ganhos
- Botão de resgate quando completo
- Cupom gerado automaticamente

#### Dados Salvos:

```javascript
// localStorage
{
  "loyalty-customerId": {
    "enabled": true,
    "points": 7,
    "maxPoints": 10,
    "rewardDescription": "Ganhe 1 açaí grátis!"
  }
}
```

---

### 3. 🔐 Sistema de Autenticação

#### Cadastro de Cliente:

**Endpoint Mock:** `customerAPI.register()`

**Dados Salvos:**
```javascript
{
  id: 'customer-123',
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '11999999999',
  password: 'senha123',
  address: {
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    reference: 'Próximo à padaria'
  }
}
```

#### Login:

**Tipos:**
- Cliente → Redireciona para home
- Lojista → Redireciona para dashboard da loja
- Admin → Redireciona para `/admin`

#### Recuperação de Senha:

**Fluxo:**
```
1. Clica em "Esqueceu a senha?"
2. Digita e-mail
3. Sistema gera senha temporária (8 caracteres)
4. Senha válida por 15 minutos
5. Cliente copia e faz login
6. Pode mudar senha nas configurações
```

**Dados Salvos:**
```javascript
{
  tempPassword: 'aB3xY9mK',
  tempPasswordExpiry: '2025-02-28T15:45:00Z'
}
```

---

### 4. 🏪 Gestão de Lojas

#### Criar Loja:

**Fluxo:**
```
1. Lojista faz login
2. Vai para /dashboard
3. Clica em "Nova Loja"
4. Preenche:
   - Nome da loja
   - Slug (URL)
   - Descrição
   - WhatsApp
   - Cor principal
5. Loja criada e vinculada ao usuário
```

#### Configurações da Loja:

**Dados:**
- Nome
- Slug (URL única)
- Descrição
- WhatsApp
- Cor principal
- Horário de funcionamento
- Taxa de entrega
- Pedido mínimo
- Tempo estimado
- Limite de acompanhamentos grátis
- Programa de fidelidade (ativar/desativar)

#### Produtos:

**Campos:**
- Nome
- Descrição
- Imagem
- Categoria (Tradicional, Frutas, Especiais, Combos)
- Tamanhos (P, M, G, GG) com preços
- Destaque (sim/não)

**Tamanhos Padrão:**
| Tamanho | ML | Preço Base |
|---------|-----|-----------|
| P | 300ml | R$ 12,00 |
| M | 500ml | R$ 18,00 |
| G | 700ml | R$ 24,00 |
| GG | 1000ml | R$ 32,00 |

---

### 5. 🛡️ Painel Administrativo

#### Funcionalidades:

**Lista de Lojas:**
- Ver todas as lojas
- Filtrar por status (ativa/inativa)
- Ordenar por data

**Ações por Loja:**
| Botão | Ação | Ícone |
|-------|------|-------|
| 🔓 Painel | Acessar dashboard | LogIn |
| 🔗 Site | Abrir site público | ExternalLink |
| 🔑 Senha | Alterar senha | Key |
| 👁 Ativar/Desativar | Mudar status | Eye/EyeOff |
| 🗑 Excluir | Remover loja | Trash2 |

**Estatísticas:**
- Total de lojas
- Lojas ativas
- Lojas inativas

**Dialog de Exclusão:**
- Confirmação com alerta vermelho
- Aviso de ação irreversível

---

## 💾 Estrutura de Dados

### Cliente (Customer)

```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    reference: string;
  };
  created_at: string;
}
```

### Loja (Store)

```typescript
interface Store {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo?: string;
  primary_color: string;
  whatsapp: string;
  is_active: boolean;
  loyalty_enabled: boolean;
  loyalty_points: number;
  delivery_fee: number;
  min_order: number;
  openHour: number;
  closeHour: number;
  estimatedTime: string;
  created_at: string;
}
```

### Produto (Product)

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'tradicional' | 'frutas' | 'especiais' | 'combos';
  sizes: {
    size: string;
    ml: number;
    price: number;
  }[];
  featured: boolean;
}
```

### Pedido (Order)

```typescript
interface Order {
  id: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    price: number;
    quantity: number;
    toppings: { name: string; price: number }[];
    notes?: string;
  }[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: 'dinheiro' | 'pix' | 'cartao';
  status: 'pendente' | 'em_preparo' | 'saiu_para_entrega' | 'entregue' | 'cancelado';
  created_at: string;
  estimated_time?: string;
}
```

### Programa de Fidelidade (Loyalty)

```typescript
interface LoyaltyProgram {
  enabled: boolean;
  points: number;
  maxPoints: number;
  rewardDescription: string;
}
```

---

## 🔧 APIs e Serviços

### Customer API

```typescript
customerAPI.register(data)      // Cadastrar cliente
customerAPI.login(email, pass)  // Login cliente
customerAPI.getAll()            // Listar clientes (admin)
```

### Auth API

```typescript
authAPI.login(email, pass)      // Login lojista/admin
authAPI.register(email, pass, name)  // Registro lojista
authAPI.changePassword(userId, newPass)  // Alterar senha
```

### Stores API

```typescript
storesAPI.getAll(userId, isAdmin)  // Listar lojas
storesAPI.getAllStores()           // Todas lojas (admin)
storesAPI.getById(id)              // Buscar por ID
storesAPI.create(data)             // Criar loja
storesAPI.update(id, data)         // Atualizar loja
storesAPI.deactivate(id)           // Desativar loja
storesAPI.activate(id)             // Ativar loja
storesAPI.delete(id)               // Excluir loja
```

### Products API

```typescript
productsAPI.getByStore(id)    // Listar produtos da loja
productsAPI.create(data)      // Criar produto
productsAPI.update(id, data)  // Atualizar produto
productsAPI.delete(id)        // Excluir produto
```

### Orders API

```typescript
ordersAPI.create(data)           // Criar pedido
ordersAPI.getByStore(id, status) // Listar pedidos
ordersAPI.updateStatus(id, status) // Atualizar status
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm ou bun

### Instalação

```bash
# Clonar repositório
git clone <url>

# Entrar na pasta
cd pronto-acai-now-main

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da produção
npm run preview
```

### URLs de Acesso

**Desenvolvimento:** `http://localhost:5173`

**Credenciais de Teste:**

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | `josetecnico21@gmail.com` | `tenderbr0` |
| Lojista | `admin@prontoacai.com` | `123456` |

---

## 📱 Recursos PWA

O projeto é um **Progressive Web App** (PWA) com:

- ✅ Instalação como app nativo
- ✅ Funcionamento offline (básico)
- ✅ Service Worker configurado
- ✅ Manifesto para instalação
- ✅ Ícones para mobile

### Instalar no Celular:

**Android (Chrome):**
1. Acessar site
2. Menu (3 pontos)
3. "Adicionar à tela inicial"

**iOS (Safari):**
1. Acessar site
2. Botão compartilhar
3. "Adicionar à Tela de Início"

---

## 🎨 Design System

### Cores

| Cor | Código | Uso |
|-----|--------|-----|
| Roxo (Primária) | `#8B5CF6` | Botões, links, destaques |
| Rosa (Secundária) | `#EC4899` | Gradientes, detalhes |
| Verde (Sucesso) | `#22C55E` | Confirmações, ativo |
| Amarelo (Atenção) | `#EAB308` | Pendente, alerta |
| Vermelho (Erro) | `#EF4444` | Erro, cancelar, inativo |
| Azul (Info) | `#3B82F6` | Em preparo, informação |

### Componentes UI

Baseados em **Radix UI** + **shadcn/ui**:

- Button (variants: default, outline, ghost, destructive)
- Card
- Input
- Label
- Badge
- Dialog
- Alert
- Tabs
- Switch
- Sheet (mobile menu)
- Toast/Sonner

---

## 🔒 Segurança

### Desenvolvimento (Mock)

⚠️ **Atenção:** Este é um ambiente de desenvolvimento.

**Dados mockados:**
- Senhas em texto puro (não usar em produção)
- Tokens JWT fictícios
- localStorage para persistência
- Sem criptografia

### Produção (Recomendações)

**Implementar:**
- [ ] Hash de senhas (bcrypt)
- [ ] JWT com expiração
- [ ] HTTPS obrigatório
- [ ] Validação de tokens no backend
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Sanitização de inputs
- [ ] Proteção CSRF

---

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor dev (Vite)

# Build
npm run build        # Build para produção
npm run build:dev    # Build modo development

# Lint
npm run lint         # ESLint

# Testes
npm run test         # Vitest (run once)
npm run test:watch   # Vitest (watch mode)

# Preview
npm run preview      # Preview do build
```

---

## 🐛 Debug e Solução de Problemas

### Página de Debug

Acesse `/debug` para ver:
- Dados mockados carregados
- Lojas cadastradas
- Conteúdo do localStorage
- Links úteis

### Console do Navegador

**Logs importantes:**
```
[MOCK] Inicializado com X usuários e Y lojas
[MOCK CUSTOMER] Cliente cadastrado
[MOCK CUSTOMER LOGIN] Login bem sucedido
[AdminDashboard] Lojas carregadas: [...]
```

### Limpar Dados

```javascript
// No console do navegador:
localStorage.clear()
// Recarregar página
location.reload()
```

### Problemas Comuns

**1. Lojas não aparecem no admin:**
- Verificar se está logado como admin
- Limpar localStorage
- Recarregar página

**2. Login não funciona:**
- Verificar credenciais
- Limpar localStorage
- Verificar console para erros

**3. Pedido não envia:**
- Verificar WhatsApp da loja configurado
- Verificar permissão para abrir WhatsApp

---

## 📝 Changelog

### Versão Atual

**Funcionalidades Implementadas:**
- ✅ Cadastro de cliente com endereço completo
- ✅ Login de cliente, lojista e admin
- ✅ Recuperação de senha
- ✅ Programa de fidelidade
- ✅ Status "Saiu para Entrega"
- ✅ Painel administrativo completo
- ✅ Alteração de senha (admin)
- ✅ Ativar/desativar/excluir lojas (admin)
- ✅ Histórico de pedidos do cliente
- ✅ Endereço automático no checkout
- ✅ PWA configurado

**Em Desenvolvimento:**
- [ ] Backend completo (Node.js + Express)
- [ ] Banco de dados (PostgreSQL)
- [ ] Envio de e-mail real
- [ ] Pagamento online
- [ ] Notificações push

---

## 🤝 Contribuição

### Como Contribuir

1. Fork o projeto
2. Crie branch para feature (`git checkout -b feature/nova-feature`)
3. Commit mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para branch (`git push origin feature/nova-feature`)
5. Abra Pull Request

### Padrões de Código

- TypeScript para todo código novo
- Seguir convenções de nomenclatura do projeto
- Componentes funcionais com React Hooks
- CSS com TailwindCSS
- Commits descritivos

---

## 📄 Licença

Este projeto está sob licença MIT.

---

## 📞 Contato e Suporte

**Email:** suporte@prontoacainow.com

**WhatsApp:** (11) 99999-9999

**Documentação:** `/ADMIN_LOJAS.md`

---

## 🙏 Agradecimentos

- **Vite** - Build tool rápida
- **React** - Biblioteca UI
- **TailwindCSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **shadcn/ui** - Componentes bonitos
- **Lucide** - Ícones modernos

---

**Desenvolvido com ❤️ para lojas de açaí**

🍇 **Pronto Açaí Now** - © 2025 Todos os direitos reservados
