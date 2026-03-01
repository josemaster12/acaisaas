# 🚀 Guia Rápido - Frontend Pronto Açaí Now

## ✅ Configuração Atual

Seu frontend está **100% funcional** sem necessidade de backend!

### Arquivos Criados/Modificados

```
src/
├── config.ts                          ✨ NOVO - Configurações do modo mock
├── data/
│   ├── mockData.ts                    ✨ NOVO - Dados mockados completos
│   └── store.ts                       ✏️ ATUALIZADO - Usa mockData
├── services/
│   ├── api.ts                         ✏️ ATUALIZADO - Suporta modo mock
│   └── mockApi.ts                     ✨ NOVO - APIs mockadas
├── components/
│   └── MockModeBanner.tsx             ✨ NOVO - Banner modo mock
└── App.tsx                            ✏️ ATUALIZADO - Inclui banner
```

## 🎯 Como Usar

### 1. Rodar o Projeto

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### 2. Login de Teste

Use as credenciais mockadas:

```
Email: admin@prontoacai.com
Senha: 123456
```

### 3. Navegar pelo Sistema

**Como Cliente:**
- Página inicial: `/`
- Cardápio: `/cardapio`
- Carrinho: `/carrinho`

**Como Dono de Loja:**
- Dashboard: `/dashboard`
- Gerenciar Loja: `/dashboard/loja/store-1`

## 📋 Dados Mockados Incluídos

### Produtos (9 itens)
- Açaí Puro
- Açaí Tradicional
- Açaí com Morango
- Açaí Mix Frutas
- Açaí Nutella
- Açaí Ninho
- Açaí Tropical
- Combo Casal
- Combo Família

### Lojas (2 itens)
- Açaí Express
- Açaí & Cia

### Pedidos (3 itens)
- Pedido em preparo
- Pedido pendente
- Pedido entregue

### Planos (3 itens)
- Gratuito
- Profissional (R$ 49,90)
- Premium (R$ 99,90)

## 🧪 Recursos do Modo Mock

### O Que Funciona

✅ Login/Cadastro
✅ Visualizar produtos
✅ Adicionar ao carrinho
✅ Finalizar pedido (WhatsApp)
✅ Dashboard administrativo
✅ CRUD de produtos
✅ CRUD de pedidos
✅ CRUD de lojas
✅ Upload de imagens (simulado)
✅ Persistência no localStorage

### Limitações

⚠️ Dados resetam ao recarregar (exceto localStorage)
⚠️ Sem validação real de autenticação
⚠️ Imagens são URLs temporários
⚠️ Sem integração com banco de dados

## 🔄 Alternar Entre Mock e API Real

### Usar Mock (Padrão)

Em `src/services/api.ts`:
```typescript
const USE_MOCK_API = true;
```

### Usar API Real

1. Em `src/services/api.ts`:
   ```typescript
   const USE_MOCK_API = false;
   ```

2. Configure `.env`:
   ```env
   VITE_API_URL=http://localhost:3333
   ```

3. Inicie o backend

## 📱 Testando o Sistema

### Fluxo do Cliente

1. Acesse `/`
2. Clique em "Fazer Pedido"
3. Escolha um produto
4. Selecione tamanho e adicionais
5. Adicione ao carrinho
6. Vá para `/carrinho`
7. Preencha dados de entrega
8. Finalize via WhatsApp

### Fluxo do Dono de Loja

1. Acesse `/login`
2. Login: `admin@prontoacai.com`
3. Senha: `123456`
4. Acesse o dashboard
5. Gerencie produtos/pedidos

## 🎨 Personalização

### Mudar Cor Principal

Edite `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#8B5CF6', // Sua cor
  }
}
```

### Adicionar Produtos

Edite `src/data/mockData.ts`:
```typescript
export const mockProducts: Product[] = [
  ...mockProducts,
  {
    id: 'novo-produto',
    name: 'Nome do Produto',
    // ... resto dos dados
  }
];
```

## 📞 Próximos Passos

### Frontend (Opcional)
- [ ] Melhorar validações de formulário
- [ ] Adicionar mais animações
- [ ] Implementar busca de CEP
- [ ] Criar mais temas de cores

### Backend (Quando Pronto)
1. Configure Supabase
2. Altere `USE_MOCK_API = false`
3. Inicie backend na porta 3333
4. Ajuste `.env` com URLs reais

## ✨ Dica Pro

O banner amarelo no topo indica que está em modo mock. Clique no X para fechar temporariamente.

---

**Frontend pronto para uso! 🎉**
