# 🔐 Sistema de Autenticação por Loja

## ✅ Mudança Implementada

Agora cada dono de loja tem seu **próprio usuário e senha**, e acessa **apenas sua loja** no dashboard.

---

## 🆕 O Que Mudou

### 1. Formulário de Criação de Loja

Ao clicar em **"Nova Loja"** no dashboard, agora é necessário preencher:

#### 🏪 Dados da Loja
- Nome da Loja
- URL (slug)
- Descrição
- WhatsApp
- Cor Principal

#### 🔐 Dados de Acesso (NOVO!)
- **E-mail** - Usado para login
- **Senha** - Mínimo 6 caracteres
- **Confirmar Senha** - Validação de senha

### 2. Criação Automática de Usuário

Quando uma loja é criada:
1. **Primeiro**: Cria um usuário no sistema
2. **Segundo**: Cria a loja associada ao usuário
3. **Terceiro**: A loja só pode ser acessada pelo dono (owner_id)

### 3. Filtragem no Dashboard

O dashboard agora filtra as lojas:
```typescript
// Apenas lojas do usuário logado
const userStores = data.filter(store => store.owner_id === user?.id);
```

---

## 🎯 Como Usar

### Criar Nova Loja

1. Acesse `/dashboard`
2. Faça login (ou crie uma conta primeiro)
3. Clique em **"Nova Loja"**
4. Preencha TODOS os campos:

**Dados da Loja:**
```
Nome: Açaí Delícia
URL: acai-delicia
WhatsApp: (11) 99999-9999
Cor: #EC4899
```

**Dados de Acesso:**
```
E-mail: joao@acaidelicia.com
Senha: 123456
Confirmar Senha: 123456
```

5. Clique em **"Criar Loja"**
6. Pronto! Agora use o e-mail e senha para acessar

---

## 🔐 Fluxo de Autenticação

### Cenário 1: Primeiro Acesso
```
1. Usuário clica em "Nova Loja"
2. Preenche dados da loja + e-mail/senha
3. Sistema cria usuário E loja
4. Usuário recebe mensagem de sucesso
5. Usuário faz login com e-mail/senha
6. Acessa APENAS sua loja
```

### Cenário 2: Usuário Já Existe
```
1. Usuário faz login em /login
2. É redirecionado para /dashboard
3. Vê APENAS suas lojas
4. Pode criar múltiplas lojas
```

---

## 📊 Estrutura de Dados

### Usuário (MockUser)
```typescript
{
  id: "mock-1234567890-abcdef",
  email: "joao@acaidelicia.com",
  name: "João Silva",
  password: "123456" // Em produção: hash
}
```

### Loja (MockStore)
```typescript
{
  id: "store-3",
  name: "Açaí Delícia",
  slug: "acai-delicia",
  owner_id: "mock-1234567890-abcdef", // 👈 Vínculo com usuário
  // ... outros campos
}
```

---

## 🛡️ Segurança Implementada

### Validações no Formulário

1. **Senhas devem coincidir**
   ```typescript
   if (formData.password !== formData.confirmPassword) {
     alert('As senhas não coincidem!');
     return;
   }
   ```

2. **Senha mínima de 6 caracteres**
   ```typescript
   if (formData.password.length < 6) {
     alert('A senha deve ter pelo menos 6 caracteres');
     return;
   }
   ```

3. **E-mail único**
   ```typescript
   const existingUser = mockUsers.find(u => u.email === email);
   if (existingUser) {
     throw new ApiError('Este email já está cadastrado', 409);
   }
   ```

4. **Filtro por owner_id**
   ```typescript
   // Dashboard mostra apenas lojas do usuário
   const userStores = stores.filter(s => s.owner_id === user.id);
   ```

---

## 🎨 UI/UX

### Mostrar/Ocultar Senha

Botão com ícone de **olho** para mostrar/ocultar senha:

```tsx
<Button onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <EyeOff /> : <Eye />}
</Button>
```

### Divisão Visual

Formulário dividido em seções:
- 🏪 **Dados da Loja** (roxo)
- 🔐 **Dados de Acesso** (roxo)

### Dialog Responsivo

- Largura: 550px (aumentado de 500px)
- Altura máxima: 90vh
- Scroll automático se necessário

---

## 📝 Exemplo de Uso

### Criar Loja do Zero

```typescript
// 1. Usuário clica em "Nova Loja"
// 2. Preenche formulário:
{
  name: "Açaí Tropical",
  slug: "acai-tropical",
  whatsapp: "(11) 98888-7777",
  email: "maria@acaitropical.com",
  password: "senha123",
  confirmPassword: "senha123"
}

// 3. Ao enviar:
// - Cria usuário: maria@acaitropical.com
// - Cria loja: owner_id = ID do usuário criado
// - Redireciona para login
```

### Fazer Login

```typescript
// 1. Acessa /login
// 2. Digita:
Email: maria@acaitropical.com
Senha: senha123

// 3. Sistema autentica
// 4. Redireciona para /dashboard
// 5. Dashboard filtra: lojas onde owner_id = ID de Maria
// 6. Maria vê APENAS "Açaí Tropical"
```

---

## 🔄 Múltiplas Lojas por Usuário

Um usuário pode ter **várias lojas**:

```typescript
Usuário: joao@acaidelicia.com
├── Loja 1: Açaí Delícia (Centro)
├── Loja 2: Açaí Delícia (Shopping)
└── Loja 3: Açaí Delícia (Praia)
```

Todas aparecerão no dashboard dele!

---

## ⚠️ Importante: Modo Mock

No **modo mock** (atual):
- Usuários são salvos em memória
- Dados persistem enquanto a página não recarrega
- Ideal para testes

Na **produção** (com backend):
- Usuários serão salvos no banco de dados
- Senhas terão hash (bcrypt)
- Autenticação com JWT
- Sessão persistente

---

## 🧪 Testando

### Teste 1: Criar Loja Nova

1. Acesse `/dashboard`
2. Clique em **"Nova Loja"**
3. Preencha todos os campos
4. Anote e-mail e senha
5. Clique em **"Criar Loja"**
6. Faça logout
7. Faça login com e-mail/senha
8. Verifique que vê apenas SUA loja

### Teste 2: Múltiplos Usuários

1. Crie loja 1: `loja1@teste.com` / `senha123`
2. Faça logout
3. Crie loja 2: `loja2@teste.com` / `senha123`
4. Faça logout
5. Login com `loja1@teste.com` → vê apenas loja 1
6. Login com `loja2@teste.com` → vê apenas loja 2

---

## 📁 Arquivos Modificados

### 1. `src/components/CreateStoreDialog.tsx`
**Mudanças:**
- Adicionados campos: email, password, confirmPassword
- Validação de senhas
- Botão mostrar/ocultar senha
- Cria usuário antes de criar loja
- Mensagem de sucesso

### 2. `src/pages/Dashboard.tsx`
**Mudanças:**
- Filtra lojas por `owner_id === user?.id`
- Cada usuário vê apenas suas lojas

### 3. `src/services/mockApi.ts`
**Sem mudanças** - Já suporta registro de usuários

---

## ✅ Checklist

- [x] Campos de e-mail e senha no formulário
- [x] Validação de senhas iguais
- [x] Validação de senha mínima (6 caracteres)
- [x] Botão mostrar/ocultar senha
- [x] Cria usuário antes da loja
- [x] Vínculo owner_id na loja
- [x] Filtro no dashboard por usuário
- [x] Mensagem de sucesso
- [x] Build sem erros
- [x] TypeScript sem erros

---

## 🎉 Resultado

Agora o sistema tem **autenticação por loja**!

Cada dono de loja:
- ✅ Tem seu próprio usuário e senha
- ✅ Acessa apenas SUAS lojas
- ✅ Não vê lojas de outros usuários
- ✅ Pode ter múltiplas lojas
- ✅ Gerencia apenas o que lhe pertence

**Status:** ✅ Implementado e Funcional
