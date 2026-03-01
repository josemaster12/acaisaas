# 🚨 URGENTE: Configurar Variáveis de Ambiente na Vercel

## Problema Identificado

O site está mostrando o erro:
```
❌ Supabase URL ou chave não configuradas!
Uncaught Error: supabaseUrl is required.
```

**Causa:** As variáveis de ambiente do Supabase não estão configuradas na Vercel.

---

## ✅ Como Resolver (Passo a Passo)

### Opção 1: Dashboard da Vercel (Recomendado)

1. **Acesse o projeto na Vercel:**
   - https://vercel.com/josetecnico21-1660s-projects/pronto-acai-now-main/settings/environment-variables

2. **Adicione as seguintes variáveis:**

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://fwtvjjejycorwukqzwjc.supabase.co` |
| `VITE_SUPABASE_PROJECT_ID` | `fwtvjjejycorwukqzwjc` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT` |
| `VITE_USE_MOCK` | `false` |

3. **Clique em "Save"**

4. **Faça um novo deploy:**
   - Vá em "Deployments"
   - Clique nos "..." no deployment mais recente
   - Selecione "Redeploy"

---

### Opção 2: Via CLI (Alternativo)

```bash
# Acesse o diretório do projeto
cd C:\Users\joset\.kiro\pronto-acai-now-main

# Adicione cada variável (será solicitado confirmação)
vercel env add VITE_SUPABASE_URL https://fwtvjjejycorwukqzwjc.supabase.co production
vercel env add VITE_SUPABASE_PROJECT_ID fwtvjjejycorwukqzwjc production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT production
vercel env add VITE_USE_MOCK false production

# Faça o deploy
vercel deploy --prod --yes
```

---

## 🔍 Como Verificar se Funcionou

1. **Abra o site:** https://acaisaas3.vercel.app/cadastro-lojista

2. **Abra o console do navegador (F12)**

3. **Procure por:**
   ```
   ✅ Supabase conectado!
   [API] supabaseAuth: true
   [API] supabaseServices: true
   ```

4. **Se aparecer isso, está funcionando!**

5. **Teste o cadastro:**
   - Preencha o formulário
   - Clique em "Criar Conta de Lojista"
   - Deve funcionar sem erros

---

## 📝 Valores das Variáveis

```
VITE_SUPABASE_URL=https://fwtvjjejycorwukqzwjc.supabase.co
VITE_SUPABASE_PROJECT_ID=fwtvjjejycorwukqzwjc
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_3n4Wpi8weGF4-OFVC81e3A_pvQC9-uT
VITE_USE_MOCK=false
```

---

## ⚠️ Importante

- **NÃO commitar o arquivo `.env`** no GitHub (já está no `.gitignore`)
- As variáveis `VITE_` são expostas no navegador (isso é normal para Vite)
- A chave publishable é segura para uso no frontend

---

## 🆘 Se Ainda Der Erro

1. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
2. **Faça hard reload** (Ctrl+F5)
3. **Verifique se todas as 4 variáveis estão configuradas**
4. **Confirme que o deploy foi refeito após adicionar as variáveis**

---

**Data:** 2026-03-01
**Status:** Aguardando configuração na Vercel
