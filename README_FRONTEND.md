# 🍧 Pronto Açaí Now - Frontend Mockado

Este projeto está configurado para rodar **100% no frontend** usando dados mockados, sem necessidade de backend ou banco de dados.

## 🚀 Como Rodar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Rodar em Modo Desenvolvimento

```bash
npm run dev
```

O frontend rodará em `http://localhost:5173`

## 🧪 Modo Mock

O sistema está configurado para usar dados mockados automaticamente. Isso significa que:

- ✅ **Não precisa de backend** rodando
- ✅ **Não precisa de banco de dados**
- ✅ **Não precisa configurar Supabase**
- ✅ Todos os dados são salvos no navegador (localStorage)

### Dados de Teste

Use estas credenciais para login:

```
Email: admin@prontoacai.com
Senha: 123456
```

## 📁 Estrutura de Arquivos Mockados

```
src/
├── config.ts                    # Configurações do modo mock
├── data/
│   ├── mockData.ts              # Dados mockados (produtos, lojas, pedidos, etc.)
│   └── store.ts                 # Configuração da loja (usa mockData)
├── services/
│   ├── api.ts                   # Serviço de API (suporta modo mock)
│   └── mockApi.ts               # Implementação mockada de todas as APIs
└── ...
```

## 🔄 Como Funciona o Modo Mock

### 1. Configuração

No arquivo `src/services/api.ts`:

```typescript
const USE_MOCK_API = true; // Defina como false para usar API real
```

### 2. Dados Mockados

O arquivo `src/data/mockData.ts` contém:

- **Produtos**: 9 produtos de açaí com tamanhos e preços
- **Lojas**: 2 lojas de exemplo
- **Usuários**: 2 usuários para teste de login
- **Pedidos**: 3 pedidos de exemplo com diferentes status
- **Planos**: 3 planos SaaS (Gratuito, Profissional, Premium)
- **Categorias e Toppings**: Todos os adicionais e categorias

### 3. APIs Mockadas

O arquivo `src/services/mockApi.ts` simula todas as chamadas de API:

- `authAPI` - Login, registro, perfil
- `storesAPI` - CRUD de lojas
- `productsAPI` - CRUD de produtos
- `ordersAPI` - CRUD de pedidos
- `categoriesAPI` - CRUD de categorias
- `addonsAPI` - CRUD de adicionais
- `subscriptionsAPI` - Planos e assinaturas
- `analyticsAPI` - Dashboard e analytics
- `uploadAPI` - Upload de imagens

## 📱 Rotas Disponíveis

### Rotas Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial |
| `/cardapio` | Cardápio completo |
| `/carrinho` | Carrinho de compras |
| `/checkout` | Finalização do pedido |
| `/loja/:slug` | Página pública da loja |

### Autenticação

| Rota | Descrição |
|------|-----------|
| `/login` | Login do dono da loja |
| `/cadastro` | Cadastro de nova conta |

### Dashboard (Protegido)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Visão geral das lojas |
| `/dashboard/loja/:storeId` | Dashboard da loja específica |

## 🛠️ Funcionalidades do Frontend

### Para Clientes

- ✅ Visualizar cardápio completo
- ✅ Filtrar por categorias
- ✅ Buscar produtos
- ✅ Montar açaí personalizado (tamanhos + adicionais)
- ✅ Carrinho de compras
- ✅ Cupons de desconto (ACAI10, PRIMEIRA)
- ✅ Finalizar pedido via WhatsApp
- ✅ Persistência no localStorage

### Para Donos de Loja

- ✅ Dashboard com estatísticas
- ✅ Gerenciar produtos (CRUD completo)
- ✅ Gerenciar pedidos (atualizar status)
- ✅ Configurações da loja
- ✅ Upload de imagens (simulado)
- ✅ Múltiplas lojas

## 🎨 Personalização

### Alterar Cores

Edite `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#8B5CF6', // Cor principal
      }
    }
  }
}
```

### Alterar Dados Mockados

Edite `src/data/mockData.ts`:

```typescript
export const mockProducts: Product[] = [
  // Adicione, edite ou remova produtos
];

export const mockStores: MockStore[] = [
  // Adicione, edite ou remova lojas
];
```

## 🔄 Migrando para Backend Real

Quando quiser conectar com um backend real:

1. No arquivo `src/services/api.ts`, altere:
   ```typescript
   const USE_MOCK_API = false;
   ```

2. Configure as variáveis de ambiente no `.env`:
   ```env
   VITE_API_URL=http://localhost:3333
   ```

3. Certifique-se de que o backend está rodando na porta especificada

## 📝 Observações

- Os dados mockados são **resetados** quando a página é recarregada (exceto localStorage)
- Upload de imagens retorna URLs temporárias do navegador
- Não há validação de autenticação real (qualquer senha funciona para usuários mockados)
- Pedidos criados ficam salvos no localStorage

## 🎯 Próximos Passos (Frontend)

- [ ] Melhorar formulário de checkout
- [ ] Adicionar mais validações
- [ ] Implementar busca de CEP
- [ ] Adicionar mais animações
- [ ] Melhorar responsividade mobile
- [ ] Implementar PWA (instalável)

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Feito com ❤️ para desenvolvimento frontend!** 🍧
