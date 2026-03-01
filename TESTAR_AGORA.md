# 🎉 Frontend Pronto para Testes!

## ✅ Status: 100% Funcional

O **Pronto Açaí Now** está configurado para rodar **sem backend** usando dados mockados.

---

## 🚀 Servidor de Desenvolvimento

O servidor está rodando em:
**http://localhost:5173**

Se não estiver rodando, execute:
```bash
npm run dev
```

---

## 🧪 Testando o Sistema

### 1️⃣ Como Cliente

1. Acesse: `http://localhost:5173/`
2. Clique em **"Fazer Pedido"**
3. Escolha um produto (ex: Açaí com Morango)
4. Selecione:
   - Tamanho (P, M, G, GG)
   - Adicionais gratuitos (até 3)
   - Adicionais pagos (opcional)
5. Clique em **"Adicionar ao Carrinho"**
6. Clique no carrinho flutuante
7. Preencha seus dados:
   - Nome
   - Telefone
   - Endereço
   - Forma de pagamento
8. (Opcional) Use cupom: `ACAI10` ou `PRIMEIRA`
9. Clique em **"Finalizar Pedido"**
10. Será redirecionado para o WhatsApp com o pedido formatado

### 2️⃣ Como Dono de Loja

1. Acesse: `http://localhost:5173/login`
2. Use as credenciais:
   ```
   Email: admin@prontoacai.com
   Senha: 123456
   ```
3. Você verá o **Dashboard** com:
   - Suas lojas
   - Estatísticas
4. Clique em uma loja para gerenciar:
   - **Produtos**: Criar, editar, excluir
   - **Pedidos**: Ver e atualizar status
   - **Configurações**: Editar dados da loja

---

## 📱 Páginas para Testar

### Públicas
- `/` - Página inicial
- `/cardapio` - Cardápio completo
- `/carrinho` - Carrinho de compras
- `/checkout` - Finalização
- `/loja/acai-express` - Página da loja (substitua o slug)

### Autenticação
- `/login` - Login
- `/cadastro` - Cadastro

### Dashboard (Protegido)
- `/dashboard` - Visão geral
- `/dashboard/loja/store-1` - Gerenciar loja

---

## 🎯 Funcionalidades para Testar

### ✅ Cliente
- [x] Visualizar produtos
- [x] Filtrar por categoria
- [x] Buscar produtos
- [x] Selecionar tamanho
- [x] Adicionar toppings
- [x] Carrinho persistente
- [x] Cupons de desconto
- [x] Dados de entrega
- [x] Finalizar no WhatsApp

### ✅ Dono de Loja
- [x] Login/Cadastro
- [x] Dashboard com stats
- [x] Criar loja
- [x] Criar produto
- [x] Editar produto
- [x] Excluir produto
- [x] Ver pedidos
- [x] Atualizar status do pedido
- [x] Configurar loja
- [x] Upload de imagem (simulado)

---

## 🔧 Dados Mockados

### Produtos Disponíveis
1. Açaí Puro
2. Açaí Tradicional
3. Açaí com Morango
4. Açaí Mix Frutas
5. Açaí Nutella
6. Açaí Ninho
7. Açaí Tropical
8. Combo Casal
9. Combo Família

### Cupons Válidos
- `ACAI10` - 10% de desconto
- `PRIMEIRA` - 15% de desconto

### Lojas de Exemplo
- **Açaí Express** (ID: store-1)
- **Açaí & Cia** (ID: store-2)

---

## 🐛 Problemas Comuns

### "Erro ao carregar dados"
- Verifique se o servidor está rodando
- Olhe o console do navegador (F12)

### "Login não funciona"
- Use as credenciais mockadas: `admin@prontoacai.com` / `123456`
- Limpe o localStorage: `localStorage.clear()`

### "Imagens não aparecem"
- As imagens são carregadas localmente
- Verifique se os arquivos existem em `src/assets/`

---

## 📝 Dicas de Teste

### Teste Rápido (2 minutos)
1. Acesse `/`
2. Adicione 1 produto ao carrinho
3. Finalize no WhatsApp

### Teste Completo (10 minutos)
1. Faça login
2. Crie uma loja
3. Adicione um produto
4. Faça logout
5. Acesse a loja como cliente
6. Faça um pedido

### Teste de Persistência
1. Adicione itens ao carrinho
2. Recarregue a página (F5)
3. Os itens ainda estarão no carrinho!

---

## 🎨 Personalização

### Mudar Cor Principal
Edite `tailwind.config.ts`:
```typescript
primary: {
  DEFAULT: '#8B5CF6', // Sua cor aqui
}
```

### Adicionar Produto
Edite `src/data/mockData.ts`:
```typescript
export const mockProducts: Product[] = [
  ...mockProducts,
  {
    id: 'novo-produto',
    name: 'Seu Produto',
    // ...
  }
];
```

---

## 📞 Precisa de Ajuda?

1. **Documentação Completa**: `README_FRONTEND.md`
2. **Guia Rápido**: `GUIA_RAPIDO.md`
3. **Resumo das Mudanças**: `MUDANCAS_RESUMO.md`

---

## 🔄 Próximo: Conectar com Backend

Quando estiver pronto:

1. Configure o backend
2. Em `src/services/api.ts`, altere:
   ```typescript
   const USE_MOCK_API = false;
   ```
3. Configure `.env` com `VITE_API_URL`
4. Reinicie o servidor

---

## ✨ Banner de Modo Mock

Você verá um banner amarelo no topo indicando que está em modo mock.
- Clique no **X** para fechar temporariamente
- Ele some automaticamente após fechar

---

**Divirta-se testando! 🎉🍧**

**Status:** ✅ Tudo funcionando
**Build:** ✅ Sem erros
**TypeScript:** ✅ Sem erros
**Servidor:** 🟢 Rodando
