# 🚀 Guia de Deploy na Vercel

Este guia explica como fazer deploy do **Pronto Açaí Now** na Vercel.

## 📋 Pré-requisitos

- Conta na Vercel (https://vercel.com)
- Projeto no Supabase configurado
- Repositório no GitHub

## 🎯 Passo a Passo

### 1. Preparar o Projeto

```bash
# Certifique-se de que tudo está funcionando localmente
npm run build

# O build deve gerar a pasta dist sem erros
```

### 2. Configurar Variáveis de Ambiente no Supabase

No dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Project ID** → `VITE_SUPABASE_PROJECT_ID`

### 3. Executar Script SQL no Supabase

No **SQL Editor** do Supabase, execute o arquivo:
```sql
supabase-schema.sql
```

E também o script de correção do trigger:
```sql
fix-trigger-final.sql
```

### 4. Fazer Deploy na Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione o repositório `acaisaas`
4. Em **"Environment Variables"**, adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PROJECT_ID` | `xxxxx` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_xxxxx` |
| `VITE_USE_MOCK` | `false` |

5. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Configure as variáveis de ambiente quando solicitado
```

### 5. Configurar Domínio (Opcional)

No dashboard da Vercel:
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme instruções

## 🔧 Configurações do Projeto

O arquivo `vercel.json` já está configurado com:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Rewrites para SPA (Single Page Application)
- ✅ Headers de segurança
- ✅ Cache para assets estáticos

## 🧪 Testar o Deploy

Após o deploy:
1. Acesse a URL fornecida pela Vercel (ex: `https://acaisaas.vercel.app`)
2. Teste o cadastro de uma loja
3. Verifique se os dados estão sendo salvos no Supabase

## 🐛 Solução de Problemas

### Build falha na Vercel

```bash
# Teste o build localmente
npm run build

# Verifique erros de TypeScript
npx tsc --noEmit
```

### Erro de conexão com Supabase

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está público
- Execute os scripts SQL no Supabase

### Erro "Database error saving new user"

Execute no Supabase SQL Editor:
```sql
-- Script de correção do trigger
fix-trigger-final.sql
```

## 📊 Monitoramento

Após o deploy:
- **Vercel Dashboard**: Monitora builds e deployments
- **Supabase Dashboard**: Monitora banco de dados e autenticação
- **Logs**: `vercel logs` (via CLI)

## 🔄 Atualizar o Deploy

Sempre que fizer push no GitHub:
```bash
git add .
git commit -m "feat: sua mudança"
git push origin main

# A Vercel fará deploy automaticamente
```

## 🌐 URLs Importantes

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs

## 📝 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `VITE_SUPABASE_PROJECT_ID` | ID do projeto | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública | ✅ |
| `VITE_USE_MOCK` | Usar dados mockados | ❌ |
| `VITE_API_URL` | URL do backend (se houver) | ❌ |

## 🎉 Pronto!

Seu projeto está no ar! 🍧

---

**Dica**: Para produção, mantenha `VITE_USE_MOCK=false` para usar o Supabase real.
