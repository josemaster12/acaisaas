# Painel Administrativo e Redirecionamento de Lojas

## Mudanças Implementadas

### 1. Administrador Global

Foi criado um usuário administrador global com credenciais fixas:

- **Email:** `josetecnico21@gmail.com`
- **Senha:** `tenderbr0`

### 2. Novo Fluxo de Login

O sistema agora redireciona os usuários de forma inteligente:

- **Admin** → `/admin` (Painel Administrativo)
- **Lojista com 1+ lojas** → `/dashboard/loja/:id` (Dashboard da primeira loja)
- **Lojista sem lojas** → `/dashboard` (Dashboard geral para criar loja)

### 3. Painel Administrativo (`/admin`)

O administrador global pode:

- ✅ **Ver todas as lojas** cadastradas na plataforma
- ✅ **Ativar lojas** inativas
- ✅ **Desativar lojas** ativas
- ✅ **Excluir lojas** permanentemente (com confirmação)
- ✅ **Alterar senha** do lojista de cada loja
- ✅ **Acessar painel** da loja (como admin)
- ✅ **Acessar site público** da loja em nova aba
- ✅ **Visualizar stats** gerais (total, ativas, inativas)

### 4. Dashboard do Lojista

Quando um lojista faz login:

- Se tiver **apenas uma loja**: vai direto para `/dashboard/loja/:id`
- Se tiver **múltiplas lojas**: vai para `/dashboard` para selecionar
- Se **não tiver lojas**: vai para `/dashboard` com opção de criar

### 5. Estrutura de Usuários

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: 'user' | 'admin'; // Novo campo
}
```

### 6. Novas APIs

#### Frontend (`src/services/api.ts`)

```typescript
storesAPI.getAll(userId?, isAdmin?)  // Lista lojas (todas se admin)
storesAPI.getAllStores()              // Lista todas as lojas
storesAPI.activate(id)                // Ativa loja
storesAPI.delete(id)                  // Exclui loja
authAPI.changePassword(userId, newPassword)  // Altera senha
```

#### Mock (`src/services/mockApi.ts`)

- `mockStoresAPI.getAll(userId, isAdmin)` - Suporta admin
- `mockStoresAPI.getAllStores()` - Todas as lojas
- `mockStoresAPI.activate(id)` - Ativar loja
- `mockStoresAPI.delete(id)` - Excluir loja
- `mockAuthAPI.changePassword(userId, newPassword)` - Alterar senha

### 7. Arquivos Criados/Modificados

#### Criados:
- `src/pages/AdminDashboard.tsx` - Página do painel administrativo
- `src/pages/DebugPage.tsx` - Página de debug (desenvolvimento)

#### Modificados:
- `src/data/mockData.ts` - Adicionado campo `role` e usuário admin
- `src/services/mockApi.ts` - Novas funções de admin + logs de debug
- `src/services/api.ts` - Novos endpoints + wait para mock ready
- `src/contexts/AuthContext.tsx` - User com role
- `src/pages/Login.tsx` - Redirecionamento inteligente
- `src/pages/Dashboard.tsx` - Redirecionamento se 1 loja
- `src/App.tsx` - Rotas `/admin` e `/debug`

## Como Testar

### Login como Admin

1. Acesse `http://localhost:5173/login`
2. Use:
   - Email: `josetecnico21@gmail.com`
   - Senha: `tenderbr0`
3. Você será redirecionado para `/admin`
4. **Deve ver 2 lojas:** "Açaí Express" e "Açaí & Cia"

### Login como Lojista

1. Crie uma nova loja em `/cadastro` ou use:
   - Email: `admin@prontoacai.com`
   - Senha: `123456`
2. Você será redirecionado para `/dashboard/loja/:id`

### Criar Nova Loja

1. Faça login como lojista
2. No dashboard, clique em "Nova Loja"
3. Preencha dados da loja E dados de acesso
4. Após criar, você será redirecionado para o dashboard da nova loja

## Debug e Solução de Problemas

### Página de Debug

Acesse `http://localhost:5173/debug` para ver:

- Dados mockados carregados
- Lojas cadastradas
- Conteúdo do localStorage
- Links úteis

### Painel Admin tem Debug Info

No `/admin`, há um card amarelo no topo mostrando:

- Usuário logado e role
- Quantidade de lojas carregadas
- Lista de lojas com respectivos owners
- Status do localStorage

### Console do Navegador

Pressione **F12** e veja os logs:

```
[MOCK] Inicializado com X usuários e Y lojas
[MOCK] Lojas iniciais: [...]
[MOCK getAllStores] Retornando Y lojas
[AdminDashboard] Carregando todas as lojas...
[AdminDashboard] Lojas carregadas: [...]
```

### Se as Lojas Não Aparecerem

1. **Limpe o localStorage:**
   - No `/admin`, clique no botão **"Reset"**
   - Ou no console: `localStorage.clear()`
   - Recarregue a página (F5)

2. **Verifique o console:**
   - Veja se há erros
   - Confira quantas lojas foram carregadas

3. **Verifique o login:**
   - Admin (`josetecnico21@gmail.com`) vê TODAS as lojas
   - Lojista vê APENAS lojas com `owner_id === user.id`

4. **Use a página de debug:**
   - Acesse `/debug`
   - Veja os dados brutos do mock

### Estrutura de Pastas

```
src/
├── pages/
│   ├── AdminDashboard.tsx     ← NOVO (com debug info)
│   ├── DebugPage.tsx          ← NOVO (página de debug)
│   ├── Dashboard.tsx          ← Modificado
│   ├── StoreDashboard.tsx
│   └── Login.tsx              ← Modificado
├── services/
│   ├── api.ts                 ← Modificado (wait mock)
│   └── mockApi.ts             ← Modificado (logs)
├── contexts/
│   └── AuthContext.tsx        ← Modificado
└── data/
    └── mockData.ts            ← Modificado
```

## Segurança

⚠️ **Importante:** Este é um ambiente de desenvolvimento com dados mockados.

Em produção:
- Senhas devem ser hash (bcrypt)
- Tokens JWT devem ser validados no backend
- Roles devem ser verificadas no servidor
- Endpoints de admin devem ter middleware de autorização

## Próximos Passos (Sugestões)

1. **Backend:** Implementar endpoints reais para:
   - `GET /api/stores/all` (admin)
   - `PATCH /api/stores/:id/activate`
   - `DELETE /api/stores/:id`

2. **Middleware:** Criar middleware `isAdmin` no backend

3. **UI:** Adicionar badge "Admin" no header do painel administrativo

4. **Logs:** Registrar ações de administração (auditoria)
